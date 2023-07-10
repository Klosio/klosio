import { z } from "zod"

const optionsFormSchema = z.object({
    prompt: z.string().nonempty({ message: "The prompt is required" }),
    match_threshold: z
        .string()
        .nonempty({ message: "The match threshold is required" })
})

export { optionsFormSchema }
