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
} from 'lucide-react';
import ModalShell from '@/components/ui/ModalShell';
import { EASE_OUT } from '@/lib/motion';

interface BookCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlan?: string;
}

const STEPS = ['Package', 'Revenue', 'Contact'] as const;

export default function BookCallModal({
  isOpen,
  onClose,
  selectedPlan = 'Pro',
}: BookCallModalProps) {
  const [step, setStep] = useState<number>(1);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [plan, setPlan] = useState<string>(selectedPlan);
  const [villaLocation, setVillaLocation] = useState('');
  const [monthlyRevenue, setMonthlyRevenue] = useState('€5,000 - €10,000');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);

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
                      Villa / property location
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
                    <label className="label" htmlFor="bc-revenue">
                      Estimated monthly Airbnb revenue
                    </label>
                    <select
                      id="bc-revenue"
                      value={monthlyRevenue}
                      onChange={(e) => setMonthlyRevenue(e.target.value)}
                      className="field"
                    >
                      <option value="Under €5,000">Under €5,000 / month</option>
                      <option value="€5,000 - €10,000">€5,000 – €10,000 / month</option>
                      <option value="€10,000 - €20,000">€10,000 – €20,000 / month</option>
                      <option value="Over €20,000">Over €20,000 / month</option>
                    </select>
                    <p className="tbsm !text-[12px] mt-3">
                      Used only to size the savings estimate we bring to the call.
                    </p>
                  </div>

                  <div className="flex justify-between pt-2">
                    <button onClick={() => go(1)} className="btn-outline">
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Back</span>
                    </button>
                    <button onClick={() => go(3)} className="btn-prim">
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

            <h3 className="thb text-[25px] text-ink mb-4">Request confirmed</h3>

            <p className="tb !text-[14px] max-w-[42ch] mx-auto">
              Thank you{name ? `, ${name.split(' ')[0]}` : ''}. We&rsquo;ve reserved your
              discovery call for the <span className="text-amber font-medium">{plan}</span>{' '}
              package. A calendar invitation is on its way to{' '}
              <span className="text-ink">{email}</span>.
            </p>

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
