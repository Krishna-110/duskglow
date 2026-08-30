'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Check, X, ArrowRight } from 'lucide-react';
import SectionHeading from '@/components/ui/SectionHeading';
import { fadeUp, stagger, VIEWPORT } from '@/lib/motion';

interface PricingSectionProps {
  onSelectPlan: (planName: string) => void;
}

type Currency = 'EUR' | 'USD' | 'GBP';
type TierKey = 'solo' | 'pro' | 'premium';

/**
 * A cell is either a plain tick, an omission, or a value that differs by tier
 * (page counts, turnaround). Writing the ledger once and indexing by tier
 * keeps the three cards from drifting apart, which is what happened last time
 * a row was added by hand to two of them.
 */
type Cell = boolean | string;
interface Row {
  label: string;
  solo: Cell;
  pro: Cell;
  premium: Cell;
}

const prices: Record<
  Currency,
  {
    symbol: string;
    solo: number;
    pro: number;
    premium: number;
    ember: number;
    signal: number;
    beacon: number;
    inbox: number;
    extraProperty: number;
  }
> = {
  EUR: {
    symbol: '€',
    solo: 749, pro: 1299, premium: 1999,
    ember: 29, signal: 49, beacon: 99,
    inbox: 5, extraProperty: 15,
  },
  USD: {
    symbol: '$',
    solo: 829, pro: 1429, premium: 2199,
    ember: 32, signal: 54, beacon: 109,
    inbox: 6, extraProperty: 17,
  },
  GBP: {
    symbol: '£',
    solo: 639, pro: 1099, premium: 1699,
    ember: 25, signal: 42, beacon: 85,
    inbox: 4, extraProperty: 13,
  },
};

const LEDGER: { group: string; rows: Row[] }[] = [
  {
    group: 'The site',
    rows: [
      { label: 'Web pages', solo: '5', pro: '13', premium: 'Unlimited' },
      { label: 'Photographs', solo: '40', pro: '140', premium: '300' },
      { label: 'Built mobile-first', solo: true, pro: true, premium: true },
      { label: 'Full-bleed photo galleries', solo: true, pro: true, premium: true },
      { label: 'Video or virtual tour', solo: true, pro: true, premium: true },
      { label: 'Map, exact or approximate — your call', solo: true, pro: true, premium: true },
      { label: 'WhatsApp button', solo: true, pro: true, premium: true },
      { label: 'Guest reviews on your own page', solo: true, pro: true, premium: true },
      { label: 'A layout drawn for your property, not a template', solo: false, pro: false, premium: true },
      { label: 'Blog', solo: false, pro: false, premium: true },
      { label: 'Three languages', solo: false, pro: false, premium: true },
      { label: 'Prices in your guest’s currency', solo: false, pro: false, premium: true },
    ],
  },
  {
    group: 'Taking bookings',
    rows: [
      { label: 'Availability calendar guests can pick from', solo: true, pro: true, premium: true },
      { label: 'Calendar read from Airbnb, Booking.com and Vrbo', solo: true, pro: true, premium: true },
      { label: 'Seasonal rates, and separate weekend pricing', solo: true, pro: true, premium: true },
      { label: 'Minimum-stay rules, set per season', solo: true, pro: true, premium: true },
      { label: 'Automatic quotes — fees and tax already applied', solo: true, pro: true, premium: true },
      { label: 'Cleaning, pet and extra-guest fees', solo: true, pro: true, premium: true },
      { label: 'Extras the guest can add — transfer, cot, late checkout, hamper', solo: true, pro: true, premium: true },
      { label: 'Tourist tax, applied the way your region does it', solo: true, pro: true, premium: true },
      { label: 'Deposit to hold the dates, and a refundable damage deposit', solo: true, pro: true, premium: true },
      { label: 'Length-of-stay and last-minute discounts', solo: true, pro: true, premium: true },
      { label: 'Enquiries priced and emailed to you and the guest', solo: true, pro: true, premium: true },
      // "set up after launch" keeps Stripe out of the build timeline without
      // demoting it back into a separate add-on block.
      { label: 'Card payments by Stripe — your own account, set up after launch', solo: false, pro: false, premium: true },
    ],
  },
  {
    group: 'Your admin',
    rows: [
      { label: 'Every enquiry and booking in one place', solo: true, pro: true, premium: true },
      { label: 'Accept or decline, and the calendar updates', solo: true, pro: true, premium: true },
      { label: 'Change your own rates, seasons and fees', solo: false, pro: true, premium: true },
      { label: 'Add and price your own extras', solo: false, pro: true, premium: true },
      { label: 'Change the whole site yourself, any time', solo: false, pro: false, premium: true },
      { label: 'Automated enquiry and follow-up emails', solo: true, pro: true, premium: true },
      { label: 'Monthly analytics report', solo: false, pro: false, premium: true },
      { label: 'More than one property', solo: false, pro: false, premium: true },
    ],
  },
  {
    group: 'Getting found',
    rows: [
      { label: 'Domain chosen on the call and registered in your name — DNS and SSL set up for you', solo: true, pro: true, premium: true },
      { label: 'Email at your own domain, forwarded wherever you read email', solo: true, pro: true, premium: true },
      { label: 'Google indexing and Search Console', solo: false, pro: true, premium: true },
      { label: 'Email capture, so the guest list is yours', solo: false, pro: true, premium: true },
      { label: 'Retargeting pixel', solo: false, pro: true, premium: true },
      { label: 'Social profiles set up and linked', solo: false, pro: false, premium: true },
    ],
  },
  {
    group: 'Working with us',
    rows: [
      { label: 'Revisions', solo: 'until you’re happy', pro: 'until you’re happy', premium: 'until you’re happy' },
      { label: 'Changes turned around in', solo: '3 working days', pro: '2 working days', premium: 'Next working day' },
      { label: 'Support', solo: 'Email', pro: 'Priority', premium: 'Priority, direct line' },
    ],
  },
];

