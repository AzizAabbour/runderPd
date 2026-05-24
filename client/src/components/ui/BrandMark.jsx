import { Files } from 'lucide-react';
import { cn } from '@/utils/cn';

export function BrandMark({ compact = false, className }) {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-400 via-cyan-400 to-accent-500 shadow-glow">
        <div className="absolute inset-0 rounded-2xl bg-white/10 opacity-50 blur-sm" />
        <Files className="relative z-10 h-5 w-5 text-white" />
      </div>
      {!compact ? (
        <div className="leading-tight">
          <p className="text-sm font-semibold text-white">File Tools Studio</p>
          <p className="text-xs text-slate-400">Premium file workflow platform</p>
        </div>
      ) : null}
    </div>
  );
}
