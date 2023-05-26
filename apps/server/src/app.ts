import MessageResponse from './interfaces/MessageResponse';
import type TranscriptResponse from './interfaces/TranscriptReponse';
import * as middlewares from './middlewares';
import getEnvVar from './util/env';
import supportedLanguages from './util/supportedLanguages';
import { Deepgram } from '@deepgram/sdk';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import multer from 'multer';

require('dotenv').config();

const app = express();

const storage =
    getEnvVar('NODE_ENV') === 'development'
        ? { dest: 'uploads/' }
        : { storage: multer.memoryStorage() };
const upload = multer(storage);

const deepgram_api_key = getEnvVar('DEEPGRAM_API_KEY');

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());

app.get<{}, MessageResponse>('/health', (_, res) =>
    res.json({
        message: '🐝',
    })
);

app.post<{ language: string }, TranscriptResponse | MessageResponse>(
    '/transcript/:language',
    upload.single('file'),
    async (req, res) => {
        if (
            !req.params.language ||
            !supportedLanguages.has(req.params.language)
        ) {
            res.status(400).json({
                message: 'No language specified in request params',
            });
        }
        if (req.file) {
            const buffer = req.file.buffer;

            const deepgram = new Deepgram(deepgram_api_key);

            deepgram.transcription
                .preRecorded(
                    { buffer, mimetype: 'audio/wav' },
                    {
                        punctuate: true,
                        model: 'enhanced',
                        language: supportedLanguages.get(req.params.language),
                    }
                )
                .then((response) => {
                    const transcript =
                        response.results?.channels[0]?.alternatives[0]
                            ?.transcript;
                    if (!transcript) {
                        res.status(400).json({
                            message: 'No transcript returned by the API',
                        });
                    } else {
                        res.status(200).json({ transcript });
                    }
                })
                .catch((err) => {
                    console.log(err);
                    res.status(400).json({
                        message: 'Error when calling the API',
                    });
                });
        } else {
            res.status(400).json({
                message: 'No audio file provided in the request',
            });
        }
    }
);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

export default app;
