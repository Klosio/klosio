import { NextFunction, Request, Response } from "express"
import { businessContextRepository } from "~/repository/businessContextRepository"
import { painpointRepository } from "~/repository/painpointRepository"

async function GetReadyRequestHandler(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const organizationId = req.params.id

    if (!organizationId) {
        res.status(404)
        return next(new Error("Organization param not found"))
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
    } catch (err) {
        console.error(err)
        res.status(500)
        return next(err)
    }
}

export default GetReadyRequestHandler
