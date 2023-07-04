import { organizationRepository } from "../../../repository/organizationRepository"
import { userRepository } from "../../../repository/userRepository"
import Organization from "../../../types/Organization"
import { NextFunction, Request, Response } from "express"

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
        await userRepository.updateOrganization(user, createdOrganization.id)
        return res.status(201).json(createdOrganization)
    } catch (err) {
        console.error(err)
        res.status(500)
        return next(err)
    }
}

export default PostOrganizationRequestHandler
