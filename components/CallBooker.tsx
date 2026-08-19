'use client';

import { useEffect, useState } from 'react';
import { CalendarDays, Clock, Mail, User, Globe, Check } from 'lucide-react';
import booked from '@/public/booked.json';

/** Every slot we offer. booked.json lists the ones already taken, per date. */
const ALL_SLOTS = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'];

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
/** Parsed from the ISO string, not `new Date()`, so server and client agree. */
const label = (iso: string) => {
  const [, m, d] = iso.split('-');
  return `${MONTHS[Number(m) - 1]} ${Number(d)}`;
};

const takenOn = (date: string) => booked.find((b) => b.date === date)?.slots ?? [];

export default function CallBooker() {
  const [form, setForm] = useState({
    name: '', email: '', propertyUrl: '', date: '', time: '', timezone: 'UTC',
  });
  const [sent, setSent] = useState(false);

  /* `new Date()` during render would differ between server and client and
     trip hydration, so today's date is filled in after mount. */
  const [today, setToday] = useState('');
  useEffect(() => {
    const n = new Date();
    setToday(`${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, '0')}-${String(n.getDate()).padStart(2, '0')}`);
  }, []);

  const taken = takenOn(form.date);
  const free = ALL_SLOTS.filter((s) => !taken.includes(s));

  /* Picking a new date can invalidate the chosen time, so clear it rather
     than submit a slot that is already taken. */
  const setDate = (date: string) =>
    setForm((f) => ({ ...f, date, time: takenOn(date).includes(f.time) ? '' : f.time }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  const box =
    'flex items-center gap-3 bg-[#17120e] border border-[#ece6dd]/15 rounded-lg px-4 py-3 focus-within:border-[#c98b5f]/50 transition-colors';
  const field = 'bg-transparent outline-none text-sm w-full text-[#ece6dd] placeholder:text-[#ece6dd]/55';
  /* Native dropdowns paint their list with system colours, so the options
     need explicit ones or they render light-on-white when opened. */
  const opt = 'bg-[#17120e] text-[#ece6dd]';

  return (
    <section id="book-call" className="bg-[#17120e] text-[#ece6dd] p-8 sm:p-10 rounded-xl border border-[#ece6dd]/10 shadow-e3">
      <h2 className="text-2xl font-serif mb-2">Book Your Discovery Call</h2>
      <p className="text-sm text-[#ece6dd]/70 mb-6">
        20-minute call. We sketch your microsite concept. No pitch — just a plan.
        Manual scheduling — no automated billing.
      </p>

      {sent ? (
        <div className="flex items-start gap-3 border border-[#c98b5f]/40 bg-[#c98b5f]/10 rounded-lg px-5 py-6">
          <Check size={18} className="text-[#c98b5f] shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium mb-1">Request noted, {form.name}.</p>
            <p className="text-[#ece6dd]/70">
              {label(form.date)} at {form.time} ({form.timezone}).
              Nothing has been sent yet — this form is not connected to a mailbox.
            </p>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={box}>
              <User size={16} className="text-[#c98b5f] shrink-0" />
              <input required type="text" aria-label="Your name" placeholder="Name"
                value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={field} />
            </div>
            <div className={box}>
              <Mail size={16} className="text-[#c98b5f] shrink-0" />
              <input required type="email" aria-label="Your email" placeholder="Email"
                value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={field} />
            </div>
          </div>

          <div className={box}>
            <Globe size={16} className="text-[#c98b5f] shrink-0" />
            <input type="url" aria-label="Property URL (optional)" placeholder="Property URL (optional)"
              value={form.propertyUrl} onChange={(e) => setForm({ ...form, propertyUrl: e.target.value })} className={field} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className={box}>
              <CalendarDays size={16} className="text-[#c98b5f] shrink-0" />
              <input required type="date" aria-label="Call date" value={form.date}
                min={today || undefined} onChange={(e) => setDate(e.target.value)} className={field} />
            </div>
            <div className={box}>
              <Clock size={16} className="text-[#c98b5f] shrink-0" />
              <select required aria-label="Call time" value={form.time}
                onChange={(e) => setForm({ ...form, time: e.target.value })}
                className={`${field} appearance-none cursor-pointer`}>
                <option value="" className={opt}>{free.length ? 'Select time' : 'Fully booked'}</option>
                {free.map((s) => <option key={s} value={s} className={opt}>{s}</option>)}
              </select>
            </div>
            <div className={box}>
              <Globe size={16} className="text-[#c98b5f] shrink-0" />
              <select aria-label="Your timezone" value={form.timezone}
                onChange={(e) => setForm({ ...form, timezone: e.target.value })}
                className={`${field} appearance-none cursor-pointer`}>
                {['UTC', 'Europe/London', 'America/New_York', 'Asia/Dubai'].map((z) => (
                  <option key={z} value={z} className={opt}>{z}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="text-xs text-[#ece6dd]/60 flex gap-2 flex-wrap items-center">
            <span className="px-2 py-1 rounded bg-[#ece6dd]/5 border border-[#ece6dd]/10">
              Limited availability: {booked.map((b) => label(b.date)).join(', ')}
            </span>
            <span>Manual scheduling · No automated billing · Service-based, not SaaS</span>
          </div>

          <button type="submit" className="w-full bg-[#c98b5f] text-[#17120e] font-semibold py-4 rounded-lg hover:bg-[#d2966a] transition-colors tracking-wide text-sm uppercase">
            Book Call
          </button>
        </form>
      )}
    </section>
  );
}
