import { NextFunction, Request, Response } from "express"
import { z } from "zod"
import { organizationRepository } from "~/repository/organizationRepository"

const emailManagementFormSchema = z.object({
    domain: z
        .string()
        .regex(
            new RegExp(
                /^(?!-)[A-Za-z0-9-]+([\-\.]{1}[a-z0-9]+)*\.[A-Za-z]{2,6}$/
            ),
            "The domain is invalid"
        )
        .nonempty("The domain is required")
})

type EmailManagementForm = z.infer<typeof emailManagementFormSchema>

async function PostDomainRequestHandler(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
) {
    const { id } = req.params

    if (!id) {
        res.status(400).json({ message: "Id is required" })
        return
    }

    const { domain } = req.body as EmailManagementForm

    if (!domain) {
        res.status(400).json({ message: "Domain is required" })
        return
    }

    const test = emailManagementFormSchema.safeParse({ domain })

    if (!test.success) {
        res.status(400).json({ message: test.error.message })
        return
    }

    console.log(test)

    try {
        const organization = await organizationRepository.find(id)
        await organizationRepository.saveDomain(organization, domain)
        return res.status(204).send()
    } catch (err) {
        next(err)
    }
}

export default PostDomainRequestHandler
