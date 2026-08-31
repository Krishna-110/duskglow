import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

/**
 * Shell for the legal pages. Deliberately does not reuse Navbar/Footer —
 * both take an `onOpenBookCall` handler and pull the booking modal in with
 * them, which a terms page has no business loading.
 */
export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-canvas flex flex-col">
      <header className="border-b border-border">
        <div className="max-w-[720px] mx-auto px-6 sm:px-8 py-6 flex items-center justify-between gap-6">
          <Link href="/" className="font-serif font-semibold text-[21px] text-ink">
            Duskglow
          </Link>
          <Link
            href="/"
            className="te !text-[10px] text-ink-dim hover:text-amber transition-colors duration-300 inline-flex items-center gap-2"
          >
            <ArrowLeft aria-hidden className="w-3.5 h-3.5" />
            Back to the site
          </Link>
        </div>
      </header>

      <main className="flex-1">
        <article className="max-w-[720px] mx-auto px-6 sm:px-8 py-16 sm:py-24 legal">
          {children}
        </article>
      </main>

      <footer className="border-t border-border">
        <div className="max-w-[720px] mx-auto px-6 sm:px-8 py-7 flex flex-wrap items-center gap-x-6 gap-y-2">
          <span className="tbsm !text-[12px]">
            &copy; {new Date().getFullYear()} Duskglow
          </span>
          <Link href="/privacy" className="tbsm !text-[12px] hover:text-amber transition-colors">
            Privacy
          </Link>
          <Link href="/terms" className="tbsm !text-[12px] hover:text-amber transition-colors">
            Terms
          </Link>
          <a
            href="mailto:hello@duskglow.site"
            className="tbsm !text-[12px] hover:text-amber transition-colors"
          >
            hello@duskglow.site
          </a>
        </div>
      </footer>
    </div>
  );
}
