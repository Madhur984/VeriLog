import React, { useState, useEffect, useMemo } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';

// Layout & Foundation
import { FloatingCommandBar } from '../../components/FloatingCommandBar';
import { ScrollProgress } from '../../components/ScrollProgress';
import { SiliconTicker } from './components/SiliconTicker';

// Sections
import { HeroSection } from './sections/HeroSection';
import { SkillTopology } from './sections/SkillTopology';
import { FiscalMatrix } from './sections/FiscalMatrix';
import { TrajectorySimulator } from './sections/TrajectorySimulator';
import { IntelHub } from './sections/IntelHub';

// Components
import { BadgeUnlockOverlay } from '../../components/BadgeUnlockOverlay';
import { SiliconCabinet } from '../../components/SiliconCabinet';
import { SectionWrapper } from '../../components/SectionWrapper';
import { BADGE_DEFINITIONS } from '../../data/badgeDefinitions';
import { generateBadgeSVG } from '../../utils/BadgeEngine';

// Hooks
import { useAmbientAudio } from '../../hooks/useAmbientAudio';

const CareerRoadmapPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState('hero');
  const [audioStarted, setAudioStarted] = useState(false);
  const { start: startAudio } = useAmbientAudio();

  // Mastery & Badge State
  const [masteredNodes, setMasteredNodes] = useState<Set<string>>(new Set(['digital-logic', 'verilog']));
  const [unlockedBadgeIds, setUnlockedBadgeIds] = useState<string[]>(['digital-foundation']);
  const [newBadge, setNewBadge] = useState<{ id: string; name: string; description: string; svgContent: string } | null>(null);

  // Scroll Spy Logic
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.2, rootMargin: '-10% 0px -10% 0px' }
    );

    const sections = document.querySelectorAll('section[id]');
    sections.forEach((s) => observer.observe(s));

    return () => observer.disconnect();
  }, []);

  const handleStartInteraction = () => {
    if (!audioStarted) {
      startAudio();
      setAudioStarted(true);
    }
  };

  const handleUnlockBadge = (badgeId: string) => {
    if (unlockedBadgeIds.includes(badgeId)) return;
    
    const badge = BADGE_DEFINITIONS.find(b => b.id === badgeId);
    if (badge) {
      const svg = generateBadgeSVG(badge, 'USER_ID_MOCK');
      setNewBadge({
        id: badge.id,
        name: badge.name,
        description: badge.description,
        svgContent: svg
      });
      setUnlockedBadgeIds([...unlockedBadgeIds, badgeId]);
    }
  };

  return (
    <div 
      className="min-h-screen bg-observatory-bg selection:bg-cyan-400 selection:text-black"
      onClick={handleStartInteraction}
    >
      <ScrollProgress />
      <FloatingCommandBar activeSection={activeSection} />

      <BadgeUnlockOverlay 
        badge={newBadge} 
        onClose={() => setNewBadge(null)} 
      />

      {/* Main Flow */}
      <main className="relative z-10">
        <HeroSection 
          onCalibrate={() => document.getElementById('skill-graph')?.scrollIntoView({ behavior: 'smooth' })} 
          onExplore={() => document.getElementById('intel')?.scrollIntoView({ behavior: 'smooth' })}
        />
        
        <div className="relative z-10 border-t border-white/[0.03]">
          <SkillTopology />
        </div>

        <div className="relative z-10 border-y border-white/[0.03]">
          <FiscalMatrix />
        </div>

        <div className="relative z-10">
          <TrajectorySimulator />
        </div>

        <SectionWrapper id="cabinet" className="bg-observatory-bg border-t border-white/[0.03]">
          <div className="max-w-7xl mx-auto">
            <div className="mb-12">
              <h2 className="text-4xl font-bold text-white tracking-tight uppercase">Silicon Cabinet</h2>
              <p className="text-slate-500 font-mono text-xs uppercase tracking-widest mt-2">Verified Professional Certifications & Artifacts</p>
            </div>
            <SiliconCabinet 
              unlockedBadgeIds={unlockedBadgeIds} 
              allBadges={BADGE_DEFINITIONS} 
            />
          </div>
        </SectionWrapper>

        <div className="relative z-10 border-t border-white/[0.03]">
          <IntelHub />
        </div>
      </main>

      {/* Persistent Ticker Overlay */}
      <div className="fixed bottom-0 left-0 w-full z-[100]">
        <SiliconTicker />
      </div>

      {/* Noise Grain Overlay */}
      <div className="fixed inset-0 pointer-events-none z-[1] opacity-[0.012] contrast-150 brightness-150">
        <svg className="w-full h-full" style={{ pointerEvents: 'none' }}>
          <filter id="noiseFilter">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noiseFilter)" />
        </svg>
      </div>
    </div>
  );
};

export default CareerRoadmapPage;
