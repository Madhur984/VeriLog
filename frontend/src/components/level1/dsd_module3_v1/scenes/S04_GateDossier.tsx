import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';

interface Props { isActive: boolean; isDarkMode: boolean; }

type Bit = 0 | 1;

interface GateSpec {
  name: string;
  symbol: string;
  rule: string;
  algebra: string;
  arity: 1 | 2;
  fn: (a: Bit, b?: Bit) => Bit;
  guardName: string;
  color: string;
  shadow: string;
}

const GATES: GateSpec[] = [
  {
    name: 'NOT',
    symbol: '▷○',
    rule: 'Inverts reality. Denies the valid; allows the invalid.',
    algebra: "x'",
    arity: 1,
    fn: (a) => (a === 1 ? 0 : 1),
    guardName: 'The Contrarian',
    color: '#fbbf24',
    shadow: 'rgba(251,191,36,0.4)',
  },
  {
    name: 'AND',
    symbol: 'D',
    rule: 'Requires *all* inputs to be active to grant passage.',
    algebra: 'x · y',
    arity: 2,
    fn: (a, b) => ((a === 1 && b === 1) ? 1 : 0),
    guardName: 'The Strict Duo',
    color: '#22d3ee',
    shadow: 'rgba(34,211,238,0.4)',
  },
  {
    name: 'OR',
    symbol: 'D)',
    rule: 'Requires *anyone* to be active to grant passage.',
    algebra: 'x + y',
    arity: 2,
    fn: (a, b) => ((a === 1 || b === 1) ? 1 : 0),
    guardName: 'The Lenient Bouncer',
    color: '#a78bfa',
    shadow: 'rgba(167,139,250,0.4)',
  },
];

