import type User from "./user.model"

export default interface UserSession {
    authId: string
    token: string
    user?: User
}
