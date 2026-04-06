import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useGamificationStore } from '../stores/gamificationStore';
import { CommandPalette } from '../components/ui/CommandPalette';
import { OnboardingTour } from '../components/ui/OnboardingTour';
import { RadialMenu } from '../components/ui/RadialMenu';

const getTourKey = (n: string | null) => `digi_tour_done_${n ?? 'guest'}`;

// ─── GEM NODE DATA ─────────────────────────────────────────────────────────────
interface GemNode {
  id: string; label: string; pct: number; icon: string;
  color: [string, string]; glow: string; route?: string; status: 'done'|'active'|'locked';
}

const GEMS: GemNode[] = [
  { id:'g1', label:'Signals',      pct:0,  icon:'〜', color:['#0e7490','#22d3ee'], glow:'#22d3ee', route:'/module/1', status:'done'   },
  { id:'g2', label:'Discrete',     pct:0,  icon:'⊞', color:['#6d28d9','#a78bfa'], glow:'#a78bfa', route:'/module/2', status:'done'   },
  { id:'g3', label:'Binary',       pct:0,  icon:'⊕', color:['#065f46','#34d399'], glow:'#34d399', route:'/module/3', status:'active' },
  { id:'g4', label:'Gates',        pct:0,  icon:'⊃', color:['#92400e','#fbbf24'], glow:'#fbbf24', route:'/module/4', status:'locked' },
  { id:'g5', label:'K-Maps',       pct:0,  icon:'▦', color:['#9f1239','#fb7185'], glow:'#fb7185', route:'/kmap',     status:'locked' },
  { id:'g6', label:'Verilog Basics',pct:0, icon:'≡', color:['#4c1d95','#c4b5fd'], glow:'#c4b5fd', route:'/verilog',  status:'locked' },
];

// ─── PCB ISOMETRIC BACKGROUND ──────────────────────────────────────────────────
const PCBBackground: React.FC = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {/* Base darkfield */}
    <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 120% 100% at 50% 0%, #0d1526 0%, #06090f 80%)' }} />
    {/* Fine grid */}
    <div className="absolute inset-0" style={{
      backgroundImage: `
        linear-gradient(rgba(34,211,238,0.05) 1px, transparent 1px),
        linear-gradient(90deg, rgba(34,211,238,0.05) 1px, transparent 1px),
        linear-gradient(rgba(34,211,238,0.02) 1px, transparent 1px),
        linear-gradient(90deg, rgba(34,211,238,0.02) 1px, transparent 1px)
      `,
      backgroundSize: '80px 80px, 80px 80px, 16px 16px, 16px 16px',
    }} />
    {/* PCB trace hatching - corner decoration */}
    <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="pcb-trace" x="0" y="0" width="160" height="160" patternUnits="userSpaceOnUse">
          <path d="M0,80 L40,80 L40,40 L80,40 L80,0" stroke="#22d3ee" strokeWidth="1.5" fill="none" />
          <path d="M160,80 L120,80 L120,120 L80,120 L80,160" stroke="#a78bfa" strokeWidth="1.5" fill="none" />
          <circle cx="40" cy="80" r="3" fill="#22d3ee" />
          <circle cx="120" cy="80" r="3" fill="#a78bfa" />
          <rect x="76" y="36" width="8" height="8" fill="none" stroke="#fbbf24" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#pcb-trace)" />
    </svg>
  </div>
);

// ─── MULTI-TRACE DATA BUS ──────────────────────────────────────────────────────
const DataBus: React.FC = () => (
  <div className="relative w-full flex flex-col items-center gap-2" style={{ marginBottom: 24 }}>
    <div className="text-[8px] font-black tracking-[0.4em] uppercase" style={{ color: '#fbbf2455' }}>
      ◈ DIGITAL LOGIC PATHWAYS ◈
    </div>
    <div className="flex gap-0.5" style={{ width: 900, height: 6 }}>
      {['#22d3ee','#a78bfa','#fbbf24','#34d399','#fb7185','#c4b5fd'].map((c, i) => (
        <motion.div
          key={i}
          className="flex-1 rounded-full"
          style={{ backgroundColor: c, boxShadow: `0 0 5px ${c}80` }}
          animate={{ opacity: [0.45, 0.9, 0.45] }}
          transition={{ duration: 2.2, repeat: Infinity, delay: i * 0.28 }}
        />
      ))}
    </div>
  </div>
);

