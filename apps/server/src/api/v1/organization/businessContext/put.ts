import { NextFunction, Request, Response } from "express"
import { businessContextRepository } from "~/repository/businessContextRepository"
import BusinessContext from "~/types/BusinessContext"
import CustomError from "~/types/CustomError"
import { businessContextSchema } from "~/validation/businessContext.schema"

async function PutBusinessContextRequestHandler(
    req: Request<{ id: string; businessContextId: string }>,
    res: Response,
    next: NextFunction
) {
    const organizationId = req.params.id
    const businessContextId = req.params.businessContextId

    if (!organizationId || !businessContextId) {
        res.status(400)
        return next({
            code: "MISSING_PARAMETER",
            message: "Organization or business context param not found"
        } as CustomError)
    }

    const businessContext: BusinessContext = {
        organization_id: organizationId,
        id: businessContextId,
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
        const updatedBusinessContext = await businessContextRepository.update(
            businessContext
        )
        return res.status(200).json(updatedBusinessContext)
    } catch (error) {
        res.status(500)
        return next(error)
    }
}

export default PutBusinessContextRequestHandler
