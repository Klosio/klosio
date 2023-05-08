import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import multer from 'multer';

import * as middlewares from './middlewares';
import MessageResponse from './interfaces/MessageResponse';

require('dotenv').config();

const app = express();

const upload = multer({ dest: 'uploads/' });

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());

app.get<{}, MessageResponse>('/', (req, res) => {
  res.json({
    message: '🐝',
  });
});

app.post<{}, MessageResponse>('/transcript', upload.single('file'), (req, res) => {
  console.log(req.file);
});

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

export default app;
