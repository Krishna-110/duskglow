'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Check, ArrowRight } from 'lucide-react';
import SectionHeading from '@/components/ui/SectionHeading';
import { fadeUp, stagger, VIEWPORT } from '@/lib/motion';

interface PricingSectionProps {
  onSelectPlan: (planName: string) => void;
}

type Currency = 'EUR' | 'USD' | 'GBP';

const prices: Record<
  Currency,
  { solo: number; pro: number; premium: number; hosting: number; symbol: string }
> = {
  EUR: { solo: 499, pro: 999, premium: 1999, hosting: 15, symbol: '€' },
  USD: { solo: 549, pro: 1099, premium: 2199, hosting: 16, symbol: '$' },
  GBP: { solo: 429, pro: 849, premium: 1699, hosting: 13, symbol: '£' },
};

export default function PricingSection({ onSelectPlan }: PricingSectionProps) {
  const [currency, setCurrency] = useState<Currency>('EUR');
  const p = prices[currency];

  const plans = [
    {
      name: 'Solo',
      price: p.solo,
      desc: 'For the independent host ready to go direct.',
      image:
        'https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=600&dpr=2',
      feat: [
        'Single-page microsite',
        'Up to 12 curated images',
        'Booking calendar embed',
        'Payment link integration',
        'Mobile-responsive design',
        'Domain setup assistance',
      ],
      featured: false,
    },
    {
      name: 'Pro',
      price: p.pro,
      desc: 'Everything you need to build a direct channel.',
      image:
        'https://images.pexels.com/photos/37030525/pexels-photo-37030525.jpeg?auto=compress&cs=tinysrgb&w=600&dpr=2',
      feat: [
        'Everything in Solo',
        'Unlimited photography gallery',
        'Custom domain registration (1yr)',
        'Email capture + guest list',
        'Retargeting pixel setup',
        'Google Search Console indexing',
        '2 revision rounds',
      ],
      featured: true,
    },
    {
      name: 'Premium',
      price: p.premium,
      desc: 'For the property that operates like a boutique hotel.',
      image:
        'https://images.pexels.com/photos/35069530/pexels-photo-35069530.jpeg?auto=compress&cs=tinysrgb&w=600&dpr=2',
      feat: [
        'Everything in Pro',
        'Multi-page site (up to 5 pages)',
        'Blog integration for SEO',
        'Multi-language (up to 3)',
        'Automated guest email sequences',
        'Monthly analytics reports',
        'Priority support',
      ],
      featured: false,
    },
  ];

  return (
    <section id="pricing" className="py-24 sm:py-32 bg-canvas-alt border-t border-border">
      <div className="max-w-shell mx-auto px-6 sm:px-8">
        <SectionHeading
          eyebrow="Investment"
          title="One build."
          accent="Lifetime returns."
          inline
          body={`Pay once for the microsite. Hosting is ${p.symbol}${p.hosting}/month — recouped with a single direct booking.`}
          className="mb-12 max-w-[42rem]"
        >
          <div className="seg mt-8" role="group" aria-label="Currency">
            {(['EUR', 'USD', 'GBP'] as Currency[]).map((curr) => (
              <button
                key={curr}
                onClick={() => setCurrency(curr)}
                data-active={currency === curr}
                aria-pressed={currency === curr}
                className="relative"
              >
                {currency === curr && (
                  <motion.span
                    aria-hidden
                    layoutId="pricing-currency-pill"
                    transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                    className="absolute inset-0 bg-amber"
                  />
                )}
                <span className="relative">
                  {curr} {prices[curr].symbol}
                </span>
              </button>
            ))}
          </div>
        </SectionHeading>

        <motion.div
          variants={stagger(0.1)}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-7 items-stretch"
        >
          {plans.map((plan) => (
            <motion.div
              key={plan.name}
              variants={fadeUp}
              className={`group relative flex flex-col bg-surface border transition-[box-shadow,transform,border-color] duration-700 ease-out hover:-translate-y-1 ${
                plan.featured
                  ? // ring instead of border-2 so the card doesn't sit 1px
                    // off its neighbours
                    'border-amber-brand ring-1 ring-amber-brand shadow-e3 md:-mt-4 md:mb-4'
                  : 'border-border shadow-e1 hover:shadow-e3 hover:border-border-strong'
              }`}
            >
              {plan.featured && (
                <span className="absolute -top-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-brand to-transparent" />
              )}

              {/* Banner */}
              <div className="relative h-32 w-full overflow-hidden img-zoom shrink-0">
                <Image
                  src={plan.image}
                  alt=""
                  aria-hidden
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  quality={90}
                  className="object-cover"
                />
                <span
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-t from-[rgba(14,10,7,0.45)] to-transparent"
                />
                {plan.featured && (
                  <span className="absolute bottom-3 left-4 text-[9.5px] font-medium uppercase tracking-[0.18em] bg-amber text-white px-2.5 py-1.5">
                    Most Selected
                  </span>
                )}
              </div>

              {/* Body */}
              <div className="p-7 flex-1 flex flex-col">
                <h3 className="thb text-[26px] text-ink mb-1.5">{plan.name}</h3>
                <p className="tbsm !text-[13px] mb-7 min-h-[2.8em]">{plan.desc}</p>

                <div className="mb-7 pb-7 border-b border-border-subtle">
                  <span className="font-serif font-semibold t-price text-ink leading-none num">
                    {p.symbol}
                    {plan.price.toLocaleString()}
                  </span>
                  <span className="tbsm !text-[12px] block mt-2.5">
                    one-time · then {p.symbol}
                    {p.hosting}/mo hosting
                  </span>
                </div>

                <ul className="list-none space-y-3 mb-9 flex-1">
                  {plan.feat.map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <Check
                        aria-hidden
                        className="w-3.5 h-3.5 text-amber shrink-0 mt-[3px]"
                        strokeWidth={2.5}
                      />
                      <span className="tb !text-[13.5px] !leading-[1.55]">{item}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => onSelectPlan(plan.name)}
                  className={`w-full mt-auto ${plan.featured ? 'btn-prim' : 'btn-outline'}`}
                >
                  <span>Choose {plan.name}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Grounded in the FAQ copy below — no new commercial claims. */}
        <p className="tbsm !text-[12px] text-center mt-10 max-w-[54ch] mx-auto">
          Hosting covers your domain renewal, SSL certificate, and 24/7 uptime
          monitoring. Already have a domain and host? We&rsquo;ll deploy to your
          existing setup instead.
        </p>
      </div>
    </section>
  );
}
