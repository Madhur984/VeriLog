import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

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
  icon: string;
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
    tech: 'WAVE_FOUNDATION', level: 'L1', pct: 85, icon: '〜',
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
    id: 'r2', label: 'Sampling & ADC', fullLabel: 'Analog → Digital',
    description: 'Sampling, aliasing, Nyquist, quantization, dither, reconstruction, and ADC architectures.',
    tech: 'SAMPLING_THEORY', level: 'L2', pct: 67, icon: '⊞',
    color: ['#065f46', '#34d399'], glow: '#34d399', route: '/module/2',
    gate: 'or', status: 'active',
    children: [
      { id: 'r2c1', label: 'Sampling', pct: 100, color: '#34d399', icon: '◉' },
      { id: 'r2c2', label: 'Aliasing & Nyquist', pct: 90, color: '#6ee7b7', icon: '≁' },
      { id: 'r2c3', label: 'Quantization', pct: 70, color: '#10b981', icon: '▤' },
      { id: 'r2c4', label: 'Reconstruction', pct: 55, color: '#059669', icon: '∽' },
      { id: 'r2c5', label: 'ADC Architecture', pct: 20, color: '#a7f3d0', icon: '⊟' },
    ],
  },
  {
    id: 'r4', label: 'Binary & Logic', fullLabel: 'Numbers & Boolean',
    description: 'Decimal, binary, octal, hex, conversions, logic gates, carry chain, Boolean algebra.',
    tech: 'BOOLEAN_LOGIC', level: 'L3', pct: 0, icon: '⊃',
    color: ['#1e3a8a', '#60a5fa'], glow: '#60a5fa', route: '/module/3',
    gate: 'and', status: 'active',
    children: [
      { id: 'r4c1', label: 'Number Systems', pct: 0, color: '#60a5fa', icon: '0b' },
      { id: 'r4c2', label: 'Logic Gates', pct: 0, color: '#3b82f6', icon: '∧' },
      { id: 'r4c3', label: 'Carry Chain', pct: 0, color: '#2563eb', icon: '⊕' },
      { id: 'r4c4', label: 'Boolean Algebra', pct: 0, color: '#bfdbfe', icon: '⊗' },
      { id: 'r4c5', label: 'Complements', pct: 0, color: '#dbeafe', icon: '±' },
    ],
  },
  {
    id: 'r5', label: 'K-Maps', fullLabel: 'Karnaugh Reduction',
    description: "2/3/4-variable maps, grouping rules, don't-cares, POS, and the K-Map sandbox.",
    tech: 'MAP_REDUCTION', level: 'L4', pct: 0, icon: '▦',
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
    description: 'First Verilog, modules, testbenches, clock signals, hierarchy — gateway to L6 mastery.',
    tech: 'HDL_GATEWAY', level: 'L5', pct: 0, icon: '≡',
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
            background: 'rgba(5,8,18,0.88)',
            backdropFilter: 'blur(14px)',
            borderRadius: 4,
            border: '1px solid rgba(255,255,255,0.07)',
            borderLeft: `2px solid ${color}`,
            padding: '8px 10px',
          }}
        >
          <div className="text-[8.5px] font-mono tracking-[0.18em] mb-1.5 uppercase" style={{ color: `${color}bb` }}>
            SYS · TELEMETRY
          </div>
          <div className="text-[10px] leading-snug text-white/80 font-mono">
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

// ─── BATTERY METER ─────────────────────────────────────────────────────────────
const BatteryMeter: React.FC<{ total: number; filled: number; color: string }> = ({ total, filled, color }) => (
  <div className="flex items-center gap-1.5">
    <div className="flex items-center gap-[3px]">
      {Array.from({ length: total }).map((_, i) => (
        <motion.div key={i} className="rounded-[2px]"
          style={{ width: 14, height: 6,
            backgroundColor: i < filled ? color : 'transparent',
            border: `1px solid ${i < filled ? color : `${color}44`}`,
            boxShadow: i < filled ? `0 0 4px ${color}88` : 'none',
          }}
          initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
          transition={{ delay: i * 0.06, duration: 0.25 }} />
      ))}
    </div>
    <span className="text-[8px] font-mono tabular-nums" style={{ color: `${color}99` }}>{filled}/{total}</span>
  </div>
);

