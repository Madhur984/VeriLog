import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Boxes, Share2, Binary, ChevronDown, Shield, Cpu, ChevronRight, Layers } from 'lucide-react';
import { BlueprintContainer } from './common/BlueprintContainer';
import { HeroText } from './common/HeroText';

export const S07_ModuleThinking: React.FC<{ isActive: boolean }> = ({ isActive }) => {
  const [expanded, setExpanded] = useState(true);

  return (
    <BlueprintContainer>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-24 items-start w-full">
        {/* Left Column: Narrative Sidebar */}
        <div className="space-y-10 sticky top-24">
          <div className="space-y-4">
             <div className="micro-text uppercase tracking-[0.4em] text-plasma-cyan font-black opacity-60 flex items-center gap-2">
                <Layers size={14} /> Modular Hierarchy
             </div>
             <HeroText className="text-left leading-none" color="text-white">Modules & <br/><span className="text-plasma-cyan">Ports.</span></HeroText>
          </div>
          
          <div className="space-y-8 max-w-xl">
            <p className="body-text text-xl text-white/80 leading-relaxed font-light">
              Digital hardware is hierarchical. Complexity is managed by <span className="text-plasma-cyan font-bold italic underline underline-offset-8 decoration-plasma-cyan/30">encapsulating functionality.</span>
            </p>
            <p className="body-text text-base text-white/50 leading-relaxed">
               Ports define the exact physical contact pins of your architecture. Designing a million-transistor chip starts by perfectly defining a single module and instantiating it recursively until the complexity arises.
            </p>

            <div className="p-8 rounded-[40px] bg-white/[0.02] border border-white/5 border-l-4 border-l-plasma-cyan group shadow-xl">
                 <div className="flex items-center gap-4 mb-4">
                    <Shield size={20} className="text-plasma-cyan group-hover:scale-110 transition-transform" />
                    <span className="micro-text uppercase tracking-widest text-white/60 font-black">Port Physicality</span>
                 </div>
                 <p className="body-text text-sm opacity-50 leading-relaxed font-light italic">
                    "Ports map directly to the literal metal traces that interconnect disparate sections of silicon reality."
                 </p>
            </div>
          </div>
        </div>

        {/* Right Column: Hierarchy Visualizer Dashboard */}
        <div className="relative h-[720px] w-full rounded-[60px] bg-black border border-white/5 overflow-hidden shadow-2xl p-12 flex flex-col">
            <div className="absolute top-10 left-10 micro-text opacity-40 tracking-[0.3em] font-black uppercase flex items-center gap-3">
                <Boxes size={14} className="text-plasma-cyan" /> Sub-Unit Matrix Inspector
            </div>

            <div className="flex-1 flex flex-col gap-10 mt-12">
                <button 
                  onClick={() => setExpanded(!expanded)}
                  className="p-10 rounded-[40px] bg-plasma-cyan/10 border border-plasma-cyan/20 flex items-center justify-between group hover:bg-plasma-cyan/20 transition-all shadow-xl"
                >
                    <div className="flex items-center gap-8">
                        <div className="p-5 rounded-2xl bg-black border border-plasma-cyan/30 text-plasma-cyan shadow-cyan-glow group-hover:scale-110 transition-transform">
                             <Cpu size={40} strokeWidth={1} />
                        </div>
                        <div className="text-left">
                            <div className="micro-text text-plasma-cyan/60 mb-1 uppercase tracking-widest font-black">L1 // Master Instance</div>
                            <div className="hero-text text-3xl uppercase text-white tracking-widest">4-Bit Adder CORE</div>
                        </div>
                    </div>
                    <div className={`p-4 rounded-full border border-white/10 text-white/20 transition-all ${expanded ? 'rotate-180 bg-plasma-cyan text-black' : ''}`}>
                        <ChevronDown size={24} />
                    </div>
                </button>

                <AnimatePresence mode="wait">
                    {expanded && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="space-y-4 pl-12 border-l-2 border-white/5 relative"
                        >
                            <div className="absolute top-0 left-0 w-8 h-px bg-white/10" />
                            {[0, 1, 2, 3].map(i => (
                                <motion.div 
                                    key={i} 
                                    initial={{ x: -20, opacity: 0 }}
                                    whileInView={{ x: 0, opacity: 1 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="flex items-center gap-6 p-6 rounded-[30px] bg-white/[0.02] border border-white/5 group hover:bg-white/[0.05] transition-all cursor-default"
                                >
                                    <div className="w-10 h-10 rounded-xl bg-black border border-white/10 flex items-center justify-center text-plasma-cyan/40 group-hover:text-plasma-cyan transition-colors">
                                        <Binary size={18} />
                                    </div>
                                    <div className="flex-1">
                                        <div className="hero-text text-xl uppercase text-white/80 group-hover:text-white transition-colors">Full Adder CELL_{i}</div>
                                        <div className="micro-text uppercase tracking-widest text-[9px] opacity-20">Instantiated Unit</div>
                                    </div>
                                    <div className="micro-text text-plasma-cyan/20 group-hover:text-plasma-cyan transition-colors font-black">LOCAL_PINS: [A, B, CIN]</div>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className="mt-8 flex items-center justify-between p-6 bg-white/[0.02] border border-white/10 rounded-3xl backdrop-blur-md">
                <div className="flex items-center gap-4">
                    <Share2 size={20} className="text-plasma-cyan" />
                    <div>
                        <div className="micro-text uppercase text-white/60 tracking-widest font-black">Interface Topology</div>
                        <div className="body-text text-[10px] opacity-30">Mapping 4 instantiation points to master silicon grid.</div>
                    </div>
                </div>
                <div className="px-4 py-1 rounded-full border border-plasma-cyan/30 text-plasma-cyan micro-text text-[9px] uppercase font-black">
                    Connected
                </div>
            </div>
        </div>
      </div>
    </BlueprintContainer>
  );
};
