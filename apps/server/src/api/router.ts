import v1Router from "./v1/router"
import { Router } from "express"

const apiRouter = Router()

apiRouter.use("/v1", v1Router)

export default apiRouter
