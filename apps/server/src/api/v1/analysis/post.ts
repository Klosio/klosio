import { searchEmbeddings } from "../../../util/embeddings"
import getEnvVar from "../../../util/env"
import supportedLanguages from "../../../util/supportedLanguages"
import { Deepgram } from "@deepgram/sdk"
import dotenv from "dotenv"
import { NextFunction, Request, Response } from "express"

dotenv.config()

const deepgram_api_key = getEnvVar("DEEPGRAM_API_KEY")

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
    req: Request<{ language: string; organizationId: string }>,
    res: Response,
    next: NextFunction
) {
    if (!req.params.language || !supportedLanguages.has(req.params.language)) {
        res.status(400)
        return next(new Error("No language specified in request params"))
    }
    if (!req.params.organizationId) {
        res.status(400)
        return next(new Error("No organization specified in request params"))
    }
    if (!req.file) {
        res.status(400)
        return next(new Error("No audio file provided in the request"))
    }

    const deepgramResult = await deepgramAnalysis(
        req.file.buffer,
        req.params.language
    ).catch((err) => {
        console.error(err)
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
        req.params.organizationId
    )

    console.log(result)

    return res.status(200).json(result)
}

export default PostAnalysisRequestHandler
