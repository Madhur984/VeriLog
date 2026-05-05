import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Layers, Wrench, Sparkles } from 'lucide-react';

interface Props { isActive: boolean; isDarkMode: boolean; }

type Bit = 0 | 1;

interface DerivedGate {
  name: string;
  symbol: string;
  algebra: string;
  rule: string;
  fn: (a: Bit, b: Bit) => Bit;
  color: string;
  recipe: string; // how it's built from primitives
}

const DERIVED: DerivedGate[] = [
  { name: 'NAND', symbol: 'D○',  algebra: "(A·B)'",   rule: 'AND followed by inverter. Outputs 1 unless BOTH inputs are 1.', fn: (a, b) => ((a && b) ? 0 : 1), color: '#fbbf24', recipe: 'NOT(AND)' },
  { name: 'NOR',  symbol: 'D)○', algebra: "(A+B)'",   rule: 'OR followed by inverter. Outputs 1 only when BOTH inputs are 0.',  fn: (a, b) => ((a || b) ? 0 : 1),    color: '#a78bfa', recipe: 'NOT(OR)' },
  { name: 'XOR',  symbol: '⊕',   algebra: "A⊕B = A'B+AB'", rule: 'Outputs 1 when inputs DISAGREE — the inequality detector.',     fn: (a, b) => ((a ^ b) as Bit),    color: '#34d399', recipe: "A'B + AB'" },
  { name: 'XNOR', symbol: '⊙',   algebra: "(A⊕B)' = AB+A'B'", rule: 'Outputs 1 when inputs AGREE — the equality detector.',       fn: (a, b) => (((a ^ b) ? 0 : 1) as Bit), color: '#22d3ee', recipe: "AB + A'B'" },
];

const GateGlyph: React.FC<{ kind: DerivedGate['name']; color: string; out: Bit }> = ({ kind, color, out }) => {
  const base = (
    <>
      <line x1="0" y1="28" x2="22" y2="28" stroke={color} strokeWidth="2.5" />
      <line x1="0" y1="52" x2="22" y2="52" stroke={color} strokeWidth="2.5" />
    </>
  );
  if (kind === 'NAND') {
    return (
      <svg viewBox="0 0 100 80" className="w-full h-full">
        {base}
        <path d="M 20 15 L 50 15 A 25 25 0 0 1 50 65 L 20 65 Z" fill="none" stroke={color} strokeWidth="2.5" />
        <circle cx="80" cy="40" r="4" fill="none" stroke={color} strokeWidth="2.5" />
        <line x1="84" y1="40" x2="100" y2="40" stroke={out ? color : '#475569'} strokeWidth="2.5" />
      </svg>
    );
  }
  if (kind === 'NOR') {
    return (
      <svg viewBox="0 0 100 80" className="w-full h-full">
        {base}
        <path d="M 15 15 Q 35 40 15 65 Q 50 65 75 40 Q 50 15 15 15 Z" fill="none" stroke={color} strokeWidth="2.5" />
        <circle cx="80" cy="40" r="4" fill="none" stroke={color} strokeWidth="2.5" />
        <line x1="84" y1="40" x2="100" y2="40" stroke={out ? color : '#475569'} strokeWidth="2.5" />
      </svg>
    );
  }
  if (kind === 'XOR') {
    return (
      <svg viewBox="0 0 100 80" className="w-full h-full">
        {base}
        <path d="M 8 15 Q 28 40 8 65" fill="none" stroke={color} strokeWidth="2" />
        <path d="M 18 15 Q 38 40 18 65 Q 50 65 78 40 Q 50 15 18 15 Z" fill="none" stroke={color} strokeWidth="2.5" />
        <line x1="78" y1="40" x2="100" y2="40" stroke={out ? color : '#475569'} strokeWidth="2.5" />
      </svg>
    );
  }
  // XNOR
  return (
    <svg viewBox="0 0 100 80" className="w-full h-full">
      {base}
      <path d="M 8 15 Q 28 40 8 65" fill="none" stroke={color} strokeWidth="2" />
      <path d="M 18 15 Q 38 40 18 65 Q 50 65 75 40 Q 50 15 18 15 Z" fill="none" stroke={color} strokeWidth="2.5" />
      <circle cx="80" cy="40" r="4" fill="none" stroke={color} strokeWidth="2.5" />
      <line x1="84" y1="40" x2="100" y2="40" stroke={out ? color : '#475569'} strokeWidth="2.5" />
    </svg>
  );
};

