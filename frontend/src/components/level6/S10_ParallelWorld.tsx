import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BlueprintContainer } from "./common/BlueprintContainer";
import { HeroText } from "./common/HeroText";
import { Waveform } from "./common/Waveform";
import { Zap, Play } from "lucide-react";

export const S10_ParallelWorld: React.FC<{ isActive: boolean }> = ({ isActive }) => {
  const [running, setRunning] = useState(false);

  const signals = [
    { name: "Input A", values: [0, 1, 0, 1, 1, 0] },
    { name: "Input B", values: [1, 1, 0, 0, 1, 1] },
    { name: "Logic Y", values: running ? [0, 1, 0, 0, 1, 0] as (0|1)[] : [0, 0, 0, 0, 0, 0] as (0|1)[] },
    { name: "Logic Z", values: running ? [1, 1, 0, 1, 1, 1] as (0|1)[] : [0, 0, 0, 0, 0, 0] as (0|1)[] },
  ];

  return (
    <BlueprintContainer>
      <HeroText>Everything happens at once.</HeroText>
      <p className="text-xl md:text-2xl opacity-60 font-black italic mt-6 mb-12 text-center max-w-3xl">
        Break the sequential mindset. In Verilog, assignments don't wait for each other. They exist in <span className="text-plasma-cyan italic">parallel harmony</span>.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full mb-12">
        <div className={`p-8 rounded-[40px] bg-black/40 border transition-all duration-500 ${running ? "border-plasma-cyan shadow-cyan-glow" : "border-white/5"}`}>
          <div className="flex items-center gap-3 text-plasma-cyan mb-6">
            <Zap size={20} />
            <span className="text-xs font-black uppercase tracking-widest">Concurrent Assignment 1</span>
          </div>
          <code className="text-xl md:text-2xl font-mono font-black text-white italic">
            assign Y = A & B;
          </code>
        </div>
        <div className={`p-8 rounded-[40px] bg-black/40 border transition-all duration-500 ${running ? "border-plasma-cyan shadow-cyan-glow" : "border-white/5"}`}>
          <div className="flex items-center gap-3 text-plasma-cyan mb-6">
            <Zap size={20} />
            <span className="text-xs font-black uppercase tracking-widest">Concurrent Assignment 2</span>
          </div>
          <code className="text-xl md:text-2xl font-mono font-black text-white italic">
            assign Z = A | B;
          </code>
        </div>
      </div>

      <AnimatePresence>
        {isActive && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full flex flex-col items-center"
          >
            <Waveform signals={signals as any} className="mb-10" />
            
            <button 
                onClick={() => setRunning(!running)}
                className="group relative px-12 py-5 bg-plasma-cyan text-black font-black uppercase tracking-widest rounded-full overflow-hidden transition-all hover:scale-110 active:scale-95 flex items-center gap-4"
            >
                <Play size={24} fill="currentColor" />
                {running ? "Reset System" : "Trigger Execution"}
                <div className="absolute inset-x-0 h-1 bottom-0 bg-white/20 group-hover:bg-white/40 transition-colors" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-12 text-center opacity-40 font-black italic text-lg uppercase tracking-tighter">
        Key Takeaway: You describe structure, not step-by-step instructions.
      </div>
    </BlueprintContainer>
  );
};
