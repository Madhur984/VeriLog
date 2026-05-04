import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Coins, BatteryCharging, Calculator } from 'lucide-react';

interface Props { isActive: boolean; isDarkMode: boolean; }

export const S10_PayingToll: React.FC<Props> = ({ isActive, isDarkMode }) => {
  const [voltage, setVoltage] = useState(1);

  const energyJ = voltage * 1.6e-19;
  const energyEV = voltage; // 1V applied → 1eV per electron

  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';

  return (
    <div className="max-w-6xl mx-auto space-y-12 py-4">
      <section className="space-y-3">
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.4em] uppercase text-indigo-400">
          <Coins size={14} /> Chapter 10 · The Currency
        </div>
        <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>Paying the Toll · the Electron-Volt</h2>
        <p className={`text-base max-w-3xl ${subText}`}>
          You cannot exist in the gap. To reach the expressway you must arrive with the{' '}
          <strong>exact</strong> energy of admission, paid in <strong className="text-indigo-300">electron-volts</strong>.
        </p>
      </section>

      {/* The toll booth illustration */}
      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        className={`p-8 rounded-3xl border ${cardBg} relative overflow-hidden`}
      >
        <svg viewBox="0 0 800 320" className="w-full">
          <defs>
            <linearGradient id="ground" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#7c3aed" />
              <stop offset="100%" stopColor="#4c1d95" />
            </linearGradient>
          </defs>
          {/* sky */}
          <rect x="0" y="0" width="800" height="220" fill="#1e1b4b" />
          {/* road */}
          <rect x="0" y="220" width="800" height="100" fill="url(#ground)" />
          <line x1="0" y1="270" x2="800" y2="270" stroke="#fde68a" strokeWidth="2" strokeDasharray="20 14" />

          {/* Booth */}
          <g transform="translate(380, 100)">
            {/* roof */}
            <polygon points="-30,0 70,0 60,-25 -20,-25" fill="#dc2626" />
            <polygon points="-20,-25 60,-25 60,-15 -20,-15" fill="#fcd34d" />
            {/* booth body */}
            <rect x="0" y="0" width="40" height="120" fill="#fb923c" />
            <rect x="6" y="10" width="28" height="40" fill="#1e293b" />
            {/* attendant */}
            <circle cx="20" cy="30" r="6" fill="#fde68a" />
            {/* sign */}
            <rect x="-50" y="-10" width="50" height="22" rx="3" fill="#fcd34d" />
            <text x="-25" y="5" textAnchor="middle" fontFamily="monospace" fontSize="9" fontWeight="900" fill="#0f172a">
              PRICE: {voltage} eV
            </text>
          </g>

          {/* Barrier */}
          <line
            x1="380" y1="180" x2="500" y2="180"
            stroke="#dc2626" strokeWidth="6" strokeLinecap="round"
          />
          <circle cx="500" cy="180" r="6" fill="#dc2626" />

          {/* Electron approaching the booth */}
          <motion.g
            animate={{ x: [0, 280, 280, 280, 600] }}
            transition={{
              duration: 5, repeat: Infinity,
              times: [0, 0.4, 0.6, 0.8, 1],
              ease: 'linear',
            }}
          >
            <circle cx="60" cy="245" r="14" fill="#22d3ee" style={{ filter: 'drop-shadow(0 0 8px #22d3ee)' }} />
            <text x="60" y="250" textAnchor="middle" fontFamily="monospace" fontSize="10" fontWeight="900" fill="#0f172a">e⁻</text>
            {/* legs */}
            <line x1="55" y1="260" x2="50" y2="270" stroke="#22d3ee" strokeWidth="2" />
            <line x1="65" y1="260" x2="70" y2="270" stroke="#22d3ee" strokeWidth="2" />
          </motion.g>

          {/* Coin being paid */}
          <motion.g
            animate={{
              opacity: [0, 0, 1, 1, 0],
              y: [0, 0, -20, 0, 0],
            }}
            transition={{ duration: 5, repeat: Infinity, times: [0, 0.4, 0.5, 0.6, 0.65] }}
          >
            <circle cx="360" cy="200" r="10" fill="#fcd34d" stroke="#a16207" strokeWidth="1.5" />
            <text x="360" y="204" textAnchor="middle" fontFamily="monospace" fontSize="9" fontWeight="900" fill="#0f172a">eV</text>
          </motion.g>

          {/* Labels */}
          <text x="60" y="295" fontFamily="monospace" fontSize="10" fill="#fda4af">VALENCE BAND (Gully)</text>
          <text x="650" y="295" fontFamily="monospace" fontSize="10" fill="#bae6fd" textAnchor="end">CONDUCTION BAND (Expressway)</text>
        </svg>
      </motion.div>

      {/* Voltage slider + numeric panel */}
      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.1 }}
        className={`p-6 rounded-3xl border ${cardBg}`}
      >
        <div className="flex items-center gap-3 mb-5">
          <BatteryCharging size={14} className="text-indigo-400" />
          <span className="font-mono text-[10px] uppercase tracking-widest text-indigo-400">
            Apply a potential difference (V)
          </span>
          <span className="ml-auto font-mono text-sm font-black text-indigo-300">{voltage} V</span>
        </div>
        <input
          type="range"
          min={0}
          max={10}
          step={0.1}
          value={voltage}
          onChange={(e) => setVoltage(Number(e.target.value))}
          className="w-full accent-indigo-400"
        />

        <div className="grid md:grid-cols-3 gap-4 mt-6">
          <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-black/30 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
            <div className="font-mono text-[10px] uppercase tracking-widest text-indigo-400 mb-1">Energy in eV</div>
            <div className="font-mono text-2xl font-black text-indigo-300">{energyEV.toFixed(2)} eV</div>
          </div>
          <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-black/30 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
            <div className="font-mono text-[10px] uppercase tracking-widest text-indigo-400 mb-1">Same energy in Joules</div>
            <div className="font-mono text-base font-black text-indigo-300">{energyJ.toExponential(2)} J</div>
          </div>
          <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-black/30 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
            <div className="font-mono text-[10px] uppercase tracking-widest text-indigo-400 mb-1">Si Eg = 1.1 eV</div>
            <div className={`font-mono text-base font-black ${energyEV >= 1.1 ? 'text-emerald-300' : 'text-rose-300'}`}>
              {energyEV >= 1.1 ? '✓ Crosses!' : '✗ Stays in gully'}
            </div>
          </div>
        </div>
      </motion.div>

      {/* The currency definition */}
      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.2 }}
        className={`p-8 rounded-3xl border ${cardBg}`}
      >
        <div className="flex items-center gap-2 mb-4">
          <Calculator size={14} className="text-indigo-400" />
          <span className="font-mono text-[10px] uppercase tracking-widest text-indigo-400">The currency · 1 eV</span>
        </div>
        <div className="grid md:grid-cols-[1fr_auto_1fr] items-center gap-6">
          <div className={`text-base leading-relaxed ${textColor}`}>
            One electron-volt is the kinetic energy gained by a single electron after falling through a
            <strong> one-volt</strong> potential difference.
          </div>
          <div className="text-center">
            <div className="font-mono text-3xl md:text-4xl font-black text-indigo-300">
              1 eV = 1.6 × 10⁻¹⁹ J
            </div>
          </div>
          <div className={`text-[13px] leading-relaxed ${subText}`}>
            Joules are too big for atomic events. The electron-volt is the natural unit of the band gap —
            it lets us write 1.1 instead of 1.76 × 10⁻¹⁹.
          </div>
        </div>
      </motion.div>

      {/* Either-or sign */}
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3 }}
          className={`p-6 rounded-3xl border-2 text-center ${
            energyEV >= 1.1
              ? 'border-emerald-400/50 bg-emerald-500/10'
              : 'border-rose-400/50 bg-rose-500/10'
          }`}
        >
          <div className="font-mono text-[10px] uppercase tracking-widest mb-2"
               style={{ color: energyEV >= 1.1 ? '#10b981' : '#f43f5e' }}>
            With your applied {voltage.toFixed(1)} V
          </div>
          <p className={`text-base leading-relaxed ${textColor}`}>
            {energyEV >= 1.1
              ? <>Your electron carries enough energy to <strong className="text-emerald-300">pay the Silicon toll (1.1 eV)</strong>.
                  It crosses the gap and joins the conduction band.</>
              : <>Your electron is short. It cannot exist in the forbidden zone, so it{' '}
                  <strong className="text-rose-300">stays in the gully</strong> until you raise the voltage.</>}
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
