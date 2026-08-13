import React from 'react';
import { motion } from 'framer-motion';
import { Hash, Zap, HeartHandshake } from 'lucide-react';

interface Props { isActive: boolean; isDarkMode: boolean; }

// Bar chart of ionization energies (eV) for K, L, M shells of Silicon
const IONIZATION_BARS = [
  { shell: 'K shell', e: 1839, color: '#22d3ee', note: 'inner-most' },
  { shell: 'L shell', e: 154, color: '#0ea5e9', note: 'middle' },
  { shell: 'M shell', e: 8.15, color: '#f97316', note: 'valence - easiest!' },
];

export const S05_Tetravalent: React.FC<Props> = ({ isActive, isDarkMode }) => {
  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';

  const maxBar = Math.max(...IONIZATION_BARS.map((b) => b.e));

  return (
    <div className="max-w-6xl mx-auto space-y-12 py-4">
      <section className="space-y-3">
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.4em] uppercase text-teal-400">
          <Hash size={14} /> Chapter 05 · The Magic Number
        </div>
        <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>Tetravalent · The Magic 4</h2>
        <p className={`text-base max-w-3xl ${subText}`}>
          Silicon and Germanium each carry exactly four valence electrons. That number is not arbitrary -
          it sits at the perfect cross-roads of stability and reactivity, and it is why semiconductors
          even exist as a category.
        </p>
      </section>

      {/* Hero · big "4" + valence diagram */}
      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        className={`p-5 md:p-10 rounded-3xl border ${cardBg} relative overflow-hidden`}
      >
        <div className="absolute -top-20 -left-10 w-72 h-72 bg-orange-400/10 rounded-full blur-3xl" />
        <div className="grid md:grid-cols-[auto_1fr] gap-10 items-center">
          <motion.div
            initial={{ scale: 0.7, rotate: -8 }}
            animate={isActive ? { scale: 1, rotate: 0 } : {}}
            transition={{ type: 'spring', stiffness: 200, damping: 14, delay: 0.15 }}
            className="relative"
          >
            <div
              className="font-black leading-none select-none"
              style={{
                fontSize: 'clamp(140px, 18vw, 240px)',
                background: 'linear-gradient(135deg, #f97316, #fcd34d)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter: 'drop-shadow(0 12px 30px rgba(249,115,22,0.35))',
              }}
            >
              4
            </div>
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-orange-500/20 border border-orange-400/40 text-orange-300 font-mono text-[10px] uppercase tracking-widest">
              valence electrons
            </div>
          </motion.div>

          {/* Mini atom showing 4 outer electrons highlighted */}
          <div>
            <svg viewBox="0 0 280 220" className="w-full max-w-md">
              <circle cx="140" cy="110" r="105" fill="rgba(249,115,22,0.06)" />
              <circle cx="140" cy="110" r="90" fill="none" stroke="#f97316" strokeWidth="2" />
              {/* 4 valence electrons */}
              {[0, 90, 180, 270].map((deg, i) => {
                const a = (deg * Math.PI) / 180;
                const x = 140 + Math.cos(a) * 90;
                const y = 110 + Math.sin(a) * 90;
                return (
                  <g key={i}>
                    <motion.circle
                      cx={x} cy={y} r="11" fill="#f97316"
                      animate={{ scale: [1, 1.15, 1] }}
                      transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.2 }}
                      style={{ filter: 'drop-shadow(0 0 8px #f97316)' }}
                    />
                    <text x={x} y={y + 4} textAnchor="middle" fontFamily="monospace" fontWeight="900" fontSize="12" fill="#0f172a">e⁻</text>
                  </g>
                );
              })}
              {/* nucleus */}
              <circle cx="140" cy="110" r="28" fill="#0f172a" stroke="#fcd34d" strokeWidth="2.5" />
              <text x="140" y="116" textAnchor="middle" fontFamily="monospace" fontWeight="900" fontSize="16" fill="#fcd34d">Si</text>
              {/* connecting lines from nucleus to electrons */}
              {[0, 90, 180, 270].map((deg, i) => {
                const a = (deg * Math.PI) / 180;
                const x = 140 + Math.cos(a) * 90;
                const y = 110 + Math.sin(a) * 90;
                return <line key={i} x1="140" y1="110" x2={x} y2={y} stroke="#fcd34d" strokeWidth="1.2" opacity="0.4" />;
              })}
            </svg>
          </div>
        </div>
      </motion.div>

      {/* Ionization energy chart */}
      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.2 }}
        className={`p-5 md:p-8 rounded-3xl border ${cardBg}`}
      >
        <div className="flex items-center gap-2 mb-6">
          <Zap size={14} className="text-orange-400" />
          <span className="font-mono text-[10px] uppercase tracking-widest text-orange-400">
            Ionization potential of Silicon shells (eV - log scale)
          </span>
        </div>
        <div className="space-y-4">
          {IONIZATION_BARS.map((b, i) => {
            // log scale for visualization since values span ~3 orders
            const w = (Math.log10(b.e + 1) / Math.log10(maxBar + 1)) * 100;
            return (
              <div key={b.shell} className="space-y-1.5">
                <div className="flex items-baseline justify-between">
                  <span className={`text-sm font-bold ${textColor}`}>{b.shell}</span>
                  <span className="font-mono text-sm font-black" style={{ color: b.color }}>
                    {b.e} eV <span className={`opacity-60 ml-2 text-[11px] font-normal ${subText}`}>· {b.note}</span>
                  </span>
                </div>
                <div className={`h-6 rounded-lg overflow-hidden ${isDarkMode ? 'bg-black/30' : 'bg-slate-100'}`}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={isActive ? { width: `${w}%` } : { width: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 + i * 0.15, ease: [0.16, 1, 0.3, 1] }}
                    className="h-full rounded-lg"
                    style={{ background: b.color, boxShadow: `0 0 14px ${b.color}66` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
        <p className={`text-[12px] mt-5 ${subText}`}>
          The valence electron sits on the boundary at just <strong className="text-orange-300">8.15 eV</strong> -
          hundreds of times lower than inner-shell electrons. That tiny barrier is what makes Silicon
          willing to play.
        </p>
      </motion.div>

      {/* Conclusion · partners */}
      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.4 }}
        className={`p-6 rounded-3xl border ${cardBg}`}
      >
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-pink-500/20 border border-pink-400/40 flex items-center justify-center text-pink-300 flex-shrink-0">
            <HeartHandshake size={20} />
          </div>
          <div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-pink-400 mb-2">Why 4 needs partners</div>
            <p className={`text-base leading-relaxed ${textColor}`}>
              Atoms crave a full outer shell of <strong>8 electrons</strong>. With 4, Silicon is exactly halfway -
              too far from empty to give them away, too far from full to grab more. So instead of trading,
              it <strong className="text-pink-300">shares</strong>. Four neighbours, four shared pairs, eight
              effective electrons. Stability through partnership.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
