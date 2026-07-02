import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Network, Play, Zap, Factory, Binary, Activity, Search, RefreshCcw, Cpu, ChevronRight, Layers, Share2, Database } from 'lucide-react';
import { BlueprintContainer } from './common/BlueprintContainer';
import { HeroText } from './common/HeroText';

const STAGES = [
    { id: 'spec', label: 'Spec', icon: Search, desc: 'Defining mathematical bounds and architectural intent.', pro: 'Logic Architecture', metrics: { stability: 'HIGH', context: 'DIGITAL', delta: '0.0ns' } },
    { id: 'hdl', label: 'HDL', icon: Binary, desc: 'Synthesizable physical description and structural mapping.', pro: 'RTL Modeling', metrics: { stability: 'HIGH', context: 'DIGITAL', delta: '0.1ns' } },
    { id: 'sim', label: 'Sim', icon: Play, desc: 'Functional verification in temporal cycle-exact space.', pro: 'Verification V6', metrics: { stability: 'MED', context: 'DIGITAL', delta: '0.2ns' } },
    { id: 'synth', label: 'Synth', icon: Zap, desc: 'Mapping abstract code to physical logic gate arrays.', pro: 'Netlist Synthesis', metrics: { stability: 'MED', context: 'MIXED', delta: '0.5ns' } },
    { id: 'pnr', label: 'P&R', icon: Network, desc: 'Physical placement and route layout implementation.', pro: 'P&R Diagnostic', metrics: { stability: 'LOW', context: 'PHYSICAL', delta: '1.2ns' } },
    { id: 'fab', label: 'Fab', icon: Factory, desc: 'Printing atomic circuits directly onto silicon wafers.', pro: 'Lithography', metrics: { stability: 'LOW', context: 'PHYSICAL', delta: '5.0ns' } },
];

