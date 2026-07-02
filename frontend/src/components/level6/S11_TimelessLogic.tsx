import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BlueprintContainer } from "./common/BlueprintContainer";
import { HeroText } from "./common/HeroText";
import { Zap, Clock, AlertCircle, Share2, Binary, Activity, Waves } from "lucide-react";

export const S11_TimelessLogic: React.FC<{ isActive: boolean }> = ({ isActive }) => {
  const [input, setInput] = useState(0);

  return (
    <BlueprintContainer>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-24 items-start w-full">
        {/* Left Column: Narrative Sidebar */}
        <div className="space-y-10 sticky top-24">
          <div className="space-y-4">
             <div className="micro-text uppercase tracking-[0.4em] text-plasma-cyan font-black opacity-60 flex items-center gap-2">
                <Clock size={14} /> Propagation Theory
             </div>
             <HeroText className="text-left leading-none" color="text-white">Timeless <br/><span className="text-plasma-cyan">Logic.</span></HeroText>
          </div>
          
          <div className="space-y-8 max-w-xl">
            <p className="body-text text-xl text-white/80 leading-relaxed font-light">
              Pure combinational logic is instantaneous. Change an input, and the output recalibrates <span className="text-plasma-cyan font-bold italic underline underline-offset-8 decoration-plasma-cyan/30">immediately.</span>
            </p>
            <p className="body-text text-base text-white/50 leading-relaxed text-left">
               In the idealized world of RTL simulation, logic gates have zero delay. In the physical world, electrons move at a finite speed, but the concept remains the same: the output is a pure function of the inputs, independent of time.
            </p>

            <div className="flex items-center gap-6 p-8 rounded-[40px] bg-white/[0.02] border border-white/5 shadow-inner">
                <div className="p-4 rounded-2xl bg-plasma-cyan/10 text-plasma-cyan shadow-cyan-glow">
                    <Waves size={24} />
                </div>
                <p className="body-text text-sm opacity-50 italic">
                  In hardware, time does not exist... until we define a synchronous boundary.
                </p>
            </div>
          </div>
        </div>

        {/* Right Column: Zero-Latency Evaluator Dashboard */}
        <div className="relative h-[720px] w-full rounded-[60px] bg-black border border-white/5 overflow-hidden shadow-2xl p-12 flex flex-col">
            <div className="absolute top-10 left-10 micro-text opacity-40 tracking-[0.3em] font-black uppercase flex items-center gap-3">
                <Binary size={14} className="text-plasma-cyan" /> Logic State Evaluator Matrix
            </div>

            <div className="flex-1 flex flex-col justify-center items-center gap-16">
                <div className="w-full space-y-10">
                    <div className="flex flex-col items-center">
                        <div className="micro-text uppercase text-plasma-cyan/40 mb-6 tracking-widest font-black">Electronic Stimulus Input [A]</div>
                        <div className="flex items-center justify-center gap-10 w-full px-12">
                            <button 
                                onClick={() => setInput(0)}
                                className={`flex-1 h-32 rounded-[40px] border-2 flex flex-col items-center justify-center transition-all group overflow-hidden relative ${input === 0 ? 'bg-plasma-cyan border-plasma-cyan text-black shadow-2xl shadow-plasma-cyan/30' : 'bg-white/[0.02] border-white/5 opacity-30 hover:opacity-100 hover:border-white/20'}`}
                            >
                                <div className="hero-text text-4xl mb-1 leading-none uppercase">0V</div>
                                <div className="micro-text uppercase text-[10px] font-black tracking-widest opacity-40">Logical Low</div>
                                {input === 0 && <motion.div layoutId="stimulus-glint" className="absolute inset-0 bg-white/10" />}
                            </button>
                            
                            <div className="w-32 flex flex-col items-center gap-4">
                                <div className="w-full h-px bg-white/5 relative">
                                    <motion.div 
                                        animate={{ x: input === 1 ? '100%' : '0%' }}
                                        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-plasma-cyan shadow-cyan-glow flex items-center justify-center text-black"
                                    >
                                        <Zap size={14} fill="currentColor" />
                                    </motion.div>
                                </div>
                                <div className="micro-text uppercase opacity-20 text-[9px] font-black tracking-[0.3em]">Propagating</div>
                            </div>

                            <button 
                                onClick={() => setInput(1)}
                                className={`flex-1 h-32 rounded-[40px] border-2 flex flex-col items-center justify-center transition-all group overflow-hidden relative ${input === 1 ? 'bg-plasma-cyan border-plasma-cyan text-black shadow-2xl shadow-plasma-cyan/30' : 'bg-white/[0.02] border-white/5 opacity-30 hover:opacity-100 hover:border-white/20'}`}
                            >
                                <div className="hero-text text-4xl mb-1 leading-none uppercase">1V</div>
                                <div className="micro-text uppercase text-[10px] font-black tracking-widest opacity-40">Logical High</div>
                                {input === 1 && <motion.div layoutId="stimulus-glint" className="absolute inset-0 bg-white/10" />}
                            </button>
                        </div>
                    </div>

                    <div className="p-12 rounded-[50px] bg-bg-elev border border-border-soft shadow-neo relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-5">
                            <Activity size={80} className="text-plasma-cyan" />
                        </div>
                        <div className="flex flex-col items-center gap-4 relative z-10">
                            <div className="micro-text uppercase text-white/20 tracking-[0.4em] font-black mb-2">Evaluated Outcome [Y]</div>
                            <AnimatePresence mode="wait">
                                <motion.div 
                                    key={input}
                                    initial={{ y: 20, opacity: 0, filter: 'blur(10px)' }}
                                    animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
                                    exit={{ y: -20, opacity: 0, filter: 'blur(10px)' }}
                                    className={`hero-text text-7xl md:text-8xl tracking-[0.1em] uppercase leading-none ${input === 1 ? 'text-plasma-cyan text-glow-cyan' : 'text-white/20'}`}
                                >
                                    {input === 1 ? "HIGH_SIG" : "LOW_SIG"}
                                </motion.div>
                            </AnimatePresence>
                            <div className="flex items-center gap-3 mt-4 px-6 py-2 rounded-full border border-white/5 bg-black/40">
                                <div className={`w-2 h-2 rounded-full ${input === 1 ? 'bg-plasma-cyan animate-pulse' : 'bg-white/10'}`} />
                                <div className="micro-text uppercase text-white/30 text-[10px] font-black tracking-widest leading-none">
                                    Latency Observed: <span className="text-white">0.00ns</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-8 flex items-center justify-between p-6 bg-bg-elev border border-border-soft rounded-3xl shadow-neo">
                <div className="flex items-center gap-4">
                    <Share2 size={20} className="text-plasma-cyan" />
                    <div>
                        <div className="micro-text uppercase text-white/60 tracking-widest font-black">Physical Topology</div>
                        <div className="body-text text-[10px] opacity-30 italic">Stateless gate chain mapped to physical electronic paths.</div>
                    </div>
                </div>
                <div className="px-4 py-1 rounded-full border border-plasma-cyan/30 text-plasma-cyan micro-text text-[9px] uppercase font-black">
                    Valid Logic
                </div>
            </div>
        </div>
      </div>
    </BlueprintContainer>
  );
};
