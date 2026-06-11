import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Box, MousePointerClick, CheckCircle2, Lock } from 'lucide-react';

interface Props { isActive?: boolean; isDarkMode: boolean }

const AMBER = '#f59e0b';
const CYAN = '#22d3ee';
const ROSE = '#fb7185';

type CaseKey = '0+0' | '0+1' | '1+0';

export const S02_RuleBox: React.FC<Props> = ({ isDarkMode }) => {
  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText   = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg    = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';

  const wood     = isDarkMode ? '#c4956c' : '#8b5e3c';
  const woodFill = isDarkMode ? '#5b3d2a33' : '#a9826033';
  const metal    = isDarkMode ? '#94a3b8' : '#64748b';
  const dim      = isDarkMode ? '#475569' : '#cbd5e1';

  const [armA, setArmA] = useState(false);
  const [armB, setArmB] = useState(false);
  const [dropKey, setDropKey] = useState(0);          // bumps to replay the animation
  const [result, setResult] = useState<{ a: number; b: number } | null>(null);
  const [tried, setTried] = useState<Set<CaseKey>>(new Set());

  const bothArmed = armA && armB;
  const allTried = tried.size === 3;

  const drop = () => {
    if (bothArmed) return; // locked - next chapter
    const a = armA ? 1 : 0;
    const b = armB ? 1 : 0;
    setResult({ a, b });
    setDropKey(k => k + 1);
    setTried(prev => new Set(prev).add(`${a}+${b}` as CaseKey));
  };

  const sum = result ? (result.a + result.b) : null; // only calm cases here, so sum is 0 or 1

  return (
    <div className="max-w-6xl mx-auto space-y-12 py-4">
      <section className="space-y-3">
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.4em] uppercase" style={{ color: AMBER }}>
          <Box size={14} /> Chapter 04 · The Marble Box
        </div>
        <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>
          The truth table, made of wood.
        </h2>
        <p className={`text-base max-w-3xl ${subText}`}>
          You know the facts. Now feel them. This machine IS the truth table: arm a chute,
          hit DROP, and watch the rows you memorized happen physically. The bowl is the
          Sum. The tray is the Carry.
        </p>
      </section>

      <div className="grid lg:grid-cols-[1.5fr_1fr] gap-6 items-start">
        {/* ── machine ── */}
        <div className={`p-6 md:p-8 rounded-3xl border ${cardBg}`}>
          <svg viewBox="0 0 460 290" className="w-full h-auto">
            <defs>
              <radialGradient id="rb-marble" cx="35%" cy="30%" r="75%">
                <stop offset="0%" stopColor="#fde68a" />
                <stop offset="55%" stopColor={AMBER} />
                <stop offset="100%" stopColor="#b45309" />
              </radialGradient>
            </defs>

            {([['A', 150, armA], ['B', 290, armB]] as const).map(([label, x, on]) => (
              <g key={label}>
                <rect x={x - 26} y={14} width={52} height={40} rx={8}
                      fill={on ? `${AMBER}22` : 'none'} stroke={on ? AMBER : metal} strokeWidth="2.5" />
                <text x={x} y={34} textAnchor="middle" fontSize="11" fontFamily="monospace" fontWeight="bold"
                      fill={on ? AMBER : metal}>{label}</text>
                <text x={x} y={48} textAnchor="middle" fontSize="12" fontFamily="monospace" fontWeight="bold"
                      fill={on ? AMBER : dim}>{on ? 1 : 0}</text>
                <line x1={x} y1={56} x2={x} y2={118} stroke={dim} strokeWidth="2" strokeDasharray="4 5" />
              </g>
            ))}

            <rect x={110} y={148} width={220} height={88} rx={14} fill={woodFill} stroke={wood} strokeWidth="3" />
            <ellipse cx={220} cy={176} rx={62} ry={20} fill="none" stroke={wood} strokeWidth="2.5" opacity="0.8" />
            <text x={220} y={224} textAnchor="middle" fontSize="9" fontFamily="monospace" fill={wood}>SUM · capacity 1</text>

            <rect x={336} y={244} width={104} height={40} rx={9} fill={woodFill} stroke={wood} strokeWidth="2.5" />
            <text x={388} y={268} textAnchor="middle" fontSize="9" fontFamily="monospace" fill={wood}>CARRY TRAY</text>

            {/* dropped marble(s) - calm cases only ever land one */}
            <AnimatePresence mode="wait">
              {result && sum === 1 && (
                <motion.circle key={dropKey} cx={result.a ? 150 : 290} cy={70} r="13" fill="url(#rb-marble)"
                  initial={{ cx: result.a ? 150 : 290, cy: 70, opacity: 0 }}
                  animate={{
                    cx: [result.a ? 150 : 290, result.a ? 150 : 290, 220],
                    cy: [70, 118, 170],
                    opacity: 1,
                  }}
                  transition={{ duration: 0.8, times: [0, 0.45, 1], ease: 'easeIn' }}
                />
              )}
            </AnimatePresence>
          </svg>

          {/* controls */}
          <div className="mt-4 flex flex-wrap items-center gap-3">
            {([['A', armA, setArmA], ['B', armB, setArmB]] as const).map(([label, on, set]) => (
              <button key={label} onClick={() => set(v => !v)}
                className="px-5 py-3 rounded-xl border-2 font-mono font-black transition-all active:scale-95"
                style={{
                  borderColor: AMBER,
                  color: on ? '#000' : AMBER,
                  backgroundColor: on ? AMBER : 'transparent',
                  boxShadow: on ? `0 0 18px ${AMBER}55` : 'none',
                }}>
                Chute {label}: {on ? 1 : 0}
              </button>
            ))}
            <button onClick={drop}
              className="px-6 py-3 rounded-xl font-mono font-black transition-all active:scale-95 flex items-center gap-2"
              style={{
                backgroundColor: bothArmed ? `${ROSE}22` : CYAN,
                color: bothArmed ? ROSE : '#000',
                border: bothArmed ? `2px solid ${ROSE}` : '2px solid transparent',
                cursor: bothArmed ? 'not-allowed' : 'pointer',
              }}>
              {bothArmed ? (<><Lock size={14} /> Two marbles? That is next chapter.</>) : (<><MousePointerClick size={14} /> DROP</>)}
            </button>
          </div>

          {/* readout */}
          {result && !bothArmed && (
            <div className="mt-4 flex flex-wrap gap-3">
              {([['Input A', result.a], ['Input B', result.b], ['Sum (Main Box)', sum ?? 0], ['Carry (Tray)', 0]] as const).map(([k, v]) => (
                <div key={k} className="px-4 py-2 rounded-xl border font-mono text-xs font-bold"
                     style={{
                       borderColor: v ? AMBER : dim,
                       color: v ? AMBER : (isDarkMode ? '#94a3b8' : '#64748b'),
                       background: v ? `${AMBER}10` : 'transparent',
                     }}>
                  {k}: {v}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── case log + theory ── */}
        <div className="space-y-4">
          <div className={`p-5 rounded-3xl border ${cardBg}`}>
            <div className="font-mono text-[10px] uppercase tracking-widest mb-3" style={{ color: CYAN }}>
              Case log
            </div>
            <div className="space-y-2">
              {(['0+0', '0+1', '1+0'] as CaseKey[]).map(k => {
                const done = tried.has(k);
                const [a, b] = k.split('+').map(Number);
                return (
                  <div key={k} className={`flex items-center justify-between px-4 py-2.5 rounded-xl border font-mono text-sm ${
                    done ? 'border-emerald-400/50 bg-emerald-500/10' : isDarkMode ? 'border-white/10' : 'border-slate-200'
                  }`}>
                    <span className={done ? 'text-emerald-400 font-bold' : subText}>
                      {a} + {b} = {a + b} <span className="opacity-50">· carry 0</span>
                    </span>
                    {done && <CheckCircle2 size={15} className="text-emerald-400" />}
                  </div>
                );
              })}
              <div className={`flex items-center justify-between px-4 py-2.5 rounded-xl border-2 border-dashed font-mono text-sm`}
                   style={{ borderColor: `${ROSE}55`, color: ROSE }}>
                <span>1 + 1 = ?</span>
                <Lock size={14} />
              </div>
            </div>
            {allTried && (
              <motion.p initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                        className="mt-3 text-xs font-bold" style={{ color: AMBER }}>
                Three of four cases down. One left - the dangerous one.
              </motion.p>
            )}
          </div>

          <div className={`p-5 rounded-3xl border ${cardBg}`}>
            <div className="font-mono text-[10px] uppercase tracking-widest mb-2" style={{ color: CYAN }}>
              In circuit terms
            </div>
            <ul className={`text-sm space-y-2 ${subText}`}>
              <li><strong className={textColor}>The chutes are inputs.</strong> Each carries one bit: marble = 1, no marble = 0.</li>
              <li><strong className={textColor}>The bowl is the Sum output.</strong> It reports the ones column of the answer.</li>
              <li><strong className={textColor}>The tray is the Carry output.</strong> Quiet so far - it only matters in the overflow case.</li>
              <li><strong className={textColor}>"Nothing goes in, nothing comes out"</strong> is a real circuit law: with both inputs at 0, a half adder outputs 0 and 0. The system is at rest.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* ── the capacity question (bridge to the overflow chapter) ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="p-6 md:p-8 rounded-3xl border-2 text-center"
        style={{ borderColor: `${ROSE}44`, background: `${ROSE}08` }}
      >
        <div className="font-mono text-[10px] uppercase tracking-widest mb-3" style={{ color: ROSE }}>
          The fourth case
        </div>
        <p className={`text-xl md:text-2xl font-black max-w-3xl mx-auto leading-snug ${textColor}`}>
          The bowl has a strict capacity of <span style={{ color: ROSE }}>one</span>. Binary has no
          digit 2. So when both marbles come at once -
          <span style={{ color: ROSE }}> where does the excess go?</span>
        </p>
        <p className={`mt-3 text-sm font-mono uppercase tracking-widest ${subText}`}>
          the answer is the whole trick · next chapter
        </p>
      </motion.div>
    </div>
  );
};