export const S05_VLSIConnection: React.FC<{ isActive: boolean }> = ({ isActive }) => {
  const [active, setActive] = useState(0);

  return (
    <BlueprintContainer>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-24 items-start w-full">
        {/* Left Column: Narrative Sidebar */}
        <div className="space-y-10 sticky top-24">
          <div className="space-y-4 text-left">
             <div className="micro-text uppercase tracking-[0.4em] text-plasma-cyan font-black opacity-60 flex items-center gap-2 text-[10px]">
                <Layers size={14} /> Industrial Pipeline // CONDUIT_SEC
             </div>
             <HeroText className="text-left leading-none" color="text-white">VLSI <br/> <span className="text-plasma-cyan uppercase tracking-tighter">Pipeline.</span></HeroText>
          </div>
          
          <div className="space-y-8 max-w-xl text-left">
            <p className="body-text text-xl text-white/80 leading-relaxed font-light">
              The industrial path from abstract code to <span className="text-plasma-cyan font-bold italic underline underline-offset-8 decoration-plasma-cyan/30 uppercase tracking-widest text-sm">Physical Matter.</span>
            </p>
            <p className="body-text text-base text-white/50 leading-relaxed font-light">
               Design is a multi-billion dollar sequence of verification, synthesis, and lithography. As a Verilog engineer, you sit at the heart of this conduit.
            </p>

            <div className="grid grid-cols-1 gap-2 pt-4">
                {STAGES.map((s, i) => (
                    <button 
                        key={s.id}
                        onClick={() => setActive(i)}
                        className={`flex items-center gap-5 p-5 rounded-[35px] border transition-all duration-500 text-left group relative overflow-hidden ${active === i ? 'bg-[#0A0A0B] border-plasma-cyan/40 scale-[1.02] shadow-xl' : 'bg-transparent border-white/5 opacity-40 hover:opacity-100 hover:bg-white/[0.02]'}`}
                    >
                        <div className={`p-3.5 rounded-[20px] border transition-colors ${active === i ? 'bg-plasma-cyan/10 border-plasma-cyan text-plasma-cyan' : 'bg-white/5 border-white/5 text-white/30'}`}>
                            {React.createElement(s.icon, { size: 18 })}
                        </div>
                        <div className="flex-1">
                            <div className="micro-text uppercase tracking-widest font-black opacity-40 text-[8px] mb-0.5">Phase 0{i + 1} // {s.pro}</div>
                            <div className="hero-text text-lg uppercase tracking-tight text-white">{s.label}</div>
                        </div>
                        {active === i && <div className="w-1.5 h-1.5 rounded-full bg-plasma-cyan animate-pulse shadow-cyan-glow" />}
                    </button>
                ))}
            </div>
          </div>
        </div>

        {/* Right Column: Stage Diagnostic Dashboard */}
        <div className="relative min-h-[720px] w-full rounded-[60px] bg-black border border-white/5 overflow-hidden shadow-2xl p-10 md:p-12 lg:p-16 flex flex-col">
            <div className="absolute top-10 left-10 micro-text opacity-40 tracking-[0.3em] font-black uppercase flex items-center gap-3 text-[10px]">
                <Activity size={14} className="text-plasma-cyan" /> Fabrication Flow Monitor // GDSII_SYNTH
            </div>

            <div className="flex-1 flex flex-col justify-center items-center">
                <AnimatePresence mode="wait">
                    <motion.div 
                        key={active}
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.02 }}
                        className="w-full flex flex-col items-center gap-10"
                    >
                        <div className="relative">
                             <div className="w-40 h-40 rounded-[45px] bg-[#0A0A0B] border-2 border-plasma-cyan shadow-cyan-glow flex items-center justify-center text-plasma-cyan transition-all duration-700">
                                {React.createElement(STAGES[active].icon, { size: 72, strokeWidth: 1 })}
                             </div>
                             <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 25, ease: "linear" }} className="absolute -inset-6 border border-white/5 border-dashed rounded-full" />
                             <div className="absolute -top-3 -right-3 px-4 py-1.5 rounded-2xl bg-black border border-white/10 micro-text text-[10px] text-plasma-cyan font-black tracking-widest uppercase">
                                Phase_{active + 1}
                             </div>
                        </div>

                        <div className="text-center space-y-4 max-w-lg">
                            <div className="space-y-1">
                                <h3 className="hero-text text-5xl uppercase text-white tracking-widest leading-none">
                                    {STAGES[active].label}
                                </h3>
                                <div className="micro-text uppercase text-plasma-cyan/60 font-black tracking-[0.4em] text-[10px]">
                                    Pipeline Tier // {STAGES[active].pro}
                                </div>
                            </div>
                            
                            <p className="body-text text-sm text-white/40 italic leading-relaxed font-light px-12">
                                "{STAGES[active].desc}"
                            </p>
                        </div>

                        <div className="grid grid-cols-3 gap-4 w-full max-w-md">
                            {[
                                { label: 'Stability', val: STAGES[active].metrics.stability },
                                { label: 'Physical Context', val: STAGES[active].metrics.context },
                                { label: 'Trans Delta', val: STAGES[active].metrics.delta },
                            ].map((met, i) => (
                                <div key={i} className="p-5 rounded-[30px] border border-white/5 bg-[#0A0A0B] text-center group hover:bg-white/[0.02] transition-colors relative">
                                    <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
                                    <div className="micro-text uppercase opacity-30 mb-1.5 tracking-widest text-[8px] font-black">{met.label}</div>
                                    <div className="hero-text text-lg text-white group-hover:text-plasma-cyan transition-colors">{met.val}</div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            <div className="mt-8 p-1 bg-gradient-to-br from-white/20 via-white/5 to-transparent rounded-[45px] shadow-2xl relative overflow-hidden group">
                <img loading="lazy" decoding="async" 
                    src="/assets/module5/wafer.webp" 
                    alt="Silicon Wafer Fabrication" 
                    className="w-full h-32 object-cover rounded-[44px] opacity-40 group-hover:opacity-80 transition-all duration-1000 grayscale group-hover:grayscale-0 scale-110 group-hover:scale-100" 
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors duration-1000" />
                <div className="absolute left-10 top-1/2 -translate-y-1/2">
                    <div className="micro-text text-[9px] text-white/40 group-hover:text-plasma-cyan font-black tracking-widest mb-1 transition-colors">Surface_Scanning // Fab_Active</div>
                    <div className="hero-text text-sm uppercase text-white/60 group-hover:text-white tracking-widest transition-colors">Micro-Photostatic View</div>
                </div>
            </div>

            <div className="mt-8 p-8 bg-bg-elev border border-border-soft rounded-[35px] flex items-center justify-between shadow-neo">
                <div className="flex items-center gap-6">
                    <div className="w-12 h-12 rounded-full border border-plasma-cyan/30 flex items-center justify-center text-plasma-cyan shadow-cyan-glow">
                        <RefreshCcw size={22} className="animate-spin-slow" />
                    </div>
                    <div className="text-left">
                        <div className="micro-text uppercase text-white/40 tracking-widest font-black text-[9px]">Iteration Feedback</div>
                        <div className="hero-text text-xs uppercase text-white tracking-[0.2em]">Closed-loop synthesis engine active.</div>
                    </div>
                </div>
                <div className="flex gap-2">
                    {STAGES.map((_, i) => (
                        <div key={i} className={`h-1 rounded-full transition-all duration-500 ${i <= active ? 'w-6 bg-plasma-cyan' : 'w-2 bg-white/10'}`} />
                    ))}
                </div>
            </div>

            {/* Background Texture Overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.02] mix-blend-overlay">
                <div className="text-[280px] hero-text uppercase rotate-12 -translate-x-20 select-none">FAB</div>
            </div>
        </div>
      </div>
    </BlueprintContainer>
  );
};
