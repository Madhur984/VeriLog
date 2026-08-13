import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Trophy, Target, BrainCircuit, Wrench, CheckCircle2, XCircle, Sparkles, RefreshCw,
  Zap, Hammer, Crown, Flame,
} from 'lucide-react';
import { TryItYourself } from '../../../ui/TryItYourself';

interface Props { isActive: boolean; isDarkMode: boolean; }

/* ──────────────────────────────────────────────────────────────────────── */
/*  Activity 1 · MCQ Quiz · 15 questions                                    */
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
      'It sorts the columns alphabetically by their bit names.',
      'It is Gray code, so adjacent columns differ by exactly one bit.',
      'It makes the grid look symmetric.',
      'Hardware decoders prefer that order.',
    ],
    correct: 1,
    rationale: 'Gray code guarantees that any two physically adjacent cells differ by one variable. That guarantee is what lets adjacency = simplification.',
  },
  {
    q: 'Which of these is NOT a legal K-Map wing on a 4-variable map?',
    options: ['1×2 pair', '2×2 square', '1×3 trio', '1×4 strip'],
    correct: 2,
    rationale: 'Wings must have an area that is a power of two. 3 is not a power of two - there is no HVAC capacity for "3 rooms".',
  },
  {
    q: 'In Madhur\'s metaphor, an X (don\'t care) on the K-Map represents:',
    options: [
      'A premium guest who paid extra.',
      'A wall that cannot be removed.',
      'A room under maintenance - use it as 1 only if it grows the wing.',
      'An impossible variable combination that must be set to 0.',
    ],
    correct: 2,
    rationale: 'X is opportunistic. Treat it as 1 when absorbing it doubles the wing; otherwise leave it as 0.',
  },
  {
    q: 'Which four cells form the famous corner cluster of a 4-variable K-Map?',
    options: ['{0, 1, 14, 15}', '{0, 2, 8, 10}', '{0, 3, 12, 15}', '{1, 2, 4, 8}'],
    correct: 1,
    rationale: 'On the torus, the four extreme corners are all adjacent. {0, 2, 8, 10} forms a 2×2 wing that produces B′D′.',
  },
  {
    q: 'Doubling the size of a wing changes the resulting product term by:',
    options: ['Adding one more literal', 'Removing one literal', 'Inverting the entire term', 'Nothing'],
    correct: 1,
    rationale: 'Each doubling means one variable now takes both values across the wing, so it falls out of the product.',
  },
  {
    q: 'For Y = Σm(0, 1, 2, 6, 8, 10, 13, 14), Madhur\'s Operation 1 produces which term?',
    options: ['CD', "B'D'", "A'C'", 'ABD'],
    correct: 1,
    rationale: 'The corner cluster {0, 2, 8, 10} has B = 0 and D = 0 across all four cells, while A and C vary. The wing collapses to B′D′.',
  },
  {
    q: 'Which statement is the BEST justification for the K-Map\'s torus topology?',
    options: [
      'It looks more interesting than a flat grid.',
      'Top/bottom rows differ by one bit; far-left/far-right columns differ by one bit. So they are logically adjacent.',
      'It allows wings of size 3 by curling around.',
      'It compresses the truth table to 8 rows.',
    ],
    correct: 1,
    rationale: 'Gray-code ordering on both axes means the first and last rows (and columns) are one bit apart - they share a wall via the wrap-around corridor.',
  },
  {
    q: 'A 1×4 strip wing on a 4-variable K-Map produces a product term with how many literals?',
    options: ['1', '2', '3', '4'],
    correct: 1,
    rationale: 'A 4-cell wing eliminates two variables. Starting from four variables we are left with 4 − 2 = 2 literals in the product.',
  },
  {
    q: 'In a 4-variable K-Map, the smallest possible wing covers how many cells?',
    options: ['1 cell', '2 cells', '4 cells', '8 cells'],
    correct: 0,
    rationale: 'A single isolated minterm is a wing of size 2⁰ = 1. Its product term keeps all four variables.',
  },
  {
    q: 'What does it mean when a single 1-cell belongs to two different wings?',
    options: [
      'It is illegal - every 1 must belong to exactly one wing.',
      'You forgot to combine the wings.',
      'It is allowed - overlapping wings can each be useful for simplification.',
      'It means the K-Map was drawn incorrectly.',
    ],
    correct: 2,
    rationale: 'Overlap is fine, even encouraged. A cell may participate in multiple wings if doing so makes each wing larger.',
  },
  {
    q: 'Rooms 0 (binary 0000) and 8 (binary 1000) are adjacent on the K-Map. Which variable is the shared wall?',
    options: ['A', 'B', 'C', 'D'],
    correct: 0,
    rationale: '0000 and 1000 differ only in bit A. The wall they share corresponds to variable A.',
  },
  {
    q: 'For F = Σm(1, 5, 9, 13), the four cells form a 1×4 column wing. The simplified term is:',
    options: ["A'D", "BD", "C'D", 'BCD'],
    correct: 2,
    rationale: 'Across {1, 5, 9, 13}: D = 1 always, C = 0 always; A and B both vary. The term is C′D.',
  },
  {
    q: 'Which is the LARGEST legal wing that contains minterm 5?',
    options: ['1×1 (just m5)', '1×2 with m1', '2×2 with m1, m5, m13, m9', '4-corner cluster'],
    correct: 2,
    rationale: 'The 2×2 wing {1, 5, 13, 9} is the biggest legal rectangle containing m5 (when those cells are all 1s). The other options are smaller or do not contain m5.',
  },
  {
    q: 'When should you absorb a don\'t-care X into a wing?',
    options: [
      'Always - every X should be a 1.',
      'Never - leave every X as 0.',
      'Only if absorbing it grows your wing to the next power of two.',
      'Only on Tuesdays.',
    ],
    correct: 2,
    rationale: 'X has no penalty either way, so use it only when it gives a strictly bigger (and therefore simpler) wing.',
  },
  {
    q: 'Why is "find the largest possible wings" the FIRST step of K-Map simplification?',
    options: [
      'Larger wings produce shorter product terms, meaning fewer gates and a smaller circuit.',
      'It looks more impressive on paper.',
      'Smaller wings are illegal.',
      'It is required by the textbook.',
    ],
    correct: 0,
    rationale: 'Each doubling kills one literal. Bigger wings = simpler terms = cheaper hardware. Always start big.',
  },
];

