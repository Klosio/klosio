import DeleteInvitationRequestHandler from "./delete"
import GetInvitationRequestHandler from "./get"
import PostInvitationRequestHandler from "./post"
import { Router } from "express"

const invitationRouter = Router({ mergeParams: true })

invitationRouter.post("/", PostInvitationRequestHandler)
invitationRouter.delete("/", DeleteInvitationRequestHandler)
invitationRouter.get("/", GetInvitationRequestHandler)

export default invitationRouter
