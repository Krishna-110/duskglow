import type { Transition, Variants } from 'framer-motion';

/**
 * Shared easing curves. Everything on the page reveals with the same
 * expo-out feel — that consistency is most of what reads as "considered".
 */
export const EASE_OUT = [0.22, 1, 0.36, 1] as const;
export const EASE_SOFT = [0.4, 0, 0.2, 1] as const;
export const EASE_BOTH = [0.65, 0, 0.35, 1] as const;

export const VIEWPORT = { once: true, margin: '-12% 0px -12% 0px' } as const;

export const springSoft: Transition = {
  type: 'spring',
  stiffness: 120,
  damping: 26,
  restDelta: 0.001,
};

/** Small vertical rise. Distance stays short; the easing does the work. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.85, ease: EASE_OUT },
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 1, ease: EASE_SOFT } },
};

export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -28 },
  show: { opacity: 1, x: 0, transition: { duration: 0.9, ease: EASE_OUT } },
};

export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 28 },
  show: { opacity: 1, x: 0, transition: { duration: 0.9, ease: EASE_OUT } },
};

/** Photography unmasks upward and settles out of a slight scale. */
export const revealImage: Variants = {
  hidden: { opacity: 0, scale: 1.06, clipPath: 'inset(14% 0% 0% 0%)' },
  show: {
    opacity: 1,
    scale: 1,
    clipPath: 'inset(0% 0% 0% 0%)',
    transition: { duration: 1.25, ease: EASE_OUT },
  },
};

/** Parent that walks its children in. */
export const stagger = (gap = 0.08, delay = 0): Variants => ({
  hidden: {},
  show: {
    transition: { staggerChildren: gap, delayChildren: delay },
  },
});

/**
 * Returns a copy of `variants` with `delay` folded into its `show` transition.
 *
 * Framer resolves a variant's own `transition` ahead of the `transition` prop,
 * so a delay passed as a prop would be silently dropped. It also means an
 * explicit delay defeats a parent's `staggerChildren` — so only use this on
 * standalone reveals, never on children of a `stagger()` parent.
 */
export function withDelay(variants: Variants, delay: number): Variants {
  if (!delay) return variants;
  const show = variants.show;
  if (!show || typeof show === 'function') return variants;

  return {
    ...variants,
    show: {
      ...show,
      transition: { ...(show.transition ?? {}), delay },
    },
  };
}

/** Modal shell + backdrop. */
export const modalBackdrop: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.28, ease: EASE_SOFT } },
  exit: { opacity: 0, transition: { duration: 0.22, ease: EASE_SOFT } },
};

export const modalPanel: Variants = {
  hidden: { opacity: 0, scale: 0.97, y: 14 },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.42, ease: EASE_OUT },
  },
  exit: {
    opacity: 0,
    scale: 0.98,
    y: 8,
    transition: { duration: 0.2, ease: EASE_SOFT },
  },
};
