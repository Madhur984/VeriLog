import React, { useState, useEffect, useCallback, memo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Moon, Sun, ArrowRight, ArrowLeft } from 'lucide-react';
import { S00_AbsoluteIntro } from './scenes/S00_AbsoluteIntro';
import { S01_Introduction } from './scenes/S01_Introduction';
import { S02_StandardSignals } from './scenes/S02_StandardSignals';
import { S03_AnalogVsDigital } from './scenes/S03_AnalogVsDigital';
import { S04_WaveParameters } from './scenes/S04_WaveParameters';
import { S05_VerilogBridge } from './scenes/S05_VerilogBridge';

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
    id: 'intro', part: 'PART I · UNIFIED FOUNDATION', partNum: 1,
    label: 'Introduction to Signals',
    subtitle: 'The bridge between physical waves and logical bits.',
    accentHex: '#06b6d4',
    Component: S01_Introduction,
  },
  {
    id: 'standard', part: 'PART I · UNIFIED FOUNDATION', partNum: 1,
    label: 'Standard Test Signals',
    subtitle: 'Step, Ramp, and Impulse: Engineering benchmarks.',
    accentHex: '#10b981',
    Component: S02_StandardSignals,
  },
  {
    id: 'families', part: 'PART II · DOMAIN ARBITRAGE', partNum: 2,
    label: 'The Signal Families',
    subtitle: 'Analog vs Digital: Continuous vs Discrete.',
    accentHex: '#a78bfa',
    Component: S03_AnalogVsDigital,
  },
  {
    id: 'parameters', part: 'PART III · FIELD RECOVERY', partNum: 3,
    label: 'Wave Parameters',
    subtitle: 'Amplitude, Frequency, and the Mathematical Oscillator.',
    accentHex: '#22d3ee',
    Component: S04_WaveParameters,
  },
  {
    id: 'verilog', part: 'PART IV · GATEWAY', partNum: 4,
    label: 'The Verilog Bridge',
    subtitle: 'Finalizing the foundation for hardware mastery.',
    accentHex: '#0891b2',
    Component: S05_VerilogBridge,
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
            <h2 className={`text-sm font-black tracking-tight ${textColor}`}>Signal Theory</h2>
            <p className="text-[10px] uppercase font-mono tracking-widest text-cyan-500 font-bold">Module 01</p>
          </div>
        </div>
      </header>
      <nav className="p-8 flex-1 overflow-y-auto space-y-1">
        {PAGES.map((page, idx) => {
          const isActive = current === idx;
          const isDone = idx < current;
          const showHeader = idx === 0 || PAGES[idx - 1].part !== page.part;
          return (
            <React.Fragment key={page.id}>
              {showHeader && (
                <div className="pt-8 pb-3 px-4 first:pt-0">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-500/60 whitespace-nowrap">
                      {page.part}
                    </span>
                    <div className="h-[1px] w-full bg-cyan-500/10" />
                  </div>
                </div>
              )}
              <button key={page.id} onClick={() => onChange(idx)} className={`group relative w-full text-left p-4 rounded-2xl transition-all duration-500 flex items-start gap-4 ${isActive ? (isDarkMode ? 'bg-cyan-500/10 border-cyan-500/30' : 'bg-white border-slate-200 shadow-lg') : 'hover:bg-black/5 hover:translate-x-1'}`}>
                <div className={`mt-0.5 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black border transition-all ${isDone ? 'bg-cyan-500 border-cyan-500 text-black' : isActive ? 'bg-cyan-500 border-cyan-500 text-black' : 'bg-transparent border-white/10 opacity-30'}`}>{isDone ? '✓' : idx + 1}</div>
                <div className="flex-1 min-w-0">
                  <h3 className={`text-[13px] font-bold truncate ${isActive ? 'text-cyan-500' : isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{page.label}</h3>
                  <p className="text-[9px] mt-0.5 opacity-40 font-medium truncate">{page.subtitle}</p>
                </div>
              </button>
            </React.Fragment>
          );
        })}
      </nav>
      <footer className="p-10 border-t space-y-6" style={{ borderColor }}>
        <div className="space-y-4">
          <div className="flex justify-between items-end"><span className="text-[10px] font-mono uppercase tracking-[0.2em] opacity-40">Progress</span><span className="text-sm font-black text-cyan-500">{Math.round(progress)}%</span></div>
          <div className="h-1 w-full bg-slate-900 rounded-full overflow-hidden"><motion.div animate={{ width: `${progress}%` }} className="h-full bg-cyan-500 shadow-[0_0_10px_#06b6d4]" /></div>
        </div>
        <button onClick={toggleTheme} className={`h-12 w-full rounded-2xl border flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest transition-all ${isDarkMode ? 'border-white/10 text-slate-400 hover:bg-white/5' : 'border-slate-200 text-slate-600 hover:bg-slate-100'}`}>{isDarkMode ? <Sun size={14} /> : <Moon size={14} />} {isDarkMode ? 'Light Mode' : 'Dark Mode'}</button>
      </footer>
    </div>
  );
};

export const Module1Engine: React.FC<{
  isDarkMode: boolean; onThemeToggle: () => void;
}> = ({ isDarkMode, onThemeToggle }) => {
  const [showSplash, setShowSplash] = useState(true);
  const [current, setCurrent] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);

  const go = useCallback((dir: number) => {
    setCurrent(c => Math.max(0, Math.min(PAGES.length - 1, c + dir)));
  }, []);

  useEffect(() => { contentRef.current?.scrollTo({ top: 0, behavior: 'smooth' }); }, [current]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (showSplash) return;
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [go, showSplash]);

  const page = PAGES[current];
  const { Component } = page;

  return (
    <div className={`flex h-screen overflow-hidden transition-colors duration-700 ${isDarkMode ? 'bg-[#020100]' : 'bg-white'}`}>
      <AnimatePresence>
        {showSplash ? (
          <motion.div 
            key="splash"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05, filter: 'blur(20px)' }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[100]"
          >
            <S00_AbsoluteIntro onComplete={() => setShowSplash(false)} />
          </motion.div>
        ) : null}
      </AnimatePresence>

      <Sidebar current={current} isDarkMode={isDarkMode} onChange={setCurrent} toggleTheme={onThemeToggle} />
      
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Background Gradients (like Module 3) */}
        {isDarkMode && (
          <div className="absolute inset-0 pointer-events-none opacity-30 overflow-hidden">
            <div className="absolute -top-[10%] -left-[10%] w-[60vw] h-[60vw] rounded-full blur-[120px]" style={{ background: 'radial-gradient(circle, #06b6d4 0%, transparent 70%)' }} />
            <div className="absolute bottom-[0%] -right-[10%] w-[50vw] h-[50vw] rounded-full blur-[100px]" style={{ background: 'radial-gradient(circle, #818cf8 0%, transparent 70%)' }} />
          </div>
        )}

        <header className="h-20 border-b flex items-center justify-between px-12 z-10" style={{ borderColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}>
          <div className="flex flex-col">
            <span className="text-[10px] font-mono uppercase tracking-[0.4em] text-cyan-500 font-bold">{page.part}</span>
            <h2 className={`text-xl font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{page.label}</h2>
          </div>
          <div className="hidden md:flex items-center gap-8">
             <div className="text-right">
                <div className="text-[8px] font-mono uppercase tracking-widest opacity-30">Analytical // Context</div>
                <div className={`text-[10px] font-mono mt-0.5 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{page.subtitle}</div>
             </div>
             <div className="text-sm font-mono opacity-20">{current + 1} / {PAGES.length}</div>
          </div>
        </header>

        <div ref={contentRef} className="flex-1 overflow-y-auto scroll-smooth z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={page.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-5xl mx-auto px-12 py-24"
            >
              <Component isDarkMode={isDarkMode} />
            </motion.div>
          </AnimatePresence>
        </div>

        <footer className="h-24 border-t flex items-center justify-between px-12 z-10" style={{ borderColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}>
          <button disabled={current === 0} onClick={() => go(-1)} className={`flex items-center gap-2 px-8 py-3 rounded-2xl font-bold transition-all ${current === 0 ? 'opacity-20 cursor-not-allowed' : 'hover:bg-black/5 active:scale-95'} ${isDarkMode ? 'text-white' : 'text-slate-900'}`}><ArrowLeft size={18} /> Back</button>
          <div className="hidden sm:block text-center">
             <span className="text-[10px] font-mono uppercase tracking-widest opacity-30 block mb-1">Up Next</span>
             <span className={`text-sm font-bold opacity-70 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{current < PAGES.length - 1 ? PAGES[current + 1].label : 'Finish Module'}</span>
          </div>
          <button onClick={() => go(1)} disabled={current === PAGES.length - 1} className={`flex items-center gap-2 px-10 py-3 rounded-2xl font-black text-black transition-all active:scale-95 ${current === PAGES.length - 1 ? 'bg-slate-800 text-slate-500' : 'bg-cyan-500 shadow-xl shadow-cyan-500/20 hover:shadow-cyan-500/40'}`}>{current === PAGES.length - 1 ? 'Complete' : 'Next Step'} <ArrowRight size={18} /></button>
        </footer>
      </div>
    </div>
  );
};
