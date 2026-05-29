import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Moon, Sun, ArrowRight, ArrowLeft } from 'lucide-react';
import { DrawerShell, HamburgerButton } from '../components/level1/_shared/MobileDrawer';
import { useNavigate } from 'react-router-dom';

// --- Scene Components ---
import { IntroTheory, TwoVarTheory, ThreeVarTheory, FourVarTheory, GroupingRulesTheory, DontCareTheory, POSTheory } from '../components/level5/KMapTheory';
import { KMapLab } from './kmap-lab';

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
  { id: 'intro',       part: 'PART I · INTRODUCTION',         partNum: 4, label: 'Why K-Maps?',        subtitle: 'The Problem of Boolean Simplification.',       accentHex: '#06b6d4', Component: IntroTheory },
  { id: 'structure-2v',part: 'PART II · MAP CONSTRUCTION',   partNum: 4, label: '2-Variable K-Map',   subtitle: 'Step-by-step grid building & Gray Code.',          accentHex: '#0891b2', Component: TwoVarTheory },
  { id: 'structure-3v',part: 'PART II · MAP CONSTRUCTION',   partNum: 4, label: '3-Variable K-Map',   subtitle: 'Mapping three variables to an 8-cell grid.',         accentHex: '#0ea5e9', Component: ThreeVarTheory },
  { id: 'structure-4v',part: 'PART II · MAP CONSTRUCTION',   partNum: 4, label: '4-Variable K-Map',   subtitle: 'The 4×4 Matrix & complex mapping traps.',               accentHex: '#0284c7', Component: FourVarTheory },
  { id: 'rules',       part: 'PART III · RULES OF GROUPING', partNum: 4, label: 'Grouping Logic', subtitle: 'The 7 Laws of essential prime implicants.',  accentHex: '#0369a1', Component: GroupingRulesTheory },
  { id: 'dont-cares',  part: 'PART III · RULES OF GROUPING', partNum: 4, label: "Don't Care Cells",    subtitle: 'Using X to maximize simplification efficiency.',       accentHex: '#075985', Component: DontCareTheory },
  { id: 'pos',         part: 'PART IV · POS SYSTEM',         partNum: 4, label: 'Product of Sums',     subtitle: 'The mirror image: circling logical zeros.',       accentHex: '#0ea5e9', Component: POSTheory },
  { id: 'lab',         part: 'PART V · INTERACTIVE LAB',     partNum: 4, label: 'K-Map Sandbox',       subtitle: 'Interactive K-Map Optimization Laboratory.',   accentHex: '#10b981',    Component: () => <div className="mt-2 h-[80vh] w-full rounded-2xl overflow-hidden border border-white/10 shadow-[0_0_40px_rgba(0,212,255,0.15)]"><div className="w-full h-full overflow-y-auto"><KMapLab /></div></div> },
];

const getPartTheme = (part: string) => {
  if (part.includes('I ·')) return { primary: '#06b6d4', secondary: '#3b82f6', glow: 'rgba(6, 182, 212, 0.1)' };
  if (part.includes('II ·')) return { primary: '#10b981', secondary: '#14b8a6', glow: 'rgba(16, 185, 129, 0.1)' };
  if (part.includes('III ·')) return { primary: '#818cf8', secondary: '#6366f1', glow: 'rgba(129, 140, 248, 0.1)' };
  if (part.includes('IV ·')) return { primary: '#f43f5e', secondary: '#fb7185', glow: 'rgba(244, 63, 94, 0.1)' };
  if (part.includes('V ·')) return { primary: '#f59e0b', secondary: '#fbbf24', glow: 'rgba(245, 158, 11, 0.1)' };
  return { primary: '#06b6d4', secondary: '#3b82f6', glow: 'rgba(6, 182, 212, 0.1)' };
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
            <h2 className={`text-sm font-black tracking-tight ${textColor}`}>Karnaugh Maps</h2>
            <p className="text-[10px] uppercase font-mono tracking-widest font-bold transition-colors duration-500" style={{ color: theme.primary }}>Module 04</p>
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
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] transition-colors duration-500 whitespace-nowrap" style={{ color: getPartTheme(page.part).primary }}>
                      {page.part}
                    </span>
                    <div className="h-[1px] w-full opacity-10" style={{ backgroundColor: getPartTheme(page.part).primary }} />
                  </div>
                </div>
              )}
              <button 
                onClick={() => onChange(idx)} 
                className={`group relative w-full text-left p-4 rounded-2xl transition-all duration-500 flex items-start gap-4 ${isActive ? (isDarkMode ? 'border transition-colors' : 'bg-white border-slate-200 shadow-lg') : 'hover:bg-black/5 hover:translate-x-1'}`}
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

        <button onClick={toggleTheme} className={`hidden h-12 w-full rounded-2xl border flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest transition-all ${isDarkMode ? 'border-white/10 text-slate-400 hover:bg-white/5' : 'border-slate-200 text-slate-600 hover:bg-slate-100'}`}>
          {isDarkMode ? <Sun size={14} /> : <Moon size={14} />} {isDarkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
      </footer>
    </div>
  );
};

export const ModuleFour: React.FC = () => {
  const [current, setCurrent] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [navOpen, setNavOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();

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
        <Sidebar current={current} isDarkMode={isDarkMode} onChange={(i) => { setCurrent(i); setNavOpen(false); }} toggleTheme={() => setIsDarkMode(!isDarkMode)} theme={theme} />
      </DrawerShell>
      
      <div className="flex-1 flex flex-col h-full overflow-hidden relative z-10">
        <header className="h-16 lg:h-20 border-b flex items-center justify-between px-4 lg:px-12 z-10 gap-3" style={{ borderColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}>
          <div className="flex items-center gap-3 min-w-0">
            <HamburgerButton isDarkMode={isDarkMode} onClick={() => setNavOpen(true)} />
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] font-mono uppercase tracking-[0.4em] font-bold transition-colors duration-500 truncate" style={{ color: theme.primary }}>{page.part}</span>
              <h2 className="text-base lg:text-xl font-bold tracking-tight truncate">{page.label}</h2>
            </div>
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
              className="max-w-7xl mx-auto px-4 py-10 lg:px-12 lg:py-24"
            >
              <Component isActive={true} isDarkMode={isDarkMode} />
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
            onClick={() => { if (current === PAGES.length - 1) { navigate('/portal'); } else { go(1); } }}
            className="flex items-center gap-3 px-5 lg:px-10 py-3 rounded-2xl font-black text-black transition-all duration-500 active:scale-95 shadow-xl"
            style={{
              backgroundColor: theme.primary,
              boxShadow: `0 10px 30px ${theme.primary}33`
            }}
          >
            {current === PAGES.length - 1 ? 'Complete' : 'Next Step'} <ArrowRight size={18} />
          </button>
        </footer>
      </div>
    </div>
  );
};
