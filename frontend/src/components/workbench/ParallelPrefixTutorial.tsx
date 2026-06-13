import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, CheckCircle2, Circle, ChevronDown, RotateCcw, Compass, ToggleLeft,
  Cpu, Boxes, Cable, FlaskConical, Trophy, ChevronUp, ChevronRight,
} from 'lucide-react';

const INDIGO = '#818cf8';
const CYAN = '#22d3ee';
const EMERALD = '#34d399';
const VIOLET = '#a78bfa';
const ROSE = '#fb7185';

const STORE_KEY = 'bfb_wb_ppa_tutorial';

interface Saved { step: number; checks: boolean[] }

function load(): Saved {
  try {
    const raw = JSON.parse(localStorage.getItem(STORE_KEY) || 'null');
    if (raw && typeof raw.step === 'number' && Array.isArray(raw.checks) && raw.checks.length === 6) return raw;
  } catch { /* ignore */ }
  return { step: 0, checks: Array(6).fill(false) };
}

/**
 * Multi-bit adders have huge truth tables, so we prove the build with a SMALL
 * set of representative 2-bit additions instead of an exhaustive table.
 * Cin is held at 0 for every sample row. Columns: A (2 bits) · B (2 bits) ·
 * Sum (2 bits) · Cout.
 */
const SAMPLES = [
  { a: '00', b: '00', sum: '00', cout: 0 }, // 0 + 0 = 0
  { a: '01', b: '01', sum: '10', cout: 0 }, // 1 + 1 = 2, carry rolls bit0 -> bit1
  { a: '10', b: '01', sum: '11', cout: 0 }, // 2 + 1 = 3
  { a: '11', b: '01', sum: '00', cout: 1 }, // 3 + 1 = 4, overflows to Cout
  { a: '10', b: '10', sum: '00', cout: 1 }, // 2 + 2 = 4
  { a: '11', b: '11', sum: '10', cout: 1 }, // 3 + 3 = 6 -> 110
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
    <text x={124} y={45} textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#475569">canvas · drag to pan</text>
    <text x={124} y={58} textAnchor="middle" fontSize="7" fontFamily="monospace" fill={INDIGO}>one black cell lives here</text>
    <rect x={188} y={6} width={48} height={78} rx={6} fill="#1e293b" stroke="#334155" strokeWidth="1.5" />
    <text x={212} y={20} textAnchor="middle" fontSize="6.5" fontFamily="monospace" fill="#94a3b8">PROPS</text>
  </svg>
);

const IllusInputs: React.FC = () => (
  <svg viewBox="0 0 240 130" className="w-full h-auto">
    {(['A0', 'A1', 'B0', 'B1', 'Cin'] as const).map((l, i) => (
      <g key={l}>
        <rect x={26} y={6 + i * 24} width={32} height={18} rx={4} fill="#0f172a" stroke={INDIGO} strokeWidth="2" />
        <text x={42} y={19 + i * 24} textAnchor="middle" fontSize="9" fontFamily="monospace" fontWeight="bold" fill={INDIGO}>0</text>
        <text x={66} y={19 + i * 24} fontSize="8.5" fontFamily="monospace" fill="#94a3b8">
          ← {l}{l === 'Cin' ? ' (carry-in, hold at 0)' : ''}
        </text>
      </g>
    ))}
  </svg>
);

