import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';
import { formatPercent } from '@/utils/format';

export function ProgressBar({ value = 0, className, label, tone = 'cyan' }) {
  const tones = {
    cyan: 'from-primary-400 via-cyan-400 to-accent-400',
    emerald: 'from-emerald-400 via-teal-400 to-cyan-400',
    violet: 'from-violet-400 via-fuchsia-400 to-pink-400',
  };

  return (
    <div className={cn('flex w-full flex-col gap-2', className)}>
      {label ? (
        <div className="flex items-center justify-between text-xs text-slate-300">
          <span>{label}</span>
          <span>{formatPercent(value)}</span>
        </div>
      ) : null}
      <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
        <motion.div
          className={cn('h-full rounded-full bg-gradient-to-r', tones[tone])}
          initial={{ width: 0 }}
          animate={{ width: `${Math.max(0, Math.min(100, value))}%` }}
          transition={{ type: 'spring', stiffness: 80, damping: 18 }}
        />
      </div>
    </div>
  );
}

