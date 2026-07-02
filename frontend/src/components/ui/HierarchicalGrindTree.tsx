import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Waves, Binary, Cpu, Grid3x3, Braces, Lock,
  ChevronDown, ArrowRight, type LucideIcon,
} from 'lucide-react';
import { useColorScheme } from '../../hooks/useColorScheme';
import { canOpenModule, moduleIdFromPath } from '../../lib/auth';

/**
 * Free-allowance lock: visitors without a real login can open any 5 distinct
 * modules (ModuleGate enforces it). Once the allowance is used, every module
 * they haven't opened shows as locked here and clicking it routes to /login.
 */
const isModuleLocked = (route?: string): boolean => {
  if (!route) return false;
  const id = moduleIdFromPath(route);
  return id ? !canOpenModule(id) : false;
};

// ─── TYPES ─────────────────────────────────────────────────────────────────────
type GateType = 'mux' | 'or' | 'and' | 'xor' | 'nand';

interface SubNode {
  id: string;
  label: string;
  pct: number;
  color: string;
  icon: string;
  locked?: boolean;
}

interface RootNode {
  id: string;
  label: string;
  fullLabel: string;
  description: string;
  tech: string;
  level: string;
  pct: number;
  Icon: LucideIcon;
  color: [string, string];
  glow: string;
  route?: string;
  gate: GateType;
  status: 'done' | 'active' | 'locked';
  children: SubNode[];
}

// ─── DATA ──────────────────────────────────────────────────────────────────────
const ROOT_NODES: RootNode[] = [
  {
    id: 'r1', label: 'Signals & Waves', fullLabel: 'Signal Foundations',
    description: 'Standard signals, analog vs digital, wave parameters, and the bridge to Verilog.',
    tech: 'WAVE_FOUNDATION', level: 'L1', pct: 85, Icon: Waves,
    color: ['#0e7490', '#22d3ee'], glow: '#22d3ee', route: '/module/1',
    gate: 'mux', status: 'done',
    children: [
      { id: 'r1c1', label: 'Standard Signals', pct: 100, color: '#22d3ee', icon: '⚡' },
      { id: 'r1c2', label: 'Analog vs Digital', pct: 100, color: '#38bdf8', icon: '↺' },
      { id: 'r1c3', label: 'Wave Parameters', pct: 100, color: '#0ea5e9', icon: '∿' },
      { id: 'r1c4', label: 'Verilog Bridge', pct: 80, color: '#7dd3fc', icon: '≋' },
    ],
  },
  {
    id: 'r2', label: 'Number Systems', fullLabel: 'Bases & Boolean',
    description: 'Decimal, binary, octal, hex, conversions, Boolean algebra, complements, and 7-segment.',
    tech: 'NUMBER_SYSTEMS', level: 'L2', pct: 0, Icon: Binary,
    color: ['#065f46', '#34d399'], glow: '#34d399', route: '/module/2',
    gate: 'or', status: 'active',
    children: [
      { id: 'r2c1', label: 'Decimal & Binary', pct: 0, color: '#34d399', icon: '◉' },
      { id: 'r2c2', label: 'Octal & Hex', pct: 0, color: '#6ee7b7', icon: '≁' },
      { id: 'r2c3', label: 'Conversions', pct: 0, color: '#10b981', icon: '▤' },
      { id: 'r2c4', label: 'Boolean Algebra', pct: 0, color: '#059669', icon: '∽' },
      { id: 'r2c5', label: 'Complements', pct: 0, color: '#a7f3d0', icon: '⊟' },
    ],
  },
  {
    id: 'r4', label: 'Logic Gates', fullLabel: 'Universal Gates',
    description: 'Why gates, AND/OR/NOT, universal NAND/NOR, XOR/XNOR, gate discovery, and the mini ALU.',
    tech: 'GATE_LOGIC', level: 'L3', pct: 0, Icon: Cpu,
    color: ['#1e3a8a', '#60a5fa'], glow: '#60a5fa', route: '/module/3',
    gate: 'and', status: 'active',
    children: [
      { id: 'r4c1', label: 'AND / OR / NOT', pct: 0, color: '#60a5fa', icon: '0b' },
      { id: 'r4c2', label: 'NAND / NOR', pct: 0, color: '#3b82f6', icon: '∧' },
      { id: 'r4c3', label: 'XOR / XNOR', pct: 0, color: '#2563eb', icon: '⊕' },
      { id: 'r4c4', label: 'Gate Discovery', pct: 0, color: '#bfdbfe', icon: '⊗' },
      { id: 'r4c5', label: 'Mini ALU', pct: 0, color: '#dbeafe', icon: '±' },
    ],
  },
  {
    id: 'r5', label: 'K-Maps', fullLabel: 'Karnaugh Reduction',
    description: "2/3/4-variable maps, grouping rules, don't-cares, POS, and the K-Map sandbox.",
    tech: 'MAP_REDUCTION', level: 'L4', pct: 0, Icon: Grid3x3,
    color: ['#9f1239', '#fb7185'], glow: '#fb7185', route: '/module/4',
    gate: 'xor', status: 'active',
    children: [
      { id: 'r5c1', label: '2-Variable Maps', pct: 0, color: '#fb7185', icon: '▣' },
      { id: 'r5c2', label: '3-Variable Maps', pct: 0, color: '#f43f5e', icon: '▤' },
      { id: 'r5c3', label: '4-Variable Maps', pct: 0, color: '#e11d48', icon: '▥' },
      { id: 'r5c4', label: "Don't Care Terms", pct: 0, color: '#fda4af', icon: '⊘' },
      { id: 'r5c5', label: 'SOP / POS Forms', pct: 0, color: '#fecdd3', icon: 'Σ' },
    ],
  },
  {
    id: 'r6', label: 'Verilog Core', fullLabel: 'HDL Synthesis Gateway',
    description: 'First Verilog, modules, testbenches, clock signals, hierarchy - gateway to L6 mastery.',
    tech: 'HDL_GATEWAY', level: 'L5', pct: 0, Icon: Braces,
    color: ['#4c1d95', '#c4b5fd'], glow: '#c4b5fd', route: '/module/5',
    gate: 'nand', status: 'active',
    children: [
      { id: 'r6c1', label: 'First Verilog', pct: 0, color: '#c4b5fd', icon: '{' },
      { id: 'r6c2', label: 'Modules', pct: 0, color: '#a78bfa', icon: '◫' },
      { id: 'r6c3', label: 'Testbenches', pct: 0, color: '#8b5cf6', icon: '⊡' },
      { id: 'r6c4', label: 'Clock Signal', pct: 0, color: '#7c3aed', icon: '⟳' },
      { id: 'r6c5', label: 'Hierarchy', pct: 0, color: '#ddd6fe', icon: '⬡' },
    ],
  },
];

// ─── CONSTANTS ─────────────────────────────────────────────────────────────────
const HEX_CHARS = '0123456789ABCDEF01';
const SCRAMBLE_FRAMES = 8;

// ─── LIGHT-MODE FIGURE COLOR DARKENING ──────────────────────────────────────────
// Figure colors (node.color tuples, node.glow, sub-node colors) are SHARED by both
// modes via the data arrays above. To keep dark mode byte-for-byte identical while
// darkening figures on a white background, light mode looks colors up in this map.
// Each pale hue maps to a darker/more-saturated variant of the SAME hue.
const LIGHT_FIGURE_OVERRIDE: Record<string, string> = {
  // cyan / sky (Signals & Waves)
  '#22d3ee': '#0E7490', '#38bdf8': '#0369A1', '#0ea5e9': '#0369A1', '#7dd3fc': '#0E7490',
  '#67e8f9': '#0E7490',
  // green (Number Systems)
  '#34d399': '#047857', '#6ee7b7': '#047857', '#10b981': '#065F46', '#059669': '#065F46',
  '#a7f3d0': '#047857', '#4ade80': '#047857',
  // sky / blue (Logic Gates)
  '#60a5fa': '#1D4ED8', '#3b82f6': '#1E40AF', '#2563eb': '#1E40AF', '#bfdbfe': '#1D4ED8',
  '#dbeafe': '#1D4ED8', '#93c5fd': '#1E40AF',
  // rose / pink (K-Maps)
  '#fb7185': '#BE123C', '#f43f5e': '#BE123C', '#e11d48': '#BE185D', '#fda4af': '#BE123C',
  '#fecdd3': '#BE185D', '#f472b6': '#BE185D',
  // violet (Verilog)
  '#c4b5fd': '#6D28D9', '#a78bfa': '#5B21B6', '#8b5cf6': '#5B21B6', '#7c3aed': '#5B21B6',
  '#ddd6fe': '#6D28D9',
};

// Returns a darker, high-contrast variant of a figure color for light mode only.
// Dark mode must pass through `c` unchanged (callers gate on isLight).
const darkenFigure = (c: string): string => {
  const key = c.toLowerCase();
  return LIGHT_FIGURE_OVERRIDE[key] ?? c;
};

