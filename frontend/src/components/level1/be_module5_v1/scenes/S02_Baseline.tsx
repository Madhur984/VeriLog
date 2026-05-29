import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Power, Shield, Sun as SunIcon, Aperture, Baby } from 'lucide-react';

interface Props { isActive: boolean; isDarkMode: boolean; }
type Bias = 'forward' | 'reverse';

const SPECIALISTS = [
  { Icon: Shield,  color: '#ef4444', name: 'Zener',      job: 'Precision voltage regulation through breakdown.',          tag: 'V_Z regulator' },
  { Icon: SunIcon, color: '#fbbf24', name: 'LED',        job: 'Direct energy conversion for photon emission.',            tag: 'electrical → optical' },
  { Icon: Aperture,color: '#a78bfa', name: 'Photodiode', job: 'High-sensitivity light detection and conversion.',         tag: 'optical → electrical' },
];

export const S02_Baseline: React.FC<Props> = ({ isActive, isDarkMode }) => {
  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText   = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg    = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';

  const [bias, setBias] = useState<Bias>('forward');
  const isForward = bias === 'forward';

  return (
    <div className="max-w-6xl mx-auto space-y-10 py-2">
      <motion.section
        initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        className="space-y-3"
      >
        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.4em] text-cyan-400">
          <Power size={14} /> Step 1 · The Baseline
        </div>
        <h2 className={`text-3xl md:text-5xl font-black ${textColor} tracking-tight`}>
          One door. <span className="text-cyan-300">One way in.</span>
        </h2>
        <p className={`text-base max-w-3xl ${subText}`}>
          The standard P-N junction is a mechanical switch - conducts in forward bias, blocks in
          reverse. Toggle the bias below and watch the depletion zone breathe.
        </p>
      </motion.section>

      {/* Like you're 5 */}
      <motion.div
        initial={{ opacity: 0, y: 8 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.1 }}
        className="rounded-2xl p-5 border-2"
        style={{ borderColor: '#facc1555', background: 'linear-gradient(135deg, rgba(250,204,21,0.10), rgba(34,211,238,0.06))' }}
      >
        <div className="flex items-center gap-2 mb-2">
          <Baby size={16} className="text-yellow-300" />
          <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-yellow-300 font-black">Like you&apos;re 5</div>
        </div>
        <p className={`text-sm ${subText} leading-relaxed`}>
          A normal diode is like a <strong>one-way slide</strong> at the playground. You can slide
          DOWN (forward bias = green light), but you can&apos;t climb back UP the slide (reverse
          bias = blocked). Click the <span className="font-mono text-amber-300">forward / reverse</span> buttons
          and watch the gray &ldquo;wall&rdquo; in the middle get small or big. Small wall = electricity
          flows. Big wall = nothing gets through.
        </p>
      </motion.div>

      {/* Interactive baseline diode */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }} animate={isActive ? { opacity: 1, scale: 1 } : {}}
        transition={{ delay: 0.15 }}
        className={`rounded-3xl border ${cardBg} p-10`}
      >
        <div className="grid lg:grid-cols-[1.3fr_1fr] gap-8 items-center">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-cyan-300 mb-3">
              {isForward ? 'Forward bias - current flows' : 'Reverse bias - current blocked'}
            </div>
            <svg viewBox="0 0 480 170" className="w-full h-auto">
              {/* P region */}
              <rect x="60" y="50" width="160" height="60" fill={isForward ? 'rgba(239,68,68,0.18)' : 'rgba(239,68,68,0.08)'} stroke="#ef4444" strokeWidth="2" />
              <text x="140" y="86" textAnchor="middle" fontSize="22" fontFamily="monospace" fill="#ef4444" fontWeight="bold">P</text>
              {/* N region */}
              <rect x="220" y="50" width="160" height="60" fill={isForward ? 'rgba(34,211,238,0.18)' : 'rgba(34,211,238,0.08)'} stroke="#22d3ee" strokeWidth="2" />
              <text x="300" y="86" textAnchor="middle" fontSize="22" fontFamily="monospace" fill="#22d3ee" fontWeight="bold">N</text>
              {/* Depletion zone */}
              <motion.rect
                animate={{ x: isForward ? 212 : 180, width: isForward ? 16 : 80 }}
                transition={{ type: 'spring', stiffness: 140, damping: 18 }}
                y="50" height="60" fill="rgba(255,255,255,0.08)" stroke="#94a3b8" strokeWidth="1" strokeDasharray="3 3"
              />
              <text x="220" y="40" textAnchor="middle" fontSize="9" fontFamily="monospace" fill="#94a3b8">depletion zone</text>
              {/* Charges in depletion */}
              <text x="200" y="86" textAnchor="middle" fontSize="14" fontFamily="monospace" fill="#fb7185" fontWeight="bold">−</text>
              <text x="240" y="86" textAnchor="middle" fontSize="14" fontFamily="monospace" fill="#a78bfa" fontWeight="bold">+</text>

              {/* Anode label */}
              <text x="30" y="86" textAnchor="middle" fontSize="11" fontFamily="monospace" fill={isDarkMode ? '#fbbf24' : '#b45309'} fontWeight="bold">ANODE</text>
              {/* Cathode label */}
              <text x="420" y="86" textAnchor="middle" fontSize="11" fontFamily="monospace" fill={isDarkMode ? '#fbbf24' : '#b45309'} fontWeight="bold">CATHODE</text>
              {/* External wires */}
              <line x1="0" y1="80" x2="60" y2="80" stroke={isForward ? '#22c55e' : '#475569'} strokeWidth="2.5" />
              <line x1="380" y1="80" x2="480" y2="80" stroke={isForward ? '#22c55e' : '#475569'} strokeWidth="2.5" />

              {/* Current arrow */}
              {isForward && (
                <motion.g
                  animate={{ x: [0, 20, 40] }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                >
                  <polygon points="200,28 218,33 200,38" fill="#22c55e" />
                </motion.g>
              )}
              <text x="220" y="138" textAnchor="middle" fontSize="11" fontFamily="monospace" fill={isDarkMode ? '#cbd5e1' : '#475569'} fontWeight="bold">
                {isForward ? 'FORWARD CONDUCTION →' : '⊘ NO CONDUCTION'}
              </text>
            </svg>
          </div>

          <div className="space-y-4">
            <div className={`rounded-2xl p-5 border ${cardBg}`}>
              <div className="font-mono text-[10px] uppercase tracking-widest text-cyan-300 mb-3">Toggle the bias</div>
              <div className="grid grid-cols-2 gap-2">
                {(['forward', 'reverse'] as const).map((b) => (
                  <button
                    key={b}
                    onClick={() => setBias(b)}
                    className="h-12 rounded-lg font-mono text-xs uppercase tracking-widest font-black border-2 transition-all"
                    style={{
                      borderColor: bias === b ? '#facc15' : 'rgba(255,255,255,0.1)',
                      background: bias === b ? 'rgba(250,204,21,0.15)' : 'transparent',
                      color: bias === b ? '#facc15' : (isDarkMode ? '#94a3b8' : '#64748b'),
                    }}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>
            <div className={`rounded-2xl p-5 border ${cardBg} text-sm ${subText}`}>
              <strong className="text-cyan-300">Behaviour:</strong> the baseline diode either lets
              current pass or doesn&apos;t - purely binary. No regulation, no light, no detection.
              That&apos;s why we need the specialists.
            </div>
          </div>
        </div>
      </motion.div>

      {/* Specialists */}
      <motion.div
        initial={{ opacity: 0, y: 14 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.35 }}
        className={`p-8 rounded-3xl border ${cardBg}`}
      >
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-yellow-300 mb-4">
          The specialists · engineered to exploit phenomena the baseline tries to avoid
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {SPECIALISTS.map((s) => (
            <div
              key={s.name}
              className="rounded-2xl p-5 border-2"
              style={{ borderColor: `${s.color}55`, background: `${s.color}10` }}
            >
              <div className="flex items-center gap-3 mb-3">
                <s.Icon size={22} style={{ color: s.color }} />
                <div>
                  <h3 className={`text-lg font-black ${textColor}`}>{s.name}</h3>
                  <div className="font-mono text-[9px] uppercase tracking-widest" style={{ color: s.color }}>{s.tag}</div>
                </div>
              </div>
              <p className={`text-sm ${subText}`}>{s.job}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Plain English */}
      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.5 }}
        className={`rounded-3xl border ${cardBg} p-6 text-sm ${subText}`}
      >
        <div className="font-mono text-[10px] uppercase tracking-widest text-cyan-300 mb-2">Plain English</div>
        Standard diode = a door that opens one way. Specialist diodes = the same door re-purposed:
        one becomes a pressure-relief valve (Zener), one becomes a light bulb (LED), one becomes a
        light meter (Photodiode). Same physics, different exploit.
      </motion.div>
    </div>
  );
};