// ─── GEM COMPONENT ────────────────────────────────────────────────────────────
const Gem: React.FC<{ gem: GemNode; onClick?: () => void }> = ({ gem, onClick }) => {
  const [hov, setHov] = useState(false);
  const [c0, c1] = gem.color;
  const isLocked = gem.status === 'locked';
  const isActive = gem.status === 'active';

  return (
    <motion.div
      className="relative flex flex-col items-center cursor-pointer select-none"
      style={{ width: 130 }}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: GEMS.indexOf(gem) * 0.12, duration: 0.6, type: 'spring' }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={!isLocked ? onClick : undefined}
    >
      {/* Category badge */}
      <div
        className="text-[7px] font-black tracking-[0.3em] uppercase mb-2 px-2 py-0.5 rounded-sm border"
        style={{ 
          color: isLocked ? '#334155' : gem.glow, 
          borderColor: isLocked ? '#1e293b' : `${gem.glow}40`,
          background: isLocked ? 'transparent' : `${c0}30`
        }}
      >
        {gem.label}
      </div>

      {/* Gem shape — SVG faceted crystal */}
      <motion.div
        animate={isActive ? { y: [0, -4, 0] } : {}}
        transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
      >
        <svg width={78} height={88} viewBox="0 0 78 88" style={{ overflow: 'visible' }}>
          <defs>
            <radialGradient id={`gem-${gem.id}`} cx="40%" cy="30%">
              <stop offset="0%"   stopColor={isLocked ? '#1e293b' : c1} stopOpacity={0.9} />
              <stop offset="60%"  stopColor={isLocked ? '#0f172a' : c0} stopOpacity={0.8} />
              <stop offset="100%" stopColor={isLocked ? '#080c15' : c0} stopOpacity={1}   />
            </radialGradient>
            <filter id={`glow-${gem.id}`}>
              <feGaussianBlur stdDeviation={hov ? 8 : 5} result="blur" />
              <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>

          {/* Outer glow halo */}
          {!isLocked && (
            <ellipse cx="39" cy="75" rx="28" ry="8" fill={gem.glow} opacity={hov ? 0.25 : 0.1}>
              <animate attributeName="opacity" values={`0.1;${hov?0.3:0.18};0.1`} dur="2s" repeatCount="indefinite" />
            </ellipse>
          )}

          {/* Main gem polygon – multi-facet */}
          <g filter={`url(#glow-${gem.id})`}>
            {/* Top face */}
            <polygon
              points="39,4 66,22 66,58 39,74 12,58 12,22"
              fill={`url(#gem-${gem.id})`}
              stroke={isLocked ? '#1e293b' : c1}
              strokeWidth={isActive ? 2 : 1.5}
              opacity={isLocked ? 0.4 : 1}
            />
            {/* Inner facet lines */}
            {!isLocked && (
              <>
                <line x1="39" y1="4"  x2="39" y2="74" stroke={c1} strokeWidth="0.5" opacity="0.25" />
                <line x1="12" y1="22" x2="66" y2="58" stroke={c1} strokeWidth="0.5" opacity="0.2" />
                <line x1="66" y1="22" x2="12" y2="58" stroke={c1} strokeWidth="0.5" opacity="0.2" />
                {/* Shine flare */}
                <polygon points="39,8 50,20 39,18" fill={c1} opacity="0.35" />
              </>
            )}
            {/* Lock overlay */}
            {isLocked && (
              <text x="39" y="43" textAnchor="middle" fontSize="18" fill="#334155" fontFamily="monospace">🔒</text>
            )}
          </g>

          {/* LED dot top */}
          {!isLocked && (
            <circle cx="39" cy="4" r="3" fill={c1}>
              <animate attributeName="opacity" values="1;0.3;1" dur="1.8s" repeatCount="indefinite" />
            </circle>
          )}

          {/* Status icon */}
          {!isLocked && (
            <text x="39" y="48" textAnchor="middle" fontSize="20" fill={c1} fontFamily="monospace" opacity="0.9">
              {gem.icon}
            </text>
          )}

          {/* Active pulse ring */}
          {isActive && (
            <polygon
              points="39,4 66,22 66,58 39,74 12,58 12,22"
              fill="none" stroke={gem.glow} strokeWidth="2" opacity="0.6"
            >
              <animate attributeName="stroke-width" values="2;5;2" dur="2s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.6;0.1;0.6" dur="2s" repeatCount="indefinite" />
            </polygon>
          )}
        </svg>
      </motion.div>

      {/* Percentage display */}
      <div
        className="mt-1 text-[11px] font-black font-mono tabular-nums"
        style={{ color: isLocked ? '#334155' : gem.glow }}
      >
        {gem.pct}%
      </div>

      {/* Laser-etched label */}
      <div
        className="mt-0.5 text-[8px] font-bold tracking-[0.25em] uppercase opacity-60"
        style={{ color: isLocked ? '#1e293b' : c1, fontFamily: 'monospace' }}
      >
        {gem.id.toUpperCase()}
      </div>
    </motion.div>
  );
};

