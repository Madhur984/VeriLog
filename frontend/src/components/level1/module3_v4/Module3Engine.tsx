import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Moon, Sun, ArrowRight, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DrawerShell, HamburgerButton } from '../_shared/MobileDrawer';
import { ModuleComplete } from '../../ui/ModuleComplete';
import { MODULE_LABELS } from '../../../lib/moduleHistory';

// --- Scene Components ---
import { S00_A_DecimalSystem } from './scenes/S00_A_DecimalSystem';
import { S00_B_BinarySystem } from './scenes/S00_B_BinarySystem';
import { S00_C_OctalSystem } from './scenes/S00_C_OctalSystem';
import { S00_D_HexSystem } from './scenes/S00_D_HexSystem';
import { S00_E_Conversions } from './scenes/S00_E_Conversions';
import { S00_F_UniversalConverter } from './scenes/S00_F_UniversalConverter';
import { S10_BinaryArithmetic } from './scenes/S10_BinaryArithmetic';
import { S11_Complements } from './scenes/S11_Complements';
import { S12_BooleanAlgebra } from './scenes/S12_BooleanAlgebra';
import { S12_B_SevenSegment } from './scenes/S12_B_SevenSegment';
import { S13_LabActivity_v2 } from './scenes/S13_LabActivity_v2';
import { S13_B_FloatingPoint } from './scenes/S13_B_FloatingPoint';

// --- Types ---
interface Page {
  id: string;
  part: string;
  partNum: number;
  label: string;
  subtitle: string;
  accentHex: string;
  Component: React.FC<any>;
}

const PAGES: Page[] = [
  {
    id: 'decimal', part: 'PART I · NUMBER SYSTEMS', partNum: 1,
    label: 'The Decimal System',
    subtitle: 'Base 10 - positional notation & place-value explorer.',
    accentHex: '#06b6d4',
    Component: S00_A_DecimalSystem,
  },
  {
    id: 'binary', part: 'PART I · NUMBER SYSTEMS', partNum: 1,
    label: 'The Binary System',
    subtitle: 'Base 2 - bit weights, toggle converter & fractional binary.',
    accentHex: '#0891b2',
    Component: S00_B_BinarySystem,
  },
  {
    id: 'octal', part: 'PART I · NUMBER SYSTEMS', partNum: 1,
    label: 'The Octal System',
    subtitle: 'Base 8 - successive division & live converter.',
    accentHex: '#0ea5e9',
    Component: S00_C_OctalSystem,
  },
  {
    id: 'hex', part: 'PART I · NUMBER SYSTEMS', partNum: 1,
    label: 'Hexadecimal',
    subtitle: 'Base 16 - symbols, worked example & dual converter.',
    accentHex: '#0284c7',
    Component: S00_D_HexSystem,
  },
  {
    id: 'conversions', part: 'PART I · NUMBER SYSTEMS', partNum: 1,
    label: 'Conversion Methods',
    subtitle: 'Remainder method · Weight method · Quick-reference tables.',
    accentHex: '#0369a1',
    Component: S00_E_Conversions,
  },
  {
    id: 'universal-converter', part: 'PART I · NUMBER SYSTEMS', partNum: 1,
    label: 'Universal Converter',
    subtitle: 'Dec ↔ Bin ↔ Oct ↔ Hex · Step-by-step working lab.',
    accentHex: '#06b6d4',
    Component: S00_F_UniversalConverter,
  },
  {
    id: 'arithmetic', part: 'PART II · ARITHMETIC', partNum: 2,
    label: 'Binary Addition',
    subtitle: 'Full adder rules · Interactive Ripple Carry Adder.',
    accentHex: '#10b981',
    Component: S10_BinaryArithmetic,
  },
  {
    id: 'complements', part: "PART III · COMPLEMENTS", partNum: 3,
    label: "Complements",
    subtitle: "1's, 2's, 9's, 10's - interactive calculator & signed table.",
    accentHex: '#10b981',
    Component: S11_Complements,
  },
  {
    id: 'boolean', part: 'PART IV · BOOLEAN ALGEBRA', partNum: 4,
    label: 'Boolean Algebra',
    subtitle: 'Laws · Gate truth tables · SOP/POS exercises.',
    accentHex: '#f97316',
    Component: S12_BooleanAlgebra,
  },
  {
    id: 'seven-segment', part: 'PART IV · BOOLEAN ALGEBRA', partNum: 4,
    label: '7-Segment Decoder',
    subtitle: 'BCD to 7-Segment logic · Hardware mapping simulation.',
    accentHex: '#f97316',
    Component: S12_B_SevenSegment,
  },
  {
    id: 'floating-point', part: 'PART V · MEGA LAB', partNum: 5,
    label: 'Floating Point',
    subtitle: 'IEEE 754 16-bit explorer · Sign, Exponent & Mantissa.',
    accentHex: '#00D4FF',
    Component: S13_B_FloatingPoint,
  },
  {
    id: 'lab', part: 'PART V · MEGA LAB', partNum: 5,
    label: 'Engineering Mega Lab',
    subtitle: 'Converter Drill · Complement Calc · SOP Builder.',
    accentHex: '#00D4FF',
    Component: S13_LabActivity_v2,
  },
];

