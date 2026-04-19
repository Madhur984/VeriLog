import React from 'react';
import { motion } from 'framer-motion';
import { Code, Cpu, Zap, Radio } from 'lucide-react';

interface Props {
  isActive: boolean;
}

const SNIPPETS = [
    { title: 'Multiplexer', code: 'assign out = sel ? i1 : i0;', desc: 'Decision logic.', icon: Radio },
    { title: 'Flip-Flop', code: 'always @(posedge clk)\n   q <= d;', desc: 'Atomic memory.', icon: Cpu },
    { title: 'Counter', code: 'always @(posedge clk)\n   count <= count + 1;', desc: 'Sequential logic.', icon: Zap }
];

export const S08_SimulationVsReality: React.FC<Props> = ({ isActive }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[75vh] w-full max-w-5xl mx-auto px-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={isActive ? { opacity: 1 } : {}}
        className="w-full"
      >
        <div className="text-center mb-16">
            <h2 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter italic uppercase">Common <span className="text-violet-500">Patterns.</span></h2>
            <p className="text-lg opacity-40 font-bold italic tracking-tight">The building blocks of the digital universe.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {SNIPPETS.map((item, i) => (
                <div 
                    key={item.title}
                    className="p-10 rounded-[40px] border border-white/5 bg-white/[0.02] flex flex-col items-center text-center group"
                >
                    <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-8 text-violet-500/80 transition-transform group-hover:scale-110">
                        {React.createElement(item.icon, { size: 28 })}
                    </div>
                    <h3 className="text-2xl font-black italic tracking-tighter mb-4">{item.title}</h3>
                    <div className="w-full p-6 rounded-2xl bg-black/40 border border-white/5 font-mono text-violet-400 text-sm font-bold mb-6 overflow-hidden">
                        {item.code}
                    </div>
                    <p className="text-sm opacity-40 font-bold italic">{item.desc}</p>
                </div>
            ))}

            {/* Enhancment: assign vs always comparison */}
            <div className="p-10 rounded-[40px] bg-violet-500/5 border border-violet-500/20 flex flex-col justify-center gap-6 relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-4 opacity-5">
                    <Code size={100} />
                 </div>
                 <div className="text-[10px] font-mono font-black uppercase tracking-widest text-violet-500 mb-2">The Two Faces</div>
                 <h3 className="text-xl font-black italic italic tracking-tighter">assign vs always</h3>
                 
                 <div className="space-y-4">
                    <div className="p-4 rounded-2xl bg-black/60 border border-white/5">
                        <div className="text-[9px] font-black text-white/20 mb-1 uppercase tracking-widest">Immediate Logic</div>
                        <div className="text-xs font-mono text-violet-400">assign out = a & b;</div>
                    </div>
                    <div className="p-4 rounded-2xl bg-black/60 border border-white/5">
                        <div className="text-[9px] font-black text-white/20 mb-1 uppercase tracking-widest">Banked Memory</div>
                        <div className="text-xs font-mono text-violet-400 italic">always @(posedge clk)<br/>&nbsp;&nbsp;out &lt;= a & b;</div>
                    </div>
                 </div>

                 <p className="text-[11px] opacity-40 font-medium italic mt-2">
                    <span className="text-white">assign</span> is instant. <span className="text-violet-500 font-bold italic">always</span> waits for the clock pulse.
                 </p>
            </div>
        </div>
      </motion.div>
    </div>
  );
};
