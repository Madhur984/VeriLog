import React from 'react';
import { motion } from 'framer-motion';
import { Target, TrendingUp, Cpu } from 'lucide-react';

interface Props {
  isActive: boolean;
}

export const S01b_AdoptionStats: React.FC<Props> = ({ isActive }) => {
  return (
    <div className="flex flex-col items-center justify-start w-full max-w-6xl mx-auto px-8 relative text-center bg-matte-obsidian/40 py-10 rounded-[80px]">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={isActive ? { opacity: 1, scale: 1 } : {}}
        className="w-full flex flex-col items-center"
      >
        <h2 className="text-6xl md:text-[100px] font-black italic tracking-tighter leading-[0.8] uppercase mb-12">
            The <span className="text-plasma-cyan">Power.</span>
        </h2>
        
        <div className="max-w-4xl space-y-12 md:space-y-16">
            <p className="text-2xl md:text-5xl font-black tracking-tighter leading-tight italic px-4">
                 Verilog describes <span className="text-plasma-cyan italic underline underline-offset-8">90%</span> of the world's silicon.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 w-full">
                <div className="p-10 md:p-12 rounded-[40px] md:rounded-[50px] bg-solder-mask border border-white/5 backdrop-blur-xl group hover:border-plasma-cyan/30 transition-all">
                    <div className="text-5xl md:text-6xl font-black text-plasma-cyan mb-4 tracking-tighter">50BN</div>
                    <div className="text-[10px] font-mono uppercase tracking-widest opacity-40 font-black">Chips Produced Yearly</div>
                </div>
                <div className="p-10 md:p-12 rounded-[40px] md:rounded-[50px] bg-solder-mask border border-white/5 backdrop-blur-xl group hover:border-plasma-cyan/30 transition-all">
                    <div className="text-5xl md:text-6xl font-black text-plasma-cyan mb-4 tracking-tighter italic">ALL</div>
                    <div className="text-[10px] font-mono uppercase tracking-widest opacity-40 font-black">Major Tech Giants</div>
                </div>
            </div>
        </div>
      </motion.div>
    </div>
  );
};
