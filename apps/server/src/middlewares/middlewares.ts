import ErrorResponse from "../types/ErrorResponse"
import { NextFunction, Request, Response } from "express"
import CustomError from "~/types/CustomError"

export function notFound(req: Request, res: Response, next: NextFunction) {
    res.status(404)
    next(new Error(`🔍🐝 - Not Found - ${req.originalUrl}`))
}

function isCustomError(error: Error): error is CustomError {
    return (error as CustomError).code !== undefined
}

export function authErrorHandler(
    err: Error,
    _req: Request,
    res: Response<ErrorResponse>,
    next: NextFunction
) {
    if (err.name === "UnauthorizedError") {
        return res.status(401).json({
            code: "UNAUTHORIZED",
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
    if ([400, 401, 402, 403, 404].includes(statusCode) && isCustomError(err)) {
        console.log(err)
        return res.status(statusCode).json({
            code: err.code,
            message: err.message,
            stack: process.env.NODE_ENV === "prod" ? "🐝" : err.stack
        })
    }
    console.error(err)
    return res.status(statusCode).json({
        code: "UNKNOWN",
        message:
            process.env.NODE_ENV === "prod" ? "An error occured." : err.message,
        stack: process.env.NODE_ENV === "prod" ? "🐝" : err.stack
    })
}
