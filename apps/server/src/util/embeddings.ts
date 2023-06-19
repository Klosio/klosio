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

async function getEmbeddings(organization_id: string): Promise<Painpoint[]> {
    const { data } = await supabaseClient
        .from("painpoints")
        .select("painpoint, answer")
        .eq("organization_id", organization_id)
    return data as Painpoint[]
}

async function searchEmbeddings(
    question: string,
    organization_id: string
): Promise<string> {
    // OpenAI recommends replacing newlines with spaces for best results
    const input = question.replace(/\n/g, " ")

    const configuration = new Configuration({ apiKey: openApiKey })
    const openai = new OpenAIApi(configuration)

    // Generate a one-time embedding for the query itself
    const embeddingResponse = await openai.createEmbedding({
        model: "text-embedding-ada-002",
        input
    })

    const [{ embedding }] = embeddingResponse.data.data

    // In production we should handle possible errors
    const { data: documents, error } = await supabaseClient.rpc(
        "match_painpoints",
        {
            query_embedding: embedding,
            match_threshold: 0.78, // Choose an appropriate threshold for your data
            match_count: 3, // Choose the number of matches
            organization_id
        }
    )

    if (!documents) {
        return "Sorry, I don't know how to help with that."
    }

    console.log(error)

    const painpoints = (documents as Painpoint[]).map(
        (document) =>
            `Painpoint: ${document.painpoint}\nAnswer: ${document.answer}\n`
    )

    const prompt = `
        Suivant la question posée, voici les réponses que tu devrais donner à ton client:

        Question:
        ${question}

        Reponses possibles:
        ${painpoints}
    
        Repond uniquement avec la reponse n'hesite pas a reformuler pour que ton client comprenne bien.
    `

    // In production we should handle possible errors
    const completionResponse = await openai.createCompletion({
        model: "text-davinci-003",
        prompt,
        max_tokens: 512, // Choose the max allowed tokens in completion
        temperature: 0 // Set to 0 for deterministic results
    })

    const {
        choices: [{ text }]
    } = completionResponse.data

    return text || "Sorry, I don't know how to help with that."
}

export { generateEmbeddings, searchEmbeddings }
