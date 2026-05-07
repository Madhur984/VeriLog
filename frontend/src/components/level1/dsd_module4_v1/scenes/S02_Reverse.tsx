import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronRight, ChevronDown, CheckCircle2, MousePointerClick, Cpu, Droplets, Thermometer, Bell } from 'lucide-react';

interface Props { isActive: boolean; isDarkMode: boolean; }
type Bit = 0 | 1;

const wireColor = (v: Bit) => v === 1 ? '#fb7185' : '#475569';
const wireGlow = (v: Bit) => v === 1 ? 'drop-shadow(0 0 4px rgba(251,113,133,0.7))' : 'none';

interface InputDef { sym: string; meaning: string; accent: string; }

// ─────────────────────────────────────────────────────────────────────────
// R1 · Pipeline Voter — Majority function (3 ANDs feeding OR)
// Y = AB + BC + AC
// ─────────────────────────────────────────────────────────────────────────
const drawCircuitR1 = (a: Bit, b: Bit, c: Bit, isDark: boolean) => {
  const ab: Bit = (a && b) ? 1 : 0;
  const bc: Bit = (b && c) ? 1 : 0;
  const ac: Bit = (a && c) ? 1 : 0;
  const y: Bit = (ab || bc || ac) ? 1 : 0;
  const fill = isDark ? '#0a0e1a' : '#fff';
  return { y, render: (
    <g>
      <text x="14" y="40" fontSize="13" fontWeight="bold" fill="#0ea5e9" fontFamily="monospace">A = {a}</text>
      <text x="14" y="140" fontSize="13" fontWeight="bold" fill="#22d3ee" fontFamily="monospace">B = {b}</text>
      <text x="14" y="240" fontSize="13" fontWeight="bold" fill="#f59e0b" fontFamily="monospace">C = {c}</text>
      {/* A rail */}
      <line x1="40" y1="50" x2="40" y2="260" stroke={wireColor(a)} strokeWidth="2.5" style={{ filter: wireGlow(a) }} />
      {/* B rail */}
      <line x1="76" y1="50" x2="76" y2="260" stroke={wireColor(b)} strokeWidth="2.5" style={{ filter: wireGlow(b) }} />
      {/* C rail */}
      <line x1="112" y1="50" x2="112" y2="260" stroke={wireColor(c)} strokeWidth="2.5" style={{ filter: wireGlow(c) }} />

      {/* AND1: A·B */}
      <line x1="40" y1="80" x2="240" y2="65" stroke={wireColor(a)} strokeWidth="2" style={{ filter: wireGlow(a) }} />
      <line x1="76" y1="100" x2="240" y2="85" stroke={wireColor(b)} strokeWidth="2" style={{ filter: wireGlow(b) }} />
      <path d="M 240 55 L 270 55 A 22 22 0 0 1 270 95 L 240 95 Z" fill={fill} stroke="#fcd34d" strokeWidth="2" />
      <text x="247" y="80" fontSize="10" fill="#fcd34d" fontFamily="monospace">AND</text>
      <line x1="293" y1="75" x2="450" y2="100" stroke={wireColor(ab)} strokeWidth="2.5" style={{ filter: wireGlow(ab) }} />
      <text x="305" y="68" fontSize="10" fill="#fcd34d" fontFamily="monospace">P1=AB={ab}</text>

      {/* AND2: B·C */}
      <line x1="76" y1="160" x2="240" y2="160" stroke={wireColor(b)} strokeWidth="2" style={{ filter: wireGlow(b) }} />
      <line x1="112" y1="180" x2="240" y2="180" stroke={wireColor(c)} strokeWidth="2" style={{ filter: wireGlow(c) }} />
      <path d="M 240 150 L 270 150 A 22 22 0 0 1 270 190 L 240 190 Z" fill={fill} stroke="#fcd34d" strokeWidth="2" />
      <text x="247" y="175" fontSize="10" fill="#fcd34d" fontFamily="monospace">AND</text>
      <line x1="293" y1="170" x2="450" y2="160" stroke={wireColor(bc)} strokeWidth="2.5" style={{ filter: wireGlow(bc) }} />
      <text x="305" y="153" fontSize="10" fill="#fcd34d" fontFamily="monospace">P2=BC={bc}</text>

      {/* AND3: A·C */}
      <line x1="40" y1="220" x2="240" y2="225" stroke={wireColor(a)} strokeWidth="2" style={{ filter: wireGlow(a) }} />
      <line x1="112" y1="245" x2="240" y2="245" stroke={wireColor(c)} strokeWidth="2" style={{ filter: wireGlow(c) }} />
      <path d="M 240 215 L 270 215 A 22 22 0 0 1 270 255 L 240 255 Z" fill={fill} stroke="#fcd34d" strokeWidth="2" />
      <text x="247" y="240" fontSize="10" fill="#fcd34d" fontFamily="monospace">AND</text>
      <line x1="293" y1="235" x2="450" y2="220" stroke={wireColor(ac)} strokeWidth="2.5" style={{ filter: wireGlow(ac) }} />
      <text x="305" y="218" fontSize="10" fill="#fcd34d" fontFamily="monospace">P3=AC={ac}</text>

      {/* OR with 3 inputs */}
      <path d="M 450 90 Q 470 160 450 230 Q 540 215 575 160 Q 540 105 450 90 Z" fill={fill} stroke="#22c55e" strokeWidth="2.5" />
      <text x="470" y="166" fontSize="13" fill="#22c55e" fontFamily="monospace" fontWeight="bold">OR</text>

      {/* Output */}
      <line x1="575" y1="160" x2="690" y2="160" stroke={wireColor(y)} strokeWidth="3.5" style={{ filter: wireGlow(y) }} />
      <rect x="640" y="138" width="50" height="44" rx="6" fill={y ? '#fb7185' : 'none'} stroke="#fb7185" strokeWidth="2.5"
            style={{ filter: y ? 'drop-shadow(0 0 18px rgba(251,113,133,0.7))' : 'none' }} />
      <text x="650" y="166" fontSize="16" fill={y ? '#000' : '#fb7185'} fontFamily="monospace" fontWeight="bold">Y={y}</text>
    </g>
  )};
};

