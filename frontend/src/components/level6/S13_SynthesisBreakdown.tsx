import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BlueprintContainer } from "./common/BlueprintContainer";
import { HeroText } from "./common/HeroText";
import { ArrowRight, Code, Network, Zap, Factory } from "lucide-react";

const STAGES = [
  { 
    id: "expression", 
    label: "Expression", 
    icon: Code, 
    content: "assign Y = A & B;", 
    desc: "The engineer describes the intent in high-level code." 
  },
  { 
    id: "graph", 
    label: "Logic Graph", 
    icon: Network, 
    content: "AND2 (Net 1, Net 2)", 
    desc: "The tool recognizes the logical relationships between signals." 
  },
  { 
    id: "gates", 
    label: "Gate Netlist", 
    icon: Zap, 
    content: "TSMC_LP_AND (Cell 0x4F)", 
    desc: "Abstract logic is mapped to physical cells in a specific foundry library." 
  },
  { 
    id: "structure", 
    label: "Physical Layout", 
    icon: Factory, 
    content: "X: 45.2, Y: 112.9 (Layer 4)", 
    desc: "The gates are placed and routed onto the silicon base." 
  },
];

export const S13_SynthesisBreakdown: React.FC<{ isActive: boolean }> = ({ isActive }) => {
  const [step, setStep] = useState(0);

  return (
    <BlueprintContainer>
      <HeroText>Synthesis = Translation.</HeroText>
      <p className="body-text text-xl md:text-2xl opacity-60 italic mt-6 mb-16 text-center max-w-3xl">
        Demystifying the magic. See how your text becomes a physical object through the synthesis furnace.
      </p>

      <div className="w-full max-w-5xl space-y-16">
        {/* Step Indicator */}
        <div className="flex items-center justify-between relative px-10">
            <div className="absolute top-1/2 left-0 right-0 h-px bg-white/5 -translate-y-1/2" />
            
            {STAGES.map((s, i) => (
                <div key={s.id} className="relative z-10 flex flex-col items-center gap-4">
                    <button 
                        onClick={() => setStep(i)}
                        className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-500 ${step >= i ? 'bg-plasma-cyan text-black shadow-cyan-glow scale-110' : 'bg-black/40 border border-white/10 text-white/20'}`}
                    >
                        {React.createElement(s.icon, { size: 28, strokeWidth: 1.5 })}
                    </button>
                    <span className={`micro-text uppercase ${step >= i ? 'text-plasma-cyan' : 'opacity-20'}`}>{s.label}</span>
                </div>
            ))}
        </div>

        {/* Dynamic Transition Card */}
        <div className="relative h-[300px] flex items-center justify-center">
            <AnimatePresence mode="wait">
                <motion.div 
                    key={step}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 30 }}
                    className="w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
                >
                    <div className="p-12 rounded-[50px] bg-black/60 border border-plasma-cyan/30 backdrop-blur-3xl shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-5 text-plasma-cyan">
                            <span className="hero-text text-8xl italic">0{step + 1}</span>
                        </div>
                        <div className="space-y-6">
                            <div className="micro-text uppercase text-plasma-cyan">Output Fragment</div>
                            <div className="mono-text text-3xl md:text-4xl italic text-white tracking-tighter">
                                {STAGES[step].content}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6 text-center md:text-left">
                        <h3 className="hero-text text-4xl italic uppercase leading-none">{STAGES[step].label}</h3>
                        <p className="body-text text-xl opacity-60 italic leading-snug">
                            "{STAGES[step].desc}"
                        </p>
                        <button 
                            onClick={() => setStep((step + 1) % STAGES.length)}
                            className="px-8 py-3 rounded-full border border-plasma-cyan text-plasma-cyan micro-text uppercase hover:bg-plasma-cyan hover:text-black transition-all flex items-center gap-3 mx-auto md:mx-0"
                        >
                            Next Transformation <ArrowRight size={14} />
                        </button>
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
      </div>

      <div className="mt-16 text-center micro-text opacity-40 uppercase">
        Key Takeaway: Synthesis is a one-way mirror. Intent goes in, structure comes out.
      </div>
    </BlueprintContainer>
  );
};
