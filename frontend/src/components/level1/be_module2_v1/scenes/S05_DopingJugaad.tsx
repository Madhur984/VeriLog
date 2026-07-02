import React from 'react';
import { motion } from 'framer-motion';
import { Wand2, TrendingUp } from 'lucide-react';

interface Props { isActive: boolean; isDarkMode: boolean; }

export const S05_DopingJugaad: React.FC<Props> = ({ isActive, isDarkMode }) => {
  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText   = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg    = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';

  return (
    <div className="max-w-6xl mx-auto space-y-14 py-4">
      <section className="space-y-3">
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.4em] uppercase text-violet-400">
          <Wand2 size={14} /> Chapter 05 · The Jugaad
        </div>
        <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>Pure Si Is Too Slow</h2>
        <p className={`text-base max-w-3xl ${subText}`}>
          One free electron per <strong className="text-violet-300">10¹²</strong> atoms.{' '}
          <em>Bhai, efficiency bohot low hai.</em> The fix is{' '}
          <strong className="text-violet-300">doping</strong> - intentionally adding a tiny
          fraction (just 1 part in 10 million!) of a different element to massively boost
          carriers. The doped material is called an <strong className="text-violet-300">extrinsic
          semiconductor</strong>.
        </p>
      </section>

      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        className={`relative rounded-3xl overflow-hidden border ${cardBg}`}
      >
        <img loading="lazy" decoding="async" src="/images/semi/p05.webp" alt="The doping jugaad" className="w-full block aspect-[16/9] object-cover" />
        <div className="absolute bottom-3 right-4 font-mono text-[9px] uppercase tracking-widest text-violet-200/80">
          Madhur&apos;s Lab · Page 05
        </div>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }} animate={isActive ? { opacity: 1, x: 0 } : {}}
          className={`p-8 rounded-3xl border ${cardBg} space-y-4`}
        >
          <div className="font-mono text-[10px] uppercase tracking-widest text-violet-400">Before doping · intrinsic</div>
          <div className={`text-6xl font-black ${textColor}`}>1 : 10¹²</div>
          <p className={`text-sm ${subText}`}>
            One free electron buried in a trillion silicon atoms. Useless for switching, terrible
            for amplification, hopeless for digital logic.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }} animate={isActive ? { opacity: 1, x: 0 } : {}}
          className={`p-8 rounded-3xl border-2 border-violet-400 bg-violet-500/10 space-y-4`}
        >
          <div className="font-mono text-[10px] uppercase tracking-widest text-violet-300">After doping · extrinsic</div>
          <div className={`text-6xl font-black text-violet-200`}>+10⁶ ×</div>
          <p className={`text-sm ${subText}`}>
            One million times more carriers. Conductivity surges. The silicon now responds
            usefully to applied voltages.
          </p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.2 }}
        className={`p-8 rounded-3xl border ${cardBg}`}
      >
        <div className="flex items-center gap-2 mb-5">
          <TrendingUp size={14} className="text-violet-400" />
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-violet-400">Two recipes</span>
        </div>
        <div className="grid md:grid-cols-2 gap-5">
          <div className="p-5 rounded-2xl border border-orange-400/40 bg-orange-500/10">
            <div className="font-mono text-[10px] uppercase tracking-widest text-orange-300 mb-2">N-Type</div>
            <h4 className={`font-black text-lg ${textColor} mb-2`}>Add Group V impurity</h4>
            <p className={`text-sm ${subText}`}>
              Pentavalent: 5 valence electrons. Examples: Phosphorus, Arsenic, Antimony. Surplus
              electrons = majority carriers. Up next.
            </p>
          </div>
          <div className="p-5 rounded-2xl border border-fuchsia-400/40 bg-fuchsia-500/10">
            <div className="font-mono text-[10px] uppercase tracking-widest text-fuchsia-300 mb-2">P-Type</div>
            <h4 className={`font-black text-lg ${textColor} mb-2`}>Add Group III impurity</h4>
            <p className={`text-sm ${subText}`}>
              Trivalent: 3 valence electrons. Examples: Boron, Gallium, Indium. Missing electrons
              create holes = majority carriers.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
