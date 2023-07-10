import { NextFunction, Request, Response } from "express"
import { organizationRepository } from "~/repository/organizationRepository"

const availableFields = ["id", "name", "domain"]
type AvailableField = (typeof availableFields)[number]

function isValid(fields: string[]): fields is AvailableField[] {
    return fields.every((field) => availableFields.includes(field))
}

async function GetOrganizationRequestHandler(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
) {
    const id = req.params.id

    if (!id) {
        res.status(404)
        return next(new Error("Organization id param not found"))
    }

    const fieldsQuery = req.query.fields

    try {
        if (typeof fieldsQuery === "string") {
            const fields = fieldsQuery.split(",")
            if (!isValid(fields)) {
                res.status(400)
                return next(new Error("Invalid field name"))
            }
            if (!fields.includes("domain")) {
                res.status(400)
                return next(new Error("Only domain field is supported"))
            }
            const domain = await organizationRepository.getDomain(id)
            return res.status(200).json({ domain })
        }
        const organization = await organizationRepository.find(id)
        return res.status(200).json(organization)
    } catch (err) {
        console.error(err)
        res.status(500)
        return next(err)
    }
}

export default GetOrganizationRequestHandler
