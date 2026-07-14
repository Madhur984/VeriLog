import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Atom, Droplet, Castle, Gauge } from 'lucide-react';

interface Props { isActive: boolean; isDarkMode: boolean; }

// Mandala / circuit hybrid SVG - central hero artwork.
const MandalaCircuit: React.FC<{ size?: number }> = ({ size = 280 }) => (
  <svg viewBox="0 0 360 360" width={size} height={size} aria-label="Mandala / circuit hero">
    <defs>
      <radialGradient id="bgGlow" cx="0.5" cy="0.5" r="0.6">
        <stop offset="0%" stopColor="rgba(249,115,22,0.5)" />
        <stop offset="100%" stopColor="rgba(249,115,22,0)" />
      </radialGradient>
    </defs>
    <circle cx="180" cy="180" r="170" fill="url(#bgGlow)" />
    {/* outer petals */}
    {Array.from({ length: 16 }).map((_, i) => {
      const a = (i * Math.PI * 2) / 16;
      const r1 = 135;
      const r2 = 165;
      const x1 = 180 + Math.cos(a) * r1;
      const y1 = 180 + Math.sin(a) * r1;
      const x2 = 180 + Math.cos(a) * r2;
      const y2 = 180 + Math.sin(a) * r2;
      return (
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#fb923c" strokeWidth="2" opacity="0.7" />
      );
    })}
    {/* outer ring */}
    <circle cx="180" cy="180" r="135" fill="none" stroke="#fb923c" strokeWidth="2" opacity="0.85" />
    <circle cx="180" cy="180" r="120" fill="none" stroke="#f97316" strokeWidth="1.5" opacity="0.6" />
    {/* lotus / star pattern */}
    {Array.from({ length: 8 }).map((_, i) => {
      const a = (i * Math.PI * 2) / 8;
      const x = 180 + Math.cos(a) * 95;
      const y = 180 + Math.sin(a) * 95;
      return (
        <g key={i} transform={`translate(${x},${y}) rotate(${(a * 180) / Math.PI})`}>
          <path d="M 0,-22 Q 12,0 0,22 Q -12,0 0,-22 Z" fill="#0ea5e9" opacity="0.85" />
          <path d="M 0,-14 Q 7,0 0,14 Q -7,0 0,-14 Z" fill="#fde68a" />
        </g>
      );
    })}
    {/* circuit traces inside */}
    {Array.from({ length: 6 }).map((_, i) => {
      const a = (i * Math.PI * 2) / 6;
      const x1 = 180 + Math.cos(a) * 60;
      const y1 = 180 + Math.sin(a) * 60;
      return (
        <g key={i}>
          <line x1="180" y1="180" x2={x1} y2={y1} stroke="#14b8a6" strokeWidth="1.6" />
          <circle cx={x1} cy={y1} r="3.2" fill="#14b8a6" />
        </g>
      );
    })}
    {/* nucleus */}
    <circle cx="180" cy="180" r="34" fill="#0f172a" stroke="#fcd34d" strokeWidth="2" />
    <text x="180" y="188" textAnchor="middle" fontFamily="monospace" fontWeight="900" fontSize="24" fill="#fcd34d">Si</text>
    {/* electron orbits */}
    {[58, 78, 100].map((r, i) => (
      <ellipse key={i} cx="180" cy="180" rx={r} ry={r * 0.5}
               fill="none" stroke="#f97316" strokeWidth="1.2" opacity="0.55"
               transform={`rotate(${i * 60} 180 180)`} />
    ))}
    {/* electrons */}
    {[
      [58, 0], [78, 60], [100, 120], [58, 180], [78, 240], [100, 300],
    ].map(([r, deg], i) => {
      // approximate the rotated ellipse: place along base orbit with a per-electron rotation offset
      const rot = (i % 3) * 60;
      const c = Math.cos(((deg + rot) * Math.PI) / 180);
      const s = Math.sin(((deg + rot) * Math.PI) / 180);
      const ex = 180 + c * r;
      const ey = 180 + s * (r * 0.5);
      return <circle key={i} cx={ex} cy={ey} r="4" fill="#0ea5e9" />;
    })}
  </svg>
);

