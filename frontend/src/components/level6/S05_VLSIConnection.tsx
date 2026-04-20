import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Network, Play, Zap, Factory, Binary, Activity, Search, RefreshCcw, Cpu, ChevronRight, Layers } from 'lucide-react';
import { BlueprintContainer } from './common/BlueprintContainer';
import { HeroText } from './common/HeroText';

const STAGES = [
    { id: 'spec', label: 'Spec', icon: Search, desc: 'Defining mathematical functionality and bounds.', pro: 'Logic Architecture' },
    { id: 'hdl', label: 'HDL', icon: Binary, desc: 'Synthesizable physical description mapping.', pro: 'RTL Modeling' },
    { id: 'sim', label: 'Sim', icon: Play, desc: 'Functional verification in temporal space.', pro: 'Verification V6' },
    { id: 'synth', label: 'Synth', icon: Zap, desc: 'Mapping code to physical logic gates.', pro: 'Netlist Synthesis' },
    { id: 'pnr', label: 'P&R', icon: Network, desc: 'Physical placement and route layout.', pro: 'P&R Diagnostic' },
    { id: 'fab', label: 'Fab', icon: Factory, desc: 'Printing atomic circuits onto silicon.', pro: 'Lithography' },
];

export const S05_VLSIConnection: React.FC<{ isActive: boolean }> = ({ isActive }) => {
  const [active, setActive] = useState(0);

  return (
    <BlueprintContainer>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-24 items-start w-full">
        {/* Left Column: Narrative Sidebar */}
        <div className="space-y-10 sticky top-24">
          <div className="space-y-4">
             <div className="micro-text uppercase tracking-[0.4em] text-plasma-cyan font-black opacity-60 flex items-center gap-2">
                <Layers size={14} /> Industrial Pipeline
             </div>
             <HeroText className="text-left leading-none" color="text-white">VLSI <br/> <span className="text-plasma-cyan">Pipeline.</span></HeroText>
          </div>
          
          <div className="space-y-8 max-w-xl">
            <p className="body-text text-xl text-white/80 leading-relaxed font-light">
              The industrial path from abstract mathematical code to <span className="text-plasma-cyan font-bold italic underline underline-offset-8 decoration-plasma-cyan/30">physical silicon matter.</span>
            </p>
            <p className="body-text text-base text-white/50 leading-relaxed">
               Chip design is not a single act. It is a multi-billion dollar sequence of verification, synthesis, and lithography. As a Verilog engineer, you sit at the heart of this conduit.
            </p>

            <div className="grid grid-cols-1 gap-3 pt-4">
                {STAGES.map((s, i) => (
                    <button 
                        key={s.id}
                        onClick={() => setActive(i)}
                        className={`flex items-center gap-6 p-5 rounded-[24px] border transition-all duration-500 text-left group ${active === i ? 'bg-plasma-cyan/10 border-plasma-cyan/40 scale-[1.02]' : 'bg-white/[0.02] border-white/5 opacity-40 hover:opacity-100 hover:bg-white/[0.05]'}`}
                    >
                        <div className={`p-3 rounded-xl border transition-colors ${active === i ? 'bg-plasma-cyan/20 border-plasma-cyan text-plasma-cyan' : 'bg-black border-white/5 text-white/30'}`}>
                            {React.createElement(s.icon, { size: 18 })}
                        </div>
                        <div className="flex-1">
                            <div className="micro-text uppercase tracking-widest font-black opacity-40">Phase 0{i + 1}</div>
                            <div className="hero-text text-xl uppercase tracking-tighter text-white">{s.label}</div>
                        </div>
                        {active === i && <ChevronRight size={18} className="text-plasma-cyan animate-pulse" />}
                    </button>
                ))}
            </div>
          </div>
        </div>

        {/* Right Column: Stage Diagnostic Dashboard */}
        <div className="relative h-[720px] w-full rounded-[60px] bg-black border border-white/5 overflow-hidden shadow-2xl p-12 flex flex-col">
            <div className="absolute top-10 left-10 micro-text opacity-40 tracking-[0.3em] font-black uppercase flex items-center gap-3">
                <Activity size={14} className="text-plasma-cyan" /> Fabrication Flow Monitor
            </div>

            <div className="flex-1 flex flex-col justify-center items-center">
                <AnimatePresence mode="wait">
                    <motion.div 
                        key={active}
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 1.05 }}
                        className="w-full flex flex-col items-center gap-12"
                    >
                        <div className="relative">
                             <div className="w-48 h-48 rounded-[50px] bg-black border-2 border-plasma-cyan shadow-cyan-glow flex items-center justify-center text-plasma-cyan">
                                {React.createElement(STAGES[active].icon, { size: 80, strokeWidth: 1 })}
                             </div>
                             {/* Rotating Ring */}
                             <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 20, ease: "linear" }} className="absolute -inset-6 border border-white/5 border-dashed rounded-full" />
                             <div className="absolute -top-4 -right-4 p-4 rounded-2xl bg-plasma-cyan text-black shadow-2xl">
                                <span className="hero-text text-xl tracking-tighter">PHASE_0{active + 1}</span>
                             </div>
                        </div>

                        <div className="text-center space-y-4 max-w-lg">
                            <div className="space-y-1">
                                <h3 className="hero-text text-5xl uppercase text-white tracking-widest">
                                    {STAGES[active].label}
                                </h3>
                                <div className="micro-text uppercase text-plasma-cyan font-black tracking-[0.4em]">
                                    {STAGES[active].pro}
                                </div>
                            </div>
                            
                            <p className="body-text text-xl text-white/70 italic leading-relaxed font-light">
                                "{STAGES[active].desc}"
                            </p>
                        </div>

                        <div className="flex items-center gap-8 py-6 px-10 rounded-full border border-white/5 bg-white/[0.02]">
                            <div className="flex flex-col items-center">
                                <div className="micro-text opacity-30 uppercase tracking-widest text-[9px] mb-1">Stability</div>
                                <div className="hero-text text-lg text-white">OPTIMAL</div>
                            </div>
                            <div className="w-px h-10 bg-white/10" />
                            <div className="flex flex-col items-center">
                                <div className="micro-text opacity-30 uppercase tracking-widest text-[9px] mb-1">Feedback</div>
                                <div className="hero-text text-lg text-white">RELIANT</div>
                            </div>
                            <div className="w-px h-10 bg-white/10" />
                            <div className="flex flex-col items-center">
                                <div className="micro-text opacity-30 uppercase tracking-widest text-[9px] mb-1">Context</div>
                                <div className="hero-text text-lg text-white">{active < 3 ? 'DIGITAL' : 'PHYSICAL'}</div>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            <div className="mt-12 p-8 bg-white/[0.03] border border-white/10 rounded-[40px] flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <RefreshCcw size={20} className="text-plasma-cyan animate-spin-slow" />
                    <div>
                        <div className="micro-text uppercase text-white/60 tracking-widest font-bold">Verification Feedback Loop</div>
                        <div className="body-text text-[10px] opacity-30">Active monitoring of iterative design cycles.</div>
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    {STAGES.map((_, i) => (
                        <div key={i} className={`w-3 h-1 rounded-full transition-all ${i <= active ? 'bg-plasma-cyan' : 'bg-white/10'}`} />
                    ))}
                </div>
            </div>
        </div>
      </div>
    </BlueprintContainer>
  );
};
