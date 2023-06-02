import v1Router from "./v1/router"
import cors from "cors"
import { Router } from "express"

const apiRouter = Router()

apiRouter.options("*", cors())
apiRouter.use("/v1", v1Router)

export default apiRouter
