import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Check, X, Repeat, Trophy, Grid3x3, Cpu, Timer, Flame } from 'lucide-react';

interface Props { isActive: boolean; isDarkMode: boolean; }

type Bit = 0 | 1;

interface Q1 {
  prompt: string;
  options: string[];
  correctIndex: number;
  explain: string;
}

const REVERSE_QUIZ: Q1[] = [
  {
    prompt: 'A circuit feeds A and B into an AND, B and C into another AND, and ORs both. What is Y?',
    options: ['Y = AB + BC', 'Y = AB · BC', 'Y = (A+B)(B+C)', 'Y = ABC'],
    correctIndex: 0,
    explain: 'Each AND gate is a product term. The final OR sums them: Y = A·B + B·C.',
  },
  {
    prompt: 'A NOT inverts A. The result is AND-ed with B. The output is OR-ed with C. What is Y?',
    options: ["Y = A'B + C", "Y = A' + B + C", "Y = A'BC", "Y = (A+B)' + C"],
    correctIndex: 0,
    explain: "NOT(A) = A'. Then A'·B is the product term. Final OR with C gives Y = A'·B + C.",
  },
  {
    prompt: 'Y = A·B + A·B′ simplifies to:',
    options: ['Y = A', 'Y = B', 'Y = AB', "Y = A + B'"],
    correctIndex: 0,
    explain: "Factor: A·(B + B') = A·1 = A. The B variable disappears — that's K-Map intuition.",
  },
];

interface ForwardSpec {
  label: string;
  truth: Bit[]; // length 8 for 3 vars
  varNames: [string, string, string];
}

const FORWARDS: ForwardSpec[] = [
  {
    label: 'Majority of A, B, C',
    varNames: ['A', 'B', 'C'],
    // m3, m5, m6, m7
    truth: [0, 0, 0, 1, 0, 1, 1, 1],
  },
  {
    label: 'Odd-parity of A, B, C',
    varNames: ['A', 'B', 'C'],
    // m1, m2, m4, m7
    truth: [0, 1, 1, 0, 1, 0, 0, 1],
  },
  {
    label: 'A AND (B OR C)',
    varNames: ['A', 'B', 'C'],
    // m4 wrong - actually A·(B+C): rows where A=1 and (B|C)
    // i: A B C → A·(B|C): m5(101)=1, m6(110)=1, m7(111)=1
    truth: [0, 0, 0, 0, 0, 1, 1, 1],
  },
];

const minterms = (truth: Bit[]) => truth
  .map((v, i) => (v === 1 ? i : -1))
  .filter((i) => i >= 0);

// ── Drill 04 — K-Map Grouping Challenge ──
interface KMapPuzzle {
  prompt: string;
  // 3-var truth table indexed by minterm number (0..7) — A=msb
  truth: Bit[];
  options: string[];
  correctIndex: number;
  explain: string;
}

const KMAP_PUZZLES: KMapPuzzle[] = [
  {
    prompt: 'Which simplified SOP covers Σm(0, 1, 4, 5)?',
    truth: [1, 1, 0, 0, 1, 1, 0, 0],
    options: ["Y = B'", "Y = A'B'", "Y = AB'", "Y = A + B'"],
    correctIndex: 0,
    explain: 'All four 1s share B = 0; A and C both vary. Wing of size 4 ⇒ Y = B′.',
  },
  {
    prompt: 'Which simplified SOP covers Σm(2, 3, 6, 7)?',
    truth: [0, 0, 1, 1, 0, 0, 1, 1],
    options: ['Y = B', 'Y = AB', "Y = B'C", "Y = A + B"],
    correctIndex: 0,
    explain: 'All 1s sit in the B = 1 column-pair. A and C both vary across the wing. Y = B.',
  },
  {
    prompt: 'Which simplified SOP covers Σm(0, 2, 4, 6)?',
    truth: [1, 0, 1, 0, 1, 0, 1, 0],
    options: ["Y = C'", "Y = A'", "Y = B'", "Y = AC'"],
    correctIndex: 0,
    explain: 'Every minterm has C = 0; A and B vary freely. The 4-cell wing collapses to Y = C′.',
  },
  {
    prompt: 'Which simplified SOP covers Σm(1, 3, 5, 7)?',
    truth: [0, 1, 0, 1, 0, 1, 0, 1],
    options: ['Y = C', "Y = A'", "Y = B'C", "Y = AB + C"],
    correctIndex: 0,
    explain: 'All four 1s have C = 1; the rest cancels. Y = C.',
  },
  {
    prompt: 'Which simplified SOP covers Σm(3, 7)?',
    truth: [0, 0, 0, 1, 0, 0, 0, 1],
    options: ['Y = BC', 'Y = AC', 'Y = AB', "Y = B'C"],
    correctIndex: 0,
    explain: 'Both minterms have B = 1, C = 1; A varies. Pair ⇒ Y = B·C.',
  },
];

// ── Drill 06 — Circuit ↔ Truth Table Match ──
interface CircuitMatch {
  label: string;
  // Index of the correct truth table within `options`
  // Each option is an 8-row truth table for inputs (A,B,C)
  correctIndex: number;
  // Boolean function as a JS-style fn for runtime evaluation
  fn: (a: Bit, b: Bit, c: Bit) => Bit;
  // Three candidate truth tables (one correct)
  options: Bit[][];
  explain: string;
}

