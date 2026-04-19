import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Cpu, Play } from 'lucide-react';

interface Props {
  isActive: boolean;
}

export const S06A_Testbench: React.FC<Props> = ({ isActive }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] w-full max-w-6xl mx-auto px-8 relative text-center bg-black/40 py-20 rounded-[80px] border border-white/5 backdrop-blur-3xl">
      <motion.div
        initial={{ opacity: 0 }}
        animate={isActive ? { opacity: 1 } : {}}
        className="w-full flex flex-col items-center"
      >
        <div className="text-center mb-16 px-6">
            <h2 className="hero-text text-5xl md:text-8xl italic uppercase mb-6">The Silent <span className="text-emerald-400">Partner.</span></h2>
            <p className="body-text text-xl md:text-3xl opacity-60 italic underline decoration-emerald-400/20 underline-offset-8">Verification is the invisible half of design.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full px-6 items-stretch">
            <div className="p-10 rounded-[50px] border border-white/5 bg-white/[0.02] backdrop-blur-md text-left flex flex-col justify-center">
                 <h3 className="hero-text text-2xl md:text-4xl italic uppercase text-emerald-400 mb-8">Protocol Rules</h3>
                 <ul className="space-y-6">
                    {[
                        'Testbenches have NO physical pins.',
                        'They live only in simulation to apply input.',
                        'They use timed blocks to check outputs.'
                    ].map((text, i) => (
                        <li key={i} className="flex gap-6 items-center">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(52,211,153,0.5)]" />
                            <span className="body-text text-lg md:text-2xl opacity-80 italic">{text}</span>
                        </li>
                    ))}
                 </ul>
            </div>

            <div className="p-10 rounded-[50px] bg-emerald-500/5 border border-emerald-500/10 flex items-center justify-center gap-12 backdrop-blur-md relative overflow-hidden group">
                <div className="flex flex-col items-center gap-6 relative z-10">
                    <div className="w-24 h-24 rounded-3xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shadow-xl group-hover:scale-110 transition-transform">
                        <Cpu size={40} />
                    </div>
                    <span className="micro-text uppercase opacity-40">The Design</span>
                </div>
                
                <div className="w-20 h-0.5 bg-white/5 relative z-10">
                     <motion.div 
                        animate={{ x: [-20, 60], opacity: [0, 1, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                        className="absolute h-full w-8 bg-emerald-500 rounded-full shadow-[0_0_15px_rgba(52,211,153,0.8)]"
                     />
                </div>

                <div className="flex flex-col items-center gap-6 relative z-10">
                    <div className="w-24 h-24 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-xl group-hover:scale-110 transition-transform">
                        <Play size={40} fill="currentColor" />
                    </div>
                    <span className="micro-text uppercase opacity-40">The Testbench</span>
                </div>

                <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-emerald-500/5 blur-[100px] rounded-full" />
            </div>
        </div>
      </motion.div>
    </div>
  );
};
