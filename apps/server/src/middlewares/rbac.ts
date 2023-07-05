import { userRepository } from "../repository/userRepository"
import { Roles } from "../types/Roles"
import { NextFunction, Response } from "express"

const verifyKlosioUser = async (
    req: any,
    res: Response,
    next: NextFunction
) => {
    try {
        // auth object is setted by expressjwt middleware and contain decoded token
        const {
            auth: { aud: authStatus, sub: userId, email }
        } = req

        if (authStatus !== "authenticated") {
            res.status(401)
            next(new Error("User is not authenticated"))
        }
        const user = await userRepository.findByAuthId(userId).catch(() => {
            return { role_id: "GUEST" }
        })
        req.klosioUser = user
    } catch (error) {
        // If user is not present in db, that mean he just created account, set user to guest
        // It will be updated automatically by post user request handler
        req.klosioUser = { role_id: "GUEST" }
    } finally {
        next()
    }
}

const permit =
    (...permittedRoles: Array<Roles>) =>
    async (req: any, res: Response, next: NextFunction) => {
        const user = req.klosioUser
        if (!user || !permittedRoles.includes(user.role_id)) {
            res.status(403)
            req.klosioUser.accessGranted = false
            next(new Error("User is not authorized to access this resource"))
        }
        req.klosioUser.accessGranted = true
        next()
    }

const verifyAccessGranted = async (
    req: any,
    res: Response,
    next: NextFunction
) => {
    // If accessGranted is not setted, that mean user is not allowed to access this resource
    // Prevent an omission of permit middleware
    if (!req.klosioUser.accessGranted) {
        res.status(403)
        next(new Error("User is not authorized to access this resource"))
    }
    next()
}

export { permit, verifyAccessGranted, verifyKlosioUser }
