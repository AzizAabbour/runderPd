import fs from 'fs-extra';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { buildOutputPath, buildZipOutputPath, ensureJobOutputDir, getDownloadUrl, zipFiles } from './common.js';
import { sanitizeBaseName } from '../../utils/file.js';
import { cleanupFiles } from './common.js';
import { ApiError } from '../../utils/ApiError.js';

function compressVideoFile({ inputPath, outputPath, quality, preset, onProgress }) {
  return new Promise((resolve, reject) => {
    const args = [
      '-y',
      '-i',
      inputPath,
      '-movflags',
      '+faststart',
      '-crf',
      String(Math.min(51, Math.max(18, Number(quality ?? 28)))),
      '-preset',
      preset || 'medium',
      outputPath,
    ];

    const command = spawn('ffmpeg', args, { windowsHide: true });

    command.stderr.on('data', (data) => {
      const text = data.toString();
      if (text.includes('time=')) {
        onProgress?.(45, 'Compressing video');
      }
    });

    command.on('error', (error) => {
      reject(
        new ApiError(
          500,
          error.code === 'ENOENT'
            ? 'ffmpeg is not installed or not available on PATH.'
            : 'Unable to start the video compressor.',
        ),
      );
    });

    command.on('close', (code) => {
      if (code === 0) {
        resolve(outputPath);
      } else {
        reject(new ApiError(500, 'ffmpeg exited with an error while compressing the video.'));
      }
    });
  });
}

export async function processVideoCompression({ files, jobId, options = {}, onProgress }) {
  await ensureJobOutputDir(jobId);
  const quality = Number(options.quality ?? 28);
  const preset = options.preset || 'medium';
  const outputFiles = [];

  for (let index = 0; index < files.length; index += 1) {
    const file = files[index];
    const outputPath = buildOutputPath(
      jobId,
      `${sanitizeBaseName(file.originalname)}-compressed`,
      'mp4',
    );
    await compressVideoFile({
      inputPath: file.path,
      outputPath,
      quality,
      preset,
      onProgress: (progress, message) => onProgress?.(progress, message),
    });
    outputFiles.push(outputPath);
    onProgress?.(25 + Math.round((index / Math.max(1, files.length)) * 60), 'Compressing videos');
  }

  if (outputFiles.length === 1) {
    return {
      outputPath: outputFiles[0],
      outputName: path.basename(outputFiles[0]),
      downloadUrl: getDownloadUrl(outputFiles[0]),
    };
  }

  const zipPath = buildZipOutputPath(jobId, 'compressed-videos');
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
