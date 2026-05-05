import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Check, X, Repeat, Trophy, Timer, Flame } from 'lucide-react';

interface Props { isActive: boolean; isDarkMode: boolean; }

interface MCQ { prompt: string; options: string[]; correctIndex: number; explain: string; }

const CONCEPT_QUIZ: MCQ[] = [
  {
    prompt: 'When two N-Type and P-Type slabs are joined, what forms in the boundary?',
    options: ['A short circuit', 'The depletion region', 'A high-current channel', 'Nothing — neutral'],
    correctIndex: 1,
    explain: 'Initial diffusion leaves uncovered ions on both sides — that\'s the depletion region.',
  },
  {
    prompt: 'Under no bias (V_D = 0), the net current through the junction is:',
    options: ['Equal to I_S', 'Equal to V_bi/R', 'Exactly zero', 'Linear with V_bi'],
    correctIndex: 2,
    explain: 'Drift exactly cancels diffusion at equilibrium. Net I_D = 0.',
  },
  {
    prompt: 'What happens to the depletion region under reverse bias?',
    options: ['It narrows', 'It widens', 'It disappears', 'It oscillates'],
    correctIndex: 1,
    explain: 'External field pulls majority carriers AWAY from the junction → wider gap.',
  },
  {
    prompt: 'The reverse saturation current I_S is most sensitive to:',
    options: ['Applied voltage', 'Temperature', 'Frequency', 'Current direction'],
    correctIndex: 1,
    explain: 'I_S is roughly voltage-independent but doubles every ~10°C rise.',
  },
  {
    prompt: 'In Shockley\'s equation, V_T at room temperature equals:',
    options: ['~26 mV', '~0.7 V', '~5 V', '~100 mV'],
    correctIndex: 0,
    explain: 'V_T = kT/q ≈ 0.026 V at 300 K. This sets the curve\'s exponential timescale.',
  },
  {
    prompt: 'Avalanche breakdown is most associated with:',
    options: ['Heavily doped, thin junctions', 'Lightly doped, wide junctions', 'Pure intrinsic Si', 'Forward-biased diodes'],
    correctIndex: 1,
    explain: 'Wide depletion lets minority carriers gain enough energy to ionise. Zener is the OPPOSITE (heavily doped, thin).',
  },
  {
    prompt: 'In a P-N junction symbol, the triangle points from:',
    options: ['Cathode to anode', 'Anode to cathode', 'P to N (and current flows that way under forward bias)', 'Always toward ground'],
    correctIndex: 2,
    explain: 'The triangle points from anode (P) to cathode (N) — same direction as forward current.',
  },
];

interface BiasQ { vd: string; expected: 'No' | 'Forward' | 'Reverse' | 'Breakdown'; }
const BIAS_DRILL: BiasQ[] = [
  { vd: '0.0 V',  expected: 'No' },
  { vd: '+0.8 V', expected: 'Forward' },
  { vd: '-3.0 V', expected: 'Reverse' },
  { vd: '+0.2 V', expected: 'Reverse' },
  { vd: '-V_BV',  expected: 'Breakdown' },
  { vd: '+1.2 V', expected: 'Forward' },
  { vd: '-0.3 V', expected: 'Reverse' },
];

const BIAS_OPTIONS: BiasQ['expected'][] = ['No', 'Forward', 'Reverse', 'Breakdown'];

const BIAS_EXPLAIN: Record<BiasQ['expected'], string> = {
  No: 'V_D = 0 ⇒ equilibrium, no net current.',
  Forward: 'V_D > 0 (above knee for Si ≈ 0.7 V) ⇒ doors open, current rises.',
  Reverse: 'V_D < 0 ⇒ depletion widens; only the tiny I_S leaks.',
  Breakdown: 'V_D = -V_BV ⇒ avalanche; reverse current explodes.',
};

const SPEED_QS: MCQ[] = [
  { prompt: 'Si knee voltage',         options: ['0.2 V', '0.3 V', '0.7 V', '1.4 V'], correctIndex: 2, explain: '' },
  { prompt: 'Ge knee voltage',         options: ['0.2 V', '0.3 V', '0.7 V', '1.4 V'], correctIndex: 1, explain: '' },
  { prompt: 'V_T at room temp',        options: ['1 mV', '26 mV', '100 mV', '1 V'], correctIndex: 1, explain: '' },
  { prompt: 'Reverse saturation symbol',options: ['I_D', 'I_S', 'I_R', 'I_F'], correctIndex: 1, explain: '' },
  { prompt: 'Forward bias = ?',        options: ['+ to N', '+ to P', '0 V', 'AC'], correctIndex: 1, explain: '' },
  { prompt: 'Reverse bias = ?',        options: ['+ to N', '+ to P', '0 V', 'AC'], correctIndex: 0, explain: '' },
  { prompt: 'Depletion in reverse bias',options: ['Narrows', 'Widens', 'Stays same', 'Disappears'], correctIndex: 1, explain: '' },
  { prompt: 'Depletion in forward bias',options: ['Narrows', 'Widens', 'Stays same', 'Disappears'], correctIndex: 0, explain: '' },
  { prompt: 'Avalanche needs',         options: ['Forward bias', 'Heavy reverse', 'No bias', 'AC'], correctIndex: 1, explain: '' },
  { prompt: 'Zener vs Avalanche',      options: ['Same thing', 'Zener = thin junction', 'Zener = thick', 'Zener = forward'], correctIndex: 1, explain: '' },
  { prompt: 'Anode connects to',       options: ['N-side', 'P-side', 'Ground', 'V_BV'], correctIndex: 1, explain: '' },
  { prompt: 'Cathode connects to',     options: ['N-side', 'P-side', 'Ground', 'V_BV'], correctIndex: 0, explain: '' },
];

