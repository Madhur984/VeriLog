import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useGamificationStore } from '../stores/gamificationStore';
import { CommandPalette } from '../components/ui/CommandPalette';
import { OnboardingTour } from '../components/ui/OnboardingTour';
import { RadialMenu } from '../components/ui/RadialMenu';
import { FluencyLEDGrid } from '../components/ui/FluencyLEDGrid';
import { DiagnosticConsole } from '../components/ui/DiagnosticConsole';
import { HierarchicalGrindTree } from '../components/ui/HierarchicalGrindTree';

const getTourKey = (n: string | null) => `digi_tour_done_${n ?? 'guest'}`;

// ─── PCB ISOMETRIC BACKGROUND ──────────────────────────────────────────────────
const PCBBackground: React.FC = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {/* Base darkfield */}
    <div
      className="absolute inset-0"
      style={{ background: 'radial-gradient(ellipse 120% 100% at 50% 0%, #0d1526 0%, #06090f 80%)' }}
    />

    {/* Fine grid */}
    <div
      className="absolute inset-0"
      style={{
        backgroundImage: `
          linear-gradient(rgba(34,211,238,0.05) 1px, transparent 1px),
          linear-gradient(90deg, rgba(34,211,238,0.05) 1px, transparent 1px),
          linear-gradient(rgba(34,211,238,0.02) 1px, transparent 1px),
          linear-gradient(90deg, rgba(34,211,238,0.02) 1px, transparent 1px)
        `,
        backgroundSize: '80px 80px, 80px 80px, 16px 16px, 16px 16px',
      }}
    />

    {/* Gold circuit trace decoration */}
    <svg className="absolute inset-0 w-full h-full opacity-[0.07]" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="gold-trace" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">
          {/* Gold horizontal traces */}
          <path d="M0,100 L60,100 L60,60 L100,60 L100,0" stroke="#fbbf24" strokeWidth="1.5" fill="none" />
          <path d="M200,100 L140,100 L140,140 L100,140 L100,200" stroke="#fbbf24" strokeWidth="1.5" fill="none" />
          {/* Cyan traces */}
          <path d="M0,50 L30,50 L30,100 L80,100" stroke="#22d3ee" strokeWidth="1" fill="none" />
          <path d="M200,150 L170,150 L170,100 L120,100" stroke="#a78bfa" strokeWidth="1" fill="none" />
          {/* Solder pads */}
          <circle cx="60" cy="100" r="4" fill="none" stroke="#fbbf24" strokeWidth="1.5" />
          <circle cx="140" cy="100" r="4" fill="none" stroke="#fbbf24" strokeWidth="1.5" />
          <rect x="96" y="56" width="8" height="8" fill="none" stroke="#22d3ee" strokeWidth="1" />
          <rect x="96" y="136" width="8" height="8" fill="none" stroke="#a78bfa" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#gold-trace)" />
    </svg>

    {/* Moving data packets */}
    {Array.from({ length: 8 }).map((_, i) => (
      <motion.div
        key={i}
        className="absolute"
        style={{
          width: 4,
          height: 4,
          borderRadius: '50%',
          background: ['#22d3ee', '#a78bfa', '#34d399', '#fbbf24', '#fb7185', '#60a5fa', '#4ade80', '#f472b6'][i],
          boxShadow: `0 0 6px ${['#22d3ee', '#a78bfa', '#34d399', '#fbbf24', '#fb7185', '#60a5fa', '#4ade80', '#f472b6'][i]}`,
          top: `${10 + i * 11}%`,
        }}
        animate={{
          x: ['-2vw', '102vw'],
          opacity: [0, 1, 1, 0],
        }}
        transition={{
          duration: 6 + i * 1.5,
          repeat: Infinity,
          delay: i * 1.2,
          ease: 'linear',
        }}
      />
    ))}
  </div>
);

