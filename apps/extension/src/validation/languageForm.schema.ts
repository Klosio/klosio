import { z } from "zod"

const languageFormSchema = z.object({
    country: z.string().min(2, { message: "Country is required" })
})

export { languageFormSchema }
