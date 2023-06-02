import PostOrganizationRequestHandler from "../organization/post"
import { Router } from "express"

const organizationRouter = Router()

organizationRouter.post("/", PostOrganizationRequestHandler)

export default organizationRouter