/* ──────────────────────────────────────────────────────────────────────── */
/*  Activity 2 · Wing Hunter · 8 progressive challenges                     */
/* ──────────────────────────────────────────────────────────────────────── */

const GRID = [
  [0, 1, 3, 2],
  [4, 5, 7, 6],
  [12, 13, 15, 14],
  [8, 9, 11, 10],
];

const WING_TARGETS: Array<{ id: string; want: number[]; hint: string; explanation: string; level: 'Easy' | 'Medium' | 'Hard' }> = [
  {
    id: 'pair-row',
    want: [4, 5],
    hint: 'A simple horizontal pair in row 01.',
    explanation: 'Pair · A′BC′. A=0, B=1, C=0; only D varies.',
    level: 'Easy',
  },
  {
    id: 'corner',
    want: [0, 2, 8, 10],
    hint: 'A 2×2 wing using the four extreme corners (torus).',
    explanation: 'Corner cluster · B′D′. Both B and D stay 0; A and C both vary.',
    level: 'Hard',
  },
  {
    id: 'left-col',
    want: [0, 4, 12, 8],
    hint: 'A 4×1 column wing on the leftmost edge.',
    explanation: 'Left column wing · C′D′. The whole leftmost column shares C = 0 and D = 0.',
    level: 'Medium',
  },
  {
    id: 'middle-block',
    want: [5, 7, 13, 15],
    hint: 'A 2×2 wing on the right-middle of the map.',
    explanation: 'Middle block · BD. Across this 2×2, B = 1 and D = 1; A and C both vary.',
    level: 'Medium',
  },
  {
    id: 'top-bottom-pair',
    want: [1, 9],
    hint: 'A vertical pair across the torus - top row meets bottom row.',
    explanation: 'Wrap-around pair · B′C′D. Only A flips between row 00 and row 10.',
    level: 'Hard',
  },
  {
    id: 'top-row',
    want: [0, 1, 3, 2],
    hint: 'The entire top row of the K-Map.',
    explanation: 'Row wing · A′B′. The whole top row has A = 0 and B = 0.',
    level: 'Easy',
  },
  {
    id: 'right-col',
    want: [2, 6, 14, 10],
    hint: 'The whole rightmost column.',
    explanation: 'Right column · CD′. C = 1 and D = 0 throughout this column.',
    level: 'Medium',
  },
  {
    id: 'eight-block',
    want: [4, 5, 7, 6, 12, 13, 15, 14],
    hint: 'A massive 2×4 wing - the middle two rows.',
    explanation: 'Half-map wing · B. Only one literal: B = 1 in all eight rooms.',
    level: 'Hard',
  },
];

/* ──────────────────────────────────────────────────────────────────────── */
/*  Activity 3 · Match the Term · 8 pairs                                    */
/* ──────────────────────────────────────────────────────────────────────── */

interface MatchPair { left: string; right: string; }
const MATCH_DECK: MatchPair[] = [
  { left: 'm0, m1, m4, m5',    right: "A'C'" },
  { left: 'm3, m7, m11, m15',  right: 'CD'   },
  { left: 'm6, m14',           right: "BCD'" },
  { left: 'm0, m2, m8, m10',   right: "B'D'" },
  { left: 'm5, m7, m13, m15',  right: 'BD'   },
  { left: 'm1, m5, m9, m13',   right: "C'D"  },
  { left: 'm0, m1, m2, m3',    right: "A'B'" },
  { left: 'm12, m13, m14, m15',right: 'AB'   },
];

/* ──────────────────────────────────────────────────────────────────────── */
/*  Activity 4 · True / False rapid-fire · 10 statements                     */
/* ──────────────────────────────────────────────────────────────────────── */