// ─── ANIMATED PATHWAY PULSE ────────────────────────────────────────────────────
const PathwayPulse: React.FC<{ color: string; vertical?: boolean; length?: number }> = ({
  color, vertical = false, length = 48,
}) => (
  <div className="relative overflow-hidden pointer-events-none"
    style={vertical ? { width: 1, height: length } : { height: 1, width: length }}>
    <div className="absolute inset-0" style={{ backgroundColor: `${color}28` }} />
    <motion.div className="absolute"
      style={vertical
        ? { left: 0, right: 0, height: 16, background: `linear-gradient(to bottom, transparent, ${color}cc, transparent)` }
        : { top: 0, bottom: 0, width: 16, background: `linear-gradient(to right, transparent, ${color}cc, transparent)` }}
      animate={vertical ? { y: [-16, length] } : { x: [-16, length] }}
      transition={{ duration: 1.8, repeat: Infinity, ease: 'linear', repeatDelay: 1.2 }} />
  </div>
);

// ─── LOGIC GATE SVG SHAPES ─────────────────────────────────────────────────────
// All gates share viewBox="0 0 80 64", icon center, and animated pin lines.

interface GateProps {
  type: GateType;
  accent: string;
  isLocked: boolean;
  hovered: boolean;
  icon: string;
}

const AnimatedPin: React.FC<{ x1: number; y1: number; x2: number; y2: number; color: string; delay?: number }> = ({
  x1, y1, x2, y2, color, delay = 0,
}) => {
  // Pulse dot travels along the pin line
  const dx = x2 - x1;
  const dy = y2 - y1;
  return (
    <>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={`${color}55`} strokeWidth="1" />
      <motion.circle
        r={1.4}
        fill={color}
        animate={{ cx: [x1, x2], cy: [y1, y2], opacity: [0, 1, 1, 0] }}
        transition={{ duration: 1.2, repeat: Infinity, ease: 'linear', repeatDelay: 1.5, delay }}
      />
    </>
  );
};

