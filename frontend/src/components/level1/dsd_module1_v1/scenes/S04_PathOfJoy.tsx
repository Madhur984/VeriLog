import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, PuzzleIcon, Search, GraduationCap, CheckCircle2, XCircle, RefreshCw } from 'lucide-react';

interface Props { isActive: boolean; isDarkMode: boolean; }

const HAPPY = [
  { idx: 0, R: 0, A: 0, W: 0, term: "R'·A'·W'" },
  { idx: 1, R: 0, A: 0, W: 1, term: "R'·A'·W"  },
  { idx: 2, R: 0, A: 1, W: 0, term: "R'·A·W'"  },
  { idx: 4, R: 1, A: 0, W: 0, term: "R·A'·W'"  },
];

const lit = (name: string, val: number) => val === 1 ? name : `${name}'`;

export const S04_PathOfJoy: React.FC<Props> = ({ isActive, isDarkMode }) => {
  const [pick, setPick] = useState(0);
  const row = HAPPY[pick];

  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';

  return (
    <div className="max-w-6xl mx-auto space-y-12 py-4">
      <section className="space-y-3">
        <div className="font-mono text-[10px] tracking-[0.4em] uppercase text-sky-400">
          Chapter 04 · Targeting the Ones
        </div>
        <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>
          The Path of Joy <span className="opacity-50 font-light">— Anatomy of a Minterm</span>
        </h2>
        <p className={`text-base max-w-3xl ${subText}`}>
          The optimist designs for perfection. Pick a happy row and watch how the snapshot is
          assembled: every <strong>0</strong> input becomes a complemented variable
          (<em>X&apos;</em>), every <strong>1</strong> input stays as <em>X</em>. AND them
          together and you have captured exactly that universe — and no other.
        </p>
      </section>

      {/* Side-by-side sketchbook reference */}
      <div className="grid md:grid-cols-2 gap-5">
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="rounded-3xl overflow-hidden border border-white/10" style={{ background: '#fef9f0' }}
        >
          <img src="/images/sketchbook/p04.webp" alt="Path of Joy — selecting the happy rows" className="w-full block" />
          <div className="px-4 py-2 text-[10px] font-mono uppercase tracking-widest text-slate-700 bg-white/60">
            Sketchbook · selecting m0, m1, m2, m4
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="rounded-3xl overflow-hidden border border-white/10" style={{ background: '#fef9f0' }}
        >
          <img src="/images/sketchbook/p05.webp" alt="Anatomy of a minterm — puzzle metaphor" className="w-full block" />
          <div className="px-4 py-2 text-[10px] font-mono uppercase tracking-widest text-slate-700 bg-white/60">
            Sketchbook · the puzzle / snapshot rule
          </div>
        </motion.div>
      </div>

      {/* Row picker */}
      <div className="flex flex-wrap gap-3">
        {HAPPY.map((r, i) => (
          <button
            key={r.idx}
            onClick={() => setPick(i)}
            className={`px-4 py-2.5 rounded-2xl font-mono text-xs font-black transition-all border ${
              pick === i
                ? 'bg-sky-500 text-black border-sky-300 shadow-lg shadow-sky-500/30'
                : isDarkMode
                  ? 'bg-white/5 border-white/10 text-slate-300 hover:border-sky-400'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-sky-400'
            }`}
          >
            <Camera size={12} className="inline mr-2" />
            m{r.idx} · ({r.R}{r.A}{r.W})
          </button>
        ))}
      </div>

      {/* Anatomy grid */}
      <motion.div
        layout
        className={`p-8 rounded-3xl border ${cardBg}`}
      >
        <div className="flex items-center gap-2 mb-6">
          <PuzzleIcon size={14} className="text-sky-400" />
          <span className="font-mono text-[10px] uppercase tracking-widest text-sky-400">
            Snapshot of universe m{row.idx} where R={row.R}, A={row.A}, W={row.W}
          </span>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-6">
          {(['R', 'A', 'W'] as const).map((name, i) => {
            const val = (row as any)[name];
            const literal = lit(name, val);
            const wantNo = val === 0;
            return (
              <motion.div
                key={name}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.08 }}
                className={`p-6 rounded-2xl border-2 relative overflow-hidden ${
                  isDarkMode ? 'bg-black/40 border-sky-500/40' : 'bg-sky-50 border-sky-300'
                }`}
              >
                <div className="absolute top-3 right-4 font-mono text-[10px] uppercase tracking-widest opacity-50">
                  step {i + 1}
                </div>
                <div className={`font-mono text-xs uppercase tracking-widest mb-2 ${
                  isDarkMode ? 'text-sky-300' : 'text-sky-600'
                }`}>
                  Require {wantNo ? 'NO' : ''} {name === 'R' ? 'Rain' : name === 'A' ? 'Ants' : 'Wind'}
                </div>
                <div className="font-mono text-4xl font-black mb-2"
                     style={{ color: wantNo ? '#f59e0b' : '#10b981' }}>
                  {literal}
                </div>
                <div className={`text-xs ${subText}`}>
                  Input was <strong>{val}</strong> →{' '}
                  {wantNo ? 'add a prime to mean "must be 0"' : 'leave it bare to mean "must be 1"'}.
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Combined product */}
        <motion.div
          key={`prod-${row.idx}`}
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={`p-6 rounded-2xl text-center border-2 ${
            isDarkMode ? 'bg-emerald-500/5 border-emerald-500/40' : 'bg-emerald-50 border-emerald-300'
          }`}
        >
          <div className={`font-mono text-[10px] uppercase tracking-widest mb-3 ${
            isDarkMode ? 'text-emerald-400' : 'text-emerald-700'
          }`}>
            AND them together to capture exactly this row
          </div>
          <div className="font-mono text-4xl md:text-5xl font-black tracking-tight"
               style={{ color: '#10b981' }}>
            m{row.idx} = {lit('R', row.R)} · {lit('A', row.A)} · {lit('W', row.W)}
          </div>
        </motion.div>
      </motion.div>

      {/* Sidebar tip */}
      <motion.div
        initial={{ opacity: 0 }} animate={isActive ? { opacity: 1 } : {}}
        transition={{ delay: 0.5 }}
        className={`p-6 rounded-3xl border ${cardBg}`}
      >
        <div className="flex items-start gap-3">
          <Search size={18} className="text-amber-400 mt-1 shrink-0" />
          <div>
            <h4 className={`font-black mb-1 ${textColor}`}>The Translation Rule (memorise this)</h4>
            <p className={`text-sm leading-relaxed ${subText}`}>
              For minterms (the snapshot lens): <strong>0 becomes complemented (X&apos;), 1 stays
              normal (X)</strong>. Then AND every literal. Each minterm fires for one row of the
              truth table and exactly one row.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Theory: row index = binary number */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.55 }}
        className={`p-6 rounded-3xl border ${
          isDarkMode ? 'bg-blue-500/5 border-blue-500/30' : 'bg-blue-50 border-blue-300'
        }`}
      >
        <div className={`font-mono text-[10px] uppercase tracking-widest mb-3 ${
          isDarkMode ? 'text-blue-300' : 'text-blue-700'
        }`}>
          Theory · Why Row Index Matches the Binary Value
        </div>
        <p className={`text-sm leading-relaxed ${textColor}`}>
          Each row of the truth table is numbered by reading its inputs as a binary integer:
          <span className="font-mono mx-1">(R, A, W) = (1, 0, 1)</span> is row{' '}
          <span className="font-mono text-blue-400 font-black">5</span> because{' '}
          <span className="font-mono">1·2² + 0·2¹ + 1·2⁰ = 5</span>. So <strong>m5</strong>{' '}
          is the minterm that fires <em>only</em> at row 5. This indexing is a bridge between
          two languages — Boolean expressions and ordinary base-2 arithmetic.
        </p>
      </motion.div>

      {/* Drill assessment */}
      <MintermDrill isDarkMode={isDarkMode} />
    </div>
  );
};