const buildTT = (fn: (a: Bit, b: Bit, c: Bit) => Bit): Bit[] =>
  Array.from({ length: 8 }, (_, i) => {
    const a = ((i >> 2) & 1) as Bit;
    const b = ((i >> 1) & 1) as Bit;
    const c = (i & 1) as Bit;
    return fn(a, b, c);
  });

const CIRCUIT_MATCHES: CircuitMatch[] = [
  {
    label: "Y = A · B + C'",
    fn: (a, b, c) => (((a && b) || (c === 0 ? 1 : 0)) ? 1 : 0),
    correctIndex: 1,
    explain: "A·B is 1 when both A and B are 1; C' is 1 when C = 0. Y is the OR of those.",
    options: [
      buildTT((a, b, c) => ((a && b && (c === 0 ? 1 : 0)) ? 1 : 0)),         // A·B·C'
      buildTT((a, b, c) => (((a && b) || (c === 0 ? 1 : 0)) ? 1 : 0)),       // correct
      buildTT((a, b, c) => (((a || b) && (c === 0 ? 1 : 0)) ? 1 : 0)),       // (A+B)·C'
    ],
  },
  {
    label: "Y = (A + B) · C",
    fn: (a, b, c) => (((a || b) && c) ? 1 : 0),
    correctIndex: 2,
    explain: 'OR first, then AND with C. Output is 1 only when C = 1 AND at least one of A, B is 1.',
    options: [
      buildTT((a, b, c) => ((a || b || c) ? 1 : 0)),                          // A+B+C
      buildTT((a, b, c) => ((a && b && c) ? 1 : 0)),                          // A·B·C
      buildTT((a, b, c) => (((a || b) && c) ? 1 : 0)),                        // correct
    ],
  },
  {
    label: "Y = A'B + AB' (XOR pattern on A,B)",
    fn: (a, b) => (((a === 0 && b === 1) || (a === 1 && b === 0)) ? 1 : 0),
    correctIndex: 0,
    explain: 'A and B disagree → 1. C is irrelevant; both rows for any (A,B) carry the same Y.',
    options: [
      buildTT((a, b) => (((a === 0 && b === 1) || (a === 1 && b === 0)) ? 1 : 0)),  // correct
      buildTT((a, b) => ((a === 1 && b === 1) ? 1 : 0)),                              // AB
      buildTT((a, b) => ((a === 0 && b === 0) ? 1 : 0)),                              // A'B'
    ],
  },
];

// ── Drill 07 — Speed Round questions ──
interface SpeedQ {
  prompt: string;
  options: string[];
  correctIndex: number;
}

const SPEED_QUESTIONS: SpeedQ[] = [
  { prompt: "Y = A + A'", options: ['1', '0', 'A', "A'"], correctIndex: 0 },
  { prompt: "Y = A · A'", options: ['1', '0', 'A', "A'"], correctIndex: 1 },
  { prompt: 'Y = A + 1',  options: ['1', '0', 'A', "A'"], correctIndex: 0 },
  { prompt: 'Y = A · 1',  options: ['1', '0', 'A', "A'"], correctIndex: 2 },
  { prompt: 'Y = A · 0',  options: ['1', '0', 'A', "A'"], correctIndex: 1 },
  { prompt: 'Y = A + 0',  options: ['1', '0', 'A', "A'"], correctIndex: 2 },
  { prompt: "(AB)' equals", options: ["A'+B'", "A'B'", "A+B'", "AB'"], correctIndex: 0 },
  { prompt: "(A+B)' equals", options: ["A'+B'", "A'B'", "AB'", "AB"], correctIndex: 1 },
  { prompt: "Y = A·B + A·B' simplifies to", options: ['A', 'B', 'AB', 'A+B'], correctIndex: 0 },
  { prompt: "Y = A + A·B simplifies to", options: ['A', 'B', 'AB', 'A+B'], correctIndex: 0 },
  { prompt: 'Number of rows in a 4-input truth table', options: ['8', '12', '16', '32'], correctIndex: 2 },
  { prompt: '3-input AND outputs 1 when', options: ['any input is 1', 'all inputs are 1', 'inputs differ', 'inputs are equal'], correctIndex: 1 },
];

