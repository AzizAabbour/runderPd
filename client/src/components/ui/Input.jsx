import { forwardRef } from 'react';
import { cn } from '@/utils/cn';

export const Input = forwardRef(function Input(
  { label, error, className, helperText, ...props },
  ref,
) {
  return (
    <label className="flex w-full flex-col gap-2">
      {label ? <span className="text-sm font-medium text-slate-200">{label}</span> : null}
      <input
        ref={ref}
        className={cn(
          'h-11 w-full rounded-2xl border border-white/10 bg-white/5 px-4 text-sm text-white outline-none transition',
          'placeholder:text-slate-400 focus:border-cyan-400/50 focus:bg-white/10 focus:ring-2 focus:ring-cyan-400/10',
          'dark:text-white',
          className,
        )}
        {...props}
      />
      {helperText ? <span className="text-xs text-slate-400">{helperText}</span> : null}
      {error ? <span className="text-xs text-rose-300">{error}</span> : null}
    </label>
  );
});

