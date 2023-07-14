import { NextFunction, Request, Response } from "express"
import invitationsRepository from "~/repository/invitationRepository"
import { organizationRepository } from "~/repository/organizationRepository"
import { userRepository } from "~/repository/userRepository"
import CustomError from "~/types/CustomError"
import User from "~/types/User"

async function PostUserRequestHandler(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const { email, authId } = req.body

    if (!email || !authId) {
        res.status(400)
        return next({
            code: "MISSING_PARAMETER",
            message: "No email or authId specified in body params"
        } as CustomError)
    }

    const user: Omit<User, "id"> = {
        email: email,
        auth_id: authId
    }

    try {
        const exists = await userRepository.existsByEmail(email)
        if (exists) {
            res.status(400)
            return next({
                code: "EXISTING_EMAIL",
                message: "Email already exists"
            } as CustomError)
        }

        const emailInvitation = await invitationsRepository.getByEmail(
            email,
            false
        )

        if (emailInvitation) {
            const createdUser = await userRepository.create({
                ...user,
                role_id: "ORG_MEMBER",
                organization: emailInvitation.organization
            })
            await invitationsRepository.disable(emailInvitation.id)
            return res.status(201).json(createdUser)
        }

        const domain = email.match(new RegExp(/.*@(\S+)/))[1]
        const organization = await organizationRepository.findByDomain(domain)
        if (organization) {
            const createdUser = await userRepository.create({
                ...user,
                role_id: "ORG_MEMBER",
                organization: organization
            })
            return res.status(201).json(createdUser)
        }

        const createdUser = await userRepository.create({
            ...user,
            role_id: "ORG_ADMIN"
        })

        return res.status(201).json(createdUser)
    } catch (error) {
        res.status(500)
        return next(error)
    }
}

export default PostUserRequestHandler
