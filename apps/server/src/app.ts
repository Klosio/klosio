import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import multer from 'multer';
import fs from 'fs';

import * as middlewares from './middlewares';
import MessageResponse from './interfaces/MessageResponse';
import { Deepgram } from '@deepgram/sdk';

require('dotenv').config();

const app = express();

const storage = multer.memoryStorage();
const upload = multer({ storage });

const deepgram_api_key = process.env.DEEPGRAM_API_KEY || "";

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());

app.get<{}, MessageResponse>('/', (req, res) => {
  res.json({
    message: '🐝',
  });
});

app.post<{}, MessageResponse>('/transcript', upload.single('file'), async (req, res) => {
  if (req.file) {
    const buffer = req.file.buffer;
    const deepgram = new Deepgram(deepgram_api_key);
  
    const data = await deepgram.transcription.preRecorded(
      { buffer: buffer, mimetype: 'audio/wav'},
      { punctuate: true, model: 'enhanced', language: 'fr' },
    )
    console.log(data.results?.channels[0].alternatives[0].transcript);
  } 
});


app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

export default app;
