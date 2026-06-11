import React from 'react';
import { motion } from 'framer-motion';
import { Boxes, ArrowRight, Hammer } from 'lucide-react';

interface Props { isActive?: boolean; isDarkMode: boolean }

const AMBER = '#f59e0b';
const CYAN = '#22d3ee';
const EMERALD = '#34d399';
const VIOLET = '#a78bfa';

const FACTS: Array<[string, string]> = [
  ['3', 'inputs: A, B and Carry-in'],
  ['2', 'outputs: Sum and Carry-out'],
  ['8', 'truth table rows'],
  ['3', 'blocks inside: 2 half adders + OR'],
];

const JOURNEY = ['The interface', 'Two formulas', 'Eight rows', 'The architecture', 'The real build'];

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
          <Boxes size={14} /> DSD Module 08 · The Full Adder
        </div>
        <h1 className={`text-4xl md:text-6xl font-black tracking-tight ${textColor}`}>
          The circuit <span style={{ color: VIOLET }}>that finishes the job.</span>
        </h1>
        <p className={`text-base md:text-lg max-w-2xl mx-auto ${subText}`}>
          The half adder could add two bits - but had no wire to receive a carry from the
          previous column. The full adder connects that missing wire: three bits in, two bits
          out, and suddenly adders can chain into the multi-bit arithmetic of every processor.
        </p>
      </motion.section>

      {/* ── facts strip ── */}
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                  className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {FACTS.map(([n, label]) => (
          <div key={label} className={`p-5 rounded-2xl border text-center ${cardBg}`}>
            <div className="font-mono text-3xl font-black" style={{ color: VIOLET }}>{n}</div>
            <div className={`text-xs mt-1 ${subText}`}>{label}</div>
          </div>
        ))}
      </motion.div>

      {/* ── block diagram + the one defining fact ── */}
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                  className={`p-6 md:p-8 rounded-3xl border ${cardBg}`}>
        <svg viewBox="0 0 460 190" className="w-full max-w-xl mx-auto h-auto">
          <line x1={60} y1={50} x2={170} y2={50} stroke={ink} strokeWidth="3" />
          <line x1={60} y1={95} x2={170} y2={95} stroke={ink} strokeWidth="3" />
          <line x1={60} y1={140} x2={170} y2={140} stroke={CYAN} strokeWidth="3" />
          <text x={50} y={54} textAnchor="end" fontSize="13" fontFamily="monospace" fontWeight="bold" fill={ink}>A</text>
          <text x={50} y={99} textAnchor="end" fontSize="13" fontFamily="monospace" fontWeight="bold" fill={ink}>B</text>
          <text x={50} y={144} textAnchor="end" fontSize="13" fontFamily="monospace" fontWeight="bold" fill={CYAN}>Cin</text>
          <rect x={170} y={25} width={120} height={140} rx={14} fill={boxFill} stroke={VIOLET} strokeWidth="2.5" />
          <text x={230} y={102} textAnchor="middle" fontSize="22" fontFamily="monospace" fontWeight="bold" fill={VIOLET}>FA</text>
          <line x1={290} y1={70} x2={400} y2={70} stroke={ink} strokeWidth="3" />
          <line x1={290} y1={120} x2={400} y2={120} stroke={AMBER} strokeWidth="3" />
          <text x={408} y={74} fontSize="12" fontFamily="monospace" fontWeight="bold" fill={ink}>S</text>
          <text x={408} y={124} fontSize="12" fontFamily="monospace" fontWeight="bold" fill={AMBER}>Cout</text>
          <text x={115} y={168} textAnchor="middle" fontSize="10" fontFamily="monospace" fill={CYAN} opacity="0.8">
            the new wire ↑
          </text>
        </svg>
        <p className={`text-sm text-center max-w-2xl mx-auto mt-3 ${subText}`}>
          The defining fact: a full adder consolidates <span className="font-mono font-bold" style={{ color: CYAN }}>three</span> one-bit
          inputs into a two-bit answer. The biggest case is
          <span className="font-mono font-bold" style={{ color: AMBER }}> 1 + 1 + 1 = 11</span> - a Sum
          of 1 <em>and</em> a Carry-out of 1.
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
                      borderColor: i === JOURNEY.length - 1 ? `${VIOLET}88` : `${CYAN}44`,
                      color: i === JOURNEY.length - 1 ? VIOLET : CYAN,
                      background: i === JOURNEY.length - 1 ? `${VIOLET}10` : `${CYAN}08`,
                    }}>
                {step}
              </span>
              {i < JOURNEY.length - 1 && <ArrowRight size={13} className="opacity-40" />}
            </React.Fragment>
          ))}
        </div>
        <p className={`mt-4 text-sm text-center max-w-2xl mx-auto ${subText}`}>
          First the interface - what goes in, what comes out. Then the two formulas that govern
          it, all eight truth-table rows, and the elegant trick of building it from two half
          adders. Finally:
          <Hammer size={13} className="inline mx-1 -mt-0.5" style={{ color: VIOLET }} />
          you wire a <strong style={{ color: VIOLET }}>real full adder</strong> in the live circuit
          simulator with a guided tutorial, and prove every row yourself.
        </p>
        <p className="mt-3 text-xs text-center font-mono" style={{ color: EMERALD }}>
          Builds directly on The Half Adder (Module 07) - if XOR and AND feel foggy, replay it first.
        </p>
      </motion.div>
    </div>
  );
};
