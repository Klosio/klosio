import { supabaseClient } from "../util/supabase"

interface Invitation {
    id: string
    email: string
    organization_id: string
}

interface invitationsRepository {
    create(invitation: Omit<Invitation, "id">): Promise<Invitation>
    getByOrganization(
        organization_id: string,
        registered: boolean
    ): Promise<Invitation[]>
    getByEmail(email: string): Promise<Invitation | null>
    delete(id: string): Promise<void>
    disable(id: string): Promise<void>
}

const invitationsRepository: invitationsRepository = {
    async getByOrganization(
        organization_id: string,
        registered: boolean
    ): Promise<Invitation[]> {
        const { data, error } = await supabaseClient
            .from("invitations")
            .select("id, email, organization_id, registered")
            .eq("organization_id", organization_id)
            .eq("registered", registered)

        if (error) {
            throw new Error(
                `Error when retrieving invitations for ${organization_id}`,
                {
                    cause: error
                }
            )
        }
        return data
    },
    async getByEmail(email: string): Promise<Invitation | null> {
        const { data, error } = await supabaseClient
            .from("invitations")
            .select("id, email, organization_id, registered")
            .eq("email", email)
            .maybeSingle()

        if (error) {
            throw new Error(`Error when retrieving invitations`, {
                cause: error
            })
        }
        return data
    },
    async disable(id: string): Promise<void> {
        const { error } = await supabaseClient
            .from("invitations")
            .update({ registered: true })
            .eq("id", id)

        if (error) {
            throw new Error(`Error when disabling invitation with id ${id}`, {
                cause: error
            })
        }
    },
    async create(invitation: Omit<Invitation, "id">): Promise<Invitation> {
        const { data, error } = await supabaseClient
            .from("invitations")
            .insert({ ...invitation })
            .select()
            .single()

        if (error) {
            throw new Error(
                `Error when inserting invitation with email ${invitation.email}`,
                { cause: error }
            )
        }
        return data
    },
    async delete(id: string): Promise<void> {
        const { error } = await supabaseClient
            .from("invitations")
            .delete()
            .eq("id", id)

        if (error) {
            throw new Error(`Error when deleting invitation with id ${id}`, {
                cause: error
            })
        }
    }
}

export default invitationsRepository
