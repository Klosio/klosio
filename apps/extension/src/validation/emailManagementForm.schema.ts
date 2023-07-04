import { z } from "zod"

const emailManagementFormSchema = z.object({
    domain: z
        .string()
        .regex(
            new RegExp(
                /^(?!-)[A-Za-z0-9-]+([\-\.]{1}[a-z0-9]+)*\.[A-Za-z]{2,6}$/
            ),
            "The domain is invalid"
        )
        .nonempty("The domain is required")
})

export { emailManagementFormSchema }
