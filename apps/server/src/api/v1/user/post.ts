import { userRepository } from "../../../repository/userRepository"
import User from "../../../types/User"
import { NextFunction, Request, Response } from "express"

async function PostUserRequestHandler(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const { email, authId } = req.body
    if (!email || !authId) {
        res.status(400)
        return next(new Error("No email or authId specified in body params"))
    }
    const user: Omit<User, "id"> = {
        email: email,
        auth_id: authId
    }
    try {
        const createdUser = await userRepository.create(user)
        return res.status(201).json(createdUser)
    } catch (err) {
        console.error(err)
        res.status(500)
        return next(err)
    }
}

export default PostUserRequestHandler
