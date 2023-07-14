import { NextFunction, Request, Response } from "express"
import { organizationRepository } from "~/repository/organizationRepository"
import CustomError from "~/types/CustomError"

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
        res.status(400)
        return next({
            code: "MISSING_PARAMETER",
            message: "Organization id missing in params"
        } as CustomError)
    }

    const fieldsQuery = req.query.fields

    try {
        if (typeof fieldsQuery === "string") {
            const fields = fieldsQuery.split(",")
            if (!isValid(fields)) {
                res.status(400)
                return next({
                    code: "INVALID_FIELD_NAME",
                    message: "Invalid field name"
                } as CustomError)
            }
            if (!fields.includes("domain")) {
                res.status(400)
                return next({
                    code: "INVALID_FIELD_NAME",
                    message: "Only domain field is supported"
                } as CustomError)
            }
            const domain = await organizationRepository.getDomain(id)
            return res.status(200).json({ domain })
        }
        const organization = await organizationRepository.find(id)
        return res.status(200).json(organization)
    } catch (error) {
        res.status(500)
        return next(error)
    }
}

export default GetOrganizationRequestHandler
