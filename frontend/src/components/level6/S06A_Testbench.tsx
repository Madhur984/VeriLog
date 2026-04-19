import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Cpu, Play } from 'lucide-react';

interface Props {
  isActive: boolean;
}

export const S06A_Testbench: React.FC<Props> = ({ isActive }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] w-full max-w-5xl mx-auto px-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={isActive ? { opacity: 1 } : {}}
        className="w-full flex flex-col items-center"
      >
        <div className="text-center mb-16">
            <h2 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter italic uppercase">The Silent <span className="text-emerald-400">Partner.</span></h2>
            <p className="text-lg opacity-40 font-bold italic tracking-tight underline decoration-emerald-400/10">Verification is the invisible half of design.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
            <div className="p-10 rounded-[40px] border border-white/5 bg-white/[0.02]">
                 <h3 className="text-2xl font-black italic tracking-tighter mb-8 uppercase text-emerald-400">The Universe</h3>
                 <ul className="space-y-4">
                    {[
                        'Testbenches have NO physical pins.',
                        'They live only in simulation to apply input.',
                        'They use timed blocks to check outputs.'
                    ].map((text, i) => (
                        <li key={i} className="flex gap-4 items-center">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/50" />
                            <span className="text-base opacity-60 font-black italic tracking-tight">{text}</span>
                        </li>
                    ))}
                 </ul>
            </div>

            <div className="p-10 rounded-[40px] bg-emerald-500/5 border border-emerald-500/10 flex items-center justify-center gap-12">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-20 h-20 rounded-3xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                        <Cpu size={32} />
                    </div>
                    <span className="text-[9px] font-black uppercase opacity-30">The Design</span>
                </div>
                <div className="h-0.5 w-12 bg-white/5 relative">
                     <motion.div 
                        animate={{ x: [0, 40], opacity: [0, 1, 0] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="absolute h-full w-4 bg-emerald-500 rounded-full"
                     />
                </div>
                <div className="flex flex-col items-center gap-4">
                    <div className="w-20 h-20 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                        <Play size={32} />
                    </div>
                    <span className="text-[9px] font-black uppercase opacity-30">The Testbench</span>
                </div>
            </div>
        </div>
      </motion.div>
    </div>
  );
};
