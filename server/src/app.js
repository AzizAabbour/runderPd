import express from 'express';
import cors from 'cors';
import compression from 'compression';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import fs from 'fs-extra';
import path from 'node:path';
import { FRONTEND_URL, OUTPUT_DIR, TEMP_DIR } from './config/env.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import healthRoutes from './routes/healthRoutes.js';
import authRoutes from './routes/authRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import toolRoutes from './routes/toolRoutes.js';

await fs.ensureDir(OUTPUT_DIR);
await fs.ensureDir(TEMP_DIR);

export const app = express();

app.use(helmet());
app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: false,
  }),
);
app.use(compression());
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(
  '/api',
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 200,
    standardHeaders: true,
    legacyHeaders: false,
  }),
);

app.use('/downloads', express.static(OUTPUT_DIR, { fallthrough: false }));

app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/tools', toolRoutes);

app.get('/api', (_req, res) => {
  res.json({
    success: true,
    message: 'File Tools API is running.',
  });
});

app.use(notFoundHandler);
app.use(errorHandler);

