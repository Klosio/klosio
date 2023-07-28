import { z } from "zod"

const loginFormSchema = z.object({
    email: z
        .string()
        .nonempty({ message: "The email is required" })
        .email({ message: "The email is invalid" }),
    password: z.string().nonempty({ message: "The password is required" }),
    remember: z.boolean().optional()
})

export { loginFormSchema }
