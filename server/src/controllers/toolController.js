import fs from 'fs-extra';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { matchesPattern } from '../utils/file.js';
import { getToolById, serializeTool, tools } from '../data/tools.js';
import { createJob, updateJob } from '../services/jobStore.js';
import { processToolJob } from '../services/processors/index.js';

function parseOptions(rawOptions) {
  if (!rawOptions) return {};
  if (typeof rawOptions === 'object') return rawOptions;
  try {
    return JSON.parse(rawOptions);
  } catch {
    return {};
  }
}

function validateFilesForTool(tool, files) {
  if (!files?.length) {
    throw new ApiError(400, 'Please upload at least one file.');
  }

  if ((tool.minFiles ?? 1) > files.length) {
    throw new ApiError(400, `This tool requires at least ${tool.minFiles ?? 1} file(s).`);
  }

  const invalid = files.find((file) => !matchesPattern(file, tool.accept));
  if (invalid) {
    throw new ApiError(415, `Unsupported file type for ${tool.title}: ${invalid.originalname}`);
  }
}

async function scheduleProcessing({ jobId, tool, files, options, userId }) {
  try {
    updateJob(jobId, {
      status: 'processing',
      progress: 8,
      message: 'Preparing files',
    });

    const result = await processToolJob({
      tool,
      files,
      options,
      jobId,
      onProgress: (progress, message) => {
        updateJob(jobId, {
          progress,
          message,
        });
      },
    });

    const outputStats = await fs.stat(result.outputPath);

    updateJob(jobId, {
      status: 'complete',
      progress: 100,
      message: 'Download ready',
      outputSize: outputStats.size,
      downloadUrl: result.downloadUrl,
      outputName: result.outputName,
      responseName: result.outputName,
    });
  } catch (error) {
    updateJob(jobId, {
      status: 'failed',
      progress: 100,
      message: 'Processing failed',
      error: error.message || 'Unable to process file.',
    });
  } finally {
    await Promise.allSettled(files.map((file) => fs.remove(file.path)));
  }
}

export const listTools = asyncHandler(async (_req, res) => {
  res.json({
    success: true,
    tools: tools.map(serializeTool),
  });
});

export const processTool = asyncHandler(async (req, res) => {
  const tool = getToolById(req.params.toolId);
  if (!tool) {
    throw new ApiError(404, 'Tool not found.');
  }

  const files = req.files ?? [];
  validateFilesForTool(tool, files);
  const options = parseOptions(req.body.options);
  const originalSize = files.reduce((sum, file) => sum + (file.size ?? 0), 0);
  const job = createJob({
    userId: req.user.id,
    toolId: tool.id,
    toolTitle: tool.title,
    fileName: files.map((file) => file.originalname).join(', '),
    originalSize,
    files: files.map((file) => ({
      name: file.originalname,
      size: file.size,
      type: file.mimetype,
    })),
    options,
  });

  setImmediate(() => {
    scheduleProcessing({
      jobId: job.id,
      tool,
      files,
      options,
      userId: req.user.id,
    });
  });

  res.status(202).json({
    success: true,
    job: {
      ...job,
      status: 'processing',
      progress: 8,
      message: 'Processing started',
    },
  });
});
