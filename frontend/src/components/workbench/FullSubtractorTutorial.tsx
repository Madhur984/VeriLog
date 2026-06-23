import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, CheckCircle2, Circle, ChevronDown, RotateCcw, Compass, ToggleLeft,
  Cpu, Lightbulb, Cable, FlaskConical, Trophy, ChevronUp, ChevronRight,
} from 'lucide-react';

/**
 * Guided build for the FULL SUBTRACTOR (dsd/17, "The Digital Ledger").
 * Built from two half subtractors + an OR: D = x XOR y XOR z,
 * Bout = x'y + x'z + yz. Eight rows to prove.
 */
const AMBER = '#f59e0b';
const CYAN = '#22d3ee';
const ROSE = '#fb7185';
const EMERALD = '#34d399';

const STORE_KEY = 'bfb_wb_fs_tutorial';

interface Saved { step: number; checks: boolean[] }
const EMPTY = [false, false, false, false, false, false, false, false];

function load(): Saved {
  try {
    const raw = JSON.parse(localStorage.getItem(STORE_KEY) || 'null');
    if (raw && typeof raw.step === 'number' && Array.isArray(raw.checks) && raw.checks.length === 8) return raw;
  } catch { /* ignore */ }
  return { step: 0, checks: [...EMPTY] };
}

/** The eight rows of x - y - z (z = borrow-in). Computed, not guessed. */
const TRUTH = [0, 1, 2, 3, 4, 5, 6, 7].map((n) => {
  const x = (n >> 2) & 1, y = (n >> 1) & 1, z = n & 1;
  const d = x ^ y ^ z;
  const b = ((x ^ 1) & y) | ((x ^ 1) & z) | (y & z);
  return { x, y, z, d, b };
});

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
  <svg viewBox="0 0 240 96" className="w-full h-auto">
    {[['x · wallet', AMBER, 8], ['y · bill', CYAN, 40], ['z · debt (Bin)', ROSE, 72]].map(([lbl, col, yy]) => (
      <g key={lbl as string}>
        <rect x={30} y={yy as number} width={30} height={20} rx={4} fill="#0f172a" stroke={col as string} strokeWidth="2" />
        <text x={45} y={(yy as number) + 14} textAnchor="middle" fontSize="10" fontFamily="monospace" fontWeight="bold" fill={col as string}>0</text>
        <text x={70} y={(yy as number) + 14} fontSize="8.5" fontFamily="monospace" fill="#94a3b8">← {lbl}</text>
      </g>
    ))}
  </svg>
);

const IllusGates: React.FC = () => (
  <svg viewBox="0 0 240 100" className="w-full h-auto">
    <rect x={8} y={10} width={86} height={36} rx={6} fill="#0f172a" stroke={AMBER} strokeWidth="1.8" />
    <text x={51} y={26} textAnchor="middle" fontSize="8" fontFamily="monospace" fill={AMBER}>HALF SUB 1</text>
    <text x={51} y={38} textAnchor="middle" fontSize="7" fontFamily="monospace" fill="#94a3b8">XOR + NOT + AND</text>
    <rect x={8} y={54} width={86} height={36} rx={6} fill="#0f172a" stroke={CYAN} strokeWidth="1.8" />
    <text x={51} y={70} textAnchor="middle" fontSize="8" fontFamily="monospace" fill={CYAN}>HALF SUB 2</text>
    <text x={51} y={82} textAnchor="middle" fontSize="7" fontFamily="monospace" fill="#94a3b8">XOR + NOT + AND</text>
    <path d="M 130 38 L 130 66 Q 150 66 162 52 Q 150 38 130 38 Z" fill="#0f172a" stroke={ROSE} strokeWidth="2" />
    <text x={176} y={56} fontSize="8.5" fontFamily="monospace" fill={ROSE}>OR → Bout</text>
    <text x={130} y={20} fontSize="8" fontFamily="monospace" fill="#94a3b8">7 gates total</text>
  </svg>
);

