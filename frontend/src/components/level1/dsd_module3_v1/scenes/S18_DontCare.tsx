import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { HelpCircle, Layers } from 'lucide-react';

interface Props { isActive: boolean; isDarkMode: boolean; }

// Cell value can be 0, 1, or 'X'
type Cell = 0 | 1 | 'X';

// Demo function: BCD-to-something where digits 10-15 are don't cares
// 4-vars A,B,C,D → minterm index 0..15
// Y = 1 for {1, 3, 5, 7, 9}, X for {10, 11, 12, 13, 14, 15}, else 0
const buildDemo = (): Cell[] => {
  const arr: Cell[] = Array(16).fill(0) as Cell[];
  [1, 3, 5, 7, 9].forEach((m) => { arr[m] = 1; });
  [10, 11, 12, 13, 14, 15].forEach((m) => { arr[m] = 'X'; });
  return arr;
};

const COL_BCD = [0, 1, 3, 2]; // CD Gray code
const ROW_AB = [0, 1, 3, 2];  // AB Gray code

export const S18_DontCare: React.FC<Props> = ({ isActive, isDarkMode }) => {
  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText   = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg    = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';

  const [cells] = useState<Cell[]>(buildDemo());
  // Toggle: are we using don't cares?
  const [useDC, setUseDC] = useState(true);

  return (
    <div className="max-w-6xl mx-auto space-y-14 py-4">
      <section className="space-y-3">
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.4em] uppercase text-violet-400">
          <HelpCircle size={14} /> Chapter · The X Factor
        </div>
        <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>Don&apos;t Care Conditions</h2>
        <p className={`text-base max-w-3xl ${subText}`}>
          Sometimes <strong className="text-violet-300">certain input combinations cannot
          occur</strong> in your system. A BCD decoder, for example, never sees inputs 10–15
          because they aren&apos;t valid decimal digits. Mark those rows with{' '}
          <strong className="text-violet-300">X</strong>; the synthesiser is then free to treat
          them as 1 or 0 — whichever yields a simpler circuit.
        </p>
      </section>

      {/* Definition card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        className={`p-8 rounded-3xl border ${cardBg}`}
      >
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-violet-400 mb-5">
          The three cell states
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { v: '0', label: 'Must output 0', d: 'Required low. The K-Map will leave this cell empty.', color: '#475569' },
            { v: '1', label: 'Must output 1', d: 'Required high — a true minterm. Must be covered by at least one wing.', color: '#34d399' },
            { v: 'X', label: 'Don\'t care',   d: 'Input combination cannot happen. Treat as 0 or 1 — whichever helps.', color: '#a78bfa' },
          ].map((c) => (
            <div key={c.v} className={`p-5 rounded-2xl border-2`} style={{ borderColor: c.color, backgroundColor: `${c.color}10` }}>
              <div className="font-mono text-5xl font-black mb-2" style={{ color: c.color }}>{c.v}</div>
              <div className="font-mono text-[10px] uppercase tracking-widest mb-1" style={{ color: c.color }}>{c.label}</div>
              <p className={`text-xs ${subText} leading-relaxed`}>{c.d}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Toggle */}
      <div className="flex justify-center">
        <div className={`relative inline-flex p-1 rounded-2xl border ${isDarkMode ? 'bg-black/40 border-white/10' : 'bg-slate-100 border-slate-200'}`}>
          {[
            { id: false, label: 'Treat X as 0' },
            { id: true,  label: 'Use X to grow wings' },
          ].map((p) => (
            <button
              key={String(p.id)}
              onClick={() => setUseDC(p.id)}
              className={`relative z-10 px-5 py-2 rounded-xl font-bold text-sm transition-colors ${
                useDC === p.id ? 'text-black' : isDarkMode ? 'text-slate-300' : 'text-slate-600'
              }`}
            >
              {useDC === p.id && (
                <motion.div
                  layoutId="dc-pill"
                  className="absolute inset-0 rounded-xl bg-violet-400 shadow-[0_0_18px_rgba(167,139,250,0.4)]"
                  transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                />
              )}
              <span className="relative font-mono">{p.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* The 4-var K-Map with don't cares */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        className={`p-8 rounded-3xl border ${cardBg}`}
      >
        <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-violet-400 mb-1">
              BCD odd-digit detector · 4-var K-Map
            </div>
            <h3 className={`text-xl font-black ${textColor}`}>Y = 1 for digits 1, 3, 5, 7, 9</h3>
          </div>
          <span className="font-mono text-[11px] text-violet-300">10–15 = don&apos;t cares</span>
        </div>

        <div className="overflow-x-auto">
          <div className="grid grid-cols-[64px_repeat(4,72px)] gap-1 mb-1">
            <div></div>
            {['00', '01', '11', '10'].map((g) => (
              <div key={g} className="text-center font-mono text-[11px] text-violet-300 pb-1">CD={g}</div>
            ))}
          </div>
          {ROW_AB.map((abBin) => (
            <div key={abBin} className="grid grid-cols-[64px_repeat(4,72px)] gap-1 mb-1">
              <div className="text-right pr-2 font-mono text-[11px] text-violet-300 self-center">
                AB={abBin.toString(2).padStart(2, '0')}
              </div>
              {COL_BCD.map((cdBin) => {
                const m = (abBin << 2) | cdBin;
                const v = cells[m];
                const effective = v === 'X' ? (useDC ? 1 : 0) : v;
                const display = v === 'X' ? 'X' : v;

                let cellStyle = 'bg-black/20 border-white/10';
                let textCls = textColor;
                if (effective === 1 && v === 1) {
                  cellStyle = 'bg-emerald-500/20 border-emerald-400 shadow-[0_0_18px_rgba(52,211,153,0.3)]';
                  textCls = 'text-emerald-200';
                } else if (effective === 1 && v === 'X') {
                  cellStyle = 'bg-violet-500/30 border-violet-400 shadow-[0_0_18px_rgba(167,139,250,0.3)]';
                  textCls = 'text-violet-200';
                } else if (v === 'X') {
                  cellStyle = 'bg-violet-500/10 border-violet-400/30';
                  textCls = 'text-violet-300';
                }

                return (
                  <div
                    key={m}
                    className={`relative h-16 rounded-xl border-2 grid place-items-center font-mono font-black transition-all ${cellStyle}`}
                  >
                    <span className={`text-2xl ${textCls}`}>{display}</span>
                    <span className="absolute top-1 left-2 text-[9px] opacity-50">m{m}</span>
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Result */}
        <div className="mt-6 grid md:grid-cols-2 gap-4">
          <div className={`p-5 rounded-2xl border-2 ${useDC ? 'border-violet-400/30 bg-violet-500/5' : 'border-rose-400 bg-rose-500/10'}`}>
            <div className={`font-mono text-[10px] uppercase tracking-widest mb-2 ${useDC ? 'text-violet-300' : 'text-rose-300'}`}>
              Treat X as 0
            </div>
            <div className={`font-mono text-lg font-black ${textColor}`}>
              Y = A′B′C′D + A′B′CD + A′BC′D + A′BCD + AB′C′D
            </div>
            <p className={`text-xs ${subText} mt-2`}>5 minterms · expensive — at least 4 AND gates of 4 inputs each.</p>
          </div>
          <div className={`p-5 rounded-2xl border-2 ${useDC ? 'border-emerald-400 bg-emerald-500/10' : 'border-violet-400/30 bg-violet-500/5'}`}>
            <div className={`font-mono text-[10px] uppercase tracking-widest mb-2 ${useDC ? 'text-emerald-300' : 'text-violet-300'}`}>
              Use X to grow wings
            </div>
            <div className={`font-mono text-2xl font-black ${textColor}`}>Y = D</div>
            <p className={`text-xs ${subText} mt-2`}>
              By absorbing all six X cells into the rightmost column wing, the entire function
              collapses to a single variable. Zero gates needed!
            </p>
          </div>
        </div>
      </motion.div>

      {/* The rules */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.2 }}
        className={`p-8 rounded-3xl border ${cardBg}`}
      >
        <div className="flex items-center gap-2 mb-5">
          <Layers size={14} className="text-violet-400" />
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-violet-400">Three rules</span>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { n: '01', t: 'Cover all 1s', d: 'Every minterm (a real Y=1 cell) MUST be inside at least one wing. This is non-negotiable.' },
            { n: '02', t: 'Use X freely', d: 'You may include any X cell in a wing if it lets you grow the rectangle to a power-of-2 size.' },
            { n: '03', t: 'Skip lonely Xs', d: 'You don\'t have to cover X cells. If an X doesn\'t enlarge any wing, ignore it.' },
          ].map((r) => (
            <div key={r.n} className={`p-5 rounded-2xl border ${isDarkMode ? 'bg-black/30 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
              <span className="font-mono text-3xl font-black text-violet-400/60">{r.n}</span>
              <h4 className={`font-black text-sm ${textColor} mt-1`}>{r.t}</h4>
              <p className={`text-xs ${subText} leading-relaxed mt-1`}>{r.d}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
