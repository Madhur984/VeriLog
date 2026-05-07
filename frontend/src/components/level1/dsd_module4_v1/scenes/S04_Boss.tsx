import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, ChevronRight, ChevronDown, CheckCircle2, Lightbulb, Hash, Car, MousePointerClick } from 'lucide-react';

interface Props { isActive: boolean; isDarkMode: boolean; }
type Bit = 0 | 1;

const ROW4 = [0, 1, 3, 2];
const COL4 = [0, 1, 3, 2];
const wireColor = (v: Bit) => v === 1 ? '#fb7185' : '#475569';
const wireGlow = (v: Bit) => v === 1 ? 'drop-shadow(0 0 4px rgba(251,113,133,0.7))' : 'none';

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
  // Computes Y given input bits
  compute: (bits: Bit[]) => Bit;
  // Renders the optimised live schematic
  renderCircuit: (bits: Bit[], y: Bit, isDark: boolean) => React.ReactNode;
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
                              : `bg-black/20 border-white/10 ${textColor}`
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

// ─────────────────────────────────────────────────────────────────────────
// Boss Problem 1 · BCD 7-segment, segment 'a'
// Active for digits 0,2,3,5,6,7,8,9 → m{0,2,3,5,6,7,8,9}
// DC for non-BCD: m{10,11,12,13,14,15}
// Minimised: a = A + C + BD + B'D'
// ─────────────────────────────────────────────────────────────────────────
const renderSegA = (bits: Bit[], y: Bit, isDark: boolean) => {
  const [a3, a2, a1, a0] = bits; // BCD A=MSB
  const fill = isDark ? '#0a0e1a' : '#fff';
  const aLine: Bit = a3;
  const cLine: Bit = a1;
  const bd: Bit = (a2 && a0) ? 1 : 0;
  const bn: Bit = (a2 === 0 ? 1 : 0) as Bit;
  const dn: Bit = (a0 === 0 ? 1 : 0) as Bit;
  const bndn: Bit = (bn && dn) ? 1 : 0;
  return (
    <g>
      <text x="14" y="40" fontSize="13" fontWeight="bold" fill="#0ea5e9" fontFamily="monospace">A = {a3}</text>
      <text x="14" y="100" fontSize="13" fontWeight="bold" fill="#22d3ee" fontFamily="monospace">B = {a2}</text>
      <text x="14" y="160" fontSize="13" fontWeight="bold" fill="#a78bfa" fontFamily="monospace">C = {a1}</text>
      <text x="14" y="240" fontSize="13" fontWeight="bold" fill="#f59e0b" fontFamily="monospace">D = {a0}</text>
      <line x1="40" y1="50" x2="40" y2="280" stroke={wireColor(a3)} strokeWidth="2.5" style={{ filter: wireGlow(a3) }} />
      <line x1="76" y1="50" x2="76" y2="280" stroke={wireColor(a2)} strokeWidth="2.5" style={{ filter: wireGlow(a2) }} />
      <line x1="112" y1="50" x2="112" y2="280" stroke={wireColor(a1)} strokeWidth="2.5" style={{ filter: wireGlow(a1) }} />
      <line x1="148" y1="50" x2="148" y2="280" stroke={wireColor(a0)} strokeWidth="2.5" style={{ filter: wireGlow(a0) }} />

      {/* Direct A (single literal) */}
      <line x1="40" y1="80" x2="430" y2="60" stroke={wireColor(aLine)} strokeWidth="2" style={{ filter: wireGlow(aLine) }} />
      <text x="320" y="56" fontSize="10" fill="#fcd34d" fontFamily="monospace">A = {aLine}</text>

      {/* Direct C (single literal) */}
      <line x1="112" y1="120" x2="430" y2="115" stroke={wireColor(cLine)} strokeWidth="2" style={{ filter: wireGlow(cLine) }} />
      <text x="320" y="106" fontSize="10" fill="#fcd34d" fontFamily="monospace">C = {cLine}</text>

      {/* AND BD */}
      <line x1="76" y1="170" x2="280" y2="160" stroke={wireColor(a2)} strokeWidth="2" style={{ filter: wireGlow(a2) }} />
      <line x1="148" y1="200" x2="280" y2="190" stroke={wireColor(a0)} strokeWidth="2" style={{ filter: wireGlow(a0) }} />
      <path d="M 280 150 L 310 150 A 22 22 0 0 1 310 200 L 280 200 Z" fill={fill} stroke="#fcd34d" strokeWidth="2" />
      <text x="287" y="180" fontSize="10" fill="#fcd34d" fontFamily="monospace">AND</text>
      <line x1="333" y1="175" x2="430" y2="170" stroke={wireColor(bd)} strokeWidth="2.5" style={{ filter: wireGlow(bd) }} />
      <text x="345" y="162" fontSize="10" fill="#fcd34d" fontFamily="monospace">BD={bd}</text>

      {/* NOT(B), NOT(D), AND B'D' */}
      <line x1="76" y1="250" x2="180" y2="250" stroke={wireColor(a2)} strokeWidth="1.5" style={{ filter: wireGlow(a2) }} />
      <polygon points="180,242 200,250 180,258" fill={fill} stroke="#fb7185" strokeWidth="1.5" />
      <circle cx="203" cy="250" r="2.5" fill={fill} stroke="#fb7185" strokeWidth="1.5" />
      <line x1="206" y1="250" x2="280" y2="240" stroke={wireColor(bn)} strokeWidth="1.5" style={{ filter: wireGlow(bn) }} />
      <line x1="148" y1="270" x2="200" y2="270" stroke={wireColor(a0)} strokeWidth="1.5" style={{ filter: wireGlow(a0) }} />
      <polygon points="200,262 220,270 200,278" fill={fill} stroke="#fb7185" strokeWidth="1.5" />
      <circle cx="223" cy="270" r="2.5" fill={fill} stroke="#fb7185" strokeWidth="1.5" />
      <line x1="226" y1="270" x2="280" y2="260" stroke={wireColor(dn)} strokeWidth="1.5" style={{ filter: wireGlow(dn) }} />
      <path d="M 280 230 L 310 230 A 18 18 0 0 1 310 270 L 280 270 Z" fill={fill} stroke="#fcd34d" strokeWidth="2" />
      <text x="284" y="255" fontSize="9" fill="#fcd34d" fontFamily="monospace">AND</text>
      <line x1="328" y1="250" x2="430" y2="225" stroke={wireColor(bndn)} strokeWidth="2.5" style={{ filter: wireGlow(bndn) }} />
      <text x="345" y="232" fontSize="10" fill="#fcd34d" fontFamily="monospace">B′D′={bndn}</text>

      {/* OR (4-input) */}
      <path d="M 430 50 Q 450 145 430 230 Q 530 215 565 145 Q 530 70 430 50 Z" fill={fill} stroke="#22c55e" strokeWidth="2.5" />
      <text x="450" y="151" fontSize="13" fill="#22c55e" fontFamily="monospace" fontWeight="bold">OR</text>

      {/* Output */}
      <line x1="565" y1="145" x2="690" y2="145" stroke={wireColor(y)} strokeWidth="3.5" style={{ filter: wireGlow(y) }} />
      <rect x="640" y="123" width="50" height="44" rx="6" fill={y ? '#fb7185' : 'none'} stroke="#fb7185" strokeWidth="2.5"
            style={{ filter: y ? 'drop-shadow(0 0 18px rgba(251,113,133,0.7))' : 'none' }} />
      <text x="650" y="151" fontSize="14" fill={y ? '#000' : '#fb7185'} fontFamily="monospace" fontWeight="bold">a={y}</text>
    </g>
  );
};

