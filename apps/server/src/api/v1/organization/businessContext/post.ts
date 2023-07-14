import { NextFunction, Request, Response } from "express"
import { businessContextRepository } from "~/repository/businessContextRepository"
import BusinessContext from "~/types/BusinessContext"
import CustomError from "~/types/CustomError"
import { businessContextSchema } from "~/validation/businessContext.schema"

async function PostBusinessContextRequestHandler(
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

    const businessContext: Omit<BusinessContext, "id"> = {
        organization_id: organizationId,
        ...req.body
    }

    const verify = businessContextSchema.safeParse(businessContext)

    if (!verify.success) {
        console.error(verify.error)
        res.status(400)
        return next({
            code: "INVALID_FORMAT",
            message: "Data is not correctly formatted"
        } as CustomError)
    }

    try {
        const createdBusinessContext = await businessContextRepository.create(
            businessContext
        )
        return res.status(201).json(createdBusinessContext)
    } catch (error) {
        res.status(500)
        return next(error)
    }
}

export default PostBusinessContextRequestHandler
