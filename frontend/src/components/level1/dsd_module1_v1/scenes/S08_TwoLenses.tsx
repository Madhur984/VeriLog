import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, ArrowLeftRight, CheckCircle2 } from 'lucide-react';

interface Props { isActive: boolean; isDarkMode: boolean; }

const evalSOP = (R: number, A: number, W: number) => {
  const m = (r: number, a: number, w: number) => Number(r === R && a === A && w === W);
  return m(0,0,0) | m(0,0,1) | m(0,1,0) | m(1,0,0);
};
const evalPOS = (R: number, A: number, W: number) => {
  const M = (r: number, a: number, w: number) => Number(!(r === R && a === A && w === W));
  return M(0,1,1) & M(1,0,1) & M(1,1,0) & M(1,1,1);
};

export const S08_TwoLenses: React.FC<Props> = ({ isActive, isDarkMode }) => {
  const [trial, setTrial] = useState({ R: 1, A: 0, W: 1 });

  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';

  const sopE = evalSOP(trial.R, trial.A, trial.W);
  const posE = evalPOS(trial.R, trial.A, trial.W);
  const truth = (trial.R + trial.A + trial.W) <= 1 ? 1 : 0;
  const allMatch = sopE === posE && posE === truth;

  return (
    <div className="max-w-6xl mx-auto space-y-12 py-4">
      <section className="space-y-3">
        <div className="font-mono text-[10px] tracking-[0.4em] uppercase text-fuchsia-400">
          Chapter 08 · The Bridge
        </div>
        <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>
          Two Lenses, One Logical Truth
        </h2>
        <p className={`text-base max-w-3xl ${subText}`}>
          Painting the happy paths and bricking up the obstacles describe the <em>same</em>{' '}
          function. Σm(0, 1, 2, 4) ≡ ΠM(3, 5, 6, 7). DeMorgan&apos;s law is the bridge: the inverse
          of a specific joy is a specific disaster.
        </p>
      </section>

      {/* Sketchbook references — blueprint matrix + the two-lens equality */}
      <div className="grid md:grid-cols-2 gap-5">
        <div className="rounded-3xl overflow-hidden border border-white/10" style={{ background: '#fef9f0' }}>
          <img src="/images/sketchbook/p10.webp" alt="The Blueprint Matrix — SOP vs POS comparison" className="w-full block" />
          <div className="px-4 py-2 text-[10px] font-mono uppercase tracking-widest text-slate-700 bg-white/60">
            Sketchbook · the blueprint matrix
          </div>
        </div>
        <div className="rounded-3xl overflow-hidden border border-white/10" style={{ background: '#fef9f0' }}>
          <img src="/images/sketchbook/p11.webp" alt="Two lenses, one logical truth" className="w-full block" />
          <div className="px-4 py-2 text-[10px] font-mono uppercase tracking-widest text-slate-700 bg-white/60">
            Sketchbook · paint the 1s = brick the 0s
          </div>
        </div>
      </div>

      {/* Blueprint Matrix */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        className={`rounded-3xl border overflow-hidden ${cardBg}`}
      >
        <table className="w-full font-mono text-sm">
          <thead>
            <tr className={isDarkMode ? 'bg-white/5' : 'bg-slate-50'}>
              <th className="px-5 py-4 text-left font-black uppercase text-[10px] tracking-widest opacity-50">Dimension</th>
              <th className="px-5 py-4 text-left font-black uppercase text-[10px] tracking-widest text-emerald-400">Minterms (SOP)</th>
              <th className="px-5 py-4 text-left font-black uppercase text-[10px] tracking-widest text-rose-400">Maxterms (POS)</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['Philosophy',     'Seek joy (the optimist)',     'Avoid disaster (the pessimist)'],
              ['Target states',  '1s',                          '0s'],
              ['Notation',       'Lowercase  m',                'Uppercase  M'],
              ['Term structure', 'Product (AND  /  ·)',         'Sum (OR  /  +)'],
              ['Variable map',   '0 → X′,   1 → X',             '0 → X,   1 → X′'],
              ['Circuit meta',   'Gather specific combinations','Filter out specific failures'],
            ].map(([dim, sop, pos], i) => (
              <tr key={i} className={`border-t ${isDarkMode ? 'border-white/5' : 'border-slate-100'}`}>
                <td className={`px-5 py-3 font-black ${textColor}`}>{dim}</td>
                <td className="px-5 py-3 text-emerald-300">{sop}</td>
                <td className="px-5 py-3 text-rose-300">{pos}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>

      {/* Live equivalence verifier */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.3 }}
        className={`p-8 rounded-3xl border ${cardBg}`}
      >
        <div className="flex items-center gap-2 mb-6">
          <Eye size={14} className="text-fuchsia-400" />
          <span className="font-mono text-[10px] uppercase tracking-widest text-fuchsia-400">
            Live equivalence — pick any input, both lenses must agree
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3 mb-8">
          {(['R', 'A', 'W'] as const).map(name => (
            <div key={name} className="flex items-center gap-2">
              <span className={`font-mono text-xs font-black ${textColor}`}>{name} =</span>
              <button
                onClick={() => setTrial(t => ({ ...t, [name]: 1 - t[name] }))}
                className={`w-12 h-12 rounded-xl font-mono text-2xl font-black border-2 transition-all ${
                  trial[name] === 1
                    ? 'bg-fuchsia-500/20 border-fuchsia-400 text-fuchsia-300'
                    : 'bg-white/5 border-white/20 text-slate-400'
                }`}
              >
                {trial[name]}
              </button>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {/* SOP eval */}
          <div className={`p-5 rounded-2xl border ${
            isDarkMode ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-emerald-50 border-emerald-300'
          }`}>
            <div className="font-mono text-[10px] uppercase tracking-widest text-emerald-400 mb-2">
              Σm(0, 1, 2, 4)
            </div>
            <div className={`text-xs ${subText} mb-3`}>Does any minterm match?</div>
            <div className="text-5xl font-black text-emerald-400">{sopE}</div>
          </div>

          {/* Bridge */}
          <div className="flex flex-col items-center justify-center gap-3">
            <ArrowLeftRight size={32} className="text-fuchsia-400" />
            <div className={`font-mono text-[10px] uppercase tracking-widest text-center ${
              allMatch ? 'text-emerald-400' : 'text-rose-400'
            }`}>
              {allMatch ? 'Both lenses agree' : 'Mismatch — investigate!'}
            </div>
            <div className={`text-[10px] text-center ${subText}`}>
              Truth-table answer: <strong>{truth}</strong>
            </div>
          </div>

          {/* POS eval */}
          <div className={`p-5 rounded-2xl border ${
            isDarkMode ? 'bg-amber-500/10 border-amber-500/30' : 'bg-amber-50 border-amber-300'
          }`}>
            <div className="font-mono text-[10px] uppercase tracking-widest text-amber-400 mb-2">
              ΠM(3, 5, 6, 7)
            </div>
            <div className={`text-xs ${subText} mb-3`}>Do all barricades hold?</div>
            <div className="text-5xl font-black text-amber-400">{posE}</div>
          </div>
        </div>

        <div className={`mt-6 p-4 rounded-2xl flex items-start gap-3 ${
          isDarkMode ? 'bg-white/5' : 'bg-slate-50'
        }`}>
          <CheckCircle2 size={18} className="text-emerald-400 mt-0.5 shrink-0" />
          <p className={`text-sm leading-relaxed ${subText}`}>
            <strong>DeMorgan&apos;s bridge:</strong>{' '}
            <span className="font-mono">(m<sub>i</sub>)&apos; = M<sub>i</sub></span> — the
            complement of a single minterm <em>is</em> the corresponding maxterm. Apply DeMorgan
            to every term of one canonical form and you obtain the other.
          </p>
        </div>
      </motion.div>

      {/* DeMorgan step-by-step proof */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.4 }}
        className={`p-8 rounded-3xl border ${cardBg}`}
      >
        <div className="flex items-center gap-2 mb-6">
          <span className="font-mono text-[10px] uppercase tracking-widest text-fuchsia-400">
            DeMorgan applied · step-by-step transformation
          </span>
        </div>
        <p className={`text-sm mb-6 ${subText}`}>
          Watch a minterm become its corresponding maxterm by complementing once and applying
          DeMorgan&apos;s laws. We&apos;ll use <span className="font-mono">m5 = R · A′ · W</span>{' '}
          as the worked example.
        </p>
        <ol className="space-y-3">
          {[
            { step: 'Start with the minterm.',                                  expr: 'm5 = R · A′ · W' },
            { step: "Complement both sides — we want (m5)′.",                   expr: '(m5)′ = (R · A′ · W)′' },
            { step: "DeMorgan I: (X · Y · Z)′ = X′ + Y′ + Z′.",                 expr: '(m5)′ = R′ + (A′)′ + W′' },
            { step: 'Double negation: (A′)′ = A.',                              expr: '(m5)′ = R′ + A + W′' },
            { step: 'This is exactly the maxterm M5 from the row R=1, A=0, W=1.', expr: 'M5 = R′ + A + W′  ✓' },
          ].map((s, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * i }}
              className={`flex items-start gap-4 p-4 rounded-2xl ${
                isDarkMode ? 'bg-black/30 border border-white/5' : 'bg-slate-50 border border-slate-200'
              }`}
            >
              <span className="font-mono text-2xl font-black text-fuchsia-400/60 w-8 shrink-0">{i + 1}</span>
              <div className="flex-1">
                <div className={`text-[13px] mb-2 ${textColor}`}>{s.step}</div>
                <div className="font-mono text-base md:text-lg font-black text-fuchsia-400">{s.expr}</div>
              </div>
            </motion.li>
          ))}
        </ol>
        <div className={`mt-5 p-4 rounded-2xl ${
          isDarkMode ? 'bg-fuchsia-500/10 border border-fuchsia-400/30' : 'bg-fuchsia-50 border border-fuchsia-300'
        }`}>
          <p className={`text-sm leading-relaxed ${textColor}`}>
            <strong>Generalisation:</strong> for any function F, taking the complement of the
            full SOP form and applying DeMorgan once at the outer OR, then again at each inner
            AND, produces the POS form of F. The two canonical forms are mechanical inversions
            of each other.
          </p>
        </div>
      </motion.div>
    </div>
  );
};
