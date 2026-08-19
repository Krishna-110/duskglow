import { useState } from 'react';
import { CalendarDays, Clock, Mail, User, Globe } from 'lucide-react';

export default function CallBooker() {
  const [form, setForm] = useState({ name: '', email: '', propertyUrl: '', date: '', time: '', timezone: 'UTC' });
  const bookedDates = ['2026-08-20', '2026-08-25'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Booking request received for ${form.name}
Date: ${form.date} ${form.time}
Timezone: ${form.timezone}
Property: ${form.propertyUrl || 'N/A'}

No Stripe / no SaaS — manual follow-up after satisfaction.`);
  };

  return (
    <section className="bg-[#17120e] text-[#ece6dd] p-10 rounded-xl border border-[#ece6dd]/10 shadow-xl" style={{ fontFamily: "'Inter', sans-serif" }}>
      <h2 className="text-2xl font-serif mb-2">Book Your Discovery Call</h2>
      <p className="text-sm text-[#ece6dd]/60 mb-6">20-minute call. We sketch your microsite concept. No pitch — just a plan. Manual scheduling — no automated billing.</p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 bg-[#17120e] border border-[#ece6dd]/10 rounded-lg px-4 py-3 focus-within:border-[#c4a87a]/40 transition-colors">
            <User size={16} className="text-[#c4a87a]" />
            <input required type="text" placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="bg-transparent outline-none text-sm w-full placeholder:text-[#ece6dd]/30" />
          </div>
          <div className="flex items-center gap-3 bg-[#17120e] border border-[#ece6dd]/10 rounded-lg px-4 py-3 focus-within:border-[#c4a87a]/40 transition-colors">
            <Mail size={16} className="text-[#c4a87a]" />
            <input required type="email" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="bg-transparent outline-none text-sm w-full placeholder:text-[#ece6dd]/30" />
          </div>
        </div>

        <div className="flex items-center gap-3 bg-[#17120e] border border-[#ece6dd]/10 rounded-lg px-4 py-3 focus-within:border-[#c4a87a]/40 transition-colors">
          <Globe size={16} className="text-[#c4a87a]" />
          <input type="url" placeholder="Property URL (optional)" value={form.propertyUrl} onChange={e => setForm({ ...form, propertyUrl: e.target.value })} className="bg-transparent outline-none text-sm w-full placeholder:text-[#ece6dd]/30" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 bg-[#17120e] border border-[#ece6dd]/10 rounded-lg px-4 py-3 focus-within:border-[#c4a87a]/40 transition-colors">
            <CalendarDays size={16} className="text-[#c4a87a]" />
            <input required type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} min="2026-08-01" className="bg-transparent outline-none text-sm text-[#ece6dd]/80 w-full" />
          </div>
          <div className="flex items-center gap-3 bg-[#17120e] border border-[#ece6dd]/10 rounded-lg px-4 py-3 focus-within:border-[#c4a87a]/40 transition-colors">
            <Clock size={16} className="text-[#c4a87a]" />
            <select value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} className="bg-transparent outline-none text-sm text-[#ece6dd]/80 w-full appearance-none cursor-pointer">
              <option value="">Select time</option>
              <option>09:00</option><option>10:00</option><option>11:00</option><option>14:00</option><option>15:00</option><option>16:00</option>
            </select>
          </div>
          <div className="flex items-center gap-3 bg-[#17120e] border border-[#ece6dd]/10 rounded-lg px-4 py-3 focus-within:border-[#c4a87a]/40 transition-colors">
            <Globe size={16} className="text-[#c4a87a]" />
            <select value={form.timezone} onChange={e => setForm({ ...form, timezone: e.target.value })} className="bg-transparent outline-none text-sm text-[#ece6dd]/80 w-full appearance-none cursor-pointer">
              <option>UTC</option><option>Europe/London</option><option>America/New_York</option><option>Asia/Dubai</option>
            </select>
          </div>
        </div>

        <div className="text-xs text-[#ece6dd]/30 flex gap-2 flex-wrap">
          <span className="px-2 py-1 rounded bg-[#ece6dd]/5 border border-[#ece6dd]/10">Blocked: Aug 20, Aug 25</span>
          <span>Manual scheduling · No automated billing · Service-based, not SaaS</span>
        </div>

        <button type="submit" className="w-full bg-[#c4a87a] text-[#17120e] font-semibold py-4 rounded-lg hover:bg-[#b8985a] transition-colors tracking-wide text-sm uppercase">
          Book Call
        </button>
      </form>
    </section>
  );
}