import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, Moon, Sun, ArrowRight, ArrowLeft } from 'lucide-react';
import { DrawerShell, HamburgerButton } from '../_shared/MobileDrawer';

import { S00_Cover }      from './scenes/S00_Cover';
import { S01_Video }      from './scenes/S01_Video';
import { S02_Atom }       from './scenes/S02_Atom';
import { S03_DeMorgan }   from './scenes/S03_DeMorgan';
import { S04_NOT }        from './scenes/S04_NOT';
import { S05_OR_AND }     from './scenes/S05_OR_AND';
import { S06_Dual_XOR }   from './scenes/S06_Dual_XOR';
import { S07_Blueprint }  from './scenes/S07_Blueprint';

import type { GateMode, SceneProps } from './types';

interface Page {
  id: string;
  step: string;
  label: { nand: string; nor: string };
  subtitle: { nand: string; nor: string };
  Component: React.FC<SceneProps>;
}

const PAGES: Page[] = [
  {
    id: 'cover',
    step: 'Open',
    label: { nand: 'The Universal Building Block', nor: 'The Universal Builder' },
    subtitle: { nand: 'Every gate from a single NAND.', nor: 'Every gate from a single NOR.' },
    Component: S00_Cover,
  },
  {
    id: 'video',
    step: 'Lecture',
    label: { nand: 'NAND Universality · Video', nor: 'NOR Universality · Video' },
    subtitle: { nand: 'Watch the construction once.', nor: 'Watch the construction once.' },
    Component: S01_Video,
  },
  {
    id: 'atom',
    step: 'Step 1',
    label: { nand: 'The NAND Atom', nor: 'The NOR Atom' },
    subtitle: { nand: 'Y = (A · B)′', nor: 'Y = (A + B)′' },
    Component: S02_Atom,
  },
  {
    id: 'demorgan',
    step: 'Step 2',
    label: { nand: "De Morgan's Bridge", nor: "De Morgan's Bridge" },
    subtitle: { nand: '(A·B)′ = A′ + B′  ·  (A+B)′ = A′·B′', nor: '(A+B)′ = A′·B′  ·  (A·B)′ = A′ + B′' },
    Component: S03_DeMorgan,
  },
  {
    id: 'not',
    step: 'Level 1',
    label: { nand: 'NOT · 1 NAND', nor: 'NOT · 1 NOR' },
    subtitle: { nand: 'Tie inputs together.', nor: 'Tie inputs together.' },
    Component: S04_NOT,
  },
  {
    id: 'or-and',
    step: 'Level 2',
    label: { nand: 'AND & OR · double inversion', nor: 'OR & AND · double inversion' },
    subtitle: { nand: 'AND in 2 NANDs · OR in 3 NANDs.', nor: 'OR in 2 NORs · AND in 3 NORs.' },
    Component: S05_OR_AND,
  },
  {
    id: 'dual-xor',
    step: 'Level 3-4',
    label: { nand: 'NOR + XOR + XNOR', nor: 'NAND + XNOR + XOR' },
    subtitle: { nand: 'NOR=4 · XOR=4 · XNOR=5.', nor: 'NAND=4 · XNOR=4 · XOR=5.' },
    Component: S06_Dual_XOR,
  },
  {
    id: 'blueprint',
    step: 'Closing',
    label: { nand: 'Master Blueprint · NAND', nor: 'Master Blueprint · NOR' },
    subtitle: { nand: 'Every gate. One atom.', nor: 'Every gate. One atom.' },
    Component: S07_Blueprint,
  },
];

const ACCENTS = ['#0ea5e9', '#22d3ee', '#a78bfa', '#fbbf24', '#fb923c', '#22c55e', '#fb7185', '#f43f5e'];
const themeFor = (idx: number) => {
  const c = ACCENTS[idx] ?? '#22d3ee';
  return { primary: c, secondary: c, glow: `${c}22` };
};

