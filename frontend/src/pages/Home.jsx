import React from 'react';
import HeroSection from '../components/home/HeroSection';
import StatsBar from '../components/home/StatsBar';
import ServicesSection from '../components/home/ServicesSection';
import TechMarquee from '../components/home/TechMarquee';
import WhyChooseUs from '../components/home/WhyChooseUs';
import TestimonialsSection from '../components/home/TestimonialsSection';
import ProcessSection from '../components/home/ProcessSection';
import CTABanner from '../components/home/CTABanner';

export default function Home() {
  return (
    <div className="bg-black min-h-screen">
      <HeroSection />
      <StatsBar />
      <ServicesSection />
      <TechMarquee />
      <WhyChooseUs />
      <TestimonialsSection />
      <ProcessSection />
      <CTABanner />
    </div>
  );
}