import React from 'react';
import { motion } from 'framer-motion';
import { Crown, Award, Star, Lock } from 'lucide-react';

interface Props { isActive: boolean; isDarkMode: boolean; }

// Atom diagram with concentric shells (Bohr model)
const AtomDiagram: React.FC<{ shells: number[]; symbol: string; color: string }> = ({ shells, symbol, color }) => {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-44">
      <defs>
        <radialGradient id={`g-${symbol}`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor={`${color}33`} />
          <stop offset="100%" stopColor={`${color}00`} />
        </radialGradient>
      </defs>
      <circle cx="100" cy="100" r="92" fill={`url(#g-${symbol})`} />
      {/* shells */}
      {shells.map((count, shellIdx) => {
        const r = 24 + shellIdx * 22;
        return (
          <g key={shellIdx}>
            <circle cx="100" cy="100" r={r} fill="none" stroke={color} strokeWidth="1" opacity="0.5" />
            {Array.from({ length: count }).map((_, i) => {
              const a = (i * Math.PI * 2) / count - Math.PI / 2;
              const x = 100 + Math.cos(a) * r;
              const y = 100 + Math.sin(a) * r;
              return <circle key={i} cx={x} cy={y} r="3" fill={color} />;
            })}
          </g>
        );
      })}
      {/* nucleus */}
      <circle cx="100" cy="100" r="16" fill="#0f172a" stroke={color} strokeWidth="2" />
      <text x="100" y="106" textAnchor="middle" fontFamily="monospace" fontWeight="900" fontSize="14" fill={color}>{symbol}</text>
    </svg>
  );
};

// GaAs has a different visualisation — a diatomic molecule
const GaAsDiagram: React.FC = () => (
  <svg viewBox="0 0 200 200" className="w-full h-44">
    <defs>
      <radialGradient id="ga-glow" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0%" stopColor="rgba(236,72,153,0.35)" />
        <stop offset="100%" stopColor="rgba(236,72,153,0)" />
      </radialGradient>
    </defs>
    <circle cx="100" cy="100" r="92" fill="url(#ga-glow)" />
    {/* bond axis */}
    <line x1="60" y1="100" x2="140" y2="100" stroke="#ec4899" strokeWidth="2" />
    {/* hexagonal pattern around */}
    {[0, 60, 120, 180, 240, 300].map((deg, i) => {
      const a = (deg * Math.PI) / 180;
      const cx1 = 100 + Math.cos(a) * 60;
      const cy1 = 100 + Math.sin(a) * 60;
      return <circle key={i} cx={cx1} cy={cy1} r="6" fill="#fb923c" opacity="0.6" />;
    })}
    {/* Ga atom */}
    <circle cx="65" cy="100" r="22" fill="#0f172a" stroke="#ec4899" strokeWidth="2.5" />
    <text x="65" y="106" textAnchor="middle" fontFamily="monospace" fontWeight="900" fontSize="11" fill="#ec4899">Ga</text>
    {/* As atom */}
    <circle cx="135" cy="100" r="22" fill="#0f172a" stroke="#fb923c" strokeWidth="2.5" />
    <text x="135" y="106" textAnchor="middle" fontFamily="monospace" fontWeight="900" fontSize="11" fill="#fb923c">As</text>
    {/* light emission rays */}
    {[30, 50, 70, 110, 130, 150].map((deg, i) => {
      const a = (deg * Math.PI) / 180;
      const x1 = 100 + Math.cos(a) * 80;
      const y1 = 100 + Math.sin(a) * 80 + 25;
      const x2 = 100 + Math.cos(a) * 92;
      const y2 = 100 + Math.sin(a) * 92 + 25;
      return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#fde68a" strokeWidth="2" />;
    })}
  </svg>
);

interface PlayerCard {
  name: string;
  formula: string;
  role: string;
  Icon: React.FC<any>;
  electrons: string;
  shells: number[]; // for Bohr model; null for GaAs (uses GaAsDiagram)
  blurb: string;
  color: string;
  bgGradient: string;
  isCompound?: boolean;
}

const PLAYERS: PlayerCard[] = [
  {
    name: 'SILICON',
    formula: 'Si',
    role: 'The Captain',
    Icon: Crown,
    electrons: '14 total electrons',
    shells: [2, 8, 4],
    blurb: 'The most abundant, stable, and reliable base material on Earth. The captain of the team.',
    color: '#fcd34d',
    bgGradient: 'linear-gradient(135deg, #2a1c0a 0%, #3a2410 60%, #1f1208 100%)',
  },
  {
    name: 'GERMANIUM',
    formula: 'Ge',
    role: 'The Veteran',
    Icon: Award,
    electrons: '32 total electrons',
    shells: [2, 8, 18, 4],
    blurb: 'Highly sensitive to temperature. Used in high-speed radio frequency applications. The seasoned veteran.',
    color: '#22d3ee',
    bgGradient: 'linear-gradient(135deg, #0a1f2a 0%, #103040 60%, #051018 100%)',
  },
  {
    name: 'GALLIUM ARSENIDE',
    formula: 'GaAs',
    role: 'The Specialist',
    Icon: Star,
    electrons: 'Compound · Ga + As',
    shells: [],
    isCompound: true,
    blurb: 'A compound material with incredible speed and light-emitting properties. The specialist for LEDs, lasers, and 5G.',
    color: '#ec4899',
    bgGradient: 'linear-gradient(135deg, #2a0a1c 0%, #401040 60%, #180510 100%)',
  },
];

