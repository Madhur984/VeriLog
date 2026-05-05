import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Moon, Sun, ArrowRight, ArrowLeft } from 'lucide-react';

import { S00_Cover }              from './scenes/S00_Cover';
import { S01_VideoLecture }       from './scenes/S01_VideoLecture';
import { S02_HiddenWing }         from './scenes/S02_HiddenWing';
import { S03_IntrusionVariables } from './scenes/S03_IntrusionVariables';
import { S04_GateDossier }        from './scenes/S04_GateDossier';
import { S05_Gauntlet }           from './scenes/S05_Gauntlet';
import { S06_FinalChokepoint }    from './scenes/S06_FinalChokepoint';
import { S07_TraceBack }          from './scenes/S07_TraceBack';
import { S08_MasterEquation }     from './scenes/S08_MasterEquation';
import { S09_TruthTableLab }      from './scenes/S09_TruthTableLab';
import { S10_KMapBridge }         from './scenes/S10_KMapBridge';
import { S11_ForwardJourney }     from './scenes/S11_ForwardJourney';
import { S12_ThreeFaces }         from './scenes/S12_ThreeFaces';
import { S13_CaseClosed }         from './scenes/S13_CaseClosed';
import { S14_PracticeArena }      from './scenes/S14_PracticeArena';
import { S15_UniversalGates }     from './scenes/S15_UniversalGates';
import { S16_AlgebraLab }         from './scenes/S16_AlgebraLab';
import { S17_CanonicalForms }     from './scenes/S17_CanonicalForms';
import { S18_DontCare }           from './scenes/S18_DontCare';
import { S19_BossExample }        from './scenes/S19_BossExample';

interface Page {
  id: string;
  part: string;
  label: string;
  subtitle: string;
  Component: React.FC<any>;
}

const PAGES: Page[] = [
  { id: 'cover',      part: 'PART I · THE CASE FILE',     label: 'The Secret of Wing X',          subtitle: 'Cover · noir mood · brief the detective.',         Component: S00_Cover },
  { id: 'video',      part: 'PART I · THE CASE FILE',     label: 'The K-Map Field Manual',        subtitle: 'Bilingual lecture · K-Map → Circuit walkthrough.', Component: S01_VideoLecture },
  { id: 'hidden',     part: 'PART II · THE INTRUSION',    label: 'An Undocumented Wing',          subtitle: 'A vault sealed by combinational logic.',           Component: S02_HiddenWing },
  { id: 'variables',  part: 'PART II · THE INTRUSION',    label: 'The Three Doors · A · B · C',   subtitle: 'Inputs are doors; signals are 1 / 0.',             Component: S03_IntrusionVariables },
  { id: 'dossier',    part: 'PART II · THE INTRUSION',    label: 'The Security Dossier',          subtitle: 'NOT, AND, OR · the three guards.',                 Component: S04_GateDossier },
  { id: 'universal',  part: 'PART II · THE INTRUSION',    label: 'Universal Gates',               subtitle: 'NAND/NOR universality · XOR/XNOR family.',         Component: S15_UniversalGates },
  { id: 'gauntlet',   part: 'PART III · END-TO-START',    label: 'The Gauntlet',                  subtitle: 'Walk the wires backward from Y · live signal flow.', Component: S05_Gauntlet },
  { id: 'choke',      part: 'PART III · END-TO-START',    label: 'The Final Chokepoint',          subtitle: 'Y = (Path 1) + (Path 2).',                         Component: S06_FinalChokepoint },
  { id: 'trace',      part: 'PART III · END-TO-START',    label: 'Interrogating the Paths',       subtitle: 'Path 1 = A·B · Path 2 = A·C′.',                    Component: S07_TraceBack },
  { id: 'master',     part: 'PART IV · THE SOP',          label: 'The Master Equation',           subtitle: 'Y = A·B + A·C′ · the SOP form.',                   Component: S08_MasterEquation },
  { id: 'algebra',    part: 'PART IV · THE SOP',          label: 'Boolean Algebra Lab',           subtitle: '10 simplification laws · stepped examples.',       Component: S16_AlgebraLab },
  { id: 'truth',      part: 'PART IV · THE SOP',          label: 'Exhausting the Possibilities',  subtitle: '8 rows · 3 minterms · live truth table.',          Component: S09_TruthTableLab },
  { id: 'canonical',  part: 'PART IV · THE SOP',          label: 'Canonical SOP & POS',           subtitle: 'Σm vs ΠM · two algebraic faces.',                  Component: S17_CanonicalForms },
  { id: 'kmap',       part: 'PART V · FORWARD SYNTHESIS', label: 'From Truth Table to K-Map',     subtitle: 'Plot minterms · read the wings.',                  Component: S10_KMapBridge },
  { id: 'dontcare',   part: 'PART V · FORWARD SYNTHESIS', label: "Don't Care Loophole",           subtitle: 'X conditions · BCD-decoder example.',              Component: S18_DontCare },
  { id: 'boss4',      part: 'PART V · FORWARD SYNTHESIS', label: '4-Variable Boss Walkthrough',   subtitle: 'TT → K-Map → SOP → live circuit · 5 stepped views.', Component: S19_BossExample },
  { id: 'forward',    part: 'PART V · FORWARD SYNTHESIS', label: 'Building the Circuit',          subtitle: 'Live synthesis · function library.',               Component: S11_ForwardJourney },
  { id: 'faces',      part: 'PART VI · CASE CLOSED',      label: 'Three Faces of the Same Truth', subtitle: 'Hardware = algebra = truth table.',                Component: S12_ThreeFaces },
  { id: 'closed',     part: 'PART VI · CASE CLOSED',      label: 'Case Closed',                   subtitle: 'The wing is secured.',                             Component: S13_CaseClosed },
  { id: 'practice',   part: 'PART VII · ASSESSMENT',      label: 'Practice Arena',                subtitle: 'Reverse-engineer · synthesise · drill.',           Component: S14_PracticeArena },
];

