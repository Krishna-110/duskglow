'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Calendar,
  Check,
  ArrowRight,
  ArrowLeft,
  PhoneCall,
  Mail,
  User,
  MapPin,
  Link2,
} from 'lucide-react';
import ModalShell from '@/components/ui/ModalShell';
import { EASE_OUT } from '@/lib/motion';
import booked from '@/public/booked.json';

/**
 * Availability is a fixed 14:00–02:00 window in UTC+5:30, stored here and in
 * booked.json as the canonical slot key. It is never shown to the visitor:
 * every slot is rendered in whichever timezone they select, so the window
 * reads as ordinary local hours rather than someone else's night shift.
 */
const HOST_OFFSET_MIN = 330;
const ALL_SLOTS = [
  '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00',
  '21:00', '22:00', '23:00', '00:00', '01:00', '02:00',
];
const takenOn = (date: string) => booked.find((b) => b.date === date)?.slots ?? [];

/** Canonical slot -> the UTC instant it actually falls on. */
const slotInstant = (date: string, hhmm: string) => {
  const [y, mo, d] = date.split('-').map(Number);
  const [h, mi] = hhmm.split(':').map(Number);
  return Date.UTC(y, mo - 1, d, h, mi) - HOST_OFFSET_MIN * 60_000;
};

/**
 * Renders a slot in the visitor's timezone. `dayShift` is non-zero when the
 * slot lands on a different calendar day for them than the one they picked —
 * a late slot here is the previous evening in the Americas, and without the
 * marker they would book the wrong day.
 */
const localSlot = (date: string, hhmm: string, tz: string) => {
  const inst = new Date(slotInstant(date, hhmm));
  // Guard: Intl throws RangeError on an invalid Date, and callers may render
  // before a date is chosen.
  if (Number.isNaN(inst.getTime())) return { time: hhmm, dayShift: 0 };
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: tz, hour: '2-digit', minute: '2-digit', hour12: false,
    year: 'numeric', month: '2-digit', day: '2-digit',
  }).formatToParts(inst);
  const get = (t: string) => parts.find((x) => x.type === t)?.value ?? '';
  const localDate = `${get('year')}-${get('month')}-${get('day')}`;
  const dayShift = localDate < date ? -1 : localDate > date ? 1 : 0;
  return { time: `${get('hour')}:${get('minute')}`, dayShift };
};

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
/** Formatted off the ISO string, never `new Date()`, so SSR and client agree. */
const prettyDate = (iso: string) => {
  const [, m, d] = iso.split('-');
  return `${MONTHS[Number(m) - 1]} ${Number(d)}`;
};

interface BookCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlan?: string;
}

const STEPS = ['Package', 'Schedule', 'Contact'] as const;

