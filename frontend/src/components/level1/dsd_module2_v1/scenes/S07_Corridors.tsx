import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Compass, RotateCcw, Sparkles } from 'lucide-react';

interface Props { isActive: boolean; isDarkMode: boolean; }

const STAGES = [
  {
    key: 'flat',
    title: '2D Blueprint',
    sub: 'The flat map · edges look unrelated.',
  },
  {
    key: 'cylinder',
    title: 'Rolled into a Cylinder',
    sub: 'Far-left col 00 wraps onto far-right col 10.',
  },
  {
    key: 'torus',
    title: 'Folded into a Torus',
    sub: 'Top row 00 wraps onto bottom row 10.',
  },
] as const;

const grid = [
  [0, 1, 3, 2],
  [4, 5, 7, 6],
  [12, 13, 15, 14],
  [8, 9, 11, 10],
];

export const S07_Corridors: React.FC<Props> = ({ isActive, isDarkMode }) => {
  const [stage, setStage] = useState<typeof STAGES[number]['key']>('flat');

  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';

  const cornerCluster = [0, 2, 8, 10];
  const isCorner = (m: number) => stage === 'torus' && cornerCluster.includes(m);
  const isLeftRightWrap = (_r: number, c: number) => stage !== 'flat' && (c === 0 || c === 3);
  const isTopBottomWrap = (r: number, _c: number) => stage === 'torus' && (r === 0 || r === 3);

  return (
    <div className="max-w-6xl mx-auto space-y-12 py-4">
      <section className="space-y-3">
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.4em] uppercase text-emerald-400">
          <Compass size={14} /> Chapter 07 · Rule 3
        </div>
        <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>The Secret Corridors</h2>
        <p className={`text-base max-w-3xl ${subText}`}>
          Look at the columns: 00 and 10 differ by exactly one bit. So the far-left and far-right corridors are
          actually <strong>adjacent</strong>. The flat blueprint is a lie - it&apos;s a <em>cylinder</em>. And once
          you do the same trick vertically, the building becomes a <em>torus</em>.
        </p>
      </section>

      {/* Stage controller */}
      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        className={`p-6 rounded-3xl border ${cardBg} flex items-center justify-between flex-wrap gap-4`}
      >
        <div className="flex items-center gap-3">
          <RotateCcw size={16} className="text-emerald-400" />
          <div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-emerald-400">Topology Stage</div>
            <div className={`text-sm font-bold ${textColor}`}>Roll the blueprint</div>
          </div>
        </div>
        <div className={`relative inline-flex p-1 rounded-2xl border ${isDarkMode ? 'bg-black/40 border-white/10' : 'bg-slate-100 border-slate-200'}`}>
          {STAGES.map((s) => (
            <button
              key={s.key}
              onClick={() => setStage(s.key)}
              className={`relative z-10 px-4 py-2 rounded-xl font-bold text-xs md:text-sm transition-colors ${
                stage === s.key ? 'text-black' : isDarkMode ? 'text-slate-300' : 'text-slate-600'
              }`}
            >
              {stage === s.key && (
                <motion.div layoutId="topo-pill" className="absolute inset-0 rounded-xl bg-emerald-400" />
              )}
              <span className="relative">{s.title}</span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* The diagram */}
      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.1 }}
        className={`p-8 rounded-3xl border ${cardBg}`}
      >
        <div className="text-center mb-6">
          <div className="font-mono text-[10px] uppercase tracking-widest text-emerald-400">{STAGES.find(s => s.key === stage)?.title}</div>
          <div className={`text-sm mt-1 ${subText}`}>{STAGES.find(s => s.key === stage)?.sub}</div>
        </div>

        {/* The visual transformation */}
        <div className="flex items-center justify-center" style={{ minHeight: 320 }}>
          <motion.div
            animate={{
              rotateY: stage === 'flat' ? 0 : stage === 'cylinder' ? 18 : 24,
              rotateX: stage === 'torus' ? -22 : 0,
              scale: stage === 'flat' ? 1 : 0.92,
            }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
            style={{ perspective: 1200, transformStyle: 'preserve-3d' }}
          >
            <div className="relative">
              {/* Edge wrap glows */}
              {stage !== 'flat' && (
                <>
                  <motion.div
                    className="absolute -left-12 top-0 bottom-0 w-10 rounded-full blur-md"
                    style={{ background: 'rgba(16,185,129,0.25)' }}
                    animate={{ opacity: [0.3, 0.7, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <motion.div
                    className="absolute -right-12 top-0 bottom-0 w-10 rounded-full blur-md"
                    style={{ background: 'rgba(16,185,129,0.25)' }}
                    animate={{ opacity: [0.3, 0.7, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.7 }}
                  />
                </>
              )}
              {stage === 'torus' && (
                <>
                  <motion.div
                    className="absolute left-0 right-0 -top-10 h-8 rounded-full blur-md"
                    style={{ background: 'rgba(167,139,250,0.30)' }}
                    animate={{ opacity: [0.3, 0.7, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
                  />
                  <motion.div
                    className="absolute left-0 right-0 -bottom-10 h-8 rounded-full blur-md"
                    style={{ background: 'rgba(167,139,250,0.30)' }}
                    animate={{ opacity: [0.3, 0.7, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                  />
                </>
              )}

              <div
                className="grid gap-1.5 p-4 rounded-2xl"
                style={{
                  gridTemplateColumns: 'repeat(4, 70px)',
                  gridTemplateRows: 'repeat(4, 70px)',
                  background: 'linear-gradient(135deg, #0c1a2e 0%, #102a4c 60%, #0a1628 100%)',
                  borderRadius: stage === 'cylinder' ? '36px 12px 12px 36px' : stage === 'torus' ? '40px' : 16,
                  boxShadow: '0 30px 60px rgba(0,0,0,0.45)',
                  border: '1px solid rgba(125,170,230,0.3)',
                }}
              >
                {grid.flatMap((row, r) =>
                  row.map((m, c) => {
                    const corner = isCorner(m);
                    const lr = isLeftRightWrap(r, c);
                    const tb = isTopBottomWrap(r, c);
                    const highlighted = corner || lr || tb;
                    return (
                      <div
                        key={`${r}-${c}`}
                        className="rounded-lg flex items-center justify-center font-mono font-black text-base transition-all"
                        style={{
                          background: corner
                            ? 'rgba(167,139,250,0.30)'
                            : highlighted
                            ? 'rgba(16,185,129,0.20)'
                            : 'rgba(252,211,77,0.10)',
                          color: corner ? '#c4b5fd' : highlighted ? '#6ee7b7' : '#fde68a',
                          border: highlighted
                            ? `1px solid ${corner ? 'rgba(167,139,250,0.7)' : 'rgba(16,185,129,0.7)'}`
                            : '1px solid rgba(252,211,77,0.4)',
                          boxShadow: highlighted ? '0 0 18px rgba(16,185,129,0.4)' : undefined,
                        }}
                      >
                        {m}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Stage commentary */}
        <div className="grid md:grid-cols-3 gap-4 mt-8">
          {[
            {
              key: 'flat', label: '01 · Flat Blueprint',
              text: '0 and 2 sit at opposite ends of the top row. 8 and 10 sit at opposite ends of the bottom row. They look unrelated.',
            },
            {
              key: 'cylinder', label: '02 · Cylinder',
              text: 'Roll the page left-to-right. Column 00 meets column 10. Now {0,2} share a wall and {8,10} share a wall via the secret corridor.',
            },
            {
              key: 'torus', label: '03 · Torus',
              text: 'Curl top-to-bottom too. Row 00 meets row 10. The four extreme corners {0, 2, 8, 10} cluster together as one tight 2×2 wing.',
            },
          ].map((c) => (
            <div
              key={c.key}
              className={`p-4 rounded-2xl border transition-all ${
                stage === c.key
                  ? 'border-emerald-400/50 bg-emerald-500/10'
                  : isDarkMode ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-slate-50'
              }`}
            >
              <div className="font-mono text-[10px] uppercase tracking-widest text-emerald-400 mb-1.5">{c.label}</div>
              <p className={`text-[12px] leading-relaxed ${subText}`}>{c.text}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Take-away */}
      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.2 }}
        className={`p-6 rounded-3xl border ${cardBg}`}
      >
        <div className="flex items-center gap-2 mb-2">
          <Sparkles size={14} className="text-violet-400" />
          <div className="font-mono text-[10px] uppercase tracking-widest text-violet-400">Why this matters</div>
        </div>
        <p className={`text-base leading-relaxed ${textColor}`}>
          Whenever you see a K-Map, mentally curl it into a torus. Always inspect the four corners and the two
          edge-pairs. Many simplifications hide on the wrap-arounds - and they&apos;re usually the biggest wings
          available.
        </p>
      </motion.div>
    </div>
  );
};
