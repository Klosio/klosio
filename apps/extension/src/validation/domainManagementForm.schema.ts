import { z } from "zod"

const domainManagementFormSchema = z.object({
    domain: z
        .string()
        .nonempty("The domain is required")
        .regex(
            new RegExp(
                /^(?!-)[A-Za-z0-9-]+([\-\.]{1}[a-z0-9]+)*\.[A-Za-z]{2,6}$/
            ),
            "The domain is invalid"
        )
})

export { domainManagementFormSchema }
