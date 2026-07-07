import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Moon, Sun, ArrowRight, ArrowLeft } from 'lucide-react';
import { DrawerShell, HamburgerButton } from '../components/level1/_shared/MobileDrawer';
import { useNavigate, useParams } from 'react-router-dom';
import { useColorScheme } from '../hooks/useColorScheme';

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

// --- NEW Expansion Scenes (V2) ---
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
import { S20_AIHardware } from '../components/level6/S20_AIHardware';
import { S21_PowerDesign } from '../components/level6/S21_PowerDesign';

// --- Types ---
interface Page {
  id: string;
  label: string;
  subtitle: string;
  Component: React.FC<any>;
}

const PAGES: Page[] = [
  { id: 'start',         label: 'Breaking Point', subtitle: 'Traditional design fails.', Component: S00_BreakingPoint },
  { id: 'scale',          label: 'Scale Collapse', subtitle: 'Abstraction limits.', Component: S12_ScaleCollapse },
  { id: 'industry',      label: 'Industry Risk', subtitle: 'The cost of complexity.', Component: S01_IndustryProblem },
  { id: 'crash',          label: 'Cost of Bug', subtitle: 'Economic failure.', Component: S15_CostOfBug },

  { id: 'hdl-def',       label: 'What is HDL?', subtitle: 'Hardware Description.', Component: S03_WhatIsHDL },
  { id: 'paradigm',       label: 'Not Software', subtitle: 'Paradigm shift.', Component: S18_NotSoftware },
  { id: 'parallel',       label: 'Parallel World', subtitle: 'Hardware concurrency.', Component: S10_ParallelWorld },
  { id: 'timeless',       label: 'Timeless Logic', subtitle: 'Combinational nature.', Component: S11_TimelessLogic },

  { id: 'mandate',       label: 'Verilog Mandate', subtitle: 'Why Verilog matters.', Component: S03a_VerilogMandate },
  { id: 'adoption-stats', label: 'Production Power', subtitle: 'Verilog statistics.', Component: S01b_AdoptionStats },
  { id: 'origin',         label: 'Origin Story', subtitle: 'The birth of Verilog.', Component: S03b_OriginStory },

  { id: 'ladder',         label: 'Ladder', subtitle: 'Abstraction levels.', Component: S02_AbstractionLadder },
  { id: 'verilog-why',   label: 'Why Verilog?', subtitle: 'Verilog advantages.', Component: S04_WhyVerilog },
  { id: 'synthesis-v2',   label: 'Synthesis Flow', subtitle: 'Intent translation.', Component: S13_SynthesisBreakdown },

  { id: 'vlsi-pipeline', label: 'VLSI Pipeline', subtitle: 'Design to Silicon.', Component: S05_VLSIConnection },
  { id: 'die-compare',    label: 'Die Comparison', subtitle: 'Silicon area comparison.', Component: S05b_DieComparison },

  { id: 'verilog-first', label: 'First Contact', subtitle: 'Writing code.', Component: S06_FirstVerilog },
  { id: 'testbench',      label: 'Testbench', subtitle: 'Verification Basics.', Component: S06A_Testbench },
  { id: 'lab-sim',        label: 'Testbench Lab', subtitle: 'Interactive verification.', Component: S16_TestbenchLab },

  { id: 'module-think',  label: 'Modulo Thinking', subtitle: 'Encapsulation.', Component: S07_ModuleThinking },
  { id: 'fractal',        label: 'Hierarchy Depth', subtitle: 'Recursive structure.', Component: S17_HierarchyDepth },
  { id: 'heartbeat',      label: 'The Heartbeat', subtitle: 'Clock & Synchronization.', Component: S07b_ClockSignal },

  { id: 'wild',           label: 'Common Patterns', subtitle: 'Verilog patterns.', Component: S08_SimulationVsReality },
  { id: 'destiny',        label: 'FPGA vs ASIC', subtitle: 'Implementation destiny.', Component: S14_FPGAvsASIC },
  { id: 'ai-gen',         label: 'AI Hardware', subtitle: 'Matrix Engines.', Component: S20_AIHardware },
  { id: 'power-ppa',      label: 'Power Design', subtitle: 'Thermal Envelopes.', Component: S21_PowerDesign },
  { id: 'identity',       label: 'Identity Shift', subtitle: 'Conclusion.', Component: S09_IdentityShift },
  { id: 'bridge',         label: 'Final Bridge', subtitle: 'The industry horizon.', Component: S19_FinalBridge },
];

