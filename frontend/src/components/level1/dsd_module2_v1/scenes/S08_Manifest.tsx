import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ScrollText, Crown, Lightbulb } from 'lucide-react';
import { TryItYourself } from '../../../ui/TryItYourself';

interface Props { isActive: boolean; isDarkMode: boolean; }

const GRID = [
  [0, 1, 3, 2],
  [4, 5, 7, 6],
  [12, 13, 15, 14],
  [8, 9, 11, 10],
];

const PREMIUM = new Set([0, 1, 2, 6, 8, 10, 13, 14]);

const minTermLabel = (m: number) => {
  const A = (m >> 3) & 1, B = (m >> 2) & 1, C = (m >> 1) & 1, D = m & 1;
  const lit = (v: number, s: string) => (v ? s : `${s}'`);
  return `${lit(A, 'A')}${lit(B, 'B')}${lit(C, 'C')}${lit(D, 'D')}`;
};

export const S08_Manifest: React.FC<Props> = ({ isActive, isDarkMode }) => {
  const [picked, setPicked] = useState<Set<number>>(new Set());

  const allCorrect =
    picked.size === PREMIUM.size && [...PREMIUM].every((m) => picked.has(m));

  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';

  return (
    <div className="max-w-6xl mx-auto space-y-12 py-4">
      <section className="space-y-3">
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.4em] uppercase text-cyan-400">
          <ScrollText size={14} /> Chapter 08 · The Manifest
        </div>
        <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>Today&apos;s Manifest</h2>
        <p className={`text-base max-w-3xl ${subText}`}>
          Madhur receives the daily upgrade order. Eight rooms must be served as Premium Guests:
        </p>
        <div className={`p-5 rounded-2xl border ${cardBg} max-w-fit font-mono text-lg md:text-2xl text-cyan-300`}>
          Y = Σm(0, 1, 2, 6, 8, 10, 13, 14)
        </div>
      </section>

      <div className="grid lg:grid-cols-[1.4fr_1fr] gap-8">
        {/* Plotting grid (interactive) */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
          className={`relative p-6 rounded-3xl border ${cardBg}`}
        >
          <TryItYourself corner />
          <div className="flex items-center gap-2 mb-4">
            <Crown size={14} className="text-amber-400" />
            <span className="font-mono text-[10px] uppercase tracking-widest text-amber-400">
              Plot the manifest · click each premium guest
            </span>
            <button
              onClick={() => setPicked(new Set())}
              className={`ml-auto px-3 py-1 rounded-md text-[10px] font-mono font-bold border ${
                isDarkMode ? 'border-white/10 hover:bg-white/5' : 'border-slate-200 hover:bg-slate-100'
              }`}
            >
              Reset
            </button>
            <button
              onClick={() => setPicked(new Set(PREMIUM))}
              className="px-3 py-1 rounded-md text-[10px] font-mono font-bold bg-amber-400 text-black"
            >
              Auto-fill
            </button>
          </div>

          {/* CD column header */}
          <div className="grid grid-cols-[48px_repeat(4,minmax(0,1fr))] sm:grid-cols-[80px_repeat(4,minmax(0,1fr))] gap-1.5 items-end mb-1">
            <div className="text-right">
              <div className="font-mono text-[10px] uppercase tracking-widest text-cyan-300/80">A,B ↓</div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-cyan-300/80">C,D →</div>
            </div>
            {['00', '01', '11', '10'].map((cd, c) => (
              <div key={c} className="text-center font-mono text-sm text-cyan-300/90">{cd}</div>
            ))}
          </div>

          <div className="space-y-1.5">
            {['00', '01', '11', '10'].map((ab, r) => (
              <div key={r} className="grid grid-cols-[48px_repeat(4,minmax(0,1fr))] sm:grid-cols-[80px_repeat(4,minmax(0,1fr))] gap-1.5 items-stretch">
                <div className="flex items-center justify-end font-mono text-sm text-cyan-300/90">{ab}</div>
                {GRID[r].map((m, c) => {
                  const isPicked = picked.has(m);
                  const isPremium = PREMIUM.has(m);
                  const showHint = isPicked && !isPremium;
                  return (
                    <button
                      key={c}
                      onClick={() =>
                        setPicked((prev) => {
                          const n = new Set(prev);
                          n.has(m) ? n.delete(m) : n.add(m);
                          return n;
                        })
                      }
                      className="aspect-square rounded-lg flex flex-col items-center justify-center font-mono font-black border-2 transition-all relative overflow-hidden"
                      style={{
                        background: isPicked
                          ? showHint
                            ? 'rgba(244,63,94,0.18)'
                            : isPremium
                            ? 'rgba(252,211,77,0.22)'
                            : 'rgba(255,255,255,0.04)'
                          : isDarkMode ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)',
                        borderColor: isPicked
                          ? showHint
                            ? '#f43f5e'
                            : '#fcd34d'
                          : isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                        boxShadow: isPicked && isPremium ? '0 0 18px rgba(252,211,77,0.4)' : undefined,
                      }}
                    >
                      {isPicked && isPremium ? (
                        <motion.span
                          key={`crown-${m}`}
                          initial={{ scale: 0, rotate: -30 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ type: 'spring', stiffness: 320, damping: 16 }}
                          className="text-2xl text-amber-300"
                        >
                          ★
                        </motion.span>
                      ) : (
                        <span className={`text-2xl ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>
                          {m}
                        </span>
                      )}
                      <span className="text-[9px] opacity-50">{m.toString(2).padStart(4, '0')}</span>
                    </button>
                  );
                })}
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between mt-5">
            <span className={`text-[12px] font-mono ${subText}`}>
              Picked {picked.size} / {PREMIUM.size}
            </span>
            {allCorrect && (
              <motion.span
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                className="px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold"
              >
                ✓ Manifest plotted correctly
              </motion.span>
            )}
          </div>
        </motion.div>

        {/* Manifest list */}
        <motion.div
          initial={{ opacity: 0, x: 12 }} animate={isActive ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: 0.1 }}
          className={`p-6 rounded-3xl border ${cardBg}`}
        >
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb size={14} className="text-cyan-400" />
            <span className="font-mono text-[10px] uppercase tracking-widest text-cyan-400">Premium Guest List</span>
          </div>
          <div className="space-y-2">
            {[...PREMIUM].sort((a, b) => a - b).map((m) => {
              const isPicked = picked.has(m);
              return (
                <div
                  key={m}
                  className={`flex items-center gap-3 p-2.5 rounded-lg border ${
                    isPicked
                      ? 'border-amber-400/40 bg-amber-500/10'
                      : isDarkMode ? 'border-white/10 bg-black/20' : 'border-slate-200 bg-slate-50'
                  }`}
                >
                  <span className="w-6 h-6 rounded-full bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-[11px] font-mono font-black text-amber-300">
                    {m}
                  </span>
                  <span className="font-mono text-[11px] opacity-60">{m.toString(2).padStart(4, '0')}</span>
                  <span className="font-mono text-amber-300 text-sm ml-auto">{minTermLabel(m)}</span>
                </div>
              );
            })}
          </div>
          <p className={`text-[11px] mt-5 ${subText}`}>
            <strong>Step 1 complete.</strong> Each premium room is lit on the blueprint. The next chapter walks
            through the four wings Madhur uses to cover them - including a torus trick.
          </p>
        </motion.div>
      </div>
    </div>
  );
};
