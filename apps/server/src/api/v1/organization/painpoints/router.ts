import PostPainpointsRequestHandler from "./post"
import { Router } from "express"
import multer from "multer"

const painpointsRouter = Router({ mergeParams: true })
const upload = multer({ storage: multer.memoryStorage() })

painpointsRouter.post("/", upload.single("file"), PostPainpointsRequestHandler)

export default painpointsRouter
