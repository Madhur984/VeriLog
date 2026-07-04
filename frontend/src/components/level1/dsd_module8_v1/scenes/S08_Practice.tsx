import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Swords, CheckCircle2, XCircle, Trophy, ChevronRight, ChevronLeft, RotateCcw, BookOpen } from 'lucide-react';
import { TryItYourself } from '../../../ui/TryItYourself';

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
    prompt: 'What exactly does a full adder do?',
    options: [
      'Adds three 1-bit inputs (A, B, Cin) and outputs a Sum and a Carry-out',
      'Adds two 1-bit inputs and outputs a Sum and a Carry',
      'Adds two full bytes in a single step',
      'Stores the carry bit between two clock cycles',
    ],
    correct: 0,
    explain:
      'The full adder consolidates THREE one-bit inputs - Operand A, Operand B and the Carry-in - into two outputs: the Sum digit for this column and the Carry-out for the next. The third input is what makes it "full".',
  },
  {
    id: 'p2',
    badge: 'THE THIRD WIRE',
    badgeColor: '#34d399',
    prompt: 'What exactly arrives on the Cin input?',
    options: [
      'A clock pulse that paces the addition',
      'The carry-out produced by the previous, less significant column',
      'A control bit that switches between add and subtract',
      'A copy of input A, for error checking',
    ],
    correct: 1,
    explain:
      'Cin receives the Cout of the column to its right. That hand-off is exactly how written column addition works - and the half adder\'s lack of this input is the entire reason the full adder exists.',
  },
  {
    id: 'p3',
    badge: 'SUM RULE',
    badgeColor: '#22d3ee',
    prompt: 'The Sum output S is TRUE precisely when...',
    options: [
      'at least one of the three inputs is TRUE',
      'all three inputs are TRUE',
      'an odd number of the three inputs are TRUE',
      'exactly one input is TRUE',
    ],
    correct: 2,
    explain:
      'S = A ⊕ B ⊕ Cin is strict modulo-2 addition: the output is TRUE only when an ODD number of inputs (one or three) are TRUE. Two active inputs leave through the carry instead, making S = 0.',
  },
  {
    id: 'p4',
    badge: 'FORMULA',
    badgeColor: '#a78bfa',
    prompt: 'Which expression drives the Sum wire?',
    options: [
      'S = A · B · Cin',
      'S = A ⊕ B ⊕ Cin',
      'S = (A + B) · Cin',
      'S = A ⊕ B + Cin',
    ],
    correct: 1,
    explain:
      'The Sum is the triple XOR - the chained exclusive-OR of all three inputs. In hardware it is usually built as two 2-input XOR gates in a row: (A ⊕ B) first, then ⊕ Cin.',
  },
  {
    id: 'p5',
    badge: 'CARRY RULE',
    badgeColor: '#f59e0b',
    prompt: 'The Carry-out Cout fires when...',
    options: [
      'any single input is TRUE',
      'only when all three inputs are TRUE',
      'any two - or all three - inputs are TRUE',
      'the inputs disagree with each other',
    ],
    correct: 2,
    explain:
      'Cout is the Boolean MAJORITY function: it evaluates TRUE when the 1s have a majority - any two inputs, or all three. Two 1s make 10 in binary, so a pair always overflows into the carry.',
  },
  {
    id: 'p6',
    badge: 'FORMULA',
    badgeColor: '#f59e0b',
    prompt: 'Which sum-of-products expression equals Cout?',
    options: [
      'A·B + A·Cin + B·Cin',
      'A·B·Cin',
      'A + B + Cin',
      '(A ⊕ B) · (B ⊕ Cin)',
    ],
    correct: 0,
    explain:
      'One AND term per possible pair - AB, ACin, BCin - merged by OR. If any pair is fully active, the column has overflowed and Cout = 1. Three inputs make exactly three pairs, so nothing is missing.',
  },
  {
    id: 'p7',
    badge: 'EXTREME ROW',
    badgeColor: '#fb7185',
    prompt: 'A = 1, B = 1, Cin = 1. What do the outputs read?',
    options: [
      'S = 0, Cout = 1 - the pair carries, nothing remains',
      'S = 1, Cout = 1 - three is 11 in binary',
      'S = 1, Cout = 0 - the odd one out stays put',
      'S = 0, Cout = 0 - the inputs cancel out',
    ],
    correct: 1,
    explain:
      '1 + 1 + 1 = 3, written 11 in binary. The high bit (1) leaves as Cout and the low bit (1) stays as S. It is the only row where BOTH outputs light - odd count satisfies XOR, majority satisfies the carry.',
  },
  {
    id: 'p8',
    badge: 'ARCHITECTURE',
    badgeColor: '#a78bfa',
    prompt: 'The modular full adder is synthesized from which parts?',
    options: [
      'Three half adders in a triangle',
      'One half adder and two OR gates',
      'Two half adders cascaded, unified by a terminal OR gate',
      'A single 3-input XOR gate - nothing else is needed',
    ],
    correct: 2,
    explain:
      'HA1 computes the partial sum and carry of A and B; HA2 integrates Cin with the partial sum to produce the final Sum; the OR gate converges the two partial carries into Cout. Two trusted blocks plus one gate.',
  },
  {
    id: 'p9',
    badge: 'THE OR GATE',
    badgeColor: '#34d399',
    prompt: 'Why is a plain OR gate safe for merging the two partial carries C1 and C2?',
    options: [
      'It is not - a real design needs XOR there',
      'C1 and C2 can never both be 1 at the same time, so OR merges them without loss',
      'Because OR gates are faster than AND gates',
      'The OR gate also doubles as the Sum output',
    ],
    correct: 1,
    explain:
      'C1 = A·B fires only when A and B are both 1 - but then P = A ⊕ B = 0, so C2 = P·Cin must be 0. The two carries are mutually exclusive, making the humble OR a lossless merger.',
  },
  {
    id: 'p10',
    badge: 'CASCADING',
    badgeColor: '#f59e0b',
    prompt: 'How do full adders add two 32-bit numbers?',
    options: [
      'One full adder loops 32 times over the same wires',
      '32 full adders chain: each Cout feeds the next stage\'s Cin, rippling the carry along',
      'They cannot - multi-bit addition needs a different circuit entirely',
      '16 full adders run in parallel, each handling two bits',
    ],
    correct: 1,
    explain:
      'This is the imperative behind the whole design: Cout propagates to the next Cin, so one-bit adders cascade into a ripple-carry adder of any width. The half adder\'s missing input made this impossible.',
  },
];

