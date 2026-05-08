import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';

// Layout & Foundation
import { FloatingCommandBar } from '../../components/FloatingCommandBar';
import { ScrollProgress } from '../../components/ScrollProgress';
import { SiliconBriefing } from './components/SiliconBriefing';

// Existing Sections
import { HeroSection } from './sections/HeroSection';
import { SkillTopology } from './sections/SkillTopology';
import { FiscalMatrix } from './sections/FiscalMatrix';
import { TrajectorySimulator } from './sections/TrajectorySimulator';

// New Integrated Components
import { SiliconCompass } from '../../components/SiliconCompass';
import { DomainExplorer } from '../../components/DomainExplorer';
import { MarketGiants } from '../../components/MarketGiants';
import { ExecutionTimeline } from '../../components/ExecutionTimeline';
import { ExpertSignal } from '../../components/ExpertSignal';
import { ComparisonBench } from '../../components/ComparisonBench';

// Phase 1 & 2 Components
import { SkillGapRadar } from './components/SkillGapRadar';
import { ResumePreview } from './components/ResumePreview';
import { TechnicalTerminal } from './components/TechnicalTerminal';
import { GlobalSalaryHeatmap } from './components/GlobalSalaryHeatmap';
import { SiliconNetwork } from './components/SiliconNetwork';
import { SiliconPipeline } from './components/SiliconPipeline';

// UI & Data
import { BadgeUnlockOverlay } from '../../components/BadgeUnlockOverlay';
import { SiliconCabinet } from '../../components/SiliconCabinet';
import { SectionWrapper } from '../../components/SectionWrapper';
import { BADGE_DEFINITIONS } from '../../data/badgeDefinitions';
import { generateBadgeSVG } from '../../utils/BadgeEngine';

// Hooks
import { useAmbientAudio } from '../../hooks/useAmbientAudio';
import { useCompass } from '../../hooks/useCompass';
import { useComparison } from '../../hooks/useComparison';

const CareerRoadmapPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState('hero');
  const [audioStarted, setAudioStarted] = useState(false);
  const { start: startAudio } = useAmbientAudio();
  const { completed: compassCompleted } = useCompass();
  const { comparingIds, clearAll: clearComparison, isBenchOpen, setIsBenchOpen } = useComparison();

  // Mastery & Badge State
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
      { threshold: 0.1, rootMargin: '-10% 0px -10% 0px' }
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

  return (
    <div 
      className="min-h-screen bg-observatory-bg selection:bg-cyan-400 selection:text-black scroll-smooth"
      onClick={handleStartInteraction}
    >
      <ScrollProgress />
      <FloatingCommandBar activeSection={activeSection} />

      {/* High Priority Overlays */}
      <AnimatePresence>
        {!compassCompleted && (
          <SiliconCompass onComplete={() => window.scrollTo({ top: 0, behavior: 'smooth' })} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {comparingIds.length === 2 && (
          <ComparisonBench 
            comparingIds={comparingIds} 
            onClose={clearComparison} 
          />
        )}
      </AnimatePresence>

      <BadgeUnlockOverlay 
        badge={newBadge} 
        onClose={() => setNewBadge(null)} 
      />

      {/* Main Industrial Flow */}
      <main className="relative z-10">
        <HeroSection 
          onCalibrate={() => document.getElementById('domain-explorer')?.scrollIntoView({ behavior: 'smooth' })} 
          onExplore={() => document.getElementById('market-giants')?.scrollIntoView({ behavior: 'smooth' })}
        />
        
        {/* New Hub: Domain Explorer */}
        <DomainExplorer />

        {/* Existing Technical Deep-Dives */}
        <div id="topology" className="relative z-10 border-t border-white/[0.03]">
          <SkillTopology />
        </div>
        
        <SectionWrapper id="skill-gap" className="bg-observatory-bg border-t border-white/[0.03]">
          <div className="max-w-7xl mx-auto py-12 px-6">
            <SkillGapRadar />
          </div>
        </SectionWrapper>

        <div id="fiscal-matrix" className="relative z-10 border-y border-white/[0.03]">
          <FiscalMatrix />
        </div>

        <SectionWrapper id="global-heatmap" className="bg-observatory-bg border-t border-white/[0.03]">
          <div className="max-w-7xl mx-auto py-12 px-6">
            <GlobalSalaryHeatmap />
          </div>
        </SectionWrapper>

        <div id="simulator" className="relative z-10">
          <TrajectorySimulator />
        </div>

        {/* New Logistics: Timeline & Giants */}
        <ExecutionTimeline />
        
        <MarketGiants />

        {/* New Signal: Expert Stories */}
        <ExpertSignal />

        {/* Phase 2: Tactical Execution */}
        <SectionWrapper id="tactical" className="bg-observatory-bg border-t border-white/[0.03]">
          <div className="max-w-7xl mx-auto space-y-12 py-12">
            <div className="mb-12">
              <h2 className="text-4xl font-bold text-white tracking-tight uppercase">Tactical Execution</h2>
              <p className="text-slate-500 font-mono text-xs uppercase tracking-widest mt-2">Generate Artifacts & Simulate Pressure</p>
            </div>
            <ResumePreview />
            <TechnicalTerminal />
          </div>
        </SectionWrapper>

        {/* Phase 4: Network & Flow Intelligence */}
        <SectionWrapper id="network" className="bg-observatory-bg border-t border-white/[0.03]">
          <div className="max-w-7xl mx-auto space-y-12 py-12">
            <div className="mb-12">
              <h2 className="text-4xl font-bold text-white tracking-tight uppercase">Network & Flow</h2>
              <p className="text-slate-500 font-mono text-xs uppercase tracking-widest mt-2">Global Talent Pipeline & Peer Synchronization</p>
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
               <SiliconPipeline />
               <SiliconNetwork />
            </div>
          </div>
        </SectionWrapper>

        {/* Final Station: Silicon Cabinet */}
        <SectionWrapper id="cabinet" className="bg-observatory-bg border-t border-white/[0.03] pb-32">
          <div className="max-w-7xl mx-auto">
            <div className="mb-12">
              <h2 className="text-4xl font-bold text-white tracking-tight uppercase">Silicon Cabinet</h2>
            </div>
            <SiliconCabinet 
              unlockedBadgeIds={unlockedBadgeIds} 
              allBadges={BADGE_DEFINITIONS} 
            />
          </div>
        </SectionWrapper>
      </main>

      {/* Persistent Briefing Overlay */}
      <div className="fixed bottom-0 left-0 w-full z-[100]">
        <SiliconBriefing />
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
