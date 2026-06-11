import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Box, ArrowDownToLine, ArrowUpFromLine, ChevronRight, ChevronLeft, RotateCcw } from 'lucide-react';

interface Props { isActive?: boolean; isDarkMode: boolean }

const AMBER = '#f59e0b';
const CYAN = '#22d3ee';
const EMERALD = '#34d399';
const ROSE = '#fb7185';

/**
 * Worked example for the stepper: 11 + 01 (3 + 1 = 4 = 100).
 * Column 0 is a clean half-adder job; column 1 is forced to accept a
 * carry-in - the exact moment the full adder becomes necessary.
 */
const STEPS = [
  {
    title: 'The problem: 11 + 01',
    body: 'Add 3 + 1 in binary, column by column - exactly how hardware does it. Two columns, two additions.',
  },
  {
    title: 'Column 0 · 1 + 1',
    body: 'Rightmost column: 1 + 1 = 10. Sum digit 0 stays here, and a carry of 1 spills LEFT into column 1. A half adder handles this fine.',
  },
  {
    title: 'Column 1 · 1 + 0 + carry',
    body: 'Column 1 must now add THREE bits: A = 1, B = 0, and the incoming carry 1. That is 1 + 0 + 1 = 10 again - sum 0, carry out 1. A half adder has no third input. This is the full adder\'s job.',
  },
  {
    title: 'Result · 100',
    body: 'The final carry has no column to its left, so it becomes the answer\'s top bit: 11 + 01 = 100, which is 4. Every multi-bit addition is just this pattern repeated.',
  },
];

