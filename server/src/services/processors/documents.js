import fs from 'fs-extra';
import path from 'node:path';
import mammoth from 'mammoth';
import { sanitizeBaseName } from '../../utils/file.js';
import { buildOutputPath, createPdfFromText, ensureJobOutputDir, getDownloadUrl } from './common.js';

export async function processWordToPdf({ files, jobId, options = {}, onProgress }) {
  await ensureJobOutputDir(jobId);
  const file = files[0];
  const extracted = await mammoth.extractRawText({ path: file.path });
  const outputPath = buildOutputPath(jobId, `${sanitizeBaseName(file.originalname)}-converted`, 'pdf');
  await createPdfFromText({
    outputPath,
    title: sanitizeBaseName(file.originalname),
    text: extracted.value,
  });

  onProgress?.(85, 'Converted Word to PDF');

  return {
    outputPath,
    outputName: path.basename(outputPath),
    downloadUrl: getDownloadUrl(outputPath),
  };
}

