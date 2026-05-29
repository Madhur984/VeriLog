import React from 'react';
import { motion } from 'framer-motion';
import { Scale, Thermometer, TrendingUp, TrendingDown } from 'lucide-react';

interface Props { isActive: boolean; isDarkMode: boolean; }

export const S10_NeutralityHeat: React.FC<Props> = ({ isActive, isDarkMode }) => {
  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText   = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg    = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';

  return (
    <div className="max-w-6xl mx-auto space-y-14 py-4">
      <section className="space-y-3">
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.4em] uppercase text-violet-400">
          <Scale size={14} /> Chapter 10 · Two Twists
        </div>
        <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>Neutrality + The Heat Twist</h2>
        <p className={`text-base max-w-3xl ${subText}`}>
          Two facts that catch students off-guard in vivas: a doped material is{' '}
          <strong className="text-violet-300">still electrically neutral</strong>, and a
          semiconductor has a <strong className="text-violet-300">negative temperature
          coefficient</strong> - the opposite of metals.
        </p>
      </section>

      {/* Twist 1: Neutrality - custom balance scale */}
      <motion.div
        initial={{ opacity: 0, x: -20 }} animate={isActive ? { opacity: 1, x: 0 } : {}}
        className={`p-8 rounded-3xl border ${cardBg}`}
      >
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-violet-400 mb-5">
          Twist 1 · The doped material is still electrically neutral
        </div>
        <svg viewBox="0 0 700 240" className="w-full h-auto max-w-2xl mx-auto">
          {/* Beam */}
          <line x1="350" y1="40" x2="350" y2="80" stroke="#94a3b8" strokeWidth="2" />
          <line x1="100" y1="80" x2="600" y2="80" stroke="#94a3b8" strokeWidth="3" />
          <polygon points="350,30 340,50 360,50" fill="#94a3b8" />

          {/* Left pan: 15 protons */}
          <rect x="60" y="80" width="160" height="6" fill="#94a3b8" />
          <line x1="80" y1="80" x2="80" y2="120" stroke="#94a3b8" strokeWidth="1" />
          <line x1="200" y1="80" x2="200" y2="120" stroke="#94a3b8" strokeWidth="1" />
          <rect x="80" y="120" width="120" height="60" rx="4" fill="#fb923c20" stroke="#fb923c" strokeWidth="2" />
          <text x="140" y="140" fontFamily="monospace" fontSize="11" fill="#fb923c" textAnchor="middle" fontWeight="bold">Protons (+)</text>
          <text x="140" y="158" fontFamily="monospace" fontSize="22" fill="#fb923c" textAnchor="middle" fontWeight="bold">+15</text>
          <text x="140" y="174" fontFamily="monospace" fontSize="9" fill="#fb923c" textAnchor="middle">in nucleus</text>

          {/* Right pan: 15 electrons (orbits + free) */}
          <rect x="480" y="80" width="160" height="6" fill="#94a3b8" />
          <line x1="500" y1="80" x2="500" y2="120" stroke="#94a3b8" strokeWidth="1" />
          <line x1="620" y1="80" x2="620" y2="120" stroke="#94a3b8" strokeWidth="1" />
          <rect x="500" y="120" width="120" height="60" rx="4" fill="#22d3ee20" stroke="#22d3ee" strokeWidth="2" />
          <text x="560" y="140" fontFamily="monospace" fontSize="11" fill="#22d3ee" textAnchor="middle" fontWeight="bold">Electrons (−)</text>
          <text x="560" y="158" fontFamily="monospace" fontSize="22" fill="#22d3ee" textAnchor="middle" fontWeight="bold">−15</text>
          <text x="560" y="174" fontFamily="monospace" fontSize="9" fill="#22d3ee" textAnchor="middle">14 bonded + 1 free</text>

          {/* Equals sign */}
          <text x="350" y="155" fontFamily="monospace" fontSize="22" fill="#a78bfa" textAnchor="middle" fontWeight="bold">⚖</text>
          <text x="350" y="180" fontFamily="monospace" fontSize="11" fill="#a78bfa" textAnchor="middle" fontWeight="bold">balanced</text>
          <text x="350" y="195" fontFamily="monospace" fontSize="9" fill="#a78bfa" textAnchor="middle">net charge = 0</text>

          {/* Caption */}
          <text x="350" y="225" fontFamily="monospace" fontSize="11" fill="#94a3b8" textAnchor="middle">A donor atom (P, As, Sb) brings 5 protons AND 5 electrons. Charge stays balanced.</text>
        </svg>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-4">
        {[
          { Icon: Scale, t: 'The Trap',  d: 'If N-Type has extra electrons, isn\'t it negatively charged?' },
          { Icon: Scale, t: 'The Truth', d: 'No. The donor atom\'s nucleus has 5 protons matching its 5 electrons. Total = neutral.' },
          { Icon: Scale, t: 'The Logic', d: 'The 5th electron is just free to roam - not added from outside. Charge balance preserved.' },
        ].map((c) => (
          <motion.div
            key={c.t}
            initial={{ opacity: 0, y: 12 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
            className={`p-5 rounded-2xl border border-violet-400/40 bg-violet-500/5`}
          >
            <div className="flex items-center gap-2 mb-2">
              <c.Icon size={14} className="text-violet-300" />
              <span className="font-mono text-[10px] uppercase tracking-widest text-violet-300">{c.t}</span>
            </div>
            <p className={`text-sm ${subText} leading-relaxed`}>{c.d}</p>
          </motion.div>
        ))}
      </div>

      {/* Twist 2: Negative Temp Coefficient - custom comparison graph */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.2 }}
        className={`p-8 rounded-3xl border ${cardBg}`}
      >
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-orange-400 mb-5">
          Twist 2 · Resistance vs temperature · two curves
        </div>
        <svg viewBox="0 0 700 240" className="w-full h-auto">
          {/* Axes */}
          <line x1="60" y1="200" x2="650" y2="200" stroke="#475569" strokeWidth="1" />
          <line x1="60" y1="40" x2="60" y2="200" stroke="#475569" strokeWidth="1" />
          <text x="650" y="220" fontFamily="monospace" fontSize="11" fill="#94a3b8" textAnchor="end">Temperature →</text>
          <text x="50" y="40" fontFamily="monospace" fontSize="11" fill="#94a3b8" textAnchor="end">R</text>

          {/* Conductor curve - rises */}
          <path d="M 60 170 Q 250 168 400 145 T 640 70" fill="none" stroke="#f43f5e" strokeWidth="3" />
          <text x="640" y="60" fontFamily="monospace" fontSize="12" fill="#f43f5e" textAnchor="end" fontWeight="bold">CONDUCTOR ↗</text>
          <text x="640" y="78" fontFamily="monospace" fontSize="9" fill="#f43f5e" textAnchor="end">positive temp coefficient</text>

          {/* Semiconductor curve - falls steeply */}
          <path d="M 60 60 Q 200 70 320 130 T 640 195" fill="none" stroke="#fb923c" strokeWidth="3" />
          <text x="640" y="185" fontFamily="monospace" fontSize="12" fill="#fb923c" textAnchor="end" fontWeight="bold">SEMICONDUCTOR ↘</text>
          <text x="640" y="170" fontFamily="monospace" fontSize="9" fill="#fb923c" textAnchor="end">negative temp coefficient</text>

          {/* Annotation arrows */}
          <line x1="200" y1="120" x2="100" y2="60" stroke="#fb923c" strokeWidth="1" strokeDasharray="3 3" />
          <text x="100" y="48" fontFamily="monospace" fontSize="9" fill="#fb923c" textAnchor="end">High R when cold</text>
          <line x1="500" y1="160" x2="600" y2="195" stroke="#fb923c" strokeWidth="1" strokeDasharray="3 3" />
          <text x="600" y="215" fontFamily="monospace" fontSize="9" fill="#fb923c" textAnchor="end">Low R when hot</text>

          {/* Cause callouts */}
          <text x="160" y="100" fontFamily="monospace" fontSize="10" fill="#f43f5e">heat = lattice vibration =</text>
          <text x="160" y="113" fontFamily="monospace" fontSize="10" fill="#f43f5e">collisions = ↑ resistance</text>

          <text x="380" y="105" fontFamily="monospace" fontSize="10" fill="#fb923c">heat = broken bonds =</text>
          <text x="380" y="118" fontFamily="monospace" fontSize="10" fill="#fb923c">more carriers = ↓ resistance</text>
        </svg>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-5">
        <motion.div
          initial={{ opacity: 0, x: -20 }} animate={isActive ? { opacity: 1, x: 0 } : {}}
          className={`p-6 rounded-3xl border ${cardBg}`}
        >
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp size={14} className="text-rose-300" />
            <span className="font-mono text-[10px] uppercase tracking-widest text-rose-300">Conductors / Metals</span>
          </div>
          <h4 className={`text-xl font-black ${textColor} mb-2`}>Positive Temp Coefficient</h4>
          <p className={`text-sm ${subText}`}>
            More heat = more lattice vibration = more collisions = <strong>higher</strong>{' '}
            resistance. A copper wire heats up and conducts <em>worse</em>.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }} animate={isActive ? { opacity: 1, x: 0 } : {}}
          className={`p-6 rounded-3xl border-2 border-orange-400 bg-orange-500/10`}
        >
          <div className="flex items-center gap-2 mb-3">
            <TrendingDown size={14} className="text-orange-300" />
            <span className="font-mono text-[10px] uppercase tracking-widest text-orange-300">Semiconductors</span>
          </div>
          <h4 className={`text-xl font-black text-orange-200 mb-2`}>Negative Temp Coefficient</h4>
          <p className={`text-sm ${subText}`}>
            More heat = more broken bonds = more free carriers = <strong>lower</strong>{' '}
            resistance. Silicon&apos;s superpower: it gets <em>better</em> at conducting as it warms.
          </p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }} animate={isActive ? { opacity: 1 } : {}}
        transition={{ delay: 0.3 }}
        className={`p-6 rounded-3xl border ${cardBg} flex items-start gap-3`}
      >
        <Thermometer className="text-orange-300 flex-shrink-0 mt-0.5" size={20} />
        <p className={`text-sm ${subText}`}>
          <strong className="text-orange-300">Core rule:</strong> as temperature rises, a
          semiconductor&apos;s conductivity skyrockets. Most diodes derate at high temperatures
          precisely because of this - a runaway feedback loop called <em>thermal runaway</em>.
        </p>
      </motion.div>

      {/* Closing wrap - point students to Module 3 */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.4 }}
        className={`p-8 rounded-3xl border ${cardBg} text-center space-y-4`}
      >
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-emerald-400">Module 2 wrap</div>
        <h3 className={`text-2xl font-black ${textColor}`}>You can now think in carriers and bands.</h3>
        <p className={`text-sm ${subText} max-w-2xl mx-auto`}>
          Pure Si → energy gap → broken bonds → doping → N-Type / P-Type → flow → neutrality →
          temperature behaviour. Every fact above is load-bearing for the next module - the
          <strong className="text-emerald-300"> P-N junction diode</strong>, where N and P slabs
          finally meet.
        </p>
        <p className={`text-xs ${subText} font-mono italic opacity-70`}>
          Continue to Basic Electronics · Module 3.
        </p>
      </motion.div>
    </div>
  );
};
