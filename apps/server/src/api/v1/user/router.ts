import GetUserRequestHandler from "../user/get"
import PostUserRequestHandler from "../user/post"
import { Router } from "express"

const userRouter = Router()

userRouter.post("/", PostUserRequestHandler)
userRouter.get("/auth-id/:authId", GetUserRequestHandler)

export default userRouter
