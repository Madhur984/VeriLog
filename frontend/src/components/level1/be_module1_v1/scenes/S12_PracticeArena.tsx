import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Trophy, BrainCircuit, CheckCircle2, XCircle, Sparkles, RefreshCw,
  Zap, Target, Calculator,
} from 'lucide-react';
import { TryItYourself } from '../../../ui/TryItYourself';

interface Props { isActive: boolean; isDarkMode: boolean; }

/* ──────────────────────────────────────────────────────────────────────── */
/*  Activity 1 · MCQ Quiz                                                    */
/* ──────────────────────────────────────────────────────────────────────── */

interface MCQ { q: string; options: string[]; correct: number; rationale: string; }

const QUIZ: MCQ[] = [
  {
    q: 'Which property defines a material as a semiconductor rather than a conductor or insulator?',
    options: [
      'It always conducts current.',
      'Its conductivity is exactly between conductors and insulators and is controllable.',
      'It has zero free electrons at all temperatures.',
      'It contains no protons in the nucleus.',
    ],
    correct: 1,
    rationale: 'Semis sit in the middle of the conductivity spectrum, and we can tune that conductivity using temperature, light, or doping.',
  },
  {
    q: 'How many valence electrons does a Silicon atom have?',
    options: ['2', '4', '8', '14'],
    correct: 1,
    rationale: 'Silicon has 14 total electrons arranged 2-8-4. The 4 outermost (M-shell) electrons are the valence electrons.',
  },
  {
    q: 'In a pure Silicon crystal at room temperature, the number of free electrons per cm³ is approximately:',
    options: ['1.5 × 10²² ', '1.5 × 10¹⁰', '4 × 10¹⁹', '6.022 × 10²³'],
    correct: 1,
    rationale: 'Approximately 1.5 × 10¹⁰ carriers / cm³ - billions, but still tiny compared to ~5 × 10²² atoms / cm³ in the same volume.',
  },
  {
    q: 'What is the band gap energy of pure Silicon at 300 K?',
    options: ['0.67 eV', '1.1 eV', '1.43 eV', '5.5 eV'],
    correct: 1,
    rationale: 'Si: 1.1 eV. Ge: 0.67 eV. GaAs: 1.43 eV. Diamond (insulator): 5.5 eV.',
  },
  {
    q: 'A "hole" in a semiconductor is best described as:',
    options: [
      'A physical drilling in the crystal.',
      'A missing proton in the nucleus.',
      'The empty space (void) left when an electron leaves a covalent bond.',
      'A type of dopant atom.',
    ],
    correct: 2,
    rationale: 'A hole is just the absence of an electron in a bond - it acts as if it were a positive charge carrier.',
  },
  {
    q: 'The direction of conventional current is:',
    options: [
      'Same as electron flow.',
      'Same as hole flow (opposite to electrons).',
      'Always from negative to positive.',
      'Random.',
    ],
    correct: 1,
    rationale: 'Conventional current follows the (apparent) movement of positive charge - the holes - and is therefore opposite to the actual electron motion.',
  },
  {
    q: 'Why does the resistance of a semiconductor DECREASE when temperature increases?',
    options: [
      'More heat means more atoms, hence more conductors.',
      'Heat breaks more covalent bonds, creating more electron-hole pairs.',
      'Heat aligns the crystal lattice perfectly.',
      'Heat reduces the band gap to zero.',
    ],
    correct: 1,
    rationale: 'Thermal energy ionises additional valence electrons. More carriers → lower resistance. This is the negative temperature coefficient.',
  },
  {
    q: 'One electron-volt (1 eV) equals:',
    options: ['1 J', '1.6 × 10⁻¹⁹ J', '6.022 × 10²³ J', '9.1 × 10⁻³¹ J'],
    correct: 1,
    rationale: '1 eV = 1.6 × 10⁻¹⁹ Joules - the energy gained by one electron through 1 V potential difference.',
  },
  {
    q: 'In a perfect insulator the energy gap Eg is:',
    options: ['0 eV', 'about 1 eV', 'greater than 5 eV', 'negative'],
    correct: 2,
    rationale: 'Wide-gap materials (e.g. diamond at 5.5 eV) require so much energy to ionise that thermal energy at room temperature has no chance.',
  },
  {
    q: 'In an ideal conductor like copper, the conduction and valence bands:',
    options: [
      'Are separated by a 1 eV gap.',
      'Overlap so electrons are always free.',
      'Are both empty.',
      'Are both completely full.',
    ],
    correct: 1,
    rationale: 'Conductors have overlapping bands - there is no forbidden zone, so free carriers exist at any temperature without applied energy.',
  },
  {
    q: 'A pure semiconductor at absolute zero (0 K) behaves as:',
    options: ['A perfect conductor', 'A perfect insulator', 'A capacitor', 'A diode'],
    correct: 1,
    rationale: 'No thermal energy means no ionised carriers. All electrons are locked in covalent bonds - a perfect insulator.',
  },
  {
    q: 'Why does GaAs (Eg = 1.43 eV) emit visible light efficiently while Silicon does not?',
    options: [
      'GaAs has a smaller band gap.',
      'GaAs has a direct band gap; Si has an indirect band gap.',
      'GaAs has more valence electrons.',
      'GaAs is a conductor.',
    ],
    correct: 1,
    rationale: 'GaAs is a direct-band-gap semiconductor - electron transitions release energy as photons. Silicon\'s indirect gap mostly releases heat instead.',
  },
];

