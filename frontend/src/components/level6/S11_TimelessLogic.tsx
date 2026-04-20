import React, { useState } from "react";
import { motion } from "framer-motion";
import { BlueprintContainer } from "./common/BlueprintContainer";
import { HeroText } from "./common/HeroText";
import { Zap, Clock, AlertCircle } from "lucide-react";

export const S11_TimelessLogic: React.FC<{ isActive: boolean }> = ({ isActive }) => {
  const [input, setInput] = useState(0);

  return (
    <BlueprintContainer>
      <HeroText>Logic has no time.</HeroText>
      <p className="body-text text-xl md:text-2xl opacity-60 italic mt-6 mb-16 text-center max-w-3xl">
        Pure combinational logic is instantaneous (ideal). Change an input, and the world recalibrates immediately.
      </p>

      <div className="flex flex-col items-center gap-12 w-full max-w-2xl">
        {/* Interaction Area */}
        <div className="w-full p-12 rounded-[50px] bg-black/40 border border-white/5 flex flex-col items-center gap-8 shadow-2xl relative overflow-hidden group backdrop-blur-md">
            <div className="absolute top-0 left-0 p-6 opacity-10">
                <Zap size={64} className="text-plasma-cyan" />
            </div>
            
            <div className="micro-text uppercase text-plasma-cyan mb-4">Input Voltage (A)</div>
            
            <div className="flex items-center gap-10">
                <button 
                    onClick={() => setInput(0)}
                    className={`w-24 h-24 rounded-3xl border-2 flex items-center justify-center body-text text-2xl transition-all ${input === 0 ? 'bg-plasma-cyan border-plasma-cyan text-black font-bold' : 'border-white/10 opacity-30'}`}
                >
                    0V
                </button>
                <div className="w-32 h-1 bg-white/10 relative">
                    <motion.div 
                        initial={false}
                        animate={{ x: input === 1 ? '100%' : '0%' }}
                        className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-plasma-cyan shadow-cyan-glow" 
                    />
                </div>
                <button 
                    onClick={() => setInput(1)}
                    className={`w-24 h-24 rounded-3xl border-2 flex items-center justify-center body-text text-2xl transition-all ${input === 1 ? 'bg-plasma-cyan border-plasma-cyan text-black font-bold' : 'border-white/10 opacity-30'}`}
                >
                    1V
                </button>
            </div>

            <div className="w-full h-px bg-white/10 my-6" />

            <div className="flex flex-col items-center gap-2">
                <div className="micro-text uppercase text-white/40">Real-Time Output (Y)</div>
                <motion.div 
                    key={input}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className={`hero-text text-8xl italic transition-colors ${input === 1 ? 'text-plasma-cyan shadow-cyan-glow' : 'text-white/10'}`}
                >
                    {input === 1 ? "HIGH" : "LOW"}
                </motion.div>
            </div>
        </div>

        <div className="flex items-center gap-4 p-6 rounded-3xl bg-black/40 border-l-4 border-cyber-amber">
            <Clock size={24} className="text-cyber-amber" />
            <p className="body-text text-lg opacity-60 italic">
                Time does not exist… <span className="text-white italic underline underline-offset-4">until we create it</span>.
            </p>
        </div>
      </div>

      <div className="mt-16 text-center micro-text opacity-40 uppercase flex items-center gap-3">
        <AlertCircle size={20} />
        Combinational logic is timeless. It only knows presence.
      </div>
    </BlueprintContainer>
  );
};
