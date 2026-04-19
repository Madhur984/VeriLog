import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { History, ChevronDown, Award, Globe } from 'lucide-react';

interface Props {
  isActive: boolean;
}

export const S03b_OriginStory: React.FC<Props> = ({ isActive }) => {
  const [isOpen, setIsOpen] = useState(false);

  const timeline = [
    { year: '1983', event: 'Phil Moorby designs Verilog for Gateway Design Automation.' },
    { year: '1990', event: 'Cadence opens the language to the public to drive adoption.' },
    { year: '1995', event: 'IEEE 1364-1995 standard is released (The turning point).' },
    { year: '2005', event: 'SystemVerilog introduced, merging HDL with Verification.' },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] w-full max-w-4xl mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isActive ? { opacity: 1, y: 0 } : {}}
        className="w-full"
      >
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 text-white/40 mb-4">
             <History size={16} />
             <span className="text-[10px] font-mono uppercase tracking-[0.3em]">Historical Legitimacy</span>
          </div>
          <h2 className="text-4xl font-black italic tracking-tighter mb-4">The Verilog <span className="text-amber-500">Genesis.</span></h2>
          <p className="text-sm opacity-40 font-bold max-w-lg mx-auto italic">
            "Proven in the trenches." Verilog wasn't born in a lab, but in the heat of the 1980s EDA wars.
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative group">
                <div className="absolute -inset-4 bg-amber-500/20 blur-[50px] rounded-full opacity-30 group-hover:opacity-100 transition-opacity" />
                <motion.div 
                    whileHover={{ scale: 1.05, rotate: -1 }}
                    className="relative rounded-[40px] overflow-hidden border border-white/10 shadow-2xl"
                >
                    <img src="/assets/module6/retro.png" alt="1980s Engineering Workstation" className="w-full h-[500px] object-cover contrast-125 saturate-50 group-hover:saturate-100 transition-all duration-1000" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                    <div className="absolute top-10 left-10 p-4 bg-black/60 backdrop-blur-md rounded-2xl border border-white/10">
                        <div className="text-[8px] font-mono font-black text-amber-500 uppercase tracking-[0.5em]">System.Gateway()</div>
                        <div className="text-lg font-black italic tracking-tighter">EST. 1983</div>
                    </div>
                </motion.div>
            </div>

            <div className="space-y-12">
            <div className="space-y-6">
                <h2 className="text-4xl md:text-5xl font-black italic tracking-tighter uppercase leading-none">
                    Born in the <span className="text-amber-500">Trenches.</span>
                </h2>
                <p className="text-xl font-bold opacity-60 italic leading-snug">
                    Verilog wasn't built for classrooms. It was built by <span className="text-white italic underline">Gateway Design Automation</span> in 1983 to solve the impossible math of chip logic.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {[
                    { year: "1983", event: "Gateway Design creates Verilog for the XL simulator." },
                    { year: "1995", event: "Becomes IEEE 1364 Standard – the industry's backbone." },
                    { year: "2025+", event: "Powers every NVIDIA GPU and iPhone SoC in existence." }
                ].map((item, i) => (
                    <div key={i} className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 flex gap-6 hover:bg-white/5 transition-colors group">
                        <div className="text-2xl font-black italic text-amber-500 opacity-40 group-hover:opacity-100 transition-opacity">{item.year}</div>
                        <div className="text-sm font-bold opacity-60 italic leading-tight">{item.event}</div>
                    </div>
                ))}
            </div>

            <button 
                onClick={() => setShowDetails(!showDetails)}
                className="w-full py-5 rounded-3xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.4em] hover:bg-amber-500 hover:text-black transition-all"
            >
                {showDetails ? "Collapse Archive" : "Expand Full History"}
            </button>
            </div>
        </div>

        <div className="mt-12 flex items-center justify-center gap-8 opacity-20 filter grayscale group-hover:grayscale-0 transition-all duration-700">
            <div className="text-[10px] font-black tracking-widest uppercase">Used By:</div>
            <div className="font-black italic text-sm tracking-tighter">INTEL</div>
            <div className="font-black italic text-sm tracking-tighter">AMD</div>
            <div className="font-black italic text-sm tracking-tighter">NVIDIA</div>
            <div className="font-black italic text-sm tracking-tighter">APPLE</div>
        </div>
      </motion.div>
    </div>
  );
};
