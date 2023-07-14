import { NextFunction, Request, Response } from "express"
import { parse } from "papaparse"
import { z } from "zod"
import { Painpoints } from "~/constants/painpoints"
import { painpointRepository } from "~/repository/painpointRepository"
import CustomError from "~/types/CustomError"
import { generateEmbeddings } from "~/util/embeddings"

async function PostPainpointsRequestHandler(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
) {
    const organizationId = req.params.id

    if (!organizationId) {
        res.status(400)
        return next({
            code: "MISSING_PARAMETER",
            message: "Organization param not found"
        } as CustomError)
    }
    if (!req.file) {
        res.status(400)
        return next({
            code: "MISSING_PARAMETER",
            message: "No file uploaded"
        } as CustomError)
    }

    if (!(req.file.originalname.split(".").pop() === "csv")) {
        res.status(400)
        return next({
            code: "INVALID_EXTENSION",
            message: "Invalid file extension"
        } as CustomError)
    }

    const parsedFile = parse(req.file.buffer.toString(), { header: true })

    if (!parsedFile.data) {
        res.status(400)
        return next({
            code: "EMPTY_FILE",
            message: "File is empty"
        } as CustomError)
    }

    if (
        !(parsedFile.meta.fields?.[0] === "painpoint") &&
        !(parsedFile.meta.fields?.[1] === "answer")
    ) {
        res.status(400)
        return next({
            code: "INCORRECT_TEMPLATE",
            message:
                "Incorrect template: column headers 'painpoint' and 'answer' not found"
        } as CustomError)
    }

    const painpointSchema = z.object({
        painpoint: z
            .string()
            .min(1, "Painpoint should be more than 1 character")
            .max(
                Painpoints.MAX_PROBLEM_SIZE,
                `Painpoint must be less than ${Painpoints.MAX_PROBLEM_SIZE} characters`
            ),
        answer: z
            .string()
            .min(1, "Answer should be more than 1 character")
            .max(
                Painpoints.MAX_ANSWER_SIZE,
                `Answer must be less than ${Painpoints.MAX_ANSWER_SIZE} characters`
            )
    })

    const data = parsedFile.data as z.infer<typeof painpointSchema>[]

    const verify = z.array(painpointSchema).min(1).max(100).safeParse(data)

    if (!verify.success) {
        console.error(verify.error)
        res.status(400)
        return next({
            code: "INVALID_FORMAT",
            message: "File is not formatted correctly"
        } as CustomError)
    }

    const embeddings = await generateEmbeddings(data, organizationId)

    try {
        await painpointRepository.deleteByOrganizationId(organizationId)
        await painpointRepository.create(embeddings)
    } catch (error) {
        res.status(500)
        return next(error)
    }

    return res.sendStatus(201)
}

export default PostPainpointsRequestHandler
