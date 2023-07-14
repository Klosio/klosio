import Organization from "~/types/Organization"
import User from "~/types/User"
import { supabaseClient } from "~/util/supabase"

interface UserRepository {
    findByAuthId(authId: string): Promise<User>
    existsByEmail(email: string): Promise<boolean>
    create(user: Omit<User, "id">): Promise<User>
    update(user: User): Promise<User>
}

// in the data organizations is typed as an array but returns a single organization
function refineData(data: any): User {
    if (data?.organizations) {
        const { organizations, ...rest } = data
        const user = rest as User
        user.organization = organizations as Organization
        return user
    }
    return data as User
}

const userRepository: UserRepository = {
    async findByAuthId(authId: string): Promise<User> {
        const { data, error } = await supabaseClient
            .from("users")
            .select("id, email, auth_id, role_id, organizations ( id, name )")
            .eq("auth_id", authId)
            .single()

        if (error) {
            throw new Error(
                `Error when retrieving user with authId ${authId}`,
                { cause: error }
            )
        }
        return refineData(data)
    },
    async existsByEmail(email: string): Promise<boolean> {
        const { data, error } = await supabaseClient
            .from("users")
            .select("id")
            .eq("email", email)
            .maybeSingle()

        if (error) {
            throw new Error(
                `Error when checking existence of user with email ${email}`,
                { cause: error }
            )
        }

        return !!data
    },
    async create(user: Omit<User, "id">): Promise<User> {
        const { organization, ...rest } = user
        const { data, error } = await supabaseClient
            .from("users")
            .insert({ ...rest, organization_id: organization?.id })
            .select("id, email, auth_id, role_id, organizations ( id, name )")
            .single()

        if (error) {
            throw new Error(
                `Error when inserting user with email ${user.email}`,
                { cause: error }
            )
        }
        return refineData(data)
    },
    async update(user: User): Promise<User> {
        const { data, error } = await supabaseClient
            .from("users")
            .update({
                email: user.email,
                role_id: user.role_id,
                organization_id: user.organization?.id
            })
            .eq("id", user.id)
            .select("id, email, auth_id, role_id, organizations ( id, name )")
            .single()

        if (error) {
            throw new Error(`Error when updating user with id ${user.id}`, {
                cause: error
            })
        }

        return refineData(data)
    }
}

export { userRepository }