const IllusOutputs: React.FC = () => (
  <svg viewBox="0 0 240 90" className="w-full h-auto">
    <circle cx={50} cy={26} r={13} fill="none" stroke={AMBER} strokeWidth="2" />
    <text x={75} y={30} fontSize="9" fontFamily="monospace" fill={AMBER}>← D · Difference (loose coins)</text>
    <circle cx={50} cy={64} r={13} fill="none" stroke={ROSE} strokeWidth="2" />
    <text x={75} y={68} fontSize="9" fontFamily="monospace" fill={ROSE}>← Bout · overdraft</text>
  </svg>
);

const IllusWiring: React.FC = () => (
  <svg viewBox="0 0 240 120" className="w-full h-auto">
    {[['x', AMBER, 16], ['y', CYAN, 50], ['z', ROSE, 96]].map(([l, c, yy]) => (
      <g key={l as string}>
        <rect x={6} y={(yy as number) - 9} width={20} height={18} rx={3} fill="#0f172a" stroke={c as string} strokeWidth="1.5" />
        <text x={16} y={(yy as number) + 4} textAnchor="middle" fontSize="9" fontFamily="monospace" fill={c as string}>{l}</text>
      </g>
    ))}
    {/* HS1 takes x,y */}
    <line x1={26} y1={16} x2={70} y2={24} stroke={AMBER} strokeWidth="1.8" />
    <line x1={26} y1={50} x2={70} y2={36} stroke={CYAN} strokeWidth="1.8" />
    <rect x={70} y={14} width={52} height={34} rx={5} fill="#0f172a" stroke={AMBER} strokeWidth="1.6" />
    <text x={96} y={34} textAnchor="middle" fontSize="7" fontFamily="monospace" fill={AMBER}>HS 1</text>
    {/* HS1 diff -> HS2; z -> HS2 */}
    <line x1={122} y1={26} x2={150} y2={42} stroke={CYAN} strokeWidth="1.8" />
    <line x1={26} y1={96} x2={150} y2={56} stroke={ROSE} strokeWidth="1.8" />
    <rect x={150} y={34} width={52} height={34} rx={5} fill="#0f172a" stroke={CYAN} strokeWidth="1.6" />
    <text x={176} y={54} textAnchor="middle" fontSize="7" fontFamily="monospace" fill={CYAN}>HS 2</text>
    {/* HS2 diff -> D */}
    <line x1={202} y1={46} x2={222} y2={46} stroke={AMBER} strokeWidth="1.8" />
    <circle cx={230} cy={46} r={7} fill="none" stroke={AMBER} strokeWidth="1.8" />
    {/* borrows -> OR -> Bout */}
    <line x1={122} y1={42} x2={140} y2={96} stroke={ROSE} strokeWidth="1.6" />
    <line x1={202} y1={60} x2={140} y2={100} stroke={ROSE} strokeWidth="1.6" />
    <path d="M 132 90 L 132 108 Q 150 108 160 99 Q 150 90 132 90 Z" fill="#0f172a" stroke={ROSE} strokeWidth="1.8" />
    <line x1={160} y1={99} x2={222} y2={99} stroke={ROSE} strokeWidth="1.8" />
    <circle cx={230} cy={99} r={7} fill="none" stroke={ROSE} strokeWidth="1.8" />
  </svg>
);

interface Step { icon: React.ReactNode; title: string; why: string; subs: string[]; Illus: React.FC }

