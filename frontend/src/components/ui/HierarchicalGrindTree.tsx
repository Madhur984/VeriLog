import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// ─── TYPE DEFINITIONS ──────────────────────────────────────────────────────────
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
  pct: number;
  icon: string;
  color: [string, string]; // [dark, light]
  glow: string;
  route?: string;
  status: 'done' | 'active' | 'locked';
  children: SubNode[];
}

// ─── DATA ──────────────────────────────────────────────────────────────────────
const ROOT_NODES: RootNode[] = [
  {
    id: 'r1',
    label: 'Signal Return',
    fullLabel: 'A Signal Must Return',
    pct: 0,
    icon: '〜',
    color: ['#0e7490', '#22d3ee'],
    glow: '#22d3ee',
    route: '/module/1',
    status: 'done',
    children: [
      { id: 'r1c1', label: 'Voltage Levels',    pct: 100, color: '#22d3ee', icon: '⚡', locked: false },
      { id: 'r1c2', label: 'Current Flow',      pct: 100, color: '#38bdf8', icon: '↺',  locked: false },
      { id: 'r1c3', label: 'Ground Reference',  pct: 100, color: '#0ea5e9', icon: '⏚',  locked: false },
      { id: 'r1c4', label: 'Signal Integrity',  pct: 80,  color: '#7dd3fc', icon: '≋',  locked: false },
      { id: 'r1c5', label: 'Probe Techniques',  pct: 60,  color: '#bae6fd', icon: '🔍', locked: false },
    ],
  },
  {
    id: 'r2',
    label: 'Discrete',
    fullLabel: 'Continuous vs Discrete',
    pct: 0,
    icon: '⊞',
    color: ['#6d28d9', '#a78bfa'],
    glow: '#a78bfa',
    route: '/module/2',
    status: 'done',
    children: [
      { id: 'r2c1', label: 'Analog Signals',     pct: 100, color: '#a78bfa', icon: '∿',  locked: false },
      { id: 'r2c2', label: 'Sampling Theorem',   pct: 85,  color: '#c4b5fd', icon: '≈',  locked: false },
      { id: 'r2c3', label: 'Quantization',       pct: 70,  color: '#8b5cf6', icon: '◫',  locked: false },
      { id: 'r2c4', label: 'Nyquist Rate',       pct: 50,  color: '#7c3aed', icon: '∫',  locked: false },
      { id: 'r2c5', label: 'ADC / DAC',          pct: 30,  color: '#ddd6fe', icon: '⇄',  locked: false },
    ],
  },
  {
    id: 'r3',
    label: 'Binary',
    fullLabel: 'Binary Awakening',
    pct: 0,
    icon: '⊕',
    color: ['#065f46', '#34d399'],
    glow: '#34d399',
    route: '/module/3',
    status: 'active',
    children: [
      { id: 'r3c1', label: 'Number Systems',    pct: 100, color: '#34d399', icon: '01',  locked: false },
      { id: 'r3c2', label: 'Binary Arithmetic', pct: 90,  color: '#6ee7b7', icon: '+',   locked: false },
      { id: 'r3c3', label: "Two's Complement",  pct: 70,  color: '#10b981', icon: '±',   locked: false },
      { id: 'r3c4', label: 'Hex & Octal',       pct: 55,  color: '#059669', icon: '0x',  locked: false },
      { id: 'r3c5', label: 'BCD Encoding',      pct: 20,  color: '#a7f3d0', icon: '◧',   locked: false },
      { id: 'r3c6', label: 'Gray Code',         pct: 0,   color: '#d1fae5', icon: '≡',   locked: true  },
    ],
  },
  {
    id: 'r4',
    label: 'Logic Gates',
    fullLabel: 'Logic Gates',
    pct: 0,
    icon: '⊃',
    color: ['#92400e', '#fbbf24'],
    glow: '#fbbf24',
    route: '/module/4',
    status: 'active',
    children: [
      { id: 'r4c1', label: 'AND / OR / NOT',    pct: 0, color: '#fbbf24', icon: '∧', locked: false },
      { id: 'r4c2', label: 'NAND / NOR',        pct: 0, color: '#f59e0b', icon: '↑', locked: false },
      { id: 'r4c3', label: 'XOR / XNOR',        pct: 0, color: '#d97706', icon: '⊕', locked: false },
      { id: 'r4c4', label: 'Universal Gates',   pct: 0, color: '#fde68a', icon: '⊗', locked: false },
      { id: 'r4c5', label: 'Gate Minimization', pct: 0, color: '#fef3c7', icon: '▣', locked: false },
    ],
  },
  {
    id: 'r5',
    label: 'K-Maps',
    fullLabel: 'K-Maps',
    pct: 0,
    icon: '▦',
    color: ['#9f1239', '#fb7185'],
    glow: '#fb7185',
    route: '/module/5',
    status: 'active',
    children: [
      { id: 'r5c1', label: '2-Variable Maps',   pct: 0, color: '#fb7185', icon: '▣', locked: false },
      { id: 'r5c2', label: '3-Variable Maps',   pct: 0, color: '#f43f5e', icon: '▤', locked: false },
      { id: 'r5c3', label: '4-Variable Maps',   pct: 0, color: '#e11d48', icon: '▥', locked: false },
      { id: 'r5c4', label: "Don't Care Terms",  pct: 0, color: '#fda4af', icon: '⊘', locked: false },
      { id: 'r5c5', label: 'SOP / POS Forms',   pct: 0, color: '#fecdd3', icon: 'Σ', locked: false },
    ],
  },
  {
    id: 'r6',
    label: 'Verilog',
    fullLabel: 'Verilog Basics',
    pct: 0,
    icon: '≡',
    color: ['#4c1d95', '#c4b5fd'],
    glow: '#c4b5fd',
    route: '/verilog',
    status: 'locked',
    children: [
      { id: 'r6c1', label: 'Module Syntax',     pct: 0, color: '#c4b5fd', icon: '{', locked: true },
      { id: 'r6c2', label: 'Wire & Reg',        pct: 0, color: '#a78bfa', icon: '≋', locked: true },
      { id: 'r6c3', label: 'Always Blocks',     pct: 0, color: '#8b5cf6', icon: '⟳', locked: true },
      { id: 'r6c4', label: 'Testbenches',       pct: 0, color: '#7c3aed', icon: '⊡', locked: true },
      { id: 'r6c5', label: 'State Machines',    pct: 0, color: '#ddd6fe', icon: '⬡', locked: true },
      { id: 'r6c6', label: 'Simulation',        pct: 0, color: '#ede9fe', icon: '▶', locked: true },
    ],
  },
];

