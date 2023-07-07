import { permit } from "../../middlewares/rbac"
import analysisRouter from "./analysis/router"
import healthRouter from "./health/router"
import optionRouter from "./option/router"
import organizationRouter from "./organization/router"
import userRouter from "./user/router"
import { Router } from "express"

const v1Router = Router()

// prettier-ignore
{
    v1Router.use("/analysis", permit("KLOSIO_ADMIN", "ORG_ADMIN", "ORG_MEMBER"), analysisRouter)
    v1Router.use("/health", permit("KLOSIO_ADMIN"), healthRouter)
    v1Router.use("/options", permit("KLOSIO_ADMIN"), optionRouter)
    v1Router.use("/organizations", organizationRouter)
    v1Router.use("/users", userRouter)
}

export default v1Router
