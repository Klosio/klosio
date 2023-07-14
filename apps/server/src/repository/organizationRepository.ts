import Organization from "../types/Organization"
import { supabaseClient } from "~/util/supabase"

interface OrganizationRepository {
    find(id: string): Promise<Organization>
    findByDomain(domain: string): Promise<Organization | null>
    getDomain(id: string): Promise<string>
    create(organization: Omit<Organization, "id">): Promise<Organization>
    saveDomain(organization: Organization, domain: string): Promise<void>
    existsByName(name: string): Promise<boolean>
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
            .insert(organization)
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
    async findByDomain(domain: string): Promise<Organization | null> {
        const { data, error } = await supabaseClient
            .from("organizations")
            .select("id, name, domain")
            .eq("domain", domain)
            .maybeSingle()

        if (error) {
            throw new Error(
                `Error when retrieving organization with domain ${domain}`,
                { cause: error }
            )
        }

        return data
    },
    async existsByName(name: string): Promise<boolean> {
        const { data, error } = await supabaseClient
            .from("organizations")
            .select("id")
            .eq("name", name)
            .maybeSingle()

        if (error) {
            throw new Error(
                `Error when checking existence of organization with name ${name}`,
                { cause: error }
            )
        }

        return !!data
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
