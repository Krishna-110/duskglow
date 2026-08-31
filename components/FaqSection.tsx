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
    a: "You don't need to touch a single setting. We register the domain in your name, wire up DNS, SSL and the calendar sync, and build the site around your photographs and your rates. You see a live link before anything is invoiced.",
  },
  {
    q: 'How do guests find my site?',
    a: "Links from your Airbnb profile and Instagram bio, automated guest emails, and — from Pro upward — Google indexing with Search Console set up for you. Over time, travellers searching your property's name find your site first.",
  },
  {
    q: 'Can I keep my Airbnb listing too?',
    a: 'Absolutely. Most hosts run both. Airbnb handles discovery for new guests; your own site captures repeat and referral guests with no commission taken. The two channels feed each other — more visibility, more direct bookings.',
  },
  {
    q: 'How do guests pay?',
    a: 'On Solo and Pro, a guest picks their dates and gets a priced quote by email — you confirm and take payment however you do today. Premium adds card payments through Stripe, in your own account, so funds settle straight to your bank. That piece is set up after launch rather than bundled into the build.',
  },
  {
    q: 'What is the monthly fee for?',
    a: 'Ember, the care plan every site comes with by default: hosting, SSL, nightly off-site backups, security updates, uptime and calendar-feed monitoring, an hour of wording and photograph changes, and a monthly email showing your enquiries and the commission you did not pay. If you would rather host somewhere else, you can — the site and the domain are yours and we will deploy them wherever you like. You would be giving up everything above along with the hosting, though: the backups, the monitoring, the security updates and the changes each month all come as one thing. Cancel whenever you want.',
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
