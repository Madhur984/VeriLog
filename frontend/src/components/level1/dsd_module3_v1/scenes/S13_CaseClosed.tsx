import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, BadgeCheck } from 'lucide-react';

interface Props { isActive: boolean; isDarkMode: boolean; }

export const S13_CaseClosed: React.FC<Props> = ({ isActive, isDarkMode }) => {
  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText   = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg    = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';

  const TAKEAWAYS = [
    { t: 'Reverse-engineering',  d: 'You can read any combinational schematic and write down its Boolean function from the output back to the inputs.' },
    { t: 'SOP normal form',      d: 'You know how to assemble product terms (ANDs) and sum them (OR) into the canonical Sum-of-Products expression.' },
    { t: 'Truth-table thinking', d: 'You can exhaustively enumerate 2ⁿ rows and identify the minterms — the rows where Y = 1.' },
    { t: 'K-Map synthesis',      d: 'You can fold a truth table into a K-Map, group its 1s into wings, read the simplified SOP and rebuild the gates.' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-14 py-4">
      <section className="space-y-3">
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.4em] uppercase text-emerald-400">
          <BadgeCheck size={14} /> Chapter 13 · Case Closed
        </div>
        <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>The Wing Is Secured</h2>
      </section>

      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        className={`relative rounded-3xl overflow-hidden border ${cardBg} shadow-[0_30px_80px_rgba(52,211,153,0.18)]`}
      >
        <img
          src="/images/noir/p14.png"
          alt="Case closed"
          className="w-full block aspect-[16/9] object-cover"
        />
        <div className="absolute bottom-3 right-4 font-mono text-[9px] uppercase tracking-widest text-emerald-200/70">
          Casebook · Page 14
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.15 }}
        className={`p-8 rounded-3xl border ${cardBg} space-y-5`}
      >
        <p className={`text-base ${subText}`}>
          End-to-Start analysis complete. By tracing outputs backward to inputs — and then
          replaying the same logic forward through a K-Map — Madhur proved that{' '}
          <strong className="text-emerald-300">any combinational circuit</strong> can be decoded
          into a Boolean function and re-built from a truth table.
        </p>
        <p className={`text-base ${subText}`}>
          The vault accepts the equation <strong className="text-emerald-300">Y = A · B + A · C′</strong>.
          The mechanism agrees with the truth table. The truth table agrees with the K-Map. The
          K-Map agrees with the gates. Three faces, one truth.
        </p>
        <p className={`text-base ${subText} italic`}>
          Wing X is secured.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.3 }}
        className={`p-8 rounded-3xl border ${cardBg}`}
      >
        <div className="flex items-center gap-2 mb-6">
          <CheckCircle2 size={14} className="text-emerald-400" />
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-emerald-400">
            What you walk away with
          </span>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {TAKEAWAYS.map((c) => (
            <div
              key={c.t}
              className={`p-5 rounded-2xl border ${
                isDarkMode ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-emerald-50 border-emerald-200'
              }`}
            >
              <div className="font-mono text-[10px] uppercase tracking-widest text-emerald-300 mb-2">{c.t}</div>
              <p className={`text-sm ${subText} leading-relaxed`}>{c.d}</p>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }} animate={isActive ? { opacity: 1 } : {}}
        transition={{ delay: 0.4 }}
        className={`text-center text-xs font-mono uppercase tracking-[0.3em] ${subText}`}
      >
        Next · Practice Arena → drills, reversals and synthesis challenges
      </motion.div>
    </div>
  );
};
