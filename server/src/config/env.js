import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..', '..');

export const ROOT_DIR = rootDir;
export const UPLOAD_DIR = path.join(rootDir, 'uploads');
export const OUTPUT_DIR = path.join(rootDir, 'outputs');
export const TEMP_DIR = path.join(rootDir, 'temp');
export const PORT = Number(process.env.PORT || 4000);
export const JWT_SECRET = process.env.JWT_SECRET || 'file-tools-dev-secret';
export const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
export const MAX_UPLOAD_SIZE_MB = Number(process.env.MAX_UPLOAD_SIZE_MB || 250);
export const MAX_UPLOAD_SIZE_BYTES = MAX_UPLOAD_SIZE_MB * 1024 * 1024;

