'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, Sparkles, ExternalLink, RotateCw } from 'lucide-react';
import ModalShell from '@/components/ui/ModalShell';
import { EASE_OUT } from '@/lib/motion';

interface VillaPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * The demo used to be a hand-built mock of a villa site. It now frames the
 * real thing — a Duskglow build, deployed and fully interactive: guests can
 * pick dates on the live calendar, switch currency and complete a booking
 * without leaving this page.
 */
const DEMO_URL = 'https://villaparadiso.devs.surf';
/* Shown in the address bar only. The point of the demo is "this is your site
   on your own domain", and a .com reads as a real villa business where the
   hosting subdomain reads as a sandbox. The LIVE DEMO badge marks it, and the
   open-in-new-tab control still goes to DEMO_URL. */
const DISPLAY_DOMAIN = 'villaparadiso.com';

export default function VillaPreviewModal({ isOpen, onClose }: VillaPreviewModalProps) {
  const [loaded, setLoaded] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  // Re-arm the loader each time the modal opens so the skeleton shows again.
  useEffect(() => {
    if (!isOpen) setLoaded(false);
  }, [isOpen]);

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={onClose}
      labelledBy="villa-preview-title"
      /* Edge-to-edge on a phone: 8px of backdrop around a near-full-screen
         panel just wastes the little height there is. */
      containerClassName="p-0 sm:p-5 md:p-8"
      panelClassName="w-full max-w-6xl h-[100dvh] sm:h-[92vh] bg-[#141210] sm:border sm:border-[#3a332e] text-[#f0eae1] shadow-e4 flex flex-col overflow-hidden"
    >
      {/*
        Browser chrome — the point of the demo is "this is your site, on your
        domain". On a phone that framing costs more than it earns: chrome plus
        footer took 112px, so below sm it collapses to one slim bar and the
        footer drops entirely, handing the demo the whole screen.
      */}
      <div className="bg-[#1e1a16] px-3 sm:px-4 py-1.5 sm:py-3 border-b border-[#3a332e] flex items-center gap-2 sm:gap-4 shrink-0">
        <div className="hidden sm:flex items-center gap-2 shrink-0">
          <button
            onClick={onClose}
            aria-label="Close demo"
            className="w-3 h-3 rounded-full bg-[#ef6c5b] hover:brightness-125 transition"
          />
          <span aria-hidden className="w-3 h-3 rounded-full bg-[#e0b34a]" />
          <span aria-hidden className="w-3 h-3 rounded-full bg-[#54b969]" />
        </div>

        <div className="flex items-center gap-2 bg-[#120f0d] border border-[#3a332e] px-3 sm:px-4 py-1.5 rounded-full text-[10.5px] sm:text-[11px] w-full max-w-md mx-auto min-w-0">
          <Lock className="w-3 h-3 text-[#54b969] shrink-0" />
          <span className="truncate font-mono text-[#f0eae1]">{DISPLAY_DOMAIN}</span>
          <span className="ml-auto shrink-0 text-[9px] text-amber-light bg-amber-light/10 px-1.5 sm:px-2 py-0.5 rounded uppercase tracking-[0.12em] font-medium">
            <span className="hidden sm:inline">Live </span>Demo
          </span>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => { setLoaded(false); setReloadKey((k) => k + 1); }}
            aria-label="Reload demo"
            className="hidden sm:flex w-8 h-8 items-center justify-center rounded-full text-[#9a8f7e] hover:text-[#f0eae1] hover:bg-white/5 transition-colors"
          >
            <RotateCw className="w-4 h-4" />
          </button>
          <a
            href={DEMO_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open demo in a new tab"
            className="w-8 h-8 flex items-center justify-center rounded-full text-[#9a8f7e] hover:text-[#f0eae1] hover:bg-white/5 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
          <button
            onClick={onClose}
            aria-label="Close demo"
            className="w-8 h-8 flex items-center justify-center rounded-full text-[#9a8f7e] hover:text-[#f0eae1] hover:bg-white/5 transition-colors"
          >
            <X className="w-[18px] h-[18px]" />
          </button>
        </div>
      </div>

      {/* The live site */}
      {/* overscroll-contain stops a scroll that reaches the frame's end from
          chaining to the page behind it — the usual cause of a nested scroll
          area feeling like it fights the parent on touch. */}
      <div className="relative flex-1 overflow-hidden bg-[#faf7f2] [overscroll-behavior:contain] touch-pan-y">
        <h2 id="villa-preview-title" className="sr-only">
          Live demo — Villa Paradiso direct booking site
        </h2>

        {/* Seats the page inside the chrome instead of letting it float edge-to-edge */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[5] shadow-[inset_0_1px_0_rgba(0,0,0,.28),inset_0_14px_28px_-18px_rgba(0,0,0,.45)]"
        />

        <AnimatePresence>
          {!loaded && (
            <motion.div
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: EASE_OUT }}
              className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-[#141210]"
            >
              <span className="w-8 h-8 rounded-full border-2 border-[#3a332e] border-t-amber-light animate-spin" />
              <p className="text-[12px] text-[#9a8f7e] tracking-wide">
                Loading the live site…
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <iframe
          key={reloadKey}
          src={DEMO_URL}
          title="Villa Paradiso — live direct booking demo"
          onLoad={() => setLoaded(true)}
          /*
           * Natural size, no transform. This used to render at 1440px and
           * scale down to fit, which made text soft — the layer is rasterised
           * then resampled — and made scrolling inside the frame expensive,
           * since a scaled iframe re-composites on every paint.
           *
           * The scale was never needed: the panel is max-w-6xl (1152px) and the
           * framed site's widest breakpoint is 1100px, so at natural size it
           * already renders the full desktop layout.
           */
          className="w-full h-full border-0 block"
          /*
           * allow-same-origin is required: without it the frame gets an opaque
           * origin and localStorage throws, which kills the demo's 3-hour
           * booking hold. Pairing it with allow-scripts is only unsafe when the
           * framed document shares this page's origin — it could then drop its
           * own sandbox. This is a different origin, so the guarantee holds.
           */
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
        />
      </div>

      {/*
        Footer stays a single row at every width. The full sentence wrapped to
        seven lines on a phone — 118px, 15% of the panel — so the short form is
        used below sm and the explanation only appears where it fits.
      */}
      <div className="hidden sm:flex bg-[#1b1714] px-4 sm:px-8 py-3 sm:py-3.5 border-t border-[#3a332e] items-center justify-between gap-3 shrink-0">
        <p className="flex items-center gap-2.5 text-[11.5px] sm:text-[12px] text-[#c4b8a6] min-w-0">
          <Sparkles className="w-4 h-4 text-amber-light shrink-0" />
          <span className="hidden sm:inline">
            A real Duskglow build — try the calendar and book a stay. This is what
            your property looks like to guests.
          </span>
          <span className="sm:hidden truncate">A real build — try the calendar.</span>
        </p>
        <button
          onClick={onClose}
          className="border border-[#3a332e] hover:border-amber-light/40 hover:text-white text-[#c4b8a6] px-4 sm:px-5 py-2.5 transition-colors uppercase tracking-[0.14em] font-medium text-[10.5px] shrink-0 whitespace-nowrap"
        >
          Close
        </button>
      </div>
    </ModalShell>
  );
}
