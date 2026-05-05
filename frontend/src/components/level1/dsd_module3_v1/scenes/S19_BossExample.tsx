import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, Map, Zap } from 'lucide-react';

interface Props { isActive: boolean; isDarkMode: boolean; }

type Bit = 0 | 1;

// Boss puzzle: a 4-variable function — Y = A·B + B·C′ + A·B′·D
// minterms: walk through all 16
const BOSS_FN = (a: Bit, b: Bit, c: Bit, d: Bit): Bit => {
  const t1 = (a && b) ? 1 : 0;
  const t2 = (b && c === 0) ? 1 : 0;
  const t3 = (a && b === 0 && d) ? 1 : 0;
  return (t1 || t2 || t3) ? 1 : 0;
};

const buildTruth = (): Bit[] => {
  const arr: Bit[] = [];
  for (let i = 0; i < 16; i++) {
    const a = ((i >> 3) & 1) as Bit;
    const b = ((i >> 2) & 1) as Bit;
    const c = ((i >> 1) & 1) as Bit;
    const d = (i & 1) as Bit;
    arr.push(BOSS_FN(a, b, c, d));
  }
  return arr;
};

const TRUTH = buildTruth();
const MINTERMS = TRUTH.map((y, i) => (y === 1 ? i : -1)).filter((i) => i >= 0);

const COL_CD = [0, 1, 3, 2];
const ROW_AB = [0, 1, 3, 2];

// Wings: A·B = AB=11 row → m12, m13, m14, m15 (top-bottom of AB=11) ; in K-map AB=11 row contains all of those
// B·C' = B=1, C=0 → AB=01 (m4,m5) and AB=11 (m12,m13)
// A·B'·D = A=1, B=0, D=1 → AB=10 row, D=1 cells → m9, m11
const WING_AB = new Set([12, 13, 14, 15]);   // A·B
const WING_BCN = new Set([4, 5, 12, 13]);     // B·C'
const WING_ABND = new Set([9, 11]);           // A·B'·D

const STEPS = [
  { id: 'tt', label: '1 · Truth Table', desc: 'Enumerate all 2⁴ = 16 input combinations and the desired output Y.' },
  { id: 'min', label: '2 · Minterm List', desc: 'Σm({minterms}) — extract the rows where Y = 1.' },
  { id: 'kmap', label: '3 · K-Map', desc: 'Plot minterms on a 4×4 Gray-coded grid and group into largest power-of-2 wings.' },
  { id: 'sop', label: '4 · Simplified SOP', desc: 'Each wing → one product term. OR them together.' },
  { id: 'circuit', label: '5 · Circuit', desc: 'Each product becomes an AND, then a final OR. Done.' },
];

