import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Activity, Maximize2 } from 'lucide-react';

interface Props {
  isActive: boolean;
}

export const S04_WhyVerilog: React.FC<Props> = ({ isActive }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] w-full max-w-5xl mx-auto px-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={isActive ? { opacity: 1 } : {}}
        className="w-full"
      >
        <div className="text-center mb-16">
            <h2 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter italic">Why <span className="text-amber-500">Verilog?</span></h2>
            <p className="text-xl opacity-40 max-w-2xl mx-auto leading-tight font-black italic tracking-tighter">
                At 3nm, you cannot <span className="text-white italic underline decoration-amber-500/20">draw</span> a chip. You must <span className="text-white italic">describe</span> it.
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
                { title: 'Synthesis Link', desc: 'The bridge where code becomes actual gates.', icon: Zap, color: 'amber' },
                { title: 'Temporal Proof', desc: 'Detecting timing errors in software before fabrication.', icon: Activity, color: 'rose' },
                { title: 'Massive Scale', desc: 'Organizing designs from 100 to 100 Billion transistors.', icon: Maximize2, color: 'indigo' }
            ].map((item, i) => (
                <div 
                    key={item.title}
                    className="p-10 rounded-[40px] border border-white/5 bg-white/[0.02]"
                >
                    <div className="w-14 h-14 rounded-2xl bg-white/5 text-amber-500/80 mb-8 flex items-center justify-center">
                        {React.createElement(item.icon, { size: 24, strokeWidth: 2.5 })}
                    </div>
                    <h3 className="text-2xl font-black mb-4 tracking-tighter italic">{item.title}</h3>
                    <p className="text-sm opacity-40 leading-relaxed font-bold italic tracking-tight">
                        {item.desc}
                    </p>
                </div>
            ))}
        </div>
      </motion.div>
    </div>
  );
};
