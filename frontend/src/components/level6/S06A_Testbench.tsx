import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Cpu, Play, Terminal, Zap, CheckCircle2, Search, Activity } from 'lucide-react';
import { BlueprintContainer } from './common/BlueprintContainer';
import { HeroText } from './common/HeroText';

export const S06A_Testbench: React.FC<{ isActive: boolean }> = ({ isActive }) => {
  return (
    <BlueprintContainer>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-24 items-start w-full">
        {/* Left Column: Narrative Sidebar */}
        <div className="space-y-10 sticky top-24">
          <div className="space-y-4">
             <div className="micro-text uppercase tracking-[0.4em] text-emerald-400 font-black opacity-60 flex items-center gap-2">
                <Shield size={14} /> Safety Matrix V1.0
             </div>
             <HeroText className="text-left leading-none" color="text-white">The Silent <br/><span className="text-emerald-400">Partner.</span></HeroText>
          </div>
          
          <div className="space-y-8 max-w-xl">
            <p className="body-text text-xl text-white/80 leading-relaxed font-light">
              Verification is the <span className="text-emerald-400 font-bold italic underline underline-offset-8 decoration-emerald-400/30">invisible half</span> of high-stakes design.
            </p>
            <p className="body-text text-base text-white/50 leading-relaxed">
               In the world of hardware, a bug isn't just a crash—it's a multi-million dollar recall. The Testbench is your safety shield, ensuring your logic is flawless before a single atom of silicon is etched.
            </p>

            <div className="space-y-4 pt-4">
                {[
                    { label: 'Virtual Existence', desc: 'Testbenches have NO physical pins; they live only in temporal simulation.', icon: Terminal },
                    { label: 'Input Injection', desc: 'They act as the environment, applying raw stimulus to your logic gates.', icon: Activity },
                    { label: 'Verification Loop', desc: 'They compare outputs against mathematical golden models in real-time.', icon: CheckCircle2 }
                ].map((rule, i) => (
                    <div key={i} className="p-6 rounded-[30px] bg-white/[0.02] border border-white/5 border-l-2 border-l-emerald-500/40 group hover:bg-emerald-500/5 hover:border-emerald-500/20 transition-all">
                        <div className="flex items-center gap-4 mb-2">
                            <rule.icon size={16} className="text-emerald-400" />
                            <span className="micro-text uppercase tracking-widest text-white/60 font-black">{rule.label}</span>
                        </div>
                        <p className="body-text text-xs opacity-40 group-hover:opacity-60 leading-relaxed">{rule.desc}</p>
                    </div>
                ))}
            </div>
          </div>
        </div>

        {/* Right Column: Interaction Monitor Dashboard */}
        <div className="relative h-[720px] w-full rounded-[60px] bg-black border border-white/5 overflow-hidden shadow-2xl p-12 flex flex-col">
            <div className="absolute top-10 left-10 micro-text opacity-40 tracking-[0.3em] font-black uppercase flex items-center gap-3">
                <Search size={14} className="text-emerald-400" /> Stimulus-Response Monitor
            </div>

            <div className="flex-1 flex flex-col items-center justify-center gap-16">
                <div className="flex items-center gap-20">
                    <div className="flex flex-col items-center gap-6">
                        <div className="w-28 h-28 rounded-[35px] bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-2xl shadow-emerald-500/10 group animate-pulse">
                            <Play size={48} fill="currentColor" />
                        </div>
                        <div className="text-center">
                            <div className="hero-text text-lg uppercase text-white">The Bench</div>
                            <div className="micro-text opacity-40 tracking-widest text-[9px] uppercase">Stimulus Generator</div>
                        </div>
                    </div>

                    <div className="relative w-40 flex items-center justify-center">
                        <div className="w-full h-px bg-white/10" />
                        <motion.div 
                            animate={{ x: [-80, 80], opacity: [0, 1, 0] }}
                            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                            className="absolute h-1 w-10 bg-emerald-400 rounded-full shadow-emerald-glow"
                        />
                         <div className="absolute -top-6 micro-text text-emerald-400 uppercase font-black tracking-widest text-[8px] animate-pulse">
                            TRANSFERRING_VECTORS
                        </div>
                    </div>

                    <div className="flex flex-col items-center gap-6">
                        <div className="w-28 h-28 rounded-[35px] bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shadow-2xl shadow-indigo-500/10">
                            <Cpu size={48} strokeWidth={1} />
                        </div>
                        <div className="text-center">
                            <div className="hero-text text-lg uppercase text-white">The Core</div>
                            <div className="micro-text opacity-40 tracking-widest text-[9px] uppercase">Device Under Test</div>
                        </div>
                    </div>
                </div>

                <div className="w-full max-w-md p-10 rounded-[40px] bg-[#0A0A0B] border border-white/5 relative group overflow-hidden">
                    <div className="space-y-6">
                         <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Zap size={16} className="text-emerald-400" />
                                <span className="micro-text uppercase tracking-widest text-emerald-400/60 font-black">Verification Result</span>
                            </div>
                            <div className="text-emerald-400 hero-text text-xl">PASS</div>
                         </div>
                         <div className="h-0.5 w-full bg-white/5 rounded-full overflow-hidden">
                             <motion.div 
                                initial={{ width: 0 }}
                                whileInView={{ width: '100%' }}
                                transition={{ duration: 1.5 }}
                                className="h-full bg-emerald-400"
                             />
                         </div>
                         <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 text-center">
                                <div className="micro-text opacity-20 uppercase text-[9px] mb-1">Coverage</div>
                                <div className="hero-text text-lg text-white">99.4%</div>
                            </div>
                            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 text-center">
                                <div className="micro-text opacity-20 uppercase text-[9px] mb-1">Latency</div>
                                <div className="hero-text text-lg text-white">0.02ns</div>
                            </div>
                         </div>
                    </div>
                </div>
            </div>

            <div className="mt-8 flex items-center justify-center gap-4 py-8 border-t border-white/5 opacity-30">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="micro-text uppercase tracking-widest text-[10px]">Verification Safety Protocol: ARMED & ACTIVE</span>
            </div>
        </div>
      </div>
    </BlueprintContainer>
  );
};
