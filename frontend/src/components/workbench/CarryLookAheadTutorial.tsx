import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, CheckCircle2, Circle, ChevronDown, RotateCcw, Compass, ToggleLeft,
  Cpu, Zap, Cable, FlaskConical, Trophy, ChevronUp, ChevronRight,
} from 'lucide-react';

const ORANGE = '#fb923c';
const CYAN = '#22d3ee';
const EMERALD = '#34d399';
const VIOLET = '#a78bfa';

const STORE_KEY = 'bfb_wb_cla_tutorial';

/** Number of representative sample additions on the final-step proof grid. */
const ROWS = 6;

interface Saved { step: number; checks: boolean[] }

function load(): Saved {
  try {
    const raw = JSON.parse(localStorage.getItem(STORE_KEY) || 'null');
    if (raw && typeof raw.step === 'number' && Array.isArray(raw.checks) && raw.checks.length === ROWS) return raw;
  } catch { /* ignore */ }
  return { step: 0, checks: Array(ROWS).fill(false) };
}

/**
 * A 2-bit adder has a 32-row truth table (A1A0, B1B0, Cin). That is too much to
 * tick off by hand, so we prove a SMALL set of representative sums instead.
 * Columns: A (2 bits) · B (2 bits) · Sum (2 bits) · Cout. Cin is 0 for every
 * sample row below, so the question stays "does A + B land where it should?".
 */
const SAMPLES = [
  { a: '00', b: '00', sum: '00', cout: 0 }, // 0 + 0 = 0
  { a: '01', b: '01', sum: '10', cout: 0 }, // 1 + 1 = 2
  { a: '01', b: '10', sum: '11', cout: 0 }, // 1 + 2 = 3
  { a: '10', b: '10', sum: '00', cout: 1 }, // 2 + 2 = 4
  { a: '11', b: '01', sum: '00', cout: 1 }, // 3 + 1 = 4
  { a: '11', b: '11', sum: '10', cout: 1 }, // 3 + 3 = 6
];

/* ── tiny step illustrations ─────────────────────────────────── */

const IllusBench: React.FC = () => (
  <svg viewBox="0 0 240 90" className="w-full h-auto">
    <rect x={4} y={6} width={56} height={78} rx={6} fill="#1e293b" stroke={CYAN} strokeWidth="1.5" />
    <text x={32} y={20} textAnchor="middle" fontSize="7" fontFamily="monospace" fill={CYAN}>ELEMENTS</text>
    {['Input', 'Output', 'Gates'].map((t, i) => (
      <g key={t}>
        <rect x={10} y={28 + i * 17} width={44} height={13} rx={3} fill="#0f172a" stroke="#334155" />
        <text x={32} y={37 + i * 17} textAnchor="middle" fontSize="6.5" fontFamily="monospace" fill="#94a3b8">{t}</text>
      </g>
    ))}
    <rect x={66} y={6} width={116} height={78} rx={6} fill="#0b1220" stroke="#334155" strokeWidth="1.5" />
    <text x={124} y={49} textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#475569">canvas · drag to pan</text>
    <rect x={188} y={6} width={48} height={78} rx={6} fill="#1e293b" stroke="#334155" strokeWidth="1.5" />
    <text x={212} y={20} textAnchor="middle" fontSize="6.5" fontFamily="monospace" fill="#94a3b8">PROPS</text>
  </svg>
);

const IllusInputs: React.FC = () => (
  <svg viewBox="0 0 240 130" className="w-full h-auto">
    {(['A0', 'A1', 'B0', 'B1', 'Cin'] as const).map((l, i) => (
      <g key={l}>
        <rect x={26} y={6 + i * 24} width={30} height={18} rx={4} fill="#0f172a" stroke={ORANGE} strokeWidth="2" />
        <text x={41} y={19 + i * 24} textAnchor="middle" fontSize="10" fontFamily="monospace" fontWeight="bold" fill={ORANGE}>0</text>
        <text x={66} y={19 + i * 24} fontSize="8.5" fontFamily="monospace" fill="#94a3b8">
          ← {l}{l === 'Cin' ? ' (carry-in to bit 0)' : ''}
        </text>
      </g>
    ))}
  </svg>
);

