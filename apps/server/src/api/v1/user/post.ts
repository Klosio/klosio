import { NextFunction, Request, Response } from "express"
import invitationsRepository from "~/repository/invitationRepository"
import { organizationRepository } from "~/repository/organizationRepository"
import { userRepository } from "~/repository/userRepository"
import User from "~/types/User"

async function PostUserRequestHandler(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const { email, authId } = req.body

    if (!email || !authId) {
        res.status(400)
        return next(new Error("No email or authId specified in body params"))
    }

    const user: Omit<User, "id"> = {
        email: email,
        auth_id: authId
    }

    const domain = email.match(new RegExp(/.*@(\S+)/))[1]

    try {
        let createdUser = await userRepository.create({
            ...user,
            role_id: "ORG_ADMIN"
        })

        const organizationDomain = await organizationRepository.findByDomain(
            domain
        )

        if (!!organizationDomain) {
            createdUser = await userRepository.update({
                ...createdUser,
                role_id: "ORG_MEMBER",
                organization: { id: organizationDomain.id }
            })
        }

        const emailInvitation = await invitationsRepository.getByEmail(email)

        if (!!emailInvitation) {
            createdUser = await userRepository.update({
                ...createdUser,
                role_id: "ORG_MEMBER",
                organization: { id: emailInvitation.organization_id }
            })
            await invitationsRepository.disable(emailInvitation.id)
        }

        return res.status(201).json(createdUser)
    } catch (err) {
        console.error(err)
        return next(err)
    }
}

export default PostUserRequestHandler