// ─── KINETIC DECODE HOOK ───────────────────────────────────────────────────────
function useDecodeText(target: string, trigger: boolean) {
  const [display, setDisplay] = useState(target);
  const frameRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  useEffect(() => {
    if (!trigger) return;
    frameRef.current = 0;
    const tick = () => {
      frameRef.current++;
      const progress = frameRef.current / SCRAMBLE_FRAMES;
      const resolved = Math.floor(progress * target.length);
      setDisplay(target.split('').map((ch, i) => {
        if (i < resolved || ch === ' ') return ch;
        return HEX_CHARS[Math.floor(Math.random() * HEX_CHARS.length)];
      }).join(''));
      if (frameRef.current < SCRAMBLE_FRAMES) rafRef.current = requestAnimationFrame(tick);
      else setDisplay(target);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [trigger, target]);
  return display;
}

// ─── HOLOGRAPHIC TOOLTIP ───────────────────────────────────────────────────────
const HudTooltip: React.FC<{ text: string; color: string; visible: boolean; align?: 'left' | 'right' }> = ({
  text, color, visible, align = 'left',
}) => {
  const [scheme] = useColorScheme();
  const isLight = scheme === 'light';
  const [charIdx, setCharIdx] = useState(0);
  useEffect(() => {
    if (!visible) { setCharIdx(0); return; }
    setCharIdx(0);
    let i = 0;
    const id = setInterval(() => { i++; setCharIdx(i); if (i >= text.length) clearInterval(id); }, 18);
    return () => clearInterval(id);
  }, [visible, text]);
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.88, y: -4 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.88, y: -4 }}
          transition={{ duration: 0.18 }}
          className="absolute z-50 pointer-events-none"
          style={{
            bottom: 'calc(100% + 10px)',
            [align === 'left' ? 'left' : 'right']: 0,
            width: 210,
            background: isLight ? '#FFFFFF' : 'var(--bg-elev)',
            borderRadius: 4,
            border: isLight ? '1px solid rgba(15,23,42,0.18)' : '1px solid rgba(255,255,255,0.07)',
            borderLeft: `2px solid ${color}`,
            padding: '8px 10px',
          }}
        >
          <div className="text-[10px] font-mono tracking-[0.18em] mb-1.5 uppercase" style={{ color: isLight ? color : `${color}bb` }}>
            SYS · TELEMETRY
          </div>
          <div className={`text-[12px] leading-snug font-mono ${isLight ? 'text-slate-900' : 'text-white/80'}`}>
            {text.slice(0, charIdx)}
            {charIdx < text.length && <span style={{ color }} className="opacity-80 animate-pulse">▌</span>}
          </div>
          <div className="absolute bottom-0 right-0 w-2 h-2 pointer-events-none"
            style={{ borderRight: `1px solid ${color}55`, borderBottom: `1px solid ${color}55` }} />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// ─── ANIMATED PATHWAY PULSE ────────────────────────────────────────────────────
const PathwayPulse: React.FC<{ color: string; vertical?: boolean; length?: number }> = ({
  color, vertical = false, length = 48,
}) => {
  const [scheme] = useColorScheme();
  const isLight = scheme === 'light';
  return (
  <div className="relative overflow-hidden pointer-events-none"
    style={vertical ? { width: 1, height: length } : { height: 1, width: length }}>
    <div className="absolute inset-0" style={{ backgroundColor: isLight ? `${color}55` : `${color}28` }} />
    <motion.div className="absolute"
      style={vertical
        ? { left: 0, right: 0, height: 16, background: `linear-gradient(to bottom, transparent, ${color}cc, transparent)` }
        : { top: 0, bottom: 0, width: 16, background: `linear-gradient(to right, transparent, ${color}cc, transparent)` }}
      animate={vertical ? { y: [-16, length] } : { x: [-16, length] }}
      transition={{ duration: 1.8, repeat: Infinity, ease: 'linear', repeatDelay: 1.2 }} />
  </div>
  );
};

// ─── LOGIC GATE SVG SHAPES ─────────────────────────────────────────────────────
interface GateProps {
  type: GateType;
  accent: string;
  isLocked: boolean;
  hovered: boolean;
  Icon: LucideIcon;
}

const AnimatedPin: React.FC<{ x1: number; y1: number; x2: number; y2: number; color: string; delay?: number }> = ({
  x1, y1, x2, y2, color, delay = 0,
}) => {
  const [scheme] = useColorScheme();
  const isLight = scheme === 'light';
  return (
    <>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={isLight ? `${color}99` : `${color}55`} strokeWidth={isLight ? 1.5 : 1} />
      <motion.circle
        r={1.4}
        fill={color}
        animate={{ cx: [x1, x2], cy: [y1, y2], opacity: [0, 1, 1, 0] }}
        transition={{ duration: 1.2, repeat: Infinity, ease: 'linear', repeatDelay: 1.5, delay }}
      />
    </>
  );
};

const LogicGateShape: React.FC<GateProps> = ({ type, accent: accentRaw, isLocked, hovered, Icon }) => {
  const [scheme] = useColorScheme();
  const isLight = scheme === 'light';
  // Light mode darkens the figure accent; dark mode passes through unchanged.
  const accent = isLight ? darkenFigure(accentRaw) : accentRaw;
  const fill = isLight ? '#FFFFFF' : '#090B10';
  const stroke = isLocked
    ? (isLight ? 'rgba(15,23,42,0.28)' : 'rgba(255,255,255,0.1)')
    : (isLight ? `${accent}cc` : `${accent}99`);
  const strokeDash = isLocked ? '4 3' : undefined;
  const glow = hovered && !isLocked;

  // Crisp vector glyph (nested SVG), centred on (cx, cy). Lucide forwards x/y to
  // the inner <svg>, so we offset by half its size to keep it centred.
  const iconEl = (cx: number, cy: number, size = 21) => {
    const Glyph = isLocked ? Lock : Icon;
    return (
      <Glyph
        x={cx - size / 2}
        y={cy - size / 2}
        size={size}
        color={isLocked ? (isLight ? '#64748B' : '#475569') : accent}
        strokeWidth={2.1}
        style={{ overflow: 'visible' }}
      />
    );
  };

  if (type === 'mux') return (
    <svg width={80} height={64} viewBox="0 0 80 64"
      style={{ filter: glow ? `drop-shadow(0 0 8px ${accent}99)` : 'none', transition: 'filter 0.3s' }}>
      <motion.polygon points="16,4 64,4 60,60 20,60"
        fill="transparent" stroke={isLight ? `${accent}77` : `${accent}44`} strokeWidth={isLight ? 1 : 0.7}
        strokeDasharray={strokeDash}
        animate={hovered && !isLocked ? { rotate: 4, opacity: 1 } : { rotate: 0, opacity: 0.5 }}
        style={{ transformOrigin: '40px 32px' }}
        transition={{ duration: 0.8, ease: 'easeInOut' }} />
      <polygon points="20,9 60,9 56,55 24,55" fill={fill} stroke={stroke} strokeWidth={isLight ? 1.5 : 1.2} />
      {!isLocked && <AnimatedPin x1={40} y1={55} x2={40} y2={62} color={accent} delay={0} />}
      {!isLocked && (
        <>
          <AnimatedPin x1={4} y1={20} x2={20} y2={22} color={accent} delay={0.1} />
          <AnimatedPin x1={4} y1={44} x2={20} y2={42} color={accent} delay={0.4} />
        </>
      )}
      {!isLocked && <AnimatedPin x1={60} y1={32} x2={76} y2={32} color={accent} delay={0.7} />}
      <text x={40} y={35} textAnchor="middle" fontFamily="monospace"
        fontSize={isLight ? 9 : 8} fill={isLight ? `${accent}aa` : `${accent}66`} letterSpacing="1">MUX</text>
      {iconEl(40, 18, 18)}
    </svg>
  );

  if (type === 'or') return (
    <svg width={80} height={64} viewBox="0 0 80 64"
      style={{ filter: glow ? `drop-shadow(0 0 8px ${accent}99)` : 'none', transition: 'filter 0.3s' }}>
      <motion.path
        d="M 14,5 Q 26,32 14,59 Q 38,50 54,32 Q 38,14 14,5 Z"
        fill="transparent" stroke={isLight ? `${accent}77` : `${accent}44`} strokeWidth={isLight ? 1 : 0.7}
        animate={hovered && !isLocked ? { scale: 1.08, opacity: 1 } : { scale: 1, opacity: 0.5 }}
        style={{ transformOrigin: '35px 32px' }}
        transition={{ duration: 0.5 }} />
      <path d="M 18,8 Q 30,32 18,56 Q 42,48 58,32 Q 42,16 18,8 Z"
        fill={fill} stroke={stroke} strokeWidth={isLight ? 1.5 : 1.2} strokeDasharray={strokeDash} />
      {!isLocked && (
        <>
          <AnimatedPin x1={4} y1={20} x2={21} y2={23} color={accent} delay={0} />
          <AnimatedPin x1={4} y1={44} x2={21} y2={41} color={accent} delay={0.35} />
          <AnimatedPin x1={58} y1={32} x2={76} y2={32} color={accent} delay={0.7} />
        </>
      )}
      <text x={40} y={50} textAnchor="middle" fontFamily="monospace"
        fontSize={isLight ? 9 : 7} fill={isLight ? `${accent}aa` : `${accent}55`} letterSpacing="1">OR</text>
      {iconEl(38, 30)}
    </svg>
  );

  if (type === 'and') return (
    <svg width={80} height={64} viewBox="0 0 80 64"
      style={{ filter: glow ? `drop-shadow(0 0 8px ${accent}99)` : 'none', transition: 'filter 0.3s' }}>
      <motion.path d="M 14,5 L 38,5 Q 62,5 62,32 Q 62,59 38,59 L 14,59 Z"
        fill="transparent" stroke={isLight ? `${accent}77` : `${accent}44`} strokeWidth={isLight ? 1 : 0.7}
        animate={hovered && !isLocked ? { scale: 1.06, opacity: 1 } : { scale: 1, opacity: 0.5 }}
        style={{ transformOrigin: '38px 32px' }} transition={{ duration: 0.45 }} />
      <path d="M 18,9 L 38,9 Q 58,9 58,32 Q 58,55 38,55 L 18,55 Z"
        fill={fill} stroke={stroke} strokeWidth={isLight ? 1.5 : 1.2} strokeDasharray={strokeDash} />
      {!isLocked && <line x1="38" y1="9" x2="38" y2="55" stroke={accent} strokeOpacity={isLight ? 0.18 : 0.08} strokeWidth="0.5" />}
      {!isLocked && (
        <>
          <AnimatedPin x1={4} y1={20} x2={18} y2={20} color={accent} delay={0} />
          <AnimatedPin x1={4} y1={44} x2={18} y2={44} color={accent} delay={0.4} />
          <AnimatedPin x1={58} y1={32} x2={76} y2={32} color={accent} delay={0.8} />
        </>
      )}
      <text x={38} y={50} textAnchor="middle" fontFamily="monospace"
        fontSize={isLight ? 9 : 7} fill={isLight ? `${accent}aa` : `${accent}55`} letterSpacing="1">AND</text>
      {iconEl(38, 29)}
    </svg>
  );

  if (type === 'xor') return (
    <svg width={80} height={64} viewBox="0 0 80 64"
      style={{ filter: glow ? `drop-shadow(0 0 8px ${accent}99)` : 'none', transition: 'filter 0.3s' }}>
      <motion.path d="M 14,5 Q 26,32 14,59 Q 38,50 54,32 Q 38,14 14,5 Z"
        fill="transparent" stroke={isLight ? `${accent}66` : `${accent}33`} strokeWidth={isLight ? 1 : 0.7}
        animate={hovered && !isLocked ? { scale: 1.08, opacity: 1 } : { scale: 1, opacity: 0.4 }}
        style={{ transformOrigin: '35px 32px' }} transition={{ duration: 0.5 }} />
      <path d="M 18,8 Q 30,32 18,56 Q 42,48 58,32 Q 42,16 18,8 Z"
        fill={fill} stroke={stroke} strokeWidth={isLight ? 1.5 : 1.2} strokeDasharray={strokeDash} />
      {!isLocked ? (
        <motion.path d="M 12,8 Q 24,32 12,56"
          fill="none" stroke={accent} strokeWidth={isLight ? 1.5 : 1.2} strokeOpacity="0.7"
          animate={{ strokeOpacity: hovered ? [0.7, 1, 0.7] : [0.4, 0.7, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }} />
      ) : (
        <path d="M 12,8 Q 24,32 12,56" fill="none" stroke={isLight ? 'rgba(15,23,42,0.28)' : 'rgba(255,255,255,0.1)'} strokeWidth="1" />
      )}
      {!isLocked && (
        <>
          <AnimatedPin x1={4} y1={20} x2={22} y2={23} color={accent} delay={0} />
          <AnimatedPin x1={4} y1={44} x2={22} y2={41} color={accent} delay={0.35} />
          <AnimatedPin x1={58} y1={32} x2={76} y2={32} color={accent} delay={0.7} />
        </>
      )}
      <text x={40} y={50} textAnchor="middle" fontFamily="monospace"
        fontSize={isLight ? 9 : 7} fill={isLight ? `${accent}aa` : `${accent}55`} letterSpacing="1">XOR</text>
      {iconEl(38, 30)}
    </svg>
  );

  if (type === 'nand') return (
    <svg width={80} height={64} viewBox="0 0 80 64"
      style={{ filter: glow ? `drop-shadow(0 0 8px ${accent}99)` : 'none', transition: 'filter 0.3s' }}>
      <motion.path d="M 14,5 L 36,5 Q 60,5 60,32 Q 60,59 36,59 L 14,59 Z"
        fill="transparent" stroke={isLight ? `${accent}66` : `${accent}33`} strokeWidth={isLight ? 1 : 0.7}
        animate={hovered && !isLocked ? { scale: 1.06, opacity: 1 } : { scale: 1, opacity: 0.5 }}
        style={{ transformOrigin: '38px 32px' }} transition={{ duration: 0.45 }} />
      <path d="M 18,9 L 36,9 Q 56,9 56,32 Q 56,55 36,55 L 18,55 Z"
        fill={fill} stroke={stroke} strokeWidth={isLight ? 1.5 : 1.2} strokeDasharray={strokeDash} />
      <motion.circle cx={62} cy={32} r={5}
        fill={fill} stroke={isLocked ? (isLight ? 'rgba(15,23,42,0.28)' : 'rgba(255,255,255,0.1)') : accent} strokeWidth={isLight ? 1.5 : 1.2}
        animate={!isLocked && hovered ? { r: 6 } : { r: 5 }}
        transition={{ duration: 0.3 }} />
      {!isLocked && (
        <motion.circle cx={62} cy={32} r={1.5} fill={accent}
          animate={{ opacity: [0.6, 1, 0.6] }} transition={{ duration: 1.8, repeat: Infinity }} />
      )}
      {!isLocked && (
        <>
          <AnimatedPin x1={4} y1={20} x2={18} y2={20} color={accent} delay={0} />
          <AnimatedPin x1={4} y1={44} x2={18} y2={44} color={accent} delay={0.4} />
          <AnimatedPin x1={67} y1={32} x2={76} y2={32} color={accent} delay={0.8} />
        </>
      )}
      <text x={37} y={50} textAnchor="middle" fontFamily="monospace"
        fontSize={isLight ? 9 : 7} fill={isLight ? `${accent}aa` : `${accent}55`} letterSpacing="1">NAND</text>
      {iconEl(37, 29)}
    </svg>
  );

  return null;
};

// ─── ROOT MODULE GEM - LOGIC GATE EDITION ─────────────────────────────────────
const RootGem: React.FC<{ node: RootNode; index: number; onClick: () => void }> = ({
  node, index, onClick,
}) => {
  const [scheme] = useColorScheme();
  const isLight = scheme === 'light';
  const isLocked = node.status === 'locked';
  const isDone = node.status === 'done';
  // Light mode darkens the shared glow accent so rings/progress/badges read on white.
  const accent = isLight ? darkenFigure(node.glow) : node.glow;
  const [hovered, setHovered] = useState(false);
  const [inView, setInView] = useState(false);
  const displayLabel = useDecodeText(node.label, inView);

  useEffect(() => {
    const t = setTimeout(() => setInView(true), index * 80 + 200);
    return () => clearTimeout(t);
  }, [index]);

  return (
    <motion.div
      className="relative flex flex-col items-center w-[96px] sm:w-[120px] lg:w-[140px]"
      style={{ cursor: isLocked ? 'not-allowed' : 'pointer' }}
      initial={{ opacity: 0, y: 18, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.08, type: 'spring', stiffness: 190, damping: 20 }}
      role="button"
      tabIndex={isLocked ? -1 : 0}
      aria-disabled={isLocked}
      aria-label={`${node.level} ${node.label}${isLocked ? ' - locked' : isDone ? ' - completed' : ''}`}
      onClick={() => onClick()}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(); }
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => { if (!isLocked) setHovered(true); }}
      onBlur={() => setHovered(false)}
    >
      <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-sm border bg-transparent mb-3"
        style={{
          borderColor: isLocked
            ? (isLight ? 'rgba(15,23,42,0.28)' : 'rgba(255,255,255,0.08)')
            : (isLight ? `${accent}88` : `${accent}44`),
          boxShadow: hovered && !isLocked ? `0 0 8px ${accent}33` : 'none',
          transition: 'box-shadow 0.3s',
        }}>
        <span className={`text-[10px] font-mono tracking-[0.25em] ${isLight ? 'text-[#1D4ED8]' : 'text-white/75'}`}>{node.level}</span>
        <motion.span className="w-1 h-1 rounded-full"
          style={{ backgroundColor: isLocked ? (isLight ? 'rgba(15,23,42,0.35)' : 'rgba(255,255,255,0.15)') : accent }}
          animate={!isLocked ? { opacity: [0.5, 1, 0.5] } : {}}
          transition={{ duration: 2, repeat: Infinity }} />
      </div>

      <div className="relative">
        {/* Soft radial aura that blooms behind the gate on hover/focus */}
        <motion.div aria-hidden className="absolute pointer-events-none rounded-full"
          style={{
            left: '50%', top: '46%', width: 124, height: 98, marginLeft: -62, marginTop: -49,
            background: `radial-gradient(ellipse at center, ${accent}, transparent 68%)`,
            filter: 'blur(24px)',
          }}
          animate={{
            opacity: hovered && !isLocked ? (isLight ? 0.3 : 0.55) : 0,
            scale: hovered && !isLocked ? 1.05 : 0.7,
          }}
          transition={{ duration: 0.4, ease: 'easeOut' }} />
        <HudTooltip text={node.description} color={accent} visible={hovered && !isLocked} />
        <motion.div whileHover={!isLocked ? { scale: 1.07, y: -2 } : {}}
          transition={{ type: 'spring', stiffness: 320, damping: 22 }}
          style={{ position: 'relative', zIndex: 1, opacity: isLocked ? 0.4 : 1, transition: 'opacity 0.3s' }}>
          <LogicGateShape type={node.gate} accent={accent}
            isLocked={isLocked} hovered={hovered} Icon={node.Icon} />

          {isDone && (
            <motion.div className={`absolute -top-1 -right-1 px-1 py-0.5 rounded-sm border ${
              isLight ? 'bg-white' : 'bg-[#070810]'
            }`}
              style={{ borderColor: accent }}
              initial={{ scale: 0 }} animate={{ scale: 1 }}
              transition={{ delay: index * 0.07 + 0.4, type: 'spring', stiffness: 300 }}>
              <span className="text-[10px] font-mono" style={{ color: accent }}>✓</span>
            </motion.div>
          )}

          {isLocked && (
            <div className={`absolute -top-1 -right-1 rounded-sm border p-1 ${isLight ? 'bg-white' : 'bg-[#070810]'}`}
              style={{ borderColor: isLight ? '#94A3B8' : 'rgba(255,255,255,0.25)' }}
              title="Sign in to unlock">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={isLight ? '#475569' : '#94a3b8'} strokeWidth="3" strokeLinecap="round">
                <rect x="5" y="11" width="14" height="9" rx="2" />
                <path d="M8 11V7a4 4 0 0 1 8 0v4" />
              </svg>
            </div>
          )}
        </motion.div>
      </div>

      <div className="mt-2 w-full text-center text-[12px] sm:text-[13px] font-semibold leading-tight tracking-wide font-mono px-0.5"
        style={{
          color: isLocked
            ? (isLight ? '#475569' : '#475569')
            : (isLight ? '#0F172A' : '#E5E7EB'),
          maxWidth: '100%',
          minHeight: 28
        }}
      >
        {displayLabel}
      </div>

      <div className="mt-1 w-full text-[9px] font-mono tracking-[0.1em] text-center truncate"
        style={{
          color: isLocked
            ? (isLight ? '#334155' : '#334155')
            : (isLight ? '#1D4ED8' : `${accent}aa`),
          maxWidth: '100%'
        }}
      >
        {node.tech}
      </div>

      {!isLocked && (isDone || node.pct > 0) && (
        <div className="mt-2 h-[3px] w-10 overflow-hidden rounded-full"
          style={{ background: isLight ? 'rgba(15,23,42,0.12)' : 'rgba(255,255,255,0.08)' }}>
          <motion.div className="h-full rounded-full"
            style={{ background: accent, boxShadow: `0 0 6px ${accent}` }}
            initial={{ width: 0 }} animate={{ width: `${isDone ? 100 : node.pct}%` }}
            transition={{ delay: index * 0.08 + 0.55, duration: 0.9, ease: [0.16, 1, 0.3, 1] }} />
        </div>
      )}

    </motion.div>
  );
};

