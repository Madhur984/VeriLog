import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Map, MousePointerClick } from 'lucide-react';
import { TryItYourself } from '../../../ui/TryItYourself';

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
          numbers don&apos;t run sequentially - they zig-zag. Every shared border on this 4×4 plan corresponds to
          one shared Boolean variable.
        </p>
      </section>

      {/* The grid + legend */}
      <div className="grid lg:grid-cols-[1.4fr_1fr] gap-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
          className={`relative p-6 rounded-3xl border ${cardBg}`}
        >
          <TryItYourself corner />
          <div className="flex items-center gap-2 mb-4">
            <MousePointerClick size={14} className="text-amber-400" />
            <span className="font-mono text-[10px] uppercase tracking-widest text-amber-400">Hover any room to inspect</span>
          </div>

          {/* CD column header */}
          <div className="grid grid-cols-[48px_repeat(4,minmax(0,1fr))] sm:grid-cols-[80px_repeat(4,minmax(0,1fr))] gap-1.5 items-end mb-1">
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
              <div key={r} className="grid grid-cols-[48px_repeat(4,minmax(0,1fr))] sm:grid-cols-[80px_repeat(4,minmax(0,1fr))] gap-1.5 items-stretch">
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
                in the grid differ from this room by exactly one of those bits - that wall is the variable they
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
        <div className="font-mono text-[10px] uppercase tracking-widest text-amber-400 mb-4">How to read the axes</div>
        <div className="grid md:grid-cols-2 gap-6">
          <p className={`text-sm leading-relaxed ${subText}`}>
            <strong>Rows (AB):</strong> top-to-bottom run 00, 01, 11, 10. So a horizontal corridor between row 1
            and row 2 (01 → 11) flips only A. The shared variable on that wall is <span className="font-mono text-amber-300">A</span>.
          </p>
          <p className={`text-sm leading-relaxed ${subText}`}>
            <strong>Columns (CD):</strong> left-to-right run 00, 01, 11, 10. A vertical corridor between col 1 and
            col 2 (01 → 11) flips only C. The shared variable on that wall is <span className="font-mono text-amber-300">C</span>.
          </p>
        </div>
      </motion.div>

      {/* Wall · variable inspector */}
      <WallInspector isActive={isActive} isDarkMode={isDarkMode} />

      {/* Side-by-side: 3 vs 4-variable map */}
      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.3 }}
        className={`p-8 rounded-3xl border ${cardBg}`}
      >
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-400/40 flex items-center justify-center text-amber-300">
            <Map size={14} />
          </div>
          <span className="font-mono text-[10px] uppercase tracking-widest text-amber-400">Scaling up · 3-var vs 4-var maps</span>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {/* 3-variable map */}
          <div>
            <div className={`text-sm font-bold mb-2 ${textColor}`}>3-variable K-Map · 8 rooms</div>
            <div className="grid grid-cols-[60px_repeat(4,minmax(0,1fr))] gap-1 items-end mb-1">
              <div />
              {['00', '01', '11', '10'].map((bc, c) => (
                <div key={c} className="text-center font-mono text-xs text-amber-300/80">{bc}</div>
              ))}
            </div>
            {[['0', [0, 1, 3, 2]], ['1', [4, 5, 7, 6]]].map(([a, row]) => (
              <div key={a as string} className="grid grid-cols-[60px_repeat(4,minmax(0,1fr))] gap-1 items-stretch mb-1">
                <div className="flex items-center justify-end font-mono text-xs text-amber-300/80">{a}</div>
                {(row as number[]).map((m) => (
                  <div
                    key={m}
                    className="aspect-square rounded flex items-center justify-center font-mono font-black border"
                    style={{
                      background: isDarkMode ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)',
                      borderColor: 'rgba(252,211,77,0.4)',
                      color: '#fde68a',
                    }}
                  >
                    {m}
                  </div>
                ))}
              </div>
            ))}
            <div className={`text-[11px] mt-2 ${subText}`}>Axes: A (rows) and BC (cols, Gray-coded)</div>
          </div>
          {/* 4-variable map preview */}
          <div>
            <div className={`text-sm font-bold mb-2 ${textColor}`}>4-variable K-Map · 16 rooms</div>
            <div className="grid grid-cols-[60px_repeat(4,minmax(0,1fr))] gap-1 items-end mb-1">
              <div />
              {['00', '01', '11', '10'].map((cd, c) => (
                <div key={c} className="text-center font-mono text-xs text-amber-300/80">{cd}</div>
              ))}
            </div>
            {[['00', [0, 1, 3, 2]], ['01', [4, 5, 7, 6]], ['11', [12, 13, 15, 14]], ['10', [8, 9, 11, 10]]].map(([ab, row]) => (
              <div key={ab as string} className="grid grid-cols-[60px_repeat(4,minmax(0,1fr))] gap-1 items-stretch mb-1">
                <div className="flex items-center justify-end font-mono text-xs text-amber-300/80">{ab}</div>
                {(row as number[]).map((m) => (
                  <div
                    key={m}
                    className="aspect-square rounded flex items-center justify-center font-mono font-black border"
                    style={{
                      background: isDarkMode ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)',
                      borderColor: 'rgba(252,211,77,0.4)',
                      color: '#fde68a',
                    }}
                  >
                    {m}
                  </div>
                ))}
              </div>
            ))}
            <div className={`text-[11px] mt-2 ${subText}`}>Axes: AB (rows) and CD (cols), both Gray-coded</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────────────── */
