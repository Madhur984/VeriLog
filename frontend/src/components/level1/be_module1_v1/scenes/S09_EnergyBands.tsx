import React from 'react';
import { motion } from 'framer-motion';
import { Building2, Layers3, AlertOctagon } from 'lucide-react';

interface Props { isActive: boolean; isDarkMode: boolean; }

export const S09_EnergyBands: React.FC<Props> = ({ isActive, isDarkMode }) => {
  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';

  return (
    <div className="max-w-6xl mx-auto space-y-12 py-4">
      <section className="space-y-3">
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.4em] uppercase text-indigo-400">
          <Building2 size={14} /> Chapter 09 · Energy Bands
        </div>
        <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>The 3-Tier City</h2>
        <p className={`text-base max-w-3xl ${subText}`}>
          Knowing where electrons sit is only half the story. We also need to plot{' '}
          <strong>how much energy</strong> each one carries. The energy axis is best pictured as a
          three-tier city: a crowded gully, a forbidden zone, and an elevated expressway.
        </p>
      </section>

      {/* The big city diagram */}
      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        className={`p-8 rounded-3xl border ${cardBg} relative overflow-hidden`}
      >
        <svg viewBox="0 0 800 480" className="w-full">
          <defs>
            <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#312e81" />
              <stop offset="100%" stopColor="#1e1b4b" />
            </linearGradient>
            <linearGradient id="gully" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#9333ea" />
              <stop offset="100%" stopColor="#581c87" />
            </linearGradient>
            <linearGradient id="exp" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0ea5e9" />
              <stop offset="100%" stopColor="#0c4a6e" />
            </linearGradient>
          </defs>

          {/* Sky */}
          <rect x="0" y="0" width="800" height="480" fill="url(#sky)" />

          {/* Conduction band — elevated expressway */}
          <rect x="0" y="60" width="800" height="80" fill="url(#exp)" opacity="0.92" />
          <text x="20" y="50" fontFamily="monospace" fontSize="14" fontWeight="900" fill="#7dd3fc">CONDUCTION BAND</text>
          <text x="20" y="155" fontFamily="monospace" fontSize="11" fill="#bae6fd">High energy · free flow · creates current</text>

          {/* Cars on the expressway */}
          {[
            { x: 80, y: 90, c: '#f97316' },
            { x: 220, y: 90, c: '#ec4899' },
            { x: 380, y: 90, c: '#fcd34d' },
            { x: 540, y: 90, c: '#10b981' },
            { x: 680, y: 90, c: '#22d3ee' },
          ].map((car, i) => (
            <motion.g
              key={i}
              animate={{ x: [0, 700] }}
              transition={{ duration: 6 + i, repeat: Infinity, ease: 'linear', delay: i * 0.5 }}
            >
              <rect x={car.x - 700 - i * 100} y={car.y} width="40" height="20" rx="4" fill={car.c} />
              <circle cx={car.x - 700 - i * 100 + 8} cy={car.y + 22} r="4" fill="#1e293b" />
              <circle cx={car.x - 700 - i * 100 + 32} cy={car.y + 22} r="4" fill="#1e293b" />
            </motion.g>
          ))}

          {/* Pylons holding up the expressway */}
          {[80, 240, 400, 560, 720].map((x, i) => (
            <rect key={i} x={x} y="140" width="14" height="120" fill="#1e293b" />
          ))}

          {/* The gap (forbidden zone) */}
          <rect x="0" y="200" width="800" height="100" fill="rgba(244,63,94,0.08)" />
          <line x1="0" y1="200" x2="800" y2="200" stroke="#f43f5e" strokeWidth="1" strokeDasharray="6 4" />
          <line x1="0" y1="300" x2="800" y2="300" stroke="#f43f5e" strokeWidth="1" strokeDasharray="6 4" />
          <text x="400" y="245" textAnchor="middle" fontFamily="monospace" fontSize="14" fontWeight="900" fill="#f43f5e">⚠  FORBIDDEN ZONE · ENERGY GAP (Eg)  ⚠</text>
          <text x="400" y="270" textAnchor="middle" fontFamily="monospace" fontSize="10" fill="#fda4af">No electron can exist here</text>

          {/* Toll booth icon */}
          <g transform="translate(380, 175)">
            <rect x="0" y="0" width="40" height="30" rx="3" fill="#fcd34d" />
            <rect x="6" y="6" width="28" height="14" fill="#1e293b" />
            <text x="20" y="50" textAnchor="middle" fontFamily="monospace" fontSize="9" fontWeight="900" fill="#fcd34d">TOLL · Eg eV</text>
          </g>

          {/* Valence band — crowded gully */}
          <rect x="0" y="320" width="800" height="120" fill="url(#gully)" opacity="0.88" />
          <text x="20" y="312" fontFamily="monospace" fontSize="14" fontWeight="900" fill="#fbcfe8">VALENCE BAND</text>
          <text x="20" y="455" fontFamily="monospace" fontSize="11" fill="#fbcfe8">Low energy · crowded · electrons bound to parent atoms</text>

          {/* Buildings / stalls in the gully */}
          {[40, 100, 160, 220, 280, 340, 400, 460, 520, 580, 640, 700].map((x, i) => {
            const h = 30 + ((i * 23) % 40);
            return <rect key={i} x={x} y={440 - h} width="40" height={h} fill="#7c3aed" opacity="0.7" />;
          })}

          {/* Crowd of electrons in valence band */}
          {Array.from({ length: 24 }).map((_, i) => {
            const x = 30 + (i * 33) % 760;
            const y = 360 + (i % 3) * 18;
            return <circle key={i} cx={x} cy={y} r="4" fill="#fbcfe8" opacity="0.85" />;
          })}

          {/* An electron jumping the gap (occasional) */}
          <motion.circle
            r="6" fill="#fde68a"
            animate={{
              cx: [200, 200, 200, 200],
              cy: [360, 360, 360, 100],
              opacity: [1, 1, 1, 0],
            }}
            transition={{ duration: 4, repeat: Infinity, times: [0, 0.4, 0.6, 1] }}
            style={{ filter: 'drop-shadow(0 0 6px #fde68a)' }}
          />
        </svg>
      </motion.div>

      {/* Three labels */}
      <div className="grid md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.15 }}
          className={`p-6 rounded-3xl border-2 ${cardBg}`}
          style={{ borderColor: 'rgba(14,165,233,0.4)' }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Layers3 size={14} className="text-sky-400" />
            <div className="font-mono text-[10px] uppercase tracking-widest text-sky-400">Conduction Band</div>
          </div>
          <h3 className={`text-lg font-black mb-2 ${textColor}`}>The Expressway</h3>
          <p className={`text-[13px] leading-relaxed ${subText}`}>
            High-energy electrons that have escaped their parent atoms. Free to drift under any
            applied field. <strong className="text-sky-300">These are the carriers that create current.</strong>
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.25 }}
          className={`p-6 rounded-3xl border-2 ${cardBg}`}
          style={{ borderColor: 'rgba(244,63,94,0.4)' }}
        >
          <div className="flex items-center gap-2 mb-2">
            <AlertOctagon size={14} className="text-rose-400" />
            <div className="font-mono text-[10px] uppercase tracking-widest text-rose-400">Energy Gap (Eg)</div>
          </div>
          <h3 className={`text-lg font-black mb-2 ${textColor}`}>The Forbidden Zone</h3>
          <p className={`text-[13px] leading-relaxed ${subText}`}>
            The strict price of admission to reach the expressway. No electron can exist with an
            energy <em>inside</em> this band. Either you have enough to cross or you stay in the gully.
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.35 }}
          className={`p-6 rounded-3xl border-2 ${cardBg}`}
          style={{ borderColor: 'rgba(168,85,247,0.4)' }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Building2 size={14} className="text-fuchsia-400" />
            <div className="font-mono text-[10px] uppercase tracking-widest text-fuchsia-400">Valence Band</div>
          </div>
          <h3 className={`text-lg font-black mb-2 ${textColor}`}>The Gully</h3>
          <p className={`text-[13px] leading-relaxed ${subText}`}>
            Low-energy, crowded. Electrons are <em>bound</em> to their parent atoms via covalent bonds —
            they participate in chemistry but not in current.
          </p>
        </motion.div>
      </div>
    </div>
  );
};
