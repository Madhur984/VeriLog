import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, CheckCircle2, XCircle, RotateCcw, Trophy, Zap, Baby } from 'lucide-react';

interface Props { isActive: boolean; isDarkMode: boolean; }

type Q = {
  id: string;
  topic: 'Zener' | 'LED' | 'Photodiode' | 'General';
  question: string;
  choices: string[];
  answer: number;          // index into choices
  explanation: string;     // shown after answering
  accent: string;
};

const QUESTIONS: Q[] = [
  {
    id: 'q1',
    topic: 'General',
    question: 'Which of these three special-purpose diodes operates in FORWARD bias?',
    choices: ['Zener diode', 'LED', 'Photodiode', 'All of them'],
    answer: 1,
    explanation: 'The LED needs forward bias so electrons can recombine with holes across the junction - that recombination releases the photon. Zener and Photodiode both work in reverse bias.',
    accent: '#fbbf24',
  },
  {
    id: 'q2',
    topic: 'Zener',
    question: 'A 5.6 V Zener diode is used in a shunt regulator with V_in = 9 V. The load needs 20 mA. What is V_OUT?',
    choices: ['9 V - same as input', '5.6 V - clamped at V_Z', '3.4 V - the difference', '0 V - Zener blocks everything'],
    answer: 1,
    explanation: 'In reverse breakdown the Zener pins the output voltage to V_Z regardless of small changes in V_in or load. As long as V_in > V_Z, the regulator holds 5.6 V.',
    accent: '#ef4444',
  },
  {
    id: 'q3',
    topic: 'Zener',
    question: 'A 3.3 V Zener vs a 12 V Zener - which breakdown mechanism dominates in each?',
    choices: [
      'Both Zener breakdown',
      'Both Avalanche breakdown',
      '3.3 V → Zener · 12 V → Avalanche',
      '3.3 V → Avalanche · 12 V → Zener',
    ],
    answer: 2,
    explanation: 'Zener breakdown dominates below ~5 V (strong electric field rips electrons free directly). Avalanche dominates above ~5 V (high-velocity carriers chain-react through collisions).',
    accent: '#ef4444',
  },
  {
    id: 'q4',
    topic: 'LED',
    question: 'Why can a pure silicon diode never emit visible light?',
    choices: [
      'Silicon doesn\'t conduct in forward bias',
      'Its band gap (~1.1 eV) is too small - emits infrared, not visible',
      'Silicon isn\'t a semiconductor',
      'It needs reverse bias to glow',
    ],
    answer: 1,
    explanation: 'λ = h·c / E_g. With E_g ≈ 1.1 eV silicon emits around 1100 nm - well into the infrared. Visible LEDs need wider-gap compounds like GaP (green) or GaN (blue).',
    accent: '#fbbf24',
  },
  {
    id: 'q5',
    topic: 'LED',
    question: 'You want a BLUE LED. Which material would you choose?',
    choices: ['GaAsP', 'GaP', 'GaN', 'Pure Silicon'],
    answer: 2,
    explanation: 'GaN has a band gap of ~2.6 eV, producing photons around 470 nm - the blue end of visible. GaP gives green, GaAsP gives red.',
    accent: '#fbbf24',
  },
  {
    id: 'q6',
    topic: 'Photodiode',
    question: 'In total darkness, does a reverse-biased photodiode still pass any current?',
    choices: [
      'No - current is exactly zero',
      'Yes - a tiny dark current from thermally generated carriers',
      'Only if you apply forward bias',
      'Only at temperatures below 0 °C',
    ],
    answer: 1,
    explanation: 'Even with zero illumination, thermal energy generates minority carriers inside the depletion region. The resulting "dark current" is the noise floor of every optical sensor.',
    accent: '#a78bfa',
  },
  {
    id: 'q7',
    topic: 'Photodiode',
    question: 'Which property makes photodiodes ideal for fiber-optic receivers?',
    choices: [
      'They emit photons on demand',
      'Their current scales linearly with light + nanosecond response time',
      'They regulate voltage like a Zener',
      'They glow when light hits them',
    ],
    answer: 1,
    explanation: 'Photodiodes have exceptionally low rise/fall times (nanosecond range) and their reverse current tracks luminous flux almost linearly. Perfect for converting fast optical pulses into electrical signals.',
    accent: '#a78bfa',
  },
  {
    id: 'q8',
    topic: 'General',
    question: 'Match the energy conversion: which diode does OPTICAL → ELECTRICAL?',
    choices: ['Zener', 'LED', 'Photodiode', 'Standard P-N'],
    answer: 2,
    explanation: 'Photodiode = optical → electrical (sensor). LED = electrical → optical (emitter). Zener = electrical → fixed voltage (regulator). Standard P-N = one-way switch.',
    accent: '#22d3ee',
  },
  {
    id: 'q9',
    topic: 'Zener',
    question: 'In a Zener regulator the source voltage rises by 2 V. What happens to V_OUT and to I_Z?',
    choices: [
      'V_OUT rises by 2 V, I_Z unchanged',
      'V_OUT unchanged, I_Z increases to absorb the extra current',
      'V_OUT drops by 2 V, I_Z drops',
      'Both V_OUT and I_Z stay exactly the same',
    ],
    answer: 1,
    explanation: 'That is the entire job of the bodyguard. Extra source current is shunted through the Zener (ΔI_Z rises) while V_OUT stays pinned at V_Z. Load voltage doesn\'t budge.',
    accent: '#ef4444',
  },
  {
    id: 'q10',
    topic: 'LED',
    question: 'A red LED (λ ≈ 650 nm) and a blue LED (λ ≈ 470 nm) - which has the LARGER band gap?',
    choices: [
      'Red LED - longer wavelength means more energy',
      'Blue LED - shorter wavelength means higher photon energy',
      'They are equal',
      'Depends on the manufacturer',
    ],
    answer: 1,
    explanation: 'Photon energy E = h·c / λ. Shorter λ → higher E → larger required band gap. Blue (~2.6 eV) needs a wider gap than red (~1.9 eV).',
    accent: '#fbbf24',
  },
];

