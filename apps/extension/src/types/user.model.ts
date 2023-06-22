import type Organization from "./organization.model"

export default interface User {
    _id: string
    email: string
    organization?: Organization
}
