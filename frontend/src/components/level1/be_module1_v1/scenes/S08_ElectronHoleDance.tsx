import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, ArrowLeft, ArrowRight } from 'lucide-react';

interface Props { isActive: boolean; isDarkMode: boolean; }

// Visualize a row of bonded sites; one site has a hole; an adjacent electron hops in to fill it,
// leaving a new hole behind.

export const S08_ElectronHoleDance: React.FC<Props> = ({ isActive, isDarkMode }) => {
  const [holeIdx, setHoleIdx] = useState(2);

  useEffect(() => {
    const id = setInterval(() => {
      setHoleIdx((i) => (i + 1) % 6);
    }, 1300);
    return () => clearInterval(id);
  }, []);

  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';

  const cellW = 80;
  const N = 6;

  return (
    <div className="max-w-6xl mx-auto space-y-12 py-4">
      <section className="space-y-3">
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.4em] uppercase text-pink-400">
          <Activity size={14} /> Chapter 08 · Two Flows
        </div>
        <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>The Dance of Electrons and Holes</h2>
        <p className={`text-base max-w-3xl ${subText}`}>
          When a free electron drops into a hole to fill the void, it leaves a <strong>new void</strong>{' '}
          behind. From a distance the void looks as if it has hopped sideways. Two flows emerge - and
          they go in <strong>opposite directions</strong>.
        </p>
      </section>

      {/* Animation strip */}
      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        className={`p-8 rounded-3xl border ${cardBg} relative overflow-hidden`}
      >
        <div className="absolute -top-20 -left-10 w-72 h-72 bg-pink-400/10 rounded-full blur-3xl" />

        {/* Direction labels */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/15 border border-cyan-400/40">
            <ArrowLeft size={14} className="text-cyan-300" />
            <span className="font-mono text-[10px] uppercase tracking-widest text-cyan-300">Electron Flow ←</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-pink-500/15 border border-pink-400/40">
            <span className="font-mono text-[10px] uppercase tracking-widest text-pink-300">→ Hole Flow (Conventional Current)</span>
            <ArrowRight size={14} className="text-pink-300" />
          </div>
        </div>

        <svg viewBox={`0 0 ${cellW * N + 40} 220`} className="w-full">
          {/* Sites */}
          {Array.from({ length: N }).map((_, i) => {
            const x = 20 + i * cellW + cellW / 2;
            const isHole = i === holeIdx;
            return (
              <g key={i}>
                {/* Si atom */}
                <circle cx={x} cy={120} r="28" fill="#0f172a" stroke="#ec4899" strokeWidth="2.5" />
                <text x={x} y={126} textAnchor="middle" fontFamily="monospace" fontWeight="900" fontSize="14" fill="#ec4899">Si</text>
                {/* Electron at this site */}
                {!isHole ? (
                  <motion.circle
                    cx={x + 22} cy={120} r="8"
                    fill="#22d3ee"
                    initial={false}
                    animate={{ x: 0 }}
                    style={{ filter: 'drop-shadow(0 0 8px #22d3ee)' }}
                  />
                ) : (
                  <motion.circle
                    cx={x + 22} cy={120} r="11"
                    fill="none" stroke="#f472b6" strokeWidth="2.5" strokeDasharray="3 3"
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
                  />
                )}
                {/* Bond line between consecutive atoms */}
                {i < N - 1 && (
                  <line
                    x1={x + 28} y1={120}
                    x2={x + cellW - 28} y2={120}
                    stroke="#ec4899" strokeWidth="2" opacity="0.5"
                  />
                )}
                {/* Site labels */}
                <text x={x} y={170} textAnchor="middle" fontFamily="monospace" fontSize="9" fill="#94a3b8">site {i}</text>
              </g>
            );
          })}

          {/* Hop indicator: electron moves from site (holeIdx-1) to site (holeIdx) */}
          {holeIdx > 0 && (
            <motion.g>
              <motion.circle
                cx={20 + (holeIdx - 1) * cellW + cellW / 2 + 22} cy={120}
                r="8" fill="#fde68a"
                animate={{
                  cx: [
                    20 + (holeIdx - 1) * cellW + cellW / 2 + 22,
                    20 + holeIdx * cellW + cellW / 2 + 22,
                  ],
                  opacity: [1, 1, 0],
                }}
                transition={{ duration: 1.2, repeat: Infinity }}
                style={{ filter: 'drop-shadow(0 0 10px #fde68a)' }}
              />
            </motion.g>
          )}

          {/* Direction arrows */}
          <g>
            <line x1="30" y1="40" x2={cellW * N} y2="40" stroke="#22d3ee" strokeWidth="2" markerEnd="url(#arrow-cyan)" />
            <text x="50" y="32" fontFamily="monospace" fontSize="10" fontWeight="900" fill="#22d3ee">e⁻ flow direction</text>
            <line x1={cellW * N} y1="200" x2="30" y2="200" stroke="#ec4899" strokeWidth="2" markerEnd="url(#arrow-pink)" />
            <text x={cellW * N - 130} y="216" fontFamily="monospace" fontSize="10" fontWeight="900" fill="#ec4899">hole flow direction</text>
          </g>

          <defs>
            <marker id="arrow-cyan" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M0 0 L10 5 L0 10 z" fill="#22d3ee" />
            </marker>
            <marker id="arrow-pink" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M0 0 L10 5 L0 10 z" fill="#ec4899" />
            </marker>
          </defs>
        </svg>

        <div className="flex items-center justify-center mt-4 gap-2">
          <span className={`font-mono text-[10px] uppercase tracking-widest ${subText}`}>Hole position</span>
          <span className="font-mono text-pink-300 font-black">site {holeIdx}</span>
        </div>
      </motion.div>

      {/* Two flows / one current */}
      <div className="grid md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -12 }} animate={isActive ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: 0.2 }}
          className={`p-6 rounded-3xl border ${cardBg}`}
        >
          <div className="flex items-center gap-2 mb-3">
            <ArrowLeft size={14} className="text-cyan-400" />
            <div className="font-mono text-[10px] uppercase tracking-widest text-cyan-400">Electron Flow</div>
          </div>
          <p className={`text-sm leading-relaxed ${textColor}`}>
            The <strong>physical</strong> movement of negatively charged electrons. They are drawn{' '}
            <em>toward the positive terminal</em> of the battery. This is the real movement of mass and
            charge.
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 12 }} animate={isActive ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: 0.3 }}
          className={`p-6 rounded-3xl border ${cardBg}`}
        >
          <div className="flex items-center gap-2 mb-3">
            <ArrowRight size={14} className="text-pink-400" />
            <div className="font-mono text-[10px] uppercase tracking-widest text-pink-400">Hole Flow · Conventional Current</div>
          </div>
          <p className={`text-sm leading-relaxed ${textColor}`}>
            The <strong>apparent</strong> movement of a positively charged void. As each electron jumps
            into a hole, the hole appears to move the other way. <strong className="text-pink-300">Conventional
            current</strong> - the arrow on every schematic - follows hole flow.
          </p>
        </motion.div>
      </div>

      {/* Memory rule */}
      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.4 }}
        className={`p-6 rounded-3xl border ${cardBg} text-center`}
      >
        <div className="font-mono text-[10px] uppercase tracking-widest text-orange-400 mb-2">Madhur&apos;s memory rule</div>
        <p className={`text-base leading-relaxed ${textColor}`}>
          Electrons go <strong className="text-cyan-300">toward +</strong>. Holes (and conventional current) go{' '}
          <strong className="text-pink-300">toward −</strong>. Two flows, one current - but always in opposite
          directions.
        </p>
      </motion.div>
    </div>
  );
};
