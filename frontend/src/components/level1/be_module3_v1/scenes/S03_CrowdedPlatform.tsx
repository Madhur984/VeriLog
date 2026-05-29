import React from 'react';
import { motion } from 'framer-motion';
import { Train, Users, Shield } from 'lucide-react';

interface Props { isActive: boolean; isDarkMode: boolean; }

export const S03_CrowdedPlatform: React.FC<Props> = ({ isActive, isDarkMode }) => {
  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText   = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg    = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';

  return (
    <div className="max-w-6xl mx-auto space-y-14 py-4">
      <section className="space-y-3">
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.4em] uppercase text-amber-400">
          <Train size={14} /> Chapter 03 · No Bias
        </div>
        <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>The Crowded Platform</h2>
        <p className={`text-base max-w-3xl ${subText}`}>
          Fuse the two slabs at their boundary with no external voltage applied (V_D = 0V). What
          happens? Diffusion of carriers, drift back, and the famous{' '}
          <strong className="text-amber-300">depletion region</strong> emerges around the join.
        </p>
      </section>

      {/* Single PDF anchor */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        className={`relative rounded-3xl overflow-hidden border ${cardBg}`}
      >
        <img src="/images/commuter/p03.webp" alt="No bias — the crowded platform" className="w-full block aspect-[16/9] object-cover" />
        <div className="absolute bottom-3 right-4 font-mono text-[9px] uppercase tracking-widest text-amber-200/80">
          Commuter Circuit · No Bias
        </div>
      </motion.div>

      {/* Custom SVG of depletion region */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.15 }}
        className={`p-8 rounded-3xl border ${cardBg}`}
      >
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-amber-400 mb-5">
          Schematic · the depletion region after fusion
        </div>
        <svg viewBox="0 0 700 220" className="w-full h-auto">
          {/* P-type block */}
          <rect x="20" y="40" width="260" height="120" fill="#fb923c20" stroke="#fb923c" strokeWidth="2" />
          <text x="150" y="30" fill="#fb923c" fontFamily="monospace" fontSize="13" textAnchor="middle" fontWeight="bold">P-Type (holes)</text>
          {[60, 100, 140, 180, 220, 80, 120, 160, 200, 240].map((x, i) => (
            <circle key={i} cx={x} cy={60 + (i % 3) * 30} r="6" fill="none" stroke="#fb923c" strokeWidth="1.5" />
          ))}

          {/* N-type block */}
          <rect x="420" y="40" width="260" height="120" fill="#38bdf820" stroke="#38bdf8" strokeWidth="2" />
          <text x="550" y="30" fill="#38bdf8" fontFamily="monospace" fontSize="13" textAnchor="middle" fontWeight="bold">N-Type (electrons)</text>
          {[460, 500, 540, 580, 620, 480, 520, 560, 600, 640].map((x, i) => (
            <circle key={i} cx={x} cy={60 + (i % 3) * 30} r="6" fill="#38bdf8" />
          ))}

          {/* Depletion region */}
          <rect x="280" y="40" width="140" height="120" fill="#fcd34d20" stroke="#fcd34d" strokeWidth="2" strokeDasharray="6 3" />
          <text x="350" y="30" fill="#fcd34d" fontFamily="monospace" fontSize="13" textAnchor="middle" fontWeight="bold">Depletion Region</text>
          <text x="295" y="80" fill="#fb923c" fontFamily="monospace" fontSize="14" fontWeight="bold">−</text>
          <text x="295" y="105" fill="#fb923c" fontFamily="monospace" fontSize="14" fontWeight="bold">−</text>
          <text x="295" y="130" fill="#fb923c" fontFamily="monospace" fontSize="14" fontWeight="bold">−</text>
          <text x="395" y="80" fill="#38bdf8" fontFamily="monospace" fontSize="14" fontWeight="bold">+</text>
          <text x="395" y="105" fill="#38bdf8" fontFamily="monospace" fontSize="14" fontWeight="bold">+</text>
          <text x="395" y="130" fill="#38bdf8" fontFamily="monospace" fontSize="14" fontWeight="bold">+</text>

          {/* Internal field arrow */}
          <line x1="320" y1="180" x2="380" y2="180" stroke="#fcd34d" strokeWidth="2" markerEnd="url(#arrow1)" />
          <defs>
            <marker id="arrow1" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#fcd34d" />
            </marker>
          </defs>
          <text x="350" y="200" fill="#fcd34d" fontFamily="monospace" fontSize="10" textAnchor="middle">E (built-in field)</text>

          <text x="350" y="215" fill="#94a3b8" fontFamily="monospace" fontSize="11" textAnchor="middle" fontStyle="italic">I_D = 0 mA</text>
        </svg>
      </motion.div>

      {/* Three explanation cards */}
      <div className="grid md:grid-cols-3 gap-4">
        {[
          { Icon: Users, t: '1 · Diffusion', d: 'Electrons cross from N to P (filling holes); holes drift the other way. A few moments of chaos.' },
          { Icon: Shield, t: '2 · Uncovered Ions', d: 'Crossings leave behind immobile ions: positive donors on the N side, negative acceptors on the P side.' },
          { Icon: Train, t: '3 · Equilibrium', d: 'Those ions create a built-in field that opposes further diffusion. Net current = exactly zero.' },
        ].map((c) => (
          <motion.div
            key={c.t}
            initial={{ opacity: 0, y: 12 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
            className={`p-5 rounded-2xl border border-amber-400/40 bg-amber-500/5`}
          >
            <div className="flex items-center gap-2 mb-2">
              <c.Icon size={14} className="text-amber-300" />
              <span className="font-mono text-[10px] uppercase tracking-widest text-amber-300">{c.t}</span>
            </div>
            <p className={`text-sm ${subText} leading-relaxed`}>{c.d}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