/* ──────────────────────────────────────────────────────────────────────── */
/*  Activity 2 · Drag-classify into Conductor/Semi/Insulator                 */
/* ──────────────────────────────────────────────────────────────────────── */

type Bucket = 'conductor' | 'semi' | 'insulator';
interface Item { name: string; correct: Bucket; eg?: string; }
const ITEMS: Item[] = [
  { name: 'Copper (Cu)',      correct: 'conductor' },
  { name: 'Silver (Ag)',      correct: 'conductor' },
  { name: 'Aluminium (Al)',   correct: 'conductor' },
  { name: 'Silicon',          correct: 'semi', eg: '1.1 eV' },
  { name: 'Germanium',        correct: 'semi', eg: '0.67 eV' },
  { name: 'Gallium Arsenide', correct: 'semi', eg: '1.43 eV' },
  { name: 'Glass',            correct: 'insulator' },
  { name: 'Mica',             correct: 'insulator' },
  { name: 'Diamond',          correct: 'insulator', eg: '5.5 eV' },
];

const BUCKETS: Array<{ key: Bucket; label: string; color: string }> = [
  { key: 'conductor', label: 'Conductors', color: '#22d3ee' },
  { key: 'semi',      label: 'Semiconductors', color: '#f97316' },
  { key: 'insulator', label: 'Insulators', color: '#a21caf' },
];

/* ──────────────────────────────────────────────────────────────────────── */
/*  Activity 3 · True / False                                                */
/* ──────────────────────────────────────────────────────────────────────── */

interface TF { s: string; ans: boolean; reason: string; }
const TF_DECK: TF[] = [
  { s: 'Pure Silicon at 0 K behaves as a perfect insulator.', ans: true,
    reason: 'No thermal energy means every covalent bond stays intact and no carriers are free.' },
  { s: 'A semiconductor has a positive temperature coefficient like a metal.', ans: false,
    reason: 'Semiconductors have a NEGATIVE temperature coefficient - heat creates carriers, lowering resistance.' },
  { s: 'A hole is a real positively charged particle.', ans: false,
    reason: 'A hole is the absence of an electron - it ACTS like a positive charge but has no mass of its own.' },
  { s: 'Free electrons and holes are always created in equal numbers in pure Silicon.', ans: true,
    reason: 'Every broken bond releases exactly one electron and leaves exactly one hole. Strict pair generation.' },
  { s: 'In an insulator the conduction band is completely full at room temperature.', ans: false,
    reason: 'In an insulator the conduction band is essentially empty - that is why no current flows.' },
  { s: 'Conventional current and electron current point in the same direction.', ans: false,
    reason: 'They point in opposite directions. Conventional current follows hole flow.' },
  { s: '1 eV is exactly the kinetic energy of an electron after falling through 1 V.', ans: true,
    reason: 'That is the very definition of the electron-volt as a unit.' },
  { s: 'Germanium has a wider band gap than Silicon.', ans: false,
    reason: 'Ge has a NARROWER gap (0.67 eV) than Si (1.1 eV). That is why Ge devices are more temperature-sensitive.' },
];