const LogicGateShape: React.FC<GateProps> = ({ type, accent, isLocked, hovered, icon }) => {
  const fill = '#090B10';
  const stroke = isLocked ? 'rgba(255,255,255,0.1)' : `${accent}99`;
  const strokeDash = isLocked ? '4 3' : undefined;
  const glow = hovered && !isLocked;

  const iconEl = (cx: number, cy: number) => (
    <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle"
      fontFamily="monospace" fontSize="17" fill={isLocked ? '#334155' : accent}>
      {isLocked ? '🔒' : icon}
    </text>
  );

  // ── MUX Trapezoid (L1 signals) ─────────────────────────────────────────────
  if (type === 'mux') return (
    <svg width={80} height={64} viewBox="0 0 80 64"
      style={{ filter: glow ? `drop-shadow(0 0 8px ${accent}99)` : 'none', transition: 'filter 0.3s' }}>
      {/* Outer wireframe */}
      <motion.polygon points="16,4 64,4 60,60 20,60"
        fill="transparent" stroke={`${accent}44`} strokeWidth="0.7"
        strokeDasharray={strokeDash}
        animate={hovered && !isLocked ? { rotate: 4, opacity: 1 } : { rotate: 0, opacity: 0.5 }}
        style={{ transformOrigin: '40px 32px' }}
        transition={{ duration: 0.8, ease: 'easeInOut' }} />
      {/* Core body */}
      <polygon points="20,9 60,9 56,55 24,55" fill={fill} stroke={stroke} strokeWidth="1.2" />
      {/* Select pin bottom */}
      {!isLocked && <AnimatedPin x1={40} y1={55} x2={40} y2={62} color={accent} delay={0} />}
      {/* Input pins left */}
      {!isLocked && (
        <>
          <AnimatedPin x1={4} y1={20} x2={20} y2={22} color={accent} delay={0.1} />
          <AnimatedPin x1={4} y1={44} x2={20} y2={42} color={accent} delay={0.4} />
        </>
      )}
      {/* Output pin right */}
      {!isLocked && <AnimatedPin x1={60} y1={32} x2={76} y2={32} color={accent} delay={0.7} />}
      {/* Label */}
      <text x={40} y={35} textAnchor="middle" fontFamily="monospace"
        fontSize="8" fill={`${accent}66`} letterSpacing="1">MUX</text>
      {iconEl(40, 22)}
    </svg>
  );

  // ── OR Gate (L2 sampling) ──────────────────────────────────────────────────
  if (type === 'or') return (
    <svg width={80} height={64} viewBox="0 0 80 64"
      style={{ filter: glow ? `drop-shadow(0 0 8px ${accent}99)` : 'none', transition: 'filter 0.3s' }}>
      <motion.path
        d="M 14,5 Q 26,32 14,59 Q 38,50 54,32 Q 38,14 14,5 Z"
        fill="transparent" stroke={`${accent}44`} strokeWidth="0.7"
        animate={hovered && !isLocked ? { scale: 1.08, opacity: 1 } : { scale: 1, opacity: 0.5 }}
        style={{ transformOrigin: '35px 32px' }}
        transition={{ duration: 0.5 }} />
      <path d="M 18,8 Q 30,32 18,56 Q 42,48 58,32 Q 42,16 18,8 Z"
        fill={fill} stroke={stroke} strokeWidth="1.2" strokeDasharray={strokeDash} />
      {!isLocked && (
        <>
          <AnimatedPin x1={4} y1={20} x2={21} y2={23} color={accent} delay={0} />
          <AnimatedPin x1={4} y1={44} x2={21} y2={41} color={accent} delay={0.35} />
          <AnimatedPin x1={58} y1={32} x2={76} y2={32} color={accent} delay={0.7} />
        </>
      )}
      <text x={40} y={50} textAnchor="middle" fontFamily="monospace"
        fontSize="7" fill={`${accent}55`} letterSpacing="1">OR</text>
      {iconEl(38, 30)}
    </svg>
  );

  // ── AND Gate (L3 binary) ───────────────────────────────────────────────────
  if (type === 'and') return (
    <svg width={80} height={64} viewBox="0 0 80 64"
      style={{ filter: glow ? `drop-shadow(0 0 8px ${accent}99)` : 'none', transition: 'filter 0.3s' }}>
      <motion.path d="M 14,5 L 38,5 Q 62,5 62,32 Q 62,59 38,59 L 14,59 Z"
        fill="transparent" stroke={`${accent}44`} strokeWidth="0.7"
        animate={hovered && !isLocked ? { scale: 1.06, opacity: 1 } : { scale: 1, opacity: 0.5 }}
        style={{ transformOrigin: '38px 32px' }} transition={{ duration: 0.45 }} />
      <path d="M 18,9 L 38,9 Q 58,9 58,32 Q 58,55 38,55 L 18,55 Z"
        fill={fill} stroke={stroke} strokeWidth="1.2" strokeDasharray={strokeDash} />
      {/* Vertical divider facet */}
      {!isLocked && <line x1="38" y1="9" x2="38" y2="55" stroke={accent} strokeOpacity="0.08" strokeWidth="0.5" />}
      {!isLocked && (
        <>
          <AnimatedPin x1={4} y1={20} x2={18} y2={20} color={accent} delay={0} />
          <AnimatedPin x1={4} y1={44} x2={18} y2={44} color={accent} delay={0.4} />
          <AnimatedPin x1={58} y1={32} x2={76} y2={32} color={accent} delay={0.8} />
        </>
      )}
      <text x={38} y={50} textAnchor="middle" fontFamily="monospace"
        fontSize="7" fill={`${accent}55`} letterSpacing="1">AND</text>
      {iconEl(38, 29)}
    </svg>
  );

  // ── XOR Gate (L4 K-Maps) ───────────────────────────────────────────────────
  if (type === 'xor') return (
    <svg width={80} height={64} viewBox="0 0 80 64"
      style={{ filter: glow ? `drop-shadow(0 0 8px ${accent}99)` : 'none', transition: 'filter 0.3s' }}>
      {/* Outer XOR halo */}
      <motion.path d="M 14,5 Q 26,32 14,59 Q 38,50 54,32 Q 38,14 14,5 Z"
        fill="transparent" stroke={`${accent}33`} strokeWidth="0.7"
        animate={hovered && !isLocked ? { scale: 1.08, opacity: 1 } : { scale: 1, opacity: 0.4 }}
        style={{ transformOrigin: '35px 32px' }} transition={{ duration: 0.5 }} />
      {/* OR body */}
      <path d="M 18,8 Q 30,32 18,56 Q 42,48 58,32 Q 42,16 18,8 Z"
        fill={fill} stroke={stroke} strokeWidth="1.2" strokeDasharray={strokeDash} />
      {/* XOR extra arc */}
      {!isLocked ? (
        <motion.path d="M 12,8 Q 24,32 12,56"
          fill="none" stroke={accent} strokeWidth="1.2" strokeOpacity="0.7"
          animate={{ strokeOpacity: hovered ? [0.7, 1, 0.7] : [0.4, 0.7, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }} />
      ) : (
        <path d="M 12,8 Q 24,32 12,56" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
      )}
      {!isLocked && (
        <>
          <AnimatedPin x1={4} y1={20} x2={22} y2={23} color={accent} delay={0} />
          <AnimatedPin x1={4} y1={44} x2={22} y2={41} color={accent} delay={0.35} />
          <AnimatedPin x1={58} y1={32} x2={76} y2={32} color={accent} delay={0.7} />
        </>
      )}
      <text x={40} y={50} textAnchor="middle" fontFamily="monospace"
        fontSize="7" fill={`${accent}55`} letterSpacing="1">XOR</text>
      {iconEl(38, 30)}
    </svg>
  );

  // ── NAND Gate (L5 Verilog) ─────────────────────────────────────────────────
  if (type === 'nand') return (
    <svg width={80} height={64} viewBox="0 0 80 64"
      style={{ filter: glow ? `drop-shadow(0 0 8px ${accent}99)` : 'none', transition: 'filter 0.3s' }}>
      {/* Outer AND halo */}
      <motion.path d="M 14,5 L 36,5 Q 60,5 60,32 Q 60,59 36,59 L 14,59 Z"
        fill="transparent" stroke={`${accent}33`} strokeWidth="0.7"
        animate={hovered && !isLocked ? { scale: 1.06, opacity: 1 } : { scale: 1, opacity: 0.5 }}
        style={{ transformOrigin: '38px 32px' }} transition={{ duration: 0.45 }} />
      {/* AND core body */}
      <path d="M 18,9 L 36,9 Q 56,9 56,32 Q 56,55 36,55 L 18,55 Z"
        fill={fill} stroke={stroke} strokeWidth="1.2" strokeDasharray={strokeDash} />
      {/* NAND bubble */}
      <motion.circle cx={62} cy={32} r={5}
        fill={fill} stroke={isLocked ? 'rgba(255,255,255,0.1)' : accent} strokeWidth="1.2"
        animate={!isLocked && hovered ? { r: 6 } : { r: 5 }}
        transition={{ duration: 0.3 }} />
      {/* NOT dot inside bubble */}
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
        fontSize="7" fill={`${accent}55`} letterSpacing="1">NAND</text>
      {iconEl(37, 29)}
    </svg>
  );

  return null;
};

// ─── BUFFER TRIANGLE (L6 leaf chip) ───────────────────────────────────────────
const BufferChip: React.FC<{
  index: number; color: string; route: string; label: string;
  subtitle: string; desc: string; navigate: (r: string) => void;
}> = ({ index, color, route, label, subtitle, desc, navigate }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <div className="relative" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <HudTooltip text={`${subtitle} — ${desc}`} color={color} visible={hovered} />
      <button onClick={() => navigate(route)} className="relative cursor-pointer outline-none"
        aria-label={label} style={{ width: 52, height: 56 }}>
        <svg width={52} height={56} viewBox="0 0 52 56"
          style={{ filter: hovered ? `drop-shadow(0 0 7px ${color}bb)` : 'none', transition: 'filter 0.25s' }}>
          {/* Outer buffer ring */}
          <motion.polygon points="4,4 48,28 4,52"
            fill="transparent" stroke={`${color}44`} strokeWidth="0.7"
            animate={hovered ? { scale: 1.1, opacity: 1 } : { scale: 1, opacity: 0.5 }}
            style={{ transformOrigin: '26px 28px' }} transition={{ duration: 0.4 }} />
          {/* Core triangle */}
          <polygon points="8,8 44,28 8,48"
            fill="#090B10" stroke={hovered ? color : `${color}88`} strokeWidth={hovered ? 1.4 : 1}
            style={{ transition: 'stroke 0.2s, stroke-width 0.2s' }} />
          {/* Input pin */}
          <AnimatedPin x1={2} y1={28} x2={8} y2={28} color={color} delay={0} />
          {/* Output pin */}
          <AnimatedPin x1={44} y1={28} x2={50} y2={28} color={color} delay={0.6} />
          {/* Number label */}
          <text x="22" y="32" textAnchor="middle" fontFamily="monospace" fontSize="11"
            fontWeight="700" fill={hovered ? color : `${color}cc`}
            style={{ transition: 'fill 0.2s' }}>
            {String(index + 1).padStart(2, '0')}
          </text>
        </svg>
      </button>
    </div>
  );
};

