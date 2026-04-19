import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code, Boxes, Shield, Eye } from 'lucide-react';

interface Props {
  isActive: boolean;
  isDarkMode: boolean;
}

const COMPARISON_DATA = [
    {
        id: 'module',
        label: 'The Module',
        code: `module full_adder (...);\n   // Pins on silicon\nendmodule`,
        desc: 'Ports define the physical pins on the chip.'
    },
    {
        id: 'structural',
        label: 'The Gates',
        code: `xor g1 (s1, a, b);\nand g2 (c1, a, b);`,
        desc: 'Listing exact physical gates.'
    },
    {
        id: 'concurrent',
        label: 'The Wire',
        code: `assign y = a & b;`,
        desc: 'Everything happens at once.'
    }
];

export const S06_FirstVerilog: React.FC<Props> = ({ isActive }) => {
  const [active, setActive] = useState(0);

  return (
    <div className="flex flex-col items-center justify-center min-h-[75vh] w-full max-w-6xl mx-auto px-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={isActive ? { opacity: 1 } : {}}
        className="w-full"
      >
        <div className="text-center mb-16">
            <h2 className="text-5xl md:text-7xl font-black mb-4 tracking-tighter italic">Structural <span className="text-cyan-500">Syntax.</span></h2>
            <p className="text-lg opacity-40 font-bold italic tracking-tight underline decoration-cyan-500/10">Code is the mirror of physical matter.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-3">
                 {COMPARISON_DATA.map((item, i) => (
                     <button
                        key={item.id}
                        onClick={() => setActive(i)}
                        className={`w-full text-left p-8 rounded-[35px] border transition-all duration-300 flex items-center gap-6 ${active === i ? 'bg-cyan-500/10 border-cyan-500/20 shadow-lg' : 'bg-transparent border-white/5 opacity-40 hover:opacity-100 hover:bg-white/5'}`}
                     >
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${active === i ? 'bg-cyan-500 text-black' : 'bg-white/5 opacity-20'}`}>
                             {active === i ? <Eye size={24} /> : <Code size={24} />}
                        </div>
                        <div>
                            <div className="text-xl font-black uppercase tracking-tight italic">{item.label}</div>
                            <div className="text-[10px] font-mono opacity-40 tracking-widest font-black italic">PILLAR 0{i + 1}</div>
                        </div>
                     </button>
                 ))}
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={active}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.02 }}
                    className="p-12 rounded-[50px] border border-white/5 bg-white/[0.01] flex flex-col justify-center"
                >
                    <div className="p-8 rounded-[30px] bg-black/60 border border-white/5 font-mono text-cyan-400 text-lg font-bold leading-relaxed mb-8 shadow-inner overflow-hidden">
                        {COMPARISON_DATA[active].code.split('\n').map((line, i) => (
                            <div key={i}>{line}</div>
                        ))}
                    </div>
                    <div className="flex items-center gap-4 text-cyan-500/60 font-black uppercase text-[10px] tracking-[0.4em] italic mb-4">
                        <Shield size={16} /> Insight
                    </div>
                    <p className="text-2xl font-black opacity-60 leading-tight italic tracking-tighter">
                        {COMPARISON_DATA[active].desc}
                    </p>
                </motion.div>
            </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};
