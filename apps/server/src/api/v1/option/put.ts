import Option from "../../../model/Option"
import { NextFunction, Request, Response } from "express"

async function PutOptionRequestHandler(
    req: Request<{ name: string }>,
    res: Response,
    next: NextFunction
) {
    if (!req.params.name) {
        res.status(400)
        return next(new Error("No name specified for option"))
    }

    let existing = true
    let option = await Option.findOne({ name: req.params.name }).exec()
    if (!option) {
        existing = false
        option = new Option({
            name: req.params.name
        })
    }

    option.value = req.body.value

    try {
        await option.save()
    } catch (err) {
        console.log(err)
        res.status(500)
        return next(
            new Error(
                `Error when saving ${option.name} option with value ${option.value}`
            )
        )
    }
    if (!existing) {
        return res.sendStatus(201)
    }
    return res.sendStatus(204)
}

export default PutOptionRequestHandler
