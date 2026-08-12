'use client';

import { useEffect, useRef } from 'react';
import { useMotionValue, useSpring, useMotionValueEvent, useReducedMotion } from 'framer-motion';

interface AnimatedNumberProps {
  value: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

/**
 * Counts to `value` on a spring. Writes straight to the DOM node instead of
 * through state so a 60fps count doesn't re-render the tree.
 */
export default function AnimatedNumber({
  value,
  prefix = '',
  suffix = '',
  className,
}: AnimatedNumberProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();

  const raw = useMotionValue(value);
  const spring = useSpring(raw, { stiffness: 90, damping: 22, restDelta: 0.5 });

  useEffect(() => {
    raw.set(value);
  }, [value, raw]);

  useMotionValueEvent(spring, 'change', (v) => {
    if (ref.current) {
      ref.current.textContent = `${prefix}${Math.round(v).toLocaleString()}${suffix}`;
    }
  });

  // Static render when the user prefers reduced motion, and as the SSR value.
  const settled = `${prefix}${Math.round(value).toLocaleString()}${suffix}`;

  useEffect(() => {
    if (reduced && ref.current) ref.current.textContent = settled;
  }, [reduced, settled]);

  return (
    <span ref={ref} className={className}>
      {settled}
    </span>
  );
}
