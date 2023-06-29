import GetBusinessContextRequestHandler from "./get"
import PostBusinessContextRequestHandler from "./post"
import PutBusinessContextRequestHandler from "./put"
import { Router } from "express"

const businessContextRouter = Router({ mergeParams: true })

businessContextRouter.get("/", GetBusinessContextRequestHandler)
businessContextRouter.post("/", PostBusinessContextRequestHandler)
businessContextRouter.put(
    "/:businessContextId",
    PutBusinessContextRequestHandler
)

export default businessContextRouter
