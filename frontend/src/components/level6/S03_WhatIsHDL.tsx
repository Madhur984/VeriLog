import React from 'react';
import { motion } from 'framer-motion';
import { Layers, Zap, Activity, Cpu, Binary, HardDrive, Share2, Database, ShieldCheck } from 'lucide-react';
import { BlueprintContainer } from './common/BlueprintContainer';
import { HeroText } from './common/HeroText';

export const S03_WhatIsHDL: React.FC<{ isActive: boolean }> = ({ isActive }) => {
  return (
    <BlueprintContainer>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-24 items-start w-full">
        {/* Left Column: Narrative Sidebar */}
        <div className="space-y-10 sticky top-24">
          <div className="space-y-4 text-left">
             <div className="micro-text uppercase tracking-[0.4em] text-plasma-cyan font-black opacity-60 flex items-center gap-2">
                <HardDrive size={14} /> Semantic Logic Bridge
             </div>
             <HeroText className="text-left leading-none" color="text-white">The <br/><span className="text-plasma-cyan uppercase tracking-tighter">Blueprint.</span></HeroText>
          </div>
          
          <div className="space-y-8 max-w-xl text-left">
            <p className="body-text text-xl text-white/80 leading-relaxed font-light">
              HDL is not <span className="text-plasma-cyan font-bold italic border-b-2 border-plasma-cyan/30">code.</span> It is a mathematical definition of existence in silicon.
            </p>
            <p className="body-text text-base text-white/50 leading-relaxed font-light">
               In traditional programming, you describe a process. In Verilog, you describe a <span className="text-white font-bold underline underline-offset-8 decoration-white/20">physical fact.</span> Every declaration generates a permanent structure of copper and transistors.
            </p>

            <div className="p-8 rounded-[40px] bg-[#0A0A0B] border border-white/5 border-l-4 border-l-plasma-cyan shadow-xl group">
                 <div className="flex items-center gap-4 mb-4">
                    <Binary size={20} className="text-plasma-cyan group-hover:scale-110 transition-transform" />
                    <span className="micro-text uppercase tracking-widest text-white/60 font-black">Ontological Paradigm</span>
                 </div>
                 <p className="body-text text-[11px] text-white/40 leading-relaxed font-light italic">
                    "Verilog tools don't read code to 'do' things. They read it to map out what currently exists in spatial reality."
                 </p>
            </div>
          </div>
        </div>

        {/* Right Column: Definition Visualization Dashboard */}
        <div className="relative h-[720px] w-full rounded-[60px] bg-black border border-white/5 overflow-hidden shadow-2xl p-12 flex flex-col">
            <div className="absolute top-10 left-10 micro-text opacity-40 tracking-[0.3em] font-black uppercase flex items-center gap-3 text-[10px]">
                <Activity size={14} className="text-plasma-cyan" /> Essence Analyzer // ONTOLOGY_SEC
            </div>

            <div className="flex-1 space-y-6 mt-12 mb-12">
                {[
                    { title: 'Concurrent Reality', desc: 'Hardware doesn\'t follow a sequence. Everything exists at once.', icon: Activity, detail: 'Spatial Parallelism', met: 'SIM_CYCLES: CONCURRENT' },
                    { title: 'Temporal Pulse', desc: 'Clocks act as the biological heartbeat for the silicon body.', icon: Zap, detail: 'Cycle Accuracy', met: 'TIMING: JITTER_FREE' },
                    { title: 'Synthetic Essence', desc: 'Code becomes physical gates, the actual bridges of copper.', icon: Layers, detail: 'Netlist Synthesis', met: 'FAB: READY_FOR_MASK' },
                ].map((item, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, x: 10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="p-8 rounded-[45px] bg-[#0A0A0B] border border-white/5 hover:bg-white/[0.02] transition-all flex items-center justify-between group cursor-default relative overflow-hidden"
                    >
                        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-plasma-cyan/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="flex items-center gap-8">
                            <div className="w-16 h-16 rounded-[25px] bg-black border border-white/10 flex items-center justify-center text-plasma-cyan transition-all group-hover:shadow-cyan-glow">
                                <item.icon size={28} strokeWidth={1.5} />
                            </div>
                            <div className="text-left space-y-1">
                                <div className="micro-text uppercase text-plasma-cyan/60 tracking-widest font-black text-[9px]">{item.detail}</div>
                                <h4 className="hero-text text-2xl uppercase text-white tracking-tight leading-none mb-1">{item.title}</h4>
                                <p className="body-text text-xs text-white/30 max-w-sm leading-relaxed">{item.desc}</p>
                            </div>
                        </div>
                        <div className="text-right hidden md:block">
                             <div className="micro-text uppercase text-white/20 tracking-tighter font-black text-[8px] mb-2">{item.met}</div>
                             <div className="h-0.5 w-16 bg-white/5 rounded-full overflow-hidden">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    whileInView={{ width: '100%' }}
                                    transition={{ duration: 1.5, delay: i * 0.2 }}
                                    className="h-full bg-plasma-cyan/60"
                                />
                             </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="p-8 bg-bg-elev border border-border-soft rounded-[35px] flex items-center justify-between shadow-neo">
                <div className="flex items-center gap-6">
                    <div className="w-10 h-10 rounded-xl bg-plasma-cyan/10 border border-plasma-cyan/30 flex items-center justify-center text-plasma-cyan">
                        <ShieldCheck size={20} />
                    </div>
                    <div>
                        <div className="micro-text uppercase text-white/40 tracking-widest font-black text-[9px]">Structural Logic Verified</div>
                        <div className="hero-text text-xs uppercase text-white tracking-[0.2em]">Ontological Existence Pipeline: ACTIVE_SYNTH</div>
                    </div>
                </div>
                <div className="flex gap-1.5 grayscale opacity-20">
                    <Binary size={14} />
                    <Database size={14} />
                    <Share2 size={14} />
                </div>
            </div>

            {/* Background Texture Overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.02] mix-blend-overlay">
                <div className="text-[280px] hero-text uppercase rotate-12 translate-x-10 translate-y-20 select-none">BLUEPRINT</div>
            </div>
        </div>
      </div>
    </BlueprintContainer>
  );
};
