import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Cpu, Play, Terminal, Zap, CheckCircle2, Search, Activity, Share2, Database } from 'lucide-react';
import { BlueprintContainer } from './common/BlueprintContainer';
import { HeroText } from './common/HeroText';

export const S06A_Testbench: React.FC<{ isActive: boolean }> = ({ isActive }) => {
  return (
    <BlueprintContainer>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-24 items-start w-full text-left">
        {/* Left Column: Narrative Sidebar */}
        <div className="space-y-10 sticky top-24">
          <div className="space-y-4">
             <div className="micro-text uppercase tracking-[0.4em] text-emerald-400 font-black opacity-60 flex items-center gap-2 text-[10px]">
                <Shield size={14} /> Safety Matrix // V_CYCLE_PRIME
             </div>
             <HeroText className="text-left leading-none" color="text-white">The Silent <br/><span className="text-emerald-400 uppercase tracking-tighter">Partner.</span></HeroText>
          </div>
          
          <div className="space-y-8 max-w-xl">
            <p className="body-text text-xl text-white/80 leading-relaxed font-light">
              Verification is the <span className="text-emerald-400 font-bold italic underline underline-offset-8 decoration-emerald-400/30 uppercase tracking-widest text-sm">Invisible Half</span> of high-stakes design.
            </p>
            <p className="body-text text-base text-white/50 leading-relaxed font-light">
               Hardware bugs aren't just crashes-they are multi-million dollar recalls. The Testbench is your safety shield, ensuring logic is flawless before silicon etching.
            </p>

            <div className="space-y-3 pt-4">
                {[
                    { label: 'Virtual Existence', desc: 'Testbenches have NO physical pins; they live only in temporal simulation.', icon: Terminal, code: 'TB_ENV_01' },
                    { label: 'Input Injection', desc: 'Acting as the environment, applying raw stimulus to logic gates.', icon: Activity, code: 'STIM_VEC_8' },
                    { label: 'Verification Loop', desc: 'Comparing outputs against mathematical models in real-time.', icon: CheckCircle2, code: 'MATCH_99' }
                ].map((rule, i) => (
                    <div key={i} className="p-6 rounded-[35px] bg-[#0A0A0B] border border-white/5 border-l-2 border-l-emerald-500/20 group hover:bg-emerald-500/5 transition-all">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-4">
                                <rule.icon size={16} className="text-emerald-400 opacit-60" />
                                <span className="micro-text uppercase tracking-widest text-white/60 font-black text-[10px]">{rule.label}</span>
                            </div>
                            <div className="micro-text text-emerald-500/40 text-[9px] font-black tracking-tighter">{rule.code}</div>
                        </div>
                        <p className="body-text text-[11px] opacity-30 group-hover:opacity-60 leading-relaxed font-light italic pl-8">"{rule.desc}"</p>
                    </div>
                ))}
            </div>
          </div>
        </div>

        {/* Right Column: Interaction Monitor Dashboard */}
        <div className="relative h-[720px] w-full rounded-[60px] bg-black border border-white/5 overflow-hidden shadow-2xl p-12 flex flex-col">
            <div className="absolute top-10 left-10 micro-text opacity-40 tracking-[0.3em] font-black uppercase flex items-center gap-3 text-[10px]">
                <Search size={14} className="text-emerald-400" /> Stimulus-Response Monitor // CYCLE_COUNT: 1.4M
            </div>

            <div className="flex-1 flex flex-col items-center justify-center gap-16">
                <div className="flex items-center gap-16 lg:gap-24 relative">
                    <div className="flex flex-col items-center gap-6 group">
                        <div className="w-28 h-28 rounded-[40px] bg-[#0A0A0B] border border-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-2xl shadow-emerald-500/5 relative">
                            <Play size={44} fill="currentColor" className="animate-pulse" />
                            <div className="absolute -inset-4 border border-dashed border-emerald-500/10 rounded-full animate-spin-slow opacity-30" />
                        </div>
                        <div className="text-center">
                            <div className="hero-text text-lg uppercase text-white tracking-widest">The Bench</div>
                            <div className="micro-text opacity-40 tracking-widest text-[8px] uppercase font-black">Stimulus Generator</div>
                        </div>
                    </div>

                    <div className="relative w-32 flex items-center justify-center">
                        <div className="w-full h-px bg-white/5" />
                        <motion.div 
                            animate={{ x: [-60, 60], opacity: [0, 1, 0] }}
                            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                            className="absolute h-1 w-8 bg-emerald-400 rounded-full shadow-emerald-glow"
                        />
                         <div className="absolute -top-6 micro-text text-emerald-400 uppercase font-black tracking-[0.3em] text-[8px] px-3 py-1 bg-bg-elev border border-emerald-500/20 rounded-full">
                            TRANS_VECTORS
                        </div>
                    </div>

                    <div className="flex flex-col items-center gap-6 group">
                        <div className="w-28 h-28 rounded-[40px] bg-[#0A0A0B] border border-indigo-500/20 flex items-center justify-center text-indigo-400 shadow-2xl shadow-indigo-500/5">
                            <Cpu size={44} strokeWidth={1} />
                        </div>
                        <div className="text-center">
                            <div className="hero-text text-lg uppercase text-white tracking-widest">The DUT</div>
                            <div className="micro-text opacity-40 tracking-widest text-[8px] uppercase font-black">Device Under Test</div>
                        </div>
                    </div>
                </div>

                <div className="w-full max-w-md p-10 rounded-[45px] bg-[#0A0A0B] border border-white/5 relative group overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 p-8 opacity-[0.02] rotate-12">
                        <Shield size={120} />
                    </div>
                    <div className="space-y-8 relative z-10">
                         <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Zap size={18} className="text-emerald-400" />
                                <span className="micro-text uppercase tracking-widest text-emerald-400/60 font-black text-[10px]">Verification Result</span>
                            </div>
                            <div className="text-emerald-400 hero-text text-4xl tracking-tighter shadow-emerald-glow">PASS</div>
                         </div>
                         <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                             <motion.div 
                                initial={{ width: 0 }}
                                whileInView={{ width: '100%' }}
                                transition={{ duration: 2, ease: "easeInOut" }}
                                className="h-full bg-emerald-400 shadow-emerald-glow"
                             />
                         </div>
                         <div className="grid grid-cols-2 gap-4">
                            <div className="p-5 rounded-[25px] bg-black border border-white/5 text-center group/met hover:border-emerald-500/20 transition-colors">
                                <div className="micro-text opacity-20 uppercase text-[8px] mb-1.5 font-black tracking-widest group-hover/met:text-emerald-400 group-hover/met:opacity-60 transition-colors">Code Coverage</div>
                                <div className="hero-text text-2xl text-white tracking-tighter">99.4%</div>
                            </div>
                            <div className="p-5 rounded-[25px] bg-black border border-white/5 text-center group/met hover:border-emerald-500/20 transition-colors">
                                <div className="micro-text opacity-20 uppercase text-[8px] mb-1.5 font-black tracking-widest group-hover/met:text-emerald-400 group-hover/met:opacity-60 transition-colors">Timing Slack</div>
                                <div className="hero-text text-2xl text-white tracking-tighter">0.02ns</div>
                            </div>
                         </div>
                    </div>
                </div>
            </div>

            <div className="mt-auto flex items-center justify-between p-8 bg-bg-elev border border-border-soft rounded-[40px] shadow-neo">
                <div className="flex items-center gap-6 text-left">
                    <div className="w-12 h-12 rounded-[15px] border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-xl">
                        <Database size={22} />
                    </div>
                    <div>
                        <div className="micro-text uppercase text-white/40 tracking-widest font-black text-[9px]">Gold Mirror Active</div>
                        <div className="hero-text text-xs uppercase text-white tracking-widest">Mathematical verification loop initialized.</div>
                    </div>
                </div>
                <div className="flex gap-4">
                    <div className="p-3 rounded-2xl bg-white/5 border border-white/5 text-white/40">
                         <Share2 size={18} />
                    </div>
                </div>
            </div>

            {/* Background Texture Overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.02] mix-blend-overlay">
                <div className="text-[320px] hero-text uppercase rotate-12 -translate-x-32 select-none">SAFE</div>
            </div>
        </div>
      </div>
    </BlueprintContainer>
  );
};
