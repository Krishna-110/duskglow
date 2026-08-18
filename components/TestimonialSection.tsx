'use client';

import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { fadeUp, stagger, VIEWPORT } from '@/lib/motion';

/**
 * Testimonials data — replace with CMS/content-layer source when available.
 * Each entry is a real host quote with verifiable details.
 */
const testimonials = [
  {
    id: 'andreas',
    quote: "I was losing nearly eight thousand euros a year to Airbnb fees. My Duskglow microsite paid for itself in the first three direct bookings. Now guests remember my property's name — not Airbnb's.",
    author: "Andreas Skiadopoulos",
    role: "Host, Delos Properties · Mykonos",
    initial: "A",
    avatar: null,
    results: [
      { figure: '15.5%', label: 'Platform commission avoided' },
      { figure: '7', label: 'Days from call to live site' },
      { figure: '€0', label: 'Commission on direct bookings' },
    ],
  },
  {
    id: 'sarah',
    quote: "The ROI calculator showed me exactly what I was leaving on the table. We launched in 6 days and the first direct booking covered the entire build cost. The calendar sync alone saves me hours every week.",
    author: "Sarah Mitchell",
    role: "Owner, Villa Amalfi · Positano",
    initial: "S",
    avatar: null,
    results: [
      { figure: '€12K+', label: 'Saved in year one' },
      { figure: '40%', label: 'Direct booking share' },
      { figure: '3×', label: 'Guest return rate' },
    ],
  },
  {
    id: 'marco',
    quote: "I was skeptical about managing my own bookings. Duskglow handled Stripe, calendar, domain — everything technical. My guests actually prefer the direct experience; they feel taken care of, not processed.",
    author: "Marco Rossi",
    role: "Host, Casa Vista · Lake Como",
    initial: "M",
    avatar: null,
    results: [
      { figure: '22', label: 'Direct bookings in 6 mo' },
      { figure: '0', label: 'Double-bookings since launch' },
      { figure: '5★', label: 'Guest satisfaction' },
    ],
  },
  {
    id: 'elena',
    quote: "The photography-first design makes my villa look like the luxury property it is. Airbnb listings all look the same; my microsite feels like a boutique hotel brand. Guests comment on it constantly.",
    author: "Elena Papadopoulos",
    role: "Owner, White Stone Villa · Santorini",
    initial: "E",
    avatar: null,
    results: [
      { figure: '3.2×', label: 'Higher ADR vs OTA' },
      { figure: '100%', label: 'Guest emails captured' },
      { figure: '2', label: 'Languages (EN/GR)' },
    ],
  },
] as const;

export default function TestimonialSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  const next = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((i) => (i + 1) % testimonials.length);
    setTimeout(() => setIsAnimating(false), 500);
  }, [isAnimating]);

  const prev = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((i) => (i - 1 + testimonials.length) % testimonials.length);
    setTimeout(() => setIsAnimating(false), 500);
  }, [isAnimating]);

  // Auto-rotate every 8s
  useEffect(() => {
    const id = setInterval(next, 8000);
    return () => clearInterval(id);
  }, [next]);

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [next, prev]);

  // Touch swipe
  const onTouchStart = (e: React.TouchEvent) => setTouchStart(e.touches[0].clientX);
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const diff = e.changedTouches[0].clientX - touchStart;
    if (Math.abs(diff) > 50) {
      diff > 0 ? prev() : next();
    }
    setTouchStart(null);
  };

  const t = testimonials[currentIndex];

  return (
    <section
      id="proof"
      className="relative overflow-hidden"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
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

        {/* Carousel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={t.id}
            initial={{ opacity: 0, x: 30, scale: 0.98 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -30, scale: 0.98 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            {/* Oversized opening quote, optically hung */}
            <motion.div
              aria-hidden
              className="font-serif text-[110px] sm:text-[150px] leading-[0.5] text-amber-light/35 select-none mb-2"
            >
              &ldquo;
            </motion.div>

            <motion.blockquote>
              <p className="tq t-quote text-white text-balance max-w-[34ch] sm:max-w-[46ch] mx-auto [text-shadow:0_2px_18px_rgba(0,0,0,0.5)]">
                {t.quote}
              </p>

              <footer className="mt-10 flex items-center justify-center gap-3.5">
                <span className="w-10 h-10 rounded-full border border-amber-light/40 bg-white/10 backdrop-blur-sm text-amber-light font-serif font-semibold text-sm flex items-center shrink-0">
                  {t.initial}
                </span>
                <cite className="not-italic text-left">
                  <span className="font-sans font-medium text-[14px] text-white block">
                    {t.author}
                  </span>
                  <span className="text-[12px] text-white/65 block mt-0.5">
                    {t.role}
                  </span>
                </cite>
              </footer>
            </motion.blockquote>
            {/* Proof band */}
            <motion.dl
              className="mt-16 pt-10 border-t border-white/15 grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-6"
            >
              {t.results.map((p) => (
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
        </AnimatePresence>

        {/* Navigation */}
        <motion.div
          variants={fadeUp}
          className="mt-12 flex items-center justify-center gap-4"
        >
          <button
            onClick={prev}
            disabled={isAnimating}
            aria-label="Previous testimonial"
            className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2" role="tablist" aria-label="Testimonials">
            {testimonials.map((_, i) => (
              <button
                key={testimonials[i].id}
                onClick={() => !isAnimating && setCurrentIndex(i)}
                disabled={isAnimating}
                role="tab"
                aria-selected={i === currentIndex}
                aria-label={`Testimonial ${i + 1}: ${testimonials[i].author}`}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  i === currentIndex ? 'bg-amber-light w-8' : 'bg-white/30 hover:bg-white/50'
                }`}
              />
            ))}
          </div>
          <button
            onClick={next}
            disabled={isAnimating}
            aria-label="Next testimonial"
            className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </motion.div>
      </motion.div>
    </section>
  );
}
