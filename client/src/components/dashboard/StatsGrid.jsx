import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import { cn } from '@/utils/cn';

export function StatsGrid({ items = [] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item, index) => {
        const Icon = item.icon;
        return (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="relative overflow-hidden p-5">
              <div className={cn('absolute inset-0 bg-gradient-to-br opacity-10 blur-3xl', item.accent)} />
              <div className="relative flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm text-slate-400">{item.label}</p>
                  <p className="mt-2 text-3xl font-semibold tracking-tight text-white">
                    <AnimatedCounter value={item.value} suffix={item.suffix ?? ''} />
                  </p>
                </div>
                <div className={cn('rounded-2xl bg-white/10 p-3 text-white', item.iconWrap)}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              {item.description ? (
                <p className="relative mt-4 text-sm leading-6 text-slate-300">{item.description}</p>
              ) : null}
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}

