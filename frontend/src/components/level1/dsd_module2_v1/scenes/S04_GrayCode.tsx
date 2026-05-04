import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Hammer, ShieldCheck, BadgeAlert, Repeat } from 'lucide-react';

interface Props { isActive: boolean; isDarkMode: boolean; }

const BIN_PAIRS: Array<{ from: string; to: string; flips: number }> = [
  { from: '00', to: '01', flips: 1 },
  { from: '01', to: '10', flips: 2 },
  { from: '10', to: '11', flips: 1 },
];

const GRAY_PAIRS: Array<{ from: string; to: string; flips: number }> = [
  { from: '00', to: '01', flips: 1 },
  { from: '01', to: '11', flips: 1 },
  { from: '11', to: '10', flips: 1 },
];

const RoomBox: React.FC<{ label: string; lit?: boolean; isDarkMode: boolean }> = ({ label, lit, isDarkMode }) => (
  <div
    className="w-32 h-24 rounded-lg flex items-center justify-center font-mono font-black text-2xl border-2 transition-all"
    style={{
      background: lit ? 'rgba(252, 211, 77, 0.15)' : isDarkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)',
      borderColor: lit ? '#fcd34d' : isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
      color: lit ? '#fde68a' : undefined,
      boxShadow: lit ? '0 0 24px rgba(252,211,77,0.35)' : undefined,
    }}
  >
    {label}
  </div>
);

const Wall: React.FC<{ broken?: boolean; danger?: boolean }> = ({ broken, danger }) => (
  <div className="relative w-12 h-24 mx-1 flex items-center justify-center">
    <motion.div
      animate={broken ? { scaleY: 0.2, opacity: 0.3 } : { scaleY: 1, opacity: 1 }}
      className="w-1.5 h-full rounded-full"
      style={{ background: danger ? '#f43f5e' : '#cbd5e1' }}
    />
    {broken && danger && (
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        className="absolute text-rose-400 font-black text-2xl"
      >
        ✕
      </motion.div>
    )}
  </div>
);

