import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Moon, Sun, ArrowRight, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// --- Scene Components ---
import { S00_BreakingPoint } from '../components/level6/S00_BreakingPoint';
import { S01_IndustryProblem } from '../components/level6/S01_IndustryProblem';
import { S01b_AdoptionStats } from '../components/level6/S01b_AdoptionStats';
import { S02_AbstractionLadder } from '../components/level6/S02_AbstractionLadder';
import { S03_WhatIsHDL } from '../components/level6/S03_WhatIsHDL';
import { S03a_VerilogMandate } from '../components/level6/S03a_VerilogMandate';
import { S03b_OriginStory } from '../components/level6/S03b_OriginStory';
import { S04_WhyVerilog } from '../components/level6/S04_WhyVerilog';
import { S05_VLSIConnection } from '../components/level6/S05_VLSIConnection';
import { S05b_DieComparison } from '../components/level6/S05b_DieComparison';
import { S06_FirstVerilog } from '../components/level6/S06_FirstVerilog';
import { S06A_Testbench } from '../components/level6/S06A_Testbench';
import { S07_ModuleThinking } from '../components/level6/S07_ModuleThinking';
import { S07b_ClockSignal } from '../components/level6/S07b_ClockSignal';
import { S08_SimulationVsReality } from '../components/level6/S08_SimulationVsReality';
import { S09_IdentityShift } from '../components/level6/S09_IdentityShift';

// --- Types ---
interface Page {
  id: string;
  part: string;
  label: string;
  subtitle: string;
  Component: React.FC<any>;
}

const PAGES: Page[] = [
  { id: 'breaking-point', part: 'I · LIMITS', label: 'Manual Design', subtitle: 'The complexity wall.', Component: S00_BreakingPoint },
  { id: 'industry',       part: 'I · LIMITS', label: 'Industry Need', subtitle: 'Financial risk factors.', Component: S01_IndustryProblem },
  { id: 'adoption-stats', part: 'II · POWER', label: 'Market Power', subtitle: 'Industry adoption.', Component: S01b_AdoptionStats },
  { id: 'ladder',         part: 'II · POWER', label: 'The Ladder', subtitle: 'Modeling hierarchy.', Component: S02_AbstractionLadder },
  { id: 'what-is-verilog', part: 'III · LANGUAGE', label: 'What is Verilog?', subtitle: 'Hardware coding.', Component: S03_WhatIsHDL },
  { id: 'verilog-mandate', part: 'III · LANGUAGE', label: 'Mandate', subtitle: 'Career & Nation.', Component: S03a_VerilogMandate },
  { id: 'origin-story',   part: 'III · LANGUAGE', label: 'Language Genesis', subtitle: 'Verilog origins.', Component: S03b_OriginStory },
  { id: 'why-verilog',    part: 'IV · UTILITY', label: 'Why Verilog?', subtitle: 'System synthesis.', Component: S04_WhyVerilog },
  { id: 'structural',     part: 'IV · UTILITY', label: 'Structural Mirror', subtitle: 'Physical mapping.', Component: S06_FirstVerilog },
  { id: 'vlsi-pipeline',  part: 'V · VLSI', label: 'VLSI Pipeline', subtitle: 'The path to silicon.', Component: S05_VLSIConnection },
  { id: 'die-comparison', part: 'V · VLSI', label: 'Code to Silicon', subtitle: 'Physical artifacts.', Component: S05b_DieComparison },
  { id: 'testbench',      part: 'VI · VERIFY', label: 'The Silent Partner', subtitle: 'Verification testbenches.', Component: S06A_Testbench },
  { id: 'encapsulation',  part: 'VII · SYSTEMS', label: 'Modules & Ports', subtitle: 'Fractal design.', Component: S07_ModuleThinking },
  { id: 'heartbeat',      part: 'VII · SYSTEMS', label: 'The Heartbeat', subtitle: 'Clock & Synchronization.', Component: S07b_ClockSignal },
  { id: 'wild',           part: 'VIII · PATTERNS', label: 'Common Patterns', subtitle: 'Verilog patterns.', Component: S08_SimulationVsReality },
  { id: 'identity',       part: 'IX · ARCHITECT', label: 'Identity Shift', subtitle: 'Conclusion.', Component: S09_IdentityShift },
];

