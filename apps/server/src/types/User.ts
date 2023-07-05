import Organization from "./Organization"

export default interface User {
    id: string
    auth_id?: string
    email: string
    organization?: Organization
    role_id?: string
}
