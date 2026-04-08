"use client";

import { useEffect, useRef, useState } from "react";

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  className?: string;
  formatFn?: (n: number) => string;
}

/**
 * Animated number counter that counts up from 0 when scrolled into view.
 * Uses easeOutExpo for a satisfying deceleration curve.
 */
export function AnimatedCounter({
  value,
  duration = 1600,
  className = "",
  formatFn = (n) => n.toLocaleString(),
}: AnimatedCounterProps) {
  const [display, setDisplay] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || hasAnimated) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasAnimated(true);
          observer.unobserve(el);

          const startTime = performance.now();
          const startValue = 0;
          const endValue = value;

          function animate(currentTime: number) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // easeOutExpo — fast start, gentle deceleration
            const eased =
              progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

            const current = Math.round(
              startValue + (endValue - startValue) * eased
            );
            setDisplay(current);

            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          }

          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [value, duration, hasAnimated]);

  // If value changes after animation, update immediately
  useEffect(() => {
    if (hasAnimated) {
      setDisplay(value);
    }
  }, [value, hasAnimated]);

  return (
    <span ref={ref} className={className}>
      {formatFn(display)}
    </span>
  );
}
