import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, CheckCircle2, Circle, ChevronDown, RotateCcw, Compass, ToggleLeft,
  Cpu, Lightbulb, Cable, FlaskConical, Trophy, ChevronUp, ChevronRight,
} from 'lucide-react';

const AMBER = '#f59e0b';
const CYAN = '#22d3ee';
const EMERALD = '#34d399';
const VIOLET = '#a78bfa';

const STORE_KEY = 'bfb_wb_rca_tutorial';

interface Saved { step: number; checks: boolean[] }

function load(): Saved {
  try {
    const raw = JSON.parse(localStorage.getItem(STORE_KEY) || 'null');
    if (raw && typeof raw.step === 'number' && Array.isArray(raw.checks) && raw.checks.length === 6) return raw;
  } catch { /* ignore */ }
  return { step: 0, checks: Array(6).fill(false) };
}

/**
 * A multi-bit adder has a huge truth table, so the proof here is a SMALL set of
 * representative 2-bit additions, not an exhaustive 256-row dump. Each row reads
 * A1A0 + B1B0 = S1S0 with a carry-out. Watch the carry hop from stage 0 to stage 1.
 */
const SAMPLES = [
  { a: '00', b: '00', sum: '00', cout: 0 },
  { a: '01', b: '01', sum: '10', cout: 0 },
  { a: '11', b: '01', sum: '00', cout: 1 },
  { a: '10', b: '11', sum: '01', cout: 1 },
  { a: '11', b: '11', sum: '10', cout: 1 },
  { a: '01', b: '11', sum: '00', cout: 1 },
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
        <rect x={26} y={6 + i * 24} width={30} height={18} rx={4} fill="#0f172a" stroke={AMBER} strokeWidth="2" />
        <text x={41} y={19 + i * 24} textAnchor="middle" fontSize="9" fontFamily="monospace" fontWeight="bold" fill={AMBER}>0</text>
        <text x={66} y={19 + i * 24} fontSize="8.5" fontFamily="monospace" fill="#94a3b8">
          ← {l}{l === 'Cin' ? ' (tie this one to 0)' : ''}
        </text>
      </g>
    ))}
  </svg>
);

const IllusGates: React.FC = () => (
  <svg viewBox="0 0 240 130" className="w-full h-auto">
    {/* stage 0 block */}
    <rect x={6} y={8} width={104} height={114} rx={8} fill="#0b1220" stroke={AMBER} strokeWidth="1.6" strokeDasharray="4 3" />
    <text x={58} y={22} textAnchor="middle" fontSize="8" fontFamily="monospace" fill={AMBER}>STAGE 0 · full adder</text>
    <path d="M 22 32 Q 30 44 22 56 Q 40 56 52 44 Q 40 32 22 32 Z" fill="#0f172a" stroke={CYAN} strokeWidth="1.6" />
    <path d="M 22 64 Q 30 76 22 88 Q 40 88 52 76 Q 40 64 22 64 Z" fill="#0f172a" stroke={CYAN} strokeWidth="1.6" />
    <path d="M 60 32 L 60 52 L 70 52 Q 84 52 84 42 Q 84 32 70 32 Z" fill="#0f172a" stroke={AMBER} strokeWidth="1.6" />
    <path d="M 60 66 L 60 86 L 70 86 Q 84 86 84 76 Q 84 66 70 66 Z" fill="#0f172a" stroke={AMBER} strokeWidth="1.6" />
    <path d="M 60 98 Q 68 108 60 118 Q 78 118 90 108 Q 78 98 60 98 Z" fill="#0f172a" stroke={VIOLET} strokeWidth="1.6" />
    {/* stage 1 block */}
    <rect x={130} y={8} width={104} height={114} rx={8} fill="#0b1220" stroke={EMERALD} strokeWidth="1.6" strokeDasharray="4 3" />
    <text x={182} y={22} textAnchor="middle" fontSize="8" fontFamily="monospace" fill={EMERALD}>STAGE 1 · full adder</text>
    <path d="M 146 32 Q 154 44 146 56 Q 164 56 176 44 Q 164 32 146 32 Z" fill="#0f172a" stroke={CYAN} strokeWidth="1.6" />
    <path d="M 146 64 Q 154 76 146 88 Q 164 88 176 76 Q 164 64 146 64 Z" fill="#0f172a" stroke={CYAN} strokeWidth="1.6" />
    <path d="M 184 32 L 184 52 L 194 52 Q 208 52 208 42 Q 208 32 194 32 Z" fill="#0f172a" stroke={AMBER} strokeWidth="1.6" />
    <path d="M 184 66 L 184 86 L 194 86 Q 208 86 208 76 Q 208 66 194 66 Z" fill="#0f172a" stroke={AMBER} strokeWidth="1.6" />
    <path d="M 184 98 Q 192 108 184 118 Q 202 118 214 108 Q 202 98 184 98 Z" fill="#0f172a" stroke={VIOLET} strokeWidth="1.6" />
    <text x={120} y={70} textAnchor="middle" fontSize="14" fontFamily="monospace" fill="#475569">×2</text>
  </svg>
);

