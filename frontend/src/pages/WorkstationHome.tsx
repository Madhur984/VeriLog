import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    LayoutDashboard, Target, Settings, Command,
    BarChart3, FlaskConical, BookOpen, Play, Zap,
    Moon, Sun, HelpCircle, ChevronRight,
    Cpu, PanelLeftClose, PanelLeftOpen,
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useUserStore } from '../stores/userStore';
import { CommandPalette } from '../components/ui/CommandPalette';
import { OnboardingTour } from '../components/ui/OnboardingTour';
import { useColorScheme } from '../hooks/useColorScheme';

const getTourKey = (name: string | null) => `digi_tour_done_${name ?? 'guest'}`;

/* ══════════════════════════════════════════════════════════════════════
   DATA LAYER
══════════════════════════════════════════════════════════════════════ */

type Status = 'completed' | 'in-progress' | 'locked';
type BranchKey = 'basic' | 'dsd' | 'verilog';

interface Module {
    id: string; title: string; subtitle: string;
    progress: number; status: Status;
    hours: number; lessons: number;
    cx: number; cy: number;
    depth: number;
    branch: BranchKey | null;
    isHub?: boolean;
}

type ConnType = 'trunk' | 'hub-branch' | 'branch';
interface Connection { from: string; to: string; type: ConnType; }

/* ── Layout constants (enlarged, mathematical rhythm) ── */
const CW = 1280;
const FOUND_Y = 120;
const JUNCTION_Y = 280;
const BRANCH_Y = [380, 500, 620];
const BRANCH_COL: Record<BranchKey, number> = { basic: 480, dsd: 720, verilog: 960 };
const NODE_R = [28, 24, 22, 20];
const HUB_R = 36;
const CH = 720;

const MODULES: Module[] = [
    { id: 'C1', title: 'Signal Return', subtitle: 'The Rule of the Closed Loop', progress: 0, status: 'in-progress', hours: 0.1, lessons: 1, cx: 120, cy: FOUND_Y, depth: 0, branch: null },
    { id: 'C2', title: 'Logic Gates', subtitle: 'AND, OR, NOT, NAND, XOR', progress: 80, status: 'in-progress', hours: 3, lessons: 10, cx: 300, cy: FOUND_Y, depth: 0, branch: null },
    { id: 'C3', title: 'Boolean Algebra', subtitle: 'De Morgan, Simplification', progress: 40, status: 'in-progress', hours: 3.5, lessons: 9, cx: 480, cy: FOUND_Y, depth: 0, branch: null },
    { id: 'C4', title: 'Combinational', subtitle: 'MUX, Decoders, Adders', progress: 0, status: 'locked', hours: 4, lessons: 12, cx: 660, cy: FOUND_Y, depth: 0, branch: null },
    { id: 'C5', title: 'K-Maps', subtitle: 'K-map Minimization', progress: 0, status: 'locked', hours: 2, lessons: 6, cx: 840, cy: FOUND_Y, depth: 0, branch: null, isHub: true },
    { id: 'B1', title: 'BJT & MOSFET', subtitle: 'Transistor fundamentals', progress: 0, status: 'locked', hours: 3, lessons: 8, cx: BRANCH_COL.basic, cy: BRANCH_Y[0], depth: 1, branch: 'basic' },
    { id: 'B2', title: 'Amplifiers', subtitle: 'Op-amp & gain stages', progress: 0, status: 'locked', hours: 3, lessons: 9, cx: BRANCH_COL.basic, cy: BRANCH_Y[1], depth: 2, branch: 'basic' },
    { id: 'B3', title: 'Signal Analysis', subtitle: 'Fourier, filters, AC', progress: 0, status: 'locked', hours: 4, lessons: 10, cx: BRANCH_COL.basic, cy: BRANCH_Y[2], depth: 3, branch: 'basic' },
    { id: 'D1', title: 'Flip-Flops', subtitle: 'SR, D, JK, T, edge-trig', progress: 0, status: 'locked', hours: 3.5, lessons: 8, cx: BRANCH_COL.dsd, cy: BRANCH_Y[0], depth: 1, branch: 'dsd' },
    { id: 'D2', title: 'State Machines', subtitle: 'Mealy, Moore, FSM', progress: 0, status: 'locked', hours: 4, lessons: 10, cx: BRANCH_COL.dsd, cy: BRANCH_Y[1], depth: 2, branch: 'dsd' },
    { id: 'D3', title: 'Sequential Sys.', subtitle: 'Counters, Shift Registers', progress: 0, status: 'locked', hours: 4, lessons: 11, cx: BRANCH_COL.dsd, cy: BRANCH_Y[2], depth: 3, branch: 'dsd' },
    { id: 'V1', title: 'Verilog Basics', subtitle: 'Syntax, modules, wire/reg', progress: 0, status: 'locked', hours: 3, lessons: 8, cx: BRANCH_COL.verilog, cy: BRANCH_Y[0], depth: 1, branch: 'verilog' },
    { id: 'V2', title: 'RTL Design', subtitle: 'Combinational & sequential RTL', progress: 0, status: 'locked', hours: 4, lessons: 10, cx: BRANCH_COL.verilog, cy: BRANCH_Y[1], depth: 2, branch: 'verilog' },
    { id: 'V3', title: 'Testbenches', subtitle: 'Simulation, assertions', progress: 0, status: 'locked', hours: 4, lessons: 9, cx: BRANCH_COL.verilog, cy: BRANCH_Y[2], depth: 3, branch: 'verilog' },
];

