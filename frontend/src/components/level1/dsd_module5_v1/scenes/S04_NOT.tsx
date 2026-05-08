import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, Zap } from 'lucide-react';
import type { SceneProps } from '../types';
type Bit = 0 | 1;

export const S04_NOT: React.FC<SceneProps> = ({ isActive, isDarkMode, mode }) => {
  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText   = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg    = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';
  const accent = mode === 'nand' ? '#22d3ee' : '#fb923c';

  const [a, setA] = useState<Bit>(1);
  const y: Bit = (a === 0 ? 1 : 0);

  const wireC = (v: Bit) => v === 1 ? accent : (isDarkMode ? '#475569' : '#cbd5e1');
  const glow  = (v: Bit) => v === 1 ? `drop-shadow(0 0 6px ${accent})` : 'none';

  const proof = mode === 'nand'
    ? ['Y = (A · A)′', 'Y = (A)′', 'Y = A′']
    : ['Y = (A + A)′', 'Y = (A)′', 'Y = A′'];

  return (
    <div className="max-w-6xl mx-auto space-y-12 py-4">
      <section className="space-y-3">
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.4em] uppercase" style={{ color: accent }}>
          <Zap size={14} /> Level 1 · The NOT gate
        </div>
        <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>Tie the inputs together.</h2>
        <p className={`text-base max-w-3xl ${subText}`}>
          {mode === 'nand'
            ? 'A NAND gate with both inputs wired to the same signal becomes a pure inverter. The same input enters twice, the AND collapses to A · A = A, and then the NAND bubble flips it to A′.'
            : 'A NOR gate with both inputs wired to the same signal becomes a pure inverter. The same input enters twice, the OR collapses to A + A = A, and then the NOR bubble flips it to A′.'}
        </p>
      </section>

      <div className="grid lg:grid-cols-[1fr_1fr] gap-6 items-stretch">
        {/* Live circuit */}
        <motion.div
          initial={{ opacity: 0, x: -16 }} animate={isActive ? { opacity: 1, x: 0 } : {}}
          className={`p-8 rounded-3xl border ${cardBg} flex flex-col gap-4`}
        >
          <div className="font-mono text-[10px] uppercase tracking-widest" style={{ color: accent }}>
            Live circuit · 1 {mode.toUpperCase()}
          </div>

          <svg viewBox="0 0 360 180" className="w-full h-auto">
            {/* Single A wire splits into both inputs */}
            <line x1="20" y1="90" x2="60" y2="90" stroke={wireC(a)} strokeWidth="3" style={{ filter: glow(a) }} />
            <text x="2" y="94" fontSize="14" fontFamily="monospace" fontWeight="bold" fill={accent}>A={a}</text>
            <line x1="60" y1="90" x2="60" y2="60" stroke={wireC(a)} strokeWidth="2.5" style={{ filter: glow(a) }} />
            <line x1="60" y1="90" x2="60" y2="120" stroke={wireC(a)} strokeWidth="2.5" style={{ filter: glow(a) }} />
            <line x1="60" y1="60" x2="100" y2="60" stroke={wireC(a)} strokeWidth="2.5" style={{ filter: glow(a) }} />
            <line x1="60" y1="120" x2="100" y2="120" stroke={wireC(a)} strokeWidth="2.5" style={{ filter: glow(a) }} />

            {/* The gate */}
            {mode === 'nand' ? (
              <path d="M 100 38 L 140 38 A 52 52 0 0 1 140 142 L 100 142 Z" fill="none" stroke={accent} strokeWidth="3" />
            ) : (
              <path d="M 100 32 Q 128 90 100 148 Q 195 135 230 90 Q 195 45 100 32 Z" fill="none" stroke={accent} strokeWidth="3" />
            )}
            <circle cx={mode === 'nand' ? 196 : 237} cy="90" r="6" fill="none" stroke={accent} strokeWidth="3" />
            <line x1={mode === 'nand' ? 202 : 243} y1="90" x2="320" y2="90" stroke={wireC(y)} strokeWidth="3" style={{ filter: glow(y) }} />
            <text x="325" y="95" fontSize="16" fontFamily="monospace" fontWeight="bold" fill={accent}>Y={y}</text>

            {/* Tied-input dashed annotation */}
            <rect x="50" y="50" width="20" height="80" rx="4" fill="none" stroke={accent} strokeWidth="1" strokeDasharray="4 3" opacity="0.6" />
            <text x="74" y="160" fontSize="9" fontFamily="monospace" fill={accent} opacity="0.7">tied</text>
          </svg>

          <div className="flex gap-3">
            <button
              onClick={() => setA(a === 1 ? 0 : 1)}
              className="flex-1 px-4 py-3 rounded-xl border-2 font-mono font-black transition-all flex flex-col items-start gap-0.5"
              style={{
                borderColor: accent,
                color: a ? '#000' : accent,
                backgroundColor: a ? accent : 'transparent',
                boxShadow: a ? `0 0 20px ${accent}55` : 'none',
              }}
            >
              <span className="text-[9px] uppercase tracking-widest opacity-80">Single Input</span>
              <span className="text-base">A = {a}</span>
            </button>
            <motion.div
              animate={{ borderColor: y ? accent : `${accent}55`, background: y ? `${accent}22` : 'transparent' }}
              className="flex-1 px-4 py-3 rounded-xl border-2 font-mono font-black flex flex-col items-start gap-0.5"
              style={{ color: accent }}
            >
              <span className="text-[9px] uppercase tracking-widest opacity-80">Output A′</span>
              <span className="text-base">Y = {y}</span>
            </motion.div>
          </div>
        </motion.div>

        {/* Proof + key takeaway */}
        <motion.div
          initial={{ opacity: 0, x: 16 }} animate={isActive ? { opacity: 1, x: 0 } : {}}
          className={`p-8 rounded-3xl border ${cardBg} flex flex-col gap-4`}
        >
          <div className="font-mono text-[10px] uppercase tracking-widest" style={{ color: accent }}>
            Algebraic proof
          </div>
          <div className="space-y-3">
            {proof.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.15 }}
                className="flex items-center gap-3"
              >
                <span className="font-mono text-[10px] uppercase tracking-widest opacity-50" style={{ color: accent }}>
                  Step {i + 1}
                </span>
                <span className={`font-mono text-xl font-black ${textColor}`}>{step}</span>
                {i < proof.length - 1 && <ArrowDown className="ml-auto" size={14} style={{ color: accent }} />}
              </motion.div>
            ))}
          </div>

          <div className="rounded-2xl p-4 border-2 mt-2" style={{ borderColor: accent, background: `${accent}11` }}>
            <div className="font-mono text-[10px] uppercase tracking-widest mb-1" style={{ color: accent }}>
              Key takeaway
            </div>
            <p className={`text-sm ${textColor}`}>
              Tying the inputs of a {mode.toUpperCase()} gate together reduces it to a pure inverter. <strong>1 gate. 1 wire trick. Done.</strong>
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-2">
            {[
              { l: 'Gates',  v: '1' },
              { l: 'Inputs', v: '1' },
              { l: 'Output', v: 'A′' },
            ].map((c) => (
              <div key={c.l} className={`rounded-xl p-3 border ${isDarkMode ? 'bg-black/30 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                <div className="font-mono text-[9px] uppercase tracking-widest" style={{ color: accent }}>{c.l}</div>
                <div className={`text-lg font-mono font-black ${textColor}`}>{c.v}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};
