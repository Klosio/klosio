import { painpointRepository } from "../../../../repository/painpointRepository"
import { generateEmbeddings } from "../../../../util/embeddings"
import { NextFunction, Request, Response } from "express"
import { parse } from "papaparse"
import { z } from "zod"

async function PostPainpointsRequestHandler(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
) {
    const organizationId = req.params.id

    if (!organizationId) {
        res.status(404)
        return next(new Error("Organization param not found"))
    }
    if (!req.file) {
        res.status(400)
        return next(new Error("No file uploaded"))
    }

    if (!(req.file.originalname.split(".").pop() === "csv")) {
        res.status(400)
        return next(new Error("File has not the correct extension"))
    }

    const parsedFile = parse(req.file.buffer.toString(), { header: true })

    if (!parsedFile.data) {
        res.status(400)
        return next(new Error("File is empty"))
    }

    if (
        !(parsedFile.meta.fields?.[0] === "painpoint") &&
        !(parsedFile.meta.fields?.[1] === "answer")
    ) {
        res.status(400)
        return next(new Error("File is not in the correct format"))
    }

    const painpointSchema = z.object({
        painpoint: z
            .string()
            .min(1, "Painpoint should be more than 1 character")
            .max(300, "Painpoint must be less than 300 characters"),
        answer: z
            .string()
            .min(1, "Answer should be more than 1 character")
            .max(300, "Answer must be less than 300 characters")
    })

    const data = parsedFile.data as z.infer<typeof painpointSchema>[]

    const verify = z.array(painpointSchema).min(1).max(100).safeParse(data)

    if (!verify.success) {
        console.error(verify.error)
        res.status(400)
        return next(new Error("File is not formatted correctly"))
    }

    const embeddings = await generateEmbeddings(data, organizationId)

    try {
        await painpointRepository.deleteByOrganizationId(organizationId)
        await painpointRepository.create(embeddings)
    } catch (err) {
        console.error(err)
        res.status(500)
        return next(err)
    }

    return res.sendStatus(201)
}

export default PostPainpointsRequestHandler