export const S01_Interface: React.FC<Props> = ({ isDarkMode }) => {
  const [step, setStep] = useState(0);

  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText   = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg    = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';
  const ink       = isDarkMode ? '#e2e8f0' : '#0f172a';
  const boxFill   = isDarkMode ? '#0a0e1a' : '#ffffff';
  const dim       = isDarkMode ? '#475569' : '#cbd5e1';

  const col0Active = step >= 1;
  const col1Active = step >= 2;
  const done = step >= 3;

  return (
    <div className="max-w-6xl mx-auto space-y-12 py-4">
      {/* header */}
      <section className="space-y-3">
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.4em] uppercase text-cyan-400">
          <Box size={14} /> Chapter 02 · The Functional Interface
        </div>
        <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>Three in, two out.</h2>
        <p className={`text-base max-w-3xl ${subText}`}>
          Before opening the box, learn its contract. A full adder accepts three one-bit
          inputs - Operand A, Operand B and the Carry-in - and produces exactly two outputs:
          the Sum and the Carry-out. Whatever happens inside, this interface never changes.
        </p>
      </section>

      {/* big interface diagram */}
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                  className={`p-6 md:p-8 rounded-3xl border ${cardBg}`}>
        <svg viewBox="0 0 520 220" className="w-full max-w-2xl mx-auto h-auto" role="img"
             aria-label="Full adder interface: Operand A, Operand B and Carry-in enter; Sum and Carry-out leave">
          {/* inputs */}
          <line x1={40} y1={55} x2={190} y2={55} stroke={CYAN} strokeWidth="3" />
          <polygon points="182,50 192,55 182,60" fill={CYAN} />
          <text x={40} y={45} fontSize="11" fontFamily="monospace" fontWeight="bold" fill={CYAN}>Operand A</text>

          <line x1={40} y1={110} x2={190} y2={110} stroke={CYAN} strokeWidth="3" />
          <polygon points="182,105 192,110 182,115" fill={CYAN} />
          <text x={40} y={100} fontSize="11" fontFamily="monospace" fontWeight="bold" fill={CYAN}>Operand B</text>

          <line x1={40} y1={165} x2={190} y2={165} stroke={EMERALD} strokeWidth="3" />
          <polygon points="182,160 192,165 182,170" fill={EMERALD} />
          <text x={40} y={155} fontSize="11" fontFamily="monospace" fontWeight="bold" fill={EMERALD}>Carry-in (Cin)</text>

          {/* the block */}
          <rect x={192} y={30} width={140} height={160} rx={14} fill={boxFill} stroke={ink} strokeWidth="2.5" />
          <text x={262} y={102} textAnchor="middle" fontSize="17" fontFamily="monospace" fontWeight="bold" fill={ink}>FULL</text>
          <text x={262} y={126} textAnchor="middle" fontSize="17" fontFamily="monospace" fontWeight="bold" fill={ink}>ADDER</text>

          {/* outputs */}
          <line x1={332} y1={75} x2={470} y2={75} stroke={AMBER} strokeWidth="3" />
          <polygon points="462,70 472,75 462,80" fill={AMBER} />
          <text x={470} y={65} textAnchor="end" fontSize="11" fontFamily="monospace" fontWeight="bold" fill={AMBER}>Sum (S)</text>

          <line x1={332} y1={145} x2={470} y2={145} stroke={AMBER} strokeWidth="3" />
          <polygon points="462,140 472,145 462,150" fill={AMBER} />
          <text x={470} y={135} textAnchor="end" fontSize="11" fontFamily="monospace" fontWeight="bold" fill={AMBER}>Carry-out (Cout)</text>
        </svg>

        {/* contract cards */}
        <div className="grid sm:grid-cols-2 gap-3 max-w-2xl mx-auto mt-6">
          <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-black/30 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
            <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest mb-2" style={{ color: CYAN }}>
              <ArrowDownToLine size={13} /> Inputs
            </div>
            <ul className={`text-sm space-y-1 ${subText}`}>
              <li><span className="font-mono font-bold" style={{ color: CYAN }}>A</span> - the first operand bit</li>
              <li><span className="font-mono font-bold" style={{ color: CYAN }}>B</span> - the second operand bit</li>
              <li><span className="font-mono font-bold" style={{ color: EMERALD }}>Cin</span> - the carry arriving from the previous column</li>
            </ul>
          </div>
          <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-black/30 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
            <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest mb-2" style={{ color: AMBER }}>
              <ArrowUpFromLine size={13} /> Outputs
            </div>
            <ul className={`text-sm space-y-1 ${subText}`}>
              <li><span className="font-mono font-bold" style={{ color: AMBER }}>S</span> - the digit that stays in this column</li>
              <li><span className="font-mono font-bold" style={{ color: AMBER }}>Cout</span> - the overflow handed to the next column</li>
            </ul>
          </div>
        </div>
      </motion.div>

      {/* interactive column-addition stepper: why the third wire exists */}
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                  className={`p-6 md:p-8 rounded-3xl border ${cardBg}`}>
        <div className="font-mono text-[10px] uppercase tracking-widest mb-1" style={{ color: ROSE }}>
          Why the third wire exists · step through it
        </div>
        <h3 className={`text-xl font-black mb-4 ${textColor}`}>Watch a carry force its way into column 1</h3>

        <div className="grid lg:grid-cols-2 gap-6 items-center">
          {/* the column addition visual */}
          <svg viewBox="0 0 300 200" className="w-full max-w-sm mx-auto h-auto font-mono">
            {/* carry row */}
            <text x={118} y={38} textAnchor="middle" fontSize="15" fontWeight="bold"
                  fill={col1Active ? ROSE : 'transparent'}>1</text>
            <text x={170} y={26} textAnchor="middle" fontSize="9"
                  fill={col1Active ? ROSE : 'transparent'}>carry</text>
            {col1Active && (
              <path d="M 160 42 Q 140 28 126 40" fill="none" stroke={ROSE} strokeWidth="1.5" strokeDasharray="3 3" />
            )}
            {/* operands */}
            <text x={118} y={75} textAnchor="middle" fontSize="22" fontWeight="bold" fill={col1Active ? CYAN : ink}>1</text>
            <text x={166} y={75} textAnchor="middle" fontSize="22" fontWeight="bold" fill={col0Active ? CYAN : ink}>1</text>
            <text x={70} y={108} textAnchor="middle" fontSize="22" fontWeight="bold" fill={ink}>+</text>
            <text x={118} y={108} textAnchor="middle" fontSize="22" fontWeight="bold" fill={col1Active ? CYAN : ink}>0</text>
            <text x={166} y={108} textAnchor="middle" fontSize="22" fontWeight="bold" fill={col0Active ? CYAN : ink}>1</text>
            {/* rule */}
            <line x1={56} y1={122} x2={184} y2={122} stroke={ink} strokeWidth="2.5" />
            {/* result */}
            <text x={70} y={155} textAnchor="middle" fontSize="22" fontWeight="bold"
                  fill={done ? AMBER : 'transparent'}>1</text>
            <text x={118} y={155} textAnchor="middle" fontSize="22" fontWeight="bold"
                  fill={col1Active ? AMBER : 'transparent'}>0</text>
            <text x={166} y={155} textAnchor="middle" fontSize="22" fontWeight="bold"
                  fill={col0Active ? AMBER : 'transparent'}>0</text>
            {/* column labels */}
            <text x={166} y={182} textAnchor="middle" fontSize="9" fill={col0Active ? EMERALD : dim}>col 0 · HA is enough</text>
            <text x={118} y={170} textAnchor="middle" fontSize="9" fill={col1Active ? ROSE : dim}>col 1 · needs 3 inputs!</text>
            {/* decimal check */}
            {done && (
              <text x={230} y={155} fontSize="11" fill={EMERALD}>= 4 ✓</text>
            )}
            <text x={230} y={75} fontSize="11" fill={dim}>= 3</text>
            <text x={230} y={108} fontSize="11" fill={dim}>= 1</text>
          </svg>

          {/* step narration */}
          <div className="space-y-4">
            <AnimatePresence mode="wait">
              <motion.div key={step}
                          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                          transition={{ duration: 0.25 }}
                          className={`p-5 rounded-2xl border min-h-[130px] ${isDarkMode ? 'bg-black/30 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                <div className="font-mono text-[10px] uppercase tracking-widest mb-2" style={{ color: CYAN }}>
                  Step {step + 1} of {STEPS.length}
                </div>
                <h4 className={`font-black mb-1 ${textColor}`}>{STEPS[step].title}</h4>
                <p className={`text-sm leading-relaxed ${subText}`}>{STEPS[step].body}</p>
              </motion.div>
            </AnimatePresence>
            <div className="flex items-center gap-2">
              <button onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0}
                      className={`flex items-center gap-1 px-4 py-2 rounded-xl border font-mono text-xs font-black uppercase tracking-widest transition-all ${
                        step === 0 ? 'opacity-30 cursor-not-allowed border-white/5'
                          : isDarkMode ? 'border-white/10 hover:border-cyan-400' : 'border-slate-200 hover:border-cyan-400'
                      } ${textColor}`}>
                <ChevronLeft size={14} /> back
              </button>
              <button onClick={() => setStep(s => Math.min(STEPS.length - 1, s + 1))} disabled={step === STEPS.length - 1}
                      className={`flex items-center gap-1 px-4 py-2 rounded-xl border-2 font-mono text-xs font-black uppercase tracking-widest transition-all ${
                        step === STEPS.length - 1 ? 'opacity-30 cursor-not-allowed border-white/5 ' + textColor
                          : 'border-cyan-400 text-cyan-300 hover:bg-cyan-500/10'
                      }`}>
                next <ChevronRight size={14} />
              </button>
              <button onClick={() => setStep(0)} title="Restart"
                      className={`ml-auto p-2 rounded-xl border ${isDarkMode ? 'border-white/10 hover:border-cyan-400' : 'border-slate-200 hover:border-cyan-400'}`}>
                <RotateCcw size={14} className="text-cyan-400" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* takeaway */}
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
                  className={`p-6 rounded-3xl border-2 ${isDarkMode ? 'bg-cyan-500/5' : 'bg-cyan-50'}`}
                  style={{ borderColor: `${CYAN}44` }}>
        <p className={`text-sm leading-relaxed text-center max-w-2xl mx-auto ${textColor}`}>
          <strong style={{ color: CYAN }}>The contract in one line:</strong> a full adder consolidates
          three multi-stage inputs into two highly defined arithmetic outputs - the in-column
          digit S, and the overflow Cout that becomes the <em>next</em> column's Cin.
        </p>
      </motion.div>
    </div>
  );
};
