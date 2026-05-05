import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Table, AlertTriangle, Crosshair } from 'lucide-react';

interface Props { isActive: boolean; isDarkMode: boolean; }

type Row = { idx: number; a: 0 | 1; b: 0 | 1; c: 0 | 1; ab: 0 | 1; acn: 0 | 1; y: 0 | 1 };

const ROWS: Row[] = Array.from({ length: 8 }, (_, i) => {
  const a = ((i >> 2) & 1) as 0 | 1;
  const b = ((i >> 1) & 1) as 0 | 1;
  const c = (i & 1) as 0 | 1;
  const ab = ((a === 1 && b === 1) ? 1 : 0) as 0 | 1;
  const cn = (c === 0 ? 1 : 0) as 0 | 1;
  const acn = ((a === 1 && cn === 1) ? 1 : 0) as 0 | 1;
  const y = ((ab === 1 || acn === 1) ? 1 : 0) as 0 | 1;
  return { idx: i, a, b, c, ab, acn, y };
});

export const S09_TruthTableLab: React.FC<Props> = ({ isActive, isDarkMode }) => {
  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText   = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg    = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';

  const [picked, setPicked] = useState<number | null>(4);
  const minterms = useMemo(() => ROWS.filter(r => r.y === 1).map(r => r.idx), []);

  return (
    <div className="max-w-6xl mx-auto space-y-14 py-4">
      <section className="space-y-3">
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.4em] uppercase text-amber-400">
          <Table size={14} /> Chapter 09 · The Truth Table
        </div>
        <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>Exhausting the Possibilities</h2>
        <p className={`text-base max-w-3xl ${subText}`}>
          With 3 independent doors there are exactly{' '}
          <strong className="text-amber-300">2³ = 8</strong> possible scenarios. Click any row
          to walk that scenario through the circuit and see how the intermediate paths and the
          final Y light up.
        </p>
      </section>

      <div className="grid lg:grid-cols-[1.3fr_1fr] gap-8 items-start">
        {/* The actual interactive truth table */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
          className={`p-6 rounded-3xl border ${cardBg}`}
        >
          <div className="grid grid-cols-[44px_repeat(6,1fr)] gap-x-1 gap-y-1 font-mono text-xs">
            {/* Header */}
            <div className="opacity-40 px-2 py-2">#</div>
            <div className="px-2 py-2 text-center text-amber-300 font-black">A</div>
            <div className="px-2 py-2 text-center text-cyan-300 font-black">B</div>
            <div className="px-2 py-2 text-center text-violet-300 font-black">C</div>
            <div className="px-2 py-2 text-center text-amber-200">A·B</div>
            <div className="px-2 py-2 text-center text-amber-200">A·C′</div>
            <div className="px-2 py-2 text-center text-emerald-300 font-black">Y</div>

            {ROWS.map((r) => {
              const isPicked = picked === r.idx;
              const isMin = r.y === 1;
              return (
                <React.Fragment key={r.idx}>
                  <button
                    onClick={() => setPicked(r.idx)}
                    className={`text-left px-2 py-2 rounded-l-md transition-all ${
                      isPicked ? 'bg-amber-400/20 border border-amber-400/60' : isMin ? 'bg-emerald-500/10' : 'bg-white/3'
                    }`}
                  >
                    m{r.idx}
                  </button>
                  {(['a', 'b', 'c', 'ab', 'acn', 'y'] as const).map((k, i) => {
                    const v = r[k];
                    const isLast = i === 5;
                    const cls = `px-2 py-2 text-center transition-all cursor-pointer ${
                      isPicked ? 'bg-amber-400/15 border-y border-amber-400/40' : isMin && k === 'y' ? 'bg-emerald-500/15' : 'bg-white/3'
                    } ${isLast ? 'rounded-r-md' : ''}`;
                    return (
                      <button
                        key={k}
                        onClick={() => setPicked(r.idx)}
                        className={cls}
                      >
                        <span className={
                          k === 'y'
                            ? v === 1 ? 'text-emerald-300 font-black' : 'opacity-50'
                            : v === 1 ? 'text-white' : 'opacity-50'
                        }>
                          {v}
                        </span>
                      </button>
                    );
                  })}
                </React.Fragment>
              );
            })}
          </div>
          <div className="mt-4 flex items-center gap-2 text-[10px] font-mono">
            <span className="opacity-40">Highlight legend:</span>
            <span className="px-2 py-0.5 rounded bg-amber-400/20 border border-amber-400/60 text-amber-200">selected</span>
            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-200">minterm (Y=1)</span>
          </div>
        </motion.div>

        {/* Step trace */}
        <motion.div
          initial={{ opacity: 0, x: 16 }} animate={isActive ? { opacity: 1, x: 0 } : {}}
          className={`p-6 rounded-3xl border ${cardBg} space-y-4`}
        >
          <div className="font-mono text-[10px] uppercase tracking-widest text-amber-300">Live trace</div>
          {picked !== null ? (
            <>
              {(() => {
                const r = ROWS[picked];
                return (
                  <div className="space-y-3">
                    <div className={`text-2xl font-black ${textColor}`}>
                      Scenario m{r.idx}: ({r.a}, {r.b}, {r.c})
                    </div>
                    <ul className="space-y-2 text-xs font-mono">
                      <li className={`p-3 rounded-xl border ${isDarkMode ? 'bg-black/30 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                        <span className="text-amber-300">Path 1 = A · B = </span>
                        <span className={textColor}>{r.a} · {r.b} = </span>
                        <strong className={r.ab ? 'text-emerald-300' : 'text-rose-300'}>{r.ab}</strong>
                        <span className="opacity-60"> {r.ab ? '(Clear!)' : '(Blocked)'}</span>
                      </li>
                      <li className={`p-3 rounded-xl border ${isDarkMode ? 'bg-black/30 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                        <span className="text-amber-300">Path 2 = A · C′ = </span>
                        <span className={textColor}>{r.a} · ({r.c})′ → {r.a} · {r.c === 0 ? 1 : 0} = </span>
                        <strong className={r.acn ? 'text-emerald-300' : 'text-rose-300'}>{r.acn}</strong>
                        <span className="opacity-60"> {r.acn ? '(Clear!)' : '(Blocked)'}</span>
                      </li>
                      <li className="p-3 rounded-xl border-2 border-emerald-400/40 bg-emerald-500/10">
                        <span className="text-emerald-300">Final · Y = Path1 + Path2 = </span>
                        <span className={textColor}>{r.ab} + {r.acn} = </span>
                        <strong className={r.y ? 'text-emerald-300' : 'text-rose-300'}>{r.y}</strong>
                        <span className="opacity-60"> {r.y ? '· Vault Opens' : '· Locked'}</span>
                      </li>
                    </ul>
                  </div>
                );
              })()}
            </>
          ) : (
            <p className={`text-sm ${subText}`}>Pick a row to see the substitution unfold.</p>
          )}
        </motion.div>
      </div>

      {/* Casebook references combined */}
      <div className="grid md:grid-cols-3 gap-4">
        {[
          { src: '/images/noir/p10.png', label: 'Casebook 10 · Setup' },
          { src: '/images/noir/p11.png', label: 'Casebook 11 · Test scenario' },
          { src: '/images/noir/p12.png', label: 'Casebook 12 · Minterms' },
        ].map((p, i) => (
          <motion.div
            key={p.src}
            initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.15 * i }}
            className={`relative rounded-2xl overflow-hidden border ${cardBg}`}
          >
            <img src={p.src} alt={p.label} className="w-full block aspect-[16/9] object-cover" />
            <div className="absolute bottom-2 right-3 font-mono text-[9px] uppercase tracking-widest text-amber-200/70">
              {p.label}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Minterm summary */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.3 }}
        className={`p-8 rounded-3xl border ${cardBg}`}
      >
        <div className="flex items-center gap-2 mb-4">
          <Crosshair size={14} className="text-emerald-400" />
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-emerald-400">
            The Breach Minterms
          </span>
        </div>
        <p className={`text-sm ${subText} mb-4`}>
          The glowing rows reveal the exact, singular scenarios where the security system is
          breached. In digital logic, combinations that produce a 1 output are called{' '}
          <strong className="text-emerald-300">minterms</strong>.
        </p>
        <div className="flex items-center gap-3 flex-wrap">
          {minterms.map((m) => {
            const r = ROWS[m];
            return (
              <div key={m} className="px-4 py-2 rounded-xl border border-emerald-400/40 bg-emerald-500/10">
                <span className="font-mono text-emerald-300 font-black">m{m}</span>
                <span className={`font-mono text-xs ml-2 ${subText}`}>
                  ({r.a}, {r.b}, {r.c})
                </span>
              </div>
            );
          })}
        </div>
        <div className="mt-4 flex items-center gap-2 text-xs font-mono">
          <AlertTriangle size={12} className="text-amber-300" />
          <span className={subText}>
            Y = Σm({minterms.join(', ')}) — the canonical minterm-list notation.
          </span>
        </div>
      </motion.div>
    </div>
  );
};