// ──────────────── Drill widget ───────────────────────────────────
const DRILL_QS = [
  {
    prompt: 'Write the minterm for the row (R = 1, A = 1, W = 0).',
    options: ['R · A · W', 'R · A · W′', 'R′ · A′ · W', 'R + A + W′'],
    correct: 1,
    why: 'R = 1 → R, A = 1 → A, W = 0 → W′. AND them: R · A · W′. Note: this is row 6.',
  },
  {
    prompt: 'Which row index does the minterm R′ · A · W correspond to?',
    options: ['1', '2', '3', '5'],
    correct: 2,
    why: 'R′ means R = 0, A means A = 1, W means W = 1. Binary 011 = decimal 3.',
  },
  {
    prompt: 'A 3-variable function has Σm(0, 5). How many literals in its expanded SOP form?',
    options: ['3', '5', '6', '8'],
    correct: 2,
    why: 'Two minterms × three literals each = 6 literals in the canonical (un-minimised) form.',
  },
];

const MintermDrill: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
  const [picks, setPicks] = useState<(number | null)[]>(DRILL_QS.map(() => null));
  const [revealed, setRevealed] = useState<boolean[]>(DRILL_QS.map(() => false));

  const score = picks.reduce<number>((acc, p, i) => acc + (p === DRILL_QS[i].correct ? 1 : 0), 0);
  const cardBg = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';
  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText = isDarkMode ? 'text-slate-300' : 'text-slate-600';

  return (
    <div className={`p-6 rounded-3xl border ${cardBg}`}>
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <GraduationCap size={14} className="text-sky-400" />
          <span className="font-mono text-[10px] uppercase tracking-widest text-sky-400">
            Minterm Drill · 3 questions
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className={`text-xs font-mono ${subText}`}>
            Score: <strong className={score === DRILL_QS.length ? 'text-emerald-400' : 'text-sky-400'}>
              {score}/{DRILL_QS.length}
            </strong>
          </div>
          <button
            onClick={() => { setPicks(DRILL_QS.map(() => null)); setRevealed(DRILL_QS.map(() => false)); }}
            className={`p-2 rounded-lg border ${isDarkMode ? 'border-white/10 hover:border-sky-400' : 'border-slate-200 hover:border-sky-400'}`}
            title="Reset drill"
          >
            <RefreshCw size={12} className="text-sky-400" />
          </button>
        </div>
      </div>
      <div className="space-y-5">
        {DRILL_QS.map((q, qi) => (
          <div key={qi} className={`p-4 rounded-2xl border ${
            isDarkMode ? 'bg-black/30 border-white/10' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className={`font-bold mb-3 text-sm ${textColor}`}>
              <span className="font-mono text-xs opacity-50 mr-2">Q{qi + 1}.</span>{q.prompt}
            </div>
            <div className="grid sm:grid-cols-2 gap-2 mb-2">
              {q.options.map((opt, oi) => {
                const picked = picks[qi] === oi;
                const correct = q.correct === oi;
                const show = revealed[qi];
                return (
                  <button
                    key={oi}
                    onClick={() => {
                      setPicks(p => p.map((v, j) => j === qi ? oi : v));
                      setRevealed(r => r.map((v, j) => j === qi ? true : v));
                    }}
                    className={`text-left px-3 py-2 rounded-xl font-mono text-[12px] border-2 transition-all ${
                      show && correct
                        ? 'bg-emerald-500/15 border-emerald-400 text-emerald-300'
                        : show && picked && !correct
                          ? 'bg-rose-500/15 border-rose-400 text-rose-300'
                          : picked
                            ? 'bg-sky-500/15 border-sky-400 text-sky-300'
                            : isDarkMode
                              ? 'bg-white/5 border-white/10 text-slate-300 hover:border-sky-400'
                              : 'bg-white border-slate-200 text-slate-700 hover:border-sky-400'
                    }`}
                  >
                    <span className="opacity-50 mr-2">{String.fromCharCode(65 + oi)}.</span>{opt}
                    {show && correct && <CheckCircle2 size={12} className="inline ml-2" />}
                    {show && picked && !correct && <XCircle size={12} className="inline ml-2" />}
                  </button>
                );
              })}
            </div>
            <AnimatePresence>
              {revealed[qi] && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                  className={`text-xs leading-relaxed font-mono mt-2 ${subText}`}
                >
                  <span className="opacity-60">why → </span>{q.why}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
};
