import getEnvVar from "../../../util/env"
import PostAnalysisRequestHandler from "./post"
import { Router } from "express"
import multer from "multer"

const analysisRouter = Router()

const storage =
    getEnvVar("NODE_ENV") === "debug"
        ? { dest: "uploads/" }
        : { storage: multer.memoryStorage() }
const upload = multer(storage)

analysisRouter.post(
    "/:language/:organizationId",
    upload.single("file"),
    PostAnalysisRequestHandler
)

export default analysisRouter