const GateGlyph: React.FC<{ kind: GateSpec['name']; color: string; out: Bit }> = ({ kind, color, out }) => {
  if (kind === 'NOT') {
    return (
      <svg viewBox="0 0 100 80" className="w-full h-full">
        <polygon points="20,20 75,40 20,60" fill="none" stroke={color} strokeWidth="2.5" />
        <circle cx="80" cy="40" r="4" fill="none" stroke={color} strokeWidth="2.5" />
        <line x1="0" y1="40" x2="20" y2="40" stroke={color} strokeWidth="2.5" />
        <line x1="84" y1="40" x2="100" y2="40" stroke={out ? color : '#475569'} strokeWidth="2.5" />
      </svg>
    );
  }
  if (kind === 'AND') {
    return (
      <svg viewBox="0 0 100 80" className="w-full h-full">
        <path d="M 20 15 L 50 15 A 25 25 0 0 1 50 65 L 20 65 Z" fill="none" stroke={color} strokeWidth="2.5" />
        <line x1="0" y1="28" x2="20" y2="28" stroke={color} strokeWidth="2.5" />
        <line x1="0" y1="52" x2="20" y2="52" stroke={color} strokeWidth="2.5" />
        <line x1="75" y1="40" x2="100" y2="40" stroke={out ? color : '#475569'} strokeWidth="2.5" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 100 80" className="w-full h-full">
      <path d="M 15 15 Q 35 40 15 65 Q 50 65 75 40 Q 50 15 15 15 Z" fill="none" stroke={color} strokeWidth="2.5" />
      <line x1="0" y1="28" x2="22" y2="28" stroke={color} strokeWidth="2.5" />
      <line x1="0" y1="52" x2="22" y2="52" stroke={color} strokeWidth="2.5" />
      <line x1="75" y1="40" x2="100" y2="40" stroke={out ? color : '#475569'} strokeWidth="2.5" />
    </svg>
  );
};

const InteractiveGate: React.FC<{ spec: GateSpec; isDarkMode: boolean }> = ({ spec, isDarkMode }) => {
  const [a, setA] = useState<Bit>(0);
  const [b, setB] = useState<Bit>(0);
  const out = spec.arity === 1 ? spec.fn(a) : spec.fn(a, b);
  const subText = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg  = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';

  return (
    <div
      className={`p-6 rounded-3xl border ${cardBg} relative overflow-hidden`}
      style={{ boxShadow: `0 20px 60px ${spec.shadow}` }}
    >
      <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full blur-3xl" style={{ backgroundColor: spec.shadow }} />
      <div className="font-mono text-[10px] uppercase tracking-widest mb-2" style={{ color: spec.color }}>
        {spec.guardName}
      </div>
      <h3 className="text-2xl font-black mb-3" style={{ color: spec.color }}>{spec.name}</h3>
      <p className={`text-xs ${subText} mb-4`}>{spec.rule}</p>

      <div className="h-32 my-3">
        <GateGlyph kind={spec.name} color={spec.color} out={out} />
      </div>

      {/* Inputs */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex gap-2">
          <button
            onClick={() => setA(a === 1 ? 0 : 1)}
            className="w-12 h-12 rounded-xl border-2 font-mono text-lg font-black"
            style={{ borderColor: spec.color, color: a ? '#000' : spec.color, backgroundColor: a ? spec.color : 'transparent' }}
          >
            {a}
          </button>
          {spec.arity === 2 && (
            <button
              onClick={() => setB(b === 1 ? 0 : 1)}
              className="w-12 h-12 rounded-xl border-2 font-mono text-lg font-black"
              style={{ borderColor: spec.color, color: b ? '#000' : spec.color, backgroundColor: b ? spec.color : 'transparent' }}
            >
              {b}
            </button>
          )}
        </div>
        <span className="font-mono text-[10px] opacity-50">→</span>
        <div
          className="w-14 h-14 rounded-xl border-2 grid place-items-center font-mono text-2xl font-black"
          style={{
            borderColor: spec.color,
            color: out ? '#000' : spec.color,
            backgroundColor: out ? spec.color : 'transparent',
            boxShadow: out ? `0 0 25px ${spec.shadow}` : 'none',
          }}
        >
          {out}
        </div>
      </div>

      <div className="font-mono text-xs px-3 py-2 rounded-lg border" style={{ borderColor: `${spec.color}40`, color: spec.color }}>
        Y = {spec.algebra}
      </div>
    </div>
  );
};

export const S04_GateDossier: React.FC<Props> = ({ isActive, isDarkMode }) => {
  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText   = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg    = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';

  return (
    <div className="max-w-6xl mx-auto space-y-14 py-4">
      <section className="space-y-3">
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.4em] uppercase text-cyan-400">
          <Shield size={14} /> Chapter 04 · The Security Dossier
        </div>
        <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>The Three Guards</h2>
        <p className={`text-base max-w-3xl ${subText}`}>
          Three primitive gates police every combinational circuit. Click their inputs to feel
          the rule each one enforces. The clearance rules below come straight from Madhur&apos;s
          casebook.
        </p>
      </section>

      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        className={`relative rounded-3xl overflow-hidden border ${cardBg}`}
      >
        <img
          src="/images/noir/p04.png"
          alt="Security Dossier — NOT, AND, OR"
          className="w-full block aspect-[16/9] object-cover"
        />
        <div className="absolute bottom-3 right-4 font-mono text-[9px] uppercase tracking-widest text-cyan-200/70">
          Casebook · Page 04
        </div>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-5">
        {GATES.map((g) => (
          <motion.div
            key={g.name}
            initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.15 * GATES.indexOf(g) }}
          >
            <InteractiveGate spec={g} isDarkMode={isDarkMode} />
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }} animate={isActive ? { opacity: 1 } : {}}
        transition={{ delay: 0.4 }}
        className={`p-6 rounded-3xl border ${cardBg} text-center`}
      >
        <p className={`text-sm ${subText}`}>
          Three primitives · infinite circuits. Any Boolean function — no matter how complicated —
          can be assembled from <strong className="text-cyan-300">NOT</strong> +
          <strong className="text-cyan-300"> AND</strong> +
          <strong className="text-cyan-300"> OR</strong>. This is the universal alphabet.
        </p>
      </motion.div>

      {/* All-gates truth table */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.5 }}
        className={`p-8 rounded-3xl border ${cardBg}`}
      >
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-cyan-400 mb-5">
          Side-by-side · 2-input gate truth tables
        </div>
        <div className="overflow-x-auto">
          <div className="grid grid-cols-[40px_40px_repeat(7,1fr)] gap-x-1 gap-y-0.5 font-mono text-xs min-w-[640px]">
            <div className="text-center text-cyan-300 px-2 py-1.5 font-black">A</div>
            <div className="text-center text-cyan-300 px-2 py-1.5 font-black">B</div>
            <div className="text-center text-amber-300 px-2 py-1.5 font-black">AND</div>
            <div className="text-center text-violet-300 px-2 py-1.5 font-black">OR</div>
            <div className="text-center text-rose-300 px-2 py-1.5 font-black">NAND</div>
            <div className="text-center text-fuchsia-300 px-2 py-1.5 font-black">NOR</div>
            <div className="text-center text-emerald-300 px-2 py-1.5 font-black">XOR</div>
            <div className="text-center text-sky-300 px-2 py-1.5 font-black">XNOR</div>
            <div className="text-center text-amber-200 px-2 py-1.5 font-black">A&apos;</div>

            {[0, 1, 2, 3].map((i) => {
              const a = (i >> 1) & 1;
              const b = i & 1;
              const AND = (a && b) ? 1 : 0;
              const OR = (a || b) ? 1 : 0;
              const NAND = AND ? 0 : 1;
              const NOR = OR ? 0 : 1;
              const XOR = (a ^ b);
              const XNOR = XOR ? 0 : 1;
              const NOT_A = a ? 0 : 1;
              const cells = [a, b, AND, OR, NAND, NOR, XOR, XNOR, NOT_A];
              const colors = ['', '', 'text-amber-300', 'text-violet-300', 'text-rose-300', 'text-fuchsia-300', 'text-emerald-300', 'text-sky-300', 'text-amber-200'];
              return (
                <React.Fragment key={i}>
                  {cells.map((v, idx) => (
                    <div
                      key={idx}
                      className={`text-center px-2 py-1.5 ${idx >= 2 && v === 1 ? `font-black ${colors[idx]}` : ''} ${idx >= 2 && v === 0 ? 'opacity-40' : ''}`}
                    >
                      {v}
                    </div>
                  ))}
                </React.Fragment>
              );
            })}
          </div>
        </div>
        <p className={`text-xs ${subText} mt-4 text-center`}>
          Four rows tell you everything about every 2-input gate. This is the ground truth that
          all later K-Map and SOP work simplifies <em>down</em> to.
        </p>
      </motion.div>
    </div>
  );
};
