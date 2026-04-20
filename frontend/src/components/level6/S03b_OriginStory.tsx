import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { History, ChevronRight, Award, Globe, Archive, Clock, Terminal } from 'lucide-react';
import { BlueprintContainer } from './common/BlueprintContainer';
import { HeroText } from './common/HeroText';

export const S03b_OriginStory: React.FC<{ isActive: boolean }> = ({ isActive }) => {
  const [selectedYear, setSelectedYear] = useState(1983);

  const TIMELINE = [
    { year: 1983, event: "Born in EDA Wars", detail: "Gateway Design creates Verilog for the XL simulator to handle complex logic gates.", icon: Terminal },
    { year: 1995, event: "The IEEE Standard", detail: "Formalized as IEEE 1364, becoming the global backbone for digital hardware description.", icon: Award },
    { year: 2025, event: "The AI Era", detail: "Powers every NVIDIA GPU, iPhone SoC, and high-performance neural engine in existence.", icon: Globe }
  ];

  return (
    <BlueprintContainer>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-24 items-start w-full">
        {/* Left Column: Narrative Sidebar */}
        <div className="space-y-10 sticky top-24">
          <div className="space-y-4">
             <div className="micro-text uppercase tracking-[0.4em] text-amber-500 font-black opacity-60 flex items-center gap-2">
                <History size={14} /> Historical Legitimacy
             </div>
             <HeroText className="text-left leading-none" color="text-white">The <br/><span className="text-amber-500">Genesis.</span></HeroText>
          </div>
          
          <div className="space-y-8 max-w-xl">
            <p className="body-text text-xl text-white/80 leading-relaxed font-light">
              Verilog wasn't born in a sterile research lab. It was forged in the heat of the <span className="text-amber-500 font-bold italic underline underline-offset-8 decoration-amber-500/30">1980s EDA wars.</span>
            </p>
            <p className="body-text text-base text-white/50 leading-relaxed">
               Industry demands outpaced human drafting. Gateway Design Automation created Verilog to solve the impossible math of chip logic, transitioning from manual gate drawings to <span className="text-white font-bold">automated silicon synthesis.</span>
            </p>

            <div className="grid grid-cols-1 gap-3 pt-4">
                {TIMELINE.map((item) => (
                    <button 
                        key={item.year}
                        onClick={() => setSelectedYear(item.year)}
                        className={`flex items-center gap-6 p-6 rounded-[30px] border transition-all duration-500 text-left group ${selectedYear === item.year ? 'bg-amber-500/10 border-amber-500/40 scale-[1.02]' : 'bg-white/[0.02] border-white/5 opacity-40 hover:opacity-100 hover:bg-white/[0.05]'}`}
                    >
                        <div className={`p-4 rounded-xl border transition-colors ${selectedYear === item.year ? 'bg-amber-500/20 border-amber-500 text-amber-500' : 'bg-black border-white/5 text-white/30'}`}>
                            <item.icon size={20} />
                        </div>
                        <div className="flex-1">
                            <div className="hero-text text-2xl uppercase tracking-tighter text-white">{item.year}</div>
                            <div className="micro-text uppercase tracking-widest font-black opacity-40">{item.event}</div>
                        </div>
                        {selectedYear === item.year && <ChevronRight size={20} className="text-amber-500 animate-pulse" />}
                    </button>
                ))}
            </div>
          </div>
        </div>

        {/* Right Column: Historical Archive Dashboard */}
        <div className="relative h-[720px] w-full rounded-[60px] bg-black border border-white/5 overflow-hidden shadow-2xl p-12 flex flex-col">
            <div className="absolute top-10 left-10 micro-text opacity-40 tracking-[0.3em] font-black uppercase flex items-center gap-3">
                <Archive size={14} className="text-amber-500" /> Silicon Pedigree Archive
            </div>

            <div className="flex-1 flex flex-col justify-center gap-12">
                <div className="relative group self-center">
                    <div className="absolute -inset-4 bg-amber-500/20 blur-[60px] rounded-full opacity-30 group-hover:opacity-100 transition-opacity" />
                    <div className="relative w-[500px] h-[340px] rounded-[40px] overflow-hidden border border-white/10 shadow-2xl bg-black flex items-center justify-center p-8">
                         {/* Retro Terminal Logic Viz */}
                         <div className="w-full h-full border border-amber-500/20 rounded-2xl bg-amber-500/[0.02] p-6 font-mono text-[10px] text-amber-500/40 relative overflow-hidden">
                             <div className="mb-4 text-amber-500 micro-text opacity-100">GATEWAY_XL_SIMULATOR_BOOT_V1.0</div>
                             {[...Array(12)].map((_, i) => (
                                <div key={i} className="mb-1">
                                    [LOG_{1983+i}] MAPPING PHYSICAL NODES TO LOGICAL NETLIST... OK
                                </div>
                             ))}
                             <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                             <div className="absolute bottom-6 left-6 text-amber-500 text-xs font-bold animate-pulse">SYSTEM READY &gt;_</div>
                         </div>
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    <motion.div 
                        key={selectedYear}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6 px-4"
                    >
                        <div className="flex items-center gap-6">
                            <HeroText className="text-6xl text-white opacity-20" color="text-white">{selectedYear}</HeroText>
                            <div className="h-0.5 flex-1 bg-amber-500/20" />
                        </div>
                        <div className="space-y-4">
                            <h3 className="hero-text text-3xl uppercase text-white tracking-widest leading-none">
                                {TIMELINE.find(t => t.year === selectedYear)?.event}
                            </h3>
                            <p className="body-text text-lg text-white/50 leading-relaxed font-light">
                                {TIMELINE.find(t => t.year === selectedYear)?.detail}
                            </p>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            <div className="mt-12 flex flex-col gap-6">
                <div className="flex items-center justify-between opacity-30">
                    <span className="micro-text uppercase tracking-widest text-white">Utilized By:</span>
                    <div className="flex gap-8">
                        {['INTEL', 'AMD', 'NVIDIA', 'APPLE', 'ARM'].map(brand => (
                            <span key={brand} className="hero-text text-sm tracking-widest">{brand}</span>
                        ))}
                    </div>
                </div>
                <div className="h-px w-full bg-white/5" />
                <div className="flex items-center justify-between p-6 bg-white/[0.02] border border-white/10 rounded-3xl backdrop-blur-md">
                    <div className="flex items-center gap-4">
                        <Clock size={18} className="text-amber-500" />
                        <span className="micro-text uppercase tracking-widest text-[11px] text-white/40">Pedigree Status: VERIFIED BY INDUSTRY TRENDS</span>
                    </div>
                    <div className="px-4 py-1 rounded-full border border-amber-500/30 text-amber-500 micro-text text-[9px] uppercase font-black">
                        Legacy Core
                    </div>
                </div>
            </div>
        </div>
      </div>
    </BlueprintContainer>
  );
};
