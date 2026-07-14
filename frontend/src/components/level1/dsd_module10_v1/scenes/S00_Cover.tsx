import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, Layers } from 'lucide-react';

interface Props { isActive?: boolean; isDarkMode: boolean }

const AMBER = '#f59e0b';
const EMERALD = '#34d399';
const VIOLET = '#a78bfa';
const SKY = '#38bdf8';

const FACTS: Array<[string, string]> = [
  ['N', 'full adders chained to add two N-bit numbers'],
  ['Cout→Cin', 'each stage hands its carry to the next'],
  ['2·N·ΔG', 'worst-case delay - it grows with N'],
  ['#1', 'the simplest, cheapest multi-bit adder to build'],
];

const JOURNEY = ['The relay', 'Anatomy', 'The chain', 'The ripple', 'The cost', 'Prove it'];

export const S00_Cover: React.FC<Props> = ({ isDarkMode }) => {
  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText   = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg    = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';
  const ink       = isDarkMode ? '#e2e8f0' : '#0f172a';
  const boxFill   = isDarkMode ? '#0a0e1a' : '#ffffff';

  return (
    <div className="max-w-6xl mx-auto space-y-12 py-4">
      {/* ── Title block ── */}
      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 text-center">
        <h1 className={`text-4xl md:text-6xl font-black tracking-tight ${textColor}`}>
          Chain the adders, <span style={{ color: AMBER }}>pass the carry.</span>
        </h1>
        <p className={`text-base md:text-lg max-w-2xl mx-auto ${subText}`}>
          A single full adder adds one column. To add real multi-bit numbers, you line up one full
          adder per bit and wire each stage's carry-out into the next stage's carry-in. It is the
          most natural multi-bit adder there is - elegant and cheap. The catch: the carry has to
          ripple through every stage in turn, like a baton in a relay race, so the answer is not
          ready until the last runner crosses the line.
        </p>
      </motion.section>

      {/* ── facts strip ── */}
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                  className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {FACTS.map(([n, label]) => (
          <div key={label} className={`p-5 rounded-2xl border text-center ${cardBg}`}>
            <div className="font-mono text-2xl md:text-3xl font-black" style={{ color: AMBER }}>{n}</div>
            <div className={`text-xs mt-1 ${subText}`}>{label}</div>
          </div>
        ))}
      </motion.div>

      {/* ── the chain at a glance ── */}
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                  className={`p-6 md:p-8 rounded-3xl border ${cardBg}`}>
        <svg viewBox="0 0 560 170" className="w-full max-w-2xl mx-auto h-auto">
          {[0, 1, 2, 3].map((i) => {
            const x = 420 - i * 130; // bit 0 on the right
            return (
              <g key={i}>
                {/* operand inputs */}
                <line x1={x + 20} y1={20} x2={x + 20} y2={48} stroke={ink} strokeWidth="2" />
                <line x1={x + 50} y1={20} x2={x + 50} y2={48} stroke={ink} strokeWidth="2" />
                <text x={x + 20} y={15} textAnchor="middle" fontSize="9" fontFamily="monospace" fill={SKY}>A{i}</text>
                <text x={x + 50} y={15} textAnchor="middle" fontSize="9" fontFamily="monospace" fill={SKY}>B{i}</text>
                {/* full adder box */}
                <rect x={x} y={48} width={90} height={50} rx={10} fill={boxFill} stroke={VIOLET} strokeWidth="2" />
                <text x={x + 45} y={70} textAnchor="middle" fontSize="10" fontFamily="monospace" fontWeight="bold" fill={VIOLET}>FA{i}</text>
                <text x={x + 45} y={84} textAnchor="middle" fontSize="8" fontFamily="monospace" fill={subTextHex(isDarkMode)}>bit {i}</text>
                {/* sum out */}
                <line x1={x + 45} y1={98} x2={x + 45} y2={126} stroke={EMERALD} strokeWidth="2" />
                <text x={x + 45} y={138} textAnchor="middle" fontSize="9" fontFamily="monospace" fill={EMERALD}>S{i}</text>
                {/* carry wire to next stage (leftwards) */}
                {i < 3 && (
                  <line x1={x} y1={73} x2={x - 40} y2={73} stroke={AMBER} strokeWidth="2.5" />
                )}
              </g>
            );
          })}
          {/* carry labels */}
          <text x={300} y={66} textAnchor="middle" fontSize="8" fontFamily="monospace" fill={AMBER}>carry</text>
          {/* Cin at the far right */}
          <line x1={510} y1={73} x2={540} y2={73} stroke={AMBER} strokeWidth="2.5" />
          <text x={528} y={66} textAnchor="middle" fontSize="9" fontFamily="monospace" fill={AMBER}>Cin=0</text>
          {/* Cout at far left */}
          <line x1={30} y1={73} x2={6} y2={73} stroke={AMBER} strokeWidth="2.5" />
          <text x={16} y={66} textAnchor="middle" fontSize="8" fontFamily="monospace" fill={AMBER}>Cout</text>
        </svg>
        <p className={`text-sm text-center max-w-2xl mx-auto mt-3 ${subText}`}>
          Four full adders, one per bit. The carry flows right to left: bit 0's
          <span className="font-mono font-bold" style={{ color: AMBER }}> carry-out</span> becomes
          bit 1's carry-in, and so on. The lowest stage starts with
          <span className="font-mono font-bold" style={{ color: AMBER }}> Cin = 0</span>, and the
          final carry-out is the answer's top bit.
        </p>
      </motion.div>

      {/* ── two faces ── */}
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
                  className="grid md:grid-cols-2 gap-4">
        {[
          { Icon: Layers, color: EMERALD, title: 'Its great strength: simplicity', body: 'It is just N copies of a full adder you already understand, wired carry-to-carry. Cheap to build, easy to reason about, scales to any width by adding more stages.' },
          { Icon: Zap, color: AMBER, title: 'Its built-in weakness: the wait', body: 'Each stage cannot finish until the carry from the stage below arrives. The delays stack up, so a wide ripple adder is slow - the reason faster adders were invented.' },
        ].map(({ Icon, color, title, body }) => (
          <div key={title} className={`p-6 rounded-3xl border ${cardBg}`}>
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ background: `${color}26`, border: `1px solid ${color}55` }}>
              <Icon size={20} style={{ color }} />
            </div>
            <h3 className={`mt-4 text-lg font-extrabold ${textColor}`}>{title}</h3>
            <p className={`mt-1.5 text-sm leading-relaxed ${subText}`}>{body}</p>
          </div>
        ))}
      </motion.div>

      {/* ── Journey strip ── */}
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                  className={`p-6 rounded-3xl border ${cardBg}`}>
        <div className="font-mono text-[10px] uppercase tracking-widest mb-4 text-center" style={{ color: AMBER }}>
          The route through this module
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2">
          {JOURNEY.map((step, i) => (
            <React.Fragment key={step}>
              <span className="px-4 py-2 rounded-full border-2 font-mono text-[11px] font-black"
                    style={{
                      borderColor: i === JOURNEY.length - 1 ? `${VIOLET}88` : `${AMBER}44`,
                      color: i === JOURNEY.length - 1 ? VIOLET : AMBER,
                      background: i === JOURNEY.length - 1 ? `${VIOLET}10` : `${AMBER}08`,
                    }}>
                {step}
              </span>
              {i < JOURNEY.length - 1 && <ArrowRight size={13} className="opacity-40" />}
            </React.Fragment>
          ))}
        </div>
        <p className="mt-4 text-xs text-center font-mono" style={{ color: EMERALD }}>
          Builds directly on Module 08 (the full adder). Each stage here IS a full adder.
        </p>
      </motion.div>
    </div>
  );
};

function subTextHex(dark: boolean) { return dark ? '#94a3b8' : '#64748b'; }

export default S00_Cover;