const TIERS: {
  key: TierKey;
  name: string;
  desc: string;
  image: string;
  featured: boolean;
}[] = [
  {
    key: 'solo',
    name: 'Solo',
    desc: 'Everything a guest needs to book.',
    image:
      'https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=600&dpr=2',
    featured: false,
  },
  {
    key: 'pro',
    name: 'Pro',
    desc: 'Built to be found.',
    image:
      'https://images.pexels.com/photos/37030525/pexels-photo-37030525.jpeg?auto=compress&cs=tinysrgb&w=600&dpr=2',
    featured: true,
  },
  {
    key: 'premium',
    name: 'Premium',
    desc: 'Yours to run.',
    image:
      'https://images.pexels.com/photos/35069530/pexels-photo-35069530.jpeg?auto=compress&cs=tinysrgb&w=600&dpr=2',
    featured: false,
  },
];

const STEPS = [
  {
    k: 'One',
    title: 'The call',
    body: 'Your property, your rates, your seasons. Half an hour, no pitch.',
  },
  {
    k: 'Two',
    title: 'The preview',
    body: 'A live link to your finished site. Nothing invoiced, nothing owed.',
  },
  {
    k: 'Three',
    title: 'Your changes',
    body: 'We work through your notes. Photographs, wording, whatever isn’t you yet.',
  },
  {
    k: 'Four',
    title: 'Live, and paid',
    body: 'Only once you’re happy. On your own domain, taking enquiries, calendar already reading your platforms.',
  },
];

const INCLUDED = [
  'No payment until you’re happy',
  'No commission, ever',
  'No per-booking fee',
  'No contract or lock-in',
  'Your guest list stays yours',
  'You own the site and the domain',
];

