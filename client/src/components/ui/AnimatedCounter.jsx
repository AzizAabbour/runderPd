import { useCountUp } from '@/hooks/useCountUp';

export function AnimatedCounter({ value, suffix = '', prefix = '', duration = 1200, className }) {
  const current = useCountUp(value, duration);

  return (
    <span className={className}>
      {prefix}
      {current.toLocaleString()}
      {suffix}
    </span>
  );
}

