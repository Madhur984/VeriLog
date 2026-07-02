import React from 'react';
import { motion } from 'framer-motion';
import { Code, Share2, Rocket, Binary, Cpu, ChevronRight, Scan, Database, Activity } from 'lucide-react';
import { BlueprintContainer } from './common/BlueprintContainer';
import { HeroText } from './common/HeroText';

export const S05b_DieComparison: React.FC<{ isActive: boolean }> = ({ isActive }) => {
  return (
    <BlueprintContainer>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-24 items-start w-full text-left">
        {/* Left Column: Narrative Sidebar */}
        <div className="space-y-10 sticky top-24">
          <div className="space-y-4">
             <div className="micro-text uppercase tracking-[0.4em] text-rose-500 font-black opacity-60 flex items-center gap-2 text-[10px]">
                <Scan size={14} /> Structural Transition // GDSII_MAP
             </div>
             <HeroText className="text-left leading-none" color="text-white">Code to <br/> <span className="text-rose-500 uppercase tracking-tighter">Silicon.</span></HeroText>
          </div>
          
          <div className="space-y-8 max-w-xl">
            <p className="body-text text-xl text-white/80 leading-relaxed font-light">
              Tangible proof of the <span className="text-rose-500 font-bold italic underline underline-offset-8 decoration-rose-500/30 uppercase tracking-widest text-sm">digital-to-physical</span> transition.
            </p>
            <p className="body-text text-base text-white/50 leading-relaxed font-light">
               Every line of Verilog code is a physical instruction. Synthesis tools map your description into permanent paths of copper and logic gates on the surface of a silicon die.
            </p>

            <div className="p-8 rounded-[40px] bg-[#0A0A0B] border border-white/5 border-l-4 border-l-rose-500 shadow-xl group">
                 <div className="flex items-center gap-4 mb-4">
                    <Binary size={20} className="text-rose-500 group-hover:scale-110 transition-transform" />
                    <span className="micro-text uppercase tracking-widest text-white/60 font-black text-[10px]">Logical Definition // RTL_SRC</span>
                 </div>
                 <div className="bg-black/60 rounded-3xl p-6 font-mono text-[10px] leading-relaxed text-rose-400 border border-white/5 shadow-inner">
                    <div className="opacity-30 mb-1">// 4-bit Logic Gate Parallel Engine</div>
                    <div className="group-hover:text-rose-300 transition-colors">
                        <span className="text-white opacity-40">module</span> adder(<br/>
                        &nbsp;&nbsp;<span className="text-white opacity-40">input</span> [3:0] a, b,<br/>
                        &nbsp;&nbsp;<span className="text-white opacity-40">output</span> [4:0] sum<br/>
                        );<br/>
                        &nbsp;&nbsp;<span className="text-white opacity-40">assign</span> sum = a + b;<br/>
                        <span className="text-white opacity-40">endmodule</span>
                    </div>
                 </div>
            </div>
          </div>
        </div>

        {/* Right Column: Physical Macro Dashboard */}
        <div className="relative h-[720px] w-full rounded-[60px] bg-black border border-white/5 overflow-hidden shadow-2xl p-12 flex flex-col">
            <div className="absolute top-10 left-10 micro-text opacity-40 tracking-[0.3em] font-black uppercase flex items-center gap-3 text-[10px]">
                <Cpu size={14} className="text-rose-500" /> Physical Silicon Manifest // UNIT_TEST: PASSED
            </div>

            <div className="flex-1 flex flex-col items-center justify-center space-y-12">
                <div className="relative group">
                    <div className="absolute -inset-16 bg-rose-500/10 blur-[100px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                    <div className="relative w-80 h-80 rounded-[65px] bg-gradient-to-br from-rose-600/40 to-amber-600/40 p-px shadow-2xl overflow-hidden group-hover:-translate-y-4 transition-transform duration-1000 ease-out">
                        <div className="w-full h-full bg-[#0A0A0B] rounded-[64px] flex items-center justify-center p-8">
                             {/* High-Fidelity Die Grid */}
                             <div className="w-full h-full border border-white/10 rounded-3xl bg-black grid grid-cols-6 grid-rows-6 gap-0.5 p-1 relative overflow-hidden group-hover:gap-1 transition-all">
                                {[...Array(36)].map((_, i) => (
                                    <div key={i} className="bg-white/[0.03] rounded-sm group-hover:bg-rose-500/20 transition-colors duration-500" />
                                ))}
                                <div className="absolute inset-0 bg-gradient-to-tr from-rose-500/20 via-transparent to-transparent opacity-40" />
                                <div className="absolute inset-2 border border-rose-500/20 rounded-2xl pointer-events-none group-hover:border-rose-500 transition-colors" />
                             </div>
                        </div>
                    </div>
                    
                    {/* Visual Callouts */}
                    <div className="absolute -right-16 top-10 p-5 rounded-3xl bg-bg-elev border border-border-soft space-y-1 shadow-neo group-hover:translate-x-4 transition-transform">
                        <div className="micro-text text-rose-500 font-black uppercase tracking-[0.2em] text-[9px]">Foundry Node</div>
                        <div className="hero-text text-xl text-white tracking-widest leading-none">TSMC 3NM</div>
                    </div>
                    <div className="absolute -left-16 bottom-10 p-5 rounded-3xl bg-bg-elev border border-border-soft space-y-1 shadow-neo group-hover:-translate-x-4 transition-transform">
                        <div className="micro-text text-rose-500 font-black uppercase tracking-[0.2em] text-[9px]">Logic Density</div>
                        <div className="hero-text text-xl text-white tracking-widest leading-none">PRIME_X</div>
                    </div>
                </div>

                <div className="text-center space-y-6 max-w-sm">
                    <div className="flex items-center justify-center gap-4">
                        <div className="h-px w-10 bg-white/10" />
                        <div className="px-5 py-1.5 rounded-full bg-rose-500/5 border border-rose-500/20 text-rose-500 micro-text text-[9px] font-black uppercase tracking-widest">
                            Synthesis Verified // 1.0.4
                        </div>
                        <div className="h-px w-10 bg-white/10" />
                    </div>
                    <p className="body-text text-sm text-white/40 italic leading-relaxed font-light px-8">
                        "Numerical code becomes structural matter. The Verilog description dictates every atomic connection on this 3nm die."
                    </p>
                </div>
            </div>

            <div className="mt-8 flex items-center justify-between p-8 bg-bg-elev border border-border-soft rounded-[40px] shadow-neo">
                <div className="flex items-center gap-6">
                    <div className="w-14 h-14 rounded-[20px] bg-rose-500/10 text-rose-500 flex items-center justify-center shadow-2xl shadow-rose-500/10 border border-rose-500/20 group hover:scale-110 transition-transform">
                        <Share2 size={24} />
                    </div>
                    <div className="text-left">
                        <div className="micro-text uppercase text-white/40 tracking-[0.3em] font-black text-[9px]">The Direct Mapping</div>
                        <div className="hero-text text-xs uppercase text-white tracking-widest">GDSII Industrial Export Ready.</div>
                    </div>
                </div>
                <div className="flex gap-4">
                    <div className="p-3 rounded-2xl bg-white/5 border border-white/5 text-white/40">
                         <Database size={18} />
                    </div>
                    <div className="p-3 rounded-2xl bg-white/5 border border-white/5 text-white/40">
                         <Activity size={18} />
                    </div>
                </div>
            </div>

            {/* Background Texture Overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay">
                <div className="text-[320px] hero-text uppercase -rotate-12 translate-x-20 translate-y-40 select-none">DIE</div>
            </div>
        </div>
      </div>
    </BlueprintContainer>
  );
};
