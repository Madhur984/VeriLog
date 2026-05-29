import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, CheckCircle2, XCircle, ArrowRight, BookOpen } from 'lucide-react';

interface Props { isActive: boolean; isDarkMode: boolean; }

interface Q {
  q: string;
  options: string[];
  correct: number;
  why: string;
}

const QUESTIONS: Q[] = [
  {
    q: 'A 3-input function outputs 1 only at rows 0 and 5. Its canonical SOP is …',
    options: ['Σm(0, 5)', 'ΠM(0, 5)', 'Σm(1, 2, 3, 4, 6, 7)', 'ΠM(1, 2, 3, 4, 6, 7)'],
    correct: 0,
    why: 'SOP collects the rows where the function is 1. Rows 0 and 5 → Σm(0, 5).',
  },
  {
    q: 'For the same function above, the canonical POS is …',
    options: ['Σm(0, 5)', 'ΠM(0, 5)', 'Σm(1, 2, 3, 4, 6, 7)', 'ΠM(1, 2, 3, 4, 6, 7)'],
    correct: 3,
    why: 'POS collects the zero rows. Everything except 0 and 5 → ΠM(1, 2, 3, 4, 6, 7).',
  },
  {
    q: 'In a minterm, a variable that was 0 in its truth-table row is written …',
    options: ['as itself (X)', 'complemented (X′)', 'omitted', 'twice'],
    correct: 1,
    why: 'Minterm rule: 0 → X′, 1 → X. The complement enforces "must be 0".',
  },
  {
    q: 'In a maxterm, a variable that was 1 in its truth-table row is written …',
    options: ['as itself (X)', 'complemented (X′)', 'omitted', 'as a constant'],
    correct: 1,
    why: 'Maxterm rule flips: 1 → X′, 0 → X. The complement makes 1 the dangerous escape route.',
  },
];

