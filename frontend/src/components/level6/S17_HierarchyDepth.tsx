import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BlueprintContainer } from "./common/BlueprintContainer";
import { HeroText } from "./common/HeroText";
import { Search, ChevronDown, Cpu, Layers, HardDrive, Box, Share2, Binary, Activity } from "lucide-react";

export const S17_HierarchyDepth: React.FC<{ isActive: boolean }> = ({ isActive }) => {
  const [depth, setDepth] = useState(0);

  return (
    <BlueprintContainer>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-24 items-start w-full">
        {/* Left Column: Narrative Sidebar */}
        <div className="space-y-10 sticky top-24">
          <div className="space-y-4">
             <div className="micro-text uppercase tracking-[0.4em] text-plasma-cyan font-black opacity-60 flex items-center gap-2">
                <Box size={14} /> Architectural Inception
             </div>
             <HeroText className="text-left leading-none" color="text-white">Hardware is <br/><span className="text-plasma-cyan">Recursive.</span></HeroText>
          </div>
          
          <div className="space-y-8 max-w-xl">
            <p className="body-text text-xl text-white/80 leading-relaxed font-light text-left">
                Complex chips are not monolithic blocks. They are <span className="text-plasma-cyan font-bold italic underline underline-offset-8 decoration-plasma-cyan/30">logic fractals.</span>
            </p>
            <p className="body-text text-base text-white/50 leading-relaxed text-left">
               In Verilog, you don't just "call a function." You <span className="text-plasma-cyan font-black italic uppercase tracking-widest text-xs">instantiate a module.</span> This creates a physical piece of logic inside another, allowing for infinite structural scaling across billions of transistors.
            </p>

            <div className="grid grid-cols-2 gap-4">
                <div className="p-6 rounded-[35px] bg-[#0A0A0B] border border-white/5 border-l-4 border-l-plasma-cyan shadow-xl group">
                    <p className="micro-text uppercase text-white/20 mb-2 tracking-widest font-black text-[9px]">Instance ID</p>
                    <p className="hero-text text-lg text-white tracking-widest uppercase">cpu_core_01</p>
                </div>
                <div className="p-6 rounded-[35px] bg-[#0A0A0B] border border-white/5 border-l-4 border-l-plasma-cyan shadow-xl group">
                    <p className="micro-text uppercase text-white/20 mb-2 tracking-widest font-black text-[9px]">Module Type</p>
                    <p className="hero-text text-lg text-white tracking-widest uppercase">RISC_V_X8</p>
                </div>
            </div>
            
            <p className="body-text text-xs text-white/30 italic font-light text-left leading-relaxed">
                *Structural nesting allows engineers to manage complexity by abstracting lower-level gate logic into high-level behavioral units.
            </p>
          </div>
        </div>

        {/* Right Column: Nested Logic Probe Dashboard */}
        <div className="relative h-[720px] w-full rounded-[60px] bg-black border border-white/5 overflow-hidden shadow-2xl p-12 flex flex-col items-center justify-center">
            <div className="absolute top-10 left-10 micro-text opacity-40 tracking-[0.3em] font-black uppercase flex items-center gap-3">
                <Layers size={14} className="text-plasma-cyan" /> Structural Anatomy Scan // RECURSIVE_INST3
            </div>

            <div className="flex-1 flex flex-col items-center justify-center gap-12 w-full relative">
                <div className="absolute inset-0 bg-dot-grid opacity-10 pointer-events-none" />
                
                <AnimatePresence mode="wait">
                    <motion.div 
                        key={depth}
                        initial={{ opacity: 0, scale: 0.9, rotateX: 10 }}
                        animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                        exit={{ opacity: 0, scale: 1.1, rotateX: -10 }}
                        transition={{ duration: 0.6, ease: "circOut" }}
                        className="flex flex-col items-center gap-10 relative z-10 w-full"
                    >
                        {/* Current Hierarchy Node */}
                        <div className="p-12 rounded-[50px] bg-white/[0.01] border border-white/10 flex flex-col items-center gap-8 shadow-2xl backdrop-blur-3xl group/node min-w-[320px]">
                             <div className="w-24 h-24 rounded-[35px] bg-black border border-plasma-cyan/30 flex items-center justify-center text-plasma-cyan shadow-cyan-glow relative overflow-hidden">
                                {depth === 0 ? <Cpu size={48} strokeWidth={1.5} /> : depth === 1 ? <HardDrive size={48} strokeWidth={1.5} /> : <Binary size={48} strokeWidth={1.5} />}
                             </div>
                             
                             <div className="text-center">
                                <h3 className="hero-text text-3xl uppercase tracking-widest text-white leading-none mb-3">
                                    {depth === 0 ? "Top Module" : depth === 1 ? "Integrated Unit" : "Primitive Cell"}
                                </h3>
                                <div className={`micro-text uppercase tracking-[0.4em] font-black italic text-[9px] ${depth === 0 ? 'text-plasma-cyan' : 'text-burnished-copper'}`}>
                                    {depth === 0 ? "SOC_MASTER_TOP" : depth === 1 ? "MEMORY_CONTROLLER_V2" : "SRAM_L1_CACHE_BLOCK"}
                                </div>
                             </div>

                             <div className="w-full flex items-center gap-4 px-6 opacity-30">
                                <div className="h-px flex-1 bg-white/10" />
                                <Share2 size={12} />
                                <div className="h-px flex-1 bg-white/10" />
                             </div>

                             <div className="flex gap-4">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className={`w-1.5 h-1.5 rounded-full ${i <= depth + 1 ? 'bg-plasma-cyan' : 'bg-white/10'}`} />
                                ))}
                             </div>
                        </div>

                        {/* Hierarchical Connections */}
                        <div className="relative w-px h-16 bg-gradient-to-b from-plasma-cyan to-transparent animate-pulse" />

                        {/* Child Preview Nodes */}
                        <div className="flex gap-8 opacity-40 grayscale blur-[1px]">
                            {[1, 2].map((i) => (
                                <div key={i} className="px-6 py-4 rounded-[25px] border border-white/5 bg-white/[0.02] flex items-center gap-3">
                                    <Layers size={14} className="text-plasma-cyan" />
                                    <span className="micro-text uppercase tracking-widest text-[8px] font-black">L.0{depth + 2} Sub-Instance</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Tactical Depth Console */}
            <div className="mt-8 flex items-center gap-10 bg-[#0A0A0B] p-6 rounded-[35px] border border-white/10 shadow-3xl">
                <button 
                    disabled={depth === 0}
                    onClick={() => setDepth(d => Math.max(0, d - 1))}
                    className="w-16 h-16 rounded-2xl flex items-center justify-center border border-white/10 text-plasma-cyan hover:bg-plasma-cyan hover:text-black transition-all disabled:opacity-5 active:scale-95"
                >
                    <Search className="scale-x-[-1]" size={24} />
                </button>
                
                <div className="flex flex-col items-center gap-1 min-w-[140px]">
                    <div className="micro-text uppercase tracking-[0.3em] text-white/20 font-black text-[9px]">Hierarchy Depth</div>
                    <div className="hero-text text-4xl font-black text-white tracking-widest">
                        L.0{depth + 1}
                    </div>
                </div>

                <button 
                    disabled={depth === 2}
                    onClick={() => setDepth(d => Math.min(2, d + 1))}
                    className="w-16 h-16 rounded-2xl flex items-center justify-center border border-white/10 text-plasma-cyan hover:bg-plasma-cyan hover:text-black transition-all disabled:opacity-5 active:scale-95"
                >
                    <Search size={24} />
                </button>
            </div>

            <div className="absolute bottom-10 inset-x-12 flex items-center justify-between">
                <div className="flex items-center gap-4 text-white/30 italic">
                    <Activity size={14} className="text-plasma-cyan" />
                    <span className="micro-text uppercase tracking-widest text-[9px]">Observing recursive instance topology across VLSI fabric.</span>
                </div>
                <div className="micro-text uppercase text-white/10 tracking-[0.2em] font-black text-[9px]">
                   SCAN_REF: SOC_XA_GLOBAL
                </div>
            </div>
        </div>
      </div>
    </BlueprintContainer>
  );
};
