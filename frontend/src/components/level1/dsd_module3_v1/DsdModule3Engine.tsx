import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Moon, Sun, ArrowRight, ArrowLeft } from 'lucide-react';
import { DrawerShell, HamburgerButton } from '../_shared/MobileDrawer';
import { ModuleComplete } from '../../ui/ModuleComplete';
import { MODULE_LABELS } from '../../../lib/moduleHistory';

import { S00_Cover }      from './scenes/S00_Cover';
import { S01_Video }      from './scenes/S01_Video';
import { S01b_Facts }     from './scenes/S01b_Facts';
import { S02_Vault }      from './scenes/S02_Vault';
import { S03_TruthTable } from './scenes/S03_TruthTable';
import { S04_Minterms }   from './scenes/S04_Minterms';
import { S05_KMap }       from './scenes/S05_KMap';
import { S06_Schematic }  from './scenes/S06_Schematic';
import { S07_Recap }      from './scenes/S07_Recap';

interface Page {
  id: string;
  step: string;
  label: string;
  subtitle: string;
  Component: React.FC<any>;
}

// 8 chapters · one tight pipeline from spec to silicon · F = A + BC
const PAGES: Page[] = [
  { id: 'cover',     step: 'Open',     label: 'From Truth to Hardware',      subtitle: 'A simple case study in circuit realisation.',     Component: S00_Cover },
  { id: 'video',     step: 'Lecture',  label: 'Watch the pipeline',          subtitle: 'Visual walkthrough · 1 video · 4 stages.',         Component: S01_Video },
  { id: 'facts',     step: 'Basics',   label: 'The Facts First',             subtitle: 'The 5-step recipe in plain English + the example.', Component: S01b_Facts },
  { id: 'vault',     step: 'Step 1',   label: 'The Server Vault',            subtitle: 'Three inputs · one output F · the brief.',         Component: S02_Vault },
  { id: 'truth',     step: 'Step 2',   label: 'Define the truth table',      subtitle: '8 rows · 5 active states · F = Σm(3,4,5,6,7).',    Component: S03_TruthTable },
  { id: 'minterms',  step: 'Step 3',   label: 'Extract minterms · SOP',      subtitle: 'Each F=1 row → product term · OR them all.',       Component: S04_Minterms },
  { id: 'kmap',      step: 'Step 4',   label: 'Optimise on the K-Map',       subtitle: 'Group adjacent 1s · drop redundant variables.',    Component: S05_KMap },
  { id: 'schematic', step: 'Step 5',   label: 'Wire the schematic',          subtitle: 'B·C through AND · OR with A · output F.',          Component: S06_Schematic },
  { id: 'recap',     step: 'Closing',  label: 'Three views · one truth',     subtitle: 'Truth table = SOP = K-Map = schematic.',           Component: S07_Recap },
];

const ACCENTS = ['#0ea5e9', '#22d3ee', '#38bdf8', '#fb923c', '#fbbf24', '#facc15', '#a78bfa', '#fb7185', '#22c55e'];

const themeFor = (idx: number) => {
  const c = ACCENTS[idx] ?? '#22d3ee';
  return { primary: c, secondary: c, glow: `${c}22` };
};

const Sidebar: React.FC<{
  current: number;
  isDarkMode: boolean;
  onChange: (i: number) => void;
  toggleTheme: () => void;
}> = ({ current, isDarkMode, onChange, toggleTheme }) => {
  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const borderColor = 'var(--border-soft)';
  const progress = ((current + 1) / PAGES.length) * 100;
  const theme = themeFor(current);

  return (
    <div
      className={`w-[320px] h-full flex-shrink-0 border-r-2 flex flex-col z-20 transition-all duration-700 relative ${
        isDarkMode ? 'bg-[#020611]' : 'bg-slate-50'
      }`}
      style={{ borderColor }}
    >
      <header className="p-10 border-b" style={{ borderColor }}>
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-2xl bg-cyan-400 flex items-center justify-center text-black">
            <ShieldCheck size={20} />
          </div>
          <div>
            <h2 className={`text-sm font-black tracking-tight ${textColor}`}>Digital System Design</h2>
            <p className="text-[10px] uppercase font-mono tracking-widest font-bold transition-colors duration-500" style={{ color: theme.primary }}>
              Module 03 · Circuit Realisation
            </p>
          </div>
        </div>
      </header>

      <nav className="p-6 flex-1 overflow-y-auto space-y-1">
        {PAGES.map((page, idx) => {
          const isActive = current === idx;
          const isDone = idx < current;
          const accent = ACCENTS[idx] ?? '#22d3ee';
          return (
            <button
              key={page.id}
              onClick={() => onChange(idx)}
              className={`group relative w-full text-left p-4 rounded-2xl transition-all duration-500 flex items-start gap-4 ${
                isActive
                  ? isDarkMode ? 'border' : 'bg-white border-slate-200 shadow-brutal-sm'
                  : 'hover:bg-black/5 hover:translate-x-1'
              }`}
              style={{
                backgroundColor: isActive && isDarkMode ? `${accent}18` : undefined,
                borderColor: isActive && isDarkMode ? `${accent}55` : 'transparent',
              }}
            >
              <div
                className={`mt-0.5 w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black border transition-all duration-500 ${
                  isDone || isActive ? 'text-black' : `bg-transparent ${isDarkMode ? 'border-white/10' : 'border-slate-300'} opacity-30`
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

export const DsdModule3Engine: React.FC<{
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
  const [done, setDone] = useState(false);
  const [navOpen, setNavOpen] = useState(() => window.matchMedia('(min-width: 1024px)').matches);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const id = PAGES[current]?.id;
    if (id) {
      const target = `/dsd/3/${id}`;
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
              <div className="text-[8px] font-mono uppercase tracking-widest opacity-30">Module 03</div>
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
            {current === PAGES.length - 1 ? 'Complete' : 'Next'} <ArrowRight size={18} />
          </button>
        </footer>
      </div>

      {done && (
        <ModuleComplete
          isDark={isDarkMode}
          moduleTitle={MODULE_LABELS['dsd/3'] ?? 'this module'}
          accent={theme.primary}
          topics={Array.from(new Set(PAGES.map((p) => p.label)))}
          onPortal={() => navigate('/portal')}
          next={{ label: MODULE_LABELS['dsd/4'] ?? 'Next module', onGo: () => navigate('/dsd/4') }}
        />
      )}
    </div>
  );
};
