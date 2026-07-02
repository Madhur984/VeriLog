import React from 'react';
import { motion } from 'framer-motion';
import { Construction, X } from 'lucide-react';

interface Props { isActive: boolean; isDarkMode: boolean; }

const MAX = [
  { idx: 3, term: "R + A' + W'" },
  { idx: 5, term: "R' + A + W'" },
  { idx: 6, term: "R' + A' + W" },
  { idx: 7, term: "R' + A' + W'" },
];

export const S07_BuildPOS: React.FC<Props> = ({ isActive, isDarkMode }) => {
  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';

  return (
    <div className="max-w-6xl mx-auto space-y-12 py-4">
      <div className="grid lg:grid-cols-[1fr_0.9fr] gap-8 items-center">
        <section className="space-y-3">
          <div className="font-mono text-[10px] tracking-[0.4em] uppercase text-amber-400">
            Chapter 07 · The Wall of Walls
          </div>
          <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>
            Building the Canonical Product of Sums
          </h2>
          <p className={`text-base ${subText}`}>
            A single barricade only blocks one disaster. To survive every bad day, Ben must pass
            through <strong>every</strong> barricade - link them with AND. The chain is the
            canonical POS.
          </p>
        </section>
        <motion.div
          initial={{ opacity: 0, x: 16 }} animate={isActive ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: 0.1 }}
          className="rounded-3xl overflow-hidden border border-white/10" style={{ background: '#fef9f0' }}
        >
          <img loading="lazy" decoding="async" src="/images/sketchbook/p09.webp" alt="Sketchbook - chain of barricades for POS" className="w-full block" />
        </motion.div>
      </div>

      {/* Wall chain */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        className={`p-10 rounded-3xl border relative overflow-hidden ${cardBg}`}
      >
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-amber-400/10 rounded-full blur-3xl" />
        <div className="flex flex-wrap items-center justify-center gap-3 relative">
          {MAX.map((m, i) => (
            <React.Fragment key={m.idx}>
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={isActive ? { y: 0, opacity: 1 } : {}}
                transition={{ delay: 0.2 + i * 0.15, type: 'spring' }}
                className="px-5 py-4 rounded-md font-mono text-white shadow-2xl relative"
                style={{
                  backgroundImage: 'repeating-linear-gradient(0deg, #7c2d12 0 14px, #b45309 14px 16px)',
                  border: '2px solid #f59e0b',
                  minWidth: '160px',
                  textAlign: 'center',
                }}
              >
                <div className="text-[9px] uppercase tracking-widest text-amber-200 mb-1">barricade</div>
                <div className="text-base font-black drop-shadow-lg">{m.term}</div>
                <div className="text-[10px] text-amber-200 mt-1">M{m.idx}</div>
              </motion.div>
              {i < MAX.length - 1 && (
                <motion.div
                  initial={{ scale: 0 }} animate={isActive ? { scale: 1 } : {}}
                  transition={{ delay: 0.3 + i * 0.15 }}
                  className="text-amber-400 font-black"
                >
                  <X size={28} strokeWidth={3} />
                </motion.div>
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="flex justify-center mt-10">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={isActive ? { scale: 1, opacity: 1 } : {}}
            transition={{ delay: 1.0 }}
            className="flex items-center gap-3 px-6 py-3 rounded-full border-2 border-amber-400 bg-amber-500/10"
          >
            <Construction size={20} className="text-amber-400" />
            <span className="font-mono text-xs uppercase tracking-widest text-amber-400 font-black">
              The mandatory checkpoint chain - all walls must hold
            </span>
          </motion.div>
        </div>
      </motion.div>

      {/* Three notations */}
      <div className="space-y-5">
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4 }}
          className={`p-6 rounded-3xl border ${cardBg}`}
        >
          <div className="font-mono text-[10px] uppercase tracking-widest opacity-50 mb-3">
            The Full Blueprint
          </div>
          <div className={`font-mono text-xl md:text-2xl font-black ${textColor}`}>
            E = M<sub>3</sub> · M<sub>5</sub> · M<sub>6</sub> · M<sub>7</sub>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5 }}
          className={`p-6 rounded-3xl border ${cardBg}`}
        >
          <div className="font-mono text-[10px] uppercase tracking-widest opacity-50 mb-3">
            Expanded Canonical Equation
          </div>
          <div className={`font-mono text-base md:text-xl font-black ${textColor}`}>
            E = (R+A&apos;+W&apos;) · (R&apos;+A+W&apos;) · (R&apos;+A&apos;+W) · (R&apos;+A&apos;+W&apos;)
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6 }}
          className={`p-6 rounded-3xl border ${
            isDarkMode ? 'bg-amber-500/5 border-amber-500/30' : 'bg-amber-50 border-amber-300'
          }`}
        >
          <div className={`font-mono text-[10px] uppercase tracking-widest mb-3 ${
            isDarkMode ? 'text-amber-400' : 'text-amber-700'
          }`}>
            Shorthand notation - what you should actually write
          </div>
          <div className={`font-mono text-3xl md:text-4xl font-black ${
            isDarkMode ? 'text-amber-400' : 'text-amber-700'
          }`}>
            E = ΠM(3, 5, 6, 7)
          </div>
        </motion.div>
      </div>

      <p className={`text-center text-sm font-medium ${subText}`}>
        Product of Sums literally means a <strong>mandatory sequence (·)</strong> of <strong>escape routes (+)</strong>.
      </p>
    </div>
  );
};