const IllusPG: React.FC = () => (
  <svg viewBox="0 0 240 130" className="w-full h-auto">
    {/* XOR pair: propagate P0, P1 */}
    <path d="M 24 10 Q 34 24 24 38 Q 46 38 60 24 Q 46 10 24 10 Z" fill="#0f172a" stroke={CYAN} strokeWidth="2" />
    <path d="M 19 10 Q 29 24 19 38" fill="none" stroke={CYAN} strokeWidth="2" />
    <path d="M 24 50 Q 34 64 24 78 Q 46 78 60 64 Q 46 50 24 50 Z" fill="#0f172a" stroke={CYAN} strokeWidth="2" />
    <path d="M 19 50 Q 29 64 19 78" fill="none" stroke={CYAN} strokeWidth="2" />
    <text x={72} y={28} fontSize="9" fontFamily="monospace" fill={CYAN}>P0 = A0 XOR B0</text>
    <text x={72} y={68} fontSize="9" fontFamily="monospace" fill={CYAN}>P1 = A1 XOR B1</text>
    {/* AND pair: generate G0, G1 */}
    <path d="M 24 90 L 24 116 L 36 116 Q 54 116 54 103 Q 54 90 36 90 Z" fill="#0f172a" stroke={ORANGE} strokeWidth="2" />
    <text x={72} y={108} fontSize="9" fontFamily="monospace" fill={ORANGE}>G0 = A0 AND B0</text>
    <path d="M 150 90 L 150 116 L 162 116 Q 180 116 180 103 Q 180 90 162 90 Z" fill="#0f172a" stroke={ORANGE} strokeWidth="2" />
    <text x={150} y={84} fontSize="9" fontFamily="monospace" fill={ORANGE}>G1 = A1 AND B1</text>
  </svg>
);

const IllusCarry: React.FC = () => (
  <svg viewBox="0 0 250 140" className="w-full h-auto">
    {/* C1 = G0 + (P0 . Cin) */}
    <path d="M 14 10 L 14 32 L 24 32 Q 40 32 40 21 Q 40 10 24 10 Z" fill="#0f172a" stroke={ORANGE} strokeWidth="1.8" />
    <text x={46} y={24} fontSize="8" fontFamily="monospace" fill={ORANGE}>P0·Cin</text>
    <path d="M 96 8 Q 104 21 96 34 Q 114 34 126 21 Q 114 8 96 8 Z" fill="#0f172a" stroke={VIOLET} strokeWidth="1.8" />
    <line x1={40} y1={21} x2={96} y2={18} stroke={ORANGE} strokeWidth="1.5" />
    <text x={84} y={50} fontSize="7.5" fontFamily="monospace" fill="#94a3b8">G0 ─┘ OR ⇒ C1</text>
    <circle cx={140} cy={20} r={7} fill="none" stroke={VIOLET} strokeWidth="1.8" />
    <line x1={126} y1={20} x2={133} y2={20} stroke={VIOLET} strokeWidth="1.5" />
    <text x={152} y={24} fontSize="8" fontFamily="monospace" fill={VIOLET}>C1</text>
    {/* C2 = G1 + (P1.G0) + (P1.P0.Cin) */}
    <path d="M 14 74 L 14 96 L 24 96 Q 40 96 40 85 Q 40 74 24 74 Z" fill="#0f172a" stroke={ORANGE} strokeWidth="1.8" />
    <text x={46} y={88} fontSize="8" fontFamily="monospace" fill={ORANGE}>P1·G0</text>
    <path d="M 14 108 L 14 130 L 24 130 Q 40 130 40 119 Q 40 108 24 108 Z" fill="#0f172a" stroke={ORANGE} strokeWidth="1.8" />
    <text x={46} y={122} fontSize="8" fontFamily="monospace" fill={ORANGE}>P1·P0·Cin</text>
    <path d="M 110 84 Q 118 100 110 116 Q 130 116 144 100 Q 130 84 110 84 Z" fill="#0f172a" stroke={VIOLET} strokeWidth="1.8" />
    <line x1={40} y1={85} x2={110} y2={92} stroke={ORANGE} strokeWidth="1.5" />
    <line x1={40} y1={119} x2={110} y2={108} stroke={ORANGE} strokeWidth="1.5" />
    <text x={78} y={78} fontSize="7.5" fontFamily="monospace" fill="#94a3b8">G1 ─┘ OR ⇒ C2</text>
    <circle cx={160} cy={100} r={7} fill="none" stroke={VIOLET} strokeWidth="1.8" />
    <line x1={144} y1={100} x2={153} y2={100} stroke={VIOLET} strokeWidth="1.5" />
    <text x={172} y={104} fontSize="8" fontFamily="monospace" fill={VIOLET}>Cout</text>
    <text x={6} y={140} fontSize="7" fontFamily="monospace" fill={EMERALD}>both carries settle in parallel</text>
  </svg>
);

