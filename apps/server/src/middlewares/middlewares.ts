import ErrorResponse from "../types/ErrorResponse"
import { NextFunction, Request, Response } from "express"

export function notFound(req: Request, res: Response, next: NextFunction) {
    res.status(404)
    const error = new Error(`🔍🐝 - Not Found - ${req.originalUrl}`)
    next(error)
}

export function authErrorHandler(
    err: Error,
    req: Request,
    res: Response<ErrorResponse>,
    next: NextFunction
) {
    if (err.name === "UnauthorizedError") {
        res.status(401).json({
            message: "Invalid token",
            stack: process.env.NODE_ENV === "prod" ? "🐝" : err.stack
        })
    } else {
        next(err)
    }
}

export function errorHandler(
    err: Error,
    req: Request,
    res: Response<ErrorResponse>,
    next: NextFunction
) {
    const statusCode = res.statusCode !== 200 ? res.statusCode : 500
    return res.status(statusCode).json({
        message: err.message,
        stack: process.env.NODE_ENV === "prod" ? "🐝" : err.stack
    })
}
