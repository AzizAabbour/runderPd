import { ApiError } from '../utils/ApiError.js';
import { getJob, listJobsByUser } from '../services/jobStore.js';

export function listJobs(req, res) {
  const jobs = listJobsByUser(req.user.id);
  res.json({ success: true, jobs });
}

export function getSingleJob(req, res) {
  const job = getJob(req.params.jobId);
  if (!job || job.userId !== req.user.id) {
    throw new ApiError(404, 'Job not found.');
  }

  res.json({ success: true, job });
}

