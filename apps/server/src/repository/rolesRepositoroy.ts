import { supabaseClient } from "../util/supabase"

interface RolesRepository {
    getRoles(): Promise<Array<string>>
}

const rolesRepository: RolesRepository = {
    async getRoles(): Promise<Array<string>> {
        const { data, error } = await supabaseClient.from("roles").select("id")

        if (error) {
            throw new Error(`Error when retrieving roles`, { cause: error })
        }

        return data.map((role: any) => role.id)
    }
}

export default rolesRepository
