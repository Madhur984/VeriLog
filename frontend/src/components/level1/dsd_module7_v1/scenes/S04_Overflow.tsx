import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, Waves, BookOpen } from 'lucide-react';
import { TryItYourself } from '../../../ui/TryItYourself';

interface Props { isActive?: boolean; isDarkMode: boolean }

const AMBER = '#f59e0b';
const ROSE = '#fb7185';
const EMERALD = '#34d399';

export const S04_Overflow: React.FC<Props> = ({ isDarkMode }) => {
  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText   = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg    = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';

  const wood     = isDarkMode ? '#c4956c' : '#8b5e3c';
  const woodFill = isDarkMode ? '#5b3d2a33' : '#a9826033';
  const dim      = isDarkMode ? '#475569' : '#cbd5e1';

  const [run, setRun] = useState(1);          // animation key; >0 means playing/played
  const [settled, setSettled] = useState(false);

  const replay = () => { setSettled(false); setRun(k => k + 1); };

  return (
    <div className="max-w-6xl mx-auto space-y-12 py-4">
      <section className="space-y-3">
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.4em] uppercase" style={{ color: AMBER }}>
          <Waves size={14} /> Chapter 05 · The Overflow Mechanism
        </div>
        <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>
          The box answers: <span style={{ color: ROSE }}>1 + 1 = 10</span>
        </h2>
        <p className={`text-base max-w-3xl ${subText}`}>
          Both marbles drop. They collide in a bowl built for one - and the machine does
          something beautiful: it keeps none and reports both.
        </p>
      </section>

      {/* ── the payoff animation ── */}
      <div><TryItYourself /></div>
      <div className={`p-6 md:p-8 rounded-3xl border ${cardBg}`}>
        <svg viewBox="0 0 460 300" className="w-full max-w-2xl mx-auto h-auto">
          <defs>
            <radialGradient id="of-marble" cx="35%" cy="30%" r="75%">
              <stop offset="0%" stopColor="#fde68a" />
              <stop offset="55%" stopColor={AMBER} />
              <stop offset="100%" stopColor="#b45309" />
            </radialGradient>
          </defs>

          {([['A', 160], ['B', 280]] as const).map(([label, x]) => (
            <g key={label}>
              <rect x={x - 26} y={10} width={52} height={36} rx={8} fill={`${AMBER}22`} stroke={AMBER} strokeWidth="2.5" />
              <text x={x} y={28} textAnchor="middle" fontSize="11" fontFamily="monospace" fontWeight="bold" fill={AMBER}>{label} = 1</text>
              <line x1={x} y1={46} x2={x} y2={112} stroke={dim} strokeWidth="2" strokeDasharray="4 5" />
            </g>
          ))}

          {/* box */}
          <rect x={110} y={142} width={220} height={88} rx={14} fill={woodFill} stroke={wood} strokeWidth="3" />
          <ellipse cx={220} cy={170} rx={62} ry={20} fill="none" stroke={wood} strokeWidth="2.5" opacity="0.8" />
          <text x={220} y={218} textAnchor="middle" fontSize="9" fontFamily="monospace" fill={wood}>SUM · capacity 1</text>

          {/* ramp into tray */}
          <line x1={296} y1={196} x2={350} y2={252} stroke={AMBER} strokeWidth="2.5" strokeDasharray="5 5" opacity="0.8" />

          {/* carry tray slides out and glows when the marble lands */}
          <motion.g key={`tray-${run}`}
            initial={{ x: 0 }} animate={{ x: 14 }} transition={{ delay: 1.7, duration: 0.5 }}>
            <rect x={334} y={252} width={106} height={42} rx={9} fill={woodFill}
                  stroke={settled ? AMBER : wood} strokeWidth="2.5"
                  style={{ filter: settled ? `drop-shadow(0 0 10px ${AMBER}77)` : 'none' }} />
            <text x={387} y={270} textAnchor="middle" fontSize="9" fontFamily="monospace" fill={settled ? AMBER : wood}>
              CARRY TRAY
            </text>
            {settled && (
              <motion.text x={387} y={286} textAnchor="middle" fontSize="12" fontFamily="monospace" fontWeight="bold" fill={AMBER}
                initial={{ opacity: 0, scale: 1.5 }} animate={{ opacity: 1, scale: 1 }}
                style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
                1
              </motion.text>
            )}
          </motion.g>

          {/* the two marbles */}
          <AnimatePresence mode="wait">
            <g key={run}>
              {/* marble A: drops in, gets bumped, exits the bowl (sum -> 0) */}
              <motion.circle cx={160} cy={60} r="14" fill="url(#of-marble)"
                initial={{ cx: 160, cy: 60, opacity: 0 }}
                animate={{ cx: [160, 160, 200, 214], cy: [60, 112, 164, 160], opacity: [0, 1, 1, 0] }}
                transition={{ duration: 1.9, times: [0, 0.3, 0.62, 1], ease: 'easeInOut' }}
              />
              {/* marble B: drops, collides, rides the ramp into the tray */}
              <motion.circle cx={280} cy={60} r="14" fill="url(#of-marble)"
                initial={{ cx: 280, cy: 60, opacity: 0 }}
                animate={{ cx: [280, 280, 238, 300, 387], cy: [60, 112, 164, 200, 268] }}
                transition={{ duration: 2.2, times: [0, 0.28, 0.5, 0.74, 1], ease: 'easeInOut' }}
                onAnimationComplete={() => setSettled(true)}
              />
            </g>
          </AnimatePresence>
        </svg>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-4">
          <button onClick={replay}
            className="px-5 py-3 rounded-xl border-2 font-mono text-sm font-black flex items-center gap-2 transition-all active:scale-95"
            style={{ borderColor: ROSE, color: ROSE, background: `${ROSE}0d` }}>
            <RotateCcw size={14} /> REPLAY THE OVERFLOW
          </button>
          <AnimatePresence>
            {settled && (
              <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                          className="flex items-center gap-3 font-mono font-black">
                <span className="px-3 py-2 rounded-lg border text-sm" style={{ borderColor: dim, color: isDarkMode ? '#94a3b8' : '#64748b' }}>Sum = 0</span>
                <span className="px-3 py-2 rounded-lg border-2 text-sm" style={{ borderColor: AMBER, color: AMBER, background: `${AMBER}10` }}>Carry = 1</span>
                <motion.span initial={{ width: 0 }} animate={{ width: 'auto' }}
                             className={`text-xl overflow-hidden whitespace-nowrap ${textColor}`}>
                  1 + 1 = 10
                </motion.span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── column arithmetic: you already know this move ── */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className={`p-6 rounded-3xl border ${cardBg}`}>
          <div className="font-mono text-[10px] uppercase tracking-widest mb-4" style={{ color: EMERALD }}>
            School math · decimal 7 + 5
          </div>
          <div className={`font-mono text-2xl leading-relaxed ${textColor}`}>
            <div className="opacity-50 text-sm mb-1 ml-7">carry <span style={{ color: EMERALD }}>1</span> floats left</div>
            <div className="ml-6">&nbsp;&nbsp;7</div>
            <div className="ml-6">+ 5</div>
            <div className="ml-6 border-t-2 pt-1" style={{ borderColor: EMERALD }}>
              <span style={{ color: EMERALD }}>1</span>2
            </div>
          </div>
          <p className={`text-sm mt-3 ${subText}`}>
            Write the 2, carry the 1 into the tens column. You have done overflow since
            primary school - you just never called it that.
          </p>
        </div>
        <div className="p-6 rounded-3xl border-2" style={{ borderColor: `${ROSE}55`, background: `${ROSE}0a` }}>
          <div className="font-mono text-[10px] uppercase tracking-widest mb-4" style={{ color: ROSE }}>
            Chip math · binary 1 + 1
          </div>
          <div className={`font-mono text-2xl leading-relaxed ${textColor}`}>
            <div className="opacity-50 text-sm mb-1 ml-7">carry <span style={{ color: ROSE }}>1</span> floats left</div>
            <div className="ml-6">&nbsp;&nbsp;1</div>
            <div className="ml-6">+ 1</div>
            <div className="ml-6 border-t-2 pt-1" style={{ borderColor: ROSE }}>
              <span style={{ color: ROSE }}>1</span>0
            </div>
          </div>
          <p className={`text-sm mt-3 ${subText}`}>
            Write the 0, carry the 1 into the twos column. Identical move, smaller alphabet.
          </p>
        </div>
      </div>

      {/* ── standard theory ── */}
      <div className="px-1">
        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest mb-3" style={{ color: ROSE }}>
          <BookOpen size={13} /> Standard theory · what just happened
        </div>
        <p className={`text-sm leading-relaxed max-w-3xl ${subText}`}>
          The '0' stays in the <strong className={textColor}>Sum</strong> column. The '1' is pushed to the
          <strong className={textColor}> Carry</strong> column. Together the pair (Carry, Sum) = (1, 0) is a
          two-bit answer: 10₂, which is the number two. The carry is not an error or a leftover -
          it is a <strong style={{ color: ROSE }}>message to the next column</strong>, exactly like the small
          digit you float above a column in school addition. Every adder ever built is a machine for
          delivering that message.
        </p>
      </div>
    </div>
  );
};
