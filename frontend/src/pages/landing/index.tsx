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
      className="min-h-screen w-full flex flex-col items-center bg-[#07080A] text-white selection:bg-[#22D3EE]/20 selection:text-[#22D3EE] overflow-x-hidden relative"
      style={{
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* CRT Scanline Overlay */}
      <div 
        className="pointer-events-none fixed inset-0 z-[9999]"
        style={{
          background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%)',
          backgroundSize: '100% 4px',
          opacity: 0.06,
        }}
      />

      {/* Subtle Instrument Screen Noise Texture */}
      <div 
        className="pointer-events-none fixed inset-0 z-[9998] opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

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
