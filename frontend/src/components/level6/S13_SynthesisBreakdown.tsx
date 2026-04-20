import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BlueprintContainer } from "./common/BlueprintContainer";
import { HeroText } from "./common/HeroText";
import { ArrowRight, Code, Network, Zap, Factory, Binary, Share2, Activity, Settings2 } from "lucide-react";

const STAGES = [
  { 
    id: "expression", 
    label: "Expression", 
    icon: Code, 
    content: "assign Y = A & B;", 
    desc: "The engineer describes the architectural intent in high-level Register Transfer Level code.",
    pro: "RTL INTENT"
  },
  { 
    id: "graph", 
    label: "Logic Graph", 
    icon: Network, 
    content: "G_AND2 (Net_104, Net_202)", 
    desc: "The synthesis engine decomposes the code into a mathematical directed acyclic graph.",
    pro: "LOGIC BIND"
  },
  { 
    id: "gates", 
    label: "Gate Netlist", 
    icon: Zap, 
    content: "foundry_cell_and (0.12um)", 
    desc: "Abstract logic is mapped to physical semiconductor cells from a specific foundry library.",
    pro: "CELL MAP"
  },
  { 
    id: "structure", 
    label: "Physical Layout", 
    icon: Factory, 
    content: "M4_PIN (X: 112, Y: 432)", 
    desc: "The netlist is placed and routed onto the silicon base, defining literal metal traces.",
    pro: "METAL MASK"
  },
];

export const S13_SynthesisBreakdown: React.FC<{ isActive: boolean }> = ({ isActive }) => {
  const [step, setStep] = useState(0);

  return (
    <BlueprintContainer>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-24 items-start w-full">
        {/* Left Column: Narrative Sidebar */}
        <div className="space-y-10 sticky top-24">
          <div className="space-y-4">
             <div className="micro-text uppercase tracking-[0.4em] text-plasma-cyan font-black opacity-60 flex items-center gap-2">
                <Settings2 size={14} /> Industrial Mapping
             </div>
             <HeroText className="text-left leading-none" color="text-white">Synthesis <br/><span className="text-plasma-cyan">Furnace.</span></HeroText>
          </div>
          
          <div className="space-y-8 max-w-xl">
            <p className="body-text text-xl text-white/80 leading-relaxed font-light text-left">
              Verilog is just intent. Synthesis is the industrial process that transforms your text into <span className="text-plasma-cyan font-bold italic underline underline-offset-8 decoration-plasma-cyan/30">physical silicon architecture.</span>
            </p>
            <p className="body-text text-base text-white/50 leading-relaxed text-left">
               The "Furnace" takes your abstract behavioral descriptions and performs billions of physical mapping optimizations to ensure the final silicon meets timing, area, and power targets.
            </p>

            <div className="grid grid-cols-1 gap-3 pt-4">
                {STAGES.map((s, i) => (
                    <button 
                        key={s.id}
                        onClick={() => setStep(i)}
                        className={`p-5 rounded-[25px] border flex items-center justify-between transition-all duration-500 group ${step === i ? 'bg-plasma-cyan/10 border-plasma-cyan shadow-lg shadow-plasma-cyan/10' : 'bg-white/[0.02] border-white/5 opacity-40 hover:opacity-100'}`}
                    >
                        <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${step === i ? 'bg-plasma-cyan text-black' : 'bg-black text-plasma-cyan/40 group-hover:text-plasma-cyan'}`}>
                                <s.icon size={18} />
                            </div>
                            <div className="text-left">
                                <div className={`micro-text uppercase tracking-widest text-[9px] font-black ${step === i ? 'text-plasma-cyan' : 'text-white/20'}`}>Phase 0{i + 1}</div>
                                <div className={`hero-text text-lg uppercase ${step === i ? 'text-white' : 'text-white/40'}`}>{s.label}</div>
                            </div>
                        </div>
                        {step === i && <ArrowRight size={16} className="text-plasma-cyan" />}
                    </button>
                ))}
            </div>
          </div>
        </div>

        {/* Right Column: Physical Mapping Monitor Dashboard */}
        <div className="relative h-[720px] w-full rounded-[60px] bg-black border border-white/5 overflow-hidden shadow-2xl p-12 flex flex-col">
            <div className="absolute top-10 left-10 micro-text opacity-40 tracking-[0.3em] font-black uppercase flex items-center gap-3">
                <Binary size={14} className="text-plasma-cyan" /> RTL to Gate Transformation Diagnostic
            </div>

            <div className="flex-1 flex flex-col justify-center gap-12 relative">
                <AnimatePresence mode="wait">
                    <motion.div 
                        key={step}
                        initial={{ opacity: 0, x: 20, filter: 'blur(10px)' }}
                        animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, x: -20, filter: 'blur(10px)' }}
                        className="space-y-12"
                    >
                        <div className="p-10 rounded-[50px] bg-white/[0.01] border border-white/5 backdrop-blur-md relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-10 opacity-5 text-plasma-cyan pointer-events-none">
                                <span className="hero-text text-[140px] leading-none">0{step + 1}</span>
                            </div>
                            
                            <div className="space-y-10 relative z-10">
                                <div className="space-y-2">
                                    <div className="micro-text uppercase text-plasma-cyan/40 tracking-[0.3em] font-black text-[10px]">Matrix Output Fragment</div>
                                    <div className="mono-text text-3xl md:text-5xl text-white font-bold leading-none tracking-tight">
                                        {STAGES[step].content}
                                    </div>
                                </div>

                                <div className="space-y-4 max-w-xl">
                                    <h3 className="hero-text text-4xl uppercase text-white tracking-widest">{STAGES[step].label} // {STAGES[step].pro}</h3>
                                    <p className="body-text text-base opacity-40 leading-relaxed font-light">
                                        {STAGES[step].desc}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6 w-full">
                            <div className="p-8 rounded-[40px] bg-[#0A0A0B] border border-white/5 space-y-2">
                                 <div className="micro-text uppercase opacity-20 tracking-widest text-[9px] font-black">Synthesis Integrity</div>
                                 <div className="hero-text text-xl text-plasma-cyan">OPTIMIZED</div>
                            </div>
                            <div className="p-8 rounded-[40px] bg-[#0A0A0B] border border-white/5 space-y-2">
                                 <div className="micro-text uppercase opacity-20 tracking-widest text-[9px] font-black">Physical Area</div>
                                 <div className="hero-text text-xl text-white">4.2um²</div>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            <div className="mt-8 flex items-center justify-between p-8 bg-white/[0.02] border border-white/10 rounded-[40px] backdrop-blur-md">
                <div className="flex items-center gap-4">
                    <Share2 size={20} className="text-plasma-cyan" />
                    <div>
                        <div className="micro-text uppercase text-white/60 tracking-widest font-black">Industrial Pipeline Status</div>
                        <div className="body-text text-[10px] opacity-30 italic">Observing deterministic mapping from HL-behavior to physical netlist structure.</div>
                    </div>
                </div>
                <button 
                  onClick={() => setStep((step + 1) % STAGES.length)}
                  className="px-6 py-3 rounded-2xl bg-plasma-cyan text-black micro-text text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg shadow-plasma-cyan/20"
                >
                    Step Pipeline
                </button>
            </div>
        </div>
      </div>
    </BlueprintContainer>
  );
};
