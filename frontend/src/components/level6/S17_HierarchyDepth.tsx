import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BlueprintContainer } from "./common/BlueprintContainer";
import { HeroText } from "./common/HeroText";
import { Search, ChevronDown, Cpu, Layers, HardDrive } from "lucide-react";

const SYSTEM_TREE = {
  id: "cpu",
  label: "CPU (Top Module)",
  icon: Cpu,
  children: [
    { 
        id: "alu", 
        label: "ALU (Sub-Module)", 
        icon: HardDrive,
        children: [
            { id: "adder", label: "32-Bit Adder", icon: Layers, children: [] },
            { id: "mult", label: "Multiplier", icon: Layers, children: [] }
        ]
    },
    { 
        id: "cu", 
        label: "Control Unit", 
        icon: HardDrive,
        children: []
    }
  ]
};

export const S17_HierarchyDepth: React.FC<{ isActive: boolean }> = ({ isActive }) => {
  const [depth, setDepth] = useState(0);

  return (
    <BlueprintContainer>
      <HeroText>Hardware is Recursive.</HeroText>
      <p className="body-text text-xl md:text-2xl opacity-60 italic mt-6 mb-20 text-center max-w-3xl">
        Complex chips are not monolithic blocks. They are fractals: modules within modules, layers within layers.
      </p>

      <div className="w-full max-w-4xl flex flex-col items-center gap-16 relative">
          {/* Visual Zoomable Tree Representation */}
          <div className="relative w-full h-[500px] flex items-center justify-center p-12 bg-black/40 border border-white/5 rounded-[60px] overflow-hidden backdrop-blur-md">
                <div className="absolute inset-0 bg-dot-grid opacity-10 pointer-events-none" />
                
                <AnimatePresence mode="wait">
                    <motion.div 
                        key={depth}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.2 }}
                        className="flex flex-col items-center gap-16"
                    >
                        {/* Current Level Node */}
                        <div className="p-12 rounded-[50px] bg-plasma-cyan/10 border border-plasma-cyan/30 flex flex-col items-center gap-6 shadow-cyan-glow relative backdrop-blur-3xl">
                             <div className="w-24 h-24 rounded-3xl bg-black flex items-center justify-center text-plasma-cyan shadow-inner">
                                {depth === 0 ? <Cpu size={48} strokeWidth={1.5} /> : <HardDrive size={48} strokeWidth={1.5} />}
                             </div>
                             <div className="text-center">
                                <h3 className="hero-text text-3xl italic uppercase whitespace-nowrap">
                                    {depth === 0 ? "CPU Architecture" : depth === 1 ? "Arithmetic Logic Unit" : "Arithmetic Core"}
                                </h3>
                                <div className="micro-text uppercase text-[#00D4FF] opacity-40 mt-1">
                                    Level 0{depth + 1} Abstraction
                                </div>
                             </div>
                        </div>

                        {/* Connection Lines (Simulated) */}
                        <div className="w-px h-16 bg-gradient-to-b from-plasma-cyan/50 to-transparent" />

                        {/* Child Preview Nodes */}
                        <div className="flex gap-10">
                            {[1, 2].map((i) => (
                                <div key={i} className="p-6 rounded-3xl border border-white/5 bg-white/[0.02] flex items-center gap-4 opacity-40 grayscale blur-[1px] backdrop-blur-sm">
                                    <Layers size={16} />
                                    <span className="micro-text uppercase">Sub-Component {i}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </AnimatePresence>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-8 bg-black/60 p-6 rounded-full border border-white/10 backdrop-blur-xl shadow-2xl">
                <button 
                    disabled={depth === 0}
                    onClick={() => setDepth(d => Math.max(0, d - 1))}
                    className="p-5 rounded-full bg-white/5 border border-white/10 text-plasma-cyan disabled:opacity-10 transition-all hover:bg-plasma-cyan hover:text-black shadow-lg"
                >
                    <Search className="scale-x-[-1]" size={28} />
                </button>
                <div className="flex flex-col items-center gap-1 min-w-[120px]">
                    <div className="micro-text uppercase opacity-30">Depth Scan</div>
                    <div className="mono-text text-2xl italic text-plasma-cyan">L.0{depth + 1}</div>
                </div>
                <button 
                    disabled={depth === 2}
                    onClick={() => setDepth(d => Math.min(2, d + 1))}
                    className="p-5 rounded-full bg-white/5 border border-white/10 text-plasma-cyan disabled:opacity-10 transition-all hover:bg-plasma-cyan hover:text-black shadow-lg"
                >
                    <Search size={28} />
                </button>
          </div>
      </div>

      <div className="mt-16 text-center micro-text opacity-40 uppercase">
        Key Takeaway: The 'Instantiated Module' is how Verilog manages infinite scale.
      </div>
    </BlueprintContainer>
  );
};
