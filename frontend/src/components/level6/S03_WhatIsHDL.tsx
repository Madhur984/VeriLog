import React from 'react';
import { motion } from 'framer-motion';
import { Layers, Zap, Activity } from 'lucide-react';

interface Props {
  isActive: boolean;
}

export const S03_WhatIsHDL: React.FC<Props> = ({ isActive }) => {
  return (
    <div className="flex flex-col items-center justify-start w-full max-w-5xl mx-auto px-6 relative overflow-hidden bg-black/40 py-10 rounded-[80px] border border-white/5 backdrop-blur-3xl">
      {/* Visual Blueprint Backdrop - Stylized PCB */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
        <svg className="w-full h-full" viewBox="0 0 1000 600">
           <path d="M0,300 L300,300 L340,340 L660,340 L700,300 L1000,300" stroke="#00D4FF" strokeWidth="2" fill="none" strokeDasharray="1000" strokeDashoffset={isActive ? 0 : 1000} style={{ transition: 'stroke-dashoffset 2s ease-out' }} />
           <path d="M200,0 L200,200 L180,220 L180,400 L200,420 L200,600" stroke="#00D4FF" strokeWidth="1" fill="none" opacity="0.5" />
           <circle cx="335" cy="335" r="5" fill="#00D4FF" />
           <circle cx="665" cy="335" r="5" fill="#00D4FF" />
           {/* PCB Dot Grid Detail */}
           <defs>
             <pattern id="pcb-grid" width="20" height="20" patternUnits="userSpaceOnUse">
               <circle cx="2" cy="2" r="0.5" fill="#00D4FF" opacity="0.2" />
             </pattern>
           </defs>
           <rect width="100%" height="100%" fill="url(#pcb-grid)" />
        </svg>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={isActive ? { opacity: 1, scale: 1 } : {}}
        className="w-full relative z-10 text-center"
      >
        <div className="mb-16">
            <h2 className="hero-text text-5xl md:text-7xl mb-4 text-plasma-cyan uppercase italic">The <span>Blueprint.</span></h2>
            <p className="body-text text-lg md:text-2xl opacity-60">
                HDL is not <span className="text-plasma-cyan italic underline decoration-plasma-cyan/20 px-1">code</span>. It is <span className="text-plasma-cyan italic">existence</span>.
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {[
                { title: 'Concurrent Reality', desc: 'Hardware doesn\'t follow a sequence. Everything exists at once.', icon: Activity, color: 'plasma-cyan' },
                { title: 'Temporal Pulse', desc: 'Clocks act as the biological heartbeat for the silicon body.', icon: Zap, color: 'cyber-amber' },
                { title: 'Hardware Essence', desc: 'Code becomes physical gates, which become the chips in your pocket.', icon: Layers, color: 'burnished-copper' },
            ].map((item, i) => (
                <div 
                    key={item.title} 
                    className="p-8 md:p-10 rounded-[40px] md:rounded-[50px] bg-black/40 border border-white/5 flex flex-col items-center text-center group hover:border-plasma-cyan/30 transition-all duration-500 hover:bg-plasma-cyan/5"
                >
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl md:rounded-3xl bg-white/[0.03] border border-white/5 flex items-center justify-center mb-6 md:mb-8 text-plasma-cyan group-hover:scale-110 transition-transform">
                        {React.createElement(item.icon, { size: 32 })}
                    </div>
                    <h4 className="hero-text text-xl md:text-2xl mb-4 uppercase italic">{item.title}</h4>
                    <p className="body-text text-xs md:text-sm opacity-40">{item.desc}</p>
                </div>
            ))}
        </div>

        <div className="mt-16 p-8 md:p-12 rounded-[40px] md:rounded-[50px] border border-plasma-cyan/10 bg-black/20 max-w-3xl mx-auto shadow-2xl backdrop-blur-xl">
            <p className="body-text text-xl md:text-2xl opacity-40 leading-tight">
                "Verilog tools don't read code to 'do' things. They read it to map out <span className="text-plasma-cyan italic underline underline-offset-8 px-1">what currently exists</span>."
            </p>
        </div>
      </motion.div>
    </div>
  );
};
