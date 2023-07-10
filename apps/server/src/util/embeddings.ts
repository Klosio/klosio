import { businessContextRepository } from "../repository/businessContextRepository"
import { optionRepository } from "../repository/optionRepository"
import { painpointRepository } from "../repository/painpointRepository"
import { EmbeddedPainpoint, Painpoint } from "../types/Painpoint"
import getEnvVar from "./env"
import { PromptVariables, getPrompt } from "./prompt"
import { Configuration, OpenAIApi } from "openai"
import { Analysis } from "~/constants/analysis"

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
    const defaultResponse = {
        status: "Sorry, I don't know how to help with that."
    }
    const wordCount = question.split(" ").length

    if (wordCount <= Analysis.MIN_WORDS) {
        return defaultResponse
    }
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
    const embeddedPainpointsPromise =
        painpointRepository.findByMatchingEmbedding(embedding, organizationId)
    const businessContextsPromise =
        businessContextRepository.findByOrganization(organizationId)
    const optionPromise = optionRepository.findByName("prompt")
    const results = await Promise.all([
        embeddedPainpointsPromise,
        businessContextsPromise,
        optionPromise
    ]).catch((error) => console.error(error))

    if (!results) {
        return defaultResponse
    }

    const [embeddedPainpoints, businessContexts, option] = results

    if (!businessContexts || !businessContexts.length) {
        console.error(
            `Business context for organization ${organizationId} not found`
        )
        return { status: "Sorry, I don't know how to help with that." }
    }

    if (!embeddedPainpoints || !embeddedPainpoints.length) {
        console.log(`no pain points for ${organizationId}`)
        return defaultResponse
    }

    if (businessContexts.length > 1) {
        console.error(
            `Multiple business contexts per organization not supported for now, taking the first found for organization ${organizationId}`
        )
    }

    const painpoints = embeddedPainpoints
        .map(
            (document: { painpoint: any; answer: any }) =>
                `Painpoint: ${document.painpoint}\nAnswer: ${document.answer}\n`
        )
        .join("")

    const variables: PromptVariables = {
        ...businessContexts[0],
        question,
        painpoints
    }

    const prompt = getPrompt(option?.value, variables)

    const completionResponse = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{ role: "system", content: prompt }],
        max_tokens: 512,
        temperature: 0.8
    })

    const text = completionResponse.data.choices[0].message?.content

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
