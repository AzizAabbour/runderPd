import { useEffect, useState } from 'react';
import { fetchJob } from '@/services/toolsApi';

export function useJobPolling(jobId, enabled = true) {
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(Boolean(jobId && enabled));
  const [error, setError] = useState('');

  useEffect(() => {
    if (!jobId || !enabled) return undefined;

    let timerId;
    let cancelled = false;

    const poll = async () => {
      try {
        setLoading(true);
        const response = await fetchJob(jobId);
        if (cancelled) return;
        setJob(response.data.job);
        setError('');

        if (response.data.job.status === 'queued' || response.data.job.status === 'processing') {
          timerId = window.setTimeout(poll, 1000);
        } else {
          setLoading(false);
        }
      } catch (pollError) {
        if (!cancelled) {
          setError(pollError?.response?.data?.message ?? 'Unable to load job status.');
          setLoading(false);
        }
      }
    };

    poll();

    return () => {
      cancelled = true;
      if (timerId) window.clearTimeout(timerId);
    };
  }, [enabled, jobId]);

  return { job, loading, error };
}

