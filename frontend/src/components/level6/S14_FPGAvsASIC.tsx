import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BlueprintContainer } from "./common/BlueprintContainer";
import { HeroText } from "./common/HeroText";
import { RefreshCcw, Lock, DollarSign, Zap, ArrowRight, Cpu, Layers, Share2, Activity, ShieldAlert } from "lucide-react";

export const S14_FPGAvsASIC: React.FC<{ isActive: boolean }> = ({ isActive }) => {
  const [isAsic, setIsAsic] = useState(false);

  return (
    <BlueprintContainer>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-24 items-start w-full">
        {/* Left Column: Narrative Sidebar */}
        <div className="space-y-10 sticky top-24">
          <div className="space-y-4">
             <div className="micro-text uppercase tracking-[0.4em] text-plasma-cyan font-black opacity-60 flex items-center gap-2">
                <Cpu size={14} /> Platform Architecture
             </div>
             <HeroText className="text-left leading-none" color="text-white">Silicon <br/><span className={isAsic ? 'text-burnished-copper' : 'text-plasma-cyan'}>Destiny.</span></HeroText>
          </div>
          
          <div className="space-y-8 max-w-xl">
            <p className="body-text text-xl text-white/80 leading-relaxed font-light text-left">
                Verilog is the source. The hardware target determines if your design lives in a <span className="text-plasma-cyan font-bold italic underline underline-offset-8 decoration-plasma-cyan/30">reprogrammable maze</span> or <span className="text-burnished-copper font-bold italic underline underline-offset-8 decoration-burnished-copper/30">fixed silicon</span> forever.
            </p>
            <p className="body-text text-base text-white/50 leading-relaxed text-left">
               While HDL remains consistent, the physical implementation differs wildly. An FPGA provides instant flexibility but loses in efficiency. An ASIC offers peak performance but remains immutable once the silicon is struck.
            </p>

            <div className="flex flex-col gap-4 pt-4">
                <button 
                    onClick={() => setIsAsic(false)}
                    className={`group flex items-center justify-between p-6 rounded-[35px] border transition-all duration-500 overflow-hidden relative ${!isAsic ? 'bg-plasma-cyan/10 border-plasma-cyan shadow-lg shadow-plasma-cyan/20' : 'bg-[#0A0A0B] border-white/5 opacity-40 hover:opacity-100'}`}
                >
                    <div className="flex items-center gap-5">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${!isAsic ? 'bg-plasma-cyan text-black' : 'bg-black text-plasma-cyan/40'}`}>
                             <RefreshCcw size={20} className={!isAsic ? 'animate-spin-slow' : ''} />
                        </div>
                        <div className="text-left">
                            <div className="micro-text uppercase tracking-widest text-[9px] font-black opacity-40">Prototyping Level</div>
                            <div className="hero-text text-lg uppercase text-white">FPGA Fabric</div>
                        </div>
                    </div>
                    {!isAsic && <ArrowRight size={18} className="text-plasma-cyan animate-pulse" />}
                </button>

                <button 
                    onClick={() => setIsAsic(true)}
                    className={`group flex items-center justify-between p-6 rounded-[35px] border transition-all duration-500 overflow-hidden relative ${isAsic ? 'bg-burnished-copper/10 border-burnished-copper shadow-lg shadow-burnished-copper/20' : 'bg-[#0A0A0B] border-white/5 opacity-40 hover:opacity-100'}`}
                >
                    <div className="flex items-center gap-5">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${isAsic ? 'bg-burnished-copper text-black' : 'bg-black text-burnished-copper/40'}`}>
                             <Lock size={20} />
                        </div>
                        <div className="text-left">
                            <div className="micro-text uppercase tracking-widest text-[9px] font-black opacity-40">Production Level</div>
                            <div className="hero-text text-lg uppercase text-white">ASIC Silicon</div>
                        </div>
                    </div>
                    {isAsic && <ArrowRight size={18} className="text-burnished-copper animate-pulse" />}
                </button>
            </div>
          </div>
        </div>

        {/* Right Column: Substrate Divergence Matrix Dashboard */}
        <div className="relative h-[720px] w-full rounded-[60px] bg-black border border-white/5 overflow-hidden shadow-2xl p-12 flex flex-col">
            <div className="absolute top-10 left-10 micro-text opacity-40 tracking-[0.3em] font-black uppercase flex items-center gap-3">
                <Layers size={14} className={isAsic ? 'text-burnished-copper' : 'text-plasma-cyan'} /> Substrate Divergence Analyzer
            </div>

            <div className="flex-1 flex flex-col justify-center gap-12">
                <AnimatePresence mode="wait">
                    <motion.div 
                        key={isAsic ? 'asic' : 'fpga'}
                        initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
                        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
                        className="grid grid-cols-2 gap-6"
                    >
                        {[
                            { label: 'Unit Cost', value: isAsic ? '$2.00' : '$500', sub: isAsic ? '@ 1M Volume' : '@ Low Vol', icon: DollarSign, color: isAsic ? 'burnished-copper' : 'plasma-cyan' },
                            { label: 'Perf/Watt', value: isAsic ? 'PEAK' : 'MEDIUM', sub: isAsic ? 'Hardwired Efficiency' : 'SRAM Overhead', icon: Zap, color: isAsic ? 'burnished-copper' : 'plasma-cyan' },
                            { label: 'Configure', value: isAsic ? 'FIXED' : 'INSTANT', sub: isAsic ? 'Silicon Immutability' : 'Soft Re-Mapping', icon: RefreshCcw, color: isAsic ? 'burnished-copper' : 'plasma-cyan' },
                            { label: 'Market Time', value: isAsic ? '24mo' : '1wk', sub: isAsic ? 'Full Fab Cycle' : 'Compile Cycle', icon: Layers, color: isAsic ? 'burnished-copper' : 'plasma-cyan' }
                        ].map((stat, idx) => (
                            <div key={idx} className="bg-[#0A0A0B] border border-white/5 p-8 rounded-[40px] group hover:bg-[#121215] transition-all relative overflow-hidden">
                                <stat.icon className={`mb-6 ${stat.color === 'plasma-cyan' ? 'text-plasma-cyan' : 'text-burnished-copper'}`} size={28} />
                                <div className="micro-text uppercase opacity-20 font-black mb-1 tracking-widest text-[9px]">{stat.label}</div>
                                <div className="hero-text text-3xl text-white mb-2 tracking-widest">{stat.value}</div>
                                <div className={`micro-text uppercase text-[10px] font-black italic ${stat.color === 'plasma-cyan' ? 'text-plasma-cyan/40' : 'text-burnished-copper/40'}`}>{stat.sub}</div>
                                <div className="absolute top-0 right-0 p-4 opacity-5">
                                    <Activity size={40} />
                                </div>
                            </div>
                        ))}
                    </motion.div>
                </AnimatePresence>

                <div className={`p-8 rounded-[40px] bg-white/[0.02] border border-white/10 flex items-center justify-between backdrop-blur-md`}>
                    <div className="flex items-center gap-6">
                        <div className={`w-16 h-16 rounded-[25px] flex items-center justify-center ${isAsic ? 'bg-burnished-copper/20 text-burnished-copper' : 'bg-plasma-cyan/20 text-plasma-cyan shadowed-glow'}`}>
                             {isAsic ? <ShieldAlert size={32} /> : <Activity size={32} />}
                        </div>
                        <div>
                            <div className="micro-text uppercase text-white/40 tracking-widest font-black text-[10px]">Strategic Decision Variable</div>
                            <div className="hero-text text-xl text-white uppercase tracking-widest">
                                {isAsic ? 'Extreme NRE // High Yield' : 'Zero NRE // Low Risk'}
                            </div>
                        </div>
                    </div>
                    <div className={`px-4 py-1 rounded-full border text-[9px] font-black uppercase tracking-[0.3em] ${isAsic ? 'border-burnished-copper text-burnished-copper' : 'border-plasma-cyan text-plasma-cyan'}`}>
                        {isAsic ? 'Production Ready' : 'Prototyping'}
                    </div>
                </div>
            </div>

            <div className="mt-8 flex items-center justify-between px-2">
                <div className="flex items-center gap-4">
                    <Share2 size={18} className="text-plasma-cyan opacity-40" />
                    <div className="micro-text uppercase text-white/20 tracking-widest font-black text-[9px]">Target Device Topology Analyzer // Locked</div>
                </div>
                <div className="micro-text uppercase text-white/10 text-[9px] italic">VeriLog Engineering Core v6.0</div>
            </div>
        </div>
      </div>
    </BlueprintContainer>
  );
};
