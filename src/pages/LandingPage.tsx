import { Navbar } from '../components/landing/Navbar';
import { HeroSection } from '../components/landing/HeroSection';
import { BlackCardSection } from '../components/landing/BlackCardSection';
import { FeaturesSection } from '../components/landing/FeaturesSection';
import { TemplatesSection } from '../components/landing/TemplatesSection';
import { HowItWorksSection } from '../components/landing/HowItWorksSection';
import { FinalCTASection } from '../components/landing/FinalCTASection';
import { Footer } from '../components/Footer';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />

      <main>
        <HeroSection />
        <BlackCardSection />
        <FeaturesSection />
        <TemplatesSection />
        <HowItWorksSection />
        <FinalCTASection />
      </main>

      <Footer />
    </div>
  );
}
