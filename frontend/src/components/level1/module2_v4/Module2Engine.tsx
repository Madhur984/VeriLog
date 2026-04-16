import React, { useState, useEffect, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Moon, Sun, ArrowRight, ArrowLeft, Terminal, Shield, Cpu, Gauge } from 'lucide-react';

// ── All rich phase components (v6 Cursor Editions) ─────────────────
import { P1_SignalReality }    from './scenes/phases/P1_SignalReality';
import { P2_TimeControl }       from './scenes/phases/P2_TimeControl';
import { P3_ValuePrecision }    from './scenes/phases/P3_ValuePrecision';
import { P4_SystemConversion }  from './scenes/phases/P4_SystemConversion';
import { P5_MasterLab }         from './scenes/phases/P5_MasterLab';
import { KineticText } from './components/UltimateComponents';

interface Page {
  id: string;
  part: string;
  partNum: number;
  label: string;
  subtitle: string;
  accentHex: string;
  kind: 'theory' | 'activity' | 'lab';
  Component: React.FC<any>;
}

const PAGES: Page[] = [
  {
    id: 'reality', part: 'PHASE I · ANALOG REALITY', partNum: 1,
    label: 'The Continuous Source',
    subtitle: 'Exploring the infinite resolution of the physical world',
    accentHex: '#f97316', kind: 'theory',
    Component: P1_SignalReality,
  },
  {
    id: 'time', part: 'PHASE II · THE CLASH', partNum: 2,
    label: 'Temporal Sampling',
    subtitle: 'Mouse mapping the Nyquist limit & Aliasing ghosting',
    accentHex: '#EF4444', kind: 'activity',
    Component: P2_TimeControl,
  },
  {
    id: 'precision', part: 'PHASE III · BIT DEPTH', partNum: 3,
    label: 'Value Quantization',
    subtitle: 'The cost of turning reality into numbers',
    accentHex: '#00D4FF', kind: 'activity',
    Component: P3_ValuePrecision,
  },
  {
    id: 'conversion', part: 'PHASE IV · THE BRIDGE', partNum: 4,
    label: 'Systemic Conversion',
    subtitle: 'Solving real-world signal failures via cursor probe',
    accentHex: '#A855F7', kind: 'activity',
    Component: P4_SystemConversion,
  },
  {
    id: 'mastery', part: 'PHASE V · THE FORGE', partNum: 5,
    label: 'Engineering Forge',
    subtitle: 'Ultimate Mastery Audit: Configure the perfect capture',
    accentHex: '#22C55E', kind: 'lab',
    Component: P5_MasterLab,
  },
];

const PART_COLOR: Record<number, string> = {
  1: '#f97316',
  2: '#EF4444',
  3: '#00D4FF',
  4: '#A855F7',
  5: '#22C55E',
};

const KIND_BADGE: Record<string, { label: string; color: string }> = {
  theory:   { label: '📖 Origin',    color: '#f97316' },
  activity: { label: '⚡ Instrument',  color: '#00D4FF' },
  lab:      { label: '🔬 The Forge',  color: '#22C55E' },
};

// ── Side Menu ─────────────────────────────────────────────────────

