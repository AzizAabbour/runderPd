import { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/utils/cn';

export const Select = forwardRef(function Select(
  { label, error, className, helperText, children, ...props },
  ref,
) {
  return (
    <label className="flex w-full flex-col gap-2">
      {label ? <span className="text-sm font-medium text-slate-200">{label}</span> : null}
      <div className="relative">
        <select
          ref={ref}
          className={cn(
            'h-11 w-full appearance-none rounded-2xl border border-white/10 bg-white/5 px-4 pr-10 text-sm text-white outline-none transition',
            'focus:border-cyan-400/50 focus:bg-white/10 focus:ring-2 focus:ring-cyan-400/10',
            className,
          )}
          {...props}
        >
          {children}
        </select>
        <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      </div>
      {helperText ? <span className="text-xs text-slate-400">{helperText}</span> : null}
      {error ? <span className="text-xs text-rose-300">{error}</span> : null}
    </label>
  );
});

