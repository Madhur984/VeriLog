import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, ChevronRight, ChevronDown, CheckCircle2, Lightbulb, Coffee, Plane, Lock, PackageCheck, MousePointerClick } from 'lucide-react';
import { CleanCircuit, lit, not, term, type Bit, type Term, type CleanInput } from './_CleanCircuit';
import { TryItYourself } from '../../../ui/TryItYourself';

interface Props { isActive: boolean; isDarkMode: boolean; }

type InputDef = { sym: string; meaning: string; accent: string };

// ─── 3-var K-map helpers ───
const COL3 = [0, 1, 3, 2]; // BC Gray-coded
// ─── 4-var K-map helpers ───
const ROW4 = [0, 1, 3, 2]; // AB Gray
const COL4 = [0, 1, 3, 2]; // CD Gray

interface Group { cells: number[]; color: string; label: string; term: string; }

// =========================================================================
// AnimatedKMap component - 3-var or 4-var, phases through plot → groups
// =========================================================================
const AnimatedKMap: React.FC<{
  vars: 3 | 4;
  active: Set<number>;
  groups: Group[];
  phase: 'empty' | 'plot' | 'group';
  isDarkMode: boolean;
}> = ({ vars, active, groups, phase, isDarkMode }) => {
  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const groupOf = (m: number) => groups.find((g) => g.cells.includes(m));

  if (vars === 3) {
    return (
      <div className="inline-block">
        <div className="grid grid-cols-[60px_repeat(4,72px)] gap-1 mb-1">
          <div></div>
          {['00', '01', '11', '10'].map((g) => (
            <div key={g} className="text-center font-mono text-[11px] text-violet-300 pb-1">BC={g}</div>
          ))}
        </div>
        {[0, 1].map((a) => (
          <div key={a} className="grid grid-cols-[60px_repeat(4,72px)] gap-1 mb-1">
            <div className="text-right pr-3 font-mono text-[11px] text-violet-300 self-center">A={a}</div>
            {COL3.map((bcBin, col) => {
              const m = a * 4 + bcBin;
              const isOne = active.has(m);
              const grp = groupOf(m);
              const showOne = phase !== 'empty' && isOne;
              const showZero = phase !== 'empty' && !isOne;
              const cellIdx = a * 4 + col;
              return (
                <motion.div
                  key={col}
                  initial={false}
                  animate={{
                    backgroundColor: showOne ? 'rgba(52, 211, 153, 0.20)' : 'rgba(0, 0, 0, 0.20)',
                    borderColor: showOne ? '#34d399' : 'rgba(255,255,255,0.10)',
                  }}
                  transition={{ delay: phase === 'plot' ? cellIdx * 0.06 : 0, duration: 0.35 }}
                  className={`relative h-16 rounded-xl border-2 grid place-items-center font-mono font-black ${
                    showOne ? 'shadow-[0_0_25px_rgba(52,211,153,0.3)]' : ''
                  }`}
                >
                  <AnimatePresence mode="wait">
                    {phase !== 'empty' && (
                      <motion.span
                        key={`${m}-${isOne}`}
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: phase === 'plot' ? cellIdx * 0.06 + 0.1 : 0 }}
                        className={`text-2xl ${showOne ? 'text-emerald-200' : showZero ? textColor : ''}`}
                      >
                        {isOne ? 1 : 0}
                      </motion.span>
                    )}
                  </AnimatePresence>
                  <span className="absolute top-1 left-2 text-[9px] opacity-50">m{m}</span>
                  <AnimatePresence>
                    {phase === 'group' && grp && (
                      <motion.span
                        initial={{ opacity: 0, scale: 0.85 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ delay: 0.1 + groups.indexOf(grp) * 0.2 }}
                        className="absolute -inset-0.5 rounded-xl border-[3px] pointer-events-none"
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
  }

  // 4-var
  return (
    <div className="inline-block">
      <div className="grid grid-cols-[60px_repeat(4,64px)] gap-1 mb-1">
        <div></div>
        {['00', '01', '11', '10'].map((g) => (
          <div key={g} className="text-center font-mono text-[10px] text-violet-300 pb-1">CD={g}</div>
        ))}
      </div>
      {[0, 1, 2, 3].map((rowIdx) => (
        <div key={rowIdx} className="grid grid-cols-[60px_repeat(4,64px)] gap-1 mb-1">
          <div className="text-right pr-2 font-mono text-[10px] text-violet-300 self-center">
            AB={['00', '01', '11', '10'][rowIdx]}
          </div>
          {[0, 1, 2, 3].map((colIdx) => {
            const m = ROW4[rowIdx] * 4 + COL4[colIdx];
            const isOne = active.has(m);
            const grp = groupOf(m);
            const showOne = phase !== 'empty' && isOne;
            const showZero = phase !== 'empty' && !isOne;
            const cellIdx = rowIdx * 4 + colIdx;
            return (
              <motion.div
                key={colIdx}
                initial={false}
                animate={{
                  backgroundColor: showOne ? 'rgba(52, 211, 153, 0.20)' : 'rgba(0, 0, 0, 0.20)',
                  borderColor: showOne ? '#34d399' : 'rgba(255,255,255,0.10)',
                }}
                transition={{ delay: phase === 'plot' ? cellIdx * 0.04 : 0, duration: 0.35 }}
                className={`relative h-12 rounded-lg border-2 grid place-items-center font-mono text-sm font-black ${
                  showOne ? 'shadow-[0_0_15px_rgba(52,211,153,0.3)]' : ''
                }`}
              >
                <AnimatePresence>
                  {phase !== 'empty' && (
                    <motion.span
                      key={`${m}-${isOne}`}
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: phase === 'plot' ? cellIdx * 0.04 + 0.1 : 0 }}
                      className={showOne ? 'text-emerald-200' : showZero ? textColor : ''}
                    >
                      {isOne ? 1 : 0}
                    </motion.span>
                  )}
                </AnimatePresence>
                <span className="absolute top-0.5 left-1 text-[8px] opacity-50">m{m}</span>
                <AnimatePresence>
                  {phase === 'group' && grp && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: 0.1 + groups.indexOf(grp) * 0.2 }}
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

// =========================================================================
// LiveSchematic - interactive minimised circuit using CleanCircuit
// =========================================================================
interface LiveCircuitDef {
  topic: string;
  inputs: InputDef[];
  terms: Term[];
}

const LiveSchematic: React.FC<{ circuit: LiveCircuitDef; isDarkMode: boolean }> = ({ circuit, isDarkMode }) => {
  const [bits, setBits] = useState<Bit[]>(() => circuit.inputs.map((_, i) => (i < 2 ? 1 : 0) as Bit));

  const subText = isDarkMode ? 'text-slate-300' : 'text-slate-600';

  const cleanInputs: CleanInput[] = circuit.inputs.map((inp, i) => ({
    sym: inp.sym,
    meaning: inp.meaning,
    accent: inp.accent,
    value: bits[i],
  }));

  return (
    <div className="space-y-4">
      <div className={`flex items-center gap-2 text-xs font-mono ${subText}`}>
        <MousePointerClick size={12} /> Toggle inputs · watch the wires light up · gate values update live
      </div>
      <div className="flex gap-2 flex-wrap">
        {circuit.inputs.map((inp, i) => {
          const v = bits[i];
          const setV = (next: Bit) => setBits((arr) => arr.map((b, j) => (j === i ? next : b)) as Bit[]);
          return (
            <button
              key={inp.sym}
              onClick={() => setV(v === 1 ? 0 : 1)}
              className="px-4 py-2 rounded-xl border-2 font-mono font-black transition-all flex flex-col items-start gap-0.5"
              style={{
                borderColor: inp.accent,
                color: v ? '#000' : inp.accent,
                backgroundColor: v ? inp.accent : 'transparent',
                boxShadow: v ? `0 0 20px ${inp.accent}55` : 'none',
              }}
            >
              <span className="text-[9px] uppercase tracking-widest opacity-80">{inp.meaning}</span>
              <span className="text-sm">{inp.sym} = {v}</span>
            </button>
          );
        })}
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`rounded-2xl p-4 border ${isDarkMode ? 'bg-black/30 border-white/10' : 'bg-slate-50 border-slate-200'}`}
      >
        <CleanCircuit
          topic={circuit.topic}
          inputs={cleanInputs}
          terms={circuit.terms}
          isDark={isDarkMode}
        />
      </motion.div>
    </div>
  );
};

// =========================================================================
// CanonicalCircuitHint - bloated sum-of-minterms preview
// =========================================================================
const CanonicalCircuitHint: React.FC<{ minterms: number[]; vars: 3 | 4 }> = ({ minterms, vars }) => {
  const literalCount = minterms.length * vars;
  const andCount = minterms.length;
  const shown = minterms.slice(0, Math.min(5, minterms.length));
  const labels = vars === 3 ? ['A', 'B', 'C'] : ['A', 'B', 'C', 'D'];
  const rail = ['#fb7185', '#fbbf24', '#22d3ee', '#a78bfa'];

  const railSpacing = 14;
  const railStartX = 26;
  const lastRailX = railStartX + (labels.length - 1) * railSpacing;
  const andX = lastRailX + 38;
  const andBodyW = 14;
  const andTipX = andX + andBodyW + 10;
  const rowH = 32;
  const topY = 26;
  const orX = andTipX + 80;
  const orW = 60;
  const outX = orX + orW;
  const totalH = topY + shown.length * rowH + 18;
  const orMidY = topY + (shown.length * rowH) / 2 - rowH / 2 + 12;

  const fanSpread = 6;
  const inputY = (j: number) => -fanSpread + (j * 2 * fanSpread) / Math.max(1, vars - 1);

  return (
    <svg viewBox={`0 0 ${outX + 36} ${totalH + 16}`} className="w-full h-auto">
      {labels.map((lbl, i) => (
        <text key={lbl} x={railStartX + i * railSpacing} y={14} textAnchor="middle"
              fontSize="11" fontWeight="bold" fill={rail[i]} fontFamily="monospace">{lbl}</text>
      ))}
      {labels.map((_, i) => (
        <line key={i} x1={railStartX + i * railSpacing} y1={20}
              x2={railStartX + i * railSpacing} y2={topY + shown.length * rowH + 2}
              stroke={rail[i]} strokeWidth="1.5" opacity="0.65" />
      ))}

      {shown.map((m, i) => {
        const cy = topY + i * rowH + 14;
        const bits = m.toString(2).padStart(vars, '0').split('').map(Number);
        return (
          <g key={i}>
            {bits.map((b, j) => {
              const fromX = railStartX + j * railSpacing;
              const yIn = cy + inputY(j);
              const isPrimed = b === 0;
              return (
                <g key={j}>
                  <line x1={fromX} y1={cy - fanSpread - 2} x2={fromX} y2={yIn} stroke={rail[j]} strokeWidth="1" opacity="0.7" />
                  <line x1={fromX} y1={yIn} x2={andX - (isPrimed ? 6 : 0)} y2={yIn} stroke={rail[j]} strokeWidth="1" opacity="0.85" />
                  {isPrimed && (
                    <circle cx={andX - 4} cy={yIn} r={2.4} fill="none" stroke={rail[j]} strokeWidth="1.2" />
                  )}
                </g>
              );
            })}
            <path d={`M ${andX} ${cy - 9} L ${andX + andBodyW} ${cy - 9} A 9 9 0 0 1 ${andX + andBodyW} ${cy + 9} L ${andX} ${cy + 9} Z`}
                  fill="none" stroke="#fbbf24" strokeWidth="1.6" />
            <line x1={andTipX} y1={cy} x2={orX - 1} y2={cy} stroke="#fbbf24" strokeWidth="1.6" />
            <text x={andTipX + 4} y={cy - 4} fontSize="8" fill="#fbbf24" opacity="0.85" fontFamily="monospace">m{m}</text>
          </g>
        );
      })}

      {minterms.length > shown.length && (
        <text x={andX + andBodyW / 2} y={topY + shown.length * rowH + 6} textAnchor="middle"
              fontSize="14" fontWeight="bold" fill="#fbbf24" opacity="0.7" fontFamily="monospace">⋮</text>
      )}

      <path d={`M ${orX} ${topY - 6} Q ${orX + 16} ${orMidY} ${orX} ${topY + shown.length * rowH + 4}
                Q ${orX + orW - 16} ${topY + shown.length * rowH - 4} ${outX} ${orMidY}
                Q ${orX + orW - 16} ${topY - 4} ${orX} ${topY - 6} Z`}
            fill="none" stroke="#22c55e" strokeWidth="2" />
      <text x={orX + 16} y={orMidY + 4} fontSize="11" fontWeight="bold" fill="#22c55e" fontFamily="monospace">OR</text>

      <line x1={outX} y1={orMidY} x2={outX + 30} y2={orMidY} stroke="#22c55e" strokeWidth="2.5" />
      <text x={outX + 12} y={orMidY - 5} fontSize="13" fontWeight="bold" fill="#22c55e" fontFamily="monospace">F</text>

      <text x="20" y={totalH + 12} fontSize="10" fontFamily="monospace" fill="#fb7185" fontWeight="bold">
        {andCount} ANDs · {literalCount} literals · BLOATED
      </text>
    </svg>
  );
};

// =========================================================================
// PROBLEM CONFIG
// =========================================================================
interface ProblemConfig {
  id: string;
  Icon: React.ComponentType<any>;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Harder';
  scenario: {
    accent: string;
    headline: string;
    story: string;
    rule: string;
  };
  inputs: InputDef[];
  output: { sym: string; meaning: string };
  vars: 3 | 4;
  active: number[];
  groups: Group[];
  loopExplanations: { color: string; cells: string; analysis: string[]; result: string }[];
  canonicalSOP: string;
  minimisedSOP: string;
  hardware: { not: number; and: string; or: string; total: number };
  questions: { q: string; answer: string }[];
  circuit: LiveCircuitDef;
  redundantNote?: string;
}

// Q1 inputs
const Q1_INPUTS: InputDef[] = [
  { sym: 'A', meaning: 'Cup detected', accent: '#0ea5e9' },
  { sym: 'B', meaning: 'Drink button',  accent: '#22d3ee' },
  { sym: 'C', meaning: 'Auto-clean',    accent: '#f59e0b' },
];
const Q2_INPUTS: InputDef[] = [
  { sym: 'A', meaning: 'GPS lock',     accent: '#0ea5e9' },
  { sym: 'B', meaning: 'Manual stick', accent: '#22d3ee' },
  { sym: 'C', meaning: 'Autopilot',    accent: '#f59e0b' },
];
const Q3_INPUTS: InputDef[] = [
  { sym: 'A', meaning: 'Camera face', accent: '#0ea5e9' },
  { sym: 'B', meaning: 'Voice match', accent: '#22d3ee' },
  { sym: 'C', meaning: 'Card scan',   accent: '#a78bfa' },
  { sym: 'D', meaning: 'PIN entered', accent: '#f59e0b' },
];
const Q4_INPUTS: InputDef[] = [
  { sym: 'A', meaning: 'Operator (irrelevant)', accent: '#475569' },
  { sym: 'B', meaning: 'Belt running',          accent: '#22d3ee' },
  { sym: 'C', meaning: 'Box on belt',           accent: '#a78bfa' },
  { sym: 'D', meaning: 'QA passed',             accent: '#f59e0b' },
];

const PROBLEMS: ProblemConfig[] = [
  // Q1 - Coffee Machine
  {
    id: 'q1',
    Icon: Coffee,
    title: 'Smart Coffee Machine',
    difficulty: 'Easy',
    scenario: {
      accent: '#22c55e',
      headline: 'When does the pump turn on?',
      story: 'A coffee machine has 3 sensors: a cup, a button, and an auto-clean switch. The pump should run in two cases - when someone is making coffee (cup is there AND button is pressed), OR when auto-clean is running and no button is pressed.',
      rule: 'Pump = 1 when (Cup AND Button) OR when (NO Button AND Auto-clean).',
    },
    inputs: Q1_INPUTS,
    output: { sym: 'F', meaning: 'Pump on' },
    vars: 3,
    active: [1, 5, 6, 7],
    groups: [
      { cells: [1, 5], color: '#22d3ee', term: "B′C", label: "{m1, m5} · column BC=01" },
      { cells: [6, 7], color: '#fb923c', term: 'AB',   label: '{m6, m7} · row A=1, BC=11..10' },
    ],
    loopExplanations: [
      { color: '#22d3ee', cells: '{m1, m5}',  analysis: ['A changes 0→1 → DROP', 'B stays 0 → KEEP B′', 'C stays 1 → KEEP C'], result: 'B′C' },
      { color: '#fb923c', cells: '{m6, m7}',  analysis: ['A stays 1 → KEEP A', 'B stays 1 → KEEP B', 'C changes 1→0 → DROP'], result: 'AB' },
    ],
    canonicalSOP: "F = A′B′C + AB′C + ABC′ + ABC",
    minimisedSOP: 'F = AB + B′C',
    hardware: { not: 1, and: '2 × (2-input)', or: '1 × (2-input)', total: 4 },
    questions: [
      { q: 'How many input combinations turn the pump ON?',                    answer: '4 combinations · m1, m5, m6, m7.' },
      { q: 'Write the long equation - one AND term for each ON row.',          answer: "F = A′B′C + AB′C + ABC′ + ABC · 4 terms · 12 letters total." },
      { q: 'Use the K-Map to find the shortest equation.',                     answer: 'F = AB + B′C · only 2 terms · only 4 letters.' },
      { q: 'How many gates does the smaller circuit need?',                    answer: '4 gates · 1 NOT (for B′), 2 ANDs, 1 OR.' },
    ],
    circuit: {
      topic: 'Sum-of-Products · F = AB + B′C',
      inputs: Q1_INPUTS,
      terms: [
        term([lit('A'), lit('B')], '#fb923c'),
        term([not('B'), lit('C')], '#22d3ee'),
      ],
    },
  },

  // Q2 - Drone
  {
    id: 'q2',
    Icon: Plane,
    title: 'Drone Autopilot Arming',
    difficulty: 'Medium',
    scenario: {
      accent: '#fbbf24',
      headline: 'When do the motors arm?',
      story: 'A drone has two flight modes. Manual mode: no GPS yet, so the pilot uses the stick. Auto mode: GPS is locked, so the autopilot takes over. The motors should turn on in either of those modes.',
      rule: 'Motors = 1 when (NO GPS AND stick) OR when (GPS AND autopilot).',
    },
    inputs: Q2_INPUTS,
    output: { sym: 'F', meaning: 'Motors armed' },
    vars: 3,
    active: [2, 3, 5, 7],
    groups: [
      { cells: [2, 3], color: '#22d3ee', term: "A′B", label: "{m2, m3} · row A=0, BC=11..10" },
      { cells: [5, 7], color: '#fb923c', term: 'AC',  label: '{m5, m7} · row A=1, BC=01..11' },
    ],
    loopExplanations: [
      { color: '#22d3ee', cells: '{m2, m3}', analysis: ['A stays 0 → KEEP A′', 'B stays 1 → KEEP B', 'C changes 0→1 → DROP'], result: 'A′B' },
      { color: '#fb923c', cells: '{m5, m7}', analysis: ['A stays 1 → KEEP A', 'B changes 0→1 → DROP', 'C stays 1 → KEEP C'], result: 'AC' },
    ],
    canonicalSOP: "F = A′BC′ + A′BC + AB′C + ABC",
    minimisedSOP: 'F = A′B + AC',
    hardware: { not: 1, and: '2 × (2-input)', or: '1 × (2-input)', total: 4 },
    questions: [
      { q: 'List the rows where the motors should turn ON.',                answer: 'Σm(2, 3, 5, 7) - m2, m3 are the manual rows; m5, m7 are the auto rows.' },
      { q: 'What is the shortest equation?',                                answer: 'F = A′B + AC' },
      { q: 'How does the K-Map get from 4 rows down to 2 terms?',           answer: 'Group {m2, m3} drops C → leaves A′B. Group {m5, m7} drops B → leaves AC. Two groups cover all 4 rows.' },
      { q: 'How many gates does the final circuit need?',                   answer: '4 gates · 1 NOT (for A′), 2 ANDs, 1 OR.' },
    ],
    circuit: {
      topic: 'Sum-of-Products · F = A′B + AC',
      inputs: Q2_INPUTS,
      terms: [
        term([not('A'), lit('B')], '#22d3ee'),
        term([lit('A'), lit('C')], '#fb923c'),
      ],
    },
  },

  // Q3 - XOR Lock
  {
    id: 'q3',
    Icon: Lock,
    title: 'Mismatch-Alert Vault Lock',
    difficulty: 'Medium',
    scenario: {
      accent: '#a78bfa',
      headline: 'When does the tamper alarm fire?',
      story: 'A vault has 4 sensors: camera (A), voice (B), card (C), PIN (D). The alarm should fire when EXACTLY ONE of voice or PIN matches - that usually means someone is faking. The camera and card are also wired in but might not matter.',
      rule: 'Alarm = 1 when EXACTLY ONE of voice or PIN is on (not both, not neither).',
    },
    inputs: Q3_INPUTS,
    output: { sym: 'F', meaning: 'Tamper alarm' },
    vars: 4,
    active: [1, 3, 4, 6, 9, 11, 12, 14],
    groups: [
      { cells: [1, 3, 9, 11],  color: '#22d3ee', term: "B′D",  label: 'Cols CD=01,11 across AB=00 & AB=10' },
      { cells: [4, 6, 12, 14], color: '#fb923c', term: 'BD′', label: 'Cols CD=00,10 across AB=01 & AB=11' },
    ],
    loopExplanations: [
      { color: '#22d3ee', cells: '{m1, m3, m9, m11}',  analysis: ['A changes → DROP', 'B stays 0 → KEEP B′', 'C changes → DROP', 'D stays 1 → KEEP D'], result: 'B′D' },
      { color: '#fb923c', cells: '{m4, m6, m12, m14}', analysis: ['A changes → DROP', 'B stays 1 → KEEP B', 'C changes → DROP', 'D stays 0 → KEEP D′'], result: 'BD′' },
    ],
    canonicalSOP: 'F = 8 product terms × 4 literals = 32 literals',
    minimisedSOP: 'F = B′D + BD′  ≡  B ⊕ D',
    hardware: { not: 2, and: '2 × (2-input)', or: '1 × (2-input)', total: 5 },
    questions: [
      { q: 'Which 2 of the 4 inputs actually change the answer?',           answer: 'Only B and D matter · A and C drop out. The K-Map shows they change inside every group → they get cancelled.' },
      { q: 'What is the shortest equation?',                                 answer: 'F = B′D + BD′ - this is the XOR of B and D.' },
      { q: 'How many gates does the final circuit need?',                   answer: '5 gates · 2 NOTs, 2 ANDs, 1 OR · or just 1 XOR chip if you have one.' },
      { q: 'If you had a single XOR chip, could you replace this whole circuit with one part?', answer: 'Yes - one XOR chip = 5 small gates here. Same logic, smaller circuit board.' },
    ],
    circuit: {
      topic: 'XOR · F = B′D + BD′  ≡  B ⊕ D  (A & C unused)',
      inputs: Q3_INPUTS,
      terms: [
        term([not('B'), lit('D')], '#22d3ee'),
        term([lit('B'), not('D')], '#fb923c'),
      ],
    },
    redundantNote: 'A and C do NOT show up in the final circuit - they don\'t change the alarm at all.',
  },

  // Q4 - Conveyor
  {
    id: 'q4',
    Icon: PackageCheck,
    title: 'Factory Conveyor Safety Gate',
    difficulty: 'Harder',
    scenario: {
      accent: '#fb7185',
      headline: 'When is the belt safe to move?',
      story: 'A factory belt is safe to move in two cases: when it is OFF and there is NO box on it, OR when it is ON and a box just passed inspection. The operator sensor (A) is also wired in, but does it actually matter?',
      rule: 'Move = 1 when (Belt OFF AND no box) OR when (Belt ON AND inspection passed).',
    },
    inputs: Q4_INPUTS,
    output: { sym: 'F', meaning: 'Belt advance' },
    vars: 4,
    active: [0, 1, 5, 7, 8, 9, 13, 15],
    groups: [
      { cells: [0, 1, 8, 9],   color: '#22d3ee', term: "B′C′", label: 'Top + bottom edges, CD=00 & CD=01' },
      { cells: [5, 7, 13, 15], color: '#fb923c', term: 'BD',   label: 'Centre 2×2 block · AB=01,11 × CD=01,11' },
    ],
    loopExplanations: [
      { color: '#22d3ee', cells: '{m0, m1, m8, m9}',   analysis: ['A changes (wrap) → DROP', 'B stays 0 → KEEP B′', 'C stays 0 → KEEP C′', 'D changes → DROP'], result: 'B′C′' },
      { color: '#fb923c', cells: '{m5, m7, m13, m15}', analysis: ['A changes → DROP', 'B stays 1 → KEEP B', 'C changes → DROP', 'D stays 1 → KEEP D'], result: 'BD' },
    ],
    canonicalSOP: 'F = 8 minterms × 4 literals = 32 literals · 13 gates including 4-input ANDs and an 8-input OR',
    minimisedSOP: 'F = B′C′ + BD',
    hardware: { not: 1, and: '2 × (2-input)', or: '1 × (2-input)', total: 4 },
    questions: [
      { q: 'The operator sensor (A) is connected. Does it actually change the answer?',
        answer: 'No. A changes inside both groups → it gets dropped completely. The K-Map proves the operator sensor has zero effect.' },
      { q: 'How many letters does the long equation use vs. the shortest one?',
        answer: '32 letters in the long one · only 4 letters in the short one - that is 87% smaller.' },
      { q: 'Which K-Map groups beat the long form?',
        answer: 'Two 4-cell groups. Top + bottom edges wrap around to give B′C′. The centre 2×2 box gives BD.' },
      { q: 'How many gates does the final circuit need?',
        answer: '5 gates · 2 NOTs (for B′ and C′), 2 ANDs, 1 OR.' },
    ],
    circuit: {
      topic: 'SOP · F = B′C′ + BD  (operator sensor A is a dead wire)',
      inputs: Q4_INPUTS,
      terms: [
        term([not('B'), not('C')], '#22d3ee'),
        term([lit('B'), lit('D')], '#fb923c'),
      ],
    },
    redundantNote: 'A is irrelevant - it never even reaches a gate in the final circuit.',
  },
];

// =========================================================================
// ProblemCard - full problem UI
// =========================================================================
const PHASES = ['empty', 'plot', 'group'] as const;
type Phase = typeof PHASES[number];

const ProblemCard: React.FC<{ p: ProblemConfig; isDarkMode: boolean }> = ({ p, isDarkMode }) => {
  const [open, setOpen] = useState(false);
  const [stepIdx, setStepIdx] = useState(0);
  const [, setKmapPhase] = useState<Phase>('empty');

  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText   = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg    = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';
  const diffColor = p.difficulty === 'Easy' ? '#22c55e' : p.difficulty === 'Medium' ? '#fbbf24' : '#fb7185';

  // Solution steps
  const stepLabels = ['Minterms', 'K-Map', 'Groups', 'Minimise', 'Schematic'];

  const handleStepClick = (idx: number) => {
    setStepIdx(idx);
    if (idx === 1) setKmapPhase('plot');
    else if (idx === 2) setKmapPhase('group');
    else if (idx === 0) setKmapPhase('empty');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className={`p-7 rounded-3xl border ${cardBg}`}
    >
      {/* Scenario header */}
      <div className="flex items-start gap-4 mb-5 flex-wrap">
        <div
          className="w-14 h-14 rounded-2xl grid place-items-center shrink-0"
          style={{ background: `${p.scenario.accent}22`, border: `2px solid ${p.scenario.accent}55` }}
        >
          <p.Icon size={26} style={{ color: p.scenario.accent }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span
              className="px-2 py-0.5 rounded-md font-mono text-[10px] uppercase tracking-widest font-black"
              style={{ background: `${diffColor}22`, color: diffColor, border: `1px solid ${diffColor}55` }}
            >
              {p.difficulty}
            </span>
            <span className="font-mono text-[10px] uppercase tracking-widest opacity-60">
              {p.vars}-variable scenario
            </span>
            <span
              className="font-mono text-[10px] uppercase tracking-widest font-black px-2 py-0.5 rounded"
              style={{ background: '#a78bfa22', color: '#a78bfa', border: '1px solid #a78bfa55' }}
            >
              Topic · {p.circuit.topic.replace(/^[^·]+·\s*/, '')}
            </span>
          </div>
          <h3 className={`text-2xl font-black ${textColor}`}>{p.title}</h3>
          <p className={`text-sm ${subText} mt-2`}>{p.scenario.story}</p>
          <div
            className="mt-3 p-3 rounded-xl text-sm font-mono"
            style={{ background: `${p.scenario.accent}10`, border: `1px solid ${p.scenario.accent}55`, color: p.scenario.accent }}
          >
            ▸ {p.scenario.rule}
          </div>
        </div>
      </div>

      {/* Sub-questions */}
      <div className={`p-4 rounded-2xl border ${cardBg} mb-5`}>
        <div className="font-mono text-[10px] uppercase tracking-widest text-rose-400 mb-3">
          The challenge · {p.questions.length} sub-questions
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

      {/* Reveal toggle */}
      <button
        onClick={() => {
          setOpen(!open);
          if (!open) {
            setStepIdx(0);
            setKmapPhase('empty');
          }
        }}
        className="w-full px-5 py-3 rounded-xl border-2 border-rose-400/50 bg-rose-500/10 text-rose-300 font-mono text-sm uppercase tracking-widest font-black flex items-center justify-center gap-2 hover:bg-rose-500/20 transition-all"
      >
        {open ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        {open ? 'Hide solution' : 'Solve it · animated walkthrough'}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="space-y-5 pt-5 mt-5 border-t" style={{ borderColor: isDarkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }}>
              {/* Inputs + Output mapping (revealed) */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-2">
                {p.inputs.map((inp) => (
                  <div
                    key={inp.sym}
                    className="p-3 rounded-xl border-2 flex items-center gap-2"
                    style={{ borderColor: `${inp.accent}55`, background: `${inp.accent}10` }}
                  >
                    <div className="w-8 h-8 rounded-md grid place-items-center font-mono font-black"
                         style={{ background: `${inp.accent}30`, color: inp.accent }}>
                      {inp.sym}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={`text-xs font-bold ${textColor} truncate`}>{inp.meaning}</div>
                    </div>
                  </div>
                ))}
                <div
                  className="p-3 rounded-xl border-2 flex items-center gap-2"
                  style={{ borderColor: '#22c55e88', background: '#22c55e15' }}
                >
                  <div className="w-8 h-8 rounded-md grid place-items-center font-mono font-black"
                       style={{ background: '#22c55e30', color: '#22c55e' }}>
                    {p.output.sym}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`text-xs font-bold ${textColor} truncate`}>{p.output.meaning}</div>
                    <div className="text-[9px] font-mono uppercase tracking-widest text-emerald-400">Output</div>
                  </div>
                </div>
              </div>

              {/* Canonical teaser + active rows (revealed) */}
              <div className="grid lg:grid-cols-[1fr_1fr] gap-4">
                <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-black/30 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                  <div className="font-mono text-[10px] uppercase tracking-widest text-rose-300 mb-2">
                    Canonical SOP · brute-force build
                  </div>
                  <CanonicalCircuitHint minterms={p.active} vars={p.vars} />
                  <p className={`text-xs ${subText} mt-2 italic`}>
                    This is what you would build if you took the truth table literally.
                  </p>
                </div>
                <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-black/30 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                  <div className="font-mono text-[10px] uppercase tracking-widest text-amber-300 mb-2">
                    Active states · F = Σm(...)
                  </div>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {p.active.map((m) => (
                      <span key={m} className="px-2 py-0.5 rounded font-mono text-xs border border-emerald-400/40 bg-emerald-500/10 text-emerald-200">
                        m{m}
                      </span>
                    ))}
                  </div>
                  <div className={`font-mono text-xs ${textColor}`}>
                    F({p.inputs.map((i) => i.sym).join(',')}) = Σm({p.active.join(', ')})
                  </div>
                </div>
              </div>

              {/* Step navigator */}
              <div className="flex flex-wrap gap-2">
                {stepLabels.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => handleStepClick(i)}
                    className={`px-3 py-1.5 rounded-lg font-mono text-[10px] uppercase tracking-widest transition-all ${
                      i === stepIdx
                        ? 'bg-rose-400 text-black font-black'
                        : isDarkMode ? 'bg-black/30 text-slate-300 hover:bg-white/10' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {i + 1}. {s}
                  </button>
                ))}
              </div>

              {/* Step body */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={stepIdx}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className={`p-5 rounded-2xl ${isDarkMode ? 'bg-black/30' : 'bg-slate-50'}`}
                >
                  {stepIdx === 0 && (
                    <div className="space-y-3">
                      <div className="font-mono text-[10px] uppercase tracking-widest text-amber-300">
                        Step 1 · Each F=1 row → minterm
                      </div>
                      <div className="grid sm:grid-cols-2 gap-2 font-mono text-xs">
                        {p.active.map((m, i) => {
                          const bits = m.toString(2).padStart(p.vars, '0');
                          const term = bits.split('').map((b, j) => `${p.inputs[j].sym}${b === '0' ? "'" : ''}`).join('');
                          return (
                            <motion.div
                              key={m}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.06 }}
                              className={`flex items-center gap-3 p-2 rounded-lg ${isDarkMode ? 'bg-white/[0.03]' : 'bg-white'}`}
                            >
                              <span className="text-amber-300 font-black w-8">m{m}</span>
                              <span className={textColor}>{bits}</span>
                              <span className="text-amber-400">→</span>
                              <span className={`${textColor} font-bold`}>{term}</span>
                            </motion.div>
                          );
                        })}
                      </div>
                      <div className={`mt-3 p-3 rounded-xl border border-amber-400/40 bg-amber-500/10 font-mono text-xs ${textColor}`}>
                        Canonical SOP · {p.canonicalSOP}
                      </div>
                    </div>
                  )}

                  {stepIdx === 1 && (
                    <div className="space-y-3">
                      <div className="font-mono text-[10px] uppercase tracking-widest text-violet-300">
                        Step 2 · Plot all 1s on the K-Map (animated)
                      </div>
                      <p className={`text-xs ${subText}`}>
                        Each cell lights up in sequence. Watch how Gray-coding makes adjacencies visual.
                      </p>
                      <div className="overflow-x-auto">
                        <AnimatedKMap vars={p.vars} active={new Set(p.active)} groups={[]} phase="plot" isDarkMode={isDarkMode} />
                      </div>
                    </div>
                  )}

                  {stepIdx === 2 && (
                    <div className="space-y-4">
                      <div className="font-mono text-[10px] uppercase tracking-widest text-violet-300">
                        Step 3 · Loop adjacent 1s · two coloured groups
                      </div>
                      <div className="overflow-x-auto">
                        <AnimatedKMap vars={p.vars} active={new Set(p.active)} groups={p.groups} phase="group" isDarkMode={isDarkMode} />
                      </div>
                      <div className="grid md:grid-cols-2 gap-3">
                        {p.loopExplanations.map((le, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 + i * 0.15 }}
                            className="rounded-xl p-3 border-2"
                            style={{ borderColor: le.color, background: `${le.color}11` }}
                          >
                            <div className="font-mono text-[10px] uppercase tracking-widest mb-2" style={{ color: le.color }}>
                              {le.cells}
                            </div>
                            <ul className="space-y-1 font-mono text-[11px]">
                              {le.analysis.map((a, j) => (
                                <li key={j} className={subText}>{a}</li>
                              ))}
                            </ul>
                            <div className={`mt-2 pt-2 border-t ${isDarkMode ? 'border-white/10' : 'border-slate-300'} font-mono text-lg font-black ${textColor}`}>
                              ⇒ {le.result}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  {stepIdx === 3 && (
                    <div className="space-y-4 text-center">
                      <div className="font-mono text-[10px] uppercase tracking-widest text-emerald-300">
                        Step 4 · The minimised SOP
                      </div>
                      <div className={`font-mono text-sm ${subText} line-through opacity-50 break-all`}>
                        {p.canonicalSOP}
                      </div>
                      <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2, type: 'spring' }}
                        className="rounded-2xl p-6 border-2 border-emerald-400 bg-emerald-500/10 inline-block"
                      >
                        <div className={`font-mono text-2xl md:text-4xl font-black ${textColor}`}>
                          {p.minimisedSOP}
                        </div>
                      </motion.div>
                      {p.redundantNote && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 }}
                          className="p-3 rounded-xl border border-amber-400/40 bg-amber-500/10 text-left"
                        >
                          <div className="flex items-start gap-2">
                            <Lightbulb className="text-amber-300 mt-0.5 shrink-0" size={14} />
                            <p className={`text-xs ${subText}`}>
                              <strong className="text-amber-300">Insight:</strong> {p.redundantNote}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  )}

                  {stepIdx === 4 && (
                    <div className="space-y-4">
                      <div className="font-mono text-[10px] uppercase tracking-widest text-rose-300">
                        Step 5 · Live optimised schematic - toggle inputs
                      </div>
                      <LiveSchematic circuit={p.circuit} isDarkMode={isDarkMode} />
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Q&A reveal panel */}
              <div className={`p-5 rounded-2xl border-2 border-emerald-400/40 bg-emerald-500/5`}>
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
                        <span className="text-emerald-300 font-mono mr-2">Q{i + 1}.</span>
                        {qa.q}
                      </div>
                      <div className={`text-sm ${subText} mt-1 ml-7 font-mono`}>{qa.answer}</div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Hardware footprint */}
              <div className={`grid sm:grid-cols-4 gap-2`}>
                {[
                  { l: 'NOTs', v: p.hardware.not },
                  { l: 'ANDs', v: p.hardware.and },
                  { l: 'ORs',  v: p.hardware.or  },
                  { l: 'Total · gates', v: p.hardware.total, highlight: true },
                ].map((s) => (
                  <div
                    key={s.l}
                    className={`p-3 rounded-xl border ${
                      s.highlight ? 'border-emerald-400 bg-emerald-500/10' :
                      isDarkMode ? 'border-white/10 bg-white/[0.03]' : 'border-slate-200 bg-slate-50'
                    }`}
                  >
                    <div className={`font-mono text-[9px] uppercase tracking-widest ${s.highlight ? 'text-emerald-300' : subText}`}>{s.l}</div>
                    <div className={`text-sm font-mono font-black ${s.highlight ? 'text-emerald-300' : textColor}`}>{s.v}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// =========================================================================
// Main scene
// =========================================================================
export const S01_Forward: React.FC<Props> = ({ isActive, isDarkMode }) => {
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
          <Target size={14} /> Drill Set 01 · Forward Synthesis
        </div>
        <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>
          Story → Circuit. Four products to design from scratch.
        </h2>
        <p className={`text-base max-w-3xl ${subText}`}>
          You get a short story and the rows where the output is 1. Your job: build the smallest
          circuit that does it. Read the story, then click <strong className="text-rose-300">Solve it</strong> to
          walk through 5 animated steps: write down the minterms → plot them on the K-Map →
          group them → simplify → live circuit you can play with. Every schematic uses the same
          clean grid layout: <span className="text-rose-300 font-mono">rails on the left · NOTs inline · ANDs stacked · OR on the right · output box on the far right.</span>
        </p>
      </motion.section>

      <motion.div
        initial={{ opacity: 0, y: 14 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        className={`p-5 rounded-2xl border ${cardBg} flex items-start gap-3`}
      >
        <Lightbulb className="text-amber-300 mt-0.5 shrink-0" size={18} />
        <div className={`text-sm ${subText}`}>
          <strong className="text-amber-300">Strategy:</strong> always look for the LARGEST legal
          power-of-two rectangle first. A four-cell loop drops two variables; a two-cell loop
          drops only one. Overlapping loops are free - never split a loop just to avoid overlap.
        </div>
      </motion.div>

      <div><TryItYourself /></div>

      <div className="space-y-6">
        {PROBLEMS.map((p) => (
          <ProblemCard key={p.id} p={p} isDarkMode={isDarkMode} />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }} animate={isActive ? { opacity: 1 } : {}}
        transition={{ delay: 0.4 }}
        className={`text-center text-xs font-mono uppercase tracking-[0.3em] ${subText}`}
      >
        Drill Set 01 complete · onward to reverse engineering
      </motion.div>
    </div>
  );
};
