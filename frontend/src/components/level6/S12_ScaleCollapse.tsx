import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BlueprintContainer } from "./common/BlueprintContainer";
import { HeroText } from "./common/HeroText";
import { Cpu, Maximize2, Layers, AlertTriangle } from "lucide-react";

export const S12_ScaleCollapse: React.FC<{ isActive: boolean }> = ({ isActive }) => {
  const [scale, setScale] = useState(1);

  const getLabel = (s: number) => {
    if (s < 2) return "Single Gate (AND)";
    if (s < 4) return "1,000 Gates (ALU)";
    if (s < 7) return "1,000,000+ Gates (L1 Cache)";
    return "10,000,000,000+ Gates (Modern GPU)";
  };

  return (
    <BlueprintContainer>
      <HeroText>Scale Collapse.</HeroText>
      <p className="body-text text-xl md:text-2xl opacity-60 italic mt-6 mb-16 text-center max-w-3xl">
        You cannot design this manually. Zoom into the complexity that forced the birth of HDL.
      </p>

      <div className="w-full max-w-3xl space-y-12">
        {/* Visual Complexity Area */}
        <div className="relative h-[400px] w-full rounded-[60px] bg-black border border-white/5 overflow-hidden flex items-center justify-center p-10">
            {/* Massive Grid of small components */}
            <motion.div 
                className="grid gap-1 opacity-20"
                style={{ 
                    gridTemplateColumns: `repeat(${Math.floor(scale * 10)}, 1fr)`,
                    scale: 1 + (scale * 0.2)
                }}
            >
                {Array.from({ length: 400 }).map((_, i) => (
                    <motion.div 
                        key={i} 
                        initial={false}
                        animate={{ 
                            opacity: scale > 5 ? (i % 2 === 0 ? 0.8 : 0.2) : 0.1,
                            backgroundColor: scale > 8 ? (i % 3 === 0 ? '#00E5FF' : '#121215') : 'transparent'
                        }}
                        className="w-2 h-2 rounded-sm border border-plasma-cyan/20" 
                    />
                ))}
            </motion.div>

            {/* Content Overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-transparent pointer-events-none">
                <AnimatePresence mode="wait">
                    <motion.div 
                        key={scale}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center space-y-4"
                    >
                        <div className="w-24 h-24 rounded-[30px] bg-plasma-cyan/10 border border-plasma-cyan/30 flex items-center justify-center text-plasma-cyan mx-auto shadow-cyan-glow">
                             {scale < 4 ? <Cpu size={48} /> : <Layers size={48} />}
                        </div>
                        <h3 className="hero-text text-4xl italic uppercase">{getLabel(scale)}</h3>
                    </motion.div>
                </AnimatePresence>
            </div>

            {scale > 8 && (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 bg-burnished-copper/10 backdrop-blur-sm flex items-center justify-center border-4 border-burnished-copper/50 animate-pulse pointer-events-none"
                >
                    <div className="micro-text uppercase text-burnished-copper flex items-center gap-4">
                        <AlertTriangle size={32} />
                        Human Perception Limit Reached
                    </div>
                </motion.div>
            )}
        </div>

        {/* Zoom Control */}
        <div className="p-10 rounded-[40px] bg-white/[0.02] border border-white/5 flex flex-col gap-8 items-center">
            <div className="flex justify-between w-full micro-text uppercase opacity-40">
                <span>Standard (1970)</span>
                <span>Bleeding Edge (2025)</span>
            </div>
            <div className="flex items-center gap-6 w-full">
                <Maximize2 size={24} className="text-plasma-cyan flex-shrink-0" />
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
            <div className="hero-text text-3xl text-plasma-cyan italic underline underline-offset-8">
                Scale: 10<sup>{scale}</sup> Physical Gates
            </div>
        </div>
      </div>

      <div className="mt-16 text-center micro-text opacity-40 uppercase">
        Key Takeaway: Synthesis is the tool that handles what our eyes no longer can.
      </div>
    </BlueprintContainer>
  );
};
