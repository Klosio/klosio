import { NextFunction, Request, Response } from "express"
import { businessContextRepository } from "~/repository/businessContextRepository"
import { painpointRepository } from "~/repository/painpointRepository"
import CustomError from "~/types/CustomError"

async function GetReadyRequestHandler(
    req: Request,
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
        let ready = false

        const isPainpoitsFilled = await painpointRepository.exists(
            organizationId
        )

        if (isPainpoitsFilled) {
            const isBusinessContextFilled =
                await businessContextRepository.exists(organizationId)
            ready = isPainpoitsFilled && isBusinessContextFilled
        }

        return res.status(200).json({ ready })
    } catch (error) {
        res.status(500)
        return next(error)
    }
}

export default GetReadyRequestHandler
