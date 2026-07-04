import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Swords, CheckCircle2, XCircle, Trophy, ChevronRight, ChevronLeft, RotateCcw, BookOpen } from 'lucide-react';

interface Props { isActive?: boolean; isDarkMode: boolean; }

interface Problem {
  id: string;
  badge: string;
  badgeColor: string;
  prompt: string;
  options: string[];
  correct: number;
  explain: string;
}

const PROBLEMS: Problem[] = [
  {
    id: 'p1',
    badge: 'DEFINITION',
    badgeColor: '#22d3ee',
    prompt: 'What exactly does a half adder do?',
    options: [
      'Adds two 1-bit inputs and outputs a Sum and a Carry',
      'Adds two 8-bit numbers in a single step',
      'Stores one bit of memory between additions',
      'Halves a binary number by shifting it right',
    ],
    correct: 0,
    explain:
      'A half adder takes two single bits, A and B, and produces two outputs: the Sum digit for the current column and the Carry that spills into the next one. Nothing more, nothing less.',
  },
  {
    id: 'p2',
    badge: 'AT REST',
    badgeColor: '#34d399',
    prompt: 'No marble drops from chute A and none from chute B. What do the outputs read?',
    options: [
      'Sum 1, Carry 0 - the bowl defaults to one',
      'Sum 0, Carry 0 - nothing goes in, nothing comes out',
      'Sum 0, Carry 1 - the tray catches the idle state',
      'Undefined - the machine needs at least one input',
    ],
    correct: 1,
    explain:
      'With A = 0 and B = 0 the system is at rest. The bowl stays empty and the tray stays empty: 0 + 0 = 0 with no carry.',
  },
  {
    id: 'p3',
    badge: 'THE FORBIDDEN DIGIT',
    badgeColor: '#fb7185',
    prompt: 'In decimal, 1 + 1 = 2. Why can binary not simply write "2"?',
    options: [
      'Binary reserves 2 as a special control code',
      'The digit 2 exists but only in the carry column',
      'Binary has only the digits 0 and 1, so two is written 10: sum 0, carry 1',
      'Binary cannot represent the number two at all',
    ],
    correct: 2,
    explain:
      'The digit "2" does not exist in binary. Two is written 10: the 0 stays in the Sum column and the 1 is pushed to the Carry tray. That is the overflow.',
  },
  {
    id: 'p4',
    badge: 'OVERFLOW ROW',
    badgeColor: '#f59e0b',
    prompt: 'Out of the four input pairs, which one raises the Carry output to 1?',
    options: [
      'A = 0, B = 1',
      'A = 1, B = 0',
      'A = 1, B = 1 only',
      'Any pair where at least one input is 1',
    ],
    correct: 2,
    explain:
      'Only 1 + 1 breaches the bowl\'s capacity of one. That single row - the Overflow State - is the only time a marble lands in the Carry tray.',
  },
  {
    id: 'p5',
    badge: 'SUM GATE',
    badgeColor: '#a78bfa',
    prompt: 'Which gate computes the Sum, and why is plain OR the wrong choice?',
    options: [
      'OR - it already gives 1 whenever any input is active',
      'XOR - because OR would wrongly output 1 on the 1,1 case, but the Sum must be 0 there',
      'AND - because the Sum needs both inputs active',
      'NOT - because the Sum is the opposite of the inputs',
    ],
    correct: 1,
    explain:
      'XOR outputs 1 if exactly one input is active and 0 if both or neither are. On 1,1 the Sum digit must be 0 (two is 10), and OR would wrongly report 1 - so XOR is the Sum wire.',
  },
  {
    id: 'p6',
    badge: 'CARRY GATE',
    badgeColor: '#ec4899',
    prompt: 'Which gate drives the Carry output of a half adder?',
    options: [
      'XOR, the same gate that drives the Sum',
      'OR - any active input causes a carry',
      'NAND - the carry is active-low',
      'AND - C = A · B, firing only when both inputs are active',
    ],
    correct: 3,
    explain:
      'The AND gate outputs 1 only if both A and B are active at the same time. It is the overflow tray in silicon: it only receives a sphere when the system is overwhelmed.',
  },
  {
    id: 'p7',
    badge: 'FORMULA',
    badgeColor: '#60a5fa',
    prompt: 'S = A ⊕ B. Which sum-of-products expression is it equal to?',
    options: [
      "A'B + AB'",
      "AB + A'B'",
      "A + B",
      "A'B' only",
    ],
    correct: 0,
    explain:
      "Read it as \"A off and B on, or A on and B off\" - the two single-marble cases. A'B + AB' is exactly the rows where the inputs differ, which is what XOR detects.",
  },
  {
    id: 'p8',
    badge: 'FAN-OUT',
    badgeColor: '#2dd4bf',
    prompt: 'In the wiring blueprint, input A and input B each connect to...',
    options: [
      'Only the XOR gate - the AND taps the XOR output',
      'Only the AND gate - the XOR taps the AND output',
      'Both gates at once - each input wire fans out to XOR and AND',
      'A shared selector that routes them to one gate at a time',
    ],
    correct: 2,
    explain:
      'Each input wire splits and feeds both gates simultaneously. The XOR copy decides the Sum while the AND copy watches for overflow - the two gates work in parallel, not in series.',
  },
  {
    id: 'p9',
    badge: 'BLACK BOX',
    badgeColor: '#facc15',
    prompt: 'The wiring is sealed inside a block stamped "HA". What does this abstraction buy an engineer?',
    options: [
      'It makes the circuit physically smaller on the chip',
      'They can use the block by its rule alone, without re-thinking the internal gates',
      'It removes the need for the Carry output',
      'It converts the circuit from combinational to sequential',
    ],
    correct: 1,
    explain:
      'Once the behavior is trusted, the internals stop mattering. You hand the block two bits and trust it does the addition - and you build bigger machines out of these sealed blocks.',
  },
  {
    id: 'p10',
    badge: 'WHY HALF',
    badgeColor: '#f87171',
    prompt: 'Adding 15 + 27 column by column, the half adder fails. What is it missing?',
    options: [
      'A second Sum output for wider numbers',
      'A clock input to pace the columns',
      'A Carry-In input - a full adder (two HAs plus an OR gate) has one',
      'Faster gates - it is too slow for multi-digit numbers',
    ],
    correct: 2,
    explain:
      'The half adder has a Carry-OUT but no wire to receive a Carry-IN from the previous column, so it cannot chain. Two half adders plus an OR gate form a Full Adder, which can.',
  },
];

