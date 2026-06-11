import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, MousePointerClick } from 'lucide-react';

interface Props { isActive?: boolean; isDarkMode: boolean }

const AMBER = '#f59e0b';
const CYAN = '#22d3ee';
const EMERALD = '#34d399';
const ROSE = '#fb7185';

const PARITY_STRIP = [
  { ones: 0, s: 0 },
  { ones: 1, s: 1 },
  { ones: 2, s: 0 },
  { ones: 3, s: 1 },
];

export const S03_Sum: React.FC<Props> = ({ isDarkMode }) => {
  const [a, setA] = useState(false);
  const [b, setB] = useState(false);
  const [cin, setCin] = useState(false);

  const ones = (a ? 1 : 0) + (b ? 1 : 0) + (cin ? 1 : 0);
  const s = ones % 2 === 1;

  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText   = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg    = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';
  const idle      = isDarkMode ? '#475569' : '#cbd5e1';
  const boxFill   = isDarkMode ? '#0a0e1a' : '#ffffff';

  const wire = (on: boolean) => (on ? CYAN : idle);
  const glow = (on: boolean) => (on ? `drop-shadow(0 0 5px ${CYAN})` : 'none');

  const toggle = (label: string, on: boolean, flip: () => void) => (
    <button
      key={label}
      onClick={flip}
      className="px-5 py-3 rounded-xl border-2 font-mono font-black transition-all flex flex-col items-start gap-0.5 min-w-[104px] active:scale-95"
      style={{
        borderColor: CYAN,
        color: on ? '#000' : CYAN,
        backgroundColor: on ? CYAN : 'transparent',
        boxShadow: on ? `0 0 25px ${CYAN}55` : 'none',
      }}
    >
      <span className="text-[10px] uppercase tracking-widest opacity-80">input</span>
      <span className="text-lg">{label} = {on ? 1 : 0}</span>
    </button>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-12 py-4">
      {/* header */}
      <section className="space-y-3">
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.4em] uppercase text-amber-400">
          <Zap size={14} /> Chapter 04 · The Logic of Addition
        </div>
        <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>
          The Sum: <span style={{ color: CYAN }}>S = A ⊕ B ⊕ Cin</span>
        </h2>
        <p className={`text-base max-w-3xl ${subText}`}>
          The Sum output is driven by strict modulo-2 addition. Evaluate the Boolean logic and
          one clean pattern falls out: <strong style={{ color: CYAN }}>the output is TRUE only
          when an ODD number of the three inputs are TRUE</strong>. One gate - a three-input
          XOR - captures the entire rule.
        </p>
      </section>

      {/* interactive 3-input XOR */}
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                  className={`p-6 md:p-8 rounded-3xl border ${cardBg}`}>
        <div className={`flex items-center gap-2 text-xs font-mono mb-4 ${subText}`}>
          <MousePointerClick size={12} /> Click the inputs · watch the odd-count rule run the wire
        </div>

        <svg viewBox="0 0 460 200" className="w-full max-w-xl mx-auto h-auto">
          {/* input wires */}
          <line x1={70} y1={60} x2={210} y2={60} stroke={wire(a)} strokeWidth="3" style={{ filter: glow(a) }} />
          <line x1={70} y1={100} x2={210} y2={100} stroke={wire(b)} strokeWidth="3" style={{ filter: glow(b) }} />
          <line x1={70} y1={140} x2={210} y2={140} stroke={wire(cin)} strokeWidth="3" style={{ filter: glow(cin) }} />
          <text x={60} y={64} textAnchor="end" fontSize="13" fontFamily="monospace" fontWeight="bold" fill={a ? CYAN : idle}>A</text>
          <text x={60} y={104} textAnchor="end" fontSize="13" fontFamily="monospace" fontWeight="bold" fill={b ? CYAN : idle}>B</text>
          <text x={60} y={144} textAnchor="end" fontSize="13" fontFamily="monospace" fontWeight="bold" fill={cin ? CYAN : idle}>Cin</text>

          {/* 3-input XOR gate */}
          <path d="M 204 40 Q 222 100 204 160" fill="none" stroke={CYAN} strokeWidth="2.5" />
          <path d="M 214 40 Q 232 100 214 160 Q 268 160 310 100 Q 268 40 214 40 Z"
                fill={boxFill} stroke={CYAN} strokeWidth="2.5"
                style={{ filter: s ? `drop-shadow(0 0 10px ${CYAN}88)` : 'none' }} />
          <text x={252} y={106} textAnchor="middle" fontSize="14" fontFamily="monospace" fontWeight="bold" fill={CYAN}>XOR</text>

          {/* output */}
          <line x1={310} y1={100} x2={380} y2={100} stroke={s ? AMBER : idle} strokeWidth="3"
                style={{ filter: s ? `drop-shadow(0 0 5px ${AMBER})` : 'none' }} />
          <circle cx={398} cy={100} r={15} fill={s ? AMBER : 'none'} stroke={AMBER} strokeWidth="2.5"
                  style={{ filter: s ? `drop-shadow(0 0 14px ${AMBER})` : 'none' }} />
          <text x={398} y={134} textAnchor="middle" fontSize="11" fontFamily="monospace" fontWeight="bold" fill={AMBER}>
            S = {s ? 1 : 0}
          </text>
        </svg>

        <div className="flex items-center justify-center gap-3 flex-wrap mt-4">
          {toggle('A', a, () => setA(v => !v))}
          {toggle('B', b, () => setB(v => !v))}
          {toggle('Cin', cin, () => setCin(v => !v))}
        </div>

        {/* live verdict */}
        <div className={`mt-6 p-4 rounded-2xl border-2 text-center font-mono text-sm transition-all ${textColor}`}
             style={{ borderColor: s ? `${CYAN}66` : `${idle}66`, background: s ? `${CYAN}0d` : 'transparent' }}>
          {ones} input{ones === 1 ? '' : 's'} active → {ones} is {ones % 2 === 1 ? 'ODD' : 'EVEN'} →{' '}
          <strong style={{ color: s ? CYAN : ROSE }}>S = {s ? 1 : 0}</strong>
          <span className="opacity-50"> · ({a ? 1 : 0} + {b ? 1 : 0} + {cin ? 1 : 0}) mod 2 = {ones % 2}</span>
        </div>
      </motion.div>

      {/* the parity strip */}
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                  className={`p-6 rounded-3xl border ${cardBg}`}>
        <div className="font-mono text-[10px] uppercase tracking-widest mb-4 text-center" style={{ color: AMBER }}>
          The whole rule in four cells · count the ones
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-2xl mx-auto">
          {PARITY_STRIP.map(({ ones: n, s: sv }) => (
            <div key={n}
                 className={`p-4 rounded-2xl border-2 text-center transition-all ${
                   n === ones ? '' : 'opacity-40'
                 }`}
                 style={{
                   borderColor: n === ones ? (sv ? CYAN : ROSE) : `${idle}44`,
                   background: n === ones ? (sv ? `${CYAN}0d` : `${ROSE}0d`) : 'transparent',
                 }}>
              <div className={`font-mono text-2xl font-black ${textColor}`}>{n}</div>
              <div className={`text-[10px] font-mono uppercase tracking-widest mt-1 ${subText}`}>
                one{n === 1 ? '' : 's'} active
              </div>
              <div className="font-mono text-sm font-black mt-2" style={{ color: sv ? CYAN : ROSE }}>
                S = {sv}
              </div>
            </div>
          ))}
        </div>
        <p className={`text-sm text-center max-w-2xl mx-auto mt-5 ${subText}`}>
          Zero or two active inputs: the sum digit is 0 (any pair makes a full 10 - the pair
          leaves through the carry instead). One or three: a lone 1 remains in this column.
          That alternating pattern <em>is</em> modulo-2 addition, and XOR is its gate.
        </p>
      </motion.div>

      {/* fact cards */}
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
                  className="grid sm:grid-cols-3 gap-3">
        {[
          ['Chained, not tripled', 'In practice A ⊕ B ⊕ Cin is built as two 2-input XORs in a row - (A ⊕ B) first, then ⊕ Cin. Same truth table, off-the-shelf gates.', CYAN],
          ['Order never matters', 'XOR is associative and commutative: swap any inputs and S is unchanged. 1+0+1 and 1+1+0 land on the same answer, as addition must.', EMERALD],
          ['It only counts', 'The Sum wire never asks WHICH inputs are high - only HOW MANY. That indifference is what makes one small gate enough.', AMBER],
        ].map(([title, body, color]) => (
          <div key={title as string} className={`p-5 rounded-2xl border ${cardBg}`}>
            <div className="font-mono text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: color as string }}>
              {title}
            </div>
            <p className={`text-sm leading-relaxed ${subText}`}>{body}</p>
          </div>
        ))}
      </motion.div>
    </div>
  );
};
