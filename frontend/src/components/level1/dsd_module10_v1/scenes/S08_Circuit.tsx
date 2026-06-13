import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { CircuitBoard, Hammer, ArrowRight, Clock } from 'lucide-react';

interface Props { isActive?: boolean; isDarkMode: boolean }

const EMERALD = '#34d399'; // PART II · THE MECHANISM accent
const MINT = '#6ee7b7';
const AMBER = '#f59e0b';
const CYAN = '#22d3ee';
const VIOLET = '#a78bfa';

const N = 4;

export const S08_Circuit: React.FC<Props> = ({ isDarkMode }) => {
  const navigate = useNavigate();

  // index 0 = bit0 (LSB)
  const [A, setA] = useState<number[]>([1, 0, 1, 0]);
  const [B, setB] = useState<number[]>([1, 1, 0, 0]);
  const [cin, setCin] = useState(0);

  // ---- ripple-carry logic, computed live ----
  // Per bit: Si = Ai XOR Bi XOR Ci ; Ci+1 = (Ai AND Bi) OR (Ci AND (Ai XOR Bi))
  const carries: number[] = [cin];
  const sums: number[] = [];
  const pSig: number[] = []; // propagate = Ai XOR Bi
  for (let i = 0; i < N; i++) {
    const a = A[i], b = B[i], c = carries[i];
    const p = a ^ b;
    pSig[i] = p;
    sums[i] = p ^ c;
    carries[i + 1] = (a & b) | (c & p);
  }
  const cout = carries[N];
  const aVal = A.reduce((v, bit, i) => v + (bit << i), 0);
  const bVal = B.reduce((v, bit, i) => v + (bit << i), 0);
  const sumVal = sums.reduce((v, bit, i) => v + (bit << i), 0) + (cout << N);

  // ---- theme helpers (mirror the template) ----
  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';

  const idle = isDarkMode ? '#475569' : '#cbd5e1';
  const boxFill = isDarkMode ? '#0a0e1a' : '#ffffff';
  const ink = isDarkMode ? '#e2e8f0' : '#0f172a';

  const wire = (on: number, base: string) => (on ? base : idle);
  const glow = (on: number, base: string) => (on ? `drop-shadow(0 0 6px ${base})` : 'none');

  const toggle = (which: 'A' | 'B', i: number) => {
    if (which === 'A') setA(prev => prev.map((v, k) => (k === i ? (v ? 0 : 1) : v)));
    else setB(prev => prev.map((v, k) => (k === i ? (v ? 0 : 1) : v)));
  };

  // a clickable input pad on the SVG
  const Pad: React.FC<{ x: number; y: number; label: string; val: number; color: string; onClick: () => void }> =
    ({ x, y, label, val, color, onClick }) => (
      <g style={{ cursor: 'pointer' }} onClick={onClick}>
        <rect x={x} y={y - 14} width={40} height={28} rx={7}
          fill={val ? color : 'none'} stroke={color} strokeWidth="2.5"
          style={{ filter: val ? `drop-shadow(0 0 8px ${color})` : 'none' }} />
        <text x={x + 11} y={y + 4} textAnchor="middle" fontSize="11" fontFamily="monospace" fontWeight="bold"
          fill={val ? '#000' : color}>{label}</text>
        <text x={x + 29} y={y + 4} textAnchor="middle" fontSize="12" fontFamily="monospace" fontWeight="bold"
          fill={val ? '#000' : color}>{val}</text>
      </g>
    );

  // a carry node bubble in the chain diagram
  const CarryNode: React.FC<{ cx: number; cy: number; label: string; val: number }> = ({ cx, cy, label, val }) => (
    <g>
      <circle cx={cx} cy={cy} r={13} fill={val ? AMBER : 'none'} stroke={val ? AMBER : idle} strokeWidth="2.5"
        style={{ filter: val ? `drop-shadow(0 0 9px ${AMBER})` : 'none' }} />
      <text x={cx} y={cy + 4} textAnchor="middle" fontSize="11" fontFamily="monospace" fontWeight="bold"
        fill={val ? '#000' : ink}>{val}</text>
      <text x={cx} y={cy + 28} textAnchor="middle" fontSize="9" fontFamily="monospace" fill={ink}>{label}</text>
    </g>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-12 py-4">
      {/* ── intro ── */}
      <section className="space-y-3">
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.4em] uppercase" style={{ color: EMERALD }}>
          <CircuitBoard size={14} /> Chapter 08 · The Gate-Level Schematic
        </div>
        <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>
          Four full adders. <span style={{ color: EMERALD }}>One carry chain.</span>
        </h2>
        <p className={`text-base max-w-3xl ${subText}`}>
          Below is the real wiring of a 4-bit ripple-carry adder. Toggle any input bit and watch
          every sum and every carry recompute live. The carry born in stage 0 has to ripple all the
          way to stage 3 before the answer settles - that wait is the whole story of this design.
        </p>
      </section>

      {/* ── live readout ── */}
      <div className={`p-5 rounded-3xl border ${cardBg} flex flex-wrap items-center justify-center gap-x-8 gap-y-3 font-mono`}>
        <span className="text-sm" style={{ color: CYAN }}>A = {aVal}</span>
        <span className={`text-sm ${subText}`}>+</span>
        <span className="text-sm" style={{ color: VIOLET }}>B = {bVal}</span>
        <span className={`text-sm ${subText}`}>+</span>
        <span className="text-sm" style={{ color: AMBER }}>Cin = {cin}</span>
        <span className={`text-sm ${subText}`}>=</span>
        <span className="text-lg font-black" style={{ color: EMERALD }}>{sumVal}</span>
        <span className="text-[11px] opacity-60" style={{ color: EMERALD }}>
          (Cout {cout} · S {sums.slice().reverse().join('')})
        </span>
      </div>

      {/* ── THE CARRY CHAIN: four full-adder blocks in a row ── */}
      <div className={`p-6 md:p-8 rounded-3xl border ${cardBg}`}>
        <div className="font-mono text-[10px] uppercase tracking-widest mb-4" style={{ color: EMERALD }}>
          The chain · c0 &rarr; c1 &rarr; c2 &rarr; c3 &rarr; c4
        </div>
        <svg viewBox="0 0 760 230" className="w-full h-auto">
          {/* Cin pad on the right edge feeding FA0 */}
          <Pad x={690} y={150} label="Ci" val={cin} color={AMBER} onClick={() => setCin(v => (v ? 0 : 1))} />

          {[0, 1, 2, 3].map(i => {
            // blocks laid out right-to-left so the carry visibly ripples left
            const x = 540 - i * 170;
            const cIn = carries[i];
            const cOut = carries[i + 1];
            return (
              <g key={i}>
                {/* A and B input pads on top of each block */}
                <Pad x={x + 20} y={36} label={`A${i}`} val={A[i]} color={CYAN} onClick={() => toggle('A', i)} />
                <Pad x={x + 90} y={36} label={`B${i}`} val={B[i]} color={VIOLET} onClick={() => toggle('B', i)} />
                <line x1={x + 40} y1={50} x2={x + 40} y2={92} stroke={wire(A[i], CYAN)} strokeWidth="2.5" style={{ filter: glow(A[i], CYAN) }} />
                <line x1={x + 110} y1={50} x2={x + 110} y2={92} stroke={wire(B[i], VIOLET)} strokeWidth="2.5" style={{ filter: glow(B[i], VIOLET) }} />

                {/* the FA block */}
                <rect x={x} y={92} width={140} height={66} rx={12} fill={boxFill}
                  stroke={i === 0 ? EMERALD : (isDarkMode ? '#1e293b' : '#94a3b8')} strokeWidth={i === 0 ? 3 : 2}
                  style={{ filter: i === 0 ? `drop-shadow(0 0 12px ${EMERALD}55)` : 'none' }} />
                <text x={x + 70} y={122} textAnchor="middle" fontSize="18" fontFamily="monospace" fontWeight="bold"
                  fill={i === 0 ? EMERALD : ink}>FA{i}</text>
                <text x={x + 70} y={140} textAnchor="middle" fontSize="8" fontFamily="monospace" fill={ink} opacity={0.6}>full adder</text>

                {/* sum output below */}
                <line x1={x + 70} y1={158} x2={x + 70} y2={188} stroke={wire(sums[i], EMERALD)} strokeWidth="2.5" style={{ filter: glow(sums[i], EMERALD) }} />
                <circle cx={x + 70} cy={202} r={13} fill={sums[i] ? EMERALD : 'none'} stroke={sums[i] ? EMERALD : idle} strokeWidth="2.5"
                  style={{ filter: sums[i] ? `drop-shadow(0 0 9px ${EMERALD})` : 'none' }} />
                <text x={x + 70} y={206} textAnchor="middle" fontSize="11" fontFamily="monospace" fontWeight="bold" fill={sums[i] ? '#000' : ink}>{sums[i]}</text>
                <text x={x + 70} y={228} textAnchor="middle" fontSize="9" fontFamily="monospace" fill={ink}>S{i}</text>

                {/* carry IN arrives from the right */}
                <line x1={x + 140} y1={125} x2={x + (i === 0 ? 690 : 170)} y2={125} stroke={wire(cIn, AMBER)} strokeWidth="3" style={{ filter: glow(cIn, AMBER) }} />
                {/* animated dot riding the active carry wire */}
                {cIn ? (
                  <motion.circle r={3.5} fill={AMBER} cy={125}
                    initial={{ cx: x + 170 }} animate={{ cx: x + 140 }}
                    transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }} />
                ) : null}

                {/* carry-out node on the left edge of the block */}
                <CarryNode cx={x} cy={125} label={`c${i + 1}`} val={cOut} />
              </g>
            );
          })}

          {/* Cout label on the far-left node */}
          <text x={30} y={92} textAnchor="middle" fontSize="11" fontFamily="monospace" fontWeight="bold" fill={cout ? AMBER : ink}>Cout = {cout}</text>
        </svg>
        <p className={`text-xs text-center font-mono mt-1 ${subText}`}>
          click any A / B / Ci pad to flip it - the amber carry wire lights up and a dot rides each active link
        </p>
      </div>

      {/* ── EXPANDED FA0: the gate-level internals ── */}
      <div className={`p-6 md:p-8 rounded-3xl border ${cardBg}`}>
        <div className="font-mono text-[10px] uppercase tracking-widest mb-1" style={{ color: EMERALD }}>
          Inside FA0 · 2 XOR + 2 AND + 1 OR
        </div>
        <p className={`text-sm mb-4 ${subText}`}>
          Every block above is this. The first XOR makes the propagate signal P = A0 XOR B0; a second
          XOR adds the carry-in for the sum. The carry-out is "both inputs agree" OR "the carry got
          propagated."
        </p>
        <svg viewBox="0 0 640 300" className="w-full h-auto">
          {/* inputs for FA0 */}
          <Pad x={20} y={60} label="A0" val={A[0]} color={CYAN} onClick={() => toggle('A', 0)} />
          <Pad x={20} y={120} label="B0" val={B[0]} color={VIOLET} onClick={() => toggle('B', 0)} />
          <Pad x={20} y={230} label="Ci" val={cin} color={AMBER} onClick={() => setCin(v => (v ? 0 : 1))} />

          {/* A0 / B0 feed lines with fan-out junctions */}
          <line x1={60} y1={60} x2={150} y2={60} stroke={wire(A[0], CYAN)} strokeWidth="2.5" style={{ filter: glow(A[0], CYAN) }} />
          <line x1={60} y1={120} x2={150} y2={120} stroke={wire(B[0], VIOLET)} strokeWidth="2.5" style={{ filter: glow(B[0], VIOLET) }} />
          {/* fan-out down to the AND gate */}
          <circle cx={95} cy={60} r={3.5} fill={wire(A[0], CYAN)} />
          <circle cx={120} cy={120} r={3.5} fill={wire(B[0], VIOLET)} />
          <line x1={95} y1={60} x2={95} y2={210} stroke={wire(A[0], CYAN)} strokeWidth="2.5" style={{ filter: glow(A[0], CYAN) }} />
          <line x1={95} y1={210} x2={150} y2={210} stroke={wire(A[0], CYAN)} strokeWidth="2.5" style={{ filter: glow(A[0], CYAN) }} />
          <line x1={120} y1={120} x2={120} y2={228} stroke={wire(B[0], VIOLET)} strokeWidth="2.5" style={{ filter: glow(B[0], VIOLET) }} />
          <line x1={120} y1={228} x2={150} y2={228} stroke={wire(B[0], VIOLET)} strokeWidth="2.5" style={{ filter: glow(B[0], VIOLET) }} />

          {/* XOR #1  -> P = A0 ^ B0 */}
          <g>
            <path d="M 146 42 Q 162 75 146 108" fill="none" stroke={MINT} strokeWidth="2.5" />
            <path d="M 154 42 Q 170 75 154 108 Q 196 108 218 75 Q 196 42 154 42 Z" fill={boxFill} stroke={MINT} strokeWidth="2.5" />
            <text x={182} y={79} textAnchor="middle" fontSize="9" fontFamily="monospace" fontWeight="bold" fill={MINT}>XOR</text>
          </g>
          {/* P signal wire (fans out to XOR2 and AND2) */}
          <line x1={218} y1={75} x2={300} y2={75} stroke={wire(pSig[0], MINT)} strokeWidth="3" style={{ filter: glow(pSig[0], MINT) }} />
          <text x={246} y={66} textAnchor="middle" fontSize="9" fontFamily="monospace" fontWeight="bold" fill={MINT}>P = A0^B0 = {pSig[0]}</text>
          <circle cx={300} cy={75} r={3.5} fill={wire(pSig[0], MINT)} />
          <line x1={300} y1={75} x2={300} y2={170} stroke={wire(pSig[0], MINT)} strokeWidth="2.5" style={{ filter: glow(pSig[0], MINT) }} />
          <line x1={300} y1={170} x2={356} y2={170} stroke={wire(pSig[0], MINT)} strokeWidth="2.5" style={{ filter: glow(pSig[0], MINT) }} />

          {/* carry-in fan-out up to XOR2 */}
          <line x1={60} y1={230} x2={330} y2={230} stroke={wire(cin, AMBER)} strokeWidth="2.5" style={{ filter: glow(cin, AMBER) }} />
          <circle cx={330} cy={230} r={3.5} fill={wire(cin, AMBER)} />
          <line x1={330} y1={230} x2={330} y2={95} stroke={wire(cin, AMBER)} strokeWidth="2.5" style={{ filter: glow(cin, AMBER) }} />
          <line x1={330} y1={95} x2={356} y2={95} stroke={wire(cin, AMBER)} strokeWidth="2.5" style={{ filter: glow(cin, AMBER) }} />

          {/* XOR #2 -> Sum0 = P ^ Cin */}
          <g>
            <path d="M 352 50 Q 368 78 352 106" fill="none" stroke={EMERALD} strokeWidth="2.5" />
            <path d="M 360 50 Q 376 78 360 106 Q 404 106 426 78 Q 404 50 360 50 Z" fill={boxFill} stroke={EMERALD} strokeWidth="2.5" />
            <text x={388} y={82} textAnchor="middle" fontSize="9" fontFamily="monospace" fontWeight="bold" fill={EMERALD}>XOR</text>
          </g>
          <line x1={426} y1={78} x2={540} y2={78} stroke={wire(sums[0], EMERALD)} strokeWidth="3" style={{ filter: glow(sums[0], EMERALD) }} />
          <circle cx={558} cy={78} r={14} fill={sums[0] ? EMERALD : 'none'} stroke={sums[0] ? EMERALD : idle} strokeWidth="2.5"
            style={{ filter: sums[0] ? `drop-shadow(0 0 12px ${EMERALD})` : 'none' }} />
          <text x={558} y={82} textAnchor="middle" fontSize="11" fontFamily="monospace" fontWeight="bold" fill={sums[0] ? '#000' : ink}>{sums[0]}</text>
          <text x={558} y={108} textAnchor="middle" fontSize="9" fontFamily="monospace" fill={EMERALD}>S0 = A^B^Ci</text>

          {/* AND #2 -> P AND Cin  (uses P fan-out at y170 and a Cin tap) */}
          <line x1={330} y1={230} x2={330} y2={194} stroke={wire(cin, AMBER)} strokeWidth="2.5" style={{ filter: glow(cin, AMBER) }} />
          <line x1={330} y1={194} x2={356} y2={194} stroke={wire(cin, AMBER)} strokeWidth="2.5" style={{ filter: glow(cin, AMBER) }} />
          <g>
            <path d="M 356 158 L 356 206 L 380 206 Q 410 206 410 182 Q 410 158 380 158 Z" fill={boxFill} stroke={AMBER} strokeWidth="2.5" />
            <text x={381} y={186} textAnchor="middle" fontSize="9" fontFamily="monospace" fontWeight="bold" fill={AMBER}>AND</text>
          </g>
          {(() => { const pc = pSig[0] & cin; return (
            <line x1={410} y1={182} x2={452} y2={182} stroke={wire(pc, AMBER)} strokeWidth="2.5" style={{ filter: glow(pc, AMBER) }} />
          ); })()}

          {/* AND #1 -> A0 AND B0 (generate) */}
          <line x1={150} y1={210} x2={150} y2={258} stroke={wire(A[0], CYAN)} strokeWidth="2.5" style={{ filter: glow(A[0], CYAN) }} />
          <line x1={150} y1={258} x2={250} y2={258} stroke={wire(A[0], CYAN)} strokeWidth="2.5" style={{ filter: glow(A[0], CYAN) }} />
          <line x1={150} y1={228} x2={250} y2={228} stroke={wire(B[0], VIOLET)} strokeWidth="2.5" style={{ filter: glow(B[0], VIOLET) }} />
          <g>
            <path d="M 250 220 L 250 268 L 274 268 Q 304 268 304 244 Q 304 220 274 220 Z" fill={boxFill} stroke={AMBER} strokeWidth="2.5" />
            <text x={275} y={248} textAnchor="middle" fontSize="9" fontFamily="monospace" fontWeight="bold" fill={AMBER}>AND</text>
          </g>
          {(() => { const g = A[0] & B[0]; return (
            <>
              <text x={290} y={284} textAnchor="middle" fontSize="9" fontFamily="monospace" fill={AMBER}>G = A0&amp;B0 = {g}</text>
              <line x1={304} y1={244} x2={452} y2={244} stroke={wire(g, AMBER)} strokeWidth="2.5" style={{ filter: glow(g, AMBER) }} />
            </>
          ); })()}

          {/* OR -> Cout0 = G OR (P AND Cin) */}
          <g>
            <path d="M 448 166 Q 466 188 448 210 Q 480 210 504 188 Q 480 166 448 166 Z" fill={boxFill} stroke={AMBER} strokeWidth="2.5" />
            <path d="M 448 166 Q 466 188 448 210" fill="none" stroke={AMBER} strokeWidth="2.5" />
            <text x={474} y={191} textAnchor="middle" fontSize="9" fontFamily="monospace" fontWeight="bold" fill={AMBER}>OR</text>
          </g>
          <line x1={504} y1={188} x2={544} y2={188} stroke={wire(carries[1], AMBER)} strokeWidth="3" style={{ filter: glow(carries[1], AMBER) }} />
          <circle cx={562} cy={188} r={14} fill={carries[1] ? AMBER : 'none'} stroke={carries[1] ? AMBER : idle} strokeWidth="2.5"
            style={{ filter: carries[1] ? `drop-shadow(0 0 12px ${AMBER})` : 'none' }} />
          <text x={562} y={192} textAnchor="middle" fontSize="11" fontFamily="monospace" fontWeight="bold" fill={carries[1] ? '#000' : ink}>{carries[1]}</text>
          <text x={562} y={218} textAnchor="middle" fontSize="9" fontFamily="monospace" fill={AMBER}>c1 (to FA1)</text>
        </svg>
        <p className={`text-xs text-center font-mono mt-2 ${subText}`}>
          governing equations: S0 = A0 ^ B0 ^ Cin &nbsp;·&nbsp; c1 = (A0 &amp; B0) | (Cin &amp; (A0 ^ B0))
        </p>
      </div>

      {/* ── the trade-off caption ── */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="p-6 rounded-3xl border-2" style={{ borderColor: `${AMBER}44`, background: `${AMBER}08` }}>
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest mb-2" style={{ color: AMBER }}>
            <Clock size={13} /> The cost: it has to wait
          </div>
          <p className={`text-sm leading-relaxed ${subText}`}>
            Stage 3 cannot finish until c3 arrives, c3 needs c2, and so on back to c0. The carry
            ripples through every stage in turn, so worst-case delay grows linearly with width -
            about <strong style={{ color: AMBER }}>2 gate delays per bit</strong>, roughly 2 x N for an
            N-bit adder. Double the width and you double the wait.
          </p>
        </div>
        <div className="p-6 rounded-3xl border-2" style={{ borderColor: `${EMERALD}44`, background: `${EMERALD}08` }}>
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest mb-2" style={{ color: EMERALD }}>
            <CircuitBoard size={13} /> The win: it is tiny
          </div>
          <p className={`text-sm leading-relaxed ${subText}`}>
            In return you get the smallest, simplest adder there is - just N identical full adders
            tiled side by side, area scaling linearly and wiring that is trivial to lay out. That is
            the ripple-carry bargain: <strong style={{ color: EMERALD }}>minimum area, linear delay</strong>.
            Faster adders buy speed back by spending more gates.
          </p>
        </div>
      </div>

      {/* ── call to action ── */}
      <div className="flex flex-col items-center gap-3 pt-2">
        <p className={`text-sm text-center max-w-xl ${subText}`}>
          <Hammer size={13} className="inline mr-1 -mt-0.5" style={{ color: EMERALD }} />
          You have seen the schematic. Now wire it yourself, gate by gate, in the live workbench.
        </p>
        <button
          onClick={() => navigate('/workbench?tutorial=ripple-carry')}
          className="group flex items-center gap-3 px-7 py-4 rounded-2xl font-black text-black transition-all active:scale-95 shadow-xl"
          style={{ backgroundColor: EMERALD, boxShadow: `0 12px 34px ${EMERALD}44` }}
        >
          Build it for real in the workbench
          <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  );
};
