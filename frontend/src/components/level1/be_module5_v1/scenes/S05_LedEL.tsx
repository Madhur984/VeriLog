import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun as SunIcon, Play, Pause, Baby } from 'lucide-react';

interface Props { isActive: boolean; isDarkMode: boolean; }

// Map band-gap energy (eV) → wavelength (nm) → CSS color
function egToColor(eg: number) {
  const wavelength = 1240 / eg; // nm
  if (wavelength > 700) return { color: '#7f1d1d', name: 'Infrared', wavelength };
  if (wavelength > 620) return { color: '#dc2626', name: 'Red',       wavelength };
  if (wavelength > 590) return { color: '#fb923c', name: 'Orange',    wavelength };
  if (wavelength > 570) return { color: '#fbbf24', name: 'Yellow',    wavelength };
  if (wavelength > 495) return { color: '#22c55e', name: 'Green',     wavelength };
  if (wavelength > 450) return { color: '#3b82f6', name: 'Blue',      wavelength };
  if (wavelength > 380) return { color: '#a855f7', name: 'Violet',    wavelength };
  return { color: '#c084fc', name: 'Ultraviolet', wavelength };
}

export const S05_LedEL: React.FC<Props> = ({ isActive, isDarkMode }) => {
  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText   = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg    = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';

  const [eg, setEg] = useState(2.0);   // band gap (eV)
  const [biased, setBiased] = useState(true);
  const photon = egToColor(eg);

  return (
    <div className="max-w-6xl mx-auto space-y-10 py-2">
      <motion.section
        initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        className="space-y-3"
      >
        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.4em] text-amber-300">
          <SunIcon size={14} /> LED · 1 · Electroluminescence
        </div>
        <h2 className={`text-3xl md:text-5xl font-black ${textColor} tracking-tight`}>
          When a hole eats an electron, <span className="text-amber-300">light is born.</span>
        </h2>
        <p className={`text-base max-w-3xl ${subText}`}>
          In forward bias the electron from the conduction band falls into a hole in the valence
          band. The energy difference - exactly the band gap{' '}
          <span className="font-mono text-amber-300">E_g</span> - leaves as a photon. Wavelength{' '}
          <span className="font-mono text-amber-300">λ = h·c / E_g</span>.
        </p>
      </motion.section>

      {/* Like you're 5 */}
      <motion.div
        initial={{ opacity: 0, y: 8 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.1 }}
        className="rounded-2xl p-5 border-2"
        style={{ borderColor: '#facc1555', background: 'linear-gradient(135deg, rgba(250,204,21,0.10), rgba(251,146,60,0.06))' }}
      >
        <div className="flex items-center gap-2 mb-2">
          <Baby size={16} className="text-yellow-300" />
          <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-yellow-300 font-black">Like you&apos;re 5</div>
        </div>
        <p className={`text-sm ${subText} leading-relaxed`}>
          Think of a <strong>bunk bed</strong>. The blue circle (electron) is sitting on the top
          bunk. The pink circle (hole) is an empty spot on the bottom bunk. When the electron
          jumps DOWN to fill the hole, it has extra energy from the fall - and it lets that
          energy out as a <strong>tiny flash of light</strong> (the photon).
        </p>
        <p className={`mt-2 text-sm ${subText}`}>
          The taller the bunk bed (<span className="font-mono text-amber-300">E_g</span>), the
          stronger the flash → bluer light. Short bunk bed → softer flash → redder light. Drag the
          slider to change the bed height and watch the photon&apos;s colour change.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }} animate={isActive ? { opacity: 1, scale: 1 } : {}}
        transition={{ delay: 0.15 }}
        className={`rounded-3xl border ${cardBg} p-10 grid lg:grid-cols-[1.3fr_1fr] gap-8 items-center`}
      >
        {/* Band-gap animation */}
        <div>
          <div className="font-mono text-[10px] uppercase tracking-widest text-amber-300 mb-3">
            Electroluminescence process · {biased ? 'recombining…' : 'paused'}
          </div>
          <svg viewBox="0 0 460 250" className="w-full h-auto">
            {/* Conduction band */}
            <line x1="20" y1="60" x2="440" y2="60" stroke={isDarkMode ? '#cbd5e1' : '#475569'} strokeWidth="2" />
            <text x="20" y="50" fontSize="11" fontFamily="monospace" fill={isDarkMode ? '#cbd5e1' : '#475569'}>Conduction Band (E_c)</text>

            {/* Valence band */}
            <line x1="20" y1="200" x2="440" y2="200" stroke={isDarkMode ? '#cbd5e1' : '#475569'} strokeWidth="2" />
            <text x="20" y="222" fontSize="11" fontFamily="monospace" fill={isDarkMode ? '#cbd5e1' : '#475569'}>Valence Band (E_v)</text>

            {/* Band gap label */}
            <line x1="370" y1="60" x2="370" y2="200" stroke={photon.color} strokeWidth="1" strokeDasharray="3 3" />
            <text x="378" y="135" fontSize="11" fontFamily="monospace" fill={photon.color} fontWeight="bold">E_g = {eg.toFixed(2)} eV</text>

            {/* Electron (top band) */}
            <AnimatePresence mode="wait">
              {biased && (
                <motion.g
                  key={`e-${eg}`}
                  initial={{ y: 0, opacity: 1 }}
                  animate={{ y: 140, opacity: [1, 1, 0] }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: 'easeIn' }}
                >
                  <circle cx="160" cy="60" r="9" fill="#22d3ee" stroke="#0ea5e9" strokeWidth="2" />
                  <text x="160" y="64" textAnchor="middle" fontSize="10" fontFamily="monospace" fill="#0a0e1a" fontWeight="bold">e⁻</text>
                </motion.g>
              )}
            </AnimatePresence>

            {/* Hole (bottom band) */}
            <AnimatePresence mode="wait">
              {biased && (
                <motion.g
                  key={`h-${eg}`}
                  initial={{ y: 0, opacity: 1 }}
                  animate={{ y: -140, opacity: [1, 1, 0] }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: 'easeOut' }}
                >
                  <circle cx="160" cy="200" r="9" fill="none" stroke="#fb7185" strokeWidth="2" strokeDasharray="2 2" />
                  <text x="160" y="204" textAnchor="middle" fontSize="10" fontFamily="monospace" fill="#fb7185" fontWeight="bold">h⁺</text>
                </motion.g>
              )}
            </AnimatePresence>

            {/* Photon emission - wavy line */}
            {biased && (
              <motion.g
                animate={{ x: [0, 80], opacity: [0, 1, 0] }}
                transition={{ duration: 2.2, repeat: Infinity, delay: 1.1 }}
              >
                <path d="M 160 130 q 8 -10 16 0 t 16 0 t 16 0 t 16 0 t 16 0"
                      stroke={photon.color}
                      strokeWidth="2.5"
                      fill="none"
                      style={{ filter: `drop-shadow(0 0 6px ${photon.color})` }} />
                <text x="250" y="124" fontSize="11" fontFamily="monospace" fill={photon.color} fontWeight="bold">Photon ({photon.name})</text>
              </motion.g>
            )}
          </svg>
        </div>

        {/* LED visual with glow */}
        <div className="space-y-4">
          <div className={`rounded-3xl p-8 border ${cardBg} flex flex-col items-center gap-4 relative overflow-hidden`}>
            {/* Glow halo */}
            {biased && (
              <motion.div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: `radial-gradient(circle at 50% 50%, ${photon.color}66, transparent 60%)`,
                }}
                animate={{ opacity: [0.4, 0.9, 0.4] }}
                transition={{ duration: 1.6, repeat: Infinity }}
              />
            )}
            <svg viewBox="0 0 140 110" className="w-44 h-32 relative z-10">
              <polygon points="40,30 80,55 40,80" fill={biased ? `${photon.color}55` : 'rgba(100,116,139,0.20)'} stroke={biased ? photon.color : '#475569'} strokeWidth="2.5" />
              <line x1="80" y1="28" x2="80" y2="82" stroke={biased ? photon.color : '#475569'} strokeWidth="3" />
              {biased && (
                <g stroke={photon.color} strokeWidth="2" fill="none">
                  <motion.path d="M 90 30 L 110 18" animate={{ opacity: [0.2, 1, 0.2] }} transition={{ duration: 1.2, repeat: Infinity }} />
                  <motion.path d="M 96 50 L 124 50" animate={{ opacity: [0.2, 1, 0.2] }} transition={{ duration: 1.2, repeat: Infinity, delay: 0.2 }} />
                  <motion.path d="M 90 76 L 110 92" animate={{ opacity: [0.2, 1, 0.2] }} transition={{ duration: 1.2, repeat: Infinity, delay: 0.4 }} />
                </g>
              )}
            </svg>
            <div className="font-mono text-[10px] uppercase tracking-widest" style={{ color: photon.color }}>
              {biased ? `Emitting · λ ≈ ${photon.wavelength.toFixed(0)} nm` : 'Forward bias OFF'}
            </div>
          </div>

          <div className={`rounded-2xl p-5 border ${cardBg}`}>
            <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-amber-300 mb-2">
              <span>Band-gap E_g</span>
              <span>{eg.toFixed(2)} eV</span>
            </div>
            <input
              type="range" min={1.6} max={3.4} step={0.05}
              value={eg}
              onChange={(e) => setEg(parseFloat(e.target.value))}
              className="w-full accent-amber-300"
            />
            <div className="flex justify-between text-[10px] font-mono mt-1 opacity-50">
              <span>Red (1.6)</span>
              <span>Green (~2.3)</span>
              <span>Violet (3.4)</span>
            </div>
          </div>

          <button
            onClick={() => setBiased((v) => !v)}
            className="w-full h-11 rounded-lg font-mono text-xs uppercase tracking-widest font-black border-2 transition-all flex items-center justify-center gap-2"
            style={{
              borderColor: biased ? '#22c55e' : '#475569',
              background: biased ? 'rgba(34,197,94,0.15)' : 'rgba(100,116,139,0.10)',
              color: biased ? '#22c55e' : '#94a3b8',
            }}
          >
            {biased ? <><Pause size={14} /> Bias active - pause</> : <><Play size={14} /> Bias OFF - resume</>}
          </button>
        </div>
      </motion.div>

      {/* Definitions */}
      <div className="grid md:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4 }}
          className={`rounded-2xl border ${cardBg} p-6`}
        >
          <div className="font-mono text-[10px] uppercase tracking-widest text-amber-300 mb-2">Electroluminescence</div>
          <p className={`text-sm ${subText}`}>The recombination of holes and electrons in a forward-biased P-N junction, requiring that the energy possessed by the unbound free electrons be transferred and emitted as photons.</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5 }}
          className={`rounded-2xl border ${cardBg} p-6`}
        >
          <div className="font-mono text-[10px] uppercase tracking-widest text-amber-300 mb-2">Energy Band Gap (E_g)</div>
          <p className={`text-sm ${subText}`}>Dictates the frequency and wavelength of the emitted light:{' '}
            <span className="font-mono text-amber-300">λ = h·c / E_g</span>. Bigger gap → bluer photon. Smaller gap → redder photon.</p>
        </motion.div>
      </div>

      {/* Plain English + math walkthrough */}
      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.55 }}
        className={`rounded-3xl border ${cardBg} p-6 space-y-3`}
      >
        <div className="font-mono text-[10px] uppercase tracking-widest text-amber-300">Plain English</div>
        <p className={`text-sm ${subText}`}>
          When you forward-bias an LED, electrons in the conduction band have nowhere to sit until
          they tumble down into a hole. That tumble releases exactly <em>E_g</em> worth of energy.
          Nature can&apos;t store that energy in the crystal, so it shoots out as a photon. The
          fixed energy step is why each LED has one specific colour.
        </p>
        <div className={`rounded-xl p-3 border ${cardBg} font-mono text-xs ${textColor}`}>
          λ (nm) ≈ 1240 / E_g (eV)
          &nbsp; ⇒ &nbsp; current E_g = {eg.toFixed(2)} eV
          &nbsp; → &nbsp; λ ≈ {photon.wavelength.toFixed(0)} nm
          &nbsp; ({photon.name})
        </div>
      </motion.div>

      {/* Real-world */}
      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.6 }}
        className={`rounded-3xl border ${cardBg} p-6`}
      >
        <div className="font-mono text-[10px] uppercase tracking-widest text-amber-300 mb-2">Where you&apos;ll meet this</div>
        <ul className={`text-sm ${subText} space-y-1`}>
          <li>▸ Every status indicator on every device you own.</li>
          <li>▸ LED display backlights - white LEDs are blue LEDs coated with yellow phosphor.</li>
          <li>▸ Infrared remotes (E_g chosen for invisible IR).</li>
          <li>▸ Laser diodes (same physics, narrower spectral width).</li>
        </ul>
      </motion.div>
    </div>
  );
};
