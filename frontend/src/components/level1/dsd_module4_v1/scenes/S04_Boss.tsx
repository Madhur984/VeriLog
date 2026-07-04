import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, ChevronRight, ChevronDown, CheckCircle2, Lightbulb, Hash, Car, MousePointerClick } from 'lucide-react';
import { CleanCircuit, lit, not, term, type Bit, type Term, type CleanInput } from './_CleanCircuit';

interface Props { isActive: boolean; isDarkMode: boolean; }

const ROW4 = [0, 1, 3, 2];
const COL4 = [0, 1, 3, 2];

interface Group { cells: number[]; color: string; term: string; label: string; }

interface BossProblem {
  id: string;
  Icon: React.ComponentType<any>;
  title: string;
  scenario: string;
  inputs: { sym: string; meaning: string; accent: string }[];
  outputMeaning: string;
  active: number[];
  dontCares: number[];
  groups: Group[];
  questions: { q: string; a: string }[];
  unsimplified: string;
  minimised: string;
  literalsBefore: number;
  literalsAfter: number;
  compute: (bits: Bit[]) => Bit;
  circuit: { topic: string; terms: Term[]; outputSym: string };
}

// ─────────────────────────────────────────────────────────────────────────
// 4-var K-Map (with don't-care support)
// ─────────────────────────────────────────────────────────────────────────
const KMap4: React.FC<{
  active: Set<number>;
  dontCares: Set<number>;
  groups: Group[];
  showGroups: boolean;
  isDarkMode: boolean;
}> = ({ active, dontCares, groups, showGroups, isDarkMode }) => {
  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const groupOf = (m: number) => groups.find((g) => g.cells.includes(m));

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
                              : `${isDarkMode ? 'bg-black/20 border-white/10' : 'bg-slate-100 border-slate-200'} ${textColor}`
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

const PROBLEMS: BossProblem[] = [
  // Boss 1: BCD 7-segment, segment 'a'
  {
    id: 'b1',
    Icon: Hash,
    title: "Boss 1 · 7-Segment Display · top bar",
    scenario:
      "You're designing the top bar of a 7-segment display (the kind on a calculator). Input is a 4-bit number for digits 0-9 (A is the highest bit, D is the lowest). The top bar should LIGHT UP for digits 0, 2, 3, 5, 6, 7, 8, 9 - every digit EXCEPT 1 and 4. Codes 10-15 never happen in BCD, so they are don't-cares (treat them as 0 or 1, whichever helps).",
    inputs: [
      { sym: 'A', meaning: 'BCD bit 3 (MSB)', accent: '#0ea5e9' },
      { sym: 'B', meaning: 'BCD bit 2',       accent: '#22d3ee' },
      { sym: 'C', meaning: 'BCD bit 1',       accent: '#a78bfa' },
      { sym: 'D', meaning: 'BCD bit 0 (LSB)', accent: '#f59e0b' },
    ],
    outputMeaning: 'Segment a (top stroke)',
    active: [0, 2, 3, 5, 6, 7, 8, 9],
    dontCares: [10, 11, 12, 13, 14, 15],
    groups: [
      { cells: [8, 9, 10, 11, 12, 13, 14, 15], color: '#0ea5e9', term: 'A',     label: 'Bottom half · A=1 stays · 8-cell octet (uses DCs)' },
      { cells: [2, 3, 6, 7, 10, 11, 14, 15],   color: '#a78bfa', term: 'C',     label: 'CD=11 + CD=10 columns · C=1 stays · 8-cell octet (uses DCs)' },
      { cells: [5, 7, 13, 15],                  color: '#fbbf24', term: 'BD',   label: 'Centre 2×2 · B=1 ∧ D=1' },
      { cells: [0, 2, 8, 10],                   color: '#22c55e', term: "B'D'", label: 'Four corners · B=0 ∧ D=0 (wrap-around)' },
    ],
    questions: [
      { q: 'Which digits make the top bar light up? Which ones leave it dark?',
        a: 'Lit: 0, 2, 3, 5, 6, 7, 8, 9. Dark: 1 and 4. (Digit 1 has no top bar; digit 4 has only middle and right bars.)' },
      { q: "How can you use the don't-cares (m10-m15) to shrink the equation?",
        a: 'Pretend they are 1 wherever it helps you make a bigger group. Here they extend the A group and C group from 4 cells to 8 cells each - saving 2 letters per group.' },
      { q: 'What is the shortest equation?',
        a: "a = A + C + BD + B'D'  · 4 terms · 6 letters total." },
      { q: 'How many gates total?',
        a: "6 gates · 2 NOTs (for B' and D'), 2 ANDs (BD and B'D'), 1 OR with 4 inputs. A and C go straight into the OR with no AND needed." },
    ],
    unsimplified: '8 rows × 4 letters each = 32 letters',
    minimised: "a = A + C + BD + B'D'",
    literalsBefore: 32,
    literalsAfter: 6,
    compute: (bits) => {
      const m = bits[0] * 8 + bits[1] * 4 + bits[2] * 2 + bits[3];
      return ([0, 2, 3, 5, 6, 7, 8, 9].includes(m) ? 1 : 0) as Bit;
    },
    circuit: {
      topic: "BCD seg-a · F = A + C + BD + B′D′",
      outputSym: 'a',
      terms: [
        term([lit('A')], '#0ea5e9'),
        term([lit('C')], '#a78bfa'),
        term([lit('B'), lit('D')], '#fbbf24'),
        term([not('B'), not('D')], '#22c55e'),
      ],
    },
  },
  // Boss 2: Smart Garage Door
  {
    id: 'b2',
    Icon: Car,
    title: 'Boss 2 · Smart Garage Door',
    scenario:
      'A smart garage door has 4 inputs: A (radio noise - ignored), B (keyfob in pocket), C (motion sensor at gate), D (master ON switch). The door OPENS when D is on AND at least one of B or C is on. So: open = D AND (B OR C). Build the truth table, K-Map, shortest equation, and the schematic.',
    inputs: [
      { sym: 'A', meaning: 'Operator radio (irrelevant)', accent: '#475569' },
      { sym: 'B', meaning: 'Keyfob present',  accent: '#22d3ee' },
      { sym: 'C', meaning: 'Motion sensor',   accent: '#a78bfa' },
      { sym: 'D', meaning: 'Master switch',   accent: '#f59e0b' },
    ],
    outputMeaning: 'Door opens',
    active: [3, 5, 7, 11, 13, 15],
    dontCares: [],
    groups: [
      { cells: [5, 7, 13, 15], color: '#fbbf24', term: 'BD', label: 'Centre 2×2 · B=1 ∧ D=1' },
      { cells: [3, 7, 11, 15], color: '#a78bfa', term: 'CD', label: 'CD=11 column · C=1 ∧ D=1' },
    ],
    questions: [
      { q: 'Take the rule "D AND (B OR C)" and list the rows where the door opens.',
        a: 'Σm(3, 5, 7, 11, 13, 15) - every row where D = 1 AND at least one of B, C is 1.' },
      { q: 'Find two 4-cell groups on the K-Map.',
        a: 'BD (centre 2×2) covers {m5, m7, m13, m15}. CD (CD=11 column) covers {m3, m7, m11, m15}. They overlap on m7 and m15.' },
      { q: 'What is the shortest equation?',
        a: 'F = BD + CD (you can also factor it as D(B + C) - same thing).' },
      { q: 'Does input A end up in the final circuit?',
        a: 'No - A is irrelevant. The K-Map proves it: A changes inside both groups, so it cancels. The A wire never touches any gate.' },
    ],
    unsimplified: '6 rows × 4 letters each = 24 letters',
    minimised: 'F = BD + CD = D(B + C)',
    literalsBefore: 24,
    literalsAfter: 4,
    compute: (bits) => ((bits[3] && (bits[1] || bits[2])) ? 1 : 0) as Bit,
    circuit: {
      topic: 'SOP · F = BD + CD  (operator A is dead wire)',
      outputSym: 'F',
      terms: [
        term([lit('B'), lit('D')], '#fbbf24'),
        term([lit('C'), lit('D')], '#a78bfa'),
      ],
    },
  },
];

// ─────────────────────────────────────────────────────────────────────────
// BossCard
// ─────────────────────────────────────────────────────────────────────────
const BossCard: React.FC<{ p: BossProblem; isDarkMode: boolean }> = ({ p, isDarkMode }) => {
  const [open, setOpen] = useState(false);
  const [showGroups, setShowGroups] = useState(false);
  const [bits, setBits] = useState<Bit[]>(() => Array(4).fill(0) as Bit[]);

  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText   = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg    = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';

  const cleanInputs: CleanInput[] = p.inputs.map((inp, i) => ({
    sym: inp.sym,
    meaning: inp.meaning,
    accent: inp.accent,
    value: bits[i],
  }));

  const setBit = (i: number, b: Bit) => setBits((arr) => {
    const copy = arr.slice() as Bit[];
    copy[i] = b;
    return copy;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className={`p-7 rounded-3xl border ${cardBg}`}
    >
      <div className="flex items-start gap-4 mb-5 flex-wrap">
        <div className="w-14 h-14 rounded-2xl grid place-items-center shrink-0 bg-rose-500/20 border-2 border-rose-400/55">
          <p.Icon size={26} className="text-rose-300" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap gap-2 mb-2">
            <span className="px-2 py-0.5 rounded-md font-mono text-[10px] uppercase tracking-widest font-black bg-rose-500/22 text-rose-300 border border-rose-400/55 inline-block">
              BOSS
            </span>
            <span
              className="font-mono text-[10px] uppercase tracking-widest font-black px-2 py-0.5 rounded inline-block"
              style={{ background: '#a78bfa22', color: '#a78bfa', border: '1px solid #a78bfa55' }}
            >
              Topic · {p.circuit.topic.replace(/^[^·]+·\s*/, '')}
            </span>
          </div>
          <h3 className={`text-2xl font-black ${textColor}`}>{p.title}</h3>
          <p className={`text-sm ${subText} mt-2`}>{p.scenario}</p>
        </div>
      </div>

      {/* Active minterms + DC chips */}
      <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-black/30 border-white/10' : 'bg-slate-50 border-slate-200'} mb-4`}>
        <div className="font-mono text-[10px] uppercase tracking-widest text-rose-300 mb-2">
          Spec · F(A,B,C,D)
        </div>
        <div className="font-mono text-sm space-y-1">
          <div className={textColor}>Σm({p.active.join(', ')})</div>
          {p.dontCares.length > 0 && (
            <div className="text-amber-300">+ d({p.dontCares.join(', ')}) <span className="text-[10px] opacity-70">don't-cares</span></div>
          )}
        </div>
      </div>

      {/* Sub-questions */}
      <div className={`p-4 rounded-2xl border ${cardBg} mb-4`}>
        <div className="font-mono text-[10px] uppercase tracking-widest text-rose-400 mb-3">
          Solve it · {p.questions.length} sub-questions
        </div>
        <ol className="space-y-1.5">
          {p.questions.map((qa, i) => (
            <li key={i} className={`text-sm ${subText} flex gap-2`}>
              <span className="font-mono text-rose-300 font-black">{i + 1}.</span>
              <span>{qa.q}</span>
            </li>
          ))}
        </ol>
      </div>

      <button
        onClick={() => setOpen(!open)}
        className="w-full px-5 py-3 rounded-xl border-2 border-rose-400/50 bg-rose-500/10 text-rose-300 font-mono text-sm uppercase tracking-widest font-black flex items-center justify-center gap-2 hover:bg-rose-500/20 transition-all"
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
                  <div className="font-mono text-[10px] uppercase tracking-widest text-violet-300">K-Map</div>
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
                  <KMap4
                    active={new Set(p.active)}
                    dontCares={new Set(p.dontCares)}
                    groups={p.groups}
                    showGroups={showGroups}
                    isDarkMode={isDarkMode}
                  />
                </div>
                {showGroups && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 grid sm:grid-cols-2 lg:grid-cols-4 gap-2"
                  >
                    {p.groups.map((g) => (
                      <div key={g.term} className="p-3 rounded-xl border-2 text-center" style={{ borderColor: g.color, background: `${g.color}10` }}>
                        <div className="font-mono text-[10px] uppercase tracking-widest mb-1" style={{ color: g.color }}>
                          {g.cells.length}-cell loop
                        </div>
                        <div className={`text-base font-black font-mono ${textColor}`}>{g.term}</div>
                        <p className={`text-[10px] ${subText} mt-1`}>{g.label}</p>
                      </div>
                    ))}
                  </motion.div>
                )}
              </div>

              {/* Live optimised schematic (revealed) */}
              <div className={`p-5 rounded-2xl border ${isDarkMode ? 'bg-black/30 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                <div className={`flex items-center gap-2 text-xs font-mono ${subText} mb-3`}>
                  <MousePointerClick size={12} /> Live optimised schematic · toggle inputs · single-literal terms bypass the AND and feed the OR directly
                </div>
                <div className="flex gap-2 mb-3 flex-wrap">
                  {p.inputs.map((inp, i) => (
                    <button
                      key={inp.sym}
                      onClick={() => setBit(i, bits[i] === 1 ? 0 : 1)}
                      className="px-4 py-2 rounded-xl border-2 font-mono font-black transition-all flex flex-col items-start gap-0.5"
                      style={{
                        borderColor: inp.accent,
                        color: bits[i] ? '#000' : inp.accent,
                        backgroundColor: bits[i] ? inp.accent : 'transparent',
                        boxShadow: bits[i] ? `0 0 20px ${inp.accent}55` : 'none',
                      }}
                    >
                      <span className="text-[9px] uppercase tracking-widest opacity-80">{inp.meaning}</span>
                      <span className="text-sm">{inp.sym} = {bits[i]}</span>
                    </button>
                  ))}
                </div>
                <CleanCircuit
                  topic={p.circuit.topic}
                  inputs={cleanInputs}
                  terms={p.circuit.terms}
                  outputSym={p.circuit.outputSym}
                  isDark={isDarkMode}
                />
              </div>

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

              <div className="grid sm:grid-cols-2 gap-3">
                <div className={`p-4 rounded-2xl border-2 border-amber-400/40 bg-amber-500/10`}>
                  <div className="font-mono text-[10px] uppercase tracking-widest text-amber-300 mb-2">Canonical (brute force)</div>
                  <div className={`font-mono text-xs font-black ${textColor}`}>{p.unsimplified}</div>
                  <div className={`mt-2 text-xs ${subText} font-mono`}>{p.literalsBefore} literals</div>
                </div>
                <div className={`p-4 rounded-2xl border-2 border-emerald-400 bg-emerald-500/10`}>
                  <div className="font-mono text-[10px] uppercase tracking-widest text-emerald-300 mb-2">Boss-level minimised</div>
                  <div className={`font-mono text-base font-black ${textColor}`}>{p.minimised}</div>
                  <div className={`mt-2 text-xs ${subText} font-mono`}>{p.literalsAfter} literals · {Math.round((1 - p.literalsAfter / p.literalsBefore) * 100)}% reduction</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export const S04_Boss: React.FC<Props> = ({ isActive, isDarkMode }) => {
  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText   = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg    = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';

  return (
    <div className="max-w-6xl mx-auto space-y-10 py-4">
      <motion.section
        initial={{ opacity: 0, y: 20 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        className="space-y-3"
      >
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.4em] uppercase text-rose-400">
          <Trophy size={14} /> Drill Set 04 · Boss Round
        </div>
        <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>
          Two heavyweight problems. No shortcuts.
        </h2>
        <p className={`text-base max-w-3xl ${subText}`}>
          Real engineering problems with don't-cares, useless inputs, and 4-cell groups you
          have to find. Each one comes with a K-Map, a live circuit (drawn in the same clean
          rails-then-gates layout used everywhere else in this module), and 4 sub-questions.
          Map out the truth table carefully - these problems punish guessing.
        </p>
      </motion.section>

      <motion.div
        initial={{ opacity: 0, y: 14 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        className={`p-5 rounded-2xl border ${cardBg} flex items-start gap-3`}
      >
        <Lightbulb className="text-amber-300 mt-0.5 shrink-0" size={18} />
        <div className={`text-sm ${subText}`}>
          <strong className="text-amber-300">Boss tip:</strong> on a 4-variable K-Map, the four
          corner cells (m0, m2, m8, m10) wrap around and count as a single 4-cell group. Same
          for any row or column corners. If you only spot 2-cell groups, you probably missed a
          wrap-around group.
        </div>
      </motion.div>

      <div className="space-y-6">
        {PROBLEMS.map((p) => (
          <BossCard key={p.id} p={p} isDarkMode={isDarkMode} />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }} animate={isActive ? { opacity: 1 } : {}}
        transition={{ delay: 0.4 }}
        className={`text-center text-xs font-mono uppercase tracking-[0.3em] ${subText}`}
      >
        Boss round complete · cheatsheet next for one-glance reference
      </motion.div>
    </div>
  );
};
