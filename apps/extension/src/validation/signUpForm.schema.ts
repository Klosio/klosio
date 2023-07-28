import { z } from "zod"

const signUpFormSchema = z.object({
    email: z
        .string()
        .nonempty({ message: "The email is required" })
        .email({ message: "The email is invalid" }),
    password: z
        .string()
        .nonempty({ message: "The password is required" })
        .min(12, { message: "The password must be at least 12 characters" })
})

export { signUpFormSchema }
