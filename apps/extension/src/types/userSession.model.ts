import type User from "./user.model"

export default interface UserSession {
    authId: string
    token: string
    expiresAt: number
    refreshToken: string
    remember: boolean
    user?: User
}
