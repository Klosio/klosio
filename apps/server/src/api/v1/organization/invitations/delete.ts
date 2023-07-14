import { NextFunction, Request, Response } from "express"
import invitationsRepository from "~/repository/invitationRepository"
import { organizationRepository } from "~/repository/organizationRepository"
import CustomError from "~/types/CustomError"

const DeleteInvitationRequestHandler = async (
    req: Request<{ id: string }, {}, { email: string }>,
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

    const { email } = req.body

    if (!email) {
        res.status(400)
        return next({
            code: "MISSING_PARAMETER",
            message: "Email param not found"
        } as CustomError)
    }

    const organization = await organizationRepository
        .find(id)
        .catch((error) => {
            res.status(500)
            return next(error)
        })

    if (!organization) {
        res.status(404)
        return next({
            code: "NOT_FOUND",
            message: `No organization found with id ${id}`
        } as CustomError)
    }

    await invitationsRepository.delete(organization.id).catch((error) => {
        res.status(500)
        return next(error)
    })

    return res.status(204).send()
}

export default DeleteInvitationRequestHandler