export default function PricingSection({ onSelectPlan }: PricingSectionProps) {
  const [currency, setCurrency] = useState<Currency>('EUR');
  const p = prices[currency];
  const money = (n: number) => `${p.symbol}${n.toLocaleString()}`;

  /** Care plans read from `p` so they follow the currency switch too. */
  const carePlans = [
    {
      name: 'Ember',
      price: p.ember,
      desc: 'Included with every site.',
      featured: false,
      inherits: null as string | null,
      feat: [
        'Hosting and SSL, always current',
        'We watch your domain and your certificate. Neither lapses on our watch.',
        'Nightly off-site backup, with a restore that has actually been tested',
        'Security patches and updates — nothing for you to install',
        'Uptime monitoring. We hear about it before you do.',
        'Every calendar feed checked, and fixed if one goes quiet',
        'A monthly email: your enquiries, where they came from, and the commission you didn’t pay',
        'Unlimited photographs — no storage tier to outgrow',
        'A preview link for every change, before it goes live',
        'Up to an hour of wording and photograph changes',
        'Email support, answered within two working days',
        `Your own inbox — ${money(p.inbox)}/month`,
      ],
    },
    {
      name: 'Signal',
      price: p.signal,
      desc: 'One calendar, and you hear about it first.',
      featured: true,
      inherits: 'Ember',
      feat: [
        'One calendar across Airbnb, Booking.com, Vrbo and direct — a booking on any of them closes the dates everywhere, in seconds',
        'A WhatsApp the moment anything books you, from any channel, in one thread',
        'Direct bookings settle instantly — the same dates cannot be sold twice',
        'Rates and minimum stays pushed out to every channel from one place',
        'Automatic review request after every checkout — reviews on your own site, not only theirs',
        'Abandoned enquiry follow-up, sent for you',
        'Your own inbox, included',
        'Your bookings and guest list exportable any time, one click',
      ],
    },
    {
      name: 'Beacon',
      price: p.beacon,
      desc: 'Someone working on it, not just watching it.',
      featured: false,
      inherits: 'Signal',
      feat: [
        'Your Google Business Profile kept current, with a post each month',
        'Search Console watched — broken pages and lost rankings fixed',
        'One new page or landing page each quarter',
        'A campaign to your guest list each month, written and sent',
        'Page speed watched, and fixed when it slips',
        'A reminder before each season opens, so next summer gets priced in October',
        'A quarterly call: what worked, what to change',
        'Three hours of changes, answered within one working day',
        'A direct line, not a shared inbox',
      ],
    },
  ];

  return (
    <section id="pricing" className="py-24 sm:py-32 bg-canvas-alt border-t border-border">
      <div className="max-w-shell mx-auto px-6 sm:px-8">
        <SectionHeading
          eyebrow="Pricing"
          title="One payment,"
          accent={`then ${money(p.ember)} a month.`}
          inline
          body="No commission, no per-booking fee, no contract. And nothing to pay until you’ve seen your site and you’re happy with it."
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

        {/* ---------- The three builds ---------- */}
        <motion.div
          variants={stagger(0.1)}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-7 items-stretch"
        >
          {TIERS.map((tier) => (
            <motion.div
              key={tier.key}
              variants={fadeUp}
              className={`group relative flex flex-col bg-surface border transition-[box-shadow,transform,border-color] duration-700 ease-out hover:-translate-y-1 ${
                tier.featured
                  ? // ring instead of border-2 so the card doesn't sit 1px
                    // off its neighbours
                    'border-amber-brand ring-1 ring-amber-brand shadow-e3 md:-mt-4 md:mb-4'
                  : 'border-border shadow-e1 hover:shadow-e3 hover:border-border-strong'
              }`}
            >
              {tier.featured && (
                <span className="absolute -top-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-brand to-transparent" />
              )}

              {/* Banner */}
              <div className="relative h-32 w-full overflow-hidden img-zoom shrink-0">
                <Image
                  src={tier.image}
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
                {tier.featured && (
                  <span className="absolute bottom-3 left-4 text-[9.5px] font-medium uppercase tracking-[0.18em] bg-amber text-white px-2.5 py-1.5">
                    Most hosts start here
                  </span>
                )}
              </div>

              {/* Body */}
              <div className="p-7 flex-1 flex flex-col">
                <h3 className="thb text-[26px] text-ink mb-1.5">{tier.name}</h3>
                <p className="tbsm !text-[13px] mb-7 min-h-[2.8em]">{tier.desc}</p>

                <div className="mb-7 pb-7 border-b border-border-subtle">
                  <span className="font-serif font-semibold t-price text-ink leading-none num">
                    {money(p[tier.key])}
                  </span>
                  <span className="tbsm !text-[12px] block mt-2.5">
                    one-time · then {money(p.ember)}/mo · Ember care
                  </span>
                </div>

                <div className="flex-1 mb-9">
                  {LEDGER.map((section) => (
                    <div key={section.group} className="mb-5 last:mb-0">
                      <p className="te !text-[9.5px] mb-3 pt-3 border-t border-border-subtle first:border-0 first:pt-0">
                        {section.group}
                      </p>
                      <ul className="list-none space-y-2.5">
                        {section.rows.map((row) => {
                          const cell = row[tier.key];
                          const has = cell !== false;
                          return (
                            <li
                              key={row.label}
                              className={`flex items-start gap-2.5 ${has ? '' : 'opacity-45'}`}
                            >
                              {has ? (
                                <Check
                                  aria-hidden
                                  className="w-3.5 h-3.5 text-amber shrink-0 mt-[3px]"
                                  strokeWidth={2.5}
                                />
                              ) : (
                                <X
                                  aria-hidden
                                  className="w-3.5 h-3.5 text-ink/40 shrink-0 mt-[3px]"
                                  strokeWidth={2.5}
                                />
                              )}
                              <span className="tb !text-[13px] !leading-[1.5]">
                                {row.label}
                                {typeof cell === 'string' && (
                                  <>
                                    {' — '}
                                    <strong className="text-ink font-medium">{cell}</strong>
                                  </>
                                )}
                              </span>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => onSelectPlan(tier.name)}
                  className={`w-full mt-auto ${tier.featured ? 'btn-prim' : 'btn-outline'}`}
                >
                  <span>Choose {tier.name}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* ---------- How it goes ---------- */}
        <motion.div
          variants={stagger(0.08)}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-border border border-border mt-6"
        >
          {STEPS.map((step) => (
            <motion.div key={step.k} variants={fadeUp} className="bg-surface p-6">
              <p className="te !text-[9.5px] mb-2">{step.k}</p>
              <h4 className="thb text-[18px] text-ink mb-1.5">{step.title}</h4>
              <p className="tbsm !text-[13px]">{step.body}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* ---------- Why the quotes hold up ---------- */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
          className="bg-surface border border-border shadow-e1 p-7 sm:p-9 mt-6"
        >
          <p className="te !text-[9.5px] mb-3">Why the quotes hold up</p>
          <h3 className="thb text-[24px] sm:text-[28px] text-ink mb-4 text-balance">
            The quote a guest gets is the one you set.
          </h3>
          <p className="tb !text-[15px] max-w-[62ch] mb-3">
            Nothing about your rates lives in the browser, so the figure in the
            email is the figure that counts — not something a guest can change
            before they send it. Enquiries hold their dates the moment they
            land, and you accept or decline from the admin panel.
          </p>
          <p className="tb !text-[15px] max-w-[62ch]">
            Your site <strong className="text-ink font-medium">reads</strong> the
            calendars from Airbnb, Booking.com and Vrbo, so dates taken there
            close on your own site.{' '}
            <strong className="text-ink font-medium">
              Sending your direct bookings back out
            </strong>{' '}
            to those platforms is what the Signal plan below adds — that is the
            piece that closes the loop both ways.
          </p>
        </motion.div>

        {/* ---------- The monthly side ---------- */}
        <div className="mt-16">
          <p className="te !text-[9.5px] mb-3">Every month after</p>
          <h3 className="thb text-[24px] sm:text-[30px] text-ink mb-3 text-balance">
            The build is once. Keeping it earning is the monthly.
          </h3>
          <p className="tb !text-[15px] max-w-[62ch] mb-8">
            Every site includes Ember. Move up when you want the calendar
            working both ways, or when you want someone doing the marketing.
          </p>

          <motion.div
            variants={stagger(0.1)}
            initial="hidden"
            whileInView="show"
            viewport={VIEWPORT}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch"
          >
            {carePlans.map((plan) => (
              <motion.div
                key={plan.name}
                variants={fadeUp}
                className={`relative flex flex-col bg-surface border p-7 ${
                  plan.featured
                    ? 'border-amber-brand ring-1 ring-amber-brand shadow-e3'
                    : 'border-border shadow-e1'
                }`}
              >
                {plan.featured && (
                  <span className="absolute -top-3 left-6 text-[9.5px] font-medium uppercase tracking-[0.18em] bg-amber text-white px-2.5 py-1.5">
                    Most take this
                  </span>
                )}

                <h4 className="thb text-[22px] text-ink mb-1">{plan.name}</h4>
                <p className="tbsm !text-[13px] mb-5">{plan.desc}</p>

                <div className="mb-6">
                  <span className="font-serif font-semibold text-[34px] text-ink leading-none num">
                    {money(plan.price)}
                  </span>
                  <span className="tbsm !text-[13px]">/month</span>
                </div>

                {plan.inherits && (
                  <p className="te !text-[9.5px] mb-3 pt-3 border-t border-border-subtle">
                    Everything in {plan.inherits}, plus
                  </p>
                )}

                <ul className="list-none space-y-2.5 flex-1">
                  {plan.feat.map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <Check
                        aria-hidden
                        className="w-3.5 h-3.5 text-amber shrink-0 mt-[3px]"
                        strokeWidth={2.5}
                      />
                      <span className="tb !text-[13px] !leading-[1.5]">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>

          <p className="tbsm !text-[12px] mt-6 max-w-[76ch]">
            Plans cover one property; each additional property is{' '}
            {money(p.extraProperty)} a month. Included hours cover changes to
            what is already there — new pages and new features are quoted
            separately. Cancel any time.
          </p>
        </div>

        {/* ---------- Content add-on ---------- */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
          className="grid grid-cols-1 md:grid-cols-[1.35fr_1fr] gap-8 bg-surface border border-border border-l-[3px] border-l-amber-brand shadow-e1 p-7 sm:p-8 mt-6"
        >
          <div>
            <p className="te !text-[9.5px] mb-3">Add-on · Any tier</p>
            <h3 className="thb text-[22px] sm:text-[25px] text-ink mb-3 text-balance">
              Reels and carousels, from your own photographs
            </h3>
            <p className="tb !text-[15px] mb-3">
              Three reels and two photo carousels a month, made from your
              property and ready to post — more if you run more than one.
            </p>
            <p className="tb !text-[15px]">
              <strong className="text-ink font-medium">
                Send us your listing and we’ll make you two, free.
              </strong>{' '}
              If you like them, we’ll talk about the rest. If you don’t, keep
              them anyway.
            </p>
          </div>
          <div className="flex flex-col">
            <ul className="list-none space-y-2.5 mb-6">
              {[
                'Made from your own photographs, not stock',
                'Sized, captioned and ready to post',
                'Yours to use anywhere, forever',
                'Two free before you decide anything',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <Check
                    aria-hidden
                    className="w-3.5 h-3.5 text-amber shrink-0 mt-[3px]"
                    strokeWidth={2.5}
                  />
                  <span className="tb !text-[13px] !leading-[1.5]">{item}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={() => onSelectPlan('Two free reels')}
              className="btn-outline w-full mt-auto"
            >
              <span>Get two free</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <p className="tbsm !text-[12px] mt-3">Two per property, one per host.</p>
          </div>
        </motion.div>

        {/* ---------- Yours, in every tier ---------- */}
        <div className="border border-border p-7 mt-6">
          <p className="te !text-[9.5px] mb-4">Yours, in every tier</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-2">
            {INCLUDED.map((item) => (
              <div key={item} className="flex items-start gap-2.5">
                <Check
                  aria-hidden
                  className="w-3.5 h-3.5 text-amber shrink-0 mt-[3px]"
                  strokeWidth={2.5}
                />
                <span className="tb !text-[13.5px]">{item}</span>
              </div>
            ))}
          </div>
          <p className="tbsm !text-[12px] mt-5 max-w-[76ch]">
            <strong className="text-ink font-medium">
              You don’t pay until you like it.
            </strong>{' '}
            We build the whole thing, you see it on a live link, and you tell us
            what to change. Nothing is invoiced until you’re happy with what’s
            there — and if you never are, walk away and owe nothing. Revisions
            cover what we agreed on the call; new pages and new features are
            quoted separately.
          </p>
        </div>

        <p className="tbsm !text-[12px] mt-6 max-w-[76ch]">
          The {money(p.ember)} a month covers hosting, SSL, backups and security
          updates, and we keep watch on your domain and certificate so neither
          lapses. Your domain is registered in your own name and billed to you
          by your registrar — a few {currency === 'EUR' ? 'euros' : currency === 'USD' ? 'dollars' : 'pounds'} a
          year, and it stays yours whatever happens to us. Cancel any time; the
          site is yours and we hand it over. Prices exclude VAT where it
          applies.
        </p>
      </div>
    </section>
  );
}
