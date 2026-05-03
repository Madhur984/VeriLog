import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Construction, AlertTriangle, GraduationCap, CheckCircle2, XCircle, RefreshCw } from 'lucide-react';

interface Props { isActive: boolean; isDarkMode: boolean; }

const SAD = [
  { idx: 3, R: 0, A: 1, W: 1, term: "R + A' + W'" },
  { idx: 5, R: 1, A: 0, W: 1, term: "R' + A + W'" },
  { idx: 6, R: 1, A: 1, W: 0, term: "R' + A' + W" },
  { idx: 7, R: 1, A: 1, W: 1, term: "R' + A' + W'" },
];

const lit = (name: string, val: number) => val === 0 ? name : `${name}'`;

export const S06_PathOfCaution: React.FC<Props> = ({ isDarkMode }) => {
  const [pick, setPick] = useState(3); // index 7 by default — the apocalypse
  const row = SAD[pick];

  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';

  return (
    <div className="max-w-6xl mx-auto space-y-12 py-4">
      <section className="space-y-3">
        <div className="font-mono text-[10px] tracking-[0.4em] uppercase text-rose-400">
          Chapter 06 · Targeting the Zeros
        </div>
        <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>
          The Path of Caution <span className="opacity-50 font-light">— Anatomy of a Maxterm</span>
        </h2>
        <p className={`text-base max-w-3xl ${subText}`}>
          The pessimist designs to <em>avoid</em> failure. Each disaster row gets a barricade — an
          OR of complemented literals. The translation rule flips: <strong>1 becomes
          complemented (X&apos;), 0 stays normal (X)</strong>. Why the inversion? Because{' '}
          <strong>1</strong> is the dangerous state we are escaping.
        </p>
      </section>

      {/* Side-by-side sketchbook reference */}
      <div className="grid md:grid-cols-2 gap-5">
        <div className="rounded-3xl overflow-hidden border border-white/10" style={{ background: '#fef9f0' }}>
          <img src="/images/sketchbook/p07.png" alt="Path of Caution — targeting the zeros" className="w-full block" />
          <div className="px-4 py-2 text-[10px] font-mono uppercase tracking-widest text-slate-700 bg-white/60">
            Sketchbook · barricading M3, M5, M6, M7
          </div>
        </div>
        <div className="rounded-3xl overflow-hidden border border-white/10" style={{ background: '#fef9f0' }}>
          <img src="/images/sketchbook/p08.png" alt="Anatomy of a maxterm — barricade metaphor" className="w-full block" />
          <div className="px-4 py-2 text-[10px] font-mono uppercase tracking-widest text-slate-700 bg-white/60">
            Sketchbook · barricade construction rule
          </div>
        </div>
      </div>

      {/* Disaster picker */}
      <div className="flex flex-wrap gap-3">
        {SAD.map((r, i) => (
          <button
            key={r.idx}
            onClick={() => setPick(i)}
            className={`px-4 py-2.5 rounded-2xl font-mono text-xs font-black transition-all border ${
              pick === i
                ? 'bg-rose-500 text-white border-rose-300 shadow-lg shadow-rose-500/30'
                : isDarkMode
                  ? 'bg-white/5 border-white/10 text-slate-300 hover:border-rose-400'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-rose-400'
            }`}
          >
            <Shield size={12} className="inline mr-2" />
            M{r.idx} · ({r.R}{r.A}{r.W})
          </button>
        ))}
      </div>

      {/* Brick wall barricade */}
      <motion.div
        layout
        className={`p-8 rounded-3xl border relative overflow-hidden ${cardBg}`}
      >
        <div className="flex items-center gap-2 mb-6">
          <Construction size={14} className="text-rose-400" />
          <span className="font-mono text-[10px] uppercase tracking-widest text-rose-400">
            Barricade for disaster M{row.idx}: R={row.R}, A={row.A}, W={row.W}
          </span>
        </div>

        {/* Brick wall illustration with red arrows */}
        <div className="relative h-44 mb-8 flex items-center justify-center">
          <div
            className="w-72 h-32 rounded-md relative overflow-hidden"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, #7c2d12 0 18px, #b45309 18px 20px), repeating-linear-gradient(90deg, transparent 0 36px, #7c2d12 36px 38px)",
              boxShadow: '0 12px 30px rgba(244,63,94,0.25)',
            }}
          >
            <motion.div
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 1.2, repeat: Infinity }}
              className="absolute inset-0 flex items-center justify-center text-white font-black text-5xl"
            >
              <span className="text-rose-300">⊕</span>
            </motion.div>
          </div>
          {[
            { side: 'left',   label: row.R === 1 ? 'Rain'  : null },
            { side: 'top',    label: row.A === 1 ? 'Ants'  : null },
            { side: 'bottom', label: row.W === 1 ? 'Wind'  : null },
          ].filter(a => a.label).map((a, i) => (
            <motion.div
              key={i}
              animate={{ x: a.side === 'left' ? [-30, 0, -30] : 0, y: a.side === 'top' ? [-25, 0, -25] : a.side === 'bottom' ? [25, 0, 25] : 0 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              className={`absolute flex items-center gap-1 text-rose-400 font-mono text-[10px] font-black uppercase tracking-widest ${
                a.side === 'left' ? 'left-2' : a.side === 'top' ? 'top-2 left-1/2 -translate-x-1/2' : 'bottom-2 left-1/2 -translate-x-1/2'
              }`}
            >
              <AlertTriangle size={12} /> {a.label} = 1
            </motion.div>
          ))}
        </div>

        {/* Build literals */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          {(['R', 'A', 'W'] as const).map((name, i) => {
            const val = (row as any)[name];
            const literal = lit(name, val);
            const inverted = val === 1;
            return (
              <motion.div
                key={name}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.08 }}
                className={`p-5 rounded-2xl border-2 ${
                  isDarkMode ? 'bg-black/40 border-rose-500/40' : 'bg-rose-50 border-rose-300'
                }`}
              >
                <div className={`font-mono text-[10px] uppercase tracking-widest mb-2 ${
                  isDarkMode ? 'text-rose-300' : 'text-rose-600'
                }`}>
                  Escape route #{i + 1}
                </div>
                <div className="font-mono text-3xl font-black"
                     style={{ color: inverted ? '#f59e0b' : '#10b981' }}>
                  {literal}
                </div>
                <div className={`text-xs mt-2 ${subText}`}>
                  {name} was <strong>{val}</strong> →{' '}
                  {inverted ? 'complement to escape this danger' : 'leave normal'}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* OR them */}
        <motion.div
          key={`max-${row.idx}`}
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={`p-6 rounded-2xl text-center border-2 ${
            isDarkMode ? 'bg-rose-500/5 border-rose-500/40' : 'bg-rose-50 border-rose-300'
          }`}
        >
          <div className={`font-mono text-[10px] uppercase tracking-widest mb-3 ${
            isDarkMode ? 'text-rose-400' : 'text-rose-700'
          }`}>
            OR the escape routes — at least ONE must hold
          </div>
          <div className="font-mono text-3xl md:text-4xl font-black tracking-tight"
               style={{ color: '#f43f5e' }}>
            M{row.idx} = {lit('R', row.R)} + {lit('A', row.A)} + {lit('W', row.W)}
          </div>
        </motion.div>
      </motion.div>

      {/* Theory: relationship between mi and Mi */}
      <motion.div
        className={`p-6 rounded-3xl border ${
          isDarkMode ? 'bg-purple-500/5 border-purple-500/30' : 'bg-purple-50 border-purple-300'
        }`}
      >
        <div className={`font-mono text-[10px] uppercase tracking-widest mb-3 ${
          isDarkMode ? 'text-purple-300' : 'text-purple-700'
        }`}>
          Theory · The Mirror Identity (foreshadow of DeMorgan)
        </div>
        <p className={`text-sm leading-relaxed ${textColor}`}>
          For any row index <span className="font-mono">i</span>, the maxterm{' '}
          <span className="font-mono text-purple-400 font-black">Mᵢ</span> is exactly the
          complement of the minterm{' '}
          <span className="font-mono text-purple-400 font-black">mᵢ</span>:
          <span className="font-mono mx-1">(mᵢ)′ = Mᵢ</span>. Try it on row 5 — the minterm{' '}
          <span className="font-mono">m5 = R · A′ · W</span>. Apply DeMorgan
          and you get <span className="font-mono">(R · A′ · W)′ = R′ + A + W′</span>, which is
          exactly <span className="font-mono">M5</span>. We&apos;ll dwell on this in Chapter 8.
        </p>
      </motion.div>

      {/* Drill */}
      <MaxtermDrill isDarkMode={isDarkMode} />
    </div>
  );
};

// ──────────────── Maxterm drill widget ──────────────────────────
const DRILL_QS = [
  {
    prompt: 'Write the maxterm for the row (R = 1, A = 0, W = 1).',
    options: ['R + A + W', 'R + A′ + W', 'R′ + A + W′', 'R · A′ · W'],
    correct: 2,
    why: 'Maxterm rule (1 → X′, 0 → X): R = 1 → R′, A = 0 → A, W = 1 → W′. OR them: R′ + A + W′.',
  },
  {
    prompt: 'Which row does the maxterm R + A′ + W produce?',
    options: ['M0', 'M2', 'M4', 'M5'],
    correct: 1,
    why: 'A maxterm is 0 only at the row where each literal is 0. R = 0, A′ = 0 → A = 1, W = 0. Binary 010 = 2 → M2.',
  },
  {
    prompt: 'A function is F = ΠM(1, 4, 6). How many literals in its expanded POS form?',
    options: ['3', '6', '9', '12'],
    correct: 2,
    why: '3 maxterms × 3 literals each = 9 literals total in the canonical (un-minimised) form.',
  },
];

const MaxtermDrill: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
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
          <GraduationCap size={14} className="text-rose-400" />
          <span className="font-mono text-[10px] uppercase tracking-widest text-rose-400">
            Maxterm Drill · 3 questions
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className={`text-xs font-mono ${subText}`}>
            Score: <strong className={score === DRILL_QS.length ? 'text-emerald-400' : 'text-rose-400'}>
              {score}/{DRILL_QS.length}
            </strong>
          </div>
          <button
            onClick={() => { setPicks(DRILL_QS.map(() => null)); setRevealed(DRILL_QS.map(() => false)); }}
            className={`p-2 rounded-lg border ${isDarkMode ? 'border-white/10 hover:border-rose-400' : 'border-slate-200 hover:border-rose-400'}`}
            title="Reset drill"
          >
            <RefreshCw size={12} className="text-rose-400" />
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
                            ? 'bg-rose-500/15 border-rose-400 text-rose-300'
                            : isDarkMode
                              ? 'bg-white/5 border-white/10 text-slate-300 hover:border-rose-400'
                              : 'bg-white border-slate-200 text-slate-700 hover:border-rose-400'
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
