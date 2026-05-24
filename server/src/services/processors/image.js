import fs from 'fs-extra';
import path from 'node:path';
import sharp from 'sharp';
import { PDFDocument } from 'pdf-lib';
import { ApiError } from '../../utils/ApiError.js';
import { buildOutputPath, buildZipOutputPath, ensureJobOutputDir, getDownloadUrl, zipFiles } from './common.js';
import { getExtension, sanitizeBaseName } from '../../utils/file.js';
import { sleep } from '../../utils/file.js';
import { cleanupFiles } from './common.js';

function normalizeImageFormat(format, file) {
  const desired = String(format || '').toLowerCase();
  if (desired === 'jpeg') return 'jpeg';
  if (desired === 'jpg') return 'jpeg';
  if (desired === 'png') return 'png';
  if (desired === 'webp') return 'webp';

  const extension = getExtension(file.originalname);
  if (extension === 'jpg' || extension === 'jpeg') return 'jpeg';
  if (extension === 'png') return 'png';
  if (extension === 'webp') return 'webp';
  return 'webp';
}

async function writeImageToFormat({ file, outputPath, format, quality, resize, onProgress }) {
  let pipeline = sharp(file.path).rotate();

  if (resize) {
    pipeline = pipeline.resize({
      width: resize.width || undefined,
      height: resize.height || undefined,
      fit: resize.fit || 'contain',
      withoutEnlargement: true,
    });
  }

  if (format === 'jpeg') {
    await pipeline.flatten({ background: '#ffffff' }).jpeg({ quality, mozjpeg: true }).toFile(outputPath);
  } else if (format === 'png') {
    await pipeline.png({ compressionLevel: 9, adaptiveFiltering: true }).toFile(outputPath);
  } else {
    await pipeline.webp({ quality }).toFile(outputPath);
  }

  onProgress?.();
  return outputPath;
}

async function processImageFilesAsZip({ files, outputNameBase, jobId, format, quality, resize, onProgress }) {
  const outputDir = await ensureJobOutputDir(jobId);
  const convertedFiles = [];

  for (let index = 0; index < files.length; index += 1) {
    const file = files[index];
    const targetFormat = normalizeImageFormat(format, file);
    const baseName = sanitizeBaseName(file.originalname);
    const outputPath = path.join(outputDir, `${baseName}-converted.${targetFormat === 'jpeg' ? 'jpg' : targetFormat}`);
    await writeImageToFormat({ file, outputPath, format: targetFormat, quality, resize });
    onProgress?.(35 + Math.round((index / Math.max(1, files.length)) * 45), 'Converting images');
    convertedFiles.push({
      filePath: outputPath,
      name: path.basename(outputPath),
    });
  }

  const zipPath = buildZipOutputPath(jobId, outputNameBase);
  await zipFiles({ outputPath: zipPath, entries: convertedFiles });
  await cleanupFiles(convertedFiles.map((entry) => entry.filePath));
  return zipPath;
}

export async function processImageCompression({
  files,
  jobId,
  options = {},
  onProgress,
}) {
  await ensureJobOutputDir(jobId);
  const quality = Number(options.quality ?? 78);
  const outputFiles = [];

  for (let index = 0; index < files.length; index += 1) {
    const file = files[index];
    const targetFormat = normalizeImageFormat(null, file);
    const extension = targetFormat === 'jpeg' ? 'jpg' : targetFormat;
    const outputPath = buildOutputPath(jobId, `${sanitizeBaseName(file.originalname)}-compressed`, extension);
    await writeImageToFormat({
      file,
      outputPath,
      format: targetFormat,
      quality,
      resize: null,
      onProgress: () => onProgress?.(20 + Math.round((index / Math.max(1, files.length)) * 50), 'Compressing images'),
    });
    outputFiles.push(outputPath);
  }

  if (outputFiles.length === 1) {
    return {
      outputPath: outputFiles[0],
      outputName: path.basename(outputFiles[0]),
      downloadUrl: getDownloadUrl(outputFiles[0]),
    };
  }

  const zipPath = buildZipOutputPath(jobId, 'compressed-images');
  await zipFiles({
    outputPath: zipPath,
    entries: outputFiles.map((filePath) => ({ filePath, name: path.basename(filePath) })),
  });
  await cleanupFiles(outputFiles);

  return {
    outputPath: zipPath,
    outputName: path.basename(zipPath),
    downloadUrl: getDownloadUrl(zipPath),
  };
}

