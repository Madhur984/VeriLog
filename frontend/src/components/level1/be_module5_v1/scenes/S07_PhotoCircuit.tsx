import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Aperture, Camera, Baby } from 'lucide-react';

interface Props { isActive: boolean; isDarkMode: boolean; }

export const S07_PhotoCircuit: React.FC<Props> = ({ isActive, isDarkMode }) => {
  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText   = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg    = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';

  const [lux, setLux] = useState(0); // 0 to 100% - incident light intensity

  // Reverse current as a function of light (μA). Dark current ≈ 0.05 μA
  const iRev = 0.05 + (lux / 100) * 600;

  return (
    <div className="max-w-6xl mx-auto space-y-10 py-2">
      <motion.section
        initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        className="space-y-3"
      >
        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.4em] text-violet-300">
          <Aperture size={14} /> Photo · 1 · The Paparazzi Camera
        </div>
        <h2 className={`text-3xl md:text-5xl font-black ${textColor} tracking-tight`}>
          Reverse-bias on duty. <span className="text-violet-300">Light turns into current.</span>
        </h2>
        <p className={`text-base max-w-3xl ${subText}`}>
          The photodiode lives in reverse bias - normally a closed door. But incident photons
          carry enough energy to free minority carriers inside the depletion region, and a tiny
          reverse current <span className="font-mono text-violet-300">I_reverse</span> starts to
          flow. Drag the light slider and watch.
        </p>
      </motion.section>

      {/* Like you're 5 */}
      <motion.div
        initial={{ opacity: 0, y: 8 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.1 }}
        className="rounded-2xl p-5 border-2"
        style={{ borderColor: '#facc1555', background: 'linear-gradient(135deg, rgba(250,204,21,0.10), rgba(168,85,247,0.06))' }}
      >
        <div className="flex items-center gap-2 mb-2">
          <Baby size={16} className="text-yellow-300" />
          <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-yellow-300 font-black">Like you&apos;re 5</div>
        </div>
        <p className={`text-sm ${subText} leading-relaxed`}>
          A photodiode is a <strong>piggy bank that only opens when sunlight hits it</strong>. The
          brighter the sunshine, the more coins (current) drip out per second. In a totally dark
          room, almost no coins fall - but a tiny trickle still leaks out. We call that trickle
          the <span className="font-mono text-violet-300">dark current</span>.
        </p>
        <p className={`mt-2 text-sm ${subText}`}>
          Slide the &ldquo;sun knob&rdquo; on the right. Watch the cone of light grow bigger and
          the green arrow under the diode start to flow. More light → more coins.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }} animate={isActive ? { opacity: 1, scale: 1 } : {}}
        transition={{ delay: 0.15 }}
        className={`rounded-3xl border ${cardBg} p-10 grid lg:grid-cols-[1.3fr_1fr] gap-10 items-center`}
      >
        {/* Circuit + incoming light */}
        <div>
          <div className="font-mono text-[10px] uppercase tracking-widest text-violet-300 mb-3">Reverse-bias photodiode circuit</div>
          <svg viewBox="0 0 460 280" className="w-full h-auto">
            {/* Light cone above the diode */}
            <motion.g
              animate={{ opacity: lux / 100 }}
              transition={{ duration: 0.4 }}
            >
              <path d="M 130 0 L 170 40 L 230 40 L 270 0 Z" fill="url(#lightCone)" opacity="0.5" />
              <defs>
                <linearGradient id="lightCone" x1="0.5" y1="0" x2="0.5" y2="1">
                  <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#fbbf24" stopOpacity="0.1" />
                </linearGradient>
              </defs>
              {/* light arrows */}
              {[160, 180, 200, 220, 240].map((x, idx) => (
                <motion.g key={x}
                  animate={{ y: [0, 20, 0] }}
                  transition={{ duration: 1.2, repeat: Infinity, delay: idx * 0.12 }}
                >
                  <line x1={x} y1="0" x2={x} y2="35" stroke="#fbbf24" strokeWidth="1.5" />
                  <polygon points={`${x - 3},33 ${x + 3},33 ${x},40`} fill="#fbbf24" />
                </motion.g>
              ))}
            </motion.g>

            {/* Photodiode (p|n) */}
            <g transform="translate(160, 60)">
              <rect x="0" y="0" width="80" height="30" fill="rgba(168,85,247,0.15)" stroke="#a78bfa" strokeWidth="2" />
              <line x1="40" y1="0" x2="40" y2="30" stroke="#a78bfa" strokeWidth="1.5" strokeDasharray="3 3" />
              <text x="20" y="20" textAnchor="middle" fontSize="13" fontFamily="monospace" fill="#a78bfa" fontWeight="bold">p</text>
              <text x="60" y="20" textAnchor="middle" fontSize="13" fontFamily="monospace" fill="#a78bfa" fontWeight="bold">n</text>
              <text x="80" y="48" fontSize="11" fontFamily="monospace" fill={isDarkMode ? '#cbd5e1' : '#475569'} fontWeight="bold">+</text>
              <text x="-10" y="48" fontSize="11" fontFamily="monospace" fill={isDarkMode ? '#cbd5e1' : '#475569'} fontWeight="bold">−</text>
            </g>

            {/* I_reverse arrow underneath */}
            <line x1="160" y1="110" x2="240" y2="110" stroke={lux > 0 ? '#22c55e' : '#475569'} strokeWidth="2" />
            <motion.polygon
              points="220,106 230,110 220,114"
              fill={lux > 0 ? '#22c55e' : '#475569'}
              animate={{ x: lux > 0 ? [0, 6, 0] : 0 }}
              transition={{ duration: 1.0, repeat: Infinity }}
            />
            <text x="200" y="128" textAnchor="middle" fontSize="11" fontFamily="monospace" fill={lux > 0 ? '#22c55e' : '#475569'}>I_reverse</text>

            {/* Connecting wires */}
            <line x1="160" y1="75" x2="80" y2="75" stroke={lux > 0 ? '#22c55e' : '#475569'} strokeWidth="2" />
            <line x1="80" y1="75" x2="80" y2="190" stroke={lux > 0 ? '#22c55e' : '#475569'} strokeWidth="2" />
            <line x1="240" y1="75" x2="350" y2="75" stroke={lux > 0 ? '#22c55e' : '#475569'} strokeWidth="2" />

            {/* Load resistor R */}
            <g transform="translate(335, 130)">
              <rect x="0" y="-10" width="30" height="50" fill="rgba(251,191,36,0.18)" stroke="#fbbf24" strokeWidth="2" />
              <text x="15" y="20" textAnchor="middle" fontSize="11" fontFamily="monospace" fill="#fbbf24" fontWeight="bold">R</text>
            </g>
            <line x1="350" y1="75" x2="350" y2="120" stroke={lux > 0 ? '#22c55e' : '#475569'} strokeWidth="2" />
            <line x1="350" y1="170" x2="350" y2="220" stroke={lux > 0 ? '#22c55e' : '#475569'} strokeWidth="2" />
            <line x1="350" y1="220" x2="200" y2="220" stroke={lux > 0 ? '#22c55e' : '#475569'} strokeWidth="2" />

            {/* Battery V (reverse-bias source) */}
            <g transform="translate(190, 200)">
              {/* − long, + short */}
              <line x1="0" y1="-12" x2="0" y2="12" stroke={isDarkMode ? '#cbd5e1' : '#475569'} strokeWidth="3" />
              <line x1="8" y1="-6" x2="8" y2="6" stroke={isDarkMode ? '#cbd5e1' : '#475569'} strokeWidth="2" />
              <text x="-14" y="4" fontSize="11" fontFamily="monospace" fill={isDarkMode ? '#cbd5e1' : '#475569'} fontWeight="bold">−</text>
              <text x="14" y="4" fontSize="11" fontFamily="monospace" fill={isDarkMode ? '#cbd5e1' : '#475569'} fontWeight="bold">+</text>
              <text x="0" y="36" textAnchor="middle" fontSize="11" fontFamily="monospace" fill={isDarkMode ? '#cbd5e1' : '#475569'}>V</text>
            </g>
            <line x1="80" y1="190" x2="190" y2="190" stroke={lux > 0 ? '#22c55e' : '#475569'} strokeWidth="2" />
            <line x1="198" y1="200" x2="200" y2="200" stroke={lux > 0 ? '#22c55e' : '#475569'} strokeWidth="2" />
            <line x1="200" y1="200" x2="200" y2="220" stroke={lux > 0 ? '#22c55e' : '#475569'} strokeWidth="2" />

            {/* Output label */}
            <text x="230" y="260" textAnchor="middle" fontSize="12" fontFamily="monospace"
                  fill={lux > 0 ? '#22c55e' : '#fb7185'} fontWeight="bold">
              {lux > 0 ? `I_reverse ≈ ${iRev.toFixed(1)} μA` : 'Dark current only (≈ 0.05 μA)'}
            </text>
          </svg>
        </div>

        {/* Controls + readout */}
        <div className="space-y-4">
          <div className={`rounded-2xl p-5 border ${cardBg}`}>
            <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-violet-300 mb-2">
              <span>Incident illumination</span>
              <span>{lux} %</span>
            </div>
            <input
              type="range" min={0} max={100} step={1}
              value={lux}
              onChange={(e) => setLux(parseInt(e.target.value))}
              className="w-full accent-violet-400"
            />
            <div className="flex justify-between text-[10px] font-mono mt-1 opacity-50">
              <span>Dark</span>
              <span>Indoor</span>
              <span>Studio flash</span>
            </div>
          </div>

          <div className={`rounded-2xl p-5 border ${cardBg} space-y-2`}>
            <div className="font-mono text-[10px] uppercase tracking-widest text-violet-300">Live readout</div>
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-lg p-3 border border-violet-400/30 bg-violet-400/5 text-center">
                <div className="font-mono text-[9px] uppercase tracking-widest opacity-60">I_reverse</div>
                <div className="font-mono font-black text-lg" style={{ color: '#a78bfa' }}>{iRev.toFixed(1)} μA</div>
              </div>
              <div className="rounded-lg p-3 border border-slate-400/30 bg-slate-400/5 text-center">
                <div className="font-mono text-[9px] uppercase tracking-widest opacity-60">Dark floor</div>
                <div className="font-mono font-black text-lg text-slate-400">0.05 μA</div>
              </div>
            </div>
          </div>

          <div className={`rounded-2xl p-5 border ${cardBg} text-sm ${subText} flex items-start gap-3`}>
            <Camera size={18} className="text-violet-300 shrink-0 mt-0.5" />
            <div>
              <strong className="text-violet-300">Mental model:</strong> a camera shutter that
              opens just enough current to be measured. The brighter the scene, the wider it
              opens - but never fully off, because of dark current.
            </div>
          </div>
        </div>
      </motion.div>

      {/* Two definitions */}
      <div className="grid md:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4 }}
          className={`rounded-2xl border ${cardBg} p-6`}
        >
          <div className="font-mono text-[10px] uppercase tracking-widest text-violet-300 mb-2">Reverse-bias photodiode</div>
          <p className={`text-sm ${subText}`}>A semiconductor device limited to the reverse-bias region, where incident light (photons) transfers energy to the atomic structure, generating minority carriers.</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5 }}
          className={`rounded-2xl border ${cardBg} p-6`}
        >
          <div className="font-mono text-[10px] uppercase tracking-widest text-violet-300 mb-2">Dark current</div>
          <p className={`text-sm ${subText}`}>The minimal current existing with no applied illumination, due to thermally generated minority carriers. Sets the noise floor of every optical sensor.</p>
        </motion.div>
      </div>

      {/* Plain English + opposite of LED */}
      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.55 }}
        className={`rounded-3xl border ${cardBg} p-6 space-y-3`}
      >
        <div className="font-mono text-[10px] uppercase tracking-widest text-violet-300">Plain English</div>
        <p className={`text-sm ${subText}`}>
          The photodiode is the LED played backwards. An LED takes electrical energy and emits
          photons. A photodiode takes incoming photons and converts them to a tiny reverse current.
          Same junction, opposite energy direction.
        </p>
        <p className={`text-sm ${subText}`}>
          The reverse bias isn&apos;t there to drive current - it&apos;s there to widen the
          depletion region so that more photons land inside the &ldquo;catch zone&rdquo; where
          they can liberate carriers.
        </p>
      </motion.div>

      {/* Real world */}
      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.6 }}
        className={`rounded-3xl border ${cardBg} p-6`}
      >
        <div className="font-mono text-[10px] uppercase tracking-widest text-violet-300 mb-2">Where you&apos;ll meet this</div>
        <ul className={`text-sm ${subText} space-y-1`}>
          <li>▸ Phone camera sensors (millions of tiny photodiodes in a grid).</li>
          <li>▸ Pulse-oximeter on your finger (red + IR photodiode pair).</li>
          <li>▸ Fiber-optic communications receivers (gigabit speeds).</li>
          <li>▸ TV remote receivers · barcode scanners · solar cells (which are photodiodes operated without reverse bias).</li>
        </ul>
      </motion.div>
    </div>
  );
};
