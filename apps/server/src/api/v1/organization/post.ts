import Organization from "../../../model/Organization"
import { NextFunction, Request, Response } from "express"

async function PostOrganizationRequestHandler(
    req: Request,
    res: Response,
    next: NextFunction
) {
    if (!req.body.name) {
        res.status(400)
        return next(new Error("No name specified in body params"))
    }
    const organization = new Organization({
        name: req.body.name
    })
    try {
        await organization.save()
    } catch (err) {
        console.log(err)
        res.status(500)
        return next(
            new Error(`Error when saving organization ${organization.name}`)
        )
    }
    return res.sendStatus(204)
}

export default PostOrganizationRequestHandler
