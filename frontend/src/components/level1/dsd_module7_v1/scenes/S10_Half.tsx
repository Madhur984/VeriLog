import React from 'react';
import { motion } from 'framer-motion';
import { HelpCircle, Layers, Cpu } from 'lucide-react';

interface Props { isActive?: boolean; isDarkMode: boolean }

const AMBER = '#f59e0b';
const ROSE = '#fb7185';
const VIOLET = '#a78bfa';
const EMERALD = '#34d399';

export const S10_Half: React.FC<Props> = ({ isDarkMode }) => {
  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText   = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg    = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';

  const ink     = isDarkMode ? '#e2e8f0' : '#0f172a';
  const boxFill = isDarkMode ? '#0a0e1a' : '#ffffff';

  return (
    <div className="max-w-6xl mx-auto space-y-12 py-4">
      <section className="space-y-3">
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.4em] uppercase" style={{ color: VIOLET }}>
          <HelpCircle size={14} /> Chapter 09 · Why Only Half?
        </div>
        <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>
          A perfect box with a <span style={{ color: ROSE }}>missing wire</span>
        </h2>
        <p className={`text-base max-w-3xl ${subText}`}>
          Our machine adds two bits flawlessly. So why does every textbook call it only
          HALF an adder? Look closely at the wires.
        </p>
      </section>

      {/* ── the HA with the missing input ── */}
      <div className={`p-6 md:p-8 rounded-3xl border ${cardBg}`}>
        <svg viewBox="0 0 520 230" className="w-full max-w-2xl mx-auto h-auto">
          <line x1={50} y1={80} x2={185} y2={80} stroke={ink} strokeWidth="3" />
          <line x1={50} y1={120} x2={185} y2={120} stroke={ink} strokeWidth="3" />
          <text x={40} y={84} textAnchor="end" fontSize="12" fontFamily="monospace" fontWeight="bold" fill={ink}>A</text>
          <text x={40} y={124} textAnchor="end" fontSize="12" fontFamily="monospace" fontWeight="bold" fill={ink}>B</text>

          <rect x={185} y={42} width={150} height={120} rx={16} fill={boxFill} stroke={VIOLET} strokeWidth="3" />
          <text x={260} y={110} textAnchor="middle" fontSize="28" fontFamily="monospace" fontWeight="bold" fill={VIOLET}>HA</text>

          <line x1={335} y1={80} x2={470} y2={80} stroke={ink} strokeWidth="3" />
          <line x1={335} y1={120} x2={470} y2={120} stroke={ink} strokeWidth="3" />
          <text x={478} y={84} fontSize="12" fontFamily="monospace" fontWeight="bold" fill={ink}>Sum</text>
          <text x={478} y={124} fontSize="12" fontFamily="monospace" fontWeight="bold" fill={ink}>Cout</text>

          {/* the missing carry-in */}
          <motion.g animate={{ opacity: [1, 0.45, 1] }} transition={{ duration: 1.8, repeat: Infinity }}>
            <circle cx={260} cy={196} r={26} fill="none" stroke={ROSE} strokeWidth="2.5" strokeDasharray="6 6" />
            <text x={260} y={201} textAnchor="middle" fontSize="11" fontFamily="monospace" fontWeight="bold" fill={ROSE}>Cin?</text>
            <line x1={260} y1={170} x2={260} y2={162} stroke={ROSE} strokeWidth="2.5" strokeDasharray="4 5" />
          </motion.g>
          <text x={260} y={232} textAnchor="middle" fontSize="10" fontFamily="monospace" fill={ROSE}>
            no wire to receive a carry IN
          </text>

          {/* a marble with nowhere to go */}
          <motion.circle cx={140} cy={215} r="11" fill={AMBER} opacity={0}
            animate={{ cx: [140, 200, 240], cy: [215, 210, 200], opacity: [0, 1, 1] }}
            transition={{ duration: 2.2, repeat: Infinity, repeatDelay: 1.2, ease: 'easeInOut' }}
            style={{ filter: `drop-shadow(0 0 6px ${AMBER}aa)` }}
          />
        </svg>
        <p className={`text-sm text-center max-w-2xl mx-auto ${subText}`}>
          The block has a Carry-<strong className={textColor}>OUT</strong> - but no wire to receive a
          Carry-<strong style={{ color: ROSE }}>IN</strong> from a previous addition. It is functionally
          incomplete for chaining long sequences of numbers.
        </p>
      </div>

      {/* ── column addition shows the problem ── */}
      <div className="grid lg:grid-cols-2 gap-4 items-stretch">
        <div className={`p-6 rounded-3xl border ${cardBg}`}>
          <div className="font-mono text-[10px] uppercase tracking-widest mb-4" style={{ color: VIOLET }}>
            Adding real numbers · 1101 + 1011 (13 + 11)
          </div>
          <div className={`font-mono text-2xl leading-relaxed text-center ${textColor}`}>
            <div className="text-sm mb-1" style={{ color: ROSE }}>
              <span className="inline-block w-7 text-center">1</span>
              <span className="inline-block w-7 text-center">1</span>
              <span className="inline-block w-7 text-center">1</span>
              <span className="inline-block w-7 text-center opacity-0">·</span>
              <span className="inline-block w-12 text-[10px] opacity-60">carries</span>
            </div>
            <div>
              <span className="inline-block w-7 text-center">1</span>
              <span className="inline-block w-7 text-center">1</span>
              <span className="inline-block w-7 text-center">0</span>
              <span className="inline-block w-7 text-center">1</span>
            </div>
            <div>
              +
              <span className="inline-block w-7 text-center">1</span>
              <span className="inline-block w-7 text-center">0</span>
              <span className="inline-block w-7 text-center">1</span>
              <span className="inline-block w-7 text-center -ml-7">1</span>
            </div>
            <div className="border-t-2 pt-1 mt-1" style={{ borderColor: VIOLET }}>
              <span className="inline-block w-7 text-center" style={{ color: VIOLET }}>1</span>
              <span className="inline-block w-7 text-center">1</span>
              <span className="inline-block w-7 text-center">0</span>
              <span className="inline-block w-7 text-center">0</span>
              <span className="inline-block w-7 text-center -ml-1">0</span>
            </div>
          </div>
          <p className={`text-sm mt-3 ${subText}`}>
            Column 1 (rightmost) is easy: two bits in, our half adder handles it. But column 2
            receives <strong style={{ color: ROSE }}>THREE</strong> things: a bit from each number PLUS
            the carry from column 1. Our box has only two chutes.
          </p>
        </div>

        <div className={`p-6 rounded-3xl border ${cardBg}`}>
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest mb-3" style={{ color: VIOLET }}>
            <Layers size={13} /> Half vs full, formally
          </div>
          <div className="space-y-3">
            <div className={`p-4 rounded-2xl border ${isDarkMode ? 'border-white/10' : 'border-slate-200'}`}>
              <div className="font-mono text-sm font-black" style={{ color: VIOLET }}>HALF ADDER</div>
              <div className={`font-mono text-xs mt-1 ${subText}`}>A, B → Sum, Cout</div>
              <p className={`text-sm mt-2 ${subText}`}>Adds two bits. Perfect for the very first column, where nothing carries in.</p>
            </div>
            <div className="p-4 rounded-2xl border-2" style={{ borderColor: `${EMERALD}55`, background: `${EMERALD}08` }}>
              <div className="font-mono text-sm font-black" style={{ color: EMERALD }}>FULL ADDER</div>
              <div className={`font-mono text-xs mt-1 ${subText}`}>A, B, Cin → Sum, Cout</div>
              <p className={`text-sm mt-2 ${subText}`}>Adds three bits - the two digits plus the incoming carry. THIS one can chain, column after column.</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── the grander scheme ── */}
      <div className="p-6 md:p-8 rounded-3xl border-2" style={{ borderColor: `${VIOLET}44`, background: `${VIOLET}08` }}>
        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest mb-4" style={{ color: VIOLET }}>
          <Cpu size={13} /> The grander scheme of computing
        </div>
        <svg viewBox="0 0 520 150" className="w-full max-w-xl mx-auto h-auto">
          {/* two HA blocks + OR = full adder */}
          <rect x={70} y={18} width={74} height={44} rx={10} fill={boxFill} stroke={VIOLET} strokeWidth="2.5" />
          <text x={107} y={45} textAnchor="middle" fontSize="14" fontFamily="monospace" fontWeight="bold" fill={VIOLET}>HA</text>
          <rect x={70} y={86} width={74} height={44} rx={10} fill={boxFill} stroke={VIOLET} strokeWidth="2.5" />
          <text x={107} y={113} textAnchor="middle" fontSize="14" fontFamily="monospace" fontWeight="bold" fill={VIOLET}>HA</text>
          <text x={30} y={36} fontSize="10" fontFamily="monospace" fill={ink}>A</text>
          <text x={30} y={52} fontSize="10" fontFamily="monospace" fill={ink}>B</text>
          <text x={20} y={108} fontSize="10" fontFamily="monospace" fill={ink}>Cin</text>
          <line x1={40} y1={32} x2={70} y2={32} stroke={ink} strokeWidth="2" />
          <line x1={40} y1={48} x2={70} y2={48} stroke={ink} strokeWidth="2" />
          <line x1={40} y1={104} x2={70} y2={104} stroke={ink} strokeWidth="2" />
          <line x1={144} y1={40} x2={170} y2={40} stroke={ink} strokeWidth="2" />
          <line x1={170} y1={40} x2={170} y2={96} stroke={ink} strokeWidth="2" />
          <line x1={170} y1={96} x2={70} y2={96} stroke={ink} strokeWidth="2" opacity="0.001" />
          {/* OR gate */}
          <path d="M 220 70 Q 238 95 220 120 Q 256 120 276 95 Q 256 70 220 70 Z" fill={boxFill} stroke={EMERALD} strokeWidth="2.5" />
          <text x={244} y={99} textAnchor="middle" fontSize="9" fontFamily="monospace" fontWeight="bold" fill={EMERALD}>OR</text>
          <line x1={144} y1={108} x2={220} y2={108} stroke={ink} strokeWidth="2" />
          <line x1={144} y1={52} x2={200} y2={52} stroke={ink} strokeWidth="2" />
          <line x1={200} y1={52} x2={200} y2={82} stroke={ink} strokeWidth="2" />
          <line x1={200} y1={82} x2={222} y2={82} stroke={ink} strokeWidth="2" />
          <line x1={276} y1={95} x2={320} y2={95} stroke={ink} strokeWidth="2" />
          <text x={328} y={99} fontSize="10" fontFamily="monospace" fontWeight="bold" fill={ink}>Cout</text>
          {/* full adder badge */}
          <rect x={385} y={52} width={108} height={56} rx={12} fill="none" stroke={EMERALD} strokeWidth="2.5" strokeDasharray="7 6" />
          <text x={439} y={76} textAnchor="middle" fontSize="11" fontFamily="monospace" fontWeight="bold" fill={EMERALD}>FULL</text>
          <text x={439} y={92} textAnchor="middle" fontSize="11" fontFamily="monospace" fontWeight="bold" fill={EMERALD}>ADDER</text>
          <text x={355} y={84} textAnchor="middle" fontSize="14" fill={ink}>=</text>
        </svg>
        <p className={`text-sm leading-relaxed max-w-3xl mx-auto mt-4 ${subText}`}>
          Combine <strong className={textColor}>two half adders and an OR gate</strong> and you get a Full
          Adder - a box with three chutes. Chain full adders end to end and you can add numbers of any
          width. By chaining billions of them, we build the arithmetic processors inside every phone,
          laptop and supercomputer on Earth.
        </p>
        <motion.p
          initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className={`text-xl md:text-2xl font-black text-center mt-6 ${textColor}`}
        >
          Complex computing is just a series of
          <span style={{ color: AMBER }}> simple overflowing boxes.</span>
        </motion.p>
      </div>
    </div>
  );
};
