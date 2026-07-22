import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Moon, Sun, ArrowRight, ArrowLeft } from 'lucide-react';
import { DrawerShell, HamburgerButton } from '../_shared/MobileDrawer';
import { ModuleComplete } from '../../ui/ModuleComplete';
import { MODULE_LABELS } from '../../../lib/moduleHistory';

import { S00_Cover }         from './scenes/S00_Cover';
import { S01_VideoLecture }  from './scenes/S01_VideoLecture';
import { S01b_Facts }        from './scenes/S01b_Facts';
import { S02_PicnicPhysics } from './scenes/S02_PicnicPhysics';
import { S03_Multiverse }    from './scenes/S03_Multiverse';
import { S04_PathOfJoy }     from './scenes/S04_PathOfJoy';
import { S05_BuildSOP }      from './scenes/S05_BuildSOP';
import { S06_PathOfCaution } from './scenes/S06_PathOfCaution';
import { S07_BuildPOS }      from './scenes/S07_BuildPOS';
import { S07b_GateCircuits } from './scenes/S07b_GateCircuits';
import { S08_TwoLenses }     from './scenes/S08_TwoLenses';
import { S09_LiveLab }       from './scenes/S09_LiveLab';
import { S09b_KMapPreview }  from './scenes/S09b_KMapPreview';
import { S11_PracticeArena } from './scenes/S11_PracticeArena';
import { S10_Conclusion }    from './scenes/S10_Conclusion';

interface Page {
  id: string;
  part: string;
  label: string;
  subtitle: string;
  Component: React.FC<any>;
}

const PAGES: Page[] = [
  { id: 'cover',    part: 'PART I · INTRODUCTION',         label: 'The Architecture of a Decision', subtitle: 'Cover · meet the optimist & pessimist.',          Component: S00_Cover },
  { id: 'video',    part: 'PART I · INTRODUCTION',         label: "Ben's Boolean Picnic",            subtitle: 'Illustrated lecture · video + transcript.',       Component: S01_VideoLecture },
  { id: 'facts',    part: 'PART I · INTRODUCTION',         label: 'The Facts First',                 subtitle: 'Plain-English basics · SOP, POS & a worked example.', Component: S01b_Facts },
  { id: 'physics',  part: 'PART II · THE STORY',       label: 'Physics of a Perfect Picnic',     subtitle: 'Three variables · the rule of the day.',          Component: S02_PicnicPhysics },
  { id: 'multi',    part: 'PART II · THE STORY',       label: 'The 8-Day Multiverse',            subtitle: 'Truth table · all eight parallel mornings.',      Component: S03_Multiverse },
  { id: 'minterm',  part: 'PART III · OPTIMIST · SOP', label: 'Path of Joy · Minterm Anatomy',   subtitle: 'Snapshot one happy universe at a time.',          Component: S04_PathOfJoy },
  { id: 'sop',      part: 'PART III · OPTIMIST · SOP', label: 'Build the Canonical SOP',         subtitle: 'OR every minterm into the basket.',               Component: S05_BuildSOP },
  { id: 'maxterm',  part: 'PART IV · PESSIMIST · POS', label: 'Path of Caution · Maxterm',       subtitle: 'Barricade one disaster at a time.',               Component: S06_PathOfCaution },
  { id: 'pos',      part: 'PART IV · PESSIMIST · POS', label: 'Build the Canonical POS',         subtitle: 'AND every maxterm into the wall.',                Component: S07_BuildPOS },
  { id: 'circuits', part: 'PART V · HARDWARE',         label: 'From Algebra to Silicon',         subtitle: 'Live gate-level circuit diagrams · SOP & POS.',   Component: S07b_GateCircuits },
  { id: 'lenses',   part: 'PART V · HARDWARE',         label: 'Two Lenses, One Truth',           subtitle: 'Blueprint matrix · DeMorgan walkthrough.',        Component: S08_TwoLenses },
  { id: 'lab',      part: 'PART VI · LIVE LAB',        label: 'Design Your Own Function',        subtitle: 'Interactive 3-variable canonical builder.',       Component: S09_LiveLab },
  { id: 'kmap',     part: 'PART VI · LIVE LAB',        label: 'K-Map Sneak Peek',                subtitle: 'Truth table → 2×4 grid · adjacency = simplification.', Component: S09b_KMapPreview },
  { id: 'practice', part: 'PART VII · ASSESSMENT',     label: 'Practice Arena · Boss Drill',     subtitle: '7-question multi-topic challenge with walkthroughs.', Component: S11_PracticeArena },
  { id: 'finish',   part: 'PART VII · ASSESSMENT',     label: 'Architecture of Logic · Quiz',    subtitle: 'Knowledge gate + recap + next steps.',            Component: S10_Conclusion },
];

