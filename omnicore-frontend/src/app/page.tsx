import { Navbar } from "@/components/app/navbar";
import { HeroSection } from "@/components/app/hero-section";
import { FeaturesSection } from "@/components/app/features-section";
import { TestimonialsSection } from "@/components/app/testimonials-section";
import { PricingSection } from "@/components/app/pricing-section";
import { CtaSection } from "@/components/app/cta-section";
import { Footer } from "@/components/app/footer";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
        <TestimonialsSection />
        <PricingSection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
}