interface TF { s: string; ans: boolean; reason: string; }
const TF_DECK: TF[] = [
  { s: 'Two cells that differ by exactly one bit can always be merged into a wing of size 2.', ans: true,
    reason: 'That is the definition of K-Map adjacency - one bit-flip means they share a wall.' },
  { s: 'A wing of size 6 cells is allowed if it is a 2×3 rectangle.', ans: false,
    reason: '6 is not a power of two. Wings must be 1, 2, 4, 8, or 16 cells.' },
  { s: 'On a 4-variable K-Map, the four corner cells form a single 2×2 wing.', ans: true,
    reason: 'Through the torus wrap-around, {0, 2, 8, 10} cluster as a 2×2 wing producing B′D′.' },
  { s: 'A wing of size 8 produces a product term with exactly 1 literal.', ans: true,
    reason: '4 variables minus 3 doublings (1→2→4→8) = 1 literal left.' },
  { s: 'Every cell with a 1 must belong to exactly one wing.', ans: false,
    reason: 'A 1-cell may belong to multiple overlapping wings if doing so makes each wing bigger.' },
  { s: "An X (don't-care) MUST be circled if it is adjacent to a 1.", ans: false,
    reason: "Only circle X when absorbing it grows the wing. Otherwise treat it as 0." },
  { s: 'Diagonal adjacency between two cells is enough to form a wing.', ans: false,
    reason: 'Diagonals do not share a wall. Wings must be axis-aligned rectangles.' },
  { s: 'The columns of a 4-variable K-Map are labelled in Gray code: 00, 01, 11, 10.', ans: true,
    reason: 'Gray-code labelling on both axes is what makes adjacency = simplification.' },
  { s: 'A wing covering all 16 cells produces F = 1 (a constant TRUE).', ans: true,
    reason: 'Every variable both appears and disappears across the wing. The result is the constant 1.' },
  { s: 'Adjacent cells in a K-Map can differ by two or three bits if it helps simplification.', ans: false,
    reason: 'Adjacency is strictly one bit-flip. That is the entire reason Gray code is used.' },
];

/* ──────────────────────────────────────────────────────────────────────── */
/*  Activity 5 · Build the Term                                              */
/* ──────────────────────────────────────────────────────────────────────── */

interface TermChallenge {
  id: string;
  rooms: number[];
  prompt: string;
  // For each variable, what literal goes in the product?  null = variable was eliminated
  expected: { A: 'A' | "A'" | null; B: 'B' | "B'" | null; C: 'C' | "C'" | null; D: 'D' | "D'" | null };
  fullTerm: string;
}

const TERM_CHALLENGES: TermChallenge[] = [
  {
    id: 'tc1', rooms: [0, 1], prompt: 'Build the product term for the wing {m0, m1}',
    expected: { A: "A'", B: "B'", C: "C'", D: null },
    fullTerm: "A'B'C'",
  },
  {
    id: 'tc2', rooms: [5, 7, 13, 15], prompt: 'Build the term for the 2×2 wing {m5, m7, m13, m15}',
    expected: { A: null, B: 'B', C: null, D: 'D' },
    fullTerm: 'BD',
  },
  {
    id: 'tc3', rooms: [12, 13, 14, 15], prompt: 'Build the term for the bottom-middle row {m12, m13, m14, m15}',
    expected: { A: 'A', B: 'B', C: null, D: null },
    fullTerm: 'AB',
  },
  {
    id: 'tc4', rooms: [2, 6, 14, 10], prompt: 'Build the term for the right column {m2, m6, m14, m10}',
    expected: { A: null, B: null, C: 'C', D: "D'" },
    fullTerm: "CD'",
  },
];

const VAR_OPTIONS: Array<'A' | "A'" | null> = ['A', "A'", null];

const optionLabel = (v: string | null) => v === null ? '-' : v;

/* ──────────────────────────────────────────────────────────────────────── */
/*  Activity 6 · Spot the illegal wing                                       */
/* ──────────────────────────────────────────────────────────────────────── */

interface SpotChallenge {
  id: string;
  cells: number[];
  isLegal: boolean;
  why: string;
}
const SPOT_DECK: SpotChallenge[] = [
  { id: 's1', cells: [0, 1, 3, 2], isLegal: true,  why: 'Top row · 1×4 strip · legal.' },
  { id: 's2', cells: [0, 1, 5],    isLegal: false, why: '3 cells is not a power of two. Wings must be 1, 2, 4, 8 or 16.' },
  { id: 's3', cells: [5, 7, 13],   isLegal: false, why: '3 cells, plus shape is L-not a rectangle. Two reasons illegal.' },
  { id: 's4', cells: [0, 5],       isLegal: false, why: 'Diagonal · cells differ by 2 bits and share no wall.' },
  { id: 's5', cells: [0, 2, 8, 10],isLegal: true,  why: '4-corner cluster via torus · 2×2 wing · legal.' },
  { id: 's6', cells: [4, 5, 7, 6, 12, 13, 15, 14], isLegal: true, why: '2×4 wing covering middle two rows · legal · gives B.' },
];

/* ──────────────────────────────────────────────────────────────────────── */
/*  Component                                                                */
/* ──────────────────────────────────────────────────────────────────────── */

