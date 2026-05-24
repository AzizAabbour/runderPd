import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';

const blobs = [
  'left-[-8%] top-[-12%] h-72 w-72 bg-cyan-400/20',
  'right-[-6%] top-[18%] h-64 w-64 bg-violet-400/20',
  'left-[10%] bottom-[-12%] h-52 w-52 bg-emerald-400/20',
];

export function AnimatedBackground({ className }) {
  return (
    <div className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}>
      <div className="absolute inset-0 premium-grid opacity-[0.12] dark:opacity-[0.12]" />
      {blobs.map((className, index) => (
        <motion.div
          key={index}
          animate={{ y: [0, -16, 0], x: [0, 10, 0] }}
          transition={{ duration: 10 + index * 2, repeat: Infinity, ease: 'easeInOut' }}
          className={cn('absolute rounded-full blur-3xl', className)}
        />
      ))}
    </div>
  );
}

