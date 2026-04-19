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
    <div className="flex flex-col items-center justify-center min-h-[75vh] w-full max-w-6xl mx-auto px-8 relative text-center bg-black/40 py-20 rounded-[80px] border border-white/5 backdrop-blur-3xl">
      <motion.div
        initial={{ opacity: 0 }}
        animate={isActive ? { opacity: 1 } : {}}
        className="w-full"
      >
        <div className="text-center mb-16 px-6">
            <h2 className="hero-text text-5xl md:text-8xl italic uppercase mb-6 text-white">Common <span className="text-plasma-cyan">Patterns.</span></h2>
            <p className="body-text text-xl md:text-3xl opacity-60 italic">The building blocks of the digital universe.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-6">
            {SNIPPETS.map((item, i) => (
                <div 
                    key={item.title}
                    className="p-10 rounded-[50px] border border-white/5 bg-white/[0.02] flex flex-col items-center text-center group backdrop-blur-md shadow-inner transition-all duration-500 hover:border-plasma-cyan/20"
                >
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl md:rounded-3xl bg-white/5 flex items-center justify-center mb-10 text-plasma-cyan transition-transform group-hover:scale-110 shadow-lg">
                        {React.createElement(item.icon, { size: 32 })}
                    </div>
                    <h3 className="hero-text text-xl md:text-2xl italic mb-6 uppercase tracking-tighter text-white">{item.title}</h3>
                    <div className="w-full p-8 rounded-[30px] bg-black/60 border border-white/5 mono-text text-plasma-cyan text-sm md:text-base mb-8 overflow-hidden shadow-inner flex items-center justify-center min-h-[100px]">
                        {item.code}
                    </div>
                    <p className="body-text text-sm md:text-base opacity-40 italic">{item.desc}</p>
                </div>
            ))}

            {/* Enhancment: assign vs always comparison */}
            <div className="p-10 rounded-[50px] bg-plasma-cyan/5 border border-plasma-cyan/20 flex flex-col justify-center gap-8 relative overflow-hidden group backdrop-blur-md shadow-2xl">
                 <div className="absolute top-0 right-0 p-8 opacity-5 text-plasma-cyan">
                    <Code size={120} />
                 </div>
                 <div className="micro-text uppercase text-plasma-cyan mb-2 tracking-[0.4em]">The Two Faces</div>
                 <h3 className="hero-text text-2xl md:text-3xl italic uppercase text-white">assign vs always</h3>
                 
                 <div className="space-y-6 relative z-10">
                    <div className="p-6 rounded-[30px] bg-black/60 border border-white/5 shadow-inner">
                        <div className="micro-text text-white/20 mb-2 uppercase tracking-widest">Immediate Logic</div>
                        <div className="mono-text text-xs md:text-sm text-plasma-cyan">assign out = a & b;</div>
                    </div>
                    <div className="p-6 rounded-[30px] bg-black/60 border border-white/5 shadow-inner">
                        <div className="micro-text text-white/20 mb-2 uppercase tracking-widest">Banked Memory</div>
                        <div className="mono-text text-xs md:text-sm text-plasma-cyan italic">always @(posedge clk)<br/>&nbsp;&nbsp;out &lt;= a & b;</div>
                    </div>
                 </div>

                 <p className="body-text text-sm opacity-60 italic mt-4 relative z-10 px-2 lg:leading-tight">
                    <span className="text-white underline underline-offset-4 decoration-white/20">assign</span> is instant. <br/>
                    <span className="text-plasma-cyan italic underline underline-offset-4 decoration-plasma-cyan/20">always</span> waits for the clock.
                 </p>

                 <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-plasma-cyan/5 blur-[80px] rounded-full" />
            </div>
        </div>
      </motion.div>
    </div>
  );
};
