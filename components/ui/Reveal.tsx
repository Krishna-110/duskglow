'use client';

import { motion, type Variants } from 'framer-motion';
import { fadeUp, VIEWPORT, withDelay } from '@/lib/motion';

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  variants?: Variants;
  /** Ignored when `asChild` is set — the parent's stagger owns the timing. */
  delay?: number;
  /** Set when an ancestor <motion> element drives the stagger. */
  asChild?: boolean;
}

/**
 * Scroll-triggered reveal. Standalone by default; pass `asChild` when it sits
 * inside a `stagger()` parent so the parent controls the timing.
 */
export default function Reveal({
  children,
  className,
  variants = fadeUp,
  delay = 0,
  asChild = false,
}: RevealProps) {
  if (asChild) {
    return (
      <motion.div variants={variants} className={className}>
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      className={className}
      variants={withDelay(variants, delay)}
      initial="hidden"
      whileInView="show"
      viewport={VIEWPORT}
    >
      {children}
    </motion.div>
  );
}