const getPartTheme = (part: string) => {
  // Match longest prefixes first so "VII" doesn't get caught by "VI ·" etc.
  if (part.startsWith('PART VII '))  return { primary: '#f59e0b', secondary: '#fbbf24', glow: 'rgba(245, 158, 11, 0.12)' };
  if (part.startsWith('PART VI '))   return { primary: '#22d3ee', secondary: '#67e8f9', glow: 'rgba(34, 211, 238, 0.12)' };
  if (part.startsWith('PART V '))    return { primary: '#e879f9', secondary: '#f0abfc', glow: 'rgba(232, 121, 249, 0.12)' };
  if (part.startsWith('PART IV '))   return { primary: '#f43f5e', secondary: '#fb7185', glow: 'rgba(244, 63, 94, 0.12)' };
  if (part.startsWith('PART III '))  return { primary: '#10b981', secondary: '#34d399', glow: 'rgba(16, 185, 129, 0.12)' };
  if (part.startsWith('PART II '))   return { primary: '#a78bfa', secondary: '#c4b5fd', glow: 'rgba(167, 139, 250, 0.12)' };
  if (part.startsWith('PART I '))    return { primary: '#06b6d4', secondary: '#22d3ee', glow: 'rgba(6, 182, 212, 0.12)' };
  return { primary: '#f59e0b', secondary: '#fbbf24', glow: 'rgba(245, 158, 11, 0.12)' };
};

