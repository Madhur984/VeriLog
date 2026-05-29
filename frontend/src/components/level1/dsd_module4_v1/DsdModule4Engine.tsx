import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Moon, Sun, ArrowRight, ArrowLeft } from 'lucide-react';
import { DrawerShell, HamburgerButton } from '../_shared/MobileDrawer';

import { S00_Cover }      from './scenes/S00_Cover';
import { S01_Forward }    from './scenes/S01_Forward';
import { S02_Reverse }    from './scenes/S02_Reverse';
import { S03_Optimise }   from './scenes/S03_Optimise';
import { S04_Boss }       from './scenes/S04_Boss';
import { S05_Cheatsheet } from './scenes/S05_Cheatsheet';

interface Page {
  id: string;
  step: string;
  label: string;
  subtitle: string;
  Component: React.FC<any>;
}

// Drill arena · 6 chapters · zero teaching, all practice
const PAGES: Page[] = [
  { id: 'arena',     step: 'Open',         label: 'Practice Arena',           subtitle: '5 drill sets · 12 problems · zero lectures.',          Component: S00_Cover },
  { id: 'forward',   step: 'Drill 01',     label: 'Forward Synthesis',        subtitle: '4 scenarios · spec → minimised circuit.',              Component: S01_Forward },
  { id: 'reverse',   step: 'Drill 02',     label: 'Reverse Engineering',      subtitle: '3 schematics · circuit → equation.',                   Component: S02_Reverse },
  { id: 'optimise',  step: 'Drill 03',     label: 'K-Map Optimisation',       subtitle: '3 minimisation drills · with don\'t-cares.',           Component: S03_Optimise },
  { id: 'boss',      step: 'Drill 04',     label: 'Boss Round',               subtitle: '2 heavyweight problems · BCD decoder + 4-var.',        Component: S04_Boss },
  { id: 'cheatsheet',step: 'Reference',    label: 'Cheatsheet',               subtitle: 'Gate symbols · K-Map rules · pipeline · one page.',    Component: S05_Cheatsheet },
];

const ACCENTS = ['#fb7185', '#fbbf24', '#22d3ee', '#a78bfa', '#f43f5e', '#22c55e'];

const themeFor = (idx: number) => {
  const c = ACCENTS[idx] ?? '#fb7185';
  return { primary: c, secondary: c, glow: `${c}22` };
};

