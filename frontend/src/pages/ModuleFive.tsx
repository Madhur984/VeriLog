import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChapterTransition } from '../components/level6/common/ChapterTransition';
import { Activity, Moon, Sun, ArrowRight, ArrowLeft } from 'lucide-react';

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
import { S10_ParallelWorld } from '../components/level6/S10_ParallelWorld';
import { S11_TimelessLogic } from '../components/level6/S11_TimelessLogic';
import { S12_ScaleCollapse } from '../components/level6/S12_ScaleCollapse';
import { S13_SynthesisBreakdown } from '../components/level6/S13_SynthesisBreakdown';
import { S14_FPGAvsASIC } from '../components/level6/S14_FPGAvsASIC';
import { S15_CostOfBug } from '../components/level6/S15_CostOfBug';
import { S16_TestbenchLab } from '../components/level6/S16_TestbenchLab';
import { S17_HierarchyDepth } from '../components/level6/S17_HierarchyDepth';
import { S18_NotSoftware } from '../components/level6/S18_NotSoftware';
import { S19_FinalBridge } from '../components/level6/S19_FinalBridge';

// --- Types ---
interface Page {
  id: string;
  part: string;
  label: string;
  subtitle: string;
  Component: React.FC<any>;
  props?: any;
}

const PAGES: Page[] = [
  { id: 'ch1', part: 'PART I · THE WALL', label: 'THE WALL', subtitle: 'The limits of manual design.', Component: ChapterTransition, props: { chapter: "01", title: "The Wall" } },
  { id: 'start', part: 'PART I · THE WALL', label: 'Breaking Point', subtitle: 'Traditional design fails.', Component: S00_BreakingPoint },
  { id: 'scale', part: 'PART I · THE WALL', label: 'Scale Collapse', subtitle: 'Abstraction limits.', Component: S12_ScaleCollapse },
  { id: 'industry', part: 'PART I · THE WALL', label: 'Industry Risk', subtitle: 'The cost of complexity.', Component: S01_IndustryProblem },
  { id: 'crash', part: 'PART I · THE WALL', label: 'Cost of Bug', subtitle: 'Economic failure.', Component: S15_CostOfBug },

  { id: 'ch2', part: 'PART II · CORE', label: 'THE ESSENCE', subtitle: 'The HDL mental model.', Component: ChapterTransition, props: { chapter: "02", title: "The Essence" } },
  { id: 'hdl-def', part: 'PART II · CORE', label: 'What is HDL?', subtitle: 'Hardware Description.', Component: S03_WhatIsHDL },
  { id: 'paradigm', part: 'PART II · CORE', label: 'Not Software', subtitle: 'Paradigm shift.', Component: S18_NotSoftware },
  { id: 'parallel', part: 'PART II · CORE', label: 'Parallel World', subtitle: 'Hardware concurrency.', Component: S10_ParallelWorld },
  { id: 'timeless', part: 'PART II · CORE', label: 'Timeless Logic', subtitle: 'Combinational nature.', Component: S11_TimelessLogic },

  { id: 'ch3', part: 'PART III · MISSION', label: 'THE MANDATE', subtitle: 'The national imperative.', Component: ChapterTransition, props: { chapter: "03", title: "The Mandate" } },
  { id: 'mandate', part: 'PART III · MISSION', label: 'Verilog Mandate', subtitle: 'Why Verilog matters.', Component: S03a_VerilogMandate },
  { id: 'adoption-stats', part: 'PART III · MISSION', label: 'Production Power', subtitle: 'Verilog statistics.', Component: S01b_AdoptionStats },
  { id: 'origin', part: 'PART III · MISSION', label: 'Origin Story', subtitle: 'The birth of Verilog.', Component: S03b_OriginStory },

  { id: 'ch4', part: 'PART IV · PROCESS', label: 'THE DESCENT', subtitle: 'How code becomes silicon.', Component: ChapterTransition, props: { chapter: "04", title: "The Descent" } },
  { id: 'ladder', part: 'PART IV · PROCESS', label: 'Ladder', subtitle: 'Abstraction levels.', Component: S02_AbstractionLadder },
  { id: 'verilog-why', part: 'PART IV · PROCESS', label: 'Why Verilog?', subtitle: 'Verilog advantages.', Component: S04_WhyVerilog },
  { id: 'synthesis-v2', part: 'PART IV · PROCESS', label: 'Synthesis Flow', subtitle: 'Intent translation.', Component: S13_SynthesisBreakdown },

  { id: 'ch5', part: 'PART V · FAB', label: 'THE FACTORY', subtitle: 'The VLSI pipeline.', Component: ChapterTransition, props: { chapter: "05", title: "The Factory" } },
  { id: 'vlsi-pipeline', part: 'PART V · FAB', label: 'VLSI Pipeline', subtitle: 'Design to Silicon.', Component: S05_VLSIConnection },
  { id: 'die-compare', part: 'PART V · FAB', label: 'Die Comparison', subtitle: 'Silicon area comparison.', Component: S05b_DieComparison },

  { id: 'ch6', part: 'PART VI · VIGILANCE', label: 'THE GUARDIAN', subtitle: 'Verification is design.', Component: ChapterTransition, props: { chapter: "06", title: "The Guardian" } },
  { id: 'verilog-first', part: 'PART VI · VIGILANCE', label: 'First Contact', subtitle: 'Writing code.', Component: S06_FirstVerilog },
  { id: 'testbench', part: 'PART VI · VIGILANCE', label: 'Testbench', subtitle: 'Verification Basics.', Component: S06A_Testbench },
  { id: 'lab-sim', part: 'PART VI · VIGILANCE', label: 'Testbench Lab', subtitle: 'Interactive verification.', Component: S16_TestbenchLab },

  { id: 'ch7', part: 'PART VII · STRATA', label: 'THE ARCHITECTURE', subtitle: 'Modular systems.', Component: ChapterTransition, props: { chapter: "07", title: "The Architecture" } },
  { id: 'module-think', part: 'PART VII · STRATA', label: 'Modulo Thinking', subtitle: 'Encapsulation.', Component: S07_ModuleThinking },
  { id: 'fractal', part: 'PART VII · STRATA', label: 'Hierarchy Depth', subtitle: 'Recursive structure.', Component: S17_HierarchyDepth },
  { id: 'heartbeat', part: 'PART VII · STRATA', label: 'The Heartbeat', subtitle: 'Clock & Synchronization.', Component: S07b_ClockSignal },

  { id: 'ch8', part: 'PART VIII · EPILOGUE', label: 'THE SHIFT', subtitle: 'Becoming an architect.', Component: ChapterTransition, props: { chapter: "08", title: "The Shift" } },
  { id: 'wild', part: 'PART VIII · EPILOGUE', label: 'Common Patterns', subtitle: 'Verilog patterns.', Component: S08_SimulationVsReality },
  { id: 'destiny', part: 'PART VIII · EPILOGUE', label: 'FPGA vs ASIC', subtitle: 'Implementation destiny.', Component: S14_FPGAvsASIC },
  { id: 'identity', part: 'PART VIII · EPILOGUE', label: 'Identity Shift', subtitle: 'Conclusion.', Component: S09_IdentityShift },
  { id: 'bridge', part: 'PART VIII · EPILOGUE', label: 'Final Bridge', subtitle: 'The industry horizon.', Component: S19_FinalBridge },
];

