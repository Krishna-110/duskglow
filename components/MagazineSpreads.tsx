'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import {
  fadeUp,
  revealImage,
  slideInLeft,
  slideInRight,
  stagger,
  VIEWPORT,
} from '@/lib/motion';

interface MagazineSpreadsProps {
  onOpenPreview: () => void;
}

export default function MagazineSpreads({ onOpenPreview }: MagazineSpreadsProps) {
  return (
    <>
      {/* ── THE PROBLEM ── */}
      <Spread
        eyebrow="The Problem"
        title="You own the villa."
        accent="Who owns the brand?"
        lead="Every booking through Airbnb costs 15.5% in service fees. Every guest who stays types the Airbnb logo into their phone — not your villa's name. Your property fuels someone else's valuation."
        support="A direct-booking microsite flips the equation. Your domain appears in Google searches. Your calendar receives enquiries directly. Your guest list compounds with every stay — and the equity stays with you."
        image="https://images.pexels.com/photos/37030525/pexels-photo-37030525.jpeg?auto=compress&cs=tinysrgb&w=1000&dpr=2"
        alt="Terrace with bougainvillea overlooking the sea"
        caption="Ordinary listings compete on price. Brands compete on desire."
        figure="01"
        cta={
          <a href="#features" className="btn-outline">
            <span>See the difference</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        }
        background="bg-canvas-alt"
      />

      {/* ── THE SOLUTION ── */}
      <Spread
        reversed
        eyebrow="The Solution"
        title="Your domain."
        accent="Your guest list."
        lead="A Duskglow microsite is a full editorial presence for your villa — or any short-term rental — designed, built, and deployed in seven days. We handle the photography layout, calendar integration, payment links, and Google indexing."
        support="You get a direct pipeline to your guests. Email capture, retargeting pixels, and off-season messaging — all under your control. Your property becomes the destination; the platform becomes invisible."
        image="https://images.pexels.com/photos/35069530/pexels-photo-35069530.jpeg?auto=compress&cs=tinysrgb&w=1000&dpr=2"
        alt="Sunset wine glasses at an infinity pool"
        caption="Seven days from first call to a live front door online."
        figure="02"
        cta={
          <button onClick={onOpenPreview} className="btn-prim">
            <span>Explore Live Demo</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        }
        background="bg-canvas"
      />
    </>
  );
}

interface SpreadProps {
  eyebrow: string;
  title: string;
  accent: string;
  lead: string;
  support: string;
  image: string;
  alt: string;
  caption: string;
  figure: string;
  cta: React.ReactNode;
  background: string;
  reversed?: boolean;
}

function Spread({
  eyebrow,
  title,
  accent,
  lead,
  support,
  image,
  alt,
  caption,
  figure,
  cta,
  background,
  reversed = false,
}: SpreadProps) {
  return (
    <section className={`py-24 sm:py-32 border-t border-border ${background}`}>
      <div className="max-w-shell mx-auto px-6 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* Copy */}
          <motion.div
            variants={stagger(0.09)}
            initial="hidden"
            whileInView="show"
            viewport={VIEWPORT}
            className={`lg:col-span-7 ${reversed ? 'lg:order-2' : 'lg:order-1'}`}
          >
            <motion.div
              variants={reversed ? slideInRight : slideInLeft}
              className="flex items-center gap-3 mb-6"
            >
              <span aria-hidden className="h-px w-9 bg-amber-line" />
              <span className="te">{eyebrow}</span>
            </motion.div>

            <motion.h2
              variants={fadeUp}
              className="th t-h2 text-ink mb-7 text-balance"
            >
              {title}
              <br />
              <span className="text-amber italic">{accent}</span>
            </motion.h2>

            {/* Lead paragraph gets a drop-cap-adjacent weight bump */}
            <motion.p variants={fadeUp} className="tb !text-[17px] max-w-prose mb-5">
              {lead}
            </motion.p>
            <motion.p variants={fadeUp} className="tbsm max-w-prose mb-9">
              {support}
            </motion.p>

            <motion.div variants={fadeUp}>{cta}</motion.div>
          </motion.div>

          {/* Photography */}
          <motion.figure
            variants={stagger(0.12)}
            initial="hidden"
            whileInView="show"
            viewport={VIEWPORT}
            className={`lg:col-span-5 group ${reversed ? 'lg:order-1' : 'lg:order-2'}`}
          >
            <motion.div
              variants={revealImage}
              className="relative aspect-[4/5] w-full overflow-hidden img-zoom shadow-e3"
            >
              <Image
                src={image}
                alt={alt}
                fill
                sizes="(max-width: 1024px) 100vw, 42vw"
                quality={88}
                className="object-cover"
              />
              {/* Plate number, set into the corner like a magazine folio */}
              <span className="absolute top-0 left-0 bg-[rgba(14,10,7,0.55)] backdrop-blur-sm text-white/85 font-serif text-xs px-3.5 py-2 tracking-widest">
                {figure}
              </span>
            </motion.div>

            <motion.figcaption
              variants={fadeUp}
              className="tbsm !text-[12.5px] mt-4 pl-4 border-l border-amber-line italic"
            >
              {caption}
            </motion.figcaption>
          </motion.figure>
        </div>
      </div>
    </section>
  );
}
