import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FlaskConical, CheckCircle, XCircle, RefreshCw } from 'lucide-react';

interface Props { isActive: boolean; isDarkMode: boolean; }

// ─── Boolean Postulates / Theorems Data ──────────────────────
const POSTULATES = [
  { id: 'p1', law: 'x + 0 = x', name: 'Identity (OR)', category: 'postulate', proof: 'Adding nothing changes nothing.' },
  { id: 'p2', law: 'x · 1 = x', name: 'Identity (AND)', category: 'postulate', proof: 'ANDing with 1 keeps the value.' },
  { id: 'p3', law: 'x + x̄ = 1', name: 'Complement (OR)', category: 'postulate', proof: 'Something is always true or false.' },
  { id: 'p4', law: 'x · x̄ = 0', name: 'Complement (AND)', category: 'postulate', proof: 'Cannot be both true and false.' },
  { id: 't1', law: 'x + x = x', name: 'Idempotent (OR)', category: 'theorem', proof: 'OR with itself is itself.' },
  { id: 't2', law: 'x · x = x', name: 'Idempotent (AND)', category: 'theorem', proof: 'AND with itself is itself.' },
  { id: 't3', law: 'x + 1 = 1', name: 'Annihilator (OR)', category: 'theorem', proof: 'OR with 1 always gives 1.' },
  { id: 't4', law: 'x · 0 = 0', name: 'Annihilator (AND)', category: 'theorem', proof: 'AND with 0 always gives 0.' },
  { id: 't5', law: '(x̄)̄ = x', name: 'Double Negation', category: 'theorem', proof: 'Complement twice = original.' },
  { id: 't6', law: 'x + xy = x', name: 'Absorption (OR)', category: 'theorem', proof: 'x already covers xy.' },
  { id: 'dm1', law: 'x+y = x̄·ȳ', name: "DeMorgan's I", category: 'demorgan', proof: 'NOT of OR = AND of NOTs.' },
  { id: 'dm2', law: 'x·y = x̄+ȳ', name: "DeMorgan's II", category: 'demorgan', proof: 'NOT of AND = OR of NOTs.' },
];

// ─── Truth table builder ──────────────────────────────────────
type Gate = 'AND' | 'OR' | 'NAND' | 'NOR' | 'XOR' | 'XNOR';
const GATES: Gate[] = ['AND', 'OR', 'NAND', 'NOR', 'XOR', 'XNOR'];

const evalGate = (g: Gate, a: number, b: number): number => {
  switch (g) {
    case 'AND': return a & b;
    case 'OR': return a | b;
    case 'NAND': return 1 - (a & b);
    case 'NOR': return 1 - (a | b);
    case 'XOR': return a ^ b;
    case 'XNOR': return 1 - (a ^ b);
  }
};

const GATE_COLOR: Record<Gate, string> = {
  AND: '#0EA5E9', OR: '#10B981', NAND: '#F59E0B', NOR: '#F97316', XOR: '#A855F7', XNOR: '#EC4899',
};

const GATE_SYMBOL: Record<Gate, string> = {
  AND: '·', OR: '+', NAND: '↑', NOR: '↓', XOR: '⊕', XNOR: '⊙',
};

// ─── SOP/POS Challenge ────────────────────────────────────────
const SOP_EXERCISES = [
  {
    q: 'Write SOP for: y=1 when (x₁=0,x₂=0) or (x₁=1,x₂=1)',
    rows: [
      { x1: 0, x2: 0, y: 1 },
      { x1: 0, x2: 1, y: 0 },
      { x1: 1, x2: 0, y: 0 },
      { x1: 1, x2: 1, y: 1 },
    ],
    answer: 'x̄₁x̄₂ + x₁x₂',
    hint: 'Row 1 (0,0): x̄₁x̄₂  |  Row 4 (1,1): x₁x₂',
  },
  {
    q: 'Write SOP for: y=1 when x₁=0 only',
    rows: [
      { x1: 0, x2: 0, y: 1 },
      { x1: 0, x2: 1, y: 1 },
      { x1: 1, x2: 0, y: 0 },
      { x1: 1, x2: 1, y: 0 },
    ],
    answer: 'x̄₁',
    hint: 'Rows 1 & 2 share x₁=0 → simplify to x̄₁',
  },
];