const STEPS: Step[] = [
  {
    icon: <Compass size={15} />,
    title: 'Know your bench',
    why: 'You already built a half subtractor - now you chain two of them.',
    subs: [
      'The LEFT panel is the parts shelf (Circuit Elements); the dotted grid is your canvas.',
      'Drag empty canvas to pan, scroll to zoom; the RIGHT panel shows the selected part.',
      'This build is bigger, so give yourself room - zoom out a little first.',
    ],
    Illus: IllusBench,
  },
  {
    icon: <ToggleLeft size={15} />,
    title: 'Place the three inputs',
    why: 'x = wallet, y = bill, z = the debt carried in from the previous column.',
    subs: [
      'Drag THREE Input switches onto the left of the canvas, stacked.',
      'Label them x (wallet / minuend), y (bill / subtrahend) and z (borrow-in / old debt).',
      'z is the new piece a half subtractor never had - it is the borrow coming IN.',
    ],
    Illus: IllusInputs,
  },
  {
    icon: <Cpu size={15} />,
    title: 'Place the gates (2 half subs + OR)',
    why: 'Two half subtractors stacked, with an OR to merge their two borrows.',
    subs: [
      'For HALF SUB 1: drop an XOR, a NOT and an AND (top group).',
      'For HALF SUB 2: drop a second XOR, NOT and AND (middle group).',
      'Drop one OR gate on the right - it will combine the two borrow signals.',
      'Seven gates in all. Leave space between the groups for wires.',
    ],
    Illus: IllusGates,
  },
  {
    icon: <Lightbulb size={15} />,
    title: 'Place the outputs (D and Bout)',
    why: 'The loose-coins lamp and the overdraft lamp.',
    subs: [
      'Drag two Output elements to the right: D (Difference) on top, Bout (Borrow-out) below.',
    ],
    Illus: IllusOutputs,
  },
  {
    icon: <Cable size={15} />,
    title: 'Wire the two stages',
    why: 'The second half subtractor subtracts z from the first stage\'s difference.',
    subs: [
      'HALF SUB 1: wire x and y into XOR-1 (gives x XOR y) and into NOT-1 + AND-1 (gives borrow b1).',
      'HALF SUB 2: wire (x XOR y) and z into XOR-2 -> that output is D. Wire them through NOT-2 + AND-2 -> borrow b2.',
      'Wire b1 and b2 into the OR gate; the OR output is Bout.',
      'Finally wire XOR-2 to the D lamp and the OR to the Bout lamp.',
    ],
    Illus: IllusWiring,
  },
  {
    icon: <FlaskConical size={15} />,
    title: 'Prove all eight rows',
    why: 'Three inputs means eight combinations - every one must match the live lamps.',
    subs: [
      'Click x, y and z to walk through all eight combinations below.',
      'Watch D and Bout, and tick each row when the hardware agrees.',
      'D follows an odd-count rule (parity); Bout fires whenever the demands beat the wallet.',
    ],
    Illus: IllusWiring,
  },
];

export const FullSubtractorTutorial: React.FC<{ onClose: () => void; onMinimize?: () => void }> = ({ onClose, onMinimize }) => {
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
  const restart = () => setState({ step: 0, checks: [...EMPTY] });

  const allProven = checks.every(Boolean);
  const progress = allProven ? 100 : Math.round(((step + checks.filter(Boolean).length / 8) / STEPS.length) * 100);

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
                Guided build · Full Subtractor
              </div>
              <div className="mt-1 text-[11px] text-slate-400">
                Two half subtractors and an OR. Nothing here can break - experiment freely.
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
                            <div className="grid grid-cols-6 text-center font-mono text-[10px] uppercase tracking-wider text-slate-500 bg-white/[0.04] py-1.5">
                              <span>x</span><span>y</span><span>z</span><span>D</span><span>Bo</span><span></span>
                            </div>
                            {TRUTH.map((r, ri) => (
                              <button key={ri} onClick={() => toggleCheck(ri)} className={`w-full grid grid-cols-6 items-center text-center font-mono text-[13px] py-2 transition-colors ${
                                checks[ri] ? 'bg-emerald-500/10 text-emerald-300' : 'text-slate-300 hover:bg-white/[0.04]'
                              }`}>
                                <span>{r.x}</span><span>{r.y}</span><span>{r.z}</span>
                                <span className="font-bold" style={{ color: checks[ri] ? undefined : AMBER }}>{r.d}</span>
                                <span className="font-bold" style={{ color: checks[ri] ? undefined : (r.b ? ROSE : '#64748b') }}>{r.b}</span>
                                <span className="flex justify-center">
                                  {checks[ri] ? <CheckCircle2 size={14} className="text-emerald-400" /> : <Circle size={14} className="text-slate-600" />}
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
                <div className="font-black text-emerald-300">Certified: you built a full subtractor.</div>
                <p className="text-[12px] text-slate-400 mt-2 leading-relaxed">
                  All eight rows proven on real hardware. Chain one of these per bit and you can subtract numbers of any
                  width - the borrow-out of each column becomes the borrow-in of the next.
                </p>
                <div className="mt-4 grid grid-cols-1 gap-2">
                  <button onClick={() => navigate('/dsd/17/circuit')} className="py-2.5 rounded-xl font-mono text-[11px] font-black uppercase tracking-widest text-black" style={{ background: EMERALD }}>
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