export async function processImageConversion({
  files,
  jobId,
  options = {},
  outputFormat,
  onProgress,
}) {
  await ensureJobOutputDir(jobId);
  const targetFormat = String(outputFormat || options.targetFormat || 'png').toLowerCase();
  const quality = Number(options.quality ?? 82);

  if (files.length > 1) {
    const zipPath = await processImageFilesAsZip({
      files,
      outputNameBase: `${sanitizeBaseName(files[0].originalname)}-${targetFormat}`,
      jobId,
      format: targetFormat,
      quality,
      resize: null,
      onProgress,
    });
    return {
      outputPath: zipPath,
      outputName: path.basename(zipPath),
      downloadUrl: getDownloadUrl(zipPath),
    };
  }

  const file = files[0];
  const normalizedFormat = normalizeImageFormat(targetFormat, file);
  const extension = normalizedFormat === 'jpeg' ? 'jpg' : normalizedFormat;
  const outputPath = buildOutputPath(jobId, `${sanitizeBaseName(file.originalname)}-converted`, extension);

  await writeImageToFormat({
    file,
    outputPath,
    format: normalizedFormat,
    quality,
    resize: null,
    onProgress: () => onProgress?.(55, 'Converting image'),
  });

  return {
    outputPath,
    outputName: path.basename(outputPath),
    downloadUrl: getDownloadUrl(outputPath),
  };
}

export async function processResizeImages({
  files,
  jobId,
  options = {},
  onProgress,
}) {
  await ensureJobOutputDir(jobId);
  const resize = {
    width: options.width ? Number(options.width) : undefined,
    height: options.height ? Number(options.height) : undefined,
    fit: options.fit || 'contain',
  };
  const quality = Number(options.quality ?? 84);
  const outputPaths = [];

  for (let index = 0; index < files.length; index += 1) {
    const file = files[index];
    const extension = getExtension(file.originalname) || 'png';
    const outputPath = buildOutputPath(jobId, `${sanitizeBaseName(file.originalname)}-resized`, extension);
    await writeImageToFormat({
      file,
      outputPath,
      format: normalizeImageFormat(null, file),
      quality,
      resize,
      onProgress: () => onProgress?.(25 + Math.round((index / Math.max(1, files.length)) * 55), 'Resizing images'),
    });
    outputPaths.push(outputPath);
  }

  if (outputPaths.length === 1) {
    return {
      outputPath: outputPaths[0],
      outputName: path.basename(outputPaths[0]),
      downloadUrl: getDownloadUrl(outputPaths[0]),
    };
  }

  const zipPath = buildZipOutputPath(jobId, 'resized-images');
  await zipFiles({
    outputPath: zipPath,
    entries: outputPaths.map((filePath) => ({ filePath, name: path.basename(filePath) })),
  });
  await cleanupFiles(outputPaths);

  return {
    outputPath: zipPath,
    outputName: path.basename(zipPath),
    downloadUrl: getDownloadUrl(zipPath),
  };
}

export async function processImagesToPdf({
  files,
  jobId,
  options = {},
  onProgress,
}) {
  await ensureJobOutputDir(jobId);
  const pdf = await PDFDocument.create();
  const outputPath = buildOutputPath(jobId, `${sanitizeBaseName(files[0].originalname)}-images`, 'pdf');

  for (let index = 0; index < files.length; index += 1) {
    const file = files[index];
    const buffer = await sharp(file.path).rotate().png().toBuffer();
    const image = await pdf.embedPng(buffer);
    const page = pdf.addPage([image.width, image.height]);
    const width = page.getWidth();
    const height = page.getHeight();
    page.drawImage(image, {
      x: 0,
      y: 0,
      width,
      height,
    });
    onProgress?.(30 + Math.round((index / Math.max(1, files.length)) * 45), 'Building PDF');
  }

  await fs.writeFile(outputPath, await pdf.save({ useObjectStreams: true }));
  return {
    outputPath,
    outputName: path.basename(outputPath),
    downloadUrl: getDownloadUrl(outputPath),
  };
}