// ─────────────────────────────────────────────────────────────────────────
// R2 · Office Climate Control (4-var · two parallel ANDs)
// Y = A'C + BD
// ─────────────────────────────────────────────────────────────────────────
const drawCircuitR2 = (a: Bit, b: Bit, c: Bit, d: Bit, isDark: boolean) => {
  const an: Bit = (a === 0 ? 1 : 0) as Bit;
  const anc: Bit = (an && c) ? 1 : 0;
  const bd: Bit = (b && d) ? 1 : 0;
  const y: Bit = (anc || bd) ? 1 : 0;
  const fill = isDark ? '#0a0e1a' : '#fff';
  return { y, render: (
    <g>
      <text x="14" y="40" fontSize="13" fontWeight="bold" fill="#0ea5e9" fontFamily="monospace">A = {a}</text>
      <text x="14" y="105" fontSize="13" fontWeight="bold" fill="#22d3ee" fontFamily="monospace">B = {b}</text>
      <text x="14" y="170" fontSize="13" fontWeight="bold" fill="#a78bfa" fontFamily="monospace">C = {c}</text>
      <text x="14" y="240" fontSize="13" fontWeight="bold" fill="#f59e0b" fontFamily="monospace">D = {d}</text>
      {/* Rails */}
      <line x1="40" y1="50" x2="40" y2="260" stroke={wireColor(a)} strokeWidth="2.5" style={{ filter: wireGlow(a) }} />
      <line x1="76" y1="50" x2="76" y2="260" stroke={wireColor(b)} strokeWidth="2.5" style={{ filter: wireGlow(b) }} />
      <line x1="112" y1="50" x2="112" y2="260" stroke={wireColor(c)} strokeWidth="2.5" style={{ filter: wireGlow(c) }} />
      <line x1="148" y1="50" x2="148" y2="260" stroke={wireColor(d)} strokeWidth="2.5" style={{ filter: wireGlow(d) }} />

      {/* NOT(A) */}
      <line x1="40" y1="80" x2="170" y2="80" stroke={wireColor(a)} strokeWidth="2" style={{ filter: wireGlow(a) }} />
      <polygon points="170,68 200,80 170,92" fill={fill} stroke="#fb7185" strokeWidth="2" />
      <circle cx="204" cy="80" r="3" fill={fill} stroke="#fb7185" strokeWidth="2" />
      <line x1="208" y1="80" x2="270" y2="80" stroke={wireColor(an)} strokeWidth="2" style={{ filter: wireGlow(an) }} />
      <text x="220" y="74" fontSize="9" fill="#fcd34d" fontFamily="monospace">A′</text>

      {/* AND1: A'·C */}
      <line x1="112" y1="120" x2="270" y2="100" stroke={wireColor(c)} strokeWidth="2" style={{ filter: wireGlow(c) }} />
      <path d="M 270 70 L 300 70 A 22 22 0 0 1 300 110 L 270 110 Z" fill={fill} stroke="#fcd34d" strokeWidth="2" />
      <text x="277" y="95" fontSize="10" fill="#fcd34d" fontFamily="monospace">AND</text>
      <line x1="323" y1="90" x2="460" y2="110" stroke={wireColor(anc)} strokeWidth="2.5" style={{ filter: wireGlow(anc) }} />
      <text x="335" y="82" fontSize="10" fill="#fcd34d" fontFamily="monospace">P1=A′C={anc}</text>

      {/* AND2: B·D */}
      <line x1="76" y1="200" x2="270" y2="195" stroke={wireColor(b)} strokeWidth="2" style={{ filter: wireGlow(b) }} />
      <line x1="148" y1="220" x2="270" y2="215" stroke={wireColor(d)} strokeWidth="2" style={{ filter: wireGlow(d) }} />
      <path d="M 270 185 L 300 185 A 22 22 0 0 1 300 225 L 270 225 Z" fill={fill} stroke="#fcd34d" strokeWidth="2" />
      <text x="277" y="210" fontSize="10" fill="#fcd34d" fontFamily="monospace">AND</text>
      <line x1="323" y1="205" x2="460" y2="180" stroke={wireColor(bd)} strokeWidth="2.5" style={{ filter: wireGlow(bd) }} />
      <text x="340" y="200" fontSize="10" fill="#fcd34d" fontFamily="monospace">P2=BD={bd}</text>

      {/* OR */}
      <path d="M 460 100 Q 480 145 460 190 Q 535 178 565 145 Q 535 112 460 100 Z" fill={fill} stroke="#22c55e" strokeWidth="2.5" />
      <text x="478" y="151" fontSize="12" fill="#22c55e" fontFamily="monospace" fontWeight="bold">OR</text>

      {/* Output */}
      <line x1="565" y1="145" x2="690" y2="145" stroke={wireColor(y)} strokeWidth="3.5" style={{ filter: wireGlow(y) }} />
      <rect x="640" y="123" width="50" height="44" rx="6" fill={y ? '#fb7185' : 'none'} stroke="#fb7185" strokeWidth="2.5"
            style={{ filter: y ? 'drop-shadow(0 0 18px rgba(251,113,133,0.7))' : 'none' }} />
      <text x="650" y="151" fontSize="16" fill={y ? '#000' : '#fb7185'} fontFamily="monospace" fontWeight="bold">Y={y}</text>
    </g>
  )};
};