// ─── PROFILE TILE ──────────────────────────────────────────────────────────────
const ProfileTile: React.FC<{ name: string; xp: number; level: number }> = ({ name, xp, level }) => (
  <motion.div
    initial={{ opacity: 0, y: -16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 1.2, duration: 0.6 }}
    className="fixed top-6 right-8 z-50 flex items-center gap-3 px-4 py-2.5 rounded-xl"
    style={{
      background: 'rgba(6,9,15,0.88)',
      border: '1px solid rgba(34,211,238,0.18)',
      backdropFilter: 'blur(16px)',
      boxShadow:
        '0 0 0 1px rgba(34,211,238,0.06), 0 16px 40px rgba(0,0,0,0.6), inset 0 1px 1px rgba(255,255,255,0.04)',
    }}
  >
    {/* Avatar */}
    <div
      className="w-10 h-10 rounded-lg flex items-center justify-center text-base font-black"
      style={{
        background: 'linear-gradient(135deg, #0e7490, #6d28d9)',
        color: '#e2e8f0',
        boxShadow: '0 0 12px rgba(34,211,238,0.3)',
        fontFamily: 'monospace',
      }}
    >
      {name.charAt(0).toUpperCase()}
    </div>

    <div>
      <div className="text-[11px] font-black tracking-[0.18em] uppercase text-white leading-none">
        {name}
      </div>
      <div className="flex items-center gap-1.5 mt-1.5">
        <motion.div
          className="w-1.5 h-1.5 rounded-full"
          style={{ background: '#f59e0b', boxShadow: '0 0 6px #f59e0b' }}
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        <span className="text-[8px] font-bold tracking-[0.15em] uppercase" style={{ color: '#f59e0b' }}>
          Hierarchical Grind
        </span>
      </div>
    </div>

    {/* Mini stat bar */}
    <div className="ml-2 pl-3 border-l border-white/10 text-[9px] font-mono text-slate-400 leading-relaxed">
      <div><span className="text-cyan-400">XP  </span>{xp.toLocaleString()}</div>
      <div><span className="text-amber-400">LVL </span>{level}</div>
    </div>
  </motion.div>
);

