import Option from "../../../repository/Option"
import { NextFunction, Request, Response } from "express"

async function GetOptionRequestHandler(
    req: Request<{ name: string }>,
    res: Response,
    next: NextFunction
) {
    if (!req.params.name) {
        res.status(400)
        return next(new Error("No name specified for option"))
    }

    let option = await Option.findOne({ name: req.params.name }).exec()
    if (!option) {
        res.status(404)
        return next(new Error(`No option found with name ${req.params.name}`))
    }

    return res.status(200).json(option)
}

export default GetOptionRequestHandler
