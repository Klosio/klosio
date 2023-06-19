import { Deepgram } from "@deepgram/sdk"
import dotenv from "dotenv"
import { NextFunction, Request, Response } from "express"
import { Configuration, OpenAIApi } from "openai"
import { searchEmbeddings } from "../../../util/embeddings"
import getEnvVar from "../../../util/env"
import supportedLanguages from "../../../util/supportedLanguages"

dotenv.config()

const deepgram_api_key = getEnvVar("DEEPGRAM_API_KEY")
const openai_api_key = getEnvVar("OPENAI_API_KEY")

const gptAnalysis = async (
    systemPrompt: string,
    transcript: string
): Promise<string> => {
    const configuration = new Configuration({
        apiKey: openai_api_key
    })
    const openai = new OpenAIApi(configuration)

    const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: transcript }
        ],
        max_tokens: 150
    })
    const gptresult = completion.data.choices[0].message?.content
    return gptresult || ""
}

const deepgramAnalysis = async (
    buffer: Buffer,
    language: string
): Promise<string> => {
    const deepgram = new Deepgram(deepgram_api_key)

    const response = await deepgram.transcription.preRecorded(
        { buffer, mimetype: "audio/wav" },
        {
            punctuate: true,
            model: "enhanced",
            language: supportedLanguages.get(language)
        }
    )
    const transcriptResult =
        response.results?.channels[0]?.alternatives[0]?.transcript
    return transcriptResult || ""
}

async function PostAnalysisRequestHandler(
    req: Request<{ language: string }>,
    res: Response,
    next: NextFunction
) {
    if (!req.params.language || !supportedLanguages.has(req.params.language)) {
        res.status(400)
        return next(new Error("No language specified in request params"))
    }
    if (!req.file) {
        res.status(400)
        return next(new Error("No audio file provided in the request"))
    }

    const deepgramResult = await deepgramAnalysis(
        req.file.buffer,
        req.params.language
    ).catch((err) => {
        console.log(err)
        res.status(400)
        return next(new Error("Error when calling the transcription API"))
    })

    console.log(deepgramResult)

    if (!deepgramResult) {
        res.status(400)
        return next(new Error("No transcript returned by the API"))
    }

    const result = await searchEmbeddings(
        deepgramResult,
        "6490abd1d7c08762406b5f16"
    )

    console.log(result)

    return res.status(200).json(result)

    // const option = await Option.findOne({ name: "prompt" }).exec()
    // const prompt =
    //     option?.value ||
    //     "En tant que vendeur dans l'industrie SAAS. Résume le contenu de la transcription de l'appel ci-dessus en mettant l'accent sur le problème ressenti par le client potentiel. La transcription du commercial et du client sont melanges. Il faut donc bien faire attention a ce que le resumé soit coherent."
    // const gptresult = await gptAnalysis(prompt, deepgramResult).catch((err) => {
    //     console.log(err)
    //     res.status(400)
    //     return next(new Error("Error when calling the ml API"))
    // })

    // if (!gptresult) {
    //     res.status(400)
    //     return next(new Error("No result returned by the ml API"))
    // }
}

export default PostAnalysisRequestHandler