// ─── CONNECTING TRACES: horizontal bus between gems ────────────────────────────
const ConnectorBus: React.FC = () => (
  <div className="absolute top-[88px] left-0 right-0 flex items-center justify-center pointer-events-none" style={{ zIndex: 0 }}>
    <div style={{ width: '840px', position: 'relative', height: '16px' }}>
      {/* Triple trace bus */}
      {[-4, 0, 4].map((offset, i) => (
        <motion.div
          key={i}
          className="absolute left-0 right-0 rounded-full"
          style={{
            top: `calc(50% + ${offset}px)`,
            height: 1.5,
            background: ['#22d3ee', '#a78bfa', '#fbbf24'][i],
            boxShadow: `0 0 6px ${['#22d3ee', '#a78bfa', '#fbbf24'][i]}`,
            opacity: 0.6,
          }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.8 + i * 0.1, duration: 1.2, ease: 'easeOut' }}
        />
      ))}
      {/* SMD components along the bus */}
      {[0.2, 0.4, 0.6, 0.8].map((pos, i) => (
        <div
          key={i}
          className="absolute top-1/2 -translate-y-1/2"
          style={{ left: `${pos * 100}%`, transform: 'translate(-50%, -50%)' }}
        >
          <div
            className="w-3 h-2 rounded-sm border"
            style={{ borderColor: '#22d3ee40', background: '#0f172a', boxShadow: '0 0 4px #22d3ee30' }}
          />
        </div>
      ))}
    </div>
  </div>
);

