import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Hammer, ArrowRight } from 'lucide-react';

interface Props { isActive: boolean; isDarkMode: boolean; }

type Bit = 0 | 1;

// Live-built circuit for Y = A·B + A·C′
const compute = (a: Bit, b: Bit, c: Bit): Bit => {
  const cn: Bit = c === 0 ? 1 : 0;
  const ab: Bit = (a && b) ? 1 : 0;
  const acn: Bit = (a && cn) ? 1 : 0;
  return (ab || acn) ? 1 : 0;
};

const STEPS = [
  { n: '01', t: 'Truth Table',   d: 'List every input combination and the desired output Y.' },
  { n: '02', t: 'Plot K-Map',    d: 'Place each minterm onto a Gray-coded grid.' },
  { n: '03', t: 'Group Wings',   d: 'Cover all 1s with the fewest, largest rectangles.' },
  { n: '04', t: 'Read SOP',      d: 'Each rectangle becomes a product term — OR them.' },
  { n: '05', t: 'Wire Gates',    d: 'NOTs feed ANDs feed a final OR. The circuit is born.' },
];

export const S11_ForwardJourney: React.FC<Props> = ({ isActive, isDarkMode }) => {
  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText   = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg    = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';

  const [a, setA] = useState<Bit>(1);
  const [b, setB] = useState<Bit>(1);
  const [c, setC] = useState<Bit>(0);

  const cn = useMemo(() => (c === 0 ? 1 : 0) as Bit, [c]);
  const ab = useMemo(() => ((a && b) ? 1 : 0) as Bit, [a, b]);
  const acn = useMemo(() => ((a && cn) ? 1 : 0) as Bit, [a, cn]);
  const y = useMemo(() => compute(a, b, c), [a, b, c]);

  const wireStroke = (v: Bit) => v === 1 ? '#fbbf24' : '#475569';
  const wireGlow = (v: Bit) => v === 1 ? 'drop-shadow(0 0 4px rgba(251,191,36,0.7))' : 'none';

  return (
    <div className="max-w-6xl mx-auto space-y-14 py-4">
      <section className="space-y-3">
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.4em] uppercase text-violet-400">
          <Hammer size={14} /> Chapter 11 · Forward Synthesis
        </div>
        <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>Building the Circuit</h2>
        <p className={`text-base max-w-3xl ${subText}`}>
          Run the case backwards. Start with the truth table from chapter 9, plot the K-Map from
          chapter 10, read the SOP, and watch the circuit assemble itself in real time. Toggle
          A · B · C below and see signals propagate through the wires.
        </p>
      </section>

      {/* 5-step strip */}
      <div className="grid md:grid-cols-5 gap-3">
        {STEPS.map((s, i) => (
          <motion.div
            key={s.n}
            initial={{ opacity: 0, y: 12 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.05 * i }}
            className={`p-4 rounded-2xl border ${cardBg}`}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-2xl font-black text-violet-300/60">{s.n}</span>
              <h4 className={`font-black text-xs ${textColor}`}>{s.t}</h4>
            </div>
            <p className={`text-[11px] ${subText} leading-relaxed`}>{s.d}</p>
          </motion.div>
        ))}
      </div>

      {/* Live circuit */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.2 }}
        className={`p-8 rounded-3xl border ${cardBg}`}
      >
        <div className="flex items-center justify-between mb-4">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-violet-400">Live circuit · Y = A·B + A·C′</span>
          <span className={`font-mono text-[11px] ${subText}`}>Toggle inputs ↓</span>
        </div>

        {/* Input toggles */}
        <div className="flex gap-3 mb-6">
          {([
            { k: 'A', v: a, set: setA, color: '#fbbf24' },
            { k: 'B', v: b, set: setB, color: '#22d3ee' },
            { k: 'C', v: c, set: setC, color: '#a78bfa' },
          ] as const).map((d) => (
            <button
              key={d.k}
              onClick={() => d.set(d.v === 1 ? 0 : 1)}
              className="px-5 py-3 rounded-2xl border-2 font-mono font-black transition-all"
              style={{
                borderColor: d.color,
                color: d.v ? '#000' : d.color,
                backgroundColor: d.v ? d.color : 'transparent',
                boxShadow: d.v ? `0 0 25px ${d.color}55` : 'none',
              }}
            >
              {d.k} = {d.v}
            </button>
          ))}
        </div>

        {/* SVG circuit */}
        <svg viewBox="0 0 800 360" className="w-full h-auto">
          {/* Inputs labels */}
          <g fontFamily="monospace" fontSize="14" fontWeight="bold">
            <text x="20" y="80"  fill="#fbbf24">A = {a}</text>
            <text x="20" y="160" fill="#22d3ee">B = {b}</text>
            <text x="20" y="280" fill="#a78bfa">C = {c}</text>
          </g>

          {/* A wires (split to two ANDs) */}
          <line x1="80" y1="76"  x2="240" y2="100" stroke={wireStroke(a)} strokeWidth="2" style={{ filter: wireGlow(a) }} />
          <line x1="80" y1="76"  x2="80" y2="220" stroke={wireStroke(a)} strokeWidth="2" style={{ filter: wireGlow(a) }} />
          <line x1="80" y1="220" x2="240" y2="220" stroke={wireStroke(a)} strokeWidth="2" style={{ filter: wireGlow(a) }} />

          {/* B wire to first AND */}
          <line x1="80" y1="156" x2="240" y2="124" stroke={wireStroke(b)} strokeWidth="2" style={{ filter: wireGlow(b) }} />

          {/* C through NOT, then to second AND */}
          <line x1="80" y1="276" x2="160" y2="276" stroke={wireStroke(c)} strokeWidth="2" style={{ filter: wireGlow(c) }} />
          <polygon points="160,265 192,276 160,287" fill="none" stroke="#a78bfa" strokeWidth="2" />
          <circle cx="196" cy="276" r="3" fill="none" stroke="#a78bfa" strokeWidth="2" />
          <text x="160" y="305" fill="#a78bfa" fontFamily="monospace" fontSize="10">NOT</text>
          <line x1="200" y1="276" x2="240" y2="276" stroke={wireStroke(cn)} strokeWidth="2" style={{ filter: wireGlow(cn) }} />
          <line x1="240" y1="276" x2="240" y2="244" stroke={wireStroke(cn)} strokeWidth="2" style={{ filter: wireGlow(cn) }} />

          {/* AND #1 (A·B) */}
          <path d="M 240 90 L 270 90 A 22 22 0 0 1 270 134 L 240 134 Z" fill="none" stroke="#fcd34d" strokeWidth="2" />
          <text x="247" y="115" fill="#fcd34d" fontFamily="monospace" fontSize="11">AND</text>
          <line x1="292" y1="112" x2="430" y2="112" stroke={wireStroke(ab)} strokeWidth="2.5" style={{ filter: wireGlow(ab) }} />
          <text x="305" y="100" fill="#fcd34d" fontFamily="monospace" fontSize="11">A·B = {ab}</text>

          {/* AND #2 (A·C') */}
          <path d="M 240 210 L 270 210 A 22 22 0 0 1 270 254 L 240 254 Z" fill="none" stroke="#fcd34d" strokeWidth="2" />
          <text x="247" y="235" fill="#fcd34d" fontFamily="monospace" fontSize="11">AND</text>
          <line x1="292" y1="232" x2="430" y2="232" stroke={wireStroke(acn)} strokeWidth="2.5" style={{ filter: wireGlow(acn) }} />
          <text x="305" y="220" fill="#fcd34d" fontFamily="monospace" fontSize="11">A·C′ = {acn}</text>

          {/* Final OR */}
          <path d="M 430 90 Q 450 175 430 260 Q 510 245 540 175 Q 510 105 430 90 Z" fill="none" stroke="#34d399" strokeWidth="2.5" />
          <text x="450" y="180" fill="#34d399" fontFamily="monospace" fontSize="13" fontWeight="bold">OR</text>

          {/* Output */}
          <line x1="540" y1="175" x2="660" y2="175" stroke={wireStroke(y)} strokeWidth="3.5" style={{ filter: wireGlow(y) }} />
          <rect x="660" y="150" width="100" height="50" rx="8"
            fill={y ? '#fcd34d' : 'none'}
            stroke="#34d399" strokeWidth="2.5"
            style={{ filter: y ? 'drop-shadow(0 0 18px rgba(252,211,77,0.7))' : 'none' }}
          />
          <text x="690" y="183" fill={y ? '#000' : '#34d399'} fontFamily="monospace" fontSize="22" fontWeight="bold">Y={y}</text>
        </svg>

        <div className="mt-6 grid sm:grid-cols-3 gap-3">
          <div className={`p-4 rounded-xl border ${isDarkMode ? 'bg-black/30 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
            <div className="font-mono text-[10px] uppercase tracking-widest text-amber-300 mb-1">Path 1</div>
            <div className={`font-mono text-sm ${textColor}`}>A · B → <strong>{ab}</strong></div>
          </div>
          <div className={`p-4 rounded-xl border ${isDarkMode ? 'bg-black/30 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
            <div className="font-mono text-[10px] uppercase tracking-widest text-amber-300 mb-1">Path 2</div>
            <div className={`font-mono text-sm ${textColor}`}>A · C′ → <strong>{acn}</strong></div>
          </div>
          <div className={`p-4 rounded-xl border ${y ? 'border-emerald-400/60 bg-emerald-500/10' : isDarkMode ? 'bg-black/30 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
            <div className="font-mono text-[10px] uppercase tracking-widest text-emerald-300 mb-1">Vault</div>
            <div className={`font-mono text-sm ${y ? 'text-emerald-300' : textColor}`}>
              Y = {ab} + {acn} = <strong>{y}</strong> {y ? '· OPEN' : '· LOCK'}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Function library — common patterns */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.35 }}
        className={`p-8 rounded-3xl border ${cardBg}`}
      >
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-violet-400 mb-5">
          Function library · classic 3-input synthesis patterns
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              name: 'Majority',
              expr: 'Y = A·B + B·C + A·C',
              minterms: [3, 5, 6, 7],
              note: '1 when ≥ 2 of 3 inputs are high. Used in fault-tolerant voting circuits.',
              color: '#22d3ee',
            },
            {
              name: 'Odd-parity (XOR3)',
              expr: 'Y = A ⊕ B ⊕ C',
              minterms: [1, 2, 4, 7],
              note: '1 when an odd number of inputs are 1. The basis of error-detection.',
              color: '#a78bfa',
            },
            {
              name: 'Half-adder Sum',
              expr: 'S = A ⊕ B',
              minterms: [1, 2],
              note: 'C is irrelevant. Half-adder ignores carry-in; full-adder does not.',
              color: '#34d399',
            },
            {
              name: 'Half-adder Carry',
              expr: 'C = A · B',
              minterms: [3],
              note: 'Carries when both bits are 1. The simplest possible logic.',
              color: '#fbbf24',
            },
            {
              name: 'Comparator (A=B)',
              expr: "Y = A·B + A'·B'",
              minterms: [0, 3],
              note: 'Equality detector for two single bits. Equivalent to XNOR of A and B.',
              color: '#f472b6',
            },
            {
              name: 'Multiplexer (S→A,B)',
              expr: "Y = S'·A + S·B",
              minterms: [3, 5, 6, 7],
              note: 'C selects between A and B. The smallest 2:1 mux. Same minterms as majority — different decomposition.',
              color: '#fb923c',
            },
          ].map((fn) => (
            <div
              key={fn.name}
              className={`p-5 rounded-2xl border ${isDarkMode ? 'bg-black/30 border-white/10' : 'bg-slate-50 border-slate-200'}`}
              style={{ boxShadow: `0 8px 24px ${fn.color}15` }}
            >
              <div className="font-mono text-[10px] uppercase tracking-widest mb-2" style={{ color: fn.color }}>
                {fn.name}
              </div>
              <div className={`font-mono text-sm font-black ${textColor} mb-2`}>{fn.expr}</div>
              <div className={`font-mono text-[10px] ${subText} mb-3`}>
                Σm({fn.minterms.join(', ')})
              </div>
              <p className={`text-xs ${subText} leading-relaxed`}>{fn.note}</p>
            </div>
          ))}
        </div>
        <p className={`text-xs ${subText} mt-5 italic`}>
          Memorise these and most VLSI assignments collapse to recognising a known shape.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }} animate={isActive ? { opacity: 1 } : {}}
        transition={{ delay: 0.4 }}
        className={`p-6 rounded-3xl border ${cardBg} flex items-center gap-3`}
      >
        <ArrowRight className="text-violet-300" size={18} />
        <p className={`text-sm ${subText}`}>
          You just synthesised a circuit. Same Boolean function, three lenses — let&apos;s
          confirm they all agree.
        </p>
      </motion.div>
    </div>
  );
};
