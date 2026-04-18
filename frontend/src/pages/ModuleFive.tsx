import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Moon, Sun, ArrowRight, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// --- Scene Components ---
import { IntroTheory, TwoVarTheory, ThreeVarTheory, FourVarTheory, GroupingRulesTheory, DontCareTheory, POSTheory } from '../components/level5/KMapTheory';

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
  { id: 'intro',       part: 'PART I · INTRODUCTION',         partNum: 5, label: 'Why K-Maps?',        subtitle: 'The Problem of Boolean Simplification.',       accentHex: '#06b6d4', Component: IntroTheory },
  { id: 'structure-2v',part: 'PART II · MAP CONSTRUCTION',   partNum: 5, label: '2-Variable K-Map',   subtitle: 'Step-by-step grid building & Gray Code.',          accentHex: '#0891b2', Component: TwoVarTheory },
  { id: 'structure-3v',part: 'PART II · MAP CONSTRUCTION',   partNum: 5, label: '3-Variable K-Map',   subtitle: 'Mapping three variables to an 8-cell grid.',         accentHex: '#0ea5e9', Component: ThreeVarTheory },
  { id: 'structure-4v',part: 'PART II · MAP CONSTRUCTION',   partNum: 5, label: '4-Variable K-Map',   subtitle: 'The 4×4 Matrix & complex mapping traps.',               accentHex: '#0284c7', Component: FourVarTheory },
  { id: 'rules',       part: 'PART III · RULES OF GROUPING', partNum: 5, label: 'Grouping Logic', subtitle: 'The 7 Laws of essential prime implicants.',  accentHex: '#0369a1', Component: GroupingRulesTheory },
  { id: 'dont-cares',  part: 'PART III · RULES OF GROUPING', partNum: 5, label: "Don't Care Cells",    subtitle: 'Using X to maximize simplification efficiency.',       accentHex: '#075985', Component: DontCareTheory },
  { id: 'pos',         part: 'PART IV · POS SYSTEM',         partNum: 5, label: 'Product of Sums',     subtitle: 'The mirror image: circling logical zeros.',       accentHex: '#0ea5e9', Component: POSTheory },
  { id: 'lab',         part: 'PART V · INTERACTIVE LAB',     partNum: 5, label: 'K-Map Sandbox',       subtitle: 'Interactive K-Map Optimization Laboratory.',   accentHex: '#10b981',    Component: () => <div className="mt-2 h-[80vh] w-full rounded-2xl overflow-hidden border border-white/10 shadow-[0_0_40px_rgba(0,212,255,0.15)]"><iframe src="http://localhost:3001" className="w-full h-full border-none" title="K-Map Lab" sandbox="allow-scripts allow-same-origin allow-forms" /></div> },
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
            <h2 className={`text-sm font-black tracking-tight ${textColor}`}>Karnaugh Maps</h2>
            <p className="text-[10px] uppercase font-mono tracking-widest text-cyan-500 font-bold">Module 05</p>
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
              <button 
                onClick={() => onChange(idx)}
                className={`group relative w-full text-left p-4 rounded-2xl transition-all duration-500 flex items-start gap-4 ${isActive ? (isDarkMode ? 'bg-cyan-500/10 border-cyan-500/30' : 'bg-white border-slate-200 shadow-lg') : 'hover:bg-black/5 hover:translate-x-1'}`}
              >
                <div className={`mt-0.5 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black border transition-all ${isDone ? 'bg-cyan-500 border-cyan-500 text-black' : isActive ? 'bg-cyan-500 border-cyan-500 text-black' : 'bg-transparent border-white/10 opacity-30'}`}>
                  {isDone ? '✓' : idx + 1}
                </div>
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

export const ModuleFive: React.FC = () => {
  const [current, setCurrent] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(true);
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
  const { Component } = page;

  return (
    <div className={`flex h-screen overflow-hidden ${isDarkMode ? 'bg-[#020100]' : 'bg-white'}`}>
      <Sidebar current={current} isDarkMode={isDarkMode} onChange={setCurrent} toggleTheme={() => setIsDarkMode(!isDarkMode)} />
      
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <header className="h-20 border-b flex items-center justify-between px-12 z-10" style={{ borderColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}>
          <div className="flex flex-col">
            <span className="text-[10px] font-mono uppercase tracking-[0.4em] text-cyan-500 font-bold">{page.part}</span>
            <h2 className="text-xl font-bold tracking-tight">{page.label}</h2>
          </div>
          <div className="hidden md:flex items-center gap-8">
             <div className="text-right">
                <div className="text-[8px] font-mono uppercase tracking-widest opacity-30">Analytical // Context</div>
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
              className="max-w-7xl mx-auto px-12 py-24"
            >
              <Component isActive={true} isDarkMode={isDarkMode} />
            </motion.div>
          </AnimatePresence>
        </div>

        <footer className="h-24 border-t flex items-center justify-between px-12 z-10" style={{ borderColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}>
          <button 
            disabled={current === 0} 
            onClick={() => go(-1)} 
            className={`flex items-center gap-2 px-8 py-3 rounded-2xl font-bold transition-all ${current === 0 ? 'opacity-20 cursor-not-allowed' : 'hover:bg-black/5 active:scale-95'}`}
          >
            <ArrowLeft size={18} /> Back
          </button>
          
          <div className="hidden sm:block text-center">
             <span className="text-[10px] font-mono uppercase tracking-widest opacity-30 block mb-1">Up Next</span>
             <span className="text-sm font-bold opacity-70">{current < PAGES.length - 1 ? PAGES[current + 1].label : 'Finish Module'}</span>
          </div>

          <button 
            onClick={() => go(1)} 
            disabled={current === PAGES.length - 1}
            className={`flex items-center gap-2 px-10 py-3 rounded-2xl font-black text-black transition-all active:scale-95 ${current === PAGES.length - 1 ? 'bg-slate-800 text-slate-500' : 'bg-cyan-500 shadow-xl shadow-cyan-500/20 hover:shadow-cyan-500/40'}`}
          >
            {current === PAGES.length - 1 ? 'Complete' : 'Next Step'} <ArrowRight size={18} />
          </button>
        </footer>
      </div>
    </div>
  );
};
