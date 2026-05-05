import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sigma, Pi, GitCompare } from 'lucide-react';

interface Props { isActive: boolean; isDarkMode: boolean; }

type Bit = 0 | 1;

// Y = A·B + A·C' (the Wing X function from earlier scenes) — minterms 4, 6, 7
const TRUTH: Bit[] = [0, 0, 0, 0, 1, 0, 1, 1];

const minterms = TRUTH
  .map((y, i) => (y === 1 ? i : -1))
  .filter((i) => i >= 0);

const maxterms = TRUTH
  .map((y, i) => (y === 0 ? i : -1))
  .filter((i) => i >= 0);

const mintermLiteral = (m: number, vars: string[] = ['A', 'B', 'C']) => {
  const a = (m >> 2) & 1;
  const b = (m >> 1) & 1;
  const c = m & 1;
  return [a ? vars[0] : `${vars[0]}'`, b ? vars[1] : `${vars[1]}'`, c ? vars[2] : `${vars[2]}'`].join('·');
};

const maxtermLiteral = (m: number, vars: string[] = ['A', 'B', 'C']) => {
  // For maxterm: 0 → A, 1 → A' (inverted from minterm)
  const a = (m >> 2) & 1;
  const b = (m >> 1) & 1;
  const c = m & 1;
  return `(${[a ? `${vars[0]}'` : vars[0], b ? `${vars[1]}'` : vars[1], c ? `${vars[2]}'` : vars[2]].join(' + ')})`;
};