const CONNECTIONS: Connection[] = [
    { from: 'C1', to: 'C2', type: 'trunk' },
    { from: 'C2', to: 'C3', type: 'trunk' },
    { from: 'C3', to: 'C4', type: 'trunk' },
    { from: 'C4', to: 'C5', type: 'trunk' },
    { from: 'C5', to: 'B1', type: 'hub-branch' },
    { from: 'C5', to: 'D1', type: 'hub-branch' },
    { from: 'C5', to: 'V1', type: 'hub-branch' },
    { from: 'B1', to: 'B2', type: 'branch' },
    { from: 'B2', to: 'B3', type: 'branch' },
    { from: 'D1', to: 'D2', type: 'branch' },
    { from: 'D2', to: 'D3', type: 'branch' },
    { from: 'V1', to: 'V2', type: 'branch' },
    { from: 'V2', to: 'V3', type: 'branch' },
];

const BRANCH_META: Record<BranchKey, { label: string; color: string }> = {
    basic: { label: 'BASIC ELECTRONICS', color: '#f59e0b' },
    dsd: { label: 'DIGITAL SYSTEM DESIGN', color: '#3b82f6' },
    verilog: { label: 'VERILOG HDL', color: '#2dd4bf' },
};

/* ══════════════════════════════════════════════════════════════════════
   HELPERS
══════════════════════════════════════════════════════════════════════ */

function getModule(id: string) { return MODULES.find(m => m.id === id)!; }
function getR(m: Module) { return m.isHub ? HUB_R : (NODE_R[m.depth] ?? 20); }

function statusColor(s: Status) {
    if (s === 'completed') return '#22c55e';
    if (s === 'in-progress') return '#3b82f6';
    return '#1e293b';
}
function accentFor(m: Module) {
    if (m.branch) return BRANCH_META[m.branch].color;
    return statusColor(m.status);
}

/* ══════════════════════════════════════════════════════════════════════
   SVG COMPONENTS
══════════════════════════════════════════════════════════════════════ */

