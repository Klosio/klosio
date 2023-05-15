import MessageResponse from './interfaces/MessageResponse';
import type TranscriptResponse from './interfaces/TranscriptReponse';
import * as middlewares from './middlewares';
import getEnvVar from './util/env';
import { Deepgram } from '@deepgram/sdk';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import multer from 'multer';

require('dotenv').config();

const app = express();

const storage = getEnvVar('NODE_ENV') === 'development' ? { dest: 'uploads/' } : { storage: multer.memoryStorage()};
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

app.post<{}, TranscriptResponse | MessageResponse>(
    '/transcript',
    upload.single('file'),
    async (req, res) => {
        if (req.file) {
            const buffer = req.file.buffer;

            const deepgram = new Deepgram(deepgram_api_key);

            deepgram.transcription
                .preRecorded(
                    { buffer, mimetype: 'audio/wav' },
                    { punctuate: true, model: 'enhanced', language: 'fr' }
                )
                .then((response) => {
                    const transcript =
                        response.results?.channels[0]?.alternatives[0]
                            ?.transcript;
                    if (!transcript) {
                        res.status(400).json({ message: 'No transcript' });
                        return;
                    } else {
                        res.status(200).json({ transcript });
                    }
                })
                .catch((err) => {
                    console.log(err);
                    res.status(400).json({ message: 'Error' });
                });
        } else {
            res.status(400).json({ message: 'No file uploaded' });
        }
    }
);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

export default app;
