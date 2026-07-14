import React from 'react';
import { motion } from 'framer-motion';
import { Construction, Zap, Anchor } from 'lucide-react';

interface Props { isActive: boolean; isDarkMode: boolean; }

export const S04_TrafficJam: React.FC<Props> = ({ isActive, isDarkMode }) => {
  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText   = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg    = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';

  return (
    <div className="max-w-6xl mx-auto space-y-14 py-4">
      <section className="space-y-3">
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.4em] uppercase text-amber-400">
          <Construction size={14} /> Chapter 04 · The Mechanism
        </div>
        <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>The Traffic Jam Mechanism</h2>
        <p className={`text-base max-w-3xl ${subText}`}>
          Why does diffusion <em>stop</em>? Because the migration leaves behind a wall of
          immobile charged ions, and those ions create a built-in electric field that pushes
          carriers <strong className="text-amber-300">back the way they came</strong>. The
          junction self-balances.
        </p>
      </section>

      {/* PDF anchor */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        className={`relative rounded-3xl overflow-hidden border ${cardBg}`}
      >
        <img loading="lazy" decoding="async" src="/images/commuter/p04.webp" alt="The traffic jam mechanism" className="w-full block aspect-[16/9] object-cover" />
        <div className="hidden sm:block absolute bottom-3 right-4 font-mono text-[9px] uppercase tracking-widest text-amber-200/80">
          Commuter Circuit · The Mechanism
        </div>
      </motion.div>

      {/* Three-step mechanism with custom SVGs */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.15 }}
        className={`p-8 rounded-3xl border ${cardBg}`}
      >
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-amber-400 mb-5">
          Three-step mechanism · what physics is doing
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {/* Step 1 */}
          <div className={`p-5 rounded-2xl border border-amber-400/40 bg-amber-500/5`}>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-6 h-6 rounded-full bg-amber-400 text-black grid place-items-center font-mono text-xs font-bold">1</span>
              <span className="font-mono text-[10px] uppercase tracking-widest text-amber-300">Donor ions exposed</span>
            </div>
            <svg viewBox="0 0 200 100" className="w-full h-auto mb-3">
              <rect x="100" y="20" width="100" height="60" fill="#38bdf820" stroke="#38bdf8" strokeWidth="2" />
              <text x="115" y="55" fill="#38bdf8" fontFamily="monospace" fontSize="14" fontWeight="bold">+</text>
              <text x="135" y="55" fill="#38bdf8" fontFamily="monospace" fontSize="14" fontWeight="bold">+</text>
              <text x="155" y="55" fill="#38bdf8" fontFamily="monospace" fontSize="14" fontWeight="bold">+</text>
              <text x="175" y="55" fill="#38bdf8" fontFamily="monospace" fontSize="14" fontWeight="bold">+</text>
              <line x1="100" y1="20" x2="100" y2="80" stroke="#fcd34d" strokeWidth="2" strokeDasharray="3 3" />
              <text x="50" y="55" fill="#94a3b8" fontFamily="monospace" fontSize="10" textAnchor="middle">N region</text>
            </svg>
            <p className={`text-xs ${subText}`}>
              Each electron that crossed the junction left behind a positively-charged donor
              ion <em>fixed in the lattice</em>.
            </p>
          </div>

          {/* Step 2 */}
          <div className={`p-5 rounded-2xl border border-amber-400/40 bg-amber-500/5`}>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-6 h-6 rounded-full bg-amber-400 text-black grid place-items-center font-mono text-xs font-bold">2</span>
              <span className="font-mono text-[10px] uppercase tracking-widest text-amber-300">Acceptor ions exposed</span>
            </div>
            <svg viewBox="0 0 200 100" className="w-full h-auto mb-3">
              <rect x="0" y="20" width="100" height="60" fill="#fb923c20" stroke="#fb923c" strokeWidth="2" />
              <text x="20" y="55" fill="#fb923c" fontFamily="monospace" fontSize="14" fontWeight="bold">−</text>
              <text x="40" y="55" fill="#fb923c" fontFamily="monospace" fontSize="14" fontWeight="bold">−</text>
              <text x="60" y="55" fill="#fb923c" fontFamily="monospace" fontSize="14" fontWeight="bold">−</text>
              <text x="80" y="55" fill="#fb923c" fontFamily="monospace" fontSize="14" fontWeight="bold">−</text>
              <line x1="100" y1="20" x2="100" y2="80" stroke="#fcd34d" strokeWidth="2" strokeDasharray="3 3" />
              <text x="150" y="55" fill="#94a3b8" fontFamily="monospace" fontSize="10" textAnchor="middle">P region</text>
            </svg>
            <p className={`text-xs ${subText}`}>
              On the P side, every hole that drifted away leaves a fixed
              negatively-charged acceptor ion behind.
            </p>
          </div>

          {/* Step 3 */}
          <div className={`p-5 rounded-2xl border-2 border-amber-400 bg-amber-500/10`}>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-6 h-6 rounded-full bg-amber-400 text-black grid place-items-center font-mono text-xs font-bold">3</span>
              <span className="font-mono text-[10px] uppercase tracking-widest text-amber-300">Built-in field opposes</span>
            </div>
            <svg viewBox="0 0 200 100" className="w-full h-auto mb-3">
              <rect x="0" y="20" width="100" height="60" fill="#fb923c20" stroke="#fb923c" strokeWidth="1" />
              <rect x="100" y="20" width="100" height="60" fill="#38bdf820" stroke="#38bdf8" strokeWidth="1" />
              <text x="40" y="55" fill="#fb923c" fontFamily="monospace" fontSize="13" fontWeight="bold">−</text>
              <text x="160" y="55" fill="#38bdf8" fontFamily="monospace" fontSize="13" fontWeight="bold">+</text>
              {/* arrow showing built-in field N→P */}
              <line x1="140" y1="50" x2="60" y2="50" stroke="#fcd34d" strokeWidth="3" markerEnd="url(#tjArrow)" />
              <defs>
                <marker id="tjArrow" viewBox="0 0 10 10" refX="0" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 10 0 L 0 5 L 10 10 z" fill="#fcd34d" />
                </marker>
              </defs>
              <text x="100" y="92" fill="#fcd34d" fontFamily="monospace" fontSize="9" textAnchor="middle">E_built-in</text>
            </svg>
            <p className={`text-xs ${subText}`}>
              That charge separation produces a localised E-field opposing further diffusion.
              <strong className="text-amber-300"> Equilibrium reached.</strong>
            </p>
          </div>
        </div>
      </motion.div>

      {/* Built-in voltage card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.25 }}
        className={`p-8 rounded-3xl border-2 border-amber-400/60 bg-amber-500/10`}
      >
        <div className="flex items-center gap-3 mb-3">
          <Zap className="text-amber-300" size={18} />
          <span className="font-mono text-[10px] uppercase tracking-widest text-amber-300">The barrier potential</span>
        </div>
        <h3 className={`text-2xl font-black ${textColor} mb-3`}>V_bi ≈ 0.7 V (Si) · 0.3 V (Ge)</h3>
        <p className={`text-sm ${subText} leading-relaxed`}>
          The built-in voltage across the depletion region is the <em>barrier height</em> a
          carrier must overcome before flowing forward. It depends on doping concentrations and
          the material&apos;s energy gap. <strong className="text-amber-300">Memorise 0.7 V for
          Si</strong> - it&apos;s the most-used number in this entire module.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }} animate={isActive ? { opacity: 1 } : {}}
        transition={{ delay: 0.35 }}
        className={`p-5 rounded-2xl border ${cardBg} flex items-start gap-3`}
      >
        <Anchor className="text-amber-300 flex-shrink-0 mt-0.5" size={16} />
        <p className={`text-xs ${subText}`}>
          <strong className="text-amber-300">Note:</strong> the depletion region is <em>not</em>{' '}
          empty. It contains immobile ionised dopants - but no <em>mobile</em> carriers. That&apos;s
          why no current flows through it without external help.
        </p>
      </motion.div>
    </div>
  );
};
