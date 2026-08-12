'use client';

import { motion } from 'framer-motion';
import { fadeUp, stagger, VIEWPORT } from '@/lib/motion';

interface SectionHeadingProps {
  eyebrow: string;
  /** Plain lead-in, rendered in ink. */
  title: string;
  /** Emphasised tail, rendered in amber italic on its own line. */
  accent?: string;
  /** Keeps the accent on the same line as the title. */
  inline?: boolean;
  body?: string;
  align?: 'center' | 'left';
  className?: string;
  children?: React.ReactNode;
}

/**
 * One heading treatment for every section: hairline-flanked eyebrow, fluid
 * serif display, optional amber italic accent.
 */
export default function SectionHeading({
  eyebrow,
  title,
  accent,
  inline = false,
  body,
  align = 'center',
  className = '',
  children,
}: SectionHeadingProps) {
  const centered = align === 'center';

  return (
    <motion.div
      variants={stagger(0.09)}
      initial="hidden"
      whileInView="show"
      viewport={VIEWPORT}
      className={`${centered ? 'text-center mx-auto' : 'text-left'} ${className}`}
    >
      {/* Eyebrow with hairline flourishes */}
      <motion.div
        variants={fadeUp}
        className={`flex items-center gap-3 mb-5 ${centered ? 'justify-center' : ''}`}
      >
        <span
          aria-hidden
          className={`h-px w-8 bg-gradient-to-r from-transparent to-amber-line ${
            centered ? '' : 'hidden'
          }`}
        />
        <span className="te">{eyebrow}</span>
        <span
          aria-hidden
          className="h-px w-8 bg-gradient-to-l from-transparent to-amber-line"
        />
      </motion.div>

      <motion.h2
        variants={fadeUp}
        className="th t-h2 text-ink text-balance"
      >
        {title}
        {accent && (
          <>
            {inline ? ' ' : <br className="hidden sm:block" />}
            <span className="text-amber italic">{accent}</span>
          </>
        )}
      </motion.h2>

      {body && (
        <motion.p
          variants={fadeUp}
          className={`tb mt-5 max-w-[54ch] ${centered ? 'mx-auto' : ''}`}
        >
          {body}
        </motion.p>
      )}

      {children && <motion.div variants={fadeUp}>{children}</motion.div>}
    </motion.div>
  );
}
