import { randomUUID } from 'node:crypto';

const jobs = new Map();

function sortJobsByNewest(values) {
  return [...values].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
}

export function createJob(data) {
  const now = new Date().toISOString();
  const job = {
    id: randomUUID(),
    userId: data.userId,
    toolId: data.toolId,
    toolTitle: data.toolTitle,
    fileName: data.fileName,
    originalSize: data.originalSize ?? 0,
    outputSize: 0,
    status: 'queued',
    progress: 0,
    message: 'Queued for processing',
    downloadUrl: '',
    outputName: '',
    error: null,
    createdAt: now,
    updatedAt: now,
    files: data.files ?? [],
    options: data.options ?? {},
  };

  jobs.set(job.id, job);
  return job;
}

export function updateJob(jobId, updates) {
  const current = jobs.get(jobId);
  if (!current) return null;

  const next = {
    ...current,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  jobs.set(jobId, next);
  return next;
}

export function getJob(jobId) {
  return jobs.get(jobId) ?? null;
}

export function listJobsByUser(userId) {
  return sortJobsByNewest(
    [...jobs.values()].filter((job) => job.userId === userId),
  );
}

export function getOverviewForUser(userId) {
  const userJobs = listJobsByUser(userId);
  const total = userJobs.length;
  const completed = userJobs.filter((job) => job.status === 'complete').length;
  const failed = userJobs.filter((job) => job.status === 'failed').length;
  const activeJobs = userJobs.filter((job) => ['queued', 'processing'].includes(job.status)).length;
  const bytesSaved = userJobs
    .filter((job) => job.status === 'complete')
    .reduce((sum, job) => sum + Math.max(0, (job.originalSize ?? 0) - (job.outputSize ?? 0)), 0);
  const successRate = total ? Math.round((completed / total) * 100) : 0;

  const usageMap = new Map();
  userJobs.forEach((job) => {
    usageMap.set(job.toolTitle ?? job.toolId, (usageMap.get(job.toolTitle ?? job.toolId) ?? 0) + 1);
  });
  const usage = [...usageMap.entries()]
    .slice(0, 4)
    .map(([label, count]) => ({
      label,
      value: total ? Math.max(4, Math.round((count / total) * 100)) : 0,
    }));

  if (!usage.length) {
    usage.push(
      { label: 'Images', value: 0 },
      { label: 'PDF', value: 0 },
      { label: 'Video', value: 0 },
      { label: 'Conversion', value: 0 },
    );
  }

  return {
    totalFiles: total,
    bytesSaved,
    activeJobs,
    successRate,
    failedJobs: failed,
    usage,
    recentJobs: userJobs.slice(0, 8),
  };
}