// ─── PROFILE TILE ──────────────────────────────────────────────────────────────
const ProfileTile: React.FC<{ name: string }> = ({ name }) => (
  <motion.div
    initial={{ opacity: 0, y: -16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 1.2, duration: 0.6 }}
    className="fixed top-6 right-8 z-50 flex items-center gap-3 px-4 py-2.5 rounded-xl"
    style={{
      background: 'rgba(6,9,15,0.85)',
      border: '1px solid rgba(34,211,238,0.18)',
      backdropFilter: 'blur(16px)',
      boxShadow: '0 0 0 1px rgba(34,211,238,0.06), 0 16px 40px rgba(0,0,0,0.6), inset 0 1px 1px rgba(255,255,255,0.04)',
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
        <div className="w-1.5 h-1.5 rounded-full bg-amber-400" style={{ boxShadow: '0 0 6px #f59e0b' }}>
          <animate attributeName="opacity" values="1;0.3;1" dur="1.5s" repeatCount="indefinite" />
        </div>
        <span className="text-[8px] font-bold tracking-[0.15em] uppercase" style={{ color: '#f59e0b' }}>
          Hierarchical Grind
        </span>
      </div>
    </div>
    {/* Stat mini-bar */}
    <div className="ml-2 pl-3 border-l border-white/10 text-[9px] font-mono text-slate-400 leading-relaxed">
      <div><span className="text-cyan-400">XP </span>0</div>
      <div><span className="text-amber-400">LVL</span> 1</div>
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

  return (
    <div className="h-screen flex overflow-hidden font-sans" style={{ backgroundColor: '#06090f', color: '#cbd5e1' }}>
      {/* PCB substrate background */}
      <PCBBackground />

      {/* Left radial nav */}
      <RadialMenu />

      {/* Profile tile */}
      <ProfileTile name={name} />

      {/* Main canvas */}
      <main
        ref={scrollRef}
        className="flex-1 pl-[76px] overflow-y-auto overflow-x-hidden relative z-10"
        style={{ scrollbarWidth: 'thin', scrollbarColor: '#22d3ee20 transparent' }}
      >
        <div className="min-h-screen flex flex-col items-center justify-center">

          {/* ── Section header ── */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col items-center mb-14 mt-24"
          >
            <div
              className="text-[9px] font-black tracking-[0.5em] uppercase mb-3 flex items-center gap-3"
              style={{ color: '#22d3ee60' }}
            >
              <span style={{ display: 'inline-block', width: 40, height: 1, background: 'linear-gradient(to right, transparent, #22d3ee)' }} />
              HIERARCHICAL GRIND
              <span style={{ display: 'inline-block', width: 40, height: 1, background: 'linear-gradient(to left, transparent, #22d3ee)' }} />
            </div>
            <h1
              className="text-4xl font-black tracking-tight text-white text-center"
              style={{ textShadow: '0 0 40px rgba(34,211,238,0.15)', letterSpacing: '-0.5px' }}
            >
              Skill Node Map
            </h1>
          </motion.div>

          {/* ── Main isometric platform ── */}
          <div
            className="relative"
            style={{
              perspective: '1200px',
              perspectiveOrigin: '50% 30%',
            }}
          >
            <motion.div
              initial={{ opacity: 0, rotateX: 70 }}
              animate={{ opacity: 1, rotateX: 50 }}
              transition={{ delay: 0.5, duration: 1.0, ease: 'easeOut' }}
              style={{
                transform: 'rotateX(50deg) rotateZ(-8deg)',
                transformStyle: 'preserve-3d',
              }}
            >
              {/* Platform base */}
              <div
                className="relative px-16 py-12 rounded-3xl"
                style={{
                  background: 'linear-gradient(160deg, rgba(14,20,36,0.95) 0%, rgba(6,9,15,0.98) 100%)',
                  border: '1px solid rgba(34,211,238,0.12)',
                  boxShadow: '0 40px 120px rgba(0,0,0,0.9), 0 0 0 1px rgba(34,211,238,0.06), inset 0 1px 1px rgba(255,255,255,0.04)',
                  backdropFilter: 'blur(10px)',
                }}
              >
                {/* Corner LED indicators */}
                {[['top-3 left-3', '#22d3ee'], ['top-3 right-3', '#a78bfa'], ['bottom-3 left-3', '#34d399'], ['bottom-3 right-3', '#fbbf24']].map(([pos, color], i) => (
                  <div key={i} className={`absolute ${pos} w-2 h-2 rounded-full`} style={{ background: color, boxShadow: `0 0 8px ${color}` }}>
                  </div>
                ))}

                {/* Data bus label + bus traces */}
                <DataBus />

                {/* Connecting bus line between gems */}
                <ConnectorBus />

                {/* ── GEM GRID ── */}
                <div className="flex items-end justify-center gap-6 mt-6 relative z-10">
                  {GEMS.map(gem => (
                    <Gem
                      key={gem.id}
                      gem={gem}
                      onClick={gem.route ? () => navigate(gem.route!) : undefined}
                    />
                  ))}
                </div>

                {/* Platform floor grid */}
                <div
                  className="absolute inset-0 rounded-3xl pointer-events-none opacity-30"
                  style={{
                    backgroundImage: `
                      linear-gradient(rgba(34,211,238,0.08) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(34,211,238,0.08) 1px, transparent 1px)
                    `,
                    backgroundSize: '24px 24px',
                  }}
                />
              </div>
            </motion.div>
          </div>

          {/* ── Bottom legend ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4 }}
            className="flex items-center gap-10 mt-16 mb-16 text-[9px] font-bold tracking-[0.25em] uppercase"
            style={{ color: '#334155' }}
          >
            <div className="flex items-center gap-2">
              <div className="w-5 h-[2px] rounded-full" style={{ background: '#22d3ee', boxShadow: '0 0 6px #22d3ee' }} />
              <span style={{ color: '#22d3ee' }}>Completed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-[2px] rounded-full" style={{ background: '#fbbf24', boxShadow: '0 0 6px #fbbf24' }}>
                <motion.div className="w-full h-full" animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }} />
              </div>
              <span style={{ color: '#fbbf24' }}>In Progress</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-[2px] rounded-full bg-slate-700" />
              <span>Locked</span>
            </div>
          </motion.div>

        </div>
      </main>

      <CommandPalette isOpen={cmdOpen} onClose={() => setCmdOpen(false)} navigate={navigate} tourKey={getTourKey(firstName)} />
      <OnboardingTour isOpen={tourOpen} onClose={() => setTourOpen(false)} storageKey={getTourKey(firstName)} />
    </div>
  );
};
