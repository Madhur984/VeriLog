import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Grid3x3, Sparkles, ArrowRight } from 'lucide-react';

interface Props { isActive: boolean; isDarkMode: boolean; }

// Gray-code column order for the W variable (last bit), and gray-code row order for RA pair
// 3-variable K-map layout (R fixed in 2 rows; AW pair in gray-code 4 cols)
//          AW=00  AW=01  AW=11  AW=10
//   R=0    m0     m1     m3     m2
//   R=1    m4     m5     m7     m6
const KMAP_LAYOUT = [
  [0, 1, 3, 2],
  [4, 5, 7, 6],
];

const COL_HEADERS = ['AW=00', 'AW=01', 'AW=11', 'AW=10'];
const ROW_HEADERS = ['R=0', 'R=1'];

const benRule = (r: number, a: number, w: number) => (r + a + w) <= 1 ? 1 : 0;

const valueFor = (idx: number) => {
  const r = (idx >> 2) & 1, a = (idx >> 1) & 1, w = idx & 1;
  return benRule(r, a, w);
};

export const S09b_KMapPreview: React.FC<Props> = ({ isActive, isDarkMode }) => {
  const [hover, setHover] = useState<number | null>(null);

  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';

  return (
    <div className="max-w-6xl mx-auto space-y-12 py-4">
      <section className="space-y-3">
        <div className="font-mono text-[10px] tracking-[0.4em] uppercase text-fuchsia-400">
          Chapter 09.5 · Sneak Peek
        </div>
        <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>
          From Truth Table to Karnaugh Map
        </h2>
        <p className={`text-base max-w-3xl ${subText}`}>
          The same eight rows of Ben&apos;s function can be re-arranged into a 2×4 grid where{' '}
          <strong>physically adjacent cells differ in exactly one variable</strong>. That property
          turns visual grouping into algebraic simplification - which is the entire next module.
        </p>
      </section>

      {/* Truth-table → K-map flow */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        className={`p-8 rounded-3xl border ${cardBg}`}
      >
        <div className="flex items-center gap-2 mb-6">
          <Grid3x3 size={14} className="text-fuchsia-400" />
          <span className="font-mono text-[10px] uppercase tracking-widest text-fuchsia-400">
            3-variable K-Map for E = Σm(0, 1, 2, 4)
          </span>
        </div>

        {/* K-map grid */}
        <div className="overflow-x-auto">
          <div className="inline-block mx-auto">
            {/* Column headers */}
            <div className="grid grid-cols-[80px_repeat(4,80px)] gap-1.5 mb-1.5">
              <div></div>
              {COL_HEADERS.map(h => (
                <div key={h} className={`h-8 flex items-center justify-center font-mono text-[11px] font-black ${
                  isDarkMode ? 'text-fuchsia-300' : 'text-fuchsia-700'
                }`}>
                  {h}
                </div>
              ))}
            </div>

            {/* Cells */}
            {KMAP_LAYOUT.map((row, ri) => (
              <div key={ri} className="grid grid-cols-[80px_repeat(4,80px)] gap-1.5 mb-1.5">
                <div className={`h-20 flex items-center justify-center font-mono text-[11px] font-black ${
                  isDarkMode ? 'text-fuchsia-300' : 'text-fuchsia-700'
                }`}>
                  {ROW_HEADERS[ri]}
                </div>
                {row.map((idx, ci) => {
                  const v = valueFor(idx);
                  const isHovered = hover === idx;
                  return (
                    <button
                      key={ci}
                      onMouseEnter={() => setHover(idx)}
                      onMouseLeave={() => setHover(null)}
                      className={`h-20 rounded-xl border-2 flex flex-col items-center justify-center transition-all ${
                        v === 1
                          ? 'border-emerald-400 bg-emerald-500/15'
                          : 'border-rose-400/40 bg-rose-500/5'
                      } ${isHovered ? 'scale-105 shadow-2xl' : ''}`}
                    >
                      <span className={`text-2xl font-black ${
                        v === 1 ? 'text-emerald-400' : 'text-rose-400/70'
                      }`}>{v}</span>
                      <span className={`font-mono text-[9px] mt-0.5 ${
                        v === 1 ? 'text-emerald-400/70' : 'text-rose-400/50'
                      }`}>m{idx}</span>
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Hover helper */}
        <div className={`mt-6 p-4 rounded-2xl text-center ${
          isDarkMode ? 'bg-black/30' : 'bg-slate-50'
        }`}>
          {hover !== null ? (
            <div className={`font-mono text-sm ${textColor}`}>
              <span className={`text-fuchsia-400 font-black`}>m{hover}</span>{' '}
              · binary{' '}
              <span className="font-black">
                {((hover >> 2) & 1)}{((hover >> 1) & 1)}{(hover & 1)}
              </span>
              {' '}· value{' '}
              <span className={valueFor(hover) ? 'text-emerald-400 font-black' : 'text-rose-400 font-black'}>
                {valueFor(hover)}
              </span>
            </div>
          ) : (
            <div className={`text-xs font-mono ${subText}`}>hover any cell to inspect</div>
          )}
        </div>
      </motion.div>

      {/* Adjacency insight */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.2 }}
        className={`p-8 rounded-3xl border ${
          isDarkMode ? 'bg-fuchsia-500/5 border-fuchsia-400/30' : 'bg-fuchsia-50 border-fuchsia-300'
        }`}
      >
        <div className="flex items-center gap-2 mb-3">
          <Sparkles size={14} className="text-fuchsia-400" />
          <span className="font-mono text-[10px] uppercase tracking-widest text-fuchsia-400">
            Why this layout matters
          </span>
        </div>
        <p className={`text-sm leading-relaxed mb-4 ${textColor}`}>
          Notice the column ordering - <span className="font-mono">00 → 01 → 11 → 10</span>{' '}
          (not <span className="font-mono">00 → 01 → 10 → 11</span>). This is{' '}
          <strong>Gray code</strong>: adjacent columns differ in exactly one bit. That means{' '}
          <strong>any pair of horizontally or vertically adjacent cells</strong> differs in
          exactly one variable.
        </p>
        <p className={`text-sm leading-relaxed ${textColor}`}>
          When two adjacent cells both contain 1, the variable that changes between them must
          drop out of the simplified expression - it is irrelevant to the function. This visual
          shortcut replaces algebraic theorem-chasing in the next module.
        </p>
      </motion.div>

      {/* Where simplification happens */}
      <motion.div
        initial={{ opacity: 0 }} animate={isActive ? { opacity: 1 } : {}}
        transition={{ delay: 0.4 }}
        className="grid md:grid-cols-2 gap-5"
      >
        <div className={`p-6 rounded-3xl border ${cardBg}`}>
          <div className="font-mono text-[10px] uppercase tracking-widest opacity-50 mb-3">
            Canonical SOP (this module)
          </div>
          <div className="font-mono text-lg font-black text-emerald-400 break-words mb-2">
            E = R&apos;A&apos;W&apos; + R&apos;A&apos;W + R&apos;AW&apos; + RA&apos;W&apos;
          </div>
          <div className={`text-xs ${subText}`}>
            12 literals · 4 AND-gates + 1 OR-gate
          </div>
        </div>
        <div className={`p-6 rounded-3xl border ${
          isDarkMode ? 'bg-emerald-500/5 border-emerald-400/40' : 'bg-emerald-50 border-emerald-300'
        }`}>
          <div className="font-mono text-[10px] uppercase tracking-widest text-emerald-400 mb-3">
            Minimised via K-Map (next module)
          </div>
          <div className="font-mono text-lg font-black text-emerald-400 break-words mb-2">
            E = R&apos;A&apos; + R&apos;W&apos; + A&apos;W&apos;
          </div>
          <div className={`text-xs ${subText}`}>
            6 literals · 3 AND-gates + 1 OR-gate · <strong>50% smaller</strong>
          </div>
        </div>
      </motion.div>

      {/* Bridge text */}
      <motion.div
        initial={{ opacity: 0 }} animate={isActive ? { opacity: 1 } : {}}
        transition={{ delay: 0.6 }}
        className="px-1"
      >
        <p className={`text-sm leading-relaxed ${textColor}`}>
          <strong className="text-fuchsia-400">Looking ahead:</strong> the next module spends its
          entire time on K-Map mechanics - implicants, prime implicants, essential prime
          implicants, the don&apos;t-care state - and how the same approach extends to 4 and 5
          variables. For now, internalise this single fact:{' '}
          <em>canonical forms are correct; minimised forms are correct AND cheap</em>.
        </p>
      </motion.div>

      {/* Continue cue */}
      <div className={`text-center font-mono text-[10px] uppercase tracking-[0.3em] ${subText}`}>
        Continue to the practice arena <ArrowRight size={12} className="inline" />
      </div>
    </div>
  );
};
