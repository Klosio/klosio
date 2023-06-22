import apiRouter from "./api/router"
import * as middlewares from "./middlewares/middlewares"
import getEnvVar from "./util/env"
import cors from "cors"
import express from "express"
import { Params, expressjwt } from "express-jwt"
import helmet from "helmet"
import morgan from "morgan"

const jwtSecret = getEnvVar("JWT_SECRET")

const jwtConfig = {
    secret: jwtSecret,
    algorithms: ["HS256"]
} as Params

const app = express()

app.use(morgan("dev"))
app.use(helmet())
app.use(cors())
app.use(expressjwt(jwtConfig))
app.use(express.json())

app.use("/api", apiRouter)

app.use(middlewares.authErrorHandler)
app.use(middlewares.notFound)
app.use(middlewares.errorHandler)

export default app