// ─── L6 PATH HIERARCHY ──────────────────────────────────────────────────────────
interface SubmoduleOption { id: string; label: string; route: string }
interface ModuleOption    { id: string; label: string; subtitle: string; route: string; submodules: SubmoduleOption[] }
interface PathOption      { id: string; label: string; subtitle: string; color: string; modules: ModuleOption[]; comingSoon?: boolean }

const L6_PATHS: PathOption[] = [
  {
    id: 'basic-electronics', label: 'Basic Electronics', subtitle: 'PHYSICS · SIGNALS · ADC', color: '#22d3ee',
    modules: [
      {
        id: 'be1', label: 'Physics of Control', subtitle: 'L0 · ATOMS · BANDS', route: '/basic-electronics/1/cover',
        submodules: [
          { id: 'be1s0',  label: 'Start · Overture',          route: '/basic-electronics/1/cover'     },
          { id: 'be1s1',  label: 'Video Lecture',             route: '/basic-electronics/1/video'     },
          { id: 'be1s2',  label: 'Quest for Control',         route: '/basic-electronics/1/quest'     },
          { id: 'be1s3',  label: 'Starting Lineup',           route: '/basic-electronics/1/lineup'    },
          { id: 'be1s4',  label: 'Silicon Franchise',         route: '/basic-electronics/1/franchise' },
          { id: 'be1s5',  label: 'Tetravalent · Magic 4',     route: '/basic-electronics/1/tetra'     },
          { id: 'be1s6',  label: 'Garba Matrix',              route: '/basic-electronics/1/garba'     },
          { id: 'be1s7',  label: 'When the Dhol Drops',       route: '/basic-electronics/1/dhol'      },
          { id: 'be1s8',  label: 'Electrons & Holes',         route: '/basic-electronics/1/dance'     },
          { id: 'be1s9',  label: 'The 3-Tier City',           route: '/basic-electronics/1/bands'     },
          { id: 'be1s10', label: 'Paying the Toll · eV',      route: '/basic-electronics/1/toll'      },
          { id: 'be1s11', label: 'Master Blueprint',          route: '/basic-electronics/1/blueprint' },
          { id: 'be1s12', label: 'Practice Arena',            route: '/basic-electronics/1/practice'  },
        ],
      },
      {
        id: 'be2', label: 'Silicon · Doping · Carriers', subtitle: 'L1 · SEMI PHYSICS', route: '/basic-electronics/2/cover',
        submodules: [
          { id: 'be2s0',  label: 'Cover · Madhur\'s Lab',          route: '/basic-electronics/2/cover'     },
          { id: 'be2s1',  label: 'Video · Semiconductor Physics', route: '/basic-electronics/2/video'     },
          { id: 'be2s2',  label: 'Good Boy Hostel · Intrinsic Si',route: '/basic-electronics/2/hostel'    },
          { id: 'be2s3',  label: 'Hostel vs Tapri · Energy Bands',route: '/basic-electronics/2/tapri'     },
          { id: 'be2s4',  label: 'Breaking Covalent Bonds',       route: '/basic-electronics/2/jump'      },
          { id: 'be2s5',  label: 'Doping · The Jugaad',           route: '/basic-electronics/2/jugaad'    },
          { id: 'be2s6',  label: 'N-Type · 5-Friend Squad',       route: '/basic-electronics/2/ntype'     },
          { id: 'be2s7',  label: 'P-Type · 3-Friend Squad',       route: '/basic-electronics/2/ptype'     },
          { id: 'be2s8',  label: 'Electron vs Hole Flow',         route: '/basic-electronics/2/flow'      },
          { id: 'be2s9',  label: 'N vs P · Cheat Sheet',          route: '/basic-electronics/2/cheat'     },
          { id: 'be2s10', label: 'Neutrality + Heat Twist',       route: '/basic-electronics/2/neutral'   },
          { id: 'be2s11', label: 'Practice Arena',                route: '/basic-electronics/2/practice'  },
        ],
      },
      {
        id: 'be3', label: 'The Commuter Circuit · P-N Junction', subtitle: 'L2 · DIODE · V-I CURVE', route: '/basic-electronics/3/cover',
        submodules: [
          { id: 'be3s0', label: 'Cover · The Commuter Circuit',       route: '/basic-electronics/3/cover'     },
          { id: 'be3s1', label: 'Video · P-N Junction Diode',         route: '/basic-electronics/3/video'     },
          { id: 'be3s2', label: 'The Cast · N-Type & P-Type',         route: '/basic-electronics/3/cast'      },
          { id: 'be3s3', label: 'No Bias · Crowded Platform',         route: '/basic-electronics/3/platform'  },
          { id: 'be3s4', label: 'Traffic Jam · Built-in Field',       route: '/basic-electronics/3/traffic'   },
          { id: 'be3s5', label: 'Reverse Bias · Locked Doors',        route: '/basic-electronics/3/locked'    },
          { id: 'be3s6', label: 'Forward Bias · Massive Boarding',    route: '/basic-electronics/3/boarding'  },
          { id: 'be3s7', label: 'Breakdown · The Stampede',           route: '/basic-electronics/3/stampede'  },
          { id: 'be3s8', label: 'V-I Curve · The Diode Turnstile',    route: '/basic-electronics/3/turnstile' },
          { id: 'be3s9', label: 'Practice Arena',                     route: '/basic-electronics/3/practice'  },
        ],
      },
      {
        id: 'be4', label: 'Rectifiers & Filters', subtitle: 'L3 · RECTIFIERS · FILTERS', route: '/basic-electronics/4/cover',
        submodules: [
          { id: 'be4s0', label: 'Cover · Rectifiers & Filters',         route: '/basic-electronics/4/cover'      },
          { id: 'be4s1', label: 'Video · EN + HI transcript',           route: '/basic-electronics/4/video'      },
          { id: 'be4s2', label: 'Step 1 · Why We Rectify · AC vs DC',   route: '/basic-electronics/4/challenge'  },
          { id: 'be4s3', label: 'Step 2 · The Plumbing Analogy',        route: '/basic-electronics/4/analogy'    },
          { id: 'be4s4', label: 'Step 3 · The Diode · One-Way Valve',   route: '/basic-electronics/4/diode'      },
          { id: 'be4s5', label: 'Step 4 · Half-Wave Rectifier',         route: '/basic-electronics/4/halfwave'   },
          { id: 'be4s6', label: 'Step 5 · Vdc & Ripple math',           route: '/basic-electronics/4/halfmath'   },
          { id: 'be4s7', label: 'Step 6 · Bridge Rectifier · 4 Diodes', route: '/basic-electronics/4/fullwave'   },
          { id: 'be4s8', label: 'Step 7 · Capacitor Filter',            route: '/basic-electronics/4/filter'     },
          { id: 'be4s9', label: 'Closing · Rectifier + Filter Recap',   route: '/basic-electronics/4/showdown'   },
        ],
      },
      {
        id: 'be5', label: 'Special-Purpose Diodes', subtitle: 'L4 · ZENER · LED · PHOTODIODE', route: '/basic-electronics/5/cover',
        submodules: [
          { id: 'be5s0', label: 'Cover · The Neon Diode Gala',             route: '/basic-electronics/5/cover'      },
          { id: 'be5s1', label: 'Video · EN + HI commentary',              route: '/basic-electronics/5/video'      },
          { id: 'be5s2', label: 'Step 1 · Baseline vs Specialists',        route: '/basic-electronics/5/baseline'   },
          { id: 'be5s3', label: 'Zener · 1 · V-I & Breakdown',             route: '/basic-electronics/5/zener-vi'   },
          { id: 'be5s4', label: 'Zener · 2 · Voltage Regulator',           route: '/basic-electronics/5/zener-reg'  },
          { id: 'be5s5', label: 'LED · 1 · Electroluminescence',           route: '/basic-electronics/5/led-el'     },
          { id: 'be5s6', label: 'LED · 2 · Spectrum & Material',           route: '/basic-electronics/5/led-spec'   },
          { id: 'be5s7', label: 'Photo · 1 · Reverse-Bias Photodiode',     route: '/basic-electronics/5/photo-ckt'  },
          { id: 'be5s8', label: 'Photo · 2 · I-V vs Illumination',         route: '/basic-electronics/5/photo-resp' },
          { id: 'be5s9', label: 'Summary · Diagnostic Matrix',             route: '/basic-electronics/5/matrix'     },
          { id: 'be5s10',label: 'Final · Self-Check Quiz',                 route: '/basic-electronics/5/quiz'       },
        ],
      },
      {
        id: 'be6', label: 'BJT Construction & Operation', subtitle: 'L5 · BJT · CONSTRUCTION', route: '/basic-electronics/6/cover',
        submodules: [
          { id: 'be6s0', label: 'BJT Construction & Operation', route: '/basic-electronics/6/cover' },
          { id: 'be6s1', label: 'Video - Inside the BJT', route: '/basic-electronics/6/video' },
          { id: 'be6s2', label: 'What a BJT Is: The Three-Layer Sandwich', route: '/basic-electronics/6/threelayersandwich' },
          { id: 'be6s3', label: 'Physical Architecture: Sizes & Doping', route: '/basic-electronics/6/architecture' },
          { id: 'be6s4', label: 'NPN vs PNP: The Structural Dichotomy', route: '/basic-electronics/6/npnvspnp' },
          { id: 'be6s5', label: 'The Three Operating Regions', route: '/basic-electronics/6/threeregions' },
          { id: 'be6s6', label: 'Output Characteristics: Ic vs Vce', route: '/basic-electronics/6/outputcurves' },
          { id: 'be6s7', label: 'Amplification Factors: Alpha & Beta', route: '/basic-electronics/6/alphabeta' },
          { id: 'be6s8', label: 'Synthesis: Why Amplification Is Inevitable', route: '/basic-electronics/6/synthesis' },
          { id: 'be6s9', label: 'Flashcards - Lock It In', route: '/basic-electronics/6/flashcards' },
          { id: 'be6s10', label: 'Quiz - Test the Build', route: '/basic-electronics/6/quiz' },
          { id: 'be6s11', label: 'Recap - The Mall in One Page', route: '/basic-electronics/6/recap' },
        ],
      },
      {
        id: 'be7', label: 'BJT DC Biasing', subtitle: 'L6 · BIAS · Q-POINT', route: '/basic-electronics/7/cover',
        submodules: [
          { id: 'be7s0', label: 'BJT DC Biasing', route: '/basic-electronics/7/cover' },
          { id: 'be7s1', label: 'Video - Setting the Q-point', route: '/basic-electronics/7/video' },
          { id: 'be7s2', label: 'The Q-Point: A Resting Baseline', route: '/basic-electronics/7/qpoint' },
          { id: 'be7s3', label: 'Active-Region Constraints', route: '/basic-electronics/7/activeregion' },
          { id: 'be7s4', label: 'The DC Load Line & Finding the Q-Point', route: '/basic-electronics/7/loadline' },
          { id: 'be7s5', label: 'Attempt 1: The Fixed-Bias Configuration', route: '/basic-electronics/7/fixedbias' },
          { id: 'be7s6', label: 'The Fatal Flaw & Thermal Runaway', route: '/basic-electronics/7/fatalflaw' },
          { id: 'be7s7', label: 'The Solution: Voltage-Divider Bias', route: '/basic-electronics/7/dividerbias' },
          { id: 'be7s8', label: 'Exact Analysis: The Thevenin Equivalent', route: '/basic-electronics/7/thevenin' },
          { id: 'be7s9', label: 'The Stability Condition & Beta-Independent Proof', route: '/basic-electronics/7/stabilityproof' },
          { id: 'be7s10', label: 'Synthesis: Fixed-Bias vs Voltage-Divider Bias', route: '/basic-electronics/7/synthesis' },
          { id: 'be7s11', label: 'Flashcards - Lock It In', route: '/basic-electronics/7/flashcards' },
          { id: 'be7s12', label: 'Quiz - Test the Q-Point', route: '/basic-electronics/7/quiz' },
          { id: 'be7s13', label: 'Recap - The Stable Vibe in One Page', route: '/basic-electronics/7/recap' },
        ],
      },
      {
        id: 'be8', label: 'BJT AC Analysis', subtitle: 'L7 · AC · SMALL-SIGNAL', route: '/basic-electronics/8/cover',
        submodules: [
          { id: 'be8s0', label: 'BJT AC Analysis', route: '/basic-electronics/8/cover' },
          { id: 'be8s1', label: 'Video - The Small-Signal Idea', route: '/basic-electronics/8/video' },
          { id: 'be8s2', label: 'The Signal in the Noise', route: '/basic-electronics/8/signalinthenoise' },
          { id: 'be8s3', label: 'The Two-Port Black Box', route: '/basic-electronics/8/twoportandhybrid' },
          { id: 'be8s4', label: 'The Four h-Parameters & the Hybrid Circuit', route: '/basic-electronics/8/fourhparameters' },
          { id: 'be8s5', label: 'The re Model: Physical Foundation', route: '/basic-electronics/8/remodel' },
          { id: 'be8s6', label: 'Bridging the Models', route: '/basic-electronics/8/bridgingmodels' },
          { id: 'be8s7', label: 'The 3-Step AC Transformation', route: '/basic-electronics/8/threesteptransform' },
          { id: 'be8s8', label: 'The Golden Trinity: Zi, Zo, Av', route: '/basic-electronics/8/goldentrinity' },
          { id: 'be8s9', label: 'The Early Effect, Loading & Synthesis', route: '/basic-electronics/8/earlyandloading' },
          { id: 'be8s10', label: 'Flashcards - Lock It In', route: '/basic-electronics/8/flashcards' },
          { id: 'be8s11', label: 'Quiz - Test the Amplifier', route: '/basic-electronics/8/quiz' },
          { id: 'be8s12', label: 'Recap - The Amplifier in One Page', route: '/basic-electronics/8/recap' },
        ],
      },
      {
        id: 'be9', label: 'MOSFET Construction', subtitle: 'L8 · MOSFET · CHANNEL', route: '/basic-electronics/9/cover',
        submodules: [
          { id: 'be9s0', label: 'The Voltage Gate', route: '/basic-electronics/9/cover' },
          { id: 'be9s1', label: 'Video - The MOSFET', route: '/basic-electronics/9/video' },
          { id: 'be9s2', label: 'What a MOSFET Is', route: '/basic-electronics/9/whatismosfet' },
          { id: 'be9s3', label: 'The FET Family Tree', route: '/basic-electronics/9/familytree' },
          { id: 'be9s4', label: 'The Metal-Oxide-Semiconductor Stack', route: '/basic-electronics/9/mosstack' },
          { id: 'be9s5', label: 'Gate Current is Zero', route: '/basic-electronics/9/gatecurrentzero' },
          { id: 'be9s6', label: 'Depletion-Type: A Channel Built In', route: '/basic-electronics/9/depletion' },
          { id: 'be9s7', label: 'Enhancement-Type: No Channel Yet', route: '/basic-electronics/9/enhancement' },
          { id: 'be9s8', label: 'Inversion - Creating the Channel', route: '/basic-electronics/9/inversion' },
          { id: 'be9s9', label: 'The Three Operating Regions', route: '/basic-electronics/9/operatingregions' },
          { id: 'be9s10', label: 'Depletion vs Enhancement', route: '/basic-electronics/9/diagnosticmatrix' },
          { id: 'be9s11', label: 'Flashcards - Lock It In', route: '/basic-electronics/9/flashcards' },
          { id: 'be9s12', label: 'Quiz - Test the Gate', route: '/basic-electronics/9/quiz' },
          { id: 'be9s13', label: 'Recap - The Gate in One Page', route: '/basic-electronics/9/recap' },
        ],
      },
      {
        id: 'be10', label: 'Transistors & JFETs', subtitle: 'L9 · JFET · FET vs BJT', route: '/basic-electronics/10/cover',
        submodules: [
          { id: 'be10s0', label: 'The FET vs BJT Showdown', route: '/basic-electronics/10/cover' },
          { id: 'be10s1', label: 'Video - FET vs BJT and the JFET', route: '/basic-electronics/10/video' },
          { id: 'be10s2', label: 'The Core Dichotomy - Bipolar vs Unipolar', route: '/basic-electronics/10/dichotomy' },
          { id: 'be10s3', label: 'General Characteristics Comparison', route: '/basic-electronics/10/comparison' },
          { id: 'be10s4', label: 'The JFET - A Three-Terminal Unipolar Architecture', route: '/basic-electronics/10/jfetterminals' },
          { id: 'be10s5', label: 'N-Channel JFET Construction', route: '/basic-electronics/10/construction' },
          { id: 'be10s6', label: 'Establishing the Field Effect', route: '/basic-electronics/10/fieldeffect' },
          { id: 'be10s7', label: 'Channel Modulation - Pinching the Hose', route: '/basic-electronics/10/pinching' },
          { id: 'be10s8', label: 'Pinch-Off, Idss, and the Shockley Equation', route: '/basic-electronics/10/shockley' },
          { id: 'be10s9', label: 'Transconductance gm - The Gain Handle', route: '/basic-electronics/10/transconductance' },
          { id: 'be10s10', label: 'Architectural Synthesis - Why It Matters', route: '/basic-electronics/10/synthesis' },
          { id: 'be10s11', label: 'Flashcards - Lock It In', route: '/basic-electronics/10/flashcards' },
          { id: 'be10s12', label: 'Quiz - Test the Showdown', route: '/basic-electronics/10/quiz' },
          { id: 'be10s13', label: 'Recap - The Showdown in One Page', route: '/basic-electronics/10/recap' },
        ],
      },
    ],
  },
  {
    id: 'dsd', label: 'DSD', subtitle: 'BOOLEAN · K-MAPS', color: '#34d399',
    modules: [
      {
        id: 'm3', label: 'Binary & Logic', subtitle: 'L3 · BOOLEAN LOGIC', route: '/dsd/1/cover',
        submodules: [
          { id: 'm3s0', label: 'Start · Overture',  route: '/dsd/1/cover'    },
          { id: 'm3s1', label: 'Video Lecture',     route: '/dsd/1/video'    },
          { id: 'm3s2', label: 'Picnic Physics',    route: '/dsd/1/physics'  },
          { id: 'm3s3', label: 'Truth Multiverse',  route: '/dsd/1/multi'    },
          { id: 'm3s4', label: 'Minterms / SOP',    route: '/dsd/1/minterm'  },
          { id: 'm3s5', label: 'Maxterms / POS',    route: '/dsd/1/maxterm'  },
          { id: 'm3s6', label: 'Gate Circuits',     route: '/dsd/1/circuits' },
          { id: 'm3s7', label: 'DeMorgan Bridge',   route: '/dsd/1/lenses'   },
          { id: 'm3s8', label: 'Live Lab',          route: '/dsd/1/lab'      },
          { id: 'm3s9', label: 'K-Map Preview',     route: '/dsd/1/kmap'     },
          { id: 'm3s10', label: 'Practice Arena',   route: '/dsd/1/practice' },
        ],
      },
      {
        id: 'm4', label: 'K-Maps · Architect of Logic', subtitle: 'L4 · MAP REDUCTION', route: '/dsd/2/cover',
        submodules: [
          { id: 'm4s0',  label: 'Start · Overture',          route: '/dsd/2/cover'      },
          { id: 'm4s1',  label: 'Video · EN / हिंदी',         route: '/dsd/2/video'      },
          { id: 'm4s2',  label: 'The 16-Row Headache',       route: '/dsd/2/headache'   },
          { id: 'm4s3',  label: 'Madhur’s Hostel Metaphor',  route: '/dsd/2/hostel'     },
          { id: 'm4s4',  label: 'Rule 1 · Gray Code',        route: '/dsd/2/gray'       },
          { id: 'm4s5',  label: 'Master Floor Plan',         route: '/dsd/2/floor'      },
          { id: 'm4s6',  label: 'Rule 2 · Powers of Two',    route: '/dsd/2/wings'      },
          { id: 'm4s7',  label: 'Rule 3 · Secret Corridors', route: '/dsd/2/corridors'  },
          { id: 'm4s8',  label: 'Today’s Manifest',          route: '/dsd/2/manifest'   },
          { id: 'm4s9',  label: 'Four Operations',           route: '/dsd/2/operations' },
          { id: 'm4s10', label: 'Final Blueprint',           route: '/dsd/2/final'      },
          { id: 'm4s11', label: 'Don’t Care Loophole',       route: '/dsd/2/dontcare'   },
          { id: 'm4s12', label: 'Masterclass',               route: '/dsd/2/master'     },
          { id: 'm4s13', label: 'Practice Arena',            route: '/dsd/2/practice'   },
        ],
      },
      {
        id: 'm5dsd', label: 'Circuit Realisation · Server Vault', subtitle: 'L5 · TT · K-MAP · GATES', route: '/dsd/3/cover',
        submodules: [
          { id: 'm5dsd0', label: 'Cover · From Truth to Hardware', route: '/dsd/3/cover'     },
          { id: 'm5dsd1', label: 'Video · Logic to Hardware',      route: '/dsd/3/video'     },
          { id: 'm5dsd2', label: 'Step 1 · The Server Vault',      route: '/dsd/3/vault'     },
          { id: 'm5dsd3', label: 'Step 2 · Truth Table',           route: '/dsd/3/truth'     },
          { id: 'm5dsd4', label: 'Step 3 · Minterms · SOP',        route: '/dsd/3/minterms'  },
          { id: 'm5dsd5', label: 'Step 4 · K-Map · F = A + BC',    route: '/dsd/3/kmap'      },
          { id: 'm5dsd6', label: 'Step 5 · Wire the Schematic',    route: '/dsd/3/schematic' },
          { id: 'm5dsd7', label: 'Closing · Three Views',          route: '/dsd/3/recap'     },
        ],
      },
      {
        id: 'm6dsd', label: 'Practice Arena · Module 04', subtitle: 'L5 · 12 PROBLEMS · 5 DRILL SETS', route: '/dsd/4/arena',
        submodules: [
          { id: 'm6dsd0', label: 'Arena · 5 drill sets',               route: '/dsd/4/arena'      },
          { id: 'm6dsd1', label: 'Drill 01 · Forward Synthesis',       route: '/dsd/4/forward'    },
          { id: 'm6dsd2', label: 'Drill 02 · Reverse Engineering',     route: '/dsd/4/reverse'    },
          { id: 'm6dsd3', label: 'Drill 03 · K-Map Optimisation',      route: '/dsd/4/optimise'   },
          { id: 'm6dsd4', label: 'Drill 04 · Boss Round',              route: '/dsd/4/boss'       },
          { id: 'm6dsd5', label: 'Cheatsheet · One-page reference',    route: '/dsd/4/cheatsheet' },
        ],
      },
      {
        id: 'm7dsd', label: 'Universal Gates · Module 05', subtitle: 'L5 · NAND / NOR · 8 STAGES', route: '/dsd/5/cover',
        submodules: [
          { id: 'm7dsd0', label: 'Cover · The Universal Gate',         route: '/dsd/5/cover'     },
          { id: 'm7dsd1', label: 'Lecture · Universality Video',       route: '/dsd/5/video'     },
          { id: 'm7dsd2', label: 'Step 1 · The Atom',                  route: '/dsd/5/atom'      },
          { id: 'm7dsd3', label: "Step 2 · De Morgan's Bridge",        route: '/dsd/5/demorgan'  },
          { id: 'm7dsd4', label: 'Level 1 · NOT in 1 gate',            route: '/dsd/5/not'       },
          { id: 'm7dsd5', label: 'Level 2 · AND & OR',                 route: '/dsd/5/or-and'    },
          { id: 'm7dsd6', label: 'Levels 3-4 · Dual + XOR/XNOR',       route: '/dsd/5/dual-xor'  },
          { id: 'm7dsd7', label: 'Master Blueprint',                    route: '/dsd/5/blueprint' },
        ],
      },
      {
        id: 'm8dsd', label: 'Combinational & Sequential · Module 06', subtitle: 'L6 · NOW vs THEN · 12 STAGES', route: '/dsd/6/cover',
        submodules: [
          { id: 'm8dsd0',  label: 'Cover · The Logic of Now and Then', route: '/dsd/6/cover'         },
          { id: 'm8dsd1',  label: 'Video · How Machines Remember',     route: '/dsd/6/video'         },
          { id: 'm8dsd2',  label: 'Two Flavors of Logic',              route: '/dsd/6/flavors'       },
          { id: 'm8dsd3',  label: 'Prisoners of the Present',          route: '/dsd/6/combinational' },
          { id: 'm8dsd4',  label: 'The Memoryless Tea Vendor',         route: '/dsd/6/teastall'      },
          { id: 'm8dsd5',  label: 'Adders, MUX & Friends',             route: '/dsd/6/jobs'          },
          { id: 'm8dsd6',  label: 'The Problem with Now',              route: '/dsd/6/limit'         },
          { id: 'm8dsd7',  label: 'The Cricket Scoreboard',            route: '/dsd/6/scoreboard'    },
          { id: 'm8dsd8',  label: 'Trapping a Bit',                    route: '/dsd/6/trap'          },
          { id: 'm8dsd9',  label: 'The Heartbeat Clock',               route: '/dsd/6/clock'         },
          { id: 'm8dsd10', label: 'Now vs Then · Face Off',            route: '/dsd/6/faceoff'       },
          { id: 'm8dsd11', label: 'Practice Arena',                    route: '/dsd/6/practice'      },
        ],
      },
      {
        id: 'm9dsd', label: 'The Half Adder · Module 07', subtitle: 'L7 · FACTS TO REAL BUILD · 11 STAGES', route: '/dsd/7/cover',
        submodules: [
          { id: 'm9dsd0',  label: 'Cover · The Half Adder',            route: '/dsd/7/cover'     },
          { id: 'm9dsd1',  label: 'Definition & Truth Table',          route: '/dsd/7/basics'    },
          { id: 'm9dsd2',  label: 'Video · Demystifying Half Adders',  route: '/dsd/7/video'     },
          { id: 'm9dsd3',  label: 'The Marble Box',                    route: '/dsd/7/box'       },
          { id: 'm9dsd4',  label: 'The Overflow Mechanism',            route: '/dsd/7/overflow'  },
          { id: 'm9dsd5',  label: 'The Sum Wire · XOR',                route: '/dsd/7/xor'       },
          { id: 'm9dsd6',  label: 'The Carry Wire · AND',              route: '/dsd/7/and'       },
          { id: 'm9dsd7',  label: 'Wiring the Blueprint',              route: '/dsd/7/blueprint' },
          { id: 'm9dsd8',  label: 'Why Only Half?',                    route: '/dsd/7/half'      },
          { id: 'm9dsd9',  label: 'Practice Arena',                    route: '/dsd/7/practice'  },
          { id: 'm9dsd10', label: 'Build It For Real · Workbench',     route: '/dsd/7/build'     },
        ],
      },
      {
        id: 'm10dsd', label: 'The Full Adder · Module 08', subtitle: 'L8 · TWO HALVES MAKE A WHOLE · 10 STAGES', route: '/dsd/8/cover',
        submodules: [
          { id: 'm10dsd0', label: 'Cover · The Full Adder',            route: '/dsd/8/cover'        },
          { id: 'm10dsd1', label: 'The Functional Interface',          route: '/dsd/8/interface'    },
          { id: 'm10dsd2', label: 'Video · The Full Adder',            route: '/dsd/8/video'        },
          { id: 'm10dsd3', label: 'The Sum · Triple XOR',              route: '/dsd/8/sum'          },
          { id: 'm10dsd4', label: 'The Carry · Majority Vote',         route: '/dsd/8/carry'        },
          { id: 'm10dsd5', label: 'The Eight Rows',                    route: '/dsd/8/truth'        },
          { id: 'm10dsd6', label: 'Half vs Full',                      route: '/dsd/8/evolution'    },
          { id: 'm10dsd7', label: 'Two Halves Make a Whole',           route: '/dsd/8/architecture' },
          { id: 'm10dsd8', label: 'Practice Arena',                    route: '/dsd/8/practice'     },
          { id: 'm10dsd9', label: 'Build It For Real · Workbench',     route: '/dsd/8/build'        },
        ],
      },
      {
        id: 'm11dsd', label: 'Recall & Prove · Module 09', subtitle: 'L9 · FLASH CARDS + DRILLS · 7 STAGES', route: '/dsd/9/cover',
        submodules: [
          { id: 'm11dsd0', label: 'Cover · Recall & Prove',            route: '/dsd/9/cover'         },
          { id: 'm11dsd1', label: 'The Recall Deck · Flash Cards',     route: '/dsd/9/deck'          },
          { id: 'm11dsd2', label: 'Combinational Drill',               route: '/dsd/9/combinational' },
          { id: 'm11dsd3', label: 'Sequential Drill',                  route: '/dsd/9/sequential'    },
          { id: 'm11dsd4', label: 'Adders Drill',                      route: '/dsd/9/adders'        },
          { id: 'm11dsd5', label: 'Mixed Boss Round',                  route: '/dsd/9/boss'          },
          { id: 'm11dsd6', label: 'The Cheatsheet',                    route: '/dsd/9/recap'         },
        ],
      },
      {
        id: 'm12rca', label: 'The Ripple-Carry Adder · Module 10', subtitle: 'L10 · THE DIGITAL RELAY · 9 STAGES', route: '/dsd/10/cover',
        submodules: [
          { id: 'm12rca0', label: 'Cover · The Ripple-Carry Adder',    route: '/dsd/10/cover'     },
          { id: 'm12rca1', label: 'The Digital Relay · Analogy',       route: '/dsd/10/analogy'   },
          { id: 'm12rca2', label: 'Video · Ripple Carry Adders',       route: '/dsd/10/video'     },
          { id: 'm12rca3', label: 'Building the Relay Team',           route: '/dsd/10/build'     },
          { id: 'm12rca4', label: 'Watch the Carry Ripple',           route: '/dsd/10/ripple'    },
          { id: 'm12rca5', label: 'The Cost of Waiting',              route: '/dsd/10/delay'     },
          { id: 'm12rcaC', label: 'The Full Circuit · Schematic',     route: '/dsd/10/circuit'   },
          { id: 'm12rca6', label: 'Practice Arena',                   route: '/dsd/10/practice'  },
          { id: 'm12rca7', label: 'Recap & Verilog',                  route: '/dsd/10/recap'     },
        ],
      },
      {
        id: 'm13cla', label: 'The Carry Look-Ahead Adder · Module 11', subtitle: 'L11 · THE PARALLEL CHEF · 9 STAGES', route: '/dsd/11/cover',
        submodules: [
          { id: 'm13cla0', label: 'Cover · Carry Look-Ahead',          route: '/dsd/11/cover'    },
          { id: 'm13cla1', label: 'The Master Chef · Analogy',         route: '/dsd/11/analogy'  },
          { id: 'm13cla2', label: 'Video · Carry Look-Ahead',          route: '/dsd/11/video'    },
          { id: 'm13cla3', label: 'Generate & Propagate',             route: '/dsd/11/gp'       },
          { id: 'm13cla4', label: 'Predicting Every Carry',           route: '/dsd/11/carries'  },
          { id: 'm13cla5', label: 'Speed vs Cost',                    route: '/dsd/11/compare'  },
          { id: 'm13claC', label: 'The Full Circuit · Schematic',     route: '/dsd/11/circuit'  },
          { id: 'm13cla6', label: 'Practice Arena',                   route: '/dsd/11/practice' },
          { id: 'm13cla7', label: 'Recap & Verilog',                  route: '/dsd/11/recap'    },
        ],
      },
      {
        id: 'm14ppa', label: 'The Parallel Prefix Adder · Module 12', subtitle: 'L12 · LOGARITHMIC CARRY · 9 STAGES', route: '/dsd/12/cover',
        submodules: [
          { id: 'm14ppa0', label: 'Cover · Parallel Prefix',           route: '/dsd/12/cover'      },
          { id: 'm14ppa1', label: 'The Tournament of Carries',         route: '/dsd/12/concept'    },
          { id: 'm14ppa2', label: 'Video · Parallel Prefix',           route: '/dsd/12/video'      },
          { id: 'm14ppa3', label: 'The Black Cell',                    route: '/dsd/12/blackcell'  },
          { id: 'm14ppa4', label: 'The Prefix Network',                route: '/dsd/12/tree'       },
          { id: 'm14ppa5', label: 'Phases & Topologies',               route: '/dsd/12/topologies' },
          { id: 'm14ppaC', label: 'The Full Circuit · Schematic',       route: '/dsd/12/circuit'    },
          { id: 'm14ppa6', label: 'Practice Arena',                    route: '/dsd/12/practice'   },
          { id: 'm14ppa7', label: 'Recap & Verilog',                   route: '/dsd/12/recap'      },
        ],
      },
      {
        id: 'm15dsd', label: 'The Serial Adder · Module 13', subtitle: 'L13 · TRADE TIME FOR SPACE · 9 STAGES', route: '/dsd/13/cover',
        submodules: [
          { id: 'm15dsd0', label: 'Cover · The Serial Adder',          route: '/dsd/13/cover'        },
          { id: 'm15dsd1', label: 'The Highway of Logic · Analogy',    route: '/dsd/13/analogy'      },
          { id: 'm15dsd2', label: 'Video · Serial Adders',             route: '/dsd/13/video'        },
          { id: 'm15dsd3', label: 'The Datapath',                      route: '/dsd/13/architecture' },
          { id: 'm15dsd4', label: 'Live Serial Addition',              route: '/dsd/13/walkthrough'  },
          { id: 'm15dsd5', label: 'Time vs Space',                     route: '/dsd/13/timing'       },
          { id: 'm15dsdC', label: 'The Full Circuit · Schematic',      route: '/dsd/13/circuit'      },
          { id: 'm15dsd6', label: 'Practice Arena',                    route: '/dsd/13/practice'     },
          { id: 'm15dsd7', label: 'Recap & Verilog',                   route: '/dsd/13/recap'        },
        ],
      },
      {
        id: 'm16dsd', label: 'Recall & Prime · Module 14', subtitle: 'L14 · WARM UP THE ADDER · 6 STAGES', route: '/dsd/14/cover',
        submodules: [
          { id: 'm16dsd0', label: 'Recall & Prime',             route: '/dsd/14/cover'         },
          { id: 'm16dsd1', label: 'The Recall Deck',            route: '/dsd/14/deck'          },
          { id: 'm16dsd2', label: 'Binary Subtraction by Hand', route: '/dsd/14/binary'        },
          { id: 'm16dsd3', label: 'Carry vs Borrow',            route: '/dsd/14/borrowvscarry' },
          { id: 'm16dsd4', label: 'Recall Boss Round',          route: '/dsd/14/quiz'          },
          { id: 'm16dsd5', label: 'The Cheatsheet',             route: '/dsd/14/recap'         },
        ],
      },
      {
        id: 'm17dsd', label: 'How Computers Subtract · Module 15', subtitle: 'L15 · THE CALCULATOR ILLUSION · 9 STAGES', route: '/dsd/15/cover',
        submodules: [
          { id: 'm17dsd0', label: 'The Calculator Illusion',               route: '/dsd/15/cover'           },
          { id: 'm17dsd1', label: 'Video - How Computers Subtract',        route: '/dsd/15/video'           },
          { id: 'm17dsd2', label: 'The Grand Deception',                   route: '/dsd/15/deception'       },
          { id: 'm17dsd3', label: "Two's Complement - The Negative Maker", route: '/dsd/15/twoscomplement'  },
          { id: 'm17dsd4', label: 'The Mode Bit M - One Circuit, Two Jobs', route: '/dsd/15/modebit'        },
          { id: 'm17dsd5', label: 'The XOR Shape-Shifter',                 route: '/dsd/15/xorshapeshifter' },
          { id: 'm17dsd6', label: 'Flashcards - Lock It In',               route: '/dsd/15/flashcards'      },
          { id: 'm17dsd7', label: 'Quiz - Test the Illusion',              route: '/dsd/15/quiz'            },
          { id: 'm17dsd8', label: 'Recap - The Secret in One Page',        route: '/dsd/15/recap'           },
        ],
      },
      {
        id: 'm18dsd', label: 'The Half Subtractor · Module 16', subtitle: 'L16 · BINARY PARKING LOGIC · 12 STAGES', route: '/dsd/16/cover',
        submodules: [
          { id: 'm18dsd0',  label: 'Binary Parking Logic',           route: '/dsd/16/cover'      },
          { id: 'm18dsd1',  label: 'The Half Subtractor',            route: '/dsd/16/video'      },
          { id: 'm18dsd2',  label: 'Adarsh & The Variables',         route: '/dsd/16/setup'      },
          { id: 'm18dsd3',  label: "Adarsh's Logbook - 4 Scenarios", route: '/dsd/16/logbook'    },
          { id: 'm18dsd4',  label: 'The Truth Table',                route: '/dsd/16/truthtable' },
          { id: 'm18dsd5',  label: 'The Difference: D = x XOR y',     route: '/dsd/16/difference' },
          { id: 'm18dsd6',  label: "The Borrow: B = x'y",            route: '/dsd/16/borrow'     },
          { id: 'm18dsd7',  label: 'The Blueprint',                  route: '/dsd/16/circuit'    },
          { id: 'm18dsd8',  label: 'Run The Lot',                    route: '/dsd/16/activity'   },
          { id: 'm18dsd9',  label: 'Flashcards',                     route: '/dsd/16/flashcards' },
          { id: 'm18dsd10', label: 'Quiz Arena',                     route: '/dsd/16/quiz'       },
          { id: 'm18dsd11', label: 'Recap & The Amnesia Problem',    route: '/dsd/16/recap'      },
        ],
      },
      {
        id: 'm19dsd', label: 'The Full Subtractor · Module 17', subtitle: 'L17 · THE DIGITAL LEDGER · 13 STAGES', route: '/dsd/17/cover',
        submodules: [
          { id: 'm19dsd0',  label: 'The Full Subtractor',    route: '/dsd/17/cover'          },
          { id: 'm19dsd1',  label: 'Watch: Full Subtractor', route: '/dsd/17/video'          },
          { id: 'm19dsd2',  label: 'The Three Inputs',       route: '/dsd/17/variables'      },
          { id: 'm19dsd3',  label: 'Half vs Full',           route: '/dsd/17/halfvsfull'     },
          { id: 'm19dsd4',  label: 'The Two Outputs',        route: '/dsd/17/processing'     },
          { id: 'm19dsd5',  label: 'The Transaction Log',    route: '/dsd/17/transactionlog' },
          { id: 'm19dsd6',  label: 'Truth Table',            route: '/dsd/17/truthtable'     },
          { id: 'm19dsd7',  label: 'The Logic',              route: '/dsd/17/logic'          },
          { id: 'm19dsd8',  label: 'The Circuit',            route: '/dsd/17/circuit'        },
          { id: 'm19dsd9',  label: 'Try It Yourself',        route: '/dsd/17/activity'       },
          { id: 'm19dsd10', label: 'Flashcards',             route: '/dsd/17/flashcards'     },
          { id: 'm19dsd11', label: 'Quiz',                   route: '/dsd/17/quiz'           },
          { id: 'm19dsd12', label: 'Recap',                  route: '/dsd/17/recap'          },
        ],
      },
      {
        id: 'm20dsd', label: 'Complements · Module 18', subtitle: 'L18 · THE MIRROR TRICK · 11 STAGES', route: '/dsd/18/cover',
        submodules: [
          { id: 'm20dsd0',  label: 'The Mirror Trick',       route: '/dsd/18/cover'        },
          { id: 'm20dsd1',  label: 'Watch: Complements',     route: '/dsd/18/video'        },
          { id: 'm20dsd2',  label: 'Why Borrowing Is Costly', route: '/dsd/18/whyborrow'   },
          { id: 'm20dsd3',  label: 'Radix vs Diminished',    route: '/dsd/18/twofamilies'  },
          { id: 'm20dsd4',  label: 'Making The Mirror',      route: '/dsd/18/themirror'    },
          { id: 'm20dsd5',  label: 'The Three-Step Recipe',  route: '/dsd/18/threesteps'   },
          { id: 'm20dsd6',  label: 'Reading The Carry',      route: '/dsd/18/readcarry'    },
          { id: 'm20dsd7',  label: 'Work It Through',        route: '/dsd/18/workedproofs' },
          { id: 'm20dsd8',  label: 'Flashcards',             route: '/dsd/18/flashcards'   },
          { id: 'm20dsd9',  label: 'Quiz',                   route: '/dsd/18/quiz'         },
          { id: 'm20dsd10', label: 'Recap',                  route: '/dsd/18/recap'        },
        ],
      },
      {
        id: 'm21dsd', label: "The 10's Complement · Module 19", subtitle: 'L19 · DISCARD THE CARRY · 10 STAGES', route: '/dsd/19/cover',
        submodules: [
          { id: 'm21dsd0', label: "Discard, Don't Carry",    route: '/dsd/19/cover'         },
          { id: 'm21dsd1', label: 'Watch: 10s Complement',   route: '/dsd/19/video'         },
          { id: 'm21dsd2', label: 'The Radix Mirror',        route: '/dsd/19/radixidea'     },
          { id: 'm21dsd3', label: 'Run The Subtractor',      route: '/dsd/19/tenscalc'      },
          { id: 'm21dsd4', label: 'The Two Endings',         route: '/dsd/19/twocases'      },
          { id: 'm21dsd5', label: "9's vs 10's",             route: '/dsd/19/carrycontrast' },
          { id: 'm21dsd6', label: 'The Hardware Bridge',     route: '/dsd/19/hardware'      },
          { id: 'm21dsd7', label: 'Flashcards',              route: '/dsd/19/flashcards'    },
          { id: 'm21dsd8', label: 'Quiz',                    route: '/dsd/19/quiz'          },
          { id: 'm21dsd9', label: 'Recap',                   route: '/dsd/19/recap'         },
        ],
      },
      {
        id: 'm22dsd', label: 'The BCD Adder · Module 20', subtitle: 'L20 · THE ODOMETER HACK · 11 STAGES', route: '/dsd/20/cover',
        submodules: [
          { id: 'm22dsd0',  label: 'The Odometer Hack',      route: '/dsd/20/cover'       },
          { id: 'm22dsd1',  label: 'Watch: BCD Adders',      route: '/dsd/20/video'       },
          { id: 'm22dsd2',  label: 'The Forbidden Six',      route: '/dsd/20/forbidden'   },
          { id: 'm22dsd3',  label: 'The Sum Reaches 19',     route: '/dsd/20/gap'         },
          { id: 'm22dsd4',  label: 'Detecting Overflow',     route: '/dsd/20/detect'      },
          { id: 'm22dsd5',  label: 'The State Matrix',       route: '/dsd/20/statematrix' },
          { id: 'm22dsd6',  label: 'The Blueprint',          route: '/dsd/20/circuit'     },
          { id: 'm22dsd7',  label: 'Build A BCD Adder',      route: '/dsd/20/adderdemo'   },
          { id: 'm22dsd8',  label: 'Flashcards',             route: '/dsd/20/flashcards'  },
          { id: 'm22dsd9',  label: 'Quiz',                   route: '/dsd/20/quiz'        },
          { id: 'm22dsd10', label: 'Recap',                  route: '/dsd/20/recap'       },
        ],
      },
      {
        id: 'dsd21', label: 'Multiplexer (MUX)', subtitle: 'L21 · MANY-TO-1 · SELECT', route: '/dsd/21/cover',
        submodules: [
          { id: 'm21s0', label: 'The Digital Track Switch', route: '/dsd/21/cover' },
          { id: 'm21s1', label: 'Multiplexers, The Track Switch', route: '/dsd/21/video' },
          { id: 'm21s2', label: 'What A Multiplexer Is', route: '/dsd/21/whatis' },
          { id: 'm21s3', label: 'Sizing Rule, Inputs vs Selects', route: '/dsd/21/sizing' },
          { id: 'm21s4', label: 'The 2-to-1 MUX, Gate Level', route: '/dsd/21/twotoone' },
          { id: 'm21s5', label: 'The 4-to-1 MUX, Gate Level', route: '/dsd/21/fourtoone' },
          { id: 'm21s6', label: 'MUX As A Universal LUT', route: '/dsd/21/lut' },
          { id: 'm21s7', label: 'Worked Example, XOR From A 4-to-1 MUX', route: '/dsd/21/xorlut' },
          { id: 'm21s8', label: 'Enable Input And Cascading', route: '/dsd/21/enablecascade' },
          { id: 'm21s9', label: 'Build The 4-to-1 MUX For Real', route: '/dsd/21/build' },
          { id: 'm21s10', label: 'Flashcards', route: '/dsd/21/flashcards' },
          { id: 'm21s11', label: 'Quiz Arena', route: '/dsd/21/quiz' },
          { id: 'm21s12', label: 'Recap & Sources', route: '/dsd/21/recap' },
        ],
      },
      {
        id: 'dsd22', label: 'Demultiplexer (DEMUX)', subtitle: 'L22 · 1-TO-MANY · ROUTE', route: '/dsd/22/cover',
        submodules: [
          { id: 'm22s0', label: 'One Input, Many Destinations', route: '/dsd/22/cover' },
          { id: 'm22s1', label: 'The Demultiplexer', route: '/dsd/22/video' },
          { id: 'm22s2', label: 'What A Demultiplexer Does', route: '/dsd/22/whatdoes' },
          { id: 'm22s3', label: 'Sizing: Selects vs Outputs', route: '/dsd/22/sizing' },
          { id: 'm22s4', label: 'The Routing Equation', route: '/dsd/22/routing' },
          { id: 'm22s5', label: '1-to-2 DEMUX (Gate Level)', route: '/dsd/22/onetotwo' },
          { id: 'm22s6', label: '1-to-4 DEMUX (Build It)', route: '/dsd/22/onetofour' },
          { id: 'm22s7', label: 'Truth Table View', route: '/dsd/22/truthview' },
          { id: 'm22s8', label: 'DEMUX vs Decoder vs MUX', route: '/dsd/22/vsdecoder' },
          { id: 'm22s9', label: 'Proofs & Derivations', route: '/dsd/22/proofs' },
          { id: 'm22s10', label: 'Build The DEMUX For Real', route: '/dsd/22/build' },
          { id: 'm22s11', label: 'Flashcards', route: '/dsd/22/flashcards' },
          { id: 'm22s12', label: 'Quiz Arena', route: '/dsd/22/quiz' },
          { id: 'm22s13', label: 'Recap & Sources', route: '/dsd/22/recap' },
        ],
      },
      {
        id: 'dsd23', label: 'Decoders', subtitle: 'L23 · ONE-HOT · MINTERMS', route: '/dsd/23/cover',
        submodules: [
          { id: 'm23s0', label: 'The One-Hot Selector', route: '/dsd/23/cover' },
          { id: 'm23s1', label: 'Decoders - The Digital Selector', route: '/dsd/23/video' },
          { id: 'm23s2', label: 'n In, 2^n Out', route: '/dsd/23/nintwopown' },
          { id: 'm23s3', label: 'Outputs Are Minterms', route: '/dsd/23/minterms' },
          { id: 'm23s4', label: 'Inside The 2-to-4 Hardware', route: '/dsd/23/hardware' },
          { id: 'm23s5', label: 'The Enable Input', route: '/dsd/23/enable' },
          { id: 'm23s6', label: 'Decoder vs Demultiplexer', route: '/dsd/23/demux' },
          { id: 'm23s7', label: 'Active-High vs Active-Low', route: '/dsd/23/activelow' },
          { id: 'm23s8', label: 'Build Any Function With A Decoder', route: '/dsd/23/buildanyfunction' },
          { id: 'm23s9', label: 'Proofs, Step By Step', route: '/dsd/23/derivations' },
          { id: 'm23s10', label: 'Build The Decoder For Real', route: '/dsd/23/build' },
          { id: 'm23s11', label: 'Flashcards', route: '/dsd/23/flashcards' },
          { id: 'm23s12', label: 'Quiz Arena', route: '/dsd/23/quiz' },
          { id: 'm23s13', label: 'Recap & Selector Mastered', route: '/dsd/23/recap' },
        ],
      },
      {
        id: 'dsd24', label: 'Encoders', subtitle: 'L24 · PRIORITY · VALID', route: '/dsd/24/cover',
        submodules: [
          { id: 'm24s0', label: 'The Voting Booth', route: '/dsd/24/cover' },
          { id: 'm24s1', label: 'Encoders - The Voting Booth', route: '/dsd/24/video' },
          { id: 'm24s2', label: 'What An Encoder Does', route: '/dsd/24/inverse' },
          { id: 'm24s3', label: 'The Voting Booth Mapping', route: '/dsd/24/booth' },
          { id: 'm24s4', label: '4-to-2 Logic Core', route: '/dsd/24/core' },
          { id: 'm24s5', label: 'The Two Fatal Flaws', route: '/dsd/24/flaws' },
          { id: 'm24s6', label: 'Priority Encoders', route: '/dsd/24/priority' },
          { id: 'm24s7', label: 'The Valid Bit V', route: '/dsd/24/valid' },
          { id: 'm24s8', label: 'Worked Priority Truth Table', route: '/dsd/24/table' },
          { id: 'm24s9', label: 'Building Bigger & The Family', route: '/dsd/24/family' },
          { id: 'm24s10', label: 'Build The Encoders For Real', route: '/dsd/24/build' },
          { id: 'm24s11', label: 'Flashcards', route: '/dsd/24/flashcards' },
          { id: 'm24s12', label: 'Quiz Arena', route: '/dsd/24/quiz' },
          { id: 'm24s13', label: 'Recap & Encoder Mastered', route: '/dsd/24/recap' },
        ],
      },
      {
        id: 'dsd25', label: 'Code Converters', subtitle: 'L25 · BINARY · GRAY · BCD', route: '/dsd/25/cover',
        submodules: [
          { id: 'm25s0', label: 'The Translator Booth', route: '/dsd/25/cover' },
          { id: 'm25s1', label: 'Code Converters - Number Languages', route: '/dsd/25/video' },
          { id: 'm25s2', label: 'What a Code Converter Is', route: '/dsd/25/whatis' },
          { id: 'm25s3', label: 'The General Design Method', route: '/dsd/25/method' },
          { id: 'm25s4', label: 'Binary to Gray - The Forward XOR Cascade', route: '/dsd/25/bin2gray' },
          { id: 'm25s5', label: 'Gray to Binary - The Running XOR', route: '/dsd/25/gray2bin' },
          { id: 'm25s6', label: 'Why Gray Code - Glitch-Free Steps', route: '/dsd/25/whygray' },
          { id: 'm25s7', label: 'BCD and Excess-3 - Decimal-Friendly Codes', route: '/dsd/25/bcdxs3' },
          { id: 'm25s8', label: 'BCD <-> Excess-3 & The Master Matrix', route: '/dsd/25/matrix' },
          { id: 'm25s9', label: 'Build the Converters For Real', route: '/dsd/25/build' },
          { id: 'm25s10', label: 'Flashcards', route: '/dsd/25/flashcards' },
          { id: 'm25s11', label: 'Quiz Arena', route: '/dsd/25/quiz' },
          { id: 'm25s12', label: 'Recap & Track Complete', route: '/dsd/25/recap' },
        ],
      },
      {
        id: 'dsd26', label: 'Universal Logic & Shannon', subtitle: 'L26 · NAND · MUX UNIVERSAL', route: '/dsd/26/cover',
        submodules: [
          { id: 'm26s0', label: 'One Tool For All', route: '/dsd/26/cover' },
          { id: 'm26s1', label: 'Universal Logic & Shannon', route: '/dsd/26/video' },
          { id: 'm26s2', label: 'What Universal Means', route: '/dsd/26/universal' },
          { id: 'm26s3', label: 'Folding NOT, AND, OR Out Of NAND', route: '/dsd/26/nandfoldout' },
          { id: 'm26s4', label: 'The Gate-Level Build', route: '/dsd/26/gatelevel' },
          { id: 'm26s5', label: 'NOR Is Universal Too', route: '/dsd/26/nordual' },
          { id: 'm26s6', label: 'Shannon', route: '/dsd/26/shannon' },
          { id: 'm26s7', label: 'Worked Derivation & Proof', route: '/dsd/26/derivation' },
          { id: 'm26s8', label: 'Shannon = A 2-to-1 MUX', route: '/dsd/26/muxshannon' },
          { id: 'm26s9', label: 'Building A MUX Tree', route: '/dsd/26/muxtree' },
          { id: 'm26s10', label: 'Build It For Real', route: '/dsd/26/build' },
          { id: 'm26s11', label: 'Flashcards', route: '/dsd/26/flashcards' },
          { id: 'm26s12', label: 'Quiz', route: '/dsd/26/quiz' },
          { id: 'm26s13', label: 'Recap', route: '/dsd/26/recap' },
        ],
      },
      {
        id: 'dsd27', label: 'Binary Dividers', subtitle: 'L27 · ARRAY · DIVISION', route: '/dsd/27/cover',
        submodules: [
          { id: 'm27s0', label: 'The Chocolate Sharing Grid', route: '/dsd/27/cover' },
          { id: 'm27s1', label: 'Binary Dividers - Long Division in Hardware', route: '/dsd/27/video' },
          { id: 'm27s2', label: 'What a Divider Computes', route: '/dsd/27/identity' },
          { id: 'm27s3', label: 'The Algorithm We Are Freezing', route: '/dsd/27/schoolbook' },
          { id: 'm27s4', label: 'The Unit Cell = Controlled Subtractor', route: '/dsd/27/unitcell' },
          { id: 'm27s5', label: 'Building the Full Subtractor', route: '/dsd/27/fullsub' },
          { id: 'm27s6', label: 'The 2-to-1 MUX: The Restore Switch', route: '/dsd/27/mux' },
          { id: 'm27s7', label: 'The Array: A Cascading Matrix', route: '/dsd/27/array' },
          { id: 'm27s8', label: 'Quotient and Remainder Read-Out', route: '/dsd/27/readout' },
          { id: 'm27s9', label: 'Sizing the Array', route: '/dsd/27/sizing' },
          { id: 'm27s10', label: 'Build It For Real', route: '/dsd/27/build' },
          { id: 'm27s11', label: 'Flashcards', route: '/dsd/27/flashcards' },
          { id: 'm27s12', label: 'Quiz Arena', route: '/dsd/27/quiz' },
          { id: 'm27s13', label: 'Recap & Sources', route: '/dsd/27/recap' },
        ],
      },
    ],
  },
  {
    // Verilog track is being rebuilt - show a "Coming soon" placeholder instead
    // of module entries until the new HDL content ships.
    id: 'verilog', label: 'Verilog', subtitle: 'HDL · SYNTHESIS', color: '#a78bfa',
    comingSoon: true,
    modules: [],
  },
];

