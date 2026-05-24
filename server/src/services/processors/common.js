import fs from 'fs-extra';
import path from 'node:path';
import { createWriteStream } from 'node:fs';
import archiver from 'archiver';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { OUTPUT_DIR } from '../../config/env.js';
import { sanitizeBaseName } from '../../utils/file.js';
import { splitParagraphs, wrapText } from '../../utils/text.js';

export async function ensureJobOutputDir(jobId) {
  const dir = path.join(OUTPUT_DIR, jobId);
  await fs.ensureDir(dir);
  return dir;
}

export function buildOutputPath(jobId, baseName, extension) {
  const safeBaseName = sanitizeBaseName(baseName);
  return path.join(OUTPUT_DIR, jobId, `${safeBaseName}.${extension}`);
}

export function buildZipOutputPath(jobId, baseName) {
  return buildOutputPath(jobId, baseName, 'zip');
}

export function getDownloadUrl(filePath) {
  const relative = path.relative(OUTPUT_DIR, filePath);
  return `/downloads/${relative.split(path.sep).map(encodeURIComponent).join('/')}`;
}

export async function zipFiles({ outputPath, entries }) {
  await fs.ensureDir(path.dirname(outputPath));

  return new Promise((resolve, reject) => {
    const output = createWriteStream(outputPath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    output.on('close', () => resolve(outputPath));
    output.on('error', reject);
    archive.on('error', reject);
    archive.pipe(output);

    for (const entry of entries) {
      archive.file(entry.filePath, { name: entry.name });
    }

    archive.finalize();
  });
}

export async function createPdfFromText({ outputPath, title, text }) {
  const pdf = await PDFDocument.create();
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdf.embedFont(StandardFonts.HelveticaBold);
  const pageSize = [595.28, 841.89];
  const margin = 48;
  const maxWidth = pageSize[0] - margin * 2;
  const lineHeight = 16;
  let page = pdf.addPage(pageSize);
  let y = page.getHeight() - margin;

  page.drawText(title || 'Converted document', {
    x: margin,
    y,
    size: 22,
    font: boldFont,
    color: rgb(0.96, 0.98, 1),
  });
  y -= 34;

  const paragraphs = splitParagraphs(text);
  const list = paragraphs.length ? paragraphs : [''];

  for (const paragraph of list) {
    const lines = wrapText(paragraph, font, 12, maxWidth);
    for (const line of lines) {
      if (y < margin + lineHeight) {
        page = pdf.addPage(pageSize);
        y = page.getHeight() - margin;
      }

      page.drawText(line, {
        x: margin,
        y,
        size: 12,
        font,
        color: rgb(0.9, 0.95, 1),
      });
      y -= lineHeight;
    }

    y -= 8;
  }

  await fs.ensureDir(path.dirname(outputPath));
  const bytes = await pdf.save({ useObjectStreams: true });
  await fs.writeFile(outputPath, bytes);
  return outputPath;
}

export async function cleanupFiles(paths = []) {
  await Promise.allSettled(
    paths.filter(Boolean).map((filePath) => fs.remove(filePath)),
  );
}

