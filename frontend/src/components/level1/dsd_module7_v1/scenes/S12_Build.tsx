import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Hammer, Crosshair, ClipboardList, ListChecks, Rocket, Trophy,
  MousePointerClick, ToggleLeft, Cpu, Lightbulb, Cable, Zap, ArrowRight,
} from 'lucide-react';
import { TryItYourself } from '../../../ui/TryItYourself';

interface Props { isActive?: boolean; isDarkMode: boolean }

const VIOLET = '#a78bfa';
const AMBER = '#f59e0b';
const EMERALD = '#34d399';

const PARTS = [
  { qty: '2 x', name: 'INPUT SWITCH', desc: 'feeds a 0 or a 1 into the circuit - your chutes A and B', Icon: ToggleLeft },
  { qty: '1 x', name: 'XOR GATE', desc: 'computes the Sum wire, S = A ⊕ B - the bowl', Icon: Zap },
  { qty: '1 x', name: 'AND GATE', desc: 'computes the Carry wire, C = A · B - the overflow tray', Icon: Cpu },
  { qty: '2 x', name: 'OUTPUT LAMP', desc: 'lights up whenever its wire carries a 1', Icon: Lightbulb },
  { qty: '6 x', name: 'WIRE', desc: 'four fan-out runs in, one run out of each gate', Icon: Cable },
];

const STEPS = [
  { num: '01', title: 'Tour the bench', desc: 'A quick lap around the parts palette, the canvas, and the run controls.' },
  { num: '02', title: 'Place the inputs', desc: 'Drop two input switches onto the canvas: one for A, one for B.' },
  { num: '03', title: 'Place the gates', desc: 'One XOR for the Sum wire, one AND for the Carry wire.' },
  { num: '04', title: 'Place the outputs', desc: 'Two lamps so you can read Sum and Carry at a glance.' },
  { num: '05', title: 'Wire it up', desc: 'Fan A and B into BOTH gates, then run each gate to its own lamp.' },
  { num: '06', title: 'Prove it', desc: 'Step through all four input rows and match the truth table, overflow row included.' },
];

const TRUTH_ROWS = [
  { a: 0, b: 0, s: 0, c: 0, note: 'at rest' },
  { a: 0, b: 1, s: 1, c: 0, note: 'single item' },
  { a: 1, b: 0, s: 1, c: 0, note: 'symmetrical' },
  { a: 1, b: 1, s: 0, c: 1, note: 'the overflow' },
];

