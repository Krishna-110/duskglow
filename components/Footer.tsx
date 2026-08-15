'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { fadeUp, stagger, VIEWPORT } from '@/lib/motion';

interface FooterProps {
  onOpenBookCall: () => void;
}

const footerCols = [
  {
    heading: 'Pages',
    links: [
      { label: 'Features', href: '#features' },
      { label: 'Process', href: '#how' },
      { label: 'Pricing', href: '#pricing' },
      { label: 'FAQ', href: '#faq' },
    ],
  },
  {
    heading: 'Legal',
    links: [
      { label: 'Privacy Policy', href: '#' },
      { label: 'Terms of Service', href: '#' },
    ],
  },
];

export default function Footer({ onOpenBookCall }: FooterProps) {
  return (
    <>
      {/* ═══ CLOSING CTA ═══ */}
      <section id="cta" className="relative overflow-hidden">
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
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(12,9,7,0.72)_0%,rgba(12,9,7,0.55)_45%,rgba(12,9,7,0.82)_100%)]" />
        </div>

        <motion.div
          variants={stagger(0.1)}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
          className="relative z-10 max-w-3xl mx-auto px-6 sm:px-8 py-28 sm:py-36 text-center"
        >
          <motion.div variants={fadeUp} className="flex items-center justify-center gap-3 mb-7">
            <span aria-hidden className="h-px w-8 bg-gradient-to-r from-transparent to-amber-light/60" />
            <span className="te !text-white/60">Next Step</span>
            <span aria-hidden className="h-px w-8 bg-gradient-to-l from-transparent to-amber-light/60" />
          </motion.div>

          <motion.h2
            variants={fadeUp}
            className="th t-h2 text-white mb-6 text-balance [text-shadow:0_2px_20px_rgba(0,0,0,0.5)]"
          >
            Stop funding the{' '}
            <span className="text-amber-light italic">Airbnb tax.</span>
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className="text-[15.5px] leading-[1.72] text-white/80 mb-10 max-w-[52ch] mx-auto [text-shadow:0_1px_10px_rgba(0,0,0,0.5)]"
          >
            Book a 20-minute discovery call. We&rsquo;ll look at your listing, your
            photos, and sketch a microsite concept on the spot. No pitch — just a plan.
          </motion.p>

          <motion.div variants={fadeUp}>
            <button
              onClick={onOpenBookCall}
              className="btn-prim !bg-white !text-[#17120e] !py-[18px] !px-10 shadow-e4"
            >
              <span>Book Your Call</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>

          <motion.p variants={fadeUp} className="mt-7 text-[13px] text-white/65">
            Or write to us at{' '}
            <a
              href="mailto:hello@duskglow.site"
              className="link-u text-amber-light font-medium"
            >
              hello@duskglow.site
            </a>
          </motion.p>
        </motion.div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="bg-canvas border-t border-border pt-16 pb-9">
        <div className="max-w-shell mx-auto px-6 sm:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12">
            {/* Brand */}
            <div className="md:col-span-5">
              <a
                href="#"
                className="font-serif font-semibold text-[22px] tracking-tight text-ink inline-block mb-4"
              >
                Dusk<span className="text-amber">glow</span>
              </a>
              <p className="tbsm !text-[13px] max-w-[38ch]">
                Custom direct-booking microsites for villa hosts — and any
                short-term rental — ready to own their guest relationships and
                their brand equity.
              </p>
            </div>

            <div className="md:col-span-1 hidden md:block" />

            {footerCols.map((col) => (
              <nav key={col.heading} className="md:col-span-2" aria-label={col.heading}>
                <h2 className="te mb-3">{col.heading}</h2>
                <ul className="list-none">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      {/* min-h gives a comfortable touch target without
                          disturbing the visual rhythm */}
                      <a
                        href={link.href}
                        className="group flex items-center min-h-[34px] text-[13px] text-ink-soft hover:text-amber transition-colors"
                      >
                        <span className="link-u">{link.label}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}

            <div className="md:col-span-2">
              <h2 className="te mb-3">Contact</h2>
              <a
                href="mailto:hello@duskglow.site"
                className="group flex items-center min-h-[34px] text-[13px] text-ink-soft hover:text-amber transition-colors"
              >
                <span className="link-u">hello@duskglow.site</span>
              </a>
              <span className="tbsm !text-[12px] block mt-1.5">
                Response within 24 hours
              </span>
            </div>
          </div>

          <hr className="rule-fade border-0" />

          <div className="pt-7 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-[12px] text-ink-dim text-center sm:text-left">
              © {new Date().getFullYear()} Duskglow. Built for hosts who believe their
              villa deserves its own front door online.
            </p>
            <a
              href="#"
              className="te hover:!text-amber transition-colors flex items-center min-h-[34px]"
            >
              Back to top ↑
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
