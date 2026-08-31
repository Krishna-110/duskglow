'use client';

import { Fragment, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  Check,
  X,
  ArrowRight,
  ChevronDown,
  PhoneCall,
  Eye,
  PenLine,
  Sparkles,
  Play,
  ShieldCheck,
  Flame,
  Zap,
  RadioTower,
} from 'lucide-react';
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

/**
 * What the cards actually show. The full ledger lives in the comparison
 * table below them — three parallel 45-row lists made the section four
 * screens tall and nobody read past the first one.
 */
const HIGHLIGHTS: Record<TierKey, { inherits: string | null; items: string[] }> = {
  solo: {
    inherits: null,
    items: [
      'Five web pages, forty photographs',
      'An availability calendar guests can pick from',
      'Seasonal rates, minimum stays, fees and tourist tax',
      'Automatic quotes, priced and emailed to you both',
      'Every enquiry and booking in one place',
      'Revisions until you’re happy',
    ],
  },
  pro: {
    inherits: 'Solo',
    items: [
      'Thirteen web pages, a hundred and forty photographs',
      'Google indexing and Search Console',
      'Email capture, so the guest list is yours',
      'Retargeting pixel',
      'Change your own rates, seasons and extras',
    ],
  },
  premium: {
    inherits: 'Pro',
    items: [
      'Unlimited pages, three hundred photographs',
      'A layout drawn for your property, not a template',
      'Blog, three languages, prices in your guest’s currency',
      'Change the whole site yourself, any time',
      'Card payments by Stripe, and more than one property',
    ],
  },
};

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
    k: '01',
    Icon: PhoneCall,
    title: 'The call',
    body: 'Your property, your rates, your seasons. Half an hour, no pitch.',
  },
  {
    k: '02',
    Icon: Eye,
    title: 'The preview',
    body: 'A live link to your finished site. Nothing invoiced, nothing owed.',
  },
  {
    k: '03',
    Icon: PenLine,
    title: 'Your changes',
    body: 'We work through your notes. Photographs, wording, whatever isn’t you yet.',
  },
  {
    k: '04',
    Icon: Sparkles,
    title: 'Live, and paid',
    body: 'Only once you’re happy. On your own domain, taking enquiries, calendar already reading your platforms.',
  },
];

/**
 * Portrait crops, so they sit in the 4:5 frames without the subject being
 * cut off. Distinct from the tier banners on purpose — reusing those put
 * the same three photographs on screen twice, a few hundred pixels apart.
 * Front card is a villa at twilight, which is the whole brand.
 */
const CONTENT_SAMPLES = [
  'https://images.pexels.com/photos/29693417/pexels-photo-29693417.jpeg?auto=compress&cs=tinysrgb&w=500&dpr=2',
  'https://images.pexels.com/photos/28793754/pexels-photo-28793754.jpeg?auto=compress&cs=tinysrgb&w=500&dpr=2',
  'https://images.pexels.com/photos/38299644/pexels-photo-38299644.jpeg?auto=compress&cs=tinysrgb&w=500&dpr=2',
];

const INCLUDED = [
  'No payment until you’re happy',
  'No commission, ever',
  'No per-booking fee',
  'No contract or lock-in',
  'Your guest list stays yours',
  'You own the site and the domain',
];

function renderCell(cell: Cell) {
  if (cell === true)
    return (
      <Check
        aria-label="Included"
        className="w-4 h-4 text-amber mx-auto"
        strokeWidth={2.5}
      />
    );
  if (cell === false)
    return (
      <X
        aria-label="Not included"
        className="w-4 h-4 text-ink-dim opacity-50 mx-auto"
        strokeWidth={2.5}
      />
    );
  return <span className="tb !text-[13px] text-ink font-medium">{cell}</span>;
}

