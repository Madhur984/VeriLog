import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Coffee, Atom, Cpu, Train, Wand2 } from 'lucide-react';

interface Props { isActive: boolean; isDarkMode: boolean; }

export const S00_Cover: React.FC<Props> = ({ isActive, isDarkMode }) => {
  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const cardBg = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';
  const subText = isDarkMode ? 'text-slate-300' : 'text-slate-600';

  return (
    <div className="max-w-6xl mx-auto space-y-16 py-8">
      {/* Hero illustration from PDF p01 */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }} animate={isActive ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.7 }}
        className="relative rounded-3xl overflow-hidden border border-orange-300/30 mx-auto max-w-4xl aspect-[16/9] shadow-[0_30px_80px_rgba(251,146,60,0.2)]"
      >
        <img loading="lazy" decoding="async"
          src="/images/semi/p01.webp"
          alt="Decoding Semiconductor Physics the Madhur Way"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#080603] via-transparent to-transparent opacity-80" />
        <div className="absolute bottom-3 right-4 font-mono text-[9px] uppercase tracking-widest text-orange-200/80">
          Madhur&apos;s Lab · Page 01
        </div>
      </motion.div>

      <section className="text-center space-y-6 relative">
        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }} animate={isActive ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6 }}
          className={`text-5xl md:text-7xl font-black tracking-tight leading-[0.95] ${textColor}`}
        >
          From Silicon<br />
          <span className="bg-gradient-to-r from-orange-400 via-amber-300 to-sky-400 bg-clip-text text-transparent">
            to the P-N Junction
          </span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }} animate={isActive ? { opacity: 1 } : {}}
          transition={{ delay: 0.2 }}
          className={`text-lg md:text-xl max-w-2xl mx-auto ${subText}`}
        >
          B.Tech logic, tapri analogies, and a Mumbai Local. Pure silicon, doping{' '}
          <em>jugaad</em>, depletion regions and the diode V-I curve - all explained the way
          <strong className="text-orange-300"> Madhur</strong> teaches it.
        </motion.p>
      </section>

      <div className="grid md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }} animate={isActive ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: 0.3 }}
          className={`p-8 rounded-3xl border ${cardBg} relative overflow-hidden`}
        >
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-orange-400/10 rounded-full blur-3xl" />
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/20 border border-orange-400/40 flex items-center justify-center text-orange-300">
              <Atom size={22} />
            </div>
            <div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-orange-400 mb-1">Part 1 · The Material</div>
              <h3 className={`text-xl font-black ${textColor}`}>Semiconductor Physics</h3>
            </div>
          </div>
          <p className={`text-sm leading-relaxed ${subText}`}>
            Silicon as a 4-seater hostel. Heat as the trigger. Doping as the ultimate
            <em> jugaad</em>. The N-Type 5-friend squad, the P-Type 3-friend squad, and a
            cheat sheet you can screenshot for tomorrow&apos;s mid-term.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }} animate={isActive ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: 0.4 }}
          className={`p-8 rounded-3xl border ${cardBg} relative overflow-hidden`}
        >
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-sky-400/10 rounded-full blur-3xl" />
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-sky-300">
              <Train size={22} />
            </div>
            <div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-sky-400 mb-1">Part 2 · The Junction</div>
              <h3 className={`text-xl font-black ${textColor}`}>The Commuter Circuit</h3>
            </div>
          </div>
          <p className={`text-sm leading-relaxed ${subText}`}>
            P-N Junction = Mumbai Local platform. No bias = crowded standoff. Reverse bias =
            locked doors. Forward bias = massive boarding (Shockley&apos;s exponential rise).
            Breakdown = uncontrolled stampede.
          </p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.5 }}
        className={`p-8 rounded-3xl border ${cardBg}`}
      >
        <div className="flex items-center gap-3 mb-6">
          <Sparkles size={16} className="text-orange-400" />
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-orange-400">Story Arc</span>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {[
            { Icon: Atom,  n: '01', t: 'Pure Silicon',  d: 'Intrinsic 4-seater hostel · stable but dead-quiet at room temperature.' },
            { Icon: Cpu,   n: '02', t: 'Doping Jugaad', d: 'Add Group V or Group III impurities · build N-Type and P-Type carriers.' },
            { Icon: Wand2, n: '03', t: 'P-N Junction',  d: 'Sandwich them · meet the depletion region, the diode, and the V-I curve.' },
          ].map((s) => (
            <div key={s.n} className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-orange-500/15 border border-orange-400/30 flex items-center justify-center text-orange-300">
                  <s.Icon size={16} />
                </div>
                <span className="font-mono text-3xl font-black text-orange-400/60">{s.n}</span>
                <h4 className={`font-black text-sm ${textColor}`}>{s.t}</h4>
              </div>
              <p className={`text-xs leading-relaxed ${subText}`}>{s.d}</p>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.6 }}
        className={`p-8 rounded-3xl border ${cardBg}`}
      >
        <div className="flex items-center gap-2 mb-6">
          <Sparkles size={14} className="text-orange-400" />
          <span className="font-mono text-[10px] uppercase tracking-widest text-orange-400">
            By the end of this module · you will be able to
          </span>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { tag: 'Energy bands',     desc: 'Read valence vs conduction band and explain Eg = 1.1 eV for silicon.' },
            { tag: 'Doping',           desc: 'Distinguish donor/acceptor atoms and predict majority carriers.' },
            { tag: 'P-N Junction',     desc: 'Reason about the depletion region under no/forward/reverse bias.' },
            { tag: 'V-I curve',        desc: 'Explain Shockley\'s equation, knee voltage and breakdown.' },
          ].map((cap) => (
            <div
              key={cap.tag}
              className={`p-4 rounded-2xl border ${
                isDarkMode ? 'bg-black/30 border-white/10' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="font-mono text-[10px] uppercase tracking-widest text-orange-300 mb-2">{cap.tag}</div>
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
        <Coffee size={14} className="inline -mt-0.5 mr-1" />
        Press <kbd className="px-2 py-1 rounded bg-black/20 text-[10px]">→</kbd> to begin · 17 chapters · ~50 min
      </motion.div>
    </div>
  );
};