// ─── JEWEL POLYHEDRON ──────────────────────────────────────────────────────────
const JewelPolyhedron: React.FC = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.5, rotate: -30 }}
    animate={{ opacity: 1, scale: 1, rotate: 0 }}
    transition={{ delay: 1.8, duration: 1.2, type: 'spring', stiffness: 80 }}
    className="relative flex items-center justify-center"
    style={{ width: 120, height: 120 }}
  >
    <motion.svg
      width={120}
      height={120}
      viewBox="0 0 120 120"
      style={{ overflow: 'visible' }}
      animate={{ rotate: 360 }}
      transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
    >
      <defs>
        <radialGradient id="jewel-core" cx="40%" cy="35%">
          <stop offset="0%"   stopColor="#c4b5fd" stopOpacity={0.95} />
          <stop offset="40%"  stopColor="#7c3aed" stopOpacity={0.85} />
          <stop offset="100%" stopColor="#fbbf24" stopOpacity={0.9} />
        </radialGradient>
        <filter id="jewel-glow">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      {/* Outer glow halo */}
      <ellipse cx="60" cy="100" rx="35" ry="8" fill="#7c3aed" opacity="0.2">
        <animate attributeName="opacity" values="0.12;0.28;0.12" dur="3s" repeatCount="indefinite" />
      </ellipse>

      {/* Main gem body — icosahedron approximation */}
      <g filter="url(#jewel-glow)">
        {/* Top face */}
        <polygon points="60,8 90,36 60,46 30,36" fill="url(#jewel-core)" opacity="0.95" />
        {/* Mid-right face */}
        <polygon points="90,36 100,68 72,82 60,46" fill="#7c3aed" opacity="0.8" />
        {/* Mid-left face */}
        <polygon points="30,36 60,46 48,82 20,68" fill="#6d28d9" opacity="0.7" />
        {/* Bottom face */}
        <polygon points="60,46 72,82 60,92 48,82" fill="#4c1d95" opacity="0.85" />
        {/* Bottom-right foot */}
        <polygon points="72,82 100,68 88,98 60,92" fill="#5b21b6" opacity="0.6" />
        {/* Bottom-left foot */}
        <polygon points="48,82 60,92 32,98 20,68" fill="#4c1d95" opacity="0.55" />

        {/* Facet edge lines */}
        <line x1="60" y1="8"  x2="60" y2="92" stroke="#c4b5fd" strokeWidth="0.5" opacity="0.3" />
        <line x1="30" y1="36" x2="100" y2="68" stroke="#c4b5fd" strokeWidth="0.5" opacity="0.25" />
        <line x1="90" y1="36" x2="20" y2="68"  stroke="#fbbf24" strokeWidth="0.5" opacity="0.25" />

        {/* Shine flare */}
        <polygon points="60,8 72,22 62,20" fill="#e9d5ff" opacity="0.7" />
        <polygon points="90,36 100,44 96,38" fill="#fde68a" opacity="0.5" />
      </g>

      {/* Top apex LED */}
      <circle cx="60" cy="8" r="3" fill="#c4b5fd">
        <animate attributeName="opacity" values="1;0.3;1" dur="1.8s" repeatCount="indefinite" />
      </circle>
    </motion.svg>

    {/* Label */}
    <div
      className="absolute -bottom-6 text-center text-[7px] font-black tracking-[0.25em] uppercase"
      style={{ color: '#c4b5fd60', width: 140, left: '-10px' }}
    >
      JEWEL CONSTRUCT Ω
    </div>
  </motion.div>
);

