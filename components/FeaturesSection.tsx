'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import SectionHeading from '@/components/ui/SectionHeading';
import { fadeUp, revealImage, stagger, VIEWPORT } from '@/lib/motion';

/**
 * Commissioned photography, shot to the brief for each feature rather than
 * pulled from stock — so the payments row shows a card actually being tapped
 * and the calendar row shows an actual booking calendar.
 *
 * Colour-graded to match the existing site imagery (hero, magazine spreads,
 * pricing): bright midday sun, deep blue sea, turquoise pool, whitewashed
 * stucco, bougainvillea. An earlier muted golden-hour set was replaced because
 * it read as a different brand next to those.
 *
 * Sources live in D:\duskglow-images; files here are resized to 1440px and
 * re-encoded to WebP (12.1MB -> 733KB). That matters because `next.config.js`
 * sets `images.unoptimized`, so whatever ships is served byte-for-byte with no
 * build-time compression.
 */
const features = [
  {
    num: '01',
    title: 'Photography-first design',
    desc: 'Full-bleed imagery, editorial galleries, and asymmetrical grids built to showcase every angle of your property.',
    image: '/features/photography.webp',
    alt: 'A whitewashed villa terrace with an infinity pool overlooking the sea',
  },
  {
    num: '02',
    title: 'Stripe payment links',
    desc: 'Guests pay deposits by card, right on your site. No app, no account, no 15.5% haircut. Funds settle straight to your bank.',
    image: '/features/payments.webp',
    alt: 'A card held above a contactless card reader on a sunlit poolside table',
  },
  {
    num: '03',
    title: 'Your own domain',
    desc: 'YourVillaName.com — Google-indexed and Search Console optimised. Guests search your property and find you, not a listing page.',
    image: '/features/domain.webp',
    alt: 'A laptop on a terrace table showing a villa website',
  },
  {
    num: '04',
    title: 'Live calendar sync',
    desc: 'Guests view real-time availability and submit enquiries directly. No double-bookings. No platform holding your dates.',
    image: '/features/calendar.webp',
    alt: 'A tablet showing a booking calendar with a run of dates marked',
  },
  {
    num: '05',
    title: 'Mobile-optimised',
    desc: 'Seventy percent of travellers browse on phones. Fast-loading, clear, and conversion-friendly wherever guests scroll.',
    image: '/features/mobile.webp',
    alt: 'Hands holding a phone showing a villa website on a terrace',
  },
  {
    num: '06',
    title: 'Guest data — yours',
    desc: 'Email capture, guest lists, retargeting — all under your control. Build relationships that bring guests back year after year.',
    image: '/features/guestdata.webp',
    alt: 'A laptop by a pool showing a guest dashboard with bookings and occupancy',
  },
] as const;

export default function FeaturesSection() {
  return (
    <section id="features" className="py-24 sm:py-32 bg-canvas-alt border-t border-border">
      <div className="max-w-shell mx-auto px-6 sm:px-8">
        <SectionHeading
          eyebrow="What You Get"
          title="Everything a villa needs"
          accent="to be independent."
          className="mb-16 sm:mb-20 max-w-[42rem]"
        />

        {/* Alternating editorial rows */}
        <div className="border-t border-border">
          {features.map((feat, idx) => {
            const reversed = idx % 2 === 1;
            const plateSpan = reversed
              ? 'lg:col-span-5 lg:order-2'
              : 'lg:col-span-7 lg:order-1';

            return (
              <motion.article
                key={feat.num}
                variants={stagger(0.1)}
                initial="hidden"
                whileInView="show"
                viewport={VIEWPORT}
                className="group grid grid-cols-1 lg:grid-cols-12 border-b border-border"
              >
                {/* Plate */}
                <motion.div
                  variants={revealImage}
                  className={`relative min-h-[260px] lg:min-h-[380px] overflow-hidden img-zoom ${plateSpan}`}
                >
                  <Image
                    src={feat.image}
                    alt={feat.alt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 55vw"
                    /* Without this next/image falls back to 75, which left the
                       six product images at the lowest quality on the site. */
                    quality={90}
                    className="object-cover"
                  />
                  {/* Deepens the plate toward the copy so the seam reads as one spread */}
                  <span
                    aria-hidden
                    className="absolute inset-0 bg-gradient-to-t from-[rgba(14,10,7,0.28)] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-out"
                  />
                </motion.div>

                {/* Copy */}
                <div
                  className={`px-0 py-10 lg:p-14 flex flex-col justify-center ${
                    reversed
                      ? 'lg:col-span-7 lg:order-1 lg:pl-0'
                      : 'lg:col-span-5 lg:order-2 lg:pr-0'
                  }`}
                >
                  <motion.div variants={fadeUp} className="flex items-baseline gap-4 mb-5">
                    <span className="font-serif text-[42px] leading-none text-amber-line select-none">
                      {feat.num}
                    </span>
                    <span
                      aria-hidden
                      className="h-px flex-1 bg-border origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-700 ease-out"
                    />
                  </motion.div>

                  <motion.h3
                    variants={fadeUp}
                    className="thb t-h3 text-ink mb-3 group-hover:text-amber transition-colors duration-500"
                  >
                    {feat.title}
                  </motion.h3>

                  <motion.p variants={fadeUp} className="tb !text-[14.5px] max-w-[42ch]">
                    {feat.desc}
                  </motion.p>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
