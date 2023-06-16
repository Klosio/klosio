import Organization from "../../../repository/Organization"
import User from "../../../repository/User"
import { NextFunction, Request, Response } from "express"

async function PostOrganizationRequestHandler(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const user = req.body.user
    if (!req.body.name || !user) {
        res.status(400)
        return next(new Error("No name or user specified in body params"))
    }

    const organization = new Organization({
        name: req.body.name,
        user: user
    })
    try {
        await organization.save()
    } catch (err) {
        console.log(err)
        res.status(500)
        return next(
            new Error(`Error when saving organization ${organization.name}`)
        )
    }
    try {
        await User.updateOne(
            { _id: user._id },
            { $set: { organization: organization } }
        )
    } catch (err) {
        console.log(err)
        res.status(500)
        return next(
            new Error(
                `Error when saving organization ${organization.name} for user ${user.email}`
            )
        )
    }

    return res.status(201).json(organization.toJSON())
}

export default PostOrganizationRequestHandler