const getPartTheme = (part: string) => {
  if (part.includes('I ·')) return { primary: '#00D4FF', secondary: '#0055FF', glow: 'rgba(0, 212, 255, 0.1)' };
  if (part.includes('II ·')) return { primary: '#10b981', secondary: '#059669', glow: 'rgba(16, 185, 129, 0.1)' };
  if (part.includes('III ·')) return { primary: '#8b5cf6', secondary: '#7c3aed', glow: 'rgba(139, 92, 246, 0.1)' };
  if (part.includes('IV ·')) return { primary: '#06b6d4', secondary: '#0891b2', glow: 'rgba(6, 182, 212, 0.1)' };
  if (part.includes('V ·')) return { primary: '#f43f5e', secondary: '#e11d48', glow: 'rgba(244, 63, 94, 0.1)' };
  if (part.includes('VI ·')) return { primary: '#14b8a6', secondary: '#0d9488', glow: 'rgba(20, 184, 166, 0.1)' };
  if (part.includes('VII ·')) return { primary: '#6366f1', secondary: '#4f46e5', glow: 'rgba(99, 102, 241, 0.1)' };
  return { primary: '#00D4FF', secondary: '#0055FF', glow: 'rgba(0, 212, 255, 0.1)' };
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
          <div className="w-10 h-10 rounded-2xl bg-plasma-cyan flex items-center justify-center text-black shadow-cyan-glow">
            <Activity size={20} />
          </div>
          <div>
            <h2 className={`text-sm font-black tracking-tight ${textColor}`}>SILICON_BLUE</h2>
            <p className="text-[10px] uppercase font-mono tracking-widest font-bold transition-colors duration-500" style={{ color: theme.primary }}>Module 05</p>
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
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] transition-colors duration-500 whitespace-nowrap" style={{ color: theme.primary }}>
                      {page.part}
                    </span>
                    <div className="h-[1px] w-full opacity-10" style={{ backgroundColor: theme.primary }} />
                  </div>
                </div>
              )}
              <button onClick={() => onChange(idx)} 
                className={`group relative w-full text-left p-4 rounded-2xl transition-all duration-500 flex items-start gap-4 ${isActive ? (isDarkMode ? 'border transition-colors' : 'bg-white border-slate-200 shadow-lg') : 'hover:bg-black/5 hover:translate-x-1'}`}
                style={{ backgroundColor: isActive && isDarkMode ? theme.glow : undefined, borderColor: isActive && isDarkMode ? `${theme.primary}33` : 'transparent' }}>
                <div className={`mt-0.5 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black border transition-all duration-500 ${isDone || isActive ? 'text-black' : 'bg-transparent border-white/10 opacity-30'}`}
                  style={{ backgroundColor: (isDone || isActive) ? theme.primary : 'transparent', borderColor: (isDone || isActive) ? theme.primary : undefined }}>
                  {isDone ? '✓' : idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className={`text-[13px] font-bold truncate transition-colors duration-500 ${isActive ? '' : isDarkMode ? 'text-slate-400' : 'text-slate-600'}`} style={{ color: isActive ? theme.primary : undefined }}>{page.label}</h3>
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
            <motion.div animate={{ width: `${progress}%`, backgroundColor: theme.primary }} className="h-full shadow-cyan-glow" />
          </div>
        </div>
        <button onClick={toggleTheme} className={`h-12 w-full rounded-2xl border flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest transition-all ${isDarkMode ? 'border-white/10 text-slate-400 hover:bg-white/5' : 'border-slate-200 text-slate-600 hover:bg-slate-100'}`}>
          {isDarkMode ? <Sun size={14} /> : <Moon size={14} />} {isDarkMode ? 'Solar' : 'Lunar'}
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
  const theme = getPartTheme(page.part);
  const Component = page.Component;
  const props = page.props || {};

  return (
    <div className={`flex h-screen overflow-hidden transition-colors duration-700 relative ${isDarkMode ? 'bg-[#020100]' : 'bg-white'}`}>
      {isDarkMode && (
        <div className="absolute inset-0 pointer-events-none opacity-[0.15] overflow-hidden z-0">
          <motion.div animate={{ background: `radial-gradient(circle, ${theme.primary} 0%, transparent 70%)` }} className="absolute -top-[10%] -left-[10%] w-[70vw] h-[70vw] rounded-full blur-[120px]" />
          <motion.div animate={{ background: `radial-gradient(circle, ${theme.secondary} 0%, transparent 70%)` }} className="absolute bottom-[0%] -right-[10%] w-[60vw] h-[60vw] rounded-full blur-[100px]" />
        </div>
      )}
      <Sidebar current={current} isDarkMode={isDarkMode} onChange={setCurrent} toggleTheme={() => setIsDarkMode(!isDarkMode)} theme={theme} />
      <div className="flex-1 flex flex-col h-full overflow-hidden relative z-10">
        <header className="h-20 border-b flex items-center justify-between px-12 z-10" style={{ borderColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}>
          <div className="flex flex-col">
            <span className="text-[10px] font-mono uppercase tracking-[0.4em] font-bold transition-colors duration-500" style={{ color: theme.primary }}>{page.part}</span>
            <h2 className="text-xl font-bold tracking-tight">{page.label}</h2>
          </div>
          <div className="hidden md:flex items-center gap-8">
             <div className="text-right border-r pr-8 border-white/5">
                <div className="text-[8px] font-mono uppercase tracking-widest opacity-30">Verilog // Engine</div>
                <div className="text-[10px] font-mono mt-0.5">{page.subtitle}</div>
             </div>
             <div className="text-sm font-mono opacity-20">{current + 1} / {PAGES.length}</div>
          </div>
        </header>

        <div ref={contentRef} className="flex-1 overflow-y-auto scroll-smooth py-8 px-6 md:px-12 lg:px-20">
          <AnimatePresence mode="wait">
            <motion.div key={page.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }} className="max-w-7xl mx-auto min-h-[calc(100vh-12rem)] flex items-center justify-center">
              <Component isActive={true} isDarkMode={isDarkMode} {...props} />
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="fixed right-10 top-1/2 -translate-y-1/2 hidden xl:flex flex-col gap-6 pointer-events-none z-30">
            {[
                { label: 'LOGIC_UTIL', val: '42.8%', color: theme.primary },
                { label: 'THERMAL_PK', val: '54°C', color: '#B45309' },
                { label: 'ENTROPY_LV', val: '0.002', color: 'text-white/20' },
                { label: 'NEURAL_ST', val: 'LOCKED', color: theme.primary },
            ].map((stat, i) => (
                <motion.div key={stat.label} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1 + (i * 0.1) }} className="flex flex-col items-end">
                    <div className="text-[8px] font-mono opacity-20 uppercase tracking-[0.3em] mb-1">{stat.label}</div>
                    <div className="text-sm font-mono font-black tracking-tighter" style={{ color: stat.color }}>
                        <motion.span animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 0.2, repeat: Infinity, repeatDelay: Math.random() * 5 }}>{stat.val}</motion.span>
                    </div>
                </motion.div>
            ))}
            <div className="h-32 w-px bg-gradient-to-b from-white/5 via-plasma-cyan/20 to-transparent self-end mr-2" />
        </div>

        <footer className="h-24 border-t flex items-center justify-between px-12 z-10" style={{ borderColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}>
          <button disabled={current === 0} onClick={() => go(-1)} className={`flex items-center gap-2 px-8 py-3 rounded-2xl font-bold transition-all ${current === 0 ? 'opacity-20 cursor-not-allowed' : 'hover:bg-black/5 active:scale-95'}`}>
            <ArrowLeft size={18} /> Previous Node
          </button>
          <div className="hidden sm:block text-center flex-1">
             <div className="flex gap-1 justify-center mb-2">
                {PAGES.map((_, i) => (
                    <div key={i} className={`h-1 rounded-full transition-all duration-500 ${i === current ? 'w-8 shadow-cyan-glow' : i < current ? 'w-2 opacity-40' : 'w-2 opacity-10'}`} style={{ backgroundColor: theme.primary }} />
                ))}
             </div>
             <span className="text-[10px] font-mono uppercase tracking-[0.3em] font-black opacity-30">Gate Synthesis Engine</span>
          </div>
          <button onClick={() => go(1)} disabled={current === PAGES.length - 1} className={`flex items-center gap-3 px-10 py-3 rounded-2xl font-black text-black transition-all duration-500 active:scale-95 ${current === PAGES.length - 1 ? 'opacity-0' : 'shadow-xl group'}`}
            style={{ backgroundColor: current === PAGES.length - 1 ? undefined : theme.primary, boxShadow: current === PAGES.length - 1 ? undefined : `0 10px 30px ${theme.primary}33` }}>
            Execute Next <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </footer>
      </div>
    </div>
  );
};
