import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, ChevronRight, Terminal, Code, Zap, Cpu, Binary, Box, Share2, Activity, Database } from 'lucide-react';
import { BlueprintContainer } from './common/BlueprintContainer';
import { HeroText } from './common/HeroText';

const RUNGS = [
    { label: 'Behavioral', pro: 'Algorithmic Intent', desc: 'Abstract C-like logic focusing on timing/IO behavior.', icon: Terminal, color: 'text-white', metrics: { complexity: 'LOW', simSpeed: 'FAST', target: 'LOGIC' } },
    { label: 'Dataflow', pro: 'RTL Specification', desc: 'Logic gates via assign statements. Describes data movement.', icon: Code, color: 'text-plasma-cyan', metrics: { complexity: 'MED', simSpeed: 'OPTIMAL', target: 'FLOW' } },
    { label: 'Gate', pro: 'Structural Netlist', desc: 'Explicit gate interconnection. Defines Physical Logic Cells.', icon: Zap, color: 'text-burnished-copper', metrics: { complexity: 'HIGH', simSpeed: 'SLOW', target: 'LAYOUT' } },
    { label: 'Switch', pro: 'Transistor Fabric', desc: 'Atomic transistor behavior. The absolute physical limit.', icon: Cpu, color: 'text-red-500', metrics: { complexity: 'MAX', simSpeed: 'U-SLOW', target: 'SILICON' } },
];

