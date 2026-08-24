'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Menu, X, MonitorPlay, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { EASE_OUT } from '@/lib/motion';

interface NavbarProps {
  onOpenBookCall: () => void;
  onOpenPreview: () => void;
}

const navLinks = [
  { name: 'Features', href: '#features' },
  { name: 'Process', href: '#how' },
  { name: 'Pricing', href: '#pricing' },
  { name: 'FAQ', href: '#faq' },
];

export default function Navbar({ onOpenBookCall, onOpenPreview }: NavbarProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [overHero, setOverHero] = useState(true);

  useEffect(() => setMounted(true), []);

  /**
   * Flip the bar's treatment the moment the hero clears it.
   *
   * A passive scroll listener rather than IntersectionObserver: IO doesn't
   * deliver callbacks while the page isn't rendering, which would strand the
   * bar in its light-on-photo treatment over the cream sections below — white
   * links on a cream background. One rect read on a single element per scroll
   * event is negligible, and React bails out when the boolean is unchanged.
   */
  useEffect(() => {
    const hero = document.querySelector('[data-hero]');
    if (!hero) {
      setOverHero(false);
      return;
    }

    const update = () => setOverHero(hero.getBoundingClientRect().bottom > 72);

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  // Close the mobile sheet if the viewport grows past the breakpoint.
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const mq = window.matchMedia('(min-width: 768px)');
    const onChange = () => mq.matches && setMobileMenuOpen(false);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [mobileMenuOpen]);

  // Lock scroll behind the mobile sheet.
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileMenuOpen]);

  const isDark = mounted && resolvedTheme === 'dark';

  // An open sheet always needs the opaque treatment behind it.
  const solid = !overHero || mobileMenuOpen;

  return (
    <motion.nav
      initial={{ y: -72, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.9, ease: EASE_OUT, delay: 0.15 }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      {/* Scrim: keeps light nav type legible over a bright patch of photo
          without painting a hard band across the image. */}
      <div
        aria-hidden
        className={`absolute inset-x-0 top-0 h-[150%] pointer-events-none bg-gradient-to-b from-black/60 via-black/25 to-transparent transition-opacity duration-500 ease-soft ${
          solid ? 'opacity-0' : 'opacity-100'
        }`}
      />

      <div
        className={`relative transition-[background-color,box-shadow,border-color,padding] duration-500 ease-soft border-b ${
          solid
            ? 'bg-[var(--nav-bg-solid)] border-border shadow-e1 py-3 backdrop-blur-xl backdrop-saturate-150'
            : 'bg-transparent border-transparent py-5'
        }`}
      >
        <div
          className={`max-w-shell mx-auto px-6 sm:px-8 flex items-center justify-between gap-6 ${
            solid ? '' : 'on-photo'
          }`}
        >
          {/* Wordmark */}
          <a
            href="#"
            className={`group font-serif font-semibold text-[22px] tracking-tight shrink-0 transition-colors duration-500 ${
              solid ? 'text-ink' : 'text-white'
            }`}
          >
            Dusk
            <span
              className={`transition-opacity duration-300 group-hover:opacity-70 ${
                solid ? 'text-amber' : 'text-amber-light'
              }`}
            >
              glow
            </span>
          </a>

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-7">
            <ul className="flex items-center gap-7 list-none">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className={`link-u font-sans text-[11px] font-medium tracking-[0.16em] uppercase transition-colors duration-500 ${
                      solid
                        ? 'text-ink-soft hover:text-ink'
                        : 'text-white/90 hover:text-white'
                    }`}
                  >
                    {link.name}
                  </a>
                </li>
              ))}
              <li>
                <button
                  onClick={onOpenPreview}
                  className={`link-u font-sans text-[11px] font-medium tracking-[0.16em] uppercase flex items-center gap-1.5 transition-colors duration-500 ${
                    solid ? 'text-amber' : 'text-amber-light'
                  }`}
                >
                  <MonitorPlay className="w-3.5 h-3.5" />
                  <span>Demo</span>
                </button>
              </li>
            </ul>

            <span
              aria-hidden
              className={`w-px h-5 transition-colors duration-500 ${
                solid ? 'bg-border' : 'bg-white/25'
              }`}
            />

            <div className="flex items-center gap-3">
              <ThemeToggle
                isDark={isDark}
                mounted={mounted}
                solid={solid}
                onToggle={() => setTheme(isDark ? 'light' : 'dark')}
              />
              <button
                onClick={onOpenBookCall}
                className={`btn-prim !py-3 !px-6 !text-[11px] ${
                  solid ? '' : '!bg-white !text-[#17120e]'
                }`}
              >
                Book a Call
              </button>
            </div>
          </div>

          {/* Mobile */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle
              isDark={isDark}
              mounted={mounted}
              solid={solid}
              compact
              onToggle={() => setTheme(isDark ? 'light' : 'dark')}
            />
            <button
              onClick={() => setMobileMenuOpen((v) => !v)}
              className={`w-11 h-11 -mr-2 flex items-center justify-center transition-colors duration-500 ${
                solid ? 'text-ink' : 'text-white'
              }`}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Hairline, only once the bar is opaque */}
      <motion.div
        aria-hidden
        initial={false}
        animate={{ opacity: solid && !mobileMenuOpen ? 1 : 0 }}
        transition={{ duration: 0.4, ease: EASE_OUT }}
        className="relative h-px bg-gradient-to-r from-transparent via-amber-line to-transparent"
      />

      {/* Mobile sheet */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: EASE_OUT }}
            className="relative md:hidden bg-[var(--nav-bg-solid)] backdrop-blur-2xl border-b border-border px-6 py-6 flex flex-col shadow-e3"
          >
            {navLinks.map((link, i) => (
              <motion.a
                key={link.name}
                href={link.href}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 + i * 0.05, duration: 0.4, ease: EASE_OUT }}
                onClick={() => setMobileMenuOpen(false)}
                className="font-serif text-2xl text-ink hover:text-amber py-3.5 border-b border-border-subtle transition-colors"
              >
                {link.name}
              </motion.a>
            ))}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenPreview();
              }}
              className="font-serif text-2xl text-amber py-3.5 border-b border-border-subtle flex items-center gap-2.5 text-left"
            >
              <MonitorPlay className="w-5 h-5" />
              <span>Live Demo</span>
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenBookCall();
              }}
              className="btn-prim w-full mt-6"
            >
              Book a Call
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

