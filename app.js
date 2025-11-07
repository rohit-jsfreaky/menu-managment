import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

import apiRoutes from './routes/index.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFound.js';
import { errorResponse } from './utils/response.js';

const app = express();

app.set('trust proxy', 1);

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(morgan('combined'));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: errorResponse('Too many requests, please try again later.')
});

app.use('/api', limiter);
app.use('/api', apiRoutes);

app.get('/', (req, res) => {
  return res.send('Hello, this is the Menu Management API.');
});

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
