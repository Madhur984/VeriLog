import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
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
import { SiliconResume } from './components/SiliconResume';
import { TechnicalTerminal } from './components/TechnicalTerminal';
import { GlobalSalaryHeatmap } from './components/GlobalSalaryHeatmap';
import { SiliconNetwork } from './components/SiliconNetwork';
import { SiliconPipeline } from './components/SiliconPipeline';

// About Components
import { AboutHero } from '../about/components/AboutHero';
import { LogicTraceScope } from '../about/components/LogicTraceScope';
import { TheProblem } from '../about/components/TheProblem';
import { FounderStory } from '../about/components/FounderStory';
import { TeamSection } from '../about/components/TeamSection';
import { TheMission } from '../about/components/TheMission';
import { WhatWeBuilt } from '../about/components/WhatWeBuilt';
import { WhoThisIsFor } from '../about/components/WhoThisIsFor';
import { TheDifference } from '../about/components/TheDifference';
import { AboutCTA } from '../about/components/AboutCTA';

// UI & Data
import { BadgeUnlockOverlay } from '../../components/BadgeUnlockOverlay';
import { SiliconCabinet } from '../../components/SiliconCabinet';
import { BADGE_DEFINITIONS } from '../../data/badgeDefinitions';

// Hooks
import { useAmbientAudio } from '../../hooks/useAmbientAudio';
import { useCompass } from '../../hooks/useCompass';
import { useComparison } from '../../hooks/useComparison';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { motion } from 'framer-motion';

/**
 * Valid tab ids rendered by this page (must match FloatingCommandBar).
 * The alias map lets external links use intent-named params (e.g. ?tab=radar
 * for the skill-gap radar, ?tab=team for the about section) without the page
 * silently falling back to the wrong view.
 */
const TAB_ALIASES: Record<string, string> = {
  about: 'about', team: 'about', story: 'about', mission: 'about',
  explore: 'explore', career: 'explore', roadmap: 'explore', domains: 'explore',
  skills: 'skills', radar: 'skills', gaps: 'skills',
  financials: 'financials', finance: 'financials', salary: 'financials',
  portfolio: 'portfolio', resume: 'portfolio',
};

const resolveTab = (raw: string | null): string =>
  (raw && TAB_ALIASES[raw.toLowerCase()]) || 'explore';

const CareerRoadmapPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(() => resolveTab(searchParams.get('tab')));
  const [audioStarted, setAudioStarted] = useState(false);
  const { start: startAudio } = useAmbientAudio();
  const { completed: compassCompleted } = useCompass();
  const { comparingIds, clearAll: clearComparison } = useComparison();

  // Mastery & Badge State
  const [unlockedBadgeIds] = useState<string[]>(['digital-foundation']);
  const [newBadge, setNewBadge] = useState<{ id: string; name: string; description: string; svgContent: string } | null>(null);

  // Keep the active tab in sync with the URL so deep links (and back/forward)
  // open the right view - e.g. /career-roadmap?tab=about lands on About,
  // bare /career-roadmap lands on Explore.
  useEffect(() => {
    setActiveTab(resolveTab(searchParams.get('tab')));
  }, [searchParams]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.set('tab', tab);
        return next;
      },
      { replace: true },
    );
    window.scrollTo(0, 0);
  };

  useKeyboardShortcuts([
    { key: 'e', action: () => handleTabChange('explore'), description: 'Switch to Explore Tab' },
    { key: 'h', action: () => handleTabChange('explore'), description: 'Switch to Explore Tab' },
    { key: 's', action: () => handleTabChange('skills'), description: 'Switch to Skills Tab' },
    { key: 't', action: () => handleTabChange('skills'), description: 'Switch to Skills Tab' },
    { key: 'f', action: () => handleTabChange('financials'), description: 'Switch to Financials Tab' },
    { key: 'p', action: () => handleTabChange('portfolio'), description: 'Switch to Portfolio Tab' },
    { key: 'c', action: () => handleTabChange('portfolio'), description: 'Switch to Portfolio Tab' },
    { key: 'a', action: () => handleTabChange('about'), description: 'Switch to About Tab' },
  ]);

  const handleStartInteraction = () => {
    if (!audioStarted) {
      startAudio();
      setAudioStarted(true);
    }
  };

  return (
    <div 
      className="min-h-screen bg-observatory-bg selection:bg-signal-core selection:text-bg-void scroll-smooth"
      onClick={handleStartInteraction}
    >
      <ScrollProgress />
      <FloatingCommandBar activeTab={activeTab} onTabChange={handleTabChange} />

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
      <main className="relative z-10 pt-20 sm:pt-28">
        <AnimatePresence mode="wait">
          {activeTab === 'explore' && (
            <motion.div
              key="explore"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              <HeroSection 
                onCalibrate={() => handleTabChange('skills')} 
                onExplore={() => {
                  const el = document.getElementById('domain-explorer');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
              />
              <DomainExplorer />
              <MarketGiants />
              <ExpertSignal />
            </motion.div>
          )}

          {activeTab === 'skills' && (
            <motion.div
              key="skills"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="space-y-12 py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6"
            >
              <div>
                <h1 className="text-2xl sm:text-4xl font-extrabold text-text-main tracking-tighter uppercase mb-6">Skill Topology & Gap Analysis</h1>
                <SkillTopology />
              </div>
              
              <div className="border-t border-border-soft pt-12">
                <SkillGapRadar />
              </div>

              <div className="border-t border-border-soft pt-12">
                <TechnicalTerminal />
              </div>
            </motion.div>
          )}

          {activeTab === 'financials' && (
            <motion.div
              key="financials"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="space-y-12 py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6"
            >
              <div>
                <h1 className="text-2xl sm:text-4xl font-extrabold text-text-main tracking-tighter uppercase mb-6">Financial Yield & Trajectory</h1>
                <FiscalMatrix />
              </div>

              <div className="border-t border-white/[0.03] pt-12">
                <GlobalSalaryHeatmap />
              </div>

              <div className="border-t border-white/[0.03] pt-12">
                <TrajectorySimulator />
              </div>

              <div className="border-t border-white/[0.03] pt-12">
                <ExecutionTimeline />
              </div>
            </motion.div>
          )}

          {activeTab === 'portfolio' && (
            <motion.div
              key="portfolio"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="space-y-12 py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6"
            >
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">
                 <SiliconPipeline />
                 <SiliconNetwork />
              </div>

              <div className="border-t border-white/[0.03] pt-12">
                <SiliconResume />
              </div>

              <div className="border-t border-white/[0.03] pt-12 pb-24">
                <div className="mb-8">
                  <h2 className="text-2xl sm:text-4xl font-bold text-text-main tracking-tight uppercase">Silicon Cabinet</h2>
                </div>
                <SiliconCabinet 
                  unlockedBadgeIds={unlockedBadgeIds} 
                  allBadges={BADGE_DEFINITIONS} 
                />
              </div>
            </motion.div>
          )}

          {activeTab === 'about' && (
            <motion.div
              key="about"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="space-y-0"
            >
              {/* About Background Grids */}
              <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute inset-0 bg-blueprint-grid opacity-[0.03] scale-150" />
                <div className="absolute inset-0 opacity-[0.02] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-400/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-amber-500/5 opacity-40 blur-[120px] rounded-full" />
              </div>

              <div className="relative z-10">
                <AboutHero />
                
                {/* Interactive Hardware Scope Section */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-16 border-t border-border-soft relative">
                  <LogicTraceScope />
                </div>

                <TheProblem />
                <FounderStory />
                <TeamSection />
                <TheMission />
                <WhatWeBuilt />
                <WhoThisIsFor />
                <TheDifference />
                <AboutCTA />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
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