type AnswerState = { picked: number | null; correct: boolean | null };

export const S10_Quiz: React.FC<Props> = ({ isActive, isDarkMode }) => {
  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText   = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg    = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';

  const [answers, setAnswers] = useState<Record<string, AnswerState>>({});

  const score = useMemo(() => {
    const answered = Object.values(answers).filter((a) => a.picked !== null);
    const correct = answered.filter((a) => a.correct).length;
    return { correct, answered: answered.length, total: QUESTIONS.length };
  }, [answers]);

  const pick = (qid: string, idx: number) => {
    if (answers[qid]?.picked != null) return; // lock after first pick
    const q = QUESTIONS.find((x) => x.id === qid)!;
    setAnswers((cur) => ({ ...cur, [qid]: { picked: idx, correct: idx === q.answer } }));
  };

  const reset = () => setAnswers({});

  const allDone = score.answered === QUESTIONS.length;
  const percent = allDone ? Math.round((score.correct / QUESTIONS.length) * 100) : 0;
  const verdict = percent >= 90 ? { tone: '#22c55e', label: 'VIP-level mastery' }
                : percent >= 70 ? { tone: '#facc15', label: 'Solid foundation' }
                : percent >= 50 ? { tone: '#fb923c', label: 'Almost there - revisit the weak spots' }
                : { tone: '#ef4444', label: 'Re-watch the video and try again' };

  return (
    <div className="max-w-6xl mx-auto space-y-10 py-2">
      <motion.section
        initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        className="space-y-3"
      >
        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.4em] text-emerald-300">
          <HelpCircle size={14} /> Final · Self-Check Quiz
        </div>
        <h2 className={`text-3xl md:text-5xl font-black ${textColor} tracking-tight`}>
          Ten questions. <span className="text-emerald-300">Test what stuck.</span>
        </h2>
        <p className={`text-base max-w-3xl ${subText}`}>
          Each question locks after your first pick and reveals a short explanation. Aim for
          90%+ before moving on. If you get below 70%, scrub back to the matrix scene and
          re-read the relevant VIP row.
        </p>
      </motion.section>

      {/* Like you're 5 */}
      <motion.div
        initial={{ opacity: 0, y: 8 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.1 }}
        className="rounded-2xl p-5 border-2"
        style={{ borderColor: '#facc1555', background: 'linear-gradient(135deg, rgba(250,204,21,0.10), rgba(34,197,94,0.06))' }}
      >
        <div className="flex items-center gap-2 mb-2">
          <Baby size={16} className="text-yellow-300" />
          <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-yellow-300 font-black">Like you&apos;re 5</div>
        </div>
        <p className={`text-sm ${subText} leading-relaxed`}>
          Time to play! Tap the answer you think is right. <strong className="text-emerald-300">Green</strong>{' '}
          means yes. <strong className="text-rose-300">Red</strong> means oops - and you&apos;ll get
          a little hint to help you remember next time. The score at the top counts how many you
          got right. Get 9 out of 10 and you&apos;ve mastered Module 5.
        </p>
      </motion.div>

      {/* Score bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.15 }}
        className={`rounded-3xl border ${cardBg} p-5 flex items-center justify-between flex-wrap gap-4 sticky top-0 z-20 backdrop-blur`}
        style={{ background: isDarkMode ? 'rgba(2,6,17,0.85)' : 'rgba(255,255,255,0.92)' }}
      >
        <div className="flex items-center gap-3">
          <Trophy size={18} style={{ color: allDone ? verdict.tone : '#facc15' }} />
          <div>
            <div className="font-mono text-[10px] uppercase tracking-widest opacity-60">Score</div>
            <div className={`font-mono font-black text-lg ${textColor}`}>
              {score.correct} / {QUESTIONS.length} correct
              <span className="opacity-50 font-normal text-sm ml-2">({score.answered} answered)</span>
            </div>
          </div>
        </div>

        <div className="flex-1 mx-6 min-w-[140px] max-w-[420px]">
          <div className="h-2 w-full rounded-full overflow-hidden" style={{ background: isDarkMode ? '#0f172a' : '#e2e8f0' }}>
            <motion.div
              animate={{ width: `${(score.answered / QUESTIONS.length) * 100}%`, backgroundColor: allDone ? verdict.tone : '#facc15' }}
              className="h-full"
              style={{ boxShadow: `0 0 10px ${allDone ? verdict.tone : '#facc15'}66` }}
            />
          </div>
        </div>

        <button
          onClick={reset}
          className={`flex items-center gap-2 px-4 h-10 rounded-xl border font-mono text-[10px] uppercase tracking-widest font-black transition-all ${
            isDarkMode ? 'border-white/10 text-slate-300 hover:bg-white/5' : 'border-slate-200 text-slate-600 hover:bg-slate-100'
          }`}
        >
          <RotateCcw size={12} /> Reset
        </button>
      </motion.div>

      {/* Questions */}
      <div className="space-y-5">
        {QUESTIONS.map((q, qi) => {
          const state = answers[q.id] ?? { picked: null, correct: null };
          const locked = state.picked != null;

          return (
            <motion.div
              key={q.id}
              initial={{ opacity: 0, y: 14 }}
              animate={isActive ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 + qi * 0.04 }}
              className={`rounded-3xl border ${cardBg} p-7 space-y-4`}
              style={{
                borderColor: locked
                  ? (state.correct ? '#22c55e55' : '#ef444455')
                  : undefined,
                background: locked
                  ? (state.correct ? 'rgba(34,197,94,0.06)' : 'rgba(239,68,68,0.06)')
                  : undefined,
              }}
            >
              <div className="flex items-start gap-4 flex-wrap">
                <div
                  className="w-10 h-10 rounded-xl grid place-items-center font-mono font-black"
                  style={{ background: `${q.accent}22`, color: q.accent }}
                >
                  {qi + 1}
                </div>
                <div className="flex-1 min-w-[200px]">
                  <div className="font-mono text-[10px] uppercase tracking-widest mb-1" style={{ color: q.accent }}>
                    {q.topic}
                  </div>
                  <div className={`text-base md:text-lg font-bold ${textColor} leading-snug`}>{q.question}</div>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-2">
                {q.choices.map((choice, ci) => {
                  const isPicked = state.picked === ci;
                  const isAnswer = ci === q.answer;
                  let borderColor = isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
                  let background = 'transparent';
                  let color = isDarkMode ? '#cbd5e1' : '#334155';
                  if (locked) {
                    if (isAnswer) {
                      borderColor = '#22c55e';
                      background = 'rgba(34,197,94,0.12)';
                      color = '#22c55e';
                    } else if (isPicked) {
                      borderColor = '#ef4444';
                      background = 'rgba(239,68,68,0.10)';
                      color = '#fb7185';
                    }
                  }
                  return (
                    <button
                      key={ci}
                      disabled={locked}
                      onClick={() => pick(q.id, ci)}
                      className={`text-left rounded-xl p-3 border-2 font-mono text-sm transition-all flex items-center gap-3 ${
                        locked ? 'cursor-default' : 'hover:bg-white/5'
                      }`}
                      style={{ borderColor, background, color }}
                    >
                      <span
                        className="w-7 h-7 rounded-lg grid place-items-center font-black text-xs shrink-0"
                        style={{
                          background: locked && isAnswer ? '#22c55e22' : locked && isPicked ? '#ef444422' : isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                          color: locked && isAnswer ? '#22c55e' : locked && isPicked ? '#fb7185' : undefined,
                        }}
                      >
                        {String.fromCharCode(65 + ci)}
                      </span>
                      <span className="flex-1">{choice}</span>
                      {locked && isAnswer && <CheckCircle2 size={16} className="text-emerald-400" />}
                      {locked && isPicked && !isAnswer && <XCircle size={16} className="text-rose-400" />}
                    </button>
                  );
                })}
              </div>

              <AnimatePresence>
                {locked && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div
                      className={`rounded-xl p-4 border text-sm flex gap-3 ${subText}`}
                      style={{
                        borderColor: state.correct ? '#22c55e44' : '#fb718544',
                        background: state.correct ? 'rgba(34,197,94,0.07)' : 'rgba(251,113,133,0.07)',
                      }}
                    >
                      <Zap size={16} className="shrink-0 mt-0.5" style={{ color: state.correct ? '#22c55e' : '#fb7185' }} />
                      <div>
                        <strong style={{ color: state.correct ? '#22c55e' : '#fb7185' }}>
                          {state.correct ? 'Correct.' : 'Not quite.'}
                        </strong>{' '}
                        {q.explanation}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* Final verdict */}
      {allDone && (
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`p-8 rounded-3xl border ${cardBg} text-center space-y-3 relative overflow-hidden`}
          style={{
            background: `linear-gradient(135deg, ${verdict.tone}18, transparent 60%)`,
            borderColor: `${verdict.tone}55`,
          }}
        >
          <Trophy size={28} className="mx-auto" style={{ color: verdict.tone }} />
          <div className={`text-2xl md:text-3xl font-black ${textColor}`}>
            {percent}% - <span style={{ color: verdict.tone }}>{verdict.label}</span>
          </div>
          <p className={`text-sm ${subText}`}>
            {percent >= 90
              ? 'Module 5 unlocked. You can move on to the next module.'
              : percent >= 70
                ? 'Good job. Skim the matrix once more, then move on.'
                : 'Hit reset and try again after re-watching the video.'}
          </p>
          {percent < 90 && (
            <button
              onClick={reset}
              className="px-5 h-10 rounded-xl font-mono text-[10px] uppercase tracking-widest font-black border-2 inline-flex items-center gap-2"
              style={{ borderColor: verdict.tone, color: verdict.tone }}
            >
              <RotateCcw size={12} /> Retry quiz
            </button>
          )}
        </motion.div>
      )}
    </div>
  );
};
