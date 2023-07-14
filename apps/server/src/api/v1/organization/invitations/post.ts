import { NextFunction, Request, Response } from "express"
import CustomError from "~/types/CustomError"
import { supabaseClient } from "~/util/supabase"

const PostInvitationRequestHandler = async (
    req: Request<{ id: string }, {}, { emails: Array<{ email: string }> }>,
    res: Response,
    next: NextFunction
) => {
    const { id } = req.params

    if (!id) {
        res.status(400)
        return next({
            code: "MISSING_PARAMETER",
            message: "Id param not found"
        } as CustomError)
    }

    const { emails } = req.body

    if (!emails) {
        res.status(400)
        return next({
            code: "MISSING_PARAMETER",
            message: "Emails are required"
        } as CustomError)
    }

    const { data: organization, error: organizationError } =
        await supabaseClient
            .from("organizations")
            .select("id")
            .eq("id", id)
            .single()

    if (!organization) {
        res.status(404)
        return next({
            code: "NOT_FOUND",
            message: `No organization found with id ${id}`
        } as CustomError)
    }

    if (organizationError) {
        res.status(500)
        return next(organizationError)
    }

    // delete all invitations for this organization
    const { error: deleteError } = await supabaseClient
        .from("invitations")
        .delete()
        .eq("organization_id", organization.id)

    if (deleteError) {
        res.status(500)
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
        res.status(500)
        return next(insertInvitationsError)
    }

    return res.status(200).json(data)
}

export default PostInvitationRequestHandler
