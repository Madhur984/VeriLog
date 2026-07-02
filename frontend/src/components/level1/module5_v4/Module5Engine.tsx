import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, Moon, Sun, ArrowRight, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DrawerShell, HamburgerButton } from '../_shared/MobileDrawer';

// --- Scene Components (clean study-focused Verilog scenes) ---
import {
  SceneWhatIsHDL,
  SceneNotSoftware,
  SceneOriginStory,
  SceneFirstVerilog,
  SceneModuleThinking,
  SceneHierarchy,
  SceneParallel,
  SceneCombinational,
  SceneWhatIsClock,
  SceneEdgeVsLevel,
  ScenePosedge,
  SceneFlipFlopParts,
  SceneResetPreset,
  SceneTestbench,
  SceneTestbenchLab,
  SceneSimVsReal,
  SceneSynthesis,
  SceneIdentity,
} from './scenes/Scenes';

interface Page {
  id: string;
  part: string;
  partNum: number;
  label: string;
  subtitle: string;
  accentHex: string;
  Component: React.FC<any>;
}

// ─── CURRICULUM ────────────────────────────────────────────────────────────────
// L5 · Verilog Core: focused HDL fundamentals - concept → write → time → verify → bridge
const PAGES: Page[] = [
  // PART I · LANGUAGE FOUNDATION - Why a Hardware Description Language exists
  {
    id: 'what-is-hdl', part: 'PART I · LANGUAGE FOUNDATION', partNum: 1,
    label: 'What is HDL?',
    subtitle: 'Describing hardware as code: the central premise.',
    accentHex: '#06b6d4',
    Component: SceneWhatIsHDL,
  },
  {
    id: 'not-software', part: 'PART I · LANGUAGE FOUNDATION', partNum: 1,
    label: 'HDL is Not Software',
    subtitle: 'Why HDL semantics differ from procedural code.',
    accentHex: '#06b6d4',
    Component: SceneNotSoftware,
  },
  {
    id: 'origin-story', part: 'PART I · LANGUAGE FOUNDATION', partNum: 1,
    label: 'Origin of Verilog',
    subtitle: 'Gateway Design (1984) → IEEE 1364 standard.',
    accentHex: '#06b6d4',
    Component: SceneOriginStory,
  },

  // PART II · WRITING VERILOG - Module syntax, encapsulation, hierarchy
  {
    id: 'first-verilog', part: 'PART II · WRITING VERILOG', partNum: 2,
    label: 'First Verilog Module',
    subtitle: 'module / endmodule, ports, wires, and assignments.',
    accentHex: '#10b981',
    Component: SceneFirstVerilog,
  },
  {
    id: 'module-thinking', part: 'PART II · WRITING VERILOG', partNum: 2,
    label: 'Module Thinking',
    subtitle: 'Encapsulation: black-box interfaces, internal logic.',
    accentHex: '#10b981',
    Component: SceneModuleThinking,
  },
  {
    id: 'hierarchy', part: 'PART II · WRITING VERILOG', partNum: 2,
    label: 'Hierarchical Design',
    subtitle: 'Composing modules: instances, ports, parameters.',
    accentHex: '#10b981',
    Component: SceneHierarchy,
  },

  // PART III · BEHAVIOR & TIMING - concurrent execution, combinational vs sequential, clocks
  {
    id: 'parallel', part: 'PART III · BEHAVIOR & TIMING', partNum: 3,
    label: 'Parallel Execution',
    subtitle: 'Hardware runs concurrently - every always block runs at once.',
    accentHex: '#a78bfa',
    Component: SceneParallel,
  },
  {
    id: 'combinational', part: 'PART III · BEHAVIOR & TIMING', partNum: 3,
    label: 'Combinational Logic',
    subtitle: 'Pure function of inputs: assign and always @(*).',
    accentHex: '#a78bfa',
    Component: SceneCombinational,
  },
  {
    id: 'what-is-clock', part: 'PART III · BEHAVIOR & TIMING', partNum: 3,
    label: 'What is a Clock?',
    subtitle: 'Period, frequency, duty cycle, and the two edges.',
    accentHex: '#a78bfa',
    Component: SceneWhatIsClock,
  },
  {
    id: 'edge-vs-level', part: 'PART III · BEHAVIOR & TIMING', partNum: 3,
    label: 'Edge vs Level Triggering',
    subtitle: 'Latches are transparent; flip-flops sample on an edge.',
    accentHex: '#a78bfa',
    Component: SceneEdgeVsLevel,
  },
  {
    id: 'posedge', part: 'PART III · BEHAVIOR & TIMING', partNum: 3,
    label: 'Positive Edge Triggering',
    subtitle: 'always @(posedge clk) - sample on the rising edge.',
    accentHex: '#a78bfa',
    Component: ScenePosedge,
  },
  {
    id: 'ff-parts', part: 'PART III · BEHAVIOR & TIMING', partNum: 3,
    label: 'Anatomy of a D Flip-Flop',
    subtitle: 'Master-slave latch pair, setup and hold timing.',
    accentHex: '#a78bfa',
    Component: SceneFlipFlopParts,
  },
  {
    id: 'reset-preset', part: 'PART III · BEHAVIOR & TIMING', partNum: 3,
    label: 'Reset · Clear · Preset',
    subtitle: 'Synchronous vs asynchronous control inputs.',
    accentHex: '#a78bfa',
    Component: SceneResetPreset,
  },

  // PART IV · VERIFICATION - testbenches, simulation, the gap to silicon
  {
    id: 'testbench', part: 'PART IV · VERIFICATION', partNum: 4,
    label: 'Testbench Basics',
    subtitle: 'Stimulus, expected values, $monitor, $display.',
    accentHex: '#f59e0b',
    Component: SceneTestbench,
  },
  {
    id: 'testbench-lab', part: 'PART IV · VERIFICATION', partNum: 4,
    label: 'Testbench Lab',
    subtitle: 'Hands-on: drive a DUT and inspect waveforms.',
    accentHex: '#f59e0b',
    Component: SceneTestbenchLab,
  },
  {
    id: 'sim-vs-real', part: 'PART IV · VERIFICATION', partNum: 4,
    label: 'Simulation vs Reality',
    subtitle: 'What simulators model - and what they miss.',
    accentHex: '#f59e0b',
    Component: SceneSimVsReal,
  },

  // PART V · GATEWAY - RTL → Gates and the engineer's mindset
  {
    id: 'synthesis', part: 'PART V · GATEWAY', partNum: 5,
    label: 'Synthesis Flow',
    subtitle: 'Translating RTL to a netlist of physical gates.',
    accentHex: '#f43f5e',
    Component: SceneSynthesis,
  },
  {
    id: 'identity', part: 'PART V · GATEWAY', partNum: 5,
    label: 'The Engineer Mindset',
    subtitle: 'Closing thought: thinking in hardware, not code.',
    accentHex: '#f43f5e',
    Component: SceneIdentity,
  },
];

