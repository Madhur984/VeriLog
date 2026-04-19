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
    <div className="flex flex-col items-center justify-center min-h-[75vh] w-full max-w-6xl mx-auto px-8 relative text-center bg-black/40 py-20 rounded-[80px] border border-white/5 backdrop-blur-3xl">
      <motion.div
        initial={{ opacity: 0 }}
        animate={isActive ? { opacity: 1 } : {}}
        className="w-full"
      >
        <div className="text-center mb-16 px-6">
            <h2 className="hero-text text-5xl md:text-8xl italic mb-6 uppercase">Structural <span className="text-cyan-500">Syntax.</span></h2>
            <p className="body-text text-xl md:text-3xl opacity-60 italic underline decoration-cyan-500/20 underline-offset-8">Code is the mirror of physical matter.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 px-6">
            <div className="space-y-4">
                 {COMPARISON_DATA.map((item, i) => (
                     <button
                        key={item.id}
                        onClick={() => setActive(i)}
                        className={`w-full text-left p-10 rounded-[40px] border transition-all duration-500 flex items-center gap-8 ${active === i ? 'bg-cyan-500/10 border-cyan-500/30 shadow-cyan-glow' : 'bg-white/[0.02] border-white/5 opacity-40 hover:opacity-100 hover:bg-white/5'}`}
                     >
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all ${active === i ? 'bg-cyan-500 text-black shadow-lg' : 'bg-white/5 opacity-20'}`}>
                             {active === i ? <Eye size={28} /> : <Code size={28} />}
                        </div>
                        <div>
                            <div className="hero-text text-xl md:text-2xl italic uppercase tracking-tighter">{item.label}</div>
                            <div className="micro-text opacity-40 uppercase tracking-[0.3em]">PILLAR 0{i + 1}</div>
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
                    className="p-12 rounded-[50px] border border-white/5 bg-black/40 flex flex-col justify-center backdrop-blur-md relative overflow-hidden group"
                >
                    <div className="p-10 rounded-[35px] bg-[#0A0A0B] border border-white/5 mono-text text-cyan-400 text-lg md:text-xl leading-relaxed mb-10 shadow-inner overflow-hidden relative z-10">
                        {COMPARISON_DATA[active].code.split('\n').map((line, i) => (
                            <div key={i} className="mb-1">{line}</div>
                        ))}
                    </div>
                    <div className="flex items-center gap-4 text-cyan-500/60 micro-text uppercase mb-4 relative z-10 px-2">
                        <Shield size={18} /> Protocol Insight
                    </div>
                    <p className="body-text text-xl md:text-3xl opacity-80 leading-tight italic relative z-10 px-2">
                        "{COMPARISON_DATA[active].desc}"
                    </p>

                    <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-cyan-500/5 blur-[100px] rounded-full group-hover:bg-cyan-500/10 transition-colors" />
                </motion.div>
            </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};
