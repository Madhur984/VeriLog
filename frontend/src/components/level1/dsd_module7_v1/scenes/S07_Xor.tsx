import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, BookOpen, AlertTriangle } from 'lucide-react';

interface Props { isActive?: boolean; isDarkMode: boolean }

const AMBER = '#f59e0b';
const EMERALD = '#34d399';
const ROSE = '#fb7185';

export const S07_Xor: React.FC<Props> = ({ isDarkMode }) => {
  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText   = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg    = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';

  const idle    = isDarkMode ? '#475569' : '#cbd5e1';
  const boxFill = isDarkMode ? '#0a0e1a' : '#ffffff';
  const wood    = isDarkMode ? '#c4956c' : '#8b5e3c';

  const [a, setA] = useState(false);
  const [b, setB] = useState(false);
  const s = a !== b; // XOR

  const wire = (on: boolean) => (on ? EMERALD : idle);
  const glow = (on: boolean) => (on ? `drop-shadow(0 0 6px ${EMERALD})` : 'none');

  const rows = [
    { a: 0, b: 0, s: 0 }, { a: 0, b: 1, s: 1 }, { a: 1, b: 0, s: 1 }, { a: 1, b: 1, s: 0 },
  ];
  const cur = (Number(a) << 1) | Number(b);

  return (
    <div className="max-w-6xl mx-auto space-y-12 py-4">
      <section className="space-y-3">
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.4em] uppercase" style={{ color: EMERALD }}>
          <Zap size={14} /> Chapter 06 · The Sum Wire: XOR
        </div>
        <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>
          The gate that says <span style={{ color: EMERALD }}>"exactly one"</span>
        </h2>
        <p className={`text-base max-w-3xl ${subText}`}>
          XOR - exclusive OR - is the main bowl, recast in silicon. Toggle the switches
          and watch it light only when the inputs disagree.
        </p>
      </section>

      <div className="grid lg:grid-cols-[1.5fr_1fr] gap-6 items-start">
        {/* ── playground ── */}
        <div className={`p-6 md:p-8 rounded-3xl border ${cardBg}`}>
          <svg viewBox="0 0 460 200" className="w-full h-auto">
            {/* input pads */}
            {([['A', a, 55], ['B', b, 135]] as const).map(([label, on, y]) => (
              <g key={label}>
                <rect x={14} y={y - 20} width={50} height={40} rx={9}
                      fill={on ? EMERALD : 'none'} stroke={on ? EMERALD : idle} strokeWidth="2.5"
                      style={{ filter: on ? `drop-shadow(0 0 10px ${EMERALD})` : 'none' }} />
                <text x={39} y={y - 2} textAnchor="middle" fontSize="10" fontFamily="monospace" fontWeight="bold"
                      fill={on ? '#000' : idle}>{label}</text>
                <text x={39} y={y + 12} textAnchor="middle" fontSize="13" fontFamily="monospace" fontWeight="bold"
                      fill={on ? '#000' : idle}>{on ? 1 : 0}</text>
              </g>
            ))}

            {/* wires into the gate */}
            <line x1={64} y1={55} x2={160} y2={75} stroke={wire(a)} strokeWidth="3" style={{ filter: glow(a) }} />
            <line x1={64} y1={135} x2={160} y2={115} stroke={wire(b)} strokeWidth="3" style={{ filter: glow(b) }} />

            {/* XOR symbol: extra input arc + OR-style body */}
            <path d="M 152 60 Q 172 95 152 130" fill="none" stroke={EMERALD} strokeWidth="2.5" />
            <path d="M 162 60 Q 182 95 162 130 Q 205 130 232 95 Q 205 60 162 60 Z"
                  fill={boxFill} stroke={EMERALD} strokeWidth="2.5" />
            <text x={193} y={100} textAnchor="middle" fontSize="12" fontFamily="monospace" fontWeight="bold" fill={EMERALD}>XOR</text>

            {/* output */}
            <line x1={232} y1={95} x2={360} y2={95} stroke={wire(s)} strokeWidth="3" style={{ filter: glow(s) }} />
            <circle cx={382} cy={95} r={17} fill={s ? EMERALD : 'none'} stroke={s ? EMERALD : idle} strokeWidth="2.5"
                    style={{ filter: s ? `drop-shadow(0 0 14px ${EMERALD})` : 'none' }} />
            <text x={382} y={130} textAnchor="middle" fontSize="10" fontFamily="monospace" fontWeight="bold"
                  fill={s ? EMERALD : idle}>S = {s ? 1 : 0}</text>
          </svg>

          <div className="mt-4 flex flex-wrap gap-3">
            {([['A', a, setA], ['B', b, setB]] as const).map(([label, on, set]) => (
              <button key={label} onClick={() => set(v => !v)}
                className="px-5 py-3 rounded-xl border-2 font-mono font-black transition-all active:scale-95"
                style={{
                  borderColor: EMERALD,
                  color: on ? '#000' : EMERALD,
                  backgroundColor: on ? EMERALD : 'transparent',
                  boxShadow: on ? `0 0 18px ${EMERALD}55` : 'none',
                }}>
                {label} = {on ? 1 : 0}
              </button>
            ))}
          </div>

          {/* analogy tie-in */}
          <div className="mt-5 p-4 rounded-2xl border flex items-start gap-4"
               style={{ borderColor: `${AMBER}44`, background: `${AMBER}08` }}>
            <svg viewBox="0 0 80 56" className="w-16 h-auto flex-shrink-0">
              <rect x={10} y={22} width={60} height={28} rx={7} fill="none" stroke={wood} strokeWidth="2.5" />
              <ellipse cx={40} cy={31} rx={18} ry={6} fill="none" stroke={wood} strokeWidth="2" />
              <circle cx={40} cy={28} r={7} fill={AMBER} opacity={s ? 1 : 0.25} />
            </svg>
            <p className={`text-sm ${subText}`}>
              <strong style={{ color: AMBER }}>Analogy tie-in:</strong> XOR perfectly replicates the main
              wooden box. It lights up for a single sphere, but empties if you try to force two
              spheres inside simultaneously.
            </p>
          </div>
        </div>

        {/* ── table + formulas ── */}
        <div className="space-y-4">
          <div className={`p-5 rounded-3xl border ${cardBg}`}>
            <div className="font-mono text-[10px] uppercase tracking-widest mb-3" style={{ color: EMERALD }}>
              Live truth table
            </div>
            <table className="w-full font-mono text-center text-sm">
              <thead><tr className={`text-[10px] uppercase ${subText}`}><th className="py-1">A</th><th>B</th><th>S</th></tr></thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={i} style={{ background: cur === i ? `${EMERALD}15` : 'transparent' }}>
                    <td className={`py-2 rounded-l-lg ${textColor}`}
                        style={{ borderLeft: cur === i ? `3px solid ${EMERALD}` : '3px solid transparent' }}>{r.a}</td>
                    <td className={textColor}>{r.b}</td>
                    <td className="rounded-r-lg font-bold" style={{ color: r.s ? EMERALD : undefined }}>
                      <span className={r.s ? '' : subText}>{r.s}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className={`p-5 rounded-3xl border ${cardBg}`}>
            <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest mb-2" style={{ color: EMERALD }}>
              <BookOpen size={13} /> The rule, formally
            </div>
            <div className={`font-mono text-xl font-black ${textColor}`}>S = A ⊕ B</div>
            <div className={`font-mono text-sm mt-1 ${subText}`}>or S = A'B + AB'</div>
            <p className={`text-sm mt-3 ${subText}`}>
              Read the second form aloud: "A off and B on, OR A on and B off". The XOR gate
              outputs 1 if exactly ONE input is active - 0 if both are, 0 if neither is.
              The ⊕ symbol is called exclusive OR.
            </p>
          </div>

          <div className="p-5 rounded-3xl border-2" style={{ borderColor: `${ROSE}44`, background: `${ROSE}08` }}>
            <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest mb-2" style={{ color: ROSE }}>
              <AlertTriangle size={13} /> Why not plain OR?
            </div>
            <p className={`text-sm ${subText}`}>
              OR agrees with XOR on three rows - then betrays you on the last one:
              OR(1,1) = 1, which would report 1 + 1 as "sum 1". Wrong. The sum of 1 + 1 is 0
              (with a carry). The <strong style={{ color: ROSE }}>exclusive</strong> in exclusive OR is
              doing all the work.
            </p>
            <div className="mt-3 grid grid-cols-2 gap-2 font-mono text-xs text-center">
              <div className={`p-2 rounded-lg border ${isDarkMode ? 'border-white/10' : 'border-slate-200'}`}>
                <div className={subText}>OR(1,1)</div>
                <div className="text-lg font-black" style={{ color: ROSE }}>1 ✗</div>
              </div>
              <div className="p-2 rounded-lg border" style={{ borderColor: `${EMERALD}55` }}>
                <div className={subText}>XOR(1,1)</div>
                <div className="text-lg font-black" style={{ color: EMERALD }}>0 ✓</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
