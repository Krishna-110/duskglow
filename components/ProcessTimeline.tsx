'use client';

import { useRef, useState } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValueEvent,
} from 'framer-motion';
import SectionHeading from '@/components/ui/SectionHeading';
import { fadeUp, stagger, VIEWPORT } from '@/lib/motion';

const steps = [
  {
    num: '01',
    title: 'The call',
    desc: 'Thirty minutes on your property, your rates and your seasons. No pitch. We sketch a concept before we hang up.',
    at: 0.06,
  },
  {
    num: '02',
    title: 'The preview',
    desc: 'A live link to your finished site. Nothing invoiced, nothing owed — you are looking at it before you have paid a penny.',
    at: 0.34,
  },
  {
    num: '03',
    title: 'Your changes',
    desc: 'Tell us what to change and we change it, for as long as it takes. Photographs, wording, whatever is not you yet.',
    at: 0.62,
  },
  {
    num: '04',
    title: 'Live, and paid',
    desc: 'Domain resolving, calendar already reading your platforms, enquiries arriving. Invoiced only once you are happy with it.',
    at: 0.9,
  },
] as const;

export default function ProcessTimeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 78%', 'end 55%'],
  });

  const smooth = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 28,
    restDelta: 0.001,
  });

  const progressWidth = useTransform(smooth, [0, 1], ['0%', '100%']);

  useMotionValueEvent(smooth, 'change', setProgress);

  return (
    <section id="how" ref={containerRef} className="py-24 sm:py-32 bg-canvas border-t border-border">
      <div className="max-w-shell mx-auto px-6 sm:px-8">
        <SectionHeading
          eyebrow="The Process"
          title="From a call to a site"
          accent="you actually like."
          inline
          className="mb-20 max-w-[40rem]"
        />

        <div className="max-w-5xl mx-auto relative">
          {/* Track (desktop) */}
          <div
            aria-hidden
            className="hidden lg:block absolute top-[34px] left-[12.5%] right-[12.5%] h-px bg-border z-0"
          >
            <motion.div
              style={{ width: progressWidth }}
              className="h-full bg-amber-brand shadow-[0_0_10px_var(--amber-line)]"
            />
            <motion.div
              style={{ left: progressWidth }}
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-amber-brand shadow-[0_0_0_4px_var(--amber-glow),0_0_16px_var(--amber-line)]"
            />
          </div>

          <motion.ol
            variants={stagger(0.1)}
            initial="hidden"
            whileInView="show"
            viewport={VIEWPORT}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 relative z-10 list-none"
          >
            {steps.map((step) => {
              const lit = progress >= step.at;

              return (
                <motion.li
                  key={step.num}
                  variants={fadeUp}
                  className="group flex flex-col items-center text-center"
                >
                  {/* Badge — illuminates as the line reaches it */}
                  <div
                    className={`relative w-[68px] h-[68px] rounded-full flex items-center justify-center mb-6 font-serif text-[17px] font-semibold transition-all duration-700 ease-out ${
                      lit
                        ? 'bg-surface border border-amber-brand text-amber shadow-[0_0_0_5px_var(--amber-glow)]'
                        : 'bg-canvas border border-border text-ink-dim'
                    }`}
                  >
                    <span className="num">{step.num}</span>
                    {lit && (
                      <motion.span
                        aria-hidden
                        initial={{ scale: 0.75, opacity: 0.6 }}
                        animate={{ scale: 1.5, opacity: 0 }}
                        transition={{ duration: 1.3, ease: 'easeOut' }}
                        className="absolute inset-0 rounded-full border border-amber-brand"
                      />
                    )}
                  </div>

                  <h3 className="thb text-[19px] text-ink mb-2.5">{step.title}</h3>

                  <p className="tb !text-[13.5px] max-w-[26ch]">{step.desc}</p>
                </motion.li>
              );
            })}
          </motion.ol>
        </div>
      </div>
    </section>
  );
}
