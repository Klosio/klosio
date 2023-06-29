import { supabaseClient } from "../../../../util/supabase"
import { NextFunction, Request, Response } from "express"

const PostInvitationRequestHandler = async (
    req: Request<{ id: string }, {}, { emails: Array<{ email: string }> }>,
    res: Response,
    next: NextFunction
) => {
    const { id } = req.params

    if (!id) {
        res.status(400).json({ message: "Id is required" })
        return
    }

    const { emails } = req.body

    if (!emails) {
        res.status(400).json({ message: "emails are required" })
        return
    }

    const { data: organization, error: organizationError } =
        await supabaseClient
            .from("organizations")
            .select("id")
            .eq("id", id)
            .single()

    if (!organization) {
        return res.status(404).send()
    }

    if (organizationError) {
        return res.status(500).send()
    }

    // delete all invitations for this organization
    const { error: deleteError } = await supabaseClient
        .from("invitations")
        .delete()
        .eq("organization_id", organization.id)

    if (deleteError) {
        console.error(deleteError)
        return next(deleteError)
    }

    const { data, error: insertInvitationsError } = await supabaseClient
        .from("invitations")
        .insert(
            emails.map((email) => ({
                organization_id: organization.id,
                email: email.email
            }))
        )
        .select()

    if (insertInvitationsError) {
        console.error(insertInvitationsError)
        return next(insertInvitationsError)
    }

    return res.status(200).json(data)
}

export default PostInvitationRequestHandler