export const S00_Cover: React.FC<Props> = ({ isActive, isDarkMode }) => {
  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const cardBg = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';
  const subText = isDarkMode ? 'text-slate-300' : 'text-slate-600';

  return (
    <div className="max-w-6xl mx-auto space-y-16 py-8">
      {/* Hero illustration */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }} animate={isActive ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.7 }}
        className="relative rounded-3xl overflow-hidden border border-orange-300/20 mx-auto max-w-3xl aspect-[16/9]"
        style={{
          background: 'linear-gradient(135deg, #1c0e07 0%, #2a160c 50%, #170a05 100%)',
        }}
      >
        {/* Diamond pattern */}
        <div
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage:
              'repeating-linear-gradient(45deg, rgba(249,115,22,0.4) 0 1px, transparent 1px 18px), repeating-linear-gradient(-45deg, rgba(20,184,166,0.4) 0 1px, transparent 1px 18px)',
          }}
        />
        <div className="absolute inset-0 flex items-center">
          <div className="flex-1 px-12">
            <h2 className="text-4xl md:text-5xl font-black text-orange-300 leading-none drop-shadow-[0_0_20px_rgba(249,115,22,0.4)]">
              THE PHYSICS
            </h2>
            <h2 className="text-4xl md:text-5xl font-black text-amber-200/90 leading-none mt-1">
              OF CONTROL
            </h2>
            <p className="text-sm md:text-base text-slate-200 mt-4 max-w-sm">
              Atomic structure, bonding, and the<br/>energy bands of <span className="text-orange-300 font-semibold">semiconductors</span>.
            </p>
          </div>
          <div className="hidden md:block w-[42%] h-full flex items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
              className="flex items-center justify-center"
            >
              <MandalaCircuit size={250} />
            </motion.div>
          </div>
        </div>
        <div className="absolute bottom-3 right-4 font-mono text-[9px] uppercase tracking-widest text-orange-200/70">
          The Pure-State Atelier · Page 01
        </div>
      </motion.div>

      {/* Hero copy */}
      <section className="text-center space-y-6 relative">
        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }} animate={isActive ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6 }}
          className={`text-5xl md:text-7xl font-black tracking-tight leading-[0.95] ${textColor}`}
        >
          From Pure Crystals<br />
          <span className="bg-gradient-to-r from-orange-400 via-amber-300 to-rose-400 bg-clip-text text-transparent">
            to Energy Bands
          </span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }} animate={isActive ? { opacity: 1 } : {}}
          transition={{ delay: 0.2 }}
          className={`text-lg md:text-xl max-w-2xl mx-auto ${subText}`}
        >
          A visual story-walk through atomic structure, covalent bonding and band theory - told as a{' '}
          <strong className="text-orange-300">Garba dance</strong>, a sports franchise, and a 3-tier city.
        </motion.p>
      </section>

      {/* Three-up: conductor / semi / insulator preview */}
      <div className="grid md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3 }}
          className={`p-8 rounded-3xl border ${cardBg} relative overflow-hidden`}
        >
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-cyan-400/10 rounded-full blur-3xl" />
          <div className="flex items-start gap-4 mb-3">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
              <Droplet size={22} />
            </div>
            <div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-cyan-400 mb-1">The Free</div>
              <h3 className={`text-xl font-black ${textColor}`}>Conductors</h3>
            </div>
          </div>
          <p className={`text-sm leading-relaxed ${subText}`}>
            Charge flows freely. Power lines, copper wires. <strong>Cannot be stopped.</strong>
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4 }}
          className={`p-8 rounded-3xl border ${cardBg} relative overflow-hidden`}
        >
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-orange-400/10 rounded-full blur-3xl" />
          <div className="flex items-start gap-4 mb-3">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/20 border border-orange-400/40 flex items-center justify-center text-orange-300">
              <Gauge size={22} />
            </div>
            <div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-orange-400 mb-1">The Controllable</div>
              <h3 className={`text-xl font-black ${textColor}`}>Semiconductors</h3>
            </div>
          </div>
          <p className={`text-sm leading-relaxed ${subText}`}>
            The all-rounders. Conductivity falls between conductors and insulators. <strong>We dictate when they play.</strong>
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5 }}
          className={`p-8 rounded-3xl border ${cardBg} relative overflow-hidden`}
        >
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-rose-400/10 rounded-full blur-3xl" />
          <div className="flex items-start gap-4 mb-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-400/40 flex items-center justify-center text-rose-300">
              <Castle size={22} />
            </div>
            <div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-rose-400 mb-1">The Locked</div>
              <h3 className={`text-xl font-black ${textColor}`}>Insulators</h3>
            </div>
          </div>
          <p className={`text-sm leading-relaxed ${subText}`}>
            Block completely. Glass, rubber, ceramic. <strong>Cannot be opened.</strong>
          </p>
        </motion.div>
      </div>

      {/* Story arc preview */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.6 }}
        className={`p-8 rounded-3xl border ${cardBg}`}
      >
        <div className="flex items-center gap-3 mb-6">
          <Sparkles size={16} className="text-orange-400" />
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-orange-400">Story Arc</span>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {[
            { Icon: Atom, n: '01', t: 'Meet the players',
              d: 'Silicon, Germanium and Gallium Arsenide step on the field. We open up Si\'s atomic shell and find the four star players on the boundary.' },
            { Icon: Sparkles, n: '02', t: 'Watch the dance',
              d: 'Four valence electrons join hands in a Garba - perfect bonds. The dhol drops, heat enters, electrons break free, and holes appear.' },
            { Icon: Gauge, n: '03', t: 'Climb the city',
              d: 'Energy is plotted as a 3-tier city. Cross the toll booth (Eg) in electron-volts to ride the conduction expressway. Si, Ge, GaAs each have a different price.' },
          ].map((s) => (
            <div key={s.n} className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-orange-500/15 border border-orange-400/30 flex items-center justify-center text-orange-300">
                  <s.Icon size={16} />
                </div>
                <span className="font-mono text-3xl font-black text-orange-400/60">{s.n}</span>
                <h4 className={`font-black text-sm ${textColor}`}>{s.t}</h4>
              </div>
              <p className={`text-xs leading-relaxed ${subText}`}>{s.d}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Outcomes */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.7 }}
        className={`p-8 rounded-3xl border ${cardBg}`}
      >
        <div className="flex items-center gap-2 mb-6">
          <Sparkles size={14} className="text-orange-400" />
          <span className="font-mono text-[10px] uppercase tracking-widest text-orange-400">
            By the end of this module · you will be able to
          </span>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { tag: 'Atomic shells', desc: 'Recognise Silicon\'s 14 electrons split into nucleus, inner shells & 4 valence electrons.' },
            { tag: 'Covalent lattice', desc: 'Explain how four neighbours each share an electron pair to form a crystal.' },
            { tag: 'Holes', desc: 'Describe how thermal energy creates electron-hole pairs and why heat lowers resistance.' },
            { tag: 'Band theory', desc: 'Compare insulator, conductor and semiconductor by their forbidden-gap energy in eV.' },
          ].map((cap) => (
            <div
              key={cap.tag}
              className={`p-4 rounded-2xl border ${
                isDarkMode ? 'bg-black/30 border-white/10' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="font-mono text-[10px] uppercase tracking-widest text-orange-300 mb-2">{cap.tag}</div>
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
        Press <kbd className="px-2 py-1 rounded bg-black/20 text-[10px]">→</kbd> to begin · 13 chapters · ~30 min
      </motion.div>
    </div>
  );
};
