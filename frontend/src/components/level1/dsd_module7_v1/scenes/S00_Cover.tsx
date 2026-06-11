import React from 'react';
import { motion } from 'framer-motion';
import { Box, ArrowRight, Hammer } from 'lucide-react';

interface Props { isActive?: boolean; isDarkMode: boolean }

const AMBER = '#f59e0b';
const CYAN = '#22d3ee';
const EMERALD = '#34d399';
const ROSE = '#fb7185';

const FACTS: Array<[string, string]> = [
  ['2', 'inputs: A and B'],
  ['2', 'outputs: Sum and Carry'],
  ['4', 'truth table rows'],
  ['2', 'gates inside: XOR and AND'],
];

const JOURNEY = ['The facts', 'The marble box', 'Two gates', 'The blueprint', 'The real build'];

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
        <div className="flex items-center justify-center gap-2 font-mono text-[10px] tracking-[0.4em] uppercase text-cyan-400">
          <Box size={14} /> DSD Module 07 · The Half Adder
        </div>
        <h1 className={`text-4xl md:text-6xl font-black tracking-tight ${textColor}`}>
          The circuit <span style={{ color: AMBER }}>that adds.</span>
        </h1>
        <p className={`text-base md:text-lg max-w-2xl mx-auto ${subText}`}>
          A half adder takes two bits, A and B, and produces their sum and a carry. It is
          the smallest piece of arithmetic in every processor - and by the end of this
          module you will have built one yourself.
        </p>
      </motion.section>

      {/* ── facts strip ── */}
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                  className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {FACTS.map(([n, label]) => (
          <div key={label} className={`p-5 rounded-2xl border text-center ${cardBg}`}>
            <div className="font-mono text-3xl font-black" style={{ color: AMBER }}>{n}</div>
            <div className={`text-xs mt-1 ${subText}`}>{label}</div>
          </div>
        ))}
      </motion.div>

      {/* ── block diagram + the one defining fact ── */}
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                  className={`p-6 md:p-8 rounded-3xl border ${cardBg}`}>
        <svg viewBox="0 0 460 150" className="w-full max-w-xl mx-auto h-auto">
          <line x1={60} y1={55} x2={170} y2={55} stroke={ink} strokeWidth="3" />
          <line x1={60} y1={95} x2={170} y2={95} stroke={ink} strokeWidth="3" />
          <text x={50} y={59} textAnchor="end" fontSize="13" fontFamily="monospace" fontWeight="bold" fill={ink}>A</text>
          <text x={50} y={99} textAnchor="end" fontSize="13" fontFamily="monospace" fontWeight="bold" fill={ink}>B</text>
          <rect x={170} y={28} width={120} height={94} rx={14} fill={boxFill} stroke={AMBER} strokeWidth="2.5" />
          <text x={230} y={82} textAnchor="middle" fontSize="22" fontFamily="monospace" fontWeight="bold" fill={AMBER}>HA</text>
          <line x1={290} y1={55} x2={400} y2={55} stroke={ink} strokeWidth="3" />
          <line x1={290} y1={95} x2={400} y2={95} stroke={ink} strokeWidth="3" />
          <text x={408} y={59} fontSize="12" fontFamily="monospace" fontWeight="bold" fill={ink}>Sum</text>
          <text x={408} y={99} fontSize="12" fontFamily="monospace" fontWeight="bold" fill={ink}>Cout</text>
        </svg>
        <p className={`text-sm text-center max-w-2xl mx-auto mt-3 ${subText}`}>
          The one fact that powers the whole module: in binary the digit 2 does not exist,
          so <span className="font-mono font-bold" style={{ color: ROSE }}>1 + 1 = 10</span> - a Sum
          of 0 and a Carry of 1.
        </p>
      </motion.div>

      {/* ── Journey strip ── */}
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                  className={`p-6 rounded-3xl border ${cardBg}`}>
        <div className="font-mono text-[10px] uppercase tracking-widest mb-4 text-center" style={{ color: CYAN }}>
          The route through this module
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2">
          {JOURNEY.map((step, i) => (
            <React.Fragment key={step}>
              <span className="px-4 py-2 rounded-full border-2 font-mono text-[11px] font-black"
                    style={{
                      borderColor: i === JOURNEY.length - 1 ? `${AMBER}88` : `${CYAN}44`,
                      color: i === JOURNEY.length - 1 ? AMBER : CYAN,
                      background: i === JOURNEY.length - 1 ? `${AMBER}10` : `${CYAN}08`,
                    }}>
                {step}
              </span>
              {i < JOURNEY.length - 1 && <ArrowRight size={13} className="opacity-40" />}
            </React.Fragment>
          ))}
        </div>
        <p className={`mt-4 text-sm text-center max-w-2xl mx-auto ${subText}`}>
          Facts and the truth table come first. Then a short physical story - a marble box
          that overflows - makes them intuitive. Then the gates, the wiring, and finally:
          <Hammer size={13} className="inline mx-1 -mt-0.5" style={{ color: AMBER }} />
          you wire a <strong style={{ color: AMBER }}>real half adder</strong> in the live circuit
          simulator and prove every row of the table yourself.
        </p>
        <p className="mt-3 text-xs text-center font-mono" style={{ color: EMERALD }}>
          No prerequisites beyond Logic Gates (Module 03) and the NOW-circuits idea from Module 06.
        </p>
      </motion.div>
    </div>
  );
};
