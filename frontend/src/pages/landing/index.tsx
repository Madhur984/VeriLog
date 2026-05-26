import { LandingNav } from './LandingNav';
import { HeroSection } from './HeroSection';
import { BinaryStrip } from '../../components/BinaryStrip';
import { WhatIsSection } from './WhatIsSection';
import { ThreePaths } from './ThreePaths';
import { HowItWorks } from './HowItWorks';
import { PlatformPreview } from './PlatformPreview';
import { StatsSection } from './StatsSection';
import { ForWhoSection } from './ForWhoSection';
import { FinalCTA } from './FinalCTA';
import { LandingFooter } from './LandingFooter';

const LandingPage = () => {
  return (
    <div
      className="min-h-screen w-full flex flex-col items-center bg-[#07080A] text-white selection:bg-[#22D3EE]/20 selection:text-[#22D3EE] overflow-x-hidden"
      style={{
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* §1 Nav Bar */}
      <LandingNav />

      {/* §2 Hero Section */}
      <HeroSection />

      {/* §3 Binary Counter Strip */}
      <BinaryStrip />

      {/* §4 What is BitforBytes */}
      <WhatIsSection />

      {/* §5 The Three Paths */}
      <ThreePaths />

      {/* §6 How It Works */}
      <HowItWorks />

      {/* §7 Platform Preview */}
      <PlatformPreview />

      {/* §8 Stats + Credibility */}
      <StatsSection />

      {/* §9 Who This Is For */}
      <ForWhoSection />

      {/* §10 Final CTA */}
      <FinalCTA />

      {/* §11 Footer */}
      <LandingFooter />
    </div>
  );
};

export default LandingPage;
