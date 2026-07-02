import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { PlusSquare, Moon, Sun, ArrowRight, ArrowLeft } from 'lucide-react';
import { DrawerShell, HamburgerButton } from '../_shared/MobileDrawer';

import { S00_Cover }      from './scenes/S00_Cover';
import { S01_Basics }     from './scenes/S01_Basics';
import { S01_Video }      from './scenes/S01_Video';
import { S02_RuleBox }    from './scenes/S02_RuleBox';
import { S04_Overflow }   from './scenes/S04_Overflow';
import { S07_Xor }        from './scenes/S07_Xor';
import { S08_And }        from './scenes/S08_And';
import { S09_Blueprint }  from './scenes/S09_Blueprint';
import { S10_Half }       from './scenes/S10_Half';
import { S11_Practice }   from './scenes/S11_Practice';
import { S12_Build }      from './scenes/S12_Build';

interface Page {
  id: string;
  part: string;
  label: string;
  subtitle: string;
  Component: React.FC<any>;
}

const PAGES: Page[] = [
  { id: 'cover',     part: 'PART I · THE FACTS',           label: 'The Half Adder',                   subtitle: 'Cover · what it is and where this module goes.',     Component: S00_Cover },
  { id: 'basics',    part: 'PART I · THE FACTS',           label: 'Definition & Truth Table',         subtitle: '2 inputs, 2 outputs, 4 rows, 2 formulas.',           Component: S01_Basics },
  { id: 'video',     part: 'PART I · THE FACTS',           label: 'Video - Demystifying Half Adders', subtitle: 'Watch · binary addition in two minutes.',            Component: S01_Video },
  { id: 'box',       part: 'PART II · THE MARBLE BOX',     label: 'The Marble Box',                   subtitle: 'Intuition · drop marbles into a bowl that fits one.', Component: S02_RuleBox },
  { id: 'overflow',  part: 'PART II · THE MARBLE BOX',     label: 'The Overflow Mechanism',           subtitle: '1 + 1 = 10 · the push into the carry tray.',         Component: S04_Overflow },
  { id: 'xor',       part: 'PART III · INTO SILICON',      label: 'The Sum Wire: XOR',                subtitle: 'Lights for exactly one. S = A ⊕ B.',                 Component: S07_Xor },
  { id: 'and',       part: 'PART III · INTO SILICON',      label: 'The Carry Wire: AND',              subtitle: 'Fires only when both arrive. C = A · B.',            Component: S08_And },
  { id: 'blueprint', part: 'PART III · INTO SILICON',      label: 'Wiring the Blueprint',             subtitle: 'Two gates, one black box stamped HA.',               Component: S09_Blueprint },
  { id: 'half',      part: 'PART IV · THE BIGGER PICTURE', label: 'Why Only Half?',                   subtitle: 'No carry-in. The full adder finishes the job.',      Component: S10_Half },
  { id: 'practice',  part: 'PART IV · THE BIGGER PICTURE', label: 'Practice Arena',                   subtitle: 'Ten problems with instant walkthroughs.',            Component: S11_Practice },
  { id: 'build',     part: 'PART IV · THE BIGGER PICTURE', label: 'Build It For Real',                subtitle: 'Mission · wire a half adder in the live workbench.', Component: S12_Build },
];

const getPartTheme = (part: string) => {
  // Match longest prefixes first so "IV" doesn't get caught by "I ·" etc.
  if (part.startsWith('PART IV '))  return { primary: '#a78bfa', secondary: '#c4b5fd', glow: 'rgba(167, 139, 250, 0.12)' };
  if (part.startsWith('PART III ')) return { primary: '#34d399', secondary: '#6ee7b7', glow: 'rgba(52, 211, 153, 0.12)' };
  if (part.startsWith('PART II '))  return { primary: '#f59e0b', secondary: '#fbbf24', glow: 'rgba(245, 158, 11, 0.12)' };
  if (part.startsWith('PART I '))   return { primary: '#22d3ee', secondary: '#67e8f9', glow: 'rgba(34, 211, 238, 0.12)' };
  return { primary: '#22d3ee', secondary: '#67e8f9', glow: 'rgba(34, 211, 238, 0.12)' };
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
          <div className="w-10 h-10 rounded-2xl bg-amber-500 flex items-center justify-center text-black">
            <PlusSquare size={20} />
          </div>
          <div>
            <h2 className={`text-sm font-black tracking-tight ${textColor}`}>Digital System Design</h2>
            <p className="text-[10px] uppercase font-mono tracking-widest font-bold transition-colors duration-500" style={{ color: theme.primary }}>
              Module 07 · The Half Adder
            </p>
          </div>
        </div>
      </header>

      <nav className="p-8 flex-1 overflow-y-auto space-y-1">
        {PAGES.map((page, idx) => {
          const isActive = current === idx;
          const isDone = idx < current;
          const showHeader = idx === 0 || PAGES[idx - 1].part !== page.part;
          const partTheme = getPartTheme(page.part);

          return (
            <React.Fragment key={page.id}>
              {showHeader && (
                <div className="pt-8 pb-3 px-4 first:pt-0">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 whitespace-nowrap" style={{ color: partTheme.primary }}>
                      {page.part}
                    </span>
                    <div className="h-[1px] w-full opacity-10" style={{ backgroundColor: partTheme.primary }} />
                  </div>
                </div>
              )}
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
                    isDone || isActive ? 'text-black' : 'bg-transparent border-white/10 opacity-30'
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

export const DsdModule7Engine: React.FC<{
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
  const [navOpen, setNavOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // Sync URL when chapter changes (without triggering a full remount)
  useEffect(() => {
    const id = PAGES[current]?.id;
    if (id) {
      const target = `/dsd/7/${id}`;
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
      // No chapter param → user explicitly wants /dsd/7, start from cover
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
            <HamburgerButton isDarkMode={isDarkMode} onClick={() => setNavOpen(true)} />
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] font-mono uppercase tracking-[0.4em] font-bold transition-colors duration-500" style={{ color: theme.primary }}>
                {page.part}
              </span>
              <h2 className="text-base lg:text-xl font-bold tracking-tight truncate">{page.label}</h2>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <div className="text-right">
              <div className="text-[8px] font-mono uppercase tracking-widest opacity-30">DSD MODULE 07</div>
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
            onClick={() => { if (current === PAGES.length - 1) { navigate('/portal'); } else { go(1); } }}
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
    </div>
  );
};
