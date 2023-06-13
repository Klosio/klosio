import analysisRouter from "./analysis/router"
import healthRouter from "./health/router"
import optionRouter from "./option/router"
import organizationRouter from "./organization/router"
import { Router } from "express"

const v1Router = Router()

v1Router.use("/analysis", analysisRouter)
v1Router.use("/health", healthRouter)
v1Router.use("/organizations", organizationRouter)
v1Router.use("/options", optionRouter)

export default v1Router