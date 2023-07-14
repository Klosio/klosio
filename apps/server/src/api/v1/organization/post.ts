import { NextFunction, Request, Response } from "express"
import { organizationRepository } from "~/repository/organizationRepository"
import { userRepository } from "~/repository/userRepository"
import CustomError from "~/types/CustomError"
import Organization from "~/types/Organization"

async function PostOrganizationRequestHandler(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const { user, name } = req.body
    if (!name || !user) {
        res.status(400)
        return next({
            code: "MISSING_PARAMETER",
            message: "No name or user specified in body params"
        } as CustomError)
    }

    const organization: Omit<Organization, "id"> = {
        name: name
    }

    try {
        const exists = await organizationRepository.existsByName(
            organization.name
        )
        if (exists) {
            res.status(400)
            return next({
                code: "EXISTING_NAME",
                message: "Name already exists"
            } as CustomError)
        }
        const createdOrganization = await organizationRepository.create(
            organization
        )
        await userRepository.update({
            ...user,
            role_id: "ORG_ADMIN",
            organization: createdOrganization
        })
        return res.status(201).json(createdOrganization)
    } catch (error) {
        res.status(500)
        return next(error)
    }
}

export default PostOrganizationRequestHandler
