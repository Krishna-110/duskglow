'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import RoiCalculator from '@/components/RoiCalculator';
import MagazineSpreads from '@/components/MagazineSpreads';
import FeaturesSection from '@/components/FeaturesSection';
import ProcessTimeline from '@/components/ProcessTimeline';
import TestimonialSection from '@/components/TestimonialSection';
import PricingSection from '@/components/PricingSection';
import FaqSection from '@/components/FaqSection';
import Footer from '@/components/Footer';
import BookCallModal from '@/components/BookCallModal';
import VillaPreviewModal from '@/components/VillaPreviewModal';

export default function Home() {
  const [bookCallOpen, setBookCallOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('Pro');

  const handleOpenBookCall = (planName?: string) => {
    if (planName) setSelectedPlan(planName);
    setBookCallOpen(true);
  };

  return (
    <>
      <a
        href="#roi"
        className="sr-only-focusable fixed top-4 left-4 z-[200] btn-prim"
      >
        Skip to content
      </a>

      <Navbar
        onOpenBookCall={() => handleOpenBookCall()}
        onOpenPreview={() => setPreviewOpen(true)}
      />

      <main className="relative bg-canvas">
        <HeroSection
          onOpenBookCall={() => handleOpenBookCall()}
          onOpenPreview={() => setPreviewOpen(true)}
        />

        <RoiCalculator onOpenBookCall={() => handleOpenBookCall()} />

        <MagazineSpreads onOpenPreview={() => setPreviewOpen(true)} />

        <FeaturesSection />

        <ProcessTimeline />

        <TestimonialSection />

        <PricingSection onSelectPlan={(plan) => handleOpenBookCall(plan)} />

        <FaqSection />

        <Footer onOpenBookCall={() => handleOpenBookCall()} />
      </main>

      <BookCallModal
        isOpen={bookCallOpen}
        onClose={() => setBookCallOpen(false)}
        selectedPlan={selectedPlan}
      />

      <VillaPreviewModal
        isOpen={previewOpen}
        onClose={() => setPreviewOpen(false)}
      />
    </>
  );
}