const Sidebar: React.FC<{
  current: number;
  isDarkMode: boolean;
  onChange: (i: number) => void;
  toggleTheme: () => void;
  theme: { primary: string; secondary: string; glow: string };
}> = ({ current, isDarkMode, onChange, toggleTheme, theme }) => {
  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const borderColor = 'var(--border-soft)';
  const progress = ((current + 1) / PAGES.length) * 100;

  return (
    <div
      className={`w-[320px] h-full flex-shrink-0 border-r-2 flex flex-col z-20 transition-all duration-700 relative ${
        isDarkMode ? 'bg-[#040200]' : 'bg-slate-50'
      }`}
      style={{ borderColor }}
    >
      <header className="p-10 border-b" style={{ borderColor }}>
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500 flex items-center justify-center text-black">
            <Activity size={20} />
          </div>
          <div>
            <h2 className={`text-sm font-black tracking-tight ${textColor}`}>Digital System Design</h2>
            <p className="text-[10px] uppercase font-mono tracking-widest font-bold transition-colors duration-500" style={{ color: theme.primary }}>
              Module 01 · Boolean Forms
            </p>
          </div>
        </div>
      </header>

      <nav className="p-8 flex-1 overflow-y-auto space-y-1">
        {PAGES.map((page, idx) => {
          const isActive = current === idx;
          const isDone = idx < current;

          return (
            <React.Fragment key={page.id}>
              <button
                onClick={() => onChange(idx)}
                className={`group relative w-full text-left p-4 rounded-2xl transition-all duration-500 flex items-start gap-4 ${
                  isActive
                    ? isDarkMode ? 'border' : 'bg-white border-slate-200 shadow-brutal-sm'
                    : 'hover:bg-black/5 hover:translate-x-1'
                }`}
                style={{
                  backgroundColor: isActive && isDarkMode ? theme.glow : undefined,
                  borderColor: isActive && isDarkMode ? `${theme.primary}33` : 'transparent',
                }}
              >
                <div
                  className={`mt-0.5 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black border transition-all duration-500 ${
                    isDone || isActive ? 'text-black' : `bg-transparent opacity-30 ${isDarkMode ? 'border-white/10' : 'border-slate-300'}`
                  }`}
                  style={{
                    backgroundColor: isDone || isActive ? theme.primary : 'transparent',
                    borderColor: isDone || isActive ? theme.primary : undefined,
                  }}
                >
                  {isDone ? '✓' : idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <h3
                    className={`text-[13px] font-bold truncate transition-colors duration-500 ${
                      isActive ? '' : isDarkMode ? 'text-slate-400' : 'text-slate-600'
                    }`}
                    style={{ color: isActive ? theme.primary : undefined }}
                  >
                    {page.label}
                  </h3>
                  <p className="text-[9px] mt-0.5 opacity-40 font-medium truncate">{page.subtitle}</p>
                </div>
              </button>
            </React.Fragment>
          );
        })}
      </nav>

      <footer className="p-10 border-t space-y-6" style={{ borderColor }}>
        <div className="space-y-4">
          <div className="flex justify-between items-end">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] opacity-40">Progress</span>
            <span className="text-sm font-black transition-colors duration-500" style={{ color: theme.primary }}>
              {Math.round(progress)}%
            </span>
          </div>
          <div className={`h-1 w-full rounded-full overflow-hidden ${isDarkMode ? 'bg-slate-900' : 'bg-slate-200'}`}>
            <motion.div
              animate={{ width: `${progress}%`, backgroundColor: theme.primary }}
              className="h-full"
              style={{ boxShadow: `0 0 10px ${theme.primary}` }}
            />
          </div>
        </div>

        <button
          onClick={toggleTheme}
          className={`h-12 w-full rounded-2xl border-2 border-edge shadow-brutal-sm flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest transition-all ${
            isDarkMode ? 'border-white/10 text-slate-400 hover:bg-white/5' : 'border-slate-200 text-slate-600 hover:bg-slate-100'
          }`}
        >
          {isDarkMode ? <Sun size={14} /> : <Moon size={14} />}
          {isDarkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
      </footer>
    </div>
  );
};

export const DsdModule1Engine: React.FC<{
  isDarkMode: boolean;
  onThemeToggle: () => void;
  initialChapter?: string;
}> = ({ isDarkMode, onThemeToggle, initialChapter }) => {
  const navigate = useNavigate();

  const findInitial = useCallback(() => {
    if (!initialChapter) return 0;
    const idx = PAGES.findIndex(p => p.id === initialChapter);
    return idx >= 0 ? idx : 0;
  }, [initialChapter]);

  const [current, setCurrent] = useState(findInitial);
  const [done, setDone] = useState(false);
  const [navOpen, setNavOpen] = useState(() => window.matchMedia('(min-width: 1024px)').matches);
  const contentRef = useRef<HTMLDivElement>(null);

  // Sync URL when chapter changes (without triggering a full remount)
  useEffect(() => {
    const id = PAGES[current]?.id;
    if (id) {
      const target = `/dsd/1/${id}`;
      if (window.location.pathname !== target) {
        navigate(target, { replace: true });
      }
    }
  }, [current, navigate]);

  // Respond to external URL changes (browser back/forward, tree clicks)
  useEffect(() => {
    if (initialChapter) {
      const idx = PAGES.findIndex(p => p.id === initialChapter);
      if (idx >= 0 && idx !== current) setCurrent(idx);
    } else {
      // No chapter param → user explicitly wants /dsd/1, start from cover
      if (current !== 0) setCurrent(0);
    }
  }, [initialChapter]); // eslint-disable-line react-hooks/exhaustive-deps

  const go = useCallback((dir: number) => {
    setCurrent(c => Math.max(0, Math.min(PAGES.length - 1, c + dir)));
  }, []);

  useEffect(() => {
    contentRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }, [current]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const tag = (document.activeElement?.tagName || '').toUpperCase();
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'VIDEO') return;
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [go]);

  const page = PAGES[current];
  const theme = getPartTheme(page.part);
  const { Component } = page;

  return (
    <div className={`flex h-screen overflow-hidden transition-colors duration-700 relative ${isDarkMode ? 'bg-[#020100]' : 'bg-white'}`}>
      <DrawerShell open={navOpen} onClose={() => setNavOpen(false)}>
        <Sidebar
          current={current}
          isDarkMode={isDarkMode}
          onChange={(i) => { setCurrent(i); setNavOpen(false); }}
          toggleTheme={onThemeToggle}
          theme={theme}
        />
      </DrawerShell>

      <div className="flex-1 flex flex-col h-full overflow-hidden relative z-10">
        <header
          className="h-16 lg:h-20 border-b flex items-center justify-between pl-4 pr-16 lg:px-12 z-10 gap-3"
          style={{ borderColor: 'var(--border-soft)' }}
        >
          <div className="flex items-center gap-3 min-w-0">
            <HamburgerButton isDarkMode={isDarkMode} onClick={() => setNavOpen(o => !o)} />
            <div className="flex flex-col min-w-0">
              <h2 className="text-base lg:text-xl font-bold tracking-tight truncate">{page.label}</h2>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <div className="text-right">
              <div className="text-[10px] font-mono mt-0.5">{page.subtitle}</div>
            </div>
            <div className="text-sm font-mono opacity-20">{current + 1} / {PAGES.length}</div>
          </div>
        </header>

        <div ref={contentRef} className="flex-1 overflow-y-auto scroll-smooth">
          <AnimatePresence mode="wait">
            <motion.div
              key={page.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-7xl mx-auto px-4 py-10 lg:px-12 lg:py-24"
            >
              <Component isActive={true} isDarkMode={isDarkMode} />
            </motion.div>
          </AnimatePresence>
        </div>

        <footer
          className="h-20 lg:h-24 border-t flex items-center justify-between px-4 lg:px-12 z-10 gap-3"
          style={{ borderColor: 'var(--border-soft)' }}
        >
          <button
            onClick={() => { if (current === 0) { navigate('/portal'); } else { go(-1); } }}
            className="flex items-center gap-2 px-4 lg:px-8 py-3 rounded-2xl font-bold transition-all hover:bg-black/5 active:scale-95"
          >
            <ArrowLeft size={18} /> Back
          </button>

          <div className="hidden sm:block text-center">
            <span className="text-[10px] font-mono uppercase tracking-widest opacity-30 block mb-1">Up Next</span>
            <span className="text-sm font-bold opacity-70">
              {current < PAGES.length - 1 ? PAGES[current + 1].label : 'Module Complete'}
            </span>
          </div>

          <button
            onClick={() => { if (current === PAGES.length - 1) { setDone(true); } else { go(1); } }}
            className="flex items-center gap-3 px-5 lg:px-10 py-3 rounded-2xl font-black text-black transition-all duration-500 active:scale-95 shadow-xl"
            style={{
              backgroundColor: theme.primary,
              boxShadow: `0 10px 30px ${theme.primary}33`,
            }}
          >
            {current === PAGES.length - 1 ? 'Complete' : 'Next Step'} <ArrowRight size={18} />
          </button>
        </footer>
      </div>

      {done && (
        <ModuleComplete
          isDark={isDarkMode}
          moduleTitle={MODULE_LABELS['dsd/1'] ?? 'this module'}
          accent={theme.primary}
          topics={Array.from(new Set(PAGES.map((p) => p.label)))}
          onPortal={() => navigate('/portal')}
          next={{ label: MODULE_LABELS['dsd/2'] ?? 'Next module', onGo: () => navigate('/dsd/2') }}
        />
      )}
    </div>
  );
};
