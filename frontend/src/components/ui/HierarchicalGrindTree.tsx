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
      { id: 'r1c1', label: 'Voltage Levels', pct: 100, color: '#22d3ee', icon: '⚡', locked: false },
      { id: 'r1c2', label: 'Current Flow', pct: 100, color: '#38bdf8', icon: '↺', locked: false },
      { id: 'r1c3', label: 'Ground Reference', pct: 100, color: '#0ea5e9', icon: '⏚', locked: false },
      { id: 'r1c4', label: 'Signal Integrity', pct: 80, color: '#7dd3fc', icon: '≋', locked: false },
      { id: 'r1c5', label: 'Probe Techniques', pct: 60, color: '#bae6fd', icon: '🔍', locked: false },
    ],
  },
  {
    id: 'r2',
    label: 'Binary',
    fullLabel: 'Binary Awakening',
    pct: 0,
    icon: '⊕',
    color: ['#065f46', '#34d399'],
    glow: '#34d399',
    route: '/module/2',
    status: 'active',
    children: [
      { id: 'r2c1', label: 'Number Systems', pct: 100, color: '#34d399', icon: '01', locked: false },
      { id: 'r2c2', label: 'Binary Arithmetic', pct: 90, color: '#6ee7b7', icon: '+', locked: false },
      { id: 'r2c3', label: "Two's Complement", pct: 70, color: '#10b981', icon: '±', locked: false },
      { id: 'r2c4', label: 'Hex & Octal', pct: 55, color: '#059669', icon: '0x', locked: false },
      { id: 'r2c5', label: 'BCD Encoding', pct: 20, color: '#a7f3d0', icon: '◧', locked: false },
      { id: 'r2c6', label: 'Gray Code', pct: 0, color: '#d1fae5', icon: '≡', locked: true },
    ],
  },
  {
    id: 'r4',
    label: 'Logic Gates',
    fullLabel: 'Logic Gates',
    pct: 0,
    icon: '⊃',
    color: ['#1e3a8a', '#60a5fa'],
    glow: '#60a5fa',
    route: '/module/3',
    status: 'active',
    children: [
      { id: 'r4c1', label: 'AND / OR / NOT', pct: 0, color: '#60a5fa', icon: '∧', locked: false },
      { id: 'r4c2', label: 'NAND / NOR', pct: 0, color: '#3b82f6', icon: '↑', locked: false },
      { id: 'r4c3', label: 'XOR / XNOR', pct: 0, color: '#2563eb', icon: '⊕', locked: false },
      { id: 'r4c4', label: 'Universal Gates', pct: 0, color: '#bfdbfe', icon: '⊗', locked: false },
      { id: 'r4c5', label: 'Gate Minimization', pct: 0, color: '#dbeafe', icon: '▣', locked: false },
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
    route: '/module/4',
    status: 'active',
    children: [
      { id: 'r5c1', label: '2-Variable Maps', pct: 0, color: '#fb7185', icon: '▣', locked: false },
      { id: 'r5c2', label: '3-Variable Maps', pct: 0, color: '#f43f5e', icon: '▤', locked: false },
      { id: 'r5c3', label: '4-Variable Maps', pct: 0, color: '#e11d48', icon: '▥', locked: false },
      { id: 'r5c4', label: "Don't Care Terms", pct: 0, color: '#fda4af', icon: '⊘', locked: false },
      { id: 'r5c5', label: 'SOP / POS Forms', pct: 0, color: '#fecdd3', icon: 'Σ', locked: false },
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
    route: '/module/5',
    status: 'active',
    children: [
      { id: 'r6c1', label: 'Module Syntax', pct: 0, color: '#c4b5fd', icon: '{', locked: false },
      { id: 'r6c2', label: 'Wire & Reg', pct: 0, color: '#a78bfa', icon: '≋', locked: false },
      { id: 'r6c3', label: 'Always Blocks', pct: 0, color: '#8b5cf6', icon: '⟳', locked: false },
      { id: 'r6c4', label: 'Testbenches', pct: 0, color: '#7c3aed', icon: '⊡', locked: false },
      { id: 'r6c5', label: 'State Machines', pct: 0, color: '#ddd6fe', icon: '⬡', locked: false },
      { id: 'r6c6', label: 'Simulation', pct: 0, color: '#ede9fe', icon: '▶', locked: false },
    ],
  },
];


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

      const w = canvas.width, h = canvas.height, cy = h / 2;

      if (type === 'Signal Return') {
        for (let x = 0; x < w; x++) {
          const y = cy + 15 * Math.sin(0.1 * x + t);
          if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
      } else if (type === 'Discrete') {
        for (let x = 0; x < w; x += 10) {
          const y = cy + 15 * Math.sin(0.1 * x + t);
          ctx.moveTo(x, cy); ctx.lineTo(x, y);
          ctx.arc(x, y, 2, 0, Math.PI * 2);
        }
      } else {
        // Binary/Logic
        for (let x = 0; x < w; x += 15) {
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
              <stop offset="0%" stopColor={isLocked ? '#1e293b' : c1} stopOpacity={0.95} />
              <stop offset="55%" stopColor={isLocked ? '#0f172a' : c0} stopOpacity={0.85} />
              <stop offset="100%" stopColor={isLocked ? '#080c15' : c0} stopOpacity={1} />
            </radialGradient>
            <filter id={`gf-${node.id}`}>
              <feGaussianBlur stdDeviation={hov ? 7 : 4} result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
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
                <line x1="37" y1="3" x2="37" y2="70" stroke={c1} strokeWidth="0.5" opacity="0.22" />
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
  const [expanded, setExpanded] = useState<Set<string>>(new Set(['r1', 'r2', 'r4']));

  const toggle = (id: string) => {
    setExpanded(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const branches = [
    {
      id: 'branch-electronics',
      title: 'Basic Electronics',
      subtitle: 'FUNDAMENTAL_PHYSICS',
      color: '#22d3ee',
      nodes: [
        { id: 's00', label: 'Breaking Point', subtitle: 'L6.S00', route: '/module/6/0' },
        { id: 's01', label: 'Industry Problem', subtitle: 'L6.S01', route: '/module/6/2' },
        { id: 's03', label: 'What is HDL?', subtitle: 'L6.S03', route: '/module/6/4' },
        { id: 's03a', label: 'Verilog Mandate', subtitle: 'L6.S03a', route: '/module/6/8' },
      ]
    },
    {
      id: 'branch-design',
      title: 'Digital System Design',
      subtitle: 'ARCH_SYNTHESIS',
      color: '#34d399',
      nodes: [
        { id: 's02', label: 'Abstraction Ladder', subtitle: 'L6.S02', route: '/module/6/11' },
        { id: 's05', label: 'VLSI Connection', subtitle: 'L6.S05', route: '/module/6/14' },
        { id: 's13', label: 'Synthesis Flow', subtitle: 'L6.S13', route: '/module/6/13' },
        { id: 's14', label: 'FPGA vs ASIC', subtitle: 'L6.S14', route: '/module/6/23' },
      ]
    },
    {
      id: 'branch-verilog',
      title: 'Verilog Expertise',
      subtitle: 'RTL_VERIFICATION',
      color: '#a78bfa',
      nodes: [
        { id: 's06', label: 'First Verilog', subtitle: 'L6.S06', route: '/module/6/16' },
        { id: 's06a', label: 'Testbench Mirror', subtitle: 'L6.S06a', route: '/module/6/17' },
        { id: 's20', label: 'AI Hardware', subtitle: 'L6.S20', route: '/module/6/24' },
        { id: 's21', label: 'Power Design', subtitle: 'L6.S21', route: '/module/6/25' },
      ]
    }
  ];

  return (
    <div className="w-full h-full flex flex-col bg-transparent overflow-hidden">
      {/* ── Fixed Header Area ── */}
      <div className="flex-shrink-0 w-full pt-6 pb-2 px-10 border-b border-white/5 bg-black/20 backdrop-blur-md relative z-30">
        <div className="flex flex-col items-center">
            <div className="flex items-center gap-1.5 mb-6 text-[9px] font-mono tracking-[0.4em] text-cyan-400/40 uppercase">
                <div className="w-1 h-1 rounded-full bg-cyan-400 animate-pulse" />
                Stationary Framework // Level 1-5 Access
            </div>
            
            <div className="flex items-end justify-center gap-6 w-full">
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
        </div>
      </div>

      {/* ── Scrollable Branches Area ── */}
      <div
        className="flex-1 w-full overflow-y-auto px-10 pt-10 pb-24 scrollbar-hide relative z-10"
      >
        <div className="max-w-[1400px] mx-auto">
            {/* Connection Hub Visualization */}
            <div className="flex justify-center mb-16 relative">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-16 bg-gradient-to-b from-white/10 to-transparent" />
            </div>

            {/* Three Vertical Branches */}
            <div className="grid grid-cols-3 gap-24 w-full">
                {branches.map(branch => (
                    <div key={branch.id} className="flex flex-col items-center space-y-16 relative">
                        {/* Branch Header */}
                        <div className="text-center space-y-2 mb-4">
                            <div className="text-[10px] uppercase tracking-[0.5em] font-black opacity-40 mb-1" style={{ color: branch.color }}>
                                {branch.subtitle}
                            </div>
                            <h3 className="text-3xl font-black uppercase tracking-tighter text-white">{branch.title}</h3>
                            <div className="h-1 w-24 mx-auto rounded-full mt-4" style={{ backgroundColor: branch.color, boxShadow: `0 0 20px ${branch.color}` }} />
                        </div>

                        {/* Node List */}
                        <div className="space-y-12 w-full flex flex-col items-center">
                            {branch.nodes.map((node, i) => (
                                <motion.div
                                    key={node.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="relative group cursor-pointer"
                                    onClick={() => navigate(node.route)}
                                >
                                    {/* Connectivity Trace (Flowing Energy) */}
                                    {i < branch.nodes.length - 1 && (
                                        <div 
                                            className="absolute top-full left-1/2 -translate-x-1/2 w-[2px] h-12 overflow-hidden z-0"
                                        >
                                            <div className="w-full h-full bg-white/5" />
                                            <motion.div 
                                                className="absolute top-0 left-0 w-full h-full opacity-50"
                                                style={{ background: `linear-gradient(to bottom, transparent, ${branch.color}, transparent)` }}
                                                animate={{ y: [-48, 48] }}
                                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                            />
                                        </div>
                                    )}

                                    {/* Premium Redesigned Node Card */}
                                    <div className="w-80 h-44 bg-[#0A0C10]/80 backdrop-blur-2xl rounded-[40px] border border-white/5 relative overflow-hidden group transition-all duration-700 hover:border-white/20 shadow-[0_30px_80px_rgba(0,0,0,0.6)]">
                                        {/* Animated Scanning Line */}
                                        <motion.div 
                                            className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent z-20"
                                            animate={{ y: [0, 176, 0] }}
                                            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                        />

                                        {/* Background Grid Pattern */}
                                        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                                             style={{ backgroundImage: `radial-gradient(circle at 1.5px 1.5px, white 1px, transparent 0)`, backgroundSize: '16px 16px' }} />

                                        {/* Right Decorative Die Element */}
                                        <div className="absolute right-[-30px] top-1/2 -translate-y-1/2 w-56 h-56 rounded-full border border-white/[0.03] flex items-center justify-center group-hover:border-white/[0.08] transition-all duration-700">
                                            <div className="w-40 h-40 rounded-full border border-white/[0.01]" />
                                            <motion.div 
                                                className="absolute inset-6 rounded-full border-t border-white/[0.05]"
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                            />
                                        </div>

                                        {/* Status Header */}
                                        <div className="absolute top-8 left-10 z-10">
                                            <div className="flex items-center gap-2 mb-3">
                                                <div className="w-2 h-2 rounded-full relative" style={{ backgroundColor: branch.color, boxShadow: `0 0 15px ${branch.color}` }}>
                                                    <div className="absolute inset-0 rounded-full animate-ping" style={{ backgroundColor: branch.color }} />
                                                </div>
                                                <div className="text-[8px] font-mono text-white/30 uppercase tracking-[0.6em]">{node.subtitle}</div>
                                            </div>
                                        </div>

                                        {/* Module Title */}
                                        <div className="absolute left-10 bottom-10 z-10 w-3/5">
                                            <h4 className="text-xl font-black text-white/90 uppercase tracking-tight leading-tight group-hover:text-cyan-400 transition-colors duration-500">
                                                {node.label}
                                            </h4>
                                            <div className="mt-3 flex items-center gap-2">
                                                <div className="h-px w-6 bg-white/10 group-hover:bg-cyan-400/50 transition-all duration-500" />
                                                <span className="text-[7px] font-mono text-white/10 group-hover:text-cyan-400/40 uppercase tracking-[0.4em] transition-all duration-500">
                                                    LogicGate_Pro // V2.1
                                                </span>
                                            </div>
                                        </div>

                                        {/* Dynamic Hover Background */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};
