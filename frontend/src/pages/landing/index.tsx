import { useState, useEffect } from 'react';
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
  const [isBooting, setIsBooting] = useState(true);
  const [bootText, setBootText] = useState('SYSTEM_INIT');

  useEffect(() => {
    const sequences = [
      { text: 'CORE_STABILITY: CALIBRATING...', delay: 150 },
      { text: 'SIGNAL_FIDELITY: UNLOCKED [FS:192k]', delay: 300 },
      { text: 'METAMORPHIC_ROUTING: CONNECTING...', delay: 450 },
      { text: 'BITFORBYTES v5.0: ACTIVE', delay: 650 },
      { text: 'BOOT_COMPLETE', delay: 800 }
    ];

    sequences.forEach(seq => {
      const timer = setTimeout(() => {
        setBootText(seq.text);
        if (seq.text === 'BOOT_COMPLETE') {
          setIsBooting(false);
        }
      }, seq.delay);
      return () => clearTimeout(timer);
    });
  }, []);

  if (isBooting) {
    return (
      <div className="min-h-screen w-full bg-[#07080A] flex flex-col items-center justify-center font-mono text-[10px] tracking-widest text-[#22D3EE] select-none">
        <div className="space-y-3 text-center">
          <div>[ {bootText} ]</div>
          <div className="w-32 h-[1px] bg-white/5 mx-auto overflow-hidden relative">
            <div className="absolute top-0 bottom-0 left-0 bg-[#22D3EE] w-12 animate-loading-bar" />
          </div>
        </div>
        <style>{`
          @keyframes loading-bar {
            0% { transform: translateX(-50px); }
            100% { transform: translateX(130px); }
          }
          .animate-loading-bar {
            animation: loading-bar 1.2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
          }
        `}</style>
      </div>
    );
  }

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