// ─────────────────────────────────────────────────────────────────────────
// Boss Problem 2 · Smart Garage Door
// F = D(B+C) = BD + CD
// ─────────────────────────────────────────────────────────────────────────
const renderGarage = (bits: Bit[], y: Bit, isDark: boolean) => {
  const [_a, b, c, d] = bits;
  const bd: Bit = (b && d) ? 1 : 0;
  const cd: Bit = (c && d) ? 1 : 0;
  const fill = isDark ? '#0a0e1a' : '#fff';
  return (
    <g>
      <text x="14" y="40" fontSize="13" fontWeight="bold" fill="#475569" fontFamily="monospace">A · ignored</text>
      <text x="14" y="100" fontSize="13" fontWeight="bold" fill="#22d3ee" fontFamily="monospace">B = {b}</text>
      <text x="14" y="170" fontSize="13" fontWeight="bold" fill="#a78bfa" fontFamily="monospace">C = {c}</text>
      <text x="14" y="240" fontSize="13" fontWeight="bold" fill="#f59e0b" fontFamily="monospace">D = {d}</text>
      <line x1="40" y1="50" x2="40" y2="60" stroke="#475569" strokeWidth="2" />
      <line x1="76" y1="50" x2="76" y2="260" stroke={wireColor(b)} strokeWidth="2.5" style={{ filter: wireGlow(b) }} />
      <line x1="112" y1="50" x2="112" y2="260" stroke={wireColor(c)} strokeWidth="2.5" style={{ filter: wireGlow(c) }} />
      <line x1="148" y1="50" x2="148" y2="260" stroke={wireColor(d)} strokeWidth="2.5" style={{ filter: wireGlow(d) }} />

      {/* BD */}
      <line x1="76" y1="120" x2="280" y2="100" stroke={wireColor(b)} strokeWidth="2" style={{ filter: wireGlow(b) }} />
      <line x1="148" y1="140" x2="280" y2="120" stroke={wireColor(d)} strokeWidth="2" style={{ filter: wireGlow(d) }} />
      <path d="M 280 90 L 310 90 A 22 22 0 0 1 310 130 L 280 130 Z" fill={fill} stroke="#fcd34d" strokeWidth="2" />
      <text x="287" y="115" fontSize="10" fill="#fcd34d" fontFamily="monospace">AND</text>
      <line x1="333" y1="110" x2="450" y2="120" stroke={wireColor(bd)} strokeWidth="2.5" style={{ filter: wireGlow(bd) }} />
      <text x="345" y="103" fontSize="10" fill="#fcd34d" fontFamily="monospace">BD={bd}</text>

      {/* CD */}
      <line x1="112" y1="200" x2="280" y2="200" stroke={wireColor(c)} strokeWidth="2" style={{ filter: wireGlow(c) }} />
      <line x1="148" y1="220" x2="280" y2="220" stroke={wireColor(d)} strokeWidth="2" style={{ filter: wireGlow(d) }} />
      <path d="M 280 190 L 310 190 A 22 22 0 0 1 310 230 L 280 230 Z" fill={fill} stroke="#fcd34d" strokeWidth="2" />
      <text x="287" y="215" fontSize="10" fill="#fcd34d" fontFamily="monospace">AND</text>
      <line x1="333" y1="210" x2="450" y2="195" stroke={wireColor(cd)} strokeWidth="2.5" style={{ filter: wireGlow(cd) }} />
      <text x="345" y="203" fontSize="10" fill="#fcd34d" fontFamily="monospace">CD={cd}</text>

      {/* OR */}
      <path d="M 450 100 Q 470 158 450 215 Q 535 200 570 158 Q 535 115 450 100 Z" fill={fill} stroke="#22c55e" strokeWidth="2.5" />
      <text x="470" y="163" fontSize="13" fill="#22c55e" fontFamily="monospace" fontWeight="bold">OR</text>

      <line x1="570" y1="158" x2="690" y2="158" stroke={wireColor(y)} strokeWidth="3.5" style={{ filter: wireGlow(y) }} />
      <rect x="640" y="136" width="50" height="44" rx="6" fill={y ? '#fb7185' : 'none'} stroke="#fb7185" strokeWidth="2.5"
            style={{ filter: y ? 'drop-shadow(0 0 18px rgba(251,113,133,0.7))' : 'none' }} />
      <text x="650" y="164" fontSize="16" fill={y ? '#000' : '#fb7185'} fontFamily="monospace" fontWeight="bold">F={y}</text>
    </g>
  );
};

