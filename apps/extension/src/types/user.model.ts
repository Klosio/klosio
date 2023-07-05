import type Organization from "./organization.model"

export default interface User {
    id: string
    email: string
    role_id: string
    organization?: Organization
}