export const S14_PracticeArena: React.FC<Props> = ({ isActive, isDarkMode }) => {
  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText   = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg    = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';

  // ── Drill 1: reverse-engineer (multiple choice) ──
  const [qIdx, setQIdx] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const q = REVERSE_QUIZ[qIdx];

  const choose = (i: number) => {
    if (picked !== null) return;
    setPicked(i);
    if (i === q.correctIndex) setScore((s) => s + 1);
  };
  const next = () => {
    if (qIdx < REVERSE_QUIZ.length - 1) {
      setQIdx(qIdx + 1);
      setPicked(null);
    } else {
      setDone(true);
    }
  };
  const restart = () => {
    setQIdx(0); setPicked(null); setScore(0); setDone(false);
  };

  // ── Drill 2: forward synthesis — show me a TT, ask for SOP ──
  const [forwardIdx, setForwardIdx] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const fwd = FORWARDS[forwardIdx];
  const fwdMin = useMemo(() => minterms(fwd.truth), [fwd]);

  // ── Drill 3: live K-Map paint — count groups (manual) ──
  const [paint, setPaint] = useState<Bit[]>([0, 1, 1, 0, 1, 0, 0, 1]); // a fun puzzle
  const togglePaint = (i: number) => {
    setPaint((p) => p.map((v, j) => (j === i ? (v === 1 ? 0 : 1) : v)) as Bit[]);
  };

  // ── Drill 4: K-Map Grouping Challenge ──
  const [kIdx, setKIdx] = useState(0);
  const [kPicked, setKPicked] = useState<number | null>(null);
  const kPuzzle = KMAP_PUZZLES[kIdx];
  const kNext = () => {
    setKIdx((i) => (i + 1) % KMAP_PUZZLES.length);
    setKPicked(null);
  };

  // ── Drill 5: 4-variable K-Map Sandbox ──
  const [paint4, setPaint4] = useState<Bit[]>(Array(16).fill(0) as Bit[]);
  const togglePaint4 = (i: number) => {
    setPaint4((p) => p.map((v, j) => (j === i ? (v === 1 ? 0 : 1) : v)) as Bit[]);
  };
  const minterms4 = useMemo(() => minterms(paint4), [paint4]);
  // Preset patterns to load
  const loadPreset4 = (preset: 'corners' | 'top' | 'left' | 'clear') => {
    if (preset === 'clear') return setPaint4(Array(16).fill(0) as Bit[]);
    if (preset === 'corners') {
      // Famous "corner suite" m0, m2, m8, m10 → B'D'
      const arr = Array(16).fill(0) as Bit[];
      [0, 2, 8, 10].forEach((m) => { arr[m] = 1; });
      return setPaint4(arr);
    }
    if (preset === 'top') {
      const arr = Array(16).fill(0) as Bit[];
      [0, 1, 3, 2].forEach((m) => { arr[m] = 1; });
      return setPaint4(arr);
    }
    if (preset === 'left') {
      const arr = Array(16).fill(0) as Bit[];
      [0, 4, 12, 8].forEach((m) => { arr[m] = 1; });
      return setPaint4(arr);
    }
  };

  // ── Drill 6: Circuit ↔ TT Match ──
  const [cIdx, setCIdx] = useState(0);
  const [cPicked, setCPicked] = useState<number | null>(null);
  const cMatch = CIRCUIT_MATCHES[cIdx];
  const cNext = () => {
    setCIdx((i) => (i + 1) % CIRCUIT_MATCHES.length);
    setCPicked(null);
  };

  // ── Drill 7: Speed Round (60s) ──
  const [speedRunning, setSpeedRunning] = useState(false);
  const [speedQIdx, setSpeedQIdx] = useState(0);
  const [speedScore, setSpeedScore] = useState(0);
  const [speedTime, setSpeedTime] = useState(60);
  const [speedDone, setSpeedDone] = useState(false);
  const [speedFlash, setSpeedFlash] = useState<'right' | 'wrong' | null>(null);

  useEffect(() => {
    if (!speedRunning) return;
    if (speedTime <= 0) {
      setSpeedRunning(false);
      setSpeedDone(true);
      return;
    }
    const t = setTimeout(() => setSpeedTime((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [speedRunning, speedTime]);

  const speedQ = SPEED_QUESTIONS[speedQIdx % SPEED_QUESTIONS.length];

  const speedStart = () => {
    setSpeedRunning(true);
    setSpeedDone(false);
    setSpeedQIdx(0);
    setSpeedScore(0);
    setSpeedTime(60);
    setSpeedFlash(null);
  };

  const speedAnswer = (i: number) => {
    if (!speedRunning) return;
    const right = i === speedQ.correctIndex;
    if (right) setSpeedScore((s) => s + 1);
    setSpeedFlash(right ? 'right' : 'wrong');
    setSpeedQIdx((idx) => idx + 1);
    setTimeout(() => setSpeedFlash(null), 180);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-16 py-4">
      <section className="space-y-3">
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.4em] uppercase text-rose-400">
          <Target size={14} /> Chapter 14 · Practice Arena
        </div>
        <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>Boss Drills</h2>
        <p className={`text-base max-w-3xl ${subText}`}>
          Three drills · three lenses. Reverse-engineer a circuit. Synthesise an SOP from a
          truth table. Paint and group your own K-Map. Once these three click, the module is
          yours.
        </p>
      </section>

      {/* DRILL 1 — Reverse-engineering quiz */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        className={`p-8 rounded-3xl border ${cardBg}`}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-rose-400 mb-1">
              Drill 01 · Reverse-Engineer
            </div>
            <h3 className={`text-xl font-black ${textColor}`}>Read the wires · derive Y</h3>
          </div>
          <div className={`px-3 py-1 rounded-lg border ${isDarkMode ? 'bg-black/40 border-white/10' : 'bg-slate-100 border-slate-200'} font-mono text-xs`}>
            Score · {score} / {REVERSE_QUIZ.length}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {!done ? (
            <motion.div
              key={qIdx}
              initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }}
              className="space-y-5"
            >
              <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-black/30 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                <div className="font-mono text-[10px] uppercase tracking-widest text-rose-300 mb-1">
                  Question {qIdx + 1} · {REVERSE_QUIZ.length}
                </div>
                <p className={`text-sm ${textColor}`}>{q.prompt}</p>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                {q.options.map((opt, i) => {
                  const isPicked = picked === i;
                  const isRight = i === q.correctIndex;
                  const showCorrect = picked !== null && isRight;
                  const showWrong = picked !== null && isPicked && !isRight;
                  return (
                    <button
                      key={i}
                      onClick={() => choose(i)}
                      disabled={picked !== null}
                      className={`p-4 rounded-2xl border-2 font-mono text-sm text-left transition-all ${
                        showCorrect
                          ? 'border-emerald-400 bg-emerald-500/10 text-emerald-200'
                          : showWrong
                            ? 'border-rose-400 bg-rose-500/10 text-rose-200'
                            : isDarkMode
                              ? 'border-white/10 hover:border-rose-400 bg-black/30'
                              : 'border-slate-200 hover:border-rose-400 bg-white'
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        {showCorrect && <Check size={14} className="mt-0.5 flex-shrink-0" />}
                        {showWrong && <X size={14} className="mt-0.5 flex-shrink-0" />}
                        <span>{opt}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {picked !== null && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-between gap-4"
                >
                  <p className={`text-xs ${subText} flex-1`}>
                    <strong className="text-rose-300">Why: </strong>{q.explain}
                  </p>
                  <button
                    onClick={next}
                    className="px-5 py-2 rounded-xl bg-rose-400 text-black font-bold text-sm hover:bg-rose-300 transition-all"
                  >
                    {qIdx < REVERSE_QUIZ.length - 1 ? 'Next →' : 'Finish'}
                  </button>
                </motion.div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-4 py-6"
            >
              <Trophy className="mx-auto text-amber-300" size={48} />
              <h3 className={`text-2xl font-black ${textColor}`}>
                {score === REVERSE_QUIZ.length ? 'Flawless · case cracked.' : `${score} / ${REVERSE_QUIZ.length} — solid.`}
              </h3>
              <button
                onClick={restart}
                className="px-5 py-2 rounded-xl border border-rose-400/40 text-rose-300 font-mono text-xs hover:bg-rose-500/10 transition-all inline-flex items-center gap-2"
              >
                <Repeat size={12} /> Try again
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* DRILL 2 — Forward synthesis */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        className={`p-8 rounded-3xl border ${cardBg}`}
      >
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-rose-400 mb-1">
              Drill 02 · Synthesise
            </div>
            <h3 className={`text-xl font-black ${textColor}`}>Truth Table → Minterm List</h3>
          </div>
          <div className="flex items-center gap-2">
            {FORWARDS.map((_f, i) => (
              <button
                key={i}
                onClick={() => { setForwardIdx(i); setRevealed(false); }}
                className={`px-3 py-1.5 rounded-lg font-mono text-[11px] transition-all ${
                  forwardIdx === i ? 'bg-rose-400 text-black font-bold' : isDarkMode ? 'bg-white/5 border border-white/10' : 'bg-slate-100 border border-slate-200'
                }`}
              >
                Puzzle {i + 1}
              </button>
            ))}
          </div>
        </div>

        <p className={`text-sm ${subText} mb-4`}>
          Function: <strong className={textColor}>{fwd.label}</strong>. Read the truth table; list
          the minterms (rows where Y = 1).
        </p>

        <div className="grid lg:grid-cols-[1fr_1fr] gap-6">
          <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-black/30 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
            <div className="grid grid-cols-[40px_repeat(3,1fr)_1fr] gap-x-1 gap-y-0.5 font-mono text-xs">
              <div className="opacity-40 px-2 py-1.5">#</div>
              {fwd.varNames.map((n) => (
                <div key={n} className="px-2 py-1.5 text-center text-rose-300 font-black">{n}</div>
              ))}
              <div className="px-2 py-1.5 text-center text-emerald-300 font-black">Y</div>

              {fwd.truth.map((y, i) => {
                const a = ((i >> 2) & 1) as Bit;
                const b = ((i >> 1) & 1) as Bit;
                const c = (i & 1) as Bit;
                return (
                  <React.Fragment key={i}>
                    <div className={`px-2 py-1.5 ${y ? 'bg-emerald-500/10' : ''} rounded-l`}>m{i}</div>
                    <div className={`px-2 py-1.5 text-center ${y ? 'bg-emerald-500/10' : ''}`}>{a}</div>
                    <div className={`px-2 py-1.5 text-center ${y ? 'bg-emerald-500/10' : ''}`}>{b}</div>
                    <div className={`px-2 py-1.5 text-center ${y ? 'bg-emerald-500/10' : ''}`}>{c}</div>
                    <div className={`px-2 py-1.5 text-center ${y ? 'bg-emerald-500/15 text-emerald-300 font-black' : ''} rounded-r`}>{y}</div>
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          <div className="space-y-4">
            <div className={`p-5 rounded-2xl border ${isDarkMode ? 'bg-black/30 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
              <div className="font-mono text-[10px] uppercase tracking-widest text-rose-300 mb-2">
                Your job
              </div>
              <p className={`text-xs ${subText} leading-relaxed mb-3`}>
                Identify the minterms in the table, then click below to reveal the answer and
                compare. Bonus: try simplifying using the K-Map you learned in chapter 10.
              </p>
              <button
                onClick={() => setRevealed((v) => !v)}
                className="px-4 py-2 rounded-xl border border-rose-400/40 text-rose-300 font-mono text-xs hover:bg-rose-500/10 transition-all"
              >
                {revealed ? 'Hide solution' : 'Reveal minterm list'}
              </button>
            </div>

            <AnimatePresence>
              {revealed && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
                  className="rounded-2xl p-5 border-2 border-emerald-400/60 bg-emerald-500/10 space-y-2"
                >
                  <div className="font-mono text-[10px] uppercase tracking-widest text-emerald-300">
                    Solution
                  </div>
                  <div className={`font-mono text-lg font-black ${textColor}`}>
                    Y = Σm({fwdMin.join(', ')})
                  </div>
                  <p className={`text-xs ${subText}`}>
                    {fwdMin.length} minterm{fwdMin.length === 1 ? '' : 's'} · plot these on a 3-var
                    K-Map and look for groups of 1, 2, or 4 to simplify.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      {/* DRILL 3 — Paint K-Map */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        className={`p-8 rounded-3xl border ${cardBg}`}
      >
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-rose-400 mb-1">
          Drill 03 · K-Map Sandbox
        </div>
        <h3 className={`text-xl font-black ${textColor} mb-4`}>Paint your own minterms</h3>
        <p className={`text-sm ${subText} mb-6`}>
          Toggle cells on the 3-variable K-Map. Watch the minterm list rebuild itself live.
          Try painting <em>two horizontal neighbours</em> and notice what variable they share.
        </p>

        <div className="grid lg:grid-cols-[1fr_1fr] gap-6">
          {/* K-Map */}
          <div className={`p-5 rounded-2xl border ${isDarkMode ? 'bg-black/30 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
            <div className="grid grid-cols-[60px_repeat(4,72px)] gap-1 mb-1">
              <div></div>
              {['00', '01', '11', '10'].map((g) => (
                <div key={g} className="text-center font-mono text-[11px] text-rose-300 pb-1">
                  BC = {g}
                </div>
              ))}
            </div>
            {[0, 1].map((a) => (
              <div key={a} className="grid grid-cols-[60px_repeat(4,72px)] gap-1 mb-1">
                <div className="text-right pr-3 font-mono text-[11px] text-rose-300 self-center">A = {a}</div>
                {[0, 1, 3, 2].map((bcBin, col) => {
                  const minterm = a * 4 + bcBin;
                  const v = paint[minterm];
                  return (
                    <button
                      key={col}
                      onClick={() => togglePaint(minterm)}
                      className={`relative h-16 rounded-xl border-2 grid place-items-center font-mono font-black transition-all ${
                        v === 1
                          ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200 shadow-[0_0_20px_rgba(52,211,153,0.3)]'
                          : `bg-black/20 border-white/10 ${textColor} hover:border-rose-400`
                      }`}
                    >
                      <span className="text-2xl">{v}</span>
                      <span className="absolute top-1 left-2 text-[9px] opacity-50">m{minterm}</span>
                    </button>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Live readout */}
          <div className={`p-5 rounded-2xl border ${isDarkMode ? 'bg-black/30 border-white/10' : 'bg-slate-50 border-slate-200'} space-y-3`}>
            <div className="font-mono text-[10px] uppercase tracking-widest text-rose-300">Live readout</div>
            <div>
              <div className={`text-xs ${subText} mb-1`}>Minterm list</div>
              <div className={`font-mono text-base font-black ${textColor}`}>
                Y = Σm({minterms(paint).join(', ') || '—'})
              </div>
            </div>
            <div>
              <div className={`text-xs ${subText} mb-1`}>Count of 1s</div>
              <div className={`font-mono text-2xl font-black ${textColor}`}>
                {paint.filter(v => v === 1).length} / 8
              </div>
            </div>
            <div className={`text-[11px] ${subText} font-mono leading-relaxed pt-3 border-t ${isDarkMode ? 'border-white/10' : 'border-slate-200'}`}>
              💡 Tips:<br />
              · 2 adjacent 1s drop one variable<br />
              · 4 adjacent 1s drop two variables<br />
              · Wrap-around: m0 ↔ m2 and m4 ↔ m6 share walls
            </div>
          </div>
        </div>
      </motion.div>

      {/* DRILL 4 — K-Map Grouping Challenge */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        className={`p-8 rounded-3xl border ${cardBg}`}
      >
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-rose-400 mb-1">
              Drill 04 · Group the Wings
            </div>
            <h3 className={`text-xl font-black ${textColor} flex items-center gap-2`}>
              <Grid3x3 size={18} className="text-rose-300" /> K-Map → Simplified SOP
            </h3>
          </div>
          <div className={`px-3 py-1 rounded-lg border ${isDarkMode ? 'bg-black/40 border-white/10' : 'bg-slate-100 border-slate-200'} font-mono text-xs`}>
            Puzzle {kIdx + 1} / {KMAP_PUZZLES.length}
          </div>
        </div>

        <p className={`text-sm ${subText} mb-5`}>{kPuzzle.prompt}</p>

        <div className="grid lg:grid-cols-[1fr_1fr] gap-6 items-start">
          {/* Read-only K-Map */}
          <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-black/30 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
            <div className="grid grid-cols-[60px_repeat(4,72px)] gap-1 mb-1">
              <div></div>
              {['00', '01', '11', '10'].map((g) => (
                <div key={g} className="text-center font-mono text-[11px] text-rose-300 pb-1">BC = {g}</div>
              ))}
            </div>
            {[0, 1].map((a) => (
              <div key={a} className="grid grid-cols-[60px_repeat(4,72px)] gap-1 mb-1">
                <div className="text-right pr-3 font-mono text-[11px] text-rose-300 self-center">A = {a}</div>
                {[0, 1, 3, 2].map((bcBin, col) => {
                  const m = a * 4 + bcBin;
                  const v = kPuzzle.truth[m];
                  return (
                    <div
                      key={col}
                      className={`relative h-16 rounded-xl border-2 grid place-items-center font-mono font-black ${
                        v === 1
                          ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200 shadow-[0_0_18px_rgba(52,211,153,0.25)]'
                          : `bg-black/20 border-white/10 ${textColor}`
                      }`}
                    >
                      <span className="text-2xl">{v}</span>
                      <span className="absolute top-1 left-2 text-[9px] opacity-50">m{m}</span>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Options */}
          <div className="space-y-3">
            {kPuzzle.options.map((opt, i) => {
              const isPicked = kPicked === i;
              const isRight = i === kPuzzle.correctIndex;
              const showCorrect = kPicked !== null && isRight;
              const showWrong = kPicked !== null && isPicked && !isRight;
              return (
                <button
                  key={i}
                  onClick={() => kPicked === null && setKPicked(i)}
                  disabled={kPicked !== null}
                  className={`w-full p-4 rounded-2xl border-2 font-mono text-left transition-all ${
                    showCorrect
                      ? 'border-emerald-400 bg-emerald-500/10 text-emerald-200'
                      : showWrong
                        ? 'border-rose-400 bg-rose-500/10 text-rose-200'
                        : isDarkMode
                          ? 'border-white/10 hover:border-rose-400 bg-black/30'
                          : 'border-slate-200 hover:border-rose-400 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {showCorrect && <Check size={14} />}
                    {showWrong && <X size={14} />}
                    <span>{opt}</span>
                  </div>
                </button>
              );
            })}
            {kPicked !== null && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3 pt-2">
                <p className={`text-xs ${subText} flex-1`}>
                  <strong className="text-rose-300">Why: </strong>{kPuzzle.explain}
                </p>
                <button onClick={kNext} className="px-4 py-2 rounded-xl bg-rose-400 text-black font-bold text-xs">
                  Next puzzle →
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>

      {/* DRILL 5 — 4-variable K-Map Sandbox */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        className={`p-8 rounded-3xl border ${cardBg}`}
      >
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-rose-400 mb-1">
              Drill 05 · Boss Level
            </div>
            <h3 className={`text-xl font-black ${textColor}`}>4-Variable K-Map Sandbox</h3>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {([
              { id: 'corners', label: 'Corner Suite' },
              { id: 'top',     label: 'Top Row' },
              { id: 'left',    label: 'Left Column' },
              { id: 'clear',   label: 'Clear' },
            ] as const).map((p) => (
              <button
                key={p.id}
                onClick={() => loadPreset4(p.id)}
                className={`px-3 py-1.5 rounded-lg font-mono text-[11px] transition-all ${
                  isDarkMode ? 'bg-white/5 border border-white/10 hover:border-rose-400' : 'bg-slate-100 border border-slate-200 hover:border-rose-400'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <p className={`text-sm ${subText} mb-5`}>
          Now you scale up. AB on rows, CD on columns — both Gray-coded so adjacent cells differ by
          one bit. Wrap-around still applies (top↔bottom, left↔right). Try the presets to see classic
          shapes, or paint your own.
        </p>

        <div className="grid lg:grid-cols-[1.3fr_1fr] gap-6 items-start">
          <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-black/30 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
            {/* column header */}
            <div className="grid grid-cols-[64px_repeat(4,1fr)] gap-1 mb-1">
              <div></div>
              {['00', '01', '11', '10'].map((g) => (
                <div key={g} className="text-center font-mono text-[11px] text-rose-300 pb-1">CD={g}</div>
              ))}
            </div>
            {/* rows: AB Gray order = 00, 01, 11, 10 */}
            {[0, 1, 3, 2].map((abBin) => (
              <div key={abBin} className="grid grid-cols-[64px_repeat(4,1fr)] gap-1 mb-1">
                <div className="text-right pr-2 font-mono text-[11px] text-rose-300 self-center">
                  AB={abBin.toString(2).padStart(2, '0')}
                </div>
                {[0, 1, 3, 2].map((cdBin, col) => {
                  const m = (abBin << 2) | cdBin;
                  const v = paint4[m];
                  return (
                    <button
                      key={col}
                      onClick={() => togglePaint4(m)}
                      className={`relative h-14 rounded-lg border-2 grid place-items-center font-mono font-black transition-all ${
                        v === 1
                          ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200 shadow-[0_0_15px_rgba(52,211,153,0.3)]'
                          : `bg-black/20 border-white/10 ${textColor} hover:border-rose-400`
                      }`}
                    >
                      <span className="text-lg">{v}</span>
                      <span className="absolute top-0.5 left-1.5 text-[8px] opacity-50">m{m}</span>
                    </button>
                  );
                })}
              </div>
            ))}
          </div>

          <div className={`p-5 rounded-2xl border ${isDarkMode ? 'bg-black/30 border-white/10' : 'bg-slate-50 border-slate-200'} space-y-4`}>
            <div className="font-mono text-[10px] uppercase tracking-widest text-rose-300">Live readout</div>
            <div>
              <div className={`text-xs ${subText} mb-1`}>Minterm list</div>
              <div className={`font-mono text-sm font-black ${textColor} break-all`}>
                Y = Σm({minterms4.join(', ') || '—'})
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className={`text-xs ${subText} mb-1`}>1s painted</div>
                <div className={`font-mono text-2xl font-black ${textColor}`}>{minterms4.length} / 16</div>
              </div>
              <div>
                <div className={`text-xs ${subText} mb-1`}>Variables</div>
                <div className={`font-mono text-2xl font-black ${textColor}`}>n = 4</div>
              </div>
            </div>
            <div className={`text-[11px] ${subText} font-mono leading-relaxed pt-3 border-t ${isDarkMode ? 'border-white/10' : 'border-slate-200'}`}>
              💡 4-var tips:<br />
              · Wing of 2  → drops 1 variable<br />
              · Wing of 4  → drops 2 variables<br />
              · Wing of 8  → drops 3 variables<br />
              · Wing of 16 → Y = 1 (always)<br />
              · Try the <em>Corner Suite</em> preset to feel the torus wrap.
            </div>
          </div>
        </div>
      </motion.div>

      {/* DRILL 6 — Circuit ↔ Truth Table Match */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        className={`p-8 rounded-3xl border ${cardBg}`}
      >
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-rose-400 mb-1">
              Drill 06 · Match the Faces
            </div>
            <h3 className={`text-xl font-black ${textColor} flex items-center gap-2`}>
              <Cpu size={18} className="text-rose-300" /> Boolean Function → Truth Table
            </h3>
          </div>
          <div className={`px-3 py-1 rounded-lg border ${isDarkMode ? 'bg-black/40 border-white/10' : 'bg-slate-100 border-slate-200'} font-mono text-xs`}>
            Round {cIdx + 1} / {CIRCUIT_MATCHES.length}
          </div>
        </div>

        <div className="rounded-2xl p-5 border-2 border-rose-400/40 bg-rose-500/5 mb-5 text-center">
          <div className="font-mono text-[10px] uppercase tracking-widest text-rose-300 mb-2">Function under test</div>
          <div className={`font-mono text-2xl md:text-3xl font-black ${textColor}`}>{cMatch.label}</div>
        </div>

        <p className={`text-sm ${subText} mb-4`}>
          Three candidate truth tables · only one matches the function above. Click the column you
          believe is correct.
        </p>

        <div className="grid md:grid-cols-3 gap-4">
          {cMatch.options.map((tt, i) => {
            const isPicked = cPicked === i;
            const isRight = i === cMatch.correctIndex;
            const showCorrect = cPicked !== null && isRight;
            const showWrong = cPicked !== null && isPicked && !isRight;
            return (
              <button
                key={i}
                onClick={() => cPicked === null && setCPicked(i)}
                disabled={cPicked !== null}
                className={`p-4 rounded-2xl border-2 transition-all text-left ${
                  showCorrect
                    ? 'border-emerald-400 bg-emerald-500/10'
                    : showWrong
                      ? 'border-rose-400 bg-rose-500/10'
                      : isDarkMode
                        ? 'border-white/10 hover:border-rose-400 bg-black/30'
                        : 'border-slate-200 hover:border-rose-400 bg-white'
                }`}
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="font-mono text-[10px] uppercase tracking-widest opacity-60">Option {String.fromCharCode(65 + i)}</span>
                  {showCorrect && <Check size={14} className="text-emerald-400" />}
                  {showWrong && <X size={14} className="text-rose-400" />}
                </div>
                <div className="grid grid-cols-[28px_repeat(3,1fr)_1fr] gap-x-1 gap-y-0.5 font-mono text-[11px]">
                  <div className="opacity-40">#</div>
                  <div className="text-center text-amber-300">A</div>
                  <div className="text-center text-cyan-300">B</div>
                  <div className="text-center text-violet-300">C</div>
                  <div className="text-center text-emerald-300">Y</div>
                  {tt.map((y, idx) => {
                    const a = ((idx >> 2) & 1) as Bit;
                    const b = ((idx >> 1) & 1) as Bit;
                    const c = (idx & 1) as Bit;
                    return (
                      <React.Fragment key={idx}>
                        <div className="opacity-40">{idx}</div>
                        <div className="text-center">{a}</div>
                        <div className="text-center">{b}</div>
                        <div className="text-center">{c}</div>
                        <div className={`text-center font-black ${y ? 'text-emerald-300' : 'opacity-50'}`}>{y}</div>
                      </React.Fragment>
                    );
                  })}
                </div>
              </button>
            );
          })}
        </div>

        {cPicked !== null && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3 mt-5">
            <p className={`text-xs ${subText} flex-1`}>
              <strong className="text-rose-300">Why: </strong>{cMatch.explain}
            </p>
            <button onClick={cNext} className="px-4 py-2 rounded-xl bg-rose-400 text-black font-bold text-xs">
              Next round →
            </button>
          </motion.div>
        )}
      </motion.div>

      {/* DRILL 7 — Speed Round */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        className={`p-8 rounded-3xl border ${cardBg} relative overflow-hidden`}
        style={{ boxShadow: speedRunning ? '0 0 60px rgba(244,63,94,0.25)' : undefined }}
      >
        {speedFlash && (
          <motion.div
            initial={{ opacity: 0.6 }} animate={{ opacity: 0 }} transition={{ duration: 0.4 }}
            className={`absolute inset-0 pointer-events-none ${speedFlash === 'right' ? 'bg-emerald-400' : 'bg-rose-400'}`}
          />
        )}

        <div className="flex items-center justify-between mb-6 flex-wrap gap-3 relative z-10">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-rose-400 mb-1">
              Drill 07 · Final Boss
            </div>
            <h3 className={`text-xl font-black ${textColor} flex items-center gap-2`}>
              <Flame size={18} className="text-rose-300" /> Speed Round · 60s Boolean Sprint
            </h3>
          </div>
          <div className="flex items-center gap-3">
            <div className={`px-4 py-2 rounded-xl border-2 font-mono font-black flex items-center gap-2 ${
              speedTime <= 10 && speedRunning ? 'border-rose-400 text-rose-300 animate-pulse' : 'border-rose-400/40 text-rose-300'
            }`}>
              <Timer size={14} /> {speedTime}s
            </div>
            <div className={`px-4 py-2 rounded-xl border-2 border-emerald-400/40 text-emerald-300 font-mono font-black`}>
              ★ {speedScore}
            </div>
          </div>
        </div>

        {!speedRunning && !speedDone && (
          <div className="text-center py-10 relative z-10">
            <p className={`text-sm ${subText} mb-5 max-w-md mx-auto`}>
              Twelve Boolean axioms · sixty seconds. Get as many right as you can. The questions
              loop, but no two consecutive ones are the same.
            </p>
            <button
              onClick={speedStart}
              className="px-8 py-3 rounded-2xl bg-rose-400 text-black font-black text-sm hover:bg-rose-300 transition-all inline-flex items-center gap-2"
            >
              <Flame size={16} /> Start sprint
            </button>
          </div>
        )}

        {speedRunning && (
          <div className="relative z-10 space-y-5">
            <div className={`rounded-2xl p-5 border-2 border-rose-400/60 bg-rose-500/5 text-center`}>
              <div className="font-mono text-[10px] uppercase tracking-widest text-rose-300 mb-2">
                Question {speedQIdx + 1}
              </div>
              <div className={`font-mono text-2xl font-black ${textColor}`}>{speedQ.prompt}</div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {speedQ.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => speedAnswer(i)}
                  className={`p-4 rounded-2xl border-2 font-mono font-black text-lg transition-all ${
                    isDarkMode ? 'border-white/10 hover:border-rose-400 bg-black/30' : 'border-slate-200 hover:border-rose-400 bg-white'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
            <p className={`text-[11px] font-mono opacity-50 text-center ${subText}`}>
              Click answer · auto-advances · keep moving
            </p>
          </div>
        )}

        {speedDone && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-4 py-8 relative z-10"
          >
            <Trophy size={48} className="mx-auto text-amber-300" />
            <h3 className={`text-3xl font-black ${textColor}`}>{speedScore} correct in 60s</h3>
            <p className={`text-sm ${subText}`}>
              {speedScore >= 18 ? 'Logician class. Vault opens on sight.'
                : speedScore >= 12 ? 'Solid sprint — case closed.'
                  : speedScore >= 6 ? 'Good baseline — drill the algebra and try again.'
                    : 'Re-read the dossier (chapter 4) and the SOP scene (chapter 8).'}
            </p>
            <button
              onClick={speedStart}
              className="px-6 py-2 rounded-xl border border-rose-400/40 text-rose-300 font-mono text-xs hover:bg-rose-500/10 transition-all inline-flex items-center gap-2"
            >
              <Repeat size={12} /> Run it back
            </button>
          </motion.div>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }} animate={isActive ? { opacity: 1 } : {}}
        transition={{ delay: 0.4 }}
        className={`text-center text-xs font-mono uppercase tracking-[0.3em] ${subText}`}
      >
        Module 03 complete · case sealed · proceed to Module 04
      </motion.div>
    </div>
  );
};