// Mode toggle (NAND / NOR) shown on every page
const ModeToggle: React.FC<{ mode: GateMode; onChange: (m: GateMode) => void; isDarkMode: boolean }> = ({ mode, onChange, isDarkMode }) => (
  <div className={`inline-flex rounded-2xl p-1 border ${
    isDarkMode ? 'bg-black/40 border-white/10' : 'bg-slate-100 border-slate-200'
  }`}>
    {(['nand', 'nor'] as const).map((m) => (
      <button
        key={m}
        onClick={() => onChange(m)}
        className={`relative px-5 py-2 rounded-xl font-mono text-xs uppercase tracking-[0.3em] font-black transition-all`}
        style={{
          color: mode === m ? '#000' : (isDarkMode ? '#cbd5e1' : '#475569'),
          background: mode === m ? (m === 'nand' ? '#22d3ee' : '#fb923c') : 'transparent',
          boxShadow: mode === m ? `0 0 20px ${m === 'nand' ? '#22d3ee' : '#fb923c'}55` : 'none',
        }}
      >
        {m === 'nand' ? 'NAND' : 'NOR'}
        {mode === m && (
          <motion.span
            layoutId="mode-pill-glow"
            className="absolute inset-0 rounded-xl pointer-events-none"
            style={{ boxShadow: `0 0 25px ${m === 'nand' ? '#22d3ee' : '#fb923c'}55` }}
          />
        )}
      </button>
    ))}
  </div>
);

