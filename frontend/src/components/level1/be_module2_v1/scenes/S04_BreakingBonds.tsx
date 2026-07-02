import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Flame, Zap, ArrowRight } from 'lucide-react';

interface Props { isActive: boolean; isDarkMode: boolean; }

export const S04_BreakingBonds: React.FC<Props> = ({ isActive, isDarkMode }) => {
  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText   = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg    = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';

  // 0=cold, 1=warm, 2=hot
  const [heat, setHeat] = useState(0);
  const carriers = [0, 8, 30][heat];

  return (
    <div className="max-w-6xl mx-auto space-y-14 py-4">
      <section className="space-y-3">
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.4em] uppercase text-orange-400">
          <Flame size={14} /> Chapter 04 · The Jump
        </div>
        <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>Breaking Covalent Bonds</h2>
        <p className={`text-base max-w-3xl ${subText}`}>
          Apply external energy - heat, light - and some valence electrons absorb it. They snap
          their covalent bonds and leap into the conduction band. Each escape leaves a{' '}
          <strong className="text-orange-300">hole</strong> behind.
        </p>
      </section>

      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        className={`relative rounded-3xl overflow-hidden border ${cardBg}`}
      >
        <img loading="lazy" decoding="async" src="/images/semi/p04.webp" alt="Breaking covalent bonds" className="w-full block aspect-[16/9] object-cover" />
        <div className="absolute bottom-3 right-4 font-mono text-[9px] uppercase tracking-widest text-orange-200/80">
          Madhur&apos;s Lab · Page 04
        </div>
      </motion.div>

      {/* Three-step explainer */}
      <div className="grid md:grid-cols-3 gap-4">
        {[
          { Icon: Zap,  step: 'Step 1 · Trigger',     d: 'Apply energy: room-temp heat is enough for many electrons.' },
          { Icon: Flame, step: 'Step 2 · Reaction',   d: 'Covalent bonds shatter. Electrons go free; holes appear.' },
          { Icon: ArrowRight, step: 'Step 3 · Reality',d: 'At room temp, intrinsic Si has ≈ 1.5×10¹⁰ free carriers / cm³.' },
        ].map((s) => (
          <motion.div
            key={s.step}
            initial={{ opacity: 0, y: 12 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
            className={`p-5 rounded-2xl border border-orange-400/40 bg-orange-500/5`}
          >
            <div className="flex items-center gap-2 mb-2">
              <s.Icon size={16} className="text-orange-300" />
              <span className="font-mono text-[10px] uppercase tracking-widest text-orange-300">{s.step}</span>
            </div>
            <p className={`text-sm ${subText} leading-relaxed`}>{s.d}</p>
          </motion.div>
        ))}
      </div>

      {/* Interactive carrier counter */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.2 }}
        className={`p-8 rounded-3xl border ${cardBg}`}
      >
        <div className="flex items-center justify-between mb-5">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-orange-400">
            Live carrier scrubber · turn up the heat
          </span>
          <div className="flex gap-1">
            {(['Cold', 'Warm', 'Hot'] as const).map((l, i) => (
              <button
                key={l}
                onClick={() => setHeat(i)}
                className={`px-3 py-1.5 rounded-lg font-mono text-[11px] transition-all ${
                  heat === i
                    ? 'bg-orange-400 text-black font-bold'
                    : isDarkMode ? 'bg-white/5 border border-white/10' : 'bg-slate-100 border border-slate-200'
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        <div className="relative h-48 rounded-2xl overflow-hidden border border-orange-400/30 bg-gradient-to-b from-orange-900/30 to-transparent">
          {/* Lattice grid */}
          {Array.from({ length: 8 }).map((_, r) =>
            Array.from({ length: 16 }).map((__, c) => (
              <div
                key={`${r}-${c}`}
                className="absolute w-2 h-2 rounded-full bg-slate-500"
                style={{
                  left: `${(c + 0.5) * (100 / 16)}%`,
                  top: `${(r + 0.5) * (100 / 8)}%`,
                  transform: 'translate(-50%, -50%)',
                }}
              />
            ))
          )}
          {/* Free carriers */}
          {Array.from({ length: carriers }).map((_, i) => {
            const x = ((i * 37) % 100);
            const y = ((i * 23) % 100);
            return (
              <motion.div
                key={i}
                animate={{
                  left: [`${x}%`, `${(x + 30) % 100}%`, `${x}%`],
                  top: [`${y}%`, `${(y + 15) % 100}%`, `${y}%`],
                }}
                transition={{ duration: 4 + (i % 3), repeat: Infinity, ease: 'easeInOut' }}
                className="absolute w-3 h-3 rounded-full bg-orange-400 shadow-[0_0_10px_rgba(251,146,60,0.7)]"
              />
            );
          })}
          {heat === 2 && (
            <div className="absolute inset-0 bg-orange-500/10" />
          )}
        </div>

        <div className="mt-5 grid sm:grid-cols-3 gap-3">
          <div className={`p-4 rounded-xl border ${isDarkMode ? 'bg-black/30 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
            <div className="font-mono text-[10px] uppercase tracking-widest text-orange-300 mb-1">Heat level</div>
            <div className={`font-mono text-xl font-black ${textColor}`}>{['0 K', '300 K', '500 K'][heat]}</div>
          </div>
          <div className={`p-4 rounded-xl border ${isDarkMode ? 'bg-black/30 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
            <div className="font-mono text-[10px] uppercase tracking-widest text-orange-300 mb-1">Free carriers</div>
            <div className={`font-mono text-xl font-black ${textColor}`}>{carriers === 0 ? '0' : carriers === 8 ? '~1.5×10¹⁰ /cm³' : '~10¹³ /cm³'}</div>
          </div>
          <div className={`p-4 rounded-xl border ${isDarkMode ? 'bg-black/30 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
            <div className="font-mono text-[10px] uppercase tracking-widest text-orange-300 mb-1">Conductivity</div>
            <div className={`font-mono text-xl font-black ${textColor}`}>{['none', 'low', 'rising'][heat]}</div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }} animate={isActive ? { opacity: 1 } : {}}
        className={`p-6 rounded-3xl border ${cardBg}`}
      >
        <p className={`text-sm ${subText}`}>
          <strong className="text-orange-300">Reality check:</strong> 1.5 × 10¹⁰ carriers/cm³
          <em> sounds </em>like a lot, but a copper wire of the same volume has ~10²² carriers.
          Pure silicon is still hopeless for fast circuits - that&apos;s why we dope it. Next chapter.
        </p>
      </motion.div>
    </div>
  );
};
