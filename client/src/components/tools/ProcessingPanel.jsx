import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Badge } from '@/components/ui/Badge';
import { CheckCircle2, Circle, Loader2, Download, Sparkles } from 'lucide-react';
import { cn } from '@/utils/cn';
import { formatBytes, formatDate } from '@/utils/format';

const defaultSteps = [
  'Validating files',
  'Uploading',
  'Processing',
  'Finalizing',
  'Ready to download',
];

export function ProcessingPanel({
  status = 'idle',
  progress = 0,
  job = null,
  downloadUrl,
  steps = defaultSteps,
  onDownload,
}) {
  const activeStep = Math.max(0, Math.min(steps.length - 1, Math.floor((progress / 100) * steps.length)));

  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h4 className="text-base font-semibold text-white">Processing status</h4>
          <p className="mt-1 text-sm text-slate-400">
            Real-time feedback while your file is handled by the backend.
          </p>
        </div>
        <Badge variant={status === 'complete' ? 'success' : 'accent'}>
          {status === 'complete' ? 'Complete' : status === 'processing' ? 'Working' : 'Ready'}
        </Badge>
      </div>

      <div className="mt-4">
        <ProgressBar value={progress} label="Progress" />
      </div>

      <div className="mt-5 space-y-3">
        {steps.map((step, index) => {
          const complete = index < activeStep || (status === 'complete' && index <= activeStep);
          const active = index === activeStep && status !== 'complete';
          const Icon = complete ? CheckCircle2 : active ? Loader2 : Circle;

          return (
            <div
              key={step}
              className={cn(
                'flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm transition',
                complete
                  ? 'border-emerald-400/20 bg-emerald-400/10 text-emerald-100'
                  : active
                    ? 'border-cyan-400/20 bg-cyan-400/10 text-cyan-100'
                    : 'border-white/10 bg-white/5 text-slate-300',
              )}
            >
              <Icon className={cn('h-4 w-4', active && 'animate-spin')} />
              <span>{step}</span>
            </div>
          );
        })}
      </div>

      {job ? (
        <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-center gap-2 text-sm font-medium text-white">
            <Sparkles className="h-4 w-4 text-cyan-300" />
            Job summary
          </div>
          <div className="mt-3 grid gap-3 text-sm text-slate-300 sm:grid-cols-3">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Job ID</p>
              <p className="mt-1 break-all text-white">{job.id}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Original size</p>
              <p className="mt-1 text-white">{formatBytes(job.originalSize)}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Updated</p>
              <p className="mt-1 text-white">{formatDate(job.updatedAt)}</p>
            </div>
          </div>
        </div>
      ) : null}

      {downloadUrl ? (
        <div className="mt-5">
          <Button className="w-full" onClick={() => onDownload?.(downloadUrl)}>
            <Download className="h-4 w-4" />
            Download processed file
          </Button>
        </div>
      ) : null}
    </Card>
  );
}

