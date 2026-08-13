import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Swords, CheckCircle2, XCircle, Trophy, ChevronRight, ChevronLeft, RotateCcw, BookOpen } from 'lucide-react';

/**
 * A self-scoring multiple-choice drill, reused by every topic chapter in the
 * review module (combinational, sequential, adders, boss). Parameterised by an
 * `accent` hex so each drill takes on its part's colour while the correct/wrong
 * feedback stays semantically green/red.
 *
 * Each question reveals its walkthrough the instant it is answered; a navigator
 * strip, running score and an optional exam-sheet reference round it out.
 */

export interface Problem {
  id: string;
  badge: string;
  badgeColor: string;
  prompt: string;
  options: string[];
  correct: number;
  explain: string;
}

export interface ReferenceRow { term: string; def: string }

interface Props {
  isDarkMode: boolean;
  accent: string;
  tag: string;          // e.g. "Chapter 03 · Combinational"
  title: string;        // e.g. "Combinational Drill"
  intro: string;
  problems: Problem[];
  reference?: ReferenceRow[];
  /** Shown in the all-done callout under the score line. */
  closer?: string;
}

export const QuizArena: React.FC<Props> = ({ isDarkMode, accent, tag, title, intro, problems, reference, closer }) => {
  const [idx, setIdx] = useState(0);
  const [picks, setPicks] = useState<(number | null)[]>(problems.map(() => null));
  const [revealed, setRevealed] = useState<boolean[]>(problems.map(() => false));

  const current = problems[idx];
  const score = picks.reduce<number>((acc, p, i) => acc + (p === problems[i].correct ? 1 : 0), 0);
  const attempted = revealed.filter(Boolean).length;
  const percent = Math.round((score / problems.length) * 100);
  const allDone = revealed.every(Boolean);

  const reset = () => { setPicks(problems.map(() => null)); setRevealed(problems.map(() => false)); setIdx(0); };

  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';

  return (
    // `--qa` powers the hover border tint without baking arbitrary colours into Tailwind.
    <div className="max-w-6xl mx-auto space-y-12 py-4" style={{ ['--qa' as any]: accent }}>
      {/* Header */}
      <section className="space-y-3">
        <div className="font-mono text-[10px] tracking-[0.4em] uppercase" style={{ color: accent }}>
          {tag}
        </div>
        <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>
          {title} - {problems.length} Problems
        </h2>
        <p className={`text-base max-w-3xl ${subText}`}>{intro}</p>
      </section>

      {/* Score banner */}
      <div className={`p-5 rounded-3xl border flex items-center justify-between gap-4 flex-wrap ${cardBg}`}>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
               style={{ background: `${accent}26`, border: `1px solid ${accent}66` }}>
            <Trophy size={26} style={{ color: accent }} />
          </div>
          <div>
            <div className="font-mono text-[10px] uppercase tracking-widest opacity-50">Progress</div>
            <div className={`text-lg font-black ${textColor}`}>
              {attempted} / {problems.length} attempted
              <span className="ml-3 text-sm font-mono" style={{ color: score === problems.length ? '#34d399' : accent }}>
                {score} correct ({percent}%)
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {problems.map((_, i) => {
            const r = revealed[i];
            const c = r && picks[i] === problems[i].correct;
            const w = r && picks[i] !== problems[i].correct;
            return (
              <button
                key={i}
                onClick={() => setIdx(i)}
                className={`w-10 h-10 sm:w-8 sm:h-8 rounded-lg font-mono text-xs font-black border transition-all ${
                  i === idx
                    ? 'text-white'
                    : c
                      ? `border-emerald-400/60 bg-emerald-500/10 ${isDarkMode ? 'text-emerald-300' : 'text-emerald-700'}`
                      : w
                        ? `border-rose-400/60 bg-rose-500/10 ${isDarkMode ? 'text-rose-300' : 'text-rose-700'}`
                        : isDarkMode
                          ? 'border-white/10 text-slate-400 hover:border-[var(--qa)]'
                          : 'border-slate-200 text-slate-500 hover:border-[var(--qa)]'
                }`}
                style={i === idx ? { borderColor: accent, background: `${accent}33`, color: accent } : undefined}
              >
                {i + 1}
              </button>
            );
          })}
          <button
            onClick={reset}
            className={`ml-2 p-2 rounded-lg border ${
              isDarkMode ? 'border-white/10 hover:border-[var(--qa)]' : 'border-slate-200 hover:border-[var(--qa)]'
            }`}
            title="Reset all"
          >
            <RotateCcw size={14} style={{ color: accent }} />
          </button>
        </div>
      </div>

      {/* Active problem */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className={`p-5 md:p-8 rounded-3xl border ${cardBg}`}
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
              Problem {idx + 1} of {problems.length}
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
              const base = 'text-left px-5 py-4 rounded-2xl font-mono text-sm border-2 transition-all';
              let cls = isDarkMode
                ? 'bg-white/5 border-white/10 text-slate-300 hover:border-[var(--qa)]'
                : 'bg-white border-slate-200 text-slate-700 hover:border-[var(--qa)]';
              let style: React.CSSProperties | undefined;
              if (show && correct) {
                cls = isDarkMode
                  ? 'bg-emerald-500/15 border-emerald-400 text-emerald-200'
                  : 'bg-emerald-500/15 border-emerald-500 text-emerald-700';
              } else if (show && picked && !correct) {
                cls = isDarkMode
                  ? 'bg-rose-500/15 border-rose-400 text-rose-200'
                  : 'bg-rose-500/15 border-rose-500 text-rose-700';
              } else if (picked) {
                cls = 'border-2';
                style = { background: `${accent}26`, borderColor: accent, color: accent };
              }
              return (
                <button
                  key={oi}
                  onClick={() => {
                    setPicks(p => p.map((v, j) => j === idx ? oi : v));
                    setRevealed(r => r.map((v, j) => j === idx ? true : v));
                  }}
                  className={`${base} ${cls}`}
                  style={style}
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
                  <span className="font-mono text-[10px] uppercase tracking-widest shrink-0 pt-0.5" style={{ color: accent }}>
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
                    ? 'border-white/10 hover:border-[var(--qa)]'
                    : 'border-slate-200 hover:border-[var(--qa)]'
              } ${textColor}`}
            >
              <ChevronLeft size={14} /> prev
            </button>
            <button
              onClick={() => setIdx(i => Math.min(problems.length - 1, i + 1))}
              disabled={idx === problems.length - 1}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-black uppercase tracking-widest border ${
                idx === problems.length - 1
                  ? 'opacity-30 cursor-not-allowed border-slate-200 dark:border-white/5'
                  : 'hover:border-[var(--qa)]'
              }`}
              style={idx === problems.length - 1 ? undefined : { borderColor: `${accent}66`, color: accent }}
            >
              next <ChevronRight size={14} />
            </button>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Exam-sheet reference */}
      {reference && reference.length > 0 && (
        <section className={`p-5 md:p-8 rounded-3xl border ${cardBg}`}>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0"
                 style={{ background: `${accent}26`, border: `1px solid ${accent}66` }}>
              <BookOpen size={18} style={{ color: accent }} />
            </div>
            <div>
              <div className="font-mono text-[10px] tracking-[0.4em] uppercase" style={{ color: accent }}>
                Reference · Exam Sheet
              </div>
              <h3 className={`text-lg font-black ${textColor}`}>The definitions behind every question</h3>
            </div>
          </div>
          <p className={`text-sm mb-6 ${subText}`}>
            These are the textbook statements the drill is testing. If a question tripped you up,
            find its term here, read it once, then retry.
          </p>
          <div className="grid sm:grid-cols-2 gap-3">
            {reference.map(row => (
              <div
                key={row.term}
                className={`p-4 rounded-2xl border ${
                  isDarkMode ? 'bg-black/40 border-white/10' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <span className="inline-block px-2.5 py-1 mb-2 rounded-full font-mono text-[9px] font-black uppercase tracking-widest"
                      style={{ background: `${accent}26`, color: accent, border: `1px solid ${accent}66` }}>
                  {row.term}
                </span>
                <p className={`text-[13px] leading-relaxed ${subText}`}>{row.def}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Final-state callout */}
      {allDone && (
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-3xl border-2 text-center"
          style={{
            background: `${(score === problems.length ? '#34d399' : accent)}14`,
            borderColor: `${(score === problems.length ? '#34d399' : accent)}80`,
          }}
        >
          <Swords size={28} className="mx-auto mb-2" style={{ color: score === problems.length ? '#34d399' : accent }} />
          <h4 className={`text-xl font-black mb-2 ${textColor}`}>
            {score === problems.length
              ? 'Flawless run - this topic is locked in.'
              : score >= Math.ceil(problems.length * 0.6)
                ? `Solid run - ${score}/${problems.length}. Review the misses, then push on.`
                : `${score}/${problems.length} - flip back through the deck on the missed ideas, then retry.`}
          </h4>
          {closer && <p className={`text-sm ${subText}`}>{closer}</p>}
        </motion.div>
      )}
    </div>
  );
};

export default QuizArena;