const PROBLEMS: BossProblem[] = [
  // Boss 1: BCD 7-segment, segment 'a'
  {
    id: 'b1',
    Icon: Hash,
    title: "Boss 1 · 7-Segment Decoder · segment 'a'",
    scenario:
      'You are designing one segment of a 7-segment display driver. Input is a 4-bit BCD digit (A=MSB, D=LSB) representing 0–9. Output is segment "a" (the top horizontal stroke). Segment a is LIT for digits 0, 2, 3, 5, 6, 7, 8, 9 — every digit EXCEPT 1 and 4. Codes 10–15 never occur in BCD, so they are don\'t-cares.',
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
      { q: 'What digits make segment "a" light up? Which DON\'T?',
        a: 'Lit: 0, 2, 3, 5, 6, 7, 8, 9. Dark: 1, 4. (1 = no top stroke; 4 has only middle/right strokes.)' },
      { q: 'How do you exploit the don\'t-cares m10..m15?',
        a: 'Treat them as 1 wherever they help form a larger group. Here they extend the A and C groups from 4 cells to 8 cells — each saves 2 literals.' },
      { q: 'Final minimised SOP?',
        a: "a = A + C + BD + B'D'  · 4 product terms · 6 literals." },
      { q: 'Hardware footprint?',
        a: "6 gates · 2 NOTs (B', D'), 2 ANDs (BD and B'D'), 1 four-input OR. The single literals A and C feed the OR directly." },
    ],
    unsimplified: '8 minterms × 4 literals = 32 literals',
    minimised: "a = A + C + BD + B'D'",
    literalsBefore: 32,
    literalsAfter: 6,
    compute: (bits) => {
      const m = bits[0] * 8 + bits[1] * 4 + bits[2] * 2 + bits[3];
      return ([0, 2, 3, 5, 6, 7, 8, 9].includes(m) ? 1 : 0) as Bit;
    },
    renderCircuit: renderSegA,
  },
  // Boss 2: Smart Garage Door
  {
    id: 'b2',
    Icon: Car,
    title: 'Boss 2 · Smart Garage Door',
    scenario:
      'A smart garage door has 4 inputs: A (operator radio idle, ignored), B (resident keyfob present), C (motion sensor at gate), D (commands enabled by master switch). The door OPENS when a valid trigger arrives AND the master switch is on — specifically: F = 1 iff D=1 AND (B=1 OR C=1). Build the truth table, K-Map, minimised SOP, and the schematic.',
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
      { q: 'Translate the spec ("D=1 AND (B=1 OR C=1)") into the active minterm list.',
        a: 'Σm(3, 5, 7, 11, 13, 15) — every row where D=1 and at least one of B, C is 1.' },
      { q: 'On the 4-var K-Map, find two 4-cell loops.',
        a: 'BD (centre 2×2) covers {m5, m7, m13, m15}; CD (CD=11 column) covers {m3, m7, m11, m15}. They overlap on m7 and m15.' },
      { q: 'Final minimised SOP?',
        a: 'F = BD + CD (also factors as F = D(B + C), which matches the spec exactly).' },
      { q: 'Does input A appear in the optimised circuit?',
        a: 'No — A is irrelevant. The K-Map proves it: A varies inside both groups, so it cancels. Two A wires never touch a gate.' },
    ],
    unsimplified: '6 minterms × 4 literals = 24 literals',
    minimised: 'F = BD + CD = D(B + C)',
    literalsBefore: 24,
    literalsAfter: 4,
    compute: (bits) => ((bits[3] && (bits[1] || bits[2])) ? 1 : 0) as Bit,
    renderCircuit: renderGarage,
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

  const y = useMemo(() => p.compute(bits), [p, bits]);
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
          <span className="px-2 py-0.5 rounded-md font-mono text-[10px] uppercase tracking-widest font-black bg-rose-500/22 text-rose-300 border border-rose-400/55 inline-block mb-2">
            BOSS
          </span>
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
                  <MousePointerClick size={12} /> Live optimised schematic · toggle inputs
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
                <svg viewBox="0 0 720 300" className="w-full h-auto">{p.renderCircuit(bits, y, isDarkMode)}</svg>
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
          Real engineering scenarios with don't-cares, irrelevant inputs, and 4-cell loops you
          MUST find. Each problem ships with K-Map, live schematic, and 4 sub-questions. Don't
          skip the truth-table mapping step — boss-level problems punish hand-waving.
        </p>
      </motion.section>

      <motion.div
        initial={{ opacity: 0, y: 14 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        className={`p-5 rounded-2xl border ${cardBg} flex items-start gap-3`}
      >
        <Lightbulb className="text-amber-300 mt-0.5 shrink-0" size={18} />
        <div className={`text-sm ${subText}`}>
          <strong className="text-amber-300">Boss tip:</strong> on a 4-variable K-Map, the four
          corners (m0, m2, m8, m10) wrap around to form a single 4-cell group. Same applies to
          the four corners of any column or row. If you only see 2-cell loops, you have probably
          missed a wrap-around quad.
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