const IllusSums: React.FC = () => (
  <svg viewBox="0 0 240 110" className="w-full h-auto">
    {/* S0 = P0 XOR Cin */}
    <path d="M 24 12 Q 34 26 24 40 Q 46 40 60 26 Q 46 12 24 12 Z" fill="#0f172a" stroke={CYAN} strokeWidth="2" />
    <path d="M 19 12 Q 29 26 19 40" fill="none" stroke={CYAN} strokeWidth="2" />
    <text x={72} y={30} fontSize="9" fontFamily="monospace" fill={CYAN}>P0 XOR Cin ⇒ S0</text>
    <circle cx={200} cy={26} r={11} fill="none" stroke={CYAN} strokeWidth="2" />
    <text x={200} y={30} textAnchor="middle" fontSize="8" fontFamily="monospace" fill={CYAN}>S0</text>
    {/* S1 = P1 XOR C1 */}
    <path d="M 24 60 Q 34 74 24 88 Q 46 88 60 74 Q 46 60 24 60 Z" fill="#0f172a" stroke={CYAN} strokeWidth="2" />
    <path d="M 19 60 Q 29 74 19 88" fill="none" stroke={CYAN} strokeWidth="2" />
    <text x={72} y={78} fontSize="9" fontFamily="monospace" fill={CYAN}>P1 XOR C1 ⇒ S1</text>
    <circle cx={200} cy={74} r={11} fill="none" stroke={CYAN} strokeWidth="2" />
    <text x={200} y={78} textAnchor="middle" fontSize="8" fontFamily="monospace" fill={CYAN}>S1</text>
  </svg>
);

