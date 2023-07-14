import { NextFunction, Request, Response } from "express"
import { userRepository } from "~/repository/userRepository"
import CustomError from "~/types/CustomError"

async function GetUserRequestHandler(
    req: Request<{ authId: string }>,
    res: Response,
    next: NextFunction
) {
    const { authId } = req.params
    if (!authId) {
        res.status(400)
        return next({
            code: "MISSING_PARAMETER",
            message: "AuthId param not found"
        } as CustomError)
    }

    try {
        const user = await userRepository.findByAuthId(authId)
        if (!user) {
            res.status(404)
            return next({
                code: "NOT_FOUND",
                message: `No user found with authId ${authId}`
            } as CustomError)
        }

        return res.status(200).json(user)
    } catch (error) {
        res.status(500)
        return next(error)
    }
}

export default GetUserRequestHandler
