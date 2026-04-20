import React from 'react';
import { motion } from 'framer-motion';
import { Code, Share2, Rocket, Binary, Cpu, ChevronRight, Scan } from 'lucide-react';
import { BlueprintContainer } from './common/BlueprintContainer';
import { HeroText } from './common/HeroText';

export const S05b_DieComparison: React.FC<{ isActive: boolean }> = ({ isActive }) => {
  return (
    <BlueprintContainer>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-24 items-start w-full">
        {/* Left Column: Narrative Sidebar */}
        <div className="space-y-10 sticky top-24">
          <div className="space-y-4">
             <div className="micro-text uppercase tracking-[0.4em] text-rose-500 font-black opacity-60 flex items-center gap-2">
                <Scan size={14} /> Structural Transition
             </div>
             <HeroText className="text-left leading-none" color="text-white">Code to <br/> <span className="text-rose-500">Silicon.</span></HeroText>
          </div>
          
          <div className="space-y-8 max-w-xl">
            <p className="body-text text-xl text-white/80 leading-relaxed font-light">
              Tangible proof of the <span className="text-rose-500 font-bold italic underline underline-offset-8 decoration-rose-500/30">digital-to-physical</span> transition.
            </p>
            <p className="body-text text-base text-white/50 leading-relaxed">
               Every line of Verilog code is a physical instruction. Synthesis tools do not "execute" this code; they map it into permanent paths of copper and logic gates on the surface of a silicon die.
            </p>

            <div className="p-8 rounded-[40px] bg-white/[0.02] border border-white/5 border-l-4 border-l-rose-500 group">
                 <div className="flex items-center gap-4 mb-4">
                    <Binary size={20} className="text-rose-500 group-hover:scale-110 transition-transform" />
                    <span className="micro-text uppercase tracking-widest text-white/60 font-black">Logical Definition</span>
                 </div>
                 <div className="bg-black/60 rounded-2xl p-6 font-mono text-[11px] leading-relaxed text-rose-400 border border-white/5 shadow-inner">
                    <div className="opacity-40 mb-1">// 4-bit Logic Adder</div>
                    <div className="group-hover:text-rose-300 transition-colors">
                        module adder(<br/>
                        &nbsp;&nbsp;input [3:0] a, b,<br/>
                        &nbsp;&nbsp;output [4:0] sum<br/>
                        );<br/>
                        &nbsp;&nbsp;assign sum = a + b;<br/>
                        endmodule
                    </div>
                 </div>
            </div>
          </div>
        </div>

        {/* Right Column: Physical Macro Dashboard */}
        <div className="relative h-[720px] w-full rounded-[60px] bg-black border border-white/5 overflow-hidden shadow-2xl p-12 flex flex-col">
            <div className="absolute top-10 left-10 micro-text opacity-40 tracking-[0.3em] font-black uppercase flex items-center gap-3">
                <Cpu size={14} className="text-rose-500" /> Physical Silicon Manifest
            </div>

            <div className="flex-1 flex flex-col items-center justify-center space-y-12">
                <div className="relative group">
                    <div className="absolute -inset-10 bg-rose-500/20 blur-[80px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                    <div className="relative w-72 h-72 rounded-[60px] bg-gradient-to-br from-rose-500 to-amber-600 p-0.5 shadow-2xl overflow-hidden shadow-rose-500/20 translate-y-0 group-hover:-translate-y-4 transition-transform duration-700">
                        <div className="w-full h-full bg-black rounded-[58px] flex items-center justify-center p-8">
                             {/* High-Fidelity Die Grid */}
                             <div className="w-full h-full border border-white/10 rounded-2xl bg-white/[0.02] grid grid-cols-4 grid-rows-4 gap-1 p-2 relative overflow-hidden">
                                {[...Array(16)].map((_, i) => (
                                    <div key={i} className="bg-white/5 rounded-sm group-hover:bg-rose-500/10 transition-colors" />
                                ))}
                                <div className="absolute inset-0 bg-gradient-to-tr from-rose-500/10 via-transparent to-transparent opacity-40" />
                                <div className="absolute inset-x-2 bottom-2 h-0.5 bg-rose-500/20 group-hover:bg-rose-500 transition-colors" />
                             </div>
                        </div>
                    </div>
                    
                    {/* Visual Callouts */}
                    <div className="absolute -right-24 top-0 p-4 rounded-2xl bg-white/[0.03] border border-white/5 backdrop-blur-xl space-y-1">
                        <div className="micro-text text-rose-500 font-bold uppercase tracking-widest text-[9px]">Foundry Node</div>
                        <div className="hero-text text-lg text-white">TSMC 3NM</div>
                    </div>
                    <div className="absolute -left-24 bottom-0 p-4 rounded-2xl bg-white/[0.03] border border-white/5 backdrop-blur-xl space-y-1">
                        <div className="micro-text text-rose-500 font-bold uppercase tracking-widest text-[9px]">Logic Density</div>
                        <div className="hero-text text-lg text-white">EXTREME</div>
                    </div>
                </div>

                <div className="text-center space-y-6 max-w-sm">
                    <div className="flex items-center justify-center gap-3">
                        <div className="h-px w-10 bg-white/10" />
                        <div className="px-4 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-500 micro-text text-[9px] font-black uppercase">
                            State Transition Complete
                        </div>
                        <div className="h-px w-10 bg-white/10" />
                    </div>
                    <p className="body-text text-lg text-white/50 leading-relaxed font-light italic">
                        "Numerical code becomes structural matter. The Verilog description dictates every atomic connection on this die."
                    </p>
                </div>
            </div>

            <div className="mt-8 flex items-center justify-between p-6 bg-white/[0.02] border border-white/10 rounded-3xl backdrop-blur-md">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-500 flex items-center justify-center shadow-lg shadow-rose-500/20">
                        <Share2 size={20} />
                    </div>
                    <div>
                        <div className="micro-text uppercase text-white/60 tracking-widest font-black">The Direct Mapping</div>
                        <div className="body-text text-[10px] opacity-30">Translating abstract HDL into physical foundry GDSII.</div>
                    </div>
                </div>
                <div className="p-3 rounded-xl bg-white/5 text-white/40">
                    <Rocket size={18} />
                </div>
            </div>
        </div>
      </div>
    </BlueprintContainer>
  );
};
