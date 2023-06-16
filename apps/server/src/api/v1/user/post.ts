import User from "../../../repository/User"
import { NextFunction, Request, Response } from "express"

async function PostUserRequestHandler(
    req: Request,
    res: Response,
    next: NextFunction
) {
    if (!req.body.email || !req.body.authId) {
        res.status(400)
        return next(new Error("No email or authId specified in body params"))
    }
    const user = new User({
        email: req.body.email,
        auth_id: req.body.authId
    })
    try {
        await user.save()
    } catch (err) {
        console.log(err)
        res.status(500)
        return next(new Error(`Error when saving user ${user.email}`))
    }
    return res.status(201).json(user.toJSON())
}

export default PostUserRequestHandler
