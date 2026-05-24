import { useEffect, useMemo, useState } from 'react';
import { RefreshCw, Search } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { HistoryTable } from '@/components/dashboard/HistoryTable';
import { DashboardSkeleton } from '@/components/dashboard/DashboardSkeleton';
import { fetchHistory } from '@/services/dashboardApi';
import { useToast } from '@/contexts/ToastContext';

export function HistoryPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const toast = useToast();

  const loadHistory = async () => {
    try {
      setLoading(true);
      const response = await fetchHistory();
      setJobs(response.data.jobs ?? []);
    } catch (error) {
      const message = error?.response?.data?.message ?? 'Unable to load history.';
      toast.error('History unavailable', message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const filteredJobs = useMemo(() => {
    const search = query.toLowerCase();
    return jobs.filter((job) => {
      const blob = `${job.fileName} ${job.toolTitle} ${job.status}`.toLowerCase();
      return blob.includes(search);
    });
  }, [jobs, query]);

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="History"
        title="Processed files archive"
        description="Search through your latest jobs and access instant downloads when they are ready."
        action={
          <Button variant="secondary" size="sm" onClick={loadHistory}>
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        }
      />

      <Card className="p-5">
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by file name, tool, or status..."
          label="Search history"
        />
      </Card>

      <HistoryTable jobs={filteredJobs} />
    </div>
  );
}