const Sidebar: React.FC<{
  current: number; isDarkMode: boolean; onChange: (i: number) => void; toggleTheme: () => void;
  primary: string;
}> = ({ current, isDarkMode, onChange, toggleTheme, primary }) => {
  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const progress = ((current + 1) / PAGES.length) * 100;

  return (
    <div className={`w-[280px] h-full flex-shrink-0 border-r flex flex-col z-20 ${isDarkMode ? 'bg-[#020100] border-white/5' : 'bg-slate-50 border-slate-200'}`}>
      <header className="p-8 border-b border-white/5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg">
            <Activity size={20} />
          </div>
          <div>
            <h2 className={`text-sm font-black tracking-tight ${textColor}`}>SILICON_BLUE</h2>
            <p className="text-[10px] uppercase font-mono tracking-widest opacity-40">Core V.06</p>
          </div>
      </header>

      <nav className="p-6 flex-1 overflow-y-auto space-y-1 scrollbar-hide">
        {PAGES.map((page, idx) => {
          const isActive = current === idx;
          const isDone = idx < current;
          const showHeader = idx === 0 || PAGES[idx - 1].part !== page.part;

          return (
            <React.Fragment key={page.id}>
              {showHeader && (
                <div className="pt-6 pb-2 px-3 text-[9px] font-black uppercase tracking-widest text-white/20 italic">
                  {page.part}
                </div>
              )}
              <button 
                onClick={() => onChange(idx)} 
                className={`w-full text-left p-3.5 rounded-2xl transition-all duration-300 flex items-center gap-4 ${isActive ? 'bg-white/5 border border-white/10 shadow-lg' : 'hover:bg-white/5 opacity-40 hover:opacity-100'}`}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-black border transition-all ${isDone || isActive ? 'text-black' : 'opacity-20'}`} style={{ backgroundColor: (isDone || isActive) ? primary : 'transparent', borderColor: (isDone || isActive) ? primary : undefined }}>
                  {isDone ? '✓' : idx + 1}
                </div>
                <h3 className={`text-[12px] font-bold truncate ${isActive ? 'text-white' : 'text-slate-400'}`}>{page.label}</h3>
              </button>
            </React.Fragment>
          );
        })}
      </nav>

      <footer className="p-8 border-t border-white/5 space-y-6">
        <div className="space-y-4">
          <div className="flex justify-between items-end">
            <span className="text-[9px] font-mono uppercase tracking-[0.2em] opacity-40">Progress</span>
            <span className="text-xs font-black" style={{ color: primary }}>{Math.round(progress)}%</span>
          </div>
          <div className="h-1 w-full bg-slate-900 rounded-full overflow-hidden">
            <motion.div animate={{ width: `${progress}%`, backgroundColor: primary }} className="h-full shadow-lg" />
          </div>
        </div>
        <button onClick={toggleTheme} className="h-10 w-full rounded-xl border border-white/10 flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-white/5 transition-colors">
          {isDarkMode ? <Sun size={14} /> : <Moon size={14} />} {isDarkMode ? 'Solar' : 'Lunar'}
        </button>
      </footer>
    </div>
  );
};

export const ModuleSix: React.FC = () => {
  const [current, setCurrent] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const contentRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const go = useCallback((dir: number) => {
    setCurrent(c => Math.max(0, Math.min(PAGES.length - 1, c + dir)));
  }, []);

  useEffect(() => {
    contentRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }, [current]);

  const page = PAGES[current];
  const primary = '#6366f1'; // Unified minimalist indigo

  return (
    <div className={`flex h-screen overflow-hidden ${isDarkMode ? 'bg-matte-obsidian text-oscilloscope-trace' : 'bg-slate-50 text-slate-900'} relative`}>
      {/* Global Engineering Aesthetics */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
         <div className="absolute inset-0 bg-dot-grid opacity-30" />
         <div className="absolute inset-0 bg-blueprint-grid bg-[length:40px_40px] opacity-20" />
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,212,255,0.03),transparent_70%)]" />
      </div>
      
      <Sidebar current={current} isDarkMode={isDarkMode} onChange={setCurrent} toggleTheme={() => setIsDarkMode(!isDarkMode)} primary={primary} />
      
      <div className="flex-1 flex flex-col h-full overflow-hidden relative z-10">
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-10 z-10">
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-30 italic">{page.part}</span>
            <h2 className="text-lg font-black tracking-tight">{page.label}</h2>
          </div>
          <div className="text-right text-[10px] font-mono opacity-20 uppercase tracking-widest">
            {current + 1} / {PAGES.length} System.V6
          </div>
        </header>

        <div ref={contentRef} className="flex-1 overflow-y-auto scroll-smooth py-8 px-6 md:px-12 lg:px-20 scrollbar-hide">
          <AnimatePresence mode="wait">
            <motion.div
              key={page.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="max-w-5xl mx-auto min-h-[calc(100vh-12rem)] flex items-center justify-center"
            >
              <page.Component isActive={true} isDarkMode={isDarkMode} isProMode={false} />
            </motion.div>
          </AnimatePresence>
        </div>

        <footer className="h-20 border-t border-white/5 flex items-center justify-between px-10 z-10">
          <button 
            disabled={current === 0} 
            onClick={() => go(-1)} 
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all text-xs ${current === 0 ? 'opacity-0' : 'hover:bg-white/5 border border-white/10'}`}
          >
            <ArrowLeft size={16} /> Back
          </button>
          
          <button 
            onClick={() => go(1)} 
            disabled={current === PAGES.length - 1} 
            className={`flex items-center gap-2 px-8 py-2.5 rounded-xl font-black uppercase tracking-widest text-xs transition-all duration-300 ${current === PAGES.length - 1 ? 'opacity-0' : 'text-black'}`}
            style={{ backgroundColor: current === PAGES.length - 1 ? 'transparent' : primary }}
          >
            Next <ArrowRight size={16} />
          </button>
        </footer>
      </div>
    </div>
  );
};
