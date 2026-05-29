import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, ScrollText, Zap } from 'lucide-react';

interface Props { isActive: boolean; isDarkMode: boolean; }

const TRUTH_TABLE = Array.from({ length: 16 }, (_, i) => {
  const A = (i >> 3) & 1;
  const B = (i >> 2) & 1;
  const C = (i >> 1) & 1;
  const D = i & 1;
  // F = AB + C'D + AD'  (a deliberately ugly function so chaos shows)
  const F = ((A & B) | ((1 - C) & D) | (A & (1 - D))) & 1;
  return { i, A, B, C, D, F };
});

const ALG_STEPS = [
  'F = A·B + C′·D + A·D′',
  '  = A·B·(C+C′)·(D+D′) + (A+A′)·C′·D + A·(B+B′)·D′',
  '  = ABCD + ABCD′ + ABC′D + ABC′D′ + AC′D + A′C′D + ABD′ + AB′D′',
  '  = (ABCD + ABCD′) + (ABC′D + ABC′D′) + (AC′D + A′C′D) + (ABD′ + AB′D′)',
  '  = ABC + ABC′ + C′D + AD′',
  '  = AB + C′D + AD′                       ← back where we started 😩',
];

export const S02_TheHeadache: React.FC<Props> = ({ isActive, isDarkMode }) => {
  const [step, setStep] = useState(0);
  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';

  return (
    <div className="max-w-6xl mx-auto space-y-12 py-4">
      <section className="space-y-3">
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.4em] uppercase text-orange-400">
          <AlertTriangle size={14} /> Chapter 02 · The Problem
        </div>
        <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>The 16-Row Headache</h2>
        <p className={`text-base max-w-3xl ${subText}`}>
          For two or three variables, raw Boolean algebra is fine. For <strong>four</strong> variables, the truth
          table balloons to 16 rows and the patterns get buried. You can grind through identities all day and
          still circle back to the same expression.
        </p>
      </section>

      <div className="grid lg:grid-cols-[1fr_1.1fr] gap-8">
        {/* The 16-row truth table */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
          className={`p-6 rounded-3xl border ${cardBg}`}
        >
          <div className="flex items-center gap-2 mb-4">
            <ScrollText size={14} className="text-orange-400" />
            <span className="font-mono text-[10px] uppercase tracking-widest text-orange-400">A 4-variable Truth Table</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm font-mono">
              <thead>
                <tr className="text-amber-300/80">
                  <th className="px-2 py-1 text-left opacity-60">m#</th>
                  <th className="px-2 py-1">A</th>
                  <th className="px-2 py-1">B</th>
                  <th className="px-2 py-1">C</th>
                  <th className="px-2 py-1">D</th>
                  <th className="px-2 py-1">F</th>
                </tr>
              </thead>
              <tbody>
                {TRUTH_TABLE.map((row) => (
                  <tr
                    key={row.i}
                    className={`border-t ${isDarkMode ? 'border-white/5' : 'border-slate-200'} ${
                      row.F ? 'bg-amber-400/5' : ''
                    }`}
                  >
                    <td className="px-2 py-1 text-amber-300/60">{row.i}</td>
                    <td className="px-2 py-1 text-center">{row.A}</td>
                    <td className="px-2 py-1 text-center">{row.B}</td>
                    <td className="px-2 py-1 text-center">{row.C}</td>
                    <td className="px-2 py-1 text-center">{row.D}</td>
                    <td className={`px-2 py-1 text-center font-black ${row.F ? 'text-amber-300' : 'opacity-30'}`}>
                      {row.F}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className={`text-[11px] mt-4 ${subText}`}>
            Highlighted rows are <strong className="text-amber-300">premium guests</strong> - minterms where F = 1.
            Algebra has to stitch them together blindly. Eight 1s feel like noise, not a pattern.
          </p>
        </motion.div>

        {/* The algebra grind */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1 }}
          className={`p-6 rounded-3xl border ${cardBg} space-y-4`}
        >
          <div className="flex items-center gap-2">
            <Zap size={14} className="text-rose-400" />
            <span className="font-mono text-[10px] uppercase tracking-widest text-rose-400">Algebra grind · step by step</span>
          </div>
          <div
            className="rounded-2xl p-6 font-mono text-[13px] leading-relaxed border space-y-3 min-h-[260px]"
            style={{ background: isDarkMode ? '#0a0a0f' : '#fafafa', borderColor: isDarkMode ? '#262626' : '#e4e4e7' }}
          >
            {ALG_STEPS.slice(0, step + 1).map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                className={i === step ? 'text-amber-300' : 'text-slate-400'}
              >
                {line}
              </motion.div>
            ))}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              className={`px-4 py-2 rounded-xl text-[11px] font-mono font-bold border ${
                isDarkMode ? 'border-white/10 hover:bg-white/5' : 'border-slate-200 hover:bg-slate-100'
              }`}
            >
              ← Back
            </button>
            <button
              onClick={() => setStep((s) => Math.min(ALG_STEPS.length - 1, s + 1))}
              className="px-4 py-2 rounded-xl text-[11px] font-mono font-bold bg-amber-400 text-black hover:shadow-lg hover:shadow-amber-500/30"
            >
              Step {step + 1}/{ALG_STEPS.length} →
            </button>
            <button
              onClick={() => setStep(0)}
              className={`ml-auto px-4 py-2 rounded-xl text-[11px] font-mono font-bold border ${
                isDarkMode ? 'border-white/10 hover:bg-white/5' : 'border-slate-200 hover:bg-slate-100'
              }`}
            >
              Reset
            </button>
          </div>
          <p className={`text-[11px] ${subText}`}>
            Six expansion-and-collapse moves to land back on the same starting point. The algebra is correct -
            but it&apos;s blind. There&apos;s no way to <strong>see</strong> which terms group naturally.
          </p>
        </motion.div>
      </div>

      {/* Take-away */}
      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.2 }}
        className={`p-8 rounded-3xl border ${cardBg}`}
      >
        <div className="font-mono text-[10px] uppercase tracking-widest text-amber-400 mb-2">The Diagnosis</div>
        <p className={`text-base leading-relaxed ${textColor}`}>
          Algebra works on <em>symbols</em>. But Boolean simplification is fundamentally a problem of{' '}
          <strong className="text-amber-300">geometry</strong> - which terms differ by exactly one variable so they
          can be merged. Madhur&apos;s next move: <em>turn the table into a floor plan</em>.
        </p>
      </motion.div>
    </div>
  );
};
