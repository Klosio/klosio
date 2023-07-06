import { EmbeddedPainpoint } from "../types/Painpoint"
import { supabaseClient } from "~/util/supabase"

interface PainpointRepository {
    findByMatchingEmbedding(
        embedding: number[],
        organizationId: string
    ): Promise<EmbeddedPainpoint[]>
    create(painpoints: EmbeddedPainpoint[]): Promise<void>
    deleteByOrganizationId(organizationId: string): Promise<void>
}

const painpointRepository: PainpointRepository = {
    async findByMatchingEmbedding(
        embedding: number[],
        organizationId: string
    ): Promise<EmbeddedPainpoint[]> {
        const { data, error } = await supabaseClient.rpc("match_painpoints", {
            query_embedding: embedding,
            match_threshold: 0.78,
            match_count: 3,
            organization_id: organizationId
        })
        if (error) {
            throw new Error(`Error when matching painpoint`, { cause: error })
        }
        return data
    },
    async create(painpoints: EmbeddedPainpoint[]): Promise<void> {
        const { error } = await supabaseClient
            .from("painpoints")
            .insert(painpoints)
            .select()

        if (error) {
            throw new Error(`Error when inserting painpoints`, { cause: error })
        }
    },
    async deleteByOrganizationId(organizationId: string): Promise<void> {
        const { error } = await supabaseClient
            .from("painpoints")
            .delete()
            .eq("organization_id", organizationId)

        if (error) {
            throw new Error(
                `Error when deleting painpoints for organization with id ${organizationId}`,
                { cause: error }
            )
        }
    }
}

export { painpointRepository }
