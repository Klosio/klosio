import { NextFunction, Request, Response } from "express"
import { z } from "zod"
import { organizationRepository } from "~/repository/organizationRepository"
import CustomError from "~/types/CustomError"

const emailManagementFormSchema = z.object({
    domain: z
        .string()
        .nonempty("The domain is required")
        .regex(
            new RegExp(
                /^(?!-)[A-Za-z0-9-]+([\-\.]{1}[a-z0-9]+)*\.[A-Za-z]{2,6}$/
            ),
            "The domain is invalid"
        )
})

type EmailManagementForm = z.infer<typeof emailManagementFormSchema>

async function PostDomainRequestHandler(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
) {
    const { id } = req.params

    if (!id) {
        res.status(400)
        return next({
            code: "MISSING_PARAMETER",
            message: "Id param not found"
        } as CustomError)
    }

    const { domain } = req.body as EmailManagementForm

    if (!domain) {
        res.status(400)
        return next({
            code: "MISSING_PARAMETER",
            message: "Domain is required"
        } as CustomError)
    }

    const test = emailManagementFormSchema.safeParse({ domain })

    if (!test.success) {
        console.error(test.error.message)
        return next({
            code: "INVALID_FORMAT",
            message: "Invalid format."
        } as CustomError)
    }

    try {
        const organization = await organizationRepository.find(id)
        await organizationRepository.saveDomain(organization, domain)
        return res.status(204).send()
    } catch (err) {
        next(err)
    }
}

export default PostDomainRequestHandler
