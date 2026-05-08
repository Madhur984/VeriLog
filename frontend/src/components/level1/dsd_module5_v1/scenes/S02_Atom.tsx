import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Atom, MousePointerClick } from 'lucide-react';
import type { SceneProps } from '../types';

type Bit = 0 | 1;

export const S02_Atom: React.FC<SceneProps> = ({ isActive, isDarkMode, mode }) => {
  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText   = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg    = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';
  const accent = mode === 'nand' ? '#22d3ee' : '#fb923c';

  const [a, setA] = useState<Bit>(1);
  const [b, setB] = useState<Bit>(1);

  const y: Bit = mode === 'nand'
    ? (((a && b) ? 1 : 0) === 1 ? 0 : 1)
    : (((a || b) ? 1 : 0) === 1 ? 0 : 1);

  const truth: { a: Bit; b: Bit; y: Bit }[] = [
    { a: 0, b: 0, y: 1 },
    { a: 0, b: 1, y: mode === 'nand' ? 1 : 0 },
    { a: 1, b: 0, y: mode === 'nand' ? 1 : 0 },
    { a: 1, b: 1, y: 0 },
  ];

  const formula = mode === 'nand' ? 'Y = (A · B)′' : 'Y = (A + B)′';
  const subtitle = mode === 'nand'
    ? 'NAND outputs 0 ONLY when both inputs are 1.'
    : 'NOR outputs 1 ONLY when both inputs are 0.';
  const ic = mode === 'nand' ? 'TTL Family IC 7400 · Quad 2-input NAND' : 'TTL Family IC 7402 · Quad 2-input NOR';

  return (
    <div className="max-w-6xl mx-auto space-y-12 py-4">
      <section className="space-y-3">
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.4em] uppercase" style={{ color: accent }}>
          <Atom size={14} /> Step 1 · The atom
        </div>
        <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>
          The {mode.toUpperCase()} gate · symbol & truth table.
        </h2>
        <p className={`text-base max-w-3xl ${subText}`}>{subtitle}</p>
      </section>

      <div className="grid lg:grid-cols-[1fr_1fr] gap-6 items-stretch">
        {/* Live symbol with input toggles */}
        <motion.div
          initial={{ opacity: 0, x: -16 }} animate={isActive ? { opacity: 1, x: 0 } : {}}
          className={`p-8 rounded-3xl border ${cardBg} flex flex-col gap-4`}
        >
          <div className="font-mono text-[10px] uppercase tracking-widest mb-1" style={{ color: accent }}>
            Live symbol
          </div>
          <svg viewBox="0 0 320 180" className="w-full h-auto">
            <line x1="20" y1="60" x2="80" y2="60" stroke={accent} strokeWidth="3" style={{ filter: a ? `drop-shadow(0 0 6px ${accent})` : 'none', opacity: a ? 1 : 0.4 }} />
            <line x1="20" y1="120" x2="80" y2="120" stroke={accent} strokeWidth="3" style={{ filter: b ? `drop-shadow(0 0 6px ${accent})` : 'none', opacity: b ? 1 : 0.4 }} />
            <text x="0" y="64" fontSize="14" fontFamily="monospace" fontWeight="bold" fill={accent}>A={a}</text>
            <text x="0" y="124" fontSize="14" fontFamily="monospace" fontWeight="bold" fill={accent}>B={b}</text>
            {mode === 'nand' ? (
              <path d="M 80 35 L 130 35 A 55 55 0 0 1 130 145 L 80 145 Z" fill="none" stroke={accent} strokeWidth="3" />
            ) : (
              <path d="M 80 30 Q 110 90 80 150 Q 175 137 215 90 Q 175 43 80 30 Z" fill="none" stroke={accent} strokeWidth="3" />
            )}
            <circle cx={mode === 'nand' ? 195 : 222} cy="90" r="6" fill="none" stroke={accent} strokeWidth="3" />
            <line x1={mode === 'nand' ? 201 : 228} y1="90" x2="300" y2="90" stroke={accent} strokeWidth="3" style={{ filter: y ? `drop-shadow(0 0 6px ${accent})` : 'none', opacity: y ? 1 : 0.4 }} />
            <text x="305" y="95" fontSize="16" fontFamily="monospace" fontWeight="bold" fill={accent}>Y={y}</text>
          </svg>

          <div className={`flex items-center gap-2 text-xs font-mono ${subText}`}>
            <MousePointerClick size={12} /> Toggle the inputs
          </div>
          <div className="flex gap-3">
            {([{ k: 'A', v: a, set: setA }, { k: 'B', v: b, set: setB }] as const).map((p) => (
              <button
                key={p.k}
                onClick={() => p.set(p.v === 1 ? 0 : 1)}
                className="flex-1 px-4 py-3 rounded-xl border-2 font-mono font-black transition-all flex flex-col items-start gap-0.5"
                style={{
                  borderColor: accent,
                  color: p.v ? '#000' : accent,
                  backgroundColor: p.v ? accent : 'transparent',
                  boxShadow: p.v ? `0 0 20px ${accent}55` : 'none',
                }}
              >
                <span className="text-[9px] uppercase tracking-widest opacity-80">Input</span>
                <span className="text-base">{p.k} = {p.v}</span>
              </button>
            ))}
          </div>

          <motion.div
            animate={{ borderColor: y ? '#22c55e' : '#ef4444', background: y ? 'rgba(34,197,94,0.10)' : 'rgba(239,68,68,0.10)' }}
            className="px-4 py-3 rounded-xl border-2 font-mono font-black flex items-center justify-between"
            style={{ color: y ? '#22c55e' : '#ef4444' }}
          >
            <span className="text-[10px] uppercase tracking-widest opacity-80">Output</span>
            <span className="text-2xl">Y = {y}</span>
          </motion.div>
        </motion.div>

        {/* Truth table + equation */}
        <motion.div
          initial={{ opacity: 0, x: 16 }} animate={isActive ? { opacity: 1, x: 0 } : {}}
          className={`p-8 rounded-3xl border ${cardBg} flex flex-col gap-4`}
        >
          <div className="font-mono text-[10px] uppercase tracking-widest" style={{ color: accent }}>
            Equation
          </div>
          <div className={`font-mono text-3xl md:text-4xl font-black ${textColor} text-center py-3`}>
            {formula}
          </div>

          <div className="font-mono text-[10px] uppercase tracking-widest mt-2" style={{ color: accent }}>
            Truth table
          </div>
          <div className="grid grid-cols-3 gap-1 font-mono text-sm">
            <div className="px-3 py-2 text-center font-black" style={{ color: accent }}>A</div>
            <div className="px-3 py-2 text-center font-black" style={{ color: accent }}>B</div>
            <div className="px-3 py-2 text-center font-black text-emerald-300">Y</div>
            {truth.map((r) => {
              const isCurrent = r.a === a && r.b === b;
              return (
                <React.Fragment key={`${r.a}-${r.b}`}>
                  <motion.div
                    animate={{ background: isCurrent ? `${accent}33` : 'transparent', scale: isCurrent ? 1.04 : 1 }}
                    className={`px-3 py-2 text-center rounded-l ${r.a ? textColor : 'opacity-50'}`}
                  >{r.a}</motion.div>
                  <motion.div
                    animate={{ background: isCurrent ? `${accent}33` : 'transparent', scale: isCurrent ? 1.04 : 1 }}
                    className={`px-3 py-2 text-center ${r.b ? textColor : 'opacity-50'}`}
                  >{r.b}</motion.div>
                  <motion.div
                    animate={{ background: isCurrent ? `${accent}33` : 'transparent', scale: isCurrent ? 1.04 : 1 }}
                    className={`px-3 py-2 text-center rounded-r font-black ${r.y ? 'text-emerald-300' : 'opacity-50'}`}
                  >{r.y}</motion.div>
                </React.Fragment>
              );
            })}
          </div>

          <div className={`mt-3 p-3 rounded-xl border text-xs ${isDarkMode ? 'bg-black/30 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
            <strong style={{ color: accent }}>Hardware reference:</strong>{' '}
            <span className={subText}>{ic}</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
