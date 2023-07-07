import { NextFunction, Request, Response } from "express"
import { organizationRepository } from "~/repository/organizationRepository"
import { userRepository } from "~/repository/userRepository"
import Organization from "~/types/Organization"

async function PostOrganizationRequestHandler(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const { user, name } = req.body
    if (!name || !user) {
        res.status(400)
        return next(new Error("No name or user specified in body params"))
    }

    const organization: Omit<Organization, "id"> = {
        name: name
    }

    try {
        const createdOrganization = await organizationRepository.create(
            organization
        )
        await userRepository.update({
            ...user,
            role_id: "ORG_ADMIN",
            organization: { id: createdOrganization.id }
        })
        return res.status(201).json(createdOrganization)
    } catch (err) {
        console.error(err)
        res.status(500)
        return next(err)
    }
}

export default PostOrganizationRequestHandler
