import React from "react";
import { motion } from "framer-motion";
import { Cpu, TrendingUp, Rocket, IndianRupee, Factory, Briefcase, Zap, AlertCircle, CheckCircle } from "lucide-react";

interface Props {
  isActive: boolean;
}

export const S03a_VerilogMandate: React.FC<Props> = ({ isActive }) => {
  return (
    <div className="flex flex-col items-center justify-start w-full relative bg-matte-obsidian/40 text-oscilloscope-trace font-ui py-10">
      {/* Subtle background circuit elements */}
      <div className="absolute inset-0 pointer-events-none opacity-20 z-0">
        <div className="absolute inset-0 bg-dot-grid" />
        <div className="absolute inset-0 bg-ghost-traces" />
        {/* Stylized PCB trace lines */}
        <svg className="absolute w-full h-full opacity-10" viewBox="0 0 1000 1000">
            <path d="M0 100 H200 L250 150 V300 L300 350 H500" fill="none" stroke="currentColor" strokeWidth="1" />
            <path d="M1000 900 H800 L750 850 V700 L700 650 H500" fill="none" stroke="currentColor" strokeWidth="1" />
            <circle cx="500" cy="500" r="400" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="5,5" />
        </svg>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={isActive ? { opacity: 1 } : {}}
        className="relative z-10 max-w-6xl w-full px-8 space-y-16"
      >
        {/* Header Section */}
        <div className="text-center space-y-6">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={isActive ? { scale: 1, opacity: 1 } : {}}
            transition={{ duration: 0.8 }}
            className="inline-block px-6 py-2 rounded-full border border-plasma-cyan/30 bg-plasma-cyan/5 text-[10px] font-black tracking-[0.4em] uppercase text-plasma-cyan mb-4"
          >
            Mission Protocol V6.0
          </motion.div>
          <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter leading-none">
            The <span className="text-plasma-cyan">Verilog</span> Mandate
          </h1>
          <p className="text-xl md:text-2xl text-grid-line max-w-3xl mx-auto font-medium italic">
            Why YOU, an ECE student, must master hardware description – for your career, for the nation, and for the future.
          </p>
        </div>

        {/* Definition Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            <div className="lg:col-span-12 bg-solder-mask border border-plasma-cyan/30 rounded-[40px] p-10 relative overflow-hidden group hover:shadow-cyan-glow transition-all duration-700">
                <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Cpu size={180} />
                </div>
                <div className="relative z-10 space-y-6">
                    <div className="flex items-center gap-4 text-plasma-cyan">
                        <Cpu size={32} />
                        <h2 className="text-3xl font-black italic tracking-tighter uppercase">What is Verilog?</h2>
                    </div>
                    <p className="text-2xl leading-tight font-medium opacity-80">
                         <span className="text-plasma-cyan font-black">Verilog is a Hardware Description Language (HDL)</span> used to model, simulate, and synthesise digital circuits. 
                         It is the <span className="text-white italic">blueprint of chip design</span> – the bridge between an engineer’s idea and the silicon that runs the world.
                    </p>
                    <div className="p-8 rounded-3xl bg-black/40 border border-white/5 space-y-4">
                        <div className="flex items-center gap-3 text-plasma-cyan">
                            <Zap size={20} />
                            <span className="text-xs font-black uppercase tracking-widest">Parallel Execution</span>
                        </div>
                        <p className="text-base opacity-60 leading-relaxed font-bold italic">
                            Unlike software languages (Python, Java), Verilog describes <span className="text-white">parallel hardware</span> – millions of operations happening simultaneously, not one after another.
                        </p>
                    </div>
                </div>
            </div>
        </div>

        {/* Why Learn & Comparison Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Why ECE Students Card */}
            <div className="space-y-8">
                <h2 className="text-3xl font-black italic tracking-tighter flex items-center gap-4">
                    <TrendingUp size={32} className="text-plasma-cyan" /> 
                    <span className="uppercase">The ECE Imperative</span>
                </h2>
                <div className="grid grid-cols-1 gap-4">
                    {[
                        { title: "Core of Digital Design", desc: "Every digital chip – from simple timer to CPU – is described in Verilog." },
                        { title: "High-Demand Skill", desc: "Intel, AMD, NVIDIA, Qualcomm – hardware giants run on Verilog." },
                        { title: "VLSI & Embedded Systems", desc: "The entry point to advanced chip architecture and FPGA mastery." },
                        { title: "Career Growth", desc: "From design engineer → chip architect → hardware startup founder." }
                    ].map((item, i) => (
                        <div key={i} className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 flex gap-6 group hover:border-plasma-cyan/30 transition-all">
                             <div className="w-10 h-10 rounded-xl bg-plasma-cyan/10 flex items-center justify-center text-plasma-cyan flex-shrink-0">
                                <CheckCircle size={20} />
                             </div>
                             <div>
                                <div className="text-lg font-black italic tracking-tight mb-1">{item.title}</div>
                                <div className="text-xs opacity-40 font-bold italic leading-relaxed">{item.desc}</div>
                             </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Comparison Table */}
            <div className="space-y-8 min-w-0">
                <h2 className="text-3xl font-black italic tracking-tighter flex items-center gap-4">
                    <Briefcase size={32} className="text-plasma-cyan" /> 
                    <span className="uppercase">Verilog vs Software</span>
                </h2>
                <div className="rounded-[40px] border border-white/5 bg-white/[0.01] overflow-x-auto scrollbar-hide">
                    <table className="w-full text-left border-collapse min-w-[500px]">
                        <thead>
                            <tr className="border-b border-white/10 bg-white/[0.02]">
                                <th className="p-6 text-plasma-cyan font-black uppercase tracking-widest text-[10px]">Aspect</th>
                                <th className="p-6 text-white/40 font-black uppercase tracking-widest text-[10px]">AI/ML Software</th>
                                <th className="p-6 text-plasma-cyan font-black uppercase tracking-widest text-[10px] bg-plasma-cyan/5">Verilog HW</th>
                            </tr>
                        </thead>
                        <tbody className="font-bold italic text-xs">
                            {[
                                { aspect: "Execution", soft: "Sequential", hw: "Fully Parallel" },
                                { aspect: "Output", soft: "Model/Program", hw: "Physical Silicon" },
                                { aspect: "Job Market", soft: "Saturated", hw: "Undersupplied" },
                                { aspect: "Barrier", soft: "Medium", hw: "HIGH (ECE Elite)" }
                            ].map((row, idx) => (
                                <tr key={idx} className="border-b border-white/5 group hover:bg-white/[0.02] transition-colors">
                                    <td className="p-6 text-white/60 uppercase font-black font-mono tracking-tighter whitespace-nowrap">{row.aspect}</td>
                                    <td className="p-6 opacity-30 whitespace-nowrap">{row.soft}</td>
                                    <td className="p-6 text-plasma-cyan bg-plasma-cyan/[0.02] font-black whitespace-nowrap">{row.hw}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        {/* Nation Building Section */}
        <div className="bg-[#FFC10711] border border-[#FFC10733] rounded-[50px] p-12 relative overflow-hidden">
            <div className="absolute -top-20 -right-20 w-80 h-80 bg-[#FFC10708] rounded-full blur-[100px]" />
            <div className="flex flex-col md:flex-row items-center gap-12 relative z-10">
                <div className="flex-shrink-0 space-y-4 text-center md:text-left">
                     <div className="w-24 h-24 rounded-full bg-[#FFC10722] flex items-center justify-center text-[#FFC107] mx-auto md:mx-0">
                        <IndianRupee size={48} />
                     </div>
                     <div className="text-[10px] font-black uppercase tracking-[0.4em] text-[#FFC107]">Nation Building</div>
                </div>
                <div className="flex-1 space-y-6">
                    <h2 className="text-4xl md:text-5xl font-black italic tracking-tighter">India <span className="text-[#FFC107]">Semiconductor</span> Mission</h2>
                    <p className="text-xl font-bold opacity-60 italic leading-snug">
                         India is no longer just an outsourcing hub. With ₹76,000 Crore ($10B) in subsidies, we are building <span className="text-white italic underline">Chip Fabs</span> on our own soil.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div className="p-5 rounded-2xl bg-black/40 border border-[#FFC10722]">
                             <div className="text-xs font-black text-[#FFC107] uppercase mb-1">C2S Scheme</div>
                             <div className="text-sm font-medium opacity-40 italic">₹6 Cr funding for chip startups.</div>
                         </div>
                         <div className="p-5 rounded-2xl bg-black/40 border border-[#FFC10722]">
                             <div className="text-xs font-black text-[#FFC107] uppercase mb-1">DLI Scheme</div>
                             <div className="text-sm font-medium opacity-40 italic">₹30 Cr incentives per design company.</div>
                         </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Dopamine Shot & Employment Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-10 rounded-[40px] bg-white/[0.02] border border-white/5 flex flex-col items-center justify-center text-center space-y-4">
                 <div className="text-5xl font-black text-white italic tracking-tighter">1,000,000</div>
                 <div className="text-[10px] font-black uppercase tracking-widest text-grid-line">Global Shortage by 2030</div>
            </div>
            <div className="p-10 rounded-[40px] bg-white/[0.02] border border-white/5 flex flex-col items-center justify-center text-center space-y-4">
                 <div className="text-5xl font-black text-burnished-copper italic tracking-tighter">275,000</div>
                 <div className="text-[10px] font-black uppercase tracking-widest text-burnished-copper">New Designers Needed</div>
            </div>
            <div className="p-10 rounded-[40px] bg-white/[0.02] border border-white/5 flex flex-col items-center justify-center text-center space-y-4">
                 <div className="text-5xl font-black text-plasma-cyan italic tracking-tighter">150,000</div>
                 <div className="text-[10px] font-black uppercase tracking-widest text-plasma-cyan">Active Indian Designers</div>
            </div>
        </div>

        {/* AI Integration */}
        <div className="p-10 rounded-[40px] bg-plasma-cyan/10 border border-plasma-cyan/30 text-center space-y-6">
            <div className="flex items-center justify-center gap-4 text-plasma-cyan">
                <Zap size={32} />
                <h3 className="text-3xl font-black italic tracking-tighter uppercase font-mono">AI/ML Hardware is the Secret Weapon</h3>
            </div>
            <p className="text-2xl font-black opacity-80 leading-tight max-w-4xl mx-auto italic">
                GPUs, TPUs, and NPUs are built in Verilog. <span className="text-white italic">ECE + Verilog + AI</span> is your ticket to the most valuable role in tech: The Chip Architect.
            </p>
        </div>

        {/* Final Hook */}
        <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1 p-8 rounded-3xl bg-burnished-copper/10 border-l-4 border-burnished-copper">
                <div className="flex items-center gap-3 text-burnished-copper mb-4">
                    <AlertCircle size={20} />
                    <span className="font-black uppercase tracking-widest text-xs">The Barrier</span>
                </div>
                <p className="text-xl font-bold italic opacity-80">"You can build a website in a weekend. You cannot build a chip in a weekend. That's why hardware engineers are irreplaceable."</p>
            </div>
            <div className="flex-1 p-8 rounded-3xl bg-plasma-cyan/10 border-l-4 border-plasma-cyan">
                <div className="flex items-center gap-3 text-plasma-cyan mb-4">
                    <Rocket size={20} />
                    <span className="font-black uppercase tracking-widest text-xs">The Solution</span>
                </div>
                <p className="text-xl font-bold italic opacity-80">"Verilog turns complexity into code. It's the blueprint language of the digital age."</p>
            </div>
        </div>

        <div className="text-center pt-10">
            <p className="text-3xl font-black italic tracking-tighter opacity-20 uppercase">Learning this isn't a subject. It's a mission.</p>
        </div>
      </motion.div>
    </div>
  );
};