export const S02_AbstractionLadder: React.FC<{ isActive: boolean }> = ({ isActive }) => {
  const [selected, setSelected] = useState(0);

  return (
    <BlueprintContainer>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-24 items-start w-full">
        {/* Left Column: Narrative Sidebar */}
        <div className="space-y-10 sticky top-24">
          <div className="space-y-4">
             <div className="micro-text uppercase tracking-[0.4em] text-plasma-cyan font-black opacity-60 flex items-center gap-2">
                <Layers size={14} /> Structural Hierarchy
             </div>
             <HeroText className="text-left leading-none" color="text-white">The <br/><span className="text-plasma-cyan uppercase">Ladder.</span></HeroText>
          </div>
          
          <div className="space-y-8 max-w-xl text-left">
            <p className="body-text text-xl text-white/80 leading-relaxed font-light">
              Digital complexity is managed through rigid layers. To build a CPU, you must speak at the <span className="text-plasma-cyan font-bold italic underline underline-offset-8 decoration-plasma-cyan/30">optimal abstraction.</span>
            </p>
            <p className="body-text text-base text-white/50 leading-relaxed font-light">
               Engineers primarily work at the **Behavioral** and **RTL** levels. Synthesis tools perform the "Physical Descent," translating intent into raw silicon fabric.
            </p>

            <div className="flex flex-col gap-2 pt-4">
                {RUNGS.map((rung, idx) => (
                    <button 
                        key={idx}
                        onClick={() => setSelected(idx)}
                        className={`flex items-center gap-5 p-5 rounded-[35px] border transition-all duration-500 text-left group relative overflow-hidden ${selected === idx ? 'bg-[#0A0A0B] border-plasma-cyan/40 scale-[1.02] shadow-xl' : 'bg-transparent border-white/5 opacity-40 hover:opacity-100 hover:bg-white/[0.02]'}`}
                    >
                        <div className={`p-3.5 rounded-[20px] border transition-colors ${selected === idx ? 'bg-plasma-cyan/10 border-plasma-cyan text-plasma-cyan' : 'bg-white/5 border-white/5 text-white/30'}`}>
                            <rung.icon size={18} />
                        </div>
                        <div className="flex-1">
                            <div className="micro-text uppercase tracking-widest font-black opacity-40 mb-0.5 text-[8px]">L.0{idx + 1} // {rung.pro}</div>
                            <div className="hero-text text-lg uppercase tracking-tight text-white">{rung.label}</div>
                        </div>
                        {selected === idx && <div className="w-1.5 h-1.5 rounded-full bg-plasma-cyan animate-pulse" />}
                    </button>
                ))}
            </div>
          </div>
        </div>

        {/* Right Column: Depth Visualization Dashboard */}
        <div className="relative h-[720px] w-full rounded-[60px] bg-black border border-white/5 overflow-hidden shadow-2xl p-12 flex flex-col">
            <div className="absolute top-10 left-10 micro-text opacity-40 tracking-[0.3em] font-black uppercase flex items-center gap-3 text-[10px]">
                <Activity size={14} className="text-plasma-cyan" /> Abstraction Depth Probe // DEPTH_STATION
            </div>

            <div className="flex-1 flex flex-col items-center justify-center">
                <AnimatePresence mode="wait">
                    <motion.div 
                        key={selected}
                        initial={{ opacity: 0, y: 10, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 1.02 }}
                        className="w-full flex flex-col items-center gap-10"
                    >
                        <div className="relative">
                             <div className={`w-36 h-36 rounded-[45px] bg-[#0A0A0B] border-2 flex items-center justify-center transition-all duration-700 ${RUNGS[selected].color} ${selected === 1 ? 'border-plasma-cyan shadow-cyan-glow' : selected === 2 ? 'border-burnished-copper shadow-burnished-glow' : selected === 3 ? 'border-red-500 shadow-xl' : 'border-white/20'}`}>
                                {React.createElement(RUNGS[selected].icon, { size: 64, strokeWidth: 1 })}
                             </div>
                             <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 20, ease: "linear" }} className="absolute -inset-6 border border-white/5 border-dashed rounded-full" />
                             <div className="absolute -top-3 -right-3 px-3 py-1 rounded-full bg-black border border-white/10 micro-text text-[9px] text-white/40 font-black">
                                UNIT_{selected + 1}X
                             </div>
                        </div>

                        <div className="text-center space-y-4 max-w-lg">
                            <div className="space-y-1">
                                <h3 className={`hero-text text-5xl uppercase text-white tracking-widest`}>
                                    {RUNGS[selected].label}
                                </h3>
                                <div className={`micro-text uppercase ${RUNGS[selected].color} font-black tracking-[0.4em] text-[10px]`}>
                                    Verification Tier // {RUNGS[selected].pro}
                                </div>
                            </div>
                            
                            <p className="body-text text-sm text-white/40 italic leading-relaxed px-12">
                                "{RUNGS[selected].desc}"
                            </p>
                        </div>

                        <div className="grid grid-cols-3 gap-4 w-full max-w-md">
                            {[
                                { label: 'Complexity', val: RUNGS[selected].metrics.complexity },
                                { label: 'Sim Speed', val: RUNGS[selected].metrics.simSpeed },
                                { label: 'Target Dev', val: RUNGS[selected].metrics.target },
                            ].map((met, i) => (
                                <div key={i} className="p-5 rounded-[30px] border border-white/5 bg-[#0A0A0B] text-center group hover:bg-white/[0.02] transition-colors">
                                    <div className="micro-text uppercase opacity-30 mb-1.5 tracking-widest text-[8px] font-black">{met.label}</div>
                                    <div className="hero-text text-lg text-white group-hover:text-plasma-cyan transition-colors">{met.val}</div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            <div className="mt-8 flex items-center justify-between p-6 bg-white/[0.02] border border-white/10 rounded-[35px] backdrop-blur-md">
                <div className="flex items-center gap-4">
                    <Database size={18} className="text-plasma-cyan" />
                    <div className="text-left">
                        <div className="micro-text uppercase tracking-widest text-[9px] text-white/60 font-black">Compiler Context</div>
                        <div className="body-text text-[10px] text-white/20 uppercase tracking-tighter">FPGA_MAPPING_PROTOCOL_V.401</div>
                    </div>
                </div>
                <div className="flex gap-1.5">
                    {RUNGS.map((_, i) => (
                        <div key={i} className={`h-1 rounded-full transition-all duration-500 ${i <= selected ? 'w-6 bg-plasma-cyan' : 'w-2 bg-white/10'}`} />
                    ))}
                </div>
            </div>

            {/* Background Texture Overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.02] mix-blend-overlay">
                <div className="text-[280px] hero-text uppercase rotate-12 -translate-x-20 select-none">LAYER</div>
            </div>
        </div>
      </div>
    </BlueprintContainer>
  );
};
