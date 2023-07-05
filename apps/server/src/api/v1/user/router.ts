import { permit } from "../../../middlewares/rbac"
import GetUserRequestHandler from "../user/get"
import PostUserRequestHandler from "../user/post"
import { Router } from "express"

const userRouter = Router()

// prettier-ignore
{
    userRouter.post("/", permit("GUEST"), PostUserRequestHandler)
    userRouter.get("/auth-id/:authId", permit("KLOSIO_ADMIN", "ORG_ADMIN", "ORG_MEMBER"), GetUserRequestHandler)
}

export default userRouter