export const S17_CanonicalForms: React.FC<Props> = ({ isActive, isDarkMode }) => {
  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText   = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg    = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';

  const [view, setView] = useState<'sop' | 'pos'>('sop');

  return (
    <div className="max-w-6xl mx-auto space-y-14 py-4">
      <section className="space-y-3">
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.4em] uppercase text-amber-400">
          <GitCompare size={14} /> Chapter · Canonical Forms
        </div>
        <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>Two Lenses · SOP & POS</h2>
        <p className={`text-base max-w-3xl ${subText}`}>
          Every Boolean function has <strong>two</strong> canonical algebraic forms. The
          <strong className="text-amber-300"> Sum-of-Products (SOP)</strong> sums the rows where
          Y = 1 (minterms). The <strong className="text-amber-300">Product-of-Sums (POS)</strong>
          {' '}multiplies factors derived from the rows where Y = 0 (maxterms). Both describe the
          same function — pick whichever yields fewer terms.
        </p>
      </section>

      {/* Toggle */}
      <div className="flex justify-center">
        <div className={`relative inline-flex p-1 rounded-2xl border ${isDarkMode ? 'bg-black/40 border-white/10' : 'bg-slate-100 border-slate-200'}`}>
          {([
            { id: 'sop', label: 'SOP · Sum-of-Products', Icon: Sigma },
            { id: 'pos', label: 'POS · Product-of-Sums', Icon: Pi },
          ] as const).map((p) => (
            <button
              key={p.id}
              onClick={() => setView(p.id)}
              className={`relative z-10 flex items-center gap-2 px-5 py-2 rounded-xl font-bold text-sm transition-colors ${
                view === p.id ? 'text-black' : isDarkMode ? 'text-slate-300' : 'text-slate-600'
              }`}
            >
              {view === p.id && (
                <motion.div
                  layoutId="canonical-pill"
                  className="absolute inset-0 rounded-xl bg-amber-400 shadow-[0_0_18px_rgba(251,191,36,0.4)]"
                  transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                />
              )}
              <span className="relative flex items-center gap-2">
                <p.Icon size={14} />
                <span className="font-mono">{p.label}</span>
              </span>
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {view === 'sop' ? (
          <motion.div
            key="sop"
            initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }}
            className="space-y-6"
          >
            {/* Truth table with minterms highlighted */}
            <div className={`p-6 rounded-3xl border ${cardBg}`}>
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-amber-400 mb-4">
                Step 1 · select rows where Y = 1
              </div>
              <div className="grid grid-cols-[40px_repeat(3,1fr)_1fr_2fr] gap-x-1 gap-y-1 font-mono text-xs">
                <div className="opacity-40 px-2 py-1.5">#</div>
                <div className="text-center text-amber-300 px-2 py-1.5">A</div>
                <div className="text-center text-cyan-300 px-2 py-1.5">B</div>
                <div className="text-center text-violet-300 px-2 py-1.5">C</div>
                <div className="text-center text-emerald-300 px-2 py-1.5">Y</div>
                <div className="text-amber-300 px-2 py-1.5">Minterm contribution</div>

                {TRUTH.map((y, i) => {
                  const a = (i >> 2) & 1;
                  const b = (i >> 1) & 1;
                  const c = i & 1;
                  const isOne = y === 1;
                  return (
                    <React.Fragment key={i}>
                      <div className={`px-2 py-1.5 ${isOne ? 'bg-amber-500/20' : ''} rounded-l`}>m{i}</div>
                      <div className={`text-center px-2 py-1.5 ${isOne ? 'bg-amber-500/15' : ''}`}>{a}</div>
                      <div className={`text-center px-2 py-1.5 ${isOne ? 'bg-amber-500/15' : ''}`}>{b}</div>
                      <div className={`text-center px-2 py-1.5 ${isOne ? 'bg-amber-500/15' : ''}`}>{c}</div>
                      <div className={`text-center px-2 py-1.5 ${isOne ? 'bg-emerald-500/20 text-emerald-300 font-black' : ''}`}>{y}</div>
                      <div className={`px-2 py-1.5 rounded-r ${isOne ? 'bg-amber-500/15 text-amber-200 font-bold' : 'opacity-40'}`}>
                        {isOne ? mintermLiteral(i) : '—'}
                      </div>
                    </React.Fragment>
                  );
                })}
              </div>
            </div>

            <div className={`p-8 rounded-3xl border-2 border-amber-400 bg-amber-500/10 space-y-4`}>
              <div className="font-mono text-[10px] uppercase tracking-widest text-amber-300">
                Step 2 · OR all minterms together
              </div>
              <div className={`text-center font-mono text-2xl md:text-3xl font-black ${textColor} space-y-3`}>
                <div>Y = Σm({minterms.join(', ')})</div>
                <div className="text-amber-300 text-base">↓ expand</div>
                <div>Y = {minterms.map((m) => mintermLiteral(m)).join('  +  ')}</div>
                <div className="text-amber-300 text-base">↓ K-Map simplifies</div>
                <div className="text-amber-200">Y = A·B + A·C′</div>
              </div>
            </div>

            <div className={`p-5 rounded-2xl border ${cardBg}`}>
              <div className="font-mono text-[10px] uppercase tracking-widest text-amber-400 mb-2">Recipe</div>
              <p className={`text-sm ${subText} leading-relaxed`}>
                For each row where Y = 1, write a product of all variables (1 → variable, 0 →
                complemented). OR them all together. That&apos;s the canonical SOP. Then simplify
                with the K-Map or algebra.
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="pos"
            initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }}
            className="space-y-6"
          >
            {/* Truth table with maxterms highlighted */}
            <div className={`p-6 rounded-3xl border ${cardBg}`}>
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-amber-400 mb-4">
                Step 1 · select rows where Y = 0
              </div>
              <div className="grid grid-cols-[40px_repeat(3,1fr)_1fr_2fr] gap-x-1 gap-y-1 font-mono text-xs">
                <div className="opacity-40 px-2 py-1.5">#</div>
                <div className="text-center text-amber-300 px-2 py-1.5">A</div>
                <div className="text-center text-cyan-300 px-2 py-1.5">B</div>
                <div className="text-center text-violet-300 px-2 py-1.5">C</div>
                <div className="text-center text-emerald-300 px-2 py-1.5">Y</div>
                <div className="text-amber-300 px-2 py-1.5">Maxterm contribution</div>

                {TRUTH.map((y, i) => {
                  const a = (i >> 2) & 1;
                  const b = (i >> 1) & 1;
                  const c = i & 1;
                  const isZero = y === 0;
                  return (
                    <React.Fragment key={i}>
                      <div className={`px-2 py-1.5 ${isZero ? 'bg-violet-500/20' : ''} rounded-l`}>M{i}</div>
                      <div className={`text-center px-2 py-1.5 ${isZero ? 'bg-violet-500/15' : ''}`}>{a}</div>
                      <div className={`text-center px-2 py-1.5 ${isZero ? 'bg-violet-500/15' : ''}`}>{b}</div>
                      <div className={`text-center px-2 py-1.5 ${isZero ? 'bg-violet-500/15' : ''}`}>{c}</div>
                      <div className={`text-center px-2 py-1.5 ${isZero ? '' : 'text-emerald-300 font-black'}`}>{y}</div>
                      <div className={`px-2 py-1.5 rounded-r ${isZero ? 'bg-violet-500/15 text-violet-200 font-bold' : 'opacity-40'}`}>
                        {isZero ? maxtermLiteral(i) : '—'}
                      </div>
                    </React.Fragment>
                  );
                })}
              </div>
            </div>

            <div className={`p-8 rounded-3xl border-2 border-violet-400 bg-violet-500/10 space-y-4`}>
              <div className="font-mono text-[10px] uppercase tracking-widest text-violet-300">
                Step 2 · AND all maxterms together
              </div>
              <div className={`text-center font-mono text-xl md:text-2xl font-black ${textColor} space-y-3`}>
                <div>Y = ΠM({maxterms.join(', ')})</div>
                <div className="text-violet-300 text-base">↓ expand</div>
                <div className="text-base md:text-lg break-words">Y = {maxterms.map((m) => maxtermLiteral(m)).join('  ·  ')}</div>
                <div className="text-violet-300 text-base">↓ simplify (POS K-Map)</div>
                <div className="text-violet-200">Y = A · (B + C′)</div>
              </div>
            </div>

            <div className={`p-5 rounded-2xl border ${cardBg}`}>
              <div className="font-mono text-[10px] uppercase tracking-widest text-violet-400 mb-2">Recipe</div>
              <p className={`text-sm ${subText} leading-relaxed`}>
                For each row where Y = 0, write a sum of all variables{' '}
                <em>complemented relative to that row</em> (0 → variable, 1 → complemented). AND
                all sums together. That&apos;s the canonical POS.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Equivalence summary */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.2 }}
        className={`p-8 rounded-3xl border ${cardBg}`}
      >
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-amber-400 mb-5">Same function · two faces</div>
        <div className="grid md:grid-cols-2 gap-5">
          <div className={`p-5 rounded-2xl border border-amber-400/40 bg-amber-500/5`}>
            <div className="flex items-center gap-2 mb-2">
              <Sigma size={14} className="text-amber-300" />
              <span className="font-mono text-[10px] uppercase tracking-widest text-amber-300">SOP simplified</span>
            </div>
            <div className={`font-mono text-2xl font-black text-amber-200`}>Y = A·B + A·C′</div>
            <p className={`text-xs ${subText} mt-2`}>3 minterms · 2 product terms after K-Map. Use when 1s are sparse.</p>
          </div>
          <div className={`p-5 rounded-2xl border border-violet-400/40 bg-violet-500/5`}>
            <div className="flex items-center gap-2 mb-2">
              <Pi size={14} className="text-violet-300" />
              <span className="font-mono text-[10px] uppercase tracking-widest text-violet-300">POS simplified</span>
            </div>
            <div className={`font-mono text-2xl font-black text-violet-200`}>Y = A·(B + C′)</div>
            <p className={`text-xs ${subText} mt-2`}>5 maxterms · 1 sum term · 1 single after factoring. Use when 0s are sparse.</p>
          </div>
        </div>
        <p className={`text-xs ${subText} text-center mt-4 italic`}>
          Both forms describe identical Boolean behaviour. The choice is purely about gate count
          and chip area.
        </p>
      </motion.div>
    </div>
  );
};
