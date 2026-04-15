/**
 * Module3Engine — Page-based navigator
 *
 * Each scene is rendered as a FULL PAGE — nothing stripped, no content
 * minimisation. This file is a navigation shell only.
 */
import React, { useState, useEffect, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Moon, Sun, ArrowRight, ArrowLeft } from 'lucide-react';

// ── All rich scene components ─────────────────────────────────────
import { S00_A_DecimalSystem }       from './scenes/S00_A_DecimalSystem';
import { S00_B_BinarySystem }        from './scenes/S00_B_BinarySystem';
import { S00_C_OctalSystem }         from './scenes/S00_C_OctalSystem';
import { S00_D_HexSystem }           from './scenes/S00_D_HexSystem';
import { S00_E_Conversions }         from './scenes/S00_E_Conversions';
import { S00_F_UniversalConverter }  from './scenes/S00_F_UniversalConverter';
import { S10_BinaryArithmetic }      from './scenes/S10_BinaryArithmetic';
import { S11_Complements }           from './scenes/S11_Complements';
import { S12_BooleanAlgebra }        from './scenes/S12_BooleanAlgebra';
import { S13_LabActivity_v2 }        from './scenes/S13_LabActivity_v2';

// ── Page registry ─────────────────────────────────────────────────
interface Page {
  id: string;
  part: string;
  partNum: number;
  label: string;
  subtitle: string;
  accentHex: string;
  kind: 'theory' | 'activity' | 'lab';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Component: React.FC<any>;
}

const PAGES: Page[] = [
  // ── PART I · NUMBER SYSTEMS ────────────────────────────────
  {
    id: 'decimal', part: 'PART I · NUMBER SYSTEMS', partNum: 1,
    label: 'The Decimal System',
    subtitle: 'Base 10 — positional notation & place-value explorer',
    accentHex: '#F59E0B', kind: 'theory',
    Component: S00_A_DecimalSystem,
  },
  {
    id: 'binary', part: 'PART I · NUMBER SYSTEMS', partNum: 1,
    label: 'The Binary System',
    subtitle: 'Base 2 — bit weights, toggle converter & fractional binary',
    accentHex: '#0EA5E9', kind: 'activity',
    Component: S00_B_BinarySystem,
  },
  {
    id: 'octal', part: 'PART I · NUMBER SYSTEMS', partNum: 1,
    label: 'The Octal System',
    subtitle: 'Base 8 — successive division & live converter',
    accentHex: '#10B981', kind: 'activity',
    Component: S00_C_OctalSystem,
  },
  {
    id: 'hex', part: 'PART I · NUMBER SYSTEMS', partNum: 1,
    label: 'Hexadecimal',
    subtitle: 'Base 16 — symbols, worked example & dual converter',
    accentHex: '#A855F7', kind: 'activity',
    Component: S00_D_HexSystem,
  },
  {
    id: 'conversions', part: 'PART I · NUMBER SYSTEMS', partNum: 1,
    label: 'Conversion Methods',
    subtitle: 'Remainder method · Weight method · Quick-reference tables',
    accentHex: '#0EA5E9', kind: 'theory',
    Component: S00_E_Conversions,
  },
  {
    id: 'universal-converter', part: 'PART I · NUMBER SYSTEMS', partNum: 1,
    label: 'Universal Converter',
    subtitle: 'Live Dec ↔ Bin ↔ Oct ↔ Hex · Step-by-step working for every conversion',
    accentHex: '#F59E0B', kind: 'activity',
    Component: S00_F_UniversalConverter,
  },

  // ── PART II · BINARY ARITHMETIC ────────────────────────────
  {
    id: 'arithmetic', part: 'PART II · ARITHMETIC', partNum: 2,
    label: 'Binary Addition',
    subtitle: 'Full adder rules · Interactive Ripple Carry Adder',
    accentHex: '#0EA5E9', kind: 'activity',
    Component: S10_BinaryArithmetic,
  },

  // ── PART III · COMPLEMENTS ──────────────────────────────────
  {
    id: 'complements', part: "PART III · COMPLEMENTS", partNum: 3,
    label: "Complements",
    subtitle: "1's, 2's, 9's, 10's — interactive calculator & signed number table",
    accentHex: '#10B981', kind: 'activity',
    Component: S11_Complements,
  },

  // ── PART IV · BOOLEAN ALGEBRA ───────────────────────────────
  {
    id: 'boolean', part: 'PART IV · BOOLEAN ALGEBRA', partNum: 4,
    label: 'Boolean Algebra',
    subtitle: 'Laws · Gate truth tables · SOP/POS exercises',
    accentHex: '#F97316', kind: 'activity',
    Component: S12_BooleanAlgebra,
  },

  // ── PART V · MEGA LAB ───────────────────────────────────────
  {
    id: 'lab', part: 'PART V · MEGA LAB', partNum: 5,
    label: 'Engineering Mega Lab',
    subtitle: 'Converter Drill · Ripple Carry · Complement Calc · Gate Puzzle · SOP Builder',
    accentHex: '#00D4FF', kind: 'lab',
    Component: S13_LabActivity_v2,
  },
];