export default function PricingSection({ onSelectPlan }: PricingSectionProps) {
  const [currency, setCurrency] = useState<Currency>('EUR');
  const [showCompare, setShowCompare] = useState(false);
  const p = prices[currency];
  const money = (n: number) => `${p.symbol}${n.toLocaleString()}`;

  /** Care plans read from `p` so they follow the currency switch too. */
  const carePlans = [
    {
      name: 'Ember',
      // It burns, it pulses, it broadcasts — the icons carry the same
      // ascending-reach idea the names do.
      Icon: Flame,
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
      Icon: Zap,
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
      Icon: RadioTower,
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
                    one-time · then {money(p.ember)}/mo — Ember (hosting &amp; care)
                  </span>
                </div>

                <div className="flex-1 mb-9">
                  {HIGHLIGHTS[tier.key].inherits && (
                    <p className="te !text-[9.5px] mb-3">
                      Everything in {HIGHLIGHTS[tier.key].inherits}, plus
                    </p>
                  )}
                  <ul className="list-none space-y-3">
                    {HIGHLIGHTS[tier.key].items.map((item) => (
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

        {/* ---------- Everything, side by side ---------- */}
        <div className="mt-10">
          {/* Flanked like a section eyebrow so the toggle reads as a divider
              between the cards and the detail, not an orphaned button. */}
          <div className="flex items-center gap-5 sm:gap-7">
            <span aria-hidden className="h-px flex-1 bg-gradient-to-r from-transparent to-amber-line" />
            <button
              onClick={() => setShowCompare((v) => !v)}
              aria-expanded={showCompare}
              aria-controls="pricing-compare"
              className="group inline-flex items-center gap-2.5 shrink-0 te !text-[10px] text-ink hover:text-amber transition-colors duration-300"
            >
              <span>
                {showCompare ? 'Hide the full comparison' : 'Compare every feature'}
              </span>
              <span className="grid place-items-center w-6 h-6 rounded-full border border-border-strong group-hover:border-amber-brand transition-colors duration-300">
                <ChevronDown
                  aria-hidden
                  className={`w-3 h-3 transition-transform duration-500 ease-out ${
                    showCompare ? 'rotate-180' : ''
                  }`}
                />
              </span>
            </button>
            <span aria-hidden className="h-px flex-1 bg-gradient-to-l from-transparent to-amber-line" />
          </div>

          {showCompare && (
            <div
              id="pricing-compare"
              className="mt-6 overflow-x-auto border border-border bg-surface"
            >
              <table className="w-full min-w-[680px] border-collapse text-left">
                <caption className="sr-only">
                  Every feature compared across Solo, Pro and Premium
                </caption>
                <thead>
                  <tr className="border-b border-border">
                    <th scope="col" className="te !text-[9.5px] px-5 py-4">
                      Feature
                    </th>
                    {TIERS.map((tier) => (
                      <th
                        key={tier.key}
                        scope="col"
                        className="te !text-[9.5px] px-5 py-4 w-[14%] text-center"
                      >
                        {tier.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {LEDGER.map((section) => (
                    <Fragment key={section.group}>
                      <tr className="bg-canvas-alt">
                        <th
                          scope="colgroup"
                          colSpan={4}
                          className="te !text-[9.5px] px-5 py-2.5"
                        >
                          {section.group}
                        </th>
                      </tr>
                      {section.rows.map((row) => (
                        <tr key={row.label} className="border-t border-border-subtle">
                          <th
                            scope="row"
                            className="tb !text-[13px] !font-normal px-5 py-3.5"
                          >
                            {row.label}
                          </th>
                          {TIERS.map((tier) => (
                            <td key={tier.key} className="px-5 py-3.5 text-center">
                              {renderCell(row[tier.key])}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* ---------- How it goes ---------- */}
        <motion.div
          variants={stagger(0.08)}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-border border border-border mt-6"
        >
          {STEPS.map((step, i) => {
            const last = i === STEPS.length - 1;
            return (
              <motion.div
                key={step.k}
                variants={fadeUp}
                className="relative bg-surface p-7 group"
              >
                <div className="flex items-center justify-between mb-5">
                  {/* The payoff step fills; the first three stay outlined, so
                      the eye lands on "Live, and paid" without reading. */}
                  <span
                    aria-hidden
                    className={`grid place-items-center w-11 h-11 rounded-full transition-colors duration-500 ${
                      last
                        ? 'bg-amber text-white'
                        : 'bg-amber-line text-amber border border-amber-line'
                    }`}
                  >
                    <step.Icon className="w-[18px] h-[18px]" strokeWidth={1.75} />
                  </span>
                  <span
                    aria-hidden
                    className="te !text-[10px] !tracking-[0.24em] text-ink-dim num"
                  >
                    {step.k}
                  </span>
                </div>
                <h4 className="thb text-[19px] text-ink mb-2">{step.title}</h4>
                <p className="tbsm !text-[13px] !leading-[1.6] max-w-[30ch]">
                  {step.body}
                </p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* ---------- Why the quotes hold up ---------- */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
          className="bg-surface border border-border shadow-e1 p-7 sm:p-10 mt-6"
        >
          {/* Heading left, argument right — the single column left half the
              card empty at desktop widths. */}
          <div className="grid grid-cols-1 md:grid-cols-[0.8fr_1.2fr] gap-7 md:gap-12 lg:gap-16">
            <div className="md:border-r md:border-border-subtle md:pr-8 lg:pr-12">
              <p className="te !text-[9.5px] mb-4">Why the quotes hold up</p>
              <h3 className="thb text-[25px] sm:text-[30px] text-ink text-balance">
                The quote a guest gets is the one you set.
              </h3>
            </div>
            <div>
              <p className="tb !text-[15px] mb-4">
                Nothing about your rates lives in the browser, so the figure in
                the email is the figure that counts — not something a guest can
                change before they send it. Enquiries hold their dates the
                moment they land, and you accept or decline from the admin
                panel.
              </p>
              <p className="tb !text-[15px]">
                Your site <strong className="text-ink font-medium">reads</strong>{' '}
                the calendars from Airbnb, Booking.com and Vrbo, so dates taken
                there close on your own site.{' '}
                <strong className="text-ink font-medium">
                  Sending your direct bookings back out
                </strong>{' '}
                to those platforms is what the Signal plan below adds — that is
                the piece that closes the loop both ways.
              </p>
            </div>
          </div>
        </motion.div>

        {/* ---------- The monthly side ---------- */}
        <div className="mt-20">
          <div className="flex items-center gap-3 mb-5">
            <span aria-hidden className="h-px w-8 bg-gradient-to-r from-transparent to-amber-line" />
            <span className="te !text-[9.5px]">Every month after</span>
            <span aria-hidden className="h-px flex-1 bg-gradient-to-l from-transparent to-amber-line" />
          </div>
          <h3 className="thb text-[26px] sm:text-[32px] text-ink mb-3 text-balance max-w-[24ch]">
            The build is once. Keeping it earning is the monthly.
          </h3>
          <p className="tb !text-[15px] max-w-[62ch] mb-9">
            Every site includes <strong className="text-ink font-medium">Ember</strong>,
            our hosting and care plan. Move up when you want the calendar
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
                className={`relative flex flex-col bg-surface border p-7 transition-[box-shadow,transform] duration-700 ease-out hover:-translate-y-1 ${
                  plan.featured
                    ? 'border-amber-brand ring-1 ring-amber-brand shadow-e3'
                    : 'border-border shadow-e1 hover:shadow-e3'
                }`}
              >
                {plan.featured && (
                  <span className="absolute -top-3 left-6 text-[9.5px] font-medium uppercase tracking-[0.18em] bg-amber text-white px-2.5 py-1.5">
                    Most take this
                  </span>
                )}

                {/* Featured fills, the others outline — same rule as the
                    process strip, so the page has one way of saying "this
                    one". */}
                <span
                  aria-hidden
                  className={`grid place-items-center w-12 h-12 rounded-full mb-5 ${
                    plan.featured
                      ? 'bg-amber text-white'
                      : 'bg-amber-line border border-amber-line text-amber'
                  }`}
                >
                  <plan.Icon className="w-[19px] h-[19px]" strokeWidth={1.75} />
                </span>

                <h4 className="thb text-[22px] text-ink mb-1">{plan.name}</h4>
                <p className="tbsm !text-[13px] mb-6 min-h-[2.6em]">{plan.desc}</p>

                <div className="pb-6 mb-6 border-b border-border-subtle">
                  <span className="font-serif font-semibold text-[38px] text-ink leading-none num">
                    {money(plan.price)}
                  </span>
                  <span className="tbsm !text-[13px] ml-1">/month</span>
                </div>

                {plan.inherits && (
                  <p className="te !text-[9.5px] mb-4">
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
            separately. Cancel any time. You can host the site elsewhere if you
            prefer — it is yours — but hosting and care are one thing, so the
            backups, monitoring and updates go with it.
          </p>
        </div>

        {/* ---------- Content add-on ---------- */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
          className="grid grid-cols-1 md:grid-cols-[1.15fr_0.85fr] gap-8 lg:gap-12 bg-surface border border-border border-l-[3px] border-l-amber-brand shadow-e1 p-7 sm:p-9 mt-6 items-center"
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
            <ul className="list-none space-y-2.5 mt-7">
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
          </div>

          <div className="flex flex-col">
            {/* Three villa frames fanned out, the front one wearing a play
                button — the offer is reels and carousels, so show a reel and
                a carousel rather than describe them again. */}
            <div
              aria-hidden
              className="relative w-full max-w-[230px] aspect-[4/5] mx-auto mb-7"
            >
              {CONTENT_SAMPLES.slice(1)
                .reverse()
                .map((src, i) => (
                  <div
                    key={src}
                    className={`absolute inset-0 overflow-hidden border border-border shadow-e1 ${
                      i === 0
                        ? 'rotate-[7deg] translate-x-5 translate-y-1 opacity-45'
                        : 'rotate-[3.5deg] translate-x-2.5 opacity-70'
                    }`}
                  >
                    <Image
                      src={src}
                      alt=""
                      fill
                      sizes="230px"
                      quality={70}
                      className="object-cover"
                    />
                  </div>
                ))}
              <div className="absolute inset-0 overflow-hidden border border-border shadow-e3">
                <Image
                  src={CONTENT_SAMPLES[0]}
                  alt=""
                  fill
                  sizes="230px"
                  quality={85}
                  className="object-cover"
                />
                <span className="absolute inset-0 bg-gradient-to-t from-[rgba(14,10,7,0.5)] via-transparent to-transparent" />
                <span className="absolute inset-0 grid place-items-center">
                  <span className="grid place-items-center w-[52px] h-[52px] rounded-full bg-amber text-white shadow-e2">
                    <Play className="w-[18px] h-[18px] ml-[3px]" fill="currentColor" strokeWidth={0} />
                  </span>
                </span>
              </div>
            </div>

            <button
              onClick={() => onSelectPlan('Two free reels')}
              className="btn-prim w-full"
            >
              <span>Get two free</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <p className="tbsm !text-[12px] mt-3 text-center">
              Two per property, one per host.
            </p>
          </div>
        </motion.div>

        {/* ---------- The guarantee ---------- */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
          className="relative bg-surface border border-border shadow-e1 p-7 sm:p-10 mt-6 overflow-hidden"
        >
          {/* Same amber hairline the ROI calculator wears — this is the other
              claim on the page worth stopping for. */}
          <span
            aria-hidden
            className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-brand to-transparent"
          />

          <div className="grid grid-cols-1 md:grid-cols-[1fr_0.85fr] gap-8 lg:gap-14">
            <div>
              <span
                aria-hidden
                className="grid place-items-center w-14 h-14 rounded-full bg-amber-line border border-amber-line text-amber mb-6"
              >
                <ShieldCheck className="w-6 h-6" strokeWidth={1.5} />
              </span>
              <h3 className="thb text-[26px] sm:text-[32px] text-ink mb-4 text-balance">
                You don’t pay until you like it.
              </h3>
              <p className="tb !text-[15px] mb-3">
                We build the whole thing, you see it on a live link, and you
                tell us what to change. Nothing is invoiced until you’re happy
                with what’s there — and if you never are, walk away and owe
                nothing.
              </p>
              <p className="tbsm !text-[12px]">
                Revisions cover what we agreed on the call; new pages and new
                features are quoted separately.
              </p>
            </div>

            <div className="md:border-l md:border-border-subtle md:pl-8 lg:pl-12">
              <p className="te !text-[9.5px] mb-5">Yours, in every tier</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-x-8 gap-y-3">
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
            </div>
          </div>
        </motion.div>

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
