"use client";

import { Navbar } from "@/components/app/navbar";
import { AnimatedFeaturesSection } from "@/components/app/animated-features-section";
import { AnimatedStatsSection } from "@/components/app/animated-stats-section";
import { AnimatedTestimonialsSection } from "@/components/app/animated-testimonials-section";
import { FuturePlansSection } from "@/components/app/future-plans-section";
import { AnimatedCtaSection } from "@/components/app/animated-cta-section";
import { AnimatedFooter } from "@/components/app/animated-footer";
import { HowItWorksSection } from "@/components/app/how-it-works-section";
import { TechStackSection } from "@/components/app/tech-stack-section";
import { AnimatedHeroSectionNew } from "@/components/app/animated-hero-section-new";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col relative overflow-hidden bg-gradient-to-bl from-background via-background/80 to-background">
      {/* Background pattern */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.02] dark:opacity-[0.03]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="grid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 0 10 L 40 10 M 10 0 L 10 40"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
              />
              <path
                d="M 0 20 L 40 20 M 20 0 L 20 40"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
              />
              <path
                d="M 0 30 L 40 30 M 30 0 L 30 40"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <Navbar />

      <main className="flex-1">
        <AnimatedHeroSectionNew />
        <AnimatedFeaturesSection />
        <AnimatedStatsSection />
        <HowItWorksSection />
        <TechStackSection />
        <AnimatedTestimonialsSection />
        <FuturePlansSection />
        <AnimatedCtaSection />
      </main>

      <AnimatedFooter />
    </div>
  );
}
