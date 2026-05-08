import React from 'react';
import { motion } from 'framer-motion';
import { Map, Activity, Droplets, Layers } from 'lucide-react';

interface Props { isActive: boolean; isDarkMode: boolean; }

const ROWS = [
  {
    component: 'AC Mains',
    elec: 'v(t) = Vm·sin(2πft)',
    fluid: 'The Wave Pool',
    fluidNote: 'Source of alternating pressure',
    accent: '#0ea5e9',
  },
  {
    component: 'Diode',
    elec: 'One-way conduction · 0.7 V drop',
    fluid: 'Flapper Valve',
    fluidNote: 'Permits flow in one direction only',
    accent: '#22d3ee',
  },
  {
    component: 'Bridge Rectifier',
    elec: '4 diodes · always forward at load',
    fluid: '4-Valve Routing System',
    fluidNote: 'Forward flow regardless of wave direction',
    accent: '#a78bfa',
  },
  {
    component: 'Capacitor Filter',
    elec: 'Stores charge · low-pass filter',
    fluid: 'Overhead Water Tank',
    fluidNote: 'Stores excess pressure to maintain output',
    accent: '#fbbf24',
  },
];

// Tiny SVG icon helpers per row
const WavePoolIcon = ({ accent }: { accent: string }) => (
  <svg viewBox="0 0 60 40" className="w-14 h-10">
    <motion.path
      d="M 4 20 Q 14 8 24 20 T 44 20 T 56 20"
      stroke={accent} strokeWidth="2.5" fill="none"
      animate={{ d: ['M 4 20 Q 14 8 24 20 T 44 20 T 56 20', 'M 4 20 Q 14 32 24 20 T 44 20 T 56 20', 'M 4 20 Q 14 8 24 20 T 44 20 T 56 20'] }}
      transition={{ duration: 1.5, repeat: Infinity }}
    />
  </svg>
);
const ValveIcon = ({ accent }: { accent: string }) => (
  <svg viewBox="0 0 60 40" className="w-14 h-10">
    <line x1="2" y1="20" x2="58" y2="20" stroke={accent} strokeWidth="2" />
    <polygon points="22,10 22,30 36,20" fill={accent} fillOpacity="0.5" stroke={accent} strokeWidth="2" />
    <line x1="36" y1="10" x2="36" y2="30" stroke={accent} strokeWidth="2" />
  </svg>
);
const FourValveIcon = ({ accent }: { accent: string }) => (
  <svg viewBox="0 0 60 40" className="w-14 h-10">
    <rect x="4" y="4" width="52" height="32" rx="3" fill="none" stroke={accent} strokeWidth="1.5" />
    <line x1="4" y1="20" x2="56" y2="20" stroke={accent} strokeWidth="1" />
    <line x1="30" y1="4" x2="30" y2="36" stroke={accent} strokeWidth="1" />
    {[
      { x: 17, y: 12 },
      { x: 43, y: 12 },
      { x: 17, y: 28 },
      { x: 43, y: 28 },
    ].map((p, i) => (
      <polygon key={i} points={`${p.x - 4},${p.y - 3} ${p.x - 4},${p.y + 3} ${p.x + 4},${p.y}`} fill={accent} fillOpacity="0.6" />
    ))}
  </svg>
);
const TankIcon = ({ accent }: { accent: string }) => (
  <svg viewBox="0 0 60 40" className="w-14 h-10">
    <rect x="14" y="6" width="32" height="22" rx="2" fill="none" stroke={accent} strokeWidth="2" />
    <motion.rect
      x="16" y="6" width="28" height="20"
      fill={accent} fillOpacity="0.4"
      animate={{ y: [10, 6, 10] }}
      transition={{ duration: 2, repeat: Infinity }}
    />
    <line x1="30" y1="28" x2="30" y2="36" stroke={accent} strokeWidth="2" />
  </svg>
);

const ICONS = [WavePoolIcon, ValveIcon, FourValveIcon, TankIcon];

