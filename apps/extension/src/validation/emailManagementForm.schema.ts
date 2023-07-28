import { z } from "zod"

const emailManagementFormSchema = z.object({
    emails: z
        .array(
            z.object({
                email: z
                    .string()
                    .nonempty({ message: "Email is required" })
                    .email({ message: "Email is invalid" })
            })
        )
        .refine(
            (items) => {
                const emails = items.map((item) => item.email)
                return new Set(emails).size === emails.length
            },
            {
                message: "Duplicate email"
            }
        )
})

export { emailManagementFormSchema }
