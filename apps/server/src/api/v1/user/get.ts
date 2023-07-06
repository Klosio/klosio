import { NextFunction, Request, Response } from "express"
import { userRepository } from "~/repository/userRepository"

async function GetUserRequestHandler(
    req: Request<{ authId: string }>,
    res: Response,
    next: NextFunction
) {
    const { authId } = req.params
    if (!authId) {
        res.status(400)
        return next(new Error("No authId specified for user"))
    }

    try {
        const user = await userRepository.findByAuthId(authId)
        if (!user) {
            res.status(404)
            return next(new Error(`No user found with authId ${authId}`))
        }

        return res.status(200).json(user)
    } catch (err) {
        console.error(err)
        res.status(500)
        return next(err)
    }
}

export default GetUserRequestHandler
