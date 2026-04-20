import React from "react";
import { motion } from "framer-motion";
import { BlueprintContainer } from "./common/BlueprintContainer";
import { HeroText } from "./common/HeroText";
import { Cpu, Zap, Binary, CircuitBoard, Layers, Activity, Database, Share2, ShieldCheck } from "lucide-react";

export const S20_AIHardware: React.FC<{ isActive: boolean }> = ({ isActive }) => {
  return (
    <BlueprintContainer>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-24 items-start w-full">
        {/* Left Column: Narrative Sidebar */}
        <div className="space-y-10 sticky top-24">
          <div className="space-y-4">
             <div className="micro-text uppercase tracking-[0.4em] text-plasma-cyan font-black opacity-60 flex items-center gap-2">
                <Binary size={14} /> Tensor Logic Synthesis
             </div>
             <HeroText className="text-left leading-none" color="text-white">The <br/><span className="text-plasma-cyan uppercase">AI Shift.</span></HeroText>
          </div>
          
          <div className="space-y-8 max-w-xl">
            <p className="body-text text-xl text-white/80 leading-relaxed font-light text-left">
                Verilog is no longer just for CPUs. In the age of Neural Intelligence, we build <span className="text-plasma-cyan font-bold italic underline underline-offset-8 decoration-plasma-cyan/30">Matrix Engines.</span>
            </p>
            <p className="body-text text-base text-white/50 leading-relaxed text-left font-light">
               Software is the bottleneck. To reach <span className="text-plasma-cyan font-black italic uppercase tracking-widest text-xs">Tera-Operations (TOPS)</span>, neural operations must be hard-wired into silicon. Matrix-Multiplication is now the primary driver of circuit architecture.
            </p>

            <div className="grid grid-cols-2 gap-4">
                <div className="p-8 rounded-[40px] bg-[#0A0A0B] border border-white/5 border-l-4 border-l-plasma-cyan shadow-xl group">
                    <p className="hero-text text-3xl text-white tracking-tighter uppercase mb-1">1000x</p>
                    <p className="micro-text uppercase text-plasma-cyan/40 tracking-widest font-black text-[9px]">Throughput Gain</p>
                </div>
                <div className="p-8 rounded-[40px] bg-[#0A0A0B] border border-white/5 border-l-4 border-l-burnished-copper shadow-xl group">
                    <p className="hero-text text-3xl text-white tracking-tighter uppercase mb-1">10x</p>
                    <p className="micro-text uppercase text-burnished-copper/40 tracking-widest font-black text-[9px]">Watt/TOPS Efficiency</p>
                </div>
            </div>

            <div className="flex items-center gap-4 text-white/20 px-4">
                <Activity size={16} />
                <span className="micro-text text-[9px] uppercase tracking-widest leading-loose font-black">
                    Neural Systolic Array Cluster v.4.01 // Active 
                </span>
            </div>
          </div>
        </div>

        {/* Right Column: AI Architecture Diagnostic Dashboard */}
        <div className="space-y-8 relative">
            <div className="absolute top-10 right-10 micro-text text-white/10 uppercase tracking-widest font-black text-[9px] z-50">
               SCAN_REF: NPU_TENSOR_UNIT
            </div>

            {/* Neural Matrix Engine Block */}
            <div className="p-12 rounded-[60px] bg-plasma-cyan/5 border border-plasma-cyan/20 shadow-2xl relative overflow-hidden backdrop-blur-3xl group">
                <div className="absolute top-0 right-0 p-10 opacity-10 text-plasma-cyan group-hover:scale-110 transition-transform duration-1000">
                    <Layers size={140} strokeWidth={1} />
                </div>

                <div className="flex items-center gap-6 mb-12 relative z-10">
                    <div className="w-16 h-16 rounded-[28px] bg-black border border-plasma-cyan/30 flex items-center justify-center text-plasma-cyan shadow-cyan-glow">
                        <Zap size={32} strokeWidth={1.5} />
                    </div>
                    <div>
                        <div className="hero-text text-2xl uppercase tracking-widest text-white">Neural Matrix Engine</div>
                        <div className="micro-text uppercase text-plasma-cyan tracking-widest text-[9px] font-black">Spatial Tensor Synthesis Cluster</div>
                    </div>
                </div>

                <div className="grid grid-cols-4 gap-4 mb-12 font-mono text-[10px]">
                    {Array.from({ length: 16 }).map((_, i) => (
                        <motion.div 
                            key={i}
                            animate={{ 
                                backgroundColor: ['rgba(0,212,255,0.02)', 'rgba(0,212,255,0.15)', 'rgba(0,212,255,0.02)'],
                                borderColor: ['rgba(0,212,255,0.1)', 'rgba(0,212,255,0.3)', 'rgba(0,212,255,0.1)']
                            }}
                            transition={{ 
                                duration: 1.5, 
                                repeat: Infinity, 
                                delay: (i % 4 + Math.floor(i / 4)) * 0.15 
                            }}
                            className="aspect-square rounded-[22px] border flex flex-col items-center justify-center gap-2 relative group/mac overflow-hidden"
                        >
                            <div className="absolute top-1 right-1 opacity-10">
                                <Share2 size={8} />
                            </div>
                            <span className="mono-text text-[8px] font-black text-plasma-cyan tracking-tighter">MAC_{i}</span>
                            <motion.div 
                                animate={{ scale: [1, 1.4, 1], opacity: [0.2, 0.8, 0.2] }}
                                transition={{ repeat: Infinity, duration: 2, delay: i * 0.1 }}
                                className="w-1.5 h-1.5 rounded-full bg-plasma-cyan shadow-[0_0_8px_rgba(0,212,255,0.6)]"
                            />
                        </motion.div>
                    ))}
                </div>

                <div className="space-y-5 py-6 border-t border-white/5 relative z-10">
                    <div className="flex items-center justify-between px-2">
                        <div className="flex items-center gap-3">
                            <Database size={16} className="text-plasma-cyan/60" />
                            <span className="micro-text uppercase text-white/40 tracking-[0.2em] text-[9px] font-black">Cluster Throughput // TOPS</span>
                        </div>
                        <span className="mono-text text-white font-black text-xs tracking-widest">102.4 PB/S</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 shadow-inner">
                        <motion.div 
                            animate={{ width: ["10%", "95%", "10%"] }}
                            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                            className="h-full bg-plasma-cyan shadow-cyan-glow"
                        />
                    </div>
                </div>

                <div className="mt-4 flex items-center justify-between opacity-30">
                     <span className="micro-text uppercase tracking-widest text-[8px] font-bold">BITWIDTH: FP16/INT8</span>
                     <span className="micro-text uppercase tracking-widest text-[8px] font-bold">SYSTOLIC_FLOW: L_TO_R</span>
                </div>
            </div>

            {/* Comparison Footer Card */}
            <div className="p-8 rounded-[40px] bg-[#0A0A0B] border border-white/10 flex items-center gap-8 group backdrop-blur-md">
                 <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white/20 group-hover:text-plasma-cyan transition-colors">
                    <ShieldCheck size={20} />
                 </div>
                 <div className="flex-1">
                    <div className="micro-text uppercase text-white/40 tracking-widest font-black mb-1">Architecture Note</div>
                    <p className="body-text text-[11px] opacity-30 italic leading-relaxed font-light">
                        "The architecture of intelligence is massively parallel. Every MAC unit responds to input stimuli in a single clock cycle, eliminating sequential bottlenecks."
                    </p>
                 </div>
            </div>
        </div>
      </div>
    </BlueprintContainer>
  );
};
