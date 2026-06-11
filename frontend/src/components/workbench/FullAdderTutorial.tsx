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

const STORE_KEY = 'bfb_wb_fa_tutorial';

interface Saved { step: number; checks: boolean[] }

function load(): Saved {
  try {
    const raw = JSON.parse(localStorage.getItem(STORE_KEY) || 'null');
    if (raw && typeof raw.step === 'number' && Array.isArray(raw.checks) && raw.checks.length === 8) return raw;
  } catch { /* ignore */ }
  return { step: 0, checks: Array(8).fill(false) };
}

/** The eight rows the learner must prove on the live circuit. */
const TRUTH = [
  { a: 0, b: 0, cin: 0, sum: 0, cout: 0 },
  { a: 0, b: 0, cin: 1, sum: 1, cout: 0 },
  { a: 0, b: 1, cin: 0, sum: 1, cout: 0 },
  { a: 0, b: 1, cin: 1, sum: 0, cout: 1 },
  { a: 1, b: 0, cin: 0, sum: 1, cout: 0 },
  { a: 1, b: 0, cin: 1, sum: 0, cout: 1 },
  { a: 1, b: 1, cin: 0, sum: 0, cout: 1 },
  { a: 1, b: 1, cin: 1, sum: 1, cout: 1 },
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
  <svg viewBox="0 0 240 110" className="w-full h-auto">
    {(['A', 'B', 'Cin'] as const).map((l, i) => (
      <g key={l}>
        <rect x={30} y={8 + i * 34} width={34} height={26} rx={4} fill="#0f172a" stroke={AMBER} strokeWidth="2" />
        <text x={47} y={25 + i * 34} textAnchor="middle" fontSize="11" fontFamily="monospace" fontWeight="bold" fill={AMBER}>0</text>
        <text x={75} y={25 + i * 34} fontSize="9" fontFamily="monospace" fill="#94a3b8">
          ← {l}{l === 'Cin' ? ' (the carry-in!)' : ' (click to flip)'}
        </text>
      </g>
    ))}
  </svg>
);

const IllusGates: React.FC = () => (
  <svg viewBox="0 0 240 130" className="w-full h-auto">
    {/* XOR pair */}
    <path d="M 28 10 Q 38 24 28 38 Q 50 38 64 24 Q 50 10 28 10 Z" fill="#0f172a" stroke={CYAN} strokeWidth="2" />
    <path d="M 23 10 Q 33 24 23 38" fill="none" stroke={CYAN} strokeWidth="2" />
    <path d="M 28 48 Q 38 62 28 76 Q 50 76 64 62 Q 50 48 28 48 Z" fill="#0f172a" stroke={CYAN} strokeWidth="2" />
    <path d="M 23 48 Q 33 62 23 76" fill="none" stroke={CYAN} strokeWidth="2" />
    <text x={76} y={28} fontSize="9" fontFamily="monospace" fill={CYAN}>2 x XOR · the sum chain</text>
    {/* AND pair */}
    <path d="M 28 86 L 28 112 L 40 112 Q 58 112 58 99 Q 58 86 40 86 Z" fill="#0f172a" stroke={AMBER} strokeWidth="2" />
    <text x={70} y={103} fontSize="9" fontFamily="monospace" fill={AMBER}>2 x AND · the carry watchers</text>
    {/* OR */}
    <path d="M 160 86 Q 170 99 160 112 Q 182 112 196 99 Q 182 86 160 86 Z" fill="#0f172a" stroke={VIOLET} strokeWidth="2" />
    <text x={204} y={103} fontSize="9" fontFamily="monospace" fill={VIOLET}>1 x OR</text>
    <text x={160} y={66} fontSize="8" fontFamily="monospace" fill="#94a3b8">the OR merges the two carries</text>
  </svg>
);

