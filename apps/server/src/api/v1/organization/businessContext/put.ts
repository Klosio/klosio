import { NextFunction, Request, Response } from "express"
import { businessContextRepository } from "~/repository/businessContextRepository"
import BusinessContext from "~/types/BusinessContext"
import { businessContextSchema } from "~/validation/businessContext.schema"

async function PutBusinessContextRequestHandler(
    req: Request<{ id: string; businessContextId: string }>,
    res: Response,
    next: NextFunction
) {
    const organizationId = req.params.id
    const businessContextId = req.params.businessContextId

    if (!organizationId || !businessContextId) {
        res.status(404)
        return next(
            new Error("Organization or business context param not found")
        )
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
        return next(new Error("Data is not correctly formatted"))
    }

    try {
        const updatedBusinessContext = await businessContextRepository.update(
            businessContext
        )
        return res.status(200).json(updatedBusinessContext)
    } catch (err) {
        console.error(err)
        res.status(500)
        return next(err)
    }
}

export default PutBusinessContextRequestHandler
