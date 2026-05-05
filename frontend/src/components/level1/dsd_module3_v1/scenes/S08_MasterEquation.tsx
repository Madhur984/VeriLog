import React from 'react';
import { motion } from 'framer-motion';
import { Sigma, ArrowDown } from 'lucide-react';

interface Props { isActive: boolean; isDarkMode: boolean; }

export const S08_MasterEquation: React.FC<Props> = ({ isActive, isDarkMode }) => {
  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText   = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg    = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';

  return (
    <div className="max-w-6xl mx-auto space-y-14 py-4">
      <section className="space-y-3">
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.4em] uppercase text-amber-400">
          <Sigma size={14} /> Chapter 08 · The Master Equation
        </div>
        <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>Sum of Products</h2>
        <p className={`text-base max-w-3xl ${subText}`}>
          By substituting the intermediate paths back into the final chokepoint, Madhur derives
          the definitive Boolean function of Wing X. The product terms (ANDs) are summed (ORed)
          together — the canonical <strong className="text-amber-300">SOP form</strong>.
        </p>
      </section>

      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        className={`relative rounded-3xl overflow-hidden border ${cardBg}`}
      >
        <img
          src="/images/noir/p09.png"
          alt="The Master Equation — Sum of Products"
          className="w-full block aspect-[16/9] object-cover"
        />
        <div className="absolute bottom-3 right-4 font-mono text-[9px] uppercase tracking-widest text-amber-200/70">
          Casebook · Page 09
        </div>
      </motion.div>

      {/* Substitution chain */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.15 }}
        className={`p-8 rounded-3xl border ${cardBg} space-y-6`}
      >
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-amber-400">Substitution chain</div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="rounded-2xl p-5 border border-amber-400/40 bg-amber-500/5">
            <div className="font-mono text-[10px] uppercase tracking-widest text-amber-300 mb-2">Path 1</div>
            <div className={`font-mono text-2xl font-black ${textColor}`}>A · B</div>
          </div>
          <div className="rounded-2xl p-5 border border-amber-400/40 bg-amber-500/5">
            <div className="font-mono text-[10px] uppercase tracking-widest text-amber-300 mb-2">Path 2</div>
            <div className={`font-mono text-2xl font-black ${textColor}`}>A · C′</div>
          </div>
        </div>

        <div className="flex justify-center">
          <ArrowDown className="text-amber-400" size={28} />
        </div>

        <div className="rounded-2xl p-6 border-2 border-amber-400 bg-amber-500/10 text-center shadow-[0_0_50px_rgba(251,191,36,0.2)]">
          <div className="font-mono text-[10px] uppercase tracking-widest text-amber-300 mb-3">The Master Equation</div>
          <div className={`font-mono text-4xl md:text-5xl font-black ${textColor}`}>
            Y = (A · B) + (A · C′)
          </div>
          <div className="mt-4 text-xs font-mono opacity-60">aka SOP / Sum-of-Products</div>
        </div>

        <div className="grid md:grid-cols-3 gap-3">
          {[
            { t: 'Two product terms',  d: 'Each AND-group is a product term; the parentheses make this explicit.' },
            { t: 'OR is the sum',      d: 'The plus sign in Boolean algebra is logical OR. "Sum" is metaphor only.' },
            { t: 'Universal form',     d: 'Any Boolean function can be expressed as an SOP. This is the standard textbook face.' },
          ].map((c) => (
            <div key={c.t} className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-black/30 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
              <div className="font-mono text-[10px] uppercase tracking-widest text-amber-300 mb-1">{c.t}</div>
              <p className={`text-xs ${subText} leading-relaxed`}>{c.d}</p>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }} animate={isActive ? { opacity: 1 } : {}}
        transition={{ delay: 0.4 }}
        className={`p-6 rounded-3xl border ${cardBg}`}
      >
        <p className={`text-sm ${subText} text-center`}>
          The reverse-engineered equation is in hand. But Madhur cannot trust algebra alone — he
          must <strong className="text-amber-300">verify</strong> by exhausting every possible
          input combination. That&apos;s the truth table. Onward.
        </p>
      </motion.div>
    </div>
  );
};