const IllusOutputs: React.FC = () => (
  <svg viewBox="0 0 240 90" className="w-full h-auto">
    <circle cx={50} cy={26} r={13} fill="none" stroke={CYAN} strokeWidth="2" />
    <text x={75} y={30} fontSize="9" fontFamily="monospace" fill={CYAN}>← Sum lamp (from XOR #2)</text>
    <circle cx={50} cy={64} r={13} fill="none" stroke={AMBER} strokeWidth="2" />
    <text x={75} y={68} fontSize="9" fontFamily="monospace" fill={AMBER}>← Cout lamp (from the OR)</text>
  </svg>
);

const IllusWiring: React.FC = () => (
  <svg viewBox="0 0 250 140" className="w-full h-auto">
    {/* inputs */}
    {([['A', 16], ['B', 50], ['Cin', 108]] as const).map(([l, y]) => (
      <g key={l}>
        <rect x={4} y={y} width={26} height={16} rx={3} fill="#0f172a" stroke={AMBER} strokeWidth="1.5" />
        <text x={17} y={y + 12} textAnchor="middle" fontSize="8" fontFamily="monospace" fill={AMBER}>{l}</text>
      </g>
    ))}
    {/* XOR1 + AND1 (HA1) */}
    <path d="M 56 12 Q 64 26 56 40 Q 74 40 86 26 Q 74 12 56 12 Z" fill="#0f172a" stroke={CYAN} strokeWidth="1.8" />
    <path d="M 56 48 L 56 76 L 66 76 Q 82 76 82 62 Q 82 48 66 48 Z" fill="#0f172a" stroke={AMBER} strokeWidth="1.8" />
    {/* wires A,B fan into both */}
    <line x1={30} y1={20} x2={56} y2={20} stroke={CYAN} strokeWidth="1.5" />
    <line x1={30} y1={58} x2={56} y2={32} stroke={CYAN} strokeWidth="1.5" />
    <line x1={42} y1={20} x2={42} y2={56} stroke={AMBER} strokeWidth="1.5" />
    <line x1={42} y1={56} x2={56} y2={56} stroke={AMBER} strokeWidth="1.5" />
    <line x1={36} y1={58} x2={36} y2={68} stroke={AMBER} strokeWidth="1.5" />
    <line x1={36} y1={68} x2={56} y2={68} stroke={AMBER} strokeWidth="1.5" />
    {/* XOR2 + AND2 (HA2) */}
    <path d="M 120 60 Q 128 74 120 88 Q 138 88 150 74 Q 138 60 120 60 Z" fill="#0f172a" stroke={CYAN} strokeWidth="1.8" />
    <path d="M 120 96 L 120 124 L 130 124 Q 146 124 146 110 Q 146 96 130 96 Z" fill="#0f172a" stroke={AMBER} strokeWidth="1.8" />
    {/* P from XOR1 into XOR2/AND2, Cin into both */}
    <polyline points="86,26 104,26 104,68 120,68" fill="none" stroke={CYAN} strokeWidth="1.5" />
    <line x1={104} y1={68} x2={104} y2={104} stroke={CYAN} strokeWidth="1.5" />
    <line x1={104} y1={104} x2={120} y2={104} stroke={CYAN} strokeWidth="1.5" />
    <polyline points="30,116 112,116 112,80 120,80" fill="none" stroke={AMBER} strokeWidth="1.5" />
    <line x1={112} y1={116} x2={120} y2={116} stroke={AMBER} strokeWidth="1.5" />
    {/* OR merging the carries */}
    <path d="M 178 88 Q 186 100 178 112 Q 196 112 208 100 Q 196 88 178 88 Z" fill="#0f172a" stroke={VIOLET} strokeWidth="1.8" />
    <polyline points="82,62 160,62 160,94 178,94" fill="none" stroke={VIOLET} strokeWidth="1.5" />
    <line x1={146} y1={110} x2={178} y2={106} stroke={VIOLET} strokeWidth="1.5" />
    {/* lamps */}
    <line x1={150} y1={74} x2={222} y2={40} stroke={CYAN} strokeWidth="1.5" />
    <circle cx={232} cy={36} r={8} fill="none" stroke={CYAN} strokeWidth="1.8" />
    <text x={232} y={22} textAnchor="middle" fontSize="7" fontFamily="monospace" fill={CYAN}>S</text>
    <line x1={208} y1={100} x2={222} y2={100} stroke={VIOLET} strokeWidth="1.5" />
    <circle cx={232} cy={100} r={8} fill="none" stroke={VIOLET} strokeWidth="1.8" />
    <text x={232} y={124} textAnchor="middle" fontSize="7" fontFamily="monospace" fill={VIOLET}>Cout</text>
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
    why: 'Every lab starts with knowing where the parts live.',
    subs: [
      'The panel on the LEFT is the parts shelf - it is labeled Circuit Elements.',
      'The big dotted grid is your canvas. Drag empty canvas to pan, scroll to zoom.',
      'The RIGHT panel shows properties of whatever you select.',
      'If you built the half adder here before, this is the same bench - just a bigger machine today.',
    ],
    Illus: IllusBench,
  },
  {
    icon: <ToggleLeft size={15} />,
    title: 'Place THREE inputs',
    why: 'The third switch is the whole point: Cin is the wire the half adder never had.',
    subs: [
      'Open the Input drawer and drag an Input element onto the canvas.',
      'Place THREE of them on the left side, stacked: A on top, B below it, Cin at the bottom.',
      'Each is a clickable bit switch showing 0 or 1.',
      'Tip: select each one and label it in the right panel - with three inputs, labels stop mix-ups.',
    ],
    Illus: IllusInputs,
  },
  {
    icon: <Cpu size={15} />,
    title: 'Place the five gates',
    why: 'Two XOR + two AND make the two half adders; the OR referees their carries.',
    subs: [
      'From the Gates drawer drag TWO XOR Gates: one mid-left (stage 1), one mid-right (stage 2).',
      'Drag TWO AND Gates, one under each XOR - each XOR + AND pair is one half adder.',
      'Drag ONE OR Gate to the far right, between the two AND gates\' heights.',
      'Five gates total. That is the entire full adder.',
    ],
    Illus: IllusGates,
  },
  {
    icon: <Lightbulb size={15} />,
    title: 'Place the outputs',
    why: 'Sum and Carry-out - the same two-wire answer, now fed by a three-wire question.',
    subs: [
      'From the Output drawer drag two Output elements to the right edge.',
      'The top one is Sum (it will come from the second XOR).',
      'The bottom one is Cout (it will come from the OR gate).',
    ],
    Illus: IllusOutputs,
  },
  {
    icon: <Cable size={15} />,
    title: 'Wire the two stages',
    why: 'Stage 1 adds A+B. Stage 2 adds Cin to that. The OR catches a carry from EITHER stage.',
    subs: [
      'Stage 1: wire A and B into BOTH the first XOR and the first AND (4 wires).',
      'Stage 2: wire the first XOR\'s output into BOTH the second XOR and the second AND (2 wires).',
      'Wire Cin into BOTH the second XOR and the second AND (2 wires).',
      'Carries: wire both AND outputs into the OR gate (2 wires).',
      'Outputs: second XOR → Sum lamp, OR → Cout lamp (2 wires). Twelve wires total.',
    ],
    Illus: IllusWiring,
  },
  {
    icon: <FlaskConical size={15} />,
    title: 'Prove all eight rows',
    why: 'Three inputs means eight cases. Sum lights on odd counts; Cout lights when any two agree.',
    subs: [
      'Click the three Input switches to set each combination below.',
      'Watch the lamps. When the live circuit matches a row, tick it off.',
      'Sanity anchors: 0+0+0 keeps both lamps dark, 1+1+1 lights BOTH (one and one is eleven... in binary: 11).',
    ],
    Illus: IllusWiring,
  },
];

