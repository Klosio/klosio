import invitationsRepository from "../../../../repository/invitationRepository"
import { organizationRepository } from "../../../../repository/organizationRepository"
import { NextFunction, Request, Response } from "express"

const DeleteInvitationRequestHandler = async (
    req: Request<{ id: string }, {}, { email: string }>,
    res: Response,
    next: NextFunction
) => {
    const { id } = req.params

    if (!id) {
        res.status(400).json({ message: "Id is required" })
        return
    }

    const { email } = req.body

    if (!email) {
        res.status(400).json({ message: "email is required" })
        return
    }

    const organization = await organizationRepository
        .find(id)
        .catch((error) => {
            console.error(error)
            next(error)
        })

    if (!organization) {
        return res.status(404).send()
    }

    await invitationsRepository.delete(organization.id).catch((error) => {
        console.error(error)
        next(error)
    })

    return res.status(204).send()
}

export default DeleteInvitationRequestHandler
