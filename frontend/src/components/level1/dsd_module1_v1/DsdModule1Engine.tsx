import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Moon, Sun, ArrowRight, ArrowLeft, Cpu, Zap, Box } from 'lucide-react';

// Scene Imports
import { S00_Cover } from './scenes/S00_Cover';
import { S01_VideoLecture } from './scenes/S01_VideoLecture';
import { S02_PicnicPhysics } from './scenes/S02_PicnicPhysics';
import { S03_Multiverse } from './scenes/S03_Multiverse';
import { S04_PathOfJoy } from './scenes/S04_PathOfJoy';
import { S05_BuildSOP } from './scenes/S05_BuildSOP';
import { S06_PathOfCaution } from './scenes/S06_PathOfCaution';
import { S07_BuildPOS } from './scenes/S07_BuildPOS';
import { S07b_GateCircuits } from './scenes/S07b_GateCircuits';
import { S08_TwoLenses } from './scenes/S08_TwoLenses';
import { S09_LiveLab } from './scenes/S09_LiveLab';
import { S09b_KMapPreview } from './scenes/S09b_KMapPreview';
import { S11_PracticeArena } from './scenes/S11_PracticeArena';
import { S12_StrategyChallenge } from './scenes/S12_StrategyChallenge';
import { S13_BossDrill } from './scenes/S13_BossDrill';
import { S10_Conclusion } from './scenes/S10_Conclusion';

interface Page {
  id: string;
  part: string;
  label: string;
  subtitle: string;
  accent: string;
  Component: React.FC<any>;
}

const PAGES: Page[] = [
  { id: 'S00', part: 'FOUNDATION', label: 'Cover · Boolean Forms', subtitle: 'The architecture of choice.', accent: '#22d3ee', Component: S00_Cover },
  { id: 'S01', part: 'THEORY', label: 'Video Lecture', subtitle: 'The illustrated story of Ben.', accent: '#3b82f6', Component: S01_VideoLecture },
  { id: 'S02', part: 'THEORY', label: 'Picnic Physics', subtitle: 'Binary observations.', accent: '#10b981', Component: S02_PicnicPhysics },
  { id: 'S03', part: 'THEORY', label: 'The 8-Day Multiverse', subtitle: 'Truth table mapping.', accent: '#f59e0b', Component: S03_Multiverse },
  { id: 'S04', part: 'SOP DESIGN', label: 'Path of Joy', subtitle: 'Targeting the ones.', accent: '#10b981', Component: S04_PathOfJoy },
  { id: 'S05', part: 'SOP DESIGN', label: 'Building the SOP', subtitle: 'The sum of products.', accent: '#10b981', Component: S05_BuildSOP },
  { id: 'S06', part: 'POS DESIGN', label: 'Path of Caution', subtitle: 'Targeting the zeros.', accent: '#f43f5e', Component: S06_PathOfCaution },
  { id: 'S07', part: 'POS DESIGN', label: 'Building the POS', subtitle: 'The product of sums.', accent: '#f43f5e', Component: S07_BuildPOS },
  { id: 'S07b', part: 'HARDWARE', label: 'Decision Neurons', subtitle: 'Gate circuit mapping.', accent: '#a78bfa', Component: S07b_GateCircuits },
  { id: 'S08', part: 'STRATEGY', label: 'Two Lenses, One Truth', subtitle: 'Choosing the right form.', accent: '#22d3ee', Component: S08_TwoLenses },
  { id: 'S09', part: 'LAB', label: 'Live Lab', subtitle: 'Area-constrained design.', accent: '#06b6d4', Component: S09_LiveLab },
  { id: 'S09b', part: 'NEXT STEPS', label: 'K-Map Preview', subtitle: 'Advanced reduction.', accent: '#f59e0b', Component: S09b_KMapPreview },
  { id: 'S11', part: 'ASSESSMENT', label: 'Practice Arena', subtitle: 'Engineering audit.', accent: '#10b981', Component: S11_PracticeArena },
  { id: 'S12', part: 'ASSESSMENT', label: 'The Strategy Trap', subtitle: 'Pattern intuition.', accent: '#f43f5e', Component: S12_StrategyChallenge },
  { id: 'S13', part: 'CLIMAX', label: 'The Boss Drill', subtitle: 'Zero-latency recall.', accent: '#d946ef', Component: S13_BossDrill },
  { id: 'S10', part: 'CONCLUSION', label: 'Mission Complete', subtitle: 'Deploy to hardware.', accent: '#3b82f6', Component: S10_Conclusion },
];

