import React from 'react';
import { motion } from 'framer-motion';
import { Layers, Sparkles, Zap, Cpu } from 'lucide-react';
import type { SceneProps } from '../types';

const NandSymbol: React.FC<{ size?: number; color: string }> = ({ size = 240, color }) => (
  <svg viewBox="0 0 240 140" width={size} className="w-full h-auto">
    <line x1="10" y1="50" x2="60" y2="50" stroke={color} strokeWidth="3" />
    <line x1="10" y1="90" x2="60" y2="90" stroke={color} strokeWidth="3" />
    <text x="0" y="55" fontSize="14" fontFamily="monospace" fontWeight="bold" fill={color}>A</text>
    <text x="0" y="95" fontSize="14" fontFamily="monospace" fontWeight="bold" fill={color}>B</text>
    <path d="M 60 30 L 100 30 A 40 40 0 0 1 100 110 L 60 110 Z" fill="none" stroke={color} strokeWidth="3" />
    <circle cx="148" cy="70" r="6" fill="none" stroke={color} strokeWidth="3" />
    <line x1="154" y1="70" x2="220" y2="70" stroke={color} strokeWidth="3" />
    <text x="225" y="75" fontSize="16" fontFamily="monospace" fontWeight="bold" fill={color}>Y</text>
  </svg>
);

const NorSymbol: React.FC<{ size?: number; color: string }> = ({ size = 240, color }) => (
  <svg viewBox="0 0 240 140" width={size} className="w-full h-auto">
    <line x1="10" y1="50" x2="65" y2="50" stroke={color} strokeWidth="3" />
    <line x1="10" y1="90" x2="65" y2="90" stroke={color} strokeWidth="3" />
    <text x="0" y="55" fontSize="14" fontFamily="monospace" fontWeight="bold" fill={color}>A</text>
    <text x="0" y="95" fontSize="14" fontFamily="monospace" fontWeight="bold" fill={color}>B</text>
    <path d="M 60 25 Q 88 70 60 115 Q 130 105 160 70 Q 130 35 60 25 Z" fill="none" stroke={color} strokeWidth="3" />
    <circle cx="168" cy="70" r="6" fill="none" stroke={color} strokeWidth="3" />
    <line x1="174" y1="70" x2="220" y2="70" stroke={color} strokeWidth="3" />
    <text x="225" y="75" fontSize="16" fontFamily="monospace" fontWeight="bold" fill={color}>Y</text>
  </svg>
);

