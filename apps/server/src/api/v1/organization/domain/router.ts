import PostDomainRequestHandler from "./post"
import { Router } from "express"

const domainRouter = Router({ mergeParams: true })

domainRouter.post("/", PostDomainRequestHandler)

export default domainRouter