export const S09_PracticeArena: React.FC<Props> = ({ isActive, isDarkMode }) => {
  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText   = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg    = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';

  const [qIdx, setQIdx] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const q = CONCEPT_QUIZ[qIdx];
  const choose = (i: number) => {
    if (picked !== null) return;
    setPicked(i);
    if (i === q.correctIndex) setScore((s) => s + 1);
  };
  const next = () => {
    if (qIdx < CONCEPT_QUIZ.length - 1) { setQIdx(qIdx + 1); setPicked(null); }
    else setDone(true);
  };
  const restart = () => { setQIdx(0); setPicked(null); setScore(0); setDone(false); };

  const [bIdx, setBIdx] = useState(0);
  const [bPicked, setBPicked] = useState<BiasQ['expected'] | null>(null);
  const bQ = BIAS_DRILL[bIdx];
  const bChoose = (val: BiasQ['expected']) => { if (bPicked === null) setBPicked(val); };
  const bNext = () => { setBIdx((i) => (i + 1) % BIAS_DRILL.length); setBPicked(null); };

  const [running, setRunning] = useState(false);
  const [sIdx, setSIdx] = useState(0);
  const [sScore, setSScore] = useState(0);
  const [sTime, setSTime] = useState(45);
  const [sDone, setSDone] = useState(false);
  const [flash, setFlash] = useState<'right' | 'wrong' | null>(null);

  useEffect(() => {
    if (!running) return;
    if (sTime <= 0) { setRunning(false); setSDone(true); return; }
    const t = setTimeout(() => setSTime((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [running, sTime]);

  const sQ = SPEED_QS[sIdx % SPEED_QS.length];
  const sStart = () => { setRunning(true); setSDone(false); setSIdx(0); setSScore(0); setSTime(45); setFlash(null); };
  const sAnswer = (i: number) => {
    if (!running) return;
    const right = i === sQ.correctIndex;
    if (right) setSScore((s) => s + 1);
    setFlash(right ? 'right' : 'wrong');
    setSIdx((idx) => idx + 1);
    setTimeout(() => setFlash(null), 180);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-16 py-4">
      <section className="space-y-3">
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.4em] uppercase text-rose-400">
          <Target size={14} /> Chapter 09 · Practice Arena
        </div>
        <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>Junction Drills</h2>
        <p className={`text-base max-w-3xl ${subText}`}>
          Three drills · concept quiz, bias-state matcher, and a 45-second sprint. Crack all
          three and the P-N junction is yours.
        </p>
      </section>

      {/* DRILL 1 */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        className={`p-8 rounded-3xl border ${cardBg}`}
      >
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-rose-400 mb-1">Drill 01 · Concept Quiz</div>
            <h3 className={`text-xl font-black ${textColor}`}>Seven killer questions</h3>
          </div>
          <div className={`px-3 py-1 rounded-lg border ${isDarkMode ? 'bg-black/40 border-white/10' : 'bg-slate-100 border-slate-200'} font-mono text-xs`}>
            Score · {score} / {CONCEPT_QUIZ.length}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {!done ? (
            <motion.div
              key={qIdx}
              initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }}
              className="space-y-4"
            >
              <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-black/30 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                <div className="font-mono text-[10px] uppercase tracking-widest text-rose-300 mb-1">
                  Question {qIdx + 1} · {CONCEPT_QUIZ.length}
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
                        {showCorrect && <Check size={14} className="mt-0.5" />}
                        {showWrong && <X size={14} className="mt-0.5" />}
                        <span>{opt}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
              {picked !== null && (
                <motion.div
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="flex items-center justify-between gap-4 pt-2"
                >
                  <p className={`text-xs ${subText} flex-1`}>
                    <strong className="text-rose-300">Why: </strong>{q.explain}
                  </p>
                  <button onClick={next} className="px-5 py-2 rounded-xl bg-rose-400 text-black font-bold text-sm">
                    {qIdx < CONCEPT_QUIZ.length - 1 ? 'Next →' : 'Finish'}
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
                {score === CONCEPT_QUIZ.length ? 'Perfect · case closed.' : `${score} / ${CONCEPT_QUIZ.length} — solid work.`}
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

      {/* DRILL 2 — Bias Detective */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        className={`p-8 rounded-3xl border ${cardBg}`}
      >
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-rose-400 mb-1">Drill 02 · Bias Detective</div>
            <h3 className={`text-xl font-black ${textColor}`}>Match V_D to the operating region</h3>
          </div>
          <div className={`px-3 py-1 rounded-lg border ${isDarkMode ? 'bg-black/40 border-white/10' : 'bg-slate-100 border-slate-200'} font-mono text-xs`}>
            Round {bIdx + 1} / {BIAS_DRILL.length}
          </div>
        </div>

        <div className="grid lg:grid-cols-[1fr_1fr] gap-6 items-stretch">
          <div className={`p-6 rounded-2xl border-2 border-rose-400/40 bg-rose-500/5 grid place-items-center min-h-[160px]`}>
            <div className="text-center">
              <div className="font-mono text-[10px] uppercase tracking-widest text-rose-300 mb-3">
                Applied Voltage
              </div>
              <div className={`font-mono text-5xl font-black ${textColor}`}>V_D = {bQ.vd}</div>
            </div>
          </div>

          <div className="space-y-3">
            {BIAS_OPTIONS.map((opt) => {
              const isPicked = bPicked === opt;
              const isRight = opt === bQ.expected;
              const showCorrect = bPicked !== null && isRight;
              const showWrong = bPicked !== null && isPicked && !isRight;
              return (
                <button
                  key={opt}
                  onClick={() => bChoose(opt)}
                  disabled={bPicked !== null}
                  className={`w-full p-4 rounded-2xl border-2 font-mono text-sm text-left transition-all ${
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
                    <span>{opt} bias</span>
                  </div>
                </button>
              );
            })}
            {bPicked !== null && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3 pt-2">
                <p className={`text-xs ${subText} flex-1`}>
                  <strong className="text-rose-300">Why: </strong>{BIAS_EXPLAIN[bQ.expected]}
                </p>
                <button onClick={bNext} className="px-4 py-2 rounded-xl bg-rose-400 text-black font-bold text-xs">
                  Next →
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>

      {/* DRILL 3 — Speed Round */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        className={`p-8 rounded-3xl border ${cardBg} relative overflow-hidden`}
      >
        {flash && (
          <motion.div
            initial={{ opacity: 0.6 }} animate={{ opacity: 0 }} transition={{ duration: 0.4 }}
            className={`absolute inset-0 pointer-events-none ${flash === 'right' ? 'bg-emerald-400' : 'bg-rose-400'}`}
          />
        )}

        <div className="flex items-center justify-between mb-6 flex-wrap gap-3 relative z-10">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-rose-400 mb-1">Drill 03 · Final Boss</div>
            <h3 className={`text-xl font-black ${textColor} flex items-center gap-2`}>
              <Flame size={18} className="text-rose-300" /> Speed Round · 45s Sprint
            </h3>
          </div>
          <div className="flex items-center gap-3">
            <div className={`px-4 py-2 rounded-xl border-2 font-mono font-black flex items-center gap-2 ${
              sTime <= 10 && running ? 'border-rose-400 text-rose-300 animate-pulse' : 'border-rose-400/40 text-rose-300'
            }`}>
              <Timer size={14} /> {sTime}s
            </div>
            <div className={`px-4 py-2 rounded-xl border-2 border-emerald-400/40 text-emerald-300 font-mono font-black`}>
              ★ {sScore}
            </div>
          </div>
        </div>

        {!running && !sDone && (
          <div className="text-center py-10 relative z-10">
            <p className={`text-sm ${subText} mb-5 max-w-md mx-auto`}>
              Twelve junction fundamentals · forty-five seconds. Test your reflexes.
            </p>
            <button
              onClick={sStart}
              className="px-8 py-3 rounded-2xl bg-rose-400 text-black font-black text-sm hover:bg-rose-300 transition-all inline-flex items-center gap-2"
            >
              <Flame size={16} /> Start sprint
            </button>
          </div>
        )}

        {running && (
          <div className="relative z-10 space-y-5">
            <div className={`rounded-2xl p-5 border-2 border-rose-400/60 bg-rose-500/5 text-center`}>
              <div className="font-mono text-[10px] uppercase tracking-widest text-rose-300 mb-2">
                Question {sIdx + 1}
              </div>
              <div className={`font-mono text-2xl font-black ${textColor}`}>{sQ.prompt}</div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {sQ.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => sAnswer(i)}
                  className={`p-4 rounded-2xl border-2 font-mono font-black text-sm transition-all ${
                    isDarkMode ? 'border-white/10 hover:border-rose-400 bg-black/30' : 'border-slate-200 hover:border-rose-400 bg-white'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}

        {sDone && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-4 py-8 relative z-10"
          >
            <Trophy size={48} className="mx-auto text-amber-300" />
            <h3 className={`text-3xl font-black ${textColor}`}>{sScore} correct in 45s</h3>
            <p className={`text-sm ${subText}`}>
              {sScore >= 16 ? 'Junction guru. Diodes have no secrets left.'
                : sScore >= 10 ? 'Strong sprint — solid grasp.'
                  : sScore >= 5 ? 'Good baseline — re-read chapters 5-8.'
                    : 'Re-watch the lecture and try again.'}
            </p>
            <button
              onClick={sStart}
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
        BE Module 3 complete · onward to transistors and amplifiers
      </motion.div>
    </div>
  );
};