const Sidebar: React.FC<{
  current: number;
  isDarkMode: boolean;
  mode: GateMode;
  onChange: (i: number) => void;
  toggleTheme: () => void;
}> = ({ current, isDarkMode, mode, onChange, toggleTheme }) => {
  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const borderColor = 'var(--border-soft)';
  const progress = ((current + 1) / PAGES.length) * 100;
  const theme = themeFor(current);
  const modeColor = mode === 'nand' ? '#22d3ee' : '#fb923c';

  return (
    <div
      className={`w-[320px] h-full flex-shrink-0 border-r-2 flex flex-col z-20 transition-all duration-700 relative ${
        isDarkMode ? 'bg-[#020611]' : 'bg-slate-50'
      }`}
      style={{ borderColor }}
    >
      <header className="p-8 border-b" style={{ borderColor }}>
        <div className="flex items-center gap-4 mb-1">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-black"
               style={{ background: modeColor }}>
            <Layers size={20} />
          </div>
          <div>
            <h2 className={`text-sm font-black tracking-tight ${textColor}`}>Digital System Design</h2>
            <p className="text-[10px] uppercase font-mono tracking-widest font-bold transition-colors duration-500"
               style={{ color: modeColor }}>
              Module 05 · Universal Gates
            </p>
          </div>
        </div>
      </header>

      <nav className="p-6 flex-1 overflow-y-auto space-y-1">
        {PAGES.map((page, idx) => {
          const isActive = current === idx;
          const isDone = idx < current;
          const accent = ACCENTS[idx] ?? '#22d3ee';
          const lbl = page.label[mode];
          return (
            <button
              key={page.id}
              onClick={() => onChange(idx)}
              className={`group relative w-full text-left p-3 rounded-xl transition-all duration-500 flex items-start gap-3 ${
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
                className={`mt-0.5 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black border transition-all duration-500 ${
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
                  <span className="text-[9px] font-mono uppercase tracking-widest opacity-60"
                        style={{ color: isActive ? accent : undefined }}>
                    {page.step}
                  </span>
                </div>
                <h3
                  className={`text-[12px] font-bold truncate transition-colors duration-500 ${
                    isActive ? '' : isDarkMode ? 'text-slate-300' : 'text-slate-700'
                  }`}
                  style={{ color: isActive ? accent : undefined }}
                >
                  {lbl}
                </h3>
              </div>
            </button>
          );
        })}
      </nav>

      <footer className="p-6 border-t space-y-4" style={{ borderColor }}>
        <div className="space-y-3">
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
          className={`h-10 w-full rounded-xl border-2 border-edge shadow-brutal-sm flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest transition-all ${
            isDarkMode ? 'border-white/10 text-slate-400 hover:bg-white/5' : 'border-slate-200 text-slate-600 hover:bg-slate-100'
          }`}
        >
          {isDarkMode ? <Sun size={12} /> : <Moon size={12} />}
          {isDarkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
      </footer>
    </div>
  );
};

export const DsdModule5Engine: React.FC<{
  isDarkMode: boolean;
  onThemeToggle: () => void;
  initialChapter?: string;
}> = ({ isDarkMode, onThemeToggle, initialChapter }) => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<GateMode>('nand');

  const findInitial = useCallback(() => {
    if (!initialChapter) return 0;
    const idx = PAGES.findIndex((p) => p.id === initialChapter);
    return idx >= 0 ? idx : 0;
  }, [initialChapter]);

  const [current, setCurrent] = useState(findInitial);
  const [navOpen, setNavOpen] = useState(() => window.matchMedia('(min-width: 1024px)').matches);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const id = PAGES[current]?.id;
    if (id) {
      const target = `/dsd/5/${id}`;
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
  }, [current, mode]);

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
          mode={mode}
          onChange={(i) => { setCurrent(i); setNavOpen(false); }}
          toggleTheme={onThemeToggle}
        />
      </DrawerShell>

      <div className="flex-1 flex flex-col h-full overflow-hidden relative z-10">
        {/* Header with mode toggle (visible on every page) */}
        <header
          className="border-b flex items-center justify-between px-4 lg:px-12 py-4 z-10 gap-6 flex-wrap"
          style={{ borderColor: 'var(--border-soft)' }}
        >
          <div className="flex items-center gap-3 min-w-0">
            <HamburgerButton isDarkMode={isDarkMode} onClick={() => setNavOpen(o => !o)} />
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] font-mono uppercase tracking-[0.4em] font-bold transition-colors duration-500" style={{ color: theme.primary }}>
                {page.step}
              </span>
              <h2 className="text-base lg:text-xl font-bold tracking-tight truncate">{page.label[mode]}</h2>
            </div>
          </div>
          <ModeToggle mode={mode} onChange={setMode} isDarkMode={isDarkMode} />
          <div className="hidden md:flex flex-col items-end">
            <div className="text-[8px] font-mono uppercase tracking-widest opacity-30">Module 05</div>
            <div className="text-[10px] font-mono mt-0.5 max-w-xs text-right truncate">{page.subtitle[mode]}</div>
            <div className="text-xs font-mono opacity-30 mt-1">{current + 1} / {PAGES.length}</div>
          </div>
        </header>

        <div ref={contentRef} className="flex-1 overflow-y-auto scroll-smooth">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${page.id}-${mode}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-7xl mx-auto px-4 py-10 lg:px-12 lg:py-14"
            >
              <Component isActive={true} isDarkMode={isDarkMode} mode={mode} />
            </motion.div>
          </AnimatePresence>
        </div>

        <footer
          className="h-20 border-t flex items-center justify-between px-4 lg:px-12 z-10 gap-3"
          style={{ borderColor: 'var(--border-soft)' }}
        >
          <button
            onClick={() => { if (current === 0) { navigate('/portal'); } else { go(-1); } }}
            className="flex items-center gap-2 px-3 lg:px-6 py-2.5 rounded-xl font-bold transition-all hover:bg-black/5 active:scale-95"
          >
            <ArrowLeft size={16} /> Back
          </button>

          <div className="hidden sm:block text-center">
            <span className="text-[10px] font-mono uppercase tracking-widest opacity-30 block">Up Next</span>
            <span className="text-sm font-bold opacity-70">
              {current < PAGES.length - 1 ? PAGES[current + 1].label[mode] : 'Module Complete'}
            </span>
          </div>

          <button
            onClick={() => { if (current === PAGES.length - 1) { navigate('/portal'); } else { go(1); } }}
            className="flex items-center gap-3 px-4 lg:px-8 py-2.5 rounded-xl font-black text-black transition-all duration-500 active:scale-95 shadow-xl"
            style={{
              backgroundColor: theme.primary,
              boxShadow: `0 10px 30px ${theme.primary}33`,
            }}
          >
            {current === PAGES.length - 1 ? 'Complete' : 'Next'} <ArrowRight size={16} />
          </button>
        </footer>
      </div>
    </div>
  );
};
