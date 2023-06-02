import GetOptionRequestHandler from "./get"
import PutOptionRequestHandler from "./put"
import { Router } from "express"

const OptionRouter = Router()

OptionRouter.get("/:name", GetOptionRequestHandler)
OptionRouter.put("/:name", PutOptionRequestHandler)

export default OptionRouter