export const S13_PracticeArena: React.FC<Props> = ({ isActive, isDarkMode }) => {
  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';

  /* MCQ */
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);
  const score = Object.entries(answers).filter(([i, v]) => QUIZ[Number(i)].correct === v).length;

  /* Wing hunter */
  const [targetIdx, setTargetIdx] = useState(0);
  const [picked, setPicked] = useState<Set<number>>(new Set());
  const [solvedWings, setSolvedWings] = useState<Set<number>>(new Set());
  const target = WING_TARGETS[targetIdx];
  const targetSet = useMemo(() => new Set(target.want), [target]);
  const isCorrectWing = picked.size === targetSet.size && [...targetSet].every((m) => picked.has(m));

  React.useEffect(() => {
    if (isCorrectWing) setSolvedWings((s) => new Set(s).add(targetIdx));
  }, [isCorrectWing, targetIdx]);

  const nextWingChallenge = () => {
    setPicked(new Set());
    setTargetIdx((i) => (i + 1) % WING_TARGETS.length);
  };

  /* Match game */
  const [shuffledRights] = useState(() => {
    const arr = MATCH_DECK.map((p) => p.right);
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
      Object.keys(n).forEach((k) => { if (n[k] === matchSelectedRight) n[k] = null; });
      n[left] = matchSelectedRight;
      return n;
    });
    setMatchSelectedRight(null);
  };

  /* True/False */
  const [tfAnswers, setTfAnswers] = useState<Record<number, boolean>>({});
  const tfScore = Object.entries(tfAnswers).filter(([i, v]) => TF_DECK[Number(i)].ans === v).length;
  const tfDone = Object.keys(tfAnswers).length === TF_DECK.length;

  /* Build the Term */
  const [tcIdx, setTcIdx] = useState(0);
  const tc = TERM_CHALLENGES[tcIdx];
  const [termPicks, setTermPicks] = useState<{ A: string | null; B: string | null; C: string | null; D: string | null }>(
    { A: null, B: null, C: null, D: null }
  );
  const cycleVar = (v: 'A' | 'B' | 'C' | 'D') => {
    setTermPicks((p) => {
      const cur = p[v];
      const idx = VAR_OPTIONS.findIndex((o) => (o === null ? cur === null : o?.[0] === v && o === cur));
      const next = VAR_OPTIONS[(idx + 1) % VAR_OPTIONS.length];
      const mapped = next === null ? null : (next === 'A' ? v : `${v}'`);
      return { ...p, [v]: mapped };
    });
  };
  const tcCorrect =
    termPicks.A === (tc.expected.A ?? null) &&
    termPicks.B === (tc.expected.B ?? null) &&
    termPicks.C === (tc.expected.C ?? null) &&
    termPicks.D === (tc.expected.D ?? null);

  const nextTerm = () => {
    setTermPicks({ A: null, B: null, C: null, D: null });
    setTcIdx((i) => (i + 1) % TERM_CHALLENGES.length);
  };

  /* Spot the illegal */
  const [spotIdx, setSpotIdx] = useState(0);
  const [spotChoices, setSpotChoices] = useState<Record<string, boolean | null>>({});
  const spot = SPOT_DECK[spotIdx];
  const spotChoice = spotChoices[spot.id] ?? null;
  const spotCorrect = spotChoice !== null && spotChoice === spot.isLegal;

  return (
    <div className="max-w-6xl mx-auto space-y-12 py-4">
      <section className="space-y-3">
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.4em] uppercase text-rose-400">
          <Trophy size={14} /> Chapter 13 · Boss Drill
        </div>
        <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>Practice Arena</h2>
        <p className={`text-base max-w-3xl ${subText}`}>
          Six activities to lock in Madhur&apos;s craft. Cycle through them in any order - quiz, hunt, match,
          rapid-fire, build, and spot. Every activity is graded live.
        </p>

        <TryItYourself />

        {/* Activity index strip */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3 pt-4">
          {[
            { Icon: BrainCircuit, label: '15 MCQs', color: '#f43f5e' },
            { Icon: Target,       label: '8 Wings',  color: '#fcd34d' },
            { Icon: Wrench,       label: '8 Match',  color: '#10b981' },
            { Icon: Zap,          label: '10 T/F',   color: '#22d3ee' },
            { Icon: Hammer,       label: 'Build',    color: '#a78bfa' },
            { Icon: Flame,        label: 'Spot',     color: '#fb923c' },
          ].map((a, i) => (
            <a
              key={i}
              href={`#act${i + 1}`}
              className={`p-3 rounded-2xl border flex items-center gap-2 transition-all hover:translate-y-[-2px]`}
              style={{ borderColor: `${a.color}40`, background: `${a.color}10` }}
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${a.color}1f`, color: a.color, border: `1px solid ${a.color}55` }}>
                <a.Icon size={14} />
              </div>
              <div>
                <div className="font-mono text-[8px] uppercase tracking-widest opacity-60">Act {i + 1}</div>
                <div className={`text-xs font-bold ${textColor}`}>{a.label}</div>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* ───────────  Activity 1 · MCQ Quiz  ─────────── */}
      <motion.div
        id="act1"
        initial={{ opacity: 0, y: 12 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        className={`p-8 rounded-3xl border ${cardBg}`}
      >
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/20 border border-rose-400/40 flex items-center justify-center text-rose-300">
              <BrainCircuit size={18} />
            </div>
            <div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-rose-400">Activity 01 · Knowledge Gate</div>
              <h3 className={`text-xl font-black ${textColor}`}>15 multiple-choice questions</h3>
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

        {/* Progress bar */}
        <div className={`h-1 rounded-full ${isDarkMode ? 'bg-black/20' : 'bg-slate-200'} overflow-hidden mb-6`}>
          <motion.div
            animate={{ width: `${(Object.keys(answers).length / QUIZ.length) * 100}%` }}
            className="h-full bg-rose-400"
            style={{ boxShadow: '0 0 10px rgba(244,63,94,0.6)' }}
          />
        </div>

        <div className="space-y-6">
          {QUIZ.map((m, qi) => (
            <div key={qi} className={`p-5 rounded-2xl border ${isDarkMode ? 'bg-black/30 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
              <div className="flex items-baseline gap-3 mb-3">
                <span className="font-mono text-xs text-rose-400 font-black">Q{qi + 1}.</span>
                <span className={`text-sm font-bold ${textColor}`}>{m.q}</span>
              </div>
              <div className="grid sm:grid-cols-2 gap-2">
                {m.options.map((opt, oi) => {
                  const pickedAns = answers[qi] === oi;
                  const isCorrect = m.correct === oi;
                  const reveal = showResults;
                  return (
                    <button
                      key={oi}
                      disabled={showResults}
                      onClick={() => setAnswers((a) => ({ ...a, [qi]: oi }))}
                      className={`text-left px-4 py-2.5 rounded-xl border-2 transition-all flex items-center gap-3 ${
                        reveal
                          ? isCorrect
                            ? 'border-emerald-400 bg-emerald-500/15 text-emerald-200'
                            : pickedAns
                            ? 'border-rose-400 bg-rose-500/15 text-rose-200'
                            : isDarkMode ? 'border-white/10 text-slate-400' : 'border-slate-200 text-slate-500'
                          : pickedAns
                          ? 'border-rose-400 bg-rose-500/15 text-rose-200'
                          : isDarkMode ? 'border-white/10 hover:border-rose-400/50 text-slate-300' : 'border-slate-200 hover:border-rose-400/50 text-slate-700'
                      }`}
                    >
                      <span className="font-mono text-[11px] opacity-60">{String.fromCharCode(65 + oi)}.</span>
                      <span className="text-sm flex-1">{opt}</span>
                      {reveal && isCorrect && <CheckCircle2 size={16} className="text-emerald-400" />}
                      {reveal && pickedAns && !isCorrect && <XCircle size={16} className="text-rose-400" />}
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
              score >= 12 ? 'border-emerald-400 bg-emerald-500/10' : score >= 9 ? 'border-amber-400 bg-amber-500/10' : 'border-rose-400 bg-rose-500/10'
            }`}
          >
            <div className="font-mono text-[10px] uppercase tracking-widest text-amber-400 mb-1">Score</div>
            <div className={`text-3xl font-black ${textColor}`}>{score} / {QUIZ.length}</div>
            <div className={`text-[12px] mt-1 ${subText}`}>
              {score >= 12 ? 'Master Architect - proceed to Verilog.' : score >= 9 ? 'Solid foundation. Replay the gray-code & corridors chapters.' : 'Re-watch the lecture and the operations chapter, then retry.'}
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* ───────────  Activity 2 · Wing Hunter  ─────────── */}
      <motion.div
        id="act2"
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
              <div className="font-mono text-[10px] uppercase tracking-widest text-amber-400">Activity 02 · Wing Hunter</div>
              <h3 className={`text-xl font-black ${textColor}`}>Click the rooms · 8 challenges</h3>
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

        {/* Challenge tracker */}
        <div className="flex flex-wrap gap-2 mb-5">
          {WING_TARGETS.map((w, i) => (
            <button
              key={w.id}
              onClick={() => { setTargetIdx(i); setPicked(new Set()); }}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold border ${
                i === targetIdx
                  ? 'bg-amber-400 text-black border-amber-300'
                  : solvedWings.has(i)
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : isDarkMode ? 'border-white/10 text-slate-400' : 'border-slate-200 text-slate-500'
              }`}
            >
              {solvedWings.has(i) ? '✓' : i + 1} · {w.level}
            </button>
          ))}
        </div>

        <div className={`p-4 rounded-2xl border mb-5 ${isDarkMode ? 'bg-black/30 border-amber-400/30' : 'bg-amber-50 border-amber-300'}`}>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-amber-400 mb-1">
                Challenge {targetIdx + 1} / {WING_TARGETS.length} · {target.level}
              </div>
              <div className={`text-sm font-bold ${textColor}`}>{target.hint}</div>
            </div>
            <div className="font-mono text-xs opacity-60">Need: {target.want.length} cells</div>
          </div>
        </div>

        <div className="grid lg:grid-cols-[1.4fr_1fr] gap-8">
          <div>
            <div className="grid grid-cols-[48px_repeat(4,minmax(0,1fr))] sm:grid-cols-[80px_repeat(4,minmax(0,1fr))] gap-1.5 items-end mb-1">
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
                <div key={r} className="grid grid-cols-[48px_repeat(4,minmax(0,1fr))] sm:grid-cols-[80px_repeat(4,minmax(0,1fr))] gap-1.5 items-stretch">
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
            <div className={`p-4 rounded-2xl border ${isDarkMode ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-white'}`}>
              <div className="font-mono text-[10px] uppercase tracking-widest text-amber-400 mb-1">Solved</div>
              <div className={`text-2xl font-black ${textColor}`}>{solvedWings.size} / {WING_TARGETS.length}</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ───────────  Activity 3 · Match the Term  ─────────── */}
      <motion.div
        id="act3"
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
              <div className="font-mono text-[10px] uppercase tracking-widest text-emerald-400">Activity 03 · Match the Wing</div>
              <h3 className={`text-xl font-black ${textColor}`}>8 wing → term pairs</h3>
            </div>
          </div>
          <div className="font-mono text-sm text-emerald-300">
            Score · {matchScore} / {MATCH_DECK.length}
          </div>
        </div>

        <p className={`text-[12px] ${subText} mb-5`}>
          Tap a term on the right, then tap the matching wing on the left. Wrong assignments stay visible until you swap them.
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <div className="font-mono text-[10px] uppercase tracking-widest text-emerald-400 mb-2">Wings (room sets)</div>
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

      {/* ───────────  Activity 4 · True / False rapid-fire  ─────────── */}
      <motion.div
        id="act4"
        initial={{ opacity: 0, y: 12 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.3 }}
        className={`p-8 rounded-3xl border ${cardBg}`}
      >
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
              <Zap size={18} />
            </div>
            <div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-cyan-400">Activity 04 · Rapid Fire</div>
              <h3 className={`text-xl font-black ${textColor}`}>10 True / False statements</h3>
            </div>
          </div>
          <div className={`font-mono text-sm text-cyan-300`}>
            Answered · {Object.keys(tfAnswers).length} / {TF_DECK.length}
          </div>
        </div>

        <div className="space-y-3">
          {TF_DECK.map((t, i) => {
            const ans = tfAnswers[i];
            const has = ans !== undefined;
            const isCorrect = has && ans === t.ans;
            return (
              <div
                key={i}
                className={`p-4 rounded-2xl border-2 transition-all ${
                  has
                    ? isCorrect
                      ? 'border-emerald-400 bg-emerald-500/5'
                      : 'border-rose-400 bg-rose-500/5'
                    : isDarkMode ? 'border-white/10 bg-black/20' : 'border-slate-200 bg-slate-50'
                }`}
              >
                <div className="flex items-start gap-3 mb-2">
                  <span className="font-mono text-xs text-cyan-400 font-black flex-shrink-0 mt-1">{String(i + 1).padStart(2, '0')}.</span>
                  <span className={`text-sm font-bold flex-1 ${textColor}`}>{t.s}</span>
                </div>
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => setTfAnswers((a) => ({ ...a, [i]: true }))}
                    disabled={has}
                    className={`px-4 py-1.5 rounded-lg text-[12px] font-mono font-bold transition-all ${
                      ans === true
                        ? t.ans === true
                          ? 'bg-emerald-400 text-black'
                          : 'bg-rose-400 text-black'
                        : isDarkMode ? 'bg-white/5 hover:bg-emerald-500/10 border border-white/10' : 'bg-slate-100 hover:bg-emerald-50 border border-slate-200'
                    }`}
                  >
                    TRUE
                  </button>
                  <button
                    onClick={() => setTfAnswers((a) => ({ ...a, [i]: false }))}
                    disabled={has}
                    className={`px-4 py-1.5 rounded-lg text-[12px] font-mono font-bold transition-all ${
                      ans === false
                        ? t.ans === false
                          ? 'bg-emerald-400 text-black'
                          : 'bg-rose-400 text-black'
                        : isDarkMode ? 'bg-white/5 hover:bg-rose-500/10 border border-white/10' : 'bg-slate-100 hover:bg-rose-50 border border-slate-200'
                    }`}
                  >
                    FALSE
                  </button>
                  {has && (
                    <span className={`px-3 py-1.5 rounded-lg text-[11px] font-mono italic ${subText}`}>
                      {t.reason}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {tfDone && (
          <motion.div
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            className={`mt-4 p-4 rounded-2xl border-2 text-center ${
              tfScore >= 8 ? 'border-emerald-400 bg-emerald-500/10' : tfScore >= 5 ? 'border-amber-400 bg-amber-500/10' : 'border-rose-400 bg-rose-500/10'
            }`}
          >
            <div className={`text-2xl font-black ${textColor}`}>{tfScore} / {TF_DECK.length}</div>
            <button
              onClick={() => setTfAnswers({})}
              className={`mt-2 px-4 py-1.5 rounded-lg text-[11px] font-mono font-bold border ${isDarkMode ? 'border-white/10 hover:bg-white/5' : 'border-slate-200 hover:bg-slate-100'}`}
            >
              <RefreshCw size={11} className="inline mr-1" /> Retry
            </button>
          </motion.div>
        )}
      </motion.div>

      {/* ───────────  Activity 5 · Build the Term  ─────────── */}
      <motion.div
        id="act5"
        initial={{ opacity: 0, y: 12 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.4 }}
        className={`p-8 rounded-3xl border ${cardBg}`}
      >
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-violet-500/20 border border-violet-400/40 flex items-center justify-center text-violet-300">
              <Hammer size={18} />
            </div>
            <div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-violet-400">Activity 05 · Build the Term</div>
              <h3 className={`text-xl font-black ${textColor}`}>Pick the literal for each variable</h3>
            </div>
          </div>
          <button
            onClick={nextTerm}
            className="px-4 py-2 rounded-xl text-[11px] font-mono font-bold bg-violet-400 text-black hover:shadow-lg hover:shadow-violet-500/30"
          >
            Next →
          </button>
        </div>

        <div className={`p-4 rounded-2xl border mb-5 ${isDarkMode ? 'bg-black/30 border-violet-400/30' : 'bg-violet-50 border-violet-300'}`}>
          <div className="font-mono text-[10px] uppercase tracking-widest text-violet-400 mb-1">
            Challenge {tcIdx + 1} / {TERM_CHALLENGES.length}
          </div>
          <div className={`text-sm font-bold ${textColor}`}>{tc.prompt}</div>
        </div>

        <div className="grid lg:grid-cols-[1fr_1fr] gap-8">
          {/* Mini map showing the wing */}
          <div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-violet-400 mb-3">The wing</div>
            <div className="grid grid-cols-[60px_repeat(4,minmax(0,1fr))] gap-1 items-end mb-1">
              <div />
              {['00', '01', '11', '10'].map((cd, c) => (
                <div key={c} className="text-center font-mono text-xs text-violet-300/80">{cd}</div>
              ))}
            </div>
            <div className="space-y-1">
              {['00', '01', '11', '10'].map((ab, r) => (
                <div key={r} className="grid grid-cols-[60px_repeat(4,minmax(0,1fr))] gap-1 items-stretch">
                  <div className="flex items-center justify-end font-mono text-xs text-violet-300/80">{ab}</div>
                  {GRID[r].map((m, c) => {
                    const inWing = tc.rooms.includes(m);
                    return (
                      <div
                        key={c}
                        className="aspect-square rounded flex items-center justify-center font-mono font-black text-sm border"
                        style={{
                          background: inWing ? 'rgba(167,139,250,0.24)' : isDarkMode ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)',
                          borderColor: inWing ? '#a78bfa' : isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                          color: inWing ? '#c4b5fd' : isDarkMode ? '#94a3b8' : '#475569',
                          boxShadow: inWing ? '0 0 12px rgba(167,139,250,0.35)' : undefined,
                        }}
                      >
                        {m}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Variable selectors */}
          <div className="space-y-3">
            <div className="font-mono text-[10px] uppercase tracking-widest text-violet-400 mb-1">Construct the product</div>
            <div className="flex flex-wrap gap-3">
              {(['A', 'B', 'C', 'D'] as const).map((v) => {
                const cur = termPicks[v];
                return (
                  <button
                    key={v}
                    onClick={() => cycleVar(v)}
                    className={`px-5 py-3 rounded-xl border-2 transition-all min-w-[68px] ${
                      cur === null
                        ? isDarkMode ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-slate-50'
                        : 'border-violet-400 bg-violet-500/15'
                    }`}
                  >
                    <div className="font-mono text-[9px] uppercase tracking-widest opacity-50 mb-1">var {v}</div>
                    <div className={`font-mono font-black text-2xl ${cur === null ? 'opacity-40' : 'text-violet-300'}`}>
                      {optionLabel(cur)}
                    </div>
                  </button>
                );
              })}
            </div>
            <div className={`text-[11px] ${subText}`}>
              Tap a button to cycle through <span className="font-mono">A</span> →{' '}
              <span className="font-mono">A&apos;</span> → <span className="font-mono">-</span> (eliminated).
              Pick the literal each variable takes across <em>all</em> cells of the wing. If a variable changes
              across the wing, eliminate it.
            </div>
            <div className={`p-4 rounded-2xl border ${tcCorrect ? 'border-emerald-400/50 bg-emerald-500/10' : isDarkMode ? 'border-white/10 bg-black/30' : 'border-slate-200 bg-slate-50'}`}>
              <div className="font-mono text-[10px] uppercase tracking-widest text-violet-400 mb-1">Your term</div>
              <div className="font-mono text-2xl font-black text-violet-300">
                {[termPicks.A, termPicks.B, termPicks.C, termPicks.D].filter(Boolean).join(' · ') || '-'}
              </div>
              {tcCorrect && (
                <div className="text-emerald-300 text-sm font-bold mt-2">
                  ✓ Matches the expected term: <span className="font-mono">{tc.fullTerm}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* ───────────  Activity 6 · Spot the illegal wing  ─────────── */}
      <motion.div
        id="act6"
        initial={{ opacity: 0, y: 12 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.5 }}
        className={`p-8 rounded-3xl border ${cardBg}`}
      >
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-500/20 border border-orange-400/40 flex items-center justify-center text-orange-300">
              <Flame size={18} />
            </div>
            <div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-orange-400">Activity 06 · Spot the Wing</div>
              <h3 className={`text-xl font-black ${textColor}`}>Legal or illegal? · 6 challenges</h3>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setSpotIdx((i) => (i + 1) % SPOT_DECK.length)}
              className="px-4 py-2 rounded-xl text-[11px] font-mono font-bold bg-orange-400 text-black hover:shadow-lg hover:shadow-orange-500/30"
            >
              Next →
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-[1fr_1fr] gap-8">
          <div>
            <div className="grid grid-cols-[60px_repeat(4,minmax(0,1fr))] gap-1 items-end mb-1">
              <div />
              {['00', '01', '11', '10'].map((cd, c) => (
                <div key={c} className="text-center font-mono text-xs text-orange-300/80">{cd}</div>
              ))}
            </div>
            <div className="space-y-1">
              {['00', '01', '11', '10'].map((ab, r) => (
                <div key={r} className="grid grid-cols-[60px_repeat(4,minmax(0,1fr))] gap-1 items-stretch">
                  <div className="flex items-center justify-end font-mono text-xs text-orange-300/80">{ab}</div>
                  {GRID[r].map((m, c) => {
                    const inWing = spot.cells.includes(m);
                    return (
                      <div
                        key={c}
                        className="aspect-square rounded flex items-center justify-center font-mono font-black text-base border-2"
                        style={{
                          background: inWing ? 'rgba(251,146,60,0.24)' : isDarkMode ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)',
                          borderColor: inWing ? '#fb923c' : isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                          color: inWing ? '#fdba74' : isDarkMode ? '#94a3b8' : '#475569',
                          boxShadow: inWing ? '0 0 14px rgba(251,146,60,0.35)' : undefined,
                        }}
                      >
                        {m}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-black/30 border-orange-400/30' : 'bg-orange-50 border-orange-300'}`}>
              <div className="font-mono text-[10px] uppercase tracking-widest text-orange-400 mb-1">
                Challenge {spotIdx + 1} / {SPOT_DECK.length}
              </div>
              <div className={`text-sm font-bold ${textColor}`}>
                Is the highlighted shape a LEGAL K-Map wing?
              </div>
              <div className="font-mono text-[11px] mt-2 opacity-60">
                Cells: {spot.cells.map((m) => `m${m}`).join(', ')}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setSpotChoices((c) => ({ ...c, [spot.id]: true }))}
                disabled={spotChoice !== null}
                className={`p-4 rounded-2xl border-2 font-bold transition-all ${
                  spotChoice === true
                    ? spot.isLegal
                      ? 'border-emerald-400 bg-emerald-500/15 text-emerald-200'
                      : 'border-rose-400 bg-rose-500/15 text-rose-200'
                    : isDarkMode ? 'border-white/10 hover:border-emerald-400 text-emerald-300' : 'border-slate-200 hover:border-emerald-400 text-emerald-700'
                }`}
              >
                <Crown size={20} className="mx-auto mb-1" />
                LEGAL
              </button>
              <button
                onClick={() => setSpotChoices((c) => ({ ...c, [spot.id]: false }))}
                disabled={spotChoice !== null}
                className={`p-4 rounded-2xl border-2 font-bold transition-all ${
                  spotChoice === false
                    ? !spot.isLegal
                      ? 'border-emerald-400 bg-emerald-500/15 text-emerald-200'
                      : 'border-rose-400 bg-rose-500/15 text-rose-200'
                    : isDarkMode ? 'border-white/10 hover:border-rose-400 text-rose-300' : 'border-slate-200 hover:border-rose-400 text-rose-700'
                }`}
              >
                <XCircle size={20} className="mx-auto mb-1" />
                ILLEGAL
              </button>
            </div>

            {spotChoice !== null && (
              <motion.div
                initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-2xl border ${
                  spotCorrect ? 'border-emerald-400/50 bg-emerald-500/10' : 'border-rose-400/50 bg-rose-500/10'
                }`}
              >
                <div className={`text-sm font-bold mb-1 ${spotCorrect ? 'text-emerald-300' : 'text-rose-300'}`}>
                  {spotCorrect ? '✓ Correct!' : '✗ Re-read the rule.'}
                </div>
                <div className={`text-[12px] ${subText}`}>{spot.why}</div>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Closing */}
      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.6 }}
        className={`p-8 rounded-3xl border ${cardBg} text-center`}
      >
        <Sparkles className="mx-auto text-amber-400 mb-3" size={20} />
        <div className="font-mono text-[10px] uppercase tracking-widest text-amber-400 mb-2">Module Complete</div>
        <p className={`text-base leading-relaxed ${textColor}`}>
          You&apos;ve walked the entire maze - gray-coded grid, power-of-two wings, the torus, the manifest, the
          four operations, the don&apos;t-care loophole, the masterclass and the boss drill.{' '}
          <strong className="text-amber-300">Madhur tips his hat.</strong>
        </p>
      </motion.div>
    </div>
  );
};