const Sidebar: React.FC<{
  current: number; isDarkMode: boolean; onChange: (i: number) => void; toggleTheme: () => void;
  primary: string;
}> = ({ current, isDarkMode, onChange, toggleTheme, primary }) => {
  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const progress = ((current + 1) / PAGES.length) * 100;

  return (
    <div className={`w-[280px] h-full flex-shrink-0 border-r flex flex-col z-20 ${isDarkMode ? 'bg-black border-white/10' : 'bg-slate-50 border-slate-200'}`}>
      <header className="p-8 border-b border-slate-200 dark:border-white/5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-plasma-cyan flex items-center justify-center text-black shadow-cyan-glow">
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

          return (
            <React.Fragment key={page.id}>
              <button 
                onClick={() => onChange(idx)} 
                className={`w-full text-left p-3.5 rounded-2xl transition-all duration-300 flex items-center gap-4 ${isActive ? 'bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-lg' : 'hover:bg-slate-100 dark:hover:bg-white/5 opacity-40 hover:opacity-100'}`}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-black border transition-all ${isDone || isActive ? 'text-black' : 'opacity-20'}`} style={{ backgroundColor: (isDone || isActive) ? primary : 'transparent', borderColor: (isDone || isActive) ? primary : undefined }}>
                  {isDone ? '✓' : idx + 1}
                </div>
                <h3 className={`text-[12px] font-bold truncate ${isActive ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>{page.label}</h3>
              </button>
            </React.Fragment>
          );
        })}
      </nav>

      <footer className="p-8 border-t border-slate-200 dark:border-white/5 space-y-6">
        <div className="space-y-4">
          <div className="flex justify-between items-end">
            <span className="text-[9px] font-mono uppercase tracking-[0.2em] opacity-40">Progress</span>
            <span className="text-xs font-black" style={{ color: primary }}>{Math.round(progress)}%</span>
          </div>
          <div className="h-1 w-full bg-slate-900 rounded-full overflow-hidden">
            <motion.div animate={{ width: `${progress}%`, backgroundColor: '#00D4FF' }} className="h-full shadow-cyan-glow" />
          </div>
        </div>
        <button onClick={toggleTheme} className="hidden h-10 w-full rounded-xl border border-white/10 flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-white/5 transition-colors">
          {isDarkMode ? <Sun size={14} /> : <Moon size={14} />} {isDarkMode ? 'Solar' : 'Lunar'}
        </button>
      </footer>
    </div>
  );
};

