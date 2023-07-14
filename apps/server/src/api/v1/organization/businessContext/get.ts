import { NextFunction, Request, Response } from "express"
import { businessContextRepository } from "~/repository/businessContextRepository"
import CustomError from "~/types/CustomError"

async function GetBusinessContextRequestHandler(
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

    try {
        const businessContexts =
            await businessContextRepository.findByOrganization(organizationId)
        return res.status(200).json(businessContexts)
    } catch (error) {
        res.status(500)
        return next(error)
    }
}

export default GetBusinessContextRequestHandler
