import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, CheckCircle2, Circle, ChevronDown, RotateCcw, Compass, ToggleLeft,
  Cpu, Lightbulb, Cable, FlaskConical, Trophy, ChevronUp, ChevronRight,
} from 'lucide-react';

const SKY = '#38bdf8';
const CYAN = '#22d3ee';
const EMERALD = '#34d399';
const VIOLET = '#a78bfa';
const AMBER = '#f59e0b';

const STORE_KEY = 'bfb_wb_serial_tutorial';

/** Six representative cycles the learner must prove on the live clocked circuit. */
const CYCLES = [
  { cyc: 0, a: 1, b: 1, cin: 0, sum: 0, cout: 1, note: 'clear carry first' },
  { cyc: 1, a: 1, b: 0, cin: 1, sum: 0, cout: 1, note: 'carry remembered' },
  { cyc: 2, a: 0, b: 0, cin: 1, sum: 1, cout: 0, note: 'last carry spills out' },
  { cyc: 0, a: 1, b: 1, cin: 0, sum: 0, cout: 1, note: 'second sum: bit 0' },
  { cyc: 1, a: 0, b: 1, cin: 1, sum: 0, cout: 1, note: 'carry chains in' },
  { cyc: 2, a: 1, b: 0, cin: 1, sum: 0, cout: 1, note: 'carry still set' },
];

const ROWS = CYCLES.length;

interface Saved { step: number; checks: boolean[] }

function load(): Saved {
  try {
    const raw = JSON.parse(localStorage.getItem(STORE_KEY) || 'null');
    if (raw && typeof raw.step === 'number' && Array.isArray(raw.checks) && raw.checks.length === ROWS) return raw;
  } catch { /* ignore */ }
  return { step: 0, checks: Array(ROWS).fill(false) };
}

/* ── tiny step illustrations ─────────────────────────────────── */

const IllusBench: React.FC = () => (
  <svg viewBox="0 0 240 90" className="w-full h-auto">
    <rect x={4} y={6} width={56} height={78} rx={6} fill="#1e293b" stroke={CYAN} strokeWidth="1.5" />
    <text x={32} y={20} textAnchor="middle" fontSize="7" fontFamily="monospace" fill={CYAN}>ELEMENTS</text>
    {['Sequential', 'Clock', 'Gates'].map((t, i) => (
      <g key={t}>
        <rect x={8} y={28 + i * 17} width={48} height={13} rx={3} fill="#0f172a" stroke="#334155" />
        <text x={32} y={37 + i * 17} textAnchor="middle" fontSize="6" fontFamily="monospace" fill="#94a3b8">{t}</text>
      </g>
    ))}
    <rect x={66} y={6} width={116} height={78} rx={6} fill="#0b1220" stroke="#334155" strokeWidth="1.5" />
    <text x={124} y={45} textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#475569">canvas · clocked lab</text>
    <text x={124} y={58} textAnchor="middle" fontSize="6.5" fontFamily="monospace" fill={SKY}>has memory, not just gates</text>
    <rect x={188} y={6} width={48} height={78} rx={6} fill="#1e293b" stroke="#334155" strokeWidth="1.5" />
    <text x={212} y={20} textAnchor="middle" fontSize="6.5" fontFamily="monospace" fill="#94a3b8">PROPS</text>
  </svg>
);

const IllusFullAdder: React.FC = () => (
  <svg viewBox="0 0 240 120" className="w-full h-auto">
    {/* XOR pair */}
    <path d="M 24 12 Q 34 26 24 40 Q 46 40 60 26 Q 46 12 24 12 Z" fill="#0f172a" stroke={CYAN} strokeWidth="2" />
    <path d="M 19 12 Q 29 26 19 40" fill="none" stroke={CYAN} strokeWidth="2" />
    <path d="M 24 50 Q 34 64 24 78 Q 46 78 60 64 Q 46 50 24 50 Z" fill="#0f172a" stroke={CYAN} strokeWidth="2" />
    <path d="M 19 50 Q 29 64 19 78" fill="none" stroke={CYAN} strokeWidth="2" />
    <text x={72} y={30} fontSize="9" fontFamily="monospace" fill={CYAN}>2 x XOR · the sum chain</text>
    {/* AND pair */}
    <path d="M 24 88 L 24 114 L 36 114 Q 54 114 54 101 Q 54 88 36 88 Z" fill="#0f172a" stroke={AMBER} strokeWidth="2" />
    <text x={72} y={68} fontSize="9" fontFamily="monospace" fill={AMBER}>2 x AND · the carry watchers</text>
    {/* OR */}
    <path d="M 150 88 Q 160 101 150 114 Q 172 114 186 101 Q 172 88 150 88 Z" fill="#0f172a" stroke={VIOLET} strokeWidth="2" />
    <text x={72} y={106} fontSize="9" fontFamily="monospace" fill={VIOLET}>1 x OR · merges the carries</text>
    <text x={150} y={70} fontSize="7.5" fontFamily="monospace" fill={SKY}>reuse the Module 8 core</text>
  </svg>
);