/* ── the rail ────────────────────────────────────────────────── */

export const FullAdderTutorial: React.FC<{ onClose: () => void; onMinimize?: () => void }> = ({ onClose, onMinimize }) => {
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
  const restart = () => setState({ step: 0, checks: Array(8).fill(false) });

  const allProven = checks.every(Boolean);
  const progress = allProven ? 100 : Math.round(((step + checks.filter(Boolean).length / 8) / STEPS.length) * 100);

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
                Guided build · Full Adder
              </div>
              <div className="mt-1 text-[11px] text-slate-400">
                Three switches in, two lamps out, five gates between. Nothing here can break - experiment freely.
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

                        {/* truth-table checklist on the final step */}
                        {i === STEPS.length - 1 ? (
                          <div className="rounded-xl border border-white/10 overflow-hidden">
                            <div className="grid grid-cols-6 text-center font-mono text-[10px] uppercase tracking-wider text-slate-500 bg-white/[0.04] py-1.5">
                              <span>A</span><span>B</span><span>Cin</span><span>Sum</span><span>Cout</span><span></span>
                            </div>
                            {TRUTH.map((r, ri) => (
                              <button key={ri} onClick={() => toggleCheck(ri)}
                                      className={`w-full grid grid-cols-6 items-center text-center font-mono text-sm py-2 transition-colors ${
                                        checks[ri] ? 'bg-emerald-500/10 text-emerald-300' : 'text-slate-300 hover:bg-white/[0.04]'
                                      }`}>
                                <span>{r.a}</span><span>{r.b}</span><span>{r.cin}</span>
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
                <div className="font-black text-emerald-300">Certified: you built the circuit that finishes the job.</div>
                <p className="text-[12px] text-slate-400 mt-2 leading-relaxed">
                  All eight rows proven on real, simulated hardware. Chain the Cout of this block
                  into the Cin of the next and you have a multi-bit adder - the exact pattern
                  repeated 64 times inside every modern CPU.
                </p>
                <div className="mt-4 grid grid-cols-1 gap-2">
                  <button onClick={() => navigate('/dsd/8/build')}
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
