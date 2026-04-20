import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, TrendingDown, Activity, AlertTriangle, DollarSign, Cpu, Share2, Binary, Database } from 'lucide-react';
import { BlueprintContainer } from './common/BlueprintContainer';
import { HeroText } from './common/HeroText';

export const S01_IndustryProblem: React.FC<{ isActive: boolean }> = ({ isActive }) => {
  return (
    <BlueprintContainer>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-24 items-start w-full">
        {/* Left Column: Narrative Sidebar */}
        <div className="space-y-10 sticky top-24">
          <div className="space-y-4">
             <div className="micro-text uppercase tracking-[0.4em] text-red-500 font-black opacity-60 flex items-center gap-2">
                <ShieldAlert size={14} /> Industrial Hazard Scan
             </div>
             <HeroText className="text-left leading-none" color="text-white">The <br/><span className="text-red-500 uppercase">Risk.</span></HeroText>
          </div>
          
          <div className="space-y-8 max-w-xl">
            <p className="body-text text-xl text-white/80 leading-relaxed font-light text-left">
                Building a chip isn't like writing an app. It's a high-stakes bet where a single logic typo can vanish <span className="text-burnished-copper font-bold underline underline-offset-8 decoration-burnished-copper/30">$50 Million</span> in hardware waste.
            </p>
            <p className="body-text text-base text-white/50 leading-relaxed text-left font-light">
               In software, you patch. In silicon, you <span className="text-white font-bold italic uppercase tracking-widest text-xs">Tape-Out.</span> Once the masks are struck, the design is permanent. Hardware Description Languages are your only shield against systemic capital failure.
            </p>

            <div className="p-8 rounded-[40px] bg-red-500/5 border border-red-500/20 shadow-xl group">
                 <div className="flex items-center gap-4 mb-4">
                    <Database size={20} className="text-red-500 group-hover:rotate-12 transition-transform" />
                    <span className="micro-text uppercase tracking-widest text-white/60 font-black">Silicon Mandate :: Active</span>
                 </div>
                 <p className="body-text text-[11px] text-white/40 leading-relaxed font-light italic">
                    "There is no undo in a wafer factory. You write Verilog not just to build, but to survive the brutal physics of industrial complexity."
                 </p>
            </div>
          </div>
        </div>

        {/* Right Column: Risk Analysis Dashboard */}
        <div className="relative h-[720px] w-full rounded-[60px] bg-black border border-white/5 overflow-hidden shadow-2xl p-12 flex flex-col">
            <div className="absolute top-10 left-10 micro-text opacity-40 tracking-[0.3em] font-black uppercase flex items-center gap-3 text-[10px]">
                <Activity size={14} className="text-red-500" /> Capital Risk Matrix // SCAN_ID_01
            </div>

            <div className="flex-1 grid grid-cols-2 gap-6 mt-12 mb-12">
                {[
                    { label: "Tape-out Cost", value: "$5M+", detail: "PER DESIGN ITERATION (5nm)", icon: DollarSign, color: "text-burnished-copper" },
                    { label: "Gate Density", value: "10B+", detail: "TRANSISTORS PER SQ MM", icon: Share2, color: "text-plasma-cyan" },
                    { label: "Recall Impact", value: "CRIT", detail: "TOTAL SYSTEMIC REPOSSESSION", icon: AlertTriangle, color: "text-red-500" },
                    { label: "Layout Speed", value: "NULL", detail: "MANUAL FEASIBILITY EXCEEDED", icon: Cpu, color: "text-white/40" },
                ].map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="p-8 rounded-[45px] bg-[#0A0A0B] border border-white/5 flex flex-col items-center justify-center text-center group hover:bg-white/[0.03] transition-all relative overflow-hidden"
                    >
                        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <stat.icon size={26} className={`mb-6 ${stat.color} opacity-40 group-hover:opacity-100 transition-opacity`} />
                        <div className="hero-text text-5xl text-white mb-2 tracking-tighter">{stat.value}</div>
                        <div className="micro-text uppercase text-white/40 font-black tracking-widest text-[9px] mb-3">{stat.label}</div>
                        <p className="body-text text-[9px] text-white/20 uppercase font-black tracking-widest italic group-hover:text-white/40 transition-colors">
                            {stat.detail}
                        </p>
                    </motion.div>
                ))}
            </div>

            <div className="p-8 bg-white/[0.02] border border-white/10 rounded-[35px] flex items-center justify-between backdrop-blur-md">
                <div className="flex items-center gap-6">
                    <div className="w-12 h-12 rounded-full border border-red-500/30 flex items-center justify-center text-red-500 animate-pulse">
                        <Binary size={22} />
                    </div>
                    <div>
                        <div className="micro-text uppercase text-white/40 tracking-widest font-black text-[9px]">Engineering Protocol</div>
                        <div className="hero-text text-sm uppercase text-white tracking-widest">Procedural verification is no longer optional.</div>
                    </div>
                </div>
                <div className="px-5 py-2 rounded-2xl bg-white/5 border border-white/10 text-white/20 micro-text text-[9px] uppercase font-black tracking-widest">
                    ACTIVE_SCAN
                </div>
            </div>

            {/* Background Texture Overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.02] mix-blend-overlay">
                <div className="text-[280px] hero-text uppercase rotate-12 -translate-x-20 select-none">SILICON</div>
            </div>
        </div>
      </div>
    </BlueprintContainer>
  );
};
