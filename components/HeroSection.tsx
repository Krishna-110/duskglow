'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Calculator, MonitorPlay } from 'lucide-react';
import { EASE_OUT, fadeUp, riseIn, stagger } from '@/lib/motion';

interface HeroSectionProps {
  onOpenBookCall: () => void;
  onOpenPreview: () => void;
}

const trustMarks = ['Built for hosts', '7-day delivery', 'Zero commission'];

export default function HeroSection({ onOpenPreview }: HeroSectionProps) {
  return (
    /**
     * `min-h` rather than a fixed height: on a short viewport the card is
     * taller than the screen, and a fixed height pushed its top out of view
     * behind the navbar. Growing instead keeps every line readable.
     *
     * `data-hero` is what Navbar's IntersectionObserver watches to decide
     * between its transparent and opaque treatments.
     */
    <section
      data-hero
      className="relative min-h-[100svh] overflow-hidden flex items-end"
    >
      {/* Photography */}
      <div className="absolute inset-0 z-0 kenburns vignette">
        <Image
          src="https://images.pexels.com/photos/31751031/pexels-photo-31751031.jpeg?auto=compress&cs=tinysrgb&w=1920&dpr=2"
          alt="Mediterranean villa terrace at golden hour"
          fill
          priority
          sizes="100vw"
          quality={90}
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-[var(--hero-overlay)] transition-opacity duration-700" />
      </div>

      {/* Content — pt clears the fixed navbar at every viewport height */}
      <div className="relative z-10 w-full max-w-shell mx-auto px-6 sm:px-8 pt-28 sm:pt-32 pb-14 sm:pb-20 flex justify-end">
        <motion.div
          variants={stagger(0.1, 0.35)}
          initial="hidden"
          animate="show"
          className="w-full sm:max-w-[46rem] glass-panel shadow-e4 p-7 sm:p-12 lg:p-14"
        >
          <motion.div variants={fadeUp} className="flex items-center gap-3 mb-5 sm:mb-6">
            <span aria-hidden className="h-px w-9 bg-amber-brand/70" />
            <span className="te">Direct Booking Microsites</span>
          </motion.div>

          <motion.h1
            variants={riseIn}
            className="td t-display text-ink mb-5 sm:mb-6 text-balance"
          >
            Own <span className="text-amber italic">the moment.</span>
            <br />
            Own the guest.
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="tb text-[15.5px] sm:text-[16.5px] max-w-[46ch] mb-7 sm:mb-9"
          >
            Custom microsites for villas and short-term rentals that turn Airbnb
            guests into repeat direct bookers. Your brand. Your calendar. Zero
            commission — forever.
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-3">
            <a href="#roi" className="btn-prim">
              <Calculator className="w-4 h-4" />
              <span>Calculate Your Savings</span>
            </a>
            <button onClick={onOpenPreview} className="btn-outline">
              <MonitorPlay className="w-4 h-4" />
              <span>Explore Demo</span>
            </button>
          </motion.div>

          {/* Quiet trust row instead of a louder second CTA */}
          <motion.ul
            variants={fadeUp}
            className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-7 sm:mt-9 pt-6 sm:pt-7 border-t border-border-subtle list-none"
          >
            {trustMarks.map((mark) => (
              <li key={mark} className="flex items-center gap-2">
                <span aria-hidden className="w-1 h-1 rounded-full bg-amber-brand" />
                <span className="te !tracking-[0.14em]">{mark}</span>
              </li>
            ))}
          </motion.ul>
        </motion.div>
      </div>

      {/* Scroll cue — hidden on short screens where vertical room is scarce */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 1, ease: EASE_OUT }}
        className="absolute z-10 bottom-8 left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center gap-3 pointer-events-none"
      >
        <span className="te !text-[9.5px] text-white/70">Scroll</span>
        <span className="scroll-cue relative w-px h-10 overflow-hidden bg-white/20">
          <span className="absolute inset-x-0 top-0 h-1/2 bg-white/80 block" />
        </span>
      </motion.div>
    </section>
  );
}
