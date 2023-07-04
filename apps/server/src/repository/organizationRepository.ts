import Organization from "../types/Organization"
import { supabaseClient } from "../util/supabase"
import { v4 as uuid } from "uuid"

interface OrganizationRepository {
    find(id: string): Promise<Organization>
    findByDomain(domain: string): Promise<Organization>
    getDomain(id: string): Promise<string>
    create(organization: Omit<Organization, "id">): Promise<Organization>
    saveDomain(organization: Organization, domain: string): Promise<void>
}

const organizationRepository: OrganizationRepository = {
    async find(id: string): Promise<Organization> {
        const { data, error } = await supabaseClient
            .from("organizations")
            .select("id, name, domain")
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
    },
    async findByDomain(domain: string): Promise<Organization> {
        const { data, error } = await supabaseClient
            .from("organizations")
            .select("id, name, domain")
            .eq("domain", domain)

        if (error) {
            throw new Error(
                `Error when retrieving organization with domain ${domain}`,
                { cause: error }
            )
        }

        return data[0]
    },
    async getDomain(id: string): Promise<string> {
        const { data, error } = await supabaseClient
            .from("organizations")
            .select("domain")
            .eq("id", id)
            .single()

        if (error) {
            throw new Error(
                `Error when retrieving organization with id ${id}`,
                { cause: error }
            )
        }
        return data.domain
    },
    async saveDomain(
        organization: Organization,
        domain: string
    ): Promise<void> {
        console.log(organization.id, domain)
        const { error } = await supabaseClient
            .from("organizations")
            .update({ domain: domain })
            .eq("id", organization.id)
            .select()

        if (error) {
            throw new Error(
                `Error when save domain for organization with id ${organization.id}`,
                { cause: error }
            )
        }
    }
}

export { organizationRepository }
