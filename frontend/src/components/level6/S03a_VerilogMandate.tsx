import React from "react";
import { motion } from "framer-motion";
import { Cpu, TrendingUp, Rocket, IndianRupee, Factory, Briefcase, Zap, AlertCircle, CheckCircle, ShieldCheck, Globe, Users, Activity, Share2, Database } from "lucide-react";
import { BlueprintContainer } from './common/BlueprintContainer';
import { HeroText } from './common/HeroText';

export const S03a_VerilogMandate: React.FC<{ isActive: boolean }> = ({ isActive }) => {
  return (
    <BlueprintContainer>
      <div className="space-y-32 w-full">
        {/* Section 1: Geopolitical Macro-Scan */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-24 items-start">
            <div className="space-y-10 sticky top-24">
                <div className="space-y-4 text-left">
                    <div className="micro-text uppercase tracking-[0.4em] text-plasma-cyan font-black opacity-60 flex items-center gap-2 text-[10px]">
                        <ShieldCheck size={14} /> Strategic Protocol // ISM_V1.0
                    </div>
                    <HeroText className="text-left leading-none" color="text-white">The <br/><span className="text-plasma-cyan">Verilog</span> <br/> Mandate.</HeroText>
                </div>
                
                <div className="space-y-8 max-w-xl text-left">
                    <p className="body-text text-xl text-white/80 leading-relaxed font-light">
                        Hardware mastery is no longer optional. It is the <span className="text-white font-bold underline underline-offset-8 decoration-plasma-cyan/30 uppercase tracking-widest text-sm">Absolute Requirement</span> for the next generation of engineers.
                    </p>
                    <p className="body-text text-base text-white/50 leading-relaxed font-light">
                        Verilog is the bridge between algorithm and physical silicon. It is the language of the masters who build the foundations on which all software runs.
                    </p>

                    <div className="grid grid-cols-2 gap-4 pt-4">
                         <div className="p-6 rounded-[35px] bg-[#0A0A0B] border border-white/5 group hover:border-plasma-cyan/40 transition-colors">
                            <div className="micro-text uppercase text-plasma-cyan/60 font-black mb-2 text-[8px] tracking-[0.2em]">Market Scarcity</div>
                            <div className="hero-text text-2xl text-white flex items-center gap-2 tracking-tighter uppercase">
                                <Activity size={16} className="text-plasma-cyan animate-pulse" /> Elite Tier
                            </div>
                         </div>
                         <div className="p-6 rounded-[35px] bg-[#0A0A0B] border border-white/5 group hover:border-burnished-copper/40 transition-colors">
                            <div className="micro-text uppercase text-burnished-copper/60 font-black mb-2 text-[8px] tracking-[0.2em]">Asset Value</div>
                            <div className="hero-text text-2xl text-white tracking-tighter uppercase">Critical</div>
                         </div>
                    </div>
                </div>
            </div>

            <div className="space-y-12">
                {/* Physical Anatomy Panel */}
                <div className="p-12 rounded-[60px] bg-black border border-white/10 shadow-2xl relative overflow-hidden group">
                    <div className="absolute -top-20 -right-20 p-12 opacity-[0.03]">
                        <Cpu size={320} strokeWidth={1} className="rotate-12" />
                    </div>
                    
                    <div className="relative z-10 space-y-8 text-left">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-plasma-cyan/10 border border-plasma-cyan/30 flex items-center justify-center text-plasma-cyan">
                                <Cpu size={24} />
                            </div>
                            <div>
                                <div className="micro-text uppercase text-white/40 font-black tracking-widest text-[9px]">Structural Essence</div>
                                <h3 className="hero-text text-2xl uppercase tracking-widest text-white">Physical Definition</h3>
                            </div>
                        </div>
                        <p className="body-text text-2xl leading-snug text-white/90 font-light max-w-lg">
                            Verilog is the high-fidelity blueprint of chip design-used to model, simulate, and <span className="text-plasma-cyan font-medium">synthesize digital reality.</span>
                        </p>
                        <div className="p-8 rounded-[40px] bg-white/[0.02] border border-white/5 border-l-4 border-l-plasma-cyan space-y-4">
                            <div className="flex items-center gap-3 text-plasma-cyan">
                                <Zap size={18} className="animate-pulse" />
                                <span className="micro-text font-black uppercase tracking-widest text-[10px]">Architectural Advantage // Parallelism</span>
                            </div>
                            <p className="body-text text-sm text-white/40 font-light leading-relaxed">
                                Unlike sequential software, Verilog describes <span className="text-white font-medium">spatial logic fabric</span>-where millions of events occur at the exact same nanosecond.
                            </p>
                        </div>
                    </div>
                </div>

                {/* The Comparison Matrix Dashboard */}
                <div className="p-12 rounded-[60px] bg-[#0A0A0B] border border-white/5 relative overflow-hidden">
                    <div className="absolute top-10 right-10 micro-text opacity-40 tracking-[0.3em] font-black uppercase flex items-center gap-3 text-[10px]">
                        <Database size={14} className="text-plasma-cyan" /> Industrial Vector Matrix
                    </div>
                     <div className="flex items-center gap-4 mb-10 text-left">
                        <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-white/40">
                            <Briefcase size={22} />
                        </div>
                        <div>
                            <div className="micro-text uppercase text-white/40 font-black tracking-widest text-[9px]">Career Trajectory</div>
                            <h3 className="hero-text text-2xl uppercase tracking-widest text-white">The Career Matrix</h3>
                        </div>
                    </div>
                    <div className="overflow-hidden rounded-[40px] border border-white/10 bg-black/40">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-white/[0.03] border-b border-white/10">
                                    <th className="p-6 micro-text uppercase text-white/40 text-[9px]">Vector</th>
                                    <th className="p-6 micro-text uppercase text-white/40 text-[9px]">Software Stack</th>
                                    <th className="p-6 micro-text uppercase text-plasma-cyan bg-plasma-cyan/5 text-[9px]">Verilog Hardware</th>
                                </tr>
                            </thead>
                            <tbody className="body-text text-xs uppercase tracking-tight">
                                {[
                                    { aspect: "Execution", soft: "Sequential Trace", hw: "Massive Parallelism", color: "text-plasma-cyan" },
                                    { aspect: "Result", soft: "Virtual Logic", hw: "Physical Silicon", color: "text-white" },
                                    { aspect: "Market", soft: "Oversaturated", hw: "Extreme Scarcity", color: "text-plasma-cyan" },
                                    { aspect: "Barrier", soft: "Medium", hw: "High (ECE Elite)", color: "text-burnished-copper" }
                                ].map((row, idx) => (
                                    <tr key={idx} className="border-b border-white/5 last:border-0 hover:bg-white/[0.04] transition-colors">
                                        <td className="p-6 text-white/40 micro-text font-black text-[9px]">{row.aspect}</td>
                                        <td className="p-6 opacity-30 font-light italic text-[10px]">{row.soft}</td>
                                        <td className={`p-6 ${row.color} font-black tracking-widest text-[10px]`}>{row.hw}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>

        {/* Section 2: National Strategic Asset Dashboard */}
        <div className="relative p-16 rounded-[80px] bg-gradient-to-br from-[#FFC10705] to-transparent border border-[#FFC10715] overflow-hidden">
             <div className="absolute top-12 right-12 flex items-center gap-4">
                 <div className="w-2.5 h-2.5 rounded-full bg-[#FFC107] animate-pulse shadow-[0_0_15px_rgba(255,193,7,0.4)]" />
                 <div className="micro-text text-[#FFC107] font-black uppercase tracking-[0.3em] text-[10px]">National Status: Semiconductor Mission</div>
             </div>
             
             <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-20 items-center">
                 <div className="space-y-10 text-left">
                     <div className="w-20 h-20 rounded-[35px] bg-[#FFC107]/10 border border-[#FFC10733] flex items-center justify-center text-[#FFC107] shadow-xl">
                        <IndianRupee size={40} strokeWidth={1} />
                     </div>
                     <div className="space-y-4">
                        <HeroText className="text-left leading-none" color="text-white">National <br/><span className="text-[#FFC107]">Strategic</span> Goal.</HeroText>
                        <p className="body-text text-xl opacity-60 max-w-lg leading-relaxed font-light">
                            India is injecting <span className="text-white font-bold underline underline-offset-8 decoration-[#FFC107]/40 uppercase tracking-widest text-sm">₹76,000 Crore</span> to build global chip dominance on our own soil.
                        </p>
                     </div>
                 </div>

                 <div className="grid grid-cols-2 gap-5 relative z-10">
                      {[
                        { title: 'C2S Initiative', data: '₹6 CR', desc: 'Direct support for hardware-level innovation.' },
                        { title: 'DLI Scheme', data: '₹30 CR', desc: 'Performance-based design incentives.' },
                        { title: 'Global Fabs', data: 'TATA / Micron', desc: 'The rise of domestic manufacturing.' },
                        { title: 'R&D Hubs', data: 'NVIDIA / AMD', desc: 'Critical tier design centers nationwide.' }
                      ].map((card, i) => (
                        <div key={i} className="p-8 rounded-[40px] bg-[#0A0A0B] border border-white/5 hover:border-[#FFC10733] transition-all group relative overflow-hidden text-left">
                             <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                <Database size={40} className="text-[#FFC107]" />
                             </div>
                             <div className="micro-text text-[#FFC107]/60 mb-2 font-black uppercase tracking-widest text-[9px]">{card.title}</div>
                             <div className="hero-text text-3xl text-white mb-2 tracking-tighter">{card.data}</div>
                             <p className="body-text text-[10px] opacity-30 leading-relaxed font-light uppercase group-hover:text-white/50 transition-colors">{card.desc}</p>
                        </div>
                      ))}
                 </div>
             </div>
             <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] bg-[#FFC107]/5 rounded-full blur-[140px] pointer-events-none" />
        </div>

        {/* Section 3: Industry Telemetry & Final Protocol */}
        <div className="space-y-12 w-full">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { val: '1.0M', label: 'Talent Shortage', detail: 'GLOBAL PROJECTED DEFICIT // 2030', color: 'text-white' },
                    { val: '275K', label: 'Design Intake', detail: 'IMMEDIATE VLSI DEMAND QUOTA', color: 'text-burnished-copper' },
                    { val: '150K', label: 'Active Elite', detail: 'REGISTERED DESIGNERS NATIONWIDE', color: 'text-plasma-cyan' }
                ].map((stat, i) => (
                    <div key={i} className="flex flex-col items-center justify-center p-12 rounded-[55px] bg-[#0A0A0B] border border-white/5 text-center group hover:bg-white/[0.03] transition-all relative overflow-hidden">
                        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                        <div className={`hero-text text-6xl ${stat.color} mb-3 group-hover:scale-105 transition-transform tracking-tighter`}>{stat.val}</div>
                        <div className="micro-text uppercase tracking-[0.4em] font-black opacity-40 mb-1 text-[9px]">{stat.label}</div>
                        <div className="body-text text-[9px] text-white/20 uppercase tracking-widest font-black italic">{stat.detail}</div>
                    </div>
                ))}
            </div>

            <div className="p-16 rounded-[70px] bg-gradient-to-r from-plasma-cyan/5 to-transparent border border-plasma-cyan/10 relative overflow-hidden">
                <div className="flex flex-col lg:flex-row items-center gap-12 relative z-10 text-left">
                    <div className="w-24 h-24 rounded-[35px] bg-plasma-cyan/10 border border-plasma-cyan/30 flex items-center justify-center text-plasma-cyan animate-pulse shadow-cyan-glow">
                        <Zap size={40} />
                    </div>
                    <div className="space-y-4 flex-1">
                        <div className="micro-text uppercase text-plasma-cyan font-black tracking-[0.4em] text-[10px]">The AI Hardware Secret Weapon</div>
                        <h3 className="hero-text text-4xl uppercase text-white tracking-widest leading-none">Architectural Mastery</h3>
                        <p className="body-text text-xl opacity-50 leading-relaxed font-light max-w-3xl">
                             GPUs, NPUs, and Neural Engines are not software objects-they are <span className="text-plasma-cyan font-bold italic">Verilog Architectures.</span> This is your ticket to the elite tier of global engineering.
                        </p>
                    </div>
                </div>
            </div>

            <div className="text-center pt-24 border-t border-white/5 opacity-40 flex flex-col items-center gap-4">
                <Share2 size={24} className="text-plasma-cyan/40" />
                <p className="hero-text text-xl uppercase tracking-[0.4em] text-white/60">Silicon excellence is no longer a choice. It's a national mission.</p>
            </div>
        </div>
      </div>
    </BlueprintContainer>
  );
};
