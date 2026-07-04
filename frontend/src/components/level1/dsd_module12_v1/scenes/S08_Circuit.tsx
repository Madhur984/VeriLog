import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { CircuitBoard, Hammer, Zap } from 'lucide-react';
import { TryItYourself } from '../../../ui/TryItYourself';

interface Props { isActive?: boolean; isDarkMode: boolean }

// PART II · THE MECHANISM accent (matches the Engine's getPartTheme)
const EMERALD = '#34d399';
const MINT = '#6ee7b7';
const SKY = '#38bdf8';
const AMBER = '#f59e0b';

// associative merge of two (G,P) summaries
const merge = (gu: number, pu: number, gl: number, pl: number) => ({
  g: gu | (pu & gl),
  p: pu & pl,
});

export const S08_Circuit: React.FC<Props> = ({ isDarkMode }) => {
  const navigate = useNavigate();

  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText   = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg    = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';

  const idle    = isDarkMode ? '#475569' : '#cbd5e1';
  const boxFill = isDarkMode ? '#0a0e1a' : '#ffffff';
  const ink     = isDarkMode ? '#e2e8f0' : '#0f172a';

  // four input bits A[3:0], B[3:0] plus the incoming carry
  const [a, setA] = useState<number[]>([1, 0, 1, 1]); // index 0 = bit 0 (LSB)
  const [b, setB] = useState<number[]>([0, 1, 1, 0]);
  const [cin, setCin] = useState(0);

  const toggleA = (i: number) => setA(v => v.map((x, k) => (k === i ? x ^ 1 : x)));
  const toggleB = (i: number) => setB(v => v.map((x, k) => (k === i ? x ^ 1 : x)));

  // ── pre-processing: Pi = Ai XOR Bi, Gi = Ai AND Bi
  const P = a.map((ai, i) => ai ^ b[i]);
  const G = a.map((ai, i) => ai & b[i]);

  // ── Kogge-Stone prefix tree over 4 bits = 2 levels (span 1, then span 2)
  // level 1 (distance 1): pos i merges with pos i-1
  const l1 = [0, 1, 2, 3].map(i => {
    if (i < 1) return { g: G[i], p: P[i] };
    return merge(G[i], P[i], G[i - 1], P[i - 1]);
  });
  // level 2 (distance 2): pos i merges with pos i-2
  const l2 = [0, 1, 2, 3].map(i => {
    if (i < 2) return { g: l1[i].g, p: l1[i].p };
    return merge(l1[i].g, l1[i].p, l1[i - 2].g, l1[i - 2].p);
  });

  // carry out of bit i = G[i:0] OR (P[i:0] AND Cin); the prefix (G,P) at i combined with Cin
  const carryOutOf = (i: number) => l2[i].g | (l2[i].p & cin);
  // carry INTO bit i: bit 0 gets Cin, bit i (>0) gets the carry out of bit i-1
  const carryInto = [cin, carryOutOf(0), carryOutOf(1), carryOutOf(2)]; // feeds bits 0..3
  const cout = carryOutOf(3); // carry out of the top bit

  // ── post-processing: Si = Pi XOR C(i-1)
  const S = P.map((pi, i) => pi ^ carryInto[i]);

  const wire = (on: number, base: string) => (on ? base : idle);
  const glow = (on: number, base: string) => (on ? `drop-shadow(0 0 6px ${base})` : 'none');

  // bit columns laid left (MSB, bit 3) to right (LSB, bit 0) on the schematic
  const cols = [3, 2, 1, 0];
  const colX = (bit: number) => 90 + (3 - bit) * 130; // bit3 -> x90, bit0 -> x480

  const Pad: React.FC<{ on: number; x: number; y: number; label: string; onClick: () => void }> =
    ({ on, x, y, label, onClick }) => (
      <g style={{ cursor: 'pointer' }} onClick={onClick}>
        <rect x={x - 16} y={y - 14} width={32} height={28} rx={7}
          fill={on ? EMERALD : 'none'} stroke={EMERALD} strokeWidth="2"
          style={{ filter: on ? `drop-shadow(0 0 7px ${EMERALD})` : 'none' }} />
        <text x={x} y={y + 5} textAnchor="middle" fontSize="13" fontFamily="monospace" fontWeight="bold"
          fill={on ? '#000' : EMERALD}>{on}</text>
        <text x={x} y={y - 20} textAnchor="middle" fontSize="9" fontFamily="monospace" fill={ink}>{label}</text>
      </g>
    );

  return (
    <div className="max-w-6xl mx-auto space-y-12 py-4">
      <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.4em] uppercase" style={{ color: EMERALD }}>
          <CircuitBoard size={14} /> Chapter 09 · The Gate-Level Schematic
        </div>
        <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>
          A 4-bit Kogge-Stone adder, <span style={{ color: EMERALD }}>wire by wire.</span>
        </h2>
        <p className={`text-base max-w-3xl ${subText}`}>
          Everything from the lessons, drawn as real gates. Toggle the input bits and watch the carries
          race up a tree that is only <strong className={textColor}>log2(N)</strong> levels deep. Three stages
          stack top to bottom: the pre-processing row, the prefix tree, and the final sum row.
        </p>
      </motion.section>

      {/* ── stage A: pre-processing equations ── */}
      <TryItYourself label="Click the A / B pads and Cin" />
      <div className={`relative p-6 md:p-8 rounded-3xl border ${cardBg}`}>
        <div className="font-mono text-[10px] uppercase tracking-widest mb-4" style={{ color: EMERALD }}>
          Stage A · Pre-processing (one cell per bit)
        </div>
        <p className={`text-sm mb-5 ${subText}`}>
          Every bit independently computes whether it <em>generates</em> a carry and whether it would
          <em> propagate</em> one. These are the leaves the tree will merge.
        </p>
        <svg viewBox="0 0 600 150" className="w-full max-w-3xl mx-auto h-auto">
          {cols.map(bit => {
            const x = colX(bit);
            return (
              <g key={bit}>
                <Pad on={a[bit]} x={x - 22} y={26} label={`A${bit}`} onClick={() => toggleA(bit)} />
                <Pad on={b[bit]} x={x + 22} y={26} label={`B${bit}`} onClick={() => toggleB(bit)} />
                {/* leads down into the gate cluster */}
                <line x1={x - 22} y1={40} x2={x - 22} y2={66} stroke={wire(a[bit], EMERALD)} strokeWidth="2.5" style={{ filter: glow(a[bit], EMERALD) }} />
                <line x1={x + 22} y1={40} x2={x + 22} y2={66} stroke={wire(b[bit], EMERALD)} strokeWidth="2.5" style={{ filter: glow(b[bit], EMERALD) }} />
                {/* P = XOR */}
                <rect x={x - 40} y={66} width={36} height={26} rx={6} fill={boxFill} stroke={SKY} strokeWidth="2" />
                <text x={x - 22} y={83} textAnchor="middle" fontSize="9" fontFamily="monospace" fontWeight="bold" fill={SKY}>XOR</text>
                {/* G = AND */}
                <rect x={x + 4} y={66} width={36} height={26} rx={6} fill={boxFill} stroke={EMERALD} strokeWidth="2" />
                <text x={x + 22} y={83} textAnchor="middle" fontSize="9" fontFamily="monospace" fontWeight="bold" fill={EMERALD}>AND</text>
                {/* result chips */}
                <line x1={x - 22} y1={92} x2={x - 22} y2={108} stroke={wire(P[bit], SKY)} strokeWidth="2.5" style={{ filter: glow(P[bit], SKY) }} />
                <circle cx={x - 22} cy={120} r={11} fill={P[bit] ? SKY : 'none'} stroke={SKY} strokeWidth="2" style={{ filter: glow(P[bit], SKY) }} />
                <text x={x - 22} y={124} textAnchor="middle" fontSize="11" fontFamily="monospace" fontWeight="bold" fill={P[bit] ? '#000' : SKY}>{P[bit]}</text>
                <text x={x - 22} y={146} textAnchor="middle" fontSize="9" fontFamily="monospace" fill={SKY}>P{bit}</text>
                <line x1={x + 22} y1={92} x2={x + 22} y2={108} stroke={wire(G[bit], EMERALD)} strokeWidth="2.5" style={{ filter: glow(G[bit], EMERALD) }} />
                <circle cx={x + 22} cy={120} r={11} fill={G[bit] ? EMERALD : 'none'} stroke={EMERALD} strokeWidth="2" style={{ filter: glow(G[bit], EMERALD) }} />
                <text x={x + 22} y={124} textAnchor="middle" fontSize="11" fontFamily="monospace" fontWeight="bold" fill={G[bit] ? '#000' : EMERALD}>{G[bit]}</text>
                <text x={x + 22} y={146} textAnchor="middle" fontSize="9" fontFamily="monospace" fill={EMERALD}>G{bit}</text>
              </g>
            );
          })}
        </svg>
        <p className="text-center text-xs font-mono mt-2" style={{ color: EMERALD }}>
          Pi = Ai XOR Bi &nbsp;·&nbsp; Gi = Ai AND Bi &nbsp;-&nbsp; click any A / B pad to toggle it
        </p>
      </div>

      {/* ── stage B: the prefix tree ── */}
      <div className={`p-6 md:p-8 rounded-3xl border ${cardBg}`}>
        <div className="font-mono text-[10px] uppercase tracking-widest mb-4" style={{ color: EMERALD }}>
          Stage B · The Kogge-Stone prefix tree (span doubles each level)
        </div>
        <svg viewBox="0 0 600 320" className="w-full max-w-3xl mx-auto h-auto">
          {/* row labels */}
          <text x={8} y={40}  fontSize="9" fontFamily="monospace" fill={ink}>leaves</text>
          <text x={8} y={150} fontSize="9" fontFamily="monospace" fill={ink}>level 1</text>
          <text x={8} y={150 + 12} fontSize="8" fontFamily="monospace" fill={idle}>span 1</text>
          <text x={8} y={260} fontSize="9" fontFamily="monospace" fill={ink}>level 2</text>
          <text x={8} y={260 + 12} fontSize="8" fontFamily="monospace" fill={idle}>span 2</text>

          {/* diagonal merge wires: level 1 (i <- i-1) */}
          {[1, 2, 3].map(i => (
            <line key={`d1-${i}`} x1={colX(i - 1)} y1={50} x2={colX(i)} y2={130}
              stroke={wire(l1[i].g, MINT)} strokeWidth="2.5" style={{ filter: glow(l1[i].g, MINT) }} />
          ))}
          {/* diagonal merge wires: level 2 (i <- i-2) */}
          {[2, 3].map(i => (
            <line key={`d2-${i}`} x1={colX(i - 2)} y1={160} x2={colX(i)} y2={240}
              stroke={wire(l2[i].g, MINT)} strokeWidth="2.5" style={{ filter: glow(l2[i].g, MINT) }} />
          ))}

          {/* node rows: leaves (G,P) -> level1 -> level2 */}
          {cols.map(bit => {
            const x = colX(bit);
            const node = (y: number, g: number, p: number, kind: 'leaf' | 'black' | 'pass') => (
              <g>
                {/* straight pass-down wire */}
                <line x1={x} y1={y - 80} x2={x} y2={y - 16} stroke={wire(g, EMERALD)} strokeWidth="2.5" style={{ filter: glow(g, EMERALD) }} />
                <rect x={x - 22} y={y - 16} width={44} height={32} rx={8}
                  fill={kind === 'black' ? (isDarkMode ? '#0a0e1a' : '#0f172a') : boxFill}
                  stroke={kind === 'pass' ? idle : EMERALD} strokeWidth="2"
                  style={{ filter: g ? `drop-shadow(0 0 5px ${EMERALD})` : 'none' }} />
                <text x={x} y={y - 1} textAnchor="middle" fontSize="9" fontFamily="monospace" fontWeight="bold" fill={kind === 'black' ? MINT : EMERALD}>{g}{','}{p}</text>
                <text x={x} y={y + 11} textAnchor="middle" fontSize="7" fontFamily="monospace" fill={idle}>G,P</text>
              </g>
            );
            return (
              <g key={bit}>
                {node(40, G[bit], P[bit], 'leaf')}
                {node(150, l1[bit].g, l1[bit].p, bit >= 1 ? 'black' : 'pass')}
                {node(260, l2[bit].g, l2[bit].p, bit >= 2 ? 'black' : 'pass')}
                <text x={x} y={306} textAnchor="middle" fontSize="9" fontFamily="monospace" fontWeight="bold" fill={EMERALD}>C{bit} = {l2[bit].g}</text>
              </g>
            );
          })}
        </svg>
        <div className={`mt-3 grid sm:grid-cols-2 gap-3 text-[12px] ${subText}`}>
          <div className="flex items-center gap-2">
            <span className="inline-block w-4 h-4 rounded" style={{ background: isDarkMode ? '#0f172a' : '#0f172a', border: `2px solid ${EMERALD}` }} />
            <span><strong style={{ color: MINT }}>Black cell</strong>: outputs both Gout and Pout (merges two spans).</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block w-4 h-4 rounded" style={{ background: boxFill, border: `2px solid ${idle}` }} />
            <span><strong className={textColor}>Pass node</strong>: a gray cell would output only Gout; here it just forwards.</span>
          </div>
        </div>
        <p className="text-center text-xs font-mono mt-3" style={{ color: EMERALD }}>
          prefix-G at position i is the carry into bit i+1 &nbsp;-&nbsp; 4 bits need only 2 levels (log2 4)
        </p>
      </div>

      {/* ── one black cell exploded into gates ── */}
      <div className={`p-6 md:p-8 rounded-3xl border ${cardBg}`}>
        <div className="font-mono text-[10px] uppercase tracking-widest mb-4" style={{ color: EMERALD }}>
          Inside one black cell · 2 AND + 1 OR for Gout, 1 AND for Pout
        </div>
        <svg viewBox="0 0 560 220" className="w-full max-w-2xl mx-auto h-auto">
          {/* sample inputs taken live from the L1 pos-1 merge: upper = leaf1, lower = leaf0 */}
          {(() => {
            const gu = G[1], pu = P[1], gl = G[0], pl = P[0];
            const andLow = pu & gl;          // Pu AND Gl
            const gOut = gu | andLow;          // OR
            const pOut = pu & pl;              // Pu AND Pl
            const In = (y: number, on: number, label: string, color: string) => (
              <g key={label}>
                <text x={16} y={y + 4} fontSize="10" fontFamily="monospace" fontWeight="bold" fill={color}>{label}={on}</text>
                <line x1={62} y1={y} x2={130} y2={y} stroke={wire(on, color)} strokeWidth="2.5" style={{ filter: glow(on, color) }} />
              </g>
            );
            return (
              <>
                {In(30, gu, 'Gu', EMERALD)}
                {In(70, pu, 'Pu', SKY)}
                {In(120, gl, 'Gl', EMERALD)}
                {In(170, pl, 'Pl', SKY)}

                {/* AND: Pu · Gl */}
                <path d="M 130 84 L 130 116 L 150 116 Q 174 116 174 100 Q 174 84 150 84 Z" fill={boxFill} stroke={MINT} strokeWidth="2" />
                <text x={150} y={104} textAnchor="middle" fontSize="8" fontFamily="monospace" fill={MINT}>AND</text>
                <line x1={174} y1={100} x2={210} y2={100} stroke={wire(andLow, MINT)} strokeWidth="2.5" style={{ filter: glow(andLow, MINT) }} />

                {/* OR: Gu + (Pu·Gl) -> Gout */}
                <line x1={130} y1={30} x2={210} y2={30} stroke={wire(gu, EMERALD)} strokeWidth="2.5" style={{ filter: glow(gu, EMERALD) }} />
                <path d="M 208 14 Q 226 50 208 86 Q 252 86 274 50 Q 252 14 208 14 Z" fill={boxFill} stroke={EMERALD} strokeWidth="2" />
                <text x={238} y={54} textAnchor="middle" fontSize="8" fontFamily="monospace" fill={EMERALD}>OR</text>
                <line x1={274} y1={50} x2={330} y2={50} stroke={wire(gOut, EMERALD)} strokeWidth="2.5" style={{ filter: glow(gOut, EMERALD) }} />
                <circle cx={346} cy={50} r={13} fill={gOut ? EMERALD : 'none'} stroke={EMERALD} strokeWidth="2" style={{ filter: glow(gOut, EMERALD) }} />
                <text x={346} y={54} textAnchor="middle" fontSize="11" fontFamily="monospace" fontWeight="bold" fill={gOut ? '#000' : EMERALD}>{gOut}</text>
                <text x={378} y={47} fontSize="10" fontFamily="monospace" fontWeight="bold" fill={EMERALD}>Gout</text>
                <text x={378} y={60} fontSize="9" fontFamily="monospace" fill={EMERALD}>= {gOut}</text>

                {/* AND: Pu · Pl -> Pout */}
                <path d="M 130 150 L 130 190 L 152 190 Q 180 190 180 170 Q 180 150 152 150 Z" fill={boxFill} stroke={SKY} strokeWidth="2" />
                <text x={152} y={174} textAnchor="middle" fontSize="8" fontFamily="monospace" fill={SKY}>AND</text>
                <line x1={180} y1={170} x2={330} y2={170} stroke={wire(pOut, SKY)} strokeWidth="2.5" style={{ filter: glow(pOut, SKY) }} />
                <circle cx={346} cy={170} r={13} fill={pOut ? SKY : 'none'} stroke={SKY} strokeWidth="2" style={{ filter: glow(pOut, SKY) }} />
                <text x={346} y={174} textAnchor="middle" fontSize="11" fontFamily="monospace" fontWeight="bold" fill={pOut ? '#000' : SKY}>{pOut}</text>
                <text x={378} y={167} fontSize="10" fontFamily="monospace" fontWeight="bold" fill={SKY}>Pout</text>
                <text x={378} y={180} fontSize="9" fontFamily="monospace" fill={SKY}>= {pOut}</text>
              </>
            );
          })()}
        </svg>
        <div className={`mt-3 space-y-1 font-mono text-[13px] text-center ${textColor}`}>
          <div><span style={{ color: EMERALD }}>Gout</span> = Gu OR (Pu AND Gl)</div>
          <div><span style={{ color: SKY }}>Pout</span> = Pu AND Pl</div>
        </div>
        <p className={`text-xs text-center mt-2 ${subText}`}>
          This cell shown live for the upper = bit 1, lower = bit 0 merge. The same three gates are tiled
          across every node in Stage B.
        </p>
      </div>

      {/* ── stage C: post-processing sum row ── */}
      <div className={`p-6 md:p-8 rounded-3xl border ${cardBg}`}>
        <div className="font-mono text-[10px] uppercase tracking-widest mb-4" style={{ color: EMERALD }}>
          Stage C · Post-processing (final sum bits)
        </div>
        <div className="flex justify-center mb-4">
          <button onClick={() => setCin(c => c ^ 1)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 font-mono text-xs font-black transition-all active:scale-95"
            style={{ borderColor: AMBER, color: cin ? '#000' : AMBER, background: cin ? AMBER : 'transparent' }}>
            <Zap size={13} /> Cin = {cin} (click to toggle)
          </button>
        </div>
        <svg viewBox="0 0 600 150" className="w-full max-w-3xl mx-auto h-auto">
          {cols.map(bit => {
            const x = colX(bit);
            const cInBit = carryInto[bit];
            return (
              <g key={bit}>
                {/* Pi in from above */}
                <line x1={x - 16} y1={10} x2={x - 16} y2={44} stroke={wire(P[bit], SKY)} strokeWidth="2.5" style={{ filter: glow(P[bit], SKY) }} />
                <text x={x - 16} y={8} textAnchor="middle" fontSize="9" fontFamily="monospace" fill={SKY}>P{bit}</text>
                {/* carry-in C(i-1) */}
                <line x1={x + 16} y1={10} x2={x + 16} y2={44} stroke={wire(cInBit, EMERALD)} strokeWidth="2.5" style={{ filter: glow(cInBit, EMERALD) }} />
                <text x={x + 16} y={8} textAnchor="middle" fontSize="9" fontFamily="monospace" fill={EMERALD}>{bit === 0 ? 'Cin' : `C${bit - 1}`}={cInBit}</text>
                {/* XOR */}
                <rect x={x - 22} y={44} width={44} height={28} rx={7} fill={boxFill} stroke={SKY} strokeWidth="2" />
                <text x={x} y={62} textAnchor="middle" fontSize="9" fontFamily="monospace" fontWeight="bold" fill={SKY}>XOR</text>
                {/* sum out */}
                <line x1={x} y1={72} x2={x} y2={92} stroke={wire(S[bit], EMERALD)} strokeWidth="3" style={{ filter: glow(S[bit], EMERALD) }} />
                <circle cx={x} cy={108} r={14} fill={S[bit] ? EMERALD : 'none'} stroke={EMERALD} strokeWidth="2.5" style={{ filter: glow(S[bit], EMERALD) }} />
                <text x={x} y={113} textAnchor="middle" fontSize="13" fontFamily="monospace" fontWeight="bold" fill={S[bit] ? '#000' : EMERALD}>{S[bit]}</text>
                <text x={x} y={138} textAnchor="middle" fontSize="10" fontFamily="monospace" fontWeight="bold" fill={EMERALD}>S{bit}</text>
              </g>
            );
          })}
          {/* carry out chip */}
          <circle cx={26} cy={108} r={13} fill={cout ? AMBER : 'none'} stroke={AMBER} strokeWidth="2.5" style={{ filter: glow(cout, AMBER) }} />
          <text x={26} y={112} textAnchor="middle" fontSize="11" fontFamily="monospace" fontWeight="bold" fill={cout ? '#000' : AMBER}>{cout}</text>
          <text x={26} y={138} textAnchor="middle" fontSize="9" fontFamily="monospace" fontWeight="bold" fill={AMBER}>Cout</text>
        </svg>
        <p className="text-center text-xs font-mono mt-2" style={{ color: EMERALD }}>
          Si = Pi XOR C(i-1), with C(-1) = Cin
        </p>

        {/* live result readout */}
        <div className={`mt-5 flex flex-wrap justify-center gap-x-8 gap-y-2 font-mono text-sm ${textColor}`}>
          <span>A = {[3, 2, 1, 0].map(i => a[i]).join('')}<sub className="opacity-50">2</sub> = {a.reduce((s, x, i) => s + x * (1 << i), 0)}</span>
          <span>B = {[3, 2, 1, 0].map(i => b[i]).join('')}<sub className="opacity-50">2</sub> = {b.reduce((s, x, i) => s + x * (1 << i), 0)}</span>
          <span style={{ color: EMERALD }}>
            Sum = {cout}{[3, 2, 1, 0].map(i => S[i]).join('')}<sub className="opacity-50">2</sub> ={' '}
            {(cout << 4) + S.reduce((s, x, i) => s + x * (1 << i), 0)}
          </span>
        </div>
      </div>

      {/* ── the trade-off caption ── */}
      <div className="p-6 rounded-3xl border-2 text-center"
        style={{ borderColor: `${EMERALD}66`, background: isDarkMode ? 'rgba(52,211,153,0.06)' : 'rgba(52,211,153,0.05)' }}>
        <p className={`text-base md:text-lg font-bold leading-relaxed max-w-3xl mx-auto ${textColor}`}>
          The trade Kogge-Stone makes: it pays in <span style={{ color: EMERALD }}>wires and cells</span> (every
          level fans out widely, so area and wiring grow) to buy the shortest possible path - a depth of just
          <span style={{ color: EMERALD }}> log2(N)</span> gate levels. That is why this topology is the basis of
          the real wide adders inside fast CPUs, where speed beats area.
        </p>
      </div>

      {/* ── call to action ── */}
      <div className="flex flex-col items-center gap-3 pt-2">
        <button onClick={() => navigate('/workbench?tutorial=parallel-prefix')}
          className="group flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-black transition-all active:scale-95 shadow-xl"
          style={{ background: EMERALD, boxShadow: `0 12px 34px ${EMERALD}44` }}>
          <Hammer size={20} />
          Build it for real in the workbench
          <span className="transition-transform group-hover:translate-x-1">-&gt;</span>
        </button>
        <p className={`text-xs ${subText}`}>
          Drop these exact gates onto the CircuitVerse canvas and wire the tree yourself.
        </p>
      </div>
    </div>
  );
};
