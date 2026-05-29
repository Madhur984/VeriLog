import React from 'react';
import { motion } from 'framer-motion';
import { Users, Zap } from 'lucide-react';

interface Props { isActive: boolean; isDarkMode: boolean; }

export const S06_NTypeSquad: React.FC<Props> = ({ isActive, isDarkMode }) => {
  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText   = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg    = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';

  return (
    <div className="max-w-6xl mx-auto space-y-14 py-4">
      <section className="space-y-3">
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.4em] uppercase text-orange-400">
          <Users size={14} /> Chapter 06 · N-Type
        </div>
        <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>The 5-Friend Squad</h2>
        <p className={`text-base max-w-3xl ${subText}`}>
          Replace one Si atom with a <strong className="text-orange-300">pentavalent</strong>{' '}
          impurity (P, As, Sb). Four electrons join the existing covalent bonds; the
          <strong className="text-orange-300"> 5th electron has nowhere to bond</strong> - it
          drifts straight up to the conduction band as a free carrier.
        </p>
      </section>

      <div className="grid lg:grid-cols-[1.1fr_1fr] gap-8 items-stretch">
        <motion.div
          initial={{ opacity: 0, x: -20 }} animate={isActive ? { opacity: 1, x: 0 } : {}}
          className={`relative rounded-3xl overflow-hidden border ${cardBg}`}
        >
          <img src="/images/semi/p06.webp" alt="N-Type 5-friend squad" className="w-full block aspect-[16/9] object-cover" />
          <div className="absolute bottom-3 right-4 font-mono text-[9px] uppercase tracking-widest text-orange-200/80">
            Madhur&apos;s Lab · Page 06
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }} animate={isActive ? { opacity: 1, x: 0 } : {}}
          className={`p-8 rounded-3xl border ${cardBg} space-y-5`}
        >
          <div className="font-mono text-[10px] uppercase tracking-widest text-orange-400">The Chemistry</div>
          <p className={`text-sm ${subText} leading-relaxed`}>
            We dope silicon with a Group V element - that&apos;s 5 valence electrons. Four of
            them form normal covalent bonds with neighbours. The 5th is loosely bound and
            <strong className="text-orange-300"> immediately enters the conduction band</strong>.
          </p>

          <div className="rounded-2xl p-5 border border-orange-400/40 bg-orange-500/5">
            <div className="flex items-center gap-2 mb-2">
              <Zap size={14} className="text-orange-300" />
              <span className="font-mono text-[10px] uppercase tracking-widest text-orange-300">Madhur&apos;s Note</span>
            </div>
            <p className={`text-sm ${textColor}`}>
              Pentavalent impurities = <strong>donor atoms</strong>. The 5th guy? He&apos;s the{' '}
              <em>awara</em> (free) electron who left the bond and went looking for the tapri.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Custom N-Type lattice diagram replacing the second PDF page */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.2 }}
        className={`p-8 rounded-3xl border ${cardBg}`}
      >
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-orange-400 mb-5">
          Anatomy of an N-Type lattice
        </div>
        <svg viewBox="0 0 700 360" className="w-full h-auto">
          {/* lattice of Si atoms */}
          {[
            [120, 80], [240, 80], [360, 80], [480, 80], [600, 80],
            [120, 200], [240, 200],            [480, 200], [600, 200],
            [120, 320], [240, 320], [360, 320], [480, 320], [600, 320],
          ].map(([x, y], i) => (
            <g key={i}>
              <circle cx={x} cy={y} r="22" fill="none" stroke="#475569" strokeWidth="2" />
              <text x={x} y={y + 5} fontFamily="monospace" fontSize="13" fill="#94a3b8" textAnchor="middle" fontWeight="bold">Si</text>
            </g>
          ))}

          {/* Donor atom (Phosphorus) - at center */}
          <circle cx="360" cy="200" r="26" fill="#fb923c30" stroke="#fb923c" strokeWidth="3" />
          <text x="360" y="205" fontFamily="monospace" fontSize="14" fill="#fb923c" textAnchor="middle" fontWeight="bold">P</text>
          <text x="360" y="170" fontFamily="monospace" fontSize="10" fill="#fb923c" textAnchor="middle">donor</text>

          {/* Covalent bond lines (4 valid bonds for the donor) */}
          <line x1="338" y1="190" x2="262" y2="195" stroke="#22d3ee" strokeWidth="2" />
          <line x1="382" y1="190" x2="458" y2="195" stroke="#22d3ee" strokeWidth="2" />
          <line x1="360" y1="178" x2="360" y2="105" stroke="#22d3ee" strokeWidth="2" />
          <line x1="360" y1="222" x2="360" y2="295" stroke="#22d3ee" strokeWidth="2" />

          {/* The free 5th electron - released */}
          <motion.circle
            r="9" fill="#fb923c"
            animate={{ cx: [400, 540, 580, 480, 400], cy: [180, 130, 250, 290, 180] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
          />
          {/* glow ring on the 5th electron */}
          <motion.circle
            r="14" fill="none" stroke="#fb923c" strokeWidth="2" opacity="0.5"
            animate={{ cx: [400, 540, 580, 480, 400], cy: [180, 130, 250, 290, 180] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
          />
          <text x="500" y="40" fontFamily="monospace" fontSize="11" fill="#fb923c" textAnchor="middle" fontWeight="bold">awara electron · roams freely</text>

          {/* Annotations */}
          <line x1="340" y1="240" x2="200" y2="285" stroke="#94a3b8" strokeWidth="1" strokeDasharray="3 3" />
          <text x="200" y="300" fontFamily="monospace" fontSize="11" fill="#94a3b8" textAnchor="end">Phosphorus = 5 valence e⁻</text>
          <text x="200" y="313" fontFamily="monospace" fontSize="11" fill="#94a3b8" textAnchor="end">4 form bonds · 1 escapes</text>
        </svg>

        {/* Comparison strip */}
        <div className="grid sm:grid-cols-3 gap-3 mt-6">
          <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-black/30 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
            <div className="font-mono text-[10px] uppercase tracking-widest text-orange-300 mb-1">Without doping</div>
            <div className={`text-xs ${subText}`}>
              Pure Si: ≈ <strong className={textColor}>1.5 × 10¹⁰</strong> free carriers / cm³
            </div>
          </div>
          <div className={`p-4 rounded-2xl border-2 border-orange-400 bg-orange-500/10`}>
            <div className="font-mono text-[10px] uppercase tracking-widest text-orange-300 mb-1">N-Type · doped</div>
            <div className={`text-xs ${subText}`}>
              ≈ <strong className="text-orange-300">10¹⁶</strong> free electrons / cm³
            </div>
          </div>
          <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-black/30 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
            <div className="font-mono text-[10px] uppercase tracking-widest text-orange-300 mb-1">Multiplier</div>
            <div className={`text-xs ${subText}`}>
              <strong className="text-orange-300">~10⁶ × more</strong> conductive than intrinsic Si
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.3 }}
        className={`p-8 rounded-3xl border ${cardBg}`}
      >
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-orange-400 mb-5">Carrier breakdown</div>
        <div className="grid sm:grid-cols-3 gap-4">
          <div className={`p-5 rounded-2xl border-2 border-orange-400 bg-orange-500/10`}>
            <div className="font-mono text-[10px] uppercase tracking-widest text-orange-300 mb-2">Majority</div>
            <h4 className={`text-2xl font-black text-orange-300`}>Electrons</h4>
            <p className={`text-xs ${subText} mt-2`}>The VVIPs - abundant and active. Provide the bulk of conduction.</p>
          </div>
          <div className={`p-5 rounded-2xl border ${isDarkMode ? 'bg-black/30 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
            <div className="font-mono text-[10px] uppercase tracking-widest text-fuchsia-300 mb-2">Minority</div>
            <h4 className={`text-2xl font-black text-fuchsia-300`}>Holes</h4>
            <p className={`text-xs ${subText} mt-2`}>The sidekicks - small thermal-generation population still present.</p>
          </div>
          <div className={`p-5 rounded-2xl border ${isDarkMode ? 'bg-black/30 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
            <div className="font-mono text-[10px] uppercase tracking-widest text-orange-400 mb-2">Result</div>
            <h4 className={`text-2xl font-black ${textColor}`}>N-Type</h4>
            <p className={`text-xs ${subText} mt-2`}>Conductivity dominated by negative carriers - hence the &quot;N&quot;.</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
