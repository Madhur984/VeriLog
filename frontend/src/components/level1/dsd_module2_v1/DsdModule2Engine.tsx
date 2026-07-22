import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Moon, Sun, ArrowRight, ArrowLeft } from 'lucide-react';
import { DrawerShell, HamburgerButton } from '../_shared/MobileDrawer';
import { ModuleComplete } from '../../ui/ModuleComplete';
import { MODULE_LABELS } from '../../../lib/moduleHistory';

import { S00_Cover }            from './scenes/S00_Cover';
import { S01_VideoLecture }     from './scenes/S01_VideoLecture';
import { S01b_Facts }           from './scenes/S01b_Facts';
import { S02_TheHeadache }      from './scenes/S02_TheHeadache';
import { S03_HostelMetaphor }   from './scenes/S03_HostelMetaphor';
import { S04_GrayCode }         from './scenes/S04_GrayCode';
import { S05_FloorPlan }        from './scenes/S05_FloorPlan';
import { S06_Wings }            from './scenes/S06_Wings';
import { S07_Corridors }        from './scenes/S07_Corridors';
import { S08_Manifest }         from './scenes/S08_Manifest';
import { S09_Operations }       from './scenes/S09_Operations';
import { S10_FinalBlueprint }   from './scenes/S10_FinalBlueprint';
import { S11_DontCare }         from './scenes/S11_DontCare';
import { S12_Masterclass }      from './scenes/S12_Masterclass';
import { S13_PracticeArena }    from './scenes/S13_PracticeArena';

interface Page {
  id: string;
  part: string;
  label: string;
  subtitle: string;
  Component: React.FC<any>;
}

const PAGES: Page[] = [
  { id: 'cover',      part: 'PART I · OVERTURE',         label: 'The Architect of Logic',       subtitle: 'Cover · meet Madhur, the Hostel Warden.',           Component: S00_Cover },
  { id: 'video',      part: 'PART I · OVERTURE',         label: 'The Logic Labyrinth',          subtitle: 'Bilingual lecture · English / हिंदी + transcripts.', Component: S01_VideoLecture },
  { id: 'facts',      part: 'PART I · OVERTURE',         label: 'The Facts First',              subtitle: 'Plain-English basics · what a K-map does + an example.', Component: S01b_Facts },
  { id: 'headache',   part: 'PART II · THE PROBLEM',     label: 'The 16-Row Headache',          subtitle: 'Why algebra alone is brittle for 4 variables.',     Component: S02_TheHeadache },
  { id: 'hostel',     part: 'PART II · THE PROBLEM',     label: 'Madhur’s Hostel Metaphor', subtitle: 'The Logic Translator · five core mappings.',        Component: S03_HostelMetaphor },
  { id: 'gray',       part: 'PART III · THE GRID',       label: 'Rule 1 · Gray Code Walls',     subtitle: 'One bit-flip = one shared wall.',                   Component: S04_GrayCode },
  { id: 'floor',      part: 'PART III · THE GRID',       label: 'The Master Floor Plan',        subtitle: '4×4 minterm grid · the canvas.',               Component: S05_FloorPlan },
  { id: 'wings',      part: 'PART IV · THE WINGS',       label: 'Rule 2 · Powers of Two',       subtitle: 'HVAC constraint · 1, 2, 4, 8, 16.',                 Component: S06_Wings },
  { id: 'corridors',  part: 'PART IV · THE WINGS',       label: 'Rule 3 · Secret Corridors',    subtitle: 'The cylinder + the torus · wrap-around magic.',     Component: S07_Corridors },
  { id: 'manifest',   part: 'PART V · THE SYNTHESIS',    label: 'Today’s Manifest',        subtitle: 'Y = Σm(0,1,2,6,8,10,13,14).',                  Component: S08_Manifest },
  { id: 'operations', part: 'PART V · THE SYNTHESIS',    label: 'Four Operations',              subtitle: 'Corner Suite · Vertical · Pair · VIP.', Component: S09_Operations },
  { id: 'final',      part: 'PART V · THE SYNTHESIS',    label: 'The Final Blueprint',          subtitle: 'Y = B′D′ + CD′ + A′B′C′ + ABC′D.', Component: S10_FinalBlueprint },
  { id: 'dontcare',   part: 'PART VI · ADVANCED',        label: 'The Don’t Care Loophole', subtitle: 'X = room under maintenance · absorb when useful.', Component: S11_DontCare },
  { id: 'master',     part: 'PART VI · ADVANCED',        label: 'Madhur’s Masterclass',    subtitle: 'Three core principles · your toolkit.',         Component: S12_Masterclass },
  { id: 'practice',   part: 'PART VII · ASSESSMENT',     label: 'Practice Arena',               subtitle: 'Activities, quizzes & boss-level drills.',          Component: S13_PracticeArena },
];

