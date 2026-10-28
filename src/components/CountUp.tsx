import { useEffect, useRef, useState } from 'react';

interface CountUpProps {
  /** Target number to count up to (e.g. 7, 17, 33). */
  end: number;
  /** Text appended after the number (e.g. "+", "k+"). */
  suffix?: string;
  /** Animation length in milliseconds. */
  duration?: number;
  className?: string;
}

/**
 * Counts from 0 up to `end` once the element scrolls into view. For stats that
 * are already on screen at load (e.g. the hero), it starts immediately. Honors
 * the user's reduced-motion preference by showing the final value at once.
 */
export default function CountUp({ end, suffix = '', duration = 1600, className }: CountUpProps) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced =
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced) {
      setValue(end);
      return;
    }

    const run = () => {
      if (started.current) return;
      started.current = true;
      const start = performance.now();
      const tick = (now: number) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
        setValue(Math.round(eased * end));
        if (progress < 1) requestAnimationFrame(tick);
        else setValue(end);
      };
      requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            run();
            observer.disconnect();
          }
        });
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [end, duration]);

  return (
    <span ref={ref} className={className}>
      {value}
      {suffix}
    </span>
  );
}
