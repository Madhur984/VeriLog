import React from 'react';
import { motion } from 'framer-motion';
import { Info, TrendingUp, Cpu } from 'lucide-react';

interface Props {
  isActive: boolean;
  isDarkMode: boolean;
}

export const S01_IndustryProblem: React.FC<Props> = ({ isActive }) => {
  return (
    <div className="flex flex-col items-center justify-start w-full max-w-6xl mx-auto px-8 relative text-center bg-matte-obsidian/40 py-10 rounded-[80px]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isActive ? { opacity: 1, y: 0 } : {}}
        className="w-full flex flex-col items-center"
      >
        <h2 className="text-6xl md:text-[100px] font-black italic tracking-tighter leading-[0.8] uppercase mb-12">
            The <span className="text-plasma-cyan">Risk.</span>
        </h2>
        
        <div className="max-w-4xl space-y-12 md:space-y-16">
            <p className="text-2xl md:text-5xl font-black tracking-tighter leading-tight italic px-4">
                 Building a chip isn't like writing an App. <br/>
                 One bug = <span className="text-burnished-copper">$50 Million</span> loss.
            </p>
            
            <div className="p-8 md:p-12 rounded-[40px] md:rounded-[60px] bg-solder-mask border border-plasma-cyan/30 shadow-cyan-glow backdrop-blur-xl relative overflow-hidden group transition-all duration-700">
                 <div className="absolute top-0 left-0 w-2 h-2 bg-plasma-cyan" />
                 <div className="absolute top-0 right-0 w-2 h-2 bg-plasma-cyan" />
                 <div className="absolute bottom-0 left-0 w-2 h-2 bg-plasma-cyan" />
                 <div className="absolute bottom-0 right-0 w-2 h-2 bg-plasma-cyan" />
                 
                 <p className="text-lg md:text-2xl font-black opacity-60 leading-relaxed italic">
                    With billions of gates, a single human typo is fatal. 
                    Hardware Description Languages (HDL) are the <span className="text-white italic underline underline-offset-8">only bridge</span> to surviving this complexity.
                 </p>
            </div>
        </div>
      </motion.div>
    </div>
  );
};
