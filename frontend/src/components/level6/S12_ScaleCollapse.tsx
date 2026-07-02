import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BlueprintContainer } from "./common/BlueprintContainer";
import { HeroText } from "./common/HeroText";
import { Cpu, Maximize2, Layers, AlertTriangle, Binary, Share2, Activity, ZoomIn } from "lucide-react";

export const S12_ScaleCollapse: React.FC<{ isActive: boolean }> = ({ isActive }) => {
  const [scale, setScale] = useState(1);

  const getLabel = (s: number) => {
    if (s < 2) return "Single Block (AND)";
    if (s < 4) return "1,000 Cells (ALU)";
    if (s < 7) return "1,000,000+ Nodes (L1)";
    return "10,000,000,000+ Netlist (GPU)";
  };

  return (
    <BlueprintContainer>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-24 items-start w-full">
        {/* Left Column: Narrative Sidebar */}
        <div className="space-y-10 sticky top-24">
          <div className="space-y-4">
             <div className="micro-text uppercase tracking-[0.4em] text-plasma-cyan font-black opacity-60 flex items-center gap-2">
                <Maximize2 size={14} /> Dimensional Threshold
             </div>
             <HeroText className="text-left leading-none" color="text-white">Scale <br/><span className="text-plasma-cyan">Collapse.</span></HeroText>
          </div>
          
          <div className="space-y-8 max-w-xl">
            <p className="body-text text-xl text-white/80 leading-relaxed font-light">
              Complexity has surpassed human perception. Zoom into the density that forced the birth of <span className="text-plasma-cyan font-bold italic underline underline-offset-8 decoration-plasma-cyan/30">Hardware Description Languages.</span>
            </p>
            <p className="body-text text-base text-white/50 leading-relaxed text-left">
               As we transitioned from the 1970s to the 2020s, the number of transistors on a single chip grew by ten orders of magnitude. Drawing individual gates is no longer an option-it is a physical impossibility. We now describe abstract behavior and let synthesis engines build the metal.
            </p>

            <div className="p-10 rounded-[40px] bg-white/[0.02] border border-white/5 flex flex-col gap-8 items-start shadow-xl">
                <div className="flex justify-between w-full micro-text uppercase opacity-40 tracking-[0.2em] font-black text-[9px]">
                    <span>Manual Mapping (1970)</span>
                    <span>HDL Synthesis (2025)</span>
                </div>
                <div className="flex items-center gap-6 w-full">
                    <ZoomIn size={24} className="text-plasma-cyan flex-shrink-0" />
                    <input 
                        type="range" 
                        min="1" 
                        max="10" 
                        step="1"
                        value={scale}
                        onChange={(e) => setScale(Number(e.target.value))}
                        className="w-full h-8 bg-white/5 rounded-full appearance-none cursor-pointer accent-plasma-cyan"
                    />
                </div>
                <div className="space-y-2">
                    <div className="micro-text uppercase opacity-20 text-[10px] tracking-widest font-black">Calculated Physical Netlist Density</div>
                    <div className="hero-text text-4xl text-plasma-cyan leading-none">
                        10<sup className="text-xl"> {scale} </sup> <span className="text-white opacity-40 text-2xl uppercase tracking-widest ml-2">Units</span>
                    </div>
                </div>
            </div>
          </div>
        </div>

        {/* Right Column: Density Probe Monitor Dashboard */}
        <div className="relative h-[720px] w-full rounded-[60px] bg-black border border-white/5 overflow-hidden shadow-2xl p-12 flex flex-col">
            <div className="absolute top-10 left-10 micro-text opacity-40 tracking-[0.3em] font-black uppercase flex items-center gap-3">
                <Binary size={14} className="text-plasma-cyan" /> Silicon Complexity Threshold Monitor
            </div>

            <div className="flex-1 flex flex-col justify-center items-center relative gap-10">
                <div className="absolute inset-0 opacity-20 flex items-center justify-center overflow-hidden pointer-events-none">
                    <motion.div 
                        className="grid gap-1 scale-[2]"
                        style={{ 
                            gridTemplateColumns: `repeat(${Math.floor(scale * 12)}, 1fr)`,
                        }}
                    >
                        {Array.from({ length: 900 }).map((_, i) => (
                            <motion.div 
                                key={i} 
                                animate={{ 
                                    opacity: scale > 5 ? (i % 2 === 0 ? 0.4 : 0.1) : 0.05,
                                    backgroundColor: scale > 8 ? (i % 5 === 0 ? '#00D4FF' : '#121215') : 'transparent'
                                }}
                                className="w-2 h-2 rounded-sm border border-plasma-cyan/10" 
                            />
                        ))}
                    </motion.div>
                </div>

                <div className="relative z-10 flex flex-col items-center gap-10">
                    <AnimatePresence mode="wait">
                        <motion.div 
                            key={scale}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="bg-bg-elev p-12 rounded-[50px] border border-border-soft shadow-neo space-y-8 flex flex-col items-center max-w-lg w-full"
                        >
                            <div className="w-24 h-24 rounded-[30px] bg-plasma-cyan/10 border border-plasma-cyan/30 flex items-center justify-center text-plasma-cyan shadow-cyan-glow">
                                 {scale < 4 ? <Cpu size={40} /> : scale < 8 ? <Layers size={40} /> : <Binary size={40} />}
                            </div>
                            <div className="text-center space-y-4">
                                <div className="micro-text uppercase text-plasma-cyan/60 tracking-widest font-black text-[10px]">Architectural Classification</div>
                                <h3 className="hero-text text-4xl uppercase text-white tracking-widest leading-none">{getLabel(scale)}</h3>
                            </div>

                            {scale > 8 && (
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="px-8 py-6 rounded-3xl bg-burnished-copper/10 border border-burnished-copper/40 flex items-center gap-6"
                                >
                                    <AlertTriangle size={32} className="text-burnished-copper animate-pulse" />
                                    <div className="text-left">
                                        <div className="micro-text uppercase text-burnished-copper font-black text-[10px] tracking-widest">Cognitive Error</div>
                                        <div className="body-text text-xs text-white uppercase font-black">Perception Limit Surpassed</div>
                                    </div>
                                </motion.div>
                            )}
                        </motion.div>
                    </AnimatePresence>

                    <div className="grid grid-cols-2 gap-6 w-full">
                        <div className="p-8 rounded-[40px] bg-black border border-white/5 space-y-1">
                             <div className="micro-text uppercase opacity-20 tracking-widest text-[9px] font-black">Abstraction Level</div>
                             <div className="hero-text text-xl text-plasma-cyan">{scale > 6 ? 'ARCHITECTURAL' : 'STRUCTURAL'}</div>
                        </div>
                        <div className="p-8 rounded-[40px] bg-black border border-white/5 space-y-1">
                             <div className="micro-text uppercase opacity-20 tracking-widest text-[9px] font-black">Synthesis Effort</div>
                             <div className="hero-text text-xl text-white">{scale > 8 ? 'CRITICAL' : 'MINIMAL'}</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-8 flex items-center justify-between p-6 bg-bg-elev border border-border-soft rounded-3xl shadow-neo">
                <div className="flex items-center gap-4">
                    <Activity size={20} className="text-plasma-cyan" />
                    <div>
                        <div className="micro-text uppercase text-white/60 tracking-widest font-black">Complexity Verification</div>
                        <div className="body-text text-[10px] opacity-30 italic">Observing netlist instantiation requirements at current scale.</div>
                    </div>
                </div>
                <div className="px-4 py-1 rounded-full border border-plasma-cyan/30 text-plasma-cyan micro-text text-[9px] uppercase font-black">
                    L2 SCALE
                </div>
            </div>
        </div>
      </div>
    </BlueprintContainer>
  );
};
