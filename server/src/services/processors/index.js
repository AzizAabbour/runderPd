import fs from 'fs-extra';
import { ApiError } from '../../utils/ApiError.js';
import { getExtension } from '../../utils/file.js';
import {
  processImageCompression,
  processImageConversion,
  processImagesToPdf,
  processResizeImages,
} from './image.js';
import {
  processMergePdf,
  processPdfCompression,
  processPdfToWord,
  processRemovePdfPages,
  processSplitPdf,
} from './pdf.js';
import { processWordToPdf } from './documents.js';
import { processVideoCompression } from './video.js';

function getFileKind(file) {
  const mime = file.mimetype || '';
  const extension = getExtension(file.originalname);

  if (mime.startsWith('image/') || ['jpg', 'jpeg', 'png', 'webp', 'gif', 'avif'].includes(extension)) {
    return 'image';
  }

  if (mime === 'application/pdf' || extension === 'pdf') {
    return 'pdf';
  }

  if (mime.startsWith('video/') || ['mp4', 'mov', 'mkv', 'webm', 'avi'].includes(extension)) {
    return 'video';
  }

  if (
    extension === 'docx' ||
    mime === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ) {
    return 'docx';
  }

  return 'unknown';
}

function assertSameKind(files) {
  const kinds = new Set(files.map(getFileKind));
  if (kinds.size > 1) {
    throw new ApiError(
      400,
      'Mixed file types are not supported for this tool. Please upload files of the same kind.',
    );
  }
}

function normalizeTargetFormat(value) {
  return String(value || 'auto').toLowerCase();
}

async function processFileConversion({ files, jobId, options, onProgress }) {
  assertSameKind(files);
  const kind = getFileKind(files[0]);
  const targetFormat = normalizeTargetFormat(options.targetFormat);

  if (files.length > 1 && !['image', 'video'].includes(kind)) {
    throw new ApiError(
      400,
      'Batch conversion is supported for images and videos only in the generic converter.',
    );
  }

  if (kind === 'image') {
    if (targetFormat === 'auto' || targetFormat === 'pdf') {
      return processImagesToPdf({ files, jobId, options, onProgress });
    }

    if (['png', 'jpg', 'jpeg', 'webp'].includes(targetFormat)) {
      return processImageConversion({
        files,
        jobId,
        options,
        outputFormat: targetFormat,
        onProgress,
      });
    }
  }

  if (kind === 'pdf') {
    if (targetFormat === 'auto' || targetFormat === 'docx') {
      return processPdfToWord({ files, jobId, options, onProgress });
    }

    if (targetFormat === 'pdf') {
      return processPdfCompression({ files, jobId, options, onProgress });
    }
  }

  if (kind === 'docx') {
    if (targetFormat === 'auto' || targetFormat === 'pdf') {
      return processWordToPdf({ files, jobId, options, onProgress });
    }
  }

  if (kind === 'video') {
    return processVideoCompression({ files, jobId, options, onProgress });
  }

  throw new ApiError(
    400,
    'This file combination is not supported by the generic conversion tool.',
  );
}

export async function processToolJob({ tool, files, options = {}, jobId, onProgress }) {
  onProgress?.(12, 'Validating files');

  switch (tool.process) {
    case 'imageCompression':
      return processImageCompression({ files, jobId, options, onProgress });
    case 'pdfCompression':
      return processPdfCompression({ files, jobId, options, onProgress });
    case 'videoCompression':
      return processVideoCompression({ files, jobId, options, onProgress });
    case 'fileConversion':
      return processFileConversion({ files, jobId, options, onProgress });
    case 'pdfToWord':
      return processPdfToWord({ files, jobId, options, onProgress });
    case 'wordToPdf':
      return processWordToPdf({ files, jobId, options, onProgress });
    case 'imageConvert':
      return processImageConversion({
        files,
        jobId,
        options,
        outputFormat: tool.outputFormat,
        onProgress,
      });
    case 'mergePdf':
      return processMergePdf({ files, jobId, options, onProgress });
    case 'splitPdf':
      return processSplitPdf({ files, jobId, options, onProgress });
    case 'removePdfPages':
      return processRemovePdfPages({ files, jobId, options, onProgress });
    case 'resizeImages':
      return processResizeImages({ files, jobId, options, onProgress });
    case 'imagesToPdf':
      return processImagesToPdf({ files, jobId, options, onProgress });
    default:
      throw new ApiError(501, `Processor not implemented for ${tool.process}.`);
  }
}
