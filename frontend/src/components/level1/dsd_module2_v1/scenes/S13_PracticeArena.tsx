import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Target, BrainCircuit, Wrench, CheckCircle2, XCircle, Sparkles, RefreshCw } from 'lucide-react';

interface Props { isActive: boolean; isDarkMode: boolean; }

/* ──────────────────────────────────────────────────────────────────────── */
/*  Activity 1 · MCQ Quiz                                                   */
/* ──────────────────────────────────────────────────────────────────────── */

interface MCQ {
  q: string;
  options: string[];
  correct: number;
  rationale: string;
}

const QUIZ: MCQ[] = [
  {
    q: 'Why does a 4-variable K-Map use the column order 00, 01, 11, 10 instead of 00, 01, 10, 11?',
    options: [
      'Because it sorts the columns alphabetically by their bit names.',
      'Because it is Gray code, so adjacent columns differ by exactly one bit.',
      'Because it makes the grid look symmetric.',
      'Because hardware decoders prefer that order.',
    ],
    correct: 1,
    rationale:
      'Gray code guarantees that any two physically adjacent cells differ by one variable. That guarantee is what lets adjacency = simplification.',
  },
  {
    q: 'Which of these is NOT a legal K-Map wing on a 4-variable map?',
    options: ['1×2 pair', '2×2 square', '1×3 trio', '1×4 strip'],
    correct: 2,
    rationale:
      'Wings must have an area that is a power of two. 3 is not a power of two — there\'s no HVAC capacity for "3 rooms".',
  },
  {
    q: 'In Madhur\'s metaphor, an X (don\'t care) on the K-Map represents:',
    options: [
      'A premium guest who paid extra.',
      'A wall that cannot be removed.',
      'A room under maintenance — use it as a 1 only if it grows the wing.',
      'An impossible variable combination that must be set to 0.',
    ],
    correct: 2,
    rationale:
      'X is opportunistic. Treat it as 1 when absorbing it doubles the wing; otherwise leave it as 0.',
  },
  {
    q: 'Which four cells form the famous corner cluster of a 4-variable K-Map?',
    options: ['{0, 1, 14, 15}', '{0, 2, 8, 10}', '{0, 3, 12, 15}', '{1, 2, 4, 8}'],
    correct: 1,
    rationale:
      'On the torus, the four extreme corners are all adjacent. {0, 2, 8, 10} forms a 2×2 wing that produces B′D′.',
  },
  {
    q: 'Doubling the size of a wing changes the resulting product term by:',
    options: [
      'Adding one more literal',
      'Removing one literal',
      'Inverting the entire term',
      'Nothing — size doesn\'t change the term',
    ],
    correct: 1,
    rationale:
      'Each doubling means one variable now takes both values across the wing, so it falls out of the product.',
  },
  {
    q: 'For Y = Σm(0, 1, 2, 6, 8, 10, 13, 14), Madhur\'s Operation 1 produces which term?',
    options: ['CD', "B'D'", "A'C'", 'ABD'],
    correct: 1,
    rationale:
      'The corner cluster {0, 2, 8, 10} has B = 0 and D = 0 across all four cells, while A and C vary. The wing collapses to B′D′.',
  },
  {
    q: 'Which statement is the BEST justification for the K-Map\'s torus topology?',
    options: [
      'It looks more interesting than a flat grid.',
      'Top/bottom rows differ by one bit; far-left/far-right columns differ by one bit. So they\'re logically adjacent.',
      'It allows wings of size 3 by curling around.',
      'It compresses the truth table to 8 rows.',
    ],
    correct: 1,
    rationale:
      'The Gray-code ordering on both axes means the first and last rows (and columns) are one bit apart — they share a wall via the wrap-around corridor.',
  },
];

/* ──────────────────────────────────────────────────────────────────────── */
/*  Activity 2 · Wing Hunter (click cells to grow a wing, check if legal)   */
/* ──────────────────────────────────────────────────────────────────────── */

const GRID = [
  [0, 1, 3, 2],
  [4, 5, 7, 6],
  [12, 13, 15, 14],
  [8, 9, 11, 10],
];

