import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Vote, MousePointerClick } from 'lucide-react';
import { TryItYourself } from '../../../ui/TryItYourself';

interface Props { isActive?: boolean; isDarkMode: boolean }

const AMBER = '#f59e0b';
const CYAN = '#22d3ee';
const EMERALD = '#34d399';
const ROSE = '#fb7185';

export const S04_Carry: React.FC<Props> = ({ isDarkMode }) => {
  const [a, setA] = useState(false);
  const [b, setB] = useState(false);
  const [cin, setCin] = useState(false);

  const ab = a && b;
  const acin = a && cin;
  const bcin = b && cin;
  const cout = ab || acin || bcin;
  const ones = (a ? 1 : 0) + (b ? 1 : 0) + (cin ? 1 : 0);

  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText   = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg    = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';
  const idle      = isDarkMode ? '#475569' : '#cbd5e1';
  const boxFill   = isDarkMode ? '#0a0e1a' : '#ffffff';

  const wc = (on: boolean) => (on ? AMBER : idle);
  const glow = (on: boolean) => (on ? `drop-shadow(0 0 5px ${AMBER})` : 'none');

  const toggle = (label: string, on: boolean, flip: () => void) => (
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
      <span className="text-[10px] uppercase tracking-widest opacity-80">input</span>
      <span className="text-lg">{label} = {on ? 1 : 0}</span>
    </button>
  );

  /** One AND gate of the majority circuit. */
  const andGate = (x: number, y: number, inTop: boolean, inBot: boolean, out: boolean, l1: string, l2: string) => (
    <g>
      <line x1={x - 44} y1={y + 8} x2={x} y2={y + 8} stroke={wc(inTop)} strokeWidth="2.5" style={{ filter: glow(inTop) }} />
      <line x1={x - 44} y1={y + 26} x2={x} y2={y + 26} stroke={wc(inBot)} strokeWidth="2.5" style={{ filter: glow(inBot) }} />
      <text x={x - 50} y={y + 12} textAnchor="end" fontSize="11" fontFamily="monospace" fontWeight="bold" fill={inTop ? AMBER : idle}>{l1}</text>
      <text x={x - 50} y={y + 30} textAnchor="end" fontSize="11" fontFamily="monospace" fontWeight="bold" fill={inBot ? AMBER : idle}>{l2}</text>
      <path d={`M ${x} ${y} L ${x} ${y + 34} L ${x + 16} ${y + 34} Q ${x + 38} ${y + 34} ${x + 38} ${y + 17} Q ${x + 38} ${y} ${x + 16} ${y} Z`}
            fill={boxFill} stroke={out ? AMBER : idle} strokeWidth="2.5"
            style={{ filter: out ? `drop-shadow(0 0 8px ${AMBER}66)` : 'none' }} />
    </g>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-12 py-4">
      {/* header */}
      <section className="space-y-3">
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.4em] uppercase text-amber-400">
          <Vote size={14} /> Chapter 05 · The Logic of Overflow
        </div>
        <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>
          The Carry: <span style={{ color: AMBER }}>Cout = AB + ACin + BCin</span>
        </h2>
        <p className={`text-base max-w-3xl ${subText}`}>
          The Carry-out evaluates to TRUE if <strong style={{ color: AMBER }}>any two - or all
          three - inputs are TRUE</strong>. It is the Boolean <em>majority function</em>: three
          AND gates each watch one pair of inputs, and an OR gate reports the moment any pair
          fires. Basic AND/OR logic, identifying calculation overflow.
        </p>
      </section>

      {/* interactive majority circuit */}
      <TryItYourself />
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                  className={`p-6 md:p-8 rounded-3xl border ${cardBg}`}>
        <div className={`flex items-center gap-2 text-xs font-mono mb-4 ${subText}`}>
          <MousePointerClick size={12} /> Click the inputs · any two active inputs out-vote the rest
        </div>

        <svg viewBox="0 0 470 250" className="w-full max-w-xl mx-auto h-auto">
          {/* three AND gates, one per pair */}
          {andGate(120, 22, a, b, ab, 'A', 'B')}
          {andGate(120, 104, a, cin, acin, 'A', 'Cin')}
          {andGate(120, 186, b, cin, bcin, 'B', 'Cin')}

          {/* wires from ANDs to OR */}
          <polyline points="158,39 220,39 220,103 252,103" fill="none" stroke={wc(ab)} strokeWidth="2.5" style={{ filter: glow(ab) }} />
          <line x1={158} y1={121} x2={252} y2={121} stroke={wc(acin)} strokeWidth="2.5" style={{ filter: glow(acin) }} />
          <polyline points="158,203 220,203 220,139 252,139" fill="none" stroke={wc(bcin)} strokeWidth="2.5" style={{ filter: glow(bcin) }} />

          {/* OR gate */}
          <path d="M 248 85 Q 262 121 248 157 Q 296 157 326 121 Q 296 85 248 85 Z"
                fill={boxFill} stroke={cout ? AMBER : idle} strokeWidth="2.5"
                style={{ filter: cout ? `drop-shadow(0 0 10px ${AMBER}88)` : 'none' }} />
          <text x={282} y={126} textAnchor="middle" fontSize="13" fontFamily="monospace" fontWeight="bold" fill={cout ? AMBER : idle}>OR</text>

          {/* output */}
          <line x1={326} y1={121} x2={392} y2={121} stroke={wc(cout)} strokeWidth="3" style={{ filter: glow(cout) }} />
          <circle cx={410} cy={121} r={15} fill={cout ? AMBER : 'none'} stroke={AMBER} strokeWidth="2.5"
                  style={{ filter: cout ? `drop-shadow(0 0 14px ${AMBER})` : 'none' }} />
          <text x={410} y={155} textAnchor="middle" fontSize="11" fontFamily="monospace" fontWeight="bold" fill={AMBER}>
            Cout = {cout ? 1 : 0}
          </text>

          {/* term labels */}
          <text x={178} y={28} fontSize="9" fontFamily="monospace" fill={ab ? AMBER : idle}>A·B = {ab ? 1 : 0}</text>
          <text x={178} y={112} fontSize="9" fontFamily="monospace" fill={acin ? AMBER : idle}>A·Cin = {acin ? 1 : 0}</text>
          <text x={178} y={232} fontSize="9" fontFamily="monospace" fill={bcin ? AMBER : idle}>B·Cin = {bcin ? 1 : 0}</text>
        </svg>

        <div className="flex items-center justify-center gap-3 flex-wrap mt-4">
          {toggle('A', a, () => setA(v => !v))}
          {toggle('B', b, () => setB(v => !v))}
          {toggle('Cin', cin, () => setCin(v => !v))}
        </div>

        {/* live verdict */}
        <div className={`mt-6 p-4 rounded-2xl border-2 text-center font-mono text-sm transition-all ${textColor}`}
             style={{ borderColor: cout ? `${AMBER}66` : `${idle}66`, background: cout ? `${AMBER}0d` : 'transparent' }}>
          {ones} of 3 inputs active → {ones >= 2 ? 'MAJORITY reached' : 'no majority'} →{' '}
          <strong style={{ color: cout ? AMBER : ROSE }}>Cout = {cout ? 1 : 0}</strong>
        </div>
      </motion.div>

      {/* why it works */}
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                  className="py-2">
        <div className="font-mono text-[10px] uppercase tracking-widest mb-4" style={{ color: EMERALD }}>
          Why "any two" is exactly right
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <p className={`text-sm leading-relaxed ${subText}`}>
            Two active inputs total <span className="font-mono font-bold" style={{ color: AMBER }}>2 = 10₂</span> -
            a full pair leaves the column as a carry, with sum digit 0. Three active inputs
            total <span className="font-mono font-bold" style={{ color: AMBER }}>3 = 11₂</span> -
            a pair still leaves as the carry, and the lone leftover 1 stays as the sum. Either
            way, <strong>two or more 1s force a carry</strong>; zero or one never can.
          </p>
          <p className={`text-sm leading-relaxed ${subText}`}>
            The circuit literally takes a vote. Each AND gate is one pair of voters agreeing;
            the OR gate passes any agreement through. That is why this expression is called
            the <strong style={{ color: EMERALD }}>majority function</strong> - the carry fires
            when the 1s outnumber the 0s, on exactly 4 of the 8 possible input rows.
          </p>
        </div>
      </motion.div>

      {/* fact cards */}
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
                  className="grid sm:grid-cols-3 gap-3">
        {[
          ['Three pairs, no more', 'Three inputs make exactly three possible pairs: AB, ACin, BCin. The formula has one product term per pair - nothing is missing, nothing is wasted.', AMBER],
          ['Overflow detector', 'Cout is the formal answer to one question: "did this column overflow?" The deck calls it identifying calculation overflow - the upgrade of Module 07\'s single AND gate.', ROSE],
          ['SOP form', 'AB + ACin + BCin is a sum-of-products expression - ANDs feeding an OR. It drops straight onto silicon exactly as written: three ANDs, one OR.', EMERALD],
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