const getPartTheme = (part: string) => {
  if (part.includes('I ·')) return { primary: '#10b981', secondary: '#14b8a6', glow: 'rgba(16, 185, 129, 0.1)' };
  if (part.includes('II ·')) return { primary: '#818cf8', secondary: '#6366f1', glow: 'rgba(129, 140, 248, 0.1)' };
  if (part.includes('III ·')) return { primary: '#f43f5e', secondary: '#fb7185', glow: 'rgba(244, 63, 94, 0.1)' };
  if (part.includes('IV ·')) return { primary: '#f59e0b', secondary: '#fbbf24', glow: 'rgba(245, 158, 11, 0.1)' };
  return { primary: '#10b981', secondary: '#14b8a6', glow: 'rgba(16, 185, 129, 0.1)' };
};

const Sidebar: React.FC<{
  current: number; isDarkMode: boolean; onChange: (i: number) => void; toggleTheme: () => void;
  theme: { primary: string; secondary: string; glow: string };
}> = ({ current, isDarkMode, onChange, toggleTheme, theme }) => {
  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const borderColor = 'var(--border-soft)';
  const progress = ((current + 1) / PAGES.length) * 100;

  return (
    <div className={`w-[320px] h-full flex-shrink-0 border-r-2 flex flex-col z-20 transition-all duration-700 relative ${isDarkMode ? 'bg-[#040200]' : 'bg-slate-50'}`} style={{ borderColor }}>
      <header className="p-10 border-b" style={{ borderColor }}>
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500 flex items-center justify-center text-black">
            <Activity size={20} />
          </div>
          <div>
            <h2 className={`text-sm font-black tracking-tight ${textColor}`}>Digital Logic</h2>
            <p className="text-[10px] uppercase font-mono tracking-widest font-bold transition-colors duration-500" style={{ color: theme.primary }}>Module 02</p>
          </div>
        </div>
      </header>

      <nav className="p-8 flex-1 overflow-y-auto space-y-1">
        {PAGES.map((page, idx) => {
          const isActive = current === idx;
          const isDone = idx < current;

          return (
            <button
                key={page.id} 
                onClick={() => onChange(idx)} 
                className={`group relative w-full text-left p-4 rounded-2xl transition-all duration-500 flex items-start gap-4 ${isActive ? (isDarkMode ? 'border transition-colors' : 'bg-white border-slate-200 shadow-brutal-sm') : 'hover:bg-black/5 hover:translate-x-1'}`}
                style={{ 
                  backgroundColor: isActive && isDarkMode ? theme.glow : undefined,
                  borderColor: isActive && isDarkMode ? `${theme.primary}33` : 'transparent'
                }}
              >
                <div 
                  className={`mt-0.5 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black border transition-all duration-500 ${isDone || isActive ? 'text-black' : `bg-transparent opacity-30 ${isDarkMode ? 'border-white/10' : 'border-slate-300'}`}`}
                  style={{ 
                    backgroundColor: (isDone || isActive) ? theme.primary : 'transparent',
                    borderColor: (isDone || isActive) ? theme.primary : undefined
                  }}
                >
                  {isDone ? '✓' : idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 
                    className={`text-[13px] font-bold truncate transition-colors duration-500 ${isActive ? '' : isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}
                    style={{ color: isActive ? theme.primary : undefined }}
                  >
                    {page.label}
                  </h3>
                  <p className="text-[9px] mt-0.5 opacity-40 font-medium truncate">{page.subtitle}</p>
                </div>
              </button>
          );
        })}
      </nav>

      <footer className="p-10 border-t space-y-6" style={{ borderColor }}>
        <div className="space-y-4">
          <div className="flex justify-between items-end">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] opacity-40">Progress</span>
            <span className="text-sm font-black transition-colors duration-500" style={{ color: theme.primary }}>{Math.round(progress)}%</span>
          </div>
          <div className={`h-1 w-full rounded-full overflow-hidden ${isDarkMode ? 'bg-slate-900' : 'bg-slate-200'}`}>
            <motion.div 
              animate={{ width: `${progress}%`, backgroundColor: theme.primary }} 
              className="h-full shadow-[0_0_10px_rgba(0,0,0,0.5)]" 
              style={{ boxShadow: `0 0 10px ${theme.primary}` }}
            />
          </div>
        </div>

        <button onClick={toggleTheme} className={`h-12 w-full rounded-2xl border-2 border-edge shadow-brutal-sm flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest transition-all ${isDarkMode ? 'text-slate-400 hover:bg-white/5' : 'text-slate-600 hover:bg-slate-100'}`}>
          {isDarkMode ? <Sun size={14} /> : <Moon size={14} />} {isDarkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
      </footer>
    </div>
  );
};

export const Module3Engine: React.FC<{
  isDarkMode: boolean;
  onThemeToggle: () => void;
}> = ({ isDarkMode, onThemeToggle }) => {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [done, setDone] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const go = useCallback((dir: number) => {
    setCurrent(c => Math.max(0, Math.min(PAGES.length - 1, c + dir)));
  }, []);

  useEffect(() => {
    contentRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }, [current]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === 'INPUT') return;
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
      {/* Dynamic Background Gradients */}
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
        <Sidebar current={current} isDarkMode={isDarkMode} onChange={(i) => { setCurrent(i); setNavOpen(false); }} toggleTheme={onThemeToggle} theme={theme} />
      </DrawerShell>
      
      <div className="flex-1 flex flex-col h-full overflow-hidden relative z-10">
        <header className="h-16 lg:h-20 border-b flex items-center justify-between pl-4 pr-16 lg:pl-12 lg:pr-20 z-10 gap-3" style={{ borderColor: 'var(--border-soft)' }}>
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

        <footer className="h-20 lg:h-24 border-t flex items-center justify-between px-4 lg:px-12 z-10 gap-3" style={{ borderColor: 'var(--border-soft)' }}>
          <button
            onClick={() => { if (current === 0) { navigate('/portal'); } else { go(-1); } }}
            className="flex items-center gap-2 px-4 lg:px-8 py-3 rounded-2xl font-bold transition-all hover:bg-black/5 active:scale-95"
          >
            <ArrowLeft size={18} /> Back
          </button>

          <div className="hidden sm:block text-center">
             <span className="text-[10px] font-mono uppercase tracking-widest opacity-30 block mb-1">Up Next</span>
             <span className="text-sm font-bold opacity-70">{current < PAGES.length - 1 ? PAGES[current + 1].label : 'Finish Module'}</span>
          </div>

          <button
            onClick={() => { if (current === PAGES.length - 1) { setDone(true); } else { go(1); } }}
            className="flex items-center gap-2 px-5 lg:px-10 py-3 rounded-2xl font-black text-black transition-all duration-500 active:scale-95 shadow-xl"
            style={{
              backgroundColor: theme.primary,
              boxShadow: `0 10px 30px ${theme.primary}33`
            }}
          >
            {current === PAGES.length - 1 ? 'Complete' : 'Next Step'} <ArrowRight size={18} />
          </button>
        </footer>
      </div>

      {done && (
        <ModuleComplete
          isDark={isDarkMode}
          moduleTitle={MODULE_LABELS['module/2'] ?? 'this module'}
          accent={theme.primary}
          topics={Array.from(new Set(PAGES.map((p) => p.label)))}
          onPortal={() => navigate('/portal')}
          next={{ label: MODULE_LABELS['module/3'] ?? 'Next module', onGo: () => navigate('/module/3') }}
        />
      )}
    </div>
  );
};