export const S12_Build: React.FC<Props> = ({ isDarkMode }) => {
  const navigate = useNavigate();

  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';
  const idle = isDarkMode ? '#475569' : '#cbd5e1';
  const boxFill = isDarkMode ? '#0a0e1a' : '#ffffff';
  const woodStroke = isDarkMode ? '#c4956c' : '#8b5e3c';
  const woodFill = isDarkMode ? '#5b3d2a33' : '#a9826033';

  // Live preview of the target circuit
  const [a, setA] = useState(false);
  const [b, setB] = useState(false);
  const sum = a !== b;
  const carry = a && b;

  const wire = (on: boolean) => (on ? AMBER : idle);
  const glow = (on: boolean) => (on ? `drop-shadow(0 0 5px ${AMBER})` : 'none');

  const inputToggle = (label: string, on: boolean, flip: () => void) => (
    <button
      onClick={flip}
      className="px-5 py-3 rounded-xl border-2 font-mono font-black transition-all flex flex-col items-start gap-0.5 min-w-[120px] active:scale-95"
      style={{
        borderColor: AMBER,
        color: on ? '#000' : AMBER,
        backgroundColor: on ? AMBER : 'transparent',
        boxShadow: on ? `0 0 25px ${AMBER}55` : 'none',
      }}
    >
      <span className="text-[10px] uppercase tracking-widest opacity-80">Chute {label}</span>
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
            <Hammer size={14} /> Chapter 11 · Build It For Real
          </div>
        </div>
        <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>
          Leave the classroom. Hit the bench.
        </h2>
        <p className={`text-base max-w-3xl ${subText}`}>
          You watched the marble overflow and traced the two gates that copy it in silicon. Now you
          will wire an actual half adder in the live circuit simulator and watch it compute - switch
          by switch, row by row.
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

          <svg viewBox="0 0 470 240" className="w-full h-auto">
            <defs>
              <radialGradient id="s12Marble" cx="35%" cy="30%" r="75%">
                <stop offset="0%" stopColor="#fcd34d" />
                <stop offset="45%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#b45309" />
              </radialGradient>
            </defs>

            {/* input A */}
            <rect x="16" y="52" width="52" height="46" rx="10" fill={boxFill} stroke={AMBER} strokeWidth="2.5"
                  style={{ filter: a ? `drop-shadow(0 0 8px ${AMBER}66)` : 'none' }} />
            <text x="42" y="68" textAnchor="middle" fontSize="9" fontFamily="monospace" fill={AMBER}>A</text>
            {a ? (
              <g>
                <circle cx="42" cy="82" r="9" fill="url(#s12Marble)" />
                <ellipse cx="39" cy="78.5" rx="3" ry="2" fill="#ffffff" opacity="0.55" />
              </g>
            ) : (
              <text x="42" y="87" textAnchor="middle" fontSize="14" fontFamily="monospace" fontWeight="bold" fill={AMBER}>0</text>
            )}

            {/* input B */}
            <rect x="16" y="162" width="52" height="46" rx="10" fill={boxFill} stroke={AMBER} strokeWidth="2.5"
                  style={{ filter: b ? `drop-shadow(0 0 8px ${AMBER}66)` : 'none' }} />
            <text x="42" y="178" textAnchor="middle" fontSize="9" fontFamily="monospace" fill={AMBER}>B</text>
            {b ? (
              <g>
                <circle cx="42" cy="192" r="9" fill="url(#s12Marble)" />
                <ellipse cx="39" cy="188.5" rx="3" ry="2" fill="#ffffff" opacity="0.55" />
              </g>
            ) : (
              <text x="42" y="197" textAnchor="middle" fontSize="14" fontFamily="monospace" fontWeight="bold" fill={AMBER}>0</text>
            )}

            {/* A fan-out: to XOR top and AND top */}
            <line x1="68" y1="75" x2="120" y2="75" stroke={wire(a)} strokeWidth="3" style={{ filter: glow(a) }} />
            <circle cx="120" cy="75" r="3.5" fill={wire(a)} />
            <polyline points="120,75 170,75 170,62 244,62" fill="none" stroke={wire(a)} strokeWidth="3" style={{ filter: glow(a) }} />
            <polyline points="120,75 140,75 140,172 252,172" fill="none" stroke={wire(a)} strokeWidth="3" style={{ filter: glow(a) }} />

            {/* B fan-out: to XOR bottom and AND bottom */}
            <line x1="68" y1="185" x2="120" y2="185" stroke={wire(b)} strokeWidth="3" style={{ filter: glow(b) }} />
            <circle cx="120" cy="185" r="3.5" fill={wire(b)} />
            <polyline points="120,185 160,185 160,88 244,88" fill="none" stroke={wire(b)} strokeWidth="3" style={{ filter: glow(b) }} />
            <polyline points="120,185 190,185 190,198 252,198" fill="none" stroke={wire(b)} strokeWidth="3" style={{ filter: glow(b) }} />

            {/* XOR gate · the Sum wire */}
            <text x="282" y="42" textAnchor="middle" fontSize="10" fontFamily="monospace" fontWeight="bold" fill={VIOLET}>XOR</text>
            <path d="M 244 52 Q 258 75 244 98" fill="none" stroke={VIOLET} strokeWidth="2.5" />
            <path d="M 252 52 Q 266 75 252 98 Q 288 98 316 75 Q 288 52 252 52 Z" fill={boxFill} stroke={VIOLET} strokeWidth="2.5" />
            <text x="280" y="116" textAnchor="middle" fontSize="9" fontFamily="monospace" fill={VIOLET} opacity="0.8">S = A ⊕ B</text>

            {/* AND gate · the Carry wire */}
            <text x="280" y="152" textAnchor="middle" fontSize="10" fontFamily="monospace" fontWeight="bold" fill={VIOLET}>AND</text>
            <path d="M 252 162 L 286 162 A 23 23 0 0 1 286 208 L 252 208 Z" fill={boxFill} stroke={VIOLET} strokeWidth="2.5" />
            <text x="280" y="226" textAnchor="middle" fontSize="9" fontFamily="monospace" fill={VIOLET} opacity="0.8">C = A · B</text>

            {/* outputs */}
            <line x1="316" y1="75" x2="397" y2="75" stroke={wire(sum)} strokeWidth="3" style={{ filter: glow(sum) }} />
            <circle cx="413" cy="75" r="15" fill={sum ? AMBER : 'none'} stroke={AMBER} strokeWidth="2.5"
                    style={{ filter: sum ? `drop-shadow(0 0 14px ${AMBER})` : 'none' }} />
            <text x="413" y="108" textAnchor="middle" fontSize="9" fontFamily="monospace" fill={AMBER} opacity="0.85">SUM = {sum ? 1 : 0}</text>

            <line x1="309" y1="185" x2="397" y2="185" stroke={wire(carry)} strokeWidth="3" style={{ filter: glow(carry) }} />
            <circle cx="413" cy="185" r="15" fill={carry ? AMBER : 'none'} stroke={AMBER} strokeWidth="2.5"
                    style={{ filter: carry ? `drop-shadow(0 0 14px ${AMBER})` : 'none' }} />
            <text x="413" y="218" textAnchor="middle" fontSize="9" fontFamily="monospace" fill={AMBER} opacity="0.85">CARRY = {carry ? 1 : 0}</text>
          </svg>

          <div className={`flex items-center gap-2 text-xs font-mono ${subText}`}>
            <MousePointerClick size={12} /> Try it here first · the same blueprint from Chapter 08, A and B fan out to BOTH gates
          </div>
          <div><TryItYourself /></div>
          <div className="flex items-center gap-3 flex-wrap">
            {inputToggle('A', a, () => setA(v => !v))}
            {inputToggle('B', b, () => setB(v => !v))}
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
            Everything in the kit. Nothing else is needed - a half adder really is this small.
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
            6 wires = A and B each fanning out to both gates (4) + one run from each gate to its lamp (2).
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
            onClick={() => navigate('/workbench?tutorial=half-adder')}
            className="flex items-center gap-3 px-8 py-4 rounded-2xl font-mono font-black text-base uppercase tracking-widest transition-all active:scale-95 hover:brightness-110"
            style={{ background: VIOLET, color: '#0a0e1a', boxShadow: `0 0 40px ${VIOLET}66` }}
          >
            Start the guided build <ArrowRight size={18} />
          </button>
          <p className={`text-xs font-mono max-w-md ${subText}`}>
            The tutorial rail stays pinned beside the simulator the whole time. Nothing to install -
            the bench runs right in your browser.
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
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {TRUTH_ROWS.map(({ a: ra, b: rb, s, c, note }) => (
              <div key={note}
                   className={`p-4 rounded-2xl border text-center ${
                     isDarkMode ? 'border-white/10 bg-black/30' : 'border-slate-200 bg-white'
                   }`}>
                <div className={`font-mono text-sm font-black ${textColor}`}>
                  {ra} + {rb} {'->'} S={s} C={c}
                </div>
                <div className="font-mono text-[10px] uppercase tracking-widest mt-1" style={{ color: c ? AMBER : EMERALD }}>
                  {note}
                </div>
              </div>
            ))}
          </div>

          {/* from box to chip */}
          <div className="flex flex-col md:flex-row items-center gap-6">
            <svg viewBox="0 0 460 110" className="w-full max-w-md h-auto shrink-0">
              <defs>
                <radialGradient id="s12MarbleEnd" cx="35%" cy="30%" r="75%">
                  <stop offset="0%" stopColor="#fcd34d" />
                  <stop offset="45%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#b45309" />
                </radialGradient>
              </defs>
              {/* the wooden box */}
              <path d="M 18 38 L 18 82 L 96 82 L 96 38" fill={woodFill} stroke={woodStroke} strokeWidth="2.5" />
              <line x1="12" y1="38" x2="34" y2="38" stroke={woodStroke} strokeWidth="3" />
              <line x1="80" y1="38" x2="102" y2="38" stroke={woodStroke} strokeWidth="3" />
              <circle cx="57" cy="68" r="10" fill="url(#s12MarbleEnd)" />
              <ellipse cx="53.5" cy="64" rx="3.5" ry="2.5" fill="#ffffff" opacity="0.55" />
              <text x="57" y="100" textAnchor="middle" fontSize="8" fontFamily="monospace" fill={woodStroke}>the box</text>

              <line x1="118" y1="60" x2="148" y2="60" stroke={idle} strokeWidth="2.5" />
              <polygon points="148,54 148,66 158,60" fill={idle} />

              {/* the HA block */}
              <rect x="172" y="34" width="80" height="52" rx="10" fill={boxFill} stroke={VIOLET} strokeWidth="2.5" />
              <text x="212" y="65" textAnchor="middle" fontSize="16" fontFamily="monospace" fontWeight="bold" fill={VIOLET}>HA</text>
              <line x1="160" y1="48" x2="172" y2="48" stroke={VIOLET} strokeWidth="2" />
              <line x1="160" y1="72" x2="172" y2="72" stroke={VIOLET} strokeWidth="2" />
              <line x1="252" y1="48" x2="264" y2="48" stroke={VIOLET} strokeWidth="2" />
              <line x1="252" y1="72" x2="264" y2="72" stroke={VIOLET} strokeWidth="2" />
              <text x="212" y="100" textAnchor="middle" fontSize="8" fontFamily="monospace" fill={VIOLET}>your build</text>

              <line x1="276" y1="60" x2="306" y2="60" stroke={idle} strokeWidth="2.5" />
              <polygon points="306,54 306,66 316,60" fill={idle} />

              {/* the processor */}
              <rect x="330" y="34" width="92" height="52" rx="10" fill={boxFill} stroke={EMERALD} strokeWidth="2.5" />
              <text x="376" y="65" textAnchor="middle" fontSize="13" fontFamily="monospace" fontWeight="bold" fill={EMERALD}>CPU</text>
              {[44, 56, 68, 76].map(y => (
                <g key={y}>
                  <line x1="320" y1={y} x2="330" y2={y} stroke={EMERALD} strokeWidth="2" />
                  <line x1="422" y1={y} x2="432" y2={y} stroke={EMERALD} strokeWidth="2" />
                </g>
              ))}
              <text x="376" y="100" textAnchor="middle" fontSize="8" fontFamily="monospace" fill={EMERALD}>billions of adders</text>
            </svg>
            <div className="space-y-2">
              <p className={`text-sm leading-relaxed ${subText}`}>
                When all four truth-table rows behave on the real circuit, you have reproduced the
                chip-grade adder - the same logic that runs in billions of processors inside every
                phone, laptop, and supercomputer on Earth.
              </p>
              <p className={`text-sm font-bold italic ${textColor}`}>
                "Complex computing is just a series of simple overflowing boxes."
              </p>
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  );
};
