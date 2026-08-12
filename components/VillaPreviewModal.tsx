'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Lock,
  Calendar as CalendarIcon,
  Star,
  Check,
  CreditCard,
  Shield,
  MapPin,
  Users,
  Wifi,
  Waves,
  Sparkles,
} from 'lucide-react';
import ModalShell from '@/components/ui/ModalShell';
import { EASE_OUT, fadeUp, stagger } from '@/lib/motion';

interface VillaPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TABS = ['overview', 'gallery', 'booking'] as const;
type Tab = (typeof TABS)[number];

const galleryImages = [
  'https://images.pexels.com/photos/31751031/pexels-photo-31751031.jpeg?auto=compress&cs=tinysrgb&w=900&dpr=2',
  'https://images.pexels.com/photos/37030525/pexels-photo-37030525.jpeg?auto=compress&cs=tinysrgb&w=900&dpr=2',
  'https://images.pexels.com/photos/35069530/pexels-photo-35069530.jpeg?auto=compress&cs=tinysrgb&w=900&dpr=2',
  'https://images.pexels.com/photos/20852906/pexels-photo-20852906.jpeg?auto=compress&cs=tinysrgb&w=900&dpr=2',
];

const amenities = [
  { icon: Users, label: '10 Guests', sub: '5 Bedrooms' },
  { icon: Waves, label: 'Infinity Pool', sub: 'Heated, Aegean-facing' },
  { icon: Wifi, label: 'Starlink Wi-Fi', sub: '300 Mbps' },
  { icon: Shield, label: 'Direct Host', sub: 'Andreas Skiadopoulos' },
];

const PRICE_PER_NIGHT = 1250;