const getPartTheme = (part: string) => {
  if (part.includes('THEORY')) return { primary: '#3b82f6', secondary: '#1d4ed8', glow: 'rgba(59, 130, 246, 0.1)' };
  if (part.includes('SOP')) return { primary: '#10b981', secondary: '#059669', glow: 'rgba(16, 185, 129, 0.1)' };
  if (part.includes('POS')) return { primary: '#f43f5e', secondary: '#e11d48', glow: 'rgba(244, 63, 94, 0.1)' };
  if (part.includes('HARDWARE')) return { primary: '#a78bfa', secondary: '#8b5cf6', glow: 'rgba(167, 139, 250, 0.1)' };
  if (part.includes('STRATEGY')) return { primary: '#22d3ee', secondary: '#0891b2', glow: 'rgba(34, 211, 238, 0.1)' };
  if (part.includes('LAB')) return { primary: '#06b6d4', secondary: '#0891b2', glow: 'rgba(6, 182, 212, 0.1)' };
  if (part.includes('CLIMAX')) return { primary: '#d946ef', secondary: '#c026d3', glow: 'rgba(217, 70, 239, 0.1)' };
  return { primary: '#22d3ee', secondary: '#3b82f6', glow: 'rgba(34, 211, 238, 0.1)' };
};

const Sidebar: React.FC<{
  current: number; isDarkMode: boolean; onChange: (i: number) => void; toggleTheme: () => void;
  theme: { primary: string; secondary: string; glow: string };
}> = ({ current, isDarkMode, onChange, toggleTheme, theme }) => {
  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const borderColor = isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';
  const progress = ((current + 1) / PAGES.length) * 100;

  return (
    <div className={`w-[320px] h-full flex-shrink-0 border-r flex flex-col z-20 transition-all duration-700 relative ${isDarkMode ? 'bg-[#040200]/40 backdrop-blur-md' : 'bg-slate-50/40 backdrop-blur-md'}`} style={{ borderColor }}>
      <header className="p-10 border-b" style={{ borderColor }}>
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500 flex items-center justify-center text-black">
            <Activity size={20} />
          </div>
          <div>
            <h2 className={`text-sm font-black tracking-tight ${textColor}`}>Digital Logic</h2>
            <p className="text-[10px] uppercase font-mono tracking-widest font-bold transition-colors duration-500" style={{ color: theme.primary }}>Module 01</p>
          </div>
        </div>
      </header>
      <nav className="p-8 flex-1 overflow-y-auto space-y-1 scrollbar-hide">
        {PAGES.map((page, idx) => {
          const isActive = current === idx;
          const isDone = idx < current;
          const showHeader = idx === 0 || PAGES[idx - 1].part !== page.part;
          return (
            <React.Fragment key={page.id}>
              {showHeader && (
                <div className="pt-8 pb-3 px-4 first:pt-0">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40" style={{ color: theme.primary }}>
                    {page.part}
                  </span>
                </div>
              )}
              <button 
                onClick={() => onChange(idx)} 
                className={`w-full text-left p-4 rounded-2xl transition-all duration-500 flex items-center gap-4 group relative overflow-hidden`}
                style={{ 
                  backgroundColor: isActive && isDarkMode ? theme.glow : undefined,
                  borderColor: isActive && isDarkMode ? `${theme.primary}33` : 'transparent'
                }}
              >
                <div 
                  className={`mt-0.5 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black border transition-all duration-500 ${isDone || isActive ? 'text-black' : 'bg-transparent border-white/10 opacity-30'}`}
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
            </React.Fragment>
          );
        })}
      </nav>
      <footer className="p-10 border-t space-y-6" style={{ borderColor }}>
        <div className="space-y-4">
          <div className="flex justify-between items-end">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] opacity-40">Progress</span>
            <span className="text-sm font-black transition-colors duration-500" style={{ color: theme.primary }}>{Math.round(progress)}%</span>
          </div>
          <div className="h-1 w-full bg-slate-900 rounded-full overflow-hidden">
            <motion.div 
              animate={{ width: `${progress}%`, backgroundColor: theme.primary }} 
              className="h-full shadow-[0_0_10px_rgba(0,0,0,0.5)]" 
              style={{ boxShadow: `0 0 10px ${theme.primary}` }}
            />
          </div>
        </div>
        <button onClick={toggleTheme} className={`h-12 w-full rounded-2xl border flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest transition-all ${isDarkMode ? 'border-white/10 text-slate-400 hover:bg-white/5' : 'border-slate-200 text-slate-600 hover:bg-slate-100'}`}>{isDarkMode ? <Sun size={14} /> : <Moon size={14} />} {isDarkMode ? 'Light Mode' : 'Dark Mode'}</button>
      </footer>
    </div>
  );
};

