import { NextFunction, Request, Response } from "express"
import invitationsRepository from "~/repository/invitationRepository"
import CustomError from "~/types/CustomError"

const GetInvitationRequestHandler = async (
    req: Request<{ id: string }>,
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

    try {
        const invitation = await invitationsRepository.getByOrganization(id)
        return res.status(200).json(invitation)
    } catch (error) {
        res.status(500)
        return next(error)
    }
}

export default GetInvitationRequestHandler