export const S04_GrayCode: React.FC<Props> = ({ isActive, isDarkMode }) => {
  const [phase, setPhase] = useState<'binary' | 'gray'>('binary');
  const [step, setStep] = useState(0);

  // auto-advance the demo when phase changes
  useEffect(() => {
    setStep(0);
    const id = setInterval(() => setStep((s) => (s + 1) % 4), 1800);
    return () => clearInterval(id);
  }, [phase]);

  const pairs = phase === 'binary' ? BIN_PAIRS : GRAY_PAIRS;
  const active = pairs[step % pairs.length];

  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';

  return (
    <div className="max-w-6xl mx-auto space-y-12 py-4">
      <section className="space-y-3">
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.4em] uppercase text-amber-400">
          <Hammer size={14} /> Chapter 04 · Rule 1
        </div>
        <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>The Gray Code Walls</h2>
        <p className={`text-base max-w-3xl ${subText}`}>
          In Madhur&apos;s world a single bit-flip is one wall to knock down. Two bits flipping at once means
          knocking down two walls — a structural disaster. So the corridors must be <strong>Gray-coded</strong>:
          every neighbour differs by exactly one bit.
        </p>
      </section>

      {/* Phase toggle */}
      <div className={`p-4 rounded-2xl border ${cardBg} flex items-center justify-between flex-wrap gap-4`}>
        <div className="flex items-center gap-3">
          <Repeat size={16} className="text-amber-400" />
          <div className="font-mono text-[10px] uppercase tracking-widest text-amber-400">
            Compare the two corridor orderings
          </div>
        </div>
        <div className={`relative inline-flex p-1 rounded-2xl border ${isDarkMode ? 'bg-black/40 border-white/10' : 'bg-slate-100 border-slate-200'}`}>
          {(['binary', 'gray'] as const).map((k) => (
            <button
              key={k}
              onClick={() => setPhase(k)}
              className={`relative z-10 px-5 py-2 rounded-xl font-bold text-sm transition-colors ${
                phase === k ? 'text-black' : isDarkMode ? 'text-slate-300' : 'text-slate-600'
              }`}
            >
              {phase === k && (
                <motion.div
                  layoutId="rule1-pill"
                  className={`absolute inset-0 rounded-xl ${k === 'binary' ? 'bg-rose-400' : 'bg-amber-400'}`}
                  transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                />
              )}
              <span className="relative">{k === 'binary' ? 'Standard Binary 00→01→10→11' : 'Gray Code 00→01→11→10'}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Visual: rooms + walls */}
      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        className={`p-8 rounded-3xl border ${cardBg}`}
      >
        <div className="flex items-center justify-between mb-6">
          <span className={`text-sm font-bold ${textColor}`}>
            Step {(step % pairs.length) + 1} / {pairs.length} · Moving from{' '}
            <span className="font-mono text-amber-300">{active.from}</span> →{' '}
            <span className="font-mono text-amber-300">{active.to}</span>
          </span>
          <span className={`font-mono text-[11px] ${active.flips === 1 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {active.flips} bit flip{active.flips > 1 ? 's' : ''}
          </span>
        </div>

        <div className="flex items-center justify-center my-10">
          <RoomBox label={active.from} lit isDarkMode={isDarkMode} />
          <Wall broken danger={active.flips > 1} />
          {active.flips > 1 && <Wall broken danger />}
          <RoomBox label={active.to} lit isDarkMode={isDarkMode} />
        </div>

        {/* Bit-by-bit diff visualization */}
        <div className="flex items-center justify-center gap-6 mb-6">
          {(['from', 'to'] as const).map((side) => {
            const label = side === 'from' ? active.from : active.to;
            const otherLabel = side === 'from' ? active.to : active.from;
            return (
              <div key={side} className="text-center">
                <div className={`font-mono text-[10px] uppercase tracking-widest mb-2 ${subText}`}>{side === 'from' ? 'Room A' : 'Room B'}</div>
                <div className="flex gap-2">
                  {label.split('').map((bit, i) => {
                    const flipped = bit !== otherLabel[i];
                    return (
                      <motion.div
                        key={i}
                        animate={flipped ? { scale: [1, 1.15, 1] } : { scale: 1 }}
                        transition={flipped ? { duration: 1, repeat: Infinity } : {}}
                        className="w-10 h-10 rounded-lg flex items-center justify-center font-mono font-black text-xl border-2"
                        style={{
                          background: flipped
                            ? active.flips > 1 ? 'rgba(244,63,94,0.18)' : 'rgba(16,185,129,0.18)'
                            : isDarkMode ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)',
                          borderColor: flipped
                            ? active.flips > 1 ? '#f43f5e' : '#10b981'
                            : isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                          color: flipped
                            ? active.flips > 1 ? '#fda4af' : '#6ee7b7'
                            : isDarkMode ? '#cbd5e1' : '#475569',
                          boxShadow: flipped ? `0 0 14px ${active.flips > 1 ? 'rgba(244,63,94,0.45)' : 'rgba(16,185,129,0.45)'}` : undefined,
                        }}
                      >
                        {bit}
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* XOR diff strip */}
        <div className="text-center mb-6">
          <div className={`font-mono text-[10px] uppercase tracking-widest mb-2 ${subText}`}>XOR diff (which bits flipped)</div>
          <div className="flex gap-2 justify-center">
            {active.from.split('').map((b, i) => {
              const x = (parseInt(b) ^ parseInt(active.to[i])).toString();
              const flipped = x === '1';
              return (
                <div
                  key={i}
                  className="w-10 h-10 rounded-lg flex items-center justify-center font-mono font-black text-xl border-2"
                  style={{
                    background: flipped
                      ? active.flips > 1 ? 'rgba(244,63,94,0.20)' : 'rgba(16,185,129,0.20)'
                      : isDarkMode ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)',
                    borderColor: flipped
                      ? active.flips > 1 ? '#f43f5e' : '#10b981'
                      : isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                    color: flipped
                      ? active.flips > 1 ? '#fda4af' : '#6ee7b7'
                      : isDarkMode ? '#475569' : '#94a3b8',
                  }}
                >
                  {x}
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-center gap-3">
          {active.flips === 1 ? (
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 text-sm font-bold">
              <ShieldCheck size={14} /> One wall removed · structurally safe
            </span>
          ) : (
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-500/15 text-rose-300 border border-rose-500/40 text-sm font-bold">
              <BadgeAlert size={14} /> Two walls at once · structural disaster
            </span>
          )}
        </div>

        {/* Sequence pills */}
        <AnimatePresence mode="wait">
          <motion.div
            key={phase}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex items-center justify-center gap-2 mt-8 flex-wrap"
          >
            {(phase === 'binary' ? ['00', '01', '10', '11'] : ['00', '01', '11', '10']).map((label, i) => (
              <React.Fragment key={i}>
                {i > 0 && <span className="opacity-30">→</span>}
                <span className="px-3 py-1.5 rounded-md bg-amber-400/10 border border-amber-400/40 font-mono text-sm font-bold text-amber-300">
                  {label}
                </span>
              </React.Fragment>
            ))}
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Explanation cards */}
      <div className="grid md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -12 }} animate={isActive ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: 0.2 }}
          className={`p-6 rounded-3xl border ${cardBg}`}
        >
          <div className="flex items-center gap-2 mb-3">
            <BadgeAlert size={14} className="text-rose-400" />
            <div className="font-mono text-[10px] uppercase tracking-widest text-rose-400">Why Standard Binary Fails</div>
          </div>
          <p className={`text-sm leading-relaxed ${subText}`}>
            The jump from binary 01 to 10 changes both bits. Two variables flip simultaneously — neither room is a single
            wall away from the other. That breaks the architectural promise that <em>physical adjacency</em> means
            <em> logical adjacency</em>.
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 12 }} animate={isActive ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: 0.3 }}
          className={`p-6 rounded-3xl border ${cardBg}`}
        >
          <div className="flex items-center gap-2 mb-3">
            <ShieldCheck size={14} className="text-emerald-400" />
            <div className="font-mono text-[10px] uppercase tracking-widest text-emerald-400">Why Gray Code Wins</div>
          </div>
          <p className={`text-sm leading-relaxed ${subText}`}>
            00 → 01 → 11 → 10 differs by exactly one bit at each step. Every neighbour shares one wall, and that wall
            corresponds to one Boolean variable. <strong className="text-emerald-300">Adjacency = simplification</strong>{' '}
            is now a guarantee, not a coincidence.
          </p>
        </motion.div>
      </div>
    </div>
  );
};
