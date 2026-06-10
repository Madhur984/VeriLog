import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, MousePointerClick, Clock } from 'lucide-react';

type Bit = 0 | 1;
type Pulse = 'set' | 'reset' | null;

interface Props {
  isActive?: boolean;
  isDarkMode: boolean;
}

const CYAN = '#22d3ee';
const EMERALD = '#34d399';
const AMBER = '#fbbf24';

// NOR gate body in local coords (0,0)-(88,64), tip pointing right
const NOR_BODY = 'M 0 0 Q 22 32 0 64 Q 62 56 88 32 Q 62 8 0 0 Z';

// Full feedback loop: Q out -> down -> cross -> bottom gate -> Q' out -> up -> cross -> top gate -> back
const ORBIT =
  'M 330 72 L 330 124 L 120 156 L 120 180 L 157 180 L 245 200 L 330 200 L 330 148 L 120 116 L 120 92 L 157 92 L 245 72 Z';

const NorGate: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g transform={`translate(${x} ${y})`}>
    <path d={NOR_BODY} fill="none" stroke={CYAN} strokeWidth="3" />
    <circle cx="94" cy="32" r="5" fill="none" stroke={CYAN} strokeWidth="3" />
    <text x="24" y="37" fontSize="10" fontFamily="monospace" fill={CYAN} opacity="0.7">NOR</text>
  </g>
);

