import { NextFunction, Request, Response } from "express"

async function GetHealthRequestHandler(
    _req: Request,
    res: Response,
    _next: NextFunction
) {
    res.status(200).json({ message: "🐝" })
}

export default GetHealthRequestHandler