export const S00_Cover: React.FC<SceneProps> = ({ isActive, isDarkMode, mode }) => {
  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText   = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg    = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';
  const accent = mode === 'nand' ? '#22d3ee' : '#fb923c';

  const subheading = mode === 'nand'
    ? 'Every fundamental logic gate, constructed from a single NAND atom.'
    : 'Every fundamental logic gate, constructed from a single NOR atom.';

  const counts = mode === 'nand'
    ? [
        { gate: 'NOT',  count: 1 },
        { gate: 'AND',  count: 2 },
        { gate: 'OR',   count: 3 },
        { gate: 'NOR',  count: 4 },
        { gate: 'XOR',  count: 4 },
        { gate: 'XNOR', count: 5 },
      ]
    : [
        { gate: 'NOT',  count: 1 },
        { gate: 'OR',   count: 2 },
        { gate: 'AND',  count: 3 },
        { gate: 'NAND', count: 4 },
        { gate: 'XNOR', count: 4 },
        { gate: 'XOR',  count: 5 },
      ];

  return (
    <div className="max-w-6xl mx-auto space-y-12 py-4">
      <motion.section
        initial={{ opacity: 0, y: 20 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        className="space-y-5"
      >
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.4em] uppercase" style={{ color: accent }}>
          <Layers size={14} /> Module 05 · Universal Gate Construction
        </div>
        <h1 className={`text-5xl md:text-7xl font-black ${textColor} tracking-tight leading-[0.95]`}>
          {mode === 'nand' ? 'Every gate' : 'Every gate'}<br />
          <span style={{ color: accent }}>from one {mode.toUpperCase()}.</span>
        </h1>
        <p className={`text-xl ${subText} max-w-3xl`}>{subheading}</p>
      </motion.section>

      {/* Hero - animated gate symbol */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }} animate={isActive ? { opacity: 1, scale: 1 } : {}}
        transition={{ delay: 0.15 }}
        className={`rounded-3xl border ${cardBg} p-10 grid place-items-center relative overflow-hidden`}
        style={{
          background: isDarkMode
            ? `radial-gradient(circle at 50% 50%, ${accent}15, transparent 70%)`
            : `radial-gradient(circle at 50% 50%, ${accent}10, transparent 70%)`,
        }}
      >
        <motion.div
          animate={{ scale: [1, 1.04, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          style={{ filter: `drop-shadow(0 0 20px ${accent}66)` }}
        >
          {mode === 'nand' ? <NandSymbol size={300} color={accent} /> : <NorSymbol size={300} color={accent} />}
        </motion.div>
        <div className={`mt-4 font-mono text-2xl font-black ${textColor}`}>
          Y = {mode === 'nand' ? '(A · B)′' : '(A + B)′'}
        </div>
        <div className={`text-xs font-mono uppercase tracking-[0.3em] ${subText} mt-1`}>
          The atom · build everything else from this
        </div>
      </motion.div>

      {/* Construction count grid */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.3 }}
        className={`p-8 rounded-3xl border ${cardBg}`}
      >
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] mb-5 flex items-center gap-2"
             style={{ color: accent }}>
          <Sparkles size={12} /> Construction cost per gate · {mode.toUpperCase()} count
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {counts.map((c, i) => (
            <motion.div
              key={c.gate}
              initial={{ opacity: 0, y: 14, scale: 0.9 }}
              animate={isActive ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ delay: 0.4 + i * 0.06, type: 'spring' }}
              className="rounded-2xl p-5 border-2 text-center"
              style={{ borderColor: `${accent}55`, background: `${accent}11` }}
            >
              <div className="font-mono text-[10px] uppercase tracking-widest mb-2" style={{ color: accent }}>
                {c.gate}
              </div>
              <div className={`text-3xl font-black ${textColor}`}>{c.count}</div>
              <div className={`text-[10px] font-mono mt-1 ${subText}`}>
                {c.count === 1 ? `${mode.toUpperCase()}` : `${mode.toUpperCase()}s`}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Why this matters */}
      <motion.div
        initial={{ opacity: 0, y: 14 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.6 }}
        className="grid md:grid-cols-3 gap-3"
      >
        {[
          { Icon: Zap,    t: 'Single atom',          d: `Manufacture only one cell type. Stamp millions of identical ${mode.toUpperCase()} gates onto silicon.` },
          { Icon: Cpu,    t: 'Mathematically proven', d: `De Morgan's laws guarantee every Boolean function reduces to ${mode.toUpperCase()}-only.` },
          { Icon: Layers, t: 'You will see',         d: 'NOT, AND, OR, the dual gate, XOR and XNOR - all built from this one shape, step by step.' },
        ].map((c, i) => (
          <motion.div
            key={c.t}
            initial={{ opacity: 0, y: 14 }}
            animate={isActive ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.7 + i * 0.07 }}
            className={`p-6 rounded-2xl border ${cardBg}`}
          >
            <c.Icon style={{ color: accent }} className="mb-3" size={20} />
            <h3 className={`text-base font-black ${textColor} mb-2`}>{c.t}</h3>
            <p className={`text-sm ${subText}`}>{c.d}</p>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }} animate={isActive ? { opacity: 1 } : {}}
        transition={{ delay: 0.9 }}
        className={`text-center text-xs font-mono uppercase tracking-[0.3em] ${subText}`}
      >
        Tip · use the <strong style={{ color: accent }}>NAND / NOR toggle</strong> at the top to switch atoms
      </motion.div>
    </div>
  );
};
