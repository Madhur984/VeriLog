import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Zap, Cpu, Brain, Flame, Skull, Check, X, ShieldCheck } from 'lucide-react';

interface Props { isActive: boolean; isDarkMode: boolean; }

const TRAPS = [
  {
    id: 'parity',
    title: 'The Parity Illusion',
    q: "F = Σm(1,3,5,7). An intern says we need 4 AND gates and 1 OR gate. Are they right?",
    options: [
      "Yes - it's a standard 4-minterm SOP",
      "No - it simplifies to a single wire (Z)",
      "No - it needs a 3-input XOR gate"
    ],
    ans: 1,
    failureMsg: "SYSTEM OVER-ENGINEERED: You just wasted 5 gates on a single wire. Look at the pattern!",
    successMsg: "ELITE LEVEL: You recognized the Z-variable identity. Zero gates required.",
    hint: "Look at the Z column in the truth table for these minterms."
  },
  {
    id: 'equivalence',
    title: 'The Mirror Trap',
    q: "Can a POS implementation ever be exactly as efficient as an SOP for the same table?",
    options: [
      "Always - they are mathematically identical",
      "Only if the number of 1s and 0s is equal",
      "Never - SOP is always better for CMOS"
    ],
    ans: 1,
    failureMsg: "LOGIC FLAW: Efficiency is driven by term count. If 1s == 0s, both forms use the same area.",
    successMsg: "Correct. Balanced tables yield equal gate counts for both canonical forms.",
    hint: "Count the gates: (N minterms + 1) vs (M maxterms + 1)."
  }
];

export const S12_StrategyChallenge: React.FC<Props> = ({ isActive, isDarkMode }) => {
  const [activeTrap, setActiveTrap] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [status, setStatus] = useState<'idle' | 'success' | 'fail'>('idle');

  const trap = TRAPS[activeTrap];
  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText = isDarkMode ? 'text-slate-300' : 'text-slate-600';

  const handleSelect = (idx: number) => {
    setSelected(idx);
    setStatus(idx === trap.ans ? 'success' : 'fail');
  };

  const next = () => {
    if (activeTrap < TRAPS.length - 1) {
      setActiveTrap(activeTrap + 1);
      setSelected(null);
      setStatus('idle');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 py-8">
      <section className="text-center space-y-4">
        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-500 font-mono text-[10px] uppercase font-black tracking-[0.3em] animate-pulse">
          <ShieldAlert size={14} />
          High-Pressure Strategy Challenge
        </div>
        <h2 className={`text-4xl md:text-6xl font-black ${textColor}`}>
          The Engineering Trap
        </h2>
        <p className={`text-lg ${subText} max-w-2xl mx-auto`}>
          In the real world, "correct" isn't enough. You must be <strong>optimal</strong>. 
          Can you spot the shortcuts that canonical forms hide?
        </p>
      </section>

      <div className="relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTrap}
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.1 }}
            className={`p-10 rounded-[3rem] border-4 transition-all duration-500 ${
              status === 'success' ? 'bg-emerald-500/10 border-emerald-500' : 
              status === 'fail' ? 'bg-rose-500/10 border-rose-500 animate-shake' : 
              (isDarkMode ? 'bg-white/5 border-white/10 shadow-2xl' : 'bg-white border-slate-200 shadow-2xl')
            }`}
          >
            <div className="flex items-center justify-between mb-10">
               <div className="flex items-center gap-4">
                 <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${status === 'fail' ? 'bg-rose-500' : 'bg-fuchsia-500'} text-white shadow-lg`}>
                    {status === 'fail' ? <Skull size={24} /> : <Brain size={24} />}
                 </div>
                 <div>
                    <div className="font-mono text-[10px] uppercase tracking-widest opacity-40">Challenge {activeTrap + 1} of {TRAPS.length}</div>
                    <h3 className={`text-xl font-black ${textColor}`}>{trap.title}</h3>
                 </div>
               </div>
               
               <div className="flex gap-2">
                  <div className={`w-2 h-2 rounded-full ${activeTrap >= 0 ? 'bg-fuchsia-500' : 'bg-white/10'}`} />
                  <div className={`w-2 h-2 rounded-full ${activeTrap >= 1 ? 'bg-fuchsia-500' : 'bg-white/10'}`} />
               </div>
            </div>

            <p className={`text-2xl font-black mb-10 leading-tight ${textColor}`}>
              "{trap.q}"
            </p>

            <div className="grid gap-4">
              {trap.options.map((opt, i) => (
                <button
                  key={i}
                  disabled={status !== 'idle'}
                  onClick={() => handleSelect(i)}
                  className={`p-6 rounded-2xl border-2 text-left font-bold transition-all flex items-center justify-between group ${
                    selected === i
                      ? (status === 'success' ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-rose-500/20 border-rose-500 text-rose-400')
                      : `border-transparent hover:border-white/20 ${isDarkMode ? 'bg-white/5' : 'bg-slate-50'}`
                  }`}
                >
                  <span className="flex items-center gap-4">
                    <span className="w-8 h-8 rounded-lg bg-black/20 flex items-center justify-center text-[10px] font-mono group-hover:bg-fuchsia-500 transition-colors">0{i+1}</span>
                    {opt}
                  </span>
                  {selected === i && (status === 'success' ? <Check size={20} /> : <X size={20} />)}
                </button>
              ))}
            </div>

            <AnimatePresence>
              {status !== 'idle' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  className={`mt-10 p-6 rounded-2xl border-2 ${status === 'success' ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-rose-500/10 border-rose-500/30'}`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-2 rounded-xl ${status === 'success' ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'}`}>
                      {status === 'success' ? <Check size={18} /> : <Skull size={18} />}
                    </div>
                    <div>
                      <div className={`text-[10px] font-mono uppercase tracking-widest mb-1 ${status === 'success' ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {status === 'success' ? 'Architect Grade Response' : 'System Failure'}
                      </div>
                      <p className={`text-sm font-bold ${textColor}`}>
                        {status === 'success' ? trap.successMsg : trap.failureMsg}
                      </p>
                      <div className="mt-4 flex items-center gap-2 text-[10px] font-mono opacity-40 uppercase tracking-tighter">
                         <Zap size={10} /> {trap.hint}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {status !== 'idle' && (
              <button
                onClick={activeTrap === TRAPS.length - 1 ? () => {} : next}
                className="mt-8 w-full py-5 bg-white text-black rounded-2xl font-black uppercase tracking-[0.2em] shadow-2xl transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3"
              >
                {activeTrap === TRAPS.length - 1 ? 'Final Evaluation Ready' : 'Next Strategy Phase'}
                <Zap size={18} className="fill-current" />
              </button>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {[
          { l: 'Budget Strain', v: '98%', c: 'text-rose-400' },
          { l: 'Logic Density', v: 'High', c: 'text-amber-400' },
          { l: 'Pattern Sync', v: 'Active', c: 'text-emerald-400' },
        ].map((item, i) => (
          <div key={i} className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200'} text-center`}>
            <div className="text-[9px] font-mono uppercase tracking-widest opacity-40 mb-1">{item.l}</div>
            <div className={`text-lg font-black ${item.c}`}>{item.v}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
