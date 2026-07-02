import React from 'react';
import { motion } from 'framer-motion';
import { Lock, ShieldOff } from 'lucide-react';

interface Props { isActive: boolean; isDarkMode: boolean; }

export const S05_LockedDoors: React.FC<Props> = ({ isActive, isDarkMode }) => {
  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText   = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg    = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';

  return (
    <div className="max-w-6xl mx-auto space-y-14 py-4">
      <section className="space-y-3">
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.4em] uppercase text-violet-400">
          <Lock size={14} /> Chapter 05 · Reverse Bias
        </div>
        <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>The Locked Doors</h2>
        <p className={`text-base max-w-3xl ${subText}`}>
          Connect the positive terminal to the N-side and negative to the P-side
          (V_D &lt; 0). Majority carriers are <em>pulled away</em> from the junction. The
          depletion region <strong className="text-violet-300">widens</strong>; the diode behaves
          like a locked door. <strong className="text-violet-300">I_D ≈ 0</strong>.
        </p>
      </section>

      {/* Single PDF anchor */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        className={`relative rounded-3xl overflow-hidden border ${cardBg}`}
      >
        <img loading="lazy" decoding="async" src="/images/commuter/p05.webp" alt="Reverse bias - locked doors" className="w-full block aspect-[16/9] object-cover" />
        <div className="absolute bottom-3 right-4 font-mono text-[9px] uppercase tracking-widest text-violet-200/80">
          Commuter Circuit · Reverse Bias
        </div>
      </motion.div>

      {/* Custom reverse-bias schematic */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.1 }}
        className={`p-8 rounded-3xl border ${cardBg}`}
      >
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-violet-400 mb-5">
          Schematic · what reverse-bias actually does
        </div>
        <svg viewBox="0 0 700 280" className="w-full h-auto">
          <rect x="20" y="60" width="220" height="160" fill="#fb923c20" stroke="#fb923c" strokeWidth="2" />
          <text x="130" y="50" fill="#fb923c" fontFamily="monospace" fontSize="13" textAnchor="middle" fontWeight="bold">P-Type</text>

          <rect x="460" y="60" width="220" height="160" fill="#38bdf820" stroke="#38bdf8" strokeWidth="2" />
          <text x="570" y="50" fill="#38bdf8" fontFamily="monospace" fontSize="13" textAnchor="middle" fontWeight="bold">N-Type</text>

          <rect x="240" y="60" width="220" height="160" fill="#fcd34d20" stroke="#fcd34d" strokeWidth="2" strokeDasharray="6 3" />
          <text x="350" y="50" fill="#fcd34d" fontFamily="monospace" fontSize="13" textAnchor="middle" fontWeight="bold">Depletion · WIDENED</text>

          <text x="350" y="245" fill="#94a3b8" fontFamily="monospace" fontSize="10" textAnchor="middle">External battery: − to P, + to N (REVERSE bias)</text>

          <text x="55" y="100" fill="#fb923c" fontFamily="monospace" fontSize="13" fontWeight="bold">+</text>
          <motion.text
            x="120" y="100" fill="#fb923c" fontFamily="monospace" fontSize="13" fontWeight="bold"
            animate={{ x: [180, 80, 180] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          >+</motion.text>
          <text x="200" y="100" fill="#fb923c" fontFamily="monospace" fontSize="13" fontWeight="bold">+</text>
          <text x="55" y="200" fill="#fb923c" fontFamily="monospace" fontSize="13" fontWeight="bold">+</text>
          <text x="200" y="200" fill="#fb923c" fontFamily="monospace" fontSize="13" fontWeight="bold">+</text>

          <line x1="20" y1="240" x2="100" y2="240" stroke="#f43f5e" strokeWidth="2" markerEnd="url(#leftArrow)" />
          <text x="55" y="265" fill="#f43f5e" fontFamily="monospace" fontSize="9">holes pulled away</text>

          <text x="510" y="100" fill="#38bdf8" fontFamily="monospace" fontSize="13" fontWeight="bold">−</text>
          <motion.text
            x="580" y="100" fill="#38bdf8" fontFamily="monospace" fontSize="13" fontWeight="bold"
            animate={{ x: [500, 600, 500] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          >−</motion.text>
          <text x="660" y="100" fill="#38bdf8" fontFamily="monospace" fontSize="13" fontWeight="bold">−</text>
          <text x="510" y="200" fill="#38bdf8" fontFamily="monospace" fontSize="13" fontWeight="bold">−</text>
          <text x="660" y="200" fill="#38bdf8" fontFamily="monospace" fontSize="13" fontWeight="bold">−</text>
          <line x1="600" y1="240" x2="680" y2="240" stroke="#f43f5e" strokeWidth="2" markerEnd="url(#rightArrow)" />
          <text x="640" y="265" fill="#f43f5e" fontFamily="monospace" fontSize="9">electrons pulled away</text>

          <defs>
            <marker id="leftArrow" viewBox="0 0 10 10" refX="0" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 10 0 L 0 5 L 10 10 z" fill="#f43f5e" />
            </marker>
            <marker id="rightArrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#f43f5e" />
            </marker>
          </defs>

          <text x="350" y="155" fill="#475569" fontFamily="monospace" fontSize="20" textAnchor="middle" fontStyle="italic">I_D ≈ 0</text>
        </svg>
        <p className={`text-xs ${subText} mt-4 text-center max-w-xl mx-auto`}>
          The external battery&apos;s pull on majority carriers <em>matches</em> the depletion
          region&apos;s internal pull - but in opposite directions. Net result: the gap widens
          and majority current is choked off completely.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-5">
        <motion.div
          initial={{ opacity: 0, x: -20 }} animate={isActive ? { opacity: 1, x: 0 } : {}}
          className={`p-6 rounded-3xl border ${cardBg} space-y-3`}
        >
          <div className="flex items-center gap-2">
            <Lock className="text-violet-300" size={16} />
            <span className="font-mono text-[10px] uppercase tracking-widest text-violet-300">Carrier behaviour</span>
          </div>
          <ul className={`text-sm ${subText} space-y-2 list-disc list-inside`}>
            <li>Positive terminal pulls electrons away from the N-side.</li>
            <li>Negative terminal pulls holes away from the P-side.</li>
            <li>Depletion region widens significantly.</li>
            <li>Majority current is <strong className="text-violet-300">choked off</strong>.</li>
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }} animate={isActive ? { opacity: 1, x: 0 } : {}}
          className={`p-6 rounded-3xl border-2 border-violet-400/60 bg-violet-500/10 space-y-3`}
        >
          <div className="flex items-center gap-2">
            <ShieldOff className="text-violet-300" size={16} />
            <span className="font-mono text-[10px] uppercase tracking-widest text-violet-300">The Reality · I_S</span>
          </div>
          <p className={`text-sm ${subText}`}>
            A small <strong className="text-violet-300">reverse saturation current I_S</strong>{' '}
            (nA-μA range) still leaks across because of thermally-generated minority carriers.
            It&apos;s nearly independent of voltage, but very sensitive to temperature.
          </p>
        </motion.div>
      </div>

      {/* I_S magnitude bar */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.2 }}
        className={`p-8 rounded-3xl border ${cardBg}`}
      >
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-violet-400 mb-5">
          I_S in context · how tiny is &quot;tiny&quot;?
        </div>
        <div className="space-y-3">
          {[
            { label: 'I_S at room temp (Si)',  width: 5,  display: '~10 nA', color: '#a78bfa' },
            { label: 'I_S at 100 °C (Si)',     width: 18, display: '~1 μA',  color: '#a78bfa' },
            { label: 'Forward I_D at 0.7V',    width: 80, display: '~10 mA', color: '#34d399' },
            { label: 'Phone charger output',   width: 95, display: '~2 A',   color: '#fbbf24' },
          ].map((row) => (
            <div key={row.label}>
              <div className="flex justify-between mb-1 text-xs font-mono">
                <span className={subText}>{row.label}</span>
                <span style={{ color: row.color }} className="font-bold">{row.display}</span>
              </div>
              <div className={`h-3 rounded-full overflow-hidden ${isDarkMode ? 'bg-black/40' : 'bg-slate-200'}`}>
                <motion.div
                  initial={{ width: 0 }} animate={{ width: `${row.width}%` }} transition={{ duration: 0.8 }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: row.color, boxShadow: `0 0 12px ${row.color}55` }}
                />
              </div>
            </div>
          ))}
        </div>
        <p className={`text-xs ${subText} mt-5 italic`}>
          The reverse leak is six to seven orders of magnitude smaller than forward conduction.
          For most digital circuits we treat reverse-biased diodes as <strong className="text-violet-300">open switches</strong>.
        </p>
      </motion.div>
    </div>
  );
};
