import { Navbar } from '../components/landing/Navbar';
import { HeroSection } from '../components/landing/HeroSection';
import { BlackCardSection } from '../components/landing/BlackCardSection';
import { UnifiedProfileSection } from '../components/landing/UnifiedProfileSection';
import { PricingSection } from '../components/landing/PricingSection';
import { FinalCTASection } from '../components/landing/FinalCTASection';
import { Footer } from '../components/Footer';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-beige-200 via-warmGray-200 to-beige-200">
      <Navbar />

      <main>
        <HeroSection />
        <BlackCardSection />
        <UnifiedProfileSection />
        <PricingSection />
        <FinalCTASection />
      </main>

      <Footer />
    </div>
  );
}
