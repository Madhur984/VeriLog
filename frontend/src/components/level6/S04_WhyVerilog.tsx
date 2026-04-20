import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Activity, Maximize2, Cpu, BarChart3, Binary, ShieldAlert } from 'lucide-react';
import { BlueprintContainer } from './common/BlueprintContainer';
import { HeroText } from './common/HeroText';

export const S04_WhyVerilog: React.FC<{ isActive: boolean }> = ({ isActive }) => {
  return (
    <BlueprintContainer>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-24 items-start w-full">
        {/* Left Column: Narrative Sidebar */}
        <div className="space-y-10 sticky top-24">
          <div className="space-y-4">
             <div className="micro-text uppercase tracking-[0.4em] text-burnished-copper font-black opacity-60 flex items-center gap-2">
                <ShieldAlert size={14} /> Structural Necessity
             </div>
             <HeroText className="text-left leading-none" color="text-white">Why <br/><span className="text-burnished-copper">Verilog?</span></HeroText>
          </div>
          
          <div className="space-y-8 max-w-xl">
            <p className="body-text text-xl text-white/80 leading-relaxed font-light">
              At <span className="text-burnished-copper font-bold underline underline-offset-8 decoration-burnished-copper/30">3nm Nodes</span>, you cannot draw a chip. You must describe its intent.
            </p>
            <p className="body-text text-base text-white/50 leading-relaxed">
               With 100 billion nodes, manual routing is physically impossible. Verilog allows engineers to manageindustrial-grade complexity by treating hardware as code, while maintaining the temporal accuracy only silicon can provide.
            </p>

            <div className="p-10 rounded-[40px] bg-white/[0.02] border border-white/5 border-l-4 border-l-burnished-copper group">
                 <div className="flex items-center gap-4 mb-4">
                    <Maximize2 size={20} className="text-burnished-copper group-hover:scale-110 transition-transform" />
                    <span className="micro-text uppercase tracking-widest text-white/60 font-black">Complexity Barrier</span>
                 </div>
                 <p className="body-text text-sm opacity-40 leading-relaxed font-light">
                    Scaling from 10 transistors to 100 Billion requires a paradigm shift from physical drawing to mathematical description.
                 </p>
            </div>
          </div>
        </div>

        {/* Right Column: Optimization Diagnostic Dashboard */}
        <div className="relative h-[720px] w-full rounded-[60px] bg-black border border-white/5 overflow-hidden shadow-2xl p-12 flex flex-col">
            <div className="flex items-center justify-between mb-12">
                <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-burnished-copper/20 text-burnished-copper">
                        <BarChart3 size={24} />
                    </div>
                    <div>
                        <div className="micro-text opacity-40 tracking-[0.2em] font-black uppercase">Efficiency Matrix V2.0</div>
                        <div className="hero-text text-lg uppercase text-white tracking-widest leading-none">Industrial Design Pillars</div>
                    </div>
                </div>
            </div>

            <div className="flex-1 grid grid-cols-1 gap-6">
                {[
                    { title: 'Synthesis Link', desc: 'The bridge where code becomes actual physical gates.', icon: Zap, color: 'text-burnished-copper', val: '99.8%' },
                    { title: 'Temporal Proof', desc: 'Detecting timing errors in software before fabrication.', icon: Activity, color: 'text-plasma-cyan', val: '0.1ns Res' },
                    { title: 'Elastic Scale', desc: 'Managing designs from 100 to 100 Billion transistors.', icon: Maximize2, color: 'text-white/40', val: '∞ Nodes' }
                ].map((item, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="p-10 rounded-[50px] bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all flex items-center justify-between group"
                    >
                        <div className="flex items-center gap-8">
                            <div className={`w-16 h-16 rounded-[24px] bg-black border border-white/10 flex items-center justify-center ${item.color} group-hover:scale-110 transition-transform`}>
                                <item.icon size={32} strokeWidth={1} />
                            </div>
                            <div className="space-y-1">
                                <h4 className="hero-text text-2xl uppercase text-white tracking-tighter">{item.title}</h4>
                                <p className="body-text text-sm opacity-40 max-w-sm font-light leading-relaxed">{item.desc}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="hero-text text-3xl text-white/20 group-hover:text-white transition-colors">{item.val}</div>
                            <div className="micro-text uppercase tracking-widest text-[9px] opacity-20">Parametric Metric</div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Scale Paradox Visualization Detail */}
            <div className="mt-12 p-8 rounded-[40px] bg-burnished-copper/5 border border-burnished-copper/20 flex items-center gap-8">
                 <div className="flex-shrink-0 w-24 h-24 rounded-full border border-burnished-copper/30 flex items-center justify-center relative">
                    <div className="absolute inset-2 border border-dashed border-burnished-copper/20 rounded-full animate-spin-slow" />
                    <Binary size={32} className="text-burnished-copper" />
                 </div>
                 <div className="space-y-2">
                    <div className="micro-text uppercase tracking-widest text-burnished-copper font-black">Engineering Verdict</div>
                    <p className="body-text text-base text-white/60 italic leading-snug">
                        "Verilog is not just a language choice; it is the physical infrastructure of the modern information age."
                    </p>
                 </div>
            </div>

            <div className="absolute inset-0 opacity-[0.01] pointer-events-none overflow-hidden rotate-12">
                <div className="w-[1000px] h-[1000px] border border-white rounded-full flex items-center justify-center">
                    <div className="w-[800px] h-[800px] border border-white rounded-full" />
                </div>
            </div>
        </div>
      </div>
    </BlueprintContainer>
  );
};
