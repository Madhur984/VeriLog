import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Network, Play, Zap, Factory, Binary, Activity, Search, RefreshCcw } from 'lucide-react';

interface Props {
  isActive: boolean;
  isDarkMode: boolean;
}

const STAGES = [
    { id: 'spec', label: 'Spec', icon: Search, desc: 'Defining the functionality.' },
    { id: 'hdl', label: 'HDL', icon: Binary, desc: 'Writing the describing code.' },
    { id: 'sim', label: 'Sim', icon: Play, desc: 'Functional verification.' },
    { id: 'synth', label: 'Synth', icon: Zap, desc: 'Code to Netlist (Gates).' },
    { id: 'pnr', label: 'P&R', icon: Network, desc: 'Physical layout design.' },
    { id: 'fab', label: 'Fab', icon: Factory, desc: 'Printing onto Silicon.' },
];

export const S05_VLSIConnection: React.FC<Props> = ({ isActive }) => {
  const [active, setActive] = useState(0);

  return (
    <div className="flex flex-col items-center justify-start w-full max-w-6xl mx-auto relative bg-matte-obsidian/40 py-10 rounded-[80px]">
      {/* CAD-like Background Lines */}
      <div className="absolute inset-0 z-0 opacity-5 pointer-events-none">
        <div className="absolute top-0 bottom-0 left-1/4 w-px bg-plasma-cyan" />
        <div className="absolute top-0 bottom-0 left-2/4 w-px bg-plasma-cyan" />
        <div className="absolute top-0 bottom-0 left-3/4 w-px bg-plasma-cyan" />
        <div className="absolute left-0 right-0 top-1/4 h-px bg-plasma-cyan" />
        <div className="absolute left-0 right-0 top-2/4 h-px bg-plasma-cyan" />
        <div className="absolute left-0 right-0 top-3/4 h-px bg-plasma-cyan" />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={isActive ? { opacity: 1 } : {}}
        className="w-full flex flex-col items-center relative z-10"
      >
        <div className="text-center mb-16 px-6">
            <h2 className="text-6xl md:text-8xl font-black mb-4 tracking-tighter italic uppercase text-plasma-cyan leading-none">VLSI <span className="text-white">Pipeline.</span></h2>
            <p className="text-xl md:text-3xl opacity-60 font-black italic tracking-tight italic">The industrial path from code to physical matter.</p>
        </div>

        {/* Technical Horizontal Pipeline */}
        <div className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6 mb-20 relative px-6">
            {STAGES.map((s, i) => (
                <button
                    key={s.id}
                    onClick={() => setActive(i)}
                    className={`relative p-6 md:p-8 rounded-[30px] md:rounded-[40px] border transition-all duration-500 flex flex-col items-center gap-4 md:gap-6 group overflow-hidden ${active === i ? 'bg-plasma-cyan border-plasma-cyan text-black shadow-2xl scale-105' : 'bg-solder-mask border-white/5 opacity-40 hover:opacity-100 hover:bg-plasma-cyan/10'}`}
                >
                    <div className="absolute top-0 right-0 p-2 opacity-5 text-black">
                         <span className="text-2xl md:text-4xl font-black">0{i+1}</span>
                    </div>
                    <div className={`w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center transition-all ${active === i ? 'bg-black text-plasma-cyan' : 'bg-white/5'}`}>
                        {React.createElement(s.icon, { size: 24, strokeWidth: 2.5 })}
                    </div>
                    <span className="text-[10px] md:text-[12px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] font-mono">{s.label}</span>
                </button>
            ))}
            
            {/* Iterative Technical Loop */}
            <div className="absolute -top-12 left-[33%] right-[33%] lg:flex hidden items-center justify-center overflow-hidden">
                 <div className="px-6 py-2 rounded-full border border-plasma-cyan/20 bg-plasma-cyan/5 text-[10px] font-black uppercase tracking-widest text-plasma-cyan flex items-center gap-3 animate-pulse">
                    <RefreshCcw size={14} /> Verification Feedback Loop
                 </div>
            </div>
        </div>

        {/* CAD-Style Engineering Card */}
        <AnimatePresence mode="wait">
            <motion.div
                key={active}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="w-full max-w-4xl p-8 md:p-12 rounded-[40px] md:rounded-[60px] border border-plasma-cyan/30 bg-black/60 backdrop-blur-3xl relative overflow-hidden group shadow-2xl"
            >
                <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-[20px] md:rounded-[30px] bg-plasma-cyan/10 border border-plasma-cyan/20 flex items-center justify-center text-plasma-cyan flex-shrink-0 animate-pulse">
                        {React.createElement(STAGES[active].icon, { size: 48, strokeWidth: 1.5 })}
                    </div>
                    <div className="flex-1 space-y-4 text-center md:text-left">
                        <div className="inline-block px-4 py-1 rounded-full border border-plasma-cyan/30 bg-plasma-cyan/10 text-[10px] font-black uppercase tracking-widest text-plasma-cyan">
                            Phase 0{active + 1} | Protocol {STAGES[active].id.toUpperCase()}
                        </div>
                        <h3 className="text-3xl md:text-5xl font-black italic tracking-tighter uppercase leading-none">{STAGES[active].label}</h3>
                        <p className="text-xl md:text-2xl font-black opacity-60 italic leading-tight italic max-w-2xl">
                            "{STAGES[active].desc}"
                        </p>
                    </div>
                </div>
                {/* Visual Engineering Backdrop Decor */}
                <div className="absolute bottom-0 right-0 p-8 opacity-5 text-plasma-cyan pointer-events-none">
                     <Binary size={120} />
                </div>
            </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