/* ── Day / Dusk toggle ── */
function ThemeToggle({
  isDark,
  mounted,
  solid,
  compact = false,
  onToggle,
}: {
  isDark: boolean;
  mounted: boolean;
  solid: boolean;
  compact?: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      /* The visible word must appear in the accessible name, or voice control
         ("click DAY") cannot reach this button. WCAG 2.5.3 Label in Name. */
      aria-label={`${isDark ? 'Dusk' : 'Day'} theme active — switch to ${isDark ? 'day' : 'dusk'}`}
      className={`group relative inline-flex items-center justify-center gap-2 border rounded-full transition-colors duration-500 bg-transparent ${
        solid ? 'border-border hover:border-amber-line' : 'border-white/30 hover:border-white/60'
      } ${compact ? 'w-11 h-11' : 'py-2 pl-3 pr-2'}`}
    >
      <span className="relative w-3.5 h-3.5 shrink-0">
        <AnimatePresence initial={false} mode="wait">
          <motion.span
            key={isDark ? 'moon' : 'sun'}
            initial={{ opacity: 0, rotate: -70, scale: 0.6 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 70, scale: 0.6 }}
            transition={{ duration: 0.32, ease: EASE_OUT }}
            className={`absolute inset-0 ${solid ? 'text-amber' : 'text-amber-light'}`}
          >
            {isDark ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
          </motion.span>
        </AnimatePresence>
      </span>

      {!compact && (
        <>
          <span
            className={`text-[10px] font-medium uppercase tracking-[0.16em] transition-colors duration-500 ${
              solid ? 'text-ink-dim group-hover:text-ink' : 'text-white/75 group-hover:text-white'
            }`}
          >
            {/* Placeholder keeps the pill from resizing before hydration */}
            {mounted ? (isDark ? 'Dusk' : 'Day') : '   '}
          </span>
          <span
            aria-hidden
            className={`w-6 h-3.5 rounded-full border relative shrink-0 transition-colors duration-500 ${
              solid ? 'bg-border-subtle border-border' : 'bg-white/15 border-white/25'
            }`}
          >
            <motion.span
              animate={{ x: isDark ? 10 : 0 }}
              transition={{ type: 'spring', stiffness: 480, damping: 30 }}
              className={`absolute left-[2px] top-1/2 w-2.5 h-2.5 -mt-[5px] rounded-full ${
                solid ? 'bg-amber-brand' : 'bg-amber-light'
              }`}
            />
          </span>
        </>
      )}
    </button>
  );
}