const IllusPre: React.FC = () => (
  <svg viewBox="0 0 240 130" className="w-full h-auto">
    {/* bit 0 pair */}
    <path d="M 28 10 Q 38 24 28 38 Q 50 38 64 24 Q 50 10 28 10 Z" fill="#0f172a" stroke={CYAN} strokeWidth="2" />
    <path d="M 23 10 Q 33 24 23 38" fill="none" stroke={CYAN} strokeWidth="2" />
    <text x={76} y={28} fontSize="9" fontFamily="monospace" fill={CYAN}>P0 = A0 XOR B0</text>
    <path d="M 28 50 L 28 76 L 40 76 Q 58 76 58 63 Q 58 50 40 50 Z" fill="#0f172a" stroke={ROSE} strokeWidth="2" />
    <text x={76} y={67} fontSize="9" fontFamily="monospace" fill={ROSE}>G0 = A0 AND B0</text>
    {/* bit 1 pair */}
    <path d="M 160 50 Q 170 64 160 78 Q 182 78 196 64 Q 182 50 160 50 Z" fill="#0f172a" stroke={CYAN} strokeWidth="2" />
    <path d="M 155 50 Q 165 64 155 78" fill="none" stroke={CYAN} strokeWidth="2" />
    <text x={120} y={100} fontSize="9" fontFamily="monospace" fill={CYAN}>P1 = A1 XOR B1</text>
    <text x={120} y={116} fontSize="9" fontFamily="monospace" fill={ROSE}>G1 = A1 AND B1</text>
    <text x={6} y={100} fontSize="8" fontFamily="monospace" fill="#94a3b8">P = propagate · G = generate</text>
  </svg>
);

const IllusBlackCell: React.FC = () => (
  <svg viewBox="0 0 240 130" className="w-full h-auto">
    {/* the framed black cell */}
    <rect x={70} y={10} width={150} height={110} rx={10} fill="#000" stroke={INDIGO} strokeWidth="2" />
    <text x={145} y={26} textAnchor="middle" fontSize="8" fontFamily="monospace" fontWeight="bold" fill={INDIGO}>BLACK CELL</text>
    {/* inputs labels */}
    <text x={6} y={42} fontSize="8" fontFamily="monospace" fill={ROSE}>P1</text>
    <text x={6} y={62} fontSize="8" fontFamily="monospace" fill={EMERALD}>G0</text>
    <text x={6} y={100} fontSize="8" fontFamily="monospace" fill={ROSE}>G1</text>
    {/* AND: P1 AND G0 */}
    <path d="M 92 36 L 92 64 L 104 64 Q 122 64 122 50 Q 122 36 104 36 Z" fill="#0f172a" stroke={ROSE} strokeWidth="2" />
    <line x1={18} y1={40} x2={92} y2={44} stroke={ROSE} strokeWidth="1.5" />
    <line x1={18} y1={58} x2={92} y2={56} stroke={EMERALD} strokeWidth="1.5" />
    <text x={107} y={28} textAnchor="middle" fontSize="6.5" fontFamily="monospace" fill={ROSE}>P1·G0</text>
    {/* OR: that AND OR G1 */}
    <path d="M 160 64 Q 170 78 160 92 Q 182 92 196 78 Q 182 64 160 64 Z" fill="#0f172a" stroke={INDIGO} strokeWidth="2" />
    <line x1={122} y1={50} x2={160} y2={72} stroke={ROSE} strokeWidth="1.5" />
    <line x1={18} y1={96} x2={160} y2={84} stroke={ROSE} strokeWidth="1.5" />
    <line x1={196} y1={78} x2={220} y2={78} stroke={INDIGO} strokeWidth="1.5" />
    <text x={210} y={104} textAnchor="middle" fontSize="7" fontFamily="monospace" fill={INDIGO}>G(1:0)</text>
    <text x={145} y={116} textAnchor="middle" fontSize="6.5" fontFamily="monospace" fill="#94a3b8">G1 OR (P1 AND G0)</text>
  </svg>
);

