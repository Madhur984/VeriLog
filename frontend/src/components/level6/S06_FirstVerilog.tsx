import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code, Boxes, Shield, Eye, Cpu, ChevronRight, Terminal, Binary, Database, Share2 } from 'lucide-react';
import { BlueprintContainer } from './common/BlueprintContainer';
import { HeroText } from './common/HeroText';

const COMPARISON_DATA = [
    {
        id: 'module',
        label: 'The Module',
        code: `module full_adder (...);\n  // Physical Contact Nodes\nendmodule`,
        desc: 'Port declarations define the exact physical contact pins on the silicon die surfaces.',
        pro: 'Structural Port',
        met: 'P_PIN_COUNT: 48'
    },
    {
        id: 'structural',
        label: 'The Gates',
        code: `xor g1 (sum, a, b);\nand g2 (carry, a, b);`,
        desc: 'Direct listing of primitive logic gates that will be mapped into copper wires and atoms.',
        pro: 'Gate Prime',
        met: 'GATE_DELAY: 0.1ns'
    },
    {
        id: 'concurrent',
        label: 'The Wire',
        code: `assign y = a & b;`,
        desc: 'The continuous assignment. It never "runs"; it exists constantly as a permanent path.',
        pro: 'Static Connect',
        met: 'WIRE_CAP: 0.02fF'
    }
];