const Pulse: React.FC<{ x1: number; y1: number; x2: number; y2: number; color: string }> = ({ x1, y1, x2, y2, color }) => (
    <motion.circle r={3} fill={color} opacity={0.7}
        initial={{ cx: x1, cy: y1, opacity: 0 }}
        animate={{ cx: [x1, x2], cy: [y1, y2], opacity: [0, 0.8, 0.8, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 3, ease: 'linear' }}
    />
);

/* ── SVG Gradient Definitions ── */
const SvgDefs: React.FC = () => (
    <defs>
        <radialGradient id="node-fill-default" cx="40%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#060a12" />
            <stop offset="100%" stopColor="#0f1724" />
        </radialGradient>
        <radialGradient id="node-fill-completed" cx="40%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#051205" />
            <stop offset="100%" stopColor="#0a1f0a" />
        </radialGradient>
        <radialGradient id="node-fill-locked" cx="40%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#080a10" />
            <stop offset="100%" stopColor="#0c0f17" />
        </radialGradient>
        <radialGradient id="hub-fill" cx="40%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#080d18" />
            <stop offset="100%" stopColor="#121d33" />
        </radialGradient>
        <filter id="glow-green" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feFlood floodColor="#22c55e" floodOpacity="0.3" />
            <feComposite in2="blur" operator="in" />
            <feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="glow-blue" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feFlood floodColor="#3b82f6" floodOpacity="0.25" />
            <feComposite in2="blur" operator="in" />
            <feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
    </defs>
);

/* ── Geometry Helpers ── */
function getGearPath(cx: number, cy: number, r: number, teeth: number = 8) {
    const innerR = r * 0.70;
    const outerR = r * 1.15;
    const holeR = r * 0.35; // Center hole radius
    let path = "";

    // Outer gear profile
    for (let i = 0; i < teeth; i++) {
        const angle1 = (i * 2 * Math.PI) / teeth;
        const angle2 = ((i + 0.35) * 2 * Math.PI) / teeth;
        const angle3 = ((i + 0.45) * 2 * Math.PI) / teeth;
        const angle4 = ((i + 0.55) * 2 * Math.PI) / teeth;
        const angle5 = ((i + 0.65) * 2 * Math.PI) / teeth;

        const p1x = cx + Math.cos(angle1) * innerR; const p1y = cy + Math.sin(angle1) * innerR;
        const p2x = cx + Math.cos(angle2) * innerR; const p2y = cy + Math.sin(angle2) * innerR;
        const p3x = cx + Math.cos(angle3) * outerR; const p3y = cy + Math.sin(angle3) * outerR;
        const p4x = cx + Math.cos(angle4) * outerR; const p4y = cy + Math.sin(angle4) * outerR;
        const p5x = cx + Math.cos(angle5) * innerR; const p5y = cy + Math.sin(angle5) * innerR;

        if (i === 0) path += `M ${p1x} ${p1y} `;

        path += `A ${innerR} ${innerR} 0 0 1 ${p2x} ${p2y} `;
        path += `L ${p3x} ${p3y} A ${outerR} ${outerR} 0 0 1 ${p4x} ${p4y} L ${p5x} ${p5y} `;

        const nextAngle = ((i + 1) * 2 * Math.PI) / teeth;
        const nextPx = cx + Math.cos(nextAngle) * innerR;
        const nextPy = cy + Math.sin(nextAngle) * innerR;
        path += `A ${innerR} ${innerR} 0 0 1 ${nextPx} ${nextPy} `;
    }
    path += "Z ";

    // Inner hole for the mechanical look (sub-path drawn in reverse to create a hole)
    path += `M ${cx + holeR} ${cy} `;
    path += `A ${holeR} ${holeR} 0 1 0 ${cx - holeR} ${cy} `;
    path += `A ${holeR} ${holeR} 0 1 0 ${cx + holeR} ${cy} `;
    path += `Z`;

    return path;
}

/* ── Module bubble ── */
const ModuleBubble: React.FC<{
    mod: Module; isHovered: boolean; onHover: (id: string | null) => void;
    opacity: number;
}> = ({ mod, isHovered, onHover, opacity: nodeOpacity }) => {
    const locked = mod.status === 'locked';
    const done = mod.status === 'completed';
    const inProg = mod.status === 'in-progress';
    const accent = accentFor(mod);
    const r = getR(mod);

    const fillId = locked ? 'url(#node-fill-locked)' : done ? 'url(#node-fill-completed)' : mod.isHub ? 'url(#hub-fill)' : 'url(#node-fill-default)';

    return (
        <motion.g
            style={{ cursor: locked ? 'default' : 'pointer', opacity: nodeOpacity }}
            onHoverStart={() => !locked && onHover(mod.id)}
            onHoverEnd={() => onHover(null)}
        >
            {/* Hub outer glow rings */}
            {mod.isHub && !locked && (
                <>
                    <path d={getGearPath(mod.cx, mod.cy, r + 18, 12)} fill="none" stroke="#3b82f6" strokeWidth={0.4} opacity={0.08} />
                    <motion.path d={getGearPath(mod.cx, mod.cy, r + 10, 12)} fill="none" stroke="#3b82f6" strokeWidth={0.7}
                        animate={{ opacity: [0.18, 0.05, 0.18], rotate: [0, 360] }} transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                        style={{ transformOrigin: `${mod.cx}px ${mod.cy}px` }} />
                </>
            )}

            {/* Completed soft neon outline */}
            {done && (
                <path d={getGearPath(mod.cx, mod.cy, r + 5, 8)} fill="none" stroke="#22c55e" strokeWidth={1} opacity={0.25}
                    filter="url(#glow-green)" />
            )}

            {/* In-progress breathing pulse */}
            {inProg && (
                <motion.path d={getGearPath(mod.cx, mod.cy, r, 8)} fill="none" stroke="#3b82f6" strokeWidth={0.8}
                    initial={{ opacity: 0.3, scale: 1.1 }} animate={{ opacity: 0, scale: 1.8 }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: 'easeOut' }}
                    style={{ transformOrigin: `${mod.cx}px ${mod.cy}px` }} />
            )}

            {/* Active glow */}
            {inProg && !isHovered && (
                <path d={getGearPath(mod.cx, mod.cy, r + 3, 8)} fill="none" stroke="#3b82f6" strokeWidth={0.6} opacity={0.2}
                    filter="url(#glow-blue)" />
            )}

            {/* Main gear with gradient fill */}
            <motion.path
                d={getGearPath(mod.cx, mod.cy, r, mod.isHub ? 12 : 8)}
                fill={fillId}
                stroke={locked ? '#1a2030' : accent}
                strokeWidth={mod.isHub ? 2.5 : locked ? 0.7 : isHovered ? 2 : 1.5}
                opacity={locked ? 0.4 : 1}
                animate={{ scale: isHovered ? 1.08 : 1 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                style={{ transformOrigin: `${mod.cx}px ${mod.cy}px` }}
            />

            {/* Label below */}
            {!isHovered && (
                <text x={mod.cx} y={mod.cy + r + 22} textAnchor="middle"
                    fill={locked ? '#1e2a3d' : '#cbd5e1'}
                    fontSize={11} fontWeight="600" fontFamily="'DM Sans',sans-serif">
                    {mod.title}
                </text>
            )}

            {/* Hub sub-label */}
            {mod.isHub && !isHovered && (
                <text x={mod.cx} y={mod.cy + r + 40} textAnchor="middle"
                    fill="#475569" fontSize={8.5} fontFamily="'Roboto Mono',monospace" letterSpacing="0.1em">
                    CHOOSE YOUR PATH
                </text>
            )}
        </motion.g>
    );
};

/* ── Hover card ── */
const CARD_W = 230;
const CARD_H = 155;

const HoverCard: React.FC<{ mod: Module; onStart: (m: Module) => void }> = ({ mod, onStart }) => {
    const r = getR(mod);
    const rawX = mod.cx - CARD_W / 2;
    const rawY = mod.cy - CARD_H - r - 20;
    const x = Math.max(10, Math.min(rawX, CW - CARD_W - 10));
    const y = rawY < 10 ? mod.cy + r + 20 : rawY;
    const accent = accentFor(mod);
    const label = mod.progress === 100 ? 'Review' : mod.progress > 0 ? 'Continue' : 'Start';

    return (
        <motion.g
            initial={{ opacity: 0, scale: 0.92, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.88, y: 4 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
            <foreignObject x={x} y={y} width={CARD_W} height={CARD_H}>
                <div className="rounded-2xl border overflow-hidden flex flex-col justify-between p-4 relative backdrop-blur-xl bg-[#0a0e18]/95 border-white/[0.07] shadow-[0_12px_48px_rgba(0,0,0,0.7)]"
                    style={{ width: CARD_W, height: CARD_H }}>
                    {/* Top accent line */}
                    <div className="absolute top-0 left-4 right-4 h-[1px]"
                        style={{ background: `linear-gradient(to right,transparent,${accent}55,transparent)` }} />
                    <div>
                        <p className="text-[9px] font-mono uppercase tracking-widest mb-1.5" style={{ color: accent }}>
                            {mod.id} · {mod.branch ? BRANCH_META[mod.branch].label : 'FOUNDATION'}
                        </p>
                        <p className="text-[14px] font-semibold leading-snug text-[#e2e8f0]">{mod.title}</p>
                        <p className="text-[11px] text-[#64748b] mt-1 line-clamp-2 leading-snug">{mod.subtitle}</p>
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-[10px] text-[#475569] font-mono">{mod.lessons}L · {mod.hours}h</p>
                            <div className="mt-1.5 h-[3px] w-20 rounded-full overflow-hidden bg-white/[0.05]">
                                <div className="h-full rounded-full transition-all duration-500" style={{ width: `${mod.progress}%`, background: accent }} />
                            </div>
                        </div>
                        <button onClick={() => onStart(mod)}
                            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[11px] font-semibold text-white cursor-pointer transition-all duration-200 hover:scale-[1.04]"
                            style={{ background: `${accent}20`, border: `1px solid ${accent}40` }}>
                            <Play className="w-3 h-3 fill-current" />{label}
                        </button>
                    </div>
                </div>
            </foreignObject>
        </motion.g>
    );
};

/* ── Progress Ring (header) ── */
const ProgressRing: React.FC<{ percent: number; size?: number }> = ({ percent, size = 36 }) => {
    const strokeW = 3;
    const radius = (size - strokeW) / 2;
    const circ = 2 * Math.PI * radius;
    const offset = circ - (circ * percent) / 100;

    return (
        <div className="relative animate-ring-pulse" style={{ width: size, height: size }}>
            <svg width={size} height={size} className="rotate-[-90deg]">
                <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={strokeW} />
                <motion.circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#3b82f6" strokeWidth={strokeW}
                    strokeLinecap="round" strokeDasharray={circ}
                    initial={{ strokeDashoffset: circ }}
                    animate={{ strokeDashoffset: offset }}
                    transition={{ duration: 1.5, ease: 'easeOut' }} />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold font-mono text-blue-400">
                {percent}%
            </span>
        </div>
    );
};

/* ══════════════════════════════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════════════════════════════ */

export const WorkstationHome: React.FC = () => {
    const navigate = useNavigate();
    const { firstName } = useUserStore();
    const [hoveredId, setHoveredId] = useState<string | null>(null);
    const [cmdOpen, setCmdOpen] = useState(false);
    const [tourOpen, setTourOpen] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [scheme, toggleScheme] = useColorScheme();
    const isDark = scheme === 'dark';

    const MODULE_ROUTES: Record<string, string> = { C1: '/module/1' };
    const handleModuleStart = (mod: Module) => {
        const route = MODULE_ROUTES[mod.id];
        if (route) navigate(route);
    };

    /* ── Active branch for depth compression ── */
    const activeBranch = useMemo<BranchKey | null>(() => {
        if (!hoveredId) return null;
        return getModule(hoveredId).branch;
    }, [hoveredId]);

    const getNodeOpacity = useCallback((m: Module): number => {
        if (m.depth === 0) return 1;
        if (!activeBranch) return 0.6;
        return m.branch === activeBranch ? 1 : 0.18;
    }, [activeBranch]);

    const getConnOpacity = useCallback((c: Connection): number => {
        if (c.type === 'trunk') return 1;
        const t = getModule(c.to);
        if (!activeBranch) return 0.5;
        return t.branch === activeBranch ? 1 : 0.12;
    }, [activeBranch]);

    /* ── Breadcrumb ── */
    const breadcrumb = useMemo(() => {
        if (!hoveredId) return ['Foundation', 'Specialization', 'Advanced'];
        const m = getModule(hoveredId);
        const crumbs = ['Foundation'];
        if (m.branch) {
            crumbs.push(BRANCH_META[m.branch].label);
            crumbs.push(m.title);
        } else {
            crumbs.push(m.title);
        }
        return crumbs;
    }, [hoveredId]);

    /* ── Foundation progress ── */
    const foundMods = MODULES.filter(m => m.depth === 0);
    const foundComplete = foundMods.filter(m => m.status === 'completed').length;
    const foundInProg = foundMods.filter(m => m.status !== 'locked').length;
    const completedCount = MODULES.filter(m => m.status === 'completed').length;
    const overallPercent = Math.round((completedCount / MODULES.length) * 100);

    /* ── Tour ── */
    useEffect(() => {
        const key = getTourKey(firstName);
        if (!localStorage.getItem(key)) {
            const t = setTimeout(() => setTourOpen(true), 800);
            return () => clearTimeout(t);
        }
    }, [firstName]);

    /* ── ⌘K ── */
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setCmdOpen(p => !p); }
    }, []);
    useEffect(() => { window.addEventListener('keydown', handleKeyDown); return () => window.removeEventListener('keydown', handleKeyDown); }, [handleKeyDown]);

    const navItems = [
        { title: 'Dashboard', icon: LayoutDashboard, path: '/portal', active: true },
        { title: 'Modules', icon: BookOpen, path: '/portal' },
        { title: 'Challenges', icon: Target, path: '/assessment' },
        { title: 'Workbench', icon: FlaskConical, path: '/playground' },
        { title: 'Progress', icon: BarChart3, path: '/training' },
        { title: 'Settings', icon: Settings, path: '/login' },
    ];

    /* ── Render connection lines ── */
    const renderConnection = (conn: Connection, i: number) => {
        const a = getModule(conn.from), b = getModule(conn.to);
        const ra = getR(a), rb = getR(b);
        const aActive = a.status !== 'locked';
        const bActive = b.status !== 'locked';
        const active = aActive && bActive;
        const showPulse = active && a.status === 'in-progress';
        const opacity = getConnOpacity(conn);

        if (conn.type === 'trunk') {
            const color = active ? statusColor(a.status) : '#162032';
            return (
                <g key={i} opacity={opacity}>
                    <line x1={a.cx + ra} y1={a.cy} x2={b.cx - rb} y2={b.cy}
                        stroke={color} strokeWidth={2.5}
                        strokeDasharray={active ? 'none' : '6 4'} opacity={active ? 0.65 : 0.18} />
                    {showPulse && <Pulse x1={a.cx + ra} y1={a.cy} x2={b.cx - rb} y2={b.cy} color="#3b82f6" />}
                </g>
            );
        }

        if (conn.type === 'hub-branch') {
            const bColor = b.branch ? BRANCH_META[b.branch].color : '#3b82f6';
            const color = active ? bColor : '#162032';
            const hubBot = a.cy + HUB_R;
            const tgtTop = b.cy - rb;
            let d: string;
            if (a.cx === b.cx) {
                d = `M ${a.cx} ${hubBot} L ${b.cx} ${tgtTop}`;
            } else {
                d = `M ${a.cx} ${hubBot} L ${a.cx} ${JUNCTION_Y} L ${b.cx} ${JUNCTION_Y} L ${b.cx} ${tgtTop}`;
            }
            return (
                <g key={i} opacity={opacity}>
                    <path d={d} fill="none" stroke={color} strokeWidth={1.8}
                        strokeDasharray={active ? 'none' : '5 4'} opacity={active ? 0.45 : 0.12} />
                    {showPulse && <Pulse x1={a.cx} y1={hubBot} x2={b.cx} y2={tgtTop} color={bColor} />}
                </g>
            );
        }

        const bColor = a.branch ? BRANCH_META[a.branch].color : '#64748b';
        const color = active ? bColor : '#162032';
        return (
            <g key={i} opacity={opacity}>
                <line x1={a.cx} y1={a.cy + ra} x2={b.cx} y2={b.cy - rb}
                    stroke={color} strokeWidth={1.5}
                    strokeDasharray={active ? 'none' : '4 3'} opacity={active ? 0.35 : 0.1} />
                {showPulse && <Pulse x1={a.cx} y1={a.cy + ra} x2={b.cx} y2={b.cy - rb} color={bColor} />}
            </g>
        );
    };

    return (
        <>
            <div className="h-screen flex flex-col overflow-hidden select-none"
                style={{
                    background: isDark
                        ? 'linear-gradient(180deg, #060a12 0%, #030508 100%)'
                        : 'linear-gradient(180deg, #f1f5f9 0%, #e2e8f0 100%)',
                    color: isDark ? '#e2e8f0' : '#0f172a',
                    fontFamily: "'DM Sans', Inter, sans-serif"
                }}>

                {/* ══ FIXED TOP HEADER ═══════════════════════════════════════ */}
                <header id="tour-header" className="h-14 shrink-0 flex items-center justify-between px-6 z-20"
                    style={{
                        background: isDark ? 'rgba(6,10,18,0.85)' : 'rgba(241,245,249,0.9)',
                        borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.06)'}`,
                        backdropFilter: 'blur(16px)',
                    }}>

                    {/* Left: Logo */}
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                            <Cpu className="w-4.5 h-4.5 text-white" />
                        </div>
                        <span className="font-bold text-[16px] tracking-tight" style={{ color: isDark ? '#e2e8f0' : '#0f172a' }}>DigiLogic</span>
                        <span className="text-[9px] text-blue-400 font-mono bg-blue-400/10 px-1.5 py-0.5 rounded">beta</span>
                    </div>

                    {/* Center: Progress Ring */}
                    <div id="tour-progress-ring" className="flex items-center gap-3">
                        <ProgressRing percent={overallPercent} />
                        <div>
                            <p className="text-[11px] font-medium" style={{ color: isDark ? '#94a3b8' : '#64748b' }}>Course Progress</p>
                            <p className="text-[10px] font-mono" style={{ color: isDark ? '#475569' : '#94a3b8' }}>{completedCount}/{MODULES.length} modules</p>
                        </div>
                    </div>


                    {/* Right: Actions + Profile */}
                    <div className="flex items-center gap-2.5">
                        <button id="tour-header-search" onClick={() => setCmdOpen(true)}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[11px] font-mono cursor-pointer transition-all duration-200 hover:bg-white/[0.06]"
                            style={{ background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.04)', border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)'}`, color: isDark ? '#64748b' : '#94a3b8' }}>
                            <Command className="w-3.5 h-3.5" /><span>Search</span>
                            <span className="text-[9px] border rounded px-1 py-0.5" style={{ borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.1)' }}>⌘K</span>
                        </button>
                        <button onClick={toggleScheme}
                            className="w-8 h-8 rounded-xl flex items-center justify-center cursor-pointer transition-all duration-200 hover:bg-white/[0.06]"
                            style={{ background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.04)', border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)'}` }}
                            title={`Switch to ${isDark ? 'light' : 'dark'} mode`}>
                            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-500" />}
                        </button>
                        <button onClick={() => setTourOpen(true)}
                            className="w-8 h-8 rounded-xl flex items-center justify-center cursor-pointer transition-all duration-200 hover:bg-white/[0.06]"
                            style={{ background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.04)', border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)'}` }}
                            title="Start onboarding tour">
                            <HelpCircle className="w-4 h-4" style={{ color: isDark ? '#475569' : '#94a3b8' }} />
                        </button>
                        <div className="w-px h-6 mx-1" style={{ background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)' }} />
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 border-2 border-blue-400/20 flex items-center justify-center text-white font-bold text-[13px] cursor-pointer shadow-[0_0_16px_rgba(59,130,246,0.2)] transition-all hover:scale-105">
                            {(firstName || 'S')[0].toUpperCase()}
                        </div>
                    </div>
                </header>

                {/* ══ BODY: SIDEBAR + MAIN ═══════════════════════════════════ */}
                <div className="flex-1 flex overflow-hidden">

                    {/* ── Expandable Sidebar ── */}
                    <motion.aside
                        id="tour-sidebar"
                        className="shrink-0 flex flex-col items-center py-5 gap-1 z-10 relative"
                        animate={{ width: sidebarOpen ? 200 : 72 }}
                        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                        style={{
                            background: isDark ? 'rgba(6,10,18,0.6)' : 'rgba(255,255,255,0.8)',
                            borderRight: `1px solid ${isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.06)'}`,
                        }}>

                        {/* Toggle button */}
                        <button
                            onClick={() => setSidebarOpen(p => !p)}
                            className="absolute -right-3 top-6 w-6 h-6 rounded-full flex items-center justify-center cursor-pointer z-20 transition-all duration-200 hover:scale-110"
                            style={{
                                background: isDark ? '#141a28' : '#e2e8f0',
                                border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.1)'}`,
                                boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                            }}
                            title={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}>
                            {sidebarOpen
                                ? <PanelLeftClose className="w-3.5 h-3.5" style={{ color: isDark ? '#94a3b8' : '#475569' }} />
                                : <PanelLeftOpen className="w-3.5 h-3.5" style={{ color: isDark ? '#94a3b8' : '#475569' }} />}
                        </button>

                        {navItems.map(item => (
                            <button key={item.title} onClick={() => navigate(item.path)}
                                className={cn(
                                    "rounded-xl flex items-center cursor-pointer transition-all duration-250 relative group",
                                    sidebarOpen ? "w-[calc(100%-16px)] h-11 gap-3 px-3" : "w-11 h-11 justify-center",
                                    item.active ? "" : "nav-icon-glow"
                                )}
                                style={{
                                    background: item.active
                                        ? (isDark ? 'rgba(59,130,246,0.1)' : 'rgba(59,130,246,0.08)')
                                        : 'transparent',
                                }}
                                title={!sidebarOpen ? item.title : undefined}>
                                {/* Active indicator bar */}
                                {item.active && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-blue-500" />
                                )}
                                <item.icon className="w-[18px] h-[18px] shrink-0 transition-colors duration-200"
                                    style={{ color: item.active ? '#60a5fa' : (isDark ? '#475569' : '#94a3b8') }} />

                                {/* Label (visible when expanded) */}
                                <AnimatePresence>
                                    {sidebarOpen && (
                                        <motion.span
                                            initial={{ opacity: 0, x: -4 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -4 }}
                                            transition={{ duration: 0.15 }}
                                            className="text-[12px] font-medium whitespace-nowrap overflow-hidden"
                                            style={{ color: item.active ? '#60a5fa' : (isDark ? '#94a3b8' : '#64748b') }}>
                                            {item.title}
                                        </motion.span>
                                    )}
                                </AnimatePresence>

                                {/* Tooltip (only when collapsed) */}
                                {!sidebarOpen && (
                                    <div className="absolute left-full ml-3 px-2.5 py-1.5 rounded-lg text-[11px] font-medium whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 z-50"
                                        style={{
                                            background: isDark ? '#141a28' : '#0f172a',
                                            color: '#e2e8f0',
                                            boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
                                        }}>
                                        {item.title}
                                    </div>
                                )}
                            </button>
                        ))}

                        {/* Bottom spacer + help */}
                        <div className="flex-1" />

                        {/* Progress mini card */}
                        <div id="tour-progress-card"
                            className={cn(
                                "mt-auto mb-2 rounded-xl flex items-center cursor-pointer transition-all duration-200 hover:bg-white/[0.04]",
                                sidebarOpen ? "w-[calc(100%-16px)] h-11 gap-3 px-3" : "w-11 h-11 justify-center"
                            )}
                            style={{ background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.03)' }}
                            title={`${overallPercent}% complete`}>
                            <Zap className="w-4 h-4 shrink-0 text-amber-500/60" />
                            <AnimatePresence>
                                {sidebarOpen && (
                                    <motion.span
                                        initial={{ opacity: 0, x: -4 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -4 }}
                                        transition={{ duration: 0.15 }}
                                        className="text-[11px] font-mono whitespace-nowrap"
                                        style={{ color: isDark ? '#475569' : '#94a3b8' }}>
                                        {overallPercent}% done
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.aside>

                    {/* ══ MAIN CONTENT ═══════════════════════════════════════ */}
                    <div className="flex-1 overflow-y-auto overflow-x-hidden relative">

                        {/* Blueprint grid background */}
                        <div className="fixed inset-0 pointer-events-none bg-grid-blueprint-subtle" />

                        <div className="relative z-10 px-10 py-8">

                            {/* ── Motivational message ── */}
                            <motion.p
                                className="text-[12px] font-mono tracking-wide mb-5 animate-fade-in-up"
                                style={{ color: isDark ? '#334155' : '#94a3b8', animationDelay: '0.1s' }}>
                                <Zap className="w-3 h-3 inline mr-1.5 -mt-0.5" style={{ color: '#3b82f6' }} />
                                "Every system begins with a complete loop."
                            </motion.p>

                            {/* ── Page header ── */}
                            <motion.div className="mb-6 animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
                                <h1 className="text-[28px] font-bold tracking-tight" style={{ color: isDark ? '#e2e8f0' : '#0f172a' }}>Learning Modules</h1>
                                <p className="text-[13px] mt-1.5" style={{ color: isDark ? '#475569' : '#64748b' }}>
                                    Your progression path through digital electronics. Hover nodes to explore.
                                </p>
                            </motion.div>

                            {/* ── Breadcrumb ── */}
                            <div className="flex items-center gap-1.5 mb-5 text-[11px] font-mono" style={{ color: isDark ? '#475569' : '#94a3b8' }}>
                                {breadcrumb.map((crumb, i) => (
                                    <React.Fragment key={i}>
                                        {i > 0 && <ChevronRight className="w-3 h-3 opacity-30" />}
                                        <span className={cn(
                                            'transition-colors duration-200',
                                            i === breadcrumb.length - 1 ? 'text-blue-400' : ''
                                        )}>{crumb}</span>
                                    </React.Fragment>
                                ))}
                            </div>

                            {/* ── Branch legend ── */}
                            <div className="flex items-center gap-5 mb-6 flex-wrap animate-fade-in-up" style={{ animationDelay: '0.25s' }}>
                                {[['#22c55e', 'Completed'], ['#3b82f6', 'In Progress'], ['#1e293b', 'Locked']].map(([c, l]) => (
                                    <div key={l as string} className="flex items-center gap-1.5">
                                        <div className="w-6 h-[2px] rounded" style={{ background: c as string }} />
                                        <span className="text-[11px]" style={{ color: isDark ? '#475569' : '#94a3b8' }}>{l}</span>
                                    </div>
                                ))}
                                <div className="ml-auto flex items-center gap-4">
                                    {(['basic', 'dsd', 'verilog'] as BranchKey[]).map(k => (
                                        <div key={k} className="flex items-center gap-1.5">
                                            <div className="w-2.5 h-2.5 rounded-full" style={{ background: BRANCH_META[k].color }} />
                                            <span className="text-[10px] font-mono" style={{ color: BRANCH_META[k].color }}>{BRANCH_META[k].label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* ══ SVG MAP ═════════════════════════════════════════ */}
                            <div id="tour-map" className="w-full overflow-x-auto animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                                <svg width={CW} height={CH} viewBox={`0 0 ${CW} ${CH}`} style={{ overflow: 'visible' }}>
                                    <SvgDefs />

                                    {/* Journey Layer Labels */}
                                    <text x={120} y={68} fill={isDark ? '#1e293b' : '#94a3b8'} fontSize={10} fontWeight="700"
                                        fontFamily="'Roboto Mono',monospace" letterSpacing="0.15em">FOUNDATION</text>
                                    <line x1={120} y1={78} x2={900} y2={78} stroke={isDark ? '#111827' : '#cbd5e1'} strokeWidth={0.5} opacity={0.3} />

                                    <text x={440} y={340} fill={isDark ? '#1e293b' : '#94a3b8'} fontSize={10} fontWeight="700"
                                        fontFamily="'Roboto Mono',monospace" letterSpacing="0.15em">SPECIALIZATION</text>
                                    <line x1={440} y1={350} x2={1020} y2={350} stroke={isDark ? '#111827' : '#cbd5e1'} strokeWidth={0.5} opacity={0.3} />

                                    {/* Junction bus bar */}
                                    <line x1={BRANCH_COL.basic} y1={JUNCTION_Y} x2={BRANCH_COL.verilog} y2={JUNCTION_Y}
                                        stroke={isDark ? '#111827' : '#e2e8f0'} strokeWidth={0.5} opacity={0.2} />

                                    {/* Via points */}
                                    {[BRANCH_COL.basic, BRANCH_COL.dsd, BRANCH_COL.verilog].map((vx, i) => (
                                        <circle key={i} cx={vx} cy={JUNCTION_Y} r={3.5}
                                            fill={isDark ? '#0d1520' : '#f1f5f9'}
                                            stroke={isDark ? '#1e293b' : '#94a3b8'} strokeWidth={1} opacity={0.45} />
                                    ))}

                                    {/* Branch labels */}
                                    {(['basic', 'dsd', 'verilog'] as BranchKey[]).map(k => (
                                        <g key={k} opacity={!activeBranch ? 0.5 : (activeBranch === k ? 0.85 : 0.12)}
                                            style={{ transition: 'opacity 0.3s' }}>
                                            <text x={BRANCH_COL[k]} y={BRANCH_Y[0] - getR({ depth: 1 } as Module) - 32}
                                                textAnchor="middle" fill={BRANCH_META[k].color} fontSize={9} fontWeight="700"
                                                fontFamily="'Roboto Mono',monospace" letterSpacing="0.08em">{BRANCH_META[k].label}</text>
                                        </g>
                                    ))}

                                    {/* Connections */}
                                    {CONNECTIONS.map((conn, i) => renderConnection(conn, i))}

                                    {/* Bubbles (un-hovered) */}
                                    {MODULES.filter(m => m.id !== hoveredId).map(mod => (
                                        <ModuleBubble key={mod.id} mod={mod} isHovered={false}
                                            onHover={setHoveredId} opacity={getNodeOpacity(mod)} />
                                    ))}

                                    {/* Hovered bubble + card (on top) */}
                                    {hoveredId && (() => {
                                        const mod = getModule(hoveredId);
                                        return (
                                            <>
                                                <ModuleBubble key="hovered" mod={mod} isHovered onHover={setHoveredId}
                                                    opacity={1} />
                                                <AnimatePresence>
                                                    <HoverCard key="card" mod={mod} onStart={handleModuleStart} />
                                                </AnimatePresence>
                                            </>
                                        );
                                    })()}

                                    {/* Tour anchor */}
                                    <foreignObject id="tour-module-node"
                                        x={MODULES[1].cx - 50} y={MODULES[1].cy - 50}
                                        width="100" height="100" style={{ pointerEvents: 'none', opacity: 0 }} />

                                    {/* Foundation progress bar (completion momentum) */}
                                    <g>
                                        <text x={120} y={FOUND_Y + 80} fill={isDark ? '#334155' : '#94a3b8'} fontSize={10}
                                            fontFamily="'Roboto Mono',monospace">Foundation Progress</text>
                                        <rect x={120} y={FOUND_Y + 88} width={720} height={3} rx={1.5}
                                            fill={isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.06)'} />
                                        <motion.rect x={120} y={FOUND_Y + 88} height={3} rx={1.5} fill="#3b82f6"
                                            initial={{ width: 0 }}
                                            animate={{ width: foundComplete > 0 ? (foundComplete / foundMods.length) * 720 : (foundInProg / foundMods.length) * 720 * 0.3 }}
                                            transition={{ duration: 1.5, ease: 'easeOut' }} />
                                        <text x={860} y={FOUND_Y + 94} fill={isDark ? '#334155' : '#94a3b8'} fontSize={10}
                                            fontFamily="'Roboto Mono',monospace" fontWeight="600">
                                            {foundComplete}/{foundMods.length}
                                        </text>
                                    </g>
                                </svg>
                            </div>

                            {/* ── Stats row ── */}
                            <div className="grid grid-cols-4 gap-4 mt-10 max-w-3xl animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                                {[
                                    { label: 'Total Modules', value: String(MODULES.length), accent: '#94a3b8' },
                                    { label: 'Completed', value: String(completedCount), accent: '#22c55e' },
                                    { label: 'In Progress', value: String(MODULES.filter(m => m.status === 'in-progress').length), accent: '#3b82f6' },
                                    { label: 'Total Hours', value: `${MODULES.reduce((s, m) => s + m.hours, 0)}h`, accent: '#2dd4bf' },
                                ].map(s => (
                                    <div key={s.label} className="rounded-xl p-5 transition-all duration-200 cursor-default hover:scale-[1.02]"
                                        style={{
                                            background: isDark ? 'rgba(12,16,24,0.8)' : 'rgba(255,255,255,0.8)',
                                            border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.06)'}`,
                                        }}>
                                        <p className="text-[24px] font-bold font-mono" style={{ color: s.accent }}>{s.value}</p>
                                        <p className="text-[11px] mt-1" style={{ color: isDark ? '#475569' : '#94a3b8' }}>{s.label}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="h-16" />
                        </div>
                    </div>
                </div>
            </div>

            {/* ── OVERLAYS ── */}
            <CommandPalette isOpen={cmdOpen} onClose={() => setCmdOpen(false)} navigate={navigate} tourKey={getTourKey(firstName)} />
            <OnboardingTour isOpen={tourOpen} onClose={() => setTourOpen(false)} storageKey={getTourKey(firstName)} />
        </>
    );
};
// aria-label