const IllusFlipFlop: React.FC = () => (
  <svg viewBox="0 0 240 120" className="w-full h-auto">
    {/* clock */}
    <rect x={6} y={14} width={40} height={26} rx={4} fill="#0f172a" stroke={SKY} strokeWidth="2" />
    <path d="M 12 32 H 18 V 22 H 24 V 32 H 30 V 22 H 36 V 32 H 42" fill="none" stroke={SKY} strokeWidth="1.5" />
    <text x={26} y={50} textAnchor="middle" fontSize="7" fontFamily="monospace" fill={SKY}>CLOCK</text>
    {/* flip-flop body */}
    <rect x={96} y={20} width={56} height={56} rx={5} fill="#0f172a" stroke={EMERALD} strokeWidth="2" />
    <text x={124} y={40} textAnchor="middle" fontSize="8" fontFamily="monospace" fill={EMERALD}>D-FF</text>
    <text x={102} y={36} fontSize="7" fontFamily="monospace" fill="#94a3b8">D</text>
    <text x={140} y={36} fontSize="7" fontFamily="monospace" fill="#94a3b8">Q</text>
    <text x={124} y={68} textAnchor="middle" fontSize="6.5" fontFamily="monospace" fill="#94a3b8">carry memory</text>
    {/* clock to ff */}
    <line x1={46} y1={32} x2={96} y2={62} stroke={SKY} strokeWidth="1.5" />
    {/* Cout into D */}
    <text x={70} y={18} fontSize="7" fontFamily="monospace" fill={AMBER}>Cout</text>
    <line x1={56} y1={24} x2={96} y2={30} stroke={AMBER} strokeWidth="1.5" />
    {/* Q feedback back to Cin */}
    <polyline points="152,40 188,40 188,100 30,100 30,70" fill="none" stroke={EMERALD} strokeWidth="1.5" strokeDasharray="4 3" />
    <text x={110} y={112} fontSize="7.5" fontFamily="monospace" fill={EMERALD}>Q feeds back to Cin · the whole trick</text>
    {/* clear */}
    <rect x={6} y={62} width={40} height={20} rx={3} fill="#0f172a" stroke={AMBER} strokeWidth="1.5" />
    <text x={26} y={75} textAnchor="middle" fontSize="6" fontFamily="monospace" fill={AMBER}>CLR=0</text>
  </svg>
);

