import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';

const variants = {
  primary:
    'bg-gradient-to-r from-primary-500 via-cyan-500 to-accent-500 text-white shadow-glow hover:brightness-110',
  secondary:
    'border border-white/10 bg-white/5 text-slate-100 hover:bg-white/10 dark:text-slate-100',
  ghost: 'text-slate-300 hover:bg-white/5 hover:text-white dark:text-slate-300',
  danger: 'bg-rose-500 text-white hover:bg-rose-600',
};

const sizes = {
  sm: 'h-9 px-4 text-sm',
  md: 'h-11 px-5 text-sm',
  lg: 'h-12 px-6 text-base',
};

const MotionLink = motion(Link);

export function ButtonLink({
  to,
  className,
  variant = 'primary',
  size = 'md',
  children,
  ...props
}) {
  return (
    <MotionLink
      to={to}
      whileHover={{ y: -1, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-2xl font-medium transition-all duration-200',
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {children}
    </MotionLink>
  );
}

