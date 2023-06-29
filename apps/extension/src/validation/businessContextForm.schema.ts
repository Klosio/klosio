import { z } from "zod"

const MAX_FILE_SIZE = 500000
const ACCEPTED_FILE_TYPES = ["text/csv"]

const businessContextFormSchema = z.object({
    industry: z
        .string()
        .min(1, "Your industry is required")
        .max(50, "Your industry must be less than 50 characters"),
    selling: z
        .string()
        .min(1, "The product / service is required")
        .max(50, "The product / service must be less than 50 characters"),
    target: z
        .string()
        .min(1, "The target audience is required")
        .max(100, "The target audience must be less than 100 characters"),
    battlecards: z
        .any()
        .refine(
            (files) => files?.length == 1,
            "Your battlecards are required. Please upload them as a .csv file."
        )
        .refine(
            (files) => files?.[0]?.size <= MAX_FILE_SIZE,
            "Max file size is 5MB."
        )
        .refine(
            (files) => ACCEPTED_FILE_TYPES.includes(files?.[0]?.type),
            "Only .csv files are accepted."
        )
})

export { businessContextFormSchema }
