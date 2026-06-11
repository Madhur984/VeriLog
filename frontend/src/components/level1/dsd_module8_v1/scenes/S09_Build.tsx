import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Hammer, Crosshair, ClipboardList, ListChecks, Rocket, Trophy,
  MousePointerClick, ToggleLeft, Cpu, Lightbulb, Cable, Zap, ArrowRight, Merge,
} from 'lucide-react';

interface Props { isActive?: boolean; isDarkMode: boolean }

const VIOLET = '#a78bfa';
const AMBER = '#f59e0b';
const CYAN = '#22d3ee';
const EMERALD = '#34d399';

const PARTS = [
  { qty: '3 x', name: 'INPUT SWITCH', desc: 'feeds a 0 or a 1 - A, B, and the new arrival: Cin', Icon: ToggleLeft },
  { qty: '2 x', name: 'XOR GATE', desc: 'the sum chain: (A ⊕ B) first, then ⊕ Cin', Icon: Zap },
  { qty: '2 x', name: 'AND GATE', desc: 'the carry watchers: A·B and (A ⊕ B)·Cin', Icon: Cpu },
  { qty: '1 x', name: 'OR GATE', desc: 'merges the two partial carries into Cout', Icon: Merge },
  { qty: '2 x', name: 'OUTPUT LAMP', desc: 'lights up whenever its wire carries a 1', Icon: Lightbulb },
  { qty: '12 x', name: 'WIRE', desc: 'eight fan-out runs in, four runs between gates and lamps', Icon: Cable },
];

const STEPS = [
  { num: '01', title: 'Tour the bench', desc: 'Same bench as Module 07 - parts palette left, canvas center, properties right.' },
  { num: '02', title: 'Place THREE inputs', desc: 'Switches for A, B and Cin. The third switch is the whole upgrade.' },
  { num: '03', title: 'Build half adder 1', desc: 'One XOR + one AND fed by A and B - the block you already know by heart.' },
  { num: '04', title: 'Build half adder 2', desc: 'A second XOR + AND pair, fed by the first XOR\'s output and Cin.' },
  { num: '05', title: 'Merge the carries', desc: 'Run both AND outputs into the OR gate. Wire the lamps: XOR2 → S, OR → Cout.' },
  { num: '06', title: 'Prove all 8 rows', desc: 'Step through every input combination and match the full truth table.' },
];

const TRUTH_ROWS = [
  { a: 0, b: 0, cin: 0, s: 0, c: 0 },
  { a: 0, b: 0, cin: 1, s: 1, c: 0 },
  { a: 0, b: 1, cin: 0, s: 1, c: 0 },
  { a: 0, b: 1, cin: 1, s: 0, c: 1 },
  { a: 1, b: 0, cin: 0, s: 1, c: 0 },
  { a: 1, b: 0, cin: 1, s: 0, c: 1 },
  { a: 1, b: 1, cin: 0, s: 0, c: 1 },
  { a: 1, b: 1, cin: 1, s: 1, c: 1 },
];

// Executive synthesis - the deck's closing slide, compressed.
const SYNTHESIS = [
  {
    title: 'The Interface',
    color: CYAN,
    body: 'Consolidates three multi-stage inputs (A, B, Cin) into two highly defined arithmetic outputs (S, Cout).',
  },
  {
    title: 'The Logic',
    color: AMBER,
    body: 'Governed by modulo-2 XOR mechanics for the Sum, and majority AND/OR logic for the Carry-out: S = A ⊕ B ⊕ Cin · Cout = AB + ACin + BCin.',
  },
  {
    title: 'The Architecture',
    color: VIOLET,
    body: 'Physically synthesized via dual cascading half adders unified by a terminal OR gate - trusted blocks, reused.',
  },
];

