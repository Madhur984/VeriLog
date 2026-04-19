import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BlueprintContainer } from "./common/BlueprintContainer";
import { HeroText } from "./common/HeroText";
import { RefreshCcw, Lock, DollarSign, Zap } from "lucide-react";

export const S14_FPGAvsASIC: React.FC<{ isActive: boolean }> = ({ isActive }) => {
  const [isAsic, setIsAsic] = useState(false);

  return (
    <BlueprintContainer>
      <HeroText>Same Code. Different Destiny.</HeroText>
      <p className="body-text text-xl md:text-2xl mt-6 mb-16 opacity-60 text-center max-w-3xl italic">
        Verilog is the source. The hardware target determines if your design lives in a reprogrammable maze or fixed silicon forever.
      </p>

      <div className="w-full max-w-5xl flex flex-col items-center gap-16">
        {/* Toggle Interaction */}
        <div className="flex items-center gap-10 bg-black/40 p-4 rounded-full border border-white/5 backdrop-blur-3xl">
            <button 
                onClick={() => setIsAsic(false)}
                className={`px-10 py-4 rounded-full micro-text transition-all ${!isAsic ? 'bg-[#00D4FF] text-black shadow-cyan-glow' : 'opacity-30 hover:opacity-100'}`}
            >
                FPGA Path
            </button>
            <div className="w-1 h-8 bg-white/10" />
            <button 
                onClick={() => setIsAsic(true)}
                className={`px-10 py-4 rounded-full micro-text transition-all ${isAsic ? 'bg-burnished-copper text-white shadow-lg' : 'opacity-30 hover:opacity-100'}`}
            >
                ASIC Path
            </button>
        </div>

        {/* Visual Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-stretch w-full">
            {/* Left/Main Visual Card */}
            <div className="relative group text-left">
                <AnimatePresence mode="wait">
                    <motion.div 
                        key={isAsic ? 'asic' : 'fpga'}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className={`h-full p-12 rounded-[60px] border relative overflow-hidden flex flex-col items-center justify-center text-center space-y-8 backdrop-blur-md ${isAsic ? 'bg-burnished-copper/5 border-burnished-copper/30' : 'bg-plasma-cyan/5 border-plasma-cyan/30'}`}
                    >
                        <div className="relative w-full h-[240px] rounded-3xl overflow-hidden mb-6">
                            <img src="/assets/module6/silicon.png" alt="Silicon Wafer" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                            <div className="absolute inset-0 bg-gradient-to-t from-burnished-copper/40 via-transparent to-transparent" />
                        </div>
                        <div className={`w-24 h-24 rounded-[30px] flex items-center justify-center transition-colors ${isAsic ? 'bg-burnished-copper/20 text-burnished-copper' : 'bg-plasma-cyan/20 text-plasma-cyan'}`}>
                             {isAsic ? <Lock size={48} /> : <RefreshCcw size={48} className="animate-spin-slow" />}
                        </div>
                        <h3 className="hero-text text-4xl uppercase italic leading-none">
                            {isAsic ? "Application Specific" : "Field Programmable"}
                        </h3>
                        <p className="body-text text-xl opacity-60 italic leading-snug">
                            {isAsic 
                                ? "Fixed into physical silicon at the foundry. Faster, more efficient, but permanent." 
                                : "A sea of gates connected by software switches. Slower and power-hungry, but infinite."
                            }
                        </p>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Stats/Metrics Column */}
            <div className="flex flex-col gap-6 justify-center">
                {[
                    { label: "Cost (Unit)", val: isAsic ? "LOW ($)" : "HIGH ($$$)", icon: DollarSign, color: isAsic ? 'text-burnished-copper' : 'text-plasma-cyan' },
                    { label: "Performance", val: isAsic ? "ULTIMATE" : "MID-RANGE", icon: Zap, color: isAsic ? 'text-burnished-copper' : 'text-plasma-cyan' },
                    { label: "Flexibility", val: isAsic ? "ZERO" : "INFINITE", icon: RefreshCcw, color: isAsic ? 'text-burnished-copper' : 'text-plasma-cyan' },
                ].map((stat, i) => (
                    <div key={i} className="p-8 rounded-[40px] bg-black/20 border border-white/5 flex items-center justify-between group hover:border-white/20 transition-all backdrop-blur-sm">
                        <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-xl bg-white/5 ${stat.color}`}>
                                {React.createElement(stat.icon, { size: 20 })}
                            </div>
                            <span className="micro-text opacity-40 uppercase">{stat.label}</span>
                        </div>
                        <span className={`hero-text text-xl uppercase italic ${stat.color}`}>{stat.val}</span>
                    </div>
                ))}
            </div>
        </div>
      </div>

      <div className="mt-16 text-center micro-text opacity-40 uppercase">
        Key Takeaway: The language connects you to both, but the silicon path dictates the economy.
      </div>

      <style>{`
        .animate-spin-slow {
            animation: spin 8s linear infinite;
        }
        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
      `}</style>
    </BlueprintContainer>
  );
};
