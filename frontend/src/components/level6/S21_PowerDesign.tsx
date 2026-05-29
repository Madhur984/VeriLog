import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, ShieldAlert, Thermometer, Battery, Activity, Share2, Binary, Database } from 'lucide-react';
import { BlueprintContainer } from "./common/BlueprintContainer";
import { HeroText } from "./common/HeroText";

export const S21_PowerDesign: React.FC<{ isActive: boolean }> = ({ isActive }) => {
  const [gatingEnabled, setGatingEnabled] = useState(true);

  return (
    <BlueprintContainer>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-24 items-start w-full">
        {/* Left Column: Narrative Sidebar */}
        <div className="space-y-10 sticky top-24">
          <div className="space-y-4">
             <div className="micro-text uppercase tracking-[0.4em] text-burnished-copper font-black opacity-60 flex items-center gap-2">
                <ShieldAlert size={14} /> PPA Performance Constraint
             </div>
             <HeroText className="text-left leading-none" color="text-white">Green <br/><span className="text-burnished-copper uppercase">Silicon.</span></HeroText>
          </div>
          
          <div className="space-y-8 max-w-xl">
            <p className="body-text text-xl text-white/80 leading-relaxed font-light text-left">
                Performance is no longer about speed-it's about the <span className="text-burnished-copper font-bold italic underline underline-offset-8 decoration-burnished-copper/30">Thermal Envelope.</span>
            </p>
            <p className="body-text text-base text-white/50 leading-relaxed text-left font-light">
               In modern chip design, we face the <span className="text-burnished-copper font-black italic uppercase tracking-widest text-xs">"Dark Silicon"</span> bottleneck: we have the area to build massive logic, but we don't have the thermal headroom to turn it all on simultaneously.
            </p>

            <div className="p-8 rounded-[40px] bg-[#0A0A0B] border border-white/5 border-l-4 border-l-burnished-copper shadow-xl group">
                 <div className="flex items-center gap-4 mb-4">
                    <Battery size={20} className="text-burnished-copper group-hover:animate-pulse" />
                    <span className="micro-text uppercase tracking-widest text-white/60 font-black">Dynamic Power Optimization</span>
                 </div>
                 <p className="body-text text-[11px] text-white/40 leading-relaxed font-light italic">
                    "Every flip-flop consumes energy. If it doesn't need to toggle, shut it down. Verilog power-gating is the difference between a functional chip and a melted sample."
                 </p>
            </div>

            <div className="flex items-center gap-4 text-white/20 px-4">
                <Activity size={16} />
                <span className="micro-text text-[9px] uppercase tracking-widest leading-loose font-black">
                    NPU Power Domain Controller v.1.2.0 // Active
                </span>
            </div>
          </div>
        </div>

        {/* Right Column: Thermal Logic Furnace Dashboard */}
        <div className="relative min-h-[720px] w-full rounded-[60px] bg-black border border-white/5 overflow-hidden shadow-2xl p-10 md:p-12 lg:p-16 flex flex-col items-center">
            <div className="absolute top-10 left-10 micro-text opacity-40 tracking-[0.3em] font-black uppercase flex items-center gap-3">
                <Thermometer size={14} className="text-burnished-copper" /> Die Thermal Anatomy // PPA_METRIC
            </div>

            <div className="flex-1 flex flex-col justify-center gap-12 w-full relative">
                {/* Background Heat Gradient */}
                <div className={`absolute inset-0 transition-opacity [transition-duration:2000ms] ${gatingEnabled ? 'opacity-10' : 'opacity-60'}`}>
                    <div className="absolute inset-0 bg-gradient-to-br from-red-600/40 via-orange-900/20 to-transparent blur-[120px]" />
                </div>

                <div className="flex justify-between items-center px-4 relative z-10">
                    <div className="space-y-1">
                        <div className="micro-text text-white/20 font-black uppercase tracking-[0.3em] text-[9px]">Logic Optimization Switch</div>
                        <div className="hero-text text-2xl text-white tracking-widest uppercase">Power Gating Scan</div>
                    </div>
                    <button 
                        onClick={() => setGatingEnabled(!gatingEnabled)}
                        className={`h-14 px-8 rounded-2xl micro-text font-black uppercase tracking-widest transition-all duration-700 shadow-xl flex items-center gap-3 ${gatingEnabled ? 'bg-plasma-cyan text-black' : 'bg-red-600 text-white animate-pulse'}`}
                    >
                        {gatingEnabled ? <ShieldAlert size={16} /> : <Zap size={16} />}
                        {gatingEnabled ? 'GATING_ACTIVE' : 'CRITICAL_HEAT'}
                    </button>
                </div>

                {/* Logic Domain Matrix */}
                <div className="grid grid-cols-4 gap-4 relative z-10">
                    {Array.from({ length: 16 }).map((_, i) => {
                        const isCoreActive = !gatingEnabled || i % 3 === 0;
                        return (
                            <div key={i} className="flex flex-col items-center gap-3">
                                <motion.div 
                                    animate={{ 
                                        borderColor: isCoreActive ? 'rgba(184, 115, 51, 0.5)' : 'rgba(255, 255, 255, 0.05)',
                                        backgroundColor: isCoreActive ? 'rgba(184, 115, 51, 0.05)' : 'transparent',
                                        scale: isCoreActive ? 1.05 : 1
                                    }}
                                    className="w-full aspect-square rounded-[22px] border flex flex-col items-center justify-center relative group/core overflow-hidden backdrop-blur-sm"
                                >
                                    <div className={`w-2 h-2 rounded-full transition-all [transition-duration:1000ms] ${isCoreActive ? 'bg-burnished-copper shadow-[0_0_10px_rgba(184,115,51,0.8)]' : 'bg-white/5 opacity-20'}`} />
                                    {isCoreActive && (
                                        <motion.div 
                                            animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.4, 0.1] }}
                                            transition={{ duration: 2, repeat: Infinity, delay: i * 0.15 }}
                                            className="absolute inset-0 rounded-[22px] border border-burnished-copper/20"
                                        />
                                    )}
                                    <div className="absolute top-2 right-2 opacity-10">
                                         <Share2 size={8} />
                                    </div>
                                </motion.div>
                                <span className={`micro-text text-[8px] tracking-[0.2em] uppercase font-black ${isCoreActive ? 'text-burnished-copper opacity-60' : 'text-white/10'}`}>
                                    DOM_0{i}
                                </span>
                            </div>
                        );
                    })}
                </div>

                {/* Tactical Metrics Footer Block */}
                <div className="p-8 rounded-[45px] bg-white/[0.02] border border-white/5 grid grid-cols-2 gap-10 items-center relative z-10 backdrop-blur-xl">
                    <div className="space-y-4">
                        <div className="flex justify-between items-end">
                            <div className="flex items-center gap-2">
                                <Database size={12} className="text-white/20" />
                                <span className="micro-text uppercase text-white/30 tracking-widest text-[9px] font-black">Consumed Wattage</span>
                            </div>
                            <span className={`mono-text text-sm font-black tracking-widest ${gatingEnabled ? 'text-plasma-cyan' : 'text-red-500'}`}>
                                {gatingEnabled ? '34.2W' : '156.8W'}
                            </span>
                        </div>
                        <div className="h-1.5 w-full bg-black/60 rounded-full overflow-hidden border border-white/5">
                            <motion.div 
                                animate={{ width: gatingEnabled ? "25%" : "95%" }}
                                transition={{ duration: 1, ease: "circOut" }}
                                className={`h-full shadow-lg ${gatingEnabled ? 'bg-plasma-cyan' : 'bg-red-500 shadow-red-500/40'}`}
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                         <div className="flex justify-between items-end">
                            <div className="flex items-center gap-2">
                                <Activity size={12} className="text-white/20" />
                                <span className="micro-text uppercase text-white/30 tracking-widest text-[9px] font-black">Silicon Thermal</span>
                            </div>
                            <span className={`mono-text text-sm font-black tracking-widest ${gatingEnabled ? 'text-plasma-cyan' : 'text-red-500'}`}>
                                {gatingEnabled ? '42°C' : '88°C'}
                            </span>
                        </div>
                        <div className="h-1.5 w-full bg-black/60 rounded-full overflow-hidden border border-white/5">
                            <motion.div 
                                animate={{ width: gatingEnabled ? "40%" : "90%" }}
                                transition={{ duration: 1, ease: "circOut" }}
                                className={`h-full shadow-lg ${gatingEnabled ? 'bg-plasma-cyan' : 'bg-orange-600'}`}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="absolute bottom-10 inset-x-12 flex items-center justify-between">
                <div className="flex items-center gap-4 text-white/20 italic">
                    <Binary size={14} className="text-burnished-copper" />
                    <span className="micro-text uppercase tracking-widest text-[9px] font-black">Optimizing PPA profile across the die logic fabric.</span>
                </div>
                <div className="micro-text uppercase text-white/10 tracking-[0.4em] font-black text-[9px]">
                   THERMAL_ID: DIE_482_XA
                </div>
            </div>
        </div>
      </div>
    </BlueprintContainer>
  );
};
