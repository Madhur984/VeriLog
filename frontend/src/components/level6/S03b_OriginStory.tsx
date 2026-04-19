import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { History, ChevronDown, Award, Globe } from 'lucide-react';

interface Props {
  isActive: boolean;
}

export const S03b_OriginStory: React.FC<Props> = ({ isActive }) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] w-full max-w-6xl mx-auto px-8 relative text-center bg-black/40 py-20 rounded-[80px] border border-white/5 backdrop-blur-3xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isActive ? { opacity: 1, y: 0 } : {}}
        className="w-full"
      >
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 text-white/40 mb-4 px-6 py-2 rounded-full border border-white/10 bg-white/5">
             <History size={16} />
             <span className="micro-text uppercase">Historical Legitimacy</span>
          </div>
          <h2 className="hero-text text-5xl md:text-7xl italic mb-6 uppercase">The Verilog <span className="text-amber-500">Genesis.</span></h2>
          <p className="body-text text-xl md:text-2xl opacity-60 max-w-2xl mx-auto italic">
            "Proven in the trenches." Verilog wasn't born in a lab, but in the heat of the 1980s EDA wars.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center px-6">
            <div className="relative group">
                <div className="absolute -inset-4 bg-amber-500/20 blur-[50px] rounded-full opacity-30 group-hover:opacity-100 transition-opacity" />
                <motion.div 
                    whileHover={{ scale: 1.05, rotate: -1 }}
                    className="relative rounded-[40px] overflow-hidden border border-white/10 shadow-2xl backdrop-blur-md"
                >
                    <img src="/assets/module6/retro.png" alt="1980s Engineering Workstation" className="w-full h-[500px] object-cover grayscale group-hover:grayscale-0 transition-all duration-1000" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                    <div className="absolute top-10 left-10 p-6 bg-black/60 backdrop-blur-md rounded-2xl border border-white/10 shadow-xl">
                        <div className="micro-text text-amber-500 uppercase">System.Gateway()</div>
                        <div className="hero-text text-2xl italic uppercase text-white">EST. 1983</div>
                    </div>
                </motion.div>
            </div>

            <div className="space-y-12 text-left">
                <div className="space-y-6">
                    <h2 className="hero-text text-4xl md:text-6xl italic uppercase leading-none text-white">
                        Born in the <br/><span className="text-amber-500">Trenches.</span>
                    </h2>
                    <p className="body-text text-xl opacity-60 italic leading-snug">
                        Verilog wasn't built for classrooms. It was built by <span className="text-white italic underline underline-offset-8">Gateway Design Automation</span> in 1983 to solve the impossible math of chip logic.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    {[
                        { year: "1983", event: "Gateway Design creates Verilog for the XL simulator." },
                        { year: "1995", event: "Becomes IEEE 1364 Standard – the industry's backbone." },
                        { year: "2025+", event: "Powers every NVIDIA GPU and iPhone SoC in existence." }
                    ].map((item, i) => (
                        <div key={i} className="p-8 rounded-[30px] bg-white/[0.02] border border-white/5 flex gap-8 hover:bg-white/5 transition-all group backdrop-blur-sm">
                            <div className="hero-text text-3xl italic text-amber-500 opacity-40 group-hover:opacity-100 transition-all">{item.year}</div>
                            <div className="body-text text-base opacity-60 italic leading-snug">{item.event}</div>
                        </div>
                    ))}
                </div>

                <button 
                    onClick={() => setShowDetails(!showDetails)}
                    className="w-full py-6 rounded-3xl bg-white/5 border border-white/10 micro-text uppercase hover:bg-amber-500 hover:text-black transition-all shadow-lg"
                >
                    {showDetails ? "Collapse Archive" : "Expand Full History"}
                </button>
            </div>
        </div>

        <div className="mt-16 flex items-center justify-center gap-12 opacity-20 filter grayscale hover:grayscale-0 transition-all duration-1000">
            <div className="micro-text uppercase text-white">Utilized By:</div>
            <div className="hero-text italic text-lg text-white">INTEL</div>
            <div className="hero-text italic text-lg text-white">AMD</div>
            <div className="hero-text italic text-lg text-white">NVIDIA</div>
            <div className="hero-text italic text-lg text-white">APPLE</div>
        </div>
      </motion.div>
    </div>
  );
};
