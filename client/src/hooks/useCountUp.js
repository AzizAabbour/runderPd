import { useEffect, useState } from 'react';

export function useCountUp(endValue, duration = 1400) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let animationFrame;
    let startTime;

    const tick = (time) => {
      if (!startTime) startTime = time;
      const progress = Math.min((time - startTime) / duration, 1);
      const nextValue = Math.round(endValue * progress);
      setValue(nextValue);

      if (progress < 1) {
        animationFrame = window.requestAnimationFrame(tick);
      }
    };

    animationFrame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(animationFrame);
  }, [duration, endValue]);

  return value;
}

