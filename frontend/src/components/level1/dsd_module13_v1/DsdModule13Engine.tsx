import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Route, Moon, Sun, ArrowRight, ArrowLeft } from 'lucide-react';
import { DrawerShell, HamburgerButton } from '../_shared/MobileDrawer';
import { ModuleComplete } from '../../ui/ModuleComplete';
import { MODULE_LABELS } from '../../../lib/moduleHistory';

import { S00_Cover }        from './scenes/S00_Cover';
import { S01_Analogy }      from './scenes/S01_Analogy';
import { S02_Video }        from './scenes/S02_Video';
import { S03_Architecture } from './scenes/S03_Architecture';
import { S04_Walkthrough }  from './scenes/S04_Walkthrough';
import { S05_Timing }       from './scenes/S05_Timing';
import { S06_Practice }     from './scenes/S06_Practice';
import { S07_Recap }        from './scenes/S07_Recap';
import { S08_Circuit }    from './scenes/S08_Circuit';

interface Page {
  id: string;
  part: string;
  label: string;
  subtitle: string;
  Component: React.FC<any>;
}

const PAGES: Page[] = [
  { id: 'cover',        part: 'PART I · THE BRIEF',        label: 'The Serial Adder',     subtitle: 'Cover · trade time for space.',                     Component: S00_Cover },
  { id: 'analogy',      part: 'PART I · THE BRIEF',        label: 'The Highway of Logic', subtitle: 'Eight lanes vs one lane · the toll-booth map.',     Component: S01_Analogy },
  { id: 'video',        part: 'PART I · THE BRIEF',        label: 'Video · Serial Adders', subtitle: 'Watch · the single lane in motion.',               Component: S02_Video },
  { id: 'architecture', part: 'PART II · THE MECHANISM',   label: 'The Datapath',         subtitle: 'One full adder, one flip-flop, a carry loop.',      Component: S03_Architecture },
  { id: 'walkthrough',  part: 'PART II · THE MECHANISM',   label: 'Live Serial Addition', subtitle: 'Step the clock · watch bits add one at a time.',    Component: S04_Walkthrough },
  { id: 'timing',       part: 'PART II · THE MECHANISM',   label: 'Time vs Space',        subtitle: 'N bits = N cycles · parallel vs serial.',           Component: S05_Timing },
  { id: 'circuit',      part: 'PART II · THE MECHANISM',   label: 'The Full Circuit',     subtitle: 'Gate-level schematic, the carry loop wired live.',   Component: S08_Circuit },
  { id: 'practice',     part: 'PART III · THE PAYOFF',     label: 'Practice Arena',       subtitle: 'Ten problems with instant walkthroughs.',           Component: S06_Practice },
  { id: 'recap',        part: 'PART III · THE PAYOFF',     label: 'Recap & Verilog',      subtitle: 'One page · the code, the trade-off, what next.',    Component: S07_Recap },
];

const getPartTheme = (part: string) => {
  // Match longest prefixes first so "III" doesn't get caught by "I ·" etc.
  if (part.startsWith('PART III ')) return { primary: '#a78bfa', secondary: '#c4b5fd', glow: 'rgba(167, 139, 250, 0.12)' };
  if (part.startsWith('PART II '))  return { primary: '#34d399', secondary: '#6ee7b7', glow: 'rgba(52, 211, 153, 0.12)' };
  if (part.startsWith('PART I '))   return { primary: '#38bdf8', secondary: '#7dd3fc', glow: 'rgba(56, 189, 248, 0.12)' };
  return { primary: '#38bdf8', secondary: '#7dd3fc', glow: 'rgba(56, 189, 248, 0.12)' };
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
          <div className="w-10 h-10 rounded-2xl bg-sky-400 flex items-center justify-center text-black">
            <Route size={20} />
          </div>
          <div>
            <h2 className={`text-sm font-black tracking-tight ${textColor}`}>Digital System Design</h2>
            <p className="text-[10px] uppercase font-mono tracking-widest font-bold transition-colors duration-500" style={{ color: theme.primary }}>
              Module 13 · The Serial Adder
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
                    isDone || isActive ? 'text-black' : isDarkMode ? 'bg-transparent border-white/10 opacity-30' : 'bg-transparent border-slate-300 opacity-40'
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

export const DsdModule13Engine: React.FC<{
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
  const [navOpen, setNavOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // Sync URL when chapter changes (without triggering a full remount)
  useEffect(() => {
    const id = PAGES[current]?.id;
    if (id) {
      const target = `/dsd/13/${id}`;
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
      {isDarkMode && (
        <div className="absolute inset-0 pointer-events-none opacity-[0.15] overflow-hidden z-0">
          <motion.div
            animate={{ background: `radial-gradient(circle, ${theme.primary} 0%, transparent 70%)` }}
            className="absolute -top-[10%] -left-[10%] w-[70vw] h-[70vw] rounded-full blur-[120px]"
          />
          <motion.div
            animate={{ background: `radial-gradient(circle, ${theme.secondary} 0%, transparent 70%)` }}
            className="absolute bottom-[0%] -right-[10%] w-[60vw] h-[60vw] rounded-full blur-[100px]"
          />
        </div>
      )}

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
          className="h-16 lg:h-20 border-b flex items-center justify-between px-4 lg:px-12 z-10 gap-3"
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
              <div className="text-[8px] font-mono uppercase tracking-widest opacity-30">DSD MODULE 13</div>
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
          moduleTitle={MODULE_LABELS['dsd/13'] ?? 'this module'}
          accent={theme.primary}
          topics={Array.from(new Set(PAGES.map((p) => p.label)))}
          onPortal={() => navigate('/portal')}
          next={{ label: MODULE_LABELS['dsd/14'] ?? 'Next module', onGo: () => navigate('/dsd/14') }}
        />
      )}
    </div>
  );
};