// Directional cross-slide for the module list when the active track changes.
const TRACK_VARIANTS = {
  enter:  (d: number) => ({ opacity: 0, x: d >= 0 ? 46 : -46 }),
  center: { opacity: 1, x: 0 },
  exit:   (d: number) => ({ opacity: 0, x: d >= 0 ? -46 : 46 }),
};

const L6PathSwitcher: React.FC<{ onPick: (route: string) => void }> = ({ onPick }) => {
  const [scheme] = useColorScheme();
  const isLight = scheme === 'light';
  const [selIdx, setSelIdx] = useState(0);
  const [dir, setDir] = useState(0);              // -1 = slid left, +1 = slid right
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const pathSel = L6_PATHS[selIdx];
  // Light mode darkens the shared path color so figures read on white.
  const accent = isLight ? darkenFigure(pathSel.color) : pathSel.color;

  const pickTrack = (idx: number) => {
    if (idx === selIdx) return;
    setDir(idx > selIdx ? 1 : -1);
    setSelIdx(idx);
    setExpandedId(null);
  };

  return (
    <div className="w-full max-w-[760px] flex flex-col items-stretch gap-5">
      {/* ─── Segmented track switcher: one tap, sliding pill, no hidden menu ─── */}
      <div
        role="tablist"
        aria-label="Learning track"
        className={`relative self-center w-full max-w-[580px] grid grid-cols-3 gap-1 p-1.5 rounded-2xl border-2 border-edge shadow-brutal-sm ${
          isLight ? 'bg-slate-100' : 'bg-[#070810]'
        }`}
      >
        {L6_PATHS.map((opt, idx) => {
          const isActive = idx === selIdx;
          const optColor = isLight ? darkenFigure(opt.color) : opt.color;
          return (
            <button
              key={opt.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => pickTrack(idx)}
              className="relative px-2 py-2.5 rounded-xl outline-none transition-colors"
            >
              {/* the single pill physically slides from the old tab to the new one */}
              {isActive && (
                <motion.span
                  layoutId="trackPill"
                  className="absolute inset-0 rounded-xl"
                  style={{
                    backgroundColor: isLight ? '#FFFFFF' : `${opt.color}1c`,
                    border: `1px solid ${isLight ? optColor : `${opt.color}66`}`,
                    boxShadow: isLight ? '0 2px 10px rgba(15,23,42,0.14)' : `0 0 18px ${opt.color}22`,
                  }}
                  transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                />
              )}
              <span className="relative z-10 flex flex-col items-center gap-1 leading-tight">
                <span className="flex items-center gap-1.5">
                  <motion.span className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: optColor, boxShadow: `0 0 6px ${optColor}` }}
                    animate={isActive ? { opacity: [0.5, 1, 0.5] } : { opacity: 0.45 }}
                    transition={{ duration: 2, repeat: Infinity }} />
                  <span className="text-[12px] sm:text-[13px] font-mono font-semibold text-center"
                    style={{ color: isActive ? (isLight ? '#0F172A' : '#fff') : (isLight ? '#475569' : 'rgba(255,255,255,0.55)') }}>
                    {opt.label}
                  </span>
                </span>
                <span className="text-[8px] sm:text-[9px] font-mono tracking-[0.16em] uppercase"
                  style={{ color: isActive ? (isLight ? optColor : `${opt.color}cc`) : (isLight ? '#94A3B8' : 'rgba(255,255,255,0.3)') }}>
                  {opt.comingSoon ? 'Coming soon' : `${opt.modules.length} modules`}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      {/* active-track subtitle, fades on switch */}
      <AnimatePresence mode="wait">
        <motion.div
          key={pathSel.id + '-sub'}
          initial={{ opacity: 0, y: -3 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 3 }}
          transition={{ duration: 0.18 }}
          className="self-center -mt-2 text-[10px] font-mono tracking-[0.26em] uppercase text-center"
          style={{ color: isLight ? '#334155' : `${accent}aa` }}
        >
          {pathSel.subtitle}
        </motion.div>
      </AnimatePresence>

      {/* ─── Module list: directional cross-slide as the track changes ─── */}
      <AnimatePresence mode="wait" custom={dir}>
        <motion.ul
          key={pathSel.id}
          custom={dir}
          variants={TRACK_VARIANTS}
          initial="enter" animate="center" exit="exit"
          transition={{ duration: 0.26, ease: 'easeInOut' }}
          className="w-full flex flex-col gap-3">
        {pathSel.comingSoon ? (
          <motion.li
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}
            className="flex flex-col items-center gap-3 rounded-2xl border p-12 text-center"
            style={{
              borderColor: isLight ? '#94A3B8' : 'rgba(255,255,255,0.1)',
              background: isLight ? '#FFFFFF' : 'rgba(6,7,12,0.55)',
            }}>
            <div className="text-2xl font-black" style={{ color: isLight ? '#0F172A' : '#fff' }}>Coming soon</div>
            <p className="max-w-md text-[14px] leading-relaxed" style={{ color: isLight ? '#475569' : 'rgba(255,255,255,0.6)' }}>
              The Verilog track is being rebuilt. Modules, testbenches and synthesis labs are on the way - master the Basic Electronics and DSD tracks first.
            </p>
          </motion.li>
        ) : pathSel.modules.map((mod, idx) => {
          const isOpen = expandedId === mod.id;
          const locked = isModuleLocked(mod.submodules[0]?.route ?? mod.route);
          return (
            <motion.li key={mod.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -2 }}
              transition={{ delay: idx * 0.05, type: 'spring', stiffness: 260, damping: 24 }}
              className="rounded-md border overflow-hidden"
              style={{
                borderColor: isOpen ? (isLight ? accent : `${accent}66`) : (isLight ? '#94A3B8' : 'rgba(255,255,255,0.08)'),
                backgroundColor: isLight ? '#FFFFFF' : 'rgba(6,7,12,0.72)',
                boxShadow: isOpen ? `0 0 18px ${accent}1f` : (isLight ? '0 1px 3px rgba(15,23,42,0.16)' : 'none'),
                transition: 'border-color 0.2s, box-shadow 0.2s',
              }}>
              <button type="button"
                onClick={() => setExpandedId(isOpen ? null : mod.id)}
                className={`group w-full flex items-center gap-4 px-4 py-3.5 text-left transition-colors ${
                  isLight ? 'hover:bg-slate-50' : 'hover:bg-white/[0.02]'
                }`}>
                <div className="flex-shrink-0 w-9 h-9 rounded-md flex items-center justify-center font-mono font-bold text-[15px] transition-transform duration-200 group-hover:scale-110"
                  style={{
                    backgroundColor: isLight ? `${accent}26` : `${accent}1a`,
                    border: isLight ? `1px solid ${accent}66` : `1px solid ${accent}33`,
                    color: accent,
                  }}>
                  {idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className={`text-[15px] font-semibold truncate ${isLight ? 'text-[#0F172A]' : 'text-white/95'}`}>{mod.label}</div>
                  <div className="text-[11px] font-mono tracking-[0.2em] uppercase mt-0.5" style={{ color: isLight ? '#1D4ED8' : `${accent}aa` }}>
                    {mod.subtitle}
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  {locked ? (
                    <span className="inline-flex items-center gap-1.5 text-[12px] font-mono font-bold tracking-wider"
                      style={{ color: isLight ? '#B45309' : '#fbbf24' }}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                        <rect x="5" y="11" width="14" height="9" rx="2" />
                        <path d="M8 11V7a4 4 0 0 1 8 0v4" />
                      </svg>
                      LOCKED
                    </span>
                  ) : (
                    <span className={`text-[13px] font-mono ${isLight ? 'text-slate-700' : 'text-white/70'}`}>
                      {mod.submodules.length} Topics
                    </span>
                  )}
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                    className="w-7 h-7 rounded-full flex items-center justify-center"
                    style={{
                      backgroundColor: isLight ? 'rgba(15,23,42,0.08)' : 'rgba(255,255,255,0.04)',
                      border: isLight ? '1px solid rgba(15,23,42,0.24)' : '1px solid rgba(255,255,255,0.08)',
                    }}>
                    <ChevronDown size={15} strokeWidth={2.4} className={isLight ? 'text-slate-700' : 'text-white/60'} />
                  </motion.div>
                </div>
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.22, ease: 'easeInOut' }}
                    className="overflow-hidden"
                    style={{ borderTop: isLight ? '1px solid rgba(15,23,42,0.24)' : `1px solid ${accent}22` }}>
                    <ul className="flex flex-col">
                      {mod.submodules.map((sub, i) => (
                        <motion.li key={sub.id}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.028, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}>
                          <button type="button"
                            onClick={() => onPick(sub.route)}
                            className={`group w-full flex items-center gap-4 px-4 py-2.5 text-left border-l-2 transition-colors ${
                              isLight ? 'hover:bg-slate-50' : 'hover:bg-white/[0.03]'
                            }`}
                            style={{ borderLeftColor: 'transparent' }}
                            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderLeftColor = accent; }}
                            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderLeftColor = 'transparent'; }}>
                            <span className="flex-shrink-0 w-9 text-center text-[12px] font-mono tabular-nums" style={{ color: isLight ? '#334155' : `${accent}88` }}>
                              {idx + 1}.{String(i + 1).padStart(2, '0')}
                            </span>
                            <span className={`flex-1 text-[14px] transition-colors ${isLight ? 'text-slate-800 group-hover:text-slate-950' : 'text-white/80 group-hover:text-white'}`}>{sub.label}</span>
                            <ArrowRight size={15} strokeWidth={2.2}
                              className="transition-transform duration-200 group-hover:translate-x-1"
                              style={{ color: isLight ? '#1D4ED8' : `${accent}aa` }} />
                          </button>
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.li>
          );
        })}
        </motion.ul>
      </AnimatePresence>
    </div>
  );
};

