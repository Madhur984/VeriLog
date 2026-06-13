import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { CircuitBoard, Hammer, Zap, ArrowRight } from 'lucide-react';

interface Props { isActive?: boolean; isDarkMode: boolean }

// PART II · THE MECHANISM accent (from DsdModule11Engine getPartTheme)
const EMERALD = '#34d399';
const MINT    = '#6ee7b7';
const SKY     = '#38bdf8';   // propagate P
const ORANGE  = '#fb923c';   // generate G
const VIOLET  = '#a78bfa';   // carries C
const ROSE    = '#fb7185';   // sum S

type Bit = 0 | 1;

export const S08_Circuit: React.FC<Props> = ({ isDarkMode }) => {
  const navigate = useNavigate();

  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText   = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg    = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';

  const idle    = isDarkMode ? '#475569' : '#cbd5e1';
  const boxFill = isDarkMode ? '#0a0e1a' : '#ffffff';
  const ink     = isDarkMode ? '#e2e8f0' : '#0f172a';

  // ── live circuit state ──
  const [A, setA] = useState<Bit[]>([1, 1, 0, 1]); // A0..A3
  const [B, setB] = useState<Bit[]>([0, 1, 1, 0]); // B0..B3
  const [cin, setCin] = useState<Bit>(0);

  const flip = (v: Bit): Bit => (v ? 0 : 1);
  const toggleA = (i: number) => setA(prev => prev.map((v, j) => (j === i ? flip(v) : v)) as Bit[]);
  const toggleB = (i: number) => setB(prev => prev.map((v, j) => (j === i ? flip(v) : v)) as Bit[]);

  // ── the real adder equations ──
  const P = [0, 1, 2, 3].map(i => (A[i] ^ B[i]) as Bit);          // Pi = Ai XOR Bi
  const G = [0, 1, 2, 3].map(i => (A[i] & B[i]) as Bit);          // Gi = Ai AND Bi
  // look-ahead carries, each written only in terms of G, P and Cin
  const C: Bit[] = [cin];
  C[1] = (G[0] | (P[0] & C[0])) as Bit;
  C[2] = (G[1] | (P[1] & G[0]) | (P[1] & P[0] & C[0])) as Bit;
  C[3] = (G[2] | (P[2] & G[1]) | (P[2] & P[1] & G[0]) | (P[2] & P[1] & P[0] & C[0])) as Bit;
  C[4] = (G[3] | (P[3] & G[2]) | (P[3] & P[2] & G[1]) | (P[3] & P[2] & P[1] & G[0]) | (P[3] & P[2] & P[1] & P[0] & C[0])) as Bit;
  const S = [0, 1, 2, 3].map(i => (P[i] ^ C[i]) as Bit);          // Si = Pi XOR Ci

  const aVal = A.reduce<number>((v, b, i) => v + (Number(b) << i), 0);
  const bVal = B.reduce<number>((v, b, i) => v + (Number(b) << i), 0);
  const sumVal = S.reduce<number>((v, b, i) => v + (Number(b) << i), 0) + (Number(C[4]) << 4);

  // wire / glow helpers (identical idea to the template)
  const wire = (on: Bit | number, base: string) => (on ? base : idle);
  const glow = (on: Bit | number, base: string) => (on ? `drop-shadow(0 0 5px ${base})` : 'none');

  // tiny reusable signal chip
  const Chip: React.FC<{ v: Bit | number; color: string; label: string }> = ({ v, color, label }) => (
    <div className="flex flex-col items-center">
      <div className="w-8 h-8 rounded-lg border-2 flex items-center justify-center font-mono text-sm font-black"
           style={{ borderColor: v ? color : `${color}55`, background: v ? `${color}22` : 'transparent', color: v ? color : `${color}99` }}>{v}</div>
      <span className="mt-0.5 font-mono text-[9px]" style={{ color }}>{label}</span>
    </div>
  );

  // one clickable input pad on the SVG
  const Pad: React.FC<{ x: number; y: number; label: string; v: Bit; color: string; onClick: () => void }> =
    ({ x, y, label, v, color, onClick }) => (
      <g style={{ cursor: 'pointer' }} onClick={onClick}>
        <rect x={x} y={y - 14} width={30} height={28} rx={7}
              fill={v ? color : 'none'} stroke={color} strokeWidth="2.2"
              style={{ filter: v ? `drop-shadow(0 0 7px ${color})` : 'none' }} />
        <text x={x + 15} y={y - 2} textAnchor="middle" fontSize="8" fontFamily="monospace" fontWeight="bold"
              fill={v ? '#000' : color}>{label}</text>
        <text x={x + 15} y={y + 9} textAnchor="middle" fontSize="9" fontFamily="monospace" fontWeight="bold"
              fill={v ? '#000' : color}>{v}</text>
      </g>
    );

  // one bit-slice of the P/G generator + final sum, drawn at vertical offset y
  const BitSlice: React.FC<{ i: number; y: number }> = ({ i, y }) => {
    const pOn = P[i], gOn = G[i], sOn = S[i], cOn = C[i];
    return (
      <g>
        {/* input pads */}
        <Pad x={6}  y={y}      label={`A${i}`} v={A[i]} color={EMERALD} onClick={() => toggleA(i)} />
        <Pad x={6}  y={y + 30} label={`B${i}`} v={B[i]} color={EMERALD} onClick={() => toggleB(i)} />

        {/* fan-out wires into XOR (P) and AND (G) */}
        <line x1={36} y1={y}      x2={66} y2={y}      stroke={wire(A[i], EMERALD)} strokeWidth="2.4" style={{ filter: glow(A[i], EMERALD) }} />
        <line x1={36} y1={y + 30} x2={66} y2={y + 30} stroke={wire(B[i], EMERALD)} strokeWidth="2.4" style={{ filter: glow(B[i], EMERALD) }} />

        {/* XOR gate -> Pi */}
        <path d={`M 66 ${y - 10} Q 78 ${y + 6} 66 ${y + 22}`} fill="none" stroke={SKY} strokeWidth="2" />
        <path d={`M 72 ${y - 10} Q 84 ${y + 6} 72 ${y + 22} Q 100 ${y + 22} 112 ${y + 6} Q 100 ${y - 10} 72 ${y - 10} Z`}
              fill={boxFill} stroke={SKY} strokeWidth="2" />
        <text x={90} y={y + 9} textAnchor="middle" fontSize="6.5" fontFamily="monospace" fontWeight="bold" fill={SKY}>XOR</text>
        <line x1={112} y1={y + 6} x2={140} y2={y + 6} stroke={wire(pOn, SKY)} strokeWidth="2.4" style={{ filter: glow(pOn, SKY) }} />
        <text x={146} y={y + 9} fontSize="8" fontFamily="monospace" fontWeight="bold" fill={pOn ? SKY : `${SKY}99`}>P{i}={pOn}</text>

        {/* AND gate -> Gi */}
        <path d={`M 72 ${y + 44} L 72 ${y + 78} L 90 ${y + 78} Q 110 ${y + 78} 110 ${y + 61} Q 110 ${y + 44} 90 ${y + 44} Z`}
              fill={boxFill} stroke={ORANGE} strokeWidth="2" />
        <text x={90} y={y + 64} textAnchor="middle" fontSize="6.5" fontFamily="monospace" fontWeight="bold" fill={ORANGE}>AND</text>
        {/* fan-out drops from A/B into the AND */}
        <line x1={50} y1={y}      x2={50} y2={y + 50} stroke={wire(A[i], EMERALD)} strokeWidth="2.4" style={{ filter: glow(A[i], EMERALD) }} />
        <line x1={50} y1={y + 50} x2={72} y2={y + 50} stroke={wire(A[i], EMERALD)} strokeWidth="2.4" style={{ filter: glow(A[i], EMERALD) }} />
        <line x1={58} y1={y + 30} x2={58} y2={y + 72} stroke={wire(B[i], EMERALD)} strokeWidth="2.4" style={{ filter: glow(B[i], EMERALD) }} />
        <line x1={58} y1={y + 72} x2={72} y2={y + 72} stroke={wire(B[i], EMERALD)} strokeWidth="2.4" style={{ filter: glow(B[i], EMERALD) }} />
        <circle cx={50} cy={y} r={3} fill={wire(A[i], EMERALD)} />
        <circle cx={58} cy={y + 30} r={3} fill={wire(B[i], EMERALD)} />
        <line x1={110} y1={y + 61} x2={140} y2={y + 61} stroke={wire(gOn, ORANGE)} strokeWidth="2.4" style={{ filter: glow(gOn, ORANGE) }} />
        <text x={146} y={y + 64} fontSize="8" fontFamily="monospace" fontWeight="bold" fill={gOn ? ORANGE : `${ORANGE}99`}>G{i}={gOn}</text>

        {/* ── final sum XOR: Si = Pi XOR Ci ── */}
        {/* Pi tap forward to the sum stage */}
        <line x1={140} y1={y + 6} x2={300} y2={y + 6} stroke={wire(pOn, SKY)} strokeWidth="2.2" strokeDasharray="3 3" style={{ filter: glow(pOn, SKY) }} />
        {/* Ci wire arriving from the look-ahead unit on the right side */}
        <line x1={300} y1={y + 26} x2={328} y2={y + 26} stroke={wire(cOn, VIOLET)} strokeWidth="2.4" style={{ filter: glow(cOn, VIOLET) }} />
        <text x={262} y={y + 24} fontSize="8" fontFamily="monospace" fontWeight="bold" fill={cOn ? VIOLET : `${VIOLET}99`}>C{i}={cOn}</text>
        {/* sum XOR */}
        <path d={`M 300 ${y - 4} Q 312 ${y + 12} 300 ${y + 28}`} fill="none" stroke={ROSE} strokeWidth="2" />
        <path d={`M 306 ${y - 4} Q 318 ${y + 12} 306 ${y + 28} Q 334 ${y + 28} 346 ${y + 12} Q 334 ${y - 4} 306 ${y - 4} Z`}
              fill={boxFill} stroke={ROSE} strokeWidth="2" />
        <text x={324} y={y + 15} textAnchor="middle" fontSize="6.5" fontFamily="monospace" fontWeight="bold" fill={ROSE}>XOR</text>
        <line x1={346} y1={y + 12} x2={372} y2={y + 12} stroke={wire(sOn, ROSE)} strokeWidth="2.6" style={{ filter: glow(sOn, ROSE) }} />
        <circle cx={384} cy={y + 12} r={10} fill={sOn ? ROSE : 'none'} stroke={ROSE} strokeWidth="2.2"
                style={{ filter: sOn ? `drop-shadow(0 0 9px ${ROSE})` : 'none' }} />
        <text x={384} y={y + 16} textAnchor="middle" fontSize="9" fontFamily="monospace" fontWeight="bold" fill={sOn ? '#000' : ROSE}>{sOn}</text>
        <text x={399} y={y + 16} fontSize="8" fontFamily="monospace" fontWeight="bold" fill={ROSE}>S{i}</text>
      </g>
    );
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 py-4">
      {/* heading */}
      <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.4em] uppercase" style={{ color: EMERALD }}>
          <CircuitBoard size={14} /> Chapter 09 · The Gate-Level Schematic
        </div>
        <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>
          The whole adder, <span style={{ color: EMERALD }}>wire by wire</span>.
        </h2>
        <p className={`text-base max-w-3xl ${subText}`}>
          Three regions, one diagram. First each column makes its propagate and generate bits, then the
          look-ahead unit fires every carry at once, and finally each sum bit pops out of an XOR. Toggle any
          input pad and watch every derived signal recompute live - exactly the circuit you will wire in the
          workbench.
        </p>
      </motion.section>

      {/* region legend */}
      <div className={`p-4 rounded-2xl border flex flex-wrap items-center gap-x-6 gap-y-2 ${cardBg}`}>
        {[
          { c: SKY,    t: 'P = A XOR B  (propagate)' },
          { c: ORANGE, t: 'G = A AND B  (generate)' },
          { c: VIOLET, t: 'C  (look-ahead carries)' },
          { c: ROSE,   t: 'S = P XOR C  (sum)' },
        ].map(item => (
          <div key={item.t} className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-sm" style={{ background: item.c }} />
            <span className={`font-mono text-[11px] ${subText}`}>{item.t}</span>
          </div>
        ))}
      </div>

      {/* ── the interactive schematic ── */}
      <div className={`p-4 md:p-6 rounded-3xl border ${cardBg}`}>
        <div className="grid grid-cols-3 text-center mb-2">
          <span className="font-mono text-[10px] uppercase tracking-widest" style={{ color: EMERALD }}>(a) P / G generator</span>
          <span className="font-mono text-[10px] uppercase tracking-widest" style={{ color: VIOLET }}>(b) carry look-ahead unit</span>
          <span className="font-mono text-[10px] uppercase tracking-widest" style={{ color: ROSE }}>(c) sum XORs</span>
        </div>

        <svg viewBox="0 0 420 420" className="w-full h-auto">
          {/* the look-ahead unit body: a single AND/OR cluster feeding C1..C4 together */}
          <rect x={196} y={28} width={108} height={364} rx={14}
                fill={isDarkMode ? '#11052055' : '#a78bfa11'} stroke={`${VIOLET}88`} strokeWidth="2" strokeDasharray="5 4" />
          <text x={250} y={20} textAnchor="middle" fontSize="8" fontFamily="monospace" fontWeight="bold" fill={VIOLET}>
            AND / OR look-ahead cluster
          </text>

          {/* Cin pad feeding the cluster */}
          <Pad x={150} y={376} label="Cin" v={cin} color={VIOLET} onClick={() => setCin(flip(cin))} />
          <line x1={180} y1={376} x2={196} y2={376} stroke={wire(cin, VIOLET)} strokeWidth="2.4" style={{ filter: glow(cin, VIOLET) }} />

          {/* four bit slices stacked low bit at bottom */}
          <BitSlice i={3} y={48}  />
          <BitSlice i={2} y={138} />
          <BitSlice i={1} y={228} />
          <BitSlice i={0} y={318} />

          {/* internal cluster nodes lighting up as carries resolve */}
          {[
            { y: 326, c: C[0], label: 'C0' },
            { y: 236, c: C[1], label: 'C1' },
            { y: 146, c: C[2], label: 'C2' },
            { y: 56,  c: C[3], label: 'C3' },
          ].map(n => (
            <g key={n.label}>
              <circle cx={250} cy={n.y} r={5} fill={n.c ? VIOLET : 'none'} stroke={VIOLET} strokeWidth="2"
                      style={{ filter: n.c ? `drop-shadow(0 0 6px ${VIOLET})` : 'none' }} />
            </g>
          ))}
          {/* Cout out of the top of the cluster */}
          <line x1={250} y1={36} x2={250} y2={20} stroke={wire(C[4], VIOLET)} strokeWidth="2.4" style={{ filter: glow(C[4], VIOLET) }} />
          <text x={258} y={16} fontSize="9" fontFamily="monospace" fontWeight="bold" fill={C[4] ? VIOLET : `${VIOLET}99`}>Cout = {C[4]}</text>
        </svg>

        <p className="text-center text-xs font-mono mt-1" style={{ color: EMERALD }}>
          click any A / B / Cin pad on the diagram to toggle it
        </p>
      </div>

      {/* live signal readout */}
      <div className={`p-5 rounded-3xl border ${cardBg}`}>
        <div className={`font-mono text-[10px] uppercase tracking-widest mb-3 ${subText}`}>Live signals</div>
        <div className="flex justify-center gap-5 flex-wrap">
          {[3, 2, 1, 0].map(i => (
            <div key={i} className="flex flex-col items-center gap-1">
              <span className="font-mono text-[10px]" style={{ color: isDarkMode ? '#94a3b8' : '#64748b' }}>bit {i}</span>
              <div className="flex gap-1.5">
                <Chip v={P[i]} color={SKY}    label={`P${i}`} />
                <Chip v={G[i]} color={ORANGE} label={`G${i}`} />
                <Chip v={C[i]} color={VIOLET} label={`C${i}`} />
                <Chip v={S[i]} color={ROSE}   label={`S${i}`} />
              </div>
            </div>
          ))}
          <div className="flex flex-col items-center justify-end gap-1">
            <Chip v={C[4]} color={VIOLET} label="Cout" />
          </div>
        </div>
        <div className={`text-center mt-4 font-mono text-sm ${textColor}`}>
          {aVal} + {bVal}{cin ? ' + 1' : ''} = <strong style={{ color: EMERALD }}>{sumVal}</strong>
        </div>
      </div>

      {/* governing equations */}
      <div className={`p-6 rounded-3xl border ${cardBg}`}>
        <div className={`font-mono text-[10px] uppercase tracking-widest mb-3 ${subText}`}>The governing equations</div>
        <div className="grid md:grid-cols-2 gap-x-8 gap-y-1.5 font-mono text-[12px] md:text-sm">
          {[
            { c: SKY,    t: 'Pi = Ai XOR Bi' },
            { c: ORANGE, t: 'Gi = Ai AND Bi' },
            { c: VIOLET, t: 'C1 = G0 + P0·C0' },
            { c: VIOLET, t: 'C2 = G1 + P1·G0 + P1·P0·C0' },
            { c: VIOLET, t: 'C3 = G2 + P2·G1 + P2·P1·G0 + P2·P1·P0·C0' },
            { c: VIOLET, t: 'C4 = G3 + P3·G2 + P3·P2·G1 + P3·P2·P1·G0 + P3·P2·P1·P0·C0' },
            { c: ROSE,   t: 'Si = Pi XOR Ci' },
          ].map(eq => (
            <div key={eq.t} className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full shrink-0" style={{ background: eq.c }} />
              <span className={textColor}>{eq.t}</span>
            </div>
          ))}
        </div>
      </div>

      {/* trade-off caption */}
      <div className="p-6 rounded-3xl border-2" style={{ borderColor: `${EMERALD}44`, background: `${EMERALD}08` }}>
        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest mb-2" style={{ color: EMERALD }}>
          <Zap size={13} /> The speed vs area trade
        </div>
        <p className={`text-sm leading-relaxed ${subText}`}>
          Look at region (b): every carry leaves the cluster at the <strong className={textColor}>same constant
          depth</strong> of about three gate delays - one for P and G, then two more for the AND/OR look-ahead -
          no matter which bit it is. A ripple adder would make C4 wait behind C3 behind C2 behind C1, so its delay
          grows with the word width. The look-ahead unit refuses to wait: it spells out each carry directly from
          the inputs and computes them all in parallel. The price is the extra fan-in AND/OR gates in the cluster,
          which is why look-ahead is <strong style={{ color: EMERALD }}>faster but uses more silicon</strong>.
        </p>
      </div>

      {/* call to action */}
      <div className="flex flex-col items-center gap-3 pt-2">
        <p className={`text-sm text-center ${subText}`}>
          <Hammer size={13} className="inline mr-1 -mt-0.5" style={{ color: ORANGE }} />
          You have seen every gate. Now place them yourself.
        </p>
        <button
          onClick={() => navigate('/workbench?tutorial=carry-lookahead')}
          className="group flex items-center gap-3 px-7 py-4 rounded-2xl font-black text-black transition-all active:scale-95 shadow-xl"
          style={{ background: EMERALD, boxShadow: `0 10px 30px ${EMERALD}44` }}>
          <CircuitBoard size={18} />
          Build it for real in the workbench
          <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
        </button>
        <span className="font-mono text-[10px]" style={{ color: MINT }}>
          opens the hands-on carry look-ahead tutorial
        </span>
      </div>
    </div>
  );
};
