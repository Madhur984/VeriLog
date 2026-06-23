import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, CheckCircle2, Circle, ChevronDown, RotateCcw, Compass, ToggleLeft,
  Cpu, Lightbulb, Cable, FlaskConical, Trophy, ChevronUp, ChevronRight,
} from 'lucide-react';

/**
 * Guided build for the HALF SUBTRACTOR (dsd/16, "Binary Parking Logic").
 * Same rail shape as the adder tutorials: copy of FullAdderTutorial style.
 * Build target: D = x XOR y, B = (NOT x) AND y. Four rows to prove.
 */
const AMBER = '#f59e0b';
const CYAN = '#22d3ee';
const ROSE = '#fb7185';
const EMERALD = '#34d399';

const STORE_KEY = 'bfb_wb_hs_tutorial';

interface Saved { step: number; checks: boolean[] }

function load(): Saved {
  try {
    const raw = JSON.parse(localStorage.getItem(STORE_KEY) || 'null');
    if (raw && typeof raw.step === 'number' && Array.isArray(raw.checks) && raw.checks.length === 4) return raw;
  } catch { /* ignore */ }
  return { step: 0, checks: [false, false, false, false] };
}

/** The four rows the learner must prove on the live circuit: x - y. */
const TRUTH = [
  { x: 0, y: 0, d: 0, b: 0 },
  { x: 0, y: 1, d: 1, b: 1 },
  { x: 1, y: 0, d: 1, b: 0 },
  { x: 1, y: 1, d: 0, b: 0 },
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
  <svg viewBox="0 0 240 90" className="w-full h-auto">
    <rect x={30} y={12} width={34} height={26} rx={4} fill="#0f172a" stroke={AMBER} strokeWidth="2" />
    <text x={47} y={29} textAnchor="middle" fontSize="11" fontFamily="monospace" fontWeight="bold" fill={AMBER}>1</text>
    <text x={75} y={29} fontSize="9" fontFamily="monospace" fill="#94a3b8">← x · spaces (click to flip)</text>
    <rect x={30} y={52} width={34} height={26} rx={4} fill="#0f172a" stroke={ROSE} strokeWidth="2" />
    <text x={47} y={69} textAnchor="middle" fontSize="11" fontFamily="monospace" fontWeight="bold" fill={ROSE}>0</text>
    <text x={75} y={69} fontSize="9" fontFamily="monospace" fill="#94a3b8">← y · cars</text>
  </svg>
);

const IllusGates: React.FC = () => (
  <svg viewBox="0 0 240 90" className="w-full h-auto">
    <path d="M 46 14 Q 58 32 46 50 Q 72 50 88 32 Q 72 14 46 14 Z" fill="#0f172a" stroke={AMBER} strokeWidth="2" />
    <path d="M 40 14 Q 52 32 40 50" fill="none" stroke={AMBER} strokeWidth="2" />
    <text x={104} y={36} fontSize="9" fontFamily="monospace" fill={AMBER}>XOR → Difference</text>
    <polygon points="46,58 46,84 70,71" fill="#0f172a" stroke={CYAN} strokeWidth="2" />
    <circle cx={74} cy={71} r={3.5} fill="#0f172a" stroke={CYAN} strokeWidth="2" />
    <path d="M 92 58 L 92 84 L 104 84 Q 122 84 122 71 Q 122 58 104 58 Z" fill="#0f172a" stroke={ROSE} strokeWidth="2" />
    <text x={132} y={74} fontSize="9" fontFamily="monospace" fill={ROSE}>NOT then AND → Borrow</text>
  </svg>
);

const IllusOutputs: React.FC = () => (
  <svg viewBox="0 0 240 90" className="w-full h-auto">
    <circle cx={50} cy={26} r={13} fill="none" stroke={AMBER} strokeWidth="2" />
    <text x={75} y={30} fontSize="9" fontFamily="monospace" fill={AMBER}>← D · Difference lamp (top)</text>
    <circle cx={50} cy={64} r={13} fill="none" stroke={ROSE} strokeWidth="2" />
    <text x={75} y={68} fontSize="9" fontFamily="monospace" fill={ROSE}>← B · Borrow lamp (bottom)</text>
  </svg>
);

