import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, ArrowRight, Binary, ScrollText, XCircle } from 'lucide-react';

interface Props { isActive?: boolean; isDarkMode: boolean; }

const ROSE = '#fb7185';
const CYAN = '#22d3ee';
const AMBER = '#f59e0b';
const EMERALD = '#34d399';
const LOOP = 7; // seconds per stall replay loop

export const S06_TheLimit: React.FC<Props> = ({ isActive = true, isDarkMode }) => {
  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText   = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg    = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';

  const figure  = isDarkMode ? '#cbd5e1' : '#334155';
  const dim     = isDarkMode ? '#334155' : '#cbd5e1';
  const label   = isDarkMode ? '#94a3b8' : '#64748b';
  const panel   = isDarkMode ? '#0a0e1a' : '#ffffff';
  const ghostBg = isDarkMode ? '#ffffff' : '#0f172a';

  // shared pulse for the "cannot count" demo
  const [blink, setBlink] = useState(true);
  useEffect(() => {
    const id = window.setInterval(() => setBlink(b => !b), 750);
    return () => window.clearInterval(id);
  }, []);

  // press-and-hold lamp demo
  const [held, setHeld] = useState(false);

  return (
    <div className="max-w-6xl mx-auto space-y-12 py-4">
      {/* ── Header ── */}
      <section className="space-y-3">
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.4em] uppercase" style={{ color: ROSE }}>
          <AlertTriangle size={14} /> Part II · The problem with now
        </div>
        <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>Ask him about last month.</h2>
        <p className={`text-base max-w-3xl ${subText}`}>
          One question breaks the tea stall. A memoryless circuit lives in a permanent present.
        </p>
      </section>

      {/* ── The stall replay: the question he cannot answer ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        className={`p-6 md:p-8 rounded-3xl border ${cardBg}`}
      >
        <div className="font-mono text-[10px] uppercase tracking-widest mb-3" style={{ color: ROSE }}>
          Replay · the month-end bill
        </div>

        <svg viewBox="0 0 680 300" className="w-full h-auto">
          {/* ground */}
          <line x1="40" y1="242" x2="640" y2="242" stroke={dim} strokeWidth="2" strokeDasharray="2 6" />

          {/* customer (stick figure, left) */}
          <circle cx="120" cy="128" r="20" fill="none" stroke={figure} strokeWidth="2.5" />
          <line x1="120" y1="148" x2="120" y2="200" stroke={figure} strokeWidth="2.5" />
          <line x1="120" y1="162" x2="96"  y2="188" stroke={figure} strokeWidth="2.5" />
          <line x1="120" y1="162" x2="146" y2="180" stroke={figure} strokeWidth="2.5" />
          <line x1="120" y1="200" x2="102" y2="242" stroke={figure} strokeWidth="2.5" />
          <line x1="120" y1="200" x2="138" y2="242" stroke={figure} strokeWidth="2.5" />
          <text x="120" y="270" textAnchor="middle" fontSize="10" fontFamily="monospace" fill={label}>customer</text>

          {/* stall counter + cup + steam */}
          <rect x="380" y="190" width="250" height="16" rx="4" fill="none" stroke={figure} strokeWidth="2.5" />
          <line x1="396" y1="206" x2="396" y2="242" stroke={figure} strokeWidth="2.5" />
          <line x1="614" y1="206" x2="614" y2="242" stroke={figure} strokeWidth="2.5" />
          <rect x="416" y="172" width="22" height="18" rx="3" fill="none" stroke={AMBER} strokeWidth="2" />
          <motion.path
            d="M 427 166 q 4 -7 0 -13 q -4 -6 0 -12"
            fill="none" stroke={AMBER} strokeWidth="2" strokeLinecap="round"
            animate={{ opacity: [0.15, 0.8, 0.15] }} transition={{ duration: 2.2, repeat: Infinity }}
          />

          {/* vendor (stick figure, right, behind counter) */}
          <circle cx="540" cy="118" r="19" fill="none" stroke={figure} strokeWidth="2.5" />
          <line x1="540" y1="137" x2="540" y2="190" stroke={figure} strokeWidth="2.5" />
          <line x1="540" y1="152" x2="514" y2="176" stroke={figure} strokeWidth="2.5" />
          <line x1="540" y1="152" x2="566" y2="176" stroke={figure} strokeWidth="2.5" />
          <text x="540" y="270" textAnchor="middle" fontSize="10" fontFamily="monospace" fill={label}>vendor</text>

          {/* speech bubble: the killer question */}
          <motion.g
            animate={{ opacity: [0, 1, 1, 1, 0], y: [-6, 0, 0, 0, -6] }}
            transition={{ duration: LOOP, times: [0, 0.05, 0.5, 0.94, 1], repeat: Infinity }}
          >
            <rect x="140" y="26" width="252" height="66" rx="14" fill={panel} stroke={CYAN} strokeWidth="2" />
            <polygon points="168,91 196,91 154,118" fill={panel} stroke={CYAN} strokeWidth="2" />
            <line x1="171" y1="91" x2="193" y2="91" stroke={panel} strokeWidth="4" />
            <text x="266" y="54" textAnchor="middle" fontSize="13" fontFamily="monospace" fontWeight="bold" fill={isDarkMode ? '#ffffff' : '#0f172a'}>
              How much do I owe
            </text>
            <text x="266" y="76" textAnchor="middle" fontSize="13" fontFamily="monospace" fontWeight="bold" fill={isDarkMode ? '#ffffff' : '#0f172a'}>
              for the whole month?
            </text>
          </motion.g>

          {/* thought bubble: stays empty, dots fizzle */}
          <motion.g
            animate={{ opacity: [0, 0, 0.95, 0.95, 0] }}
            transition={{ duration: LOOP, times: [0, 0.13, 0.2, 0.93, 1], repeat: Infinity }}
          >
            <circle cx="552" cy="92" r="4" fill="none" stroke={figure} strokeWidth="2" />
            <circle cx="563" cy="77" r="6" fill="none" stroke={figure} strokeWidth="2" />
            <ellipse cx="586" cy="46" rx="54" ry="27" fill={panel} stroke={figure} strokeWidth="2" />
          </motion.g>
          {[0, 1, 2].map((i) => (
            <motion.circle
              key={i}
              cx={569 + i * 17} cy={44} r={4.5} fill={label}
              animate={{ opacity: [0, 0, 1, 1, 0, 0], y: [0, 0, 0, 0, 14, 14] }}
              transition={{ duration: LOOP, times: [0, 0.2 + i * 0.05, 0.28 + i * 0.05, 0.55, 0.66, 1], repeat: Infinity }}
            />
          ))}
          <motion.text
            x="586" y="50" textAnchor="middle" fontSize="11" fontFamily="monospace" fontWeight="bold" fill={ROSE}
            animate={{ opacity: [0, 0, 1, 1, 0] }}
            transition={{ duration: LOOP, times: [0, 0.68, 0.74, 0.92, 1], repeat: Infinity }}
          >
            no past found
          </motion.text>
        </svg>

        <div className="mt-3 font-mono text-[11px] tracking-wide" style={{ color: label }}>
          Output = F(present inputs) · last month is not a present input
        </div>
      </motion.div>

      {/* ── Three failures, dropping in ── */}
      <div className="grid md:grid-cols-3 gap-4">
        {/* 1 · Cannot count */}
        <motion.div
          initial={{ opacity: 0, y: -28 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.25, type: 'spring', stiffness: 130, damping: 14 }}
          className={`p-6 rounded-3xl border ${cardBg} flex flex-col gap-4`}
        >
          <div className="flex items-center gap-2">
            <XCircle size={18} style={{ color: ROSE }} />
            <span className={`font-black ${textColor}`}>Cannot count</span>
          </div>

          <div className="flex items-center justify-center gap-3">
            <div className="flex flex-col items-center gap-1.5">
              <motion.div
                animate={{
                  backgroundColor: blink ? CYAN : 'rgba(0,0,0,0)',
                  borderColor: blink ? CYAN : dim,
                  boxShadow: blink ? `0 0 18px ${CYAN}66` : '0 0 0px rgba(0,0,0,0)',
                }}
                className="w-10 h-10 rounded-lg border-2"
              />
              <span className="font-mono text-[9px] uppercase tracking-widest" style={{ color: label }}>pulse in</span>
            </div>
            <ArrowRight size={16} style={{ color: label }} />
            <div className="flex flex-col items-center gap-1.5">
              <div
                className="w-14 h-14 rounded-lg border-2 flex items-center justify-center font-mono text-2xl font-black"
                style={{ borderColor: blink ? CYAN : dim, color: blink ? CYAN : label }}
              >
                {blink ? 1 : 0}
              </div>
              <span className="font-mono text-[9px] uppercase tracking-widest" style={{ color: label }}>count?</span>
            </div>
          </div>

          {/* tally that wipes itself */}
          <div className="flex items-end justify-center gap-2.5 h-10">
            <motion.div
              animate={{ opacity: blink ? 1 : 0, scaleY: blink ? 1 : 0.15 }}
              className="w-1.5 h-8 rounded-full origin-bottom"
              style={{ background: CYAN }}
            />
            {[2, 3, 4].map((n) => (
              <div key={n} className="flex flex-col items-center gap-1">
                <div className="w-1.5 h-8 rounded-full" style={{ background: ghostBg, opacity: 0.12 }} />
                <span className="font-mono text-[8px]" style={{ color: label, opacity: 0.5 }}>{n}</span>
              </div>
            ))}
          </div>

          <p className="font-mono text-[11px]" style={{ color: ROSE }}>
            Input gone, tally gone. It never reaches 2.
          </p>
        </motion.div>

        {/* 2 · Cannot track sequences */}
        <motion.div
          initial={{ opacity: 0, y: -28 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4, type: 'spring', stiffness: 130, damping: 14 }}
          className={`p-6 rounded-3xl border ${cardBg} flex flex-col gap-4`}
        >
          <div className="flex items-center gap-2">
            <XCircle size={18} style={{ color: ROSE }} />
            <span className={`font-black ${textColor}`}>Cannot track sequences</span>
          </div>

          <svg viewBox="0 0 220 170" className="w-full h-auto flex-1">
            {/* the straight pipe */}
            <line x1="88"  y1="22" x2="88"  y2="118" stroke={dim} strokeWidth="3" />
            <line x1="132" y1="22" x2="132" y2="118" stroke={dim} strokeWidth="3" />
            <line x1="78"  y1="22" x2="98"  y2="22" stroke={dim} strokeWidth="3" />
            <line x1="122" y1="22" x2="142" y2="22" stroke={dim} strokeWidth="3" />
            <text x="156" y="72" fontSize="9" fontFamily="monospace" fill={label}>pipe</text>

            {/* the 1-0-1 pattern falls through and vanishes */}
            {(['1', '0', '1'] as const).map((bit, i) => (
              <motion.text
                key={i}
                x="110" y="16" textAnchor="middle"
                fontSize="20" fontFamily="monospace" fontWeight="bold" fill={CYAN}
                animate={{ y: [0, 14, 102, 128], opacity: [0, 1, 1, 0] }}
                transition={{ duration: 2.7, times: [0, 0.12, 0.78, 1], delay: i * 1.35, repeat: Infinity, repeatDelay: 1.35 }}
              >
                {bit}
              </motion.text>
            ))}

            <motion.text
              x="110" y="156" textAnchor="middle" fontSize="11" fontFamily="monospace" fontWeight="bold" fill={ROSE}
              animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 2.7, repeat: Infinity }}
            >
              order lost
            </motion.text>
          </svg>

          <p className="font-mono text-[11px]" style={{ color: ROSE }}>
            Each bit falls through alone. 1·0·1 leaves no trace.
          </p>
        </motion.div>

        {/* 3 · Cannot hold a value (press-and-hold demo) */}
        <motion.div
          initial={{ opacity: 0, y: -28 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.55, type: 'spring', stiffness: 130, damping: 14 }}
          className={`p-6 rounded-3xl border ${cardBg} flex flex-col gap-4`}
        >
          <div className="flex items-center gap-2">
            <XCircle size={18} style={{ color: ROSE }} />
            <span className={`font-black ${textColor}`}>Cannot hold a value</span>
          </div>

          <svg viewBox="0 0 220 110" className="w-full h-auto">
            {/* switch */}
            <rect x="12" y="40" width="56" height="32" rx="6" fill="none" stroke={held ? AMBER : dim} strokeWidth="2.5" />
            <text x="40" y="60" textAnchor="middle" fontSize="9" fontFamily="monospace" fontWeight="bold" fill={held ? AMBER : label}>
              {held ? '1' : '0'}
            </text>
            <text x="40" y="90" textAnchor="middle" fontSize="8" fontFamily="monospace" fill={label}>switch</text>

            {/* wire */}
            <line x1="68" y1="56" x2="146" y2="56" stroke={held ? AMBER : dim} strokeWidth="3"
              style={{ filter: held ? `drop-shadow(0 0 6px ${AMBER})` : 'none', transition: 'stroke 120ms' }} />

            {/* lamp */}
            <circle cx="172" cy="56" r="18" fill={held ? AMBER : 'none'} stroke={held ? AMBER : dim} strokeWidth="2.5"
              style={{ filter: held ? `drop-shadow(0 0 12px ${AMBER})` : 'none', transition: 'fill 120ms, stroke 120ms' }} />
            {held && [0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
              const r1 = 23, r2 = 30;
              const rad = (deg * Math.PI) / 180;
              return (
                <line key={deg}
                  x1={172 + r1 * Math.cos(rad)} y1={56 + r1 * Math.sin(rad)}
                  x2={172 + r2 * Math.cos(rad)} y2={56 + r2 * Math.sin(rad)}
                  stroke={AMBER} strokeWidth="2" strokeLinecap="round"
                />
              );
            })}
            <text x="172" y="100" textAnchor="middle" fontSize="8" fontFamily="monospace" fill={label}>lamp</text>
          </svg>

          <button
            onPointerDown={() => setHeld(true)}
            onPointerUp={() => setHeld(false)}
            onPointerLeave={() => setHeld(false)}
            onPointerCancel={() => setHeld(false)}
            onContextMenu={(e) => e.preventDefault()}
            className="w-full px-4 py-3 rounded-xl border-2 font-mono font-black text-sm select-none transition-all active:scale-95"
            style={{
              touchAction: 'none',
              borderColor: AMBER,
              color: held ? '#000' : AMBER,
              backgroundColor: held ? AMBER : 'transparent',
              boxShadow: held ? `0 0 24px ${AMBER}66` : 'none',
            }}
          >
            PRESS AND HOLD
          </button>

          <p className="font-mono text-[11px]" style={{ color: held ? AMBER : ROSE }}>
            {held ? 'Holding · the lamp is on.' : 'Let go and the light forgets instantly.'}
          </p>
        </motion.div>
      </div>

      {/* ── Formal statement: the limit as a boxed theorem ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.7 }}
        className="p-6 md:p-8 rounded-3xl border-2"
        style={{ borderColor: ROSE, background: `${ROSE}11` }}
      >
        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest mb-4" style={{ color: ROSE }}>
          <ScrollText size={14} /> The limit · stated formally
        </div>

        <p className={`text-base md:text-lg font-black leading-relaxed ${textColor}`}>
          A circuit whose output is a function of the present inputs only cannot count, cannot
          recognise a sequence, and cannot hold a result. All three need information about the
          past, and a combinational circuit stores none.
        </p>

        <p className={`mt-4 text-sm leading-relaxed ${subText} max-w-3xl`}>
          This is not a flaw in any particular design - it follows directly from the definition.
          The three demos above are the same theorem seen three times: counting needs the previous
          total, recognising a pattern needs the previous symbols, and holding a value needs the
          previous output. Take away the past and all three collapse together.
        </p>

        <div className={`mt-5 pt-4 border-t ${isDarkMode ? 'border-white/10' : 'border-slate-200'} grid gap-2`}>
          {([
            ['combinational circuit', 'a circuit whose outputs are fixed entirely by the inputs present at this instant; the same inputs always produce the same outputs'],
            ['memory', 'any mechanism that lets information from an earlier moment influence the output now'],
          ] as const).map(([term, def]) => (
            <div key={term} className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="font-mono text-[10px] uppercase tracking-widest font-bold shrink-0" style={{ color: ROSE }}>
                {term}
              </span>
              <span className={`text-xs ${subText}`}>{def}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── Standard text: how much memory does counting need? ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.8 }}
        className={`p-6 md:p-8 rounded-3xl border ${cardBg}`}
      >
        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest mb-3" style={{ color: CYAN }}>
          <Binary size={14} /> How much memory does counting need?
        </div>

        <p className={`text-sm leading-relaxed ${subText} max-w-3xl`}>
          Each stored bit doubles the number of different past situations a circuit can tell apart.
          One bit separates 2 situations, two bits separate 4, and n bits separate 2ⁿ. To count up
          to N, a circuit therefore needs at least log₂N bits of state - stored information that
          survives from one moment to the next. Counting to 16 takes 4 bits because 2⁴ = 16, and
          counting to 1000 takes 10 bits because 2¹⁰ = 1024.
        </p>

        {/* bits vs states row */}
        <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {([
            { bits: 1, states: 2, pow: '2¹' },
            { bits: 2, states: 4, pow: '2²' },
            { bits: 3, states: 8, pow: '2³' },
            { bits: 4, states: 16, pow: '2⁴' },
          ] as const).map(({ bits, states, pow }) => (
            <div
              key={bits}
              className={`p-3 rounded-2xl border flex flex-col items-center gap-1 ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}
            >
              <span className="font-mono text-[9px] uppercase tracking-widest" style={{ color: label }}>
                {bits} bit{bits > 1 ? 's' : ''}
              </span>
              <span className="font-mono text-2xl font-black" style={{ color: CYAN }}>{states}</span>
              <span className="font-mono text-[9px]" style={{ color: label }}>{pow} states</span>
            </div>
          ))}
        </div>

        <div className="mt-4 font-mono text-[11px] tracking-wide" style={{ color: label }}>
          n bits → 2ⁿ distinguishable pasts · counting to N needs at least log₂N bits of state
        </div>
      </motion.div>

      {/* ── Closing: the way forward ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.7 }}
        className="p-6 md:p-8 rounded-3xl border-2 grid md:grid-cols-[1.5fr_1fr] gap-6 items-center"
        style={{ borderColor: EMERALD, background: `${EMERALD}11` }}
      >
        <div className="space-y-2">
          <div className="font-mono text-[10px] uppercase tracking-widest" style={{ color: EMERALD }}>
            The way out
          </div>
          <h3 className={`text-2xl md:text-3xl font-black ${textColor}`}>
            To build a real machine, we must capture the past.
          </h3>
          <p className={`text-sm ${subText} flex items-center gap-2`}>
            Next stop: a scoreboard that remembers <ArrowRight size={14} style={{ color: EMERALD }} />
          </p>
        </div>

        {/* a bit drops into a box and STAYS */}
        <svg viewBox="0 0 160 110" className="w-full h-auto max-w-[220px] justify-self-center">
          <path d="M 55 60 L 55 98 L 105 98 L 105 60" fill="none" stroke={EMERALD} strokeWidth="3" strokeLinecap="round" />
          <motion.text
            x="80" y="44" textAnchor="middle" fontSize="24" fontFamily="monospace" fontWeight="bold" fill={EMERALD}
            animate={{ y: [-34, -34, 42, 42, 42], opacity: [0, 1, 1, 1, 0] }}
            transition={{ duration: 3.6, times: [0, 0.08, 0.38, 0.94, 1], repeat: Infinity, ease: 'easeIn' }}
          >
            1
          </motion.text>
          <motion.rect
            x="49" y="54" width="62" height="50" rx="8" fill="none" stroke={EMERALD} strokeWidth="1.5" strokeDasharray="4 4"
            animate={{ opacity: [0.2, 0.2, 0.9, 0.9, 0.2] }}
            transition={{ duration: 3.6, times: [0, 0.3, 0.42, 0.94, 1], repeat: Infinity }}
          />
          <text x="80" y="24" textAnchor="middle" fontSize="8" fontFamily="monospace" fill={label}>keep the bit</text>
        </svg>
      </motion.div>

      {/* ── Bridge · to Part III ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.85 }}
        className={`p-6 rounded-2xl border ${cardBg} flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-6`}
      >
        <div className="font-mono text-[10px] uppercase tracking-widest shrink-0" style={{ color: EMERALD }}>
          Bridge · to Part III
        </div>
        <p className={`text-sm md:text-base font-bold leading-relaxed ${textColor}`}>
          The missing ingredient has a name: state - the information a circuit keeps about what has
          already happened. Building a circuit that can hold state is exactly what the next chapters do.
          <ArrowRight className="inline ml-2 align-middle" size={14} style={{ color: EMERALD }} />
        </p>
      </motion.div>
    </div>
  );
};
