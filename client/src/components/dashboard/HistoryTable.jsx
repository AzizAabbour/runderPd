import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Download, ArrowUpRight } from 'lucide-react';
import { formatBytes, formatDate } from '@/utils/format';
import { cn } from '@/utils/cn';

const statusVariants = {
  complete: 'success',
  processing: 'accent',
  failed: 'warning',
  queued: 'default',
};

export function HistoryTable({ jobs = [] }) {
  return (
    <Card className="overflow-hidden">
      <div className="border-b border-white/10 px-5 py-4">
        <h3 className="text-base font-semibold text-white">Recent processed files</h3>
        <p className="mt-1 text-sm text-slate-400">Your latest jobs appear here automatically.</p>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-white/10 text-left text-sm">
          <thead className="bg-white/5 text-slate-400">
            <tr>
              <th className="px-5 py-4 font-medium">File</th>
              <th className="px-5 py-4 font-medium">Tool</th>
              <th className="px-5 py-4 font-medium">Size</th>
              <th className="px-5 py-4 font-medium">Status</th>
              <th className="px-5 py-4 font-medium">Updated</th>
              <th className="px-5 py-4 font-medium">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {jobs.length ? (
              jobs.map((job) => (
                <tr key={job.id} className="bg-transparent transition hover:bg-white/5">
                  <td className="px-5 py-4 text-white">
                    <div className="font-medium">{job.fileName}</div>
                    <div className="text-xs text-slate-400">{job.id}</div>
                  </td>
                  <td className="px-5 py-4 text-slate-300">{job.toolTitle ?? job.toolId}</td>
                  <td className="px-5 py-4 text-slate-300">
                    {formatBytes(job.outputSize ?? job.originalSize ?? 0)}
                  </td>
                  <td className="px-5 py-4">
                    <Badge variant={statusVariants[job.status] ?? 'default'}>{job.status}</Badge>
                  </td>
                  <td className="px-5 py-4 text-slate-300">{formatDate(job.updatedAt)}</td>
                  <td className="px-5 py-4">
                    {job.downloadUrl ? (
                      <div className="flex items-center gap-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => window.open(job.downloadUrl, '_blank')}
                        >
                          <Download className="h-4 w-4" />
                          Download
                        </Button>
                        <a
                          href={job.downloadUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex h-9 w-9 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-300 transition hover:bg-white/10 hover:text-white"
                        >
                          <ArrowUpRight className="h-4 w-4" />
                        </a>
                      </div>
                    ) : (
                      <span className="text-slate-500">Pending</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-5 py-10 text-center text-slate-400">
                  No jobs yet. Upload a file to generate your first entry.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