export const S19_BossExample: React.FC<Props> = ({ isActive, isDarkMode }) => {
  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText   = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg    = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';

  const [step, setStep] = useState(0);
  const [a, setA] = useState<Bit>(1);
  const [b, setB] = useState<Bit>(1);
  const [c, setC] = useState<Bit>(0);
  const [d, setD] = useState<Bit>(1);
  const y = useMemo(() => BOSS_FN(a, b, c, d), [a, b, c, d]);

  const advance = () => setStep(Math.min(step + 1, STEPS.length - 1));
  const back = () => setStep(Math.max(step - 1, 0));

  return (
    <div className="max-w-6xl mx-auto space-y-14 py-4">
      <section className="space-y-3">
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.4em] uppercase text-violet-400">
          <Crown size={14} /> Chapter · Boss Example
        </div>
        <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>4-Variable Walkthrough</h2>
        <p className={`text-base max-w-3xl ${subText}`}>
          Wing X was a 3-input toy. Real circuits routinely take 4+ inputs. Walk a 4-variable
          function end-to-end: <strong className="text-violet-300">truth table → K-Map → SOP →
          circuit</strong>. The methodology is identical; the canvas just grows.
        </p>
      </section>

      {/* Step navigator */}
      <div className={`p-4 rounded-3xl border ${cardBg} flex items-center justify-between gap-4 flex-wrap`}>
        <div className="flex items-center gap-2 flex-wrap">
          {STEPS.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setStep(i)}
              className={`px-3 py-1.5 rounded-lg font-mono text-[11px] transition-all ${
                step === i
                  ? 'bg-violet-400 text-black font-bold shadow-[0_0_18px_rgba(167,139,250,0.4)]'
                  : isDarkMode ? 'bg-white/5 border border-white/10 hover:border-violet-400' : 'bg-slate-100 border border-slate-200 hover:border-violet-400'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <button onClick={back} disabled={step === 0} className={`px-3 py-1.5 rounded-lg text-xs ${step === 0 ? 'opacity-30' : 'hover:bg-black/5'}`}>
            ← Back
          </button>
          <button onClick={advance} disabled={step === STEPS.length - 1} className="px-4 py-1.5 rounded-lg bg-violet-400 text-black font-bold text-xs disabled:opacity-30">
            Next →
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* STEP 0 — Truth Table */}
        {step === 0 && (
          <motion.div
            key="tt"
            initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }}
            className={`p-6 rounded-3xl border ${cardBg}`}
          >
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-violet-400 mb-4">{STEPS[0].label}</div>
            <p className={`text-sm ${subText} mb-4`}>{STEPS[0].desc}</p>

            <div className="grid grid-cols-[36px_repeat(4,1fr)_1fr] gap-x-1 gap-y-0.5 font-mono text-xs max-w-2xl">
              <div className="opacity-40 px-2 py-1.5">#</div>
              <div className="text-center text-amber-300 px-2 py-1.5">A</div>
              <div className="text-center text-cyan-300 px-2 py-1.5">B</div>
              <div className="text-center text-violet-300 px-2 py-1.5">C</div>
              <div className="text-center text-rose-300 px-2 py-1.5">D</div>
              <div className="text-center text-emerald-300 px-2 py-1.5">Y</div>

              {TRUTH.map((y, i) => {
                const a = (i >> 3) & 1;
                const b = (i >> 2) & 1;
                const c = (i >> 1) & 1;
                const d = i & 1;
                const isOne = y === 1;
                return (
                  <React.Fragment key={i}>
                    <div className={`px-2 py-1.5 ${isOne ? 'bg-emerald-500/15' : ''} rounded-l`}>m{i}</div>
                    <div className={`text-center px-2 py-1.5 ${isOne ? 'bg-emerald-500/10' : ''}`}>{a}</div>
                    <div className={`text-center px-2 py-1.5 ${isOne ? 'bg-emerald-500/10' : ''}`}>{b}</div>
                    <div className={`text-center px-2 py-1.5 ${isOne ? 'bg-emerald-500/10' : ''}`}>{c}</div>
                    <div className={`text-center px-2 py-1.5 ${isOne ? 'bg-emerald-500/10' : ''}`}>{d}</div>
                    <div className={`text-center px-2 py-1.5 ${isOne ? 'bg-emerald-500/15 text-emerald-300 font-black' : ''} rounded-r`}>{y}</div>
                  </React.Fragment>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* STEP 1 — Minterm list */}
        {step === 1 && (
          <motion.div
            key="min"
            initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }}
            className={`p-8 rounded-3xl border ${cardBg}`}
          >
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-violet-400 mb-4">{STEPS[1].label}</div>
            <p className={`text-sm ${subText} mb-6`}>
              Read off every row whose Y = 1. There are {MINTERMS.length} of them in this puzzle.
            </p>
            <div className={`p-6 rounded-2xl border-2 border-violet-400 bg-violet-500/10 text-center`}>
              <div className="font-mono text-[10px] uppercase tracking-widest text-violet-300 mb-3">
                Canonical minterm form
              </div>
              <div className={`font-mono text-3xl font-black ${textColor} break-all`}>
                Y = Σm({MINTERMS.join(', ')})
              </div>
            </div>
            <p className={`text-xs ${subText} mt-4`}>
              {MINTERMS.length} canonical product terms · before simplification this would
              require {MINTERMS.length} 4-input AND gates plus a {MINTERMS.length}-input OR.
              Eye-watering — that&apos;s why we use a K-Map.
            </p>
          </motion.div>
        )}

        {/* STEP 2 — K-Map */}
        {step === 2 && (
          <motion.div
            key="kmap"
            initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }}
            className={`p-6 rounded-3xl border ${cardBg}`}
          >
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-violet-400 mb-4">{STEPS[2].label}</div>
            <p className={`text-sm ${subText} mb-4`}>
              Plot the {MINTERMS.length} minterms on a 4×4 K-Map. Identify the three wings:
              <span className="text-amber-300"> A·B</span> (bottom-left 4-cell rectangle),
              <span className="text-cyan-300"> B·C′</span> (middle horizontal pair-pair), and
              <span className="text-rose-300"> A·B′·D</span> (rightmost column pair).
            </p>

            <div className="overflow-x-auto">
              <div className="grid grid-cols-[60px_repeat(4,72px)] gap-1 mb-1">
                <div></div>
                {['00', '01', '11', '10'].map((g) => (
                  <div key={g} className="text-center font-mono text-[11px] text-violet-300 pb-1">CD={g}</div>
                ))}
              </div>
              {ROW_AB.map((abBin) => (
                <div key={abBin} className="grid grid-cols-[60px_repeat(4,72px)] gap-1 mb-1">
                  <div className="text-right pr-2 font-mono text-[11px] text-violet-300 self-center">
                    AB={abBin.toString(2).padStart(2, '0')}
                  </div>
                  {COL_CD.map((cdBin) => {
                    const m = (abBin << 2) | cdBin;
                    const v = TRUTH[m];
                    const isAB = WING_AB.has(m);
                    const isBCN = WING_BCN.has(m);
                    const isABND = WING_ABND.has(m);

                    return (
                      <div
                        key={m}
                        className={`relative h-16 rounded-xl border-2 grid place-items-center font-mono font-black transition-all ${
                          v === 1 ? 'bg-emerald-500/20 border-emerald-400' : `bg-black/20 border-white/10 ${textColor}`
                        }`}
                      >
                        <span className="text-2xl">{v}</span>
                        <span className="absolute top-1 left-2 text-[9px] opacity-50">m{m}</span>
                        {isAB && <span className="absolute -inset-0.5 rounded-xl border-2 border-amber-400/70 pointer-events-none" />}
                        {isBCN && <span className="absolute -inset-1.5 rounded-xl border-2 border-cyan-400/70 pointer-events-none" />}
                        {isABND && <span className="absolute -inset-2.5 rounded-xl border-2 border-rose-400/70 pointer-events-none" />}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>

            <div className="grid sm:grid-cols-3 gap-3 mt-5">
              <div className="p-3 rounded-xl border border-amber-400/40 bg-amber-500/10">
                <div className="font-mono text-[10px] text-amber-300 uppercase tracking-widest mb-1">Wing 1 · 4 cells</div>
                <div className={`font-mono text-sm ${textColor}`}>
                  A=1, B=1 · all of m12-m15 → <strong>A · B</strong>
                </div>
              </div>
              <div className="p-3 rounded-xl border border-cyan-400/40 bg-cyan-500/10">
                <div className="font-mono text-[10px] text-cyan-300 uppercase tracking-widest mb-1">Wing 2 · 4 cells</div>
                <div className={`font-mono text-sm ${textColor}`}>
                  B=1, C=0 · m4, m5, m12, m13 → <strong>B · C′</strong>
                </div>
              </div>
              <div className="p-3 rounded-xl border border-rose-400/40 bg-rose-500/10">
                <div className="font-mono text-[10px] text-rose-300 uppercase tracking-widest mb-1">Wing 3 · 2 cells</div>
                <div className={`font-mono text-sm ${textColor}`}>
                  A=1, B=0, D=1 · m9, m11 → <strong>A · B′ · D</strong>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* STEP 3 — Simplified SOP */}
        {step === 3 && (
          <motion.div
            key="sop"
            initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }}
            className={`p-8 rounded-3xl border ${cardBg}`}
          >
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-violet-400 mb-4">{STEPS[3].label}</div>
            <p className={`text-sm ${subText} mb-6`}>
              Each rectangle yields one product term — only the variables that don&apos;t change
              within the wing survive.
            </p>
            <div className={`p-8 rounded-3xl border-2 border-violet-400 bg-violet-500/10 text-center space-y-3`}>
              <div className="font-mono text-[10px] uppercase tracking-widest text-violet-300">Simplified SOP</div>
              <div className={`font-mono text-3xl md:text-4xl font-black ${textColor}`}>
                Y = A·B + B·C′ + A·B′·D
              </div>
              <div className="text-xs text-violet-300 mt-2">
                {MINTERMS.length} minterms → 3 product terms. Major win.
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-3 mt-5">
              <div className={`p-4 rounded-xl border ${isDarkMode ? 'bg-black/30 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                <div className="font-mono text-[10px] uppercase tracking-widest text-amber-300 mb-1">Term 1</div>
                <div className="font-mono text-sm">A · B</div>
                <p className={`text-xs ${subText} mt-1`}>2 inputs</p>
              </div>
              <div className={`p-4 rounded-xl border ${isDarkMode ? 'bg-black/30 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                <div className="font-mono text-[10px] uppercase tracking-widest text-cyan-300 mb-1">Term 2</div>
                <div className="font-mono text-sm">B · C′</div>
                <p className={`text-xs ${subText} mt-1`}>2 inputs (1 inverter)</p>
              </div>
              <div className={`p-4 rounded-xl border ${isDarkMode ? 'bg-black/30 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                <div className="font-mono text-[10px] uppercase tracking-widest text-rose-300 mb-1">Term 3</div>
                <div className="font-mono text-sm">A · B′ · D</div>
                <p className={`text-xs ${subText} mt-1`}>3 inputs (1 inverter)</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* STEP 4 — Live circuit */}
        {step === 4 && (
          <motion.div
            key="circuit"
            initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }}
            className={`p-8 rounded-3xl border ${cardBg}`}
          >
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-violet-400 mb-4">{STEPS[4].label}</div>
            <p className={`text-sm ${subText} mb-6`}>
              The synthesised circuit. Toggle the inputs and watch each term — and the final Y —
              respond live.
            </p>

            {/* Input toggles */}
            <div className="flex gap-3 mb-6 flex-wrap">
              {([
                { k: 'A', v: a, set: setA, color: '#fbbf24' },
                { k: 'B', v: b, set: setB, color: '#22d3ee' },
                { k: 'C', v: c, set: setC, color: '#a78bfa' },
                { k: 'D', v: d, set: setD, color: '#f472b6' },
              ] as const).map((g) => (
                <button
                  key={g.k}
                  onClick={() => g.set(g.v === 1 ? 0 : 1)}
                  className="px-5 py-3 rounded-2xl border-2 font-mono font-black transition-all"
                  style={{
                    borderColor: g.color,
                    color: g.v ? '#000' : g.color,
                    backgroundColor: g.v ? g.color : 'transparent',
                    boxShadow: g.v ? `0 0 20px ${g.color}55` : 'none',
                  }}
                >
                  {g.k} = {g.v}
                </button>
              ))}
            </div>

            {/* Term cards */}
            <div className="grid sm:grid-cols-3 gap-3 mb-6">
              {[
                { label: 'A · B', v: (a && b) ? 1 : 0, color: '#fbbf24' },
                { label: 'B · C′', v: (b && c === 0) ? 1 : 0, color: '#22d3ee' },
                { label: 'A · B′ · D', v: (a && b === 0 && d) ? 1 : 0, color: '#f472b6' },
              ].map((term) => (
                <div
                  key={term.label}
                  className="p-4 rounded-2xl border-2 transition-all"
                  style={{
                    borderColor: term.v ? term.color : `${term.color}40`,
                    backgroundColor: term.v ? `${term.color}20` : 'transparent',
                    boxShadow: term.v ? `0 0 25px ${term.color}55` : 'none',
                  }}
                >
                  <div className="font-mono text-[10px] uppercase tracking-widest mb-1" style={{ color: term.color }}>
                    Term
                  </div>
                  <div className={`font-mono text-base font-black ${textColor}`}>{term.label}</div>
                  <div className="font-mono text-2xl font-black mt-1" style={{ color: term.color }}>= {term.v}</div>
                </div>
              ))}
            </div>

            {/* Final result */}
            <div className={`p-6 rounded-2xl border-2 transition-all ${y ? 'border-emerald-400 bg-emerald-500/10' : 'border-rose-400 bg-rose-500/10'}`}>
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-widest mb-1" style={{ color: y ? '#34d399' : '#f43f5e' }}>
                    Final Output
                  </div>
                  <div className={`font-mono text-3xl font-black ${textColor}`}>Y = {y}</div>
                </div>
                <div className={`font-mono text-sm ${subText}`}>
                  Y = (A·B) + (B·C′) + (A·B′·D)
                  <br />
                  Y = ({(a && b) ? 1 : 0}) + ({(b && c === 0) ? 1 : 0}) + ({(a && b === 0 && d) ? 1 : 0}) = <strong style={{ color: y ? '#34d399' : '#f43f5e' }}>{y}</strong>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pep-talk footer */}
      <motion.div
        initial={{ opacity: 0 }} animate={isActive ? { opacity: 1 } : {}}
        className={`p-6 rounded-3xl border ${cardBg} flex items-start gap-3`}
      >
        {step < STEPS.length - 1 ? <Map className="text-violet-300 flex-shrink-0 mt-0.5" size={18} /> : <Zap className="text-emerald-300 flex-shrink-0 mt-0.5" size={18} />}
        <p className={`text-sm ${subText}`}>
          {step < STEPS.length - 1
            ? <>The same five steps work for any number of inputs. Once you trust the methodology, scaling from 3 to 4 to 5 variables is only about needing more cells in the K-Map.</>
            : <><strong className="text-emerald-300">Boss complete.</strong> You just synthesised a non-trivial 4-variable function. Anything below 5 variables is now in your toolkit.</>}
        </p>
      </motion.div>
    </div>
  );
};