const IllusOutputs: React.FC = () => (
  <svg viewBox="0 0 240 100" className="w-full h-auto">
    <circle cx={44} cy={22} r={12} fill="none" stroke={CYAN} strokeWidth="2" />
    <text x={66} y={26} fontSize="9" fontFamily="monospace" fill={CYAN}>← S0 (from stage 0 sum)</text>
    <circle cx={44} cy={54} r={12} fill="none" stroke={CYAN} strokeWidth="2" />
    <text x={66} y={58} fontSize="9" fontFamily="monospace" fill={CYAN}>← S1 (from stage 1 sum)</text>
    <circle cx={44} cy={86} r={12} fill="none" stroke={AMBER} strokeWidth="2" />
    <text x={66} y={90} fontSize="9" fontFamily="monospace" fill={AMBER}>← Cout (stage 1 carry-out)</text>
  </svg>
);

const IllusWiring: React.FC = () => (
  <svg viewBox="0 0 250 130" className="w-full h-auto">
    {/* stage 0 box */}
    <rect x={14} y={20} width={86} height={92} rx={8} fill="#0f172a" stroke={AMBER} strokeWidth="1.8" />
    <text x={57} y={40} textAnchor="middle" fontSize="8" fontFamily="monospace" fill={AMBER}>FA stage 0</text>
    <text x={57} y={70} textAnchor="middle" fontSize="7" fontFamily="monospace" fill="#94a3b8">A0 B0 Cin=0</text>
    <text x={57} y={86} textAnchor="middle" fontSize="7" fontFamily="monospace" fill="#94a3b8">→ S0</text>
    {/* stage 1 box */}
    <rect x={150} y={20} width={86} height={92} rx={8} fill="#0f172a" stroke={EMERALD} strokeWidth="1.8" />
    <text x={193} y={40} textAnchor="middle" fontSize="8" fontFamily="monospace" fill={EMERALD}>FA stage 1</text>
    <text x={193} y={70} textAnchor="middle" fontSize="7" fontFamily="monospace" fill="#94a3b8">A1 B1</text>
    <text x={193} y={86} textAnchor="middle" fontSize="7" fontFamily="monospace" fill="#94a3b8">→ S1, Cout</text>
    {/* the carry chain hop */}
    <line x1={100} y1={58} x2={150} y2={58} stroke={VIOLET} strokeWidth="2.4" />
    <polygon points="150,58 142,54 142,62" fill={VIOLET} />
    <text x={125} y={50} textAnchor="middle" fontSize="7" fontFamily="monospace" fill={VIOLET}>C0 → Cin1</text>
    <text x={125} y={104} textAnchor="middle" fontSize="6.5" fontFamily="monospace" fill="#64748b">the carry hop</text>
    {/* Cout lamp */}
    <line x1={236} y1={58} x2={244} y2={58} stroke={AMBER} strokeWidth="1.6" />
    <circle cx={244} cy={58} r={5} fill="none" stroke={AMBER} strokeWidth="1.6" />
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
    why: 'This is the same CircuitVerse bench you used for the half and full adder labs.',
    subs: [
      'The panel on the LEFT is the parts shelf - it is labeled Circuit Elements.',
      'The big dotted grid is your canvas. Drag empty canvas to pan, scroll to zoom.',
      'The RIGHT panel shows properties of whatever you select.',
      'Today you chain TWO full adders into a 2-bit ripple-carry adder. Same bench, bigger machine.',
    ],
    Illus: IllusBench,
  },
  {
    icon: <ToggleLeft size={15} />,
    title: 'Place the inputs',
    why: 'A 2-bit adder needs two operands of two bits each, plus a carry-in for the bottom stage.',
    subs: [
      'Open the Input drawer and drag five Input elements onto the canvas.',
      'Label them A0, A1, B0, B1 and Cin so the two stages never get crossed.',
      'A0 and B0 feed stage 0 (the low bit); A1 and B1 feed stage 1 (the high bit).',
      'Cin is the carry into stage 0. Tie it to 0 (leave it off) - a plain adder has no carry-in.',
    ],
    Illus: IllusInputs,
  },
  {
    icon: <Cpu size={15} />,
    title: 'Place two full adders',
    why: 'A ripple-carry adder is just full adders chained, one per bit. Build the block once, repeat it.',
    subs: [
      'Each full adder = 2 XOR + 2 AND + 1 OR. Two stages means ten gates in all.',
      'Lay stage 0 on the left and stage 1 on the right, leaving a gap for the carry wire between them.',
      'Shortcut: if you saved the full adder you built in Module 8, drop two copies of that block instead of placing all ten gates by hand.',
      'Keep the two stages visually separate - it makes the carry hop obvious when you wire it.',
    ],
    Illus: IllusGates,
  },
  {
    icon: <Lightbulb size={15} />,
    title: 'Place the outputs',
    why: 'Two sum bits and one final carry-out: that is the full 2-bit answer.',
    subs: [
      'From the Output drawer drag three Output elements to the right edge.',
      'S0 is the stage 0 sum (the low result bit).',
      'S1 is the stage 1 sum (the high result bit).',
      'Cout is the stage 1 carry-out - it is the third bit if the answer overflows two bits.',
    ],
    Illus: IllusOutputs,
  },
  {
    icon: <Cable size={15} />,
    title: 'Wire the stages and chain the carry',
    why: 'The whole idea of ripple-carry lives in ONE wire: stage 0 carry-out feeds stage 1 carry-in.',
    subs: [
      'Stage 0: wire A0, B0 and Cin into the stage 0 full adder; route its sum to S0.',
      'CHAIN: take the stage 0 carry-out and wire it into the stage 1 carry-in. This is the ripple.',
      'Stage 1: wire A1 and B1 into the stage 1 full adder; route its sum to S1.',
      'Finally wire the stage 1 carry-out to the Cout lamp. The carry has rippled all the way through.',
    ],
    Illus: IllusWiring,
  },
  {
    icon: <FlaskConical size={15} />,
    title: 'Prove sample sums',
    why: 'A 2-bit adder has 256 input cases, so we spot-check a handful that exercise the carry chain.',
    subs: [
      'Set A1A0 and B1B0 with the input switches for each row below, keep Cin at 0.',
      'Read the answer as S1S0 with Cout on top, then tick the row when the lamps match.',
      'Watch row 01+01: stage 0 makes a carry that hops into stage 1 and lights S1. That is the ripple in action.',
    ],
    Illus: IllusWiring,
  },
];