// ─── MODULE PREVIEWS ──────────────────────────────────────────────────────────
const ModulePreview: React.FC<{ type: string; color: string }> = ({ type, color }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let t = 0;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      
      const w = canvas.width, h = canvas.height, cy = h/2;
      
      if (type === 'Signal Return') {
        for(let x=0; x<w; x++) {
          const y = cy + 15 * Math.sin(0.1 * x + t);
          if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
      } else if (type === 'Discrete') {
        for(let x=0; x<w; x+=10) {
          const y = cy + 15 * Math.sin(0.1 * x + t);
          ctx.moveTo(x, cy); ctx.lineTo(x, y);
          ctx.arc(x, y, 2, 0, Math.PI * 2);
        }
      } else {
        // Binary/Logic
        for(let x=0; x<w; x+=15) {
          const val = Math.sin(0.1 * x + t) > 0 ? 1 : 0;
          const y = cy + (val ? -15 : 15);
          ctx.rect(x, y, 10, 2);
        }
      }
      ctx.stroke();
      t += 0.1;
      requestAnimationFrame(animate);
    };
    const raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [type, color]);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="absolute -top-24 left-1/2 -translate-x-1/2 w-32 h-20 rounded-xl overflow-hidden pointer-events-none"
      style={{ 
        background: 'rgba(5, 8, 12, 0.9)', 
        border: `1px solid ${color}40`,
        backdropFilter: 'blur(10px)',
        boxShadow: `0 0 20px ${color}20`
      }}
    >
      <canvas ref={canvasRef} width={128} height={80} className="w-full h-full opacity-60" />
      <div className="absolute top-1 left-2 text-[6px] font-black uppercase text-white/40 tracking-widest">
        Live_Telemetry // {type.toUpperCase()}
      </div>
    </motion.div>
  );
};

