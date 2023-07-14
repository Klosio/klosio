import Organization from "~/types/Organization"
import { supabaseClient } from "~/util/supabase"

interface Invitation {
    id: string
    email: string
    organization: Organization
}

interface invitationsRepository {
    create(invitation: Omit<Invitation, "id">): Promise<Invitation>
    getByOrganization(organization_id: string): Promise<Invitation[]>
    getByEmail(email: string, registered: boolean): Promise<Invitation | null>
    delete(id: string): Promise<void>
    disable(id: string): Promise<void>
}

// in the data organizations is typed as an array but returns a single organization
function refineData(data: any): Invitation {
    if (data?.organizations) {
        const { organizations, ...rest } = data
        const invitation = rest as Invitation
        invitation.organization = organizations as Organization
        return invitation
    }
    return data as Invitation
}

const invitationsRepository: invitationsRepository = {
    async getByOrganization(organization_id: string): Promise<Invitation[]> {
        const { data, error } = await supabaseClient
            .from("invitations")
            .select("id, email, organizations (id, name), registered")
            .eq("organization_id", organization_id)

        if (error) {
            throw new Error(
                `Error when retrieving invitations for ${organization_id}`,
                {
                    cause: error
                }
            )
        }
        return data.map((invitation) => refineData(invitation))
    },
    async getByEmail(
        email: string,
        registered: boolean
    ): Promise<Invitation | null> {
        const { data, error } = await supabaseClient
            .from("invitations")
            .select("id, email, organizations (id, name), registered")
            .eq("email", email)
            .eq("registered", registered)
            .maybeSingle()

        if (error) {
            throw new Error(`Error when retrieving invitations`, {
                cause: error
            })
        }
        return !!data ? refineData(data) : null
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
        const { organization, ...rest } = invitation
        const { data, error } = await supabaseClient
            .from("invitations")
            .insert({ ...rest, organization_id: organization.id })
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
