import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useGamificationStore } from '../stores/gamificationStore';
import { CommandPalette } from '../components/ui/CommandPalette';
import { OnboardingTour } from '../components/ui/OnboardingTour';
import { RadialMenu } from '../components/ui/RadialMenu';
import { useColorScheme } from '../hooks/useColorScheme';
import { ThemeToggle } from '../components/ThemeToggle';

import { DiagnosticConsole } from '../components/ui/DiagnosticConsole';
import { HierarchicalGrindTree } from '../components/ui/HierarchicalGrindTree';
import { getSession } from '../lib/auth';
import { getModuleHistory, getLastModule } from '../lib/moduleHistory';
import { BookOpen, ArrowRight } from 'lucide-react';

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
            ? 'radial-gradient(ellipse 120% 100% at 50% 0%, #FFFFFF 0%, #F3F5F8 80%)'
            : 'radial-gradient(ellipse 120% 100% at 50% 0%, #0d1526 0%, #06090f 80%)'
        }}
      />

      {/* Kinetic Glow Follower */}
      <div 
        className="absolute w-[600px] h-[600px] rounded-full pointer-events-none opacity-20"
        style={{
          background: isLight
            ? 'radial-gradient(circle, rgba(2, 132, 199, 0.22) 0%, transparent 70%)'
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
            linear-gradient(rgba(15, 23, 42, 0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(15, 23, 42, 0.08) 1px, transparent 1px),
            linear-gradient(rgba(15, 23, 42, 0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(15, 23, 42, 0.04) 1px, transparent 1px)
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
      <svg className={`absolute inset-0 w-full h-full ${isLight ? 'opacity-[0.16]' : 'opacity-[0.07]'}`} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="gold-trace" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">
            {/* Gold horizontal traces */}
            <path d="M0,100 L60,100 L60,60 L100,60 L100,0" stroke={isLight ? "#0369A1" : "#3b82f6"} strokeWidth={isLight ? 1.75 : 1.5} fill="none" opacity={isLight ? 0.5 : 0.3} />
            <path d="M200,100 L140,100 L140,140 L100,140 L100,200" stroke={isLight ? "#0369A1" : "#3b82f6"} strokeWidth={isLight ? 1.75 : 1.5} fill="none" opacity={isLight ? 0.5 : 0.3} />
            {/* Indigo/Orange traces */}
            <path d="M0,50 L30,50 L30,100 L80,100" stroke={isLight ? "#C2410C" : "#00D4FF"} strokeWidth={isLight ? 1.5 : 1} fill="none" opacity={isLight ? 0.45 : 0.2} />
            <path d="M200,150 L170,150 L170,100 L120,100" stroke={isLight ? "#C2410C" : "#fb923c"} strokeWidth={isLight ? 1.5 : 1} fill="none" opacity={isLight ? 0.45 : 0.2} />
            {/* Solder pads */}
            <circle cx="60" cy="100" r="4" fill="none" stroke={isLight ? "#0369A1" : "#3b82f6"} strokeWidth={isLight ? 1.75 : 1.5} />
            <circle cx="140" cy="100" r="4" fill="none" stroke={isLight ? "#0369A1" : "#3b82f6"} strokeWidth={isLight ? 1.75 : 1.5} />
            <rect x="96" y="56" width="8" height="8" fill="none" stroke={isLight ? "#C2410C" : "#00D4FF"} strokeWidth={isLight ? 1.5 : 1} />
            <rect x="96" y="136" width="8" height="8" fill="none" stroke={isLight ? "#C2410C" : "#fb923c"} strokeWidth={isLight ? 1.5 : 1} />
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
              ? ['#0369A1', '#C2410C', '#047857', '#B45309', '#BE185D', '#0369A1', '#047857', '#0E7490'][i]
              : ['#22d3ee', '#fb923c', '#34d399', '#fbbf24', '#fb7185', '#60a5fa', '#4ade80', '#f472b6'][i],
            boxShadow: `0 0 6px ${
              isLight
                ? ['#0369A1', '#C2410C', '#047857', '#B45309', '#BE185D', '#0369A1', '#047857', '#0E7490'][i]
                : ['#22d3ee', '#fb923c', '#34d399', '#fbbf24', '#fb7185', '#60a5fa', '#4ade80', '#f472b6'][i]
            }`,
            top: `${10 + i * 11}%`,
          }}
          animate={{
            x: ['-2vw', '102vw'],
            opacity: isLight ? [0, 0.6, 0.6, 0] : [0, 1, 1, 0],
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
  isLight: boolean;
  onOpen: () => void;
}> = ({ name, isLight, onOpen }) => {
  // Real data only — account type + actual module activity.
  const session = getSession();
  const history = getModuleHistory();
  const last = getLastModule();
  const accountType = session.kind === 'guest' ? 'Guest learner' : 'Signed in';

  return (
    <motion.div
      data-tour="portal-profile"
      onClick={onOpen}
      whileHover={{ y: -2 }}
      title="Open your profile"
      role="button"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1.2, duration: 0.6 }}
      className="fixed top-8 right-8 z-50 w-64 space-y-3.5 rounded-2xl p-4 cursor-pointer transition-all duration-300"
      style={{
        background: isLight ? '#FFFFFF' : 'rgba(3,4,8,0.96)',
        border: isLight ? '1px solid #E2E8F0' : '1px solid rgba(59,130,246,0.18)',
        backdropFilter: 'blur(20px)',
        boxShadow: isLight ? '0 12px 30px rgba(15,23,42,0.10)' : '0 20px 50px rgba(0,0,0,0.7)',
      }}
    >
      {/* Identity — clean, no banner */}
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl text-base font-black text-white"
          style={{ background: 'linear-gradient(135deg, #2563eb, #4F46E5)' }}>
          {name.charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0">
          <div className={`truncate text-[15px] font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>{name}</div>
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span className={`text-[12px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>{accountType}</span>
          </div>
        </div>
      </div>

      {/* Modules opened */}
      <div className="flex items-center justify-between border-t pt-3" style={{ borderColor: isLight ? '#EEF1F5' : 'rgba(255,255,255,0.06)' }}>
        <span className={`flex items-center gap-1.5 text-[13px] font-medium ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
          <BookOpen size={14} /> Modules opened
        </span>
        <span className={`text-[15px] font-extrabold tabular-nums ${isLight ? 'text-slate-900' : 'text-white'}`}>{history.length}</span>
      </div>

      {/* Continue */}
      {last && (
        <div>
          <div className={`text-[10px] font-bold uppercase tracking-widest ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>Continue</div>
          <div className={`mt-0.5 truncate text-[13px] font-semibold ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>{last.label}</div>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between border-t pt-3" style={{ borderColor: isLight ? '#EEF1F5' : 'rgba(255,255,255,0.06)' }}>
        <div onClick={(e) => e.stopPropagation()}>
          <ThemeToggle variant="minimal" />
        </div>
        <span className={`inline-flex items-center gap-1 text-[12px] font-bold ${isLight ? 'text-blue-700' : 'text-blue-400'}`}>
          View profile <ArrowRight size={13} />
        </span>
      </div>
    </motion.div>
  );
};

// ─── MAIN ──────────────────────────────────────────────────────────────────────
export const WorkstationHome: React.FC = () => {
  const navigate = useNavigate();
  const [scheme] = useColorScheme();
  const isLight = scheme === 'light';
  
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

  const name = firstName ?? getSession().displayName ?? 'Learner';

  return (
    <div 
      className="min-h-[100svh] lg:h-screen flex overflow-x-hidden overflow-y-auto lg:overflow-hidden font-sans transition-colors duration-300" 
      style={{
        backgroundColor: isLight ? '#F7F8FA' : '#04060A',
        color: isLight ? 'var(--text-main)' : '#E2E8F0'
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
          isLight={isLight}
          onOpen={() => navigate('/profile')}
        />
      </div>

      {/* Main scrollable canvas */}
      <main
        ref={scrollRef}
        className="flex-1 min-w-0 max-w-full px-3 lg:pl-[76px] lg:pr-[280px] min-h-[100svh] lg:h-screen flex flex-col relative z-10 overflow-x-hidden overflow-y-visible lg:overflow-hidden"
        style={{ color: isLight ? 'var(--text-main)' : '#E2E8F0' }}
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
                  ? 'linear-gradient(160deg, #FFFFFF 0%, #FFFFFF 100%)'
                  : 'linear-gradient(160deg, rgba(4, 5, 9, 0.97) 0%, rgba(2, 3, 6, 1) 100%)',
                border: isLight ? '1px solid #94A3B8' : '1px solid rgba(59, 130, 246, 0.1)',
                boxShadow: isLight
                  ? '0 12px 40px rgba(15, 23, 42, 0.12), 0 0 0 1px rgba(15, 23, 42, 0.10)'
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
                  ['top-3 left-3', '#22d3ee', '#0E7490'],
                  ['top-3 right-3', '#f97316', '#C2410C'],
                  ['bottom-3 left-3', '#34d399', '#047857'],
                  ['bottom-3 right-3', '#fbbf24', '#B45309'],
                ].map(([pos, darkColor, lightColor], i) => {
                  const color = isLight ? lightColor : darkColor;
                  return (
                  <motion.div
                    key={i}
                    className={`absolute ${pos} w-2 h-2 rounded-full z-20`}
                    style={{ background: color, boxShadow: `0 0 10px ${color}` }}
                    animate={{ opacity: [1, 0.2, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.4 }}
                  />
                  );
                })}

                {/* PCB grid overlay */}
                <div
                  className="absolute inset-0 rounded-3xl pointer-events-none opacity-20"
                  style={{
                    backgroundImage: isLight ? `
                      linear-gradient(rgba(15, 23, 42, 0.08) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(15, 23, 42, 0.08) 1px, transparent 1px)
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
