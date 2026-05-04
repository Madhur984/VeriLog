import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, HardHat, Compass, Building2, Map, Wand2 } from 'lucide-react';

interface Props { isActive: boolean; isDarkMode: boolean; }

export const S00_Cover: React.FC<Props> = ({ isActive, isDarkMode }) => {
  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const cardBg = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';
  const subText = isDarkMode ? 'text-slate-300' : 'text-slate-600';

  return (
    <div className="max-w-6xl mx-auto space-y-16 py-8">
      {/* Hero blueprint illustration (CSS-built, no asset dependency) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }} animate={isActive ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.7 }}
        className="relative rounded-3xl overflow-hidden border border-amber-300/20 mx-auto max-w-3xl aspect-[16/9]"
        style={{
          background: 'linear-gradient(135deg, #0c1a2e 0%, #102a4c 60%, #0a1628 100%)',
        }}
      >
        {/* Blueprint grid */}
        <div
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage:
              'linear-gradient(rgba(125,170,230,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(125,170,230,0.35) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />
        <div className="absolute inset-0 flex items-center">
          <div className="flex-1 px-12">
            <div className="font-mono text-[10px] tracking-[0.4em] uppercase text-amber-300/80 mb-2">Scale 1:100 · Section A–A</div>
            <h2 className="text-4xl md:text-5xl font-black text-amber-300 leading-none drop-shadow-[0_0_18px_rgba(252,211,77,0.4)]">
              THE ARCHITECT
            </h2>
            <h2 className="text-4xl md:text-5xl font-black text-amber-200/90 leading-none mt-1">
              OF LOGIC
            </h2>
            <p className="text-sm md:text-base text-slate-200 mt-4 max-w-sm">
              Mastering Karnaugh Maps through the<br/>blueprint of <span className="text-amber-300 font-semibold">Madhur’s Hostel</span>.
            </p>
          </div>
          {/* Isometric room cluster */}
          <div className="hidden md:block w-[42%] h-full relative">
            <svg viewBox="0 0 320 240" className="w-full h-full">
              <defs>
                <linearGradient id="rmGlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#fcd34d" stopOpacity="0.95" />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.4" />
                </linearGradient>
              </defs>
              {/* Iso boxes */}
              {[
                [120, 70], [180, 95], [240, 60],
                [90, 120], [150, 145], [210, 110],
                [60, 170], [180, 195],
              ].map(([x, y], i) => (
                <g key={i} transform={`translate(${x},${y})`}>
                  <polygon points="0,18 28,4 56,18 28,32" fill="url(#rmGlow)" stroke="#fde68a" strokeWidth="1" opacity="0.95" />
                  <polygon points="0,18 28,32 28,52 0,38" fill="#1f3a63" stroke="#7daae6" strokeWidth="0.8" opacity="0.9" />
                  <polygon points="56,18 28,32 28,52 56,38" fill="#162a48" stroke="#7daae6" strokeWidth="0.8" opacity="0.9" />
                </g>
              ))}
            </svg>
          </div>
        </div>
        <div className="absolute bottom-3 right-4 font-mono text-[9px] uppercase tracking-widest text-amber-200/70">
          Madhur’s Sketchbook · Page 01
        </div>
      </motion.div>

      {/* Hero copy */}
      <section className="text-center space-y-6 relative">
        <motion.span
          initial={{ opacity: 0, y: -10 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
          className="font-mono text-[10px] tracking-[0.4em] uppercase text-amber-400 block"
        >
          DSD · Module 2 · The Architect of Logic
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }} animate={isActive ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6 }}
          className={`text-5xl md:text-7xl font-black tracking-tight leading-[0.95] ${textColor}`}
        >
          Karnaugh Maps as<br />
          <span className="bg-gradient-to-r from-amber-400 via-yellow-300 to-orange-400 bg-clip-text text-transparent">
            Architectural Blueprints
          </span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }} animate={isActive ? { opacity: 1 } : {}}
          transition={{ delay: 0.2 }}
          className={`text-lg md:text-xl max-w-2xl mx-auto ${subText}`}
        >
          A visual, story-driven walk through 4-variable K-Maps — narrated through{' '}
          <strong className="text-amber-300">Madhur the Hostel Warden&apos;s</strong> floor plan.
        </motion.p>
      </section>

      {/* Hero character + thesis */}
      <div className="grid md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }} animate={isActive ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: 0.3 }}
          className={`p-8 rounded-3xl border ${cardBg} relative overflow-hidden`}
        >
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-amber-400/10 rounded-full blur-3xl" />
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
              <HardHat size={22} />
            </div>
            <div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-amber-400 mb-1">The Architect</div>
              <h3 className={`text-xl font-black ${textColor}`}>Madhur · The Hostel Warden</h3>
            </div>
          </div>
          <p className={`text-sm leading-relaxed ${subText}`}>
            Madhur doesn&apos;t do sequential lists. He views logic as <strong>architecture</strong>.
            By folding 16 truth-table rows into a 4×4 floor plan, he transforms abstract Boolean
            algebra into a <em>spatial puzzle</em>. Every minterm gets its own physical room.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }} animate={isActive ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: 0.4 }}
          className={`p-8 rounded-3xl border ${cardBg} relative overflow-hidden`}
        >
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-orange-400/10 rounded-full blur-3xl" />
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/20 border border-orange-400/40 flex items-center justify-center text-orange-300">
              <Compass size={22} />
            </div>
            <div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-orange-400 mb-1">The Thesis</div>
              <h3 className={`text-xl font-black ${textColor}`}>Adjacency = Simplification</h3>
            </div>
          </div>
          <p className={`text-sm leading-relaxed ${subText}`}>
            Two minterms that share a wall on Madhur&apos;s blueprint are guaranteed to differ
            by exactly one variable — and can therefore be merged. The K-Map turns Boolean
            simplification into a game of <strong>finding the largest rectangular wing</strong>.
          </p>
        </motion.div>
      </div>

      {/* Three story acts */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.5 }}
        className={`p-8 rounded-3xl border ${cardBg}`}
      >
        <div className="flex items-center gap-3 mb-6">
          <Sparkles size={16} className="text-amber-400" />
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-amber-400">Story Arc</span>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {[
            { Icon: Map,      n: '01', t: 'Lay the Grid',   d: 'Gray code organises the corridors. Every neighbour differs by exactly one bit — one shared wall.' },
            { Icon: Building2,n: '02', t: 'Group the Wings', d: 'HVAC works only in powers of two. Bigger rectangles wipe out more variables — always go bigger.' },
            { Icon: Wand2,    n: '03', t: 'Walk the Torus', d: 'The blueprint rolls into a cylinder, then a doughnut. The corners cluster. Edges share secret corridors.' },
          ].map((s) => (
            <div key={s.n} className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-400/30 flex items-center justify-center text-amber-300">
                  <s.Icon size={16} />
                </div>
                <span className="font-mono text-3xl font-black text-amber-400/60">{s.n}</span>
                <h4 className={`font-black text-sm ${textColor}`}>{s.t}</h4>
              </div>
              <p className={`text-xs leading-relaxed ${subText}`}>{s.d}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* What you will be able to do strip */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.6 }}
        className={`p-8 rounded-3xl border ${cardBg}`}
      >
        <div className="flex items-center gap-2 mb-6">
          <Sparkles size={14} className="text-amber-400" />
          <span className="font-mono text-[10px] uppercase tracking-widest text-amber-400">
            By the end of this module · you will be able to
          </span>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { tag: '4-var K-Map', desc: 'Lay out 16 minterms on a Gray-coded 4×4 grid.' },
            { tag: 'Wing Rules',  desc: 'Group 1s into rectangular wings of 1, 2, 4, 8 or 16.' },
            { tag: 'Wrap-around', desc: 'Spot torus adjacencies — corners, edges, top/bottom.' },
            { tag: "Don't Care",  desc: 'Use X to upgrade a wing or ignore it cleanly.' },
          ].map((cap) => (
            <div
              key={cap.tag}
              className={`p-4 rounded-2xl border ${
                isDarkMode ? 'bg-black/30 border-white/10' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="font-mono text-[10px] uppercase tracking-widest text-amber-300 mb-2">{cap.tag}</div>
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
        Press <kbd className="px-2 py-1 rounded bg-black/20 text-[10px]">→</kbd> to begin · 14 chapters · ~35 min
      </motion.div>
    </div>
  );
};