const Sidebar: React.FC<{ current: number; onChange: (i: number) => void }> = ({ current, onChange }) => {
    return (
        <div className="w-80 border-r border-white/5 bg-[#050608] flex flex-col z-20 overflow-hidden">
            <div className="p-12 border-b border-white/5 space-y-2">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-orange-500/10 flex items-center justify-center border border-orange-500/20 shadow-[0_0_15px_rgba(249,115,22,0.1)]">
                        <Activity className="text-orange-500" size={16} />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[11px] font-black italic text-white uppercase tracking-tighter">AXE-OR // SYS</span>
                        <span className="text-[8px] font-mono text-white/20 uppercase tracking-[0.3em]">Module_02</span>
                    </div>
                </div>
            </div>

            <nav className="flex-1 p-8 space-y-4 overflow-y-auto">
                <div className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em] mb-8">Navigation_Tree</div>
                {PAGES.map((page, i) => {
                    const isActive = current === i;
                    const acc = PART_COLOR[page.partNum];
                    return (
                        <button 
                            key={page.id}
                            onClick={() => onChange(i)}
                            className={`group relative w-full p-6 pb-8 rounded-[2rem] border transition-all text-left overflow-hidden ${isActive ? 'bg-white/5 border-white/10' : 'bg-transparent border-transparent hover:bg-white/[0.02]'}`}
                        >
                            <div className="flex items-center gap-4 relative z-10">
                                <span className={`text-[10px] font-black font-mono px-2 py-0.5 rounded border transition-colors ${isActive ? 'bg-white text-black border-white' : 'text-white/20 border-white/10'}`}>{i + 1}</span>
                                <div className="flex-1">
                                    <h4 className={`text-[13px] font-black uppercase tracking-tighter transition-colors ${isActive ? 'text-white' : 'text-white/20 group-hover:text-white/40'}`}>{page.label}</h4>
                                    {isActive && <span className="text-[8px] font-mono text-white/40 uppercase tracking-widest mt-1 block animate-pulse">ACTIVE_SUBSYSTEM</span>}
                                </div>
                            </div>
                            {isActive && (
                                <motion.div layoutId="nav-glow" className="absolute bottom-0 left-0 right-0 h-1" style={{ backgroundColor: acc, boxShadow: `0 0 20px ${acc}` }} />
                            )}
                        </button>
                    )
                })}
            </nav>

            <div className="p-10 border-t border-white/5 space-y-6">
                 <div className="space-y-4">
                    <div className="flex justify-between items-center text-[9px] font-mono font-black uppercase text-white/20 tracking-widest">
                        <span>Initialization</span>
                        <span>{Math.round(((current + 1) / PAGES.length) * 100)}%</span>
                    </div>
                    <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${((current + 1) / PAGES.length) * 100}%` }} className="h-full bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.4)]" />
                    </div>
                 </div>
                 <div className="flex items-center gap-3 text-[8px] font-mono text-white/10 uppercase tracking-[0.3em]">
                    <Shield size={10} />
                    <span>ENCRYPTION_LAYER_ACTIVE</span>
                 </div>
            </div>
        </div>
    )
}

// ── Top Bar ───────────────────────────────────────────────────────

const TopBar: React.FC<{ page: Page; isDarkMode: boolean }> = ({ page, isDarkMode }) => {
  const accent = PART_COLOR[page.partNum];
  const badge = KIND_BADGE[page.kind];
  return (
    <div className={`sticky top-0 z-50 border-b backdrop-blur-3xl transition-all p-10 px-16 ${isDarkMode ? 'bg-[#0A0C10]/60 border-white/5' : 'bg-white/70 border-black/5'}`}>
        <div className="flex items-center justify-between max-w-none mx-auto">
            <div className="flex items-center gap-10">
                <div className="flex flex-col">
                    <span className="text-[10px] font-black font-mono tracking-[0.4em] uppercase" style={{ color: accent }}>{page.part}</span>
                    <h2 className="text-4xl font-black italic text-white uppercase tracking-tighter tracking-[-0.05em] leading-none mt-2">{page.label}</h2>
                </div>
                <div className="h-10 w-px bg-white/5 hidden xl:block" />
                <div className="hidden xl:flex flex-col">
                    <span className="text-[10px] font-black font-mono tracking-[0.4em] uppercase text-white/20 whitespace-nowrap">Status_Brief</span>
                    <span className="text-[11px] font-medium italic text-white/40 mt-1">{page.subtitle}</span>
                </div>
            </div>
            <div className="flex items-center gap-8">
                 <div className="flex flex-col items-end">
                    <div className="flex items-center gap-3">
                        <Terminal size={14} className="text-white/20" />
                        <span className="text-[10px] font-black font-mono uppercase tracking-widest" style={{ color: badge.color }}>{badge.label}</span>
                    </div>
                    <span className="text-[8px] font-mono text-white/20 mt-1 uppercase tracking-widest">INSTRUMENT_SYNC: 100%</span>
                 </div>
            </div>
        </div>
    </div>
  );
};

// ── Main Engine ───────────────────────────────────────────────────

export const Module2Engine: React.FC<{ 
    isDarkMode: boolean; 
    onThemeToggle: () => void;
    state: any;
    onUpdate: any;
    time: number;
}> = ({ isDarkMode, state, onUpdate, time }) => {
  const [current, setCurrent] = useState(0);
  const page = PAGES[current];
  const { Component } = page;

  const navigate = (dir: number) => {
      setCurrent(c => Math.max(0, Math.min(PAGES.length - 1, c + dir)));
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#050608]">
      {/* Background Decal */}
      <div className="absolute inset-x-0 bottom-0 top-[20%] pointer-events-none opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(circle at 100% 100%, #00D4FF 0%, transparent 50%), radial-gradient(circle at 0% 0%, #f97316 0%, transparent 50%)' }} />

      <Sidebar current={current} onChange={setCurrent} />

      <div className="flex-1 flex flex-col min-w-0 relative z-10">
        <TopBar page={page} isDarkMode={isDarkMode} />
        
        <div className="flex-1 overflow-y-auto scroll-smooth">
          <AnimatePresence mode="wait">
            <motion.div
              key={page.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="p-16 pb-40 max-w-none"
            >
              <Component state={state} onUpdate={onUpdate} time={time} isDarkMode={isDarkMode} />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Cinematic Footer Console */}
        <div className="h-32 border-t border-white/5 backdrop-blur-3xl flex items-center justify-between px-16 px-16">
            <div className="flex items-center gap-12">
                <button 
                    onClick={() => navigate(-1)} disabled={current === 0}
                    className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-white/5 text-white/40 hover:text-white disabled:opacity-0 transition-all font-black uppercase tracking-widest text-[10px] border border-transparent hover:border-white/10"
                >
                    <ArrowLeft size={16} /> Previous
                </button>
                <div className="h-8 w-px bg-white/5 hidden md:block" />
                <div className="hidden md:flex flex-col">
                    <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mb-1">System_Mode</span>
                    <span className="text-xs font-black italic text-white/60 uppercase">Manual_Override_Probe</span>
                </div>
            </div>

            <div className="flex items-center gap-12">
                 <div className="hidden lg:flex items-center gap-4 text-right">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">Next_Ph</span>
                        <span className="text-xs font-black italic text-white/40 uppercase">{PAGES[current + 1]?.label || 'FINAL_AUDIT'}</span>
                    </div>
                 </div>
                <button 
                    onClick={() => navigate(1)} disabled={current === PAGES.length - 1}
                    className="relative group flex items-center gap-4 px-12 py-5 rounded-3xl bg-[#00D4FF] text-black transition-all font-black uppercase tracking-[0.2em] text-[11px] shadow-[0_20px_40px_rgba(0,212,255,0.2)]"
                    style={{ backgroundColor: PART_COLOR[page.partNum+1] || PART_COLOR[page.partNum] }}
                >
                    <div className="absolute inset-0 bg-white/20 scale-x-0 group-hover:scale-x-100 transition-transform origin-left rounded-3xl" />
                    <span className="relative z-10">{current === PAGES.length - 1 ? 'Mastered' : 'Proceed'}</span> 
                    <ArrowRight size={18} className="relative z-10" />
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};
