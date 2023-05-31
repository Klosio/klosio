import GetHealthRequestHandler from "./get"
import { Router } from "express"

const healthRouter = Router()

healthRouter.get("/", GetHealthRequestHandler)

export default healthRouter
