import PostOrganizationRequestHandler from "../organization/post"
import painpointsRouter from "./painpoints/router"
import { Router } from "express"

const organizationRouter = Router()

organizationRouter.post("/", PostOrganizationRequestHandler)
organizationRouter.use("/:id/painpoints", painpointsRouter)

export default organizationRouter