const IllusProve: React.FC = () => (
  <svg viewBox="0 0 240 100" className="w-full h-auto">
    {/* A bus */}
    <rect x={8} y={14} width={20} height={16} rx={3} fill="#0f172a" stroke={ORANGE} strokeWidth="1.5" />
    <text x={18} y={26} textAnchor="middle" fontSize="8" fontFamily="monospace" fill={ORANGE}>A1</text>
    <rect x={8} y={34} width={20} height={16} rx={3} fill="#0f172a" stroke={ORANGE} strokeWidth="1.5" />
    <text x={18} y={46} textAnchor="middle" fontSize="8" fontFamily="monospace" fill={ORANGE}>A0</text>
    {/* B bus */}
    <rect x={8} y={58} width={20} height={16} rx={3} fill="#0f172a" stroke={ORANGE} strokeWidth="1.5" />
    <text x={18} y={70} textAnchor="middle" fontSize="8" fontFamily="monospace" fill={ORANGE}>B1</text>
    <rect x={8} y={78} width={20} height={16} rx={3} fill="#0f172a" stroke={ORANGE} strokeWidth="1.5" />
    <text x={18} y={90} textAnchor="middle" fontSize="8" fontFamily="monospace" fill={ORANGE}>B0</text>
    {/* CLA block */}
    <rect x={70} y={20} width={86} height={66} rx={8} fill="#0b1220" stroke={VIOLET} strokeWidth="1.8" />
    <text x={113} y={48} textAnchor="middle" fontSize="9" fontFamily="monospace" fill={VIOLET}>look-ahead</text>
    <text x={113} y={62} textAnchor="middle" fontSize="9" fontFamily="monospace" fill={VIOLET}>adder</text>
    {/* outputs */}
    <circle cx={196} cy={30} r={9} fill="none" stroke={CYAN} strokeWidth="1.8" />
    <text x={214} y={34} fontSize="8" fontFamily="monospace" fill={CYAN}>S1</text>
    <circle cx={196} cy={56} r={9} fill="none" stroke={CYAN} strokeWidth="1.8" />
    <text x={214} y={60} fontSize="8" fontFamily="monospace" fill={CYAN}>S0</text>
    <circle cx={196} cy={82} r={9} fill="none" stroke={VIOLET} strokeWidth="1.8" />
    <text x={214} y={86} fontSize="7.5" fontFamily="monospace" fill={VIOLET}>Co</text>
    <line x1={156} y1={36} x2={187} y2={32} stroke={CYAN} strokeWidth="1.5" />
    <line x1={156} y1={52} x2={187} y2={56} stroke={CYAN} strokeWidth="1.5" />
    <line x1={156} y1={72} x2={187} y2={80} stroke={VIOLET} strokeWidth="1.5" />
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
    why: 'A carry-look-ahead adder has more parts than a full adder, so a tidy bench keeps the wiring sane.',
    subs: [
      'The panel on the LEFT is the parts shelf - it is labeled Circuit Elements.',
      'The big dotted grid is your canvas. Drag empty canvas to pan, scroll to zoom.',
      'The RIGHT panel shows properties of whatever you select.',
      'Plan left-to-right: inputs, then P/G gates, then the carry network, then the sum gates and lamps.',
    ],
    Illus: IllusBench,
  },
  {
    icon: <ToggleLeft size={15} />,
    title: 'Place FIVE inputs',
    why: 'Two bits per operand plus one carry-in: A0, A1, B0, B1 and Cin feed the whole look-ahead block.',
    subs: [
      'Open the Input drawer and drag FIVE Input elements onto the left side, stacked.',
      'Label them A0, A1, B0, B1 and Cin in the right panel - with five inputs, labels prevent mix-ups.',
      'A0 and B0 are the low bits, A1 and B1 the high bits, Cin is the carry into bit 0.',
      'Each one is a clickable bit switch showing 0 or 1.',
    ],
    Illus: IllusInputs,
  },
  {
    icon: <Cpu size={15} />,
    title: 'Build P and G for both bits',
    why: 'Propagate Pi = Ai XOR Bi and Generate Gi = Ai AND Bi are the raw ingredients every carry is made from.',
    subs: [
      'Drag TWO XOR Gates: wire A0,B0 into one for P0, and A1,B1 into the other for P1.',
      'Drag TWO AND Gates: wire A0,B0 into one for G0, and A1,B1 into the other for G1.',
      'P0, P1, G0, G1 are now four signals you will reuse below - keep them where you can reach them.',
      'Generate (G) means this bit makes a carry on its own; Propagate (P) means it passes a carry through.',
    ],
    Illus: IllusPG,
  },
  {
    icon: <Zap size={15} />,
    title: 'Build the look-ahead carries',
    why: 'Here is the whole trick: each carry is one flat AND/OR expression of P, G and Cin, so no carry waits on the one before it.',
    subs: [
      'C1: drag one AND Gate for the product P0 AND Cin, then one OR Gate that takes G0 and that product. C1 = G0 + (P0 AND Cin).',
      'C2 (this is Cout): build three product terms - G1, then P1 AND G0, then P1 AND P0 AND Cin (a 3-input AND).',
      'Feed those three terms into one OR Gate. Cout = G1 + (P1 AND G0) + (P1 AND P0 AND Cin).',
      'Notice C1 and C2 are both written straight from P, G and Cin - they settle in PARALLEL, not in a ripple chain.',
    ],
    Illus: IllusCarry,
  },
  {
    icon: <Cable size={15} />,
    title: 'Add the sum gates and wire it up',
    why: 'Sums are cheap once the carries exist: each sum bit is just its propagate XOR-ed with the carry into that bit.',
    subs: [
      'Drag TWO XOR Gates for the sums: S0 = P0 XOR Cin, and S1 = P1 XOR C1.',
      'From the Output drawer drag THREE Output lamps: label them S0, S1 and Cout.',
      'Wire P0 and Cin into the S0 XOR; wire P1 and C1 into the S1 XOR.',
      'Wire each XOR output to its lamp, and the C2 OR output to the Cout lamp. Double-check every reused P/G branch.',
    ],
    Illus: IllusSums,
  },
  {
    icon: <FlaskConical size={15} />,
    title: 'Prove sample sums',
    why: 'A 2-bit add has 32 input rows, so we spot-check a handful of representative sums instead of every case.',
    subs: [
      'Leave Cin at 0 for these checks. Click the A and B switches to set each pair below.',
      'Read the lamps as Cout S1 S0 and confirm it equals A + B in binary, then tick the row off.',
      'Anchor: 11 + 11 is 3 + 3 = 6 = binary 110, so Cout=1, S1=1, S0=0.',
      'Watch closely - C1 and Cout light at the same moment, never one after the other.',
    ],
    Illus: IllusProve,
  },
];

/* ── the rail ────────────────────────────────────────────────── */