const getPartTheme = (part: string) => {
  if (part.includes('I ·')) return { primary: '#06b6d4', secondary: '#3b82f6', glow: 'rgba(6, 182, 212, 0.1)' };
  if (part.includes('II ·')) return { primary: '#10b981', secondary: '#14b8a6', glow: 'rgba(16, 185, 129, 0.1)' };
  if (part.includes('III ·')) return { primary: '#a78bfa', secondary: '#8b5cf6', glow: 'rgba(167, 139, 250, 0.1)' };
  if (part.includes('IV ·')) return { primary: '#f59e0b', secondary: '#fbbf24', glow: 'rgba(245, 158, 11, 0.1)' };
  if (part.includes('V ·')) return { primary: '#f43f5e', secondary: '#fb7185', glow: 'rgba(244, 63, 94, 0.1)' };
  return { primary: '#06b6d4', secondary: '#3b82f6', glow: 'rgba(6, 182, 212, 0.1)' };
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
            <Cpu size={20} />
          </div>
          <div>
            <h2 className={`text-sm font-black tracking-tight ${textColor}`}>Verilog Core</h2>
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
                  {page.part.includes('V ·') ? (
                    <div className="flex flex-col gap-2">
                      <div className="h-[1px] w-full opacity-20" style={{ background: `linear-gradient(90deg, transparent, ${getPartTheme(page.part).primary}, transparent)` }} />
                      <div className="flex items-center gap-3">
                        <span
                          className="text-[9px] font-mono font-black uppercase tracking-[0.25em] px-2.5 py-1 rounded-md border"
                          style={{
                            color: getPartTheme(page.part).primary,
                            borderColor: `${getPartTheme(page.part).primary}44`,
                            background: `${getPartTheme(page.part).primary}12`,
                          }}
                        >
                          ◈ GATEWAY
                        </span>
                        <div className="h-[1px] flex-1 opacity-20" style={{ backgroundColor: getPartTheme(page.part).primary }} />
                        <span className="text-[9px] font-mono font-black uppercase tracking-[0.2em] opacity-30 whitespace-nowrap" style={{ color: getPartTheme(page.part).primary }}>
                          → L6 SYNTHESIS
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 whitespace-nowrap transition-colors duration-500" style={{ color: getPartTheme(page.part).primary }}>
                        {page.part}
                      </span>
                      <div className="h-[1px] w-full opacity-10" style={{ backgroundColor: getPartTheme(page.part).primary }} />
                    </div>
                  )}
                </div>
              )}
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
              className="h-full"
              style={{ boxShadow: `0 0 10px ${theme.primary}` }}
            />
          </div>
        </div>
        <button onClick={toggleTheme} className={`h-12 w-full rounded-2xl border-2 border-edge shadow-brutal-sm flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest transition-all ${isDarkMode ? 'text-slate-400 hover:bg-white/5' : 'text-slate-600 hover:bg-slate-100'}`}>{isDarkMode ? <Sun size={14} /> : <Moon size={14} />} {isDarkMode ? 'Light Mode' : 'Dark Mode'}</button>
      </footer>
    </div>
  );
};

