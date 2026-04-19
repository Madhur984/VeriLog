import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, ChevronRight, Terminal, Code, Zap, Cpu } from 'lucide-react';

interface Props {
  isActive: boolean;
  isDarkMode: boolean;
}

const RUNGS = [
    { label: 'Behavioral', desc: 'Describe algorithmically (C-like logic).', pro: 'Algorithmic Description', icon: Terminal },
    { label: 'Dataflow', desc: 'Describe logic gates using assign statements.', pro: 'RTL (Register Transfer)', icon: Code },
    { label: 'Gate', desc: 'Describe exact gates and connections.', pro: 'Structural Mapping', icon: Zap },
    { label: 'Switch', desc: 'Atomic transistor behavior modeling.', pro: 'Transistor Level', icon: Cpu },
];

export const S02_AbstractionLadder: React.FC<Props> = ({ isActive }) => {
  const [selected, setSelected] = useState(0);

  return (
    <div className="flex flex-col items-center justify-start w-full max-w-6xl mx-auto px-8 relative text-center bg-matte-obsidian/40 py-10 rounded-[80px]">
      <motion.div
        initial={{ opacity: 0 }}
        animate={isActive ? { opacity: 1 } : {}}
        className="w-full flex flex-col items-center"
      >
        <h2 className="text-6xl md:text-[100px] font-black italic tracking-tighter leading-[0.8] uppercase mb-16">
            The <span className="text-plasma-cyan">Ladder.</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full px-4 md:px-0">
            {RUNGS.map((rung, idx) => (
                <div 
                    key={rung.label}
                    className="p-8 md:p-10 rounded-[40px] md:rounded-[50px] border border-white/5 bg-solder-mask flex flex-col items-center text-center group hover:bg-plasma-cyan/5 hover:border-plasma-cyan/20 transition-all duration-500"
                >
                    <div className="text-[10px] font-mono opacity-20 mb-4 font-black tracking-widest uppercase">STEP 0{idx + 1}</div>
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl md:rounded-3xl bg-white/5 flex items-center justify-center mb-8 md:mb-10 text-plasma-cyan group-hover:scale-110 transition-transform">
                        {React.createElement(rung.icon, { size: 32 })}
                    </div>
                    <h3 className="text-2xl md:text-3xl font-black italic tracking-tighter mb-4 capitalize">{rung.label}</h3>
                    <p className="text-xs md:text-sm opacity-40 font-bold italic leading-relaxed">{rung.desc}</p>
                </div>
            ))}
        </div>

        <div className="mt-20 max-w-3xl px-6">
            <p className="text-xl md:text-3xl font-black italic tracking-tight opacity-40 leading-tight">
                Synthesis tools perform the "Descent." They translate your <span className="text-white italic underline underline-offset-8">Behavior</span> into <span className="text-white italic">Switches</span>.
            </p>
        </div>
      </motion.div>
    </div>
  );
};
