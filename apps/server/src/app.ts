import apiRouter from "./api/router"
import * as middlewares from "./middlewares/middlewares"
import getEnvVar from "./util/env"
import cors from "cors"
import express from "express"
import helmet from "helmet"
import morgan from "morgan"

const extensionUri = getEnvVar("EXTENSION_URI")

const app = express()

app.use(morgan("dev"))
app.use(helmet())
app.use(cors())
app.use(express.json())

app.use("/api", apiRouter)

app.use(middlewares.notFound)
app.use(middlewares.errorHandler)

export default app