// ─── ROOT MODULE GEM — LOGIC GATE EDITION ─────────────────────────────────────
const RootGem: React.FC<{ node: RootNode; index: number; onClick: () => void }> = ({
  node, index, onClick,
}) => {
  const isLocked = node.status === 'locked';
  const isDone = node.status === 'done';
  const accent = node.glow;
  const [hovered, setHovered] = useState(false);
  const [inView, setInView] = useState(false);
  const displayLabel = useDecodeText(node.label, inView);

  useEffect(() => {
    const t = setTimeout(() => setInView(true), index * 80 + 200);
    return () => clearTimeout(t);
  }, [index]);

  return (
    <motion.div
      className="relative flex flex-col items-center"
      style={{ width: 140, cursor: isLocked ? 'not-allowed' : 'pointer' }}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.4, ease: 'easeOut' }}
      onClick={() => { if (!isLocked) onClick(); }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Level chip */}
      <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-sm border bg-transparent mb-3"
        style={{
          borderColor: isLocked ? 'rgba(255,255,255,0.08)' : `${accent}44`,
          boxShadow: hovered && !isLocked ? `0 0 8px ${accent}33` : 'none',
          transition: 'box-shadow 0.3s',
        }}>
        <span className="text-[8.5px] font-mono tracking-[0.25em] text-white/55">{node.level}</span>
        <motion.span className="w-1 h-1 rounded-full"
          style={{ backgroundColor: isLocked ? 'rgba(255,255,255,0.15)' : accent }}
          animate={!isLocked ? { opacity: [0.5, 1, 0.5] } : {}}
          transition={{ duration: 2, repeat: Infinity }} />
      </div>

      {/* Gate shape + tooltip wrapper */}
      <div className="relative">
        <HudTooltip text={node.description} color={accent} visible={hovered && !isLocked} />
        <motion.div whileHover={!isLocked ? { scale: 1.05 } : {}} transition={{ duration: 0.25 }}
          style={{ opacity: isLocked ? 0.4 : 1, transition: 'opacity 0.3s' }}>
          <LogicGateShape type={node.gate} accent={accent}
            isLocked={isLocked} hovered={hovered} icon={node.icon} />

          {/* Done badge */}
          {isDone && (
            <motion.div className="absolute -top-1 -right-1 px-1 py-0.5 rounded-sm bg-[#0A0B0F] border"
              style={{ borderColor: accent }}
              initial={{ scale: 0 }} animate={{ scale: 1 }}
              transition={{ delay: index * 0.07 + 0.4, type: 'spring', stiffness: 300 }}>
              <span className="text-[8px] font-mono" style={{ color: accent }}>✓</span>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Decoded label */}
      <div className="mt-2 text-center text-[11px] font-semibold leading-tight tracking-wide font-mono"
        style={{ color: isLocked ? '#475569' : '#E5E7EB', maxWidth: 130, minHeight: 28 }}>
        {displayLabel}
      </div>

      {/* Tech badge */}
      <div className="mt-1 text-[7.5px] font-mono tracking-[0.2em] text-center"
        style={{ color: isLocked ? '#334155' : `${accent}88`, maxWidth: 130 }}>
        {node.tech}
      </div>

      {/* Energy strip progress */}
      {!isLocked && (
        <div className="mt-2 w-full max-w-[96px]">
          <div className="relative h-[3px] rounded-full overflow-hidden" style={{ backgroundColor: `${accent}22` }}>
            <motion.div className="absolute left-0 top-0 h-full rounded-full"
              style={{ backgroundColor: accent, boxShadow: `0 0 6px ${accent}` }}
              initial={{ width: 0 }} animate={{ width: `${node.pct}%` }}
              transition={{ duration: 0.9, delay: index * 0.08 + 0.3, ease: 'easeOut' }} />
          </div>
          <div className="mt-0.5 text-[8px] font-mono tabular-nums text-right"
            style={{ color: `${accent}88` }}>{node.pct}%</div>
        </div>
      )}
    </motion.div>
  );
};