export const Module5Engine: React.FC<{
  isDarkMode: boolean; onThemeToggle: () => void;
}> = ({ isDarkMode, onThemeToggle }) => {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [navOpen, setNavOpen] = useState(false);
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
      {/* Subtle ambient gradients (kept restrained for study feel) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <motion.div
          animate={{ background: `radial-gradient(circle, ${theme.primary} 0%, transparent 70%)` }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
          className={`absolute -top-[10%] -left-[10%] w-[70vw] h-[70vw] rounded-full blur-[120px] ${isDarkMode ? 'opacity-[0.10]' : 'opacity-[0.05]'}`}
        />
        <motion.div
          animate={{ background: `radial-gradient(circle, ${theme.secondary} 0%, transparent 70%)` }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
          className={`absolute bottom-[0%] -right-[10%] w-[60vw] h-[60vw] rounded-full blur-[100px] ${isDarkMode ? 'opacity-[0.10]' : 'opacity-[0.04]'}`}
        />
      </div>

      <DrawerShell open={navOpen} onClose={() => setNavOpen(false)}>
        <Sidebar current={current} isDarkMode={isDarkMode} onChange={(i) => { setCurrent(i); setNavOpen(false); }} toggleTheme={onThemeToggle} theme={theme} />
      </DrawerShell>

      <div className="flex-1 flex flex-col h-full overflow-hidden relative z-10">
        <header className="h-16 lg:h-20 border-b flex items-center justify-between px-4 lg:px-12 z-10 gap-3" style={{ borderColor: 'var(--border-soft)' }}>
          <div className="flex items-center gap-3 min-w-0">
            <HamburgerButton isDarkMode={isDarkMode} onClick={() => setNavOpen(true)} />
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] font-mono uppercase tracking-[0.4em] font-bold transition-colors duration-500" style={{ color: theme.primary }}>{page.part}</span>
              <h2 className={`text-base lg:text-xl font-bold tracking-tight truncate ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{page.label}</h2>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <div className="text-right">
              <div className="text-[8px] font-mono uppercase tracking-widest opacity-30">Topic Brief</div>
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
              className="max-w-5xl mx-auto px-4 py-10 lg:px-12 lg:py-24"
            >
              <Component accent={page.accentHex} />
            </motion.div>
          </AnimatePresence>
        </div>

        <footer className="h-20 lg:h-24 border-t flex items-center justify-between px-4 lg:px-12 z-10 gap-3" style={{ borderColor: 'var(--border-soft)' }}>
          <button onClick={() => { if (current === 0) { navigate('/portal'); } else { go(-1); } }} className={`flex items-center gap-2 px-4 lg:px-8 py-3 rounded-2xl font-bold transition-all hover:bg-black/5 active:scale-95 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}><ArrowLeft size={18} /> Back</button>
          <div className="hidden sm:block text-center">
            <span className="text-[10px] font-mono uppercase tracking-widest opacity-30 block mb-1">Up Next</span>
            <span className={`text-sm font-bold opacity-70 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{current < PAGES.length - 1 ? PAGES[current + 1].label : 'Module Complete'}</span>
          </div>
          <button
            onClick={() => { if (current === PAGES.length - 1) { navigate('/portal'); } else { go(1); } }}
            className="flex items-center gap-2 px-5 lg:px-10 py-3 rounded-2xl font-black text-black transition-all duration-500 active:scale-95"
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
