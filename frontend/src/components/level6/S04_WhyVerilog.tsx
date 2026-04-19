import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Activity, Maximize2 } from 'lucide-react';

interface Props {
  isActive: boolean;
}

export const S04_WhyVerilog: React.FC<Props> = ({ isActive }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] w-full max-w-6xl mx-auto px-8 relative text-center bg-black/40 py-20 rounded-[80px] border border-white/5 backdrop-blur-3xl">
      <motion.div
        initial={{ opacity: 0 }}
        animate={isActive ? { opacity: 1 } : {}}
        className="w-full"
      >
        <div className="text-center mb-20">
            <h2 className="hero-text text-5xl md:text-8xl mb-8 italic uppercase">Why <span className="text-amber-500">Verilog?</span></h2>
            <p className="body-text text-xl md:text-3xl opacity-60 max-w-3xl mx-auto leading-tight italic">
                At 3nm, you cannot <span className="text-white italic underline underline-offset-8 px-1">draw</span> a chip. You must <span className="text-white italic">describe</span> it.
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 px-6">
            {[
                { title: 'Synthesis Link', desc: 'The bridge where code becomes actual gates.', icon: Zap, color: 'text-amber-500' },
                { title: 'Temporal Proof', desc: 'Detecting timing errors in software before fabrication.', icon: Activity, color: 'text-rose-500' },
                { title: 'Massive Scale', desc: 'Organizing designs from 100 to 100 Billion transistors.', icon: Maximize2, color: 'text-indigo-500' }
            ].map((item, i) => (
                <div 
                    key={item.title}
                    className="p-10 rounded-[50px] border border-white/5 bg-white/[0.02] backdrop-blur-3xl group hover:border-white/20 transition-all duration-500"
                >
                    <div className={`w-16 h-16 rounded-2xl bg-white/5 ${item.color} mb-10 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform`}>
                        {React.createElement(item.icon, { size: 32, strokeWidth: 1.5 })}
                    </div>
                    <h3 className="hero-text text-2xl md:text-3xl mb-4 italic tracking-tighter uppercase">{item.title}</h3>
                    <p className="body-text text-sm md:text-base opacity-40 leading-relaxed italic">
                        {item.desc}
                    </p>
                </div>
            ))}
        </div>
      </motion.div>
    </div>
  );
};
