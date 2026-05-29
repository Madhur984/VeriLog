import React from 'react';
import { motion } from 'framer-motion';
import { Users, ArrowLeftRight } from 'lucide-react';

interface Props { isActive: boolean; isDarkMode: boolean; }

export const S02_TheCast: React.FC<Props> = ({ isActive, isDarkMode }) => {
  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText   = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg    = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';

  return (
    <div className="max-w-6xl mx-auto space-y-14 py-4">
      <section className="space-y-3">
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.4em] uppercase text-sky-400">
          <Users size={14} /> Chapter 02 · The Cast
        </div>
        <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>Commuters and Empty Seats</h2>
        <p className={`text-base max-w-3xl ${subText}`}>
          Before any junction can form, you need two slabs of doped silicon ready to meet. The
          <strong className="text-sky-300"> N-Type slab</strong> is full of energetic electron
          commuters. The <strong className="text-orange-300">P-Type slab</strong> is full of
          empty seats (holes). What happens when their boundaries touch?
        </p>
      </section>

      {/* Single PDF page */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        className={`relative rounded-3xl overflow-hidden border ${cardBg}`}
      >
        <img src="/images/commuter/p02.webp" alt="The cast - N-Type and P-Type" className="w-full block aspect-[16/9] object-cover" />
        <div className="absolute bottom-3 right-4 font-mono text-[9px] uppercase tracking-widest text-sky-200/80">
          Commuter Circuit · The Cast
        </div>
      </motion.div>

      {/* Side-by-side props */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.15 }}
        className={`p-8 rounded-3xl border ${cardBg}`}
      >
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-sky-400 mb-5">Cast comparison · before they meet</div>
        <div className="grid md:grid-cols-2 gap-5">
          <div className="rounded-2xl overflow-hidden border border-sky-400/40 bg-sky-500/5">
            <div className="p-3 bg-sky-500/10 font-mono text-[10px] uppercase tracking-widest text-sky-300">
              N-Type · the commuter platform
            </div>
            <div className="relative h-32 bg-black/30 overflow-hidden">
              {Array.from({ length: 24 }).map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    x: [`${(i * 17) % 100}%`, `${((i * 17) % 100) + 8}%`, `${(i * 17) % 100}%`],
                    y: [`${(i * 11) % 80 + 5}%`, `${((i * 11) % 80 + 5) - 4}%`, `${(i * 11) % 80 + 5}%`],
                  }}
                  transition={{ duration: 3 + (i % 3), repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute w-3 h-3 rounded-full bg-sky-400 grid place-items-center text-[8px] text-black font-bold shadow-[0_0_6px_rgba(56,189,248,0.5)]"
                >−</motion.div>
              ))}
            </div>
            <div className="p-3 space-y-2">
              <p className={`text-xs ${subText}`}>Majority carrier: <strong className="text-sky-300">electrons</strong></p>
              <p className={`text-xs ${subText}`}>Built-in <strong>donor ions (+)</strong> stay fixed in the lattice.</p>
              <p className={`text-xs ${subText} italic`}>The crowd is moving and looking for a seat.</p>
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden border border-orange-400/40 bg-orange-500/5">
            <div className="p-3 bg-orange-500/10 font-mono text-[10px] uppercase tracking-widest text-orange-300">
              P-Type · the empty train
            </div>
            <div className="relative h-32 bg-black/30 overflow-hidden">
              {Array.from({ length: 18 }).map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    x: [`${(i * 23) % 100}%`, `${((i * 23) % 100) - 8}%`, `${(i * 23) % 100}%`],
                  }}
                  transition={{ duration: 3 + (i % 3), repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute w-3 h-3 rounded-md border-2 border-orange-400 grid place-items-center text-[8px] text-orange-300 font-bold"
                  style={{ top: `${(i * 19) % 80 + 5}%` }}
                >+</motion.div>
              ))}
            </div>
            <div className="p-3 space-y-2">
              <p className={`text-xs ${subText}`}>Majority carrier: <strong className="text-orange-300">holes</strong></p>
              <p className={`text-xs ${subText}`}>Built-in <strong>acceptor ions (−)</strong> stay fixed in the lattice.</p>
              <p className={`text-xs ${subText} italic`}>The empty seats are pulling commuters in.</p>
            </div>
          </div>
        </div>

        {/* Big arrow & cliffhanger */}
        <div className="mt-8 flex flex-col items-center gap-3">
          <ArrowLeftRight className="text-sky-300" size={28} />
          <p className={`text-sm ${subText} text-center max-w-md`}>
            What happens when these two slabs are <strong className="text-sky-300">fused at
            their boundary</strong>? That story - diffusion, drift, and the depletion region -
            unfolds in the next chapter.
          </p>
        </div>
      </motion.div>
    </div>
  );
};
