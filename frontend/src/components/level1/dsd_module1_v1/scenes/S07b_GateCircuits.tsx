import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Cpu, Zap, ToggleRight } from 'lucide-react';

interface Props { isActive: boolean; isDarkMode: boolean; }

// Ben's picnic logic: F = 1 iff at most one bad condition
const benRule = (R: number, A: number, W: number) => (R + A + W) <= 1 ? 1 : 0;

// Helper colors for wire signals
const wireColor = (v: number) => v ? '#10b981' : '#475569';
const wireGlow  = (v: number) => v ? 'drop-shadow(0 0 4px #10b98199)' : 'none';

// AND gate SVG (D-shape with flat back and rounded front)
const AndGate: React.FC<{ x: number; y: number; out: number; label?: string }> = ({ x, y, out, label }) => (
  <g transform={`translate(${x} ${y})`}>
    <path
      d="M 0 0 L 18 0 A 18 18 0 0 1 18 36 L 0 36 Z"
      fill="rgba(16,185,129,0.08)"
      stroke={wireColor(out)}
      strokeWidth="1.6"
      style={{ filter: wireGlow(out) }}
    />
    {label && <text x="9" y="22" fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle" fill={wireColor(out)}>&amp;</text>}
  </g>
);

// OR gate SVG (curved back, pointed front)
const OrGate: React.FC<{ x: number; y: number; out: number }> = ({ x, y, out }) => (
  <g transform={`translate(${x} ${y})`}>
    <path
      d="M 0 0 Q 8 18 0 36 Q 14 36 30 26 Q 36 18 30 10 Q 14 0 0 0 Z"
      fill="rgba(245,158,11,0.08)"
      stroke={wireColor(out)}
      strokeWidth="1.6"
      style={{ filter: wireGlow(out) }}
    />
    <text x="14" y="22" fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle" fill={wireColor(out)}>≥1</text>
  </g>
);

// NOT bubble (inverter circle on a wire)
const Bubble: React.FC<{ cx: number; cy: number; on: number }> = ({ cx, cy, on }) => (
  <circle cx={cx} cy={cy} r="3.5" fill={wireColor(on)} stroke="#fff2" strokeWidth="0.6" />
);

const Wire: React.FC<{ d: string; on: number }> = ({ d, on }) => (
  <path d={d} stroke={wireColor(on)} strokeWidth="1.4" fill="none" style={{ filter: wireGlow(on) }} />
);

export const S07b_GateCircuits: React.FC<Props> = ({ isActive, isDarkMode }) => {
  const [R, setR] = useState(0);
  const [A, setA] = useState(0);
  const [W, setW] = useState(1);

  const Rn = 1 - R, An = 1 - A, Wn = 1 - W;
  // SOP minterm outputs (m0, m1, m2, m4 — happy rows)
  const m0 = Rn & An & Wn; // 000
  const m1 = Rn & An & W;  // 001
  const m2 = Rn & A  & Wn; // 010
  const m4 = R  & An & Wn; // 100
  const sopOut = m0 | m1 | m2 | m4;

  // POS maxterm outputs — each fires 0 only at its disaster row
  const M3 = R  | An | Wn;       // (R + A' + W')
  const M5 = Rn | A  | Wn;       // (R' + A + W')
  const M6 = Rn | An | W;        // (R' + A' + W)
  const M7 = Rn | An | Wn;       // (R' + A' + W')
  const posOut = M3 & M5 & M6 & M7;

  const truth = benRule(R, A, W);

  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';

  return (
    <div className="max-w-6xl mx-auto space-y-12 py-4">
      <section className="space-y-3">
        <div className="font-mono text-[10px] tracking-[0.4em] uppercase text-cyan-400">
          Chapter 07.5 · Hardware Translation
        </div>
        <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>
          From Algebra to Silicon
        </h2>
        <p className={`text-base max-w-3xl ${subText}`}>
          Both canonical forms become two-level networks of logic gates. SOP wires AND-gates into a
          big OR-gate; POS wires OR-gates into a big AND-gate. Toggle the inputs below and watch
          green signals propagate through identical-output circuits.
        </p>
      </section>

      {/* Input toggles */}
      <div className={`p-6 rounded-3xl border ${cardBg}`}>
        <div className="flex items-center gap-2 mb-5">
          <ToggleRight size={14} className="text-cyan-400" />
          <span className="font-mono text-[10px] uppercase tracking-widest text-cyan-400">
            Inputs · click any to flip
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-6">
          {[
            { name: 'R', val: R, set: setR, color: '#38bdf8' },
            { name: 'A', val: A, set: setA, color: '#a78bfa' },
            { name: 'W', val: W, set: setW, color: '#34d399' },
          ].map(v => (
            <div key={v.name} className="flex items-center gap-3">
              <span className="font-mono text-base font-black" style={{ color: v.color }}>{v.name}</span>
              <button
                onClick={() => v.set(1 - v.val)}
                className="w-12 h-12 rounded-xl font-mono text-2xl font-black border-2 transition-all"
                style={{
                  background: v.val ? `${v.color}33` : 'transparent',
                  borderColor: v.val ? v.color : '#475569',
                  color: v.val ? v.color : '#475569',
                }}
              >
                {v.val}
              </button>
            </div>
          ))}
          <div className="ml-auto flex items-center gap-3">
            <span className={`font-mono text-[10px] uppercase tracking-widest ${subText}`}>truth-table answer</span>
            <span
              className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl font-black border-2"
              style={{
                background: truth ? '#10b98133' : '#f43f5e33',
                borderColor: truth ? '#10b981' : '#f43f5e',
                color: truth ? '#10b981' : '#f43f5e',
              }}
            >
              {truth}
            </span>
          </div>
        </div>
      </div>

      {/* SOP circuit */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        className={`p-6 rounded-3xl border ${cardBg}`}
      >
        <div className="flex items-center gap-2 mb-5">
          <Zap size={14} className="text-emerald-400" />
          <span className="font-mono text-[10px] uppercase tracking-widest text-emerald-400">
            SOP · AND → OR network · Σm(0, 1, 2, 4)
          </span>
        </div>
        <div className="overflow-x-auto">
          <svg viewBox="0 0 560 360" className="w-full max-w-3xl mx-auto" style={{ minWidth: 420 }}>
            {/* Input rails */}
            <text x="14" y="40"  fontSize="11" fontFamily="monospace" fill="#38bdf8" fontWeight="bold">R={R}</text>
            <text x="14" y="180" fontSize="11" fontFamily="monospace" fill="#a78bfa" fontWeight="bold">A={A}</text>
            <text x="14" y="320" fontSize="11" fontFamily="monospace" fill="#34d399" fontWeight="bold">W={W}</text>

            {/* Vertical input rails */}
            <Wire d="M 50 40 L 50 340" on={1} />
            <Wire d="M 80 40 L 80 340" on={1} />
            <Wire d="M 110 40 L 110 340" on={1} />

            {/* m0 = R'·A'·W' (top) — branch off rails with bubbles */}
            <Wire d="M 50 60 L 130 60"  on={Rn} /><Bubble cx={120} cy={60} on={Rn} />
            <Wire d="M 80 75 L 130 75"  on={An} /><Bubble cx={120} cy={75} on={An} />
            <Wire d="M 110 90 L 130 90" on={Wn} /><Bubble cx={120} cy={90} on={Wn} />
            <AndGate x={130} y={56} out={m0} label="&" />
            <Wire d="M 167 74 L 380 74" on={m0} />
            <text x={170} y={68} fontSize="9" fontFamily="monospace" fill={wireColor(m0)}>m0</text>

            {/* m1 = R'·A'·W */}
            <Wire d="M 50 130 L 130 130"  on={Rn} /><Bubble cx={120} cy={130} on={Rn} />
            <Wire d="M 80 145 L 130 145"  on={An} /><Bubble cx={120} cy={145} on={An} />
            <Wire d="M 110 160 L 130 160" on={W}  />
            <AndGate x={130} y={126} out={m1} />
            <Wire d="M 167 144 L 380 144" on={m1} />
            <text x={170} y={138} fontSize="9" fontFamily="monospace" fill={wireColor(m1)}>m1</text>

            {/* m2 = R'·A·W' */}
            <Wire d="M 50 200 L 130 200"  on={Rn} /><Bubble cx={120} cy={200} on={Rn} />
            <Wire d="M 80 215 L 130 215"  on={A}  />
            <Wire d="M 110 230 L 130 230" on={Wn} /><Bubble cx={120} cy={230} on={Wn} />
            <AndGate x={130} y={196} out={m2} />
            <Wire d="M 167 214 L 380 214" on={m2} />
            <text x={170} y={208} fontSize="9" fontFamily="monospace" fill={wireColor(m2)}>m2</text>

            {/* m4 = R·A'·W' */}
            <Wire d="M 50 270 L 130 270"  on={R}  />
            <Wire d="M 80 285 L 130 285"  on={An} /><Bubble cx={120} cy={285} on={An} />
            <Wire d="M 110 300 L 130 300" on={Wn} /><Bubble cx={120} cy={300} on={Wn} />
            <AndGate x={130} y={266} out={m4} />
            <Wire d="M 167 284 L 380 284" on={m4} />
            <text x={170} y={278} fontSize="9" fontFamily="monospace" fill={wireColor(m4)}>m4</text>

            {/* Big OR gate collecting all minterms */}
            <OrGate x={395} y={160} out={sopOut} />
            <Wire d="M 380 74  L 395 168" on={m0} />
            <Wire d="M 380 144 L 395 178" on={m1} />
            <Wire d="M 380 214 L 395 188" on={m2} />
            <Wire d="M 380 284 L 395 196" on={m4} />

            {/* Output */}
            <Wire d="M 425 178 L 510 178" on={sopOut} />
            <text x="478" y="170" fontSize="10" fontFamily="monospace" fill={wireColor(sopOut)} fontWeight="bold">F</text>
            <rect x="510" y="160" width="36" height="36" rx="6" fill={sopOut ? '#10b98144' : '#33415544'} stroke={wireColor(sopOut)} strokeWidth="1.5" />
            <text x="528" y="183" fontSize="16" fontFamily="monospace" fontWeight="bold" textAnchor="middle" fill={wireColor(sopOut)}>{sopOut}</text>
          </svg>
        </div>
        <p className={`text-xs text-center mt-4 font-mono ${subText}`}>
          4 AND-gates (one per minterm) feed a single 4-input OR. Bubbles = inverters where the variable is 0 in that row.
        </p>
      </motion.div>

      {/* POS circuit */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        className={`p-6 rounded-3xl border ${cardBg}`}
      >
        <div className="flex items-center gap-2 mb-5">
          <Zap size={14} className="text-amber-400" />
          <span className="font-mono text-[10px] uppercase tracking-widest text-amber-400">
            POS · OR → AND network · ΠM(3, 5, 6, 7)
          </span>
        </div>
        <div className="overflow-x-auto">
          <svg viewBox="0 0 560 360" className="w-full max-w-3xl mx-auto" style={{ minWidth: 420 }}>
            <text x="14" y="40"  fontSize="11" fontFamily="monospace" fill="#38bdf8" fontWeight="bold">R={R}</text>
            <text x="14" y="180" fontSize="11" fontFamily="monospace" fill="#a78bfa" fontWeight="bold">A={A}</text>
            <text x="14" y="320" fontSize="11" fontFamily="monospace" fill="#34d399" fontWeight="bold">W={W}</text>

            <Wire d="M 50 40 L 50 340" on={1} />
            <Wire d="M 80 40 L 80 340" on={1} />
            <Wire d="M 110 40 L 110 340" on={1} />

            {/* M3 = R + A' + W' */}
            <Wire d="M 50 60 L 130 60"  on={R} />
            <Wire d="M 80 75 L 130 75"  on={An} /><Bubble cx={120} cy={75} on={An} />
            <Wire d="M 110 90 L 130 90" on={Wn} /><Bubble cx={120} cy={90} on={Wn} />
            <OrGate x={130} y={56} out={M3} />
            <Wire d="M 165 74 L 380 74" on={M3} />
            <text x={170} y={68} fontSize="9" fontFamily="monospace" fill={wireColor(M3)}>M3</text>

            {/* M5 = R' + A + W' */}
            <Wire d="M 50 130 L 130 130"  on={Rn} /><Bubble cx={120} cy={130} on={Rn} />
            <Wire d="M 80 145 L 130 145"  on={A} />
            <Wire d="M 110 160 L 130 160" on={Wn} /><Bubble cx={120} cy={160} on={Wn} />
            <OrGate x={130} y={126} out={M5} />
            <Wire d="M 165 144 L 380 144" on={M5} />
            <text x={170} y={138} fontSize="9" fontFamily="monospace" fill={wireColor(M5)}>M5</text>

            {/* M6 = R' + A' + W */}
            <Wire d="M 50 200 L 130 200"  on={Rn} /><Bubble cx={120} cy={200} on={Rn} />
            <Wire d="M 80 215 L 130 215"  on={An} /><Bubble cx={120} cy={215} on={An} />
            <Wire d="M 110 230 L 130 230" on={W} />
            <OrGate x={130} y={196} out={M6} />
            <Wire d="M 165 214 L 380 214" on={M6} />
            <text x={170} y={208} fontSize="9" fontFamily="monospace" fill={wireColor(M6)}>M6</text>

            {/* M7 = R' + A' + W' */}
            <Wire d="M 50 270 L 130 270"  on={Rn} /><Bubble cx={120} cy={270} on={Rn} />
            <Wire d="M 80 285 L 130 285"  on={An} /><Bubble cx={120} cy={285} on={An} />
            <Wire d="M 110 300 L 130 300" on={Wn} /><Bubble cx={120} cy={300} on={Wn} />
            <OrGate x={130} y={266} out={M7} />
            <Wire d="M 165 284 L 380 284" on={M7} />
            <text x={170} y={278} fontSize="9" fontFamily="monospace" fill={wireColor(M7)}>M7</text>

            {/* Big AND gate collecting all maxterms */}
            <AndGate x={395} y={160} out={posOut} />
            <Wire d="M 380 74  L 395 168" on={M3} />
            <Wire d="M 380 144 L 395 178" on={M5} />
            <Wire d="M 380 214 L 395 188" on={M6} />
            <Wire d="M 380 284 L 395 196" on={M7} />

            <Wire d="M 432 178 L 510 178" on={posOut} />
            <text x="478" y="170" fontSize="10" fontFamily="monospace" fill={wireColor(posOut)} fontWeight="bold">F</text>
            <rect x="510" y="160" width="36" height="36" rx="6" fill={posOut ? '#10b98144' : '#33415544'} stroke={wireColor(posOut)} strokeWidth="1.5" />
            <text x="528" y="183" fontSize="16" fontFamily="monospace" fontWeight="bold" textAnchor="middle" fill={wireColor(posOut)}>{posOut}</text>
          </svg>
        </div>
        <p className={`text-xs text-center mt-4 font-mono ${subText}`}>
          4 OR-gates (one per maxterm) feed a single 4-input AND. Bubbles = inverters where the variable is 1 in that disaster row.
        </p>
      </motion.div>

      {/* Side-by-side numeric verification */}
      <div className="grid md:grid-cols-3 gap-5">
        <div className={`p-5 rounded-3xl border ${
          isDarkMode ? 'bg-emerald-500/5 border-emerald-500/30' : 'bg-emerald-50 border-emerald-300'
        }`}>
          <div className="font-mono text-[10px] uppercase tracking-widest text-emerald-400 mb-2">SOP output</div>
          <div className="text-4xl font-black text-emerald-400">{sopOut}</div>
        </div>
        <div className={`p-5 rounded-3xl border ${cardBg} flex items-center justify-center`}>
          <div className={`text-center ${textColor}`}>
            <div className="font-mono text-[10px] uppercase tracking-widest opacity-50 mb-2">all match?</div>
            <div className={`text-2xl font-black ${
              sopOut === posOut && posOut === truth ? 'text-emerald-400' : 'text-rose-400'
            }`}>
              {sopOut === posOut && posOut === truth ? '✓ verified' : 'mismatch'}
            </div>
            <div className={`text-xs mt-1 ${subText}`}>truth = {truth}</div>
          </div>
        </div>
        <div className={`p-5 rounded-3xl border ${
          isDarkMode ? 'bg-amber-500/5 border-amber-500/30' : 'bg-amber-50 border-amber-300'
        }`}>
          <div className="font-mono text-[10px] uppercase tracking-widest text-amber-400 mb-2">POS output</div>
          <div className="text-4xl font-black text-amber-400">{posOut}</div>
        </div>
      </div>

      {/* Hardware notes */}
      <motion.div
        initial={{ opacity: 0 }} animate={isActive ? { opacity: 1 } : {}}
        transition={{ delay: 0.4 }}
        className={`p-6 rounded-3xl border ${cardBg}`}
      >
        <div className="flex items-center gap-2 mb-3">
          <Cpu size={14} className="text-cyan-400" />
          <span className="font-mono text-[10px] uppercase tracking-widest text-cyan-400">
            Hardware notes
          </span>
        </div>
        <ul className={`space-y-2 text-sm leading-relaxed ${subText}`}>
          <li>• Both circuits are <strong>two-level</strong> — every signal traverses at most two gates between input and output. This bounds the propagation delay.</li>
          <li>• A NAND-only or NOR-only realisation is always possible by inserting bubble pairs (DeMorgan in silicon). NAND chips are the cheapest building blocks on a real PCB.</li>
          <li>• Identical truth tables, different gate counts: pick whichever form yields the smaller bill of materials. K-Map minimisation in the next module shrinks both further.</li>
        </ul>
      </motion.div>
    </div>
  );
};