// ─── MAIN ──────────────────────────────────────────────────────────────────────
export const WorkstationHome: React.FC = () => {
  const navigate = useNavigate();
  const { firstName, checkStreak } = useGamificationStore();
  const [cmdOpen, setCmdOpen] = useState(false);
  const [tourOpen, setTourOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => { checkStreak(); }, [checkStreak]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setCmdOpen(p => !p); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const name = firstName ?? 'Madhur';
  const { xp, level } = useGamificationStore();

  return (
    <div className="h-screen flex overflow-hidden font-sans" style={{ backgroundColor: '#06090f', color: '#cbd5e1' }}>
      {/* PCB substrate background with moving data packets */}
      <PCBBackground />

      {/* Left radial nav */}
      <RadialMenu />

      {/* Madhur profile tile */}
      <ProfileTile name={name} xp={xp.total} level={level} />

      {/* Main scrollable canvas */}
      <main
        ref={scrollRef}
        className="flex-1 pl-[76px] overflow-y-auto overflow-x-hidden relative z-10"
        style={{ scrollbarWidth: 'thin', scrollbarColor: '#22d3ee20 transparent' }}
      >
        <div className="min-h-screen flex flex-col items-center">

          {/* ── Section header ── */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col items-center mt-20 mb-8"
          >
            <div
              className="text-[9px] font-black tracking-[0.5em] uppercase mb-3 flex items-center gap-3"
              style={{ color: '#22d3ee60' }}
            >
              <span style={{ display: 'inline-block', width: 40, height: 1, background: 'linear-gradient(to right, transparent, #22d3ee)' }} />
              DATA LOGIC TREE
              <span style={{ display: 'inline-block', width: 40, height: 1, background: 'linear-gradient(to left, transparent, #22d3ee)' }} />
            </div>
            <h1
              className="text-4xl font-black tracking-tight text-white text-center"
              style={{ textShadow: '0 0 40px rgba(34,211,238,0.15)', letterSpacing: '-0.5px' }}
            >
              Hierarchical Grind
            </h1>
            <div className="text-[10px] font-mono text-slate-500 mt-2 tracking-[0.2em]">
              SKILL NODE MAP · PCB SUBSTRATE v2.4
            </div>
          </motion.div>

          {/* ── Fluency LED grid ── */}
          <FluencyLEDGrid fluency={62} />

          {/* ── Multi-bus data bar ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col items-center gap-1.5 mb-8"
            style={{ width: 860 }}
          >
            <div className="text-[7px] font-black tracking-[0.4em] uppercase" style={{ color: '#fbbf2450' }}>
              ◈ DIGITAL LOGIC PATHWAYS ◈
            </div>
            <div className="flex gap-0.5 w-full" style={{ height: 5 }}>
              {['#22d3ee', '#a78bfa', '#fbbf24', '#34d399', '#fb7185', '#c4b5fd'].map((c, i) => (
                <motion.div
                  key={i}
                  className="flex-1 rounded-full"
                  style={{ backgroundColor: c, boxShadow: `0 0 4px ${c}80` }}
                  animate={{ opacity: [0.4, 0.85, 0.4] }}
                  transition={{ duration: 2.2, repeat: Infinity, delay: i * 0.28 }}
                />
              ))}
            </div>
          </motion.div>

          {/* ── Main platform with tree + console ── */}
          <div
            className="relative w-full flex gap-8 justify-center items-start px-6"
            style={{ maxWidth: 1100 }}
          >
            {/* Diagnostic console — left */}
            <div className="flex-shrink-0 pt-8">
              <DiagnosticConsole onCommandPaletteOpen={() => setCmdOpen(true)} />
            </div>

            {/* Holographic skill tree — center/right */}
            <div
              className="flex-1 relative rounded-3xl py-10 px-6"
              style={{
                background: 'linear-gradient(160deg, rgba(14,20,36,0.92) 0%, rgba(6,9,15,0.97) 100%)',
                border: '1px solid rgba(34,211,238,0.1)',
                boxShadow: [
                  '0 40px 100px rgba(0,0,0,0.85)',
                  '0 0 0 1px rgba(34,211,238,0.05)',
                  'inset 0 1px 1px rgba(255,255,255,0.03)',
                ].join(', '),
              }}
            >
              {/* Corner LED indicators */}
              {[
                ['top-3 left-3',     '#22d3ee'],
                ['top-3 right-3',    '#a78bfa'],
                ['bottom-3 left-3',  '#34d399'],
                ['bottom-3 right-3', '#fbbf24'],
              ].map(([pos, color], i) => (
                <motion.div
                  key={i}
                  className={`absolute ${pos} w-2 h-2 rounded-full`}
                  style={{ background: color, boxShadow: `0 0 8px ${color}` }}
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.4 }}
                />
              ))}

              {/* PCB grid overlay */}
              <div
                className="absolute inset-0 rounded-3xl pointer-events-none opacity-20"
                style={{
                  backgroundImage: `
                    linear-gradient(rgba(34,211,238,0.07) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(34,211,238,0.07) 1px, transparent 1px)
                  `,
                  backgroundSize: '24px 24px',
                }}
              />

              <HierarchicalGrindTree />
            </div>
          </div>

          {/* ── Bottom legend ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6 }}
            className="flex items-center gap-10 mt-12 mb-16 text-[9px] font-bold tracking-[0.25em] uppercase"
            style={{ color: '#334155' }}
          >
            {[
              { color: '#22d3ee', label: 'Completed' },
              { color: '#fbbf24', label: 'In Progress', pulse: true },
              { color: '#334155', label: 'Locked' },
            ].map(({ color, label, pulse }) => (
              <div key={label} className="flex items-center gap-2">
                <motion.div
                  className="w-5 h-[2px] rounded-full"
                  style={{ background: color, boxShadow: `0 0 6px ${color}` }}
                  animate={pulse ? { opacity: [1, 0.3, 1] } : {}}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                <span style={{ color }}>{label}</span>
              </div>
            ))}
          </motion.div>

        </div>
      </main>

      <CommandPalette isOpen={cmdOpen} onClose={() => setCmdOpen(false)} navigate={navigate} tourKey={getTourKey(firstName)} />
      <OnboardingTour isOpen={tourOpen} onClose={() => setTourOpen(false)} storageKey={getTourKey(firstName)} />
    </div>
  );
};
