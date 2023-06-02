import analysisRouter from "./analysis/router"
import healthRouter from "./health/router"
import organizationRouter from "./organization/router"
import { Router } from "express"

const v1Router = Router()

v1Router.use("/analysis", analysisRouter)
v1Router.use("/health", healthRouter)
v1Router.use("/organization", organizationRouter)

export default v1Router