const IllusWiring: React.FC = () => (
  <svg viewBox="0 0 240 120" className="w-full h-auto">
    <rect x={6} y={22} width={22} height={18} rx={3} fill="#0f172a" stroke={AMBER} strokeWidth="1.5" />
    <text x={17} y={35} textAnchor="middle" fontSize="9" fontFamily="monospace" fill={AMBER}>x</text>
    <rect x={6} y={78} width={22} height={18} rx={3} fill="#0f172a" stroke={ROSE} strokeWidth="1.5" />
    <text x={17} y={91} textAnchor="middle" fontSize="9" fontFamily="monospace" fill={ROSE}>y</text>
    {/* x to XOR top + down to NOT */}
    <line x1={28} y1={31} x2={92} y2={31} stroke={CYAN} strokeWidth="2" />
    <circle cx={50} cy={31} r={3} fill={AMBER} />
    <line x1={50} y1={31} x2={50} y2={66} stroke={AMBER} strokeWidth="2" />
    <line x1={50} y1={66} x2={70} y2={66} stroke={AMBER} strokeWidth="2" />
    {/* y to XOR bottom + to AND */}
    <line x1={28} y1={87} x2={92} y2={45} stroke={CYAN} strokeWidth="2" />
    <circle cx={42} cy={87} r={3} fill={ROSE} />
    <line x1={42} y1={87} x2={42} y2={92} stroke={ROSE} strokeWidth="2" />
    <line x1={42} y1={92} x2={92} y2={92} stroke={ROSE} strokeWidth="2" />
    {/* gates */}
    <path d="M 92 20 Q 102 34 92 48 Q 112 48 124 34 Q 112 20 92 20 Z" fill="#0f172a" stroke={AMBER} strokeWidth="2" />
    <polygon points="70,58 70,74 86,66" fill="#0f172a" stroke={CYAN} strokeWidth="1.8" />
    <path d="M 92 62 L 92 100 L 104 100 Q 124 100 124 81 Q 124 62 104 62 Z" fill="#0f172a" stroke={ROSE} strokeWidth="2" />
    {/* outputs */}
    <line x1={124} y1={34} x2={176} y2={34} stroke={AMBER} strokeWidth="2" />
    <circle cx={188} cy={34} r={10} fill="none" stroke={AMBER} strokeWidth="2" />
    <text x={206} y={38} fontSize="8" fontFamily="monospace" fill={AMBER}>D</text>
    <line x1={124} y1={81} x2={176} y2={81} stroke={ROSE} strokeWidth="2" />
    <circle cx={188} cy={81} r={10} fill="none" stroke={ROSE} strokeWidth="2" />
    <text x={206} y={85} fontSize="8" fontFamily="monospace" fill={ROSE}>B</text>
  </svg>
);

interface Step { icon: React.ReactNode; title: string; why: string; subs: string[]; Illus: React.FC }

const STEPS: Step[] = [
  {
    icon: <Compass size={15} />,
    title: 'Know your bench',
    why: 'Every lab starts with knowing where the parts live.',
    subs: [
      'The panel on the LEFT is the parts shelf - it is labeled Circuit Elements.',
      'The big dotted grid is your canvas. Drag empty canvas to pan, scroll to zoom.',
      'The RIGHT panel shows properties of whatever you select.',
      'Find the Input, Output and Gates drawers in the left panel.',
    ],
    Illus: IllusBench,
  },
  {
    icon: <ToggleLeft size={15} />,
    title: 'Place the inputs (x and y)',
    why: 'x is Adarsh\'s empty spaces, y is the arriving cars - the two bits we subtract.',
    subs: [
      'Open the Input drawer and drag two Input switches onto the canvas, one above the other.',
      'The top one is x (the minuend / spaces). The bottom one is y (the subtrahend / cars).',
      'Each Input is a clickable bit - it shows 0 or 1.',
      'Tip: select one and use the right panel to label it x or y.',
    ],
    Illus: IllusInputs,
  },
  {
    icon: <Cpu size={15} />,
    title: 'Place the gates',
    why: 'XOR asks "do the bits differ?" (Difference). NOT + AND asks "no space but a car?" (Borrow).',
    subs: [
      'Open the Gates drawer. Hover the icons to read their names.',
      'Drag an XOR gate to the middle-top - this makes the Difference D.',
      'Drag a NOT gate (an inverter) below it, and an AND gate to its right.',
      'The NOT inverts x into x-prime; the AND combines x-prime with y for the Borrow B.',
    ],
    Illus: IllusGates,
  },
  {
    icon: <Lightbulb size={15} />,
    title: 'Place the outputs (D and B)',
    why: 'The Difference lamp and the Borrow lamp - what Adarsh reads off his lot.',
    subs: [
      'From the Output drawer drag two Output elements to the right side.',
      'The top one is D (Difference). The bottom one is B (Borrow).',
    ],
    Illus: IllusOutputs,
  },
  {
    icon: <Cable size={15} />,
    title: 'Wire the blueprint',
    why: 'The NOT sits ONLY on x - that single inverter is the whole difference from a half adder.',
    subs: [
      'Draw a wire by dragging from a connection dot on one element to a dot on another.',
      'Wire x to the XOR top input. Wire y to the XOR bottom input. Wire the XOR output to the D lamp.',
      'Wire x into the NOT gate. Wire the NOT output (x-prime) to the AND top input.',
      'Wire y to the AND bottom input. Wire the AND output to the B lamp.',
    ],
    Illus: IllusWiring,
  },
  {
    icon: <FlaskConical size={15} />,
    title: 'Prove it',
    why: 'A circuit is only real once every row of its truth table survives contact with reality.',
    subs: [
      'Click the x and y switches to set each combination below.',
      'Watch the lamps. When the live circuit matches a row, tick it off.',
      'Notice B lights up in EXACTLY one row: x=0, y=1 (no space, a car arrives).',
    ],
    Illus: IllusWiring,
  },
];