export const S11_Practice: React.FC<Props> = ({ isDarkMode }) => {
  const [idx, setIdx] = useState(0);
  const [picks, setPicks] = useState<(number | null)[]>(PROBLEMS.map(() => null));
  const [revealed, setRevealed] = useState<boolean[]>(PROBLEMS.map(() => false));

  const current = PROBLEMS[idx];
  const score = picks.reduce<number>((acc, p, i) => acc + (p === PROBLEMS[i].correct ? 1 : 0), 0);
  const attempted = revealed.filter(Boolean).length;
  const percent = Math.round((score / PROBLEMS.length) * 100);
  const allDone = revealed.every(Boolean);

  const reset = () => { setPicks(PROBLEMS.map(() => null)); setRevealed(PROBLEMS.map(() => false)); setIdx(0); };

  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';

  return (
    <div className="max-w-6xl mx-auto space-y-12 py-4">
      {/* Header */}
      <section className="space-y-3">
        <div className="font-mono text-[10px] tracking-[0.4em] uppercase text-amber-400">
          Final Chapter · Practice Arena
        </div>
        <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>
          Boss Drill - {PROBLEMS.length} Problems
        </h2>
        <p className={`text-base max-w-3xl ${subText}`}>
          The wooden box, the marble in the bowl, the overflow tray, the two gates and the sealed
          HA block - every beat of the module is in here. Each question explains itself the
          instant you answer. Aim for {PROBLEMS.length}/{PROBLEMS.length}.
        </p>
      </section>

      {/* Score banner */}
      <div className={`p-5 rounded-3xl border flex items-center justify-between gap-4 flex-wrap ${cardBg}`}>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/15 border border-amber-400/40 flex items-center justify-center">
            <Trophy size={26} className="text-amber-400" />
          </div>
          <div>
            <div className="font-mono text-[10px] uppercase tracking-widest opacity-50">Progress</div>
            <div className={`text-lg font-black ${textColor}`}>
              {attempted} / {PROBLEMS.length} attempted
              <span className={`ml-3 text-sm font-mono ${score === PROBLEMS.length ? 'text-emerald-400' : 'text-amber-400'}`}>
                {score} correct ({percent}%)
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {PROBLEMS.map((_, i) => {
            const r = revealed[i];
            const c = r && picks[i] === PROBLEMS[i].correct;
            const w = r && picks[i] !== PROBLEMS[i].correct;
            return (
              <button
                key={i}
                onClick={() => setIdx(i)}
                className={`w-8 h-8 rounded-lg font-mono text-xs font-black border transition-all ${
                  i === idx
                    ? 'border-amber-400 bg-amber-500/20 text-amber-300'
                    : c
                      ? 'border-emerald-400/60 bg-emerald-500/10 text-emerald-300'
                      : w
                        ? 'border-rose-400/60 bg-rose-500/10 text-rose-300'
                        : isDarkMode
                          ? 'border-white/10 text-slate-400 hover:border-amber-400'
                          : 'border-slate-200 text-slate-500 hover:border-amber-400'
                }`}
              >
                {i + 1}
              </button>
            );
          })}
          <button
            onClick={reset}
            className={`ml-2 p-2 rounded-lg border ${
              isDarkMode ? 'border-white/10 hover:border-amber-400' : 'border-slate-200 hover:border-amber-400'
            }`}
            title="Reset all"
          >
            <RotateCcw size={14} className="text-amber-400" />
          </button>
        </div>
      </div>

      {/* Active problem */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className={`p-8 rounded-3xl border ${cardBg}`}
        >
          <div className="flex items-center gap-3 mb-4">
            <span
              className="px-3 py-1 rounded-full font-mono text-[9px] font-black uppercase tracking-widest"
              style={{
                background: `${current.badgeColor}1a`,
                color: current.badgeColor,
                border: `1px solid ${current.badgeColor}55`,
              }}
            >
              {current.badge}
            </span>
            <span className={`font-mono text-[10px] ${subText}`}>
              Problem {idx + 1} of {PROBLEMS.length}
            </span>
          </div>

          <h3 className={`text-xl md:text-2xl font-bold leading-snug mb-6 ${textColor}`}>
            {current.prompt}
          </h3>

          {/* Options */}
          <div className="grid sm:grid-cols-2 gap-3 mb-4">
            {current.options.map((opt, oi) => {
              const picked = picks[idx] === oi;
              const correct = current.correct === oi;
              const show = revealed[idx];
              return (
                <button
                  key={oi}
                  onClick={() => {
                    setPicks(p => p.map((v, j) => j === idx ? oi : v));
                    setRevealed(r => r.map((v, j) => j === idx ? true : v));
                  }}
                  className={`text-left px-5 py-4 rounded-2xl font-mono text-sm border-2 transition-all ${
                    show && correct
                      ? 'bg-emerald-500/15 border-emerald-400 text-emerald-200'
                      : show && picked && !correct
                        ? 'bg-rose-500/15 border-rose-400 text-rose-200'
                        : picked
                          ? 'bg-amber-500/15 border-amber-400 text-amber-200'
                          : isDarkMode
                            ? 'bg-white/5 border-white/10 text-slate-300 hover:border-amber-400'
                            : 'bg-white border-slate-200 text-slate-700 hover:border-amber-400'
                  }`}
                >
                  <span className="opacity-50 mr-2">{String.fromCharCode(65 + oi)}.</span>
                  {opt}
                  {show && correct && <CheckCircle2 size={14} className="inline ml-2" />}
                  {show && picked && !correct && <XCircle size={14} className="inline ml-2" />}
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          <AnimatePresence>
            {revealed[idx] && (
              <motion.div
                initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className={`mt-3 p-4 rounded-2xl ${
                  isDarkMode ? 'bg-black/40 border border-white/10' : 'bg-slate-50 border border-slate-200'
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-amber-400 shrink-0 pt-0.5">
                    walkthrough
                  </span>
                  <p className={`text-[13px] leading-relaxed ${textColor}`}>{current.explain}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Inline navigation */}
          <div className="flex items-center justify-between mt-6">
            <button
              onClick={() => setIdx(i => Math.max(0, i - 1))}
              disabled={idx === 0}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-black uppercase tracking-widest border ${
                idx === 0
                  ? 'opacity-30 cursor-not-allowed border-slate-200 dark:border-white/5'
                  : isDarkMode
                    ? 'border-white/10 hover:border-amber-400'
                    : 'border-slate-200 hover:border-amber-400'
              } ${textColor}`}
            >
              <ChevronLeft size={14} /> prev
            </button>
            <button
              onClick={() => setIdx(i => Math.min(PROBLEMS.length - 1, i + 1))}
              disabled={idx === PROBLEMS.length - 1}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-black uppercase tracking-widest border ${
                idx === PROBLEMS.length - 1
                  ? 'opacity-30 cursor-not-allowed border-slate-200 dark:border-white/5'
                  : isDarkMode
                    ? 'border-amber-400/40 hover:border-amber-400 text-amber-300'
                    : 'border-amber-300 hover:border-amber-400 text-amber-700'
              }`}
            >
              next <ChevronRight size={14} />
            </button>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Exam-sheet reference: standard definitions behind the drill */}
      <section className={`p-8 rounded-3xl border ${cardBg}`}>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-400/40 flex items-center justify-center shrink-0">
            <BookOpen size={18} className="text-amber-400" />
          </div>
          <div>
            <div className="font-mono text-[10px] tracking-[0.4em] uppercase text-amber-400">
              Reference · Exam Sheet
            </div>
            <h3 className={`text-lg font-black ${textColor}`}>The standard definitions behind every question</h3>
          </div>
        </div>
        <p className={`text-sm mb-6 ${subText}`}>
          These are the textbook statements the drill is testing. If a question tripped you up,
          find its term here, read the definition once, then retry the question.
        </p>
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            {
              term: 'Half adder',
              def: 'A combinational circuit that adds two 1-bit inputs, A and B, producing two outputs: Sum = A ⊕ B and Carry = A · B. It has no Carry-In, which is why it is only "half" an adder.',
            },
            {
              term: 'Binary overflow',
              def: 'Binary has only the digits 0 and 1, so 1 + 1 cannot be written "2". Two is written 10: the 0 stays in the Sum column and the 1 is pushed to the Carry - the Overflow State.',
            },
            {
              term: 'XOR gate (the Sum wire)',
              def: 'Exclusive-OR outputs 1 if exactly one input is active, and 0 if both or neither are. S = A ⊕ B, equivalently the sum-of-products form A\'B + AB\' (the prime marks a complemented input).',
            },
            {
              term: 'AND gate (the Carry wire)',
              def: 'Outputs 1 only if input A AND input B are active simultaneously: C = A · B. It is the overflow tray of the circuit - it only fires on the single 1,1 row of the truth table.',
            },
            {
              term: 'Black box abstraction',
              def: 'Sealing the XOR + AND wiring inside a block stamped "HA". Once the block\'s rule is trusted, engineers use it without re-thinking the internal gates, and build larger circuits from such blocks.',
            },
            {
              term: 'Full adder',
              def: 'Two half adders plus an OR gate. It adds A, B and a Carry-In, so adders can chain column by column. Chaining billions of them builds the arithmetic processors in every computer.',
            },
          ].map(row => (
            <div
              key={row.term}
              className={`p-4 rounded-2xl border ${
                isDarkMode ? 'bg-black/40 border-white/10' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <span className="inline-block px-2.5 py-1 mb-2 rounded-full font-mono text-[9px] font-black uppercase tracking-widest bg-amber-500/15 text-amber-400 border border-amber-400/40">
                {row.term}
              </span>
              <p className={`text-[13px] leading-relaxed ${subText}`}>{row.def}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Final-state callout */}
      {allDone && (
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          className={`p-6 rounded-3xl border-2 text-center ${
            score === PROBLEMS.length
              ? (isDarkMode ? 'bg-emerald-500/10 border-emerald-400/50' : 'bg-emerald-50 border-emerald-400')
              : (isDarkMode ? 'bg-amber-500/10 border-amber-400/50' : 'bg-amber-50 border-amber-400')
          }`}
        >
          <Swords size={28} className={`mx-auto mb-2 ${score === PROBLEMS.length ? 'text-emerald-400' : 'text-amber-400'}`} />
          <h4 className={`text-xl font-black mb-2 ${textColor}`}>
            {score === PROBLEMS.length
              ? 'Flawless run - the box holds no more secrets.'
              : score >= Math.ceil(PROBLEMS.length * 0.6)
                ? `Solid run - ${score}/${PROBLEMS.length}. Review the misses, then advance.`
                : `${score}/${PROBLEMS.length} - replay the chapters with the missed concepts before moving on.`}
          </h4>
          <p className={`text-sm ${subText}`}>
            Complex computing is just a series of simple overflowing boxes. Hop back to any chapter
            from the sidebar, or hit Complete to return to the portal.
          </p>
        </motion.div>
      )}
    </div>
  );
};
