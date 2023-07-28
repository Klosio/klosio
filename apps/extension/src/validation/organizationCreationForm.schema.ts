import { z } from "zod"

const organizationCreationFormSchema = z.object({
    name: z.string().nonempty({ message: "The name is required" })
})

export { organizationCreationFormSchema }