const WING_TARGETS: Array<{ id: string; want: number[]; hint: string; explanation: string }> = [
  {
    id: 'corner',
    want: [0, 2, 8, 10],
    hint: 'Find a 2×2 wing using the four extreme corners (torus).',
    explanation: 'Corner cluster · B′D′. Both B and D stay 0; A and C both vary.',
  },
  {
    id: 'left-col',
    want: [0, 4, 12, 8],
    hint: 'Find a 4×1 column wing on the left edge.',
    explanation: 'Left column wing · C′D′. The whole leftmost column shares C = 0 and D = 0.',
  },
  {
    id: 'middle-block',
    want: [5, 7, 13, 15],
    hint: 'Find a 2×2 wing on the right-middle of the map.',
    explanation: 'Middle block · BD. Across this 2×2, B = 1 and D = 1; A and C both vary.',
  },
  {
    id: 'top-bottom-pair',
    want: [1, 9],
    hint: 'A vertical pair across the torus — top row meets bottom row.',
    explanation: 'Wrap-around pair · B′C′D. Only A flips between row 00 and row 10.',
  },
];

/* ──────────────────────────────────────────────────────────────────────── */
/*  Activity 3 · Match the Term                                              */
/* ──────────────────────────────────────────────────────────────────────── */

interface MatchPair { left: string; right: string; }
const MATCH_DECK: MatchPair[] = [
  { left: 'm0, m1, m4, m5', right: "A'C'" },
  { left: 'm3, m7, m11, m15', right: 'CD' },
  { left: 'm6, m14',         right: "BCD'" },
  { left: 'm0, m2, m8, m10', right: "B'D'" },
  { left: 'm5, m7, m13, m15', right: 'BD' },
];

/* ──────────────────────────────────────────────────────────────────────── */
/*  The component                                                            */
/* ──────────────────────────────────────────────────────────────────────── */