// ── Accent colour per part ────────────────────────────────────────
const PART_COLOR: Record<number, string> = {
  1: '#F59E0B',
  2: '#0EA5E9',
  3: '#10B981',
  4: '#F97316',
  5: '#00D4FF',
};

// ── Kind badge ────────────────────────────────────────────────────
const KIND_BADGE: Record<string, { label: string; color: string }> = {
  theory:   { label: '📖 Theory',    color: '#0EA5E9' },
  activity: { label: '⚡ Activity',  color: '#F59E0B' },
  lab:      { label: '🔬 Mega Lab',  color: '#00D4FF' },
};

// ── Top Navigation Bar ────────────────────────────────────────────
const TopBar: React.FC<{
  page: Page; current: number; total: number;
  isDarkMode: boolean; onThemeToggle: () => void;
}> = ({ page, current, total, isDarkMode, onThemeToggle }) => {
  const pct = Math.round(((current + 1) / total) * 100);
  const accent = PART_COLOR[page.partNum];
  const badge = KIND_BADGE[page.kind];

  return (
    <div className={`sticky top-0 z-50 border-b backdrop-blur-2xl transition-all duration-500`}
      style={{
        borderColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
        background: isDarkMode ? 'rgba(10,12,16,0.65)' : 'rgba(255,255,255,0.7)',
        boxShadow: isDarkMode ? '0 4px 30px rgba(0, 0, 0, 0.4)' : '0 4px 30px rgba(0,0,0,0.03)',
      }}>
      {/* Progress bar (top edge) */}
      <div className={`h-[3px] w-full ${isDarkMode ? 'bg-orange-950/30' : 'bg-gray-100'}`}>
        <motion.div
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.5, ease: 'circOut' }}
          className="h-full rounded-r-full shadow-lg"
          style={{ background: accent, boxShadow: `0 0 12px ${accent}88` }}
        />
      </div>

      {/* Nav row */}
      <div className="flex items-center gap-4 px-8 py-4 max-w-[1400px] mx-auto">
        <div className="flex-1 min-w-0 flex flex-col">
          <div className="font-mono text-[9px] tracking-[0.22em] uppercase mb-1" style={{ color: accent }}>
            {page.part}
          </div>
          <div className={`font-sans font-bold text-lg truncate ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>
            {page.label}
          </div>
          <div className={`font-mono text-[10px] truncate mt-0.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            {page.subtitle}
          </div>
        </div>

        {/* Counter */}
        <div className={`font-mono text-xs hidden md:block flex-shrink-0 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
          <span className={isDarkMode ? 'text-slate-300' : 'text-slate-700'}>{current + 1}</span> / {total}
        </div>

        {/* Kind badge */}
        <div className="flex-shrink-0 font-mono text-[9px] tracking-widest uppercase px-3 py-1.5 rounded-full border hidden sm:block"
             style={{ color: badge.color, background: `${badge.color}14`, borderColor: `${badge.color}33` }}>
          {badge.label}
        </div>

        {/* Theme toggle mobile (Top bar only provides theme toggle on smaller screens or secondary location) */}
        <button
          onClick={onThemeToggle}
          className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl border font-mono text-[10px] uppercase tracking-wider transition-all duration-300 active:scale-95 ${
            isDarkMode 
              ? 'border-white/10 text-slate-400 hover:bg-white/5' 
              : 'border-slate-200 text-slate-500 hover:bg-slate-50'
          }`}
        >
          {isDarkMode ? <Sun size={12} className="text-orange-400" /> : <Moon size={12} className="text-orange-500" />} 
          {isDarkMode ? 'Light' : 'Dark'}
        </button>
      </div>
    </div>
  );
};

