import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GitBranch } from 'lucide-react';

interface Props { isActive: boolean; isDarkMode: boolean; }

export const S07_TraceBack: React.FC<Props> = ({ isActive, isDarkMode }) => {
  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText   = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg    = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';

  const [path, setPath] = useState<1 | 2>(1);

  return (
    <div className="max-w-6xl mx-auto space-y-14 py-4">
      <section className="space-y-3">
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.4em] uppercase text-amber-400">
          <GitBranch size={14} /> Chapter 07 · Interrogating the Paths
        </div>
        <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>Path 1 vs Path 2</h2>
        <p className={`text-base max-w-3xl ${subText}`}>
          Each input to the final OR gate is the output of an upstream AND gate. We interrogate
          one path at a time and write down the Boolean expression that produced it.
        </p>
      </section>

      {/* Toggle */}
      <div className="flex justify-center">
        <div className={`relative inline-flex p-1 rounded-2xl border ${isDarkMode ? 'bg-black/40 border-white/10' : 'bg-slate-100 border-slate-200'}`}>
          {[1, 2].map((p) => (
            <button
              key={p}
              onClick={() => setPath(p as 1 | 2)}
              className={`relative z-10 px-6 py-2 rounded-xl font-bold text-sm transition-colors ${
                path === p ? 'text-black' : isDarkMode ? 'text-slate-300' : 'text-slate-600'
              }`}
            >
              {path === p && (
                <motion.div
                  layoutId="path-pill"
                  className="absolute inset-0 rounded-xl bg-amber-400 shadow-[0_0_18px_rgba(251,191,36,0.4)]"
                  transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                />
              )}
              <span className="relative font-mono">Path {p}</span>
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {path === 1 ? (
          <motion.div
            key="path1"
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
            className="grid lg:grid-cols-[1fr_1fr] gap-8 items-stretch"
          >
            <div className={`relative rounded-3xl overflow-hidden border ${cardBg}`}>
              <img
                src="/images/noir/p07.png"
                alt="Interrogating Path 1"
                className="w-full block aspect-[16/9] object-cover"
              />
              <div className="absolute bottom-3 right-4 font-mono text-[9px] uppercase tracking-widest text-amber-200/70">
                Casebook · Page 07
              </div>
            </div>

            <div className={`p-8 rounded-3xl border ${cardBg} space-y-5`}>
              <div className="font-mono text-[10px] uppercase tracking-widest text-amber-400">Path 1 Guard</div>
              <h3 className={`text-2xl font-black ${textColor}`}>An AND of A and B</h3>
              <p className={`text-sm ${subText} leading-relaxed`}>
                The Path 1 guard only allows passage if intruders are present at{' '}
                <strong className="text-amber-300">both</strong> Door A AND Door B simultaneously.
                Both wires feed an AND gate — there is no inverter on the way.
              </p>
              <div className="rounded-2xl p-5 border border-amber-400/40 bg-amber-500/5">
                <div className="font-mono text-[10px] uppercase tracking-widest text-amber-300 mb-2">Notebook</div>
                <div className={`font-mono text-3xl font-black ${textColor} text-center`}>Path 1 = A · B</div>
              </div>
              <p className={`text-xs ${subText}`}>
                We don&apos;t yet know whether A or B will be 1 — the expression is{' '}
                <em>parametric</em>. It is true exactly when both happen to be 1.
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="path2"
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            className="grid lg:grid-cols-[1fr_1fr] gap-8 items-stretch"
          >
            <div className={`relative rounded-3xl overflow-hidden border ${cardBg}`}>
              <img
                src="/images/noir/p08.png"
                alt="Interrogating Path 2"
                className="w-full block aspect-[16/9] object-cover"
              />
              <div className="absolute bottom-3 right-4 font-mono text-[9px] uppercase tracking-widest text-amber-200/70">
                Casebook · Page 08
              </div>
            </div>

            <div className={`p-8 rounded-3xl border ${cardBg} space-y-5`}>
              <div className="font-mono text-[10px] uppercase tracking-widest text-amber-400">Path 2 Guard · The Contrarian Trap</div>
              <h3 className={`text-2xl font-black ${textColor}`}>An AND of A and C′</h3>
              <p className={`text-sm ${subText} leading-relaxed`}>
                Path 2 requires an intruder at A <strong className="text-amber-300">AND
                strictly no one at C</strong>. The NOT guard inverts C to C′ before the AND
                gate accepts it.
              </p>
              <div className="rounded-2xl p-5 border border-amber-400/40 bg-amber-500/5">
                <div className="font-mono text-[10px] uppercase tracking-widest text-amber-300 mb-2">Notebook</div>
                <div className={`font-mono text-3xl font-black ${textColor} text-center`}>Path 2 = A · C′</div>
              </div>
              <p className={`text-xs ${subText}`}>
                The little circle on the gate symbol — and the prime in the equation — both mean
                <em> inversion</em>. Treat them as the same idea expressed in two languages.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.3 }}
        className={`p-6 rounded-3xl border ${cardBg} text-center`}
      >
        <p className={`text-sm ${subText}`}>
          Two paths · two product terms · ready to be summed in the next chapter.
        </p>
      </motion.div>
    </div>
  );
};
