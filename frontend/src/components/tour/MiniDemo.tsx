import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Tiny self-contained interactive widgets the onboarding tour can embed to make
 * a step "do" instead of just "tell". Each is intentionally small (~110px tall)
 * so the step still fits a phone screen without scrolling.
 */
export type DemoKind = 'switch' | 'gate' | 'wave';

const Bit: React.FC<{ on: boolean; onClick: () => void; label: string; accent: string }> = ({ on, onClick, label, accent }) => (
  <button
    type="button"
    onClick={onClick}
    className="flex flex-col items-center gap-1 active:scale-90 transition-transform"
  >
    <span
      className="w-10 h-10 rounded-xl flex items-center justify-center font-mono font-black text-base border transition-colors"
      style={{
        background: on ? accent : 'rgba(255,255,255,0.04)',
        color: on ? '#000' : 'rgba(255,255,255,0.4)',
        borderColor: on ? accent : 'rgba(255,255,255,0.12)',
        boxShadow: on ? `0 0 16px ${accent}66` : 'none',
      }}
    >
      {on ? 1 : 0}
    </span>
    <span className="text-[8px] font-mono uppercase tracking-widest text-slate-500">{label}</span>
  </button>
);

const Led: React.FC<{ on: boolean; accent: string }> = ({ on, accent }) => (
  <motion.span
    className="w-7 h-7 rounded-full border-2"
    animate={{
      background: on ? accent : 'rgba(255,255,255,0.04)',
      boxShadow: on ? `0 0 18px ${accent}, 0 0 6px ${accent}` : '0 0 0 transparent',
      borderColor: on ? accent : 'rgba(255,255,255,0.15)',
    }}
  />
);

export const MiniDemo: React.FC<{ kind: DemoKind; accent: string }> = ({ kind, accent }) => {
  /* ── Switch ── */
  if (kind === 'switch') {
    const [on, setOn] = useState(false);
    return (
      <div className="flex items-center justify-center gap-5 py-2">
        <button
          type="button"
          onClick={() => setOn((v) => !v)}
          className="relative w-16 h-9 rounded-full border transition-colors active:scale-95"
          style={{ background: on ? `${accent}33` : 'rgba(255,255,255,0.05)', borderColor: on ? accent : 'rgba(255,255,255,0.15)' }}
          aria-label="Toggle switch"
        >
          <motion.span
            className="absolute top-1 w-7 h-7 rounded-full"
            animate={{ left: on ? 32 : 4, background: on ? accent : '#64748b' }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          />
        </button>
        <Led on={on} accent={accent} />
        <span className="text-[10px] font-mono uppercase tracking-widest w-16" style={{ color: on ? accent : '#64748b' }}>
          {on ? 'HIGH · 1' : 'LOW · 0'}
        </span>
      </div>
    );
  }

  /* ── AND gate ── */
  if (kind === 'gate') {
    const [a, setA] = useState(true);
    const [b, setB] = useState(false);
    const out = a && b;
    return (
      <div className="flex items-center justify-center gap-3 py-1">
        <div className="flex flex-col gap-2">
          <Bit on={a} onClick={() => setA((v) => !v)} label="A" accent={accent} />
          <Bit on={b} onClick={() => setB((v) => !v)} label="B" accent={accent} />
        </div>
        <svg width="56" height="46" viewBox="0 0 56 46" className="opacity-90">
          <path d="M8 6 H30 A17 17 0 0 1 30 40 H8 Z" fill="none" stroke={out ? accent : 'rgba(255,255,255,0.35)'} strokeWidth="2" />
          <line x1="0" y1="15" x2="8" y2="15" stroke="rgba(255,255,255,0.35)" strokeWidth="2" />
          <line x1="0" y1="31" x2="8" y2="31" stroke="rgba(255,255,255,0.35)" strokeWidth="2" />
          <line x1="47" y1="23" x2="56" y2="23" stroke={out ? accent : 'rgba(255,255,255,0.35)'} strokeWidth="2" />
          <text x="20" y="27" fontSize="8" fill="rgba(255,255,255,0.5)" fontFamily="monospace">AND</text>
        </svg>
        <Led on={out} accent={accent} />
      </div>
    );
  }

  /* ── Wave (analog -> digital) ── */
  const [digital, setDigital] = useState(false);
  return (
    <div className="flex flex-col items-center gap-2 py-1">
      <svg width="200" height="54" viewBox="0 0 200 54">
        <AnimatePresence mode="wait">
          {digital ? (
            <motion.path
              key="sq"
              d="M2 40 H30 V14 H62 V40 H94 V14 H126 V40 H158 V14 H198"
              fill="none" stroke={accent} strokeWidth="2.5"
              initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            />
          ) : (
            <motion.path
              key="sin"
              d="M2 27 Q18 6 34 27 T66 27 T98 27 T130 27 T162 27 T198 27"
              fill="none" stroke="#64748b" strokeWidth="2.5"
              initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            />
          )}
        </AnimatePresence>
      </svg>
      <button
        type="button"
        onClick={() => setDigital((v) => !v)}
        className="px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold uppercase tracking-widest border active:scale-95 transition-transform"
        style={{ borderColor: `${accent}55`, color: accent, background: `${accent}14` }}
      >
        {digital ? 'Show Analog' : 'Sample → Digital'}
      </button>
    </div>
  );
};
