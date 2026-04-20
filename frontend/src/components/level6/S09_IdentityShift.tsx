import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, ArrowRight, Cpu, Activity, ShieldCheck, Zap, Binary, Layers } from 'lucide-react';
import { BlueprintContainer } from './common/BlueprintContainer';
import { HeroText } from './common/HeroText';

export const S09_IdentityShift: React.FC<{ isActive: boolean }> = ({ isActive }) => {
  return (
    <BlueprintContainer>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-24 items-start w-full">
        {/* Left Column: Narrative Sidebar */}
        <div className="space-y-10 sticky top-24">
          <div className="space-y-4">
             <div className="micro-text uppercase tracking-[0.4em] text-burnished-copper font-black opacity-60 flex items-center gap-2">
                <ShieldCheck size={14} /> Cognitive Realignment
             </div>
             <HeroText className="text-left leading-none" color="text-white">Foundations <br/><span className="text-burnished-copper">Mastered.</span></HeroText>
          </div>
          
          <div className="space-y-8 max-w-xl">
            <p className="body-text text-xl text-white/80 leading-relaxed font-light">
              You no longer draw gates. You <span className="text-burnished-copper font-bold italic underline underline-offset-8 decoration-burnished-copper/30">describe reality.</span> The digital world is yours to architect.
            </p>
            <p className="body-text text-base text-white/50 leading-relaxed">
               The transition from software logic to hardware architecture is complete. You have internalized the physical nature of HDL. You are no longer coding; you are weaving metal.
            </p>

            <div className="grid grid-cols-2 gap-4">
                <div className="p-6 rounded-[30px] bg-white/[0.02] border border-white/5 space-y-2">
                    <div className="hero-text text-2xl text-burnished-copper leading-none">100%</div>
                    <div className="micro-text uppercase opacity-30 tracking-widest text-[9px]">Syntax Proficiency</div>
                </div>
                <div className="p-6 rounded-[30px] bg-white/[0.02] border border-white/5 space-y-2">
                    <div className="hero-text text-2xl text-white leading-none">OPTIMIZED</div>
                    <div className="micro-text uppercase opacity-30 tracking-widest text-[9px]">Structural Logic</div>
                </div>
            </div>
          </div>
        </div>

        {/* Right Column: Transition Monitor Dashboard */}
        <div className="relative h-[720px] w-full rounded-[60px] bg-black border border-white/5 overflow-hidden shadow-2xl p-12 flex flex-col">
            <div className="absolute top-10 left-10 micro-text opacity-40 tracking-[0.3em] font-black uppercase flex items-center gap-3">
                <Layers size={14} className="text-burnished-copper" /> Structural Transition Diagnostic
            </div>

            <div className="flex-1 flex flex-col justify-center gap-12">
                <div className="p-10 rounded-[50px] border border-burnished-copper/10 bg-burnished-copper/5 relative group backdrop-blur-md shadow-inner">
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-burnished-copper/5 blur-[80px] rounded-full group-hover:bg-burnished-copper/10 transition-colors" />
                    
                    <div className="space-y-6 relative z-10">
                        <div className="flex items-center gap-4">
                             <div className="w-10 h-10 rounded-xl bg-burnished-copper/20 text-burnished-copper flex items-center justify-center">
                                <Zap size={20} />
                             </div>
                             <div className="micro-text uppercase text-burnished-copper font-black tracking-widest text-[10px]">Upcoming // Sequential Mastery</div>
                        </div>
                        
                        <h3 className="hero-text text-3xl uppercase text-white tracking-widest leading-none">Atomic Memory Protocol</h3>
                        
                        <div className="p-8 rounded-[40px] bg-[#0A0A0B] border border-white/5 shadow-inner overflow-hidden">
                            <code className="mono-text text-xl text-burnished-copper block">
                                always @(posedge clk)<br/>
                                &nbsp;&nbsp;register &lt;= data_stream;
                            </code>
                        </div>

                        <p className="body-text text-sm opacity-40 leading-relaxed font-light">
                            Synthesis Secret: This single line describes a physical multi-bit register gate. You write logic; the tool builds the silicon.
                        </p>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="flex items-center justify-between px-2">
                        <div className="micro-text opacity-20 uppercase tracking-[0.2em] font-black text-[9px]">Waveform Propagation Preview</div>
                        <div className="flex gap-2">
                            <div className="w-2 h-2 rounded-full bg-burnished-copper animate-pulse" />
                            <div className="micro-text text-burnished-copper font-black text-[10px] uppercase">READY</div>
                        </div>
                    </div>
                    
                    <div className="space-y-4 p-8 rounded-[40px] bg-white/[0.01] border border-white/5">
                        {[1, 2].map(i => (
                            <div key={i} className="flex items-center gap-6">
                                <div className="w-16 micro-text opacity-30 tracking-widest font-bold text-[10px]">{i === 1 ? 'CLK_M' : 'GATE_Q'}</div>
                                <div className="flex-1 h-[2px] bg-white/5 relative overflow-hidden">
                                     <motion.div 
                                        animate={{ x: [-400, 400] }}
                                        transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                                        className="h-full w-32 bg-burnished-copper/40"
                                     />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="mt-8">
                <button 
                   onClick={() => window.location.href = '/course-map'}
                   className="group w-full relative h-20 rounded-[40px] bg-burnished-copper text-slate-950 hero-text text-2xl uppercase flex items-center justify-center gap-6 transition-all hover:scale-[1.02] active:scale-95 shadow-2xl shadow-burnished-copper/20 hover:shadow-burnished-copper/40 overflow-hidden"
                >
                    <span className="relative z-10">Initialize Module 7</span>
                    <ArrowRight size={28} className="relative z-10 group-hover:translate-x-2 transition-transform" />
                    <motion.div 
                        initial={{ x: '-100%' }}
                        whileHover={{ x: '100%' }}
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                        className="absolute inset-0 bg-white/10 skew-x-12"
                    />
                </button>
            </div>
        </div>
      </div>
    </BlueprintContainer>
  );
};