/*  Wall inspector · hover any wall to see which Boolean variable it      */
/*  represents.                                                            */
/* ─────────────────────────────────────────────────────────────────────── */

interface WallInfo { id: string; orient: 'h' | 'v'; row: number; col: number; variable: 'A' | 'B' | 'C' | 'D'; explanation: string; }

const WALLS: WallInfo[] = [
  // Horizontal walls (between rows)
  { id: 'h-r0c0', orient: 'h', row: 0, col: 0, variable: 'B', explanation: 'Row 00 → 01 flips only B. The wall corresponds to variable B.' },
  { id: 'h-r1c0', orient: 'h', row: 1, col: 0, variable: 'A', explanation: 'Row 01 → 11 flips only A. The wall corresponds to variable A.' },
  { id: 'h-r2c0', orient: 'h', row: 2, col: 0, variable: 'B', explanation: 'Row 11 → 10 flips only B. The wall corresponds to variable B.' },
  // Vertical walls (between cols)
  { id: 'v-r0c0', orient: 'v', row: 0, col: 0, variable: 'D', explanation: 'Col 00 → 01 flips only D. The wall corresponds to variable D.' },
  { id: 'v-r0c1', orient: 'v', row: 0, col: 1, variable: 'C', explanation: 'Col 01 → 11 flips only C. The wall corresponds to variable C.' },
  { id: 'v-r0c2', orient: 'v', row: 0, col: 2, variable: 'D', explanation: 'Col 11 → 10 flips only D. The wall corresponds to variable D.' },
];

