import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Grid3x3, Lightbulb, ArrowDown, Play, Pause, RotateCcw } from 'lucide-react';

interface Props { isActive: boolean; isDarkMode: boolean; }

// 3-var K-map: rows = A (0,1) · cols = BC in Gray code (00, 01, 11, 10)
const COL_TO_BIN = [0, 1, 3, 2];
const ACTIVE = new Set([3, 4, 5, 6, 7]);

// Loop "A": entire bottom row covers m4, m5, m6, m7  →  A
// Loop "BC": column BC=11 (col index 2) covers m3 and m7  →  BC
// (Group outlines drawn via SVG overlay below — no per-cell highlight here.)

type Phase = 'empty' | 'plot' | 'group' | 'minimised';
const PHASES: { id: Phase; label: string }[] = [
  { id: 'empty',     label: 'Empty grid' },
  { id: 'plot',      label: 'Plot the 1s' },
  { id: 'group',     label: 'Group adjacent' },
  { id: 'minimised', label: 'Distil F = A + BC' },
];

export const S05_KMap: React.FC<Props> = ({ isActive, isDarkMode }) => {
  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText   = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg    = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';

  const [phase, setPhase] = useState<Phase>('empty');
  const [autoplay, setAutoplay] = useState(true);
  const phaseIdx = PHASES.findIndex((p) => p.id === phase);

  // Autoplay through phases
  useEffect(() => {
    if (!isActive || !autoplay) return;
    const t = setTimeout(() => {
      const next = (phaseIdx + 1) % PHASES.length;
      setPhase(PHASES[next].id);
    }, phase === 'empty' ? 1500 : phase === 'plot' ? 2800 : phase === 'group' ? 3000 : 3500);
    return () => clearTimeout(t);
  }, [phase, phaseIdx, isActive, autoplay]);

  return (
    <div className="max-w-6xl mx-auto space-y-12 py-4">
      <section className="space-y-3">
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.4em] uppercase text-violet-400">
          <Grid3x3 size={14} /> Step 4 · Optimise on the K-Map
        </div>
        <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>The truth table, folded.</h2>
        <p className={`text-base max-w-3xl ${subText}`}>
          A Karnaugh Map rearranges the 8 truth-table rows into a 2×4 grid where columns are{' '}
          <strong className="text-violet-300">Gray-coded</strong> (00, 01, 11, 10). Adjacency on
          the grid <em>is</em> mathematical adjacency — and adjacent 1s collapse into shorter
          product terms.
        </p>
      </section>

      {/* Phase controls */}
      <div className="flex items-center gap-2 flex-wrap">
        {PHASES.map((p, i) => (
          <button
            key={p.id}
            onClick={() => { setAutoplay(false); setPhase(p.id); }}
            className={`px-4 py-2 rounded-xl font-mono text-xs uppercase tracking-widest font-black transition-all flex items-center gap-2 ${
              phase === p.id
                ? 'bg-violet-400 text-black'
                : isDarkMode
                  ? 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10'
                  : 'bg-slate-100 border border-slate-200 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <span className="opacity-50">{i + 1}.</span>
            {p.label}
          </button>
        ))}
        <div className="flex-1" />
        <button
          onClick={() => setAutoplay(!autoplay)}
          className={`px-3 py-2 rounded-xl font-mono text-[10px] uppercase tracking-widest font-black transition-all flex items-center gap-2 ${
            autoplay
              ? 'bg-emerald-500/20 border border-emerald-400/50 text-emerald-300'
              : isDarkMode ? 'bg-white/5 border border-white/10 text-slate-300' : 'bg-slate-100 border border-slate-200 text-slate-600'
          }`}
        >
          {autoplay ? <><Pause size={12} /> Auto</> : <><Play size={12} /> Auto</>}
        </button>
        <button
          onClick={() => { setAutoplay(false); setPhase('empty'); }}
          className={`px-3 py-2 rounded-xl font-mono text-[10px] uppercase tracking-widest font-black transition-all flex items-center gap-2 ${
            isDarkMode ? 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10' : 'bg-slate-100 border border-slate-200 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <RotateCcw size={12} /> Reset
        </button>
      </div>

      {/* MAIN PANEL · two columns: animated truth-table fold + K-Map */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        className={`p-8 rounded-3xl border ${cardBg}`}
      >
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-violet-400 mb-5">
          F = Σm(3, 4, 5, 6, 7) · A on rows · BC on cols
        </div>

        <div className="grid lg:grid-cols-[auto_1fr] gap-8 items-start">
          {/* Truth table mini view (slides into the K-Map during 'plot' phase) */}
          <motion.div
            initial={false}
            animate={{
              opacity: phase === 'empty' ? 1 : phase === 'plot' ? 0.7 : 0.35,
              x: phase === 'empty' ? 0 : -10,
            }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-[44px_repeat(4,32px)] gap-x-1 gap-y-1 font-mono text-xs"
          >
            <div className="opacity-40 px-1 py-1.5">#</div>
            <div className="px-1 py-1.5 text-center text-orange-300 font-black">A</div>
            <div className="px-1 py-1.5 text-center text-cyan-300 font-black">B</div>
            <div className="px-1 py-1.5 text-center text-amber-300 font-black">C</div>
            <div className="px-1 py-1.5 text-center text-emerald-300 font-black">F</div>
            {Array.from({ length: 8 }, (_, i) => {
              const a = (i >> 2) & 1;
              const b = (i >> 1) & 1;
              const c = i & 1;
              const f = ACTIVE.has(i) ? 1 : 0;
              return (
                <React.Fragment key={i}>
                  <div className={`px-1 py-1.5 ${f ? 'text-emerald-300 font-black' : subText}`}>m{i}</div>
                  <div className={`px-1 py-1.5 text-center ${a ? textColor : 'opacity-40'}`}>{a}</div>
                  <div className={`px-1 py-1.5 text-center ${b ? textColor : 'opacity-40'}`}>{b}</div>
                  <div className={`px-1 py-1.5 text-center ${c ? textColor : 'opacity-40'}`}>{c}</div>
                  <div className={`px-1 py-1.5 text-center font-black ${f ? 'text-emerald-300' : 'opacity-30'}`}>{f}</div>
                </React.Fragment>
              );
            })}
          </motion.div>

          {/* K-Map */}
          <div className="relative">
            <div className="inline-block">
              <div className="grid grid-cols-[60px_repeat(4,80px)] gap-1 mb-1">
                <div></div>
                {['00', '01', '11', '10'].map((g) => (
                  <div key={g} className="text-center font-mono text-[11px] text-violet-300 pb-1">
                    BC = {g}
                  </div>
                ))}
              </div>

              {[0, 1].map((a) => (
                <div key={a} className="grid grid-cols-[60px_repeat(4,80px)] gap-1 mb-1">
                  <div className="text-right pr-3 font-mono text-[11px] text-violet-300 self-center">
                    A = {a}
                  </div>
                  {COL_TO_BIN.map((bcBin, col) => {
                    const m = a * 4 + bcBin;
                    const isOne = ACTIVE.has(m);
                    const cellIdx = a * 4 + col;
                    const showVal = phase !== 'empty';
                    return (
                      <motion.div
                        key={col}
                        className={`relative h-20 rounded-xl border-2 grid place-items-center font-mono font-black overflow-hidden`}
                        animate={{
                          backgroundColor: showVal && isOne ? 'rgba(52,211,153,0.20)' : 'rgba(0,0,0,0.20)',
                          borderColor: showVal && isOne ? '#34d399' : 'rgba(255,255,255,0.10)',
                          boxShadow: showVal && isOne ? '0 0 25px rgba(52,211,153,0.35)' : 'none',
                          scale: showVal && isOne ? [1, 1.08, 1] : 1,
                        }}
                        transition={{
                          delay: phase === 'plot' ? cellIdx * 0.18 : 0,
                          duration: phase === 'plot' ? 0.4 : 0.3,
                        }}
                      >
                        <AnimatePresence mode="wait">
                          {showVal && (
                            <motion.span
                              key={`${m}-${isOne}`}
                              initial={{ opacity: 0, scale: 0.4 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0 }}
                              transition={{ delay: phase === 'plot' ? cellIdx * 0.18 + 0.15 : 0 }}
                              className={`text-2xl ${isOne ? 'text-emerald-200' : textColor}`}
                            >
                              {isOne ? 1 : 0}
                            </motion.span>
                          )}
                        </AnimatePresence>
                        <span className="absolute top-1 left-2 text-[9px] opacity-50">m{m}</span>
                      </motion.div>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* SVG overlay for animated group outlines */}
            <AnimatePresence>
              {(phase === 'group' || phase === 'minimised') && (
                <motion.svg
                  className="absolute pointer-events-none"
                  style={{ left: 60, top: 22, width: 332, height: 178 }}
                  viewBox="0 0 332 178"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {/* Loop A — entire bottom row · 4 cells · cyan */}
                  <motion.rect
                    x="2" y="92" width="328" height="80" rx="14"
                    fill="none" stroke="#22d3ee" strokeWidth="3"
                    strokeDasharray="900"
                    initial={{ strokeDashoffset: 900 }}
                    animate={{ strokeDashoffset: 0 }}
                    transition={{ duration: 1.2, ease: 'easeInOut' }}
                    style={{ filter: 'drop-shadow(0 0 8px rgba(34,211,238,0.7))' }}
                  />
                  <motion.text
                    x="166" y="178" textAnchor="middle"
                    fontSize="13" fontWeight="bold" fontFamily="monospace" fill="#22d3ee"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2 }}
                  >
                    Group → A
                  </motion.text>

                  {/* Loop BC — column BC=11 · 2 cells · orange */}
                  <motion.rect
                    x="170" y="2" width="80" height="170" rx="14"
                    fill="none" stroke="#fb923c" strokeWidth="3"
                    strokeDasharray="600"
                    initial={{ strokeDashoffset: 600 }}
                    animate={{ strokeDashoffset: 0 }}
                    transition={{ duration: 1.2, ease: 'easeInOut', delay: 0.4 }}
                    style={{ filter: 'drop-shadow(0 0 8px rgba(251,146,60,0.7))' }}
                  />
                  <motion.text
                    x="210" y="-6" textAnchor="middle"
                    fontSize="13" fontWeight="bold" fontFamily="monospace" fill="#fb923c"
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.6 }}
                  >
                    Group → BC
                  </motion.text>
                </motion.svg>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Phase narration */}
        <div className={`mt-6 p-4 rounded-xl border ${isDarkMode ? 'bg-black/30 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
          <AnimatePresence mode="wait">
            <motion.div
              key={phase}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className={`text-sm font-mono ${subText}`}
            >
              {phase === 'empty' && (
                <>A blank 2×4 K-Map. Note the Gray-code header on columns — only one bit changes between any two adjacent cells.</>
              )}
              {phase === 'plot' && (
                <>Drop a 1 in every cell whose minterm is active — m3, m4, m5, m6, m7. Watch them light up in sequence.</>
              )}
              {phase === 'group' && (
                <>Two adjacent groups appear. Inside each loop, the variables that <em>change</em> get cancelled out.</>
              )}
              {phase === 'minimised' && (
                <>Cell <strong className="text-emerald-300">m7</strong> is shared by both groups — overlap is mathematically free. Read the surviving variables.</>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Group analysis · only show in group/minimised */}
      <AnimatePresence>
        {(phase === 'group' || phase === 'minimised') && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="grid md:grid-cols-2 gap-4"
          >
            {/* Loop A */}
            <div className="rounded-2xl p-5 border-2 border-cyan-400 bg-cyan-500/10 space-y-3">
              <div className="font-mono text-[10px] uppercase tracking-widest text-cyan-300">
                Blue group · entire bottom row · {`{m4, m5, m6, m7}`}
              </div>
              <table className="font-mono text-sm w-full">
                <tbody>
                  <tr><td className={`py-1 ${subText}`}>A</td><td className="py-1 text-center">stays 1</td><td className="py-1 text-emerald-300 font-black">→ KEEP A</td></tr>
                  <tr><td className={`py-1 ${subText}`}>B</td><td className="py-1 text-center">changes</td><td className="py-1 text-rose-300 font-black">→ DROP</td></tr>
                  <tr><td className={`py-1 ${subText}`}>C</td><td className="py-1 text-center">changes</td><td className="py-1 text-rose-300 font-black">→ DROP</td></tr>
                </tbody>
              </table>
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3, type: 'spring' }}
                className="rounded-xl p-3 bg-black/30 text-center"
              >
                <span className={`font-mono text-3xl font-black ${textColor}`}>A</span>
              </motion.div>
            </div>

            {/* Loop BC */}
            <div className="rounded-2xl p-5 border-2 border-orange-400 bg-orange-500/10 space-y-3">
              <div className="font-mono text-[10px] uppercase tracking-widest text-orange-300">
                Orange group · column BC=11 · {`{m3, m7}`}
              </div>
              <table className="font-mono text-sm w-full">
                <tbody>
                  <tr><td className={`py-1 ${subText}`}>A</td><td className="py-1 text-center">changes</td><td className="py-1 text-rose-300 font-black">→ DROP</td></tr>
                  <tr><td className={`py-1 ${subText}`}>B</td><td className="py-1 text-center">stays 1</td><td className="py-1 text-emerald-300 font-black">→ KEEP B</td></tr>
                  <tr><td className={`py-1 ${subText}`}>C</td><td className="py-1 text-center">stays 1</td><td className="py-1 text-emerald-300 font-black">→ KEEP C</td></tr>
                </tbody>
              </table>
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.6, type: 'spring' }}
                className="rounded-xl p-3 bg-black/30 text-center"
              >
                <span className={`font-mono text-3xl font-black ${textColor}`}>BC</span>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Final SOP reveal */}
      <AnimatePresence>
        {phase === 'minimised' && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`p-8 rounded-3xl border ${cardBg} space-y-5 text-center`}
          >
            <motion.div
              initial={{ opacity: 1 }}
              animate={{ opacity: 0.4 }}
              transition={{ delay: 0.6 }}
              className={`font-mono text-base ${subText} line-through`}
            >
              F = A′BC + AB′C′ + AB′C + ABC′ + ABC
            </motion.div>
            <motion.div
              initial={{ y: -6 }}
              animate={{ y: [0, 6, 0] }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              <ArrowDown className="mx-auto text-violet-400" size={24} />
            </motion.div>
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 1.0, type: 'spring' }}
              className="rounded-2xl p-6 border-2 border-emerald-400 bg-emerald-500/10 inline-block shadow-[0_0_60px_rgba(34,197,94,0.35)]"
            >
              <div className="font-mono text-[10px] uppercase tracking-widest text-emerald-300 mb-2">Optimised SOP</div>
              <div className={`font-mono text-3xl md:text-5xl font-black ${textColor}`}>
                F = A <span className="text-emerald-400">+</span> BC
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              className="grid grid-cols-3 gap-3 max-w-xl mx-auto"
            >
              {[
                { v: '15 → 3', l: 'Literals' },
                { v: '6 → 2',  l: 'Gates' },
                { v: '−80%',   l: 'Footprint' },
              ].map((m) => (
                <motion.div
                  key={m.l}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1.6 + 0.1 * (m.l.length % 3), type: 'spring' }}
                  className="rounded-xl p-3 border border-emerald-400/40 bg-emerald-500/10"
                >
                  <div className="text-emerald-300 font-black text-lg">{m.v}</div>
                  <div className={`uppercase tracking-widest text-[9px] mt-1 ${subText}`}>{m.l}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tip */}
      <motion.div
        initial={{ opacity: 0 }} animate={isActive ? { opacity: 1 } : {}}
        transition={{ delay: 0.4 }}
        className={`p-5 rounded-2xl border ${cardBg} flex items-start gap-3`}
      >
        <Lightbulb className="text-amber-300 mt-0.5 shrink-0" size={18} />
        <div className={`text-sm ${subText}`}>
          <strong className="text-amber-300">Rule of thumb:</strong> always look for the LARGEST
          legal power-of-two rectangle first. A 4-cell loop drops 2 variables. A 2-cell loop drops
          1. Overlapping is free. Never split a loop just to avoid overlap.
        </div>
      </motion.div>
    </div>
  );
};
