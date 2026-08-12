'use client';

import { useCallback, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { modalBackdrop, modalPanel } from '@/lib/motion';

interface ModalShellProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  /** Applied to the panel. Pass sizing/skin here. */
  panelClassName?: string;
  labelledBy: string;
  /** Extra padding around the panel on the backdrop. */
  containerClassName?: string;
}

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Backdrop + panel with the behaviour a dialog is expected to have: Escape to
 * dismiss, click-outside to dismiss, body scroll lock without layout shift,
 * focus moved in on open and returned on close, and a Tab loop inside.
 *
 * `AnimatePresence` lives above the `isOpen` check so exit animations run —
 * unmounting on `!isOpen` before this point skips them entirely.
 */
export default function ModalShell({
  isOpen,
  onClose,
  children,
  panelClassName = '',
  containerClassName = 'p-4 sm:p-6',
  labelledBy,
}: ModalShellProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const restoreFocusTo = useRef<HTMLElement | null>(null);

  /* ── Escape + Tab trap ── */
  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key !== 'Tab' || !panelRef.current) return;

      const nodes = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)
      ).filter((n) => n.offsetParent !== null);
      if (nodes.length === 0) return;

      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      const active = document.activeElement as HTMLElement | null;

      if (e.shiftKey && (active === first || !panelRef.current.contains(active))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (!isOpen) return;
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onKeyDown]);

  /* ── Scroll lock, compensating for the hidden scrollbar ── */
  useEffect(() => {
    if (!isOpen) return;

    const { body } = document;
    const prevOverflow = body.style.overflow;
    const prevPadding = body.style.paddingRight;
    const gap = window.innerWidth - document.documentElement.clientWidth;

    body.style.overflow = 'hidden';
    if (gap > 0) body.style.paddingRight = `${gap}px`;

    return () => {
      body.style.overflow = prevOverflow;
      body.style.paddingRight = prevPadding;
    };
  }, [isOpen]);

  /* ── Focus in on open, back to the trigger on close ── */
  useEffect(() => {
    if (isOpen) {
      restoreFocusTo.current = document.activeElement as HTMLElement | null;
      // Focus synchronously: the panel is already committed by the time effects
      // run, and requestAnimationFrame never fires in a hidden/background tab.
      const target =
        panelRef.current?.querySelector<HTMLElement>(FOCUSABLE) ?? panelRef.current;
      target?.focus();
      return;
    }

    restoreFocusTo.current?.focus?.();
    restoreFocusTo.current = null;
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="backdrop"
          variants={modalBackdrop}
          initial="hidden"
          animate="show"
          exit="exit"
          onMouseDown={(e) => {
            // Only dismiss on a press that starts on the backdrop itself.
            if (e.target === e.currentTarget) onClose();
          }}
          className={`fixed inset-0 z-[100] flex items-center justify-center bg-[rgba(14,10,7,0.72)] backdrop-blur-md ${containerClassName}`}
        >
          <motion.div
            key="panel"
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={labelledBy}
            tabIndex={-1}
            variants={modalPanel}
            className={`relative outline-none ${panelClassName}`}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