const SubNodeBadge: React.FC<{ node: SubNode; delay: number }> = ({ node, delay }) => {
  const [hov, setHov] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.7 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.4, type: 'spring' }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      className="relative flex flex-col items-center cursor-default group"
      style={{ width: 76 }}
    >
      {/* Micro-gate shape */}
      <div
        className="relative flex items-center justify-center rounded-lg"
        style={{
          width: 44,
          height: 36,
          background: node.locked
            ? 'rgba(15,23,42,0.7)'
            : `linear-gradient(135deg, ${node.color}22 0%, ${node.color}08 100%)`,
          border: `1px solid ${node.locked ? 'rgba(255,255,255,0.05)' : `${node.color}50`}`,
          boxShadow: hov && !node.locked ? `0 0 14px ${node.color}50` : 'none',
          transition: 'box-shadow 0.2s',
        }}
      >
        {/* Corner solder pads */}
        {!node.locked && (
          <>
            <div className="absolute top-0.5 left-0.5 w-1.5 h-1 rounded-sm" style={{ background: node.color, opacity: 0.5 }} />
            <div className="absolute top-0.5 right-0.5 w-1.5 h-1 rounded-sm" style={{ background: node.color, opacity: 0.5 }} />
            <div className="absolute bottom-0.5 left-0.5 w-1.5 h-1 rounded-sm" style={{ background: node.color, opacity: 0.5 }} />
            <div className="absolute bottom-0.5 right-0.5 w-1.5 h-1 rounded-sm" style={{ background: node.color, opacity: 0.5 }} />
          </>
        )}
        <span
          className="text-[11px] font-mono font-bold"
          style={{ color: node.locked ? '#1e293b' : node.color }}
        >
          {node.locked ? '🔒' : node.icon}
        </span>

        {/* LED top pip */}
        {!node.locked && (
          <motion.div
            className="absolute -top-1 w-1.5 h-1.5 rounded-full"
            style={{ background: node.color, boxShadow: `0 0 5px ${node.color}` }}
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.5 + delay, repeat: Infinity }}
          />
        )}
      </div>

      {/* Label */}
      <div
        className="mt-1 text-center leading-tight"
        style={{
          fontSize: 7,
          fontWeight: 800,
          letterSpacing: '0.12em',
          color: node.locked ? '#1e293b' : `${node.color}cc`,
          lineHeight: 1.2,
          maxWidth: 72,
          fontFamily: 'monospace',
        }}
      >
        {node.label}
      </div>

      {/* Pct */}
      <div
        className="text-[8px] font-black font-mono tabular-nums mt-0.5"
        style={{ color: node.locked ? '#0f172a' : node.color }}
      >
        {node.pct}%
      </div>

      {/* Hover tooltip */}
      <AnimatePresence>
        {hov && !node.locked && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.9 }}
            transition={{ duration: 0.15 }}
            className="absolute -top-10 z-50 px-2 py-1 rounded-lg text-[8px] font-bold font-mono whitespace-nowrap"
            style={{
              background: 'rgba(6,9,15,0.95)',
              border: `1px solid ${node.color}50`,
              color: node.color,
              boxShadow: `0 0 10px ${node.color}30`,
            }}
          >
            {node.label} · {node.pct}%
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ─── ROOT GEM NODE ────────────────────────────────────────────────────────────
const RootGem: React.FC<{
  node: RootNode;
  expanded: boolean;
  onClick: () => void;
}> = ({ node, expanded, onClick }) => {
  const [hov, setHov] = useState(false);
  const [c0, c1] = node.color;
  const isLocked = node.status === 'locked';
  const isActive = node.status === 'active';

  return (
    <motion.div
      className="relative flex flex-col items-center"
      style={{ width: 110, cursor: isLocked ? 'not-allowed' : 'pointer' }}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: ROOT_NODES.indexOf(node) * 0.1, duration: 0.6, type: 'spring' }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={() => { if (!isLocked) onClick(); }}
    >
      {/* Label badge */}
      <div
        className="text-[7px] font-black tracking-[0.25em] uppercase mb-2 px-2 py-0.5 rounded-sm border"
        style={{
          color: isLocked ? '#1e293b' : node.glow,
          borderColor: isLocked ? '#1e293b' : `${node.glow}40`,
          background: isLocked ? 'transparent' : `${c0}30`,
        }}
      >
        {node.label}
      </div>

      {/* Gem SVG */}
      <motion.div
        animate={isActive ? { y: [0, -5, 0] } : {}}
        transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
      >
        <svg width={74} height={84} viewBox="0 0 74 84" style={{ overflow: 'visible' }}>
          <defs>
            <radialGradient id={`rg-${node.id}`} cx="40%" cy="30%">
              <stop offset="0%"   stopColor={isLocked ? '#1e293b' : c1} stopOpacity={0.95} />
              <stop offset="55%"  stopColor={isLocked ? '#0f172a' : c0} stopOpacity={0.85} />
              <stop offset="100%" stopColor={isLocked ? '#080c15' : c0} stopOpacity={1}    />
            </radialGradient>
            <filter id={`gf-${node.id}`}>
              <feGaussianBlur stdDeviation={hov ? 7 : 4} result="blur" />
              <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>

          {/* Glow halo */}
          {!isLocked && (
            <ellipse cx="37" cy="72" rx="26" ry="7" fill={node.glow} opacity={hov ? 0.22 : 0.09}>
              <animate attributeName="opacity" values={`0.09;${hov ? 0.28 : 0.16};0.09`} dur="2.2s" repeatCount="indefinite" />
            </ellipse>
          )}

          {/* Gem body */}
          <g filter={`url(#gf-${node.id})`}>
            <polygon
              points="37,3 63,20 63,54 37,70 11,54 11,20"
              fill={`url(#rg-${node.id})`}
              stroke={isLocked ? '#1e293b' : c1}
              strokeWidth={isActive ? 2 : 1.5}
              opacity={isLocked ? 0.35 : 1}
            />
            {!isLocked && (
              <>
                <line x1="37" y1="3"  x2="37" y2="70" stroke={c1} strokeWidth="0.5" opacity="0.22" />
                <line x1="11" y1="20" x2="63" y2="54" stroke={c1} strokeWidth="0.5" opacity="0.18" />
                <line x1="63" y1="20" x2="11" y2="54" stroke={c1} strokeWidth="0.5" opacity="0.18" />
                <polygon points="37,7 47,18 37,16" fill={c1} opacity="0.35" />
              </>
            )}
            {isLocked && <text x="37" y="42" textAnchor="middle" fontSize="16" fill="#334155" fontFamily="monospace">🔒</text>}
          </g>

          {/* Icon */}
          {!isLocked && (
            <text x="37" y="45" textAnchor="middle" fontSize="18" fill={c1} fontFamily="monospace" opacity="0.9">
              {node.icon}
            </text>
          )}

          {/* LED pip */}
          {!isLocked && (
            <circle cx="37" cy="3" r="3" fill={c1}>
              <animate attributeName="opacity" values="1;0.3;1" dur="1.8s" repeatCount="indefinite" />
            </circle>
          )}

          {/* Active pulse ring */}
          {isActive && (
            <polygon points="37,3 63,20 63,54 37,70 11,54 11,20" fill="none" stroke={node.glow} strokeWidth="2" opacity="0.6">
              <animate attributeName="stroke-width" values="2;5;2" dur="2s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.6;0.1;0.6" dur="2s" repeatCount="indefinite" />
            </polygon>
          )}

          {/* Expand indicator */}
          {!isLocked && (
            <text x="37" y="78" textAnchor="middle" fontSize="8" fill={node.glow} opacity="0.6" fontFamily="monospace">
              {expanded ? '▲' : '▼'}
            </text>
          )}
        </svg>
      </motion.div>

      {/* Percentage */}
      <div className="mt-1 text-[10px] font-black font-mono tabular-nums" style={{ color: isLocked ? '#1e293b' : node.glow }}>
        {node.pct}%
      </div>

      {/* Full label shrunk */}
      <div
        className="mt-0.5 text-center leading-tight text-[6px] font-bold tracking-[0.15em] uppercase opacity-55"
        style={{ color: isLocked ? '#1e293b' : c1, fontFamily: 'monospace', maxWidth: 100 }}
      >
        {node.fullLabel}
      </div>

      {/* Double-click hint */}
      {!isLocked && hov && (
        <>
          <ModulePreview type={node.label} color={node.glow} />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute -bottom-5 text-[7px] font-mono"
            style={{ color: node.glow + '80' }}
          >
            click to navigate →
          </motion.div>
        </>
      )}
    </motion.div>
  );
};

