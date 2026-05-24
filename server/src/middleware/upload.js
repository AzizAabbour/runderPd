import multer from 'multer';
import fs from 'fs-extra';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { MAX_UPLOAD_SIZE_BYTES, UPLOAD_DIR } from '../config/env.js';
import { ApiError } from '../utils/ApiError.js';

await fs.ensureDir(UPLOAD_DIR);

const storage = multer.diskStorage({
  destination: async (_req, _file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${randomUUID()}${ext}`);
  },
});

function fileFilter(_req, file, cb) {
  const allowedPrefixes = ['image/', 'video/'];
  const allowedExact = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];

  if (allowedPrefixes.some((prefix) => file.mimetype.startsWith(prefix)) || allowedExact.includes(file.mimetype)) {
    cb(null, true);
    return;
  }

  cb(new ApiError(415, `Unsupported file type: ${file.originalname}`));
}

export const uploadFiles = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_UPLOAD_SIZE_BYTES,
    files: 20,
  },
}).array('files', 20);

