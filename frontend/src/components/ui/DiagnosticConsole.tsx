import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { UserRound, Settings, Code2, Compass, Command, type LucideIcon } from 'lucide-react';
import { useColorScheme } from '../../hooks/useColorScheme';
import { isAuthenticated } from '../../lib/auth';

interface ConsoleButton {
  id: string;
  Icon: LucideIcon;
  label: string;
  color: string;
  route?: string;
  action?: () => void;
}

interface DiagnosticConsoleProps {
  onCommandPaletteOpen?: () => void;
}

export const DiagnosticConsole: React.FC<DiagnosticConsoleProps> = ({
  onCommandPaletteOpen,
}) => {
  const [scheme] = useColorScheme();
  const isLight = scheme === 'light';
  const navigate = useNavigate();
  const [activeBtn, setActiveBtn] = useState<string | null>(null);

  const BUTTONS: ConsoleButton[] = [
    { id: 'profile',     Icon: UserRound, label: 'My Profile', color: '#6366f1', route: '/profile' },
    { id: 'gear',        Icon: Settings,  label: 'Settings',   color: '#2563eb', route: '/settings' },
    { id: 'code',        Icon: Code2,     label: 'Code',       color: '#3b82f6', route: '/verilog-playground' },
    { id: 'quests',      Icon: Compass,   label: 'Quests',     color: '#3b82f6', route: '/quests' },
    { id: 'cmd',         Icon: Command,   label: 'Command',    color: '#60a5fa', action: onCommandPaletteOpen },
  ];

  const handleBtn = (btn: ConsoleButton) => {
    setActiveBtn(btn.id);
    setTimeout(() => setActiveBtn(null), 400);
    // Not logged in (no real or guest session) -> send to login before any action.
    if (!isAuthenticated()) {
      navigate('/login', { state: { from: btn.route ?? '/portal' } });
      return;
    }
    if (btn.route) navigate(btn.route);
    if (btn.action) btn.action();
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1.0, duration: 0.8, ease: 'easeOut' }}
      className="relative"
      style={{ width: 260 }}
    >
      {/* Outer shell - burnished metal / technical daylight chassis */}
      <div
        className="relative rounded-2xl overflow-hidden"
        style={{
          background: isLight ? '#ECE8FB' : '#04060A',
          border: isLight ? '2px solid #1B1436' : '1px solid rgba(59, 130, 246, 0.15)',
          boxShadow: isLight ? '4px 4px 0 0 #1B1436' : [
            '0 20px 60px rgba(0,0,0,0.9)',
            '0 0 0 1px rgba(255,255,255,0.04)',
            'inset 0 1px 1px rgba(255,255,255,0.06)',
            'inset 0 -1px 1px rgba(0,0,0,0.3)',
          ].join(', '),
        }}
      >
        {/* Carbon-fiber texture overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: `repeating-linear-gradient(
              45deg,
              rgba(255,255,255,0.03) 0px,
              rgba(255,255,255,0.03) 1px,
              transparent 1px,
              transparent 4px
            )`,
          }}
        />

        {/* Top status bar */}
        <div
          className="flex items-center justify-between px-4 py-2"
          style={{
            background: 'linear-gradient(90deg, rgba(59, 130, 246, 0.08) 0%, transparent 100%)',
            borderBottom: isLight ? '1px solid rgba(15, 23, 42, 0.16)' : '1px solid rgba(59, 130, 246, 0.1)',
          }}
        >
          <div className="flex items-center gap-2">
            <motion.div
              className="w-2 h-2 rounded-full"
              style={{ background: '#3b82f6' }}
              animate={{ opacity: [1, 0.45, 1] }}
              transition={{ duration: 2.6, repeat: Infinity }}
            />
            <span className="text-[11px] font-bold tracking-wide" style={{ color: isLight ? '#1E40AF' : '#94A3B8' }}>
              Workstation
            </span>
          </div>
          <div className="flex gap-1.5">
            {(isLight ? ['#0E7490', '#B45309', '#047857'] : ['#22d3ee', '#fbbf24', '#34d399']).map((c, i) => (
              <motion.div
                key={i}
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: c, boxShadow: `0 0 4px ${c}` }}
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.4 }}
              />
            ))}
          </div>
        </div>

        {/* Button grid - 2 columns */}
        <div className="px-4 pb-3 pt-3 grid grid-cols-2 gap-2">
          {BUTTONS.map(btn => (
            <motion.button
              key={btn.id}
              onClick={() => handleBtn(btn)}
              className={`relative flex items-center gap-2 px-3 py-2 rounded-lg text-left ${btn.id === 'profile' ? 'col-span-2' : ''}`}
              style={{
                background:
                  activeBtn === btn.id
                    ? `${btn.color}20`
                    : isLight 
                      ? 'linear-gradient(145deg, rgba(255,255,255,0.9) 0%, rgba(241,245,249,0.9) 100%)' 
                      : 'linear-gradient(145deg, rgba(255,255,255,0.04) 0%, rgba(0,0,0,0.2) 100%)',
                border: `1px solid ${
                  activeBtn === btn.id
                    ? `${btn.color}60`
                    : isLight
                      ? '#94A3B8'
                      : 'rgba(255,255,255,0.06)'
                }`,
                boxShadow:
                  activeBtn === btn.id
                    ? `0 0 12px ${btn.color}40, inset 0 1px 1px rgba(255,255,255,0.1)`
                    : isLight
                      ? 'inset 0 1px 1px rgba(255,255,255,0.8), 0 2px 4px rgba(15,23,42,0.16)'
                      : 'inset 0 1px 1px rgba(255,255,255,0.04), 0 2px 4px rgba(0,0,0,0.4)',
                cursor: 'pointer',
              }}
              whileTap={{ scale: 0.94 }}
              whileHover={{ scale: 1.02 }}
            >
              {/* Icon chip with a slow breathing glow */}
              <motion.span
                className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md"
                style={{
                  background: isLight ? `${darkenForLight(btn.color)}14` : `${btn.color}1f`,
                  border: `1px solid ${isLight ? `${darkenForLight(btn.color)}40` : `${btn.color}33`}`,
                }}
              >
                <btn.Icon
                  size={15}
                  strokeWidth={2.1}
                  style={{ color: isLight ? darkenForLight(btn.color) : btn.color }}
                />
              </motion.span>
              <span
                className="text-[9px] font-black tracking-[0.08em] uppercase leading-tight"
                style={{ color: isLight ? '#0F172A' : btn.color }}
              >
                {btn.label}
              </span>
              {/* Press ripple */}
              {activeBtn === btn.id && (
                <motion.div
                  className="absolute inset-0 rounded-lg"
                  style={{ background: `${btn.color}15`, border: `1px solid ${btn.color}80` }}
                  initial={{ opacity: 1 }}
                  animate={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                />
              )}
            </motion.button>
          ))}
        </div>

        {/* Fake CPU/MEM/NET telemetry removed — no gamey readout. */}

        {/* Side LED strip (right edge) */}
        <div className="absolute right-0 top-6 bottom-6 w-1 flex flex-col justify-around">
          {Array.from({ length: 8 }).map((_, i) => (
            <motion.div
              key={i}
              className="w-1 h-1 rounded-full"
              style={{
                background: isLight
                  ? darkenForLight(LED_STRIP_COLORS[i % LED_STRIP_COLORS.length])
                  : LED_STRIP_COLORS[i % LED_STRIP_COLORS.length],
                boxShadow: isLight
                  ? `0 0 4px ${darkenForLight(LED_STRIP_COLORS[i % LED_STRIP_COLORS.length])}`
                  : `0 0 4px ${LED_STRIP_COLORS[i % LED_STRIP_COLORS.length]}`,
              }}
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.2 + i * 0.15, repeat: Infinity, delay: i * 0.1 }}
            />
          ))}
        </div>
      </div>

      {/* Ground shadow */}
      <div
        style={{
          width: '80%',
          height: 8,
          margin: '0 auto',
          background: isLight
            ? 'radial-gradient(ellipse at center, rgba(14,116,144,0.25) 0%, transparent 70%)'
            : 'radial-gradient(ellipse at center, rgba(34,211,238,0.1) 0%, transparent 70%)',
          filter: 'blur(6px)',
          marginTop: -2,
        }}
      />
    </motion.div>
  );
};

const LED_STRIP_COLORS = [
  '#3b82f6', '#2563eb', '#60a5fa', '#1e3a8a',
  '#3b82f6', '#1d4ed8', '#2563eb', '#1e40af',
];

// Light-mode only: map wash-out figure colors to darker, high-contrast
// variants for a WHITE background while preserving each element's hue.
// Dark mode never calls this, so dark output is unchanged.
const LIGHT_FIGURE_OVERRIDE: Record<string, string> = {
  '#3b82f6': '#1D4ED8',
  '#2563eb': '#1E40AF',
  '#60a5fa': '#1D4ED8',
  '#93c5fd': '#1E40AF',
  '#1e3a8a': '#1e3a8a',
  '#1d4ed8': '#1D4ED8',
  '#1e40af': '#1E40AF',
};
const darkenForLight = (c: string): string =>
  LIGHT_FIGURE_OVERRIDE[c.toLowerCase()] ?? c;
