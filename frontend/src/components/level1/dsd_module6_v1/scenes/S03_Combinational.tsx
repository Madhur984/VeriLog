import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Cpu, MousePointerClick, Ghost, Zap, Hash, ListOrdered, Timer } from 'lucide-react';

interface Props { isDarkMode: boolean; }
type Bit = 0 | 1;
interface Combo { a: Bit; b: Bit; c: Bit; y: Bit; }

const CYAN = '#22d3ee';
const AMBER = '#fbbf24';
const ROSE = '#f43f5e';

const yOf = (a: Bit, b: Bit, c: Bit): Bit => (((a && b) || c) ? 1 : 0);

export const S03_Combinational: React.FC<Props> = ({ isDarkMode }) => {
  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText   = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg    = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';
  const idle      = isDarkMode ? '#475569' : '#cbd5e1';
  const boxFill   = isDarkMode ? '#0a0e1a' : '#ffffff';

  const [a, setA] = useState<Bit>(1);
  const [b, setB] = useState<Bit>(0);
  const [c, setC] = useState<Bit>(0);
  const [history, setHistory] = useState<Combo[]>([]);

  const andOut: Bit = (a && b) ? 1 : 0;
  const out: Bit = yOf(a, b, c);

  const toggle = (k: 'a' | 'b' | 'c') => {
    setHistory(h => [{ a, b, c, y: out }, ...h].slice(0, 3));
    if (k === 'a') setA(v => (v ? 0 : 1));
    if (k === 'b') setB(v => (v ? 0 : 1));
    if (k === 'c') setC(v => (v ? 0 : 1));
  };

  const wire = (v: Bit) => (v ? CYAN : idle);
  const glow = (v: Bit) => (v ? `drop-shadow(0 0 5px ${CYAN})` : 'none');

  const switches = [
    { k: 'a' as const, label: 'A', v: a, y: 60 },
    { k: 'b' as const, label: 'B', v: b, y: 130 },
    { k: 'c' as const, label: 'C', v: c, y: 200 },
  ];

  const currentRow = a * 4 + b * 2 + c;
  const fadeBy = [0.6, 0.4, 0.25];

  return (
    <div className="max-w-6xl mx-auto space-y-12 py-4">
      <section className="space-y-3">
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.4em] uppercase text-cyan-400">
          <Cpu size={14} /> Chapter 03 · Prisoners of the Present
        </div>
        <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>
          The machine that lives in the moment.
        </h2>
        <p className={`text-base max-w-3xl ${subText}`}>
          Three switches in, one lamp out. Flip anything and the lamp answers instantly,
          using only what the switches say right now.
        </p>
      </section>

      <div className="grid lg:grid-cols-[1.6fr_1fr] gap-6 items-stretch">
        {/* ── the F(inputs) machine ── */}
        <motion.div
          initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
          className={`p-6 md:p-8 rounded-3xl border ${cardBg} flex flex-col gap-4`}
        >
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center px-4 py-1.5 rounded-full border-2 font-mono text-xs font-black"
                  style={{ borderColor: `${AMBER}77`, color: AMBER, background: `${AMBER}10` }}>
              Output = F(present inputs)
            </span>
            <span className="inline-flex items-center px-4 py-1.5 rounded-full border font-mono text-xs"
                  style={{ borderColor: `${CYAN}55`, color: CYAN, background: `${CYAN}10` }}>
              Y = (A·B) + C
            </span>
          </div>

          <svg viewBox="0 0 640 260" className="w-full h-auto">
            {/* switches · clickable */}
            {switches.map(s => (
              <g key={s.k} onClick={() => toggle(s.k)} style={{ cursor: 'pointer' }}>
                <text x="16" y={s.y + 4} fontSize="13" fontFamily="monospace" fontWeight="bold" fill={CYAN}>{s.label}</text>
                <rect x="28" y={s.y - 10} width="42" height="20" rx="10"
                      fill={s.v ? `${CYAN}33` : 'none'} stroke={s.v ? CYAN : idle} strokeWidth="2" />
                <motion.circle
                  animate={{ cx: s.v ? 61 : 37, fill: s.v ? CYAN : idle }}
                  cy={s.y} r="7"
                  style={{ filter: s.v ? `drop-shadow(0 0 6px ${CYAN})` : 'none' }}
                />
              </g>
            ))}

            {/* logic network box */}
            <rect x="190" y="40" width="240" height="200" rx="14" fill={boxFill} stroke={`${CYAN}88`} strokeWidth="2" />
            <text x="310" y="58" textAnchor="middle" fontSize="10" fontFamily="monospace" fontWeight="bold" fill={CYAN} letterSpacing="3">
              LOGIC NETWORK
            </text>
            <text x="310" y="232" textAnchor="middle" fontSize="8" fontFamily="monospace" fill={idle}>
              gates only · no storage inside
            </text>

            {/* input wires */}
            <polyline points="74,60 214,60 214,82 238,82" fill="none" stroke={wire(a)} strokeWidth="2.5" style={{ filter: glow(a) }} />
            <polyline points="74,130 214,130 214,106 238,106" fill="none" stroke={wire(b)} strokeWidth="2.5" style={{ filter: glow(b) }} />
            <polyline points="74,200 312,200 312,156 336,156" fill="none" stroke={wire(c)} strokeWidth="2.5" style={{ filter: glow(c) }} />

            {/* AND gate · A, B */}
            <path d="M 238 70 L 262 70 A 24 24 0 0 1 262 118 L 238 118 Z"
                  fill={boxFill} stroke={CYAN} strokeWidth="2" />
            <text x="252" y="98" fontSize="8" fontFamily="monospace" fill={CYAN}>AND</text>
            <polyline points="286,94 312,94 312,124 336,124" fill="none" stroke={wire(andOut)} strokeWidth="2.5" style={{ filter: glow(andOut) }} />

            {/* OR gate · (A·B), C */}
            <path d="M 330 112 Q 342 140 330 168 Q 372 162 398 140 Q 372 118 330 112 Z"
                  fill={boxFill} stroke={CYAN} strokeWidth="2" />
            <text x="346" y="144" fontSize="8" fontFamily="monospace" fill={CYAN}>OR</text>

            {/* output wire + lamp */}
            <line x1="398" y1="140" x2="568" y2="140" stroke={wire(out)} strokeWidth="3" style={{ filter: glow(out) }} />
            <circle cx="588" cy="140" r="18" fill={out ? CYAN : 'none'} stroke={CYAN} strokeWidth="2.5"
                    style={{ filter: out ? `drop-shadow(0 0 16px ${CYAN})` : 'none' }} />
            <text x="588" y="145" textAnchor="middle" fontSize="12" fontFamily="monospace" fontWeight="bold"
                  fill={out ? '#000' : CYAN}>{out}</text>
            <text x="588" y="178" textAnchor="middle" fontSize="9" fontFamily="monospace" fill={CYAN} opacity="0.7">
              Y = {out}
            </text>
          </svg>

          <div className={`flex items-center gap-2 text-xs font-mono ${subText}`}>
            <MousePointerClick size={12} /> Flip the switches · in the drawing or with the pads below
          </div>
          <div className="flex gap-3 flex-wrap">
            {switches.map(s => (
              <button
                key={s.k}
                onClick={() => toggle(s.k)}
                className="px-5 py-3 rounded-xl border-2 font-mono font-black transition-all flex flex-col items-start gap-0.5 min-w-[100px] active:scale-95"
                style={{
                  borderColor: CYAN,
                  color: s.v ? '#000' : CYAN,
                  backgroundColor: s.v ? CYAN : 'transparent',
                  boxShadow: s.v ? `0 0 20px ${CYAN}55` : 'none',
                }}
              >
                <span className="text-[9px] uppercase tracking-widest opacity-80">Input</span>
                <span className="text-base">{s.label} = {s.v}</span>
              </button>
            ))}
          </div>

          <div className="flex gap-2 flex-wrap font-mono text-xs mt-auto">
            <span className="px-3 py-1.5 rounded-lg border" style={{ borderColor: `${CYAN}44`, color: andOut ? CYAN : undefined }}>
              <span className={andOut ? '' : subText}>A·B = {andOut}</span>
            </span>
            <span className="px-3 py-1.5 rounded-lg border font-black"
                  style={{ borderColor: out ? '#34d399' : `${CYAN}44`, color: out ? '#34d399' : undefined }}>
              <span className={out ? '' : subText}>(A·B) + C = {out}</span>
            </span>
          </div>
        </motion.div>

        {/* ── live truth table ── */}
        <motion.div
          initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}
          className={`p-6 md:p-8 rounded-3xl border ${cardBg}`}
        >
          <div className="font-mono text-[10px] uppercase tracking-widest mb-3" style={{ color: CYAN }}>
            Live truth · all 8 combos
          </div>
          <div className="grid grid-cols-4 gap-1 font-mono text-sm">
            <div className="px-2 py-1.5 text-center font-black" style={{ color: CYAN }}>A</div>
            <div className="px-2 py-1.5 text-center font-black" style={{ color: CYAN }}>B</div>
            <div className="px-2 py-1.5 text-center font-black" style={{ color: CYAN }}>C</div>
            <div className="px-2 py-1.5 text-center font-black text-emerald-300">Y</div>
            {Array.from({ length: 8 }, (_, i) => {
              const ra = ((i >> 2) & 1) as Bit;
              const rb = ((i >> 1) & 1) as Bit;
              const rc = (i & 1) as Bit;
              const ry = yOf(ra, rb, rc);
              const isCurrent = i === currentRow;
              return (
                <React.Fragment key={i}>
                  <motion.div animate={{ background: isCurrent ? `${CYAN}33` : 'transparent', scale: isCurrent ? 1.04 : 1 }}
                              className={`px-2 py-1.5 text-center rounded-l ${ra ? textColor : 'opacity-50'}`}>{ra}</motion.div>
                  <motion.div animate={{ background: isCurrent ? `${CYAN}33` : 'transparent', scale: isCurrent ? 1.04 : 1 }}
                              className={`px-2 py-1.5 text-center ${rb ? textColor : 'opacity-50'}`}>{rb}</motion.div>
                  <motion.div animate={{ background: isCurrent ? `${CYAN}33` : 'transparent', scale: isCurrent ? 1.04 : 1 }}
                              className={`px-2 py-1.5 text-center ${rc ? textColor : 'opacity-50'}`}>{rc}</motion.div>
                  <motion.div animate={{ background: isCurrent ? `${CYAN}33` : 'transparent', scale: isCurrent ? 1.04 : 1 }}
                              className={`px-2 py-1.5 text-center rounded-r font-black ${ry ? 'text-emerald-300' : 'opacity-50'}`}>{ry}</motion.div>
                </React.Fragment>
              );
            })}
          </div>
          <p className={`text-xs ${subText} mt-4`}>
            One row is lit: the present. The other seven do not exist for this circuit.
          </p>
        </motion.div>
      </div>

      {/* ── standard theory · the numbers behind it ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className={`p-6 md:p-8 rounded-3xl border ${cardBg}`}
      >
        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest mb-4" style={{ color: CYAN }}>
          <Hash size={13} /> Standard theory · the numbers behind it
        </div>

        <div className="grid md:grid-cols-[1.6fr_1fr] gap-6 items-start">
          <div className="space-y-3">
            <p className={`text-sm leading-relaxed ${subText}`}>
              A combinational circuit with <span className={`font-mono font-bold ${textColor}`}>n</span> inputs
              has exactly <span className={`font-mono font-bold ${textColor}`}>2ⁿ</span> possible input
              combinations - n = 2 gives 4, n = 3 gives 8, n = 4 gives 16. Its complete behaviour fits in one
              truth table with 2ⁿ rows, and each row has exactly one fixed output.
            </p>
            <p className={`text-sm leading-relaxed ${subText}`}>
              That is why a combinational circuit can always be fully described by a truth table or by a
              Boolean expression - the two are just different ways of writing the same fixed mapping from
              inputs to outputs.
            </p>
            <div className="flex flex-col gap-2 pt-1">
              <div className="flex items-start gap-2">
                <span className="px-2.5 py-0.5 rounded-full border font-mono text-[10px] whitespace-nowrap"
                      style={{ borderColor: `${CYAN}55`, color: CYAN, background: `${CYAN}10` }}>
                  truth table
                </span>
                <span className={`text-xs ${subText}`}>a list of every input combination together with the output the circuit must give for it.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="px-2.5 py-0.5 rounded-full border font-mono text-[10px] whitespace-nowrap"
                      style={{ borderColor: `${CYAN}55`, color: CYAN, background: `${CYAN}10` }}>
                  Boolean expression
                </span>
                <span className={`text-xs ${subText}`}>a formula built from AND, OR and NOT, like Y = (A·B) + C above.</span>
              </div>
            </div>
          </div>

          <div className={`p-4 rounded-2xl border font-mono ${isDarkMode ? 'border-white/15' : 'border-slate-300'}`}>
            <div className="text-[9px] uppercase tracking-widest mb-2" style={{ color: CYAN }}>
              n inputs → 2ⁿ rows
            </div>
            <div className="grid grid-cols-2 gap-1 text-sm">
              <div className="px-2 py-1.5 text-center font-black" style={{ color: CYAN }}>n</div>
              <div className="px-2 py-1.5 text-center font-black" style={{ color: CYAN }}>2ⁿ</div>
              {[[1, 2], [2, 4], [3, 8], [4, 16]].map(([nn, rows]) => {
                const isThis = nn === 3;
                return (
                  <React.Fragment key={nn}>
                    <div className={`px-2 py-1.5 text-center rounded-l ${textColor} ${isThis ? '' : 'opacity-50'}`}
                         style={{ background: isThis ? `${CYAN}33` : 'transparent' }}>{nn}</div>
                    <div className={`px-2 py-1.5 text-center rounded-r font-black ${textColor} ${isThis ? '' : 'opacity-50'}`}
                         style={{ background: isThis ? `${CYAN}33` : 'transparent' }}>{rows}</div>
                  </React.Fragment>
                );
              })}
            </div>
            <p className={`text-[10px] mt-2 ${subText}`}>
              This machine has 3 inputs, so its whole life is the 8-row table on the right.
            </p>
          </div>
        </div>
      </motion.div>

      {/* ── history ghost panel ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className={`p-6 md:p-8 rounded-3xl border ${cardBg}`}
      >
        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest mb-4" style={{ color: ROSE }}>
          <Ghost size={13} /> History check · what does it remember?
        </div>

        <div className="relative">
          <div className="grid sm:grid-cols-3 gap-3">
            {[0, 1, 2].map(i => {
              const h = history[i];
              return (
                <div
                  key={i}
                  className={`p-4 rounded-2xl border font-mono ${isDarkMode ? 'border-white/15' : 'border-slate-300'}`}
                  style={{ opacity: fadeBy[i] }}
                >
                  <div className={`text-[9px] uppercase tracking-widest mb-1 ${subText}`}>
                    {i === 0 ? '1 flip ago' : `${i + 1} flips ago`}
                  </div>
                  <div className={`text-sm font-bold ${textColor}`}>
                    {h ? `A=${h.a} B=${h.b} C=${h.c} → Y=${h.y}` : 'nothing yet'}
                  </div>
                </div>
              );
            })}
          </div>

          {/* the stamp */}
          <div className="absolute inset-0 grid place-items-center pointer-events-none">
            <motion.div
              key={history.length > 0 ? history[0].a * 4 + history[0].b * 2 + history[0].c + 1 : 0}
              initial={{ scale: 1.25, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.25 }}
              className="px-6 py-2 border-4 rounded-xl font-black text-2xl md:text-3xl tracking-[0.2em] -rotate-6"
              style={{
                borderColor: ROSE,
                color: ROSE,
                background: isDarkMode ? 'rgba(2,6,23,0.55)' : 'rgba(255,255,255,0.7)',
              }}
            >
              NO MEMORY
            </motion.div>
          </div>
        </div>

        <p className={`text-xs ${subText} mt-4 max-w-3xl`}>
          This list lives on your screen only. Inside the circuit there is no place to keep it.
          The moment a switch flips, the old combo is gone for good.
        </p>
      </motion.div>

      {/* ── standard theory · how engineers design one ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className={`p-6 md:p-8 rounded-3xl border ${cardBg}`}
      >
        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest mb-2" style={{ color: AMBER }}>
          <ListOrdered size={13} /> Standard theory · how engineers design one
        </div>
        <p className={`text-sm ${subText} mb-4 max-w-3xl`}>
          Every combinational circuit, from this little lamp to the adder inside a CPU, is built by the
          same four-step recipe.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            {
              n: 1,
              title: 'Specification',
              body: 'Say in plain words what the circuit must do. Here: "light the lamp when A and B are both on, or when C is on."',
            },
            {
              n: 2,
              title: 'Truth table',
              body: 'Write the required output for every one of the 2ⁿ input combinations. Nothing may be left undecided.',
            },
            {
              n: 3,
              title: 'Simplify',
              body: 'Use Boolean algebra or a K-map (Karnaugh map, a grid method for shrinking expressions) - the skills from the earlier modules.',
            },
            {
              n: 4,
              title: 'Draw and wire',
              body: 'Turn the simplified expression into gates and connect them. The drawing above is exactly this step for Y = (A·B) + C.',
            },
          ].map(step => (
            <div
              key={step.n}
              className={`p-4 rounded-2xl border ${isDarkMode ? 'border-white/15' : 'border-slate-300'}`}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="w-6 h-6 grid place-items-center rounded-full border-2 font-mono text-xs font-black"
                      style={{ borderColor: AMBER, color: AMBER }}>
                  {step.n}
                </span>
                <span className={`font-mono text-xs font-black uppercase tracking-widest ${textColor}`}>
                  {step.title}
                </span>
              </div>
              <p className={`text-xs leading-relaxed ${subText}`}>{step.body}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── the one caption that matters ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="p-5 rounded-2xl border-2 flex items-center gap-3"
        style={{ borderColor: `${CYAN}55`, background: `${CYAN}10` }}
      >
        <Zap size={20} style={{ color: CYAN }} className="flex-shrink-0" />
        <p className={`text-sm md:text-base font-bold ${textColor}`}>
          The exact moment an input changes, the output follows. Nothing is stored.
        </p>
      </motion.div>

      {/* ── standard theory · almost instant, not instant ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="p-5 md:p-6 rounded-2xl border-2"
        style={{ borderColor: `${AMBER}55`, background: `${AMBER}10` }}
      >
        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest mb-2" style={{ color: AMBER }}>
          <Timer size={13} /> Standard theory · almost instant, not instant
        </div>
        <p className={`text-sm leading-relaxed ${subText} max-w-3xl`}>
          The fine print on "instantly": each gate needs a tiny time to respond, called its
          <span className={`font-bold ${textColor}`}> propagation delay</span> - typically a fraction of a
          nanosecond, where one nanosecond is 10⁻⁹ seconds. The output only settles after the signal has
          crossed the slowest chain of gates from an input to the output. So "combinational" means no
          memory and no clock input of its own - the logic settles between the ticks of the system
          clock; it does not mean zero time.
        </p>
      </motion.div>
    </div>
  );
};