export default function VillaPreviewModal({ isOpen, onClose }: VillaPreviewModalProps) {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [selectedNights, setSelectedNights] = useState(4);
  const [isBooked, setIsBooked] = useState(false);

  const totalPrice = PRICE_PER_NIGHT * selectedNights;
  const airbnbFeeSaved = Math.round(totalPrice * 0.155);

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={onClose}
      labelledBy="villa-preview-title"
      containerClassName="p-3 sm:p-6 md:p-8"
      panelClassName="w-full max-w-5xl max-h-[92vh] bg-[#141210] border border-[#3a332e] text-[#f0eae1] shadow-e4 flex flex-col overflow-hidden"
    >
      {/* Chrome */}
      <div className="bg-[#1e1a16] px-4 py-3 border-b border-[#3a332e] flex items-center gap-4 shrink-0">
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onClose}
            aria-label="Close demo"
            className="w-3 h-3 rounded-full bg-[#ef6c5b] hover:brightness-125 transition"
          />
          <span aria-hidden className="w-3 h-3 rounded-full bg-[#e0b34a]" />
          <span aria-hidden className="w-3 h-3 rounded-full bg-[#54b969]" />
        </div>

        <div className="flex items-center gap-2 bg-[#120f0d] border border-[#3a332e] px-4 py-1.5 rounded-full text-[11px] w-full max-w-md mx-auto min-w-0">
          <Lock className="w-3 h-3 text-[#54b969] shrink-0" />
          <span className="truncate font-mono text-[#f0eae1]">
            villadelos-mykonos.com
          </span>
          <span className="ml-auto shrink-0 text-[9px] text-amber-light bg-amber-light/10 px-2 py-0.5 rounded uppercase tracking-[0.12em] font-medium">
            Demo
          </span>
        </div>

        <button
          onClick={onClose}
          aria-label="Close demo"
          className="text-[#9a8f7e] hover:text-[#f0eae1] p-1 transition-colors shrink-0"
        >
          <X className="w-[18px] h-[18px]" />
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-8">
        {/* Villa hero */}
        <div className="relative h-64 sm:h-80 w-full overflow-hidden group">
          <Image
            src="https://images.pexels.com/photos/31751031/pexels-photo-31751031.jpeg?auto=compress&cs=tinysrgb&w=1200&dpr=2"
            alt="Villa Delos, Mykonos"
            fill
            sizes="(max-width: 1024px) 100vw, 60vw"
            quality={88}
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(20,18,16,0.94)_0%,rgba(20,18,16,0.28)_50%,transparent_100%)]" />

          <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <Star className="w-3.5 h-3.5 fill-amber-light text-amber-light" />
                <span className="te !text-[9.5px] !text-amber-light">
                  Direct Booking · Example Property
                </span>
              </div>
              <h2
                id="villa-preview-title"
                className="thb text-[28px] sm:text-[34px] text-white"
              >
                Villa Delos — Mykonos
              </h2>
              <p className="text-[12px] text-white/70 flex items-center gap-1.5 mt-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-light shrink-0" />
                <span>Agios Ioannis Beach, Mykonos, Greece</span>
              </p>
            </div>

            <div className="bg-[#1f1a16]/90 backdrop-blur-md border border-amber-light/25 px-4 py-2.5 text-right shrink-0">
              <span className="te !text-[9px] !text-white/55 block mb-1">
                Direct Rate
              </span>
              <span className="font-serif text-[24px] text-amber-light font-semibold num leading-none">
                €1,250
                <span className="text-[11px] text-white/55 font-sans font-normal ml-1">
                  /night
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center justify-between border-b border-[#3a332e] gap-4">
          <div className="flex gap-7">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                aria-current={activeTab === tab}
                className={`relative pb-3 text-[11px] font-medium uppercase tracking-[0.15em] transition-colors duration-300 ${
                  activeTab === tab
                    ? 'text-amber-light'
                    : 'text-[#9a8f7e] hover:text-[#f0eae1]'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                {activeTab === tab && (
                  <motion.span
                    layoutId="villa-tab-underline"
                    transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                    className="absolute -bottom-px left-0 right-0 h-[1.5px] bg-amber-light"
                  />
                )}
              </button>
            ))}
          </div>

          <div className="hidden sm:flex items-center gap-2 text-[10.5px] text-[#8fd6a1] border border-[#2f5c3c] bg-[#132018] px-3 py-1.5 shrink-0">
            <Check className="w-3.5 h-3.5" strokeWidth={2.5} />
            <span className="uppercase tracking-[0.1em]">Zero commission engine</span>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {/* Overview */}
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              variants={stagger(0.07)}
              initial="hidden"
              animate="show"
              exit={{ opacity: 0, transition: { duration: 0.18 } }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8"
            >
              <div className="lg:col-span-8 space-y-6">
                <motion.h3 variants={fadeUp} className="th text-[26px] text-white">
                  Architectural oceanfront sanctuary
                </motion.h3>
                <motion.p
                  variants={fadeUp}
                  className="text-[14.5px] leading-[1.75] text-[#c4b8a6] max-w-prose"
                >
                  Overlooking the Aegean and ancient Delos, Villa Delos offers five
                  master suites, an infinity saltwater pool, a private sunset deck, and
                  dedicated concierge service — built in classic Cycladic stone.
                </motion.p>

                <motion.div
                  variants={fadeUp}
                  className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-5 border-t border-[#2a2420]"
                >
                  {amenities.map(({ icon: Icon, label, sub }) => (
                    <div
                      key={label}
                      className="p-4 bg-[#1b1714] border border-[#2a2420] hover:border-amber-light/30 transition-colors duration-500"
                    >
                      <Icon className="w-4 h-4 text-amber-light mb-2.5" />
                      <span className="text-[12px] font-medium text-white block leading-snug">
                        {label}
                      </span>
                      <span className="text-[10.5px] text-[#9a8f7e] block mt-0.5">
                        {sub}
                      </span>
                    </div>
                  ))}
                </motion.div>
              </div>

              {/* Booking widget */}
              <motion.div
                variants={fadeUp}
                className="lg:col-span-4 bg-[#1b1714] border border-amber-light/25 p-6 space-y-5 self-start"
              >
                <div className="flex justify-between items-center gap-3 pb-4 border-b border-[#2a2420]">
                  <span className="te !text-[9.5px] !text-[#9a8f7e]">
                    Direct Checkout
                  </span>
                  <span className="text-[10.5px] text-amber-light font-medium bg-amber-light/10 px-2 py-1 num">
                    Save €{airbnbFeeSaved.toLocaleString()}
                  </span>
                </div>

                <div>
                  <label
                    htmlFor="vp-nights"
                    className="text-[11px] text-[#c4b8a6] block mb-2"
                  >
                    Stay duration
                  </label>
                  <select
                    id="vp-nights"
                    value={selectedNights}
                    onChange={(e) => setSelectedNights(Number(e.target.value))}
                    className="w-full bg-[#120f0d] border border-[#3a332e] text-white text-[12.5px] p-3 outline-none focus:border-amber-light transition-colors"
                  >
                    {[3, 4, 7, 10].map((n) => (
                      <option key={n} value={n}>
                        {n} nights (€{(PRICE_PER_NIGHT * n).toLocaleString()})
                      </option>
                    ))}
                  </select>
                </div>

                <dl className="space-y-2.5 text-[12.5px] text-[#c4b8a6]">
                  <div className="flex justify-between gap-3">
                    <dt>
                      €{PRICE_PER_NIGHT.toLocaleString()} × {selectedNights} nights
                    </dt>
                    <dd className="text-white font-medium num">
                      €{totalPrice.toLocaleString()}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-3 text-[#8fd6a1]">
                    <dt>Airbnb commission</dt>
                    <dd className="num">€0</dd>
                  </div>
                  <div className="flex justify-between gap-3 text-[#8fd6a1]">
                    <dt>Direct booking discount</dt>
                    <dd>Included</dd>
                  </div>
                  <div className="flex justify-between gap-3 items-baseline font-serif text-[19px] text-white font-semibold pt-4 mt-1 border-t border-[#2a2420]">
                    <dt>Total due</dt>
                    <dd className="text-amber-light num">
                      €{totalPrice.toLocaleString()}
                    </dd>
                  </div>
                </dl>

                <AnimatePresence mode="wait">
                  {isBooked ? (
                    <motion.p
                      key="booked"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, ease: EASE_OUT }}
                      className="p-3.5 bg-[#132018] border border-[#2f5c3c] text-center text-[11.5px] leading-relaxed text-[#8fd6a1]"
                    >
                      Reservation link generated — funds settle via Stripe straight to
                      your bank.
                    </motion.p>
                  ) : (
                    <motion.button
                      key="book"
                      onClick={() => setIsBooked(true)}
                      className="w-full bg-amber-light text-[#17120e] font-medium text-[11px] uppercase tracking-[0.14em] py-3.5 hover:brightness-105 transition-all flex items-center justify-center gap-2"
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>Reserve via Stripe</span>
                    </motion.button>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          )}

          {/* Gallery */}
          {activeTab === 'gallery' && (
            <motion.div
              key="gallery"
              variants={stagger(0.08)}
              initial="hidden"
              animate="show"
              exit={{ opacity: 0, transition: { duration: 0.18 } }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              {galleryImages.map((img, idx) => (
                <motion.div
                  key={img}
                  variants={fadeUp}
                  className="group relative h-60 sm:h-64 border border-[#3a332e] overflow-hidden img-zoom"
                >
                  <Image
                    src={img}
                    alt={`Villa Delos, view ${idx + 1}`}
                    fill
                    sizes="(max-width: 640px) 100vw, 45vw"
                    quality={84}
                    className="object-cover"
                  />
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Booking */}
          {activeTab === 'booking' && (
            <motion.div
              key="booking"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, transition: { duration: 0.18 } }}
              transition={{ duration: 0.45, ease: EASE_OUT }}
              className="p-10 bg-[#1b1714] border border-[#3a332e] text-center"
            >
              <CalendarIcon className="w-10 h-10 text-amber-light mx-auto mb-5" strokeWidth={1.25} />
              <h3 className="th text-[24px] text-white mb-4">
                Live calendar synchronisation
              </h3>
              <p className="text-[13.5px] leading-[1.75] text-[#c4b8a6] max-w-[52ch] mx-auto mb-7">
                Duskglow syncs your iCal feeds from Airbnb, VRBO, or iTrip in real time.
                Guests see accurate availability with zero risk of double booking.
              </p>
              <span className="inline-flex items-center gap-2 px-4 py-2.5 border border-[#2f5c3c] bg-[#132018] text-[#8fd6a1] text-[11px] uppercase tracking-[0.12em]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#54b969]" />
                iCal synchronised
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="bg-[#1b1714] px-5 sm:px-8 py-4 border-t border-[#3a332e] flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
        <p className="flex items-center gap-2.5 text-[12px] text-[#c4b8a6] text-center sm:text-left">
          <Sparkles className="w-4 h-4 text-amber-light shrink-0" />
          <span>This is what your property looks like to guests, under your domain.</span>
        </p>
        <button
          onClick={onClose}
          className="border border-[#3a332e] hover:border-amber-light/40 hover:text-white text-[#c4b8a6] px-5 py-2.5 transition-colors uppercase tracking-[0.14em] font-medium text-[10.5px] shrink-0"
        >
          Close Demo
        </button>
      </div>
    </ModalShell>
  );
}