export const CarryLookAheadTutorial: React.FC<{ onClose: () => void; onMinimize?: () => void }> = ({ onClose, onMinimize }) => {
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
         style={{ borderColor: ORANGE }}>
      {/* grab bar (mobile only) */}
      <button onClick={() => setExpanded(v => !v)}
              className="lg:hidden flex items-center justify-between px-4 h-14 flex-shrink-0 border-b border-white/10">
        <span className="font-mono text-[10px] font-black uppercase tracking-widest" style={{ color: ORANGE }}>
          Guided build · step {Math.min(step + 1, STEPS.length)} of {STEPS.length}
        </span>
        {expanded ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
      </button>

      <div className={`${expanded ? 'flex' : 'hidden'} lg:flex flex-col flex-1 min-h-0`}>
        {/* header */}
        <div className="px-5 pt-5 pb-4 border-b border-white/10 flex-shrink-0">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="font-mono text-[10px] font-black uppercase tracking-[0.3em]" style={{ color: ORANGE }}>
                Guided build · Carry Look-Ahead Adder
              </div>
              <div className="mt-1 text-[11px] text-slate-400">
                Two bits in, computed carries out. Every carry is one flat AND/OR formula, so they settle in parallel. Nothing here can break - experiment freely.
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
                          style={{ background: allProven ? EMERALD : ORANGE }} />
            </div>
            <span className="font-mono text-[10px] font-bold" style={{ color: allProven ? EMERALD : ORANGE }}>
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
                     active ? 'border-orange-400/60 bg-orange-500/[0.06]'
                     : done ? 'border-emerald-400/30 bg-emerald-500/[0.04]'
                     : 'border-white/10 opacity-50'
                   }`}>
                {/* row header */}
                <button onClick={() => !locked && setStep(i)} disabled={locked}
                        className="w-full flex items-center gap-3 px-4 py-3 text-left">
                  <span className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-black flex-shrink-0 ${
                    done ? 'bg-emerald-400 text-black' : active ? 'bg-orange-400 text-black' : 'bg-white/10 text-slate-400'
                  }`}>
                    {done ? '✓' : i + 1}
                  </span>
                  <span className={`text-sm font-bold flex-1 ${done ? 'text-emerald-300' : active ? 'text-white' : 'text-slate-400'}`}>
                    {s.title}
                  </span>
                  <span style={{ color: done ? EMERALD : active ? ORANGE : '#64748b' }}>{s.icon}</span>
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
                              <span className="font-mono text-[10px] font-black pt-0.5 flex-shrink-0" style={{ color: ORANGE }}>
                                {i + 1}.{j + 1}
                              </span>
                              {sub}
                            </li>
                          ))}
                        </ol>
                        <p className="text-[11px] italic text-slate-500 border-l-2 pl-3" style={{ borderColor: `${ORANGE}66` }}>
                          Why: {s.why}
                        </p>

                        {/* sample-sum checklist on the final step */}
                        {i === STEPS.length - 1 ? (
                          <div className="rounded-xl border border-white/10 overflow-hidden">
                            <div className="grid grid-cols-4 text-center font-mono text-[10px] uppercase tracking-wider text-slate-500 bg-white/[0.04] py-1.5">
                              <span>A</span><span>B</span><span>Sum</span><span>Cout</span>
                            </div>
                            {SAMPLES.map((r, ri) => (
                              <button key={ri} onClick={() => toggleCheck(ri)}
                                      className={`w-full grid grid-cols-4 items-center text-center font-mono text-sm py-2 transition-colors ${
                                        checks[ri] ? 'bg-emerald-500/10 text-emerald-300' : 'text-slate-300 hover:bg-white/[0.04]'
                                      }`}>
                                <span>{r.a}</span><span>{r.b}</span>
                                <span className="font-bold">{r.sum}</span>
                                <span className="flex items-center justify-center gap-1.5">
                                  <span className="font-bold">{r.cout}</span>
                                  {checks[ri] ? <CheckCircle2 size={14} className="text-emerald-400" /> : <Circle size={14} className="text-slate-600" />}
                                </span>
                              </button>
                            ))}
                          </div>
                        ) : (
                          <button onClick={() => setStep(i + 1)}
                                  className="w-full py-2.5 rounded-xl font-mono text-[11px] font-black uppercase tracking-widest text-black transition-all active:scale-[0.98]"
                                  style={{ background: ORANGE }}>
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
                <div className="font-black text-emerald-300">Certified: you built an adder that does not wait on its own carries.</div>
                <p className="text-[12px] text-slate-400 mt-2 leading-relaxed">
                  Six representative sums proven on real, simulated hardware. Because C1 and Cout are
                  flat AND/OR formulas of P, G and Cin, they resolve together instead of rippling - the
                  exact idea that lets wide adders stay fast inside every modern CPU.
                </p>
                <div className="mt-4 grid grid-cols-1 gap-2">
                  <button onClick={() => navigate('/dsd/11/circuit')}
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
