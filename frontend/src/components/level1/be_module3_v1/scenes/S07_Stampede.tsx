import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Skull, Zap } from 'lucide-react';

interface Props { isActive: boolean; isDarkMode: boolean; }

export const S07_Stampede: React.FC<Props> = ({ isActive, isDarkMode }) => {
  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText   = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg    = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';

  return (
    <div className="max-w-6xl mx-auto space-y-14 py-4">
      <section className="space-y-3">
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.4em] uppercase text-violet-400">
          <AlertTriangle size={14} /> Chapter 07 · Breakdown
        </div>
        <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>The Stampede</h2>
        <p className={`text-base max-w-3xl ${subText}`}>
          Apply <em>too much</em> reverse voltage and the depletion region&apos;s field becomes
          violent. Minority carriers accelerate hard, smash valence electrons free, those smash
          more electrons free - an <strong className="text-rose-300">avalanche</strong>. Reverse
          current explodes. Most diodes are{' '}
          <strong className="text-rose-300">permanently destroyed</strong>.
        </p>
      </section>

      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        className={`relative rounded-3xl overflow-hidden border ${cardBg}`}
      >
        <img src="/images/commuter/p09.webp" alt="Breakdown region - the stampede" className="w-full block aspect-[16/9] object-cover" />
        <div className="absolute bottom-3 right-4 font-mono text-[9px] uppercase tracking-widest text-rose-200/80">
          Commuter Circuit · Breakdown
        </div>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-4">
        {[
          { Icon: Zap,           t: 'The Trigger',     d: 'Reverse voltage exceeds V_BV (the breakdown voltage - diode-specific).' },
          { Icon: AlertTriangle, t: 'The Avalanche',   d: 'Accelerated minority carriers collide with valence electrons, knocking many free in a chain reaction.' },
          { Icon: Skull,         t: 'The Damage',      d: 'Reverse current spikes uncontrolled. Without a current-limit resistor, the junction is destroyed.' },
        ].map((c) => (
          <motion.div
            key={c.t}
            initial={{ opacity: 0, y: 12 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
            className={`p-5 rounded-2xl border border-rose-400/40 bg-rose-500/5`}
          >
            <div className="flex items-center gap-2 mb-2">
              <c.Icon size={14} className="text-rose-300" />
              <span className="font-mono text-[10px] uppercase tracking-widest text-rose-300">{c.t}</span>
            </div>
            <p className={`text-sm ${subText} leading-relaxed`}>{c.d}</p>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.2 }}
        className={`p-8 rounded-3xl border-2 border-rose-400/60 bg-rose-500/10 space-y-4`}
      >
        <div className="font-mono text-[10px] uppercase tracking-widest text-rose-300">Two breakdown flavours</div>
        <div className="grid md:grid-cols-2 gap-4">
          <div className={`p-5 rounded-xl border ${isDarkMode ? 'bg-black/30 border-rose-400/30' : 'bg-white border-rose-200'}`}>
            <h4 className={`font-black text-base ${textColor} mb-2`}>Avalanche Breakdown</h4>
            <p className={`text-xs ${subText}`}>
              High-energy collisions ionise the lattice. Found in lightly-doped diodes at higher
              V_BV (typically &gt; 6 V). Generally destroys the device.
            </p>
          </div>
          <div className={`p-5 rounded-xl border ${isDarkMode ? 'bg-black/30 border-rose-400/30' : 'bg-white border-rose-200'}`}>
            <h4 className={`font-black text-base ${textColor} mb-2`}>Zener Breakdown</h4>
            <p className={`text-xs ${subText}`}>
              Quantum tunnelling through a thin depletion region in heavily-doped diodes (low
              V_BV, ~ 2-6 V). Reversible - Zener diodes <em>operate</em> in this region as voltage
              regulators.
            </p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }} animate={isActive ? { opacity: 1 } : {}}
        className={`p-6 rounded-3xl border ${cardBg} flex items-start gap-3`}
      >
        <AlertTriangle className="text-rose-300 flex-shrink-0 mt-0.5" size={20} />
        <p className={`text-sm ${subText}`}>
          <strong className="text-rose-300">Lab warning:</strong> always include a series resistor
          when reverse-testing a diode near its V_BV. Without one, the avalanche will fry the
          device in milliseconds.
        </p>
      </motion.div>
    </div>
  );
};
