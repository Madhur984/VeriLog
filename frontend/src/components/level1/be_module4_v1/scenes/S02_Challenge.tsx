import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Waves } from 'lucide-react';

interface Props { isActive: boolean; isDarkMode: boolean; }

// Generate a sine wave path
const sinePath = (w: number, h: number, cycles = 2, phase = 0, amp = 0.7) => {
  const pts: string[] = [];
  for (let i = 0; i <= 200; i++) {
    const x = (i / 200) * w;
    const t = (i / 200) * cycles * 2 * Math.PI + phase;
    const y = h / 2 - Math.sin(t) * (h / 2) * amp;
    pts.push(`${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`);
  }
  return pts.join(' ');
};

export const S02_Challenge: React.FC<Props> = ({ isActive, isDarkMode }) => {
  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText   = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg    = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';

  // Animate the sine phase to make the wave move
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    if (!isActive) return;
    const t = setInterval(() => setPhase((p) => (p + 0.1) % (Math.PI * 2)), 50);
    return () => clearInterval(t);
  }, [isActive]);

  return (
    <div className="max-w-6xl mx-auto space-y-12 py-4">
      <section className="space-y-3">
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.4em] uppercase text-cyan-400">
          <AlertTriangle size={14} /> Step 1 · Why We Need Rectifiers &amp; Filters
        </div>
        <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>AC vs DC · taming the tide.</h2>
        <p className={`text-base max-w-3xl ${subText}`}>
          The wall socket gives us alternating current — chaotic, bidirectional. Our devices need
          direct current — smooth, one-direction only. The whole job of this module is converting
          one into the other using two pieces of hardware: a <strong className="text-cyan-300">rectifier</strong> and a{' '}
          <strong className="text-amber-300">filter</strong>.
        </p>
      </section>

      {/* Topic banner */}
      <div className="rounded-2xl border-2 border-cyan-400/40 bg-cyan-500/10 p-4 flex flex-wrap items-center gap-3">
        <span className="font-mono text-[10px] uppercase tracking-widest font-black px-2 py-0.5 rounded bg-cyan-400/20 text-cyan-200 border border-cyan-400/55">
          Topic
        </span>
        <span className={`font-mono text-sm font-black ${textColor}`}>
          AC mains vs DC supply · the source-vs-load mismatch every power-supply solves
        </span>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        {/* AC chaotic */}
        <motion.div
          initial={{ opacity: 0, x: -16 }} animate={isActive ? { opacity: 1, x: 0 } : {}}
          className={`rounded-3xl border ${cardBg} overflow-hidden`}
        >
          <div className="p-5 border-b" style={{ borderColor: isDarkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }}>
            <div className="font-mono text-[10px] uppercase tracking-widest text-rose-300 mb-1">
              The Mains Supply
            </div>
            <h3 className={`text-xl font-black ${textColor}`}>Chaotic · bidirectional · 50 Hz</h3>
          </div>
          <div className="p-5">
            <svg viewBox="0 0 400 200" className="w-full h-auto">
              {/* Axes */}
              <line x1="20" y1="100" x2="380" y2="100" stroke={isDarkMode ? '#475569' : '#cbd5e1'} strokeWidth="1" />
              <line x1="40" y1="20" x2="40" y2="180" stroke={isDarkMode ? '#475569' : '#cbd5e1'} strokeWidth="1" />
              <text x="6" y="30"  fontSize="9" fontFamily="monospace" fill={isDarkMode ? '#94a3b8' : '#64748b'}>+Vm</text>
              <text x="6" y="180" fontSize="9" fontFamily="monospace" fill={isDarkMode ? '#94a3b8' : '#64748b'}>−Vm</text>
              <text x="370" y="115" fontSize="9" fontFamily="monospace" fill={isDarkMode ? '#94a3b8' : '#64748b'}>t</text>
              {/* Animated AC sine wave */}
              <path
                d={`M 40 ${100} ${sinePath(340, 160, 2, phase, 0.85).replace(/^M/, 'L').replace(/L (\S+) /, 'L $1 ').slice(2)}`}
                stroke="#f43f5e"
                strokeWidth="3"
                fill="none"
                style={{ filter: 'drop-shadow(0 0 6px rgba(244,63,94,0.6))' }}
                transform="translate(40, 20)"
              />
              {/* Above/below shading hints */}
              <text x="100" y="50" fontSize="11" fontFamily="monospace" fill="#f43f5e" fontWeight="bold">forward push</text>
              <text x="200" y="170" fontSize="11" fontFamily="monospace" fill="#f43f5e" fontWeight="bold">violent backwards slosh</text>
            </svg>
            <div className={`mt-4 p-3 rounded-xl border ${isDarkMode ? 'bg-black/30 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
              <p className={`text-xs font-mono ${subText}`}>
                v(t) = V<sub>m</sub> · sin(2π · 50 · t)
              </p>
              <p className={`text-xs ${subText} mt-1`}>
                Reverses direction 100 times per second. Plug a chip directly in and it dies.
              </p>
            </div>
          </div>
        </motion.div>

        {/* DC smooth */}
        <motion.div
          initial={{ opacity: 0, x: 16 }} animate={isActive ? { opacity: 1, x: 0 } : {}}
          className={`rounded-3xl border ${cardBg} overflow-hidden`}
        >
          <div className="p-5 border-b" style={{ borderColor: isDarkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }}>
            <div className="font-mono text-[10px] uppercase tracking-widest text-emerald-300 mb-1">
              Sensitive Electronics
            </div>
            <h3 className={`text-xl font-black ${textColor}`}>Smooth · unidirectional · constant</h3>
          </div>
          <div className="p-5">
            <svg viewBox="0 0 400 200" className="w-full h-auto">
              <line x1="20" y1="100" x2="380" y2="100" stroke={isDarkMode ? '#475569' : '#cbd5e1'} strokeWidth="1" />
              <line x1="40" y1="20" x2="40" y2="180" stroke={isDarkMode ? '#475569' : '#cbd5e1'} strokeWidth="1" />
              <text x="6" y="60"  fontSize="9" fontFamily="monospace" fill={isDarkMode ? '#94a3b8' : '#64748b'}>+Vdc</text>
              <text x="370" y="115" fontSize="9" fontFamily="monospace" fill={isDarkMode ? '#94a3b8' : '#64748b'}>t</text>
              {/* Flat DC line */}
              <motion.line
                x1="40" y1="60" x2="380" y2="60"
                stroke="#22c55e" strokeWidth="4"
                style={{ filter: 'drop-shadow(0 0 6px rgba(34,197,94,0.65))' }}
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <text x="180" y="50" fontSize="12" fontFamily="monospace" fill="#22c55e" fontWeight="bold">constant flow</text>
              {/* Arrow showing direction */}
              <polygon points="370,55 380,60 370,65" fill="#22c55e" />
            </svg>
            <div className={`mt-4 p-3 rounded-xl border ${isDarkMode ? 'bg-black/30 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
              <p className={`text-xs font-mono ${subText}`}>v(t) = V<sub>dc</sub> · constant</p>
              <p className={`text-xs ${subText} mt-1`}>
                Never reverses. Same magnitude every moment. The lazy river your microchip dreams of.
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* The mission */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.3 }}
        className={`p-8 rounded-3xl border ${cardBg} relative overflow-hidden`}
        style={{ background: isDarkMode ? 'radial-gradient(circle at 80% 30%, rgba(34,197,94,0.08), transparent 60%)' : 'radial-gradient(circle at 80% 30%, rgba(34,197,94,0.05), transparent 60%)' }}
      >
        <div className="flex items-center gap-3 mb-3">
          <Waves className="text-cyan-400" size={20} />
          <h3 className={`text-xl font-black ${textColor}`}>The mission</h3>
        </div>
        <p className={`text-base ${subText}`}>
          Take the violent, alternating wave on the left and engineer it into the calm, constant
          line on the right. We will need: <strong className="text-cyan-300">diodes</strong>{' '}
          (one-way valves), a <strong className="text-cyan-300">rectifier</strong> (smart valve
          system), and a <strong className="text-cyan-300">capacitor filter</strong> (overhead
          tank).
        </p>
      </motion.div>
    </div>
  );
};
