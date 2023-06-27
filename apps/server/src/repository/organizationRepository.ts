import Organization from "../types/Organization"
import { supabaseClient } from "../util/supabase"
import { v4 as uuid } from "uuid"

interface OrganizationRepository {
    find(id: string): Promise<Organization>
    create(organization: Omit<Organization, "id">): Promise<Organization>
}

const organizationRepository: OrganizationRepository = {
    async find(id: string): Promise<Organization> {
        const { data, error } = await supabaseClient
            .from("organizations")
            .select("id, name")
            .eq("id", id)
            .single()

        if (error) {
            throw new Error(
                `Error when retrieving organization with id ${id}`,
                { cause: error }
            )
        }
        return data
    },
    async create(
        organization: Omit<Organization, "id">
    ): Promise<Organization> {
        const { data, error } = await supabaseClient
            .from("organizations")
            .insert({ id: uuid(), ...organization })
            .select()
            .single()

        if (error) {
            throw new Error(
                `Error when inserting organization with name ${organization.name}`,
                { cause: error }
            )
        }
        return data
    }
}

export { organizationRepository }
