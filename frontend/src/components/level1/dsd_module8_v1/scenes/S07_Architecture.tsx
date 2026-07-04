import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Blocks, MousePointerClick, Package, Sigma } from 'lucide-react';
import { TryItYourself } from '../../../ui/TryItYourself';

interface Props { isActive?: boolean; isDarkMode: boolean }

const AMBER = '#f59e0b';
const CYAN = '#22d3ee';
const EMERALD = '#34d399';
const VIOLET = '#a78bfa';

export const S07_Architecture: React.FC<Props> = ({ isDarkMode }) => {
  const [a, setA] = useState(false);
  const [b, setB] = useState(false);
  const [cin, setCin] = useState(false);

  // every internal wire of the two-half-adder build, live
  const p  = a !== b;        // partial sum from HA1
  const c1 = a && b;         // partial carry 1
  const s  = p !== cin;      // final sum from HA2
  const c2 = p && cin;       // partial carry 2
  const cout = c1 || c2;     // merged by the OR

  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText   = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg    = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';
  const idle      = isDarkMode ? '#475569' : '#cbd5e1';
  const boxFill   = isDarkMode ? '#0a0e1a' : '#ffffff';

  const sumWire   = (on: boolean) => (on ? CYAN : idle);
  const carryWire = (on: boolean) => (on ? AMBER : idle);
  const glowS = (on: boolean) => (on ? `drop-shadow(0 0 5px ${CYAN})` : 'none');
  const glowC = (on: boolean) => (on ? `drop-shadow(0 0 5px ${AMBER})` : 'none');

  const toggle = (label: string, on: boolean, flip: () => void, color: string) => (
    <button
      key={label}
      onClick={flip}
      className="px-5 py-3 rounded-xl border-2 font-mono font-black transition-all flex flex-col items-start gap-0.5 min-w-[104px] active:scale-95"
      style={{
        borderColor: color,
        color: on ? '#000' : color,
        backgroundColor: on ? color : 'transparent',
        boxShadow: on ? `0 0 25px ${color}55` : 'none',
      }}
    >
      <span className="text-[10px] uppercase tracking-widest opacity-80">input</span>
      <span className="text-lg">{label} = {on ? 1 : 0}</span>
    </button>
  );

  const bit = (v: boolean) => (v ? 1 : 0);

  return (
    <div className="max-w-6xl mx-auto space-y-12 py-4">
      {/* header */}
      <section className="space-y-3">
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.4em] uppercase text-emerald-400">
          <Blocks size={14} /> Chapter 08 · System Synthesis
        </div>
        <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>
          Two halves make a whole.
        </h2>
        <p className={`text-base max-w-3xl ${subText}`}>
          A complete full adder is elegantly constructed by cascading discrete operational
          blocks you already own: <strong style={{ color: CYAN }}>Half Adder 1</strong> computes
          the partial sum and partial carry of A and B,{' '}
          <strong style={{ color: AMBER }}>Half Adder 2</strong> integrates Cin with the partial
          sum to generate the final Sum, and an <strong style={{ color: VIOLET }}>OR gate</strong>{' '}
          converges the intermediate carry signals into the final Carry-out.
        </p>
      </section>

      {/* interactive modular schematic */}
      <TryItYourself />
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                  className={`p-6 md:p-8 rounded-3xl border ${cardBg}`}>
        <div className={`flex items-center gap-2 text-xs font-mono mb-4 ${subText}`}>
          <MousePointerClick size={12} /> Flip the inputs · every internal wire updates live
        </div>

        <svg viewBox="0 0 660 260" className="w-full h-auto" role="img"
             aria-label="Full adder built from two half adders and an OR gate, with live signal values">
          {/* ── inputs A, B into HA1 ── */}
          <line x1={40} y1={65} x2={120} y2={65} stroke={sumWire(a)} strokeWidth="3" style={{ filter: glowS(a) }} />
          <line x1={40} y1={105} x2={120} y2={105} stroke={sumWire(b)} strokeWidth="3" style={{ filter: glowS(b) }} />
          <text x={32} y={69} textAnchor="end" fontSize="13" fontFamily="monospace" fontWeight="bold" fill={a ? CYAN : idle}>A</text>
          <text x={32} y={109} textAnchor="end" fontSize="13" fontFamily="monospace" fontWeight="bold" fill={b ? CYAN : idle}>B</text>

          {/* ── HA1 block ── */}
          <rect x={120} y={40} width={130} height={100} rx={12} fill={boxFill} stroke={CYAN} strokeWidth="2.5" />
          <text x={185} y={62} textAnchor="middle" fontSize="11" fontFamily="monospace" fontWeight="bold" fill={CYAN}>HALF ADDER 1</text>
          <text x={185} y={98} textAnchor="middle" fontSize="9" fontFamily="monospace" fill={CYAN} opacity="0.75">XOR → P</text>
          <text x={185} y={114} textAnchor="middle" fontSize="9" fontFamily="monospace" fill={AMBER} opacity="0.75">AND → C1</text>

          {/* ── P: partial sum from HA1 into HA2 ── */}
          <polyline points="250,70 295,70 295,160 330,160" fill="none"
                    stroke={sumWire(p)} strokeWidth="3" style={{ filter: glowS(p) }} />
          <text x={262} y={60} fontSize="10" fontFamily="monospace" fontWeight="bold" fill={p ? CYAN : idle}>
            P={bit(p)}
          </text>

          {/* ── C1: partial carry 1 toward the OR ── */}
          <polyline points="250,120 490,120 490,100 510,100" fill="none"
                    stroke={carryWire(c1)} strokeWidth="3" style={{ filter: glowC(c1) }} />
          <text x={300} y={112} fontSize="10" fontFamily="monospace" fontWeight="bold" fill={c1 ? AMBER : idle}>
            C1 = A·B = {bit(c1)}
          </text>

          {/* ── Cin into HA2 ── */}
          <line x1={40} y1={200} x2={330} y2={200} stroke={sumWire(cin)} strokeWidth="3" style={{ filter: glowS(cin) }} />
          <text x={32} y={204} textAnchor="end" fontSize="13" fontFamily="monospace" fontWeight="bold" fill={cin ? EMERALD : idle}>Cin</text>

          {/* ── HA2 block ── */}
          <rect x={330} y={130} width={130} height={100} rx={12} fill={boxFill} stroke={AMBER} strokeWidth="2.5" />
          <text x={395} y={152} textAnchor="middle" fontSize="11" fontFamily="monospace" fontWeight="bold" fill={AMBER}>HALF ADDER 2</text>
          <text x={395} y={188} textAnchor="middle" fontSize="9" fontFamily="monospace" fill={CYAN} opacity="0.75">XOR → S</text>
          <text x={395} y={204} textAnchor="middle" fontSize="9" fontFamily="monospace" fill={AMBER} opacity="0.75">AND → C2</text>

          {/* ── C2: partial carry 2 toward the OR ── */}
          <polyline points="460,205 490,205 490,130 510,130" fill="none"
                    stroke={carryWire(c2)} strokeWidth="3" style={{ filter: glowC(c2) }} />
          <text x={468} y={222} fontSize="10" fontFamily="monospace" fontWeight="bold" fill={c2 ? AMBER : idle}>
            C2 = P·Cin = {bit(c2)}
          </text>

          {/* ── OR gate ── */}
          <path d="M 506 82 Q 518 115 506 148 Q 548 148 574 115 Q 548 82 506 82 Z"
                fill={boxFill} stroke={cout ? VIOLET : idle} strokeWidth="2.5"
                style={{ filter: cout ? `drop-shadow(0 0 10px ${VIOLET}88)` : 'none' }} />
          <text x={534} y={120} textAnchor="middle" fontSize="12" fontFamily="monospace" fontWeight="bold" fill={cout ? VIOLET : idle}>OR</text>

          {/* ── Cout output ── */}
          <line x1={574} y1={115} x2={606} y2={115} stroke={carryWire(cout)} strokeWidth="3" style={{ filter: glowC(cout) }} />
          <circle cx={622} cy={115} r={13} fill={cout ? AMBER : 'none'} stroke={AMBER} strokeWidth="2.5"
                  style={{ filter: cout ? `drop-shadow(0 0 14px ${AMBER})` : 'none' }} />
          <text x={622} y={92} textAnchor="middle" fontSize="10" fontFamily="monospace" fontWeight="bold" fill={AMBER}>
            Cout={bit(cout)}
          </text>

          {/* ── S output ── */}
          <line x1={460} y1={165} x2={606} y2={165} stroke={sumWire(s)} strokeWidth="3" style={{ filter: glowS(s) }} />
          <circle cx={622} cy={165} r={13} fill={s ? CYAN : 'none'} stroke={CYAN} strokeWidth="2.5"
                  style={{ filter: s ? `drop-shadow(0 0 14px ${CYAN})` : 'none' }} />
          <text x={622} y={194} textAnchor="middle" fontSize="10" fontFamily="monospace" fontWeight="bold" fill={CYAN}>
            S={bit(s)}
          </text>
        </svg>

        <div className="flex items-center justify-center gap-3 flex-wrap mt-4">
          {toggle('A', a, () => setA(v => !v), CYAN)}
          {toggle('B', b, () => setB(v => !v), CYAN)}
          {toggle('Cin', cin, () => setCin(v => !v), EMERALD)}
        </div>

        {/* live signal trace */}
        <div className={`mt-6 p-4 rounded-2xl border font-mono text-[12px] md:text-sm text-center ${textColor} ${
          isDarkMode ? 'bg-black/30 border-white/10' : 'bg-slate-50 border-slate-200'
        }`}>
          P = {bit(a)}⊕{bit(b)} = <strong style={{ color: CYAN }}>{bit(p)}</strong>
          <span className="opacity-40 mx-2">·</span>
          C1 = {bit(a)}·{bit(b)} = <strong style={{ color: AMBER }}>{bit(c1)}</strong>
          <span className="opacity-40 mx-2">·</span>
          S = {bit(p)}⊕{bit(cin)} = <strong style={{ color: CYAN }}>{bit(s)}</strong>
          <span className="opacity-40 mx-2">·</span>
          C2 = {bit(p)}·{bit(cin)} = <strong style={{ color: AMBER }}>{bit(c2)}</strong>
          <span className="opacity-40 mx-2">·</span>
          Cout = {bit(c1)}+{bit(c2)} = <strong style={{ color: VIOLET }}>{bit(cout)}</strong>
        </div>
      </motion.div>

      {/* the video's packing-station picture for this exact diagram */}
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                  className={`p-6 rounded-3xl border-2 ${isDarkMode ? 'bg-amber-500/5' : 'bg-amber-50'}`}
                  style={{ borderColor: `${AMBER}44` }}>
        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest mb-3" style={{ color: AMBER }}>
          <Package size={13} /> The video's picture · a packing station with two packers
        </div>
        <p className={`text-sm leading-relaxed max-w-3xl ${textColor}`}>
          <strong style={{ color: CYAN }}>Packer 1 (HA1)</strong> pairs the two local parcels,
          A and B: the leftover goes down the line as P, and a full pair goes to the dock as
          C1. <strong style={{ color: AMBER }}>Packer 2 (HA2)</strong> folds the carried-over
          item Cin into the leftovers: what remains is the Sum that stays in this column, and
          a second full pair becomes C2. <strong style={{ color: VIOLET }}>The shipping dock
          (OR)</strong> sends a box onward if <em>either</em> packer handed it one - and only
          one of them ever can at once. The shipped box arrives at the next station as its
          carried-over item: Cout becomes the next Cin.
        </p>
      </motion.div>

      {/* the three blocks explained */}
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                  className="grid sm:grid-cols-3 gap-3">
        {[
          ['1 · Half Adder 1', 'Computes the partial sum P = A ⊕ B and the partial carry C1 = A · B of the two operands. It has no idea Cin exists - and does not need to.', CYAN],
          ['2 · Half Adder 2', 'Integrates Cin with the partial sum: the final Sum S = P ⊕ Cin, plus a second partial carry C2 = P · Cin for the cases where Cin tips a column over.', AMBER],
          ['3 · The OR gate', 'Converges the intermediate carry signals: Cout = C1 + C2. The two carries can never both be 1 at once, so a simple OR merges them losslessly.', VIOLET],
        ].map(([title, body, color]) => (
          <div key={title as string} className={`p-5 rounded-2xl border-2 ${cardBg}`}
               style={{ borderColor: `${color as string}44` }}>
            <div className="font-mono text-[11px] font-black uppercase tracking-widest mb-2" style={{ color: color as string }}>
              {title}
            </div>
            <p className={`text-sm leading-relaxed ${subText}`}>{body}</p>
          </div>
        ))}
      </motion.div>

      {/* the algebra agrees */}
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
                  className={`p-6 rounded-3xl border ${cardBg}`}>
        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest mb-4" style={{ color: EMERALD }}>
          <Sigma size={13} /> Proof the modular build matches Chapter 05's formula
        </div>
        <div className={`font-mono text-sm md:text-base text-center space-y-2 ${textColor}`}>
          <div>Cout = C1 + C2 = A·B + (A ⊕ B)·Cin</div>
          <div className="opacity-50 text-xs">expand the XOR: (A ⊕ B)·Cin = A·B&#39;·Cin + A&#39;·B·Cin</div>
          <div>= A·B + A·Cin + B·Cin <span style={{ color: EMERALD }}>✓ the majority function</span></div>
        </div>
        <p className={`text-sm text-center max-w-2xl mx-auto mt-4 ${subText}`}>
          Two different shapes - one truth. The direct gate recipe (3 AND + 1 OR + 1 triple XOR)
          and the modular build (2 HA + 1 OR) synthesize the <em>same</em> two formulas. Engineers
          prefer the modular one because it reuses a block that is already designed, tested and
          trusted.
        </p>
      </motion.div>
    </div>
  );
};
