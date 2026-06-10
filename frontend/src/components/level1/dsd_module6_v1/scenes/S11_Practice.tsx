import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Swords, CheckCircle2, XCircle, Trophy, ChevronRight, ChevronLeft, RotateCcw } from 'lucide-react';

interface Props { isActive: boolean; isDarkMode: boolean; }

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
    badge: 'THE WATCH',
    badgeColor: '#22d3ee',
    prompt: 'Which kind of circuit runs the digital watch on your wrist?',
    options: [
      'Combinational - it only does instant math',
      'Sequential - it must remember the time',
      'Neither - a watch has no logic circuit',
      'Both kinds work equally well',
    ],
    correct: 1,
    explain:
      'A watch has to hold the current time between ticks. Holding a value is memory, and memory means sequential.',
  },
  {
    id: 'p2',
    badge: 'SCOREBOARD',
    badgeColor: '#34d399',
    prompt: 'The board shows 154. The umpire signals +4. Which one is the PAST STATE?',
    options: ['+4', '154', '158', 'The umpire'],
    correct: 1,
    explain:
      '154 is what the board already remembers. +4 is the present input. Past state + present input = next state, so the board flips to 158.',
  },
  {
    id: 'p3',
    badge: 'SPOT THE TYPE',
    badgeColor: '#a78bfa',
    prompt: 'Which of these is a combinational circuit?',
    options: ['Counter', 'Multiplexer (MUX)', 'Register', 'RAM'],
    correct: 1,
    explain:
      'A MUX just routes A or B to the output based on the select line. No memory needed. Counters, registers and RAM all store state.',
  },
  {
    id: 'p4',
    badge: 'DEFINITION',
    badgeColor: '#f43f5e',
    prompt: '"Output depends only on the present inputs" describes which circuit?',
    options: ['Sequential', 'Combinational', 'Synchronous', 'Asynchronous'],
    correct: 1,
    explain:
      'No history, no stored state. Change the inputs and the output follows instantly, delayed only by gate speed. That is combinational.',
  },
  {
    id: 'p5',
    badge: 'MEMORY TRICK',
    badgeColor: '#f59e0b',
    prompt: 'What physically lets a sequential circuit remember?',
    options: [
      'A bigger power supply',
      'Faster gates',
      'A feedback loop into memory elements',
      'More input wires',
    ],
    correct: 2,
    explain:
      'Wire a gate output back into another gate input. The loop locks onto a 1 or a 0 and holds it until told to change.',
  },
  {
    id: 'p6',
    badge: 'THE CLOCK',
    badgeColor: '#ec4899',
    prompt: 'What does the clock do in a sequential circuit?',
    options: [
      'Makes the circuit run faster and hotter',
      'Lets state update only on the tick so everything stays in sync',
      'Stores the past state itself',
      'Replaces the need for memory',
    ],
    correct: 1,
    explain:
      'The clock is a metronome. Stored state changes only on the tick, so billions of operations stay in step and data never collides.',
  },
  {
    id: 'p7',
    badge: 'TEA STALL',
    badgeColor: '#0ea5e9',
    prompt: 'Why can the tea vendor not total your monthly bill?',
    options: [
      'He is bad at math',
      'Tea prices change every day',
      'He stores no state - nothing is remembered between orders',
      'He has too many customers',
    ],
    correct: 2,
    explain:
      'He works only on what is in his hands right now. A memoryless system cannot count, track a sequence, or hold a value once the inputs vanish.',
  },
  {
    id: 'p8',
    badge: 'FLIP-FLOPS',
    badgeColor: '#10b981',
    prompt: 'Flip-flops are built from...',
    options: [
      'Special memory atoms',
      'Ordinary combinational gates cross-wired in a feedback loop',
      'Tiny batteries',
      'Clock crystals',
    ],
    correct: 1,
    explain:
      'Cross-wire plain gates so one output feeds the other input. The loop traps a bit and holds it. Memory emerges from memoryless parts.',
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
          Boss Drill - 8 Problems
        </h2>
        <p className={`text-base max-w-3xl ${subText}`}>
          Now vs Then, the scoreboard, the tea stall, the trap and the clock.
          Each question explains itself the instant you answer. Aim for 8/8.
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
                  ? 'opacity-30 cursor-not-allowed border-white/5'
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
                  ? 'opacity-30 cursor-not-allowed border-white/5'
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
              ? 'Flawless run - Boss defeated.'
              : score >= 5
                ? `Solid run - ${score}/${PROBLEMS.length}. Review the misses, then advance.`
                : `${score}/${PROBLEMS.length} - replay the chapters with the missed concepts before moving on.`}
          </h4>
          <p className={`text-sm ${subText}`}>
            Hop back to any chapter from the sidebar at any time, or hit Complete to return to the portal.
          </p>
        </motion.div>
      )}
    </div>
  );
};
