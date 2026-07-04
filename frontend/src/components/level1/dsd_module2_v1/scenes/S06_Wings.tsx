import React from 'react';
import { motion } from 'framer-motion';
import { Building2, Check, X as XIcon, Wind } from 'lucide-react';

interface Props { isActive: boolean; isDarkMode: boolean; }

const SHAPES: Array<{ size: string; cells: number; vars: string; }> = [
  { size: '1×1', cells: 1,  vars: '4 vars in term' },
  { size: '1×2', cells: 2,  vars: '3 vars in term' },
  { size: '2×2', cells: 4,  vars: '2 vars in term' },
  { size: '2×4', cells: 8,  vars: '1 var in term' },
  { size: '4×4', cells: 16, vars: 'F = 1 always' },
];

const Mini: React.FC<{ rows: number; cols: number; lit?: boolean[][]; isDarkMode: boolean }> = ({ rows, cols, lit, isDarkMode }) => (
  <div
    className="grid gap-0.5 p-1.5 rounded"
    style={{ background: isDarkMode ? 'rgba(0,0,0,0.25)' : 'rgba(0,0,0,0.05)', gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`, gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))` }}
  >
    {Array.from({ length: rows * cols }).map((_, i) => {
      const r = Math.floor(i / cols);
      const c = i % cols;
      const isLit = lit ? lit[r]?.[c] : false;
      return (
        <div
          key={i}
          className="aspect-square rounded-sm"
          style={{
            background: isLit ? 'rgba(252,211,77,0.6)' : isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.9)',
            border: isDarkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.12)',
            boxShadow: isLit ? '0 0 6px rgba(252,211,77,0.5)' : undefined,
          }}
        />
      );
    })}
  </div>
);

const allowedExamples = [
  { label: '1×1', rows: 4, cols: 4, lit: [[false,false,true,false],[false,false,false,false],[false,false,false,false],[false,false,false,false]] as boolean[][] },
  { label: '1×2', rows: 4, cols: 4, lit: [[true,true,false,false],[false,false,false,false],[false,false,false,false],[false,false,false,false]] as boolean[][] },
  { label: '2×2', rows: 4, cols: 4, lit: [[false,false,false,false],[false,true,true,false],[false,true,true,false],[false,false,false,false]] as boolean[][] },
  { label: '1×4', rows: 4, cols: 4, lit: [[false,false,false,false],[false,false,false,false],[true,true,true,true],[false,false,false,false]] as boolean[][] },
];

const illegalExamples = [
  { label: 'L-shape', rows: 4, cols: 4, lit: [[true,true,false,false],[true,false,false,false],[false,false,false,false],[false,false,false,false]] as boolean[][] },
  { label: 'Diagonal', rows: 4, cols: 4, lit: [[true,false,false,false],[false,true,false,false],[false,false,true,false],[false,false,false,true]] as boolean[][] },
  { label: 'Zigzag', rows: 4, cols: 4, lit: [[true,true,false,false],[false,true,true,false],[false,false,false,false],[false,false,false,false]] as boolean[][] },
  { label: 'Group of 3', rows: 4, cols: 4, lit: [[true,true,true,false],[false,false,false,false],[false,false,false,false],[false,false,false,false]] as boolean[][] },
];