export const S10_Conclusion: React.FC<Props> = ({ isActive, isDarkMode }) => {
  const [answers, setAnswers] = useState<(number | null)[]>(QUESTIONS.map(() => null));
  const [revealed, setRevealed] = useState<boolean[]>(QUESTIONS.map(() => false));

  const score = answers.reduce<number>((acc, a, i) => acc + (a === QUESTIONS[i].correct ? 1 : 0), 0);
  const total = QUESTIONS.length;

  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';

  return (
    <div className="max-w-6xl mx-auto space-y-12 py-4">
      {/* Hero */}
      <section className="text-center space-y-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }} animate={isActive ? { scale: 1, opacity: 1 } : {}}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-400/40"
        >
          <Award size={16} className="text-amber-400" />
          <span className="font-mono text-[10px] uppercase tracking-widest text-amber-400 font-black">
            Chapter 10 · The Architecture of Logic
          </span>
        </motion.div>
        <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>
          Choose the form that<br />makes your design easiest.
        </h2>
        <p className={`text-base max-w-2xl mx-auto ${subText}`}>
          SOP and POS are not arbitrary mathematical inverses - they are two distinct philosophies
          for human problem-solving. Boolean logic guarantees both routes arrive at the same truth.
        </p>
      </section>

      {/* Final sketchbook page */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.2 }}
        className="rounded-3xl overflow-hidden border border-white/10 mx-auto max-w-3xl"
        style={{ background: '#fef9f0' }}
      >
        <img src="/images/sketchbook/p12.webp" alt="The Architecture of Logic - final page" className="w-full block" />
      </motion.div>

      {/* Three-rule recap */}
      <div className="grid md:grid-cols-3 gap-5">
        {[
          { n: '01', t: 'SOP and POS are dual blueprints', d: 'For every function, both forms exist. They are mathematically interchangeable through DeMorgan.' },
          { n: '02', t: 'Use the lens that fits the problem', d: 'A function with few 1s? Paint the ones. A function with few 0s? Brick the zeros.' },
          { n: '03', t: 'Minimisation comes next', d: 'Canonical forms are the starting point. K-maps, Quine-McCluskey and tools then strip redundant literals.' },
        ].map((r, i) => (
          <motion.div
            key={r.n}
            initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 + i * 0.1 }}
            className={`p-6 rounded-3xl border ${cardBg}`}
          >
            <div className="font-mono text-3xl font-black text-amber-400/60 mb-2">{r.n}</div>
            <h4 className={`font-black mb-2 ${textColor}`}>{r.t}</h4>
            <p className={`text-xs leading-relaxed ${subText}`}>{r.d}</p>
          </motion.div>
        ))}
      </div>

      {/* Knowledge gate */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.4 }}
        className={`p-8 rounded-3xl border ${cardBg}`}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-widest opacity-50 mb-1">Knowledge Gate</div>
            <h3 className={`text-xl font-black ${textColor}`}>Prove the picnic stuck</h3>
          </div>
          <div className="text-right">
            <div className="font-mono text-[10px] uppercase tracking-widest opacity-50">Score</div>
            <div className={`text-3xl font-black ${score === total ? 'text-emerald-400' : 'text-amber-400'}`}>
              {score}/{total}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {QUESTIONS.map((q, qi) => (
            <div key={qi} className={`p-5 rounded-2xl border ${
              isDarkMode ? 'bg-black/30 border-white/10' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className={`font-bold mb-4 ${textColor}`}>
                <span className="font-mono text-xs opacity-50 mr-2">Q{qi + 1}.</span>
                {q.q}
              </div>
              <div className="grid sm:grid-cols-2 gap-2 mb-3">
                {q.options.map((opt, oi) => {
                  const picked = answers[qi] === oi;
                  const correct = q.correct === oi;
                  const show = revealed[qi];
                  return (
                    <button
                      key={oi}
                      onClick={() => {
                        setAnswers(a => a.map((v, j) => j === qi ? oi : v));
                        setRevealed(r => r.map((v, j) => j === qi ? true : v));
                      }}
                      className={`text-left px-4 py-3 rounded-xl font-mono text-[13px] border-2 transition-all ${
                        show && correct
                          ? 'bg-emerald-500/15 border-emerald-400 text-emerald-300'
                          : show && picked && !correct
                            ? 'bg-rose-500/15 border-rose-400 text-rose-300'
                            : picked
                              ? 'bg-cyan-500/15 border-cyan-400 text-cyan-300'
                              : isDarkMode
                                ? 'bg-white/5 border-white/10 text-slate-300 hover:border-cyan-400'
                                : 'bg-white border-slate-200 text-slate-700 hover:border-cyan-400'
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
              <AnimatePresence>
                {revealed[qi] && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                    className={`text-xs leading-relaxed font-mono ${subText} pl-1`}
                  >
                    <span className="opacity-60">why → </span>{q.why}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Glossary */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.55 }}
        className={`p-8 rounded-3xl border ${cardBg}`}
      >
        <div className="flex items-center gap-2 mb-6">
          <BookOpen size={14} className="text-cyan-400" />
          <span className="font-mono text-[10px] uppercase tracking-widest text-cyan-400">
            Glossary · everything you should walk away knowing
          </span>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { term: 'Literal',          color: '#06b6d4', def: 'A variable or its complement (X or X′). The atomic unit of a Boolean expression.' },
            { term: 'Minterm (mᵢ)',     color: '#10b981', def: 'A product of every variable, each in normal or complemented form. Fires for exactly one truth-table row.' },
            { term: 'Maxterm (Mᵢ)',     color: '#f43f5e', def: 'A sum of every variable, each in normal or complemented form. Outputs 0 for exactly one row.' },
            { term: 'Canonical SOP',    color: '#10b981', def: 'OR of all minterms where F = 1. Written F = Σm(...). Unique for each function.' },
            { term: 'Canonical POS',    color: '#f59e0b', def: 'AND of all maxterms where F = 0. Written F = ΠM(...). Also unique for each function.' },
            { term: 'Σm  (Sigma-m)',    color: '#10b981', def: 'Shorthand: list the row indices where F = 1. F = Σm(0, 1, 2, 4) means the function is 1 at those rows.' },
            { term: 'ΠM  (Pi-M)',       color: '#f59e0b', def: 'Shorthand: list the row indices where F = 0.' },
            { term: 'Complement (X′)',  color: '#a78bfa', def: "The opposite Boolean value. 1 becomes 0, 0 becomes 1. Also written X̄ or NOT X." },
            { term: "DeMorgan's Theorem",color: '#e879f9',def: '(X + Y)′ = X′ · Y′ and (X · Y)′ = X′ + Y′. Bridges SOP and POS.' },
            { term: 'Two-level circuit', color: '#22d3ee',def: 'Any signal traverses at most two gates from input to output. Both canonical forms are two-level.' },
            { term: 'Truth Table',      color: '#0ea5e9', def: 'Tabular enumeration of every input combination paired with the function output.' },
            { term: 'Karnaugh Map',     color: '#ec4899', def: 'Re-arrangement of the truth table into a 2D grid where adjacent cells differ in one variable. Foundation of the next module.' },
          ].map(g => (
            <div key={g.term} className={`p-4 rounded-2xl border ${
              isDarkMode ? 'bg-black/30 border-white/10' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="font-mono text-sm font-black mb-2" style={{ color: g.color }}>
                {g.term}
              </div>
              <div className={`text-[12px] leading-relaxed ${subText}`}>{g.def}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Outro */}
      <motion.div
        initial={{ opacity: 0 }} animate={isActive ? { opacity: 1 } : {}}
        transition={{ delay: 0.7 }}
        className={`p-8 rounded-3xl border-2 text-center ${
          isDarkMode ? 'bg-amber-500/5 border-amber-400/40' : 'bg-amber-50 border-amber-300'
        }`}
      >
        <p className={`text-lg font-medium leading-relaxed ${textColor}`}>
          You now hold both lenses. In the next module we move from <em>canonical</em> forms to{' '}
          <strong>minimised</strong> ones - Karnaugh maps, prime implicants, and the art of removing
          redundant literals without losing truth.
        </p>
        <div className="mt-4 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-amber-400">
          Up next: K-Map Lab <ArrowRight size={12} />
        </div>
      </motion.div>
    </div>
  );
};
