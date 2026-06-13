import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { CircuitBoard, RotateCcw, StepForward, Clock, Hammer, ArrowRight } from 'lucide-react';

interface Props { isActive?: boolean; isDarkMode: boolean }

// PART II accent (THE MECHANISM) from the Engine's getPartTheme.
const EMERALD = '#34d399';
const CYAN = '#22d3ee';
const AMBER = '#f59e0b';
const VIOLET = '#a78bfa';

// Concrete worked example: A = 0110 (6) + B = 0011 (3) = 1001 (9).
const A_BITS = [0, 1, 1, 0]; // MSB..LSB
const B_BITS = [0, 0, 1, 1];
const N = A_BITS.length;

interface CycleState {
  a: number[];   // A shift register (LSB at index 0)
  b: number[];   // B shift register
  res: number[]; // result register (filled MSB-first as bits arrive)
  carry: number; // value stored in the carry D flip-flop (becomes Cin)
}

// LSB-first copies of the example so a right-shift pops the bit being added.
const initialState: CycleState = {
  a: [...A_BITS].reverse(),
  b: [...B_BITS].reverse(),
  res: [],
  carry: 0,
};

// Advance one clock cycle: add the two LSBs + stored carry through the full adder.
const stepCycle = (s: CycleState): CycleState => {
  if (s.a.length === 0) return s;
  const ai = s.a[0];
  const bi = s.b[0];
  const cin = s.carry;
  const sum = ai ^ bi ^ cin;
  const cout = (ai & bi) | (bi & cin) | (ai & cin);
  return {
    a: s.a.slice(1),
    b: s.b.slice(1),
    res: [sum, ...s.res], // newest sum bit lands as the next-lower position
    carry: cout,
  };
};