export const S06_Wings: React.FC<Props> = ({ isActive, isDarkMode }) => {
  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';

  return (
    <div className="max-w-6xl mx-auto space-y-12 py-4">
      <section className="space-y-3">
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.4em] uppercase text-emerald-400">
          <Building2 size={14} /> Chapter 06 · Rule 2
        </div>
        <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>The Wings · Powers of Two</h2>
        <p className={`text-base max-w-3xl ${subText}`}>
          Madhur upgrades premium guests by grouping rooms into <strong>Wings</strong>. But his HVAC system only
          comes in standard capacities - strictly integer <em>powers of two</em>. Bigger wings eliminate more
          variables, so the goal is always <span className="text-emerald-300 font-bold">go as large as possible</span>.
        </p>
      </section>

      {/* Wing capacities strip */}
      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        className={`p-8 rounded-3xl border ${cardBg}`}
      >
        <div className="flex items-center gap-2 mb-6">
          <Wind size={14} className="text-emerald-400" />
          <span className="font-mono text-[10px] uppercase tracking-widest text-emerald-400">Standardised HVAC capacities</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {SHAPES.map((s) => (
            <div key={s.size} className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-black/30 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
              <div className="font-mono text-[10px] uppercase tracking-widest text-emerald-300 mb-2">{s.size}</div>
              <div className={`text-2xl font-black mb-1 ${textColor}`}>Capacity {s.cells}</div>
              <div className={`text-[11px] ${subText}`}>{s.vars}</div>
            </div>
          ))}
        </div>
        <p className={`text-[12px] mt-6 ${subText}`}>
          Every doubling of a wing kills one variable from the resulting product term. A 4-cell wing is two variables
          shorter than a 1-cell wing. <strong className="text-emerald-300">Bigger always wins.</strong>
        </p>
      </motion.div>

      {/* Allowed vs Illegal */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Allowed */}
        <motion.div
          initial={{ opacity: 0, x: -12 }} animate={isActive ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: 0.1 }}
          className={`p-6 rounded-3xl border ${cardBg}`}
        >
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-400/40 flex items-center justify-center text-emerald-300">
              <Check size={16} />
            </div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-emerald-400">Allowed Wings</div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {allowedExamples.map((ex) => (
              <div key={ex.label} className="space-y-2">
                <Mini rows={ex.rows} cols={ex.cols} lit={ex.lit} isDarkMode={isDarkMode} />
                <div className={`text-xs font-mono text-center ${subText}`}>{ex.label}</div>
              </div>
            ))}
          </div>
          <p className={`text-[11px] mt-5 ${subText}`}>
            Perfect rectangles or squares only. Edges must align. Each cell shares a wall with at least one
            other cell in the wing.
          </p>
        </motion.div>

        {/* Illegal */}
        <motion.div
          initial={{ opacity: 0, x: 12 }} animate={isActive ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: 0.2 }}
          className={`p-6 rounded-3xl border ${cardBg}`}
        >
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 rounded-lg bg-rose-500/15 border border-rose-400/40 flex items-center justify-center text-rose-300">
              <XIcon size={16} />
            </div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-rose-400">Illegal Wings</div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {illegalExamples.map((ex) => (
              <div key={ex.label} className="space-y-2 relative">
                <Mini rows={ex.rows} cols={ex.cols} lit={ex.lit} isDarkMode={isDarkMode} />
                <div className="absolute top-1 right-1 w-6 h-6 rounded-full bg-rose-500/80 flex items-center justify-center text-white text-xs font-black">
                  ✕
                </div>
                <div className={`text-xs font-mono text-center ${subText}`}>{ex.label}</div>
              </div>
            ))}
          </div>
          <p className={`text-[11px] mt-5 ${subText}`}>
            L-shapes don&apos;t share enough walls. Diagonals share none. Zig-zags break adjacency.
            And groups of 3, 5, 6 etc. aren&apos;t powers of two - HVAC won&apos;t install them.
          </p>
        </motion.div>
      </div>

      {/* Architectural law */}
      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.3 }}
        className={`p-6 rounded-3xl border ${cardBg}`}
      >
        <div className="font-mono text-[10px] uppercase tracking-widest text-emerald-400 mb-2">Architectural Law</div>
        <p className={`text-base leading-relaxed ${textColor}`}>
          A wing is a <strong>perfect rectangle</strong> whose <strong>area is a power of two</strong>. That is
          the entire grouping rulebook. Once you internalise it, the rest of K-Map solving is just: find the
          fewest, biggest legal wings that cover every premium room.
        </p>
      </motion.div>
    </div>
  );
};