export const S03_StartingLineup: React.FC<Props> = ({ isActive, isDarkMode }) => {
  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';

  return (
    <div className="max-w-6xl mx-auto space-y-12 py-4">
      <section className="space-y-3">
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.4em] uppercase text-sky-400">
          <Star size={14} /> Chapter 03 · The Lineup
        </div>
        <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>The Starting Lineup</h2>
        <p className={`text-base max-w-3xl ${subText}`}>
          Three semiconductor materials power most of modern electronics. Meet the team — each one
          with its own personality, strengths, and signature use case.
        </p>
      </section>

      <div className="grid md:grid-cols-3 gap-6">
        {PLAYERS.map((p, i) => (
          <motion.div
            key={p.formula}
            initial={{ opacity: 0, y: 30, rotateY: -10 }}
            animate={isActive ? { opacity: 1, y: 0, rotateY: 0 } : {}}
            transition={{ delay: 0.15 + i * 0.12, type: 'spring', stiffness: 120, damping: 18 }}
            whileHover={{ y: -8, scale: 1.02 }}
            className={`p-6 rounded-3xl border-2 relative overflow-hidden`}
            style={{
              borderColor: `${p.color}55`,
              background: p.bgGradient,
              boxShadow: `0 20px 60px ${p.color}25`,
            }}
          >
            {/* Card decorative pattern */}
            <div
              className="absolute inset-0 pointer-events-none opacity-[0.06]"
              style={{
                backgroundImage:
                  'repeating-linear-gradient(45deg, currentColor 0 1px, transparent 1px 14px), repeating-linear-gradient(-45deg, currentColor 0 1px, transparent 1px 14px)',
                color: p.color,
              }}
            />
            {/* Header */}
            <div className="flex items-start justify-between mb-3 relative">
              <div>
                <div className="font-mono text-[9px] uppercase tracking-[0.25em] mb-1" style={{ color: p.color }}>{p.role}</div>
                <h3 className="text-xl font-black text-white">{p.name}</h3>
                <div className="font-mono text-3xl font-black mt-1" style={{ color: p.color }}>({p.formula})</div>
              </div>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${p.color}22`, border: `1px solid ${p.color}66`, color: p.color }}>
                <p.Icon size={18} />
              </div>
            </div>
            {/* Atom art */}
            <div className="rounded-2xl p-2 mb-4 border relative" style={{ background: 'rgba(0,0,0,0.35)', borderColor: `${p.color}33` }}>
              {p.isCompound ? <GaAsDiagram /> : <AtomDiagram shells={p.shells} symbol={p.formula} color={p.color} />}
            </div>
            {/* Stats */}
            <div className="flex items-center justify-between mb-3 px-2 py-1.5 rounded-lg" style={{ background: 'rgba(0,0,0,0.25)' }}>
              <span className="font-mono text-[10px] uppercase tracking-widest text-slate-400">Electrons</span>
              <span className="font-mono text-xs font-black" style={{ color: p.color }}>{p.electrons}</span>
            </div>
            <p className="text-[13px] leading-relaxed text-slate-300">{p.blurb}</p>
          </motion.div>
        ))}
      </div>

      {/* Shared secret */}
      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.6 }}
        className={`p-8 rounded-3xl border ${cardBg} relative overflow-hidden`}
      >
        <div className="absolute -top-10 -left-10 w-60 h-60 bg-orange-400/10 rounded-full blur-3xl" />
        <div className="flex items-start gap-4 relative">
          <div className="w-12 h-12 rounded-2xl bg-orange-500/20 border border-orange-400/40 flex items-center justify-center text-orange-300 flex-shrink-0">
            <Lock size={20} />
          </div>
          <div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-orange-400 mb-2">The Shared Secret</div>
            <p className={`text-base leading-relaxed ${textColor}`}>
              Whether pure single-crystal (Si, Ge) or compound (GaAs), all three materials share one
              defining trait: their electrical behaviour relies <strong className="text-orange-300">entirely</strong> on
              their <strong>outermost shell</strong>. The inner electrons play no role. To understand
              semiconductors, we just need to study one shell.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
