import React, { useEffect, useState, useMemo, useCallback, lazy, Suspense } from 'react';
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

// New Integrated Components
import { SiliconCompass } from '../../components/SiliconCompass';
import { DomainExplorer } from '../../components/DomainExplorer';
import { MarketGiants } from '../../components/MarketGiants';
import { ExecutionTimeline } from '../../components/ExecutionTimeline';
import { ExpertSignal } from '../../components/ExpertSignal';
import { ComparisonBench } from '../../components/ComparisonBench';

// Phase 1 & 2 Components
import { SiliconNetwork } from './components/SiliconNetwork';
import { SiliconPipeline } from './components/SiliconPipeline';

// Lazy Loaded Heavy Content (optimizes initial page load)
const SkillGapRadar = lazy(() => import('./components/SkillGapRadar').then(m => ({ default: m.SkillGapRadar })));
const SiliconResume = lazy(() => import('./components/SiliconResume').then(m => ({ default: m.SiliconResume })));
const TechnicalTerminal = lazy(() => import('./components/TechnicalTerminal').then(m => ({ default: m.TechnicalTerminal })));
const GlobalSalaryHeatmap = lazy(() => import('./components/GlobalSalaryHeatmap').then(m => ({ default: m.GlobalSalaryHeatmap })));
const TrajectorySimulator = lazy(() => import('./sections/TrajectorySimulator').then(m => ({ default: m.TrajectorySimulator })));

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
import { useCareerState } from './hooks/useCareerState';
import { motion } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';
import { sfx } from './utils/sfx';

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
  const { comparingIds, toggleDomain, clearAll: clearComparison } = useComparison();

  // Shared active target company preset between SkillTopology and SkillGapRadar
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);

  // Career State — persistent across sessions
  const careerState = useCareerState();

  const [sfxMuted, setSfxMuted] = useState(!sfx.isEnabled());

  const toggleSfx = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newMuted = !sfxMuted;
    setSfxMuted(newMuted);
    sfx.setEnabled(!newMuted);
    sfx.playClick();
  };

  // Dynamic badge unlocking: check mastered nodes against badge definitions
  const unlockedBadgeIds = useMemo(() => {
    const ids: string[] = [];
    const masteredSet = new Set(careerState.unlockedNodes);
    
    BADGE_DEFINITIONS.forEach(badge => {
      if (badge.trigger === 'complete_subtree' && badge.subtreeIds) {
        if (badge.subtreeIds.every(id => masteredSet.has(id))) {
          ids.push(badge.id);
        }
      } else if (badge.trigger === 'complete_mastery_quiz' && badge.domain) {
        const score = careerState.quizScores[badge.domain] || 0;
        if (score >= (badge.score || 0)) {
          ids.push(badge.id);
        }
      } else if (badge.trigger === 'use_feature' && badge.feature) {
        // Unlock fiscal-navigator when user visits financials tab
        if (badge.feature === 'fiscal_matrix' && activeTab === 'financials') {
          ids.push(badge.id);
        }
      }
    });
    return ids;
  }, [careerState.unlockedNodes, careerState.quizScores, activeTab]);

  // Track newly unlocked badges
  const [prevBadgeCount, setPrevBadgeCount] = useState(0);
  const [newBadge, setNewBadge] = useState<{ id: string; name: string; description: string; svgContent: string } | null>(null);

  useEffect(() => {
    if (unlockedBadgeIds.length > prevBadgeCount && prevBadgeCount > 0) {
      const latestId = unlockedBadgeIds[unlockedBadgeIds.length - 1];
      const badge = BADGE_DEFINITIONS.find(b => b.id === latestId);
      if (badge) {
        setNewBadge({ id: badge.id, name: badge.name, description: badge.description, svgContent: '' });
      }
    }
    setPrevBadgeCount(unlockedBadgeIds.length);
  }, [unlockedBadgeIds]);

  // Calculate overall progress percentage across all tabs
  const overallProgress = useMemo(() => {
    const nodeProgress = Math.min(100, (careerState.unlockedNodes.length / 20) * 100);
    const quizProgress = Math.min(100, (Object.keys(careerState.quizScores).length / 5) * 100);
    const simProgress = Math.min(100, (careerState.simulationHistory.length / 3) * 100);
    const badgeProgress = Math.min(100, (unlockedBadgeIds.length / BADGE_DEFINITIONS.length) * 100);
    return Math.round((nodeProgress + quizProgress + simProgress + badgeProgress) / 4);
  }, [careerState.unlockedNodes, careerState.quizScores, careerState.simulationHistory, unlockedBadgeIds]);

  // Keep the active tab in sync with the URL so deep links (and back/forward)
  // open the right view - e.g. /career-roadmap?tab=about lands on About,
  // bare /career-roadmap lands on Explore.
  useEffect(() => {
    setActiveTab(resolveTab(searchParams.get('tab')));
  }, [searchParams]);

  const handleTabChange = (tab: string) => {
    sfx.playClick();
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

  const handleOpenInTopology = useCallback((domainId: string) => {
    const DOMAIN_TO_COMPANY: Record<string, string> = {
      vlsi: 'nvidia',
      embedded: 'qualcomm',
      wireless: 'qualcomm',
      analog: 'texas-instruments',
      power: 'isro',
      'semi-mfg': 'samsung-semi',
      'comp-arch': 'intel',
      automotive: 'texas-instruments',
      quantum: 'intel',
      eda: 'nvidia',
    };
    const mappedCompany = DOMAIN_TO_COMPANY[domainId] || 'nvidia';
    setSelectedCompany(mappedCompany);
    handleTabChange('skills');
  }, []);

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

      {/* Persistent Progress Indicator */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed top-4 sm:top-10 right-4 sm:right-8 z-[301] flex items-center gap-3 px-3.5 py-1.5 bg-bg-elev border-2 border-edge shadow-brutal-sm rounded-full"
      >
        <button
          onClick={toggleSfx}
          className="p-1 text-text-dim hover:text-text-main transition-colors duration-200"
          title={sfxMuted ? "Unmute Sound Effects" : "Mute Sound Effects"}
        >
          {sfxMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
        </button>
        <div className="h-4 w-px bg-border-soft" />
        <svg width="20" height="20" viewBox="0 0 36 36" className="-rotate-90">
          <circle cx="18" cy="18" r="15" fill="none" stroke="currentColor" className="text-border-soft" strokeWidth="3" />
          <motion.circle 
            cx="18" cy="18" r="15" fill="none" 
            stroke="currentColor" 
            className="text-signal-core" 
            strokeWidth="3" 
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 15}`}
            strokeDashoffset={`${2 * Math.PI * 15 * (1 - overallProgress / 100)}`}
            initial={{ strokeDashoffset: 2 * Math.PI * 15 }}
            animate={{ strokeDashoffset: 2 * Math.PI * 15 * (1 - overallProgress / 100) }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </svg>
        <span className="text-[10px] font-mono text-text-dim tracking-widest">{overallProgress}%</span>
      </motion.div>

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
              <DomainExplorer 
                comparingIds={comparingIds}
                onToggleCompare={toggleDomain}
                onClearCompare={clearComparison}
                onOpenInTopology={handleOpenInTopology}
              />
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
                <SkillTopology 
                  selectedCompany={selectedCompany}
                  setSelectedCompany={setSelectedCompany}
                  unlockedNodes={careerState.unlockedNodes}
                  onUnlockNode={careerState.unlockNode}
                />
              </div>
              
              <div className="border-t border-border-soft pt-12">
                <Suspense fallback={<div className="h-40 animate-pulse bg-observatory-surface/20 rounded-xl" />}>
                  <SkillGapRadar 
                    activeCompany={selectedCompany || 'nvidia'}
                    setActiveCompany={setSelectedCompany}
                    masteredNodes={careerState.unlockedNodes}
                  />
                </Suspense>
              </div>

              <div className="border-t border-border-soft pt-12">
                <Suspense fallback={<div className="h-40 animate-pulse bg-observatory-surface/20 rounded-xl" />}>
                  <TechnicalTerminal onUpdateQuizScore={careerState.updateQuizScore} />
                </Suspense>
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

              <div className="border-t border-border-soft pt-12">
                <Suspense fallback={<div className="h-[500px] animate-pulse bg-observatory-surface/20 rounded-xl" />}>
                  <GlobalSalaryHeatmap />
                </Suspense>
              </div>

              <div className="border-t border-border-soft pt-12">
                <Suspense fallback={<div className="h-[400px] animate-pulse bg-observatory-surface/20 rounded-xl" />}>
                  <TrajectorySimulator onRecordSimulation={careerState.recordSimulation} />
                </Suspense>
              </div>

              <div className="border-t border-border-soft pt-12">
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

              <div className="border-t border-border-soft pt-12">
                <Suspense fallback={<div className="h-40 animate-pulse bg-observatory-surface/20 rounded-xl" />}>
                  <SiliconResume 
                    unlockedBadgeIds={unlockedBadgeIds}
                    masteredNodes={careerState.unlockedNodes}
                  />
                </Suspense>
              </div>

              <div className="border-t border-border-soft pt-12 pb-24">
                <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <h2 className="text-2xl sm:text-4xl font-bold text-text-main tracking-tight uppercase">Silicon Cabinet</h2>
                  <button
                    onClick={() => {
                      const profile = {
                        exportDate: new Date().toISOString(),
                        unlockedNodes: careerState.unlockedNodes,
                        quizScores: careerState.quizScores,
                        simulationHistory: careerState.simulationHistory,
                        calibrationStreak: careerState.dailyCalibration.streak,
                        calibrationPoints: careerState.dailyCalibration.points,
                        unlockedBadges: unlockedBadgeIds,
                        overallProgress,
                      };
                      const blob = new Blob([JSON.stringify(profile, null, 2)], { type: 'application/json' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `career_profile_${new Date().toISOString().split('T')[0]}.json`;
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                    className="px-5 py-2.5 bg-observatory-surface border border-signal-core/30 rounded-full text-[10px] font-mono font-bold uppercase tracking-widest text-signal-core hover:bg-signal-core hover:text-bg-void transition-all flex items-center gap-2 self-start"
                  >
                    ↓ Export Career Profile
                  </button>
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
