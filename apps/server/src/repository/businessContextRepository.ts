import BusinessContext from "~/types/BusinessContext"
import { supabaseClient } from "~/util/supabase"

interface BusinessContextRepository {
    findByOrganization(organizationId: string): Promise<BusinessContext[]>
    create(
        businessContext: Omit<BusinessContext, "id">
    ): Promise<BusinessContext>
    update(businessContext: BusinessContext): Promise<BusinessContext>
    exists(organizationId: string): Promise<boolean>
}

const businessContextRepository: BusinessContextRepository = {
    async findByOrganization(
        organizationId: string
    ): Promise<BusinessContext[]> {
        const { data, error } = await supabaseClient
            .from("business_contexts")
            .select("id, industry, selling, target, organization_id")
            .eq("organization_id", organizationId)

        if (error) {
            throw new Error(
                `Error when retrieving business context with organization id ${organizationId}`,
                { cause: error }
            )
        }
        return data
    },
    async create(
        businessContext: Omit<BusinessContext, "id">
    ): Promise<BusinessContext> {
        const { data, error } = await supabaseClient
            .from("business_contexts")
            .insert(businessContext)
            .select()
            .single()

        if (error) {
            throw new Error(
                `Error when inserting business context for organization ${businessContext.organization_id}`,
                { cause: error }
            )
        }
        return data
    },
    async update(businessContext: BusinessContext): Promise<BusinessContext> {
        const { data, error } = await supabaseClient
            .from("business_contexts")
            .update(businessContext)
            .eq("organization_id", businessContext.organization_id)
            .select()
            .single()

        if (error) {
            throw new Error(
                `Error when updating business context for organization ${businessContext.organization_id}`,
                { cause: error }
            )
        }
        return data
    },
    async exists(organizationId: string): Promise<boolean> {
        const { data, error } = await supabaseClient
            .from("business_contexts")
            .select("id")
            .eq("organization_id", organizationId)

        if (error) {
            throw new Error(
                `Error when counting painpoints with organization id ${organizationId}`,
                { cause: error }
            )
        }

        return !!data?.length
    }
}

export { businessContextRepository }