// ─────────────────────────────────────────────────────────────────────────
// R3 · Burglar Alarm (OR feeding AND with NOT)
// Y = (D + W) · M' = DM' + WM'
// ─────────────────────────────────────────────────────────────────────────
const drawCircuitR3 = (door: Bit, win: Bit, mot: Bit, isDark: boolean) => {
  const dw: Bit = (door || win) ? 1 : 0;
  const mn: Bit = (mot === 0 ? 1 : 0) as Bit;
  const y: Bit = (dw && mn) ? 1 : 0;
  const fill = isDark ? '#0a0e1a' : '#fff';
  return { y, render: (
    <g>
      <text x="10" y="40" fontSize="13" fontWeight="bold" fill="#0ea5e9" fontFamily="monospace">D = {door}</text>
      <text x="10" y="120" fontSize="13" fontWeight="bold" fill="#22d3ee" fontFamily="monospace">W = {win}</text>
      <text x="10" y="220" fontSize="13" fontWeight="bold" fill="#f59e0b" fontFamily="monospace">M = {mot}</text>
      {/* Rails */}
      <line x1="50" y1="50" x2="50" y2="240" stroke={wireColor(door)} strokeWidth="2.5" style={{ filter: wireGlow(door) }} />
      <line x1="86" y1="50" x2="86" y2="240" stroke={wireColor(win)} strokeWidth="2.5" style={{ filter: wireGlow(win) }} />
      <line x1="122" y1="50" x2="122" y2="240" stroke={wireColor(mot)} strokeWidth="2.5" style={{ filter: wireGlow(mot) }} />

      {/* OR(D, W) */}
      <line x1="50" y1="80" x2="220" y2="100" stroke={wireColor(door)} strokeWidth="2" style={{ filter: wireGlow(door) }} />
      <line x1="86" y1="150" x2="220" y2="140" stroke={wireColor(win)} strokeWidth="2" style={{ filter: wireGlow(win) }} />
      <path d="M 220 90 Q 235 120 220 150 Q 280 142 305 120 Q 280 98 220 90 Z" fill={fill} stroke="#22c55e" strokeWidth="2" />
      <text x="235" y="125" fontSize="11" fill="#22c55e" fontFamily="monospace" fontWeight="bold">OR</text>
      <line x1="305" y1="120" x2="430" y2="120" stroke={wireColor(dw)} strokeWidth="2.5" style={{ filter: wireGlow(dw) }} />
      <text x="320" y="112" fontSize="10" fill="#22c55e" fontFamily="monospace">P=(D+W)={dw}</text>

      {/* NOT(M) */}
      <line x1="122" y1="220" x2="350" y2="220" stroke={wireColor(mot)} strokeWidth="2" style={{ filter: wireGlow(mot) }} />
      <polygon points="350,208 380,220 350,232" fill={fill} stroke="#fb7185" strokeWidth="2" />
      <circle cx="384" cy="220" r="3" fill={fill} stroke="#fb7185" strokeWidth="2" />
      <line x1="388" y1="220" x2="430" y2="180" stroke={wireColor(mn)} strokeWidth="2" style={{ filter: wireGlow(mn) }} />
      <text x="358" y="247" fontSize="9" fill="#fb7185" fontFamily="monospace">NOT</text>
      <text x="395" y="200" fontSize="10" fill="#fcd34d" fontFamily="monospace">M′</text>

      {/* AND */}
      <path d="M 430 110 L 460 110 A 25 25 0 0 1 460 170 L 430 170 Z" fill={fill} stroke="#fcd34d" strokeWidth="2.5" />
      <text x="438" y="145" fontSize="11" fill="#fcd34d" fontFamily="monospace">AND</text>

      {/* Output */}
      <line x1="485" y1="140" x2="630" y2="140" stroke={wireColor(y)} strokeWidth="3.5" style={{ filter: wireGlow(y) }} />
      <rect x="580" y="118" width="60" height="44" rx="6" fill={y ? '#fb7185' : 'none'} stroke="#fb7185" strokeWidth="2.5"
            style={{ filter: y ? 'drop-shadow(0 0 18px rgba(251,113,133,0.7))' : 'none' }} />
      <text x="590" y="146" fontSize="16" fill={y ? '#000' : '#fb7185'} fontFamily="monospace" fontWeight="bold">Y={y}</text>
    </g>
  )};
};

