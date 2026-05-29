import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BlueprintContainer } from "./common/BlueprintContainer";
import { HeroText } from "./common/HeroText";
import { Waveform } from "./common/Waveform";
import { Zap, Play, Binary, Cpu, Share2, Layers, Repeat } from "lucide-react";

export const S10_ParallelWorld: React.FC<{ isActive: boolean }> = ({ isActive }) => {
  const [running, setRunning] = useState(false);

  const signals = [
    { name: "Input A", values: [0, 1, 0, 1, 1, 0] },
    { name: "Input B", values: [1, 1, 0, 0, 1, 1] },
    { name: "Wire Y", values: running ? [0, 1, 0, 0, 1, 0] as (0|1)[] : [0, 0, 0, 0, 0, 0] as (0|1)[] },
    { name: "Wire Z", values: running ? [1, 1, 0, 1, 1, 1] as (0|1)[] : [0, 0, 0, 0, 0, 0] as (0|1)[] },
  ];

  return (
    <BlueprintContainer>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-24 items-start w-full">
        {/* Left Column: Narrative Sidebar */}
        <div className="space-y-10 sticky top-24">
          <div className="space-y-4">
             <div className="micro-text uppercase tracking-[0.4em] text-plasma-cyan font-black opacity-60 flex items-center gap-2">
                <Repeat size={14} /> Concurrent Execution
             </div>
             <HeroText className="text-left leading-none" color="text-white">Parallel <br/><span className="text-plasma-cyan">World.</span></HeroText>
          </div>
          
          <div className="space-y-8 max-w-xl">
            <p className="body-text text-xl text-white/80 leading-relaxed font-light">
              In hardware, everything happens at once. Break the sequential mindset-assignments in Verilog exist in <span className="text-plasma-cyan font-bold italic underline underline-offset-8 decoration-plasma-cyan/30">parallel harmony.</span>
            </p>
            <p className="body-text text-base text-white/50 leading-relaxed text-left">
               Unlike software which executes line-by-line, Verilog describes independent physical circuits. When power flows, every `assign` statement evaluates simultaneously across the entire silicon die.
            </p>

            <div className="space-y-4 pt-4">
                <div className={`p-8 rounded-[40px] bg-[#0A0A0B] border transition-all duration-500 overflow-hidden relative group ${running ? "border-plasma-cyan shadow-cyan-glow" : "border-white/5"}`}>
                    <div className="flex items-center gap-3 text-plasma-cyan/40 mb-4 group-hover:text-plasma-cyan transition-colors">
                      <Zap size={16} />
                      <span className="micro-text uppercase tracking-[0.2em] font-black">Concurrent Node 01</span>
                    </div>
                    <code className="mono-text text-xl text-white block italic">
                      assign Y = A & B;
                    </code>
                    <div className="absolute bottom-0 right-0 p-4 opacity-5">
                        <Binary size={40} />
                    </div>
                </div>
                <div className={`p-8 rounded-[40px] bg-[#0A0A0B] border transition-all duration-500 overflow-hidden relative group ${running ? "border-plasma-cyan shadow-cyan-glow" : "border-white/5"}`}>
                    <div className="flex items-center gap-3 text-plasma-cyan/40 mb-4 group-hover:text-plasma-cyan transition-colors">
                      <Zap size={16} />
                      <span className="micro-text uppercase tracking-[0.2em] font-black">Concurrent Node 02</span>
                    </div>
                    <code className="mono-text text-xl text-white block italic">
                      assign Z = A | B;
                    </code>
                    <div className="absolute bottom-0 right-0 p-4 opacity-5">
                        <Cpu size={40} />
                    </div>
                </div>
            </div>
          </div>
        </div>

        {/* Right Column: Convergence Monitor Dashboard */}
        <div className="relative h-[720px] w-full rounded-[60px] bg-black border border-white/5 overflow-hidden shadow-2xl p-12 flex flex-col">
            <div className="absolute top-10 left-10 micro-text opacity-40 tracking-[0.3em] font-black uppercase flex items-center gap-3">
                <Layers size={14} className="text-plasma-cyan" /> Logic Convergence Monitor
            </div>

            <div className="flex-1 flex flex-col justify-center gap-12">
                <div className="p-10 rounded-[50px] bg-white/[0.01] border border-white/5 backdrop-blur-md relative overflow-hidden">
                    <div className="absolute inset-0 bg-grid-white opacity-[0.02]" />
                    <Waveform signals={signals as any} className="mb-12 relative z-10" />
                    
                    <div className="relative z-10 grid grid-cols-2 gap-6">
                        <div className="p-6 rounded-3xl bg-black/40 border border-white/5 space-y-1">
                            <div className="micro-text uppercase opacity-20 text-[9px] tracking-widest font-black">Path Delay</div>
                            <div className="hero-text text-xl text-plasma-cyan">2.4ps</div>
                        </div>
                        <div className="p-6 rounded-3xl bg-black/40 border border-white/5 space-y-1">
                            <div className="micro-text uppercase opacity-20 text-[9px] tracking-widest font-black">Race Condition</div>
                            <div className="hero-text text-xl text-white">NULL</div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-6">
                    <button 
                        onClick={() => setRunning(!running)}
                        className="group w-full relative h-20 rounded-[40px] bg-plasma-cyan text-black hero-text text-2xl uppercase flex items-center justify-center gap-6 transition-all hover:scale-[1.02] active:scale-95 shadow-2xl shadow-plasma-cyan/20 overflow-hidden"
                    >
                        <Play size={28} fill="currentColor" className={running ? "animate-pulse" : ""} />
                        <span className="relative z-10">{running ? "Reset Matrix" : "Trigger Logic Flow"}</span>
                        <motion.div 
                            initial={{ x: '-100%' }}
                            whileHover={{ x: '100%' }}
                            transition={{ duration: 1.5, ease: "easeInOut" }}
                            className="absolute inset-0 bg-white/20 skew-x-12"
                        />
                    </button>

                    <div className="flex items-center justify-between p-6 bg-white/[0.02] border border-white/10 rounded-3xl">
                        <div className="flex items-center gap-4">
                            <Share2 size={20} className="text-plasma-cyan" />
                            <div>
                                <div className="micro-text uppercase text-white/60 tracking-widest font-black">Concurrency Validation</div>
                                <div className="body-text text-[10px] opacity-30 italic">Observing zero-sequential delta across multiple assignment nodes.</div>
                            </div>
                        </div>
                        <div className="px-4 py-1 rounded-full border border-plasma-cyan/30 text-plasma-cyan micro-text text-[9px] uppercase font-black">
                            Synchronized
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </BlueprintContainer>
  );
};
