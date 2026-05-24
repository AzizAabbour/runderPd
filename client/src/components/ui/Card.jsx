import { cn } from '@/utils/cn';

export function Card({ className, children, ...props }) {
  return (
    <div
      className={cn(
        'rounded-3xl border border-white/10 bg-white/5 shadow-glass backdrop-blur-2xl',
        'dark:bg-white/5',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

