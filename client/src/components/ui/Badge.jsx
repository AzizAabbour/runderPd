import { cn } from '@/utils/cn';

const badgeVariants = {
  default: 'border-white/10 bg-white/5 text-slate-200',
  success: 'border-emerald-400/25 bg-emerald-400/10 text-emerald-200',
  warning: 'border-amber-400/25 bg-amber-400/10 text-amber-100',
  accent: 'border-cyan-400/25 bg-cyan-400/10 text-cyan-100',
};

export function Badge({ children, variant = 'default', className }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium tracking-wide',
        badgeVariants[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}