// ─────────────────────────────────────────────────────────────────────────
// Reverse Problem definition + card
// ─────────────────────────────────────────────────────────────────────────
interface ReverseProblem {
  id: string;
  Icon: React.ComponentType<any>;
  title: string;
  scenario: string;
  inputs: InputDef[];
  vars: 3 | 4;
  // Render circuit and compute output
  drawCircuit: (vals: Bit[], isDark: boolean) => { y: Bit; render: React.ReactNode };
  // Truth table for all 2^n rows
  tt: { idx: number; bits: string; y: Bit }[];
  questions: { q: string; a: string }[];
  // Final answer
  unsimplified: string;
  simplified: string;
  insight: string;
}

const buildTT = (vars: 3 | 4, compute: (vals: Bit[]) => Bit) => {
  const rows: { idx: number; bits: string; y: Bit }[] = [];
  for (let i = 0; i < (1 << vars); i++) {
    const bits: Bit[] = [];
    for (let j = vars - 1; j >= 0; j--) bits.push(((i >> j) & 1) as Bit);
    rows.push({ idx: i, bits: bits.join(''), y: compute(bits) });
  }
  return rows;
};

const PROBLEMS: ReverseProblem[] = [
  {
    id: 'r1',
    Icon: Droplets,
    title: 'R1 · Pipeline Voter',
    scenario:
      'A water pipe has 3 pressure sensors (A, B, C). To avoid shutting down because of one bad sensor, the alarm should only fire when AT LEAST 2 of the 3 sensors agree. Look at the circuit below and check if it does the right thing.',
    inputs: [
      { sym: 'A', meaning: 'Sensor 1', accent: '#0ea5e9' },
      { sym: 'B', meaning: 'Sensor 2', accent: '#22d3ee' },
      { sym: 'C', meaning: 'Sensor 3', accent: '#f59e0b' },
    ],
    vars: 3,
    drawCircuit: (v, isDark) => drawCircuitR1(v[0], v[1], v[2], isDark),
    tt: buildTT(3, ([a, b, c]) => (((a && b) || (b && c) || (a && c)) ? 1 : 0) as Bit),
    questions: [
      { q: 'Look at each AND output, then the final OR. What is Y as a Boolean equation?',
        a: 'Y = AB + BC + AC · this is the "majority" function — at least 2 of 3 must be 1.' },
      { q: 'Toggle the inputs. How many of the 8 input combinations give Y = 1?',
        a: '4 combinations · m3 (011), m5 (101), m6 (110), m7 (111). Y = Σm(3, 5, 6, 7).' },
      { q: 'Can the K-Map make this any shorter?',
        a: 'No, this is already as short as it gets. Each pair makes a 2-cell group, and no 4-cell group exists. Classic case where you can\'t shrink it.' },
      { q: 'If a single chip did the whole job, what would you call it?',
        a: 'A "majority of 3" chip (also called a 2-of-3 voter). Some chip kits have one; if not, you build it from 3 ANDs + 1 OR like this.' },
    ],
    unsimplified: 'Y = AB + BC + AC',
    simplified: 'Y = AB + BC + AC  (already shortest · majority function)',
    insight: 'This is a case where the long form IS the shortest form. The K-Map only finds 2-cell groups — no 4-cell group is possible — so all three terms stay.',
  },
  {
    id: 'r2',
    Icon: Thermometer,
    title: 'R2 · Office Climate Override',
    scenario:
      'An office air system has 4 sensors: A (room is in use), B (after-hours mode), C (high CO₂), D (high humidity). The fan turns on under 2 conditions wired in the circuit below. What are they?',
    inputs: [
      { sym: 'A', meaning: 'Occupied',   accent: '#0ea5e9' },
      { sym: 'B', meaning: 'After-hours', accent: '#22d3ee' },
      { sym: 'C', meaning: 'CO₂ high',   accent: '#a78bfa' },
      { sym: 'D', meaning: 'Humidity',   accent: '#f59e0b' },
    ],
    vars: 4,
    drawCircuit: (v, isDark) => drawCircuitR2(v[0], v[1], v[2], v[3], isDark),
    tt: buildTT(4, ([a, b, c, d]) => ((((!a) && c) || (b && d)) ? 1 : 0) as Bit),
    questions: [
      { q: 'Trace the circuit. Write Y as the OR of two AND terms.',
        a: 'Y = A′C + BD · First term: CO₂ is high while the room is empty. Second term: after-hours AND high humidity.' },
      { q: 'How many input rows give Y = 1?',
        a: '6 rows · Σm(2, 3, 5, 7, 11, 15).' },
      { q: 'Is this circuit already as small as possible, or can the K-Map shrink it?',
        a: 'Already as small as possible. The 2 AND terms cover 6 rows with two 2-cell groups; no bigger group exists.' },
      { q: 'Say the equation in plain English.',
        a: '"Turn on the fan if the room is empty AND CO₂ is high, OR if it is after-hours AND humidity is high." Two separate triggers.' },
    ],
    unsimplified: 'Y = A′C + BD',
    simplified: 'Y = A′C + BD  (already shortest)',
    insight: 'Two independent triggers. A pairs with C in one branch, B pairs with D in the other. No overlap, so the OR gate just combines them.',
  },
  {
    id: 'r3',
    Icon: Bell,
    title: 'R3 · Burglar Alarm Logic',
    scenario:
      'A shop alarm has 3 inputs: D (door open), W (window open), M (staff moving inside — counts as approved). The alarm should ring ONLY when a door or window opens AND no staff is moving. Read the circuit below.',
    inputs: [
      { sym: 'D', meaning: 'Door',          accent: '#0ea5e9' },
      { sym: 'W', meaning: 'Window',        accent: '#22d3ee' },
      { sym: 'M', meaning: 'Auth. motion',  accent: '#f59e0b' },
    ],
    vars: 3,
    drawCircuit: (v, isDark) => drawCircuitR3(v[0], v[1], v[2], isDark),
    tt: buildTT(3, ([d, w, m]) => (((d || w) && (m === 0)) ? 1 : 0) as Bit),
    questions: [
      { q: 'Write Y in this form: (something) · (something else).',
        a: 'Y = (D + W) · M′ — "door or window open" AND "no staff moving".' },
      { q: 'Now write the same thing as a sum of ANDs.',
        a: 'Y = DM′ + WM′ — multiply the AND through the OR.' },
      { q: 'Which input rows make Y = 1?',
        a: 'Σm(2, 4, 6) · all rows where M = 0 AND at least one of D, W is 1.' },
      { q: 'If the rule changed to "ring if door OR window opens (ignore staff)", how many gates would you need?',
        a: 'Just 1 gate · a single OR. Removing the staff-check drops 2 gates (the NOT and the AND).' },
    ],
    unsimplified: 'Y = (D + W) · M′',
    simplified: 'Y = DM′ + WM′  (sum-of-ANDs form)',
    insight: 'The factored form (D+W)·M′ looks shorter on paper, but the sum-of-ANDs form maps directly onto AND-OR gates. Both are correct — pick the form that matches the gates you have.',
  },
];