export const HalfSubtractorTutorial: React.FC<{ onClose: () => void; onMinimize?: () => void }> = ({ onClose, onMinimize }) => {
  const navigate = useNavigate();
  const [{ step, checks }, setState] = useState<Saved>(load);
  const [expanded, setExpanded] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.matchMedia('(min-width: 1024px)').matches : true
  );

  useEffect(() => {
    try { localStorage.setItem(STORE_KEY, JSON.stringify({ step, checks })); } catch { /* ignore */ }
  }, [step, checks]);

  const setStep = (s: number) => setState(prev => ({ ...prev, step: s }));
  const toggleCheck = (i: number) =>
    setState(prev => ({ ...prev, checks: prev.checks.map((c, j) => (j === i ? !c : c)) }));
  const restart = () => setState({ step: 0, checks: [false, false, false, false] });

  const allProven = checks.every(Boolean);
  const progress = allProven ? 100 : Math.round(((step + checks.filter(Boolean).length / 4) / STEPS.length) * 100);

  return (
    <div className="h-full flex flex-col bg-slate-950 text-slate-200 border-t-2 lg:border-t-0 lg:border-l-2" style={{ borderColor: AMBER }}>
      <button onClick={() => setExpanded(v => !v)} className="lg:hidden flex items-center justify-between px-4 h-14 flex-shrink-0 border-b border-white/10">
        <span className="font-mono text-[10px] font-black uppercase tracking-widest" style={{ color: AMBER }}>
          Guided build · step {Math.min(step + 1, STEPS.length)} of {STEPS.length}
        </span>
        {expanded ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
      </button>

      <div className={`${expanded ? 'flex' : 'hidden'} lg:flex flex-col flex-1 min-h-0`}>
        <div className="px-5 pt-5 pb-4 border-b border-white/10 flex-shrink-0">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="font-mono text-[10px] font-black uppercase tracking-[0.3em]" style={{ color: AMBER }}>
                Guided build · Half Subtractor
              </div>
              <div className="mt-1 text-[11px] text-slate-400">
                The simulator is a full editor - nothing you do here can break anything. Experiment freely.
              </div>
            </div>
            <div className="flex gap-1.5 flex-shrink-0">
              {onMinimize && (
                <button onClick={onMinimize} title="Minimize - the simulator's own panels stay reachable"
                        className="hidden lg:block p-2 rounded-lg border border-white/10 hover:border-white/30 transition-colors">
                  <ChevronRight size={14} />
                </button>
              )}
              <button onClick={onClose} title="Close the tutorial" className="p-2 rounded-lg border border-white/10 hover:border-white/30 transition-colors">
                <X size={14} />
              </button>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-3">
            <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
              <motion.div className="h-full rounded-full" animate={{ width: `${progress}%` }} style={{ background: allProven ? EMERALD : AMBER }} />
            </div>
            <span className="font-mono text-[10px] font-bold" style={{ color: allProven ? EMERALD : AMBER }}>
              {allProven ? 'DONE' : `${Math.min(step + 1, STEPS.length)}/${STEPS.length}`}
            </span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {STEPS.map((s, i) => {
            const done = i < step || (i === STEPS.length - 1 && allProven);
            const active = i === step && !(i === STEPS.length - 1 && allProven);
            const locked = i > step;
            return (
              <div key={s.title} className={`rounded-2xl border transition-all ${
                active ? 'border-amber-400/60 bg-amber-500/[0.06]' : done ? 'border-emerald-400/30 bg-emerald-500/[0.04]' : 'border-white/10 opacity-50'
              }`}>
                <button onClick={() => !locked && setStep(i)} disabled={locked} className="w-full flex items-center gap-3 px-4 py-3 text-left">
                  <span className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-black flex-shrink-0 ${
                    done ? 'bg-emerald-400 text-black' : active ? 'bg-amber-400 text-black' : 'bg-white/10 text-slate-400'
                  }`}>
                    {done ? '✓' : i + 1}
                  </span>
                  <span className={`text-sm font-bold flex-1 ${done ? 'text-emerald-300' : active ? 'text-white' : 'text-slate-400'}`}>{s.title}</span>
                  <span style={{ color: done ? EMERALD : active ? AMBER : '#64748b' }}>{s.icon}</span>
                </button>

                <AnimatePresence initial={false}>
                  {active && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <div className="px-4 pb-4 space-y-3">
                        <div className="rounded-xl bg-black/40 border border-white/10 p-2"><s.Illus /></div>
                        <ol className="space-y-2">
                          {s.subs.map((sub, j) => (
                            <li key={j} className="flex gap-2.5 text-[13px] leading-relaxed text-slate-300">
                              <span className="font-mono text-[10px] font-black pt-0.5 flex-shrink-0" style={{ color: AMBER }}>{i + 1}.{j + 1}</span>
                              {sub}
                            </li>
                          ))}
                        </ol>
                        <p className="text-[11px] italic text-slate-500 border-l-2 pl-3" style={{ borderColor: `${AMBER}66` }}>Why: {s.why}</p>

                        {i === STEPS.length - 1 ? (
                          <div className="rounded-xl border border-white/10 overflow-hidden">
                            <div className="grid grid-cols-5 text-center font-mono text-[10px] uppercase tracking-wider text-slate-500 bg-white/[0.04] py-1.5">
                              <span>x</span><span>y</span><span>D</span><span>B</span><span></span>
                            </div>
                            {TRUTH.map((r, ri) => (
                              <button key={ri} onClick={() => toggleCheck(ri)} className={`w-full grid grid-cols-5 items-center text-center font-mono text-sm py-2 transition-colors ${
                                checks[ri] ? 'bg-emerald-500/10 text-emerald-300' : 'text-slate-300 hover:bg-white/[0.04]'
                              }`}>
                                <span>{r.x}</span><span>{r.y}</span>
                                <span className="font-bold" style={{ color: checks[ri] ? undefined : AMBER }}>{r.d}</span>
                                <span className="font-bold" style={{ color: checks[ri] ? undefined : (r.b ? ROSE : '#64748b') }}>{r.b}</span>
                                <span className="flex justify-center">
                                  {checks[ri] ? <CheckCircle2 size={15} className="text-emerald-400" /> : <Circle size={15} className="text-slate-600" />}
                                </span>
                              </button>
                            ))}
                          </div>
                        ) : (
                          <button onClick={() => setStep(i + 1)} className="w-full py-2.5 rounded-xl font-mono text-[11px] font-black uppercase tracking-widest text-black transition-all active:scale-[0.98]" style={{ background: AMBER }}>
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

          <AnimatePresence>
            {allProven && (
              <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border-2 p-5 text-center" style={{ borderColor: `${EMERALD}66`, background: `${EMERALD}0d` }}>
                <Trophy size={26} className="mx-auto mb-2" style={{ color: EMERALD }} />
                <div className="font-black text-emerald-300">Certified: you built the circuit that subtracts one bit.</div>
                <p className="text-[12px] text-slate-400 mt-2 leading-relaxed">
                  All four rows proven on real, simulated hardware. The Borrow fired in exactly one case - that single
                  asymmetry is the heart of subtraction, and the reason the next module adds a borrow-in.
                </p>
                <div className="mt-4 grid grid-cols-1 gap-2">
                  <button onClick={() => navigate('/dsd/16/circuit')} className="py-2.5 rounded-xl font-mono text-[11px] font-black uppercase tracking-widest text-black" style={{ background: EMERALD }}>
                    Back to the module
                  </button>
                  <button onClick={onClose} className="py-2.5 rounded-xl font-mono text-[11px] font-black uppercase tracking-widest border border-white/15 text-slate-300 hover:border-white/30">
                    Free build - keep tinkering
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="px-5 py-3 border-t border-white/10 flex-shrink-0">
          <button onClick={restart} className="flex items-center gap-2 text-[11px] font-mono text-slate-500 hover:text-slate-300 transition-colors">
            <RotateCcw size={11} /> Restart tutorial
          </button>
        </div>
      </div>
    </div>
  );
};