export const S08_TrapMemory: React.FC<Props> = ({ isActive = true, isDarkMode }) => {
  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';
  const off = isDarkMode ? '#475569' : '#cbd5e1';

  const [q, setQ] = useState<Bit>(1);
  const [pulse, setPulse] = useState<Pulse>(null);
  const [pulseId, setPulseId] = useState(0);
  const timer = useRef<number | null>(null);

  const fire = (kind: 'set' | 'reset') => {
    setQ(kind === 'set' ? 1 : 0);
    setPulse(kind);
    setPulseId(n => n + 1);
    if (timer.current !== null) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setPulse(null), 900);
  };

  useEffect(() => () => { if (timer.current !== null) window.clearTimeout(timer.current); }, []);

  const holdColor = q === 1 ? EMERALD : AMBER;
  const wire = (on: boolean, c: string) => (on ? c : off);
  const glow = (on: boolean, c: string) => (on ? `drop-shadow(0 0 5px ${c})` : 'none');

  const qOn = q === 1;
  const qbOn = q === 0;
  const sHigh = pulse === 'set';
  const rHigh = pulse === 'reset';

  const steps = [
    { n: '01', t: 'Tap SET. A short pulse rides into one gate.' },
    { n: '02', t: 'Both gates flip and feed their answers back to each other.' },
    { n: '03', t: 'Pulse gone. The loop keeps re-feeding itself. Bit trapped.' },
  ];

  const rules = [
    { k: 'S pulse', v: 'Q locks 1', c: EMERALD },
    { k: 'R pulse', v: 'Q locks 0', c: AMBER },
    { k: 'Both quiet', v: 'Q holds', c: CYAN },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-12 py-4">
      <section className="space-y-3">
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.4em] uppercase" style={{ color: CYAN }}>
          <Lock size={14} /> Chapter 08 · Trapping a Bit
        </div>
        <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>Cross two gates. Trap a bit.</h2>
        <p className={`text-base max-w-3xl ${subText}`}>
          No special memory chip needed. Wire each gate's output back into the other and the signal chases its own tail, holding a 1 or a 0 until you say otherwise.
        </p>
      </section>

      <div className="grid lg:grid-cols-[1.25fr_1fr] gap-6 items-stretch">
        {/* Live SR latch */}
        <motion.div
          initial={{ opacity: 0, x: -16 }} animate={isActive ? { opacity: 1, x: 0 } : {}}
          className={`p-6 md:p-8 rounded-3xl border ${cardBg} flex flex-col gap-4`}
        >
          <div className="font-mono text-[10px] uppercase tracking-widest" style={{ color: CYAN }}>
            Live circuit · SR latch · 2 cross-coupled NOR gates
          </div>

          <svg viewBox="0 0 400 252" className="w-full h-auto">
            {/* External inputs */}
            <text x="18" y="56" fontSize="13" fontFamily="monospace" fontWeight="bold" fill={wire(rHigh, AMBER)}>R={rHigh ? 1 : 0}</text>
            <line x1="48" y1="52" x2="157" y2="52" stroke={wire(rHigh, AMBER)} strokeWidth="3" style={{ filter: glow(rHigh, AMBER) }} />
            <text x="18" y="224" fontSize="13" fontFamily="monospace" fontWeight="bold" fill={wire(sHigh, EMERALD)}>S={sHigh ? 1 : 0}</text>
            <line x1="48" y1="220" x2="157" y2="220" stroke={wire(sHigh, EMERALD)} strokeWidth="3" style={{ filter: glow(sHigh, EMERALD) }} />

            {/* Q feedback: Q -> bottom gate input (cross-wire) */}
            <polyline
              points="330,72 330,124 120,156 120,180 157,180"
              fill="none" stroke={wire(qOn, EMERALD)} strokeWidth="3"
              strokeLinejoin="round" style={{ filter: glow(qOn, EMERALD) }}
            />
            {/* Q' feedback: Q' -> top gate input (cross-wire) */}
            <polyline
              points="330,200 330,148 120,116 120,92 157,92"
              fill="none" stroke={wire(qbOn, AMBER)} strokeWidth="3"
              strokeLinejoin="round" style={{ filter: glow(qbOn, AMBER) }}
            />
            <text x="256" y="131" fontSize="9" fontFamily="monospace" fill={CYAN} opacity="0.65">feedback</text>

            {/* Gates */}
            <NorGate x={150} y={40} />
            <NorGate x={150} y={168} />

            {/* Outputs */}
            <line x1="250" y1="72" x2="330" y2="72" stroke={wire(qOn, EMERALD)} strokeWidth="3" style={{ filter: glow(qOn, EMERALD) }} />
            <circle cx="330" cy="72" r="4" fill={wire(qOn, EMERALD)} />
            <text x="340" y="77" fontSize="14" fontFamily="monospace" fontWeight="bold" fill={qOn ? EMERALD : off}>Q={q}</text>
            <line x1="250" y1="200" x2="330" y2="200" stroke={wire(qbOn, AMBER)} strokeWidth="3" style={{ filter: glow(qbOn, AMBER) }} />
            <circle cx="330" cy="200" r="4" fill={wire(qbOn, AMBER)} />
            <text x="340" y="205" fontSize="14" fontFamily="monospace" fontWeight="bold" fill={qbOn ? AMBER : off}>Q′={qbOn ? 1 : 0}</text>

            {/* Travelling input pulse */}
            {sHigh && (
              <motion.circle
                key={`sp-${pulseId}`} cy={220} r={6} fill={EMERALD}
                initial={{ cx: 50, opacity: 1 }}
                animate={{ cx: 154, opacity: [1, 1, 0] }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
                style={{ filter: `drop-shadow(0 0 6px ${EMERALD})` }}
              />
            )}
            {rHigh && (
              <motion.circle
                key={`rp-${pulseId}`} cy={52} r={6} fill={AMBER}
                initial={{ cx: 50, opacity: 1 }}
                animate={{ cx: 154, opacity: [1, 1, 0] }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
                style={{ filter: `drop-shadow(0 0 6px ${AMBER})` }}
              />
            )}

            {/* The endlessly circulating bit on the feedback loop */}
            <circle r="5" fill={holdColor} style={{ filter: `drop-shadow(0 0 6px ${holdColor})` }}>
              <animateMotion dur="4.5s" repeatCount="indefinite" path={ORBIT} />
            </circle>
            <circle r="3" fill={holdColor} opacity="0.55">
              <animateMotion dur="4.5s" begin="-2.25s" repeatCount="indefinite" path={ORBIT} />
            </circle>
          </svg>

          <div className={`flex items-center gap-2 text-xs font-mono ${subText}`}>
            <MousePointerClick size={12} /> Tap to send a brief pulse. Then watch what survives.
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => fire('set')}
              className="flex-1 px-4 py-3 rounded-xl border-2 font-mono font-black transition-all flex flex-col items-start gap-0.5"
              style={{
                borderColor: EMERALD,
                color: sHigh ? '#000' : EMERALD,
                backgroundColor: sHigh ? EMERALD : 'transparent',
                boxShadow: sHigh ? `0 0 20px ${EMERALD}55` : 'none',
              }}
            >
              <span className="text-[9px] uppercase tracking-widest opacity-80">pulse S = 1</span>
              <span className="text-base">SET</span>
            </button>
            <button
              onClick={() => fire('reset')}
              className="flex-1 px-4 py-3 rounded-xl border-2 font-mono font-black transition-all flex flex-col items-start gap-0.5"
              style={{
                borderColor: AMBER,
                color: rHigh ? '#000' : AMBER,
                backgroundColor: rHigh ? AMBER : 'transparent',
                boxShadow: rHigh ? `0 0 20px ${AMBER}55` : 'none',
              }}
            >
              <span className="text-[9px] uppercase tracking-widest opacity-80">pulse R = 1</span>
              <span className="text-base">RESET</span>
            </button>
          </div>

          <div className="flex gap-3">
            <motion.div
              animate={{
                borderColor: qOn ? EMERALD : `${EMERALD}44`,
                background: qOn ? `${EMERALD}1a` : 'rgba(0,0,0,0)',
                boxShadow: qOn ? `0 0 24px ${EMERALD}33` : '0 0 0px rgba(0,0,0,0)',
              }}
              className="flex-1 px-4 py-3 rounded-xl border-2 font-mono font-black flex flex-col gap-0.5"
              style={{ color: EMERALD }}
            >
              <span className="text-[9px] uppercase tracking-widest opacity-80">Q · stored bit</span>
              <span className="text-2xl">{q}</span>
            </motion.div>
            <motion.div
              animate={{
                borderColor: qbOn ? AMBER : `${AMBER}44`,
                background: qbOn ? `${AMBER}1a` : 'rgba(0,0,0,0)',
              }}
              className="flex-1 px-4 py-3 rounded-xl border-2 font-mono font-black flex flex-col gap-0.5"
              style={{ color: AMBER }}
            >
              <span className="text-[9px] uppercase tracking-widest opacity-80">Q′ · opposite</span>
              <span className="text-2xl">{qbOn ? 1 : 0}</span>
            </motion.div>
          </div>

          <div className={`text-xs font-mono ${subText}`}>
            {pulse ? 'pulse travelling into the loop...' : 'inputs quiet · the loop alone is holding the bit'}
          </div>
        </motion.div>

        {/* How the trap works */}
        <motion.div
          initial={{ opacity: 0, x: 16 }} animate={isActive ? { opacity: 1, x: 0 } : {}}
          className={`p-6 md:p-8 rounded-3xl border ${cardBg} flex flex-col gap-5`}
        >
          <div className="font-mono text-[10px] uppercase tracking-widest" style={{ color: CYAN }}>
            Watch the loop
          </div>

          <div className="space-y-4">
            {steps.map((s, i) => (
              <motion.div
                key={s.n}
                initial={{ opacity: 0, x: -10 }}
                animate={isActive ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.2 + i * 0.15 }}
                className="flex items-start gap-3"
              >
                <span className="font-mono text-[10px] font-black mt-1" style={{ color: CYAN }}>{s.n}</span>
                <span className={`text-sm ${textColor}`}>{s.t}</span>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-2">
            {rules.map((r) => (
              <div
                key={r.k}
                className={`rounded-xl p-3 border ${isDarkMode ? 'bg-black/30 border-white/10' : 'bg-slate-50 border-slate-200'}`}
              >
                <div className="font-mono text-[9px] uppercase tracking-widest" style={{ color: r.c }}>{r.k}</div>
                <div className={`text-xs font-mono font-black ${textColor}`}>{r.v}</div>
              </div>
            ))}
          </div>

          <div className="rounded-2xl p-4 border-2" style={{ borderColor: CYAN, background: `${CYAN}11` }}>
            <div className="font-mono text-[10px] uppercase tracking-widest mb-1" style={{ color: CYAN }}>
              Key takeaway
            </div>
            <p className={`text-sm ${textColor}`}>
              Cross-wire two ordinary gates and the loop holds a bit until you change it. That is a latch - the seed of all memory.
            </p>
          </div>

          <div className={`rounded-2xl p-4 border ${isDarkMode ? 'bg-black/30 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
            <div className="font-mono text-[10px] uppercase tracking-widest mb-1 flex items-center gap-2" style={{ color: AMBER }}>
              <Clock size={12} /> Footnote
            </div>
            <p className={`text-sm ${subText}`}>
              Flip-flops, like the D and JK, are latches with a doorman: they only listen on a clock tick. Meet that clock next.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
