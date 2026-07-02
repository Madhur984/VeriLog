import React from "react";
import { motion } from "framer-motion";
import { BlueprintContainer } from "./common/BlueprintContainer";
import { HeroText } from "./common/HeroText";
import { Terminal, Cpu, ArrowDown, Repeat, Activity, Database, Share2, Binary, ShieldAlert } from "lucide-react";

export const S18_NotSoftware: React.FC<{ isActive: boolean }> = ({ isActive }) => {
  return (
    <BlueprintContainer>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-24 items-start w-full">
        {/* Left Column: Narrative Sidebar */}
        <div className="space-y-10 sticky top-24">
          <div className="space-y-4">
             <div className="micro-text uppercase tracking-[0.4em] text-burnished-copper font-black opacity-60 flex items-center gap-2">
                <ShieldAlert size={14} /> Paradigm Divergence Monitor
             </div>
             <HeroText className="text-left leading-none" color="text-white">This is NOT <br/><span className="text-burnished-copper uppercase">Programming.</span></HeroText>
          </div>
          
          <div className="space-y-8 max-w-xl">
            <p className="body-text text-xl text-white/80 leading-relaxed font-light text-left">
                Stop thinking about <span className="text-white font-bold opacity-30 italic">execution steps.</span> Start thinking about <span className="text-plasma-cyan font-bold underline underline-offset-8 decoration-plasma-cyan/30">physical pathways.</span>
            </p>
            <p className="body-text text-base text-white/50 leading-relaxed text-left">
               In a program, code is a list of sequential instructions for a CPU to follow. In Verilog, code is a <span className="text-plasma-cyan font-black italic uppercase tracking-widest text-xs">spatial blueprint.</span> Every line of logic you write will exist in silicon simultaneously.
            </p>

            <div className="p-8 rounded-[40px] bg-[#0A0A0B] border border-white/5 border-l-4 border-l-burnished-copper shadow-xl group">
                 <p className="body-text text-lg text-white/70 italic leading-relaxed font-light">
                    "Software describes <span className="text-burnished-copper font-medium">behavior</span> over time. Hardware describes <span className="text-plasma-cyan font-medium">structure</span> in space."
                 </p>
            </div>

            <div className="flex items-center gap-4 text-white/20 px-4">
                <Activity size={16} />
                <span className="micro-text text-[9px] uppercase tracking-widest leading-loose font-black">
                    Detected Software Latency: Zero // Parallel Fabric: Active
                </span>
            </div>
          </div>
        </div>

        {/* Right Column: Execution Paradigm Dashboard */}
        <div className="relative w-full space-y-8">
            {/* Software Comparison Block */}
            <div className="p-10 rounded-[50px] bg-bg-elev border border-border-soft opacity-40 grayscale group hover:grayscale-0 hover:opacity-100 transition-all duration-700 shadow-neo relative overflow-hidden">
                <div className="absolute top-10 right-10 micro-text text-[9px] font-black uppercase text-white/20 tracking-[0.2em] flex items-center gap-2">
                    <Database size={12} /> Temporal Buffer Mode
                </div>
                
                <div className="flex items-center gap-5 mb-10">
                    <div className="w-12 h-12 rounded-2xl bg-black flex items-center justify-center text-burnished-copper border border-white/5">
                        <Terminal size={22} strokeWidth={1.5} />
                    </div>
                    <div>
                        <div className="hero-text text-xl uppercase tracking-widest text-white">Procedural Software</div>
                        <div className="micro-text uppercase text-white/30 tracking-widest text-[9px] font-black">Sequential Instruction Stream</div>
                    </div>
                </div>

                <div className="space-y-6 mb-10 p-6 bg-black/40 rounded-3xl border border-white/5 relative z-10 font-mono text-[11px] leading-relaxed">
                     <div className="flex items-center gap-3 text-burnished-copper/40 mb-4 animate-pulse">
                        <div className="w-1.5 h-1.5 rounded-full bg-burnished-copper shadow-lg" />
                        PTR :: PC_0x4F2A
                     </div>
                     <div className="space-y-1 text-white/30">
                        <div className="text-white">0x4F2A: MOV R1, [0x200]</div>
                        <div>0x4F2E: ADD R1, R2</div>
                        <div>0x4F32: CMP R1, #0</div>
                        <div className="opacity-10">0x4F36: JMP ERROR_HDL</div>
                     </div>
                </div>

                <div className="flex justify-center flex-col items-center gap-4 text-white/20 py-4 border-t border-white/5">
                    <ArrowDown size={32} strokeWidth={1} className="animate-bounce" />
                    <span className="micro-text uppercase tracking-[0.4em] font-black text-[8px]">Time-Slicing Execution model</span>
                </div>
            </div>

            {/* Hardware Reality Block */}
            <div className="p-10 rounded-[50px] bg-bg-elev border border-border-soft shadow-neo relative overflow-hidden group">
                <div className="absolute top-10 right-10 micro-text text-[9px] font-black uppercase text-plasma-cyan/40 tracking-[0.2em] flex items-center gap-2">
                    <Share2 size={12} /> Concurrent Logic Fabric
                </div>

                <div className="flex items-center gap-5 mb-10">
                    <div className="w-12 h-12 rounded-2xl bg-black flex items-center justify-center text-plasma-cyan border border-white/5 shadow-cyan-glow">
                        <Cpu size={22} strokeWidth={1.5} />
                    </div>
                    <div>
                        <div className="hero-text text-xl uppercase tracking-widest text-white">Concurrent Hardware</div>
                        <div className="micro-text uppercase text-plasma-cyan tracking-widest text-[9px] font-black">Spatial Logic Synthesis</div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-6 mb-10 font-mono text-[10px]">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col gap-3 relative overflow-hidden group/path">
                             <div className="absolute inset-0 bg-plasma-cyan/5 animate-pulse opacity-0 group-hover/path:opacity-100 transition-opacity" />
                             <div className="flex items-center justify-between">
                                <span className="text-white/40 uppercase">GATE_PATH_0{i}</span>
                                <Binary size={10} className="text-plasma-cyan/40" />
                             </div>
                             <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-plasma-cyan animate-pulse shadow-cyan-glow" style={{ width: `${40 + i*15}%` }} />
                             </div>
                             <div className="text-plasma-cyan text-[9px] font-black italic">STATUS: ALWAYS_ON</div>
                        </div>
                    ))}
                </div>

                <div className="flex flex-col items-center gap-6 py-6 border-t border-white/5 relative z-10">
                    <div className="flex gap-10">
                       <Repeat size={36} strokeWidth={1} className="text-plasma-cyan animate-spin [animation-duration:10s]" />
                       <Repeat size={36} strokeWidth={1} className="text-plasma-cyan rotate-180 animate-spin [animation-duration:10s]" />
                       <Repeat size={36} strokeWidth={1} className="text-plasma-cyan animate-spin [animation-duration:10s]" />
                    </div>
                    <span className="micro-text uppercase tracking-[0.5em] font-bold text-white/30 text-[9px]">Spatial Parallel Reality</span>
                </div>
            </div>
        </div>
      </div>
    </BlueprintContainer>
  );
};
