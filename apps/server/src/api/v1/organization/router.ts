import PostOrganizationRequestHandler from "../organization/post"
import businessContextRouter from "./businessContext/router"
import domainRouter from "./domain/router"
import GetOrganizationRequestHandler from "./get"
import invitationRouter from "./invitations/router"
import painpointsRouter from "./painpoints/router"
import GetReadyRequestHandler from "./ready/get"
import { Router } from "express"

const organizationRouter = Router()

organizationRouter.post("/", PostOrganizationRequestHandler)
organizationRouter.get("/:id", GetOrganizationRequestHandler)
organizationRouter.use("/:id/painpoints", painpointsRouter)
organizationRouter.use("/:id/domain", domainRouter)
organizationRouter.use("/:id/business-context", businessContextRouter)
organizationRouter.use("/:id/invitations", invitationRouter)
organizationRouter.use("/:id/ready", GetReadyRequestHandler)

export default organizationRouter