const IllusInputs: React.FC = () => (
  <svg viewBox="0 0 240 110" className="w-full h-auto">
    {(['A-bit', 'B-bit'] as const).map((l, i) => (
      <g key={l}>
        <rect x={26} y={10 + i * 36} width={36} height={26} rx={4} fill="#0f172a" stroke={SKY} strokeWidth="2" />
        <text x={44} y={27 + i * 36} textAnchor="middle" fontSize="11" fontFamily="monospace" fontWeight="bold" fill={SKY}>0</text>
        <text x={72} y={27 + i * 36} fontSize="8.5" fontFamily="monospace" fill="#94a3b8">
          ← {l} · set by hand each cycle
        </text>
      </g>
    ))}
    <circle cx={44} cy={94} r={13} fill="none" stroke={EMERALD} strokeWidth="2" />
    <text x={72} y={98} fontSize="8.5" fontFamily="monospace" fill={EMERALD}>← Sum lamp (from XOR #2)</text>
  </svg>
);

const IllusWiring: React.FC = () => (
  <svg viewBox="0 0 250 140" className="w-full h-auto">
    {/* inputs */}
    {([['A', 14], ['B', 44]] as const).map(([l, y]) => (
      <g key={l}>
        <rect x={4} y={y} width={24} height={16} rx={3} fill="#0f172a" stroke={SKY} strokeWidth="1.5" />
        <text x={16} y={y + 12} textAnchor="middle" fontSize="8" fontFamily="monospace" fill={SKY}>{l}</text>
      </g>
    ))}
    {/* full adder block */}
    <rect x={64} y={10} width={70} height={70} rx={6} fill="#0b1220" stroke={CYAN} strokeWidth="1.8" />
    <text x={99} y={40} textAnchor="middle" fontSize="8" fontFamily="monospace" fill={CYAN}>FULL</text>
    <text x={99} y={52} textAnchor="middle" fontSize="8" fontFamily="monospace" fill={CYAN}>ADDER</text>
    <text x={68} y={26} fontSize="6.5" fontFamily="monospace" fill="#94a3b8">A</text>
    <text x={68} y={48} fontSize="6.5" fontFamily="monospace" fill="#94a3b8">B</text>
    <text x={68} y={72} fontSize="6.5" fontFamily="monospace" fill="#94a3b8">Cin</text>
    <text x={120} y={30} fontSize="6.5" fontFamily="monospace" fill="#94a3b8">S</text>
    <text x={114} y={72} fontSize="6.5" fontFamily="monospace" fill="#94a3b8">Cout</text>
    {/* wires A,B in */}
    <line x1={28} y1={22} x2={64} y2={22} stroke={SKY} strokeWidth="1.5" />
    <line x1={28} y1={52} x2={64} y2={44} stroke={SKY} strokeWidth="1.5" />
    {/* Sum lamp */}
    <line x1={134} y1={24} x2={210} y2={24} stroke={EMERALD} strokeWidth="1.5" />
    <circle cx={222} cy={24} r={8} fill="none" stroke={EMERALD} strokeWidth="1.8" />
    <text x={222} y={11} textAnchor="middle" fontSize="7" fontFamily="monospace" fill={EMERALD}>Sum</text>
    {/* Cout to D-FF */}
    <line x1={134} y1={68} x2={166} y2={68} stroke={AMBER} strokeWidth="1.5" />
    <rect x={166} y={56} width={44} height={44} rx={5} fill="#0f172a" stroke={EMERALD} strokeWidth="1.8" />
    <text x={188} y={74} textAnchor="middle" fontSize="7" fontFamily="monospace" fill={EMERALD}>D-FF</text>
    <text x={188} y={92} textAnchor="middle" fontSize="6" fontFamily="monospace" fill="#94a3b8">carry</text>
    {/* clock */}
    <rect x={150} y={112} width={36} height={18} rx={3} fill="#0f172a" stroke={SKY} strokeWidth="1.5" />
    <text x={168} y={124} textAnchor="middle" fontSize="6.5" fontFamily="monospace" fill={SKY}>CLK step</text>
    <line x1={168} y1={112} x2={180} y2={100} stroke={SKY} strokeWidth="1.5" />
    {/* Q feedback to Cin */}
    <polyline points="210,68 232,68 232,118 46,118 46,72" fill="none" stroke={EMERALD} strokeWidth="1.5" strokeDasharray="4 3" />
    <line x1={46} y1={72} x2={64} y2={66} stroke={EMERALD} strokeWidth="1.5" strokeDasharray="4 3" />
    <text x={92} y={132} fontSize="6.5" fontFamily="monospace" fill={EMERALD}>Q → Cin feedback loop</text>
  </svg>
);

const IllusStep: React.FC = () => (
  <svg viewBox="0 0 240 110" className="w-full h-auto">
    {/* clock waveform */}
    <path d="M 10 70 H 30 V 30 H 60 V 70 H 90 V 30 H 120 V 70 H 150 V 30 H 180 V 70 H 210"
          fill="none" stroke={SKY} strokeWidth="2" />
    {['0', '1', '2'].map((c, i) => (
      <g key={c}>
        <line x1={45 + i * 60} y1={20} x2={45 + i * 60} y2={84} stroke="#334155" strokeWidth="1" strokeDasharray="3 3" />
        <text x={45 + i * 60} y={98} textAnchor="middle" fontSize="8" fontFamily="monospace" fill={SKY}>cyc {c}</text>
      </g>
    ))}
    <text x={120} y={14} textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#94a3b8">
      one click = one tick = one bit added
    </text>
  </svg>
);

/* ── step definitions ────────────────────────────────────────── */

interface Step {
  icon: React.ReactNode;
  title: string;
  why: string;
  subs: string[];
  Illus: React.FC;
}

const STEPS: Step[] = [
  {
    icon: <Compass size={15} />,
    title: 'Know your bench',
    why: 'This lab is different: it has memory. The flip-flop remembers, the clock paces.',
    subs: [
      'The panel on the LEFT is the parts shelf - it is labeled Circuit Elements.',
      'Unlike the combinational labs, this one needs a Clock and a D flip-flop. Find them in the Sequential / Clock drawers.',
      'The big dotted grid is your canvas. Drag empty canvas to pan, scroll to zoom.',
      'Plan: you will build ONE full adder and clock a single carry through it, one bit at a time.',
    ],
    Illus: IllusBench,
  },
  {
    icon: <Cpu size={15} />,
    title: 'Place ONE full adder',
    why: 'A serial adder reuses a single full adder across every cycle - one core, not a row of them.',
    subs: [
      'Reuse the full adder from Module 8 as the core: 2 XOR, 2 AND, 1 OR.',
      'From the Gates drawer drag TWO XOR Gates and TWO AND Gates.',
      'Drag ONE OR Gate to merge the two carry signals.',
      'Wire them into a working full adder with A, B, Cin in and Sum, Cout out. This block is the whole arithmetic unit.',
    ],
    Illus: IllusFullAdder,
  },
  {
    icon: <ToggleLeft size={15} />,
    title: 'Add the carry memory',
    why: 'The flip-flop holds the carry from this cycle so the next cycle can read it as Cin. That feedback loop IS the serial adder.',
    subs: [
      'From the Sequential drawer drag a D FLIP-FLOP. From the Clock drawer drag a CLOCK.',
      'Wire the full adder\'s Cout into the flip-flop D input.',
      'Wire the flip-flop Q output back into the full adder\'s Cin - this is the feedback loop, the whole trick.',
      'Add a way to clear the carry to 0 before starting (use the flip-flop reset / a clear input). Always start a sum with carry cleared.',
    ],
    Illus: IllusFlipFlop,
  },
  {
    icon: <Lightbulb size={15} />,
    title: 'Place inputs and the sum lamp',
    why: 'In this simple lab you play the shift registers by hand: set the current A-bit and B-bit each cycle.',
    subs: [
      'Place input switches that feed the current A-bit and B-bit into the full adder.',
      'In this simple lab you set them by hand each cycle to emulate the shift registers a real serial adder uses.',
      'Place ONE Output lamp for the Sum bit (from the second XOR).',
      'Each clock tick you will read that Sum lamp - one bit of the answer, least-significant first.',
    ],
    Illus: IllusInputs,
  },
  {
    icon: <Cable size={15} />,
    title: 'Wire it and set manual clock',
    why: 'You want to control time. Manual / step mode means one click advances exactly one cycle.',
    subs: [
      'Confirm the loop: Cout → D, Q → Cin. Confirm A-bit and B-bit reach the full adder, and Sum reaches the lamp.',
      'Select the Clock and set it to manual / step mode in the right panel (turn off auto-tick).',
      'Now one click of the clock = one tick = one bit added.',
      'Clear the carry to 0. You are ready to step through an addition.',
    ],
    Illus: IllusWiring,
  },
  {
    icon: <FlaskConical size={15} />,
    title: 'Prove it by stepping the clock',
    why: 'A clocked adder is proven by stepping, not by a static truth table. One full adder, reused; the flip-flop remembers the carry between cycles.',
    subs: [
      'Worked example: A = 011 + B = 001 (= 100). Feed bits least-significant first.',
      'Each cycle: set the A-bit and B-bit, read the Sum lamp, then click the clock once to latch the new carry into Q.',
      'cycle 0: A-bit 1, B-bit 1, carry-in 0 → Sum 0, carry-out 1. cycle 1: 1, 0, carry-in 1 → Sum 0, carry-out 1. cycle 2: 0, 0, carry-in 1 → Sum 1, carry-out 0.',
      'Read the Sum bits least-significant-first: 0, 0, 1 → 100. The flip-flop carried the 1 from cycle to cycle. Tick each row below as the live circuit matches.',
    ],
    Illus: IllusStep,
  },
];

/* ── the rail ────────────────────────────────────────────────── */

export const SerialAdderTutorial: React.FC<{ onClose: () => void; onMinimize?: () => void }> = ({ onClose, onMinimize }) => {
  const navigate = useNavigate();
  const [{ step, checks }, setState] = useState<Saved>(load);
  // Mobile bottom-sheet toggle. Phones start collapsed so the simulator keeps
  // (almost) the whole screen until the learner pulls the sheet up; on lg+ the
  // rail is a side column and this flag is ignored by the CSS.
  const [expanded, setExpanded] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.matchMedia('(min-width: 1024px)').matches : true
  );

  useEffect(() => {
    try { localStorage.setItem(STORE_KEY, JSON.stringify({ step, checks })); } catch { /* ignore */ }
  }, [step, checks]);

  const setStep = (s: number) => setState(prev => ({ ...prev, step: s }));
  const toggleCheck = (i: number) =>
    setState(prev => ({ ...prev, checks: prev.checks.map((c, j) => (j === i ? !c : c)) }));
  const restart = () => setState({ step: 0, checks: Array(ROWS).fill(false) });

  const allProven = checks.every(Boolean);
  const progress = allProven ? 100 : Math.round(((step + checks.filter(Boolean).length / ROWS) / STEPS.length) * 100);

  return (
    <div className="h-full flex flex-col bg-slate-950 text-slate-200 border-t-2 lg:border-t-0 lg:border-l-2"
         style={{ borderColor: SKY }}>
      {/* grab bar (mobile only) */}
      <button onClick={() => setExpanded(v => !v)}
              className="lg:hidden flex items-center justify-between px-4 h-14 flex-shrink-0 border-b border-white/10">
        <span className="font-mono text-[10px] font-black uppercase tracking-widest" style={{ color: SKY }}>
          Guided build · step {Math.min(step + 1, STEPS.length)} of {STEPS.length}
        </span>
        {expanded ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
      </button>

      <div className={`${expanded ? 'flex' : 'hidden'} lg:flex flex-col flex-1 min-h-0`}>
        {/* header */}
        <div className="px-5 pt-5 pb-4 border-b border-white/10 flex-shrink-0">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="font-mono text-[10px] font-black uppercase tracking-[0.3em]" style={{ color: SKY }}>
                Guided build · Serial Adder
              </div>
              <div className="mt-1 text-[11px] text-slate-400">
                One full adder, a clock, and a flip-flop that remembers the carry. Adds bit by bit, one tick at a time. Nothing here can break.
              </div>
            </div>
            <div className="flex gap-1.5 flex-shrink-0">
              {onMinimize && (
                <button onClick={onMinimize} title="Minimize - the simulator's own panels stay reachable"
                        className="hidden lg:block p-2 rounded-lg border border-white/10 hover:border-white/30 transition-colors">
                  <ChevronRight size={14} />
                </button>
              )}
              <button onClick={onClose} title="Close the tutorial"
                      className="p-2 rounded-lg border border-white/10 hover:border-white/30 transition-colors">
                <X size={14} />
              </button>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-3">
            <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
              <motion.div className="h-full rounded-full" animate={{ width: `${progress}%` }}
                          style={{ background: allProven ? EMERALD : SKY }} />
            </div>
            <span className="font-mono text-[10px] font-bold" style={{ color: allProven ? EMERALD : SKY }}>
              {allProven ? 'DONE' : `${Math.min(step + 1, STEPS.length)}/${STEPS.length}`}
            </span>
          </div>
        </div>

        {/* steps */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {STEPS.map((s, i) => {
            const done = i < step || (i === STEPS.length - 1 && allProven);
            const active = i === step && !(i === STEPS.length - 1 && allProven);
            const locked = i > step;
            return (
              <div key={s.title}
                   className={`rounded-2xl border transition-all ${
                     active ? 'border-sky-400/60 bg-sky-500/[0.06]'
                     : done ? 'border-emerald-400/30 bg-emerald-500/[0.04]'
                     : 'border-white/10 opacity-50'
                   }`}>
                {/* row header */}
                <button onClick={() => !locked && setStep(i)} disabled={locked}
                        className="w-full flex items-center gap-3 px-4 py-3 text-left">
                  <span className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-black flex-shrink-0 ${
                    done ? 'bg-emerald-400 text-black' : active ? 'bg-sky-400 text-black' : 'bg-white/10 text-slate-400'
                  }`}>
                    {done ? '✓' : i + 1}
                  </span>
                  <span className={`text-sm font-bold flex-1 ${done ? 'text-emerald-300' : active ? 'text-white' : 'text-slate-400'}`}>
                    {s.title}
                  </span>
                  <span style={{ color: done ? EMERALD : active ? SKY : '#64748b' }}>{s.icon}</span>
                </button>

                {/* expanded body */}
                <AnimatePresence initial={false}>
                  {active && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <div className="px-4 pb-4 space-y-3">
                        <div className="rounded-xl bg-black/40 border border-white/10 p-2">
                          <s.Illus />
                        </div>
                        <ol className="space-y-2">
                          {s.subs.map((sub, j) => (
                            <li key={j} className="flex gap-2.5 text-[13px] leading-relaxed text-slate-300">
                              <span className="font-mono text-[10px] font-black pt-0.5 flex-shrink-0" style={{ color: SKY }}>
                                {i + 1}.{j + 1}
                              </span>
                              {sub}
                            </li>
                          ))}
                        </ol>
                        <p className="text-[11px] italic text-slate-500 border-l-2 pl-3" style={{ borderColor: `${SKY}66` }}>
                          Why: {s.why}
                        </p>

                        {/* sample-cycles checklist on the final step */}
                        {i === STEPS.length - 1 ? (
                          <div className="rounded-xl border border-white/10 overflow-hidden">
                            <div className="px-3 py-2 text-[11px] text-slate-400 bg-white/[0.04] leading-relaxed">
                              Representative cycles, not an exhaustive table. Step the clock and tick each row as the live circuit matches.
                            </div>
                            <div className="grid grid-cols-6 text-center font-mono text-[9px] uppercase tracking-wider text-slate-500 bg-white/[0.04] py-1.5">
                              <span>Cyc</span><span>A</span><span>B</span><span>Cin</span><span>Sum</span><span>Cout</span>
                            </div>
                            {CYCLES.map((r, ri) => (
                              <button key={ri} onClick={() => toggleCheck(ri)}
                                      className={`w-full grid grid-cols-6 items-center text-center font-mono text-sm py-2 transition-colors ${
                                        checks[ri] ? 'bg-emerald-500/10 text-emerald-300' : 'text-slate-300 hover:bg-white/[0.04]'
                                      }`}>
                                <span className="flex items-center justify-center gap-1">
                                  {r.cyc}
                                  {checks[ri]
                                    ? <CheckCircle2 size={12} className="text-emerald-400" />
                                    : <Circle size={12} className="text-slate-600" />}
                                </span>
                                <span>{r.a}</span><span>{r.b}</span><span>{r.cin}</span>
                                <span className="font-bold">{r.sum}</span><span className="font-bold">{r.cout}</span>
                              </button>
                            ))}
                            <div className="px-3 py-2 text-[11px] bg-white/[0.02] leading-relaxed" style={{ color: SKY }}>
                              Read the Sum bits least-significant-first: 0, 0, 1 → 100. One full adder, reused; the flip-flop remembered the carry between cycles.
                            </div>
                          </div>
                        ) : (
                          <button onClick={() => setStep(i + 1)}
                                  className="w-full py-2.5 rounded-xl font-mono text-[11px] font-black uppercase tracking-widest text-black transition-all active:scale-[0.98]"
                                  style={{ background: SKY }}>
                            Mark step done · next
                          </button>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}

          {/* completion */}
          <AnimatePresence>
            {allProven && (
              <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                          className="rounded-2xl border-2 p-5 text-center"
                          style={{ borderColor: `${EMERALD}66`, background: `${EMERALD}0d` }}>
                <Trophy size={26} className="mx-auto mb-2" style={{ color: EMERALD }} />
                <div className="font-black text-emerald-300">Certified: you clocked a carry through a single adder.</div>
                <p className="text-[12px] text-slate-400 mt-2 leading-relaxed">
                  Every sample cycle proven on real, simulated hardware. The serial adder trades
                  speed for area: one full adder does the work of many, and the flip-flop carries
                  the 1 from cycle to cycle. Slow, but it is the smallest adder there is.
                </p>
                <div className="mt-4 grid grid-cols-1 gap-2">
                  <button onClick={() => navigate('/dsd/13/circuit')}
                          className="py-2.5 rounded-xl font-mono text-[11px] font-black uppercase tracking-widest text-black"
                          style={{ background: EMERALD }}>
                    Back to the module
                  </button>
                  <button onClick={onClose}
                          className="py-2.5 rounded-xl font-mono text-[11px] font-black uppercase tracking-widest border border-white/15 text-slate-300 hover:border-white/30">
                    Free build - keep tinkering
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* footer */}
        <div className="px-5 py-3 border-t border-white/10 flex-shrink-0">
          <button onClick={restart} className="flex items-center gap-2 text-[11px] font-mono text-slate-500 hover:text-slate-300 transition-colors">
            <RotateCcw size={11} /> Restart tutorial
          </button>
        </div>
      </div>
    </div>
  );
};
