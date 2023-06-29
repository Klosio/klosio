import { businessContextRepository } from "../../../../repository/businessContextRepository"
import { NextFunction, Request, Response } from "express"

async function GetBusinessContextRequestHandler(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
) {
    const organizationId = req.params.id

    if (!organizationId) {
        res.status(404)
        return next(new Error("Organization param not found"))
    }

    try {
        const businessContexts =
            await businessContextRepository.findByOrganization(organizationId)
        return res.status(200).json(businessContexts)
    } catch (err) {
        console.error(err)
        res.status(500)
        return next(err)
    }
}

export default GetBusinessContextRequestHandler
