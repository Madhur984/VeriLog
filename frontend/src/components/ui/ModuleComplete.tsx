import React from 'react';
import { motion } from 'framer-motion';
import { Check, Trophy, ArrowRight, LayoutGrid } from 'lucide-react';

/**
 * ModuleComplete — a celebratory summary shown when a learner finishes a module,
 * before they move on. It appreciates the win and recaps exactly what was
 * covered (the module's section titles), then offers "next module" / "portal".
 *
 * Drop it into a module engine's root (which is `relative`) and toggle it when
 * the final page's forward button is pressed, instead of navigating away.
 */
export interface ModuleCompleteProps {
  isDark: boolean;
  moduleTitle: string;
  accent: string;
  topics: string[];
  onPortal: () => void;
  next?: { label: string; onGo: () => void };
}

export const ModuleComplete: React.FC<ModuleCompleteProps> = ({
  isDark, moduleTitle, accent, topics, onPortal, next,
}) => {
  const text = isDark ? 'text-white' : 'text-slate-900';
  const sub = isDark ? 'text-slate-400' : 'text-slate-600';
  // Solid, no glassmorphism — same language as the site: dark panel vs. lavender
  // neo-brutalist card (ink border + hard offset shadow).
  const card = isDark
    ? 'bg-[#0E1018] border border-white/10'
    : 'bg-white border-2 border-[#1B1436] shadow-[4px_4px_0_0_#1B1436]';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`absolute inset-0 z-40 flex items-start justify-center overflow-y-auto p-5 sm:items-center ${
        isDark ? 'bg-[#04060A]' : 'bg-[#ECE8FB]'
      }`}
    >
      <motion.div
        initial={{ y: 26, scale: 0.96, opacity: 0 }}
        animate={{ y: 0, scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 220, damping: 22 }}
        className="my-auto w-full max-w-lg text-center"
      >
        <motion.div
          initial={{ scale: 0, rotate: -18 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 260, damping: 15 }}
          className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl text-white"
          style={{ background: accent, boxShadow: isDark ? 'none' : '4px 4px 0 0 #1B1436' }}
        >
          <Trophy size={38} />
        </motion.div>

        <p className="mt-5 font-mono text-[11px] font-bold uppercase tracking-[0.3em]" style={{ color: accent }}>
          Module complete
        </p>
        <h1 className={`mt-2 text-[30px] font-extrabold tracking-tight sm:text-4xl ${text}`}>Nice work! 🎉</h1>
        <p className={`mx-auto mt-2 max-w-md text-[15px] leading-relaxed ${sub}`}>
          You finished <span className={`font-bold ${text}`}>{moduleTitle}</span>. Here's everything you just picked up.
        </p>

        <div className={`mt-6 rounded-2xl border p-5 text-left ${card}`}>
          <p className="mb-3 font-mono text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: accent }}>
            What you learned
          </p>
          <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {topics.map((t, i) => (
              <motion.li
                key={`${t}-${i}`}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.18 + i * 0.04 }}
                className={`flex items-start gap-2 text-[13px] leading-snug ${text}`}
              >
                <span className="mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full" style={{ background: accent }}>
                  <Check size={11} className="text-white" strokeWidth={3} />
                </span>
                {t}
              </motion.li>
            ))}
          </ul>
        </div>

        <div className="mt-6 flex flex-col-reverse items-stretch justify-center gap-3 sm:flex-row sm:items-center">
          <button
            onClick={onPortal}
            className={`inline-flex items-center justify-center gap-2 rounded-xl border px-5 py-2.5 text-[14px] font-bold transition-transform hover:-translate-y-0.5 ${card} ${text}`}
          >
            <LayoutGrid size={16} /> Back to portal
          </button>
          {next && (
            <button
              onClick={next.onGo}
              className="inline-flex items-center justify-center gap-2 rounded-xl border-2 px-5 py-2.5 text-[14px] font-extrabold text-white transition-transform hover:-translate-y-0.5"
              style={{ background: accent, borderColor: isDark ? 'transparent' : '#1B1436', boxShadow: isDark ? 'none' : '4px 4px 0 0 #1B1436' }}
            >
              Next: {next.label} <ArrowRight size={16} />
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ModuleComplete;