const InteractiveGate: React.FC<{ spec: DerivedGate; isDarkMode: boolean }> = ({ spec, isDarkMode }) => {
  const [a, setA] = useState<Bit>(0);
  const [b, setB] = useState<Bit>(0);
  const out = spec.fn(a, b);
  const subText = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';

  return (
    <div className={`p-5 rounded-3xl border ${cardBg} relative overflow-hidden`}>
      <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full blur-3xl" style={{ backgroundColor: `${spec.color}33` }} />
      <div className="relative">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-black" style={{ color: spec.color }}>{spec.name}</h3>
          <span className="font-mono text-[9px] uppercase tracking-widest opacity-50">{spec.recipe}</span>
        </div>
        <p className={`text-xs ${subText} mb-3 min-h-[36px]`}>{spec.rule}</p>
        <div className="h-24 mb-3">
          <GateGlyph kind={spec.name} color={spec.color} out={out} />
        </div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex gap-2">
            <button
              onClick={() => setA(a === 1 ? 0 : 1)}
              className="w-10 h-10 rounded-lg border-2 font-mono text-base font-black"
              style={{ borderColor: spec.color, color: a ? '#000' : spec.color, backgroundColor: a ? spec.color : 'transparent' }}
            >{a}</button>
            <button
              onClick={() => setB(b === 1 ? 0 : 1)}
              className="w-10 h-10 rounded-lg border-2 font-mono text-base font-black"
              style={{ borderColor: spec.color, color: b ? '#000' : spec.color, backgroundColor: b ? spec.color : 'transparent' }}
            >{b}</button>
          </div>
          <span className="font-mono text-[10px] opacity-50">→</span>
          <div
            className="w-12 h-12 rounded-lg border-2 grid place-items-center font-mono text-xl font-black"
            style={{
              borderColor: spec.color,
              color: out ? '#000' : spec.color,
              backgroundColor: out ? spec.color : 'transparent',
              boxShadow: out ? `0 0 20px ${spec.color}66` : 'none',
            }}
          >{out}</div>
        </div>
        <div className="font-mono text-[11px] px-3 py-1.5 rounded-md border" style={{ borderColor: `${spec.color}40`, color: spec.color }}>
          Y = {spec.algebra}
        </div>
      </div>
    </div>
  );
};

