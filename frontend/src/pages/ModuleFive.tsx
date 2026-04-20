import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
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
import { S20_AIHardware } from '../components/level6/S20_AIHardware';
import { S21_PowerDesign } from '../components/level6/S21_PowerDesign';

// --- Types ---
interface Page {
  id: string;
  label: string;
  subtitle: string;
  Component: React.FC<any>;
  props?: any;
}

// ─── MEMOIZED SUB-COMPONENTS ─────────────────────────────────────────────

const DataFlux = React.memo(() => (
    <div className="absolute inset-0 overflow-hidden opacity-[0.03] pointer-events-none">
        {[...Array(6)].map((_, i) => (
            <motion.div
                key={i}
                initial={{ y: -100, x: (10 + (i * 15)) + '%' }}
                animate={{ y: '110vh' }}
                transition={{ duration: 15 + (i * 2), repeat: Infinity, ease: "linear", delay: i * 2 }}
                className="absolute text-[8px] font-mono whitespace-pre text-plasma-cyan leading-none"
            >
                {Array.from({ length: 40 }).map(() => (Math.random() > 0.5 ? '1' : '0')).join('\n')}
            </motion.div>
        ))}
    </div>
));

const TelemetryItem = React.memo(({ label, value, color }: { label: string, value: string, color: string }) => (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col items-end">
        <div className="text-[7px] font-mono opacity-20 uppercase tracking-[0.5em] mb-1.5">{label}</div>
        <div className={`text-xs font-mono font-black italic tracking-tighter ${color}`}>
            <motion.span 
              animate={{ opacity: [1, 0.5, 1], scale: [1, 1.05, 1] }} 
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
            >
              {value}
            </motion.span>
        </div>
    </motion.div>
));

const PAGES: Page[] = [
  { id: 'start', label: 'Breaking Point', subtitle: 'Traditional design fails.', Component: S00_BreakingPoint },
  { id: 'industry', label: 'Industry Risk', subtitle: 'The cost of complexity.', Component: S01_IndustryProblem },
  { id: 'crash', label: 'Cost of Bug', subtitle: 'Economic failure.', Component: S15_CostOfBug },

  { id: 'hdl-def', label: 'What is HDL?', subtitle: 'Hardware Description.', Component: S03_WhatIsHDL },
  { id: 'paradigm', label: 'Not Software', subtitle: 'Paradigm shift.', Component: S18_NotSoftware },
  { id: 'parallel', label: 'Parallel World', subtitle: 'Hardware concurrency.', Component: S10_ParallelWorld },
  { id: 'timeless', label: 'Timeless Logic', subtitle: 'Combinational nature.', Component: S11_TimelessLogic },

  { id: 'mandate', label: 'Verilog Mandate', subtitle: 'Why Verilog matters.', Component: S03a_VerilogMandate },
  { id: 'origin', label: 'Origin Story', subtitle: 'The birth of Verilog.', Component: S03b_OriginStory },

  { id: 'ladder', label: 'Ladder', subtitle: 'Abstraction levels.', Component: S02_AbstractionLadder },
  { id: 'verilog-why', label: 'Why Verilog?', subtitle: 'Verilog advantages.', Component: S04_WhyVerilog },
  { id: 'synthesis-v2', label: 'Synthesis Flow', subtitle: 'Intent translation.', Component: S13_SynthesisBreakdown },
  { id: 'ai-hardware', label: 'AI Hardware', subtitle: 'Modern Tensor Logic.', Component: S20_AIHardware },

  { id: 'vlsi-pipeline', label: 'VLSI Pipeline', subtitle: 'Design to Silicon.', Component: S05_VLSIConnection },

  { id: 'verilog-first', label: 'First Contact', subtitle: 'Writing code.', Component: S06_FirstVerilog },
  { id: 'testbench', label: 'Testbench', subtitle: 'Verification Basics.', Component: S06A_Testbench },
  { id: 'lab-sim', label: 'Testbench Lab', subtitle: 'Interactive verification.', Component: S16_TestbenchLab },

  { id: 'module-think', label: 'Modulo Thinking', subtitle: 'Encapsulation.', Component: S07_ModuleThinking },
  { id: 'fractal', label: 'Hierarchy Depth', subtitle: 'Recursive structure.', Component: S17_HierarchyDepth },
  { id: 'heartbeat', label: 'The Heartbeat', subtitle: 'Clock & Synchronization.', Component: S07b_ClockSignal },

  { id: 'wild', label: 'Common Patterns', subtitle: 'Verilog patterns.', Component: S08_SimulationVsReality },
  { id: 'power-design', label: 'Green Silicon', subtitle: 'Power & Gating logic.', Component: S21_PowerDesign },
  { id: 'destiny', label: 'FPGA vs ASIC', subtitle: 'Implementation destiny.', Component: S14_FPGAvsASIC },
  { id: 'identity', label: 'Identity Shift', subtitle: 'Conclusion.', Component: S09_IdentityShift },
  { id: 'bridge', label: 'Final Bridge', subtitle: 'The industry horizon.', Component: S19_FinalBridge },
];

