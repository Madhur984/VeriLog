import React from 'react';
import { motion } from 'framer-motion';
import { Car, ArrowLeftRight, AlertCircle } from 'lucide-react';

interface Props { isActive: boolean; isDarkMode: boolean; }

export const S08_FlowDuel: React.FC<Props> = ({ isActive, isDarkMode }) => {
  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText   = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg    = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';

  return (
    <div className="max-w-6xl mx-auto space-y-14 py-4">
      <section className="space-y-3">
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.4em] uppercase text-amber-400">
          <ArrowLeftRight size={14} /> Chapter 08 · Flow Duel
        </div>
        <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>Electron vs Hole Flow</h2>
        <p className={`text-base max-w-3xl ${subText}`}>
          Two viewpoints, one phenomenon. Physically only the electrons move. The hole &quot;flow&quot;
          is the chain reaction of vacancies being filled — it points the opposite way.
          Conventional current always follows the apparent <strong className="text-amber-300">hole
          flow (positive → negative)</strong>.
        </p>
      </section>

      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        className={`relative rounded-3xl overflow-hidden border ${cardBg}`}
      >
        <img src="/images/semi/p10.webp" alt="Electron flow vs hole flow" className="w-full block aspect-[16/9] object-cover" />
        <div className="absolute bottom-3 right-4 font-mono text-[9px] uppercase tracking-widest text-amber-200/80">
          Madhur&apos;s Lab · Page 10
        </div>
      </motion.div>

      {/* Animated lanes */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.15 }}
        className={`p-8 rounded-3xl border ${cardBg} space-y-6`}
      >
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-amber-400">Two-lane traffic · live</div>

        {/* Electron lane */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] text-orange-300 font-bold">Electron flow → (physical movement)</span>
            <Car className="text-orange-300" size={14} />
          </div>
          <div className="relative h-12 rounded-xl bg-black/40 border border-orange-400/40 overflow-hidden">
            {Array.from({ length: 6 }).map((_, i) => (
              <motion.div
                key={i}
                animate={{ x: ['0%', '100%'] }}
                transition={{ duration: 4, repeat: Infinity, delay: i * 0.6, ease: 'linear' }}
                className="absolute top-1/2 left-0 -translate-y-1/2"
              >
                <div className="w-6 h-6 rounded-full bg-orange-400 grid place-items-center text-[10px] font-mono font-bold text-black shadow-[0_0_10px_rgba(251,146,60,0.6)]">−</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Hole lane */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] text-fuchsia-300 font-bold">Hole flow ← (apparent movement = conventional current)</span>
            <Car className="text-fuchsia-300 -scale-x-100" size={14} />
          </div>
          <div className="relative h-12 rounded-xl bg-black/40 border border-fuchsia-400/40 overflow-hidden">
            {Array.from({ length: 4 }).map((_, i) => (
              <motion.div
                key={i}
                animate={{ x: ['100%', '0%'] }}
                transition={{ duration: 4, repeat: Infinity, delay: i * 0.9, ease: 'linear' }}
                className="absolute top-1/2 right-0 -translate-y-1/2"
              >
                <div className="w-6 h-6 rounded-full border-2 border-fuchsia-400 grid place-items-center text-[10px] font-mono font-bold text-fuchsia-300">+</div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.25 }}
        className={`p-8 rounded-3xl border-2 border-amber-400/60 bg-amber-500/10`}
      >
        <div className="flex items-start gap-3">
          <AlertCircle className="text-amber-300 flex-shrink-0 mt-0.5" size={20} />
          <div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-amber-300 mb-2">The Golden Rule</div>
            <p className={`text-base font-bold ${textColor}`}>
              Conventional current direction <strong className="text-amber-300">always follows the
              hole flow</strong> (positive to negative). When you draw an arrow on a circuit, you
              are drawing the direction holes appear to move — opposite to actual electron motion.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