// ─────────────────────────────────────────────────────────────────────────
// ProblemCard
// ─────────────────────────────────────────────────────────────────────────
const ReverseCard: React.FC<{ p: ReverseProblem; isDarkMode: boolean }> = ({ p, isDarkMode }) => {
  const [open, setOpen] = useState(false);
  const [vals, setVals] = useState<Bit[]>(() => Array(p.vars).fill(0) as Bit[]);

  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText   = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg    = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';

  const { y, render } = useMemo(() => p.drawCircuit(vals, isDarkMode), [p, vals, isDarkMode]);
  const setBit = (i: number, b: Bit) => {
    setVals((arr) => {
      const copy = arr.slice() as Bit[];
      copy[i] = b;
      return copy;
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className={`p-7 rounded-3xl border ${cardBg}`}
    >
      <div className="flex items-start gap-4 mb-5 flex-wrap">
        <div className="w-14 h-14 rounded-2xl grid place-items-center shrink-0 bg-cyan-500/20 border-2 border-cyan-400/55">
          <p.Icon size={26} className="text-cyan-300" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className={`text-2xl font-black ${textColor}`}>{p.title}</h3>
          <p className={`text-sm ${subText} mt-2`}>{p.scenario}</p>
        </div>
      </div>

      {/* Sub-questions */}
      <div className={`p-4 rounded-2xl border ${cardBg} mb-4`}>
        <div className="font-mono text-[10px] uppercase tracking-widest text-cyan-400 mb-3">
          Decode it · {p.questions.length} sub-questions
        </div>
        <ol className="space-y-1.5">
          {p.questions.map((qa, i) => (
            <li key={i} className={`text-sm ${subText} flex gap-2`}>
              <span className="font-mono text-cyan-300 font-black">{i + 1}.</span>
              <span>{qa.q}</span>
            </li>
          ))}
        </ol>
      </div>

      <button
        onClick={() => setOpen(!open)}
        className="w-full px-5 py-3 rounded-xl border-2 border-cyan-400/50 bg-cyan-500/10 text-cyan-300 font-mono text-sm uppercase tracking-widest font-black flex items-center justify-center gap-2 hover:bg-cyan-500/20 transition-all"
      >
        {open ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        {open ? 'Hide solution' : 'Reveal circuit + answers'}
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
              {/* Interactive circuit (revealed) */}
              <div className={`p-5 rounded-2xl border ${isDarkMode ? 'bg-black/30 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                <div className={`flex items-center gap-2 text-xs font-mono ${subText} mb-3`}>
                  <MousePointerClick size={12} /> The circuit · toggle inputs · trace the wires
                </div>
                <div className="flex gap-2 mb-4 flex-wrap">
                  {p.inputs.map((inp, i) => (
                    <button
                      key={inp.sym}
                      onClick={() => setBit(i, vals[i] === 1 ? 0 : 1)}
                      className="px-4 py-2 rounded-xl border-2 font-mono font-black transition-all flex flex-col items-start gap-0.5"
                      style={{
                        borderColor: inp.accent,
                        color: vals[i] ? '#000' : inp.accent,
                        backgroundColor: vals[i] ? inp.accent : 'transparent',
                        boxShadow: vals[i] ? `0 0 20px ${inp.accent}55` : 'none',
                      }}
                    >
                      <span className="text-[9px] uppercase tracking-widest opacity-80">{inp.meaning}</span>
                      <span className="text-sm">{inp.sym} = {vals[i]}</span>
                    </button>
                  ))}
                </div>
                <svg viewBox="0 0 720 280" className="w-full h-auto">{render}</svg>
                <div className={`mt-3 p-3 rounded-xl border ${y ? 'border-rose-400 bg-rose-500/10' : isDarkMode ? 'border-white/10 bg-white/[0.02]' : 'border-slate-200 bg-white'}`}>
                  <span className={`font-mono text-sm ${y ? 'text-rose-300 font-black' : textColor}`}>
                    Y = {y} {y ? '· active' : '· inactive'}
                  </span>
                </div>
              </div>

              {/* Truth table */}
              <div className={`p-5 rounded-2xl ${isDarkMode ? 'bg-black/30' : 'bg-slate-50'}`}>
                <div className="font-mono text-[10px] uppercase tracking-widest text-cyan-300 mb-3">
                  Truth table
                </div>
                <div className="overflow-x-auto">
                  <table className="font-mono text-xs">
                    <thead>
                      <tr>
                        <th className={`px-3 py-1 text-center ${subText}`}>#</th>
                        {p.inputs.map((inp) => (
                          <th key={inp.sym} className={`px-3 py-1 text-center`} style={{ color: inp.accent }}>{inp.sym}</th>
                        ))}
                        <th className="px-3 py-1 text-center text-rose-300 font-black">Y</th>
                      </tr>
                    </thead>
                    <tbody>
                      {p.tt.map((r, i) => (
                        <motion.tr
                          key={r.idx}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: i * 0.03 }}
                          className={r.y ? 'bg-rose-500/10' : ''}
                        >
                          <td className={`px-3 py-1 text-center ${subText}`}>m{r.idx}</td>
                          {r.bits.split('').map((b, j) => (
                            <td key={j} className={`px-3 py-1 text-center ${b === '1' ? textColor : 'opacity-40'}`}>{b}</td>
                          ))}
                          <td className={`px-3 py-1 text-center font-black ${r.y ? 'text-rose-300' : 'opacity-40'}`}>{r.y}</td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Q&A reveal */}
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
                        <span className="text-emerald-300 font-mono mr-2">Q{i + 1}.</span>{qa.q}
                      </div>
                      <div className={`text-sm ${subText} mt-1 ml-7 font-mono`}>{qa.a}</div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Final equation card */}
              <div className="grid sm:grid-cols-2 gap-3">
                <div className={`p-4 rounded-2xl border-2 border-amber-400/40 bg-amber-500/10`}>
                  <div className="font-mono text-[10px] uppercase tracking-widest text-amber-300 mb-2">From the circuit</div>
                  <div className={`font-mono text-base font-black ${textColor}`}>{p.unsimplified}</div>
                </div>
                <div className={`p-4 rounded-2xl border-2 border-emerald-400 bg-emerald-500/10`}>
                  <div className="font-mono text-[10px] uppercase tracking-widest text-emerald-300 mb-2">Final form</div>
                  <div className={`font-mono text-base font-black ${textColor}`}>{p.simplified}</div>
                </div>
              </div>

              <div className="rounded-2xl p-4 border border-violet-400/40 bg-violet-500/10">
                <div className="font-mono text-[10px] uppercase tracking-widest text-violet-300 mb-1">Insight</div>
                <p className={`text-sm ${subText}`}>{p.insight}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export const S02_Reverse: React.FC<Props> = ({ isActive, isDarkMode }) => {
  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText   = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg    = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';

  return (
    <div className="max-w-6xl mx-auto space-y-10 py-4">
      <motion.section
        initial={{ opacity: 0, y: 20 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        className="space-y-3"
      >
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.4em] uppercase text-cyan-400">
          <Search size={14} /> Drill Set 02 · Reverse Engineering
        </div>
        <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>
          Circuit → Equation. Read the schematic.
        </h2>
        <p className={`text-base max-w-3xl ${subText}`}>
          Each problem gives you a finished circuit. Click the inputs to flip them, watch the
          wires light up, trace what each gate outputs, and figure out the Boolean equation.
          Then check your answer against the truth table when you reveal the solution.
        </p>
      </motion.section>

      <motion.div
        initial={{ opacity: 0, y: 14 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        className={`p-5 rounded-2xl border ${cardBg} flex items-start gap-3`}
      >
        <Cpu className="text-cyan-300 mt-0.5 shrink-0" size={18} />
        <div className={`text-sm ${subText}`}>
          <strong className="text-cyan-300">How to attack:</strong> name each wire after every
          gate (P1, P2, …). Once you reach the OR, write Y as the sum of those AND terms.
          K-Map only helps if the circuit is in long form — many of these are already short.
        </div>
      </motion.div>

      <div className="space-y-6">
        {PROBLEMS.map((p) => (
          <ReverseCard key={p.id} p={p} isDarkMode={isDarkMode} />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }} animate={isActive ? { opacity: 1 } : {}}
        transition={{ delay: 0.4 }}
        className={`text-center text-xs font-mono uppercase tracking-[0.3em] ${subText}`}
      >
        Drill Set 02 complete · onward to K-Map minimisation drills
      </motion.div>
    </div>
  );
};
