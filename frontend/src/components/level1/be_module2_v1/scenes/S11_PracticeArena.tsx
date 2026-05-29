import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Check, X, Repeat, Trophy, Timer, Flame } from 'lucide-react';

interface Props { isActive: boolean; isDarkMode: boolean; }

interface MCQ { prompt: string; options: string[]; correctIndex: number; explain: string; }

// Drill 01 - Concept MCQ (semiconductor physics only - no junction content)
const CONCEPT_QUIZ: MCQ[] = [
  {
    prompt: 'A pentavalent impurity (e.g. Phosphorus) is added to silicon. The doped material is:',
    options: ['P-Type with majority electrons', 'N-Type with majority electrons', 'P-Type with majority holes', 'N-Type with majority holes'],
    correctIndex: 1,
    explain: 'Group V dopants donate an extra electron. Majority carriers are electrons → N-Type.',
  },
  {
    prompt: 'In a P-Type semiconductor, the minority carriers are:',
    options: ['Holes', 'Electrons', 'Donor ions', 'Acceptor ions'],
    correctIndex: 1,
    explain: 'P-Type majority = holes; the few thermally-generated electrons are the minority.',
  },
  {
    prompt: 'The energy gap of silicon at room temperature is approximately:',
    options: ['0.1 eV', '0.7 eV', '1.1 eV', '5.5 eV'],
    correctIndex: 2,
    explain: 'Si has E_g ≈ 1.1 eV. (Ge ≈ 0.67 eV; diamond ≈ 5.5 eV.)',
  },
  {
    prompt: 'A semiconductor\'s resistance changes how with temperature?',
    options: ['Increases (positive coefficient)', 'Decreases (negative coefficient)', 'Stays the same', 'Increases then decreases'],
    correctIndex: 1,
    explain: 'More heat → more broken bonds → more carriers → less resistance. Negative temp coefficient.',
  },
  {
    prompt: 'Pure (intrinsic) silicon at room temperature has approximately how many free carriers per cm³?',
    options: ['~10²² (like copper)', '~10¹⁶', '~10¹⁰', '0 (perfect insulator)'],
    correctIndex: 2,
    explain: '~1.5 × 10¹⁰ /cm³ - that\'s why we dope. (Copper ≈ 10²² /cm³ which is why it\'s metallic.)',
  },
  {
    prompt: 'Conventional current direction in a circuit is:',
    options: ['Same as electron flow', 'Opposite to electron flow', 'Whichever is faster', 'Always left to right'],
    correctIndex: 1,
    explain: 'Conventional current = direction positive charges would move = OPPOSITE to electron flow (set by Franklin before electrons were known).',
  },
  {
    prompt: 'A doped N-Type semiconductor is electrically:',
    options: ['Negatively charged overall', 'Positively charged overall', 'Neutral overall', 'Charge depends on temperature'],
    correctIndex: 2,
    explain: 'Donor atoms bring matching protons + electrons. The 5th electron is just free, not added from outside. Net charge = 0.',
  },
  {
    prompt: 'Which Group III element is a typical P-Type dopant?',
    options: ['Phosphorus', 'Arsenic', 'Boron', 'Antimony'],
    correctIndex: 2,
    explain: 'Boron, Gallium, Indium are Group III (3 valence e⁻ → acceptor). P, As, Sb are Group V donors.',
  },
];

