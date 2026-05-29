import React from "react";
import { motion } from "framer-motion";
import { BlueprintContainer } from "./common/BlueprintContainer";
import { HeroText } from "./common/HeroText";
import { Cpu, Zap, Binary, CircuitBoard, ArrowRight, Share2, Activity, ShieldCheck, Database } from "lucide-react";

const OPPORTUNITIES = [
  { title: "FPGA Designer", desc: "Design flexible accelerators for High-Frequency Trading and Edge AI.", icon: Zap },
  { title: "ASIC Specialist", desc: "Craft custom physical silicon for phones, rockets, and consumer tech.", icon: CircuitBoard },
  { title: "AI Architect", desc: "Build the next generation of Tensor cores and NPUs in high-density Verilog.", icon: Binary },
  { title: "Verification Expert", desc: "The elite gatekeeper of silicon reliability. Zero-defect architecture.", icon: Cpu },
];

export const S19_FinalBridge: React.FC<{ isActive: boolean }> = ({ isActive }) => {
  return (
    <BlueprintContainer>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-24 items-start w-full">
        {/* Left Column: Narrative Sidebar */}
        <div className="space-y-12 sticky top-24">
          <div className="space-y-4">
            <div className="micro-text uppercase tracking-[0.4em] text-plasma-cyan font-black opacity-60 flex items-center gap-2">
                <ShieldCheck size={14} /> Deployment Protocol: Active
            </div>
            <HeroText className="text-left leading-none" color="text-white">The Frontier <br/><span className="text-plasma-cyan">of Silicon.</span></HeroText>
          </div>
          
          <div className="space-y-8 max-w-xl">
            <p className="body-text text-xl text-white/80 leading-relaxed font-light text-left">
               You have passed the <span className="text-plasma-cyan font-bold italic underline underline-offset-8 decoration-plasma-cyan/30">Language Gate.</span>
            </p>
            <p className="body-text text-base text-white/50 leading-relaxed text-left">
              Synthesis is complete. The RTL is verified. You are no longer just a coder-you are a <span className="text-plasma-cyan font-black italic uppercase tracking-widest text-xs">Hardware Architect.</span> The world of physical gates and silicon substrates awaits your instruction.
            </p>

            <div className="relative h-[240px] rounded-[50px] overflow-hidden border border-white/5 bg-black group shadow-2xl">
                <div className="absolute inset-0 bg-dot-grid opacity-20" />
                <div className="absolute bottom-8 left-8 right-8 flex items-end justify-between relative z-10">
                    <div className="space-y-1">
                        <div className="micro-text text-plasma-cyan/60 uppercase tracking-widest font-black text-[9px]">Giga-Fab Integration</div>
                        <div className="hero-text text-2xl text-white tracking-widest uppercase">READY FOR TAPE-OUT.</div>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-plasma-cyan/10 border border-plasma-cyan/30 flex items-center justify-center text-plasma-cyan shadow-cyan-glow">
                        <Zap size={20} />
                    </div>
                </div>
            </div>

            <div className="p-10 rounded-[50px] bg-[#0A0A0B] border border-white/5 border-l-4 border-l-burnished-copper shadow-xl">
                <p className="micro-text uppercase text-white/20 tracking-widest font-black text-[9px] mb-2">Final Deployment Status</p>
                <p className="hero-text text-4xl text-white tracking-widest uppercase leading-none">Silicon Reality.</p>
            </div>
          </div>
        </div>

        {/* Right Column: Industrial Career Matrix */}
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {OPPORTUNITIES.map((opt, i) => (
                    <motion.div 
                        key={opt.title}
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1, duration: 0.5 }}
                        className="group p-8 rounded-[45px] bg-white/[0.01] border border-white/5 flex flex-col items-start relative overflow-hidden hover:bg-white/[0.04] transition-all duration-500 shadow-xl"
                    >
                        <div className="absolute top-0 right-0 p-8 opacity-5 text-plasma-cyan group-hover:scale-110 transition-transform duration-700">
                            {React.createElement(opt.icon, { size: 80 })}
                        </div>

                        <div className="w-14 h-14 rounded-2xl bg-black border border-white/10 flex items-center justify-center text-plasma-cyan mb-8 group-hover:shadow-cyan-glow transition-all">
                            {React.createElement(opt.icon, { size: 24, strokeWidth: 1.5 })}
                        </div>

                        <div className="space-y-3 relative z-10">
                            <h4 className="hero-text text-xl uppercase tracking-widest text-white group-hover:text-plasma-cyan transition-colors">{opt.title}</h4>
                            <p className="body-text text-[11px] text-white/40 leading-relaxed font-light group-hover:text-white/70 transition-colors uppercase tracking-wider">{opt.desc}</p>
                        </div>
                        
                        <div className="mt-8 flex items-center gap-3 micro-text text-[9px] text-plasma-cyan font-black tracking-widest opacity-0 group-hover:opacity-100 transition-all">
                            VIEW SPECIALIZATION <ArrowRight size={14} />
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Tactical Meta-Info */}
            <div className="p-10 rounded-[60px] bg-black border border-white/10 flex items-center justify-between gap-10 relative overflow-hidden group shadow-3xl">
                <div className="absolute inset-0 bg-gradient-to-r from-plasma-cyan/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                
                <div className="relative z-10 flex items-center gap-6">
                    <div className="w-16 h-16 rounded-full border-2 border-plasma-cyan/20 flex items-center justify-center text-plasma-cyan group-hover:scale-110 transition-transform">
                        <Activity size={28} className="animate-pulse" />
                    </div>
                    <div>
                        <div className="micro-text uppercase tracking-[0.4em] text-plasma-cyan/60 font-black text-[9px]">Architecture Verification</div>
                        <div className="hero-text text-3xl text-white tracking-widest uppercase truncate max-w-[200px]">VERI_CORE_V1.R2</div>
                    </div>
                </div>

                <button className="relative z-10 px-8 py-4 rounded-3xl bg-plasma-cyan text-black micro-text font-black uppercase tracking-[0.2em] shadow-xl shadow-plasma-cyan/20 hover:scale-105 active:scale-95 transition-all text-[10px]">
                    Deploy Master RTL
                </button>
            </div>

            <div className="flex items-center justify-center gap-6 opacity-20">
                <div className="h-px w-20 bg-white/40" />
                <Binary size={16} />
                <div className="h-px w-20 bg-white/40" />
            </div>
        </div>
      </div>
    </BlueprintContainer>
  );
};