const getPartTheme = (part: string) => {
  if (part.startsWith('PART VII '))  return { primary: '#f43f5e', secondary: '#fb7185', glow: 'rgba(244, 63, 94, 0.12)' };
  if (part.startsWith('PART VI '))   return { primary: '#34d399', secondary: '#6ee7b7', glow: 'rgba(52, 211, 153, 0.12)' };
  if (part.startsWith('PART V '))    return { primary: '#a78bfa', secondary: '#c4b5fd', glow: 'rgba(167, 139, 250, 0.12)' };
  if (part.startsWith('PART IV '))   return { primary: '#fbbf24', secondary: '#fcd34d', glow: 'rgba(251, 191, 36, 0.14)' };
  if (part.startsWith('PART III '))  return { primary: '#fb923c', secondary: '#fdba74', glow: 'rgba(251, 146, 60, 0.12)' };
  if (part.startsWith('PART II '))   return { primary: '#22d3ee', secondary: '#67e8f9', glow: 'rgba(34, 211, 238, 0.12)' };
  if (part.startsWith('PART I '))    return { primary: '#0ea5e9', secondary: '#38bdf8', glow: 'rgba(14, 165, 233, 0.14)' };
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
  const borderColor = isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';
  const progress = ((current + 1) / PAGES.length) * 100;

  return (
    <div
      className={`w-[320px] h-full flex-shrink-0 border-r flex flex-col z-20 transition-all duration-700 relative ${
        isDarkMode ? 'bg-[#020611]/60 backdrop-blur-md' : 'bg-slate-50/40 backdrop-blur-md'
      }`}
      style={{ borderColor }}
    >
      <header className="p-10 border-b" style={{ borderColor }}>
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-2xl bg-cyan-400 flex items-center justify-center text-black">
            <Search size={20} />
          </div>
          <div>
            <h2 className={`text-sm font-black tracking-tight ${textColor}`}>Digital System Design</h2>
            <p className="text-[10px] uppercase font-mono tracking-widest font-bold transition-colors duration-500" style={{ color: theme.primary }}>
              Module 03 · Realisation
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
                    ? isDarkMode ? 'border' : 'bg-white border-slate-200 shadow-lg'
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
          className={`h-12 w-full rounded-2xl border flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest transition-all ${
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
    const idx = PAGES.findIndex(p => p.id === initialChapter);
    return idx >= 0 ? idx : 0;
  }, [initialChapter]);

  const [current, setCurrent] = useState(findInitial);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const id = PAGES[current]?.id;
    if (id) {
      const target = `/dsd/3/${id}`;
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

      <Sidebar
        current={current}
        isDarkMode={isDarkMode}
        onChange={setCurrent}
        toggleTheme={onThemeToggle}
        theme={theme}
      />

      <div className="flex-1 flex flex-col h-full overflow-hidden relative z-10">
        <header
          className="h-20 border-b flex items-center justify-between px-12 z-10"
          style={{ borderColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}
        >
          <div className="flex flex-col">
            <span className="text-[10px] font-mono uppercase tracking-[0.4em] font-bold transition-colors duration-500" style={{ color: theme.primary }}>
              {page.part}
            </span>
            <h2 className="text-xl font-bold tracking-tight">{page.label}</h2>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <div className="text-right">
              <div className="text-[8px] font-mono uppercase tracking-widest opacity-30">Story // Lab</div>
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
              className="max-w-7xl mx-auto px-12 py-16"
            >
              <Component isActive={true} isDarkMode={isDarkMode} />
            </motion.div>
          </AnimatePresence>
        </div>

        <footer
          className="h-24 border-t flex items-center justify-between px-12 z-10"
          style={{ borderColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}
        >
          <button
            disabled={current === 0}
            onClick={() => go(-1)}
            className={`flex items-center gap-2 px-8 py-3 rounded-2xl font-bold transition-all ${
              current === 0 ? 'opacity-20 cursor-not-allowed' : 'hover:bg-black/5 active:scale-95'
            }`}
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
            onClick={() => go(1)}
            disabled={current === PAGES.length - 1}
            className={`flex items-center gap-3 px-10 py-3 rounded-2xl font-black text-black transition-all duration-500 active:scale-95 ${
              current === PAGES.length - 1 ? 'bg-slate-800 text-slate-500' : 'shadow-xl'
            }`}
            style={{
              backgroundColor: current === PAGES.length - 1 ? undefined : theme.primary,
              boxShadow: current === PAGES.length - 1 ? undefined : `0 10px 30px ${theme.primary}33`,
            }}
          >
            {current === PAGES.length - 1 ? 'Complete' : 'Next Step'} <ArrowRight size={18} />
          </button>
        </footer>
      </div>
    </div>
  );
};
