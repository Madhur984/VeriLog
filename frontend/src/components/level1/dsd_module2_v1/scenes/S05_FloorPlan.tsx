import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Map, MousePointerClick } from 'lucide-react';

interface Props { isActive: boolean; isDarkMode: boolean; }

const ROW_LABELS = ['00', '01', '11', '10']; // AB
const COL_LABELS = ['00', '01', '11', '10']; // CD

// Build the standard 4-variable K-Map grid: rowsAB × colsCD → minterm number
// minterm m = (A<<3)|(B<<2)|(C<<1)|D
function mintermAt(row: number, col: number) {
  const ab = ROW_LABELS[row];
  const cd = COL_LABELS[col];
  const A = parseInt(ab[0], 2);
  const B = parseInt(ab[1], 2);
  const C = parseInt(cd[0], 2);
  const D = parseInt(cd[1], 2);
  return (A << 3) | (B << 2) | (C << 1) | D;
}

const minTermLabel = (m: number) => {
  const A = (m >> 3) & 1, B = (m >> 2) & 1, C = (m >> 1) & 1, D = m & 1;
  const lit = (v: number, s: string) => (v ? s : `${s}'`);
  return `${lit(A, 'A')}${lit(B, 'B')}${lit(C, 'C')}${lit(D, 'D')}`;
};

const minTermBinary = (m: number) =>
  m.toString(2).padStart(4, '0');

