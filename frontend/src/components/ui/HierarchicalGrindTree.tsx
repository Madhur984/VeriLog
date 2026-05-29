import React, { useEffect, useRef, useState } from 'react';
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
    id: 'r2', label: 'Number Systems', fullLabel: 'Bases & Boolean',
    description: 'Decimal, binary, octal, hex, conversions, Boolean algebra, complements, and 7-segment.',
    tech: 'NUMBER_SYSTEMS', level: 'L2', pct: 0, icon: '⊞',
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
    tech: 'GATE_LOGIC', level: 'L3', pct: 0, icon: '⊃',
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
    description: 'First Verilog, modules, testbenches, clock signals, hierarchy - gateway to L6 mastery.',
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

// ─── ROOT MODULE GEM - LOGIC GATE EDITION ─────────────────────────────────────
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
      className="relative flex flex-col items-center w-[96px] sm:w-[120px] lg:w-[140px]"
      style={{ cursor: isLocked ? 'not-allowed' : 'pointer' }}
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
      <div className="mt-2 w-full text-center text-[10px] sm:text-[11px] font-semibold leading-tight tracking-wide font-mono px-0.5"
        style={{ color: isLocked ? '#475569' : '#E5E7EB', maxWidth: '100%', minHeight: 28 }}>
        {displayLabel}
      </div>

      {/* Tech badge */}
      <div className="mt-1 w-full text-[7px] font-mono tracking-[0.1em] text-center truncate"
        style={{ color: isLocked ? '#334155' : `${accent}88`, maxWidth: '100%' }}>
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


// ─── L6 PATH HIERARCHY (PATH → MODULES → SUBMODULES) ───────────────────────────
interface SubmoduleOption { id: string; label: string; route: string }
interface ModuleOption    { id: string; label: string; subtitle: string; route: string; submodules: SubmoduleOption[] }
interface PathOption      { id: string; label: string; subtitle: string; color: string; modules: ModuleOption[] }

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
    ],
  },
  {
    id: 'verilog', label: 'Verilog', subtitle: 'HDL · SYNTHESIS', color: '#a78bfa',
    modules: [
      {
        id: 'm5', label: 'Verilog Core', subtitle: 'L5 · HDL GATEWAY', route: '/module/5',
        submodules: [
          { id: 'm5s1', label: 'First Verilog', route: '/module/5' },
          { id: 'm5s2', label: 'Modules', route: '/module/5' },
          { id: 'm5s3', label: 'Testbenches', route: '/module/5' },
          { id: 'm5s4', label: 'Clock Signal', route: '/module/5' },
          { id: 'm5s5', label: 'Hierarchy', route: '/module/5' },
        ],
      },
      {
        id: 'm6', label: 'HDL Mastery', subtitle: 'L6 · SYNTHESIS LAYER', route: '/module/6',
        submodules: [
          { id: 'm6s1', label: 'Breaking Point', route: '/module/6/0' },
          { id: 'm6s2', label: 'Industry Risk', route: '/module/6/2' },
          { id: 'm6s3', label: 'What is HDL?', route: '/module/6/4' },
          { id: 'm6s4', label: 'Abstraction Ladder', route: '/module/6/11' },
          { id: 'm6s5', label: 'Synthesis Flow', route: '/module/6/13' },
          { id: 'm6s6', label: 'First Contact', route: '/module/6/16' },
          { id: 'm6s7', label: 'Testbench', route: '/module/6/17' },
          { id: 'm6s8', label: 'AI Hardware', route: '/module/6/24' },
        ],
      },
    ],
  },
];

