import { businessContextRepository } from "../../../../repository/businessContextRepository"
import BusinessContext from "../../../../types/BusinessContext"
import { businessContextSchema } from "../../../../validation/businessContext.schema"
import { NextFunction, Request, Response } from "express"

async function PostBusinessContextRequestHandler(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
) {
    const organizationId = req.params.id

    if (!organizationId) {
        res.status(404)
        return next(new Error("Organization param not found"))
    }

    const businessContext: Omit<BusinessContext, "id"> = {
        organization_id: organizationId,
        ...req.body
    }

    const verify = businessContextSchema.safeParse(businessContext)

    if (!verify.success) {
        console.error(verify.error)
        res.status(400)
        return next(new Error("Data is not correctly formatted"))
    }

    try {
        const createdBusinessContext = await businessContextRepository.create(
            businessContext
        )
        return res.status(201).json(createdBusinessContext)
    } catch (err) {
        console.error(err)
        res.status(500)
        return next(err)
    }
}

export default PostBusinessContextRequestHandler