// ─── MAIN TREE COMPONENT ───────────────────────────────────────────────────────
export const HierarchicalGrindTree: React.FC = () => {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState<Set<string>>(new Set(['r1', 'r2', 'r3']));

  const toggle = (id: string) => {
    setExpanded(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  return (
    <div className="w-full h-full flex flex-col items-center bg-transparent">
      {/* ── Scrollable Modules Area ── */}
      <div 
        className="flex-1 w-full overflow-y-auto px-10 pt-10 pb-20 scrollbar-thin scrollbar-thumb-cyan-500/20 scrollbar-track-transparent"
        style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(34,211,238,0.2) transparent' }}
      >
        <div className="flex flex-col items-center w-full min-h-full">
          {/* Diagnostic console status — top */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 mb-10 text-[11px] font-mono tracking-widest text-cyan-400/60 uppercase"
          >
            <div className="w-1 h-1 rounded-full bg-cyan-400 animate-pulse" />
            Active Module Recognition System Online
          </motion.div>

          {/* ── Root nodes row ── */}
          <div className="relative flex items-end justify-center gap-4 z-10 w-full">
            {ROOT_NODES.map(node => (
              <RootGem
                key={node.id}
                node={node}
                expanded={expanded.has(node.id)}
                onClick={() => {
                  toggle(node.id);
                  if (node.route && node.status !== 'locked') navigate(node.route);
                }}
              />
            ))}
          </div>

          {/* ── Children rows ── */}
          <div className="relative mt-6 w-full" style={{ maxWidth: 1000 }}>
            {ROOT_NODES.map((node) => (
              <AnimatePresence key={node.id}>
                {expanded.has(node.id) && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, y: -10 }}
                    animate={{ opacity: 1, height: 'auto', y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -10 }}
                    transition={{ duration: 0.45, ease: 'easeOut' }}
                    className="overflow-hidden"
                  >
                    <div className="w-full flex justify-center mb-2">
                      <motion.div
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: 1 }}
                        transition={{ duration: 0.3 }}
                        style={{
                          width: 2,
                          height: 20,
                          background: `linear-gradient(to bottom, ${node.glow}, ${node.glow}40)`,
                          boxShadow: `0 0 6px ${node.glow}60`,
                          transformOrigin: 'top',
                        }}
                      />
                    </div>

                    <div className="w-full flex justify-center mb-3">
                      <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 0.4, delay: 0.15 }}
                        style={{
                          width: Math.min(node.children.length * 84, 520),
                          height: 2,
                          background: `linear-gradient(90deg, transparent, ${node.glow}80, ${node.glow}, ${node.glow}80, transparent)`,
                          boxShadow: `0 0 8px ${node.glow}60`,
                          transformOrigin: 'center',
                        }}
                      />
                    </div>

                    <div className="flex justify-center gap-3 flex-wrap px-4">
                      {node.children.map((child, ci) => (
                        <div key={child.id} className="flex flex-col items-center">
                          <motion.div
                            initial={{ scaleY: 0 }}
                            animate={{ scaleY: 1 }}
                            transition={{ duration: 0.25, delay: 0.25 + ci * 0.05 }}
                            style={{
                              width: 1.5,
                              height: 16,
                              background: child.locked ? '#1e293b' : `${child.color}80`,
                              boxShadow: child.locked ? 'none' : `0 0 4px ${child.color}60`,
                              transformOrigin: 'top',
                              marginBottom: 4,
                            }}
                          />
                          <SubNodeBadge node={child} delay={0.3 + ci * 0.07} />
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-center mt-4 gap-2" style={{ opacity: 0.4 }}>
                      {node.children.map((_, ci) => (
                        <div key={ci} className="rounded-sm" style={{ width: 44, height: 4, background: `linear-gradient(90deg, transparent, ${node.glow}40, transparent)` }} />
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            ))}
          </div>
        </div>
      </div>

      {/* ── Bottom Fixed Legend ── */}
      <div className="flex-shrink-0 flex items-end justify-between py-6 w-full px-10 border-t border-cyan-400/10 z-20" style={{ maxWidth: 1000, background: 'rgba(6,9,15,0.7)', backdropFilter: 'blur(12px)' }}>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1, duration: 0.7 }}
          className="flex flex-col gap-2"
        >
          {[
            { label: 'Nodes Completed', val: '12/36', color: '#22d3ee' },
            { label: 'Active Pathways', val: '3',     color: '#34d399' },
            { label: 'XP Earned',       val: '2,480', color: '#fbbf24' },
            { label: 'Current Streak',  val: '7 days', color: '#fb7185' },
          ].map(({ label, val, color }) => (
            <div key={label} className="flex items-center gap-4">
              <div className="w-2 h-2 rounded-full" style={{ background: color, boxShadow: `0 0 8px ${color}` }} />
              <div className="text-[11px] font-mono tracking-wider" style={{ color: 'rgba(255,255,255,0.4)' }}>{label}</div>
              <div className="text-[13px] font-black font-mono" style={{ color }}>{val}</div>
            </div>
          ))}
        </motion.div>

        <div className="flex flex-col items-center">
          <JewelPolyhedron />
          <div className="text-[11px] font-black tracking-[0.3em] uppercase mt-2 text-white/40">
            JEWEL CONSTRUCT Ω
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.2, duration: 0.7 }}
          className="flex flex-col gap-3"
          style={{ width: 180 }}
        >
          <div className="rounded-xl p-3" style={{ background: 'rgba(6,9,15,0.8)', border: '1px solid rgba(34,211,238,0.1)' }}>
            <div className="text-[10px] font-black tracking-[0.3em] uppercase mb-3 px-1" style={{ color: '#22d3ee' }}>
              DATA PACKETS
            </div>
            {Array.from({ length: 5 }).map((_, i) => (
              <motion.div key={i} className="flex items-center gap-2 mb-1">
                <motion.div
                  className="h-1.5 rounded-full flex-1"
                  style={{ background: `linear-gradient(90deg, ${['#22d3ee','#a78bfa','#34d399','#fbbf24','#fb7185'][i]}40, ${['#22d3ee','#a78bfa','#34d399','#fbbf24','#fb7185'][i]})` }}
                  animate={{ scaleX: [0.3, 1, 0.3], x: [-10, 0, 10] }}
                  transition={{ duration: 2.5 + i * 0.4, repeat: Infinity, delay: i * 0.3 }}
                />
                <div className="text-[10px] font-mono font-bold w-6 text-right" style={{ color: 'rgba(255,255,255,0.4)' }}>
                  {['TX','RX','DM','CK','IN'][i]}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};