export const S03_Analogy: React.FC<Props> = ({ isActive, isDarkMode }) => {
  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText   = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardBg    = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';

  return (
    <div className="max-w-6xl mx-auto space-y-12 py-4">
      <section className="space-y-3">
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.4em] uppercase text-cyan-400">
          <Map size={14} /> Step 2 · The Plumbing Analogy
        </div>
        <h2 className={`text-3xl md:text-5xl font-black ${textColor}`}>Translate fluid → electrical.</h2>
        <p className={`text-base max-w-3xl ${subText}`}>
          Lock this mapping into your head. Whenever the math gets dense, fall back to the
          plumbing intuition — voltage is just pressure, current is just flow rate, and every
          component in a rectifier or filter is a piece of plumbing.
        </p>
      </section>

      {/* Topic banner */}
      <div className="rounded-2xl border-2 border-cyan-400/40 bg-cyan-500/10 p-4 flex flex-wrap items-center gap-3">
        <span className="font-mono text-[10px] uppercase tracking-widest font-black px-2 py-0.5 rounded bg-cyan-400/20 text-cyan-200 border border-cyan-400/55">
          Topic
        </span>
        <span className={`font-mono text-sm font-black ${textColor}`}>
          Component ↔ fluid mapping · diode = valve, capacitor = tank, voltage = pressure, current = flow
        </span>
      </div>

      {/* Translation table */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={isActive ? { opacity: 1, y: 0 } : {}}
        className={`rounded-3xl border ${cardBg} overflow-hidden`}
      >
        <div className={`grid grid-cols-[1fr_1.2fr] border-b font-mono text-[10px] uppercase tracking-widest ${subText}`}
             style={{ borderColor: isDarkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }}>
          <div className="p-4 flex items-center gap-2"><Activity size={12} className="text-cyan-400" /> Electrical component</div>
          <div className="p-4 border-l flex items-center gap-2" style={{ borderColor: isDarkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }}>
            <Droplets size={12} className="text-cyan-400" /> Fluid dynamic analogy
          </div>
        </div>
        {ROWS.map((r, i) => {
          const Icon = ICONS[i];
          return (
            <motion.div
              key={r.component}
              initial={{ opacity: 0, x: -10 }}
              animate={isActive ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.15 + i * 0.1 }}
              className="grid grid-cols-[1fr_1.2fr] border-b"
              style={{ borderColor: isDarkMode ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)' }}
            >
              <div className="p-5 flex items-center gap-4">
                <div
                  className="w-14 h-14 rounded-2xl grid place-items-center shrink-0"
                  style={{ background: `${r.accent}15`, border: `2px solid ${r.accent}55` }}
                >
                  <Layers size={20} style={{ color: r.accent }} />
                </div>
                <div>
                  <div className={`text-base font-black ${textColor}`}>{r.component}</div>
                  <div className={`text-[11px] font-mono ${subText} mt-0.5`}>{r.elec}</div>
                </div>
              </div>
              <div className="p-5 border-l flex items-center gap-4"
                   style={{ borderColor: isDarkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }}>
                <div className="shrink-0" style={{ color: r.accent }}>
                  <Icon accent={r.accent} />
                </div>
                <div>
                  <div className={`text-base font-black ${textColor}`}>{r.fluid}</div>
                  <div className={`text-[11px] ${subText} mt-0.5`}>{r.fluidNote}</div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }} animate={isActive ? { opacity: 1 } : {}}
        transition={{ delay: 0.6 }}
        className={`p-6 rounded-2xl border ${cardBg}`}
      >
        <p className={`text-sm ${subText}`}>
          <strong className="text-cyan-300">Memorise this table.</strong> When a circuit confuses
          you, just translate it into the park: every wire is a pipe, every voltage is pressure,
          every current is water moving. The math we add later will feel like common sense.
        </p>
      </motion.div>
    </div>
  );
};