export const S12_BooleanAlgebra: React.FC<Props> = ({ isActive, isDarkMode }) => {
  const [activeTab, setActiveTab] = useState<'laws' | 'gates' | 'sop'>('laws');
  const [selectedGate, setSelectedGate] = useState<Gate>('AND');
  const [filterCat, setFilterCat] = useState<'all' | 'postulate' | 'theorem' | 'demorgan'>('all');
  const [sopIdx, setSopIdx] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
  const cardBg = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200 shadow-xl';
  const exercise = SOP_EXERCISES[sopIdx];
  const gateColor = GATE_COLOR[selectedGate];

  const catColors = { all: '#64748B', postulate: '#0EA5E9', theorem: '#10B981', demorgan: '#F97316' };

  return (
    <div className="max-w-5xl mx-auto space-y-12 py-12">
      {/* Header */}
      <section className="text-center space-y-4">
        <motion.span
          initial={{ opacity: 0 }} animate={isActive ? { opacity: 1 } : {}}
          className={`font-mono text-[10px] tracking-[0.4em] uppercase block mb-4 ${isDarkMode ? 'text-sky-400' : 'text-sky-600'}`}
        >
          Boolean Algebra — Chapter 4
        </motion.span>
        <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>Boolean Algebra</h2>
        <p className={`text-lg max-w-2xl mx-auto opacity-70 ${textColor}`}>
          The mathematics of logic — every digital circuit obeys these laws.
        </p>
      </section>

      {/* Tab selector */}
      <div className="flex gap-3 justify-center flex-wrap">
        {(['laws', 'gates', 'sop'] as const).map(tab => (
          <motion.button
            key={tab}
            onClick={() => setActiveTab(tab)}
            animate={{
              background: activeTab === tab ? 'rgba(14,165,233,0.15)' : 'transparent',
              borderColor: activeTab === tab ? '#0EA5E9' : (isDarkMode ? '#2D3139' : '#E2E8F0'),
              color: activeTab === tab ? '#0EA5E9' : (isDarkMode ? '#64748B' : '#9CA3AF'),
            }}
            className="px-6 py-2.5 rounded-full border-2 font-mono text-xs font-black uppercase tracking-widest cursor-pointer"
          >
            {tab === 'laws' ? '⚖ Laws & Postulates' : tab === 'gates' ? '🔌 Gate Truth Tables' : '📐 SOP / POS'}
          </motion.button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* ── TAB: Laws ── */}
        {activeTab === 'laws' && (
          <motion.div key="laws" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
            {/* Category filter */}
            <div className="flex gap-2 flex-wrap justify-center">
              {(['all', 'postulate', 'theorem', 'demorgan'] as const).map(c => (
                <button
                  key={c}
                  onClick={() => setFilterCat(c)}
                  className="px-4 py-1.5 rounded-full border font-mono text-[10px] uppercase tracking-widest cursor-pointer transition-all"
                  style={{
                    borderColor: filterCat === c ? catColors[c] : (isDarkMode ? '#2D3139' : '#E2E8F0'),
                    color: filterCat === c ? catColors[c] : (isDarkMode ? '#475569' : '#9CA3AF'),
                    background: filterCat === c ? `${catColors[c]}11` : 'transparent',
                  }}
                >
                  {c === 'all' ? 'All' : c === 'postulate' ? 'Postulates' : c === 'theorem' ? 'Theorems' : "DeMorgan's"}
                </button>
              ))}
            </div>

            {/* Law Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {POSTULATES.filter(p => filterCat === 'all' || p.category === filterCat).map((p, i) => {
                const color = p.category === 'postulate' ? '#0EA5E9' : p.category === 'demorgan' ? '#F97316' : '#10B981';
                return (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className={`p-5 rounded-2xl border group cursor-default transition-all ${cardBg}`}
                    style={{ borderColor: isDarkMode ? '#2D3139' : '#E2E8F0' }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <span className="text-[9px] font-mono uppercase tracking-widest opacity-40" style={{ color }}>
                        {p.category === 'postulate' ? 'Postulate' : p.category === 'demorgan' ? "DeMorgan" : 'Theorem'}
                      </span>
                    </div>
                    <div className="font-mono text-2xl font-black mb-3" style={{ color }}>{p.law}</div>
                    <div className={`font-black text-sm mb-2 ${textColor}`}>{p.name}</div>
                    <div className={`text-xs opacity-50 leading-relaxed ${textColor}`}>{p.proof}</div>
                  </motion.div>
                );
              })}
            </div>

            {/* DeMorgan Highlight */}
            <div className={`p-8 rounded-3xl border ${isDarkMode ? 'bg-orange-500/5 border-orange-500/20' : 'bg-orange-50 border-orange-200'}`}>
              <h3 className={`font-black text-lg mb-4 ${isDarkMode ? 'text-orange-400' : 'text-orange-700'}`}>DeMorgan's Theorems — Most Important!</h3>
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  { title: 'NOT(A OR B) = NOT_A AND NOT_B', desc: 'A+B with a bubble = separate bubbles with AND', ex: '(x+y)̄ = x̄·ȳ' },
                  { title: 'NOT(A AND B) = NOT_A OR NOT_B', desc: 'A·B with a bubble = separate bubbles with OR', ex: '(x·y)̄ = x̄+ȳ' },
                ].map((dm, i) => (
                  <div key={i} className={`p-6 rounded-2xl ${isDarkMode ? 'bg-black/40' : 'bg-white border border-orange-100'}`}>
                    <div className="font-mono text-2xl font-black text-orange-400 mb-2">{dm.ex}</div>
                    <div className={`text-sm opacity-60 ${textColor}`}>{dm.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* ── TAB: Gate Truth Tables ── */}
        {activeTab === 'gates' && (
          <motion.div key="gates" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
            {/* Gate selector */}
            <div className="flex gap-3 flex-wrap justify-center">
              {GATES.map(g => (
                <motion.button
                  key={g}
                  onClick={() => setSelectedGate(g)}
                  animate={{
                    background: selectedGate === g ? `${GATE_COLOR[g]}22` : 'transparent',
                    borderColor: selectedGate === g ? GATE_COLOR[g] : (isDarkMode ? '#2D3139' : '#E2E8F0'),
                    color: selectedGate === g ? GATE_COLOR[g] : (isDarkMode ? '#64748B' : '#9CA3AF'),
                  }}
                  className="px-5 py-2 rounded-2xl border-2 font-mono text-sm font-black cursor-pointer"
                >
                  {g} ({GATE_SYMBOL[g]})
                </motion.button>
              ))}
            </div>

            <div className="grid md:grid-cols-2 gap-8 items-start">
              {/* Truth Table */}
              <div className={`rounded-3xl border overflow-hidden ${cardBg}`}>
                <div className="p-5 border-b" style={{ borderColor: isDarkMode ? '#2D3139' : '#E2E8F0', background: `${gateColor}11` }}>
                  <div className="font-mono font-black text-xl" style={{ color: gateColor }}>
                    {selectedGate} Gate
                  </div>
                  <div className={`text-xs opacity-50 mt-1 ${textColor}`}>y = A {GATE_SYMBOL[selectedGate]} B</div>
                </div>
                <table className="w-full font-mono text-sm">
                  <thead>
                    <tr className={isDarkMode ? 'bg-white/5' : 'bg-gray-50'}>
                      {['A', 'B', 'Output y'].map(h => (
                        <th key={h} className={`px-6 py-3 text-center font-black uppercase tracking-widest text-xs opacity-50 ${textColor}`}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[[0, 0], [0, 1], [1, 0], [1, 1]].map(([a, b], i) => {
                      const out = evalGate(selectedGate, a, b);
                      return (
                        <tr key={i} className={`border-t ${isDarkMode ? 'border-white/5' : 'border-gray-100'}`}>
                          <td className={`px-6 py-4 text-center font-black ${textColor}`}>{a}</td>
                          <td className={`px-6 py-4 text-center font-black ${textColor}`}>{b}</td>
                          <td className="px-6 py-4 text-center">
                            <motion.span
                              key={`${selectedGate}-${i}`}
                              initial={{ scale: 0 }} animate={{ scale: 1 }}
                              className="inline-block w-8 h-8 rounded-lg font-black text-lg flex items-center justify-center"
                              style={{
                                background: out ? `${gateColor}22` : 'transparent',
                                color: out ? gateColor : (isDarkMode ? '#475569' : '#CBD5E1'),
                                border: `2px solid ${out ? gateColor : (isDarkMode ? '#2D3139' : '#E2E8F0')}`,
                              }}
                            >
                              {out}
                            </motion.span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Gate Diagram ASCII */}
              <div className={`p-8 rounded-3xl border h-full flex flex-col justify-between ${cardBg}`}>
                <div>
                  <div className="font-mono text-xs uppercase tracking-widest opacity-40 mb-6" style={{ color: gateColor }}>Gate Symbol</div>
                  <div className={`font-mono text-sm leading-loose p-6 rounded-2xl ${isDarkMode ? 'bg-black/40' : 'bg-gray-50 border border-gray-100'}`} style={{ whiteSpace: 'pre', color: gateColor }}>
                    {selectedGate === 'AND' ? `A ──┐\n    ├─[&]─── y\nB ──┘` :
                     selectedGate === 'OR'  ? `A ──┐\n    ├─[≥1]── y\nB ──┘` :
                     selectedGate === 'NAND' ? `A ──┐\n    ├─[&]─○── y\nB ──┘` :
                     selectedGate === 'NOR'  ? `A ──┐\n    ├─[≥1]─○─ y\nB ──┘` :
                     selectedGate === 'XOR'  ? `A ──┐\n    ├─[=1]── y\nB ──┘` :
                                               `A ──┐\n    ├─[=1]─○─ y\nB ──┘`}
                  </div>
                </div>
                <div className={`mt-6 p-4 rounded-2xl text-xs leading-relaxed font-mono ${isDarkMode ? 'bg-white/5' : 'bg-gray-50 border border-gray-100'} opacity-70 ${textColor}`}>
                  {selectedGate === 'AND' ? 'Output is 1 ONLY when ALL inputs are 1.' :
                   selectedGate === 'OR'  ? 'Output is 1 when ANY input is 1.' :
                   selectedGate === 'NAND' ? 'NOT AND — output is 0 only when ALL are 1.' :
                   selectedGate === 'NOR'  ? 'NOT OR — output is 1 only when ALL are 0.' :
                   selectedGate === 'XOR'  ? 'Exclusive OR — output is 1 when inputs DIFFER.' :
                                             'Exclusive NOR — output is 1 when inputs are SAME.'}
                </div>
              </div>
            </div>

            {/* All Gates Quick Reference */}
            <div className={`p-6 rounded-3xl border ${cardBg}`}>
              <div className={`font-mono text-xs uppercase tracking-widest opacity-40 mb-6 ${textColor}`}>Quick Reference — All Gates</div>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                {GATES.map(g => (
                  <div key={g} className="text-center p-3 rounded-2xl" style={{ background: `${GATE_COLOR[g]}11`, border: `1px solid ${GATE_COLOR[g]}33` }}>
                    <div className="font-mono text-xl font-black" style={{ color: GATE_COLOR[g] }}>{GATE_SYMBOL[g]}</div>
                    <div className="font-mono text-[10px] mt-1 opacity-50">{g}</div>
                    <div className="font-mono text-[9px] mt-1 opacity-40">
                      {[[0,0],[0,1],[1,0],[1,1]].map(([a,b]) => evalGate(g,a,b)).join('')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* ── TAB: SOP / POS ── */}
        {activeTab === 'sop' && (
          <motion.div key="sop" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* SOP Explanation */}
              <div className={`p-8 rounded-3xl border ${isDarkMode ? 'bg-sky-500/5 border-sky-500/20' : 'bg-sky-50 border-sky-200'}`}>
                <h3 className={`font-black text-xl mb-4 ${isDarkMode ? 'text-sky-400' : 'text-sky-700'}`}>Sum of Products (SOP)</h3>
                <p className={`text-sm opacity-70 leading-relaxed mb-4 ${textColor}`}>
                  For each row where y=1, write a minterm (AND of all variables).
                  Then OR all minterms together.
                </p>
                <div className={`font-mono text-xs p-4 rounded-xl ${isDarkMode ? 'bg-black/40' : 'bg-white border border-sky-100'} text-sky-400`}>
                  Rule: if x=1 → use x; if x=0 → use x̄{'\n'}
                  Then: y = m₁ + m₂ + ... (sum all)
                </div>
              </div>
              {/* POS Explanation */}
              <div className={`p-8 rounded-3xl border ${isDarkMode ? 'bg-amber-500/5 border-amber-500/20' : 'bg-amber-50 border-amber-200'}`}>
                <h3 className={`font-black text-xl mb-4 ${isDarkMode ? 'text-amber-400' : 'text-amber-700'}`}>Product of Sums (POS)</h3>
                <p className={`text-sm opacity-70 leading-relaxed mb-4 ${textColor}`}>
                  For each row where y=0, write a maxterm (OR of all variables).
                  Then AND all maxterms together.
                </p>
                <div className={`font-mono text-xs p-4 rounded-xl ${isDarkMode ? 'bg-black/40' : 'bg-white border border-amber-100'} text-amber-400`}>
                  Rule: if x=0 → use x; if x=1 → use x̄{'\n'}
                  Then: y = M₁ · M₂ · ... (product all)
                </div>
              </div>
            </div>

            {/* Interactive Exercise */}
            <div className={`p-8 rounded-3xl border ${cardBg}`}>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <div className={`font-mono text-xs uppercase tracking-widest opacity-40 mb-2 ${textColor}`}>Exercise {sopIdx + 1} / {SOP_EXERCISES.length}</div>
                  <h4 className={`font-black text-lg ${textColor}`}>{exercise.q}</h4>
                </div>
                <button
                  onClick={() => { setSopIdx((sopIdx + 1) % SOP_EXERCISES.length); setShowAnswer(false); setShowHint(false); }}
                  className={`p-3 rounded-xl border cursor-pointer ${isDarkMode ? 'border-white/10 hover:border-sky-500' : 'border-gray-200 hover:border-sky-400'} transition-colors`}
                >
                  <RefreshCw size={16} className="text-sky-500" />
                </button>
              </div>

              {/* Truth Table */}
              <div className={`rounded-2xl border mb-8 overflow-hidden ${isDarkMode ? 'border-white/10' : 'border-gray-200'}`}>
                <table className="w-full font-mono text-sm">
                  <thead>
                    <tr className={isDarkMode ? 'bg-white/5' : 'bg-gray-50'}>
                      {['x₁', 'x₂', 'y', 'Minterm'].map(h => (
                        <th key={h} className={`px-6 py-3 text-center font-black text-xs uppercase tracking-widest opacity-50 ${textColor}`}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {exercise.rows.map((row, i) => {
                      const minterm = row.x1 === 0 && row.x2 === 0 ? 'x̄₁x̄₂' :
                                      row.x1 === 0 && row.x2 === 1 ? 'x̄₁x₂' :
                                      row.x1 === 1 && row.x2 === 0 ? 'x₁x̄₂' : 'x₁x₂';
                      return (
                        <tr key={i} className={`border-t ${isDarkMode ? 'border-white/5' : 'border-gray-100'} ${row.y ? (isDarkMode ? 'bg-sky-500/5' : 'bg-sky-50') : ''}`}>
                          <td className={`px-6 py-4 text-center font-black ${textColor}`}>{row.x1}</td>
                          <td className={`px-6 py-4 text-center font-black ${textColor}`}>{row.x2}</td>
                          <td className="px-6 py-4 text-center">
                            <span className={`font-black text-lg ${row.y ? 'text-sky-400' : (isDarkMode ? 'text-white/20' : 'text-gray-300')}`}>{row.y}</span>
                          </td>
                          <td className={`px-6 py-4 text-center font-mono text-xs ${row.y ? 'text-sky-400' : 'opacity-20'}`}>{row.y ? minterm : '—'}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="flex gap-4 flex-wrap">
                <button
                  onClick={() => setShowHint(!showHint)}
                  className={`px-5 py-2.5 rounded-xl border font-mono text-xs font-black uppercase cursor-pointer transition-all ${
                    isDarkMode ? 'border-white/20 text-white/60 hover:border-sky-500 hover:text-sky-400' : 'border-gray-200 text-gray-500 hover:border-sky-400 hover:text-sky-600'
                  }`}
                >
                  {showHint ? 'Hide Hint' : '💡 Hint'}
                </button>
                <button
                  onClick={() => setShowAnswer(!showAnswer)}
                  className={`px-5 py-2.5 rounded-xl font-mono text-xs font-black uppercase cursor-pointer transition-all ${
                    showAnswer
                      ? 'bg-emerald-500/20 border-2 border-emerald-500 text-emerald-400'
                      : 'bg-sky-500/20 border-2 border-sky-500 text-sky-400'
                  }`}
                >
                  {showAnswer ? '✓ Answer Revealed' : 'Reveal Answer'}
                </button>
              </div>

              <AnimatePresence>
                {showHint && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                    className={`mt-4 p-5 rounded-2xl font-mono text-xs ${isDarkMode ? 'bg-amber-500/10 border border-amber-500/30 text-amber-300' : 'bg-amber-50 border border-amber-200 text-amber-700'}`}
                  >
                    💡 {exercise.hint}
                  </motion.div>
                )}
                {showAnswer && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                    className={`mt-4 p-5 rounded-2xl font-mono text-2xl font-black ${isDarkMode ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400' : 'bg-emerald-50 border border-emerald-200 text-emerald-700'}`}
                  >
                    y = {exercise.answer}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Minterms/Maxterms Quick */}
            <div className={`p-8 rounded-3xl border ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200 shadow-xl'}`}>
              <h4 className={`font-black text-lg mb-6 ${textColor}`}>Minterms (m) vs Maxterms (M) for 2 Variables</h4>
              <div className="overflow-x-auto">
                <table className="w-full font-mono text-xs">
                  <thead>
                    <tr className={isDarkMode ? 'bg-white/5' : 'bg-gray-50'}>
                      {['Index', 'x₁', 'x₂', 'Minterm mₙ', 'Maxterm Mₙ'].map(h => (
                        <th key={h} className={`px-5 py-3 text-left font-black uppercase tracking-widest opacity-50 ${textColor}`}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { idx: 0, x1: 0, x2: 0, min: 'x̄₁x̄₂', max: 'x₁+x₂' },
                      { idx: 1, x1: 0, x2: 1, min: 'x̄₁x₂', max: 'x₁+x̄₂' },
                      { idx: 2, x1: 1, x2: 0, min: 'x₁x̄₂', max: 'x̄₁+x₂' },
                      { idx: 3, x1: 1, x2: 1, min: 'x₁x₂', max: 'x̄₁+x̄₂' },
                    ].map(r => (
                      <tr key={r.idx} className={`border-t ${isDarkMode ? 'border-white/5' : 'border-gray-100'}`}>
                        <td className={`px-5 py-3 font-black ${textColor}`}>{r.idx}</td>
                        <td className={`px-5 py-3 ${textColor}`}>{r.x1}</td>
                        <td className={`px-5 py-3 ${textColor}`}>{r.x2}</td>
                        <td className="px-5 py-3 text-sky-400 font-black">{r.min}</td>
                        <td className="px-5 py-3 text-amber-400 font-black">{r.max}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
