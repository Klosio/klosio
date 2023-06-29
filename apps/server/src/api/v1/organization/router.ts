import PostOrganizationRequestHandler from "../organization/post"
import businessContextRouter from "./businessContext/router"
import domainRouter from "./domain/router"
import painpointsRouter from "./painpoints/router"
import { Router } from "express"

const organizationRouter = Router()

organizationRouter.post("/", PostOrganizationRequestHandler)
organizationRouter.use("/:id/painpoints", painpointsRouter)
organizationRouter.use("/:id/domain", domainRouter)
organizationRouter.use("/:id/business-context", businessContextRouter)

export default organizationRouter