const Sidebar: React.FC<{
  current: number;
  isDarkMode: boolean;
  onChange: (i: number) => void;
  toggleTheme: () => void;
}> = ({ current, isDarkMode, onChange, toggleTheme }) => {
  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const borderColor = isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';
  const progress = ((current + 1) / PAGES.length) * 100;
  const theme = themeFor(current);

  return (
    <div
      className={`w-[320px] h-full flex-shrink-0 border-r flex flex-col z-20 transition-all duration-700 relative ${
        isDarkMode ? 'bg-[#020611]/60 backdrop-blur-md' : 'bg-slate-50/40 backdrop-blur-md'
      }`}
      style={{ borderColor }}
    >
      <header className="p-10 border-b" style={{ borderColor }}>
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-2xl bg-rose-400 flex items-center justify-center text-black">
            <Target size={20} />
          </div>
          <div>
            <h2 className={`text-sm font-black tracking-tight ${textColor}`}>Digital System Design</h2>
            <p className="text-[10px] uppercase font-mono tracking-widest font-bold transition-colors duration-500" style={{ color: theme.primary }}>
              Module 04 · Practice Arena
            </p>
          </div>
        </div>
      </header>

      <nav className="p-6 flex-1 overflow-y-auto space-y-1">
        {PAGES.map((page, idx) => {
          const isActive = current === idx;
          const isDone = idx < current;
          const accent = ACCENTS[idx] ?? '#fb7185';
          return (
            <button
              key={page.id}
              onClick={() => onChange(idx)}
              className={`group relative w-full text-left p-4 rounded-2xl transition-all duration-500 flex items-start gap-4 ${
                isActive
                  ? isDarkMode ? 'border' : 'bg-white border-slate-200 shadow-lg'
                  : 'hover:bg-black/5 hover:translate-x-1'
              }`}
              style={{
                backgroundColor: isActive && isDarkMode ? `${accent}18` : undefined,
                borderColor: isActive && isDarkMode ? `${accent}55` : 'transparent',
              }}
            >
              <div
                className={`mt-0.5 w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black border transition-all duration-500 ${
                  isDone || isActive ? 'text-black' : 'bg-transparent border-white/10 opacity-30'
                }`}
                style={{
                  backgroundColor: isDone || isActive ? accent : 'transparent',
                  borderColor: isDone || isActive ? accent : undefined,
                }}
              >
                {isDone ? '✓' : idx + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[9px] font-mono uppercase tracking-widest opacity-60" style={{ color: isActive ? accent : undefined }}>
                    {page.step}
                  </span>
                </div>
                <h3
                  className={`text-[13px] font-bold truncate transition-colors duration-500 ${
                    isActive ? '' : isDarkMode ? 'text-slate-300' : 'text-slate-700'
                  }`}
                  style={{ color: isActive ? accent : undefined }}
                >
                  {page.label}
                </h3>
                <p className="text-[9px] mt-0.5 opacity-40 font-medium truncate">{page.subtitle}</p>
              </div>
            </button>
          );
        })}
      </nav>

      <footer className="p-8 border-t space-y-5" style={{ borderColor }}>
        <div className="space-y-3">
          <div className="flex justify-between items-end">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] opacity-40">Progress</span>
            <span className="text-sm font-black transition-colors duration-500" style={{ color: theme.primary }}>
              {Math.round(progress)}%
            </span>
          </div>
          <div className="h-1 w-full bg-slate-900 rounded-full overflow-hidden">
            <motion.div
              animate={{ width: `${progress}%`, backgroundColor: theme.primary }}
              className="h-full"
              style={{ boxShadow: `0 0 10px ${theme.primary}` }}
            />
          </div>
        </div>

        <button
          onClick={toggleTheme}
          className={`hidden h-12 w-full rounded-2xl border flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest transition-all ${
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

export const DsdModule4Engine: React.FC<{
  isDarkMode: boolean;
  onThemeToggle: () => void;
  initialChapter?: string;
}> = ({ isDarkMode, onThemeToggle, initialChapter }) => {
  const navigate = useNavigate();

  const findInitial = useCallback(() => {
    if (!initialChapter) return 0;
    const idx = PAGES.findIndex((p) => p.id === initialChapter);
    return idx >= 0 ? idx : 0;
  }, [initialChapter]);

  const [current, setCurrent] = useState(findInitial);
  const [navOpen, setNavOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const id = PAGES[current]?.id;
    if (id) {
      const target = `/dsd/4/${id}`;
      if (window.location.pathname !== target) navigate(target, { replace: true });
    }
  }, [current, navigate]);

  useEffect(() => {
    if (initialChapter) {
      const idx = PAGES.findIndex((p) => p.id === initialChapter);
      if (idx >= 0 && idx !== current) setCurrent(idx);
    } else if (current !== 0) {
      setCurrent(0);
    }
  }, [initialChapter]); // eslint-disable-line react-hooks/exhaustive-deps

  const go = useCallback((dir: number) => {
    setCurrent((c) => Math.max(0, Math.min(PAGES.length - 1, c + dir)));
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
  const theme = themeFor(current);
  const { Component } = page;

  return (
    <div className={`flex h-screen overflow-hidden transition-colors duration-700 relative ${isDarkMode ? 'bg-[#01040c]' : 'bg-white'}`}>
      {isDarkMode && (
        <div className="absolute inset-0 pointer-events-none opacity-[0.18] overflow-hidden z-0">
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
        />
      </DrawerShell>

      <div className="flex-1 flex flex-col h-full overflow-hidden relative z-10">
        <header
          className="h-16 lg:h-20 border-b flex items-center justify-between px-4 lg:px-12 z-10 gap-3"
          style={{ borderColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}
        >
          <div className="flex items-center gap-3 min-w-0">
            <HamburgerButton isDarkMode={isDarkMode} onClick={() => setNavOpen(true)} />
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] font-mono uppercase tracking-[0.4em] font-bold transition-colors duration-500" style={{ color: theme.primary }}>
                {page.step}
              </span>
              <h2 className="text-base lg:text-xl font-bold tracking-tight truncate">{page.label}</h2>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <div className="text-right">
              <div className="text-[8px] font-mono uppercase tracking-widest opacity-30">Module 04</div>
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
          style={{ borderColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}
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
            onClick={() => { if (current === PAGES.length - 1) { navigate('/portal'); } else { go(1); } }}
            className="flex items-center gap-3 px-5 lg:px-10 py-3 rounded-2xl font-black text-black transition-all duration-500 active:scale-95 shadow-xl"
            style={{
              backgroundColor: theme.primary,
              boxShadow: `0 10px 30px ${theme.primary}33`,
            }}
          >
            {current === PAGES.length - 1 ? 'Complete' : 'Next'} <ArrowRight size={18} />
          </button>
        </footer>
      </div>
    </div>
  );
};
