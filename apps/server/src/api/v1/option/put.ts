import { NextFunction, Request, Response } from "express"
import { optionRepository } from "~/repository/optionRepository"

async function PutOptionRequestHandler(
    req: Request<{ name: string }>,
    res: Response,
    next: NextFunction
) {
    const { name } = req.params
    if (!name) {
        res.status(400)
        return next(new Error("No name specified for option"))
    }

    let existing = true
    try {
        let option = await optionRepository.findByName(name)

        if (!option) {
            existing = false
            option = {
                name: name
            }
        }

        option.value = req.body.value

        const savedOption = await optionRepository.save(option)

        if (!existing) {
            return res.status(201).json(savedOption)
        }
        return res.status(200).json(savedOption)
    } catch (err) {
        console.error(err)
        res.status(500)
        return next(err)
    }
}

export default PutOptionRequestHandler
