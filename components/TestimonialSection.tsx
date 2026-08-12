'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { fadeUp, revealImage, stagger, VIEWPORT } from '@/lib/motion';

/**
 * Structural facts stated elsewhere on the page — not invented metrics.
 * Swap or extend as the real numbers land.
 */
const proofPoints = [
  { figure: '15.5%', label: 'Platform commission avoided' },
  { figure: '7', label: 'Days from call to live site' },
  { figure: '€0', label: 'Commission on direct bookings' },
];

export default function TestimonialSection() {
  return (
    <section className="relative overflow-hidden">
      {/* Photography */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.pexels.com/photos/37286899/pexels-photo-37286899.jpeg?auto=compress&cs=tinysrgb&w=1600&dpr=2"
          alt=""
          aria-hidden
          fill
          sizes="100vw"
          quality={86}
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-[linear-gradient(160deg,rgba(12,9,7,0.78)_0%,rgba(12,9,7,0.52)_45%,rgba(12,9,7,0.76)_100%)]" />
      </div>

      <motion.div
        variants={stagger(0.11)}
        initial="hidden"
        whileInView="show"
        viewport={VIEWPORT}
        className="relative z-10 max-w-4xl mx-auto px-6 sm:px-8 py-24 sm:py-32 text-center"
      >
        {/* Rating */}
        <motion.div
          variants={fadeUp}
          className="flex items-center justify-center gap-1.5 mb-9"
        >
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className="w-3.5 h-3.5 fill-amber-light text-amber-light" />
          ))}
          <span className="te !text-[10px] !text-white/60 ml-2.5">Verified Host</span>
        </motion.div>

        {/* Oversized opening quote, optically hung */}
        <motion.div
          variants={revealImage}
          aria-hidden
          className="font-serif text-[110px] sm:text-[150px] leading-[0.5] text-amber-light/35 select-none mb-2"
        >
          &ldquo;
        </motion.div>

        <motion.blockquote variants={fadeUp}>
          <p className="tq t-quote text-white text-balance max-w-[34ch] sm:max-w-[46ch] mx-auto [text-shadow:0_2px_18px_rgba(0,0,0,0.5)]">
            I was losing nearly eight thousand euros a year to Airbnb fees. My
            Duskglow microsite paid for itself in the first three direct bookings.
            Now guests remember my property&rsquo;s name — not Airbnb&rsquo;s.
          </p>

          <footer className="mt-10 flex items-center justify-center gap-3.5">
            <span className="w-10 h-10 rounded-full border border-amber-light/40 bg-white/10 backdrop-blur-sm text-amber-light font-serif font-semibold text-sm flex items-center justify-center shrink-0">
              A
            </span>
            <cite className="not-italic text-left">
              <span className="font-sans font-medium text-[14px] text-white block">
                Andreas Skiadopoulos
              </span>
              <span className="text-[12px] text-white/65 block mt-0.5">
                Host, Delos Properties · Mykonos
              </span>
            </cite>
          </footer>
        </motion.blockquote>

        {/* Proof band */}
        <motion.dl
          variants={fadeUp}
          className="mt-16 pt-10 border-t border-white/15 grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-6"
        >
          {proofPoints.map((p) => (
            <div key={p.label}>
              <dt className="sr-only">{p.label}</dt>
              <dd>
                <span className="font-serif font-semibold text-[30px] sm:text-[34px] text-amber-light leading-none num block">
                  {p.figure}
                </span>
                <span className="te !text-[9.5px] !text-white/60 mt-2.5 block">
                  {p.label}
                </span>
              </dd>
            </div>
          ))}
        </motion.dl>
      </motion.div>
    </section>
  );
}