// ─── KINETIC BRANCH TITLE ──────────────────────────────────────────────────────
const KineticBranchTitle: React.FC<{ title: string }> = ({ title }) => {
  const [triggered, setTriggered] = useState(false);
  const display = useDecodeText(title, triggered);
  const ref = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ob = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setTriggered(true); ob.disconnect(); } }, { threshold: 0.5 });
    ob.observe(el);
    return () => ob.disconnect();
  }, []);
  return (
    <h3 ref={ref} className="text-base lg:text-[17px] font-semibold tracking-tight leading-snug font-mono"
      style={{ color: '#E5E7EB' }}>
      {display}
    </h3>
  );
};

// ─── PARALLAX GRID ─────────────────────────────────────────────────────────────
const ParallaxGrid: React.FC<{ scrollY: number }> = ({ scrollY }) => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
    <div style={{
      position: 'absolute', inset: '-40px',
      backgroundImage: `linear-gradient(rgba(34,211,238,0.04) 1px, transparent 1px),linear-gradient(90deg, rgba(34,211,238,0.04) 1px, transparent 1px)`,
      backgroundSize: '32px 32px',
      transform: `translateY(${scrollY * 0.25}px)`,
      transition: 'transform 0.05s linear',
      maskImage: 'radial-gradient(ellipse 80% 60% at 50% 40%, black 30%, transparent 100%)',
      WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 40%, black 30%, transparent 100%)',
    }} />
    <div style={{ position: 'absolute', inset: 0,
      background: 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(34,211,238,0.03) 0%, transparent 70%)' }} />
  </div>
);