/* ──────────────────────────────────────────────────────────────────────── */
/*  Activity 4 · eV ↔ Joules calculator                                      */
/* ──────────────────────────────────────────────────────────────────────── */

interface CalcChallenge { id: string; v: number; expected: string; }
const CALC: CalcChallenge[] = [
  { id: 'c1', v: 1.1, expected: '1.76e-19' },
  { id: 'c2', v: 0.67, expected: '1.072e-19' },
  { id: 'c3', v: 1.43, expected: '2.288e-19' },
  { id: 'c4', v: 5.5, expected: '8.8e-19' },
];

const formatJ = (joules: number) => joules.toExponential(3).replace('e', 'e');

/* ──────────────────────────────────────────────────────────────────────── */
/*  Component                                                                */
/* ──────────────────────────────────────────────────────────────────────── */

export const S12_PracticeArena: React.FC<Props> = ({ isActive, isDarkMode }) => {
  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';

  /* MCQ */
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);
  const score = Object.entries(answers).filter(([i, v]) => QUIZ[Number(i)].correct === v).length;

  /* Classify */
  const [classified, setClassified] = useState<Record<string, Bucket | null>>(
    () => Object.fromEntries(ITEMS.map((it) => [it.name, null]))
  );
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const classifyScore = ITEMS.filter((it) => classified[it.name] === it.correct).length;
  const handleDrop = (bucket: Bucket) => {
    if (!draggedItem) return;
    setClassified((p) => ({ ...p, [draggedItem]: bucket }));
    setDraggedItem(null);
  };

  /* TF */
  const [tfAnswers, setTfAnswers] = useState<Record<number, boolean>>({});
  const tfScore = Object.entries(tfAnswers).filter(([i, v]) => TF_DECK[Number(i)].ans === v).length;
  const tfDone = Object.keys(tfAnswers).length === TF_DECK.length;

  /* Calc */
  const [calcInputs, setCalcInputs] = useState<Record<string, string>>({});
  const checkCalc = (id: string, v: number) => {
    const got = parseFloat(calcInputs[id] || '');
    if (isNaN(got)) return null;
    const expected = v * 1.6e-19;
    return Math.abs(got - expected) / expected < 0.05; // 5% tolerance
  };

  /* Compute total available cells: useMemo to keep stable */
  const items = useMemo(() => ITEMS, []);

  return (
    <div className="max-w-6xl mx-auto space-y-12 py-4">
      <section className="space-y-3">
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.4em] uppercase text-rose-400">
          <Trophy size={14} /> Chapter 12 · Boss Drill
        </div>
        <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>Practice Arena</h2>
        <p className={`text-base max-w-3xl ${subText}`}>
          Four activities to lock in everything you just learned. MCQ knowledge gate, classify the
          materials, rapid-fire true/false, and an electron-volt calculator drill.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4">
          {[
            { Icon: BrainCircuit, label: '12 MCQs',      color: '#f43f5e' },
            { Icon: Target,       label: 'Classify',     color: '#fb923c' },
            { Icon: Zap,          label: '8 T/F',        color: '#22d3ee' },
            { Icon: Calculator,   label: 'eV → Joules',  color: '#a78bfa' },
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

      <TryItYourself label="Answer, drag & solve" />

      {/* ─────────── Activity 1 · MCQ ─────────── */}
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
              <h3 className={`text-xl font-black ${textColor}`}>12 multiple-choice questions</h3>
            </div>
          </div>
          {showResults ? (
            <button onClick={() => { setAnswers({}); setShowResults(false); }}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-[11px] font-mono font-bold bg-rose-400 text-black hover:shadow-lg hover:shadow-rose-500/30">
              <RefreshCw size={12} /> Retry
            </button>
          ) : (
            <button onClick={() => setShowResults(true)}
                    disabled={Object.keys(answers).length < QUIZ.length}
                    className={`px-5 py-2 rounded-xl text-[11px] font-mono font-bold transition-all ${
                      Object.keys(answers).length < QUIZ.length
                        ? 'opacity-40 cursor-not-allowed bg-rose-500/30 text-rose-200'
                        : 'bg-rose-400 text-black hover:shadow-lg hover:shadow-rose-500/30'
                    }`}>
              Submit · {Object.keys(answers).length}/{QUIZ.length}
            </button>
          )}
        </div>

        <div className="h-1 rounded-full bg-black/20 overflow-hidden mb-6">
          <motion.div animate={{ width: `${(Object.keys(answers).length / QUIZ.length) * 100}%` }}
                      className="h-full bg-rose-400" style={{ boxShadow: '0 0 10px rgba(244,63,94,0.6)' }} />
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
                            : pickedAns ? 'border-rose-400 bg-rose-500/15 text-rose-200' : isDarkMode ? 'border-white/10 text-slate-400' : 'border-slate-200 text-slate-500'
                          : pickedAns ? 'border-rose-400 bg-rose-500/15 text-rose-200' : isDarkMode ? 'border-white/10 hover:border-rose-400/50 text-slate-300' : 'border-slate-200 hover:border-rose-400/50 text-slate-700'
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
              score >= 10 ? 'border-emerald-400 bg-emerald-500/10' : score >= 7 ? 'border-amber-400 bg-amber-500/10' : 'border-rose-400 bg-rose-500/10'
            }`}
          >
            <div className="font-mono text-[10px] uppercase tracking-widest text-amber-400 mb-1">Score</div>
            <div className={`text-3xl font-black ${textColor}`}>{score} / {QUIZ.length}</div>
            <div className={`text-[12px] mt-1 ${subText}`}>
              {score >= 10 ? 'Master · proceed to extrinsic doping.' : score >= 7 ? 'Solid grasp. Re-watch the bands chapter.' : 'Replay the lecture and re-do this quiz.'}
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* ─────────── Activity 2 · Classify ─────────── */}
      <motion.div
        id="act2"
        initial={{ opacity: 0, y: 12 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.1 }}
        className={`p-8 rounded-3xl border ${cardBg}`}
      >
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-500/20 border border-orange-400/40 flex items-center justify-center text-orange-300">
              <Target size={18} />
            </div>
            <div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-orange-400">Activity 02 · Classify</div>
              <h3 className={`text-xl font-black ${textColor}`}>Drag each material into the right bucket</h3>
            </div>
          </div>
          <div className="font-mono text-sm text-orange-300">
            Score · {classifyScore} / {ITEMS.length}
          </div>
        </div>

        {/* Items pool */}
        <div className={`p-4 rounded-2xl border mb-5 ${isDarkMode ? 'bg-black/30 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
          <div className="font-mono text-[10px] uppercase tracking-widest text-slate-400 mb-3">Items pool</div>
          <div className="flex flex-wrap gap-2">
            {items.map((it) => {
              const placed = classified[it.name];
              return (
                <div
                  key={it.name}
                  draggable={!placed}
                  onDragStart={() => setDraggedItem(it.name)}
                  onDragEnd={() => setDraggedItem(null)}
                  className={`px-3 py-1.5 rounded-lg border-2 font-mono text-[11px] font-bold transition-all ${
                    placed
                      ? 'opacity-30 cursor-not-allowed border-slate-500'
                      : isDarkMode ? 'border-orange-400/40 bg-black/40 text-orange-200 hover:border-orange-400 cursor-grab active:cursor-grabbing' : 'border-orange-300 bg-white text-orange-700 hover:border-orange-500 cursor-grab active:cursor-grabbing'
                  }`}
                >
                  {it.name}
                  {it.eg && <span className="opacity-60 ml-1.5">· {it.eg}</span>}
                </div>
              );
            })}
          </div>
          {/* Mobile fallback: tap to cycle */}
          <p className={`text-[10px] mt-3 ${subText}`}>
            Tip: drag items into the buckets below. On touch devices, tap an item then tap a bucket.
          </p>
        </div>

        {/* Buckets */}
        <div className="grid md:grid-cols-3 gap-4">
          {BUCKETS.map((b) => {
            const inBucket = items.filter((it) => classified[it.name] === b.key);
            return (
              <div
                key={b.key}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleDrop(b.key)}
                onClick={() => draggedItem && handleDrop(b.key)}
                className="rounded-2xl border-2 p-4 min-h-[160px] transition-all"
                style={{ borderColor: `${b.color}55`, background: `${b.color}10` }}
              >
                <div className="font-mono text-[10px] uppercase tracking-widest mb-3" style={{ color: b.color }}>
                  {b.label}
                </div>
                <div className="space-y-1.5">
                  {inBucket.map((it) => {
                    const correct = it.correct === b.key;
                    return (
                      <div
                        key={it.name}
                        onClick={(e) => {
                          e.stopPropagation();
                          setClassified((p) => ({ ...p, [it.name]: null }));
                        }}
                        className={`px-2.5 py-1.5 rounded-lg border font-mono text-[11px] font-bold flex items-center justify-between cursor-pointer ${
                          correct ? 'border-emerald-400/60 bg-emerald-500/10 text-emerald-200' : 'border-rose-400/60 bg-rose-500/10 text-rose-200'
                        }`}
                      >
                        <span>{it.name}</span>
                        {correct ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                      </div>
                    );
                  })}
                  {inBucket.length === 0 && (
                    <div className={`text-[12px] italic ${subText}`}>Drop materials here…</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* ─────────── Activity 3 · TF Rapid Fire ─────────── */}
      <motion.div
        id="act3"
        initial={{ opacity: 0, y: 12 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.2 }}
        className={`p-8 rounded-3xl border ${cardBg}`}
      >
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
              <Zap size={18} />
            </div>
            <div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-cyan-400">Activity 03 · Rapid Fire</div>
              <h3 className={`text-xl font-black ${textColor}`}>8 True / False statements</h3>
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
                    ? isCorrect ? 'border-emerald-400 bg-emerald-500/5' : 'border-rose-400 bg-rose-500/5'
                    : isDarkMode ? 'border-white/10 bg-black/20' : 'border-slate-200 bg-slate-50'
                }`}
              >
                <div className="flex items-start gap-3 mb-2">
                  <span className="font-mono text-xs text-cyan-400 font-black flex-shrink-0 mt-1">{String(i + 1).padStart(2, '0')}.</span>
                  <span className={`text-sm font-bold flex-1 ${textColor}`}>{t.s}</span>
                </div>
                <div className="flex gap-2 mt-2 flex-wrap">
                  <button
                    onClick={() => setTfAnswers((a) => ({ ...a, [i]: true }))}
                    disabled={has}
                    className={`px-4 py-1.5 rounded-lg text-[12px] font-mono font-bold transition-all ${
                      ans === true
                        ? t.ans === true ? 'bg-emerald-400 text-black' : 'bg-rose-400 text-black'
                        : isDarkMode ? 'bg-white/5 hover:bg-emerald-500/10 border border-white/10' : 'bg-slate-100 hover:bg-emerald-50 border border-slate-200'
                    }`}
                  >TRUE</button>
                  <button
                    onClick={() => setTfAnswers((a) => ({ ...a, [i]: false }))}
                    disabled={has}
                    className={`px-4 py-1.5 rounded-lg text-[12px] font-mono font-bold transition-all ${
                      ans === false
                        ? t.ans === false ? 'bg-emerald-400 text-black' : 'bg-rose-400 text-black'
                        : isDarkMode ? 'bg-white/5 hover:bg-rose-500/10 border border-white/10' : 'bg-slate-100 hover:bg-rose-50 border border-slate-200'
                    }`}
                  >FALSE</button>
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
              tfScore >= 7 ? 'border-emerald-400 bg-emerald-500/10' : tfScore >= 5 ? 'border-amber-400 bg-amber-500/10' : 'border-rose-400 bg-rose-500/10'
            }`}
          >
            <div className={`text-2xl font-black ${textColor}`}>{tfScore} / {TF_DECK.length}</div>
            <button onClick={() => setTfAnswers({})}
                    className={`mt-2 px-4 py-1.5 rounded-lg text-[11px] font-mono font-bold border ${isDarkMode ? 'border-white/10 hover:bg-white/5' : 'border-slate-200 hover:bg-slate-100'}`}>
              <RefreshCw size={11} className="inline mr-1" /> Retry
            </button>
          </motion.div>
        )}
      </motion.div>

      {/* ─────────── Activity 4 · eV → Joules ─────────── */}
      <motion.div
        id="act4"
        initial={{ opacity: 0, y: 12 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.3 }}
        className={`p-8 rounded-3xl border ${cardBg}`}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-violet-500/20 border border-violet-400/40 flex items-center justify-center text-violet-300">
            <Calculator size={18} />
          </div>
          <div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-violet-400">Activity 04 · eV → Joules</div>
            <h3 className={`text-xl font-black ${textColor}`}>Convert each band gap to Joules</h3>
          </div>
        </div>

        <p className={`text-[12px] ${subText} mb-5`}>
          Recall: 1 eV = 1.6 × 10⁻¹⁹ J. Enter your answer in scientific notation
          (e.g. <span className="font-mono">1.76e-19</span>). 5% tolerance is allowed.
        </p>

        <div className="grid md:grid-cols-2 gap-4">
          {CALC.map((c) => {
            const result = checkCalc(c.id, c.v);
            return (
              <div
                key={c.id}
                className={`p-4 rounded-2xl border-2 ${
                  result === true ? 'border-emerald-400/50 bg-emerald-500/10'
                    : result === false ? 'border-rose-400/50 bg-rose-500/10'
                    : isDarkMode ? 'border-white/10 bg-black/30' : 'border-slate-200 bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-widest text-violet-400">Convert</div>
                    <div className="font-mono text-2xl font-black text-violet-300">{c.v} eV</div>
                  </div>
                  <span className="font-mono text-2xl text-slate-400">→</span>
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-widest text-violet-400">Joules</div>
                    <input
                      type="text"
                      value={calcInputs[c.id] ?? ''}
                      onChange={(e) => setCalcInputs((p) => ({ ...p, [c.id]: e.target.value }))}
                      placeholder="e.g. 1.76e-19"
                      className={`mt-1 px-2 py-1 rounded-lg border-2 w-44 font-mono text-sm ${
                        isDarkMode ? 'bg-black/40 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'
                      }`}
                    />
                  </div>
                </div>
                {result === true && (
                  <div className="text-emerald-300 text-sm font-bold flex items-center gap-2">
                    <CheckCircle2 size={14} /> Correct! Exact: {formatJ(c.v * 1.6e-19)} J
                  </div>
                )}
                {result === false && (
                  <div className="text-rose-300 text-sm font-bold flex items-center gap-2">
                    <XCircle size={14} /> Off - try {c.v} × 1.6 × 10⁻¹⁹.
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Closing */}
      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.4 }}
        className={`p-8 rounded-3xl border ${cardBg} text-center`}
      >
        <Sparkles className="mx-auto text-orange-400 mb-3" size={20} />
        <div className="font-mono text-[10px] uppercase tracking-widest text-orange-400 mb-2">Module Complete</div>
        <p className={`text-base leading-relaxed ${textColor}`}>
          You&apos;ve walked the entire blueprint - atom, lattice, Garba, dhol, electrons & holes, the
          3-tier city, and the toll booth. <strong className="text-orange-300">The pure state is just the
          beginning.</strong> Module 2 introduces dopants and rigs the game in our favour.
        </p>
      </motion.div>
    </div>
  );
};
