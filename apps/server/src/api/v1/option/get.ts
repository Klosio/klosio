import { NextFunction, Request, Response } from "express"
import { optionRepository } from "~/repository/optionRepository"
import CustomError from "~/types/CustomError"

async function GetOptionRequestHandler(
    req: Request<{ name: string }>,
    res: Response,
    next: NextFunction
) {
    const { name } = req.params
    if (!name) {
        res.status(400)
        return next({
            code: "MISSING_PARAMETER",
            message: "No name specified for option"
        } as CustomError)
    }

    try {
        const option = await optionRepository.findByName(name)
        if (!option) {
            res.status(404)
            return next({
                code: "NOT_FOUND",
                message: `No option found with name ${name}`
            } as CustomError)
        }

        return res.status(200).json(option)
    } catch (error) {
        res.status(500)
        return next(error)
    }
}

export default GetOptionRequestHandler
