import { z } from "zod"

const businessContextSchema = z.object({
    industry: z
        .string()
        .min(1, "Industry must be more than 1 character")
        .max(50, "Industry must be less than 50 characters"),
    selling: z
        .string()
        .min(1, "Selling must be more than 1 character")
        .max(50, "Selling must be less than 50 characters"),
    target: z
        .string()
        .min(1, "Target must be more than 1 character")
        .max(100, "Target must be less than 100 characters")
})

export { businessContextSchema }
