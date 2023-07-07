import PostOrganizationRequestHandler from "../organization/post"
import businessContextRouter from "./businessContext/router"
import domainRouter from "./domain/router"
import GetOrganizationRequestHandler from "./get"
import invitationRouter from "./invitations/router"
import painpointsRouter from "./painpoints/router"
import GetReadyRequestHandler from "./ready/get"
import { Router } from "express"
import { permit } from "~/middlewares/rbac"

const organizationRouter = Router()

organizationRouter.post(
    "/",
    permit("KLOSIO_ADMIN", "ORG_ADMIN"),
    PostOrganizationRequestHandler
)
organizationRouter.get(
    "/:id",
    permit("KLOSIO_ADMIN", "ORG_ADMIN"),
    GetOrganizationRequestHandler
)
organizationRouter.use(
    "/:id/painpoints",
    permit("KLOSIO_ADMIN", "ORG_ADMIN"),
    painpointsRouter
)
organizationRouter.use(
    "/:id/domain",
    permit("KLOSIO_ADMIN", "ORG_ADMIN"),
    domainRouter
)
organizationRouter.use(
    "/:id/business-context",
    permit("KLOSIO_ADMIN", "ORG_ADMIN"),
    businessContextRouter
)
organizationRouter.use(
    "/:id/invitations",
    permit("KLOSIO_ADMIN", "ORG_ADMIN"),
    invitationRouter
)
organizationRouter.use(
    "/:id/ready",
    permit("ORG_MEMBER", "KLOSIO_ADMIN", "ORG_ADMIN"),
    GetReadyRequestHandler
)

export default organizationRouter