const WallInspector: React.FC<{ isActive: boolean; isDarkMode: boolean }> = ({ isActive, isDarkMode }) => {
  const [hoverWall, setHoverWall] = React.useState<string | null>(null);
  const wall = WALLS.find((w) => w.id === hoverWall);

  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';

  const VAR_COLOR: Record<'A' | 'B' | 'C' | 'D', string> = {
    A: '#f43f5e', B: '#fcd34d', C: '#22d3ee', D: '#10b981',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: 0.25 }}
      className={`p-6 rounded-3xl border ${cardBg}`}
    >
      <div className="font-mono text-[10px] uppercase tracking-widest text-amber-400 mb-4">
        Hover any wall to see which variable it represents
      </div>

      <div className="grid md:grid-cols-[1.4fr_1fr] gap-8">
        <div className="relative">
          {/* Build a SVG-style diagram of a 2×2 corner of the K-Map with hoverable walls */}
          <svg viewBox="0 0 400 320" className="w-full">
            {/* Cells */}
            {[0, 1, 2, 3].map((c) => (
              [0, 1, 2, 3].map((r) => {
                const x = 40 + c * 80;
                const y = 20 + r * 70;
                const minterm = [
                  [0, 1, 3, 2],
                  [4, 5, 7, 6],
                  [12, 13, 15, 14],
                  [8, 9, 11, 10],
                ][r][c];
                return (
                  <g key={`${r}-${c}`}>
                    <rect x={x} y={y} width={70} height={60} rx={6}
                          fill={isDarkMode ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'}
                          stroke={isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'} />
                    <text x={x + 35} y={y + 38} textAnchor="middle" fontFamily="monospace" fontWeight="900" fontSize="20" fill={isDarkMode ? '#cbd5e1' : '#334155'}>
                      {minterm}
                    </text>
                  </g>
                );
              })
            ))}

            {/* Row labels */}
            {['00', '01', '11', '10'].map((ab, r) => (
              <text key={r} x={28} y={50 + r * 70} textAnchor="end" fontFamily="monospace" fontSize="11" fill="#fcd34d">
                {ab}
              </text>
            ))}
            {/* Col labels */}
            {['00', '01', '11', '10'].map((cd, c) => (
              <text key={c} x={75 + c * 80} y={14} textAnchor="middle" fontFamily="monospace" fontSize="11" fill="#fcd34d">
                {cd}
              </text>
            ))}

            {/* Horizontal walls (between rows) - only render the first 3 internal walls of the leftmost 2 cols for clarity */}
            {WALLS.filter((w) => w.orient === 'h').map((w) => {
              const x = 40 + w.col * 80;
              const y = 80 + w.row * 70;
              const isHover = hoverWall === w.id;
              return (
                <g key={w.id} onMouseEnter={() => setHoverWall(w.id)} onMouseLeave={() => setHoverWall(null)}>
                  {/* Hit area */}
                  <rect x={x - 4} y={y - 6} width={70 + 8} height={12} fill="transparent" style={{ cursor: 'pointer' }} />
                  <line x1={x} y1={y} x2={x + 70} y2={y}
                        stroke={isHover ? VAR_COLOR[w.variable] : 'rgba(252,211,77,0.45)'}
                        strokeWidth={isHover ? 5 : 2.5}
                        style={{ filter: isHover ? `drop-shadow(0 0 6px ${VAR_COLOR[w.variable]})` : undefined }}
                  />
                  {isHover && (
                    <text x={x + 35} y={y - 8} textAnchor="middle" fontFamily="monospace" fontWeight="900" fontSize="14" fill={VAR_COLOR[w.variable]}>
                      {w.variable}
                    </text>
                  )}
                </g>
              );
            })}

            {/* Vertical walls */}
            {WALLS.filter((w) => w.orient === 'v').map((w) => {
              const x = 110 + w.col * 80;
              const y = 20 + w.row * 70;
              const isHover = hoverWall === w.id;
              return (
                <g key={w.id} onMouseEnter={() => setHoverWall(w.id)} onMouseLeave={() => setHoverWall(null)}>
                  <rect x={x - 6} y={y - 4} width={12} height={60 + 8} fill="transparent" style={{ cursor: 'pointer' }} />
                  <line x1={x} y1={y} x2={x} y2={y + 60}
                        stroke={isHover ? VAR_COLOR[w.variable] : 'rgba(252,211,77,0.45)'}
                        strokeWidth={isHover ? 5 : 2.5}
                        style={{ filter: isHover ? `drop-shadow(0 0 6px ${VAR_COLOR[w.variable]})` : undefined }}
                  />
                  {isHover && (
                    <text x={x + 12} y={y + 35} textAnchor="start" fontFamily="monospace" fontWeight="900" fontSize="14" fill={VAR_COLOR[w.variable]}>
                      {w.variable}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        <div className="space-y-3">
          <div className="font-mono text-[10px] uppercase tracking-widest text-amber-400">Variables</div>
          {(['A', 'B', 'C', 'D'] as const).map((v) => (
            <div
              key={v}
              className={`p-2.5 rounded-xl border-2 flex items-center gap-3 transition-all ${
                wall?.variable === v ? 'scale-[1.02]' : ''
              }`}
              style={{
                borderColor: wall?.variable === v ? VAR_COLOR[v] : isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                background: wall?.variable === v ? `${VAR_COLOR[v]}1f` : undefined,
              }}
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center font-mono font-black text-base"
                   style={{ background: VAR_COLOR[v], color: '#000' }}>
                {v}
              </div>
              <div className={`text-[12px] ${textColor}`}>
                {v === 'A' && 'Top bit of the row label'}
                {v === 'B' && 'Bottom bit of the row label'}
                {v === 'C' && 'Top bit of the column label'}
                {v === 'D' && 'Bottom bit of the column label'}
              </div>
            </div>
          ))}
          <div className={`p-3 rounded-xl border-l-4 text-[12px] leading-relaxed ${
            wall ? 'border-amber-400 bg-amber-500/5' : isDarkMode ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-slate-50'
          } ${subText}`}>
            {wall ? wall.explanation : 'Hover a wall (the line between two rooms) on the diagram.'}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