export const DsdModule1Engine: React.FC<{
  isDarkMode: boolean; onThemeToggle: () => void;
}> = ({ isDarkMode, onThemeToggle }) => {
  const [current, setCurrent] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);

  const go = useCallback((dir: number) => {
    setCurrent(c => Math.max(0, Math.min(PAGES.length - 1, c + dir)));
  }, []);

  useEffect(() => { contentRef.current?.scrollTo({ top: 0, behavior: 'smooth' }); }, [current]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
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
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <motion.div
          animate={{ background: `radial-gradient(circle, ${theme.primary} 0%, transparent 70%)` }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
          className={`absolute -top-[10%] -left-[10%] w-[70vw] h-[70vw] rounded-full blur-[120px] ${isDarkMode ? 'opacity-[0.15]' : 'opacity-[0.06]'}`}
        />
        <motion.div
          animate={{ background: `radial-gradient(circle, ${theme.secondary} 0%, transparent 70%)` }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
          className={`absolute bottom-[0%] -right-[10%] w-[60vw] h-[60vw] rounded-full blur-[100px] ${isDarkMode ? 'opacity-[0.15]' : 'opacity-[0.05]'}`}
        />
      </div>

      <Sidebar current={current} isDarkMode={isDarkMode} onChange={setCurrent} toggleTheme={onThemeToggle} theme={theme} />
      
      <div className="flex-1 flex flex-col h-full overflow-hidden relative z-10">
        <header className="h-20 border-b flex items-center justify-between px-12 z-10" style={{ borderColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}>
          <div className="flex flex-col">
            <span className="text-[10px] font-mono uppercase tracking-[0.4em] font-bold transition-colors duration-500" style={{ color: theme.primary }}>{page.part}</span>
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
              <Component isActive={true} isDarkMode={isDarkMode} />
            </motion.div>
          </AnimatePresence>
        </div>

        <footer className="h-24 border-t flex items-center justify-between px-12 z-10" style={{ borderColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}>
          <button disabled={current === 0} onClick={() => go(-1)} className={`flex items-center gap-2 px-8 py-3 rounded-2xl font-bold transition-all ${current === 0 ? 'opacity-20 cursor-not-allowed' : 'hover:bg-black/5 active:scale-95'} ${isDarkMode ? 'text-white' : 'text-slate-900'}`}><ArrowLeft size={18} /> Back</button>
          <div className="hidden sm:block text-center">
             <span className="text-[10px] font-mono uppercase tracking-widest opacity-30 block mb-1">Up Next</span>
             <span className={`text-sm font-bold opacity-70 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{current < PAGES.length - 1 ? PAGES[current + 1].label : 'Finish Module'}</span>
          </div>
          <button 
            onClick={() => go(1)} 
            disabled={current === PAGES.length - 1} 
            className={`flex items-center gap-2 px-10 py-3 rounded-2xl font-black text-black transition-all duration-500 active:scale-95 ${current === PAGES.length - 1 ? 'bg-slate-800 text-slate-500' : 'shadow-xl'}`}
            style={{ 
              backgroundColor: current === PAGES.length - 1 ? undefined : theme.primary,
              boxShadow: current === PAGES.length - 1 ? undefined : `0 10px 30px ${theme.primary}33`
            }}
          >
            {current === PAGES.length - 1 ? 'Complete' : 'Next Step'} <ArrowRight size={18} />
          </button>
        </footer>
      </div>
    </div>
  );
};

export default DsdModule1Engine;