export const HierarchicalGrindTree: React.FC = () => {
  const navigate = useNavigate();
  const [scheme] = useColorScheme();
  const isLight = scheme === 'light';

  return (
    <div className="w-full h-full flex flex-col bg-transparent overflow-hidden relative">
      <div className={`flex-shrink-0 w-full pt-6 pb-5 px-2 sm:px-4 lg:px-6 border-b relative z-30 flex justify-center transition-colors duration-300 ${
        isLight ? 'border-slate-300 bg-white' : 'border-white/10 bg-[#070810]'
      }`}>
        <div className="w-full max-w-[900px] flex flex-col items-center">
          <div className="flex items-center justify-between w-full mb-5 px-1">
            <div className={`flex items-center gap-2 text-[12px] font-mono tracking-[0.2em] ${isLight ? 'text-slate-700' : 'text-white/75'}`}>
              <motion.span className={`w-1 h-1 rounded-full ${isLight ? 'bg-cyan-700' : 'bg-cyan-400/70'}`}
                animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 2, repeat: Infinity }} />
              Foundation Framework
            </div>
            <div className={`text-[11px] font-mono tracking-[0.2em] ${isLight ? 'text-slate-700' : 'text-white/60'}`}>L1 - L5 · 5 modules</div>
          </div>
          <div className="relative w-full">
            <div className="absolute left-[8%] right-[8%] pointer-events-none hidden lg:block" style={{ top: 56 }}>
              <PathwayPulse color={isLight ? '#0E7490' : '#22d3ee'} length={800} />
            </div>
            <div className="flex items-start justify-center gap-x-1.5 gap-y-3 lg:gap-4 w-full flex-wrap lg:flex-nowrap relative">
              {ROOT_NODES.map((node, idx) => {
                const freeLocked = node.status !== 'locked' && isModuleLocked(node.route);
                const effNode = freeLocked ? { ...node, status: 'locked' as RootNode['status'] } : node;
                return (
                  <RootGem key={node.id} node={effNode} index={idx}
                    onClick={() => {
                      if (freeLocked) { navigate('/login', { state: { from: node.route } }); return; }
                      if (node.route && node.status !== 'locked') navigate(node.route);
                    }} />
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 w-full px-4 lg:px-6 pt-10 pb-12 flex flex-col items-center relative z-10 overflow-x-hidden overflow-y-auto scrollbar-hide">
        <div className={`flex items-center gap-2 text-[12px] font-mono tracking-[0.2em] ${isLight ? 'text-slate-700' : 'text-white/75'} mb-4`}>
          <motion.span className={`w-1 h-1 rounded-full ${isLight ? 'bg-cyan-700' : 'bg-cyan-400/70'}`}
            animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 2, repeat: Infinity }} />
          Choose your path
        </div>
        <L6PathSwitcher onPick={(route) => {
          if (isModuleLocked(route)) { navigate('/login', { state: { from: route } }); return; }
          navigate(route);
        }} />
      </div>
    </div>
  );
};