export default function BookCallModal({
  isOpen,
  onClose,
  selectedPlan = 'Pro',
}: BookCallModalProps) {
  const [step, setStep] = useState<number>(1);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [plan, setPlan] = useState<string>(selectedPlan);
  const [villaLocation, setVillaLocation] = useState('');
  const [siteUrl, setSiteUrl] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [timezone, setTimezone] = useState('UTC');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);

  /* `new Date()` during render would disagree between server and client and
     trip hydration, so today is filled in after mount. */
  const [today, setToday] = useState('');
  useEffect(() => {
    const n = new Date();
    setToday(`${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, '0')}-${String(n.getDate()).padStart(2, '0')}`);
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (tz) setTimezone(tz);
  }, []);

  const freeSlots = ALL_SLOTS.filter((sl) => !takenOn(date).includes(sl));

  // `useState(selectedPlan)` only seeds the first render, so a later
  // "Choose Premium" click would still open on the previous plan.
  useEffect(() => {
    if (isOpen) setPlan(selectedPlan);
  }, [isOpen, selectedPlan]);

  const go = (next: number) => {
    setDirection(next > step ? 1 : -1);
    setStep(next);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const finish = () => {
    onClose();
    // Reset after the exit animation so the panel doesn't flicker mid-close.
    window.setTimeout(() => {
      setStep(1);
      setDirection(1);
      setSubmitted(false);
      setDate('');
      setTime('');
      setSiteUrl('');
    }, 260);
  };

  const slide = {
    hidden: (d: 1 | -1) => ({ opacity: 0, x: d * 24 }),
    show: { opacity: 1, x: 0, transition: { duration: 0.4, ease: EASE_OUT } },
    exit: (d: 1 | -1) => ({
      opacity: 0,
      x: d * -24,
      transition: { duration: 0.22, ease: EASE_OUT },
    }),
  };

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={onClose}
      labelledBy="book-call-title"
      panelClassName="w-full max-w-xl bg-surface border border-border shadow-e4 max-h-[90vh] overflow-y-auto"
    >
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-brand to-transparent"
      />

      <div className="p-7 sm:p-10">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-6 border-b border-border-subtle mb-8">
          <div className="flex items-center gap-3.5">
            <span className="w-10 h-10 bg-amber-soft border border-amber-line text-amber flex items-center justify-center shrink-0">
              <Calendar className="w-4 h-4" />
            </span>
            <div>
              <h2 id="book-call-title" className="thb text-[21px] text-ink">
                Book Discovery Call
              </h2>
              <span className="tbsm !text-[12px] block mt-0.5">
                20-minute strategy session for villa &amp; rental hosts
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="text-ink-dim hover:text-ink p-1.5 -m-1.5 transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!submitted ? (
          <div>
            {/* Step rail */}
            <ol className="flex items-center gap-2 mb-9 list-none">
              {STEPS.map((label, i) => {
                const n = i + 1;
                const done = n < step;
                const active = n === step;
                return (
                  <li key={label} className="flex-1">
                    <div className="flex items-center gap-2 mb-2.5">
                      <span
                        className={`w-5 h-5 shrink-0 flex items-center justify-center text-[9.5px] font-semibold num transition-colors duration-300 ${
                          done
                            ? 'bg-amber text-white'
                            : active
                              ? 'border border-amber-brand text-amber'
                              : 'border border-border text-ink-dim'
                        }`}
                      >
                        {done ? <Check className="w-3 h-3" strokeWidth={3} /> : n}
                      </span>
                      <span
                        className={`te !text-[9.5px] truncate ${active ? '!text-ink' : ''}`}
                      >
                        {label}
                      </span>
                    </div>
                    <div className="h-[2px] bg-border-subtle overflow-hidden">
                      <motion.div
                        initial={false}
                        animate={{ scaleX: n <= step ? 1 : 0 }}
                        transition={{ duration: 0.5, ease: EASE_OUT }}
                        className="h-full bg-amber-brand origin-left"
                      />
                    </div>
                  </li>
                );
              })}
            </ol>

            <AnimatePresence mode="wait" custom={direction} initial={false}>
              {/* Step 1 */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  custom={direction}
                  variants={slide}
                  initial="hidden"
                  animate="show"
                  exit="exit"
                  className="space-y-7"
                >
                  <fieldset>
                    <legend className="label">Select interested package</legend>
                    <div className="grid grid-cols-3 gap-2.5">
                      {['Solo', 'Pro', 'Premium'].map((p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setPlan(p)}
                          aria-pressed={plan === p}
                          className={`py-3.5 text-[11px] font-medium uppercase tracking-[0.13em] border transition-all duration-300 ${
                            plan === p
                              ? 'border-amber-brand bg-amber-soft text-amber'
                              : 'border-border text-ink-soft hover:border-amber-line hover:text-ink'
                          }`}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </fieldset>

                  <div>
                    <label className="label" htmlFor="bc-location">
                      Villa / property location{' '}
                      <span className="normal-case tracking-normal">(optional)</span>
                    </label>
                    <div className="relative">
                      <MapPin
                        aria-hidden
                        className="w-4 h-4 text-ink-dim absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                      />
                      <input
                        id="bc-location"
                        type="text"
                        placeholder="Mykonos, Lisbon, Amalfi Coast, Bali…"
                        value={villaLocation}
                        onChange={(e) => setVillaLocation(e.target.value)}
                        className="field field-icon"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="label" htmlFor="bc-url">
                      Listing or website URL{' '}
                      <span className="normal-case tracking-normal">(optional)</span>
                    </label>
                    <div className="relative">
                      <Link2
                        aria-hidden
                        className="w-4 h-4 text-ink-dim absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                      />
                      <input
                        id="bc-url"
                        type="url"
                        inputMode="url"
                        autoComplete="url"
                        placeholder="airbnb.com/rooms/… or your own site"
                        value={siteUrl}
                        onChange={(e) => setSiteUrl(e.target.value)}
                        /* type="url" rejects a bare domain, and nobody types the
                           scheme. Add it on blur so the field validates instead
                           of scolding them for pasting exactly what they copied. */
                        onBlur={() => {
                          const v = siteUrl.trim();
                          if (v && !/^https?:\/\//i.test(v)) setSiteUrl(`https://${v}`);
                        }}
                        className="field field-icon"
                      />
                    </div>
                    <p className="tbsm !text-[12px] mt-2.5">
                      We audit it before the call and bring you the findings — what your
                      listing is losing to the platform, and what a direct site would change.
                    </p>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button onClick={() => go(2)} className="btn-prim">
                      <span>Next Step</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 2 */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  custom={direction}
                  variants={slide}
                  initial="hidden"
                  animate="show"
                  exit="exit"
                  className="space-y-7"
                >
                  <div>
                    <label className="label" htmlFor="bc-date">
                      Pick a date
                    </label>
                    <input
                      id="bc-date"
                      type="date"
                      value={date}
                      min={today || undefined}
                      /* Changing the date can invalidate the chosen slot, so
                         clear it rather than carry a time that is now taken. */
                      onChange={(e) => {
                        const d = e.target.value;
                        setDate(d);
                        if (takenOn(d).includes(time)) setTime('');
                      }}
                      className="field"
                    />
                  </div>

                  <fieldset disabled={!date} className="disabled:opacity-45 transition-opacity">
                    <legend className="label">
                      {date ? `Available times · ${prettyDate(date)}` : 'Available times'}
                    </legend>
                    {!date ? (
                      <p className="tbsm !text-[12.5px]">
                        Choose a date above to see the times available that day.
                      </p>
                    ) : freeSlots.length === 0 ? (
                      <p className="tbsm !text-[12.5px]">
                        Fully booked on {prettyDate(date)} — please choose another day.
                      </p>
                    ) : (
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
                        {ALL_SLOTS.map((sl) => {
                          const taken = takenOn(date).includes(sl);
                          const { time: shown, dayShift } = localSlot(date, sl, timezone);
                          return (
                            <button
                              key={sl}
                              type="button"
                              disabled={taken}
                              onClick={() => setTime(sl)}
                              aria-pressed={time === sl}
                              aria-label={`${shown}${dayShift ? `, ${dayShift > 0 ? 'next day' : 'previous day'}` : ''}${taken ? ', unavailable' : ''}`}
                              className={`relative py-3 text-[12px] font-medium num tracking-wide border transition-all duration-300 ${
                                taken
                                  ? 'border-border-subtle text-ink-dim line-through cursor-not-allowed'
                                  : time === sl
                                  ? 'border-amber-brand bg-amber-soft text-amber'
                                  : 'border-border text-ink-soft hover:border-amber-line hover:text-ink'
                              }`}
                            >
                              {shown}
                              {dayShift !== 0 && (
                                <span aria-hidden className="absolute top-1 right-1.5 text-[8.5px] leading-none opacity-70">
                                  {dayShift > 0 ? '+1' : '−1'}
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    )}
                    {date && freeSlots.length > 0 && (
                      <p className="tbsm !text-[12px] mt-3">
                        Times are shown in your timezone. A marked slot falls on the
                        neighbouring day for you.
                      </p>
                    )}
                  </fieldset>

                  <div>
                    <label className="label" htmlFor="bc-tz">
                      Your timezone
                    </label>
                    <select
                      id="bc-tz"
                      value={timezone}
                      onChange={(e) => setTimezone(e.target.value)}
                      className="field"
                    >
                      {Array.from(
                        new Set([
                          timezone, 'UTC', 'Europe/London', 'Europe/Athens',
                          'America/New_York', 'America/Los_Angeles', 'Asia/Dubai',
                          'Asia/Singapore', 'Australia/Sydney',
                        ]),
                      ).map((z) => (
                        <option key={z} value={z}>{z.replace(/_/g, ' ')}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex justify-between pt-2">
                    <button onClick={() => go(1)} className="btn-outline">
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Back</span>
                    </button>
                    <button
                      onClick={() => go(3)}
                      disabled={!date || !time}
                      className="btn-prim disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <span>Contact Info</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 3 */}
              {step === 3 && (
                <motion.form
                  key="step3"
                  custom={direction}
                  variants={slide}
                  initial="hidden"
                  animate="show"
                  exit="exit"
                  onSubmit={handleSubmit}
                  className="space-y-5"
                >
                  <div>
                    <label className="label" htmlFor="bc-name">
                      Your name
                    </label>
                    <div className="relative">
                      <User
                        aria-hidden
                        className="w-4 h-4 text-ink-dim absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                      />
                      <input
                        id="bc-name"
                        type="text"
                        required
                        autoComplete="name"
                        placeholder="Andreas Skiadopoulos"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="field field-icon"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="label" htmlFor="bc-email">
                      Email address
                    </label>
                    <div className="relative">
                      <Mail
                        aria-hidden
                        className="w-4 h-4 text-ink-dim absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                      />
                      <input
                        id="bc-email"
                        type="email"
                        required
                        autoComplete="email"
                        placeholder="you@yourproperty.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="field field-icon"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="label" htmlFor="bc-phone">
                      Phone / WhatsApp <span className="normal-case tracking-normal">(optional)</span>
                    </label>
                    <div className="relative">
                      <PhoneCall
                        aria-hidden
                        className="w-4 h-4 text-ink-dim absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                      />
                      <input
                        id="bc-phone"
                        type="tel"
                        autoComplete="tel"
                        placeholder="+30 691 234 5678"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="field field-icon"
                      />
                    </div>
                  </div>

                  <div className="flex justify-between pt-3">
                    <button type="button" onClick={() => go(2)} className="btn-outline">
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Back</span>
                    </button>
                    <button type="submit" className="btn-prim">
                      <span>Confirm Booking</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        ) : (
          /* Success */
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE_OUT }}
            className="text-center py-6"
          >
            <motion.span
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.55, ease: EASE_OUT, delay: 0.08 }}
              className="w-16 h-16 mx-auto mb-7 border border-amber-brand bg-amber-soft text-amber flex items-center justify-center"
            >
              <Check className="w-7 h-7" strokeWidth={1.75} />
            </motion.span>

            <h3 className="thb text-[25px] text-ink mb-4">Request received</h3>

            <p className="tb !text-[14px] max-w-[42ch] mx-auto">
              Thank you{name ? `, ${name.split(' ')[0]}` : ''}. We have your request for a{' '}
              <span className="text-amber font-medium">{plan}</span> discovery call on{' '}
              <span className="text-ink">
                {prettyDate(date)} at {localSlot(date, time, timezone).time}
              </span>{' '}
              ({timezone.replace(/_/g, ' ')}). We&rsquo;ll confirm to{' '}
              <span className="text-ink">{email}</span> and send the invitation once a
              host has accepted the slot.
            </p>

            {siteUrl && (
              <p className="tbsm !text-[12.5px] max-w-[42ch] mx-auto mt-4">
                We&rsquo;ll audit <span className="text-ink break-all">{siteUrl}</span> beforehand
                and bring the findings to the call.
              </p>
            )}

            <div className="mt-9">
              <button onClick={finish} className="btn-prim">
                Done
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </ModalShell>
  );
}
