import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CloudDownload,
  Layers3,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  WandSparkles,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { StatsGrid } from '@/components/dashboard/StatsGrid';
import { HistoryTable } from '@/components/dashboard/HistoryTable';
import { DashboardSkeleton } from '@/components/dashboard/DashboardSkeleton';
import { fetchOverview } from '@/services/dashboardApi';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { formatBytes } from '@/utils/format';

export function DashboardPage() {
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;

    const loadOverview = async () => {
      try {
        setLoading(true);
        const response = await fetchOverview();
        if (cancelled) return;
        setOverview(response.data.overview);
      } catch (requestError) {
        if (!cancelled) {
          const message =
            requestError?.response?.data?.message ?? 'Unable to load dashboard overview.';
          setError(message);
          toast.error('Dashboard unavailable', message);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadOverview();

    return () => {
      cancelled = true;
    };
  }, [toast]);

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (error && !overview) {
    return (
      <Card className="p-6">
        <p className="text-lg font-semibold text-white">Dashboard unavailable</p>
        <p className="mt-2 text-sm text-slate-300">{error}</p>
        <Button className="mt-5" onClick={() => window.location.reload()}>
          Reload
        </Button>
      </Card>
    );
  }

  const stats = [
    {
      label: 'Files processed',
      value: overview?.totalFiles ?? 0,
      suffix: '+',
      icon: Layers3,
      accent: 'from-cyan-500 to-sky-500',
      iconWrap: 'bg-cyan-400/15 text-cyan-200',
    },
    {
      label: 'Bytes saved',
      value: Math.round((overview?.bytesSaved ?? 0) / 1024 / 1024 / 1024),
      suffix: ' GB',
      icon: CloudDownload,
      accent: 'from-emerald-500 to-teal-500',
      iconWrap: 'bg-emerald-400/15 text-emerald-200',
    },
    {
      label: 'Active jobs',
      value: overview?.activeJobs ?? 0,
      suffix: '',
      icon: WandSparkles,
      accent: 'from-violet-500 to-fuchsia-500',
      iconWrap: 'bg-violet-400/15 text-violet-200',
    },
    {
      label: 'Success rate',
      value: overview?.successRate ?? 0,
      suffix: '%',
      icon: ShieldCheck,
      accent: 'from-amber-500 to-orange-500',
      iconWrap: 'bg-amber-400/15 text-amber-200',
    },
  ];

  return (
    <div className="space-y-6">
      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <Card className="relative overflow-hidden p-6 lg:p-8">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-violet-500/10" />
          <div className="relative">
            <Badge variant="accent" className="mb-4">
              <Sparkles className="mr-2 h-3.5 w-3.5" />
              Welcome back
            </Badge>
            <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Hi {user?.name?.split(' ')?.[0] ?? 'there'}, your file studio is ready.
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
              Use the dashboard to jump into compression, conversion, and PDF editing workflows
              without losing the premium feel.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <ButtonLink to="/dashboard/tools" size="md">
                <WandSparkles className="h-4 w-4" />
                Open tools
              </ButtonLink>
              <Button
                variant="secondary"
                size="md"
                onClick={() => navigate('/dashboard/history')}
              >
                View history
              </Button>
              <Button
                variant="ghost"
                size="md"
                onClick={() => toast.success('Refreshed', 'Dashboard data will update shortly.')}
              >
                <RefreshCw className="h-4 w-4" />
                Refresh
              </Button>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Usage</p>
          <h3 className="mt-2 text-xl font-semibold text-white">Processing capacity</h3>
          <p className="mt-2 text-sm text-slate-300">
            A snapshot of the latest workflow trends from your workspace.
          </p>
          <div className="mt-6 space-y-4">
            {(overview?.usage ?? []).map((item) => (
              <div key={item.label}>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-slate-300">{item.label}</span>
                  <span className="text-white">{item.value}%</span>
                </div>
                <ProgressBar value={item.value} />
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
            Storage saved this month:
            <span className="ml-2 font-semibold text-white">
              {formatBytes(overview?.bytesSaved ?? 0)}
            </span>
          </div>
        </Card>
      </section>

      <StatsGrid items={stats} />

      <section className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <Card className="p-6">
          <SectionHeader
            eyebrow="Quick start"
            title="Jump directly into a tool"
            description="Choose a workflow and open its dedicated upload workspace."
          />
          <div className="mt-6 grid gap-3">
            <ButtonLink to="/dashboard/tools/image-compression" variant="secondary" size="lg">
              Image compression
            </ButtonLink>
            <ButtonLink to="/dashboard/tools/pdf-compression" variant="secondary" size="lg">
              PDF compression
            </ButtonLink>
            <ButtonLink to="/dashboard/tools/merge-pdf" variant="secondary" size="lg">
              Merge PDF
            </ButtonLink>
            <ButtonLink to="/dashboard/tools/video-compression" variant="secondary" size="lg">
              Video compression
            </ButtonLink>
          </div>
        </Card>

        <Card className="p-6">
          <SectionHeader
            eyebrow="Recent jobs"
            title="History, downloads, and status in one place"
            description="Your latest processed files appear here with their output links and current status."
          />
          <div className="mt-6">
            <HistoryTable jobs={overview?.recentJobs ?? []} />
          </div>
        </Card>
      </section>
    </div>
  );
}