export const ModuleSix: React.FC = () => {
  const { index } = useParams();
  const [current, setCurrent] = useState(index ? parseInt(index) : 0);
  const [scheme, toggleTheme] = useColorScheme();
  const isDarkMode = scheme === 'dark';
  const [navOpen, setNavOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (index !== undefined) {
      const idx = parseInt(index);
      if (!isNaN(idx) && idx >= 0 && idx < PAGES.length) {
        setCurrent(idx);
      }
    }
  }, [index]);

  const go = useCallback((dir: number) => {
    const next = Math.max(0, Math.min(PAGES.length - 1, current + dir));
    navigate(`/module/6/${next}`);
  }, [current, navigate]);

  useEffect(() => {
    contentRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }, [current]);

  const page = PAGES[current];
  const primary = '#00D4FF'; // BitforBytes Plasma Cyan

  return (
    <div className={`flex h-screen overflow-hidden ${isDarkMode ? 'bg-matte-obsidian text-oscilloscope-trace' : 'bg-bg-void text-text-main'} relative`}>
      {/* Global Engineering Aesthetics */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
         {/* Background grid + glow layers removed — clean flat surface. */}
      </div>
      
      <DrawerShell open={navOpen} onClose={() => setNavOpen(false)}>
        <Sidebar
          current={current}
          isDarkMode={isDarkMode}
          onChange={(i) => { navigate(`/module/6/${i}`); setNavOpen(false); }}
          toggleTheme={toggleTheme}
          primary={primary}
        />
      </DrawerShell>
      
      <div className="flex-1 flex flex-col h-full overflow-hidden relative z-10">
        <header className="h-16 border-b border-slate-200 dark:border-white/10 flex items-center justify-between px-4 lg:px-10 z-10 bg-bg-elev gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <HamburgerButton isDarkMode={isDarkMode} onClick={() => setNavOpen(o => !o)} />
            <h2 className="text-base lg:text-lg font-black tracking-tight truncate">{page.label}</h2>
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

        {/* Tactical HUD Overlay (Floating Right) */}
        <div className="fixed right-10 top-1/2 -translate-y-1/2 hidden xl:flex flex-col gap-6 pointer-events-none z-30">
            {[
                { label: 'LOGIC_UTIL', val: '42.8%', color: 'text-plasma-cyan' },
                { label: 'THERMAL_PK', val: '54°C', color: 'text-burnished-copper' },
                { label: 'ENTROPY_LV', val: '0.002', color: 'text-slate-400 dark:text-white/20' },
                { label: 'NEURAL_ST', val: 'LOCKED', color: 'text-plasma-cyan' },
            ].map((stat, i) => (
                <motion.div 
                    key={stat.label}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1 + (i * 0.1) }}
                    className="flex flex-col items-end"
                >
                    <div className="text-[8px] font-mono opacity-20 uppercase tracking-[0.3em] mb-1">{stat.label}</div>
                    <div className={`text-sm font-mono font-black italic tracking-tighter ${stat.color}`}>
                        <motion.span 
                            animate={{ opacity: [1, 0.4, 1] }} 
                            transition={{ duration: 0.2, repeat: Infinity, repeatDelay: Math.random() * 5 }}
                        >
                            {stat.val}
                        </motion.span>
                    </div>
                </motion.div>
            ))}
            <div className="h-32 w-px bg-gradient-to-b from-white/5 via-plasma-cyan/20 to-transparent self-end mr-2" />
        </div>

        <footer className="h-20 border-t border-white/5 flex items-center justify-between px-4 lg:px-10 z-10 gap-3">
          <button
            onClick={() => { if (current === 0) { navigate('/portal'); } else { go(-1); } }}
            className="flex items-center gap-3 px-4 lg:px-8 py-3 rounded-[20px] font-black uppercase tracking-widest text-[10px] transition-all hover:bg-white/5 border border-white/10 text-white/40"
          >
            <ArrowLeft size={16} /> Previous Node
          </button>

          <div className="hidden md:flex flex-col items-center gap-2">
              <div className="flex gap-1">
                {PAGES.map((_, i) => (
                    <div key={i} className={`h-1 rounded-full transition-all duration-500 ${i === current ? 'w-8 bg-plasma-cyan shadow-cyan-glow' : i < current ? 'w-2 bg-plasma-cyan/40' : 'w-2 bg-white/5'}`} />
                ))}
              </div>
              <div className="text-[8px] font-mono opacity-20 uppercase tracking-[0.5em]">Neural Link Status: Active</div>
          </div>

          <button
            onClick={() => { if (current === PAGES.length - 1) { navigate('/portal'); } else { go(1); } }}
            className="flex items-center gap-3 px-5 lg:px-10 py-3 rounded-[20px] font-black uppercase tracking-[0.4em] text-[10px] transition-all duration-500 text-black shadow-cyan-glow group"
            style={{ backgroundColor: primary }}
          >
            {current === PAGES.length - 1 ? 'Complete' : 'Execute Next'} <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </footer>
      </div>
    </div>
  );
};
