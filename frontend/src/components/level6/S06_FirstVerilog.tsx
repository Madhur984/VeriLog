import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code, Boxes, Shield, Eye, Cpu, ChevronRight, Terminal, Binary } from 'lucide-react';
import { BlueprintContainer } from './common/BlueprintContainer';
import { HeroText } from './common/HeroText';

const COMPARISON_DATA = [
    {
        id: 'module',
        label: 'The Module',
        code: `module full_adder (...);\n  // Physical Pins\nendmodule`,
        desc: 'Port declarations define the exact physical contact pins on the silicon die.',
        pro: 'Structural Port'
    },
    {
        id: 'structural',
        label: 'The Gates',
        code: `xor g1 (sum, a, b);\nand g2 (carry, a, b);`,
        desc: 'Direct listing of primitive logic gates that will be mapped into copper wires.',
        pro: 'Gate Prime'
    },
    {
        id: 'concurrent',
        label: 'The Wire',
        code: `assign y = a & b;`,
        desc: 'The continuous assignment. It never "runs"; it simply exists constantly.',
        pro: 'Static Connect'
    }
];

export const S06_FirstVerilog: React.FC<{ isActive: boolean }> = ({ isActive }) => {
  const [active, setActive] = useState(0);

  return (
    <BlueprintContainer>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-24 items-start w-full">
        {/* Left Column: Narrative Sidebar */}
        <div className="space-y-10 sticky top-24">
          <div className="space-y-4">
             <div className="micro-text uppercase tracking-[0.4em] text-plasma-cyan font-black opacity-60 flex items-center gap-2">
                <Binary size={14} /> RTL Foundations
             </div>
             <HeroText className="text-left leading-none" color="text-white">Structural <br/><span className="text-plasma-cyan">Syntax.</span></HeroText>
          </div>
          
          <div className="space-y-8 max-w-xl">
            <p className="body-text text-xl text-white/80 leading-relaxed font-light">
              Verilog syntax is the mathematical mirror of <span className="text-plasma-cyan font-bold italic underline underline-offset-8 decoration-plasma-cyan/30">physical silicon.</span>
            </p>
            <p className="body-text text-base text-white/50 leading-relaxed">
               Every line of code represents a structural existence, not a temporary action. You are not writing a script; you are describing the permanent arrangement of atoms.
            </p>

            <div className="flex flex-col gap-3 pt-4">
                {COMPARISON_DATA.map((item, i) => (
                    <button 
                        key={item.id}
                        onClick={() => setActive(i)}
                        className={`flex items-center gap-6 p-6 rounded-[30px] border transition-all duration-500 text-left group ${active === i ? 'bg-plasma-cyan/10 border-plasma-cyan/40 scale-[1.02]' : 'bg-white/[0.02] border-white/5 opacity-40 hover:opacity-100 hover:bg-white/[0.05]'}`}
                    >
                        <div className={`p-4 rounded-xl border transition-colors ${active === i ? 'bg-plasma-cyan/20 border-plasma-cyan text-plasma-cyan' : 'bg-black border-white/5 text-white/30'}`}>
                            {active === i ? <Eye size={20} /> : <Code size={20} />}
                        </div>
                        <div className="flex-1">
                            <div className="micro-text uppercase tracking-widest font-black opacity-40 mb-0.5">Pillar 0{i + 1} // {item.pro}</div>
                            <div className="hero-text text-xl uppercase tracking-tighter text-white">{item.label}</div>
                        </div>
                        {active === i && <ChevronRight size={20} className="text-plasma-cyan animate-pulse" />}
                    </button>
                ))}
            </div>
          </div>
        </div>

        {/* Right Column: Protocol Inspector Dashboard */}
        <div className="relative h-[720px] w-full rounded-[60px] bg-black border border-white/5 overflow-hidden shadow-2xl p-12 flex flex-col">
            <div className="absolute top-10 left-10 micro-text opacity-40 tracking-[0.3em] font-black uppercase flex items-center gap-3">
                <Terminal size={14} className="text-plasma-cyan" /> Protocol Syntax Inspector
            </div>

            <div className="flex-1 flex flex-col justify-center gap-12">
                <AnimatePresence mode="wait">
                    <motion.div 
                        key={active}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-12"
                    >
                        <div className="p-10 rounded-[40px] bg-[#0A0A0B] border border-white/5 relative group overflow-hidden">
                             <div className="absolute top-0 right-0 p-6 opacity-5 rotate-12 group-hover:rotate-0 transition-transform duration-700">
                                <Cpu size={120} strokeWidth={1} />
                             </div>
                             <code className="text-plasma-cyan font-mono text-xl lg:text-2xl leading-relaxed block relative z-10 whitespace-pre-line">
                                {COMPARISON_DATA[active].code}
                             </code>
                             <div className="mt-8 flex justify-between items-center opacity-40">
                                <div className="micro-text uppercase tracking-widest">Compiler Target: SILICON_v1</div>
                                <div className="w-12 h-1 bg-plasma-cyan/20 rounded-full" />
                             </div>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-xl bg-plasma-cyan/20 text-plasma-cyan">
                                    <Shield size={20} />
                                </div>
                                <h3 className="hero-text text-2xl uppercase tracking-widest text-white">Structural Verity</h3>
                            </div>
                            <p className="body-text text-2xl text-white/80 font-light leading-snug">
                                "{COMPARISON_DATA[active].desc}"
                            </p>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            <div className="mt-auto flex items-center justify-between p-6 bg-white/[0.02] border border-white/10 rounded-3xl backdrop-blur-md">
                <div className="flex items-center gap-4">
                    <Boxes size={20} className="text-plasma-cyan" />
                    <div>
                        <div className="micro-text uppercase text-white/60 tracking-widest font-black">Spatial Alignment</div>
                        <div className="body-text text-[10px] opacity-30">Verifying code-to-cell mapping protocol accuracy.</div>
                    </div>
                </div>
                <div className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                        <div key={i} className={`w-4 h-1 rounded-full ${active === i ? 'bg-plasma-cyan shadow-cyan-glow' : 'bg-white/10'}`} />
                    ))}
                </div>
            </div>
        </div>
      </div>
    </BlueprintContainer>
  );
};
