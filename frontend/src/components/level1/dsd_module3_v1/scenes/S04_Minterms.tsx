import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sigma, ArrowRight, Plus, Sparkles } from 'lucide-react';

interface Props { isActive: boolean; isDarkMode: boolean; }

const ACTIVE = [
  { m: 3, bits: ['0', '1', '1'], term: ["A'", 'B',  'C']  },
  { m: 4, bits: ['1', '0', '0'], term: ['A',  "B'", "C'"] },
  { m: 5, bits: ['1', '0', '1'], term: ['A',  "B'", 'C']  },
  { m: 6, bits: ['1', '1', '0'], term: ['A',  'B',  "C'"] },
  { m: 7, bits: ['1', '1', '1'], term: ['A',  'B',  'C']  },
];

export const S04_Minterms: React.FC<Props> = ({ isActive, isDarkMode }) => {
  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText   = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg    = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';

  // Sequentially "build" the canonical SOP - adds one minterm at a time
  const [revealCount, setRevealCount] = useState(0);
  useEffect(() => {
    if (!isActive) { setRevealCount(0); return; }
    setRevealCount(0);
    const id = setInterval(() => {
      setRevealCount((c) => {
        if (c >= ACTIVE.length) { clearInterval(id); return c; }
        return c + 1;
      });
    }, 600);
    return () => clearInterval(id);
  }, [isActive]);

  return (
    <div className="max-w-6xl mx-auto space-y-12 py-4">
      <section className="space-y-3">
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.4em] uppercase text-amber-400">
          <Sigma size={14} /> Step 3 · Extract the Math
        </div>
        <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>
          Each active row becomes a product term.
        </h2>
        <p className={`text-base max-w-3xl ${subText}`}>
          The translation rule is mechanical: in a row where F = 1, look at each input. If it is{' '}
          <strong className="text-rose-300">0</strong>, write the variable <strong>primed</strong>{' '}
          (X′). If it is <strong className="text-emerald-300">1</strong>, write it{' '}
          <strong>unprimed</strong> (X). AND them together - that is the minterm.
        </p>
      </section>

      {/* Translation rule - visual */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        className={`p-6 rounded-3xl border ${cardBg} grid sm:grid-cols-2 gap-3`}
      >
        <div className="p-5 rounded-2xl border-2 border-rose-400/40 bg-rose-500/10 flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl grid place-items-center font-mono font-black text-3xl bg-rose-500/30 text-rose-300">0</div>
          <div className="flex-1">
            <div className="font-mono text-[10px] uppercase tracking-widest text-rose-300 mb-1">Bit is 0</div>
            <div className={`text-base font-bold ${textColor}`}>Primed · X<span className="text-rose-300">′</span></div>
          </div>
          <ArrowRight className="text-rose-300" size={20} />
        </div>
        <div className="p-5 rounded-2xl border-2 border-emerald-400/40 bg-emerald-500/10 flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl grid place-items-center font-mono font-black text-3xl bg-emerald-500/30 text-emerald-300">1</div>
          <div className="flex-1">
            <div className="font-mono text-[10px] uppercase tracking-widest text-emerald-300 mb-1">Bit is 1</div>
            <div className={`text-base font-bold ${textColor}`}>Unprimed · X</div>
          </div>
          <ArrowRight className="text-emerald-300" size={20} />
        </div>
      </motion.div>

      {/* Animated translation table */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        className={`p-5 md:p-8 rounded-3xl border ${cardBg}`}
      >
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-amber-400 mb-5 flex items-center gap-2">
          <Sparkles size={12} /> Five active rows · five minterms · animating in
        </div>

        <div className="overflow-x-auto">
        <div className="space-y-2 min-w-[420px] md:min-w-0">
          <div className="grid grid-cols-[60px_repeat(3,52px)_28px_1fr] gap-3 items-center font-mono text-[10px] uppercase tracking-widest opacity-60">
            <span></span>
            <span className="text-center text-orange-300">A</span>
            <span className="text-center text-cyan-300">B</span>
            <span className="text-center text-fuchsia-300">C</span>
            <span></span>
            <span className="text-emerald-300">Minterm</span>
          </div>

          {ACTIVE.map((r, i) => {
            const visible = i < revealCount;
            return (
              <motion.div
                key={r.m}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: visible ? 1 : 0.15, x: 0 }}
                transition={{ duration: 0.4 }}
                className={`grid grid-cols-[60px_repeat(3,52px)_28px_1fr] gap-3 items-center p-3 rounded-xl ${
                  isDarkMode ? 'bg-black/30' : 'bg-slate-50'
                }`}
                style={{
                  boxShadow: visible ? '0 0 20px rgba(251,191,36,0.10)' : 'none',
                }}
              >
                <span className="font-mono text-amber-300 font-black">m{r.m}</span>
                {r.bits.map((b, j) => (
                  <motion.span
                    key={j}
                    initial={{ scale: 1 }}
                    animate={visible ? { scale: [1, 1.25, 1] } : {}}
                    transition={{ delay: 0.05 * j, duration: 0.4 }}
                    className={`text-center font-mono font-black text-base ${
                      b === '1' ? 'text-emerald-300' : 'text-rose-300'
                    }`}
                  >
                    {b}
                  </motion.span>
                ))}
                <motion.div
                  animate={visible ? { x: [0, 6, 0] } : {}}
                  transition={{ delay: 0.2 }}
                >
                  <ArrowRight className="text-amber-400 mx-auto" size={14} />
                </motion.div>
                <motion.span
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={visible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
                  transition={{ delay: 0.3, type: 'spring' }}
                  className={`font-mono text-base font-black ${textColor}`}
                >
                  {r.term.map((part, k) => {
                    const isPrimed = part.includes("'");
                    return (
                      <span key={k} className={isPrimed ? 'text-rose-200' : 'text-emerald-200'}>
                        {part}
                      </span>
                    );
                  })}
                </motion.span>
              </motion.div>
            );
          })}
        </div>
        </div>
      </motion.div>

      {/* Sequential SOP build */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.2 }}
        className={`p-8 rounded-3xl border ${cardBg} space-y-6`}
      >
        <div className="flex items-center gap-3">
          <Plus size={18} className="text-amber-400" />
          <div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-amber-300 mb-1">Sum = OR</div>
            <h3 className={`text-xl font-black ${textColor}`}>Stitch the minterms with OR</h3>
          </div>
        </div>

        <p className={`text-sm ${subText}`}>
          The vault unlocks when <em>any</em> of the five active rows occur. In Boolean algebra
          "any of" is the OR operator (the <code className="text-amber-300">+</code> sign). So we
          OR all five product terms together.
        </p>

        {/* Build the SOP one term at a time */}
        <div className={`rounded-2xl p-6 border-2 border-amber-400 bg-amber-500/10 text-center shadow-[0_0_50px_rgba(251,191,36,0.18)] space-y-4`}>
          <div className="font-mono text-[10px] uppercase tracking-widest text-amber-300">Compact</div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={revealCount >= ACTIVE.length ? { opacity: 1, scale: 1 } : { opacity: 0.3 }}
            transition={{ duration: 0.5 }}
            className={`font-mono text-2xl md:text-3xl font-black ${textColor}`}
          >
            F(A, B, C) = Σm(3, 4, 5, 6, 7)
          </motion.div>

          <div className="h-px w-32 bg-amber-400/40 mx-auto" />

          <div className="font-mono text-[10px] uppercase tracking-widest text-amber-300">Expanded · canonical SOP</div>
          <div className={`font-mono text-base md:text-2xl font-black flex flex-wrap items-center justify-center gap-x-3 gap-y-2 leading-relaxed ${textColor}`}>
            <span className="text-amber-300 font-mono opacity-60 text-xs">F =</span>
            {ACTIVE.map((r, i) => (
              <React.Fragment key={r.m}>
                {i > 0 && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0 }}
                    animate={i < revealCount ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
                    transition={{ delay: i * 0.6, type: 'spring' }}
                    className="text-amber-400"
                  >
                    +
                  </motion.span>
                )}
                <motion.span
                  initial={{ opacity: 0, y: 12 }}
                  animate={i < revealCount ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
                  transition={{ delay: i * 0.6, type: 'spring' }}
                >
                  {r.term.map((part, k) => {
                    const isPrimed = part.includes("'");
                    return (
                      <span key={k} className={isPrimed ? 'text-rose-200' : 'text-emerald-200'}>
                        {part}
                      </span>
                    );
                  })}
                </motion.span>
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Cost preview */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={revealCount >= ACTIVE.length ? { opacity: 1 } : { opacity: 0.3 }}
          className={`p-5 rounded-2xl border border-amber-400/30 bg-amber-500/5`}
        >
          <div className="font-mono text-[10px] uppercase tracking-widest text-amber-300 mb-2">Cost of building this directly</div>
          <p className={`text-sm ${subText}`}>
            5 product terms × 3 inputs = <strong className={textColor}>15 literals</strong>. Five
            three-input AND gates plus one five-input OR ={' '}
            <strong className="text-rose-300">6 gates</strong>. It works - but it is wasteful.
            Step 4 collapses this with a Karnaugh Map.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};