export const S08_Circuit: React.FC<Props> = ({ isDarkMode }) => {
  const navigate = useNavigate();

  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';

  const idle = isDarkMode ? '#475569' : '#cbd5e1';
  const boxFill = isDarkMode ? '#0a0e1a' : '#ffffff';
  const ink = isDarkMode ? '#e2e8f0' : '#0f172a';

  const [state, setState] = useState<CycleState>(initialState);
  const cyclesDone = N - state.a.length;
  const finished = state.a.length === 0;

  // Live signals for the CURRENT (not-yet-committed) cycle, shown on the gates.
  const ai = finished ? 0 : state.a[0];
  const bi = finished ? 0 : state.b[0];
  const cin = state.carry;
  const sum = ai ^ bi ^ cin;
  const cout = (ai & bi) | (bi & cin) | (ai & cin);
  const p = ai ^ bi;          // half-sum / propagate
  const g = ai & bi;          // generate
  const live = !finished;

  const wire = (on: boolean, base: string) => (live && on ? base : idle);
  const glow = (on: boolean, base: string) => (live && on ? `drop-shadow(0 0 6px ${base})` : 'none');

  const reset = () => setState(initialState);
  const step = () => setState(s => stepCycle(s));

  // Render a small shift register as a row of bit cells (index 0 = LSB on the right).
  const RegRow: React.FC<{ bits: number[]; color: string; label: string; pad: number }> =
    ({ bits, color, label, pad }) => {
      const cells = [...bits].reverse(); // show MSB..LSB left to right
      const blanks = Math.max(0, pad - cells.length);
      return (
        <div className="flex items-center gap-3">
          <span className="font-mono text-[11px] font-bold w-14 text-right" style={{ color }}>{label}</span>
          <div className="flex gap-1">
            {Array.from({ length: blanks }).map((_, i) => (
              <div key={`bl-${i}`} className="w-7 h-7 rounded-md border-2 border-dashed opacity-20"
                style={{ borderColor: color }} />
            ))}
            {cells.map((bv, i) => {
              const isLsb = i === cells.length - 1;
              return (
                <div key={i}
                  className="w-7 h-7 rounded-md border-2 flex items-center justify-center font-mono text-sm font-black"
                  style={{
                    borderColor: bv ? color : `${color}55`,
                    background: bv ? `${color}26` : 'transparent',
                    color: bv ? color : `${color}99`,
                    boxShadow: isLsb && live && label !== 'RES' ? `0 0 10px ${color}` : 'none',
                  }}>
                  {bv}
                </div>
              );
            })}
          </div>
        </div>
      );
    };

  return (
    <div className="max-w-6xl mx-auto space-y-12 py-4">
      {/* ── intro ── */}
      <section className="space-y-3">
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.4em] uppercase" style={{ color: EMERALD }}>
          <CircuitBoard size={14} /> The Mechanism · Gate-Level Datapath
        </div>
        <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>
          One adder. One carry latch. <span style={{ color: EMERALD }}>N cycles.</span>
        </h2>
        <p className={`text-base max-w-3xl ${subText}`}>
          The serial adder is the whole opposite trade from the parallel adders. Instead of laying down
          N full adders side by side, it uses a SINGLE full adder and feeds the bits through it one at a
          time. A D flip-flop remembers the carry between cycles. Step the clock and watch A = 0110 and
          B = 0011 march through, least-significant bit first.
        </p>
      </section>

      {/* ── interactive schematic ── */}
      <div className={`p-6 md:p-8 rounded-3xl border ${cardBg}`}>
        <div className="flex items-center justify-between flex-wrap gap-3 mb-5">
          <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest" style={{ color: EMERALD }}>
            <Clock size={14} /> Cycle {Math.min(cyclesDone + (finished ? 0 : 1), N)} of {N}
          </div>
          <div className="flex items-center gap-2">
            <button onClick={reset}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl border font-mono text-[11px] font-bold transition-all active:scale-95 ${isDarkMode ? 'border-white/15 hover:bg-white/5' : 'border-slate-300 hover:bg-slate-100'} ${textColor}`}>
              <RotateCcw size={13} /> Reset
            </button>
            <button onClick={step} disabled={finished}
              className="flex items-center gap-2 px-4 py-2 rounded-xl font-mono text-[11px] font-black text-black transition-all active:scale-95 disabled:opacity-30"
              style={{ background: EMERALD, boxShadow: `0 6px 18px ${EMERALD}44` }}>
              <StepForward size={13} /> {finished ? 'Done' : 'Step clock'}
            </button>
          </div>
        </div>

        {/* gate-level diagram of the full adder + carry feedback loop */}
        <svg viewBox="0 0 640 320" className="w-full max-w-4xl mx-auto h-auto">
          {/* ── incoming bits from the A / B shift registers ── */}
          {([['Ai', ai, 40, CYAN], ['Bi', bi, 90, CYAN]] as const).map(([label, on, y, col]) => (
            <g key={label}>
              <rect x={10} y={y - 16} width={44} height={32} rx={8}
                fill={live && on ? col : 'none'} stroke={live ? col : ink} strokeWidth="2.5"
                style={{ filter: live && on ? `drop-shadow(0 0 8px ${col})` : 'none' }} />
              <text x={32} y={y - 2} textAnchor="middle" fontSize="9" fontFamily="monospace" fontWeight="bold"
                fill={live ? (on ? '#000' : col) : ink}>{label}</text>
              <text x={32} y={y + 11} textAnchor="middle" fontSize="11" fontFamily="monospace" fontWeight="bold"
                fill={live ? (on ? '#000' : col) : ink}>{live ? on : '-'}</text>
            </g>
          ))}

          {/* fan-out: Ai and Bi each feed the first XOR and the first AND */}
          <line x1={54} y1={40} x2={150} y2={40} stroke={wire(!!ai, CYAN)} strokeWidth="3" style={{ filter: glow(!!ai, CYAN) }} />
          <line x1={54} y1={90} x2={150} y2={90} stroke={wire(!!bi, CYAN)} strokeWidth="3" style={{ filter: glow(!!bi, CYAN) }} />
          <circle cx={100} cy={40} r={4} fill={wire(!!ai, AMBER)} />
          <circle cx={120} cy={90} r={4} fill={wire(!!bi, AMBER)} />
          <line x1={100} y1={40} x2={100} y2={180} stroke={wire(!!ai, AMBER)} strokeWidth="3" style={{ filter: glow(!!ai, AMBER) }} />
          <line x1={100} y1={180} x2={150} y2={180} stroke={wire(!!ai, AMBER)} strokeWidth="3" style={{ filter: glow(!!ai, AMBER) }} />
          <line x1={120} y1={90} x2={120} y2={200} stroke={wire(!!bi, AMBER)} strokeWidth="3" style={{ filter: glow(!!bi, AMBER) }} />
          <line x1={120} y1={200} x2={150} y2={200} stroke={wire(!!bi, AMBER)} strokeWidth="3" style={{ filter: glow(!!bi, AMBER) }} />

          {/* XOR 1 -> propagate P = Ai ⊕ Bi */}
          <path d="M 146 22 Q 162 47 146 72" fill="none" stroke={CYAN} strokeWidth="2.5" />
          <path d="M 154 22 Q 170 47 154 72 Q 188 72 210 47 Q 188 22 154 22 Z" fill={boxFill} stroke={CYAN} strokeWidth="2.5" />
          <text x={177} y={51} textAnchor="middle" fontSize="9" fontFamily="monospace" fontWeight="bold" fill={CYAN}>XOR</text>
          <line x1={210} y1={47} x2={300} y2={47} stroke={wire(!!p, CYAN)} strokeWidth="3" style={{ filter: glow(!!p, CYAN) }} />
          <text x={236} y={38} fontSize="9" fontFamily="monospace" fill={CYAN}>P = A⊕B</text>
          <circle cx={258} cy={47} r={4} fill={wire(!!p, VIOLET)} />
          <line x1={258} y1={47} x2={258} y2={120} stroke={wire(!!p, VIOLET)} strokeWidth="3" style={{ filter: glow(!!p, VIOLET) }} />
          <line x1={258} y1={120} x2={300} y2={120} stroke={wire(!!p, VIOLET)} strokeWidth="3" style={{ filter: glow(!!p, VIOLET) }} />

          {/* AND 1 -> generate G = Ai · Bi */}
          <path d="M 150 166 L 150 214 L 174 214 Q 206 214 206 190 Q 206 166 174 166 Z" fill={boxFill} stroke={AMBER} strokeWidth="2.5" />
          <text x={174} y={194} textAnchor="middle" fontSize="9" fontFamily="monospace" fontWeight="bold" fill={AMBER}>AND</text>
          <line x1={206} y1={190} x2={430} y2={190} stroke={wire(!!g, AMBER)} strokeWidth="3" style={{ filter: glow(!!g, AMBER) }} />
          <text x={250} y={182} fontSize="9" fontFamily="monospace" fill={AMBER}>G = A·B</text>

          {/* Cin from the carry flip-flop fans into XOR2 and AND2 */}
          <line x1={300} y1={84} x2={300} y2={47} stroke={wire(!!cin, EMERALD)} strokeWidth="3" style={{ filter: glow(!!cin, EMERALD) }} />
          <circle cx={300} cy={84} r={4} fill={wire(!!cin, EMERALD)} />
          <line x1={300} y1={84} x2={300} y2={150} stroke={wire(!!cin, EMERALD)} strokeWidth="3" style={{ filter: glow(!!cin, EMERALD) }} />

          {/* XOR 2 -> SUM = P ⊕ Cin */}
          <path d="M 296 30 Q 312 47 296 64 Q 322 64 338 47 Q 322 30 296 30 Z" fill={boxFill} stroke={CYAN} strokeWidth="2.5" />
          <path d="M 290 30 Q 306 47 290 64" fill="none" stroke={CYAN} strokeWidth="2.5" />
          <text x={316} y={50} textAnchor="middle" fontSize="8" fontFamily="monospace" fontWeight="bold" fill={CYAN}>XOR</text>
          <line x1={338} y1={47} x2={470} y2={47} stroke={wire(!!sum, CYAN)} strokeWidth="3" style={{ filter: glow(!!sum, CYAN) }} />
          <text x={386} y={38} fontSize="9" fontFamily="monospace" fill={CYAN}>Sum = P⊕Cin</text>
          <circle cx={490} cy={47} r={13} fill={live && sum ? CYAN : 'none'} stroke={live ? CYAN : ink} strokeWidth="2.5"
            style={{ filter: live && sum ? `drop-shadow(0 0 12px ${CYAN})` : 'none' }} />
          <text x={490} y={51} textAnchor="middle" fontSize="11" fontFamily="monospace" fontWeight="bold"
            fill={live ? (sum ? '#000' : CYAN) : ink}>{live ? sum : '-'}</text>
          <text x={510} y={50} fontSize="10" fontFamily="monospace" fontWeight="bold" fill={CYAN}>Sum</text>

          {/* AND 2 -> P · Cin */}
          <path d="M 300 136 L 300 184 L 324 184 Q 356 184 356 160 Q 356 136 324 136 Z" fill={boxFill} stroke={AMBER} strokeWidth="2.5" />
          <text x={324} y={164} textAnchor="middle" fontSize="9" fontFamily="monospace" fontWeight="bold" fill={AMBER}>AND</text>
          <line x1={356} y1={160} x2={430} y2={160} stroke={wire(!!(p & cin), AMBER)} strokeWidth="3" style={{ filter: glow(!!(p & cin), AMBER) }} />

          {/* OR -> Cout = G + P·Cin */}
          <path d="M 426 142 Q 442 175 426 208 Q 470 208 494 175 Q 470 142 426 142 Z" fill={boxFill} stroke={EMERALD} strokeWidth="2.5" />
          <text x={452} y={179} textAnchor="middle" fontSize="9" fontFamily="monospace" fontWeight="bold" fill={EMERALD}>OR</text>
          <line x1={494} y1={175} x2={560} y2={175} stroke={wire(!!cout, EMERALD)} strokeWidth="3" style={{ filter: glow(!!cout, EMERALD) }} />
          <text x={500} y={166} fontSize="9" fontFamily="monospace" fill={EMERALD}>Cout = G + P·Cin</text>

          {/* ── carry D flip-flop in the feedback loop ── */}
          <rect x={560} y={148} width={56} height={54} rx={6} fill={boxFill} stroke={VIOLET} strokeWidth="2.5"
            style={{ filter: live && cin ? `drop-shadow(0 0 10px ${VIOLET})` : 'none' }} />
          <text x={588} y={166} textAnchor="middle" fontSize="9" fontFamily="monospace" fontWeight="bold" fill={VIOLET}>D-FF</text>
          <text x={567} y={184} fontSize="8" fontFamily="monospace" fill={VIOLET}>D</text>
          <text x={602} y={184} fontSize="8" fontFamily="monospace" fill={VIOLET}>Q</text>
          <text x={588} y={196} textAnchor="middle" fontSize="11" fontFamily="monospace" fontWeight="bold" fill={VIOLET}>{cin}</text>
          {/* clock notch on the FF */}
          <path d="M 560 192 l 6 -5 l -6 -5" fill="none" stroke={VIOLET} strokeWidth="1.6" />

          {/* feedback wire: Q -> down -> left -> up -> Cin into the adder */}
          <line x1={616} y1={175} x2={628} y2={175} stroke={wire(!!cin, VIOLET)} strokeWidth="3" style={{ filter: glow(!!cin, VIOLET) }} />
          <line x1={628} y1={175} x2={628} y2={272} stroke={wire(!!cin, VIOLET)} strokeWidth="3" style={{ filter: glow(!!cin, VIOLET) }} />
          <line x1={628} y1={272} x2={300} y2={272} stroke={wire(!!cin, VIOLET)} strokeWidth="3" style={{ filter: glow(!!cin, VIOLET) }} />
          <line x1={300} y1={272} x2={300} y2={84} stroke={wire(!!cin, VIOLET)} strokeWidth="3" style={{ filter: glow(!!cin, VIOLET) }} />
          <text x={420} y={288} textAnchor="middle" fontSize="9" fontFamily="monospace" fill={VIOLET}>carry feedback: Q becomes next Cin</text>

          {/* Cout -> D input of the flip-flop */}
          <text x={530} y={134} textAnchor="middle" fontSize="8" fontFamily="monospace" fill={EMERALD}>Cout → D</text>

          {/* clock line */}
          <line x1={20} y1={250} x2={620} y2={250} stroke={idle} strokeWidth="2" strokeDasharray="5 5" />
          <text x={24} y={244} fontSize="9" fontFamily="monospace" fontWeight="bold" fill={ink}>CLK</text>
        </svg>

        {/* equation captions */}
        <div className="grid sm:grid-cols-3 gap-3 mt-5 text-center">
          <div className="px-3 py-2 rounded-xl font-mono text-[12px]" style={{ background: `${CYAN}12`, color: CYAN }}>
            Sum = A ⊕ B ⊕ Cin
          </div>
          <div className="px-3 py-2 rounded-xl font-mono text-[12px]" style={{ background: `${EMERALD}12`, color: EMERALD }}>
            Cout = A·B + Cin·(A ⊕ B)
          </div>
          <div className="px-3 py-2 rounded-xl font-mono text-[12px]" style={{ background: `${VIOLET}12`, color: VIOLET }}>
            D-FF: Q(next) = Cout, Cin = Q
          </div>
        </div>
        {live ? (
          <p className="text-center text-xs font-mono mt-3" style={{ color: EMERALD }}>
            press "Step clock" to add the next pair of bits and latch the carry
          </p>
        ) : (
          <p className="text-center text-xs font-mono mt-3" style={{ color: EMERALD }}>
            all {N} cycles complete - the result register holds the full sum
          </p>
        )}
      </div>

      {/* ── shift registers, live ── */}
      <div className={`p-6 md:p-8 rounded-3xl border ${cardBg}`}>
        <div className="font-mono text-[10px] uppercase tracking-widest mb-4" style={{ color: AMBER }}>
          The three shift registers · one bit consumed per clock
        </div>
        <div className="space-y-3">
          <RegRow bits={state.a} color={CYAN} label="A" pad={N} />
          <RegRow bits={state.b} color={CYAN} label="B" pad={N} />
          <RegRow bits={state.res} color={EMERALD} label="RES" pad={N} />
        </div>
        <AnimatePresence mode="wait">
          <motion.p key={cyclesDone} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className={`text-sm mt-4 ${subText}`}>
            {finished ? (
              <>Result register = <strong style={{ color: EMERALD }}>{state.res.join('')}</strong> = {parseInt(state.res.join('') || '0', 2)}.
              6 + 3 = 9, computed with ONE adder over {N} clock edges.</>
            ) : (
              <>On the next edge the highlighted LSBs of A and B leave their registers, run through the single
              full adder with stored carry = <strong style={{ color: VIOLET }}>{cin}</strong>, and the sum bit
              shifts into RES while A and B shift right.</>
            )}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* ── time vs space trade caption ── */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="p-6 rounded-3xl border-2" style={{ borderColor: `${EMERALD}44`, background: `${EMERALD}08` }}>
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest mb-2" style={{ color: EMERALD }}>
            <Clock size={13} /> The trade it makes
          </div>
          <p className={`text-sm leading-relaxed ${subText}`}>
            A parallel N-bit adder spends N full adders to finish in roughly one pass. The serial adder
            keeps exactly <strong style={{ color: EMERALD }}>one</strong> full adder and one carry
            flip-flop, then spends <strong className={textColor}>N clock cycles</strong> instead. It trades
            time for space - tiny silicon area, but N times slower. This is the mirror image of the parallel
            and carry-lookahead adders you saw earlier.
          </p>
        </div>
        <div className={`p-6 rounded-3xl border ${cardBg}`}>
          <div className="font-mono text-[10px] uppercase tracking-widest mb-2" style={{ color: VIOLET }}>
            Why the flip-flop matters
          </div>
          <p className={`text-sm leading-relaxed ${subText}`}>
            The carry has to survive from one bit position to the next, but the bits arrive on
            different clock cycles. The D flip-flop is the memory that carries the carry forward: each
            edge it captures <strong style={{ color: EMERALD }}>Cout</strong> on its D input and presents it
            back as <strong style={{ color: VIOLET }}>Cin</strong> for the very next cycle. That feedback
            loop is what turns one full adder into an N-bit adder.
          </p>
        </div>
      </div>

      {/* ── call to action ── */}
      <div className="flex flex-col items-center gap-4 pt-2">
        <p className={`text-sm text-center max-w-2xl ${subText}`}>
          <Hammer size={13} className="inline mr-1 -mt-0.5" style={{ color: AMBER }} />
          You have seen every wire. Now wire it yourself: one full adder, a D flip-flop in the carry
          loop, and the shift registers - exactly this schematic, live in the workbench.
        </p>
        <button
          onClick={() => navigate('/workbench?tutorial=serial-adder')}
          className="group flex items-center gap-3 px-7 py-4 rounded-2xl font-black text-black transition-all duration-300 active:scale-95"
          style={{ background: EMERALD, boxShadow: `0 12px 36px ${EMERALD}55` }}>
          <CircuitBoard size={18} />
          Build it for real in the workbench
          <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  );
};
