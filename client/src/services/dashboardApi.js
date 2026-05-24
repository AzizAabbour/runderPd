import api from './api';

export function fetchOverview() {
  return api.get('/dashboard/overview');
}

export function fetchHistory() {
  return api.get('/jobs');
}

export function fetchToolsList() {
  return api.get('/tools');
}