/* ── the rail ────────────────────────────────────────────────── */

export const RippleCarryTutorial: React.FC<{ onClose: () => void; onMinimize?: () => void }> = ({ onClose, onMinimize }) => {
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
         style={{ borderColor: AMBER }}>
      {/* grab bar (mobile only) */}
      <button onClick={() => setExpanded(v => !v)}
              className="lg:hidden flex items-center justify-between px-4 h-14 flex-shrink-0 border-b border-white/10">
        <span className="font-mono text-[10px] font-black uppercase tracking-widest" style={{ color: AMBER }}>
          Guided build · step {Math.min(step + 1, STEPS.length)} of {STEPS.length}
        </span>
        {expanded ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
      </button>

      <div className={`${expanded ? 'flex' : 'hidden'} lg:flex flex-col flex-1 min-h-0`}>
        {/* header */}
        <div className="px-5 pt-5 pb-4 border-b border-white/10 flex-shrink-0">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="font-mono text-[10px] font-black uppercase tracking-[0.3em]" style={{ color: AMBER }}>
                Guided build · Ripple-Carry Adder
              </div>
              <div className="mt-1 text-[11px] text-slate-400">
                Two full adders, chained bit to bit. The carry ripples from stage 0 to stage 1 - nothing here can break.
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
                          style={{ background: allProven ? EMERALD : AMBER }} />
            </div>
            <span className="font-mono text-[10px] font-bold" style={{ color: allProven ? EMERALD : AMBER }}>
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
                     active ? 'border-amber-400/60 bg-amber-500/[0.06]'
                     : done ? 'border-emerald-400/30 bg-emerald-500/[0.04]'
                     : 'border-white/10 opacity-50'
                   }`}>
                {/* row header */}
                <button onClick={() => !locked && setStep(i)} disabled={locked}
                        className="w-full flex items-center gap-3 px-4 py-3 text-left">
                  <span className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-black flex-shrink-0 ${
                    done ? 'bg-emerald-400 text-black' : active ? 'bg-amber-400 text-black' : 'bg-white/10 text-slate-400'
                  }`}>
                    {done ? '✓' : i + 1}
                  </span>
                  <span className={`text-sm font-bold flex-1 ${done ? 'text-emerald-300' : active ? 'text-white' : 'text-slate-400'}`}>
                    {s.title}
                  </span>
                  <span style={{ color: done ? EMERALD : active ? AMBER : '#64748b' }}>{s.icon}</span>
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
                              <span className="font-mono text-[10px] font-black pt-0.5 flex-shrink-0" style={{ color: AMBER }}>
                                {i + 1}.{j + 1}
                              </span>
                              {sub}
                            </li>
                          ))}
                        </ol>
                        <p className="text-[11px] italic text-slate-500 border-l-2 pl-3" style={{ borderColor: `${AMBER}66` }}>
                          Why: {s.why}
                        </p>

                        {/* representative-sample checklist on the final step */}
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
                                  style={{ background: AMBER }}>
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
                <div className="font-black text-emerald-300">Certified: you chained a real multi-bit adder.</div>
                <p className="text-[12px] text-slate-400 mt-2 leading-relaxed">
                  Six sample sums proven on live, simulated hardware, and you saw the carry hop from
                  stage 0 to stage 1. Add more stages the exact same way and you have a 4-bit, 8-bit
                  or 64-bit adder - the ripple pattern at the heart of every CPU.
                </p>
                <div className="mt-4 grid grid-cols-1 gap-2">
                  <button onClick={() => navigate('/dsd/10/circuit')}
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