export const S06_FirstVerilog: React.FC<{ isActive: boolean }> = ({ isActive }) => {
  const [active, setActive] = useState(0);

  return (
    <BlueprintContainer>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-24 items-start w-full text-left">
        {/* Left Column: Narrative Sidebar */}
        <div className="space-y-10 sticky top-24">
          <div className="space-y-4">
             <div className="micro-text uppercase tracking-[0.4em] text-plasma-cyan font-black opacity-60 flex items-center gap-2 text-[10px]">
                <Binary size={14} /> RTL Foundations // CORE_PROTOCOL
             </div>
             <HeroText className="text-left leading-none" color="text-white">Structural <br/><span className="text-plasma-cyan uppercase tracking-tighter">Syntax.</span></HeroText>
          </div>
          
          <div className="space-y-8 max-w-xl">
            <p className="body-text text-xl text-white/80 leading-relaxed font-light">
              Verilog syntax is the mathematical mirror of <span className="text-plasma-cyan font-bold italic underline underline-offset-8 decoration-plasma-cyan/30 uppercase tracking-widest text-sm">Physical Silicon.</span>
            </p>
            <p className="body-text text-base text-white/50 leading-relaxed font-light">
               Every line of code represents a structural existence, not an action. You are not writing a script; you are defining atoms in space.
            </p>

            <div className="flex flex-col gap-2 pt-4">
                {COMPARISON_DATA.map((item, i) => (
                    <button 
                        key={item.id}
                        onClick={() => setActive(i)}
                        className={`flex items-center gap-5 p-5 rounded-[35px] border transition-all duration-500 text-left group relative overflow-hidden ${active === i ? 'bg-[#0A0A0B] border-plasma-cyan/40 scale-[1.02] shadow-xl' : 'bg-transparent border-white/5 opacity-40 hover:opacity-100 hover:bg-white/[0.02]'}`}
                    >
                        <div className={`p-3.5 rounded-[18px] border transition-colors ${active === i ? 'bg-plasma-cyan/10 border-plasma-cyan text-plasma-cyan' : 'bg-white/5 border-white/5 text-white/30'}`}>
                            {active === i ? <Eye size={18} /> : <Code size={18} />}
                        </div>
                        <div className="flex-1">
                            <div className="micro-text uppercase tracking-widest font-black opacity-40 text-[8px] mb-0.5">Pillar 0{i + 1} // {item.pro}</div>
                            <div className="hero-text text-lg uppercase tracking-tight text-white">{item.label}</div>
                        </div>
                        {active === i && <div className="w-1.5 h-1.5 rounded-full bg-plasma-cyan animate-pulse shadow-cyan-glow" />}
                    </button>
                ))}
            </div>
          </div>
        </div>

        {/* Right Column: Protocol Inspector Dashboard */}
        <div className="relative h-[720px] w-full rounded-[60px] bg-black border border-white/5 overflow-hidden shadow-2xl p-12 flex flex-col">
            <div className="absolute top-10 left-10 micro-text opacity-40 tracking-[0.3em] font-black uppercase flex items-center gap-3 text-[10px]">
                <Terminal size={14} className="text-plasma-cyan" /> Protocol Syntax Inspector // RTL_MAP
            </div>

            <div className="flex-1 flex flex-col justify-center gap-12">
                <AnimatePresence mode="wait">
                    <motion.div 
                        key={active}
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.02 }}
                        className="space-y-12 w-full"
                    >
                        <div className="p-10 rounded-[45px] bg-[#0A0A0B] border border-white/5 relative group overflow-hidden shadow-2xl">
                             <div className="absolute top-0 right-0 p-8 opacity-[0.03] rotate-12 group-hover:rotate-0 transition-transform duration-1000">
                                <Cpu size={160} strokeWidth={1} />
                             </div>
                             <code className="text-plasma-cyan font-mono text-[16px] lg:text-[18px] leading-relaxed block relative z-10 whitespace-pre-line text-left">
                                <span className="opacity-40">// Analysis: {COMPARISON_DATA[active].pro}</span><br/><br/>
                                {COMPARISON_DATA[active].code}
                             </code>
                             <div className="mt-10 flex justify-between items-center border-t border-white/5 pt-6">
                                <div className="micro-text uppercase tracking-widest opacity-30 text-[9px]">Target Architecture: TSMC_SIL_1</div>
                                <div className="flex gap-2">
                                    <div className="w-2 h-2 rounded-full bg-plasma-cyan animate-pulse" />
                                    <div className="w-2 h-2 rounded-full bg-plasma-cyan/40" />
                                    <div className="w-2 h-2 rounded-full bg-plasma-cyan/20" />
                                </div>
                             </div>
                        </div>

                        <div className="space-y-6 text-left px-4">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-2xl bg-plasma-cyan/10 border border-plasma-cyan/20 text-plasma-cyan shadow-cyan-glow">
                                    <Shield size={22} />
                                </div>
                                <div>
                                    <h3 className="hero-text text-2xl uppercase tracking-widest text-white leading-none">Structural Verity</h3>
                                    <div className="micro-text uppercase text-plasma-cyan/40 text-[9px] font-black tracking-widest">Diagnostic Meta // {COMPARISON_DATA[active].met}</div>
                                </div>
                            </div>
                            <p className="body-text text-xl text-white/50 font-light leading-relaxed max-w-2xl italic px-2">
                                "{COMPARISON_DATA[active].desc}"
                            </p>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            <div className="mt-auto flex items-center justify-between p-8 bg-white/[0.02] border border-white/10 rounded-[40px] backdrop-blur-md">
                <div className="flex items-center gap-6">
                    <div className="w-12 h-12 rounded-[15px] border border-plasma-cyan/30 flex items-center justify-center text-plasma-cyan shadow-xl">
                        <Boxes size={22} />
                    </div>
                    <div className="text-left">
                        <div className="micro-text uppercase text-white/40 tracking-widest font-black text-[9px]">Spatial Alignment</div>
                        <div className="hero-text text-xs uppercase text-white tracking-[0.2em]">Verifying code-to-cell mapping accuracy.</div>
                    </div>
                </div>
                <div className="flex gap-4">
                    <div className="p-3 rounded-2xl bg-white/5 border border-white/5 text-white/40">
                         <Share2 size={18} />
                    </div>
                    <div className="p-3 rounded-2xl bg-white/5 border border-white/5 text-white/40">
                         <Database size={18} />
                    </div>
                </div>
            </div>

            {/* Background Texture Overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.02] mix-blend-overlay">
                <div className="text-[320px] hero-text uppercase rotate-12 -translate-x-20 select-none">CODE</div>
            </div>
        </div>
      </div>
    </BlueprintContainer>
  );
};