export const S13_PracticeArena: React.FC<Props> = ({ isActive, isDarkMode }) => {
  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';

  /* MCQ state */
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);
  const score = Object.entries(answers).filter(([i, v]) => QUIZ[Number(i)].correct === v).length;

  /* Wing hunter state */
  const [targetIdx, setTargetIdx] = useState(0);
  const [picked, setPicked] = useState<Set<number>>(new Set());
  const target = WING_TARGETS[targetIdx];
  const targetSet = useMemo(() => new Set(target.want), [target]);

  const isCorrectWing =
    picked.size === targetSet.size && [...targetSet].every((m) => picked.has(m));

  const nextWingChallenge = () => {
    setPicked(new Set());
    setTargetIdx((i) => (i + 1) % WING_TARGETS.length);
  };

  /* Match game state */
  const [shuffledRights] = useState(() => {
    const arr = MATCH_DECK.map((p) => p.right);
    // shuffle deterministically once
    return [...arr].sort(() => Math.random() - 0.5);
  });
  const [matches, setMatches] = useState<Record<string, string | null>>(
    () => Object.fromEntries(MATCH_DECK.map((p) => [p.left, null]))
  );
  const [matchSelectedRight, setMatchSelectedRight] = useState<string | null>(null);
  const matchScore = MATCH_DECK.filter((p) => matches[p.left] === p.right).length;
  const usedRights = new Set(Object.values(matches).filter((v): v is string => !!v));

  const handleMatch = (left: string) => {
    if (!matchSelectedRight) return;
    setMatches((prev) => {
      const n = { ...prev };
      // remove the right from any previous left if reused
      Object.keys(n).forEach((k) => { if (n[k] === matchSelectedRight) n[k] = null; });
      n[left] = matchSelectedRight;
      return n;
    });
    setMatchSelectedRight(null);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 py-4">
      <section className="space-y-3">
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.4em] uppercase text-rose-400">
          <Trophy size={14} /> Chapter 13 · Boss Drill
        </div>
        <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>Practice Arena</h2>
        <p className={`text-base max-w-3xl ${subText}`}>
          Three activities to lock in Madhur&apos;s craft: a multiple-choice quiz, a wing-hunting drill on a live
          K-Map, and a term-matching challenge. Cycle through them in any order.
        </p>
      </section>

      {/* ───────────  Activity 1 · MCQ Quiz  ─────────── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        className={`p-8 rounded-3xl border ${cardBg}`}
      >
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/20 border border-rose-400/40 flex items-center justify-center text-rose-300">
              <BrainCircuit size={18} />
            </div>
            <div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-rose-400">Activity 01</div>
              <h3 className={`text-xl font-black ${textColor}`}>The 7-Question Knowledge Gate</h3>
            </div>
          </div>
          {showResults ? (
            <button
              onClick={() => { setAnswers({}); setShowResults(false); }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-[11px] font-mono font-bold bg-rose-400 text-black hover:shadow-lg hover:shadow-rose-500/30"
            >
              <RefreshCw size={12} /> Retry
            </button>
          ) : (
            <button
              onClick={() => setShowResults(true)}
              disabled={Object.keys(answers).length < QUIZ.length}
              className={`px-5 py-2 rounded-xl text-[11px] font-mono font-bold transition-all ${
                Object.keys(answers).length < QUIZ.length
                  ? 'opacity-40 cursor-not-allowed bg-rose-500/30 text-rose-200'
                  : 'bg-rose-400 text-black hover:shadow-lg hover:shadow-rose-500/30'
              }`}
            >
              Submit · {Object.keys(answers).length}/{QUIZ.length}
            </button>
          )}
        </div>

        <div className="space-y-6">
          {QUIZ.map((m, qi) => (
            <div key={qi} className={`p-5 rounded-2xl border ${isDarkMode ? 'bg-black/30 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
              <div className="flex items-baseline gap-3 mb-3">
                <span className="font-mono text-xs text-rose-400 font-black">Q{qi + 1}.</span>
                <span className={`text-sm font-bold ${textColor}`}>{m.q}</span>
              </div>
              <div className="space-y-2">
                {m.options.map((opt, oi) => {
                  const picked = answers[qi] === oi;
                  const isCorrect = m.correct === oi;
                  const reveal = showResults;
                  return (
                    <button
                      key={oi}
                      disabled={showResults}
                      onClick={() => setAnswers((a) => ({ ...a, [qi]: oi }))}
                      className={`w-full text-left px-4 py-2.5 rounded-xl border-2 transition-all flex items-center gap-3 ${
                        reveal
                          ? isCorrect
                            ? 'border-emerald-400 bg-emerald-500/15 text-emerald-200'
                            : picked
                            ? 'border-rose-400 bg-rose-500/15 text-rose-200'
                            : isDarkMode ? 'border-white/10 text-slate-400' : 'border-slate-200 text-slate-500'
                          : picked
                          ? 'border-rose-400 bg-rose-500/15 text-rose-200'
                          : isDarkMode ? 'border-white/10 hover:border-rose-400/50 text-slate-300' : 'border-slate-200 hover:border-rose-400/50 text-slate-700'
                      }`}
                    >
                      <span className="font-mono text-[11px] opacity-60">{String.fromCharCode(65 + oi)}.</span>
                      <span className="text-sm flex-1">{opt}</span>
                      {reveal && isCorrect && <CheckCircle2 size={16} className="text-emerald-400" />}
                      {reveal && picked && !isCorrect && <XCircle size={16} className="text-rose-400" />}
                    </button>
                  );
                })}
              </div>
              {showResults && (
                <div className={`mt-3 px-4 py-3 rounded-xl border-l-4 text-[12px] leading-relaxed ${
                  isDarkMode ? 'bg-amber-500/10 border-amber-400 text-amber-100' : 'bg-amber-50 border-amber-400 text-amber-900'
                }`}>
                  <strong className="text-amber-300">Why:</strong> {m.rationale}
                </div>
              )}
            </div>
          ))}
        </div>

        {showResults && (
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className={`mt-6 p-5 rounded-2xl border-2 text-center ${
              score >= 6 ? 'border-emerald-400 bg-emerald-500/10' : score >= 4 ? 'border-amber-400 bg-amber-500/10' : 'border-rose-400 bg-rose-500/10'
            }`}
          >
            <div className="font-mono text-[10px] uppercase tracking-widest text-amber-400 mb-1">Score</div>
            <div className={`text-3xl font-black ${textColor}`}>{score} / {QUIZ.length}</div>
            <div className={`text-[12px] mt-1 ${subText}`}>
              {score >= 6 ? 'Master Architect — proceed to Verilog.' : score >= 4 ? 'Solid foundation. Replay the gray-code & corridors chapters.' : 'Re-watch the lecture and the operations chapter, then retry.'}
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* ───────────  Activity 2 · Wing Hunter  ─────────── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.1 }}
        className={`p-8 rounded-3xl border ${cardBg}`}
      >
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
              <Target size={18} />
            </div>
            <div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-amber-400">Activity 02</div>
              <h3 className={`text-xl font-black ${textColor}`}>Wing Hunter · Click the rooms</h3>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setPicked(new Set())}
              className={`px-4 py-2 rounded-xl text-[11px] font-mono font-bold border ${
                isDarkMode ? 'border-white/10 hover:bg-white/5' : 'border-slate-200 hover:bg-slate-100'
              }`}
            >
              Clear
            </button>
            <button
              onClick={nextWingChallenge}
              className="px-4 py-2 rounded-xl text-[11px] font-mono font-bold bg-amber-400 text-black hover:shadow-lg hover:shadow-amber-500/30"
            >
              Next challenge →
            </button>
          </div>
        </div>

        <div className={`p-4 rounded-2xl border mb-5 ${isDarkMode ? 'bg-black/30 border-amber-400/30' : 'bg-amber-50 border-amber-300'}`}>
          <div className="font-mono text-[10px] uppercase tracking-widest text-amber-400 mb-1">Challenge {targetIdx + 1} / {WING_TARGETS.length}</div>
          <div className={`text-sm font-bold ${textColor}`}>{target.hint}</div>
        </div>

        <div className="grid lg:grid-cols-[1.4fr_1fr] gap-8">
          <div>
            <div className="grid grid-cols-[80px_repeat(4,minmax(0,1fr))] gap-1.5 items-end mb-1">
              <div className="text-right">
                <div className="font-mono text-[10px] uppercase tracking-widest text-amber-300/80">A,B ↓</div>
                <div className="font-mono text-[10px] uppercase tracking-widest text-amber-300/80">C,D →</div>
              </div>
              {['00', '01', '11', '10'].map((cd, c) => (
                <div key={c} className="text-center font-mono text-sm text-amber-300/90">{cd}</div>
              ))}
            </div>
            <div className="space-y-1.5">
              {['00', '01', '11', '10'].map((ab, r) => (
                <div key={r} className="grid grid-cols-[80px_repeat(4,minmax(0,1fr))] gap-1.5 items-stretch">
                  <div className="flex items-center justify-end font-mono text-sm text-amber-300/90">{ab}</div>
                  {GRID[r].map((m, c) => {
                    const isPicked = picked.has(m);
                    const isExpected = targetSet.has(m);
                    const wrongPick = isPicked && !isExpected && isCorrectWing === false && picked.size === targetSet.size;
                    return (
                      <button
                        key={c}
                        onClick={() =>
                          setPicked((prev) => {
                            const n = new Set(prev);
                            n.has(m) ? n.delete(m) : n.add(m);
                            return n;
                          })
                        }
                        className="aspect-square rounded-lg flex flex-col items-center justify-center font-mono font-black border-2 transition-all"
                        style={{
                          background: isPicked
                            ? isExpected
                              ? 'rgba(252,211,77,0.22)'
                              : wrongPick
                              ? 'rgba(244,63,94,0.18)'
                              : 'rgba(252,211,77,0.18)'
                            : isDarkMode ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)',
                          borderColor: isPicked
                            ? isExpected
                              ? '#fcd34d'
                              : wrongPick ? '#f43f5e' : '#fcd34d80'
                            : isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                          boxShadow: isPicked && isExpected ? '0 0 18px rgba(252,211,77,0.4)' : undefined,
                        }}
                      >
                        <span className={`text-2xl ${isPicked ? 'text-amber-300' : isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                          {m}
                        </span>
                        <span className="text-[9px] opacity-50">{m.toString(2).padStart(4, '0')}</span>
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-3">
            <div className={`p-4 rounded-2xl border ${isCorrectWing ? 'border-emerald-400/50 bg-emerald-500/10' : isDarkMode ? 'border-white/10 bg-black/30' : 'border-slate-200 bg-slate-50'}`}>
              <div className="font-mono text-[10px] uppercase tracking-widest text-amber-400 mb-1">Picked</div>
              <div className="flex flex-wrap gap-1 mb-3">
                {[...picked].sort((a, b) => a - b).map((m) => (
                  <span key={m} className="px-2 py-0.5 rounded bg-amber-400/20 border border-amber-400/40 text-amber-300 font-mono text-[11px]">m{m}</span>
                ))}
                {picked.size === 0 && <span className={`text-[12px] ${subText}`}>No rooms selected yet.</span>}
              </div>
              {picked.size === targetSet.size && (
                <div className={`text-sm font-bold ${isCorrectWing ? 'text-emerald-300' : 'text-rose-300'}`}>
                  {isCorrectWing ? '✓ Correct wing!' : '✗ Same size, wrong cells. Re-check the hint.'}
                </div>
              )}
              {isCorrectWing && (
                <div className={`text-[12px] mt-2 ${subText}`}>{target.explanation}</div>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* ───────────  Activity 3 · Match the Term  ─────────── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.2 }}
        className={`p-8 rounded-3xl border ${cardBg}`}
      >
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300">
              <Wrench size={18} />
            </div>
            <div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-emerald-400">Activity 03</div>
              <h3 className={`text-xl font-black ${textColor}`}>Match the Wing to its Term</h3>
            </div>
          </div>
          <div className="font-mono text-sm text-emerald-300">
            Score · {matchScore} / {MATCH_DECK.length}
          </div>
        </div>

        <p className={`text-[12px] ${subText} mb-5`}>
          Tap a term on the right, then tap the matching wing on the left. Wrong assignments stay until you swap them.
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Lefts */}
          <div className="space-y-2">
            <div className="font-mono text-[10px] uppercase tracking-widest text-emerald-400 mb-2">Wings</div>
            {MATCH_DECK.map((p) => {
              const assigned = matches[p.left];
              const correct = assigned === p.right;
              return (
                <button
                  key={p.left}
                  onClick={() => handleMatch(p.left)}
                  disabled={!matchSelectedRight && !assigned}
                  className={`w-full text-left p-3 rounded-xl border-2 transition-all flex items-center gap-3 ${
                    assigned
                      ? correct
                        ? 'border-emerald-400 bg-emerald-500/10'
                        : 'border-rose-400 bg-rose-500/10'
                      : matchSelectedRight
                      ? 'border-emerald-400/40 hover:border-emerald-400 hover:bg-emerald-500/10'
                      : isDarkMode ? 'border-white/10' : 'border-slate-200'
                  }`}
                >
                  <span className={`flex-1 text-sm font-mono ${textColor}`}>{p.left}</span>
                  {assigned && (
                    <span className={`px-2 py-0.5 rounded font-mono text-sm font-black ${correct ? 'bg-emerald-400 text-black' : 'bg-rose-400 text-black'}`}>
                      {assigned}
                    </span>
                  )}
                  {assigned && correct && <CheckCircle2 size={16} className="text-emerald-400" />}
                  {assigned && !correct && <XCircle size={16} className="text-rose-400" />}
                </button>
              );
            })}
          </div>

          {/* Rights */}
          <div className="space-y-2">
            <div className="font-mono text-[10px] uppercase tracking-widest text-emerald-400 mb-2">Terms</div>
            {shuffledRights.map((r) => {
              const used = usedRights.has(r);
              const selected = matchSelectedRight === r;
              return (
                <button
                  key={r}
                  onClick={() => setMatchSelectedRight(selected ? null : r)}
                  disabled={used && !selected}
                  className={`w-full text-left p-3 rounded-xl border-2 font-mono text-base font-black transition-all ${
                    selected
                      ? 'border-emerald-400 bg-emerald-400 text-black'
                      : used
                      ? 'opacity-30'
                      : isDarkMode ? 'border-white/10 hover:border-emerald-400 text-emerald-300' : 'border-slate-200 hover:border-emerald-400 text-emerald-700'
                  }`}
                >
                  {r}
                </button>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Closing */}
      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.3 }}
        className={`p-8 rounded-3xl border ${cardBg} text-center`}
      >
        <Sparkles className="mx-auto text-amber-400 mb-3" size={20} />
        <div className="font-mono text-[10px] uppercase tracking-widest text-amber-400 mb-2">Module Complete</div>
        <p className={`text-base leading-relaxed ${textColor}`}>
          You&apos;ve walked the entire labyrinth — gray-coded grid, power-of-two wings, the torus, the manifest, the
          four operations, the don&apos;t-care loophole, the masterclass and the boss drill.{' '}
          <strong className="text-amber-300">Madhur tips his hat.</strong>
        </p>
      </motion.div>
    </div>
  );
};
