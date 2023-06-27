import { painpointRepository } from "../repository/painpointRepository"
import { EmbeddedPainpoint, Painpoint } from "../types/Painpoint"
import getEnvVar from "./env"
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

async function searchEmbeddings(
    question: string,
    organizationId: string
): Promise<EmbeddingResponse> {
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
    const embeddedPainpoints = await painpointRepository
        .findByMatchingEmbedding(embedding, organizationId)
        .catch((error) => console.error(error))

    if (!embeddedPainpoints) {
        return { status: "Sorry, I don't know how to help with that." }
    }

    const painpoints = embeddedPainpoints.map(
        (document) =>
            `Painpoint: ${document.painpoint}\nAnswer: ${document.answer}\n`
    )

    const prompt = `
    "Suivant la question posée, voici les réponses que tu pourrais donner à ton client :

    Question :
    ${question}
    
    Réponses possibles :
    ${painpoints}
    
    Réponds à ton client en fonction de ces réponses exclusivement. Si tu n'a pas suffisament d'information dans la question ou ne sais pas quoi répondre, ne repond rien.
    Retourne les réponses que tu as données à ton client, ainsi que le pain point que tu as utilisé reformulé sous forme d'une question simple.
    
    Renvoie la réponse dans un format JSON avec les clés 'question' et 'answer'. Si tu n'as pas répondu à la question, renvoie une réponse vide."
    `

    const completionResponse = await openai.createCompletion({
        model: "text-davinci-003",
        prompt,
        max_tokens: 512,
        temperature: 0
    })

    const {
        choices: [{ text }]
    } = completionResponse.data

    if (!text) {
        return { status: "Sorry, I don't know how to help with that." }
    }

    let response = {} as EmbeddingResponse

    try {
        response = { ...JSON.parse(text), status: "success" }
    } catch (error) {
        response = { status: "Sorry, I don't know how to help with that." }
    }

    return response
}

interface EmbeddingResponse {
    status: string
    question?: string
    answer?: string
}

export { generateEmbeddings, searchEmbeddings }
