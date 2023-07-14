import { Deepgram } from "@deepgram/sdk"
import dotenv from "dotenv"
import { NextFunction, Request, Response } from "express"
import { Analysis } from "~/constants/analysis"
import CustomError from "~/types/CustomError"
import { searchEmbeddings } from "~/util/embeddings"
import getEnvVar from "~/util/env"
import supportedLanguages from "~/util/supportedLanguages"

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
        return next({
            code: "MISSING_PARAMETER",
            message: "No language specified in request params"
        } as CustomError)
    }
    if (!req.params.organizationId) {
        res.status(400)
        return next({
            code: "MISSING_PARAMETER",
            message: "No organization specified in request params"
        } as CustomError)
    }
    if (!req.file) {
        res.status(400)
        return next({
            code: "MISSING_PARAMETER",
            message: "No audio file provided in the request"
        } as CustomError)
    }

    try {
        const deepgramResult = await deepgramAnalysis(
            req.file.buffer,
            req.params.language
        )
        if (
            !deepgramResult ||
            deepgramResult.split(" ").length <= Analysis.MIN_WORDS
        ) {
            res.status(500)
            return next({
                code: "UNKNOWN",
                message: "No transcript returned by the API"
            } as CustomError)
        }
        const result = await searchEmbeddings(
            deepgramResult,
            req.params.organizationId
        )
        return res.status(200).json(result)
    } catch (error) {
        res.status(500)
        return next(error)
    }
}

export default PostAnalysisRequestHandler
