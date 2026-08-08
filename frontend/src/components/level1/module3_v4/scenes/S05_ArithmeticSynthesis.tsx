import React from 'react';
import { motion } from 'framer-motion';
import { Calculator, Zap, Cpu } from 'lucide-react';
import { SceneArithmetic } from '../../../level3/SceneArithmetic';

interface Props {
  isActive: boolean;
  isDarkMode: boolean;
}

/**
 * S05_ArithmeticSynthesis
 * Synthesis of logic into mathematics. 
 * Reuses the high-fidelity SceneArithmetic lab component but wraps it in the new architecture.
 */
export const S05_ArithmeticSynthesis: React.FC<Props> = ({ isActive, isDarkMode }) => {
    const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
    const subTextColor = isDarkMode ? 'text-sky-400' : 'text-sky-600';

    return (
        <div className="max-w-5xl mx-auto space-y-16 py-12">
      {/* 6. Arithmetic Synthesis -- Logic is Mathematics */}
      <section className="space-y-8">
        <div className="text-center space-y-4">
            <motion.span 
                initial={{ opacity: 0 }}
                animate={isActive ? { opacity: 1 } : {}}
                className={`font-mono text-[10px] tracking-[0.4em] uppercase ${subTextColor} block mb-4`}
            >
                6. Building Arithmetic -- Logic is Mathematics
            </motion.span>
            <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>The Adder Evolution</h2>
            <p className={`text-lg max-w-2xl mx-auto opacity-70 ${textColor}`}>
                How we combine gates to perform physical addition. It starts with the <strong>Half-Adder</strong>.
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Half Adder */}
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={isActive ? { opacity: 1, scale: 1 } : {}}
                className={`p-8 rounded-3xl border ${isDarkMode ? 'bg-black/40 border-white/10' : 'bg-white border-gray-100 shadow-xl'}`}
            >
                <div className="flex justify-between items-start mb-6">
                    <h3 className={`font-black text-xl ${textColor}`}>1. The Half-Adder</h3>
                    <div className="px-3 py-1 rounded-full bg-sky-500/10 text-sky-500 font-mono text-[10px] font-black">2 INPUTS</div>
                </div>
                <p className="text-sm opacity-70 mb-6 leading-relaxed">
                    Adds two bits. Produces a <strong>Sum</strong> and a <strong>Carry</strong>. It cannot handle a carry from a previous stage.
                </p>
                <div className={`p-4 rounded-xl font-mono text-[10px] mb-6 ${isDarkMode ? 'bg-black/60 text-sky-400' : 'bg-gray-50 text-sky-600'}`}>
{`A (1) [ XOR ] Sum (0)
        
B (1) [ AND ] Carry (1)
`}
                </div>
                <div className="space-y-1.5 text-xs font-mono font-bold text-sky-400">
                    <div>Sum &nbsp;&nbsp;= A ⊕ B</div>
                    <div>Carry = A · B</div>
                </div>
            </motion.div>

            {/* Full Adder */}
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={isActive ? { opacity: 1, scale: 1 } : {}}
                className={`p-8 rounded-3xl border ${isDarkMode ? 'bg-sky-500/5 border-sky-500/20' : 'bg-sky-50 border-sky-100'}`}
            >
                <div className="flex justify-between items-start mb-6">
                    <h3 className={`font-black text-xl ${textColor}`}>2. The Full-Adder</h3>
                    <div className="px-3 py-1 rounded-full bg-sky-500 text-white font-mono text-[10px] font-black uppercase">Recursive</div>
                </div>
                <p className="text-sm opacity-70 mb-6 leading-relaxed">
                    The basic building block. Adds two bits <strong>plus</strong> a carry-in from the previous bit.
                </p>
                <div className={`p-4 rounded-xl font-mono text-[10px] mb-6 ${isDarkMode ? 'bg-black/60 text-white' : 'bg-white border border-sky-100 shadow-sm'}`}>
{`A   
B    [ 2x Half-Adders ]  Sum
Cin          + OR          Cout
`}
                </div>
                <div className="space-y-1.5 text-xs font-mono font-bold text-sky-400">
                    <div>Sum  = A ⊕ B ⊕ C<sub>in</sub></div>
                    <div>C<sub>out</sub> = (A · B) + (C<sub>in</sub> · (A ⊕ B))</div>
                </div>
            </motion.div>
        </div>
      </section>

      {/* Logic Equations -- The Programmer's View */}
      <section className={`p-8 md:p-12 rounded-[2.5rem] border ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-gray-100 shadow-2xl shadow-sky-500/5'}`}>
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-sky-500 text-white">
                    <Calculator size={24} />
                </div>
                <div>
                    <h3 className={`text-2xl font-black ${textColor}`}>Arithmetic Equations</h3>
                    <p className="text-sm opacity-50">Physical wiring translated to mathematical notation.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                    { label: "Identity", eq: "A · 1 = A", desc: "ANDing with 1 preserves state." },
                    { label: "Null", eq: "A · 0 = 0", desc: "ANDing with 0 destroys state." },
                    { label: "Inverse", eq: "A + Ā = 1", desc: "ORing with inverse is always true." },
                    { label: "Double Negation", eq: "A̿ = A", desc: "Two NOTs cancel out." }
                ].map((item, i) => (
                    <div key={i} className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-black/40 border-white/5' : 'bg-gray-50 border-gray-200'}`}>
                        <div className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-2">{item.label}</div>
                        <div className="text-lg font-mono font-black text-sky-400 mb-2">{item.eq}</div>
                        <p className="text-xs opacity-60 leading-relaxed">{item.desc}</p>
                    </div>
                ))}
            </div>
          </div>
      </section>

      {/* 1 AM Mentor Take */}
      <div className={`p-8 rounded-3xl text-center ${isDarkMode ? 'bg-sky-500/10 border border-sky-500/20' : 'bg-sky-50 border border-sky-100'}`}>
          <p className={`font-mono text-xs font-black mb-4 ${isDarkMode ? 'text-sky-400' : 'text-sky-600'}`}>
              "1 AM Mentor Take"
          </p>
          <p className={`text-lg md:text-xl font-medium italic ${textColor}`}>
              "You don't need a calculator. You need an XOR gate for the sum and an AND gate for the carry. That is the secret recipe for every CPU on the planet."
          </p>
      </div>
    </div>
    );
};