const getPartTheme = (part: string) => {
  if (part.startsWith('PART VII '))  return { primary: '#f43f5e', secondary: '#fb7185', glow: 'rgba(244, 63, 94, 0.12)' };
  if (part.startsWith('PART VI '))   return { primary: '#a78bfa', secondary: '#c4b5fd', glow: 'rgba(167, 139, 250, 0.12)' };
  if (part.startsWith('PART V '))    return { primary: '#22d3ee', secondary: '#67e8f9', glow: 'rgba(34, 211, 238, 0.12)' };
  if (part.startsWith('PART IV '))   return { primary: '#10b981', secondary: '#34d399', glow: 'rgba(16, 185, 129, 0.12)' };
  if (part.startsWith('PART III '))  return { primary: '#f59e0b', secondary: '#fbbf24', glow: 'rgba(245, 158, 11, 0.12)' };
  if (part.startsWith('PART II '))   return { primary: '#fb923c', secondary: '#fdba74', glow: 'rgba(251, 146, 60, 0.12)' };
  if (part.startsWith('PART I '))    return { primary: '#fcd34d', secondary: '#fde68a', glow: 'rgba(252, 211, 77, 0.14)' };
  return { primary: '#fcd34d', secondary: '#fde68a', glow: 'rgba(252, 211, 77, 0.14)' };
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
          <div className="w-10 h-10 rounded-2xl bg-amber-400 flex items-center justify-center text-black">
            <Activity size={20} />
          </div>
          <div>
            <h2 className={`text-sm font-black tracking-tight ${textColor}`}>Digital System Design</h2>
            <p className="text-[10px] uppercase font-mono tracking-widest font-bold transition-colors duration-500" style={{ color: theme.primary }}>
              Module 02 · K-Maps
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
                    isDone || isActive ? 'text-black' : `bg-transparent ${isDarkMode ? 'border-white/10' : 'border-slate-300'} opacity-30`
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
          <div className={`h-1 w-full ${isDarkMode ? 'bg-slate-900' : 'bg-slate-200'} rounded-full overflow-hidden`}>
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

export const DsdModule2Engine: React.FC<{
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

  useEffect(() => {
    const id = PAGES[current]?.id;
    if (id) {
      const target = `/dsd/2/${id}`;
      if (window.location.pathname !== target) {
        navigate(target, { replace: true });
      }
    }
  }, [current, navigate]);

  useEffect(() => {
    if (initialChapter) {
      const idx = PAGES.findIndex(p => p.id === initialChapter);
      if (idx >= 0 && idx !== current) setCurrent(idx);
    } else {
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
          moduleTitle={MODULE_LABELS['dsd/2'] ?? 'this module'}
          accent={theme.primary}
          topics={Array.from(new Set(PAGES.map((p) => p.label)))}
          onPortal={() => navigate('/portal')}
          next={{ label: MODULE_LABELS['dsd/3'] ?? 'Next module', onGo: () => navigate('/dsd/3') }}
        />
      )}
    </div>
  );
};
