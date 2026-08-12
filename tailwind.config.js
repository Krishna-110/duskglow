/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        canvas: {
          DEFAULT: 'var(--canvas)',
          alt: 'var(--canvas-alt)',
          deep: 'var(--canvas-deep)',
        },
        surface: {
          DEFAULT: 'var(--surface)',
          raise: 'var(--surface-raise)',
        },
        ink: {
          DEFAULT: 'var(--ink)',
          soft: 'var(--ink-soft)',
          dim: 'var(--ink-dim)',
        },
        amber: {
          // DEFAULT is the AA-safe amber — `text-amber` / `bg-amber` stay
          // legible in both themes. Use `amber-brand` for decoration only.
          DEFAULT: 'var(--amber-ink)',
          brand: 'var(--amber)',
          soft: 'var(--amber-soft)',
          glow: 'var(--amber-glow)',
          line: 'var(--amber-line)',
          dark: '#7a4a2a',
          light: '#e2b791',
        },
        border: {
          DEFAULT: 'var(--border)',
          strong: 'var(--border-strong)',
          subtle: 'var(--border-subtle)',
        },
      },
      fontFamily: {
        serif: ['var(--font-playfair)', 'Playfair Display', 'Georgia', 'serif'],
        sans: ['var(--font-outfit)', 'Outfit', 'sans-serif'],
      },
      boxShadow: {
        e1: 'var(--sh-1)',
        e2: 'var(--sh-2)',
        e3: 'var(--sh-3)',
        e4: 'var(--sh-4)',
        glow: '0 0 28px var(--amber-line)',
      },
      transitionTimingFunction: {
        out: 'var(--e-out)',
        soft: 'var(--e-soft)',
        both: 'var(--e-both)',
      },
      transitionDuration: {
        600: '600ms',
        700: '700ms',
      },
      maxWidth: {
        shell: '1240px',
        prose: '68ch',
      },
      letterSpacing: {
        eyebrow: '0.2em',
      },
    },
  },
  plugins: [],
}
