import React from "react";
import { motion } from "framer-motion";
import { BlueprintContainer } from "./common/BlueprintContainer";
import { HeroText } from "./common/HeroText";
import { Cpu, Zap, Binary, CircuitBoard, ArrowRight } from "lucide-react";

const OPPORTUNITIES = [
  { title: "FPGA Designer", desc: "Design flexible accelerators for Data Centers and HFT.", icon: Zap },
  { title: "ASIC Specialist", desc: "Craft custom physical silicon for phones and space.", icon: CircuitBoard },
  { title: "AI Architect", desc: "Build Tensor cores and NPU architectures in Verilog.", icon: Binary },
  { title: "Verification Expert", desc: "The gatekeeper of silicon reliability and quality.", icon: Cpu },
];

export const S19_FinalBridge: React.FC<{ isActive: boolean }> = ({ isActive }) => {
  return (
    <BlueprintContainer>
      <div className="w-full max-w-5xl mb-16 relative group">
          <div className="absolute -inset-4 bg-plasma-cyan/10 blur-[60px] rounded-full opacity-60" />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="relative h-[250px] md:h-[350px] rounded-[60px] overflow-hidden border border-white/5"
          >
            <img src="/assets/module6/fab.png" alt="Futuristic Fab" className="w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
            <div className="absolute bottom-10 left-10 right-10 flex flex-col md:flex-row justify-between items-end gap-4">
                <div className="space-y-1">
                    <div className="text-[10px] font-black uppercase tracking-[0.6em] text-plasma-cyan">Location: TSMC-GIGA-21</div>
                    <div className="text-3xl font-black italic tracking-tighter uppercase whitespace-nowrap">The Frontier of Silk.</div>
                </div>
                <div className="text-[8px] font-mono opacity-20 uppercase tracking-[0.2em] max-w-[200px] text-right">
                    # SCAN_COMPLETE: ALL GATES VERIFIED. READY FOR IMPLEMENTATION.
                </div>
            </div>
          </motion.div>
      </div>

      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-6">
            {OPPORTUNITIES.map((opt, i) => (
                <motion.div 
                    key={opt.title}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="p-8 md:p-10 rounded-[40px] md:rounded-[50px] bg-solder-mask border border-white/5 flex flex-col items-center text-center group hover:border-plasma-cyan/30 transition-all duration-500 hover:bg-plasma-cyan/5"
                >
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl md:rounded-3xl bg-white/[0.03] border border-white/5 flex items-center justify-center mb-8 text-plasma-cyan group-hover:scale-110 transition-transform">
                        {React.createElement(opt.icon, { size: 32 })}
                    </div>
                    <h4 className="text-xl md:text-2xl font-black mb-4 tracking-tight italic uppercase leading-none">{opt.title}</h4>
                    <p className="text-xs md:text-sm opacity-40 leading-relaxed font-bold italic">{opt.desc}</p>
                    
                    <div className="mt-8 opacity-0 group-hover:opacity-100 transition-opacity">
                        <ArrowRight size={24} className="text-plasma-cyan animate-pulse" />
                    </div>
                </motion.div>
            ))}
      </div>

      <div className="mt-20 flex flex-col items-center gap-8">
            <div className="text-[10px] font-black uppercase tracking-[0.5em] text-[#00D4FF] animate-pulse">
                System Ready for Physical Implementation
            </div>
            
            <div className="max-w-xl text-center">
                 <p className="text-3xl md:text-4xl font-black italic tracking-tighter leading-[0.9] uppercase">
                    You've passed the <span className="text-plasma-cyan">Language Gate.</span> <br/>
                    Next stop: <span className="text-burnished-copper">Silicon Reality.</span>
                 </p>
            </div>
      </div>
    </BlueprintContainer>
  );
};
