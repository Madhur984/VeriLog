import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Activity, Maximize2, Cpu, BarChart3, Binary, ShieldAlert, Share2, Database } from 'lucide-react';
import { BlueprintContainer } from './common/BlueprintContainer';
import { HeroText } from './common/HeroText';

export const S04_WhyVerilog: React.FC<{ isActive: boolean }> = ({ isActive }) => {
  return (
    <BlueprintContainer>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-24 items-start w-full">
        {/* Left Column: Narrative Sidebar */}
        <div className="space-y-10 sticky top-24">
          <div className="space-y-4 text-left">
             <div className="micro-text uppercase tracking-[0.4em] text-burnished-copper font-black opacity-60 flex items-center gap-2 text-[10px]">
                <ShieldAlert size={14} /> Structural Necessity // CORE_PRIME
             </div>
             <HeroText className="text-left leading-none" color="text-white">Why <br/><span className="text-burnished-copper uppercase">Verilog?</span></HeroText>
          </div>
          
          <div className="space-y-8 max-w-xl text-left">
            <p className="body-text text-xl text-white/80 leading-relaxed font-light">
              At <span className="text-burnished-copper font-bold underline underline-offset-8 decoration-burnished-copper/30 uppercase tracking-widest text-sm">3nm Nodes</span>, you cannot draw a chip. You must describe its intent.
            </p>
            <p className="body-text text-base text-white/50 leading-relaxed font-light">
               With 100 billion nodes, manual routing is physically impossible. Verilog allows engineers to manage extreme complexity by treating hardware as a spatial description.
            </p>

            <div className="p-8 rounded-[40px] bg-[#0A0A0B] border border-white/5 border-l-4 border-l-burnished-copper shadow-xl group">
                 <div className="flex items-center gap-4 mb-4">
                    <Maximize2 size={20} className="text-burnished-copper group-hover:scale-110 transition-transform" />
                    <span className="micro-text uppercase tracking-widest text-white/60 font-black">Complexity Barrier</span>
                 </div>
                 <p className="body-text text-[11px] text-white/40 leading-relaxed font-light italic">
                    "Scaling from 10 transistors to 100 Billion requires a paradigm shift from physical drawing to mathematical description. Verilog is that shift."
                 </p>
            </div>
          </div>
        </div>

        {/* Right Column: Optimization Visualization Dashboard */}
        <div className="relative h-[720px] w-full rounded-[60px] bg-black border border-white/5 overflow-hidden shadow-2xl p-12 flex flex-col">
            <div className="absolute top-10 left-10 micro-text opacity-40 tracking-[0.3em] font-black uppercase flex items-center gap-3 text-[10px]">
                <BarChart3 size={14} className="text-burnished-copper" /> Efficiency Matrix // PILLAR_SCAN
            </div>

            <div className="flex-1 space-y-6 mt-12 mb-12">
                {[
                    { title: 'Synthesis Link', desc: 'The bridge where code becomes actual physical gates.', icon: Zap, color: 'text-burnished-copper', val: '99.8%', met: 'TRANS_LOSS: <0.01%' },
                    { title: 'Temporal Proof', desc: 'Detecting timing errors in hardware before fabrication.', icon: Activity, color: 'text-plasma-cyan', val: '0.1ns', met: 'JITTER_CORR: ACTIVE' },
                    { title: 'Elastic Scale', desc: 'Managing designs from 100 to 100 Billion transistors.', icon: Maximize2, color: 'text-white/40', val: '∞', met: 'NODE_COUNT: UNLIMITED' }
                ].map((item, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, x: 15 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="p-8 rounded-[45px] bg-[#0A0A0B] border border-white/5 hover:bg-white/[0.03] transition-all flex items-center justify-between group relative overflow-hidden"
                    >
                        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-burnished-copper/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="flex items-center gap-8 text-left">
                            <div className={`w-16 h-16 rounded-[25px] bg-black border border-white/10 flex items-center justify-center ${item.color} group-hover:scale-110 transition-transform group-hover:shadow-xl`}>
                                <item.icon size={28} strokeWidth={1.5} />
                            </div>
                            <div className="space-y-1">
                                <h4 className="hero-text text-2xl uppercase text-white tracking-tight leading-none mb-1">{item.title}</h4>
                                <p className="body-text text-xs text-white/30 max-w-sm leading-relaxed font-light">{item.desc}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="hero-text text-3xl text-white/60 tracking-tighter group-hover:text-white transition-colors leading-none mb-1">{item.val}</div>
                            <div className="micro-text uppercase tracking-widest text-[8px] opacity-20 font-black">{item.met}</div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="p-8 rounded-[40px] bg-burnished-copper/5 border border-burnished-copper/10 backdrop-blur-md flex items-center gap-8">
                 <div className="flex-shrink-0 w-20 h-20 rounded-[30px] border border-burnished-copper/20 flex items-center justify-center relative bg-black shadow-xl">
                    <div className="absolute inset-2 border border-dashed border-burnished-copper/10 rounded-full animate-spin-slow opacity-30" />
                    <Binary size={28} strokeWidth={1} className="text-burnished-copper" />
                 </div>
                 <div className="text-left space-y-1">
                    <div className="micro-text uppercase tracking-[0.2em] text-burnished-copper/60 font-black text-[9px]">Engineering Verdict</div>
                    <p className="body-text text-sm text-white/40 italic leading-snug font-light max-w-md">
                        "Verilog is not just a choice; it is the physical infrastructure of the modern information age."
                    </p>
                 </div>
            </div>

            {/* Background Texture Overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.02] mix-blend-overlay">
                <div className="text-[280px] hero-text uppercase -rotate-12 translate-x-10 translate-y-20 select-none">PILLAR</div>
            </div>
        </div>
      </div>
    </BlueprintContainer>
  );
};
