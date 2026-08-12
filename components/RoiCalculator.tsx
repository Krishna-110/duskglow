'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowUpRight } from 'lucide-react';
import SectionHeading from '@/components/ui/SectionHeading';
import AnimatedNumber from '@/components/ui/AnimatedNumber';
import { fadeUp, stagger, VIEWPORT } from '@/lib/motion';

interface RoiCalculatorProps {
  onOpenBookCall: () => void;
}

type Currency = 'EUR' | 'USD' | 'GBP';

const currencySymbols: Record<Currency, string> = { EUR: '€', USD: '$', GBP: '£' };
const currencyRates: Record<Currency, number> = { EUR: 1, USD: 1.08, GBP: 0.85 };

const MIN = 2000;
const MAX = 30000;

export default function RoiCalculator({ onOpenBookCall }: RoiCalculatorProps) {
  const [revenue, setRevenue] = useState<number>(8500);
  const [currency, setCurrency] = useState<Currency>('EUR');

  const symbol = currencySymbols[currency];
  const rate = currencyRates[currency];

  const currentRevenue = Math.round(revenue * rate);
  const monthlyFee = Math.round(currentRevenue * 0.155);
  const yearlyFee = monthlyFee * 12;
  const hostingCostYearly = Math.round(180 * rate);
  const yearlySavings = Math.max(0, yearlyFee - hostingCostYearly);

  const fillPct = ((revenue - MIN) / (MAX - MIN)) * 100;

  return (
    <section id="roi" className="relative py-24 sm:py-32 bg-canvas wash">
      <div className="max-w-[960px] mx-auto px-6 sm:px-8">
        <SectionHeading
          eyebrow="Interactive"
          title="What are you"
          accent="paying Airbnb?"
          inline
          body="Slide your average monthly booking revenue to see exactly how much leaves with the platform — and what stays when guests book you directly."
          className="mb-14 max-w-[46rem]"
        />

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
          className="relative bg-surface border border-border shadow-e3 p-7 sm:p-10"
        >
          {/* Amber hairline along the top edge */}
          <span
            aria-hidden
            className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-brand to-transparent"
          />

          {/* Input row */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 mb-8">
            <div>
              <span className="label !mb-3">Monthly booking revenue</span>
              <div className="seg" role="group" aria-label="Currency">
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
                        layoutId="roi-currency-pill"
                        transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                        className="absolute inset-0 bg-amber"
                      />
                    )}
                    {/* `relative` keeps the label painted above the pill */}
                    <span className="relative">
                      {curr} {currencySymbols[curr]}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="sm:text-right">
              <span className="label !mb-1.5">Your revenue</span>
              <AnimatedNumber
                value={currentRevenue}
                prefix={symbol}
                className="font-serif font-semibold t-stat text-amber num leading-none block"
              />
            </div>
          </div>

          {/* Slider */}
          <div className="mb-9">
            <input
              type="range"
              min={MIN}
              max={MAX}
              step={500}
              value={revenue}
              onChange={(e) => setRevenue(Number(e.target.value))}
              className="roi-slider"
              style={{ ['--fill' as string]: `${fillPct}%` }}
              aria-label="Average monthly booking revenue"
              aria-valuetext={`${symbol}${currentRevenue.toLocaleString()} per month`}
            />
            <div className="flex justify-between text-[10.5px] tracking-[0.08em] uppercase text-ink-dim mt-3.5 num">
              <span>
                {symbol}
                {Math.round(MIN * rate).toLocaleString()}
              </span>
              <span>
                {symbol}
                {Math.round(15000 * rate).toLocaleString()}
              </span>
              <span>
                {symbol}
                {Math.round(MAX * rate).toLocaleString()}
              </span>
            </div>
          </div>

          {/* Results */}
          <motion.dl
            variants={stagger(0.07)}
            initial="hidden"
            whileInView="show"
            viewport={VIEWPORT}
            className="grid grid-cols-1 sm:grid-cols-3 border-t border-border divide-y sm:divide-y-0 sm:divide-x divide-border-subtle"
          >
            <Stat
              label="Airbnb 15.5% fee"
              sub="per month"
              value={monthlyFee}
              symbol={symbol}
              tone="ink"
            />
            <Stat
              label="Yearly loss"
              sub="commission only"
              value={yearlyFee}
              symbol={symbol}
              tone="loss"
            />
            <Stat
              label="Saved with Duskglow"
              sub="per year, net of hosting"
              value={yearlySavings}
              symbol={symbol}
              tone="amber"
              icon
            />
          </motion.dl>

          {/* Footnote + CTA */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 mt-8 pt-7 border-t border-border-subtle">
            <p className="text-[11.5px] leading-relaxed text-ink-dim max-w-[46ch]">
              After {symbol}
              {hostingCostYearly}/yr hosting ({symbol}
              {Math.round(15 * rate)}/mo). Excludes tax treatment and any existing
              Airbnb-related costs.
            </p>
            <button onClick={onOpenBookCall} className="btn-prim shrink-0">
              <span>Reclaim This Revenue</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Stat({
  label,
  sub,
  value,
  symbol,
  tone,
  icon = false,
}: {
  label: string;
  sub: string;
  value: number;
  symbol: string;
  tone: 'ink' | 'loss' | 'amber';
  icon?: boolean;
}) {
  const toneClass =
    tone === 'amber' ? 'text-amber' : tone === 'loss' ? 'text-[#b3392c] dark:text-[#e8836f]' : 'text-ink';

  return (
    <motion.div variants={fadeUp} className="py-6 sm:px-6 sm:first:pl-0 sm:last:pr-0">
      <dt className="flex items-center gap-1.5 mb-2.5">
        {icon && <Sparkles className="w-3 h-3 text-amber-brand shrink-0" />}
        <span className="te !tracking-[0.14em]">{label}</span>
      </dt>
      <dd>
        <AnimatedNumber
          value={value}
          prefix={symbol}
          className={`font-serif font-semibold t-stat num leading-none block ${toneClass}`}
        />
        <span className="tbsm !text-[11.5px] block mt-2">{sub}</span>
      </dd>
    </motion.div>
  );
}
