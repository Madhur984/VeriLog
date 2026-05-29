import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Train, Zap, Lock, TrendingUp, AlertTriangle } from 'lucide-react';

interface Props { isActive: boolean; isDarkMode: boolean; }

export const S00_Cover: React.FC<Props> = ({ isActive, isDarkMode }) => {
  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const cardBg = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';
  const subText = isDarkMode ? 'text-slate-300' : 'text-slate-600';

  return (
    <div className="max-w-6xl mx-auto space-y-16 py-8">
      {/* Hero PDF cover */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }} animate={isActive ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.7 }}
        className="relative rounded-3xl overflow-hidden border border-sky-300/30 mx-auto max-w-4xl aspect-[16/9] shadow-[0_30px_80px_rgba(56,189,248,0.2)]"
      >
        <img
          src="/images/commuter/p01.webp"
          alt="The Commuter Circuit - P-N junction demystified"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#020812] via-transparent to-transparent opacity-80" />
        <div className="absolute bottom-3 right-4 font-mono text-[9px] uppercase tracking-widest text-sky-200/80">
          Commuter Circuit · Cover
        </div>
      </motion.div>

      <section className="text-center space-y-6 relative">
        <motion.span
          initial={{ opacity: 0, y: -10 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
          className="font-mono text-[10px] tracking-[0.4em] uppercase text-sky-400 block"
        >
          Basic Electronics · Module 3 · The P-N Junction
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }} animate={isActive ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6 }}
          className={`text-5xl md:text-7xl font-black tracking-tight leading-[0.95] ${textColor}`}
        >
          The Commuter<br />
          <span className="bg-gradient-to-r from-sky-300 via-cyan-300 to-emerald-400 bg-clip-text text-transparent">
            Circuit
          </span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }} animate={isActive ? { opacity: 1 } : {}}
          transition={{ delay: 0.2 }}
          className={`text-lg md:text-xl max-w-2xl mx-auto ${subText}`}
        >
          The P-N junction explained through Mumbai Local - crowded platforms, locked doors,
          massive boarding, and a chaotic stampede. Every diode operating mode mapped to a
          rush-hour scenario that <em>actually</em> sticks.
        </motion.p>
      </section>

      {/* Story arc - 4 modes */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.3 }}
        className={`p-8 rounded-3xl border ${cardBg}`}
      >
        <div className="flex items-center gap-3 mb-6">
          <Sparkles size={16} className="text-sky-400" />
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-sky-400">
            Four operating modes · one curve
          </span>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { Icon: Train,         tag: 'No Bias',       sub: 'Crowded Platform',       d: 'V_D = 0 · depletion forms · I = 0', color: '#94a3b8' },
            { Icon: Lock,          tag: 'Reverse Bias',  sub: 'Locked Doors',           d: 'V_D < 0 · gap widens · only I_S leaks', color: '#38bdf8' },
            { Icon: TrendingUp,    tag: 'Forward Bias',  sub: 'Massive Boarding',       d: 'V_D > 0 · doors open · exponential rise', color: '#34d399' },
            { Icon: AlertTriangle, tag: 'Breakdown',     sub: 'The Stampede',           d: 'V_D = V_BV · avalanche · be careful', color: '#f43f5e' },
          ].map((s) => (
            <div key={s.tag} className={`p-5 rounded-2xl border`} style={{ borderColor: `${s.color}55`, backgroundColor: `${s.color}0d` }}>
              <div className="flex items-center gap-2 mb-2">
                <s.Icon size={14} style={{ color: s.color }} />
                <span className="font-mono text-[10px] uppercase tracking-widest" style={{ color: s.color }}>{s.tag}</span>
              </div>
              <h4 className={`font-black text-base ${textColor}`}>{s.sub}</h4>
              <p className={`text-xs ${subText} mt-2`}>{s.d}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Hero callouts */}
      <div className="grid md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }} animate={isActive ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: 0.4 }}
          className={`p-8 rounded-3xl border ${cardBg} relative overflow-hidden`}
        >
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-sky-400/10 rounded-full blur-3xl" />
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-sky-300">
              <Train size={22} />
            </div>
            <div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-sky-400 mb-1">Prerequisite</div>
              <h3 className={`text-xl font-black ${textColor}`}>Semiconductor physics</h3>
            </div>
          </div>
          <p className={`text-sm leading-relaxed ${subText}`}>
            This module assumes you&apos;ve completed <strong className="text-sky-300">Module 2</strong>: intrinsic
            silicon, the energy gap, doping (N-Type and P-Type), and electron-vs-hole flow. If
            those concepts are still hazy, head back first.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }} animate={isActive ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: 0.5 }}
          className={`p-8 rounded-3xl border ${cardBg} relative overflow-hidden`}
        >
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-400/10 rounded-full blur-3xl" />
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300">
              <Zap size={22} />
            </div>
            <div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-emerald-400 mb-1">The Payoff</div>
              <h3 className={`text-xl font-black ${textColor}`}>The diode</h3>
            </div>
          </div>
          <p className={`text-sm leading-relaxed ${subText}`}>
            By the end you can read any V-I curve, derive Shockley&apos;s equation, distinguish
            Avalanche from Zener breakdown, and recognise the diode symbol in any schematic. The
            P-N junction is the foundation of <em>every</em> active component that follows.
          </p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.6 }}
        className={`p-8 rounded-3xl border ${cardBg}`}
      >
        <div className="flex items-center gap-2 mb-6">
          <Sparkles size={14} className="text-sky-400" />
          <span className="font-mono text-[10px] uppercase tracking-widest text-sky-400">
            By the end of this module · you will be able to
          </span>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { tag: 'Depletion region', desc: 'Explain why a barrier forms when N and P slabs touch.' },
            { tag: 'Bias states',      desc: 'Predict carrier movement under no/forward/reverse bias.' },
            { tag: 'Shockley\'s eq',    desc: 'Compute I_D given V_D and the diode parameters.' },
            { tag: 'Diode symbol',     desc: 'Recognise it on any schematic and read its polarity.' },
          ].map((cap) => (
            <div
              key={cap.tag}
              className={`p-4 rounded-2xl border ${
                isDarkMode ? 'bg-black/30 border-white/10' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="font-mono text-[10px] uppercase tracking-widest text-sky-300 mb-2">{cap.tag}</div>
              <p className={`text-xs leading-relaxed ${subText}`}>{cap.desc}</p>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }} animate={isActive ? { opacity: 1 } : {}}
        transition={{ delay: 0.9 }}
        className={`text-center text-xs font-mono uppercase tracking-[0.3em] ${subText}`}
      >
        Press <kbd className="px-2 py-1 rounded bg-black/20 text-[10px]">→</kbd> to begin · 10 chapters · ~30 min
      </motion.div>
    </div>
  );
};
