import { NextFunction, Request, Response } from "express"
import invitationsRepository from "~/repository/invitationRepository"

const GetInvitationRequestHandler = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
) => {
    const { id } = req.params

    if (!id) {
        res.status(400).json({ message: "Id is required" })
        return
    }

    try {
        const organization = await invitationsRepository.getByOrganization(
            id,
            false
        )
        return res.status(200).json(organization)
    } catch (error) {
        console.error(error)
        next(error)
    }
}

export default GetInvitationRequestHandler
