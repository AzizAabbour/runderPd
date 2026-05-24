import { cn } from '@/utils/cn';

export function SectionHeader({ eyebrow, title, description, action, className }) {
  return (
    <div className={cn('flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between', className)}>
      <div className="max-w-2xl space-y-2">
        {eyebrow ? <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-300">{eyebrow}</p> : null}
        <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">{title}</h2>
        {description ? <p className="text-sm leading-6 text-slate-300">{description}</p> : null}
      </div>
      {action ? <div className="flex items-center gap-3">{action}</div> : null}
    </div>
  );
}