export const S08_Practice: React.FC<Props> = ({ isDarkMode }) => {
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
        <div className="font-mono text-[10px] tracking-[0.4em] uppercase text-violet-400">
          Chapter 09 · Practice Arena
        </div>
        <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>
          Boss Drill - {PROBLEMS.length} Problems
        </h2>
        <p className={`text-base max-w-3xl ${subText}`}>
          The interface, both formulas, the eight rows, the two-half-adder build and the ripple
          chain - every beat of the module is in here. Each question explains itself the
          instant you answer. Aim for {PROBLEMS.length}/{PROBLEMS.length}.
        </p>
      </section>

      {/* Score banner */}
      <TryItYourself />
      <div className={`p-5 rounded-3xl border flex items-center justify-between gap-4 flex-wrap ${cardBg}`}>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-violet-500/15 border border-violet-400/40 flex items-center justify-center">
            <Trophy size={26} className="text-violet-400" />
          </div>
          <div>
            <div className="font-mono text-[10px] uppercase tracking-widest opacity-50">Progress</div>
            <div className={`text-lg font-black ${textColor}`}>
              {attempted} / {PROBLEMS.length} attempted
              <span className={`ml-3 text-sm font-mono ${score === PROBLEMS.length ? 'text-emerald-400' : 'text-violet-400'}`}>
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
                    ? isDarkMode ? 'border-violet-400 bg-violet-500/20 text-violet-300' : 'border-violet-400 bg-violet-500/20 text-violet-700'
                    : c
                      ? isDarkMode ? 'border-emerald-400/60 bg-emerald-500/10 text-emerald-300' : 'border-emerald-400/60 bg-emerald-500/10 text-emerald-700'
                      : w
                        ? isDarkMode ? 'border-rose-400/60 bg-rose-500/10 text-rose-300' : 'border-rose-400/60 bg-rose-500/10 text-rose-700'
                        : isDarkMode
                          ? 'border-white/10 text-slate-400 hover:border-violet-400'
                          : 'border-slate-200 text-slate-500 hover:border-violet-400'
                }`}
              >
                {i + 1}
              </button>
            );
          })}
          <button
            onClick={reset}
            className={`ml-2 p-2 rounded-lg border ${
              isDarkMode ? 'border-white/10 hover:border-violet-400' : 'border-slate-200 hover:border-violet-400'
            }`}
            title="Reset all"
          >
            <RotateCcw size={14} className="text-violet-400" />
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
                      ? isDarkMode ? 'bg-emerald-500/15 border-emerald-400 text-emerald-200' : 'bg-emerald-500/15 border-emerald-500 text-emerald-800'
                      : show && picked && !correct
                        ? isDarkMode ? 'bg-rose-500/15 border-rose-400 text-rose-200' : 'bg-rose-500/15 border-rose-500 text-rose-800'
                        : picked
                          ? isDarkMode ? 'bg-violet-500/15 border-violet-400 text-violet-200' : 'bg-violet-500/15 border-violet-500 text-violet-800'
                          : isDarkMode
                            ? 'bg-white/5 border-white/10 text-slate-300 hover:border-violet-400'
                            : 'bg-white border-slate-200 text-slate-700 hover:border-violet-400'
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
                  <span className="font-mono text-[10px] uppercase tracking-widest text-violet-400 shrink-0 pt-0.5">
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
                  ? `opacity-30 cursor-not-allowed ${isDarkMode ? 'border-white/5' : 'border-slate-200'}`
                  : isDarkMode
                    ? 'border-white/10 hover:border-violet-400'
                    : 'border-slate-200 hover:border-violet-400'
              } ${textColor}`}
            >
              <ChevronLeft size={14} /> prev
            </button>
            <button
              onClick={() => setIdx(i => Math.min(PROBLEMS.length - 1, i + 1))}
              disabled={idx === PROBLEMS.length - 1}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-black uppercase tracking-widest border ${
                idx === PROBLEMS.length - 1
                  ? `opacity-30 cursor-not-allowed ${isDarkMode ? 'border-white/5' : 'border-slate-200'}`
                  : isDarkMode
                    ? 'border-violet-400/40 hover:border-violet-400 text-violet-300'
                    : 'border-violet-300 hover:border-violet-400 text-violet-700'
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
          <div className="w-10 h-10 rounded-2xl bg-violet-500/15 border border-violet-400/40 flex items-center justify-center shrink-0">
            <BookOpen size={18} className="text-violet-400" />
          </div>
          <div>
            <div className="font-mono text-[10px] tracking-[0.4em] uppercase text-violet-400">
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
              term: 'Full adder',
              def: 'A combinational circuit that adds three 1-bit inputs - A, B and Carry-in - producing Sum = A ⊕ B ⊕ Cin and Carry-out = AB + ACin + BCin. The Cin port is what makes it "full".',
            },
            {
              term: 'Sum rule (modulo-2)',
              def: 'S is TRUE only when an odd number of the three inputs are TRUE. Equivalent to (A + B + Cin) mod 2, computed by a chained XOR.',
            },
            {
              term: 'Carry rule (majority)',
              def: 'Cout is TRUE when any two or all three inputs are TRUE - the Boolean majority function, built from one AND per input pair feeding an OR.',
            },
            {
              term: 'Modular architecture',
              def: 'HA1 adds A and B (partial sum P, partial carry C1). HA2 adds Cin to P (final S, partial carry C2). A terminal OR merges C1 and C2 into Cout.',
            },
            {
              term: 'Mutually exclusive carries',
              def: 'C1 = A·B and C2 = (A ⊕ B)·Cin can never both be 1: if A·B = 1 then A ⊕ B = 0. That is why the merging gate can be a plain OR.',
            },
            {
              term: 'Ripple-carry adder',
              def: 'N full adders chained Cout→Cin add two N-bit numbers. The carry ripples through every stage - the direct hardware copy of column addition.',
            },
          ].map(row => (
            <div
              key={row.term}
              className={`p-4 rounded-2xl border ${
                isDarkMode ? 'bg-black/40 border-white/10' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <span className="inline-block px-2.5 py-1 mb-2 rounded-full font-mono text-[9px] font-black uppercase tracking-widest bg-violet-500/15 text-violet-400 border border-violet-400/40">
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
              : (isDarkMode ? 'bg-violet-500/10 border-violet-400/50' : 'bg-violet-50 border-violet-400')
          }`}
        >
          <Swords size={28} className={`mx-auto mb-2 ${score === PROBLEMS.length ? 'text-emerald-400' : 'text-violet-400'}`} />
          <h4 className={`text-xl font-black mb-2 ${textColor}`}>
            {score === PROBLEMS.length
              ? 'Flawless run - the adder holds no more secrets.'
              : score >= Math.ceil(PROBLEMS.length * 0.6)
                ? `Solid run - ${score}/${PROBLEMS.length}. Review the misses, then advance.`
                : `${score}/${PROBLEMS.length} - replay the chapters with the missed concepts before moving on.`}
          </h4>
          <p className={`text-sm ${subText}`}>
            One chapter left: the workbench is waiting, and this time you are building the
            whole machine. Hop back to any chapter from the sidebar, or push on to the build.
          </p>
        </motion.div>
      )}
    </div>
  );
};
