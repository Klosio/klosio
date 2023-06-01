import analysisRouter from "./analysis/router"
import healthRouter from "./health/router"
import { Router } from "express"

const v1Router = Router()

v1Router.use("/analysis", analysisRouter)
v1Router.use("/health", healthRouter)

export default v1Router