const IllusCarrySum: React.FC = () => (
  <svg viewBox="0 0 240 130" className="w-full h-auto">
    {/* C0 = G0 OR (P0 AND Cin) */}
    <text x={6} y={20} fontSize="8" fontFamily="monospace" fill={VIOLET}>C0 = G0 OR (P0·Cin)</text>
    {/* C1 = G(1:0) OR (P1 AND P0 AND Cin) */}
    <text x={6} y={40} fontSize="8" fontFamily="monospace" fill={VIOLET}>C1 = G(1:0) OR (P1·P0·Cin)</text>
    {/* S0 lamp */}
    <circle cx={40} cy={78} r={13} fill="none" stroke={CYAN} strokeWidth="2" />
    <text x={40} y={82} textAnchor="middle" fontSize="8" fontFamily="monospace" fill={CYAN}>S0</text>
    <text x={58} y={70} fontSize="7.5" fontFamily="monospace" fill="#94a3b8">P0 XOR Cin</text>
    {/* S1 lamp */}
    <circle cx={150} cy={78} r={13} fill="none" stroke={CYAN} strokeWidth="2" />
    <text x={150} y={82} textAnchor="middle" fontSize="8" fontFamily="monospace" fill={CYAN}>S1</text>
    <text x={168} y={70} fontSize="7.5" fontFamily="monospace" fill="#94a3b8">P1 XOR C0</text>
    {/* Cout lamp */}
    <circle cx={40} cy={114} r={11} fill="none" stroke={INDIGO} strokeWidth="2" />
    <text x={40} y={117} textAnchor="middle" fontSize="7" fontFamily="monospace" fill={INDIGO}>Co</text>
    <text x={58} y={117} fontSize="7.5" fontFamily="monospace" fill="#94a3b8">Cout = C1</text>
  </svg>
);

const IllusProve: React.FC = () => (
  <svg viewBox="0 0 240 110" className="w-full h-auto">
    {/* A bus */}
    <rect x={10} y={14} width={42} height={20} rx={4} fill="#0f172a" stroke={INDIGO} strokeWidth="1.5" />
    <text x={31} y={28} textAnchor="middle" fontSize="9" fontFamily="monospace" fill={INDIGO}>A1A0</text>
    <text x={31} y={48} textAnchor="middle" fontSize="7" fontFamily="monospace" fill="#94a3b8">2-bit A</text>
    <text x={70} y={28} fontSize="14" fontFamily="monospace" fill="#94a3b8">+</text>
    {/* B bus */}
    <rect x={88} y={14} width={42} height={20} rx={4} fill="#0f172a" stroke={INDIGO} strokeWidth="1.5" />
    <text x={109} y={28} textAnchor="middle" fontSize="9" fontFamily="monospace" fill={INDIGO}>B1B0</text>
    <text x={109} y={48} textAnchor="middle" fontSize="7" fontFamily="monospace" fill="#94a3b8">2-bit B</text>
    <text x={148} y={28} fontSize="14" fontFamily="monospace" fill="#94a3b8">=</text>
    {/* result */}
    <rect x={166} y={14} width={32} height={20} rx={4} fill="#0f172a" stroke={CYAN} strokeWidth="1.5" />
    <text x={182} y={28} textAnchor="middle" fontSize="9" fontFamily="monospace" fill={CYAN}>S1S0</text>
    <circle cx={216} cy={24} r={9} fill="none" stroke={INDIGO} strokeWidth="1.5" />
    <text x={216} y={27} textAnchor="middle" fontSize="6.5" fontFamily="monospace" fill={INDIGO}>Co</text>
    <text x={120} y={86} textAnchor="middle" fontSize="8" fontFamily="monospace" fill={INDIGO}>tick a row when the lamps match it</text>
    <text x={120} y={100} textAnchor="middle" fontSize="7.5" fontFamily="monospace" fill="#94a3b8">six representative sums, not all of them</text>
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
    why: 'A parallel prefix adder is just one small cell tiled many times. We build the cell once.',
    subs: [
      'The panel on the LEFT is the parts shelf - it is labeled Circuit Elements.',
      'The big dotted grid is your canvas. Drag empty canvas to pan, scroll to zoom.',
      'The RIGHT panel shows properties of whatever you select.',
      'Goal today: one BLACK CELL plus a tiny 2-bit adder around it. That one cell is the whole family in miniature.',
    ],
    Illus: IllusBench,
  },
  {
    icon: <ToggleLeft size={15} />,
    title: 'Place the inputs',
    why: 'A 2-bit adder needs two bits per operand plus a carry-in. Five switches set every test.',
    subs: [
      'Open the Input drawer and drag FIVE Input elements onto the canvas, stacked on the left.',
      'Label them A0, A1, B0, B1 and Cin in the right panel - with five switches, labels stop mix-ups.',
      'A0 and B0 are the low bits; A1 and B1 are the high bits.',
      'Keep Cin at 0 for the sample sums later. It is still wired in so the math stays general.',
    ],
    Illus: IllusInputs,
  },
  {
    icon: <Cpu size={15} />,
    title: 'Pre-processing: P and G',
    why: 'Before any carry can move, each bit reports two facts: do I propagate a carry, and do I generate one?',
    subs: [
      'Bit 0: drag an XOR for P0 = A0 XOR B0, and an AND for G0 = A0 AND B0.',
      'Bit 1: drag an XOR for P1 = A1 XOR B1, and an AND for G1 = A1 AND B1.',
      'Wire A0 and B0 into the bit-0 XOR and AND; wire A1 and B1 into the bit-1 XOR and AND.',
      'P means "propagate" (pass a carry through). G means "generate" (make a carry here). Four gates done.',
    ],
    Illus: IllusPre,
  },
  {
    icon: <Boxes size={15} />,
    title: 'Build the BLACK CELL',
    why: 'This is the one repeated cell of the entire parallel prefix family. Build it well and you have built them all.',
    subs: [
      'Drag ONE AND gate: wire P1 and G0 into it to make P1 AND G0.',
      'Drag ONE OR gate: wire that AND output and G1 into it.',
      'The OR output is the group generate: G(1:0) = G1 OR (P1 AND G0).',
      'That is the black cell. Wide, fast adders are nothing but this exact 2-gate cell tiled across the bits.',
    ],
    Illus: IllusBlackCell,
  },
  {
    icon: <Cable size={15} />,
    title: 'Carries, sums and outputs',
    why: 'With P, G and the group generate ready, the carries fall out in parallel - no waiting for a ripple.',
    subs: [
      'Carry 0: build C0 = G0 OR (P0 AND Cin) with one AND and one OR.',
      'Carry 1 / Cout: build C1 = G(1:0) OR (P1 AND P0 AND Cin) using the group generate and a 3-input AND of P1, P0, Cin.',
      'Sum 0: S0 = P0 XOR Cin (one XOR). Sum 1: S1 = P1 XOR C0 (one XOR).',
      'Place three Output lamps on the right: S0, S1 and Cout (= C1). Wire each sum and the carry-out to its lamp.',
    ],
    Illus: IllusCarrySum,
  },
  {
    icon: <FlaskConical size={15} />,
    title: 'Prove sample sums',
    why: 'A 2-bit-plus-carry adder has a large table, so we spot-check six telling cases instead of every row.',
    subs: [
      'Read each row as A1A0 + B1B0 = S1S0 with Cout, and keep Cin at 0.',
      'Flip the A and B switches to set the row, then watch the S1, S0 and Cout lamps.',
      'When the live lamps match a row, tick it off. The last three rows are exactly the ones that overflow into Cout.',
    ],
    Illus: IllusProve,
  },
];

