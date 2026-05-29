import React from 'react';
import { motion } from 'framer-motion';
import { Stamp, ScrollText, Sparkles } from 'lucide-react';

interface Props { isActive: boolean; isDarkMode: boolean; }

const GRID = [
  [0, 1, 3, 2],
  [4, 5, 7, 6],
  [12, 13, 15, 14],
  [8, 9, 11, 10],
];

interface Wing { rooms: number[]; color: string; label: string; term: string; }

const WINGS: Wing[] = [
  { rooms: [0, 2, 8, 10],  color: '#a78bfa', label: 'Corner Suite (torus)', term: "B'D'" },
  { rooms: [2, 6, 14, 10], color: '#22d3ee', label: 'Vertical Corridor',    term: "CD'" },
  { rooms: [0, 1],         color: '#10b981', label: 'Standard Pair',        term: "A'B'C'" },
  { rooms: [13],           color: '#f43f5e', label: 'Lone VIP',             term: "ABC'D" },
];

export const S10_FinalBlueprint: React.FC<Props> = ({ isActive, isDarkMode }) => {
  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';

  // For each cell, collect the wings it belongs to
  const wingsForCell = (m: number) => WINGS.filter((w) => w.rooms.includes(m));

  return (
    <div className="max-w-6xl mx-auto space-y-12 py-4">
      <section className="space-y-3">
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.4em] uppercase text-cyan-400">
          <Stamp size={14} /> Chapter 10 · The Approval
        </div>
        <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>The Final Architectural Blueprint</h2>
        <p className={`text-base max-w-3xl ${subText}`}>
          Add the four wing terms together - that&apos;s the simplified Sum-of-Products. A 16-row truth table
          collapses into four short product terms. The architecture is approved.
        </p>
      </section>

      {/* The big stamp + grid */}
      <div className="grid lg:grid-cols-[1.4fr_1fr] gap-8 items-start">
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
          className={`p-6 rounded-3xl border ${cardBg} relative overflow-hidden`}
        >
          {/* APPROVED stamp */}
          <motion.div
            initial={{ opacity: 0, scale: 1.4, rotate: -25 }}
            animate={{ opacity: 0.85, scale: 1, rotate: -14 }}
            transition={{ delay: 0.6, type: 'spring', stiffness: 180, damping: 16 }}
            className="absolute top-6 right-6 z-10 px-5 py-2 border-4 rounded-md font-black text-xl tracking-widest pointer-events-none"
            style={{ borderColor: '#f43f5e', color: '#f43f5e', background: 'rgba(244,63,94,0.05)', boxShadow: '0 8px 30px rgba(244,63,94,0.18)' }}
          >
            APPROVED
          </motion.div>

          {/* Grid with overlapping wings */}
          <div className="grid grid-cols-[80px_repeat(4,minmax(0,1fr))] gap-1.5 items-end mb-1">
            <div className="text-right">
              <div className="font-mono text-[10px] uppercase tracking-widest text-cyan-300/80">A,B ↓</div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-cyan-300/80">C,D →</div>
            </div>
            {['00', '01', '11', '10'].map((cd, c) => (
              <div key={c} className="text-center font-mono text-sm text-cyan-300/90">{cd}</div>
            ))}
          </div>
          <div className="space-y-1.5">
            {['00', '01', '11', '10'].map((ab, r) => (
              <div key={r} className="grid grid-cols-[80px_repeat(4,minmax(0,1fr))] gap-1.5 items-stretch">
                <div className="flex items-center justify-end font-mono text-sm text-cyan-300/90">{ab}</div>
                {GRID[r].map((m, c) => {
                  const cellWings = wingsForCell(m);
                  return (
                    <div
                      key={c}
                      className="aspect-square rounded-lg flex items-center justify-center font-mono font-black border-2 relative overflow-hidden"
                      style={{
                        background:
                          cellWings.length > 0
                            ? `linear-gradient(135deg, ${cellWings.map((w, i) => `${w.color}${i === 0 ? '40' : '20'}`).join(', ')})`
                            : isDarkMode ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)',
                        borderColor: cellWings[0]?.color ?? (isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'),
                        boxShadow: cellWings.length > 0 ? `0 0 18px ${cellWings[0].color}55` : undefined,
                      }}
                    >
                      <span className="text-2xl" style={{ color: cellWings[0]?.color ?? (isDarkMode ? '#cbd5e1' : '#334155') }}>
                        {cellWings.length > 0 ? '1' : m}
                      </span>
                      {cellWings.length > 1 && (
                        <span className="absolute top-1 right-1 text-[9px] font-mono opacity-80" style={{ color: cellWings[1].color }}>
                          ×{cellWings.length}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
          <p className={`text-[11px] mt-5 ${subText}`}>
            Cells covered by more than one wing show a small <span className="font-mono">×n</span> badge - a
            single room is allowed to belong to multiple wings if it makes the wings bigger.
          </p>
        </motion.div>

        {/* Wings legend */}
        <motion.div
          initial={{ opacity: 0, x: 12 }} animate={isActive ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: 0.1 }}
          className={`p-6 rounded-3xl border ${cardBg} space-y-4`}
        >
          <div className="flex items-center gap-2">
            <ScrollText size={14} className="text-cyan-400" />
            <span className="font-mono text-[10px] uppercase tracking-widest text-cyan-400">Wing Legend</span>
          </div>
          <div className="space-y-3">
            {WINGS.map((w) => (
              <div
                key={w.label}
                className={`p-3 rounded-2xl border flex items-center gap-3`}
                style={{ borderColor: `${w.color}55`, background: `${w.color}0d` }}
              >
                <span className="w-4 h-4 rounded" style={{ background: w.color, boxShadow: `0 0 12px ${w.color}` }} />
                <div className="flex-1">
                  <div className={`text-sm font-bold ${textColor}`}>{w.label}</div>
                  <div className="font-mono text-[11px] opacity-60">{w.rooms.map((m) => `m${m}`).join(', ')}</div>
                </div>
                <div className="font-mono text-base font-black" style={{ color: w.color }}>
                  {w.term}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* The final equation */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.2 }}
        className={`p-10 rounded-3xl border ${cardBg} text-center`}
      >
        <div className="font-mono text-[10px] uppercase tracking-widest text-amber-400 mb-3">Simplified SOP</div>
        <div className="font-mono text-2xl md:text-4xl font-black text-amber-300 leading-tight">
          Y = B′D′ + CD′ + A′B′C′ + ABC′D
        </div>
        <div className={`text-sm mt-4 max-w-2xl mx-auto ${subText}`}>
          Eight minterms, four wings, one elegant blueprint. The K-Map turned a brittle algebraic grind into a
          <strong> visual hunt</strong> for the largest legal rectangles.
        </div>
      </motion.div>

      {/* Sanity check */}
      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.3 }}
        className={`p-6 rounded-3xl border ${cardBg}`}
      >
        <div className="flex items-center gap-2 mb-2">
          <Sparkles size={14} className="text-amber-400" />
          <div className="font-mono text-[10px] uppercase tracking-widest text-amber-400">Sanity check</div>
        </div>
        <p className={`text-[13px] leading-relaxed ${subText}`}>
          Every premium guest must be covered by at least one wing. Every non-premium room must <em>not</em> be
          covered by any wing. Trace each of the 8 minterms through the legend above - and confirm rooms
          {' 3, 4, 5, 7, 9, 11, 12, 15'} are all uncovered. ✓
        </p>
      </motion.div>
    </div>
  );
};