// Drill 02 - Carrier Sandbox (already non-junction, keep)
// Drill 03 - Speed Round (large pool - sprint shuffles + never repeats inside one run)
const SPEED_QS: MCQ[] = [
  { prompt: 'Si valence electrons',          options: ['2', '3', '4', '5'],                                  correctIndex: 2, explain: '' },
  { prompt: 'Ge valence electrons',          options: ['2', '3', '4', '5'],                                  correctIndex: 2, explain: '' },
  { prompt: 'Group V dopants are',           options: ['Donors', 'Acceptors', 'Neutral', 'Carriers'],         correctIndex: 0, explain: '' },
  { prompt: 'Group III dopants are',         options: ['Donors', 'Acceptors', 'Neutral', 'Carriers'],         correctIndex: 1, explain: '' },
  { prompt: 'N-Type majority carrier',       options: ['Hole', 'Electron', 'Ion', 'Photon'],                  correctIndex: 1, explain: '' },
  { prompt: 'P-Type majority carrier',       options: ['Hole', 'Electron', 'Ion', 'Photon'],                  correctIndex: 0, explain: '' },
  { prompt: 'N-Type minority carrier',       options: ['Hole', 'Electron', 'Ion', 'Photon'],                  correctIndex: 0, explain: '' },
  { prompt: 'P-Type minority carrier',       options: ['Hole', 'Electron', 'Ion', 'Photon'],                  correctIndex: 1, explain: '' },
  { prompt: 'Si energy gap E_g',             options: ['0.3 eV', '0.7 eV', '1.1 eV', '5.5 eV'],               correctIndex: 2, explain: '' },
  { prompt: 'Ge energy gap E_g',             options: ['0.3 eV', '0.67 eV', '1.1 eV', '2.5 eV'],              correctIndex: 1, explain: '' },
  { prompt: 'Diamond energy gap E_g',        options: ['0.7 eV', '1.1 eV', '2.5 eV', '5.5 eV'],               correctIndex: 3, explain: '' },
  { prompt: 'Temp coefficient of Si',        options: ['Positive', 'Negative', 'Zero', 'Linear'],             correctIndex: 1, explain: '' },
  { prompt: 'Temp coefficient of copper',    options: ['Positive', 'Negative', 'Zero', 'Linear'],             correctIndex: 0, explain: '' },
  { prompt: 'Phosphorus is',                 options: ['Trivalent', 'Tetravalent', 'Pentavalent', 'Hexavalent'], correctIndex: 2, explain: '' },
  { prompt: 'Boron is',                      options: ['Trivalent', 'Tetravalent', 'Pentavalent', 'Hexavalent'], correctIndex: 0, explain: '' },
  { prompt: 'Arsenic is a',                  options: ['Donor', 'Acceptor', 'Carrier', 'Insulator'],          correctIndex: 0, explain: '' },
  { prompt: 'Gallium is a',                  options: ['Donor', 'Acceptor', 'Carrier', 'Insulator'],          correctIndex: 1, explain: '' },
  { prompt: 'Conventional current vs e⁻',    options: ['Same direction', 'Opposite direction', 'Faster', 'Slower'], correctIndex: 1, explain: '' },
  { prompt: 'Intrinsic Si carriers / cm³',   options: ['~10²²', '~10¹⁶', '~10¹⁰', '0'],                      correctIndex: 2, explain: '' },
  { prompt: 'Doped Si net charge is',        options: ['Negative', 'Positive', 'Neutral', 'Depends on T'],    correctIndex: 2, explain: '' },
  { prompt: 'Heating Si gives',              options: ['Fewer carriers', 'More carriers', 'No change', 'Pure insulator'], correctIndex: 1, explain: '' },
  { prompt: 'Si forms covalent bonds with',  options: ['1 neighbor', '2 neighbors', '4 neighbors', '8 neighbors'], correctIndex: 2, explain: '' },
  { prompt: 'A "hole" is',                   options: ['A free proton', 'A missing electron', 'A photon', 'A dopant ion'], correctIndex: 1, explain: '' },
  { prompt: 'Donor ion left behind is',      options: ['Negative', 'Positive', 'Neutral', 'Mobile'],          correctIndex: 1, explain: '' },
  { prompt: 'Acceptor ion left behind is',   options: ['Negative', 'Positive', 'Neutral', 'Mobile'],          correctIndex: 0, explain: '' },
  { prompt: 'Antimony (Sb) is',              options: ['Trivalent', 'Tetravalent', 'Pentavalent', 'Hexavalent'], correctIndex: 2, explain: '' },
  { prompt: 'Indium (In) is',                options: ['Trivalent', 'Tetravalent', 'Pentavalent', 'Hexavalent'], correctIndex: 0, explain: '' },
];