export const S09_Build: React.FC<Props> = ({ isDarkMode }) => {
  const navigate = useNavigate();

  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';
  const idle = isDarkMode ? '#475569' : '#cbd5e1';
  const boxFill = isDarkMode ? '#0a0e1a' : '#ffffff';

  // Live preview of the target circuit
  const [a, setA] = useState(false);
  const [b, setB] = useState(false);
  const [cin, setCin] = useState(false);
  const p = a !== b;
  const c1 = a && b;
  const sum = p !== cin;
  const c2 = p && cin;
  const cout = c1 || c2;

  const wire = (on: boolean) => (on ? AMBER : idle);
  const glow = (on: boolean) => (on ? `drop-shadow(0 0 5px ${AMBER})` : 'none');

  const inputToggle = (label: string, on: boolean, flip: () => void) => (
    <button
      key={label}
      onClick={flip}
      className="px-5 py-3 rounded-xl border-2 font-mono font-black transition-all flex flex-col items-start gap-0.5 min-w-[104px] active:scale-95"
      style={{
        borderColor: AMBER,
        color: on ? '#000' : AMBER,
        backgroundColor: on ? AMBER : 'transparent',
        boxShadow: on ? `0 0 25px ${AMBER}55` : 'none',
      }}
    >
      <span className="text-[10px] uppercase tracking-widest opacity-80">Input {label}</span>
      <span className="text-lg">{label} = {on ? 1 : 0}</span>
    </button>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-12 py-4">
      {/* ── mission header ── */}
      <section className="space-y-3">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="px-3 py-1 rounded-full border font-mono text-[10px] font-black tracking-widest"
                style={{ borderColor: `${AMBER}55`, background: `${AMBER}10`, color: AMBER }}>
            FINAL MISSION
          </span>
          <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.4em] uppercase" style={{ color: VIOLET }}>
            <Hammer size={14} /> Chapter 10 · Build It For Real
          </div>
        </div>
        <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>
          Leave the classroom. Hit the bench.
        </h2>
        <p className={`text-base max-w-3xl ${subText}`}>
          You traced both formulas and watched two half adders cascade into a whole. Now you
          will wire an actual full adder in the live circuit simulator - with a step-by-step
          tutorial rail pinned beside the canvas, just like the half adder build - and prove
          all eight rows on real, simulated hardware.
        </p>
      </section>

      {/* ── the target + parts list ── */}
      <div className="grid lg:grid-cols-5 gap-6 items-stretch">
        {/* target schematic */}
        <motion.div
          initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
          className={`lg:col-span-3 p-6 md:p-8 rounded-3xl border ${cardBg} flex flex-col gap-4`}
        >
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest" style={{ color: VIOLET }}>
              <Crosshair size={13} /> The Target
            </div>
            <span className="px-3 py-1 rounded-full border font-mono text-[10px] font-black tracking-widest"
                  style={{ borderColor: `${VIOLET}55`, color: VIOLET, background: `${VIOLET}10` }}>
              WHAT YOU WILL BUILD
            </span>
          </div>

          <svg viewBox="0 0 500 270" className="w-full h-auto">
            {/* input A */}
            <rect x="12" y="30" width="46" height="38" rx="9" fill={boxFill} stroke={AMBER} strokeWidth="2.5"
                  style={{ filter: a ? `drop-shadow(0 0 8px ${AMBER}66)` : 'none' }} />
            <text x="35" y="44" textAnchor="middle" fontSize="8" fontFamily="monospace" fill={AMBER}>A</text>
            <text x="35" y="60" textAnchor="middle" fontSize="13" fontFamily="monospace" fontWeight="bold" fill={AMBER}>{a ? 1 : 0}</text>
            {/* input B */}
            <rect x="12" y="86" width="46" height="38" rx="9" fill={boxFill} stroke={AMBER} strokeWidth="2.5"
                  style={{ filter: b ? `drop-shadow(0 0 8px ${AMBER}66)` : 'none' }} />
            <text x="35" y="100" textAnchor="middle" fontSize="8" fontFamily="monospace" fill={AMBER}>B</text>
            <text x="35" y="116" textAnchor="middle" fontSize="13" fontFamily="monospace" fontWeight="bold" fill={AMBER}>{b ? 1 : 0}</text>
            {/* input Cin */}
            <rect x="12" y="196" width="46" height="38" rx="9" fill={boxFill} stroke={EMERALD} strokeWidth="2.5"
                  style={{ filter: cin ? `drop-shadow(0 0 8px ${EMERALD}66)` : 'none' }} />
            <text x="35" y="210" textAnchor="middle" fontSize="8" fontFamily="monospace" fill={EMERALD}>Cin</text>
            <text x="35" y="226" textAnchor="middle" fontSize="13" fontFamily="monospace" fontWeight="bold" fill={EMERALD}>{cin ? 1 : 0}</text>

            {/* A,B fan-out into XOR1 + AND1 */}
            <line x1="58" y1="49" x2="106" y2="42" stroke={wire(a)} strokeWidth="2.5" style={{ filter: glow(a) }} />
            <polyline points="58,49 80,49 80,84 106,84" fill="none" stroke={wire(a)} strokeWidth="2.5" style={{ filter: glow(a) }} />
            <line x1="58" y1="105" x2="106" y2="56" stroke={wire(b)} strokeWidth="2.5" style={{ filter: glow(b) }} />
            <polyline points="58,105 90,105 90,98 106,98" fill="none" stroke={wire(b)} strokeWidth="2.5" style={{ filter: glow(b) }} />

            {/* XOR1 */}
            <path d="M 100 32 Q 110 49 100 66 Q 124 66 140 49 Q 124 32 100 32 Z" fill={boxFill} stroke={CYAN} strokeWidth="2.5" />
            <path d="M 94 32 Q 104 49 94 66" fill="none" stroke={CYAN} strokeWidth="2.5" />
            <text x="118" y="24" textAnchor="middle" fontSize="9" fontFamily="monospace" fontWeight="bold" fill={CYAN}>XOR1</text>
            {/* AND1 */}
            <path d="M 106 76 L 106 106 L 118 106 Q 140 106 140 91 Q 140 76 118 76 Z" fill={boxFill} stroke={CYAN} strokeWidth="2.5" />
            <text x="122" y="122" textAnchor="middle" fontSize="9" fontFamily="monospace" fontWeight="bold" fill={CYAN}>AND1</text>

            {/* P fan-out into XOR2 + AND2 */}
            <polyline points="140,49 188,49 188,160 216,160" fill="none" stroke={wire(p)} strokeWidth="2.5" style={{ filter: glow(p) }} />
            <line x1="188" y1="160" x2="188" y2="202" stroke={wire(p)} strokeWidth="2.5" style={{ filter: glow(p) }} />
            <line x1="188" y1="202" x2="216" y2="202" stroke={wire(p)} strokeWidth="2.5" style={{ filter: glow(p) }} />
            <text x="196" y="142" fontSize="8" fontFamily="monospace" fill={p ? AMBER : idle}>P={p ? 1 : 0}</text>
            {/* Cin fan-out into XOR2 + AND2 */}
            <polyline points="58,215 204,215 204,174 216,174" fill="none" stroke={wire(cin)} strokeWidth="2.5" style={{ filter: glow(cin) }} />
            <line x1="204" y1="215" x2="216" y2="215" stroke={wire(cin)} strokeWidth="2.5" style={{ filter: glow(cin) }} />

            {/* XOR2 */}
            <path d="M 210 150 Q 220 167 210 184 Q 234 184 250 167 Q 234 150 210 150 Z" fill={boxFill} stroke={VIOLET} strokeWidth="2.5" />
            <path d="M 204 150 Q 214 167 204 184" fill="none" stroke={VIOLET} strokeWidth="2.5" />
            <text x="228" y="142" textAnchor="middle" fontSize="9" fontFamily="monospace" fontWeight="bold" fill={VIOLET}>XOR2</text>
            {/* AND2 */}
            <path d="M 216 194 L 216 224 L 228 224 Q 250 224 250 209 Q 250 194 228 194 Z" fill={boxFill} stroke={VIOLET} strokeWidth="2.5" />
            <text x="232" y="240" textAnchor="middle" fontSize="9" fontFamily="monospace" fontWeight="bold" fill={VIOLET}>AND2</text>

            {/* carries into OR */}
            <polyline points="140,91 330,91 330,118 346,118" fill="none" stroke={wire(c1)} strokeWidth="2.5" style={{ filter: glow(c1) }} />
            <text x="280" y="84" fontSize="8" fontFamily="monospace" fill={c1 ? AMBER : idle}>C1={c1 ? 1 : 0}</text>
            <polyline points="250,209 330,209 330,140 346,140" fill="none" stroke={wire(c2)} strokeWidth="2.5" style={{ filter: glow(c2) }} />
            <text x="280" y="202" fontSize="8" fontFamily="monospace" fill={c2 ? AMBER : idle}>C2={c2 ? 1 : 0}</text>

            {/* OR */}
            <path d="M 342 104 Q 352 129 342 154 Q 374 154 394 129 Q 374 104 342 104 Z" fill={boxFill} stroke={EMERALD} strokeWidth="2.5" />
            <text x="364" y="96" textAnchor="middle" fontSize="9" fontFamily="monospace" fontWeight="bold" fill={EMERALD}>OR</text>

            {/* outputs */}
            <line x1="250" y1="167" x2="430" y2="167" stroke={wire(sum)} strokeWidth="2.5" style={{ filter: glow(sum) }} />
            <circle cx="446" cy="167" r="14" fill={sum ? CYAN : 'none'} stroke={CYAN} strokeWidth="2.5"
                    style={{ filter: sum ? `drop-shadow(0 0 14px ${CYAN})` : 'none' }} />
            <text x="446" y="198" textAnchor="middle" fontSize="9" fontFamily="monospace" fill={CYAN}>S = {sum ? 1 : 0}</text>

            <line x1="394" y1="129" x2="430" y2="129" stroke={wire(cout)} strokeWidth="2.5" style={{ filter: glow(cout) }} />
            <circle cx="446" cy="129" r="14" fill={cout ? AMBER : 'none'} stroke={AMBER} strokeWidth="2.5"
                    style={{ filter: cout ? `drop-shadow(0 0 14px ${AMBER})` : 'none' }} />
            <text x="446" y="106" textAnchor="middle" fontSize="9" fontFamily="monospace" fill={AMBER}>Cout = {cout ? 1 : 0}</text>
          </svg>

          <div className={`flex items-center gap-2 text-xs font-mono ${subText}`}>
            <MousePointerClick size={12} /> Try it here first · {a ? 1 : 0} + {b ? 1 : 0} + {cin ? 1 : 0} ={' '}
            {(a ? 1 : 0) + (b ? 1 : 0) + (cin ? 1 : 0)} = {cout ? 1 : 0}{sum ? 1 : 0} in binary
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            {inputToggle('A', a, () => setA(v => !v))}
            {inputToggle('B', b, () => setB(v => !v))}
            {inputToggle('Cin', cin, () => setCin(v => !v))}
          </div>
          <p className={`text-sm ${subText} mt-auto`}>
            <strong style={{ color: VIOLET }}>This preview is canned.</strong> On the bench you will
            place every part and pull every wire yourself - and the circuit will simulate for real.
          </p>
        </motion.div>

        {/* parts list */}
        <motion.div
          initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className={`lg:col-span-2 p-6 md:p-8 rounded-3xl border ${cardBg} flex flex-col gap-4`}
        >
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest" style={{ color: VIOLET }}>
            <ClipboardList size={13} /> Parts List
          </div>
          <p className={`text-sm ${subText}`}>
            Everything in the kit. Exactly Module 07's kit plus one switch, one XOR, one AND
            and one OR - the price of the third input.
          </p>
          <div className="grid gap-2">
            {PARTS.map(({ qty, name, desc, Icon }) => (
              <div key={name}
                   className={`flex items-start gap-3 p-3 rounded-2xl border ${
                     isDarkMode ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-slate-50'
                   }`}>
                <span className="shrink-0 w-10 text-right font-mono text-sm font-black" style={{ color: AMBER }}>
                  {qty}
                </span>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 font-mono text-xs font-black tracking-widest" style={{ color: VIOLET }}>
                    <Icon size={13} className="shrink-0" /> {name}
                  </div>
                  <p className={`text-xs mt-0.5 ${subText}`}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
          <p className={`text-xs font-mono ${subText} mt-auto`}>
            12 wires = A, B fanning into HA1 (4) + P and Cin fanning into HA2 (4) + two carries
            into the OR (2) + two lamp runs (2).
          </p>
        </motion.div>
      </div>

      {/* ── mission steps ── */}
      <motion.section
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-4"
      >
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.4em] uppercase" style={{ color: VIOLET }}>
          <ListChecks size={14} /> Mission Steps
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {STEPS.map(({ num, title, desc }) => (
            <div key={num} className={`p-5 rounded-2xl border ${cardBg} flex flex-col gap-2`}>
              <span className="self-start px-2.5 py-1 rounded-lg border font-mono text-[10px] font-black tracking-widest"
                    style={{ borderColor: `${VIOLET}55`, color: VIOLET, background: `${VIOLET}10` }}>
                STEP {num}
              </span>
              <h4 className={`text-base font-black ${textColor}`}>{title}</h4>
              <p className={`text-sm ${subText}`}>{desc}</p>
            </div>
          ))}
        </div>
      </motion.section>

      {/* ── the big CTA ── */}
      <motion.section
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="p-8 md:p-10 rounded-3xl border-2 text-center space-y-4"
        style={{ borderColor: `${VIOLET}55`, background: `${VIOLET}10` }}
      >
        <Rocket size={28} className="mx-auto" style={{ color: VIOLET }} />
        <h3 className={`text-2xl md:text-3xl font-black ${textColor}`}>
          The bench is live. The parts are waiting.
        </h3>
        <div className="flex flex-col items-center gap-3">
          <button
            onClick={() => navigate('/workbench?tutorial=full-adder')}
            className="flex items-center gap-3 px-8 py-4 rounded-2xl font-mono font-black text-base uppercase tracking-widest transition-all active:scale-95 hover:brightness-110"
            style={{ background: VIOLET, color: '#0a0e1a', boxShadow: `0 0 40px ${VIOLET}66` }}
          >
            Start the guided build <ArrowRight size={18} />
          </button>
          <p className={`text-xs font-mono max-w-md ${subText}`}>
            The tutorial rail stays pinned beside the simulator the whole time, with an
            8-row checklist to prove your build. Nothing to install - the bench runs right
            in your browser.
          </p>
          <button
            onClick={() => navigate('/portal')}
            className={`text-xs font-mono underline underline-offset-4 transition-colors ${
              isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Back to portal
          </button>
        </div>
      </motion.section>

      {/* ── what success looks like ── */}
      <motion.section
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="space-y-4"
      >
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.4em] uppercase" style={{ color: EMERALD }}>
          <Trophy size={14} /> What Success Looks Like
        </div>
        <div className="p-6 md:p-8 rounded-3xl border-2 space-y-6" style={{ borderColor: `${EMERALD}55`, background: `${EMERALD}10` }}>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {TRUTH_ROWS.map(({ a: ra, b: rb, cin: rc, s, c }) => (
              <div key={`${ra}${rb}${rc}`}
                   className={`p-3 rounded-2xl border text-center ${
                     isDarkMode ? 'border-white/10 bg-black/30' : 'border-slate-200 bg-white'
                   }`}>
                <div className={`font-mono text-[13px] font-black ${textColor}`}>
                  {ra}+{rb}+{rc} {'->'} S={s} C={c}
                </div>
                <div className="font-mono text-[10px] uppercase tracking-widest mt-1" style={{ color: c ? AMBER : EMERALD }}>
                  {ra + rb + rc} = {c}{s}₂
                </div>
              </div>
            ))}
          </div>

          {/* the executive synthesis */}
          <div className="grid md:grid-cols-3 gap-3">
            {SYNTHESIS.map(({ title, color, body }) => (
              <div key={title}
                   className={`p-4 rounded-2xl border ${
                     isDarkMode ? 'border-white/10 bg-black/30' : 'border-slate-200 bg-white'
                   }`}>
                <div className="font-mono text-[10px] font-black uppercase tracking-widest mb-2" style={{ color }}>
                  {title}
                </div>
                <p className={`text-[13px] leading-relaxed ${subText}`}>{body}</p>
              </div>
            ))}
          </div>

          <p className={`text-sm font-bold italic text-center ${textColor}`}>
            "Connect the carry, and one-bit arithmetic becomes all arithmetic."
          </p>
        </div>
      </motion.section>
    </div>
  );
};
