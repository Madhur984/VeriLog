import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Zap, Circle as CircleIcon } from 'lucide-react';
import { TryItYourself } from '../../../ui/TryItYourself';

interface Props { isActive: boolean; isDarkMode: boolean; }

export const S07_DholDrops: React.FC<Props> = ({ isActive, isDarkMode }) => {
  const [tempK, setTempK] = useState(300); // Kelvin
  const [phase, setPhase] = useState<'bonded' | 'breakaway' | 'hole'>('bonded');

  // Auto-cycle the breakaway animation when warm
  useEffect(() => {
    if (tempK < 200) { setPhase('bonded'); return; }
    let i = 0;
    const stages: Array<typeof phase> = ['bonded', 'breakaway', 'hole'];
    const id = setInterval(() => {
      i = (i + 1) % stages.length;
      setPhase(stages[i]);
    }, 2000);
    return () => clearInterval(id);
  }, [tempK]);

  // Approximate intrinsic carrier concentration in Si: n_i ≈ 1.5e10 (T/300)^1.5 e^{-Eg/2kT}
  // simplified illustrative formula
  const ni = (() => {
    if (tempK < 1) return 0;
    const T = tempK;
    const base = 1.5e10 * Math.pow(T / 300, 1.5) * Math.exp(-1.1 / (2 * 8.617e-5 * T));
    return base;
  })();

  const niStr = ni < 1
    ? '≈ 0'
    : ni > 1e16
    ? `${(ni / 1e16).toFixed(2)} × 10¹⁶`
    : `${(ni / 1e10).toFixed(2)} × 10¹⁰`;

  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';

  return (
    <div className="max-w-6xl mx-auto space-y-12 py-4">
      <section className="space-y-3">
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.4em] uppercase text-pink-400">
          <Flame size={14} /> Chapter 07 · Thermal Energy
        </div>
        <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>When the Dhol Drops</h2>
        <p className={`text-base max-w-3xl ${subText}`}>
          At room temperature the beat kicks in. Valence electrons absorb kinetic energy from ambient
          heat. A few absorb enough to <strong>break their covalent bond</strong> and shoot up to the
          conduction band - they become free carriers. The empty space they leave behind is called a{' '}
          <strong className="text-pink-300">hole</strong>.
        </p>
      </section>

      {/* Temperature slider */}
      <TryItYourself label="Drag to heat the lattice" />
      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        className={`p-6 rounded-3xl border ${cardBg}`}
      >
        <div className="flex items-center gap-3 mb-4">
          <Flame size={14} className="text-pink-400" />
          <span className="font-mono text-[10px] uppercase tracking-widest text-pink-400">
            Temperature · drag to heat the lattice
          </span>
          <span className="ml-auto font-mono text-sm font-black text-pink-300">{tempK} K</span>
        </div>
        <input
          type="range"
          min={0}
          max={600}
          step={5}
          value={tempK}
          onChange={(e) => setTempK(Number(e.target.value))}
          className="w-full accent-pink-400"
        />
        <div className="flex justify-between text-[10px] font-mono mt-1 opacity-60">
          <span>0 K · absolute zero</span>
          <span>300 K · room temp</span>
          <span>600 K · oven</span>
        </div>
      </motion.div>

      {/* Bond / breakaway animation */}
      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.1 }}
        className={`p-5 md:p-8 rounded-3xl border ${cardBg} relative overflow-hidden`}
      >
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-pink-400/10 rounded-full blur-3xl" />

        <div className="grid lg:grid-cols-[1.4fr_1fr] gap-8 items-center">
          {/* Animation area */}
          <div className="relative aspect-[5/4] rounded-2xl overflow-hidden border" style={{ background: 'rgba(0,0,0,0.3)', borderColor: 'rgba(236,72,153,0.3)' }}>
            <svg viewBox="0 0 400 320" className="w-full h-full">
              {/* Two atoms with a bond between them */}
              <line x1="135" y1="160" x2="265" y2="160" stroke="#ec4899" strokeWidth="3" />

              {/* Heat waves when warm */}
              {tempK >= 100 && Array.from({ length: 5 }).map((_, i) => (
                <motion.circle
                  key={i}
                  cx={200} cy={160}
                  r={20 + i * 14}
                  fill="none"
                  stroke="#fb923c"
                  strokeWidth="1.5"
                  opacity={Math.max(0, 0.3 - i * 0.05) * (tempK / 600)}
                  animate={{ r: [20 + i * 14, 30 + i * 14, 20 + i * 14] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                />
              ))}

              {/* Atoms */}
              <circle cx="100" cy="160" r="35" fill="#0f172a" stroke="#ec4899" strokeWidth="2.5" />
              <text x="100" y="166" textAnchor="middle" fontFamily="monospace" fontWeight="900" fontSize="16" fill="#ec4899">Si</text>
              <circle cx="300" cy="160" r="35" fill="#0f172a" stroke="#ec4899" strokeWidth="2.5" />
              <text x="300" y="166" textAnchor="middle" fontFamily="monospace" fontWeight="900" fontSize="16" fill="#ec4899">Si</text>

              {/* Shared electron */}
              <AnimatePresence>
                {phase === 'bonded' && (
                  <motion.g key="bonded">
                    <motion.circle
                      cx="200" cy="160" r="8" fill="#fde68a"
                      initial={{ opacity: 0 }} animate={{ opacity: 1, cx: [160, 240, 160] }} exit={{ opacity: 0 }}
                      transition={{ cx: { duration: 1.5, repeat: Infinity, ease: 'linear' } }}
                      style={{ filter: 'drop-shadow(0 0 6px #fde68a)' }}
                    />
                  </motion.g>
                )}
                {phase === 'breakaway' && (
                  <motion.g key="break">
                    <motion.circle
                      r="8" fill="#22d3ee"
                      initial={{ cx: 200, cy: 160, opacity: 1 }}
                      animate={{ cx: 200, cy: 40, opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 1.2, ease: 'easeOut' }}
                      style={{ filter: 'drop-shadow(0 0 10px #22d3ee)' }}
                    />
                    <motion.text
                      x="220" y={120}
                      fontFamily="monospace" fontSize="11" fontWeight="900" fill="#22d3ee"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    >
                      e⁻ FREE!
                    </motion.text>
                  </motion.g>
                )}
                {phase === 'hole' && (
                  <motion.g key="hole">
                    {/* Free electron up top */}
                    <circle cx="200" cy="40" r="8" fill="#22d3ee" style={{ filter: 'drop-shadow(0 0 8px #22d3ee)' }} />
                    {/* Hole at the bond site */}
                    <motion.circle
                      cx="200" cy="160" r="10"
                      fill="none" stroke="#f472b6" strokeWidth="2.5" strokeDasharray="3 3"
                      initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                    />
                    <motion.text
                      x="200" y={200} textAnchor="middle"
                      fontFamily="monospace" fontSize="11" fontWeight="900" fill="#f472b6"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    >
                      ← HOLE (void)
                    </motion.text>
                  </motion.g>
                )}
              </AnimatePresence>

              {/* Conduction band line */}
              <line x1="40" y1="40" x2="360" y2="40" stroke="#22d3ee" strokeWidth="1" strokeDasharray="4 3" opacity="0.6" />
              <text x="50" y="32" fontFamily="monospace" fontSize="9" fill="#22d3ee">CONDUCTION BAND</text>
              {/* Valence band */}
              <line x1="40" y1="280" x2="360" y2="280" stroke="#ec4899" strokeWidth="1" strokeDasharray="4 3" opacity="0.6" />
              <text x="50" y="296" fontFamily="monospace" fontSize="9" fill="#ec4899">VALENCE BAND</text>
            </svg>

            {/* Phase label */}
            <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-bg-void border border-pink-400/30 font-mono text-[10px] uppercase tracking-widest text-pink-300">
              {phase === 'bonded' && 'Phase · bond intact'}
              {phase === 'breakaway' && 'Phase · breakaway'}
              {phase === 'hole' && 'Phase · hole formed'}
            </div>
          </div>

          {/* Stats panel */}
          <div className="space-y-3">
            <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-black/30 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
              <div className="flex items-center gap-2 mb-1">
                <Zap size={12} className="text-pink-400" />
                <span className="font-mono text-[10px] uppercase tracking-widest text-pink-400">Intrinsic carrier density (Si)</span>
              </div>
              <div className="font-mono text-2xl font-black text-pink-300">{niStr}</div>
              <div className={`text-[11px] ${subText}`}>carriers / cm³ at {tempK} K</div>
            </div>
            <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-black/30 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
              <div className="flex items-center gap-2 mb-1">
                <CircleIcon size={12} className="text-cyan-400" />
                <span className="font-mono text-[10px] uppercase tracking-widest text-cyan-400">Electron-hole pairs</span>
              </div>
              <p className={`text-[12px] leading-relaxed ${subText}`}>
                Every broken bond creates exactly one free electron <em>and</em> one hole. They are
                always born in pairs.
              </p>
            </div>
            <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-black/30 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
              <div className="flex items-center gap-2 mb-1">
                <Flame size={12} className="text-orange-400" />
                <span className="font-mono text-[10px] uppercase tracking-widest text-orange-400">Negative temperature coefficient</span>
              </div>
              <p className={`text-[12px] leading-relaxed ${subText}`}>
                Higher heat → more carriers → <strong className="text-orange-300">lower resistance</strong>.
                Opposite of metals.
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Reference: 1.5e10 fact */}
      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.2 }}
        className="text-center"
      >
        <p className={`text-sm leading-relaxed max-w-3xl mx-auto ${textColor}`}>
          At 300 K (room temperature) a sugar-cube of pure Silicon contains approximately{' '}
          <strong className="text-pink-300 font-mono">1.5 × 10¹⁰ free electrons / cm³</strong> - a number
          with eleven zeros, yet still tiny compared to the 5 × 10²² atoms in the same cube. That ratio
          is exactly why pure Si is a poor conductor… and why we need doping (next module).
        </p>
      </motion.div>
    </div>
  );
};
