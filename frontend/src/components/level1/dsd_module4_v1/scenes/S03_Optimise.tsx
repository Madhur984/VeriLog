import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Grid3x3, ChevronRight, ChevronDown, CheckCircle2, Lightbulb } from 'lucide-react';

interface Props { isActive: boolean; isDarkMode: boolean; }

const COL3 = [0, 1, 3, 2];
const ROW4 = [0, 1, 3, 2];
const COL4 = [0, 1, 3, 2];

interface Group { cells: number[]; color: string; term: string; label: string; }

interface OptProblem {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Harder';
  spec: string;
  vars: 3 | 4;
  active: number[];
  dontCares: number[];
  groups: Group[];
  questions: { q: string; a: string }[];
  unsimplified: string;
  minimised: string;
  literalsBefore: number;
  literalsAfter: number;
  insight: string;
}

// ─────────────────────────────────────────────────────────────────────────
// K-Map renderer
// ─────────────────────────────────────────────────────────────────────────
const KMap: React.FC<{
  vars: 3 | 4;
  active: Set<number>;
  dontCares: Set<number>;
  groups: Group[];
  showGroups: boolean;
  isDarkMode: boolean;
}> = ({ vars, active, dontCares, groups, showGroups, isDarkMode }) => {
  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const groupOf = (m: number) => groups.find((g) => g.cells.includes(m));

  if (vars === 3) {
    return (
      <div className="inline-block">
        <div className="grid grid-cols-[60px_repeat(4,72px)] gap-1 mb-1">
          <div></div>
          {['00', '01', '11', '10'].map((g) => (
            <div key={g} className="text-center font-mono text-[11px] text-violet-300 pb-1">BC={g}</div>
          ))}
        </div>
        {[0, 1].map((a) => (
          <div key={a} className="grid grid-cols-[60px_repeat(4,72px)] gap-1 mb-1">
            <div className="text-right pr-3 font-mono text-[11px] text-violet-300 self-center">A={a}</div>
            {COL3.map((bc, col) => {
              const m = a * 4 + bc;
              const isOne = active.has(m);
              const isDC = dontCares.has(m);
              const grp = groupOf(m);
              const cellIdx = a * 4 + col;
              return (
                <motion.div
                  key={col}
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: cellIdx * 0.05, duration: 0.3, type: 'spring' }}
                  className={`relative h-16 rounded-xl border-2 grid place-items-center font-mono font-black ${
                    isOne ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200 shadow-[0_0_25px_rgba(52,211,153,0.3)]'
                          : isDC ? 'bg-amber-500/15 border-amber-400/60 text-amber-300'
                                : `bg-black/20 border-white/10 ${textColor}`
                  }`}
                >
                  <span className="text-2xl">{isOne ? 1 : isDC ? 'X' : 0}</span>
                  <span className="absolute top-1 left-2 text-[9px] opacity-50">m{m}</span>
                  <AnimatePresence>
                    {showGroups && grp && (
                      <motion.span
                        initial={{ opacity: 0, scale: 0.85 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ delay: 0.2 + groups.indexOf(grp) * 0.2 }}
                        className="absolute -inset-0.5 rounded-xl border-[3px] pointer-events-none"
                        style={{ borderColor: grp.color }}
                      />
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        ))}
      </div>
    );
  }

  // 4-var
  return (
    <div className="inline-block">
      <div className="grid grid-cols-[60px_repeat(4,68px)] gap-1 mb-1">
        <div></div>
        {['00', '01', '11', '10'].map((g) => (
          <div key={g} className="text-center font-mono text-[10px] text-violet-300 pb-1">CD={g}</div>
        ))}
      </div>
      {[0, 1, 2, 3].map((rowIdx) => (
        <div key={rowIdx} className="grid grid-cols-[60px_repeat(4,68px)] gap-1 mb-1">
          <div className="text-right pr-2 font-mono text-[10px] text-violet-300 self-center">
            AB={['00', '01', '11', '10'][rowIdx]}
          </div>
          {[0, 1, 2, 3].map((colIdx) => {
            const m = ROW4[rowIdx] * 4 + COL4[colIdx];
            const isOne = active.has(m);
            const isDC = dontCares.has(m);
            const grp = groupOf(m);
            const cellIdx = rowIdx * 4 + colIdx;
            return (
              <motion.div
                key={colIdx}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: cellIdx * 0.04, duration: 0.3, type: 'spring' }}
                className={`relative h-14 rounded-lg border-2 grid place-items-center font-mono text-sm font-black ${
                  isOne ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200 shadow-[0_0_15px_rgba(52,211,153,0.3)]'
                        : isDC ? 'bg-amber-500/15 border-amber-400/60 text-amber-300'
                              : `bg-black/20 border-white/10 ${textColor}`
                }`}
              >
                <span>{isOne ? 1 : isDC ? 'X' : 0}</span>
                <span className="absolute top-0.5 left-1 text-[8px] opacity-50">m{m}</span>
                <AnimatePresence>
                  {showGroups && grp && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: 0.2 + groups.indexOf(grp) * 0.2 }}
                      className="absolute -inset-0.5 rounded-lg border-[3px] pointer-events-none"
                      style={{ borderColor: grp.color }}
                    />
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────
// Problems
// ─────────────────────────────────────────────────────────────────────────
const PROBLEMS: OptProblem[] = [
  {
    id: 'o1',
    title: 'O1 · Almost every row is 1',
    difficulty: 'Easy',
    spec: 'F(A,B,C) = Σm(0, 1, 2, 4, 5, 6, 7)',
    vars: 3,
    active: [0, 1, 2, 4, 5, 6, 7],
    dontCares: [],
    groups: [
      { cells: [4, 5, 6, 7], color: '#0ea5e9', term: 'A',  label: 'Entire bottom row · A=1 stays' },
      { cells: [0, 1, 4, 5], color: '#a78bfa', term: "B'", label: 'BC=00 ∪ BC=01 columns · B=0 stays' },
      { cells: [0, 2, 4, 6], color: '#fb923c', term: "C'", label: 'BC=00 ∪ BC=10 columns · C=0 stays' },
    ],
    questions: [
      { q: 'Only one row is missing from the list. Which one?',
        a: 'm3 (A=0, B=1, C=1). Every other row is 1.' },
      { q: 'What is the shortest equation?',
        a: "F = A + B' + C'  · 3 single-letter terms. Three 4-cell groups cover the whole K-Map." },
      { q: 'How many gates do you need in total?',
        a: '3 gates · 2 NOTs (for B′ and C′) and 1 OR with 3 inputs. No ANDs needed because each term is just one letter!' },
      { q: 'Why is this so much smaller than the 7-term equation?',
        a: 'The only row that is 0 is m3. Using DeMorgan: F = (A′BC)′ = A + B′ + C′. Exactly what the K-Map gives you.' },
    ],
    unsimplified: "F = A'B'C' + A'B'C + A'BC' + AB'C' + AB'C + ABC' + ABC  (7 terms · 21 letters)",
    minimised: "F = A + B' + C'",
    literalsBefore: 21,
    literalsAfter: 3,
    insight: 'When only ONE row is 0 in the truth table, the shortest form is always the OR of the missing row\'s variables (flipped). DeMorgan magic.',
  },

  {
    id: 'o2',
    title: "O2 · Three groups you can't avoid",
    difficulty: 'Medium',
    spec: 'F(A,B,C,D) = Σm(2, 3, 4, 5, 6, 7, 11, 15)',
    vars: 4,
    active: [2, 3, 4, 5, 6, 7, 11, 15],
    dontCares: [],
    groups: [
      { cells: [4, 5, 6, 7],   color: '#0ea5e9', term: "A'B", label: 'AB=01 row · 4-cell quad' },
      { cells: [3, 7, 11, 15], color: '#a78bfa', term: 'CD',  label: 'CD=11 column · 4-cell quad' },
      { cells: [2, 3, 6, 7],   color: '#fb923c', term: "A'C", label: '2×2 block · A=0 ∧ C=1' },
    ],
    questions: [
      { q: 'How many 4-cell groups can you find on the K-Map?',
        a: 'Three: A′B (AB=01 row), CD (CD=11 column), and A′C (a 2×2 in the top half).' },
      { q: 'Do you need all 3 groups, or can you skip one?',
        a: 'You need all 3. Each one covers at least one cell that no other group can reach. m4 and m5 only fit in A′B; m11 only fits in CD; m2 only fits in A′C.' },
      { q: 'What is the final shortest equation?',
        a: "F = A'B + CD + A'C · 3 AND terms · 6 letters total." },
      { q: 'How many gates total?',
        a: '6 gates · 2 NOTs (for A and C), 3 ANDs, 1 OR with 3 inputs.' },
    ],
    unsimplified: '8 rows × 4 letters each = 32 letters',
    minimised: "F = A'B + CD + A'C",
    literalsBefore: 32,
    literalsAfter: 6,
    insight: 'When two 4-cell groups overlap, the shared cells show up in both terms. That is FREE in hardware — the OR gate does not mind if 2 ANDs fire at the same time.',
  },

  {
    id: 'o3',
    title: "O3 · Don't-cares shrink the answer to one letter",
    difficulty: 'Harder',
    spec: 'F(A,B,C,D) = Σm(1, 3, 5, 7, 9) + d(10, 11, 12, 13, 14, 15)',
    vars: 4,
    active: [1, 3, 5, 7, 9],
    dontCares: [10, 11, 12, 13, 14, 15],
    groups: [
      { cells: [1, 3, 5, 7, 9, 11, 13, 15], color: '#0ea5e9', term: 'D', label: 'CD=01 ∪ CD=11 columns · D=1 stays · 8-cell octet' },
    ],
    questions: [
      { q: 'BCD only uses 0–9 (rows m0 to m9). So what about m10 to m15?',
        a: 'Those rows are "don\'t cares" — those input combos never happen in real BCD. We can pretend they are 0 OR 1, whichever helps shrink F.' },
      { q: 'If you treat the don\'t-cares as 1 when helpful, can you find an 8-cell group?',
        a: 'Yes! The CD=01 and CD=11 columns together = 8 cells. All the real 1s (m1, m3, m5, m7, m9) plus the don\'t-cares m11, m13, m15 all fall in D=1. Set the rest to 0.' },
      { q: 'What is the shortest equation?',
        a: 'F = D · just one letter. Literally a single wire, no gates needed!' },
      { q: 'Without using don\'t-cares, how big would the equation be?',
        a: 'You\'d need at least F = A′D + AB′C′D (2 terms, 6 letters), or worse. Don\'t-cares cut 6 letters down to 1.' },
    ],
    unsimplified: 'Without don\'t-cares · F = A′D + AB′C′D (6 letters)',
    minimised: 'F = D',
    literalsBefore: 6,
    literalsAfter: 1,
    insight: 'BCD odd-number detector. By using the unused codes 10–15 as wildcards, the K-Map combines 5 separate rows into one big 8-cell column — F is just the last bit.',
  },
];

// ─────────────────────────────────────────────────────────────────────────
// Card
// ─────────────────────────────────────────────────────────────────────────
const OptimiseCard: React.FC<{ p: OptProblem; isDarkMode: boolean }> = ({ p, isDarkMode }) => {
  const [open, setOpen] = useState(false);
  const [showGroups, setShowGroups] = useState(false);

  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText   = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg    = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';
  const diffColor = p.difficulty === 'Easy' ? '#22c55e' : p.difficulty === 'Medium' ? '#fbbf24' : '#fb7185';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className={`p-7 rounded-3xl border ${cardBg}`}
    >
      <div className="flex items-start justify-between gap-4 mb-3 flex-wrap">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span
              className="px-2 py-0.5 rounded-md font-mono text-[10px] uppercase tracking-widest font-black"
              style={{ background: `${diffColor}22`, color: diffColor, border: `1px solid ${diffColor}55` }}
            >
              {p.difficulty}
            </span>
            <span className="font-mono text-[10px] uppercase tracking-widest opacity-60">
              {p.vars}-variable
            </span>
            {p.dontCares.length > 0 && (
              <span className="px-2 py-0.5 rounded-md font-mono text-[10px] uppercase tracking-widest font-black bg-amber-500/20 text-amber-300 border border-amber-400/55">
                Don't-cares
              </span>
            )}
          </div>
          <h3 className={`text-xl font-black ${textColor}`}>{p.title}</h3>
          <p className={`font-mono text-sm ${subText} mt-1`}>{p.spec}</p>
        </div>
      </div>

      {/* Sub-questions */}
      <div className={`p-4 rounded-2xl border ${cardBg} mb-4`}>
        <div className="font-mono text-[10px] uppercase tracking-widest text-violet-400 mb-3">
          Drill · {p.questions.length} sub-questions
        </div>
        <ol className="space-y-1.5">
          {p.questions.map((qa, i) => (
            <li key={i} className={`text-sm ${subText} flex gap-2`}>
              <span className="font-mono text-violet-300 font-black">{i + 1}.</span>
              <span>{qa.q}</span>
            </li>
          ))}
        </ol>
      </div>

      <button
        onClick={() => setOpen(!open)}
        className="w-full px-5 py-3 rounded-xl border-2 border-violet-400/50 bg-violet-500/10 text-violet-300 font-mono text-sm uppercase tracking-widest font-black flex items-center justify-center gap-2 hover:bg-violet-500/20 transition-all"
      >
        {open ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        {open ? 'Hide solution' : 'Reveal full solution'}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="space-y-4 pt-5 mt-5 border-t" style={{ borderColor: isDarkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }}>
              {/* K-Map (revealed) */}
              <div className={`p-5 rounded-2xl border ${isDarkMode ? 'bg-black/30 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                  <div className="font-mono text-[10px] uppercase tracking-widest text-violet-300">
                    K-Map · toggle to highlight groups
                  </div>
                  <button
                    onClick={() => setShowGroups(!showGroups)}
                    className={`px-3 py-1.5 rounded-lg font-mono text-[10px] uppercase tracking-widest font-black transition-all ${
                      showGroups
                        ? 'bg-violet-400 text-black'
                        : isDarkMode ? 'bg-white/10 text-violet-300 hover:bg-white/15' : 'bg-violet-100 text-violet-700 hover:bg-violet-200'
                    }`}
                  >
                    {showGroups ? 'Hide groups' : 'Show groups'}
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <KMap
                    vars={p.vars}
                    active={new Set(p.active)}
                    dontCares={new Set(p.dontCares)}
                    groups={p.groups}
                    showGroups={showGroups}
                    isDarkMode={isDarkMode}
                  />
                </div>
                {p.dontCares.length > 0 && (
                  <div className={`mt-3 text-[11px] font-mono ${subText} flex items-center gap-2`}>
                    <span className="px-2 py-0.5 rounded bg-amber-500/15 border border-amber-400/60 text-amber-300">X</span>
                    <span>= don't-care · treat as 1 if it helps form a larger group</span>
                  </div>
                )}
              </div>

              {/* Group details (revealed) */}
              {showGroups && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2"
                >
                  {p.groups.map((g) => (
                    <div
                      key={g.term}
                      className="p-3 rounded-xl border-2"
                      style={{ borderColor: g.color, background: `${g.color}10` }}
                    >
                      <div className="font-mono text-[10px] uppercase tracking-widest mb-1" style={{ color: g.color }}>
                        {g.cells.length}-cell loop
                      </div>
                      <div className={`text-base font-black font-mono ${textColor}`}>{g.term}</div>
                      <p className={`text-[10px] ${subText} mt-1 font-mono`}>{g.label}</p>
                    </div>
                  ))}
                </motion.div>
              )}

              {/* Q&A reveal */}
              <div className="rounded-2xl p-5 border-2 border-emerald-400/40 bg-emerald-500/5">
                <div className="font-mono text-[10px] uppercase tracking-widest text-emerald-300 mb-3 flex items-center gap-2">
                  <CheckCircle2 size={12} /> Sub-question answers
                </div>
                <div className="space-y-3">
                  {p.questions.map((qa, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.08 }}
                      className={`p-3 rounded-xl ${isDarkMode ? 'bg-black/30' : 'bg-white'}`}
                    >
                      <div className={`text-sm ${textColor} font-bold`}>
                        <span className="text-emerald-300 font-mono mr-2">Q{i + 1}.</span>{qa.q}
                      </div>
                      <div className={`text-sm ${subText} mt-1 ml-7 font-mono`}>{qa.a}</div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Before / After */}
              <div className="grid sm:grid-cols-2 gap-3">
                <div className={`p-4 rounded-2xl border-2 border-amber-400/40 bg-amber-500/10`}>
                  <div className="font-mono text-[10px] uppercase tracking-widest text-amber-300 mb-2">Before</div>
                  <div className={`font-mono text-sm font-black ${textColor} break-all`}>{p.unsimplified}</div>
                  <div className={`mt-2 text-xs ${subText} font-mono`}>{p.literalsBefore} literals</div>
                </div>
                <div className={`p-4 rounded-2xl border-2 border-emerald-400 bg-emerald-500/10`}>
                  <div className="font-mono text-[10px] uppercase tracking-widest text-emerald-300 mb-2">After</div>
                  <div className={`font-mono text-lg font-black ${textColor}`}>{p.minimised}</div>
                  <div className={`mt-2 text-xs ${subText} font-mono`}>{p.literalsAfter} literals · {Math.round((1 - p.literalsAfter / p.literalsBefore) * 100)}% reduction</div>
                </div>
              </div>

              <div className="rounded-2xl p-4 border border-violet-400/40 bg-violet-500/10 flex items-start gap-3">
                <Lightbulb className="text-violet-300 mt-0.5 shrink-0" size={16} />
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-widest text-violet-300 mb-1">Insight</div>
                  <p className={`text-sm ${subText}`}>{p.insight}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export const S03_Optimise: React.FC<Props> = ({ isActive, isDarkMode }) => {
  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText   = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg    = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';

  return (
    <div className="max-w-6xl mx-auto space-y-10 py-4">
      <motion.section
        initial={{ opacity: 0, y: 20 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        className="space-y-3"
      >
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.4em] uppercase text-violet-400">
          <Grid3x3 size={14} /> Drill Set 03 · Pure K-Map Optimisation
        </div>
        <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>
          Three K-Map drills · just shrink the equation.
        </h2>
        <p className={`text-base max-w-3xl ${subText}`}>
          No story, no schematic — just a list of rows where F = 1, and a K-Map. Find the smallest
          equation that covers them all. Click <strong className="text-violet-300">Show groups</strong>{' '}
          if you get stuck. Each problem ends with a "before vs after" comparison.
        </p>
      </motion.section>

      <motion.div
        initial={{ opacity: 0, y: 14 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        className={`p-5 rounded-2xl border ${cardBg} flex items-start gap-3`}
      >
        <Lightbulb className="text-amber-300 mt-0.5 shrink-0" size={18} />
        <div className={`text-sm ${subText}`}>
          <strong className="text-amber-300">Recipe:</strong> spot every group first (the bigger,
          the better). Then pick the ones that cover cells no other group can. Add a smaller
          group only if some cell is still left uncovered.
        </div>
      </motion.div>

      <div className="space-y-6">
        {PROBLEMS.map((p) => (
          <OptimiseCard key={p.id} p={p} isDarkMode={isDarkMode} />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }} animate={isActive ? { opacity: 1 } : {}}
        transition={{ delay: 0.4 }}
        className={`text-center text-xs font-mono uppercase tracking-[0.3em] ${subText}`}
      >
        Drill Set 03 complete · onward to the boss round
      </motion.div>
    </div>
  );
};
