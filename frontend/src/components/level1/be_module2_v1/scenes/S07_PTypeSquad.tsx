import React from 'react';
import { motion } from 'framer-motion';
import { Users, Inbox } from 'lucide-react';

interface Props { isActive: boolean; isDarkMode: boolean; }

export const S07_PTypeSquad: React.FC<Props> = ({ isActive, isDarkMode }) => {
  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText   = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg    = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';

  return (
    <div className="max-w-6xl mx-auto space-y-14 py-4">
      <section className="space-y-3">
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.4em] uppercase text-fuchsia-400">
          <Users size={14} /> Chapter 07 · P-Type
        </div>
        <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>The 3-Friend Squad</h2>
        <p className={`text-base max-w-3xl ${subText}`}>
          Now dope silicon with a <strong className="text-fuchsia-300">trivalent</strong>{' '}
          impurity (B, Ga, In). Only 3 of the 4 covalent bonds get filled - the missing electron
          leaves a <strong className="text-fuchsia-300">vacancy = a hole</strong>, behaving like a
          mobile positive charge.
        </p>
      </section>

      <div className="grid lg:grid-cols-[1.1fr_1fr] gap-8 items-stretch">
        <motion.div
          initial={{ opacity: 0, x: -20 }} animate={isActive ? { opacity: 1, x: 0 } : {}}
          className={`relative rounded-3xl overflow-hidden border ${cardBg}`}
        >
          <img src="/images/semi/p08.webp" alt="P-Type 3-friend squad" className="w-full block aspect-[16/9] object-cover" />
          <div className="absolute bottom-3 right-4 font-mono text-[9px] uppercase tracking-widest text-fuchsia-200/80">
            Madhur&apos;s Lab · Page 08
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }} animate={isActive ? { opacity: 1, x: 0 } : {}}
          className={`p-8 rounded-3xl border ${cardBg} space-y-5`}
        >
          <div className="font-mono text-[10px] uppercase tracking-widest text-fuchsia-400">The Chemistry</div>
          <p className={`text-sm ${subText} leading-relaxed`}>
            Group III elements have only 3 valence electrons. Three bonds form correctly; the
            fourth is incomplete. That missing electron <em>position</em> is the
            <strong className="text-fuchsia-300"> hole</strong>, and any neighbouring electron can
            jump into it.
          </p>
          <div className="rounded-2xl p-5 border border-fuchsia-400/40 bg-fuchsia-500/5">
            <div className="flex items-center gap-2 mb-2">
              <Inbox size={14} className="text-fuchsia-300" />
              <span className="font-mono text-[10px] uppercase tracking-widest text-fuchsia-300">Madhur&apos;s Note</span>
            </div>
            <p className={`text-sm ${textColor}`}>
              Trivalent impurities = <strong>acceptor atoms</strong>. They sit there ready to
              <em> accept</em> any wandering electron - leaving the original spot empty.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Custom musical-chairs hole-flow animation replacing the second PDF page */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.15 }}
        className={`p-8 rounded-3xl border ${cardBg}`}
      >
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-fuchsia-400 mb-3">
          Musical chairs · the hole illusion
        </div>
        <p className={`text-xs ${subText} mb-5`}>
          Watch carefully. Only the <span className="text-orange-300">orange electrons</span>{' '}
          actually move (left to right). The <span className="text-fuchsia-300">magenta hole</span>
          {' '}appears to move the opposite way - but it&apos;s just a vacancy being filled in
          sequence. That apparent motion <em>behaves identically</em> to a positive charge moving
          right-to-left.
        </p>

        <div className={`relative h-32 rounded-2xl overflow-hidden border ${isDarkMode ? 'bg-black/40 border-white/10' : 'bg-slate-100 border-slate-200'}`}>
          {/* 7 chair slots */}
          {Array.from({ length: 7 }).map((_, i) => (
            <div
              key={i}
              className="absolute top-1/2 -translate-y-1/2 w-12 h-12 rounded-md border border-slate-500/40"
              style={{ left: `calc(${(i + 0.5) * (100 / 7)}% - 24px)` }}
            />
          ))}
          {/* Animated hole - moves leftward (positions 6 → 0 cyclically) */}
          <motion.div
            animate={{ left: ['calc(85.7% - 18px)', 'calc(14.3% - 18px)'] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            className="absolute top-1/2 -translate-y-1/2 w-9 h-9 rounded-md border-2 border-fuchsia-400 grid place-items-center font-mono text-fuchsia-300 font-bold text-xs shadow-[0_0_16px_rgba(232,121,249,0.5)]"
          >
            HOLE
          </motion.div>
          {/* Six electrons - they move right one slot at a time, opposite to the hole */}
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <motion.div
              key={i}
              animate={{
                left: [`calc(${(i + 0.5) * (100 / 7)}% - 14px)`, `calc(${(i + 1.5) * (100 / 7)}% - 14px)`],
              }}
              transition={{
                duration: 4 / 6,
                delay: (5 - i) * (4 / 6),
                repeat: Infinity,
                repeatDelay: 4 - (4 / 6),
                ease: 'easeInOut',
              }}
              className="absolute top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-orange-400 grid place-items-center text-black font-mono text-[10px] font-bold shadow-[0_0_10px_rgba(251,146,60,0.5)]"
            >
              −
            </motion.div>
          ))}
        </div>

        <div className="grid sm:grid-cols-3 gap-3 mt-5">
          <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-black/30 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
            <div className="font-mono text-[10px] uppercase tracking-widest text-orange-300 mb-1">Real motion</div>
            <p className={`text-xs ${subText}`}>Electrons jump rightward, one at a time, into the empty spot ahead.</p>
          </div>
          <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-black/30 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
            <div className="font-mono text-[10px] uppercase tracking-widest text-fuchsia-300 mb-1">Apparent motion</div>
            <p className={`text-xs ${subText}`}>The hole drifts leftward - opposite to the electrons.</p>
          </div>
          <div className={`p-4 rounded-2xl border-2 border-fuchsia-400/60 bg-fuchsia-500/10`}>
            <div className="font-mono text-[10px] uppercase tracking-widest text-fuchsia-300 mb-1">Why we model it</div>
            <p className={`text-xs ${subText}`}>Tracking one positive carrier is far simpler than tracking N electrons.</p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.25 }}
        className={`p-8 rounded-3xl border ${cardBg} space-y-4`}
      >
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-fuchsia-400">The illusion of motion</div>
        <p className={`text-sm ${subText} leading-relaxed`}>
          Holes don&apos;t physically move. Electrons keep jumping into adjacent vacancies, which
          makes the <em>vacancy itself</em> appear to slide in the opposite direction. We treat
          this apparent movement as a positive charge carrier - it&apos;s simpler.
        </p>
        <div className="grid sm:grid-cols-3 gap-4 pt-2">
          <div className={`p-5 rounded-2xl border-2 border-fuchsia-400 bg-fuchsia-500/10`}>
            <div className="font-mono text-[10px] uppercase tracking-widest text-fuchsia-300 mb-2">Majority</div>
            <h4 className={`text-2xl font-black text-fuchsia-300`}>Holes</h4>
            <p className={`text-xs ${subText} mt-2`}>The bosses - the dominant carrier in P-Type.</p>
          </div>
          <div className={`p-5 rounded-2xl border ${isDarkMode ? 'bg-black/30 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
            <div className="font-mono text-[10px] uppercase tracking-widest text-orange-300 mb-2">Minority</div>
            <h4 className={`text-2xl font-black text-orange-300`}>Electrons</h4>
            <p className={`text-xs ${subText} mt-2`}>Tiny thermal generation - present but negligible.</p>
          </div>
          <div className={`p-5 rounded-2xl border ${isDarkMode ? 'bg-black/30 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
            <div className="font-mono text-[10px] uppercase tracking-widest text-fuchsia-400 mb-2">Result</div>
            <h4 className={`text-2xl font-black ${textColor}`}>P-Type</h4>
            <p className={`text-xs ${subText} mt-2`}>Conductivity dominated by positive (hole) carriers.</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
