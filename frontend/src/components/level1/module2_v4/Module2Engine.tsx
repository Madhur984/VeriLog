import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Moon, Sun, ArrowRight, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ModuleComplete } from '../../ui/ModuleComplete';
import { MODULE_LABELS } from '../../../lib/moduleHistory';
import { DrawerShell, HamburgerButton } from '../_shared/MobileDrawer';

// --- Scene Components ---
import { P1_SignalReality } from './scenes/phases/P1_SignalReality';
import { P2_TimeControl } from './scenes/phases/P2_TimeControl';
import { P3_ValuePrecision } from './scenes/phases/P3_ValuePrecision';
import { P4_SystemConversion } from './scenes/phases/P4_SystemConversion';
import { P5_MasterLab } from './scenes/phases/P5_MasterLab';

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
    id: 'reality', part: 'PHASE I · ANALOG REALITY', partNum: 1,
    label: 'The Continuous Source',
    subtitle: 'Exploring the infinite resolution of the physical world.',
    accentHex: '#06b6d4',
    Component: P1_SignalReality,
  },
  {
    id: 'time', part: 'PHASE II · THE CLASH', partNum: 2,
    label: 'Temporal Sampling',
    subtitle: 'Mapping the Nyquist limit & Aliasing ghosting.',
    accentHex: '#0891b2',
    Component: P2_TimeControl,
  },
  {
    id: 'precision', part: 'PHASE III · BIT DEPTH', partNum: 3,
    label: 'Value Quantization',
    subtitle: 'The cost of turning reality into numbers.',
    accentHex: '#0ea5e9',
    Component: P3_ValuePrecision,
  },
  {
    id: 'conversion', part: 'PHASE IV · THE BRIDGE', partNum: 4,
    label: 'Systemic Conversion',
    subtitle: 'Solving real-world signal failures via cursor probe.',
    accentHex: '#0284c7',
    Component: P4_SystemConversion,
  },
  {
    id: 'mastery', part: 'PHASE V · THE WORKSHOP', partNum: 5,
    label: 'Engineering Workshop',
    subtitle: 'Ultimate Mastery Audit: Configure the perfect capture.',
    accentHex: '#0369a1',
    Component: P5_MasterLab,
  },
];

const Sidebar: React.FC<{
  current: number; isDarkMode: boolean; onChange: (i: number) => void; toggleTheme: () => void;
}> = ({ current, isDarkMode, onChange, toggleTheme }) => {
  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const borderColor = isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';
  const progress = ((current + 1) / PAGES.length) * 100;

  return (
    <div className={`w-[320px] h-full flex-shrink-0 border-r flex flex-col z-20 transition-all duration-700 ${isDarkMode ? 'bg-[#040200]' : 'bg-slate-50'}`} style={{ borderColor }}>
      <header className="p-10 border-b" style={{ borderColor }}>
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500 flex items-center justify-center text-black">
            <Activity size={20} />
          </div>
          <div>
            <h2 className={`text-sm font-black tracking-tight ${textColor}`}>Digital Physics</h2>
            <p className="text-[10px] uppercase font-mono tracking-widest text-cyan-500 font-bold">Module 03</p>
          </div>
        </div>
      </header>

      <nav className="p-8 flex-1 overflow-y-auto space-y-3">
        {PAGES.map((page, idx) => {
          const isActive = current === idx;
          const isDone = idx < current;
          return (
            <button 
              key={page.id} 
              onClick={() => onChange(idx)}
              className={`group relative w-full text-left p-4 rounded-2xl transition-all duration-500 flex items-start gap-4 ${isActive ? (isDarkMode ? 'bg-cyan-500/10 border-cyan-500/30' : 'bg-white border-slate-200 shadow-lg') : 'hover:bg-black/5 hover:translate-x-1'}`}
            >
              <div className={`mt-0.5 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black border transition-all ${isDone ? 'bg-cyan-500 border-cyan-500 text-black' : isActive ? 'bg-cyan-500 border-cyan-500 text-black' : 'bg-transparent border-slate-300 dark:border-white/10 opacity-30'}`}>
                {isDone ? '✓' : idx + 1}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className={`text-[13px] font-bold truncate ${isActive ? 'text-cyan-500' : isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{page.label}</h3>
              </div>
            </button>
          );
        })}
      </nav>

      <footer className="p-10 border-t space-y-6" style={{ borderColor }}>
        <div className="space-y-4">
          <div className="flex justify-between items-end">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] opacity-40">Progress</span>
            <span className="text-sm font-black text-cyan-500">{Math.round(progress)}%</span>
          </div>
          <div className="h-1 w-full bg-slate-900 rounded-full overflow-hidden">
            <motion.div animate={{ width: `${progress}%` }} className="h-full bg-cyan-500 shadow-[0_0_10px_#06b6d4]" />
          </div>
        </div>

        <button onClick={toggleTheme} className={`h-12 w-full rounded-2xl border flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest transition-all ${isDarkMode ? 'border-white/10 text-slate-400 hover:bg-white/5' : 'border-slate-200 text-slate-600 hover:bg-slate-100'}`}>
          {isDarkMode ? <Sun size={14} /> : <Moon size={14} />} {isDarkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
      </footer>
    </div>
  );
};

export const Module2Engine: React.FC<{
  isDarkMode: boolean; 
  onThemeToggle: () => void;
  state: any;
  onUpdate: any;
  time: number;
}> = ({ isDarkMode, onThemeToggle, state, onUpdate, time }) => {
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
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [go]);

  const page = PAGES[current];
  const { Component } = page;

  return (
    <div className={`flex h-screen overflow-hidden ${isDarkMode ? 'bg-[#020100]' : 'bg-white'}`}>
      <DrawerShell open={navOpen} onClose={() => setNavOpen(false)}>
        <Sidebar current={current} isDarkMode={isDarkMode} onChange={(i) => { setCurrent(i); setNavOpen(false); }} toggleTheme={onThemeToggle} />
      </DrawerShell>
      
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <header className="h-16 lg:h-20 border-b flex items-center justify-between pl-4 pr-16 lg:px-12 z-10 gap-3" style={{ borderColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}>
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
              className="max-w-5xl mx-auto px-4 py-10 lg:px-12 lg:py-24"
            >
              <Component state={state} onUpdate={onUpdate} time={time} isDarkMode={isDarkMode} />
            </motion.div>
          </AnimatePresence>
        </div>

        <footer className="h-20 lg:h-24 border-t flex items-center justify-between px-4 lg:px-12 z-10 gap-3" style={{ borderColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}>
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
            className="flex items-center gap-2 px-5 lg:px-10 py-3 rounded-2xl font-black text-black transition-all active:scale-95 bg-cyan-500 shadow-xl shadow-cyan-500/20 hover:shadow-cyan-500/40"
          >
            {current === PAGES.length - 1 ? 'Complete' : 'Next Step'} <ArrowRight size={18} />
          </button>
        </footer>
      </div>

      {done && (
        <ModuleComplete
          isDark={isDarkMode}
          moduleTitle={MODULE_LABELS['module/2'] ?? 'this module'}
          accent="#06B6D4"
          topics={Array.from(new Set(PAGES.map((p) => p.label)))}
          onPortal={() => navigate('/portal')}
          next={{ label: MODULE_LABELS['module/3'] ?? 'Module 3', onGo: () => navigate('/module/3') }}
        />
      )}
    </div>
  );
};
