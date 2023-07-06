import GetReadyRequestHandler from "./get"
import { Router } from "express"

const router = Router()

router.get("/", GetReadyRequestHandler)

export default router