// ─── PATH SELECTOR + ACCORDION MODULE LIST ─────────────────────────────────────
const L6PathDropdown: React.FC<{ onPick: (route: string) => void }> = ({ onPick }) => {
  const [pathOpen, setPathOpen] = useState(false);
  const [pathSel, setPathSel] = useState<PathOption>(L6_PATHS[0]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const pathRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (pathRef.current && !pathRef.current.contains(e.target as Node)) setPathOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  const accent = pathSel.color;

  return (
    <div className="w-full max-w-[760px] flex flex-col items-stretch gap-5">
      {/* Path picker */}
      <div ref={pathRef} className="relative self-center w-full max-w-[420px]">
        <button
          type="button"
          onClick={() => setPathOpen(o => !o)}
          className="w-full flex items-center justify-between px-4 py-3 rounded-sm border bg-[#0A0B0F] outline-none transition-all"
          style={{
            borderColor: pathOpen ? accent : `${accent}55`,
            boxShadow: pathOpen ? `0 0 14px ${accent}33` : 'none',
          }}
        >
          <div className="flex items-center gap-3 text-left">
            <motion.span className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: accent, boxShadow: `0 0 6px ${accent}` }}
              animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }} />
            <div>
              <div className="text-[12px] font-mono font-semibold text-white/90">{pathSel.label}</div>
              <div className="text-[8.5px] font-mono tracking-[0.22em] uppercase" style={{ color: `${accent}aa` }}>
                {pathSel.subtitle} · {pathSel.modules.length} modules
              </div>
            </div>
          </div>
          <motion.span animate={{ rotate: pathOpen ? 180 : 0 }} transition={{ duration: 0.2 }}
            className="text-[10px] font-mono" style={{ color: accent }}>▾</motion.span>
        </button>

        <AnimatePresence>
          {pathOpen && (
            <motion.ul
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.16 }}
              className="absolute left-0 right-0 mt-2 rounded-sm border bg-[#0A0B0F]/97 backdrop-blur-md overflow-hidden z-40"
              style={{ borderColor: 'rgba(255,255,255,0.08)' }}
            >
              {L6_PATHS.map(opt => {
                const isActive = opt.id === pathSel.id;
                return (
                  <li key={opt.id}>
                    <button type="button"
                      onClick={() => { setPathSel(opt); setExpandedId(null); setPathOpen(false); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-white/[0.04]"
                      style={{
                        backgroundColor: isActive ? `${opt.color}14` : 'transparent',
                        borderLeft: `2px solid ${isActive ? opt.color : 'transparent'}`,
                      }}>
                      <span className="w-1 h-1 rounded-full" style={{ backgroundColor: opt.color, boxShadow: `0 0 5px ${opt.color}` }} />
                      <div className="flex-1">
                        <div className="text-[12px] font-mono font-semibold text-white/90">{opt.label}</div>
                        <div className="text-[8.5px] font-mono tracking-[0.22em] uppercase" style={{ color: `${opt.color}aa` }}>
                          {opt.subtitle} · {opt.modules.length} modules
                        </div>
                      </div>
                      {isActive && <span className="text-[10px] font-mono" style={{ color: opt.color }}>●</span>}
                    </button>
                  </li>
                );
              })}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>

      {/* Module accordion list */}
      <ul className="w-full flex flex-col gap-3">
        {pathSel.modules.map((mod, idx) => {
          const isOpen = expandedId === mod.id;
          return (
            <motion.li key={mod.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05, duration: 0.25 }}
              className="rounded-md border overflow-hidden"
              style={{
                borderColor: isOpen ? `${accent}66` : 'rgba(255,255,255,0.08)',
                backgroundColor: 'rgba(10,11,15,0.6)',
                boxShadow: isOpen ? `0 0 18px ${accent}1f` : 'none',
                transition: 'border-color 0.2s, box-shadow 0.2s',
              }}>
              <button type="button"
                onClick={() => setExpandedId(isOpen ? null : mod.id)}
                className="w-full flex items-center gap-4 px-4 py-3.5 text-left hover:bg-white/[0.02] transition-colors">
                {/* Number badge */}
                <div className="flex-shrink-0 w-9 h-9 rounded-md flex items-center justify-center font-mono font-bold text-[14px]"
                  style={{
                    backgroundColor: `${accent}1a`,
                    border: `1px solid ${accent}33`,
                    color: accent,
                  }}>
                  {idx + 1}
                </div>

                {/* Title block */}
                <div className="flex-1 min-w-0">
                  <div className="text-[14px] font-semibold text-white/95 truncate">{mod.label}</div>
                  <div className="text-[9px] font-mono tracking-[0.2em] uppercase mt-0.5" style={{ color: `${accent}aa` }}>
                    {mod.subtitle}
                  </div>
                </div>

                {/* Topics count + chevron */}
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="text-[11px] font-mono text-white/45">
                    {mod.submodules.length} Topics
                  </span>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="w-7 h-7 rounded-full flex items-center justify-center"
                    style={{
                      backgroundColor: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.08)',
                    }}>
                    <span className="text-[10px] text-white/60">▾</span>
                  </motion.div>
                </div>
              </button>

              {/* Expandable submodule list */}
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.22, ease: 'easeInOut' }}
                    className="overflow-hidden"
                    style={{ borderTop: `1px solid ${accent}22` }}>
                    <ul className="flex flex-col">
                      {mod.submodules.map((sub, i) => (
                        <li key={sub.id}>
                          <button type="button"
                            onClick={() => onPick(sub.route)}
                            className="w-full flex items-center gap-4 px-4 py-2.5 text-left transition-colors hover:bg-white/[0.03] border-l-2"
                            style={{ borderLeftColor: 'transparent' }}
                            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderLeftColor = accent; }}
                            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderLeftColor = 'transparent'; }}>
                            <span className="flex-shrink-0 w-9 text-center text-[10px] font-mono tabular-nums" style={{ color: `${accent}88` }}>
                              {idx + 1}.{String(i + 1).padStart(2, '0')}
                            </span>
                            <span className="flex-1 text-[12.5px] text-white/80">{sub.label}</span>
                            <span className="text-[11px] font-mono" style={{ color: `${accent}aa` }}>→</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.li>
          );
        })}
      </ul>
    </div>
  );
};

