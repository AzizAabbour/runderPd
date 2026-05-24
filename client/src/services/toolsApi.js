import api from './api';

export function submitToolJob(toolId, formData, config = {}) {
  return api.post(`/tools/${toolId}/process`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    ...config,
  });
}

export function fetchJob(jobId) {
  return api.get(`/jobs/${jobId}`);
}

export function fetchRecentJobs() {
  return api.get('/jobs');
}

export function fetchSupportedTools() {
  return api.get('/tools');
}