// ─── SCROLL PROGRESS BAR ───────────────────────────────────────────────────────
const ScrollProgressBar: React.FC<{ progress: number }> = ({ progress }) => (
  <div className="fixed right-0 top-0 bottom-0 pointer-events-none" style={{ width: 2, zIndex: 100 }}>
    <div className="absolute inset-0" style={{ backgroundColor: 'rgba(255,255,255,0.04)' }} />
    <motion.div className="absolute left-0 right-0 top-0"
      style={{ height: `${progress * 100}%`, background: 'linear-gradient(to bottom, #22d3ee, #a78bfa)', boxShadow: '0 0 6px rgba(34,211,238,0.5)' }} />
    <motion.div className="absolute left-1/2 -translate-x-1/2 w-2 h-2 rounded-full"
      style={{ top: `calc(${progress * 100}% - 4px)`, background: progress > 0.5 ? '#a78bfa' : '#22d3ee',
        boxShadow: `0 0 8px ${progress > 0.5 ? '#a78bfa' : '#22d3ee'}` }} />
  </div>
);

// ─── MAIN TREE COMPONENT ───────────────────────────────────────────────────────
export const HierarchicalGrindTree: React.FC = () => {
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [scrollY, setScrollY] = useState(0);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollTop, scrollHeight, clientHeight } = el;
    setScrollProgress(scrollHeight > clientHeight ? scrollTop / (scrollHeight - clientHeight) : 0);
    setScrollY(scrollTop);
  }, []);

  const branches = [
    {
      id: 'branch-electronics', title: 'HDL Foundations', subtitle: 'CRISIS_AND_PARADIGM', color: '#22d3ee',
      nodes: [
        { id: 's00', label: 'Breaking Point', subtitle: 'L6 · 01', desc: 'Why traditional design fails at scale.', route: '/module/6/0' },
        { id: 's01', label: 'Industry Risk', subtitle: 'L6 · 03', desc: 'The economic cost of complexity.', route: '/module/6/2' },
        { id: 's03', label: 'What is HDL?', subtitle: 'L6 · 05', desc: 'Hardware description as language.', route: '/module/6/4' },
        { id: 's03a', label: 'Verilog Mandate', subtitle: 'L6 · 09', desc: 'Why Verilog became the standard.', route: '/module/6/8' },
      ],
    },
    {
      id: 'branch-design', title: 'System Architecture', subtitle: 'ARCH_SYNTHESIS', color: '#34d399',
      nodes: [
        { id: 's02', label: 'Abstraction Ladder', subtitle: 'L6 · 12', desc: 'Climbing from gates to behaviour.', route: '/module/6/11' },
        { id: 's13', label: 'Synthesis Flow', subtitle: 'L6 · 14', desc: 'Translating intent to netlists.', route: '/module/6/13' },
        { id: 's05', label: 'VLSI Pipeline', subtitle: 'L6 · 15', desc: 'From RTL to silicon die.', route: '/module/6/14' },
        { id: 's14', label: 'FPGA vs ASIC', subtitle: 'L6 · 24', desc: 'Choosing your implementation destiny.', route: '/module/6/23' },
      ],
    },
    {
      id: 'branch-verilog', title: 'Verilog Mastery', subtitle: 'RTL_VERIFICATION', color: '#a78bfa',
      nodes: [
        { id: 's06', label: 'First Contact', subtitle: 'L6 · 17', desc: 'Writing your first Verilog module.', route: '/module/6/16' },
        { id: 's06a', label: 'Testbench', subtitle: 'L6 · 18', desc: 'Verification fundamentals.', route: '/module/6/17' },
        { id: 's20', label: 'AI Hardware', subtitle: 'L6 · 25', desc: 'Matrix engines and modern accelerators.', route: '/module/6/24' },
        { id: 's21', label: 'Power Design', subtitle: 'L6 · 26', desc: 'PPA and thermal envelopes.', route: '/module/6/25' },
      ],
    },
  ];

  return (
    <div className="w-full h-full flex flex-col bg-transparent overflow-hidden relative">
      <ScrollProgressBar progress={scrollProgress} />

      {/* ── Header: L1-L5 Root Module Row ── */}
      <div className="flex-shrink-0 w-full pt-6 pb-5 px-4 lg:px-6 border-b border-white/10 bg-[#0A0B0F]/95 backdrop-blur-md relative z-30 flex justify-center">
        <div className="w-full max-w-[900px] flex flex-col items-center">
          <div className="flex items-center justify-between w-full mb-5 px-1">
            <div className="flex items-center gap-2 text-[10px] font-mono tracking-[0.2em] text-white/55">
              <motion.span className="w-1 h-1 rounded-full bg-cyan-400/70"
                animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 2, repeat: Infinity }} />
              Foundation Framework
            </div>
            <div className="text-[9px] font-mono tracking-[0.2em] text-white/35">L1 — L5 · 5 modules</div>
          </div>

          <div className="relative w-full">
            {/* Animated horizontal connector trace */}
            <div className="absolute left-[8%] right-[8%] pointer-events-none" style={{ top: 56 }}>
              <PathwayPulse color="#22d3ee" length={800} />
            </div>
            <div className="flex items-start justify-center gap-2 lg:gap-4 w-full flex-wrap sm:flex-nowrap relative">
              {ROOT_NODES.map((node, idx) => (
                <RootGem key={node.id} node={node} index={idx}
                  onClick={() => { if (node.route && node.status !== 'locked') navigate(node.route); }} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Scrollable L6 Branches ── */}
      <div ref={scrollRef} onScroll={handleScroll}
        className="flex-1 w-full overflow-y-auto px-4 lg:px-6 pt-0 pb-24 scrollbar-hide relative z-10 flex justify-center">
        <ParallaxGrid scrollY={scrollY} />

        <div className="w-full max-w-[850px] relative z-10">
          <div className="relative w-full pb-10 px-4 md:px-8">
            {/* Entry trace */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2" style={{ zIndex: 5 }}>
              <PathwayPulse color="#22d3ee" vertical length={56} />
            </div>

            {/* L6 badge */}
            <div className="absolute top-8 left-1/2 -translate-x-1/2 z-30">
              <motion.div className="px-2.5 py-0.5 rounded-sm border bg-[#0A0B0F] relative overflow-hidden"
                style={{ borderColor: 'rgba(34,211,238,0.25)' }}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                <span className="text-[9px] font-mono tracking-[0.2em] text-white/70">L6 · Synthesis Layer</span>
                <motion.div className="absolute inset-0 pointer-events-none"
                  style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(34,211,238,0.12) 50%, transparent 100%)' }}
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 3 }} />
              </motion.div>
            </div>

            {/* Junction node */}
            <motion.div className="absolute top-[58px] left-1/2 -translate-x-1/2 z-20 rounded-full"
              style={{ width: 6, height: 6, backgroundColor: '#22d3ee' }}
              animate={{ boxShadow: ['0 0 0px rgba(34,211,238,0)', '0 0 7px rgba(34,211,238,0.7)', '0 0 0px rgba(34,211,238,0)'] }}
              transition={{ duration: 2.5, repeat: Infinity }} />

            {/* Distributor trace */}
            <div className="absolute left-[16.66%] right-[16.66%]" style={{ top: 62, zIndex: 4 }}>
              <PathwayPulse color="#22d3ee" length={600} />
            </div>

            <div className="flex justify-between gap-0 relative">
              {branches.map((branch, branchIdx) => (
                <div key={branch.id} className="flex-1 flex flex-col items-center relative min-w-0">
                  {/* Branch entry vertical */}
                  <div className="absolute left-1/2 -translate-x-1/2" style={{ top: 62, zIndex: 4 }}>
                    <PathwayPulse color={branch.color} vertical length={56} />
                  </div>

                  {/* Branch title */}
                  <motion.div className="mt-[106px] mb-6 text-center z-10 px-2 w-full flex flex-col items-center justify-end"
                    style={{ minHeight: 150 }}
                    initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ delay: branchIdx * 0.1, duration: 0.5 }}>
                    <span className="text-[8.5px] font-mono tracking-[0.22em] mb-2 uppercase"
                      style={{ color: `${branch.color}cc` }}>
                      {branch.subtitle.replace(/_/g, ' ').toLowerCase()}
                    </span>
                    <KineticBranchTitle title={branch.title} />
                    <div className="mt-3">
                      <BatteryMeter total={branch.nodes.length} filled={0} color={branch.color} />
                    </div>
                  </motion.div>

                  {/* Branch body */}
                  <div className="relative w-full flex flex-col items-center pt-2">
                    {/* Animated vertical trunk */}
                    <div className="absolute top-0 bottom-12 left-1/2 -translate-x-1/2" style={{ zIndex: 1 }}>
                      <div className="relative w-[1px] h-full overflow-hidden">
                        <div className="absolute inset-0" style={{ backgroundColor: `${branch.color}38` }} />
                        <motion.div className="absolute left-0 right-0"
                          style={{ height: 32, background: `linear-gradient(to bottom, transparent, ${branch.color}aa, transparent)` }}
                          animate={{ y: ['-32px', '100%'] }}
                          transition={{ duration: 2.5, repeat: Infinity, ease: 'linear', repeatDelay: 0.8, delay: branchIdx * 0.6 }} />
                      </div>
                    </div>

                    {branch.nodes.map((node, i) => {
                      const onLeft = i % 2 === 0;

                      const chip = (
                        <BufferChip index={i} color={branch.color} route={node.route}
                          label={node.label} subtitle={node.subtitle} desc={node.desc} navigate={navigate} />
                      );

                      const labelBlock = (align: 'left' | 'right') => (
                        <div className={`max-w-full ${align === 'right' ? 'text-right pr-1' : 'text-left pl-1'}`}>
                          <div className="text-[11.5px] font-semibold leading-tight text-white/90 mb-0.5 font-mono">
                            {node.label}
                          </div>
                          <span className="text-[8px] font-mono tracking-[0.15em]"
                            style={{ color: `${branch.color}cc` }}>
                            {node.subtitle}
                          </span>
                        </div>
                      );

                      return (
                        <motion.div key={node.id}
                          initial={{ opacity: 0, x: onLeft ? -10 : 10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true, margin: '-40px' }}
                          transition={{ delay: i * 0.07, duration: 0.35, ease: 'easeOut' }}
                          className="relative w-full flex items-center mb-9 last:mb-2 z-10"
                          style={{ minHeight: 64 }}>
                          <div className="flex-1 flex justify-end items-center pr-3">
                            {onLeft ? chip : labelBlock('right')}
                          </div>

                          <div className="relative w-0 flex-shrink-0 h-full flex items-center justify-center" style={{ minHeight: 64 }}>
                            <div className="absolute top-1/2 -translate-y-1/2 h-[1px]"
                              style={{ width: 22, left: onLeft ? -22 : 0, backgroundColor: `${branch.color}77` }} />
                            <motion.div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 rounded-full"
                              style={{ left: 0, width: 6, height: 6, backgroundColor: branch.color }}
                              animate={{ boxShadow: [`0 0 0px ${branch.color}00`, `0 0 6px ${branch.color}cc`, `0 0 0px ${branch.color}00`] }}
                              transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 + branchIdx * 0.5 }} />
                          </div>

                          <div className="flex-1 flex justify-start items-center pl-3">
                            {!onLeft ? chip : labelBlock('left')}
                          </div>
                        </motion.div>
                      );
                    })}

                    {/* Terminator */}
                    <div className="relative mt-2 flex flex-col items-center">
                      <div className="w-8 h-[2px]" style={{ backgroundColor: `${branch.color}55` }} />
                      <div className="mt-2 text-[7px] font-mono tracking-[0.22em]"
                        style={{ color: `${branch.color}55` }}>
                        END · BRANCH
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
