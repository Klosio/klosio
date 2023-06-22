import User from "../../../repository/User"
import { NextFunction, Request, Response } from "express"

async function GetUserRequestHandler(
    req: Request<{ authId: string }>,
    res: Response,
    next: NextFunction
) {
    if (!req.params.authId) {
        res.status(400)
        return next(new Error("No authId specified for user"))
    }

    const user = await User.findOne({ auth_id: req.params.authId })
        .populate("organization")
        .exec()
    if (!user) {
        res.status(404)
        return next(new Error(`No user found with authId ${req.params.authId}`))
    }

    return res.status(200).json(user.toJSON())
}

export default GetUserRequestHandler