// ── Sidebar ───────────────────────────────────────────────────────
const SidebarComponent: React.FC<{
  current: number; isDarkMode: boolean; onChange: (i: number) => void; toggleTheme: () => void;
}> = ({ current, isDarkMode, onChange, toggleTheme }) => {
  const borderColor = isDarkMode ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)';
  const sidebarBg = isDarkMode ? '#040200' : '#f9fafb';
  const textColor = isDarkMode ? 'text-orange-50' : 'text-slate-900';
  const subTextColor = isDarkMode ? 'text-slate-500' : 'text-slate-500';
  
  const parts = Array.from(new Set(PAGES.map(p => p.part)));
  const progress = ((current + 1) / PAGES.length) * 100;

  return (
    <div className={`w-[300px] flex-shrink-0 border-r flex flex-col z-20 overflow-y-auto transition-all duration-500 backdrop-blur-xl ${isDarkMode ? 'bg-gradient-to-b from-[#0B0D14]/90 to-[#050608]/90' : 'bg-gradient-to-b from-slate-50/90 to-white/90'}`} style={{ borderColor }}>
      
      {/* Header section identical to Module 2 */}
      <header className="p-8 border-b relative overflow-hidden" style={{ borderColor }}>
        {/* Subtle glow behind logo */}
        <div className={`absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none ${isDarkMode ? 'bg-[radial-gradient(circle_at_20%_20%,#F59E0B,transparent_60%)]' : ''}`} />
        <div className="flex items-center gap-4 relative z-10">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center border shadow-lg ${isDarkMode ? 'bg-orange-500/10 border-orange-500/30 shadow-[0_0_15px_rgba(245,158,11,0.2)]' : 'bg-orange-500 shadow-orange-500/30 border-orange-600'}`}>
                <Activity className={isDarkMode ? 'text-orange-400' : 'text-white'} size={18} />
            </div>
            <div>
                <h2 className={`text-sm font-bold tracking-tight ${textColor}`}>Digital Electronics</h2>
                <p className={`text-[10px] font-mono uppercase tracking-widest mt-1 font-bold ${subTextColor}`}>Module 03</p>
            </div>
        </div>
      </header>

      <nav className="p-8 flex-1 overflow-y-auto">
        {parts.map((part, ptIdx) => {
          const pPages = PAGES.filter(p => p.part === part);
          const acc = PART_COLOR[pPages[0].partNum];
          return (
            <div key={part} className={`${ptIdx > 0 ? 'mt-8' : ''}`}>
              <p className={`text-[9px] font-mono uppercase tracking-[0.2em] mb-4`} style={{ color: isDarkMode ? acc : acc }}>
                {part}
              </p>
              <div className="flex flex-col gap-2">
                {pPages.map((page) => {
                  const idx = PAGES.indexOf(page);
                  const isActive = current === idx;
                  const isDone = idx < current;
                  const badge = KIND_BADGE[page.kind];

                  return (
                    <button 
                      key={page.id} 
                      onClick={() => onChange(idx)}
                      className={`
                        group relative w-full text-left py-3 px-4 rounded-xl transition-all duration-500 flex items-start gap-3 overflow-hidden
                        ${isActive 
                          ? (isDarkMode ? 'translate-x-1 shadow-lg' : 'bg-white border border-slate-200 shadow-md translate-x-1') 
                          : (isDarkMode ? 'hover:bg-white/5 border border-transparent hover:translate-x-0.5' : 'hover:bg-white border border-transparent hover:shadow-sm')}
                      `}
                      style={isActive && isDarkMode ? { background: `${acc}1A`, borderColor: `${acc}40`, boxShadow: `0 4px 20px -2px ${acc}25` } : {}}
                    >
                        {/* Number Indicator */}
                        <div className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-black font-mono border transition-all duration-500 shadow-sm`}
                          style={{
                            background: isDone ? '#10B981' : isActive ? acc : (isDarkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)'),
                            borderColor: isDone ? '#059669' : isActive ? acc : (isDarkMode ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)'),
                            color: isDone || isActive ? '#fff' : (isDarkMode ? '#94A3B8' : '#64748B'),
                            boxShadow: isActive ? `0 0 10px ${acc}00` : 'none'
                          }}
                        >
                          {isDone ? '✓' : idx + 1}
                        </div>
                        
                        <div className="flex-1 min-w-0 relative z-10">
                            <h3 className={`text-[13px] font-bold truncate leading-tight ${
                                isActive 
                                    ? (isDarkMode ? 'text-white' : 'text-slate-900') 
                                    : (isDarkMode ? 'text-slate-400 group-hover:text-slate-200' : 'text-slate-500 group-hover:text-slate-800')
                            }`} style={isActive ? { color: acc } : {}}>
                              {page.label}
                            </h3>
                            <div className="flex items-center gap-2 mt-1.5 opacity-80">
                                <span className={`text-[8px] font-mono tracking-widest uppercase`} style={{ color: badge.color }}>
                                    {badge.label}
                                </span>
                            </div>
                        </div>

                        {isActive && (
                            <motion.div 
                                layoutId="active-pill"
                                className="absolute inset-0 bg-transparent rounded-xl pointer-events-none"
                            />
                        )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>

      <footer className="mt-auto p-8 border-t space-y-8" style={{ borderColor }}>
        {/* Progress Display */}
        <div className="space-y-4 px-1">
            <div className="flex justify-between items-end">
                <span className={`text-[10px] font-mono uppercase tracking-[0.1em] font-black ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Completion</span>
                <span className={`text-sm font-bold italic tracking-tighter`} style={{ color: PART_COLOR[PAGES[current].partNum] }}>{Math.round(progress)}%</span>
            </div>
            <div className={`h-1.5 w-full rounded-full overflow-hidden ${isDarkMode ? 'bg-slate-800 shadow-inner' : 'bg-slate-200'}`}>
                <motion.div 
                    initial={false}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5, ease: "circOut" }}
                    className="h-full shadow-lg"
                    style={{ background: PART_COLOR[PAGES[current].partNum], boxShadow: `0 0 10px ${PART_COLOR[PAGES[current].partNum]}88` }}
                />
            </div>
            <div className={`text-[8px] font-mono tracking-wider ${isDarkMode ? 'text-slate-600' : 'text-slate-400'}`}>
                ← → keyboard nav supported
            </div>
        </div>

        <button 
            onClick={toggleTheme} 
            className={`w-full h-12 flex items-center justify-center gap-3 rounded-xl border font-bold text-[11px] uppercase tracking-widest transition-all duration-300 active:scale-[0.98] ${isDarkMode 
                ? 'border-orange-900/40 text-orange-400 hover:bg-orange-950/30' 
                : 'border-slate-200 text-slate-700 hover:bg-slate-100'}`}
        >
            {isDarkMode ? <Sun size={14} className="text-orange-500" /> : <Moon size={14} className="text-orange-600" />} 
            {isDarkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
      </footer>
    </div>
  );
};
const Sidebar = memo(SidebarComponent);

// ── Footer Nav (Next/Prev) ────────────────────────────────────────
const FooterNav: React.FC<{
  current: number; total: number; isDarkMode: boolean;
  onPrev: () => void; onNext: () => void;
}> = ({ current, total, isDarkMode, onPrev, onNext }) => {
  const border = isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';
  const bgColor = isDarkMode ? 'rgba(10,12,16,0.8)' : 'rgba(255,255,255,0.8)';
  const accent = PART_COLOR[PAGES[current].partNum];
  const nextPage = PAGES[current + 1];
  const isLast = current === total - 1;

  return (
    <div style={{ borderColor: border, backgroundColor: bgColor }} 
         className="border-t p-6 md:px-12 flex items-center justify-between gap-6 flex-shrink-0 backdrop-blur-2xl transition-all duration-500 z-20">
      
      <motion.button
        whileHover={{ scale: current === 0 ? 1 : 1.02 }}
        whileTap={{ scale: current === 0 ? 1 : 0.96 }}
        onClick={onPrev}
        disabled={current === 0}
        className={`flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border font-sans font-bold text-[13px] tracking-wide transition-all duration-300
          ${current === 0 
            ? 'opacity-40 cursor-not-allowed ' + (isDarkMode ? 'border-slate-800 text-slate-600' : 'border-slate-200 text-slate-400')
            : (isDarkMode ? 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100')
          }`}
      >
        <ArrowLeft size={16} /> Back
      </motion.button>

      <div className="hidden sm:block flex-1 text-center">
        {!isLast && nextPage ? (
          <div className="flex flex-col items-center">
            <span className={`font-mono text-[9px] uppercase tracking-[0.2em] mb-1 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Up next</span>
            <span className={`font-sans font-bold text-[13px] ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>{nextPage.label}</span>
          </div>
        ) : (
          <div className="font-mono text-[11px] font-bold text-emerald-500 tracking-[0.2em] uppercase">
            🎉 Module Complete!
          </div>
        )}
      </div>

      <motion.button
        whileHover={{ scale: isLast ? 1 : 1.02, x: isLast ? 0 : 2 }}
        whileTap={{ scale: isLast ? 1 : 0.96 }}
        onClick={onNext}
        disabled={isLast}
        className={`relative overflow-hidden flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl border-none font-sans font-black text-[14px] tracking-wider transition-all duration-500 group`}
        style={isLast 
          ? { background: isDarkMode ? 'rgba(255,255,255,0.05)' : '#f1f5f9', color: isDarkMode ? '#64748B' : '#94a3b8', boxShadow: 'none' } 
          : { background: `linear-gradient(135deg, ${accent}, ${accent}dd)`, color: '#fff', boxShadow: `0 8px 30px ${accent}80` }}
      >
        {!isLast && <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />}
        <span className="relative z-10 flex items-center gap-2">{isLast ? 'Complete' : 'Next Step'} <ArrowRight size={16} /></span>
      </motion.button>
    </div>
  );
};

// ── Main Engine ───────────────────────────────────────────────────
interface Props { isDarkMode: boolean; onThemeToggle: () => void; }

export const Module3Engine: React.FC<Props> = ({ isDarkMode, onThemeToggle }) => {
  const [current, setCurrent] = useState(0);
  const contentRef = React.useRef<HTMLDivElement>(null);

  const go = useCallback((dir: 1 | -1) => {
    setCurrent(c => Math.max(0, Math.min(PAGES.length - 1, c + dir)));
  }, []);

  // Reset scroll on page change
  useEffect(() => {
    contentRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }, [current]);

  // Keyboard navigation
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      // Don't swallow inputs from the universal converter
      if (document.activeElement?.tagName === 'INPUT') return;

      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft')  go(-1);
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [go]);

  const page = PAGES[current];
  const { Component } = page;

  return (
    <div className={`flex h-screen overflow-hidden transition-colors duration-700 relative`} 
         style={{ background: isDarkMode ? '#06070A' : '#F8FAFC' }}>
         
      {/* Absolute massive background gradient glow */}
      {isDarkMode && (
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] rounded-full blur-[120px] opacity-[0.15] transition-all duration-1000" style={{ background: `radial-gradient(circle, ${PART_COLOR[page.partNum]} 0%, transparent 60%)` }} />
          <div className="absolute bottom-[0%] -right-[10%] w-[50vw] h-[50vw] rounded-full blur-[100px] opacity-[0.08] transition-all duration-1000" style={{ background: `radial-gradient(circle, #0EA5E9 0%, transparent 70%)` }} />
        </div>
      )}
      
      {/* ── Sidebar ───────────────────────────────────────── */}
      <Sidebar current={current} isDarkMode={isDarkMode} onChange={setCurrent} toggleTheme={onThemeToggle} />

      {/* ── Main column ───────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <TopBar
          page={page} current={current} total={PAGES.length}
          isDarkMode={isDarkMode} onThemeToggle={onThemeToggle}
        />

        {/* Scrollable content */}
        <div ref={contentRef} className="flex-1 overflow-y-auto overflow-x-hidden relative scroll-smooth">
          <AnimatePresence mode="wait">
            <motion.div
              key={page.id}
              initial={{ opacity: 0, scale: 0.98, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: -15 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="lg:px-[4vw] xl:px-[8vw] pb-32" // Generous padding as seen in Module 2
            >
              {/* Full scene */}
              <Component isActive={true} isDarkMode={isDarkMode} />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer */}
        <FooterNav
          current={current} total={PAGES.length}
          isDarkMode={isDarkMode}
          onPrev={() => go(-1)}
          onNext={() => go(1)}
        />
      </div>
    </div>
  );
};