const shuffle = <T,>(arr: T[]): T[] => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

export const S11_PracticeArena: React.FC<Props> = ({ isActive, isDarkMode }) => {
  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText   = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg    = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';

  // ─── Drill 1 ───
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

  // ─── Drill 2 - Carrier Sandbox ───
  const [doping, setDoping] = useState<'intrinsic' | 'n' | 'p'>('intrinsic');
  const counts = useMemo(() => {
    if (doping === 'intrinsic') return { electrons: 6, holes: 6, ions: 0, label: 'Pure Si - equal carriers' };
    if (doping === 'n') return { electrons: 22, holes: 2, ions: 4, label: 'N-Type - electrons dominate' };
    return { electrons: 2, holes: 22, ions: 4, label: 'P-Type - holes dominate' };
  }, [doping]);

  // ─── Drill 3 - Speed Round (shuffle on start, no repeats inside a run) ───
  const [running, setRunning] = useState(false);
  const [sIdx, setSIdx] = useState(0);
  const [sScore, setSScore] = useState(0);
  const [sTime, setSTime] = useState(45);
  const [sDone, setSDone] = useState(false);
  const [flash, setFlash] = useState<'right' | 'wrong' | null>(null);
  const [sQueue, setSQueue] = useState<MCQ[]>(() => shuffle(SPEED_QS));

  useEffect(() => {
    if (!running) return;
    if (sTime <= 0) { setRunning(false); setSDone(true); return; }
    const t = setTimeout(() => setSTime((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [running, sTime]);

  const sQ = sQueue[sIdx];

  const sStart = () => {
    setSQueue(shuffle(SPEED_QS));
    setRunning(true);
    setSDone(false);
    setSIdx(0);
    setSScore(0);
    setSTime(45);
    setFlash(null);
  };
  const sAnswer = (i: number) => {
    if (!running || !sQ) return;
    const right = i === sQ.correctIndex;
    if (right) setSScore((s) => s + 1);
    setFlash(right ? 'right' : 'wrong');
    setTimeout(() => setFlash(null), 180);
    if (sIdx + 1 >= sQueue.length) {
      setRunning(false);
      setSDone(true);
    } else {
      setSIdx((idx) => idx + 1);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-16 py-4">
      <section className="space-y-3">
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.4em] uppercase text-rose-400">
          <Target size={14} /> Chapter 11 · Practice Arena
        </div>
        <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>Boss Drills</h2>
        <p className={`text-base max-w-3xl ${subText}`}>
          Three drills · concept quiz, carrier sandbox, and a 45-second sprint. The next module
          (the P-N junction) builds on every fact in here - make sure these stick first.
        </p>
      </section>

      {/* DRILL 1 - Concept MCQ */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        className={`p-8 rounded-3xl border ${cardBg}`}
      >
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-rose-400 mb-1">Drill 01 · Concept Quiz</div>
            <h3 className={`text-xl font-black ${textColor}`}>Eight killer questions</h3>
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
                {score === CONCEPT_QUIZ.length ? 'Perfect · all eight cracked.' : `${score} / ${CONCEPT_QUIZ.length} - solid work.`}
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

      {/* DRILL 2 - Carrier Sandbox */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        className={`p-8 rounded-3xl border ${cardBg}`}
      >
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-rose-400 mb-1">Drill 02 · Carrier Sandbox</div>
        <h3 className={`text-xl font-black ${textColor} mb-4`}>Doping → carrier population</h3>
        <p className={`text-sm ${subText} mb-5`}>
          Pick a doping recipe and watch the relative populations of electrons (orange), holes
          (magenta), and immobile dopant ions adjust accordingly.
        </p>

        <div className="flex gap-2 mb-5 flex-wrap">
          {([
            { id: 'intrinsic', label: 'Intrinsic (pure Si)' },
            { id: 'n',         label: 'N-Type doping' },
            { id: 'p',         label: 'P-Type doping' },
          ] as const).map((d) => (
            <button
              key={d.id}
              onClick={() => setDoping(d.id)}
              className={`px-4 py-2 rounded-xl font-mono text-xs transition-all ${
                doping === d.id
                  ? 'bg-rose-400 text-black font-bold'
                  : isDarkMode ? 'bg-white/5 border border-white/10' : 'bg-slate-100 border border-slate-200'
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-[1.4fr_1fr] gap-6 items-stretch">
          <div className={`relative h-64 rounded-2xl overflow-hidden border ${isDarkMode ? 'bg-black/40 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
            {Array.from({ length: 7 }).map((_, r) =>
              Array.from({ length: 14 }).map((__, c) => (
                <div
                  key={`${r}-${c}`}
                  className="absolute w-1.5 h-1.5 rounded-full bg-slate-500"
                  style={{
                    left: `${(c + 0.5) * (100 / 14)}%`,
                    top: `${(r + 0.5) * (100 / 7)}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                />
              ))
            )}
            {Array.from({ length: counts.electrons }).map((_, i) => (
              <motion.div
                key={`e-${doping}-${i}`}
                initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.02 }}
                className="absolute w-3 h-3 rounded-full bg-orange-400 shadow-[0_0_8px_rgba(251,146,60,0.6)]"
                style={{
                  left: `${((i * 31) % 95) + 2}%`,
                  top: `${((i * 47) % 80) + 10}%`,
                }}
              />
            ))}
            {Array.from({ length: counts.holes }).map((_, i) => (
              <motion.div
                key={`h-${doping}-${i}`}
                initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.02 + 0.1 }}
                className="absolute w-3 h-3 rounded-full border-2 border-fuchsia-400"
                style={{
                  left: `${((i * 53) % 95) + 2}%`,
                  top: `${((i * 19) % 80) + 10}%`,
                }}
              />
            ))}
            {Array.from({ length: counts.ions }).map((_, i) => (
              <motion.div
                key={`ion-${doping}-${i}`}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="absolute w-4 h-4 rounded-sm border border-violet-400 grid place-items-center text-violet-300 font-mono text-[10px] font-bold"
                style={{
                  left: `${((i * 73) % 90) + 5}%`,
                  top: `${((i * 23) % 75) + 12}%`,
                }}
              >
                {doping === 'n' ? '+' : '−'}
              </motion.div>
            ))}
            <div className="absolute bottom-2 left-2 font-mono text-[10px] text-slate-400">
              {counts.label}
            </div>
          </div>

          <div className={`p-5 rounded-2xl border ${isDarkMode ? 'bg-black/30 border-white/10' : 'bg-slate-50 border-slate-200'} space-y-3`}>
            <div className="font-mono text-[10px] uppercase tracking-widest text-rose-300">Tally</div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm"><span className="w-3 h-3 rounded-full bg-orange-400" /> Electrons</span>
                <span className="font-mono font-black text-orange-300">{counts.electrons}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm"><span className="w-3 h-3 rounded-full border-2 border-fuchsia-400" /> Holes</span>
                <span className="font-mono font-black text-fuchsia-300">{counts.holes}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm"><span className="w-3 h-3 rounded-sm border border-violet-400" /> Dopant ions</span>
                <span className="font-mono font-black text-violet-300">{counts.ions}</span>
              </div>
            </div>
            <div className={`text-[11px] ${subText} font-mono leading-relaxed pt-3 border-t ${isDarkMode ? 'border-white/10' : 'border-slate-200'}`}>
              💡 Notice: net charge stays zero in every case. Doping changes <em>which</em>{' '}
              carrier dominates, not the overall balance.
            </div>
          </div>
        </div>
      </motion.div>

      {/* DRILL 3 - Speed Round */}
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
              {SPEED_QS.length} fundamentals, shuffled · forty-five seconds. No question repeats inside a run.
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
              {sScore >= 18 ? 'Madhur-level. Move to Module 3 · the P-N junction.'
                : sScore >= 12 ? 'Strong sprint - solid grasp.'
                  : sScore >= 6 ? 'Good baseline - re-read chapters 6-8.'
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
        BE Module 2 complete · onward to Module 3 · the P-N junction
      </motion.div>
    </div>
  );
};