const Sidebar: React.FC<{
  current: number; isDarkMode: boolean; onChange: (i: number) => void; toggleTheme: () => void;
  primary: string;
}> = ({ current, isDarkMode, onChange, toggleTheme, primary }) => {
  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const progress = ((current + 1) / PAGES.length) * 100;

  return (
    <div className={`w-[280px] h-full flex-shrink-0 border-r flex flex-col z-20 ${isDarkMode ? 'bg-black/40 backdrop-blur-3xl border-white/10' : 'bg-slate-50/80 backdrop-blur-3xl border-slate-200'}`}>
      <header className="p-8 border-b border-white/5 flex items-center gap-4">
          <motion.div 
            whileHover={{ rotate: 180, scale: 1.1 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="w-10 h-10 rounded-xl bg-plasma-cyan flex items-center justify-center text-black shadow-cyan-glow cursor-pointer"
          >
            <Activity size={20} />
          </motion.div>
          <div>
            <h2 className={`text-sm font-black tracking-tight ${textColor}`}>SILICON_BLUE</h2>
            <p className="text-[10px] uppercase font-mono tracking-widest opacity-40">Module 05</p>
          </div>
      </header>

      <nav className="p-6 flex-1 overflow-y-auto space-y-1 scrollbar-hide">
        {PAGES.map((page, idx) => {
          const isActive = current === idx;
          const isDone = idx < current;

          return (
            <React.Fragment key={page.id}>
              {/* Special divider before Verilog Mandate */}
              {page.id === 'mandate' && (
                <div className="pt-5 pb-2 px-1">
                  <div className="h-[1px] w-full mb-3" style={{ background: 'linear-gradient(90deg, transparent, #00D4FF55, transparent)' }} />
                  <div className="flex items-center gap-2">
                    <span
                      className="text-[8px] font-mono font-black uppercase tracking-[0.25em] px-2 py-0.5 rounded border"
                      style={{ color: '#00D4FF', borderColor: '#00D4FF33', background: '#00D4FF0F' }}
                    >
                      ◈ VERILOG MANDATE
                    </span>
                    <div className="h-[1px] flex-1 opacity-10" style={{ backgroundColor: '#00D4FF' }} />
                  </div>
                </div>
              )}
              <motion.button 
                whileHover={{ x: 6, backgroundColor: 'rgba(255,255,255,0.03)' }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onChange(idx)} 
                className={`w-full text-left p-3.5 rounded-2xl transition-all duration-300 flex items-center gap-4 border ${isActive ? 'bg-white/5 border-white/20 shadow-[0_0_20px_rgba(0,212,255,0.1)]' : 'border-transparent opacity-30 hover:opacity-100'}`}
              >
                <div className={`w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-[9px] font-black border transition-all ${isDone || isActive ? 'text-black' : 'opacity-20'}`} style={{ backgroundColor: (isDone || isActive) ? primary : 'transparent', borderColor: (isDone || isActive) ? primary : undefined }}>
                  {isDone ? '✓' : idx + 1}
                </div>
                <h3 className={`text-[11px] font-bold truncate ${isActive ? 'text-white' : 'text-slate-400'}`}>{page.label}</h3>
              </motion.button>
            </React.Fragment>
          );
        })}
      </nav>

      <footer className="p-8 border-t border-white/5 space-y-6 bg-black/5">
        <div className="space-y-4">
          <div className="flex justify-between items-end">
            <span className="text-[9px] font-mono uppercase tracking-[0.2em] opacity-40">Sync Progress</span>
            <span className="text-xs font-black" style={{ color: primary }}>{Math.round(progress)}%</span>
          </div>
          <div className="h-1 w-full bg-slate-900 rounded-full overflow-hidden relative">
            <motion.div 
               layoutId="progress-bar"
               animate={{ width: `${progress}%`, backgroundColor: primary }} 
               className="h-full shadow-cyan-glow relative z-10" 
            />
            <div className="absolute inset-0 bg-white/5" />
          </div>
        </div>
        <button onClick={toggleTheme} className="h-10 w-full rounded-xl border border-white/10 flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-white/5 transition-colors group">
          {isDarkMode ? <Sun size={14} className="group-hover:rotate-45 transition-transform" /> : <Moon size={14} />} {isDarkMode ? 'Interface Mode' : 'Interface Mode'}
        </button>
      </footer>
    </div>
  );
};

export const ModuleFive: React.FC = () => {
  const [current, setCurrent] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 40, damping: 25 });
  const springY = useSpring(mouseY, { stiffness: 40, damping: 25 });
  const contentRef = useRef<HTMLDivElement>(null);

  const go = useCallback((dir: number) => {
    setIsTransitioning(true);
    setTimeout(() => {
        setCurrent(c => Math.max(0, Math.min(PAGES.length - 1, c + dir)));
        setIsTransitioning(false);
    }, 150);
  }, []);

  const changeNode = (i: number) => {
    setIsTransitioning(true);
    setTimeout(() => {
        setCurrent(i);
        setIsTransitioning(false);
    }, 150);
  }

  useEffect(() => {
    contentRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }, [current]);

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      mouseX.set((e.clientX / window.innerWidth - 0.5) * 30);
      mouseY.set((e.clientY / window.innerHeight - 0.5) * 30);
    };
    window.addEventListener('mousemove', handleMouse);
    return () => window.removeEventListener('mousemove', handleMouse);
  }, [mouseX, mouseY]);

  const page = PAGES[current];
  const primary = '#00D4FF'; 
  const Component = page.Component;
  const props = page.props || {};

  return (
    <div className={`flex h-screen overflow-hidden ${isDarkMode ? 'bg-matte-obsidian text-oscilloscope-trace' : 'bg-slate-50 text-slate-900'} relative`}>
      {/* HUD Transition Flash & Glitch */}
      <AnimatePresence>
          {isTransitioning && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] pointer-events-none flex items-center justify-center"
              >
                  <div className="absolute inset-0 bg-white/5 backdrop-blur-sm" />
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.4)_50%),linear-gradient(90deg,rgba(255,0,0,0.1),rgba(0,255,0,0.05),rgba(0,0,255,0.1))] bg-[length:100%_4px,6px_100%] opacity-20" />
                  <div className="relative flex flex-col items-center gap-4">
                      <div className="h-px w-64 bg-plasma-cyan animate-pulse" />
                      <span className="micro-text text-plasma-cyan font-black tracking-[1em] animate-pulse">SIGNAL_REACQUIRING</span>
                      <div className="h-px w-64 bg-plasma-cyan animate-pulse" />
                  </div>
              </motion.div>
          )}
      </AnimatePresence>

      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          <motion.div 
            style={{ x: springX, y: springY }}
            className="absolute inset-0 bg-blueprint-grid bg-[length:70px_70px] opacity-[0.12]" 
          />
          <div className="absolute inset-0 bg-dot-grid opacity-15" />
          
          <DataFlux />

          {/* Vivid ambient glow that shifts with page */}
          <div className="absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] rounded-full blur-[80px] opacity-[0.08]" style={{ background: 'radial-gradient(circle, #00D4FF 0%, transparent 70%)' }} />
          <div className="absolute bottom-[-10%] -right-[10%] w-[55vw] h-[55vw] rounded-full blur-[60px] opacity-[0.05]" style={{ background: 'radial-gradient(circle, #FF5F1F 0%, transparent 70%)' }} />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,212,255,0.03),transparent_80%)]" />
          <div className="absolute inset-0 pointer-events-none opacity-[0.02] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.08),rgba(0,255,0,0.02),rgba(0,0,255,0.08))] bg-[length:100%_2px,3px_100%]" />
      </div>

      <Sidebar current={current} isDarkMode={isDarkMode} onChange={changeNode} toggleTheme={() => setIsDarkMode(!isDarkMode)} primary={primary} />
      
      <motion.div 
        animate={isTransitioning ? { x: [0, -2, 2, -2, 0], scale: [1, 0.99, 1] } : {}}
        className="flex-1 flex flex-col h-full overflow-hidden relative z-10"
      >
        <header className="h-16 border-b border-white/10 backdrop-blur-xl flex items-center justify-between px-10 z-10 bg-black/40">
          <div className="flex items-center gap-6">
            <motion.h2 
                key={page.label}
                initial={{ opacity: 0.5, filter: 'blur(4px)', x: -10 }}
                animate={{ opacity: 1, filter: 'blur(0px)', x: 0 }}
                className="text-lg font-black tracking-normal uppercase text-shadow-glow"
            >
                {page.label}
            </motion.h2>
            <div className="h-4 w-px bg-white/10 hidden sm:block" />
            <div className="hidden sm:flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-plasma-cyan animate-pulse shadow-[0_0_8px_rgba(0,212,255,0.8)]" />
                <span className="micro-text uppercase tracking-[0.4em] opacity-30">Active_Node // 0{current + 1}</span>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-10">
             <div className="text-right border-r pr-8 border-white/5 space-y-1">
                <div className="text-[7px] font-mono uppercase tracking-[0.4em] opacity-30 italic">Curriculum_Standard // V4.2_AI_SPEC</div>
                <div className="flex items-center justify-end gap-2">
                   <div className="h-0.5 w-8 bg-white/5 overflow-hidden rounded-full">
                      <motion.div animate={{ x: ['-100%', '100%'] }} transition={{ duration: 1.5, repeat: Infinity }} className="h-full w-full bg-plasma-cyan" />
                   </div>
                   <span className="text-[6px] font-mono uppercase text-plasma-cyan opacity-40">System_Syncing</span>
                </div>
             </div>
             <div className="text-[10px] font-mono opacity-40 tabular-nums bg-white/5 px-3 py-1 rounded-md border border-white/5 flex items-center gap-2">
                <span className="opacity-40">ADDR:</span>
                <span className="text-plasma-cyan font-bold italic">0x{current.toString(16).padStart(2, '0').toUpperCase()}</span>
             </div>
          </div>
        </header>

        <div ref={contentRef} className="flex-1 overflow-y-auto scrollbar-hide">
          <AnimatePresence mode="wait">
            <motion.div 
              key={page.id} 
              initial={{ opacity: 0, x: 30, scale: 0.99 }} 
              animate={{ opacity: 1, x: 0, scale: 1 }} 
              exit={{ opacity: 0, x: -30, scale: 0.99 }} 
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }} 
              className="max-w-[1400px] mx-auto min-h-[calc(100vh-10rem)] flex items-center justify-center p-8 md:p-16 lg:p-24"
            >
              <Component isActive={true} isDarkMode={isDarkMode} {...props} />
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="fixed right-10 top-1/2 -translate-y-1/2 hidden xl:flex flex-col gap-10 pointer-events-none z-30">
            <TelemetryItem label="NODE_LOAD" value="72.4%" color="text-plasma-cyan" />
            <TelemetryItem label="THRM_CORE" value={`${(42 + (current * 0.8)).toFixed(0)}°C`} color={current > 20 ? 'text-orange-500' : 'text-plasma-cyan'} />
            <TelemetryItem label="SYNC_ST" value="LOCKED" color="text-white/20" />
            <TelemetryItem label="LINK_RATE" value="2.4 Gb/s" color="text-plasma-cyan" />
            <div className="h-32 w-px bg-gradient-to-b from-white/5 via-plasma-cyan/20 to-transparent self-end mr-3 opacity-30" />
        </div>

        <footer className="h-20 border-t border-white/10 flex flex-col justify-center px-10 z-10 bg-black/60 backdrop-blur-2xl relative overflow-hidden group">
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-plasma-cyan/20 to-transparent" />
          
          {/* Terminal Sub-line */}
          <div className="absolute top-1 left-10 flex items-center gap-4 text-[7px] font-mono uppercase tracking-[0.3em] opacity-40 transition-opacity">
            <span className="text-plasma-cyan flex items-center gap-1"><div className="w-1 h-1 bg-plasma-cyan shadow-[0_0_4px_#00D4FF]" /> TERMINAL_LINK_0{current}: READY</span>
            <span>::</span>
            <span>PKT_RECV: 842.1</span>
            <span>::</span>
            <span className="italic">Uptime: 00:12:45</span>
          </div>

          <div className="flex items-center justify-between w-full mt-2">
          <motion.button 
            whileHover={{ x: -4, backgroundColor: 'rgba(255,255,255,0.05)' }}
            whileTap={{ scale: 0.95 }}
            disabled={current === 0} 
            onClick={() => go(-1)} 
            className={`flex items-center gap-3 px-8 py-3 rounded-[20px] font-black uppercase tracking-widest text-[9px] transition-all border border-white/10 ${current === 0 ? 'opacity-0' : 'text-white/40 hover:text-white hover:border-white/20'}`}
          >
            <ArrowLeft size={16} /> Previous Node
          </motion.button>
          
          <div className="hidden md:flex flex-col items-center gap-3">
              <div className="flex gap-2 items-center">
                {PAGES.map((_, i) => (
                    <motion.div 
                      key={i} 
                      animate={{ 
                        scale: i === current ? 1.4 : 1,
                        opacity: i === current ? 1 : i < current ? 0.5 : 0.1
                      }}
                      className={`h-1.5 rounded-full transition-all duration-300 ${i === current ? 'w-12 bg-plasma-cyan shadow-[0_0_12px_rgba(0,212,255,1)]' : 'w-2 bg-plasma-cyan'}`} 
                    />
                ))}
              </div>
              <div className="flex items-center gap-6 text-[7px] font-mono uppercase tracking-[0.6em] opacity-40">
                  <span className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-green-500 animate-pulse" />Link_Stable</span>
                  <span>|</span>
                  <span className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-plasma-cyan animate-pulse" />Sync_Active</span>
              </div>
          </div>

          <motion.button 
            whileHover={{ scale: 1.05, filter: "brightness(1.2)" }}
            whileTap={{ scale: 0.95 }}
            onClick={() => go(1)} 
            disabled={current === PAGES.length - 1} 
            className={`flex items-center gap-4 px-12 py-3 rounded-[25px] font-black uppercase tracking-[0.5em] text-[10px] transition-all duration-500 ${current === PAGES.length - 1 ? 'opacity-0' : 'text-black shadow-[0_0_30px_rgba(0,212,255,0.4)] group'}`}
            style={{ backgroundColor: primary }}
          >
            Execute Next <ArrowRight size={18} className="group-hover:translate-x-1.5 transition-transform" />
          </motion.button>
          </div>
        </footer>
      </motion.div>
    </div>
  );
};