/* ── the rail ────────────────────────────────────────────────── */

export const ParallelPrefixTutorial: React.FC<{ onClose: () => void; onMinimize?: () => void }> = ({ onClose, onMinimize }) => {
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
  const restart = () => setState({ step: 0, checks: Array(6).fill(false) });

  const allProven = checks.every(Boolean);
  const progress = allProven ? 100 : Math.round(((step + checks.filter(Boolean).length / 6) / STEPS.length) * 100);

  return (
    <div className="h-full flex flex-col bg-slate-950 text-slate-200 border-t-2 lg:border-t-0 lg:border-l-2"
         style={{ borderColor: INDIGO }}>
      {/* grab bar (mobile only) */}
      <button onClick={() => setExpanded(v => !v)}
              className="lg:hidden flex items-center justify-between px-4 h-14 flex-shrink-0 border-b border-white/10">
        <span className="font-mono text-[10px] font-black uppercase tracking-widest" style={{ color: INDIGO }}>
          Guided build · step {Math.min(step + 1, STEPS.length)} of {STEPS.length}
        </span>
        {expanded ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
      </button>

      <div className={`${expanded ? 'flex' : 'hidden'} lg:flex flex-col flex-1 min-h-0`}>
        {/* header */}
        <div className="px-5 pt-5 pb-4 border-b border-white/10 flex-shrink-0">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="font-mono text-[10px] font-black uppercase tracking-[0.3em]" style={{ color: INDIGO }}>
                Guided build · Parallel Prefix Adder
              </div>
              <div className="mt-1 text-[11px] text-slate-400">
                One black cell, then a tiny 2-bit adder around it. Nothing here can break - experiment freely.
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
                          style={{ background: allProven ? EMERALD : INDIGO }} />
            </div>
            <span className="font-mono text-[10px] font-bold" style={{ color: allProven ? EMERALD : INDIGO }}>
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
                     active ? 'border-indigo-400/60 bg-indigo-500/[0.06]'
                     : done ? 'border-emerald-400/30 bg-emerald-500/[0.04]'
                     : 'border-white/10 opacity-50'
                   }`}>
                {/* row header */}
                <button onClick={() => !locked && setStep(i)} disabled={locked}
                        className="w-full flex items-center gap-3 px-4 py-3 text-left">
                  <span className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-black flex-shrink-0 ${
                    done ? 'bg-emerald-400 text-black' : active ? 'bg-indigo-400 text-black' : 'bg-white/10 text-slate-400'
                  }`}>
                    {done ? '✓' : i + 1}
                  </span>
                  <span className={`text-sm font-bold flex-1 ${done ? 'text-emerald-300' : active ? 'text-white' : 'text-slate-400'}`}>
                    {s.title}
                  </span>
                  <span style={{ color: done ? EMERALD : active ? INDIGO : '#64748b' }}>{s.icon}</span>
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
                              <span className="font-mono text-[10px] font-black pt-0.5 flex-shrink-0" style={{ color: INDIGO }}>
                                {i + 1}.{j + 1}
                              </span>
                              {sub}
                            </li>
                          ))}
                        </ol>
                        <p className="text-[11px] italic text-slate-500 border-l-2 pl-3" style={{ borderColor: `${INDIGO}66` }}>
                          Why: {s.why}
                        </p>

                        {/* sample-sum checklist on the final step */}
                        {i === STEPS.length - 1 ? (
                          <div className="rounded-xl border border-white/10 overflow-hidden">
                            <div className="grid grid-cols-5 text-center font-mono text-[10px] uppercase tracking-wider text-slate-500 bg-white/[0.04] py-1.5">
                              <span>A</span><span>B</span><span>Sum</span><span>Cout</span><span></span>
                            </div>
                            {SAMPLES.map((r, ri) => (
                              <button key={ri} onClick={() => toggleCheck(ri)}
                                      className={`w-full grid grid-cols-5 items-center text-center font-mono text-sm py-2 transition-colors ${
                                        checks[ri] ? 'bg-emerald-500/10 text-emerald-300' : 'text-slate-300 hover:bg-white/[0.04]'
                                      }`}>
                                <span>{r.a}</span><span>{r.b}</span>
                                <span className="font-bold">{r.sum}</span><span className="font-bold">{r.cout}</span>
                                <span className="flex justify-center">
                                  {checks[ri] ? <CheckCircle2 size={15} className="text-emerald-400" /> : <Circle size={15} className="text-slate-600" />}
                                </span>
                              </button>
                            ))}
                          </div>
                        ) : (
                          <button onClick={() => setStep(i + 1)}
                                  className="w-full py-2.5 rounded-xl font-mono text-[11px] font-black uppercase tracking-widest text-black transition-all active:scale-[0.98]"
                                  style={{ background: INDIGO }}>
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
                <div className="font-black text-emerald-300">Certified: you built the cell that scales.</div>
                <p className="text-[12px] text-slate-400 mt-2 leading-relaxed">
                  Six representative sums proven on real, simulated hardware. The black cell you wired
                  is the single reusable building block of the parallel prefix family - tile it across
                  more bits and the same cell turns into a wide, fast adder that computes every carry
                  at once instead of waiting for a ripple.
                </p>
                <div className="mt-4 grid grid-cols-1 gap-2">
                  <button onClick={() => navigate('/dsd/12/circuit')}
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
