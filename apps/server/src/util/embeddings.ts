import { EmbeddedPainpoint, Painpoint } from "../types/Painpoint"
import getEnvVar from "./env"
import { supabaseClient } from "./supabase"
import { Configuration, OpenAIApi } from "openai"

const openApiKey = getEnvVar("OPENAI_API_KEY")

async function generateEmbeddings(
    painpoints: Painpoint[],
    organization_id: string
): Promise<EmbeddedPainpoint[]> {
    const configuration = new Configuration({ apiKey: openApiKey })
    const openAi = new OpenAIApi(configuration)

    const embeddedPainpoint = painpoints.map(async (painpoint) => {
        const input = painpoint.answer.replace(/\n/g, " ")

        const embeddingResponse = await openAi.createEmbedding({
            model: "text-embedding-ada-002",
            input
        })

        const [{ embedding }] = embeddingResponse.data.data

        return {
            ...painpoint,
            organization_id,
            embedding
        }
    })

    return await Promise.all(embeddedPainpoint)
}

export { generateEmbeddings }
