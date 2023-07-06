import { NextFunction, Request, Response } from "express"
import { optionRepository } from "~/repository/optionRepository"

async function GetOptionRequestHandler(
    req: Request<{ name: string }>,
    res: Response,
    next: NextFunction
) {
    const { name } = req.params
    if (!name) {
        res.status(400)
        return next(new Error("No name specified for option"))
    }

    try {
        const option = await optionRepository.findByName(name)
        if (!option) {
            res.status(404)
            return next(new Error(`No option found with name ${name}`))
        }

        return res.status(200).json(option)
    } catch (err) {
        console.error(err)
        res.status(500)
        return next(err)
    }
}

export default GetOptionRequestHandler