export const S15_UniversalGates: React.FC<Props> = ({ isActive, isDarkMode }) => {
  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText   = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg    = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';

  return (
    <div className="max-w-6xl mx-auto space-y-14 py-4">
      <section className="space-y-3">
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.4em] uppercase text-cyan-400">
          <Layers size={14} /> Chapter · The Single-Brick Trick
        </div>
        <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>Universal Gates</h2>
        <p className={`text-base max-w-3xl ${subText}`}>
          Three primitives — NOT, AND, OR — are enough. But there&apos;s a deeper trick:{' '}
          <strong className="text-cyan-300">NAND alone</strong> can build all three. So can{' '}
          <strong className="text-cyan-300">NOR alone</strong>. That&apos;s why chip foundries
          mass-produce these gates above all others.
        </p>
      </section>

      {/* Derived gate cards */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.1 }}
      >
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {DERIVED.map((g, i) => (
            <motion.div
              key={g.name}
              initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.05 * i }}
            >
              <InteractiveGate spec={g} isDarkMode={isDarkMode} />
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* NAND universality proof */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.2 }}
        className={`p-8 rounded-3xl border ${cardBg}`}
      >
        <div className="flex items-center gap-2 mb-5">
          <Wrench size={14} className="text-cyan-400" />
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-cyan-400">
            Proof · NAND builds everything
          </span>
        </div>
        <p className={`text-sm ${subText} mb-5`}>
          De Morgan&apos;s laws give us all the tools. Each construction below uses only NAND
          gates (the bubble means inversion).
        </p>

        <div className="grid md:grid-cols-3 gap-5">
          {/* NOT from NAND */}
          <div className={`p-5 rounded-2xl border border-cyan-400/40 bg-cyan-500/5`}>
            <div className="font-mono text-[10px] uppercase tracking-widest text-cyan-300 mb-2">NOT from NAND</div>
            <svg viewBox="0 0 200 100" className="w-full h-auto mb-3">
              <line x1="10" y1="50" x2="35" y2="40" stroke="#fbbf24" strokeWidth="2" />
              <line x1="10" y1="50" x2="35" y2="60" stroke="#fbbf24" strokeWidth="2" />
              <text x="6" y="46" fill="#fbbf24" fontFamily="monospace" fontSize="11">A</text>
              <path d="M 35 30 L 65 30 A 22 22 0 0 1 65 70 L 35 70 Z" fill="none" stroke="#fbbf24" strokeWidth="2" />
              <circle cx="91" cy="50" r="4" fill="none" stroke="#fbbf24" strokeWidth="2" />
              <line x1="95" y1="50" x2="180" y2="50" stroke="#fbbf24" strokeWidth="2" />
              <text x="160" y="46" fill="#fbbf24" fontFamily="monospace" fontSize="11">A&apos;</text>
            </svg>
            <div className={`text-xs ${subText} font-mono`}>Tie both inputs together → NAND(A,A) = (A·A)&apos; = A&apos;</div>
          </div>

          {/* AND from NAND */}
          <div className={`p-5 rounded-2xl border border-cyan-400/40 bg-cyan-500/5`}>
            <div className="font-mono text-[10px] uppercase tracking-widest text-cyan-300 mb-2">AND from NAND</div>
            <svg viewBox="0 0 240 100" className="w-full h-auto mb-3">
              <line x1="10" y1="40" x2="35" y2="40" stroke="#fbbf24" strokeWidth="2" />
              <line x1="10" y1="60" x2="35" y2="60" stroke="#fbbf24" strokeWidth="2" />
              <path d="M 35 30 L 65 30 A 22 22 0 0 1 65 70 L 35 70 Z" fill="none" stroke="#fbbf24" strokeWidth="2" />
              <circle cx="91" cy="50" r="4" fill="none" stroke="#fbbf24" strokeWidth="2" />
              <line x1="95" y1="50" x2="135" y2="40" stroke="#fbbf24" strokeWidth="2" />
              <line x1="95" y1="50" x2="135" y2="60" stroke="#fbbf24" strokeWidth="2" />
              <path d="M 135 30 L 165 30 A 22 22 0 0 1 165 70 L 135 70 Z" fill="none" stroke="#fbbf24" strokeWidth="2" />
              <circle cx="191" cy="50" r="4" fill="none" stroke="#fbbf24" strokeWidth="2" />
              <line x1="195" y1="50" x2="230" y2="50" stroke="#fbbf24" strokeWidth="2" />
              <text x="218" y="46" fill="#fbbf24" fontFamily="monospace" fontSize="11">A·B</text>
            </svg>
            <div className={`text-xs ${subText} font-mono`}>NAND(A,B) inverted again ⇒ A·B</div>
          </div>

          {/* OR from NAND */}
          <div className={`p-5 rounded-2xl border border-cyan-400/40 bg-cyan-500/5`}>
            <div className="font-mono text-[10px] uppercase tracking-widest text-cyan-300 mb-2">OR from NAND</div>
            <svg viewBox="0 0 240 100" className="w-full h-auto mb-3">
              {/* invert A */}
              <line x1="5" y1="40" x2="35" y2="35" stroke="#fbbf24" strokeWidth="2" />
              <line x1="5" y1="40" x2="35" y2="45" stroke="#fbbf24" strokeWidth="2" />
              <path d="M 35 25 L 60 25 A 17 17 0 0 1 60 55 L 35 55 Z" fill="none" stroke="#fbbf24" strokeWidth="2" />
              <circle cx="83" cy="40" r="3" fill="none" stroke="#fbbf24" strokeWidth="2" />
              <line x1="86" y1="40" x2="135" y2="40" stroke="#fbbf24" strokeWidth="2" />

              {/* invert B */}
              <line x1="5" y1="80" x2="35" y2="75" stroke="#fbbf24" strokeWidth="2" />
              <line x1="5" y1="80" x2="35" y2="85" stroke="#fbbf24" strokeWidth="2" />
              <path d="M 35 65 L 60 65 A 17 17 0 0 1 60 95 L 35 95 Z" fill="none" stroke="#fbbf24" strokeWidth="2" />
              <circle cx="83" cy="80" r="3" fill="none" stroke="#fbbf24" strokeWidth="2" />
              <line x1="86" y1="80" x2="135" y2="80" stroke="#fbbf24" strokeWidth="2" />

              {/* final NAND */}
              <path d="M 135 50 L 165 50 A 22 22 0 0 1 165 90 L 135 90 Z" fill="none" stroke="#fbbf24" strokeWidth="2" transform="translate(0,-30)" />
              <circle cx="191" cy="60" r="4" fill="none" stroke="#fbbf24" strokeWidth="2" />
              <line x1="195" y1="60" x2="232" y2="60" stroke="#fbbf24" strokeWidth="2" />
              <text x="218" y="56" fill="#fbbf24" fontFamily="monospace" fontSize="11">A+B</text>
            </svg>
            <div className={`text-xs ${subText} font-mono`}>NAND(A&apos;, B&apos;) = (A&apos;·B&apos;)&apos; = A+B (De Morgan)</div>
          </div>
        </div>
      </motion.div>

      {/* Why we care */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.3 }}
        className={`p-8 rounded-3xl border ${cardBg}`}
      >
        <div className="flex items-center gap-2 mb-5">
          <Sparkles size={14} className="text-cyan-400" />
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-cyan-400">Why this matters</span>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { t: 'Manufacturing', d: 'A chip foundry can mass-produce one cell type (NAND) and use it for the whole die — cheaper, denser, easier QA.' },
            { t: 'Standard cells', d: 'Synthesis tools target NAND-heavy libraries because every Boolean function maps to NAND2 + NAND3 + INV.' },
            { t: 'Speed matching', d: 'Using one cell type means uniform timing characteristics across the entire chip — easier static-timing analysis.' },
          ].map((c) => (
            <div key={c.t} className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-black/30 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
              <div className="font-mono text-[10px] uppercase tracking-widest text-cyan-300 mb-2">{c.t}</div>
              <p className={`text-xs ${subText} leading-relaxed`}>{c.d}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
