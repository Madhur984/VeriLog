import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Table, Crosshair, MousePointerClick } from 'lucide-react';

interface Props { isActive: boolean; isDarkMode: boolean; }
type Bit = 0 | 1;

// F = A + BC ⇒ active rows = m3, m4, m5, m6, m7
type Row = { idx: number; a: Bit; b: Bit; c: Bit; bc: Bit; f: Bit };
const ROWS: Row[] = Array.from({ length: 8 }, (_, i) => {
  const a = ((i >> 2) & 1) as Bit;
  const b = ((i >> 1) & 1) as Bit;
  const c = (i & 1) as Bit;
  const bc = ((b === 1 && c === 1) ? 1 : 0) as Bit;
  const f = ((a === 1 || bc === 1) ? 1 : 0) as Bit;
  return { idx: i, a, b, c, bc, f };
});

export const S03_TruthTable: React.FC<Props> = ({ isActive, isDarkMode }) => {
  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText   = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg    = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';

  const [bits, setBits] = useState<{ a: Bit; b: Bit; c: Bit }>({ a: 0, b: 1, c: 1 });
  const pickedIdx = (bits.a << 2) | (bits.b << 1) | bits.c;
  const r = ROWS[pickedIdx];
  const minterms = useMemo(() => ROWS.filter((row) => row.f === 1).map((row) => row.idx), []);

  const flip = (k: 'a' | 'b' | 'c') => setBits((p) => ({ ...p, [k]: p[k] === 1 ? 0 : 1 }));

  return (
    <div className="max-w-6xl mx-auto space-y-12 py-4">
      <section className="space-y-3">
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.4em] uppercase text-orange-400">
          <Table size={14} /> Step 2 · Define the Absolute Truth
        </div>
        <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>Eight rows. Five active.</h2>
        <p className={`text-base max-w-3xl ${subText}`}>
          Three inputs ⇒ <strong>2³ = 8 scenarios</strong>. Test each one against the rule
          (<em>A alone, or B and C together</em>) and write 1 if the vault should open. Click a
          row OR toggle the input pads - the table and the live trace stay in sync.
        </p>
      </section>

      {/* Vault rule statement with live evaluation */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        className={`p-6 rounded-3xl border ${cardBg} relative overflow-hidden`}
        style={{
          background: r.f === 1
            ? (isDarkMode ? 'radial-gradient(circle at 100% 0%, rgba(34,197,94,0.10), transparent 70%)' : 'radial-gradient(circle at 100% 0%, rgba(34,197,94,0.06), transparent 70%)')
            : 'transparent',
        }}
      >
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex-1 min-w-0">
            <div className="font-mono text-[10px] uppercase tracking-widest text-orange-300 mb-2">Vault unlock rule</div>
            <p className={`text-sm ${textColor}`}>
              The vault unlocks (<strong className="text-emerald-300">F = 1</strong>) when{' '}
              <strong>A is engaged alone</strong>, or when <strong>both B and C are engaged together</strong>.
            </p>
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={r.f}
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.7, opacity: 0 }}
              className="px-4 py-2 rounded-2xl font-mono font-black text-sm border-2"
              style={{
                color: r.f ? '#22c55e' : '#ef4444',
                borderColor: r.f ? '#22c55e' : '#ef4444',
                background: r.f ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.10)',
              }}
            >
              {r.f === 1 ? '✓ UNLOCK' : '✕ LOCK'}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-[1.3fr_1fr] gap-8 items-start">
        {/* Truth table */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
          className={`p-6 rounded-3xl border ${cardBg}`}
        >
          <div className="grid grid-cols-[44px_repeat(5,1fr)] gap-x-1 gap-y-1 font-mono text-xs">
            <div className="opacity-40 px-2 py-2">#</div>
            <div className="px-2 py-2 text-center text-orange-300 font-black">A</div>
            <div className="px-2 py-2 text-center text-cyan-300 font-black">B</div>
            <div className="px-2 py-2 text-center text-amber-300 font-black">C</div>
            <div className="px-2 py-2 text-center text-fuchsia-300">B·C</div>
            <div className="px-2 py-2 text-center text-emerald-300 font-black">F</div>

            {ROWS.map((row, i) => {
              const isPicked = pickedIdx === row.idx;
              const isMin = row.f === 1;
              return (
                <React.Fragment key={row.idx}>
                  <motion.button
                    onClick={() => setBits({ a: row.a, b: row.b, c: row.c })}
                    initial={{ opacity: 0, x: -10 }}
                    animate={isActive ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.05 * i }}
                    whileHover={{ scale: 1.02 }}
                    className={`text-left px-2 py-2 rounded-l-md transition-all ${
                      isPicked
                        ? 'bg-orange-400/20 border border-orange-400/60'
                        : isMin
                          ? 'bg-emerald-500/10'
                          : (isDarkMode ? 'bg-white/[0.02]' : 'bg-slate-50')
                    }`}
                  >
                    m{row.idx}
                  </motion.button>
                  {(['a', 'b', 'c', 'bc', 'f'] as const).map((k, j) => {
                    const v = row[k];
                    const isLast = j === 4;
                    return (
                      <motion.button
                        key={k}
                        onClick={() => setBits({ a: row.a, b: row.b, c: row.c })}
                        initial={{ opacity: 0 }}
                        animate={isActive ? { opacity: 1 } : {}}
                        transition={{ delay: 0.05 * i + 0.02 * j }}
                        whileHover={{ scale: 1.02 }}
                        className={`px-2 py-2 text-center cursor-pointer transition-all ${
                          isPicked
                            ? 'bg-orange-400/15 border-y border-orange-400/40'
                            : isMin && k === 'f'
                              ? 'bg-emerald-500/15'
                              : (isDarkMode ? 'bg-white/[0.02]' : 'bg-slate-50')
                        } ${isLast ? 'rounded-r-md' : ''}`}
                      >
                        <span
                          className={
                            k === 'f'
                              ? v === 1 ? 'text-emerald-300 font-black' : 'opacity-50'
                              : v === 1 ? textColor : 'opacity-50'
                          }
                        >
                          {v}
                        </span>
                      </motion.button>
                    );
                  })}
                </React.Fragment>
              );
            })}
          </div>
          <div className="mt-4 flex items-center gap-2 text-[10px] font-mono flex-wrap">
            <MousePointerClick size={11} className="text-orange-400" />
            <span className="opacity-60">Click any row OR use the input pads on the right</span>
          </div>
        </motion.div>

        {/* Live input pads + trace */}
        <motion.div
          initial={{ opacity: 0, x: 16 }} animate={isActive ? { opacity: 1, x: 0 } : {}}
          className="space-y-4"
        >
          {/* Input pads */}
          <div className={`p-6 rounded-3xl border ${cardBg}`}>
            <div className="font-mono text-[10px] uppercase tracking-widest text-orange-300 mb-3">Input pads</div>
            <div className="grid grid-cols-3 gap-3">
              {([
                { k: 'a' as const, label: 'A · Retinal',  color: '#fb923c', v: bits.a },
                { k: 'b' as const, label: 'B · Keycard',  color: '#22d3ee', v: bits.b },
                { k: 'c' as const, label: 'C · Override', color: '#f59e0b', v: bits.c },
              ]).map((p) => (
                <motion.button
                  key={p.k}
                  onClick={() => flip(p.k)}
                  whileTap={{ scale: 0.94 }}
                  className="relative aspect-square rounded-2xl border-2 grid place-items-center font-mono font-black transition-all"
                  style={{
                    borderColor: p.color,
                    background: p.v ? p.color : 'transparent',
                    color: p.v ? '#000' : p.color,
                    boxShadow: p.v ? `0 0 25px ${p.color}66` : 'none',
                  }}
                >
                  <div className="text-center">
                    <div className="text-[9px] uppercase tracking-widest mb-1 opacity-80">{p.label}</div>
                    <div className="text-4xl">{p.v}</div>
                  </div>
                  {p.v === 1 && (
                    <motion.div
                      className="absolute inset-0 rounded-2xl pointer-events-none"
                      animate={{ opacity: [0.2, 0.6, 0.2] }}
                      transition={{ duration: 1.8, repeat: Infinity }}
                      style={{ background: `linear-gradient(135deg, transparent, ${p.color}33, transparent)` }}
                    />
                  )}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Live trace */}
          <div className={`p-6 rounded-3xl border ${cardBg} space-y-3`}>
            <div className="font-mono text-[10px] uppercase tracking-widest text-amber-300">Live trace</div>
            <div className={`text-2xl font-black ${textColor}`}>
              Scenario m{r.idx} · ({r.a}, {r.b}, {r.c})
            </div>
            <ul className="space-y-2 text-xs font-mono">
              <motion.li
                key={`bc-${r.idx}`}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                className={`p-3 rounded-xl border ${isDarkMode ? 'bg-black/30 border-white/10' : 'bg-slate-50 border-slate-200'}`}
              >
                <span className="text-fuchsia-300">B · C</span>
                <span className={textColor}> = {r.b} · {r.c} = </span>
                <strong className={r.bc ? 'text-emerald-300' : 'text-rose-300'}>{r.bc}</strong>
                <span className="opacity-60">{r.bc ? ' · both engaged' : ' · at least one idle'}</span>
              </motion.li>
              <motion.li
                key={`a-${r.idx}`}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 }}
                className={`p-3 rounded-xl border ${isDarkMode ? 'bg-black/30 border-white/10' : 'bg-slate-50 border-slate-200'}`}
              >
                <span className="text-orange-300">A alone</span>
                <span className={textColor}> = </span>
                <strong className={r.a ? 'text-emerald-300' : 'text-rose-300'}>{r.a}</strong>
              </motion.li>
              <motion.li
                key={`f-${r.idx}`}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="p-3 rounded-xl border-2 border-emerald-400/40 bg-emerald-500/10"
              >
                <span className="text-emerald-300">F = A + B·C</span>
                <span className={textColor}> = {r.a} + {r.bc} = </span>
                <strong className={r.f ? 'text-emerald-300' : 'text-rose-300'}>{r.f}</strong>
                <span className="opacity-60">{r.f ? ' · UNLOCK' : ' · LOCK'}</span>
              </motion.li>
            </ul>
          </div>
        </motion.div>
      </div>

      {/* Active minterms summary */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.3 }}
        className={`p-8 rounded-3xl border ${cardBg}`}
      >
        <div className="flex items-center gap-2 mb-4">
          <Crosshair size={14} className="text-emerald-400" />
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-emerald-400">
            The active states · F = 1
          </span>
        </div>
        <p className={`text-sm ${subText} mb-4`}>
          Five glowing rows. Each one is a <strong className="text-emerald-300">minterm</strong> -
          a singular input combination that opens the vault.
        </p>
        <div className="flex items-center gap-3 flex-wrap">
          {minterms.map((m, i) => {
            const row = ROWS[m];
            const isCurrent = pickedIdx === m;
            return (
              <motion.button
                key={m}
                onClick={() => setBits({ a: row.a, b: row.b, c: row.c })}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isActive ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.4 + i * 0.06, type: 'spring' }}
                whileHover={{ scale: 1.06 }}
                className="px-4 py-2 rounded-xl border transition-all"
                style={{
                  borderColor: isCurrent ? '#22c55e' : 'rgba(34,197,94,0.4)',
                  background: isCurrent ? 'rgba(34,197,94,0.20)' : 'rgba(34,197,94,0.10)',
                  boxShadow: isCurrent ? '0 0 20px rgba(34,197,94,0.45)' : 'none',
                }}
              >
                <span className="font-mono text-emerald-300 font-black">m{m}</span>
                <span className={`font-mono text-xs ml-2 ${subText}`}>
                  ({row.a}, {row.b}, {row.c})
                </span>
              </motion.button>
            );
          })}
        </div>
        <div className={`mt-4 text-xs font-mono ${subText}`}>
          Compact form: <strong className={textColor}>F(A,B,C) = Σm({minterms.join(', ')})</strong>
        </div>
      </motion.div>
    </div>
  );
};
