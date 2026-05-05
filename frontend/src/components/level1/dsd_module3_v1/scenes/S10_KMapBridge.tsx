import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Grid3x3, Lightbulb } from 'lucide-react';

interface Props { isActive: boolean; isDarkMode: boolean; }

// 3-variable K-map with rows = A (0,1) and cols = BC (Gray: 00,01,11,10)
// Cell index map (row,col) -> minterm number = A*4 + (gray-code BC -> binary)
//   col 0 -> BC=00 -> 0
//   col 1 -> BC=01 -> 1
//   col 2 -> BC=11 -> 3
//   col 3 -> BC=10 -> 2
const COL_TO_BIN = [0, 1, 3, 2];

// Y = A·B + A·C'  → minterms 4 (1,0,0), 6 (1,1,0), 7 (1,1,1)
const TARGET_MINTERMS = new Set([4, 6, 7]);

export const S10_KMapBridge: React.FC<Props> = ({ isActive, isDarkMode }) => {
  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText   = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg    = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';

  const [hover, setHover] = useState<number | null>(null);

  return (
    <div className="max-w-6xl mx-auto space-y-14 py-4">
      <section className="space-y-3">
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.4em] uppercase text-violet-400">
          <Grid3x3 size={14} /> Chapter 10 · From Truth Table to K-Map
        </div>
        <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>The K-Map Fold</h2>
        <p className={`text-base max-w-3xl ${subText}`}>
          The truth table is exhaustive but visually flat. By <strong>folding</strong> it into a
          2 × 4 grid that uses Gray-code on the columns, every neighbour differs by exactly one
          bit — which means adjacent 1s can be merged into a single product term.
        </p>
      </section>

      <div className="grid lg:grid-cols-[1.1fr_1fr] gap-8 items-start">
        {/* The 3-variable K-Map */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
          className={`p-8 rounded-3xl border ${cardBg}`}
        >
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-violet-400 mb-4">
            Y = Σm(4, 6, 7) · A on rows · BC on cols
          </div>

          <div className="inline-block">
            {/* column headers */}
            <div className="grid grid-cols-[60px_repeat(4,72px)] gap-1 mb-1">
              <div></div>
              {['00', '01', '11', '10'].map((g) => (
                <div key={g} className="text-center font-mono text-[11px] text-violet-300 pb-1">
                  BC = {g}
                </div>
              ))}
            </div>
            {/* rows */}
            {[0, 1].map((a) => (
              <div key={a} className="grid grid-cols-[60px_repeat(4,72px)] gap-1 mb-1">
                <div className="text-right pr-3 font-mono text-[11px] text-violet-300 self-center">
                  A = {a}
                </div>
                {COL_TO_BIN.map((bcBin, col) => {
                  const minterm = a * 4 + bcBin;
                  const isOne = TARGET_MINTERMS.has(minterm);
                  const isWingHi = (minterm === 6 || minterm === 7); // A·B group
                  const isWingLo = (minterm === 4 || minterm === 6); // A·C' group
                  const inAnyWing = isWingHi || isWingLo;

                  return (
                    <button
                      key={col}
                      onMouseEnter={() => setHover(minterm)}
                      onMouseLeave={() => setHover(null)}
                      className={`relative h-16 rounded-xl border-2 grid place-items-center font-mono font-black transition-all ${
                        isOne
                          ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200 shadow-[0_0_25px_rgba(52,211,153,0.3)]'
                          : `bg-black/20 border-white/10 ${textColor}`
                      } ${hover === minterm ? 'scale-105 ring-2 ring-violet-400' : ''}`}
                    >
                      <span className="text-2xl">{isOne ? 1 : 0}</span>
                      <span className="absolute top-1 left-2 text-[9px] opacity-50">m{minterm}</span>
                      {inAnyWing && (
                        <>
                          {isWingHi && (
                            <span className="absolute -inset-0.5 rounded-xl border-2 border-amber-400/70 pointer-events-none" />
                          )}
                          {isWingLo && (
                            <span className="absolute -inset-1.5 rounded-xl border-2 border-cyan-400/70 pointer-events-none" />
                          )}
                        </>
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl border border-amber-400/40 bg-amber-500/10">
              <div className="font-mono text-[10px] text-amber-300 uppercase tracking-widest mb-1">Pair {`{m6, m7}`}</div>
              <div className={`font-mono text-sm ${textColor}`}>A = 1, B = 1 · C varies → <strong>A · B</strong></div>
            </div>
            <div className="p-3 rounded-xl border border-cyan-400/40 bg-cyan-500/10">
              <div className="font-mono text-[10px] text-cyan-300 uppercase tracking-widest mb-1">Pair {`{m4, m6}`}</div>
              <div className={`font-mono text-sm ${textColor}`}>A = 1, C = 0 · B varies → <strong>A · C′</strong></div>
            </div>
          </div>
        </motion.div>

        {/* Explanation */}
        <motion.div
          initial={{ opacity: 0, x: 16 }} animate={isActive ? { opacity: 1, x: 0 } : {}}
          className={`p-8 rounded-3xl border ${cardBg} space-y-5`}
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-violet-500/20 border border-violet-400/40 flex items-center justify-center text-violet-300">
              <Lightbulb size={22} />
            </div>
            <div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-violet-400 mb-1">Reading the wings</div>
              <h3 className={`text-xl font-black ${textColor}`}>Adjacency = Simplification</h3>
            </div>
          </div>

          <ol className={`space-y-2 text-sm ${subText} list-decimal list-inside`}>
            <li>Drop a <strong className="text-emerald-300">1</strong> in every cell whose minterm appears in the truth table.</li>
            <li>Group adjacent 1s into the largest possible rectangle whose size is a power of 2 (1, 2, 4, 8 …).</li>
            <li>For each rectangle, list the variables that don&apos;t change. Those become the product term.</li>
            <li>OR all the product terms together — that&apos;s your simplified SOP.</li>
          </ol>

          <div className="rounded-2xl p-5 border-2 border-violet-400 bg-violet-500/10 text-center">
            <div className="font-mono text-[10px] uppercase tracking-widest text-violet-300 mb-2">Simplified result</div>
            <div className={`font-mono text-2xl md:text-3xl font-black ${textColor}`}>Y = A · B + A · C′</div>
          </div>

          <p className={`text-xs ${subText}`}>
            Both wings overlap at m6 — that overlap is fine; it costs nothing to share. The
            picture confirms the algebra we derived in chapter 8.
          </p>
        </motion.div>
      </div>
    </div>
  );
};
