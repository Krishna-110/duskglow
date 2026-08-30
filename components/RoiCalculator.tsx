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

const COMMISSION = 0.155;
/** Ember, the care plan every build includes. Keep in step with PricingSection. */
const HOSTING_MONTHLY_EUR = 29;
const MAX_VAT = 27;

export default function RoiCalculator({ onOpenBookCall }: RoiCalculatorProps) {
  const [revenue, setRevenue] = useState<number>(8500);
  const [currency, setCurrency] = useState<Currency>('EUR');
  /**
   * VAT the platform adds to its own service fee. Defaults to zero because
   * whether it applies at all depends on the host's country and whether they
   * are VAT-registered — this has to be the host's number, not our guess.
   */
  const [vat, setVat] = useState<number>(0);

  const symbol = currencySymbols[currency];
  const rate = currencyRates[currency];

  const currentRevenue = Math.round(revenue * rate);
  const effectiveRate = COMMISSION * (1 + vat / 100);
  // Multiply first, round once. Rounding the month and then multiplying by
  // twelve pushed the yearly figure out by six euros at the default revenue.
  const monthlyFee = Math.round(currentRevenue * effectiveRate);
  const yearlyFee = Math.round(currentRevenue * effectiveRate * 12);
  const hostingCostMonthly = Math.round(HOSTING_MONTHLY_EUR * rate);
  const hostingCostYearly = hostingCostMonthly * 12;
  const yearlySavings = Math.max(0, yearlyFee - hostingCostYearly);

  const fillPct = ((revenue - MIN) / (MAX - MIN)) * 100;
  const vatFillPct = (vat / MAX_VAT) * 100;

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

          {/* VAT the platform adds on top of its own fee. Zero by default —
              it applies in some countries and not others, and only to hosts
              who aren't VAT-registered. */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 mb-9 pb-9 border-b border-border-subtle">
            <label htmlFor="roi-vat" className="label !mb-0 shrink-0">
              VAT on the platform fee
            </label>
            <div className="flex items-center gap-4 flex-1 sm:max-w-[340px]">
              <input
                id="roi-vat"
                type="range"
                min={0}
                max={MAX_VAT}
                step={1}
                value={vat}
                onChange={(e) => setVat(Number(e.target.value))}
                className="roi-slider"
                style={{ ['--fill' as string]: `${vatFillPct}%` }}
                aria-valuetext={`${vat} percent VAT on the platform fee`}
              />
              <span className="num text-[13px] font-medium text-ink w-11 text-right shrink-0">
                {vat}%
              </span>
            </div>
            <span className="tbsm !text-[11.5px] sm:ml-auto">
              {vat > 0
                ? `Effective ${(effectiveRate * 100).toFixed(1)}% of revenue`
                : 'Leave at zero if it does not apply to you'}
            </span>
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
              label={vat > 0 ? 'Airbnb fee + VAT' : 'Airbnb 15.5% fee'}
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
            <p className="text-[11.5px] leading-relaxed text-ink-dim max-w-[52ch]">
              After {symbol}
              {hostingCostYearly.toLocaleString()}/yr for Ember ({symbol}
              {hostingCostMonthly}/mo), the care plan every build includes.
              {vat > 0
                ? ` VAT is applied to the platform's service fee only, not to your booking revenue.`
                : ' Set a VAT rate above if your platform charges it on its service fee.'}{' '}
              Excludes your own income tax and any existing Airbnb-related costs.
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
