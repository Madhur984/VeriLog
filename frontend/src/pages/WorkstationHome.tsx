import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useGamificationStore } from '../stores/gamificationStore';
import { CommandPalette } from '../components/ui/CommandPalette';
import { OnboardingTour } from '../components/ui/OnboardingTour';
import { RadialMenu } from '../components/ui/RadialMenu';
import { Globe } from 'lucide-react';
import { KineticText } from '../components/ui/KineticText';
import { useColorScheme } from '../hooks/useColorScheme';
import { ThemeToggle } from '../components/ThemeToggle';

import { DiagnosticConsole } from '../components/ui/DiagnosticConsole';
import { HierarchicalGrindTree } from '../components/ui/HierarchicalGrindTree';

const getTourKey = (n: string | null) => `digi_tour_done_${n ?? 'guest'}`;

// ─── PCB ISOMETRIC BACKGROUND ──────────────────────────────────────────────────
// ─── PCB ISOMETRIC BACKGROUND ──────────────────────────────────────────────────
const PCBBackground: React.FC<{ isLight: boolean }> = ({ isLight }) => {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  
  return (
    <div 
      className="absolute inset-0 overflow-hidden pointer-events-none"
      onMouseMove={(e) => setMouse({ x: e.clientX, y: e.clientY })}
    >
      {/* Base darkfield */}
      <div
        className="absolute inset-0"
        style={{ 
          background: isLight 
            ? 'radial-gradient(ellipse 120% 100% at 50% 0%, #e2e8f0 0%, #EFF3F6 80%)' 
            : 'radial-gradient(ellipse 120% 100% at 50% 0%, #0d1526 0%, #06090f 80%)' 
        }}
      />

      {/* Kinetic Glow Follower */}
      <div 
        className="absolute w-[600px] h-[600px] rounded-full pointer-events-none opacity-20"
        style={{
          background: isLight
            ? 'radial-gradient(circle, rgba(2, 132, 199, 0.15) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)',
          left: mouse.x - 300,
          top: mouse.y - 300,
          filter: 'blur(40px)',
          transition: 'left 0.1s ease-out, top 0.1s ease-out',
        }}
      />

      {/* Fine grid */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: isLight ? `
            linear-gradient(rgba(15, 23, 42, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(15, 23, 42, 0.03) 1px, transparent 1px),
            linear-gradient(rgba(15, 23, 42, 0.01) 1px, transparent 1px),
            linear-gradient(90deg, rgba(15, 23, 42, 0.01) 1px, transparent 1px)
          ` : `
            linear-gradient(rgba(59, 130, 246, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.05) 1px, transparent 1px),
            linear-gradient(rgba(59, 130, 246, 0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.02) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px, 80px 80px, 16px 16px, 16px 16px',
        }}
      />

      {/* Gold circuit trace decoration */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.07]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="gold-trace" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">
            {/* Gold horizontal traces */}
            <path d="M0,100 L60,100 L60,60 L100,60 L100,0" stroke={isLight ? "#0369A1" : "#3b82f6"} strokeWidth="1.5" fill="none" opacity="0.3" />
            <path d="M200,100 L140,100 L140,140 L100,140 L100,200" stroke={isLight ? "#0369A1" : "#3b82f6"} strokeWidth="1.5" fill="none" opacity="0.3" />
            {/* Indigo/Orange traces */}
            <path d="M0,50 L30,50 L30,100 L80,100" stroke={isLight ? "#ea580c" : "#00D4FF"} strokeWidth="1" fill="none" opacity="0.2" />
            <path d="M200,150 L170,150 L170,100 L120,100" stroke={isLight ? "#ea580c" : "#fb923c"} strokeWidth="1" fill="none" opacity="0.2" />
            {/* Solder pads */}
            <circle cx="60" cy="100" r="4" fill="none" stroke={isLight ? "#0369A1" : "#3b82f6"} strokeWidth="1.5" />
            <circle cx="140" cy="100" r="4" fill="none" stroke={isLight ? "#0369A1" : "#3b82f6"} strokeWidth="1.5" />
            <rect x="96" y="56" width="8" height="8" fill="none" stroke={isLight ? "#ea580c" : "#00D4FF"} strokeWidth="1" />
            <rect x="96" y="136" width="8" height="8" fill="none" stroke={isLight ? "#ea580c" : "#fb923c"} strokeWidth="1" />
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
            background: isLight 
              ? ['#0369A1', '#ea580c', '#16a34a', '#d97706', '#db2777', '#0284c7', '#059669', '#0891b2'][i]
              : ['#22d3ee', '#fb923c', '#34d399', '#fbbf24', '#fb7185', '#60a5fa', '#4ade80', '#f472b6'][i],
            boxShadow: `0 0 6px ${
              isLight
                ? ['#0369A1', '#ea580c', '#16a34a', '#d97706', '#db2777', '#0284c7', '#059669', '#0891b2'][i]
                : ['#22d3ee', '#fb923c', '#34d399', '#fbbf24', '#fb7185', '#60a5fa', '#4ade80', '#f472b6'][i]
            }`,
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
};

// ─── PROFILE TILE ──────────────────────────────────────────────────────────────
// ─── PROFILE CARD ──────────────────────────────────────────────────────────────
const ProfileCard: React.FC<{
  name: string;
  xp: { total: number };
  level: number;
  streak: number;
  gems: number;
  hearts: number;
  badgesCount: number;
  completedCount: number;
  isLight: boolean;
}> = ({ name, xp, level, streak, gems, hearts, badgesCount, completedCount, isLight }) => {
  // Calculate progress to next level
  const currentLevelXP = Math.pow(level - 1, 2) * 100;
  const nextLevelXP = Math.pow(level, 2) * 100;
  const progress = ((xp.total - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;

  return (
    <motion.div
      data-tour="portal-profile"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1.2, duration: 0.6 }}
      className="fixed top-8 right-8 z-50 p-4 rounded-2xl w-60 transition-all duration-300"
      style={{
        background: isLight ? 'rgba(255, 255, 255, 0.95)' : 'rgba(5, 8, 12, 0.95)',
        border: isLight ? '1px solid rgba(15, 23, 42, 0.08)' : '1px solid rgba(59, 130, 246, 0.2)',
        backdropFilter: 'blur(20px)',
        boxShadow: isLight
          ? '0 20px 50px rgba(15,23,42,0.05), 0 0 0 1px rgba(15,23,42,0.01)'
          : [
              '0 20px 50px rgba(0,0,0,0.8)',
              '0 0 0 1px rgba(59, 130, 246, 0.05)',
              'inset 0 1px 1px rgba(255,255,255,0.02)',
            ].join(', '),
      }}
    >
      {/* Profile Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-xl font-black relative overflow-hidden group"
            style={{
              background: isLight 
                ? 'linear-gradient(135deg, #0284c7, #0369a1)' 
                : 'linear-gradient(135deg, #3b82f6, #2563eb)',
              color: '#000',
              boxShadow: isLight ? '0 0 15px rgba(2, 132, 199, 0.15)' : '0 0 15px rgba(59, 130, 246, 0.3)',
              fontFamily: 'monospace',
            }}
          >
            <span className={isLight ? 'text-white' : 'text-black'}>{name.charAt(0).toUpperCase()}</span>
            {/* Holographic sweep */}
            <motion.div
              className="absolute inset-0 bg-white/20 w-1/2 -skew-x-12 blur-sm"
              animate={{ x: [-100, 200] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            />
          </div>
          <div>
            <div className={`text-[14px] font-black tracking-widest uppercase leading-tight ${isLight ? 'text-slate-800' : 'text-white'}`}>
              <KineticText text={name} />
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${isLight ? 'bg-sky-500 shadow-[0_0_6px_#0284c7]' : 'bg-blue-500 shadow-[0_0_6px_#3b82f6]'}`} />
              <span className={`text-[9px] font-bold tracking-widest uppercase ${isLight ? 'text-sky-600/90' : 'text-blue-500/80'}`}>
                Tactical Session
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <div className={`text-[10px] font-mono font-bold leading-none ${isLight ? 'text-slate-800' : 'text-white'}`}>
            <span className={isLight ? 'text-sky-600' : 'text-cyan-400'}>LVL </span>{level}
          </div>
          <div className="text-[8px] font-mono text-slate-500 mt-1 uppercase">
            {xp.total.toLocaleString()} total sip
          </div>
        </div>
      </div>

      {/* Progress to next Level */}
      <div className="mb-5">
        <div className="flex justify-between items-center mb-1.5 px-0.5">
          <span className={`text-[9px] font-black uppercase tracking-[0.2em] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Progression</span>
          <span className={`text-[9px] font-mono font-bold ${isLight ? 'text-sky-600' : 'text-cyan-400'}`}>{Math.round(progress)}%</span>
        </div>
        <div className={`h-1.5 w-full rounded-full overflow-hidden p-[1px] ${isLight ? 'bg-slate-200 border border-slate-300/30' : 'bg-black/60 border border-white/5'}`}>
          <motion.div
            className="h-full rounded-full"
            style={{ 
              background: isLight 
                ? 'linear-gradient(90deg, #0284c7, #38bdf8)' 
                : 'linear-gradient(90deg, #3b82f6, #60a5fa)' 
            }}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ delay: 1.8, duration: 1.2 }}
          />
        </div>
      </div>

      {/* Core Stats Grid */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        {[
          { label: 'Streak', value: streak, unit: 'DAYS', color: '#f59e0b', icon: '🔥' },
          { label: 'Hearts', value: hearts, unit: 'LIFE', color: '#ef4444', icon: '❤️' },
          { label: 'Gems', value: gems, unit: 'SIP', color: '#10b981', icon: '💎' },
          { label: 'Badges', value: badgesCount, unit: 'EARNED', color: '#ec4899', icon: '👑' },
        ].map((stat) => (
          <div
            key={stat.label}
            className={`rounded-xl px-3 py-2 flex items-center justify-between transition-colors ${
              isLight 
                ? 'bg-slate-100/80 border border-slate-200/50' 
                : 'bg-white/[0.03] border border-white/[0.05]'
            }`}
          >
            <div>
              <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">
                {stat.label}
              </div>
              <div className={`text-[11px] font-mono font-black leading-none ${isLight ? 'text-slate-800' : 'text-white'}`}>
                {stat.value} <span className="text-[8px] font-normal text-slate-500 ml-0.5">{stat.unit}</span>
              </div>
            </div>
            <div className="text-xs opacity-80">{stat.icon}</div>
          </div>
        ))}
      </div>

      {/* Secondary readout */}
      <div className={`flex items-center justify-between pt-3 border-t ${isLight ? 'border-slate-200' : 'border-white/5'}`}>
        <div className="flex gap-4">
          <div className="flex flex-col">
            <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-0.5">Missions</span>
            <span className={`text-[10px] font-mono font-bold ${isLight ? 'text-slate-800' : 'text-white'}`}>{completedCount} Completed</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-0.5">Rank</span>
            <span className="text-[10px] font-mono text-amber-400 font-bold">Technician</span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <ThemeToggle variant="minimal" />
          <motion.button
            whileHover={{ scale: 1.05, background: isLight ? 'rgba(2, 132, 199, 0.08)' : 'rgba(59, 130, 246, 0.1)' }}
            whileTap={{ scale: 0.95 }}
            className={`px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-widest border transition-colors ${
              isLight 
                ? 'border-sky-500/20 text-sky-600' 
                : 'border-blue-500/20 text-blue-500'
            }`}
          >
            Analysis
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

// ─── MAIN ──────────────────────────────────────────────────────────────────────
export const WorkstationHome: React.FC = () => {
  const navigate = useNavigate();
  const [scheme] = useColorScheme();
  const isLight = scheme === 'light';
  
  const {
    firstName,
    checkStreak,
    xp,
    level,
    streak,
    gems,
    hearts,
    badges,
    skills
  } = useGamificationStore();
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

  const name = firstName ?? 'Kriten';

  return (
    <div 
      className="min-h-[100svh] lg:h-screen flex overflow-x-hidden overflow-y-auto lg:overflow-hidden font-sans transition-colors duration-300" 
      style={{ 
        backgroundColor: isLight ? 'var(--bg-void)' : '#06090f', 
        color: isLight ? 'var(--text-main)' : '#cbd5e1' 
      }}
    >
      {/* PCB substrate background with moving data packets */}
      <PCBBackground isLight={isLight} />

      {/* Left radial nav - desktop only (the 360px dial is too large for phones) */}
      <div className="hidden lg:block">
        <RadialMenu />
      </div>

      {/* Profile card - top right, desktop only */}
      <div className="hidden lg:block">
        <ProfileCard
          name={name}
          xp={xp}
          level={level}
          streak={streak.current}
          gems={gems}
          hearts={hearts}
          badgesCount={badges.length}
          completedCount={skills.completedIds.length}
          isLight={isLight}
        />
      </div>

      {/* Main scrollable canvas */}
      <main
        ref={scrollRef}
        className="flex-1 min-w-0 max-w-full px-3 lg:pl-[76px] lg:pr-[280px] min-h-[100svh] lg:h-screen flex flex-col relative z-10 overflow-x-hidden overflow-y-visible lg:overflow-hidden"
        style={{ color: isLight ? 'var(--text-main)' : '#cbd5e1' }}
      >
        <div className="flex-1 w-full flex flex-col items-start overflow-visible lg:overflow-hidden">
          {/* ─ Top spacing ─ */}
          <div className="flex-shrink-0 h-4 lg:h-6" />

          {/* ─ Main platform with tree + console ─ */}
          <div
            className="flex-1 w-full flex flex-col lg:flex-row gap-6 lg:gap-20 justify-start items-stretch px-0 lg:px-6 overflow-visible lg:overflow-hidden pb-8 lg:pb-0"
            style={{ maxWidth: 1400 }}
          >
            {/* Diagnostic console - desktop only (decorative telemetry; phone shows the tree full-screen) */}
            <div className="hidden lg:flex w-auto flex-shrink-0 flex-col gap-6" style={{ marginLeft: 0 }}>
              <DiagnosticConsole onCommandPaletteOpen={() => setCmdOpen(true)} />
            </div>

            {/* Holographic skill tree - center/right */}
            <div
              data-tour="portal-tree"
              className="w-full flex-1 min-h-[68vh] lg:min-h-0 lg:h-full relative rounded-3xl flex flex-col overflow-hidden transition-all duration-300"
              style={{
                background: isLight 
                  ? 'linear-gradient(160deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 1) 100%)' 
                  : 'linear-gradient(160deg, rgba(5, 8, 12, 0.95) 0%, rgba(3, 5, 8, 1) 100%)',
                border: isLight ? '1px solid rgba(15, 23, 42, 0.08)' : '1px solid rgba(59, 130, 246, 0.1)',
                boxShadow: isLight
                  ? '0 40px 100px rgba(15, 23, 42, 0.05), 0 0 0 1px rgba(15, 23, 42, 0.01)'
                  : [
                      '0 40px 100px rgba(0,0,0,0.95)',
                      '0 0 0 1px rgba(59, 130, 246, 0.05)',
                      'inset 0 1px 1px rgba(255,255,255,0.02)',
                    ].join(', '),
              }}
            >
              <div className="w-full h-full overflow-hidden px-2 pt-3 sm:px-4 lg:px-10 lg:pt-10">
                {/* Corner LED indicators */}
                {[
                  ['top-3 left-3', '#22d3ee'],
                  ['top-3 right-3', '#f97316'],
                  ['bottom-3 left-3', '#34d399'],
                  ['bottom-3 right-3', '#fbbf24'],
                ].map(([pos, color], i) => (
                  <motion.div
                    key={i}
                    className={`absolute ${pos} w-2 h-2 rounded-full z-20`}
                    style={{ background: color, boxShadow: `0 0 10px ${color}` }}
                    animate={{ opacity: [1, 0.2, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.4 }}
                  />
                ))}

                {/* PCB grid overlay */}
                <div
                  className="absolute inset-0 rounded-3xl pointer-events-none opacity-20"
                  style={{
                    backgroundImage: isLight ? `
                      linear-gradient(rgba(15, 23, 42, 0.03) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(15, 23, 42, 0.03) 1px, transparent 1px)
                    ` : `
                      linear-gradient(rgba(59, 130, 246, 0.07) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(59, 130, 246, 0.07) 1px, transparent 1px)
                    `,
                    backgroundSize: '24px 24px',
                  }}
                />

                <HierarchicalGrindTree />
              </div>
            </div>
          </div>

        </div>
      </main>

      <CommandPalette isOpen={cmdOpen} onClose={() => setCmdOpen(false)} navigate={navigate} tourKey={getTourKey(firstName)} />
      <OnboardingTour isOpen={tourOpen} onClose={() => setTourOpen(false)} storageKey={getTourKey(firstName)} />

      {/* ── BOTTOM MASTER SCOPE ── */}
      {/* Oscilloscope Removed */}
    </div>
  );
};