// ─── MAIN TREE COMPONENT ───────────────────────────────────────────────────────
export const HierarchicalGrindTree: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full h-full flex flex-col bg-transparent overflow-hidden relative">
      {/* ── Header: L1-L5 Root Module Row ── */}
      <div className="flex-shrink-0 w-full pt-6 pb-5 px-2 sm:px-4 lg:px-6 border-b border-white/10 bg-[#0A0B0F]/95 backdrop-blur-md relative z-30 flex justify-center">
        <div className="w-full max-w-[900px] flex flex-col items-center">
          <div className="flex items-center justify-between w-full mb-5 px-1">
            <div className="flex items-center gap-2 text-[10px] font-mono tracking-[0.2em] text-white/55">
              <motion.span className="w-1 h-1 rounded-full bg-cyan-400/70"
                animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 2, repeat: Infinity }} />
              Foundation Framework
            </div>
            <div className="text-[9px] font-mono tracking-[0.2em] text-white/35">L1 - L5 · 5 modules</div>
          </div>

          <div className="relative w-full">
            {/* Animated horizontal connector trace - desktop only (gems wrap on mobile) */}
            <div className="absolute left-[8%] right-[8%] pointer-events-none hidden lg:block" style={{ top: 56 }}>
              <PathwayPulse color="#22d3ee" length={800} />
            </div>
            <div className="flex items-start justify-center gap-x-1.5 gap-y-3 lg:gap-4 w-full flex-wrap lg:flex-nowrap relative">
              {ROOT_NODES.map((node, idx) => (
                <RootGem key={node.id} node={node} index={idx}
                  onClick={() => { if (node.route && node.status !== 'locked') navigate(node.route); }} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── L6 Path Selector ── */}
      <div className="flex-1 w-full px-4 lg:px-6 pt-10 pb-12 flex flex-col items-center relative z-10 overflow-x-hidden overflow-y-auto scrollbar-hide">
        <div className="flex items-center gap-2 text-[10px] font-mono tracking-[0.2em] text-white/55 mb-4">
          <motion.span className="w-1 h-1 rounded-full bg-cyan-400/70"
            animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 2, repeat: Infinity }} />
          Choose your path
        </div>
        <L6PathDropdown onPick={(route) => navigate(route)} />
      </div>
    </div>
  );
};
