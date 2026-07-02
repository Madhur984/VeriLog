import React from 'react';
import { motion } from 'framer-motion';
import { Target, TrendingUp, Cpu, Globe, Zap, BarChart3, Binary, Share2, Database } from 'lucide-react';
import { BlueprintContainer } from './common/BlueprintContainer';
import { HeroText } from './common/HeroText';

export const S01b_AdoptionStats: React.FC<{ isActive: boolean }> = ({ isActive }) => {
  return (
    <BlueprintContainer>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-24 items-start w-full">
        {/* Left Column: Narrative Sidebar */}
        <div className="space-y-10 sticky top-24">
          <div className="space-y-4">
             <div className="micro-text uppercase tracking-[0.4em] text-plasma-cyan font-black opacity-60 flex items-center gap-2">
                <Globe size={14} /> Global Hegemony Scan
             </div>
             <HeroText className="text-left leading-none" color="text-white">The <br/><span className="text-plasma-cyan uppercase">Power.</span></HeroText>
          </div>
          
          <div className="space-y-8 max-w-xl">
            <p className="body-text text-xl text-white/80 leading-relaxed font-light text-left">
                Verilog isn't just a language; it's the global standard. It describes <span className="text-plasma-cyan font-bold italic underline underline-offset-8 decoration-plasma-cyan/30">90%</span> of the world's silicon footprint.
            </p>
            <p className="body-text text-base text-white/50 leading-relaxed text-left font-light">
               From the phone in your pocket to the servers powering the cloud, Verilog is the blueprint for modern civilization. Mastery means gaining the keys to the physical core of technology.
            </p>

            <div className="p-8 rounded-[40px] bg-plasma-cyan/5 border border-plasma-cyan/20 shadow-xl group">
                 <div className="flex items-center gap-4 mb-4">
                    <Target size={20} className="text-plasma-cyan group-hover:scale-110 transition-transform" />
                    <span className="micro-text uppercase tracking-widest text-white/60 font-black">Industrial Saturation // 2025</span>
                 </div>
                 <p className="body-text text-[11px] text-white/40 leading-relaxed font-light italic text-left">
                    "9 out of 10 modern chips utilize Verilog or SystemVerilog for structural definition and industrial verification. It is the language of the physical world."
                 </p>
            </div>
          </div>
        </div>

        {/* Right Column: Visualization Dashboard */}
        <div className="relative h-[720px] w-full rounded-[60px] bg-black border border-white/5 overflow-hidden shadow-2xl p-12 flex flex-col">
            <div className="absolute top-10 left-10 micro-text opacity-40 tracking-[0.3em] font-black uppercase flex items-center gap-3 text-[10px]">
                <BarChart3 size={14} className="text-plasma-cyan" /> Industrial Footprint // TELEMETRY_A1
            </div>

            <div className="flex-1 grid grid-cols-2 gap-6 mt-12 mb-12">
                {[
                    { label: "Annual Units", value: "50BN", detail: "CHIPS PRODUCED YEARLY (PEAK)", icon: Cpu, color: "text-plasma-cyan" },
                    { label: "Tech Standard", value: "9/10", detail: "MAJOR GIANTS UTILIZING VERILOG", icon: Share2, color: "text-white" },
                    { label: "Infra Scale", value: "90%", detail: "GLOBAL DIGITAL FOOTPRINT BASE", icon: Binary, color: "text-plasma-cyan" },
                    { label: "Logic Trust", value: "100%", detail: "INDUSTRIAL RELIABILITY RATING", icon: Database, color: "text-white/40" },
                ].map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                        className="p-8 rounded-[45px] bg-[#0A0A0B] border border-white/5 flex flex-col items-center justify-center text-center group hover:bg-white/[0.03] transition-all relative overflow-hidden"
                    >
                        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-plasma-cyan/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <stat.icon size={26} className={`mb-6 ${stat.color} opacity-40 group-hover:opacity-100 transition-opacity`} />
                        <div className="hero-text text-6xl text-white mb-2 tracking-tighter">{stat.value}</div>
                        <div className="micro-text uppercase text-white/40 font-black tracking-widest text-[9px] mb-3">{stat.label}</div>
                        <p className="body-text text-[9px] text-white/20 uppercase font-black tracking-widest italic group-hover:text-white/30 transition-colors">
                            {stat.detail}
                        </p>
                    </motion.div>
                ))}
            </div>

            <div className="p-8 bg-bg-elev border border-border-soft rounded-[35px] flex items-center justify-between shadow-neo">
                <div className="flex items-center gap-6">
                    <div className="w-12 h-12 rounded-full border border-plasma-cyan/30 flex items-center justify-center text-plasma-cyan shadow-cyan-glow">
                        <Zap size={22} className="animate-pulse" />
                    </div>
                    <div>
                        <div className="micro-text uppercase text-white/40 tracking-widest font-black text-[9px]">Standard Authorization</div>
                        <div className="hero-text text-sm uppercase text-white tracking-widest">Global silicon infrastructure verified.</div>
                    </div>
                </div>
                <div className="flex gap-2">
                    {[1, 2, 3].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-plasma-cyan/30" />)}
                </div>
            </div>

            {/* Background Texture Overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay">
                <div className="text-[280px] hero-text uppercase -rotate-6 -translate-x-20 select-none">PROTO</div>
            </div>
        </div>
      </div>
    </BlueprintContainer>
  );
};
