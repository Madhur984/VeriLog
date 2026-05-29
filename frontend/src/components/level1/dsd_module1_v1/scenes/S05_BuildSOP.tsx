import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBasket, Plus } from 'lucide-react';

interface Props { isActive: boolean; isDarkMode: boolean; }

const MINTERMS = [
  { idx: 0, term: "R'·A'·W'" },
  { idx: 1, term: "R'·A'·W"  },
  { idx: 2, term: "R'·A·W'"  },
  { idx: 4, term: "R·A'·W'"  },
];

export const S05_BuildSOP: React.FC<Props> = ({ isActive, isDarkMode }) => {
  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';

  return (
    <div className="max-w-6xl mx-auto space-y-12 py-4">
      <div className="grid lg:grid-cols-[1fr_0.9fr] gap-8 items-center">
        <section className="space-y-3">
          <div className="font-mono text-[10px] tracking-[0.4em] uppercase text-emerald-400">
            Chapter 05 · The Basket
          </div>
          <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>
            Building the Canonical Sum of Products
          </h2>
          <p className={`text-base ${subText}`}>
            A snapshot is just one happy moment - Ben needs <em>any</em> of them to call the day a
            win. Drop every minterm into a basket and OR them together. The basket itself is the
            canonical SOP.
          </p>
        </section>
        <motion.div
          initial={{ opacity: 0, x: 16 }} animate={isActive ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: 0.1 }}
          className="rounded-3xl overflow-hidden border border-white/10" style={{ background: '#fef9f0' }}
        >
          <img src="/images/sketchbook/p06.webp" alt="Sketchbook - gathering minterms in a basket" className="w-full block" />
        </motion.div>
      </div>

      {/* Visual basket animation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        className={`p-10 rounded-3xl border relative overflow-hidden ${cardBg}`}
      >
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-emerald-400/10 rounded-full blur-3xl" />
        <div className="flex flex-wrap items-end justify-center gap-4 mb-10 relative">
          {MINTERMS.map((m, i) => (
            <React.Fragment key={m.idx}>
              <motion.div
                initial={{ y: -40, opacity: 0, rotate: -8 }}
                animate={isActive ? { y: 0, opacity: 1, rotate: i % 2 === 0 ? -2 : 2 } : {}}
                transition={{ delay: 0.2 + i * 0.15, type: 'spring', bounce: 0.5 }}
                className="px-5 py-4 rounded-xl border-2 bg-white/90 text-slate-900 shadow-2xl font-mono"
                style={{ borderColor: '#10b981' }}
              >
                <div className="text-[9px] uppercase tracking-widest text-emerald-600 mb-1">snapshot</div>
                <div className="text-lg font-black">{m.term}</div>
                <div className="text-[10px] text-slate-500 mt-1">m{m.idx}</div>
              </motion.div>
              {i < MINTERMS.length - 1 && (
                <motion.div
                  initial={{ scale: 0 }} animate={isActive ? { scale: 1 } : {}}
                  transition={{ delay: 0.3 + i * 0.15 }}
                  className="text-emerald-400 font-black text-3xl"
                >
                  <Plus size={28} />
                </motion.div>
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="flex justify-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={isActive ? { scale: 1, opacity: 1 } : {}}
            transition={{ delay: 1.0 }}
            className="flex items-center gap-3 px-6 py-3 rounded-full border-2 border-emerald-400 bg-emerald-500/10"
          >
            <ShoppingBasket size={20} className="text-emerald-400" />
            <span className="font-mono text-xs uppercase tracking-widest text-emerald-400 font-black">
              The basket - gather any happy snapshot
            </span>
          </motion.div>
        </div>
      </motion.div>

      {/* Three notations */}
      <div className="grid md:grid-cols-1 gap-5">
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4 }}
          className={`p-6 rounded-3xl border ${cardBg}`}
        >
          <div className="font-mono text-[10px] uppercase tracking-widest opacity-50 mb-3">
            The Full Blueprint
          </div>
          <div className={`font-mono text-xl md:text-2xl font-black ${textColor}`}>
            E = m<sub>0</sub> + m<sub>1</sub> + m<sub>2</sub> + m<sub>4</sub>
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
            E = (R&apos;·A&apos;·W&apos;) + (R&apos;·A&apos;·W) + (R&apos;·A·W&apos;) + (R·A&apos;·W&apos;)
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6 }}
          className={`p-6 rounded-3xl border ${
            isDarkMode ? 'bg-emerald-500/5 border-emerald-500/30' : 'bg-emerald-50 border-emerald-300'
          }`}
        >
          <div className={`font-mono text-[10px] uppercase tracking-widest mb-3 ${
            isDarkMode ? 'text-emerald-400' : 'text-emerald-700'
          }`}>
            Shorthand notation - what you should actually write
          </div>
          <div className={`font-mono text-3xl md:text-4xl font-black ${
            isDarkMode ? 'text-emerald-400' : 'text-emerald-700'
          }`}>
            E = Σm(0, 1, 2, 4)
          </div>
        </motion.div>
      </div>

      <p className={`text-center text-sm font-medium ${subText}`}>
        Sum of Products literally means a <strong>collection (+)</strong> of <strong>specific scenarios (·)</strong>.
      </p>

      {/* Boolean algebra primer - postulates that justify the canonical form */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.7 }}
        className={`p-6 rounded-3xl border ${cardBg}`}
      >
        <div className="font-mono text-[10px] uppercase tracking-widest opacity-60 mb-5">
          Theory · The Boolean axioms making this work
        </div>
        <div className="grid md:grid-cols-3 gap-3">
          {[
            { law: 'X + 0 = X',     title: 'Identity (OR)',       why: 'OR-ing a 0 changes nothing - so missing minterms add no error.' },
            { law: 'X · 1 = X',     title: 'Identity (AND)',      why: 'A "true" condition contributes only itself.' },
            { law: 'X + X̄ = 1',     title: 'Complement (OR)',     why: 'Every variable is either itself or its complement.' },
            { law: 'X · X̄ = 0',     title: 'Complement (AND)',    why: 'Cannot be true and false simultaneously.' },
            { law: 'X + X = X',     title: 'Idempotent (OR)',     why: 'Adding the same minterm twice does not double-count.' },
            { law: 'X · 0 = 0',     title: 'Annihilator (AND)',   why: 'A minterm that contradicts itself simplifies to zero.' },
          ].map(p => (
            <div key={p.law} className={`p-4 rounded-2xl border ${
              isDarkMode ? 'bg-black/30 border-white/10' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="font-mono text-lg font-black text-emerald-400 mb-1">{p.law}</div>
              <div className={`text-[11px] font-bold ${textColor} mb-1`}>{p.title}</div>
              <div className={`text-[11px] leading-relaxed ${subText}`}>{p.why}</div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