export const S05_FloorPlan: React.FC<Props> = ({ isActive, isDarkMode }) => {
  const [hover, setHover] = useState<{ r: number; c: number } | null>(null);

  const grid = useMemo(() => {
    return Array.from({ length: 4 }, (_, r) =>
      Array.from({ length: 4 }, (_, c) => mintermAt(r, c))
    );
  }, []);

  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';

  const hovered = hover ? grid[hover.r][hover.c] : null;

  return (
    <div className="max-w-6xl mx-auto space-y-12 py-4">
      <section className="space-y-3">
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.4em] uppercase text-amber-400">
          <Map size={14} /> Chapter 05 · The Canvas
        </div>
        <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>The Master Floor Plan</h2>
        <p className={`text-base max-w-3xl ${subText}`}>
          Because the row-axis (AB) and column-axis (CD) are <strong>both Gray-coded</strong>, the decimal room
          numbers don&apos;t run sequentially — they zig-zag. Every shared border on this 4×4 plan corresponds to
          one shared Boolean variable.
        </p>
      </section>

      {/* The grid + legend */}
      <div className="grid lg:grid-cols-[1.4fr_1fr] gap-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
          className={`p-6 rounded-3xl border ${cardBg}`}
        >
          <div className="flex items-center gap-2 mb-4">
            <MousePointerClick size={14} className="text-amber-400" />
            <span className="font-mono text-[10px] uppercase tracking-widest text-amber-400">Hover any room to inspect</span>
          </div>

          {/* CD column header */}
          <div className="grid grid-cols-[80px_repeat(4,minmax(0,1fr))] gap-1.5 items-end mb-1">
            <div className="text-right">
              <div className="font-mono text-[10px] uppercase tracking-widest text-amber-300/80">A,B</div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-amber-300/80">↓</div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-amber-300/80 mt-1">C,D →</div>
            </div>
            {COL_LABELS.map((cd, c) => (
              <div key={c} className="text-center font-mono text-sm text-amber-300/90">{cd}</div>
            ))}
          </div>

          {/* Rows */}
          <div className="space-y-1.5">
            {ROW_LABELS.map((ab, r) => (
              <div key={r} className="grid grid-cols-[80px_repeat(4,minmax(0,1fr))] gap-1.5 items-stretch">
                <div className="flex items-center justify-end font-mono text-sm text-amber-300/90">{ab}</div>
                {grid[r].map((m, c) => {
                  const isHover = hover?.r === r && hover?.c === c;
                  return (
                    <button
                      key={c}
                      onMouseEnter={() => setHover({ r, c })}
                      onMouseLeave={() => setHover(null)}
                      className="aspect-square rounded-lg flex flex-col items-center justify-center font-mono font-black border-2 transition-all relative overflow-hidden"
                      style={{
                        background: isHover ? 'rgba(252,211,77,0.18)' : isDarkMode ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)',
                        borderColor: isHover ? '#fcd34d' : isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                        boxShadow: isHover ? '0 0 18px rgba(252,211,77,0.4)' : undefined,
                      }}
                    >
                      <span className={`text-2xl ${isHover ? 'text-amber-300' : isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>
                        {m}
                      </span>
                      <span className="text-[9px] opacity-50">{minTermBinary(m)}</span>
                    </button>
                  );
                })}
              </div>
            ))}
          </div>

          <p className={`text-[11px] mt-4 ${subText}`}>
            Decimal sequence reads <span className="font-mono text-amber-300">0,1,3,2 / 4,5,7,6 / 12,13,15,14 / 8,9,11,10</span>.
            That zig-zag <em>is</em> the Gray code in disguise.
          </p>
        </motion.div>

        {/* Inspector */}
        <motion.div
          initial={{ opacity: 0, x: 12 }} animate={isActive ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: 0.1 }}
          className={`p-6 rounded-3xl border ${cardBg} space-y-4`}
        >
          <div className="font-mono text-[10px] uppercase tracking-widest text-amber-400">Room Inspector</div>
          {hovered === null ? (
            <div className={`text-sm ${subText}`}>Hover any room on the grid to see its minterm anatomy.</div>
          ) : (
            <>
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-5xl font-black text-amber-300">{hovered}</span>
                <span className="font-mono text-sm opacity-60">m{hovered} · {minTermBinary(hovered)}</span>
              </div>
              <div className={`text-sm ${textColor}`}>
                <span className="font-mono text-amber-300 text-lg">{minTermLabel(hovered)}</span>
              </div>
              <div className="grid grid-cols-4 gap-2 text-center">
                {(['A', 'B', 'C', 'D'] as const).map((v, i) => {
                  const bit = (hovered >> (3 - i)) & 1;
                  return (
                    <div
                      key={v}
                      className="rounded-lg py-2 border"
                      style={{
                        background: bit ? 'rgba(252,211,77,0.15)' : isDarkMode ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)',
                        borderColor: bit ? 'rgba(252,211,77,0.45)' : isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
                        color: bit ? '#fde68a' : undefined,
                      }}
                    >
                      <div className="font-mono text-xs opacity-60">{v}</div>
                      <div className="font-black text-lg">{bit}</div>
                    </div>
                  );
                })}
              </div>
              <div className={`text-[11px] ${subText}`}>
                Each lit cell means that variable is <strong>uncomplemented</strong> in the minterm. Its neighbours
                in the grid differ from this room by exactly one of those bits — that wall is the variable they
                disagree on.
              </div>
            </>
          )}
        </motion.div>
      </div>

      {/* Reading the axes */}
      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.2 }}
        className={`p-6 rounded-3xl border ${cardBg}`}
      >
        <div className="font-mono text-[10px] uppercase tracking-widest text-amber-400 mb-2">How to read the axes</div>
        <div className="grid md:grid-cols-2 gap-6">
          <p className={`text-sm leading-relaxed ${subText}`}>
            <strong>Rows (AB):</strong> top-to-bottom run 00, 01, 11, 10. So a horizontal corridor between row 1
            and row 2 (01 → 11) flips only A. The shared variable on that wall is <span className="font-mono text-amber-300">B</span>.
          </p>
          <p className={`text-sm leading-relaxed ${subText}`}>
            <strong>Columns (CD):</strong> left-to-right run 00, 01, 11, 10. A vertical corridor between col 1 and
            col 2 (01 → 11) flips only C. The shared variable on that wall is <span className="font-mono text-amber-300">D</span>.
          </p>
        </div>
      </motion.div>
    </div>
  );
};
