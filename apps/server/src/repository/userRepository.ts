import Organization from "../types/Organization"
import User from "../types/User"
import { supabaseClient } from "../util/supabase"
import { v4 as uuid } from "uuid"

interface UserRepository {
    findByAuthId(authId: string): Promise<User>
    create(user: Omit<User, "id">): Promise<User>
    updateOrganization(user: User, organization_id: string): Promise<User>
}

const userRepository: UserRepository = {
    async findByAuthId(authId: string): Promise<User> {
        const { data, error } = await supabaseClient
            .from("users")
            .select("id, email, auth_id, organizations ( id, name )")
            .eq("auth_id", authId)
            .single()

        if (error) {
            throw new Error(
                `Error when retrieving user with authId ${authId}`,
                { cause: error }
            )
        }
        const { organizations, ...rest } = data
        const user = rest as User
        // result is typed as an array but returns a single organization
        user.organization = organizations as unknown as Organization
        return user
    },
    async create(user: Omit<User, "id">): Promise<User> {
        const { data, error } = await supabaseClient
            .from("users")
            .insert({ id: uuid(), ...user })
            .select()
            .single()

        if (error) {
            throw new Error(
                `Error when inserting user with email ${user.email}`,
                { cause: error }
            )
        }
        return data
    },
    async updateOrganization(
        user: User,
        organization_id: string
    ): Promise<User> {
        const { data, error } = await supabaseClient
            .from("users")
            .update({ organization_id })
            .eq("id", user.id)
            .select("id, email, auth_id, organizations ( name )")
            .single()

        if (error) {
            throw new Error(`Error when updating user with id ${user.id}`, {
                cause: error
            })
        }

        const refinedData = Object.fromEntries(
            Object.entries(data).map(([k, v]) =>
                k !== "organizations" ? [k, v] : ["organization", v]
            )
        ) as User
        return refinedData
    }
}

export { userRepository }
