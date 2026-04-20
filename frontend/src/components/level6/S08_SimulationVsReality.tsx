import React from 'react';
import { motion } from 'framer-motion';
import { Code, Cpu, Zap, Radio, Boxes, ChevronRight, Binary, Timer } from 'lucide-react';
import { BlueprintContainer } from './common/BlueprintContainer';
import { HeroText } from './common/HeroText';

const SNIPPETS = [
    { title: 'Multiplexer', code: 'assign out = sel ? i1 : i0;', desc: 'Temporal Decision logic selecting between physical paths.', icon: Radio, pro: 'Path Select' },
    { title: 'Flip-Flop', code: 'always @(posedge clk)\n  q <= d;', desc: 'Atomic memory cell synchronized to the master drum.', icon: Cpu, pro: 'State Cell' },
    { title: 'Counter', code: 'always @(posedge clk)\n  count <= count + 1;', desc: 'Sequential logic defining architectural progression.', icon: Zap, pro: 'Sequence Engine' }
];

export const S08_SimulationVsReality: React.FC<{ isActive: boolean }> = ({ isActive }) => {
  return (
    <BlueprintContainer>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-24 items-start w-full">
        {/* Left Column: Narrative Sidebar */}
        <div className="space-y-10 sticky top-24">
          <div className="space-y-4">
             <div className="micro-text uppercase tracking-[0.4em] text-plasma-cyan font-black opacity-60 flex items-center gap-2">
                <Boxes size={14} /> Fundamental Primitives
             </div>
             <HeroText className="text-left leading-none" color="text-white">Common <br/><span className="text-plasma-cyan">Patterns.</span></HeroText>
          </div>
          
          <div className="space-y-8 max-w-xl">
            <p className="body-text text-xl text-white/80 leading-relaxed font-light">
               The fundamental templates used to describe <span className="text-plasma-cyan font-bold italic underline underline-offset-8 decoration-plasma-cyan/30">memory and decision logic</span> in the digital universe.
            </p>
            <p className="body-text text-base text-white/50 leading-relaxed text-left">
               Hardware design is built upon a limited set of proven templates. Mastering Verilog means internalizing these patterns until your code directly mirrors the circuit you intend to synthesize.
            </p>

            <div className="space-y-4 pt-4">
                {SNIPPETS.map((item, i) => (
                    <div key={i} className="p-6 rounded-[30px] bg-white/[0.02] border border-white/5 border-l-2 border-l-plasma-cyan/40 group hover:bg-plasma-cyan/5 hover:border-plasma-cyan/20 transition-all">
                        <div className="flex items-center gap-4 mb-2">
                            <item.icon size={16} className="text-plasma-cyan" />
                            <span className="micro-text uppercase tracking-widest text-white/60 font-black">{item.title} // {item.pro}</span>
                        </div>
                        <p className="body-text text-xs opacity-40 group-hover:opacity-60 leading-relaxed">{item.desc}</p>
                    </div>
                ))}
            </div>
          </div>
        </div>

        {/* Right Column: Primitive Interaction Dashboard */}
        <div className="relative h-[720px] w-full rounded-[60px] bg-black border border-white/5 overflow-hidden shadow-2xl p-12 flex flex-col">
            <div className="absolute top-10 left-10 micro-text opacity-40 tracking-[0.3em] font-black uppercase flex items-center gap-3">
                <Binary size={14} className="text-plasma-cyan" /> Implementation Paradigm Analyzer
            </div>

            <div className="flex-1 flex flex-col justify-center items-center gap-10">
                {/* Paradigm Switch Visualization */}
                <div className="p-12 rounded-[50px] bg-gradient-to-br from-plasma-cyan/5 via-transparent to-transparent border border-plasma-cyan/20 w-full relative overflow-hidden group">
                     <div className="absolute top-10 right-10 p-6 opacity-5 animate-pulse">
                        <Code size={100} strokeWidth={1} />
                     </div>
                     
                     <div className="space-y-8 relative z-10">
                        <div className="space-y-2">
                             <div className="micro-text uppercase text-plasma-cyan font-black tracking-widest text-[9px]">The Core Distinction</div>
                             <h3 className="hero-text text-3xl uppercase text-white tracking-widest leading-none">assign vs always</h3>
                        </div>

                        <div className="grid grid-cols-1 gap-6">
                            <div className="p-8 rounded-[35px] bg-[#0A0A0B] border border-white/5 group-hover:border-plasma-cyan/30 transition-all shadow-inner">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="micro-text text-white/20 uppercase tracking-widest font-black">Immediate Logic // Combinational</div>
                                    <div className="px-3 py-1 rounded-full bg-white/5 text-white/40 micro-text text-[9px] uppercase font-black tracking-widest">Latency: 0ns</div>
                                </div>
                                <code className="mono-text text-xl lg:text-2xl text-plasma-cyan block italic">assign out = data_a & data_b;</code>
                            </div>
                            <div className="p-8 rounded-[35px] bg-[#0A0A0B] border border-white/5 group-hover:border-white/20 transition-all shadow-inner">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="micro-text text-white/20 uppercase tracking-widest font-black">Banked Memory // Sequential</div>
                                    <div className="px-3 py-1 rounded-full bg-plasma-cyan/20 text-plasma-cyan micro-text text-[9px] uppercase font-black tracking-widest">Synced: PosEdge</div>
                                </div>
                                <code className="mono-text text-xl lg:text-2xl text-white opacity-80 block italic">
                                    always @(posedge clk)<br/>
                                    &nbsp;&nbsp;out &lt;= data_in;
                                </code>
                            </div>
                        </div>

                        <div className="flex items-center justify-center gap-6 pt-4 text-center">
                            <div className="space-y-1">
                                <span className="micro-text uppercase tracking-widest text-white font-bold opacity-30">Assign Outcome</span>
                                <p className="body-text text-xs text-white/60 uppercase font-black">Instant Linkage</p>
                            </div>
                            <div className="w-10 h-px bg-white/10" />
                            <div className="space-y-1">
                                <span className="micro-text uppercase tracking-widest text-plasma-cyan font-bold">Always Outcome</span>
                                <p className="body-text text-xs text-plasma-cyan uppercase font-black">Clocked Capture</p>
                            </div>
                        </div>
                     </div>
                </div>

                <div className="w-full flex items-center justify-between p-8 bg-white/[0.02] border border-white/10 rounded-[40px] backdrop-blur-md">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-plasma-cyan/20 text-plasma-cyan flex items-center justify-center shadow-lg shadow-plasma-cyan/20">
                            <Timer size={24} />
                        </div>
                        <div>
                            <div className="micro-text uppercase text-white/60 tracking-widest font-black">Implementation Strategy</div>
                            <div className="body-text text-[10px] opacity-30 italic">Determining RTL cell selection based on timing constraints.</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 px-5 py-2 rounded-2xl bg-white/5 group-hover:bg-plasma-cyan/10 transition-all">
                        <span className="micro-text text-[10px] text-white/40 group-hover:text-plasma-cyan transition-colors font-black uppercase tracking-widest">Explore Cells</span>
                        <ChevronRight size={14} className="text-white/20 group-hover:text-plasma-cyan transition-colors" />
                    </div>
                </div>
            </div>
        </div>
      </div>
    </BlueprintContainer>
  );
};
