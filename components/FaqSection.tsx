'use client';

import { useId, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';
import SectionHeading from '@/components/ui/SectionHeading';
import { EASE_OUT, fadeUp, stagger, VIEWPORT } from '@/lib/motion';

const faqs = [
  {
    q: "Does this violate Airbnb's terms?",
    a: "No. You own the property. Marketing it independently is standard practice — most hosts operate both channels without issue. Airbnb's terms restrict scraping and automated booking, not your right to have your own website.",
  },
  {
    q: "What if I'm not technical?",
    a: 'You don\'t need to touch a single setting. We handle domain registration, DNS configuration, SSL certificates, calendar integration, and payment links. You send us your best photos and text — we ship a finished, live site.',
  },
  {
    q: 'How do guests find my site?',
    a: "Three channels: Google indexing (we set up Search Console), links from your Airbnb profile and Instagram bio, and automated guest emails. Over time, travellers searching your property's name find your site first.",
  },
  {
    q: 'Can I keep my Airbnb listing too?',
    a: 'Absolutely. Most hosts run both. Airbnb handles discovery for new guests; your microsite captures repeat and referral guests at zero commission. The two channels feed each other — more visibility, more direct bookings.',
  },
  {
    q: 'What about payment security?',
    a: 'We integrate Stripe payment links — the same infrastructure used by millions of businesses worldwide. Guests pay securely by card. Funds settle directly to your bank account. No third-party processors, no risk.',
  },
  {
    q: 'Is the €15/mo hosting mandatory?',
    a: 'It covers your domain renewal, SSL certificate, hosting, and 24/7 uptime monitoring. If you already have a domain and hosting setup, we can deploy your site there instead. The €15 plan is the hassle-free default.',
  },
] as const;

export default function FaqSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const baseId = useId();

  return (
    <section id="faq" className="py-24 sm:py-32 bg-canvas border-t border-border">
      <div className="max-w-3xl mx-auto px-6 sm:px-8">
        <SectionHeading
          eyebrow="Common Questions"
          title="Everything hosts"
          accent="ask first."
          inline
          className="mb-14"
        />

        <motion.div
          variants={stagger(0.06)}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
          className="border-t border-border"
        >
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            const panelId = `${baseId}-panel-${idx}`;
            const buttonId = `${baseId}-button-${idx}`;

            return (
              <motion.div key={faq.q} variants={fadeUp} className="border-b border-border">
                <h3>
                  <button
                    id={buttonId}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpenIdx(isOpen ? null : idx)}
                    className="group w-full flex items-start justify-between gap-6 text-left py-6 cursor-pointer"
                  >
                    <span
                      className={`thb text-[18px] sm:text-[20px] transition-colors duration-300 ${
                        isOpen ? 'text-amber' : 'text-ink group-hover:text-amber'
                      }`}
                    >
                      {faq.q}
                    </span>

                    <span
                      aria-hidden
                      className={`shrink-0 mt-1 w-7 h-7 border flex items-center justify-center transition-all duration-500 ease-out ${
                        isOpen
                          ? 'border-amber-brand bg-amber-soft rotate-[135deg]'
                          : 'border-border group-hover:border-amber-line'
                      }`}
                    >
                      <Plus className="w-3.5 h-3.5 text-amber" strokeWidth={1.75} />
                    </span>
                  </button>
                </h3>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={panelId}
                      role="region"
                      aria-labelledby={buttonId}
                      key="panel"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{
                        height: { duration: 0.42, ease: EASE_OUT },
                        opacity: { duration: 0.28, ease: EASE_OUT },
                      }}
                      className="overflow-hidden"
                    >
                      <p className="tb !text-[14.5px] max-w-prose pb-7 pr-10">{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
