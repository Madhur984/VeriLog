import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    LayoutDashboard, Target, Settings, Binary, Command,
    BarChart3, FlaskConical, BookOpen, CheckCircle2,
    Lock, Play, Zap, Moon, Sun, HelpCircle, ChevronRight, Shield,
    Cpu, Users, Gamepad2,
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useGamificationStore } from '../stores/gamificationStore';
import { CommandPalette } from '../components/ui/CommandPalette';
import { OnboardingTour } from '../components/ui/OnboardingTour';
import { useColorScheme } from '../hooks/useColorScheme';
import { StreakCounter } from '../components/ui/StreakCounter';

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
    depth: number;          // 0=foundation, 1-3=branch depth
    branch: BranchKey | null;
    isHub?: boolean;
}

type ConnType = 'trunk' | 'hub-branch' | 'branch';
interface Connection { from: string; to: string; type: ConnType; }

/* ── Layout constants (mathematical rhythm) ── */
const CW = 960;
const FOUND_Y = 110;
const JUNCTION_Y = 200;
const BRANCH_Y = [296, 392, 488]; // 96px vertical gap
const BRANCH_COL: Record<BranchKey, number> = { basic: 480, dsd: 640, verilog: 800 };
const NODE_R = [24, 20, 18, 16]; // radius per depth
const HUB_R = 30;
const CH = 580;

const MODULES: Module[] = [
    /* Foundation (depth 0) — linear horizontal row */
    { id: 'signals', title: 'A Signal Must Return', subtitle: 'The Rule of the Closed Loop', progress: 0, status: 'locked', hours: 0.1, lessons: 1, cx: 80, cy: FOUND_Y, depth: 0, branch: null },
    { id: 'analog_digital', title: 'Continuous vs Discrete', subtitle: 'Analog & Digital Signals', progress: 0, status: 'locked', hours: 1.5, lessons: 5, cx: 220, cy: FOUND_Y, depth: 0, branch: null },
    { id: 'binary_awakening', title: 'Binary Awakening', subtitle: 'The Math of Two States', progress: 0, status: 'locked', hours: 3, lessons: 10, cx: 360, cy: FOUND_Y, depth: 0, branch: null },
    { id: 'logic_gates', title: 'Logic Gates', subtitle: 'AND, OR, NOT, NAND, XOR', progress: 0, status: 'locked', hours: 4, lessons: 12, cx: 500, cy: FOUND_Y, depth: 0, branch: null },
    { id: 'kmap_optimization', title: 'Karnaugh Maps', subtitle: 'Logic Synthesis & K-Maps', progress: 0, status: 'locked', hours: 2, lessons: 6, cx: 640, cy: FOUND_Y, depth: 0, branch: null, isHub: true },
    /* Basic Electronics */
    { id: 'B1', title: 'BJT & MOSFET', subtitle: 'Transistor fundamentals', progress: 0, status: 'locked', hours: 3, lessons: 8, cx: BRANCH_COL.basic, cy: BRANCH_Y[0], depth: 1, branch: 'basic' },
    { id: 'B2', title: 'Amplifiers', subtitle: 'Op-amp & gain stages', progress: 0, status: 'locked', hours: 3, lessons: 9, cx: BRANCH_COL.basic, cy: BRANCH_Y[1], depth: 2, branch: 'basic' },
    { id: 'B3', title: 'Signal Analysis', subtitle: 'Fourier, filters, AC', progress: 0, status: 'locked', hours: 4, lessons: 10, cx: BRANCH_COL.basic, cy: BRANCH_Y[2], depth: 3, branch: 'basic' },
    /* DSD */
    { id: 'D1', title: 'Flip-Flops', subtitle: 'SR, D, JK, T, edge-trig', progress: 0, status: 'locked', hours: 3.5, lessons: 8, cx: BRANCH_COL.dsd, cy: BRANCH_Y[0], depth: 1, branch: 'dsd' },
    { id: 'D2', title: 'State Machines', subtitle: 'Mealy, Moore, FSM', progress: 0, status: 'locked', hours: 4, lessons: 10, cx: BRANCH_COL.dsd, cy: BRANCH_Y[1], depth: 2, branch: 'dsd' },
    { id: 'D3', title: 'Sequential Sys.', subtitle: 'Counters, Shift Registers', progress: 0, status: 'locked', hours: 4, lessons: 11, cx: BRANCH_COL.dsd, cy: BRANCH_Y[2], depth: 3, branch: 'dsd' },
    /* Verilog */
    { id: 'V1', title: 'Verilog Basics', subtitle: 'Syntax, modules, wire/reg', progress: 0, status: 'locked', hours: 3, lessons: 8, cx: BRANCH_COL.verilog, cy: BRANCH_Y[0], depth: 1, branch: 'verilog' },
    { id: 'V2', title: 'RTL Design', subtitle: 'Combinational & sequential RTL', progress: 0, status: 'locked', hours: 4, lessons: 10, cx: BRANCH_COL.verilog, cy: BRANCH_Y[1], depth: 2, branch: 'verilog' },
    { id: 'V3', title: 'Testbenches', subtitle: 'Simulation, assertions', progress: 0, status: 'locked', hours: 4, lessons: 9, cx: BRANCH_COL.verilog, cy: BRANCH_Y[2], depth: 3, branch: 'verilog' },
];

const CONNECTIONS: Connection[] = [
    { from: 'signals', to: 'analog_digital', type: 'trunk' },
    { from: 'analog_digital', to: 'binary_awakening', type: 'trunk' },
    { from: 'binary_awakening', to: 'logic_gates', type: 'trunk' },
    { from: 'logic_gates', to: 'kmap_optimization', type: 'trunk' },
    { from: 'kmap_optimization', to: 'B1', type: 'hub-branch' },
    { from: 'kmap_optimization', to: 'D1', type: 'hub-branch' },
    { from: 'kmap_optimization', to: 'V1', type: 'hub-branch' },
    { from: 'B1', to: 'B2', type: 'branch' },
    { from: 'B2', to: 'B3', type: 'branch' },
    { from: 'D1', to: 'D2', type: 'branch' },
    { from: 'D2', to: 'D3', type: 'branch' },
    { from: 'V1', to: 'V2', type: 'branch' },
    { from: 'V2', to: 'V3', type: 'branch' },
];

const BRANCH_META: Record<BranchKey, { label: string; color: string }> = {
    basic: { label: 'BASIC ELECTRONICS', color: '#f59e0b' },
    dsd: { label: 'DIGITAL SYSTEM DESIGN', color: '#10B981' },
    verilog: { label: 'VERILOG HDL', color: '#a78bfa' },
};

/* ══════════════════════════════════════════════════════════════════════
   HELPERS
══════════════════════════════════════════════════════════════════════ */

// getModule moved inside WorkstationHome to use dynamicModules
function getR(m: Module) { return m.isHub ? HUB_R : (NODE_R[m.depth] ?? 16); }

function statusColor(s: Status) {
    if (s === 'completed') return '#22c55e';
    if (s === 'in-progress') return '#10B981';
    return '#1A1D24';
}
function accentFor(m: Module) {
    if (m.branch) return BRANCH_META[m.branch].color;
    return statusColor(m.status);
}

/* ══════════════════════════════════════════════════════════════════════
   SVG COMPONENTS
══════════════════════════════════════════════════════════════════════ */

/* ── Signal pulse (only through unlocked path, 2.5s, subtle) ── */
const Pulse: React.FC<{ x1: number; y1: number; x2: number; y2: number; color: string }> = ({ x1, y1, x2, y2, color }) => (
    <motion.circle r={2.5} fill={color} opacity={0.7}
        initial={{ cx: x1, cy: y1, opacity: 0 }}
        animate={{ cx: [x1, x2], cy: [y1, y2], opacity: [0, 0.8, 0.8, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 3, ease: 'linear' }}
    />
);

/* ── Module bubble ── */
const ModuleBubble: React.FC<{
    mod: Module; isHovered: boolean; onHover: (id: string | null) => void;
    onStart: (mod: Module) => void;
    opacity: number; isDark: boolean;
}> = ({ mod, isHovered, onHover, onStart, opacity: nodeOpacity, isDark }) => {
    const locked = mod.status === 'locked';
    const done = mod.status === 'completed';
    const inProg = mod.status === 'in-progress';
    const accent = accentFor(mod);
    const r = getR(mod);

    return (
        <motion.g
            style={{ cursor: locked ? 'default' : 'pointer', opacity: nodeOpacity }}
            onHoverStart={() => !locked && onHover(mod.id)}
            onHoverEnd={() => onHover(null)}
            onClick={() => !locked && onStart(mod)}
        >
            {/* Hub outer glow */}
            {mod.isHub && !locked && (
                <>
                    <circle cx={mod.cx} cy={mod.cy} r={r + 14} fill="none" stroke="#10B981" strokeWidth={0.5} opacity={0.12} />
                    <motion.circle cx={mod.cx} cy={mod.cy} r={r + 8} fill="none" stroke="#10B981" strokeWidth={0.8}
                        animate={{ opacity: [0.2, 0.06, 0.2] }} transition={{ duration: 3, repeat: Infinity }} />
                </>
            )}
            {/* Completed glow ring */}
            {done && <circle cx={mod.cx} cy={mod.cy} r={r + 5} fill="none" stroke="#22c55e" strokeWidth={0.8} opacity={0.2} />}
            {/* In-progress expanding pulse */}
            {inProg && (
                <motion.circle cx={mod.cx} cy={mod.cy} fill="none" stroke="#10B981" strokeWidth={0.8}
                    initial={{ opacity: 0.35, r: r + 3 }} animate={{ opacity: 0, r: r + 14 }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: 'easeOut' }} />
            )}
            {/* Main circle */}
            <motion.circle cx={mod.cx} cy={mod.cy}
                r={r}
                fill={locked ? (isDark ? '#0A0B10' : '#f1f5f9') : done ? '#091409' : (isDark ? '#0D0F16' : '#f8fafc')}
                stroke={locked ? (isDark ? '#1A1D24' : '#cbd5e1') : accent}
                strokeWidth={mod.isHub ? 2 : locked ? 0.5 : isHovered ? 2 : 1}
                opacity={locked ? 0.5 : 1}
                animate={{ r: isHovered ? r * 1.1 : r }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
            />
            {/* Progress arc */}
            {mod.progress > 0 && mod.progress < 100 && (
                <circle cx={mod.cx} cy={mod.cy} r={r - 4} fill="none" stroke={accent} strokeWidth={1.5}
                    strokeDasharray={`${(r - 4) * 2 * Math.PI * mod.progress / 100} 9999`}
                    strokeLinecap="round" transform={`rotate(-90 ${mod.cx} ${mod.cy})`} opacity={0.55} />
            )}
            {/* Center icon / text */}
            {done ? <CheckCircle2 x={mod.cx - r * 0.35} y={mod.cy - r * 0.35} width={r * 0.7} height={r * 0.7} color="#22c55e" />
                : locked ? <Lock x={mod.cx - r * 0.3} y={mod.cy - r * 0.3} width={r * 0.6} height={r * 0.6} color={isDark ? '#2A2D35' : '#94a3b8'} />
                    : <text x={mod.cx} y={mod.cy + 1} textAnchor="middle" dominantBaseline="middle"
                        fill={accent} fontSize={r > 22 ? 10 : 8} fontWeight="700" fontFamily="monospace">{mod.progress}%</text>}
            {/* Label below */}
            {!isHovered && (
                <text x={mod.cx} y={mod.cy + r + 14} textAnchor="middle"
                    fill={locked ? (isDark ? '#2a3547' : '#94a3b8') : (isDark ? '#94a3b8' : '#475569')}
                    fontSize={r > 22 ? 10 : 9} fontWeight="500" fontFamily="'DM Sans',sans-serif">
                    {mod.title}
                </text>
            )}
            {/* Hub sub-label */}
            {mod.isHub && !isHovered && (
                <text x={mod.cx} y={mod.cy + r + 28} textAnchor="middle"
                    fill={isDark ? '#475569' : '#94a3b8'} fontSize={7.5} fontFamily="monospace" letterSpacing="0.08em">
                    CHOOSE YOUR PATH
                </text>
            )}
        </motion.g>
    );
};

/* ── Hover card ── */
const CARD_W = 210;
const CARD_H = 145;

const HoverCard: React.FC<{ mod: Module; onStart: (m: Module) => void; isDark: boolean }> = ({ mod, onStart, isDark }) => {
    const r = getR(mod);
    const rawX = mod.cx - CARD_W / 2;
    const rawY = mod.cy - CARD_H - r - 16;
    const x = Math.max(10, Math.min(rawX, CW - CARD_W - 10));
    const y = rawY < 10 ? mod.cy + r + 16 : rawY;
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
                <div className={cn(
                    "rounded-2xl border overflow-hidden flex flex-col justify-between p-4 relative backdrop-blur-xl",
                    isDark ? "bg-[#0d1118]/95 border-white/10 shadow-[0_8px_40px_rgba(0,0,0,0.6)]"
                        : "bg-white/95 border-black/8 shadow-[0_8px_30px_rgba(0,0,0,0.12)]"
                )} style={{ width: CARD_W, height: CARD_H }}>
                    <div className="absolute top-0 left-4 right-4 h-[1px]"
                        style={{ background: `linear-gradient(to right,transparent,${accent}60,transparent)` }} />
                    <div>
                        <p className="text-[9px] font-mono uppercase tracking-widest mb-1" style={{ color: accent }}>
                            {mod.id} · {mod.branch ? BRANCH_META[mod.branch].label : 'FOUNDATION'}
                        </p>
                        <p className={cn("text-[13px] font-semibold leading-snug", isDark ? "text-white" : "text-slate-900")}>{mod.title}</p>
                        <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-2 leading-snug">{mod.subtitle}</p>
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-[10px] text-slate-600 font-mono">{mod.lessons}L · {mod.hours}h</p>
                            <div className={cn("mt-1 h-[2px] w-16 rounded-full overflow-hidden", isDark ? "bg-white/5" : "bg-black/5")}>
                                <div className="h-full rounded-full" style={{ width: `${mod.progress}%`, background: accent }} />
                            </div>
                        </div>
                        <button onClick={() => onStart(mod)}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-[11px] font-semibold text-white cursor-pointer"
                            style={{ background: `${accent}22`, border: `1px solid ${accent}55` }}>
                            <Play className="w-3 h-3 fill-current" />{label}
                        </button>
                    </div>
                </div>
            </foreignObject>
        </motion.g>
    );
};

/* ══════════════════════════════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════════════════════════════ */

export const WorkstationHome: React.FC = () => {
    const navigate = useNavigate();
    const { firstName, skills, streak, checkStreak } = useGamificationStore();
    const completedModuleIds = skills.completedIds;
    const [hoveredId, setHoveredId] = useState<string | null>(null);
    const [cmdOpen, setCmdOpen] = useState(false);
    const [tourOpen, setTourOpen] = useState(false);
    const [scheme, toggleScheme] = useColorScheme();
    const isDark = scheme === 'dark';

    useEffect(() => {
        checkStreak();
    }, [checkStreak]);

    const dynamicModules = useMemo(() => {
        return MODULES.map((m) => {
            const isCompleted = completedModuleIds.includes(m.id);

            return {
                ...m,
                status: isCompleted ? 'completed' : 'in-progress',
                progress: isCompleted ? 100 : 0
            } as Module;
        });
    }, [completedModuleIds]);

    const MODULE_ROUTES: Record<string, string> = {
        signals: '/module/1',
        analog_digital: '/module/2',
        binary_awakening: '/module/3',
        logic_gates: '/module/4',
        kmap_optimization: '/module/5',
        // Branch modules → associated labs
        B1: '/circuit-lab',
        B2: '/circuit-lab',
        B3: '/circuit-lab',
        D1: '/fsm',
        D2: '/fsm',
        D3: '/fsm',
        V1: '/verilog',
        V2: '/verilog',
        V3: '/verilog',
    };

    const getModule = useCallback((id: string) => dynamicModules.find(m => m.id === id)!, [dynamicModules]);

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
        if (!activeBranch) return 0.65;
        return m.branch === activeBranch ? 1 : 0.2;
    }, [activeBranch]);

    const getConnOpacity = useCallback((c: Connection): number => {
        if (c.type === 'trunk') return 1;
        const t = getModule(c.to);
        if (!activeBranch) return 0.55;
        return t.branch === activeBranch ? 1 : 0.15;
    }, [activeBranch]);

    /* ── Breadcrumb ── */
    const breadcrumb = useMemo(() => {
        if (!hoveredId) return ['Foundation'];
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
    const foundMods = dynamicModules.filter(m => m.depth === 0);
    const foundComplete = foundMods.filter(m => m.status === 'completed').length;
    const foundInProg = foundMods.filter(m => m.status !== 'locked').length;

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
        { title: 'Challenges', icon: Target, path: '/assessment' },
        { title: 'Boss Arena', icon: Gamepad2, path: '/boss-arena' },
        { title: 'Workbench', icon: FlaskConical, path: '/workbench' },
        { title: 'CPU Lab', icon: Cpu, path: '/cpu-lab' },
        { title: 'Community', icon: Users, path: '/community' },
        { title: 'HW LeetCode', icon: Zap, path: '/hw-leetcode' },
        { title: 'Progress', icon: BarChart3, path: '/skill-tree' },
        { title: 'Modules', icon: BookOpen, path: '/portal' },
        { title: 'Portfolio', icon: Shield, path: '/portfolio' },
        { title: 'Settings', icon: Settings, path: '/portfolio' },
    ];

    const completedCount = dynamicModules.filter(m => m.status === 'completed').length;

    /* ── Adaptive tokens ── */
    const t = {
        bg: isDark ? '#07080C' : '#f1f5f9',
        sidebar: isDark ? '#08090D' : '#ffffff',
        sidebarBdr: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.08)',
        text: isDark ? '#e2e8f0' : '#0D0F16',
        textMuted: isDark ? '#64748b' : '#64748b',
        cardBg: isDark ? '#0c0f16' : '#ffffff',
        cardBdr: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.1)',
        navActive: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(59,130,246,0.08)',
        navHover: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)',
        inputBg: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)',
        inputBdr: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.1)',
        line: isDark ? '#1a2332' : '#cbd5e1',
        lineFaint: isDark ? '#111827' : '#e2e8f0',
        mono: "'JetBrains Mono', 'IBM Plex Mono', monospace",
    };

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
            const color = active ? statusColor(a.status) : t.line;
            return (
                <g key={i} opacity={opacity}>
                    <line x1={a.cx + ra} y1={a.cy} x2={b.cx - rb} y2={b.cy}
                        stroke={color} strokeWidth={2.5}
                        strokeDasharray={active ? 'none' : '6 4'} opacity={active ? 0.7 : 0.2} />
                    {showPulse && <Pulse x1={a.cx + ra} y1={a.cy} x2={b.cx - rb} y2={b.cy} color="#10B981" />}
                </g>
            );
        }

        if (conn.type === 'hub-branch') {
            const bColor = b.branch ? BRANCH_META[b.branch].color : '#10B981';
            const color = active ? bColor : t.line;
            const hubBot = a.cy + HUB_R;
            const tgtTop = b.cy - rb;
            // L-shaped PCB trace through junction
            let d: string;
            if (a.cx === b.cx) {
                d = `M ${a.cx} ${hubBot} L ${b.cx} ${tgtTop}`;
            } else {
                d = `M ${a.cx} ${hubBot} L ${a.cx} ${JUNCTION_Y} L ${b.cx} ${JUNCTION_Y} L ${b.cx} ${tgtTop}`;
            }
            return (
                <g key={i} opacity={opacity}>
                    <path d={d} fill="none" stroke={color} strokeWidth={1.5}
                        strokeDasharray={active ? 'none' : '5 4'} opacity={active ? 0.5 : 0.15} />
                    {showPulse && <Pulse x1={a.cx} y1={hubBot} x2={b.cx} y2={tgtTop} color={bColor} />}
                </g>
            );
        }

        // branch internal — vertical
        const bColor = a.branch ? BRANCH_META[a.branch].color : '#64748b';
        const color = active ? bColor : t.line;
        return (
            <g key={i} opacity={opacity}>
                <line x1={a.cx} y1={a.cy + ra} x2={b.cx} y2={b.cy - rb}
                    stroke={color} strokeWidth={1}
                    strokeDasharray={active ? 'none' : '4 3'} opacity={active ? 0.4 : 0.12} />
                {showPulse && <Pulse x1={a.cx} y1={a.cy + ra} x2={b.cx} y2={b.cy - rb} color={bColor} />}
            </g>
        );
    };

    return (
        <>
            <div className="h-screen flex overflow-hidden select-none transition-colors duration-300"
                style={{ background: t.bg, color: t.text, fontFamily: "'DM Sans',Inter,sans-serif" }}>

                {/* ══ SIDEBAR ══════════════════════════════════════════════ */}
                <aside id="tour-sidebar" className="w-[220px] shrink-0 flex flex-col transition-colors duration-300"
                    style={{ background: t.sidebar, borderRight: `1px solid ${t.sidebarBdr}` }}>

                    <div className="px-5 h-14 flex items-center gap-3" style={{ borderBottom: `1px solid ${t.sidebarBdr}` }}>
                        <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center shadow-[0_0_16px_rgba(59,130,246,0.35)]">
                            <Binary className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-bold text-[15px] tracking-tight" style={{ color: t.text }}>DigiLogic</span>
                        <span className="ml-auto text-[9px] text-blue-400 font-mono bg-blue-400/10 px-1.5 py-0.5 rounded">beta</span>
                    </div>

                    <nav className="flex-1 p-3 pt-4 space-y-0.5">
                        <p className="text-[9px] font-mono uppercase tracking-widest px-3 mb-3" style={{ color: t.textMuted }}>Platform</p>
                        {navItems.map(item => (
                            <button key={item.title} onClick={() => navigate(item.path)}
                                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 cursor-pointer group"
                                style={{ background: item.active ? t.navActive : 'transparent', color: item.active ? t.text : t.textMuted }}
                                onMouseEnter={e => { if (!item.active) e.currentTarget.style.background = t.navHover; }}
                                onMouseLeave={e => { if (!item.active) e.currentTarget.style.background = 'transparent'; }}>
                                <item.icon className={cn("w-4 h-4 shrink-0", item.active ? "text-blue-400" : "")}
                                    style={{ color: item.active ? '#60a5fa' : t.textMuted }} />
                                <span>{item.title}</span>
                                {item.active && <div className="ml-auto w-1 h-1 rounded-full bg-blue-400" />}
                            </button>
                        ))}
                    </nav>




                    <div id="tour-progress-card" className="p-3 pb-5">
                        <div className="rounded-xl p-4 transition-colors" style={{ background: t.cardBg, border: `1px solid ${t.cardBdr}` }}>
                            <div className="flex justify-between mb-2">
                                <span className="text-[11px]" style={{ color: t.textMuted }}>Overall Progress</span>
                                <span className="text-[11px] font-mono font-bold text-blue-400">
                                    {Math.round((completedCount / MODULES.length) * 100)}%
                                </span>
                            </div>
                            <div className="h-[2px] w-full rounded-full overflow-hidden" style={{ background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.08)' }}>
                                <motion.div className="h-full bg-blue-500 rounded-full"
                                    initial={{ width: 0 }} animate={{ width: `${(completedCount / MODULES.length) * 100}%` }}
                                    transition={{ duration: 1.5, ease: 'easeOut' }} />
                            </div>
                            <p className="text-[10px] mt-2 font-mono" style={{ color: t.textMuted }}>{completedCount}/{MODULES.length} complete</p>
                        </div>
                    </div>
                </aside>

                {/* ══ MAIN ═════════════════════════════════════════════════ */}
                <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

                    {/* Header */}
                    <header className="h-14 shrink-0 flex items-center justify-between px-8 transition-colors duration-300"
                        style={{ borderBottom: `1px solid ${t.sidebarBdr}`, background: t.bg }}>
                        <button id="tour-header-search" onClick={() => setCmdOpen(true)}
                            className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-[12px] font-mono cursor-pointer transition-all"
                            style={{ background: t.inputBg, border: `1px solid ${t.inputBdr}`, color: t.textMuted }}>
                            <Command className="w-3.5 h-3.5" /><span>Search modules...</span>
                            <span className="ml-2 text-[10px] border rounded px-1 py-0.5 font-sans" style={{ borderColor: t.inputBdr }}>⌘K</span>
                        </button>
                        <div className="flex items-center gap-3">
                            <button onClick={toggleScheme}
                                className="w-8 h-8 rounded-xl flex items-center justify-center cursor-pointer transition-all"
                                style={{ background: t.inputBg, border: `1px solid ${t.inputBdr}` }}
                                title={`Switch to ${isDark ? 'light' : 'dark'} mode`}>
                                {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-500" />}
                            </button>
                            <button onClick={() => setTourOpen(true)}
                                className="w-8 h-8 rounded-xl flex items-center justify-center cursor-pointer transition-all"
                                style={{ background: t.inputBg, border: `1px solid ${t.inputBdr}` }} title="Start onboarding tour">
                                <HelpCircle className="w-4 h-4" style={{ color: t.textMuted }} />
                            </button>
                            <div className="w-px h-5" style={{ background: t.sidebarBdr }} />
                            <StreakCounter days={streak.current} />
                            <div className="w-px h-5" style={{ background: t.sidebarBdr }} />
                            <div className="text-right">
                                <p className="text-[13px] font-semibold" style={{ color: t.text }}>{firstName || 'VoltMonkey'}</p>
                                <p className="text-[10px] font-mono" style={{ color: t.textMuted }}>Beta Access</p>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 border border-white/10 flex items-center justify-center text-white font-bold text-[12px] cursor-pointer">
                                {(firstName || 'S')[0].toUpperCase()}
                            </div>
                        </div>
                    </header>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto overflow-x-hidden relative" >
                        {/* Blueprint grid */}
                        <div className="fixed inset-0 pointer-events-none" style={{
                            backgroundImage: [
                                'linear-gradient(rgba(59,130,246,0.025) 1px,transparent 1px)',
                                'linear-gradient(90deg,rgba(59,130,246,0.025) 1px,transparent 1px)',
                            ].join(','),
                            backgroundSize: '48px 48px',
                        }} />

                        <div className="relative z-10 px-8 py-8" >

                            {/* ── Page header ── */}
                            <div className="mb-6" >
                                <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest mb-2" style={{ color: t.textMuted }}>
                                    <Zap className="w-3 h-3" /> Curriculum Map
                                </div>
                                <h1 className="text-[26px] font-bold tracking-tight" style={{ color: t.text }}>Learning Modules</h1>
                                <p className="text-[13px] mt-1" style={{ color: t.textMuted }}>
                                    Your progression path through digital electronics. Hover nodes to explore.
                                </p>
                            </div>

                            {/* ── Breadcrumb ── */}
                            <div className="flex items-center gap-1.5 mb-6 text-[11px] font-mono" style={{ color: t.textMuted }}>
                                {
                                    breadcrumb.map((crumb, i) => (
                                        <React.Fragment key={i}>
                                            {i > 0 && <ChevronRight className="w-3 h-3 opacity-40" />}
                                            <span className={i === breadcrumb.length - 1 ? 'text-blue-400' : ''}>{crumb}</span>
                                        </React.Fragment>
                                    ))
                                }
                            </div>

                            {/* ── Branch legend ── */}
                            <div className="flex items-center gap-6 mb-6 flex-wrap" >
                                {
                                    [['#22c55e', 'Completed'], ['#10B981', 'In Progress'], [t.line, 'Locked']].map(([c, l]) => (
                                        <div key={l as string} className="flex items-center gap-1.5">
                                            <div className="w-6 h-[1.5px] rounded" style={{ background: c as string }} />
                                            <span className="text-[11px]" style={{ color: t.textMuted }}>{l}</span>
                                        </div>
                                    ))
                                }
                                <div className="ml-auto flex items-center gap-4" >
                                    {(['basic', 'dsd', 'verilog'] as BranchKey[]).map(k => (
                                        <div key={k} className="flex items-center gap-1.5">
                                            <div className="w-2 h-2 rounded-full" style={{ background: BRANCH_META[k].color }} />
                                            <span className="text-[10px] font-mono" style={{ color: BRANCH_META[k].color }}>{BRANCH_META[k].label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* ══ SVG MAP ═════════════════════════════════════════ */}
                            <div id="tour-map" className="w-full overflow-x-auto">
                                <svg width={CW} height={CH} viewBox={`0 0 ${CW} ${CH}`} style={{ overflow: 'visible' }}>

                                    {/* ── Journey Layer Labels ── */}
                                    <text x={80} y={55} fill={isDark ? '#2A2D35' : '#94a3b8'} fontSize={9} fontWeight="700"
                                        fontFamily="monospace" letterSpacing="0.15em">FOUNDATION</text>
                                    <line x1={80} y1={63} x2={700} y2={63} stroke={isDark ? '#1A1D24' : '#cbd5e1'} strokeWidth={0.5} opacity={0.4} />

                                    <text x={440} y={248} fill={isDark ? '#2A2D35' : '#94a3b8'} fontSize={9} fontWeight="700"
                                        fontFamily="monospace" letterSpacing="0.15em">SPECIALIZATION</text>
                                    <line x1={440} y1={256} x2={860} y2={256} stroke={isDark ? '#1A1D24' : '#cbd5e1'} strokeWidth={0.5} opacity={0.4} />

                                    {/* ── Junction bus bar (horizontal) ── */}
                                    <line x1={BRANCH_COL.basic} y1={JUNCTION_Y} x2={BRANCH_COL.verilog} y2={JUNCTION_Y}
                                        stroke={t.lineFaint} strokeWidth={0.5} opacity={0.25} />

                                    {/* ── Via points at junctions ── */}
                                    {[BRANCH_COL.basic, BRANCH_COL.dsd, BRANCH_COL.verilog].map((vx, i) => (
                                        <circle key={i} cx={vx} cy={JUNCTION_Y} r={3}
                                            fill={isDark ? '#0D0F16' : '#f1f5f9'}
                                            stroke={isDark ? '#2A2D35' : '#94a3b8'} strokeWidth={1} opacity={0.5} />
                                    ))}

                                    {/* ── Branch labels ── */}
                                    {(['basic', 'dsd', 'verilog'] as BranchKey[]).map(k => (
                                        <g key={k} opacity={!activeBranch ? 0.6 : (activeBranch === k ? 0.9 : 0.15)}
                                            style={{ transition: 'opacity 0.3s' }}>
                                            <text x={BRANCH_COL[k]} y={BRANCH_Y[0] - getR({ depth: 1 } as Module) - 20}
                                                textAnchor="middle" fill={BRANCH_META[k].color} fontSize={8} fontWeight="700"
                                                fontFamily="monospace" letterSpacing="0.08em">{BRANCH_META[k].label}</text>
                                        </g>
                                    ))}

                                    {/* ── Connections ── */}
                                    {CONNECTIONS.map((conn, i) => renderConnection(conn, i))}

                                    {/* ── Bubbles (un-hovered) ── */}
                                    {dynamicModules.filter(m => m.id !== hoveredId).map(mod => (
                                        <ModuleBubble key={mod.id} mod={mod} isHovered={false}
                                            onHover={setHoveredId} onStart={handleModuleStart} opacity={getNodeOpacity(mod)} isDark={isDark} />
                                    ))}

                                    {/* ── Hovered bubble + card (on top) ── */}
                                    {hoveredId && (() => {
                                        const mod = getModule(hoveredId);
                                        return (
                                            <>
                                                <ModuleBubble key="hovered" mod={mod} isHovered onHover={setHoveredId}
                                                    onStart={handleModuleStart} opacity={1} isDark={isDark} />
                                                <AnimatePresence>
                                                    <HoverCard key="card" mod={mod} onStart={handleModuleStart} isDark={isDark} />
                                                </AnimatePresence>
                                            </>
                                        );
                                    })()}

                                    {/* ── Tour anchor ── */}
                                    <foreignObject id="tour-module-node"
                                        x={MODULES[1].cx - 40} y={MODULES[1].cy - 40}
                                        width="80" height="80" style={{ pointerEvents: 'none', opacity: 0 }} />

                                    {/* ── Foundation progress bar (completion momentum) ── */}
                                    <g>
                                        <text x={80} y={FOUND_Y + 55} fill={isDark ? '#475569' : '#94a3b8'} fontSize={9}
                                            fontFamily="monospace">Foundation Progress</text>
                                        <rect x={80} y={FOUND_Y + 62} width={560} height={2} rx={1}
                                            fill={isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.06)'} />
                                        <motion.rect x={80} y={FOUND_Y + 62} height={2} rx={1} fill="#10B981"
                                            initial={{ width: 0 }}
                                            animate={{ width: foundComplete > 0 ? (foundComplete / foundMods.length) * 560 : (foundInProg / foundMods.length) * 560 * 0.3 }}
                                            transition={{ duration: 1.5, ease: 'easeOut' }} />
                                        <text x={660} y={FOUND_Y + 67} fill={isDark ? '#475569' : '#94a3b8'} fontSize={9}
                                            fontFamily="monospace" fontWeight="600">
                                            {foundComplete}/{foundMods.length}
                                        </text>
                                    </g>
                                </svg>
                            </div>

                            {/* ── Stats row ── */}
                            <div className="grid grid-cols-4 gap-3 mt-10 max-w-2xl">
                                {
                                    [
                                        { label: 'Total Modules', value: String(MODULES.length), accent: '#94a3b8' },
                                        { label: 'Completed', value: String(completedCount), accent: '#22c55e' },
                                        { label: 'In Progress', value: String(dynamicModules.filter(m => m.status === 'in-progress').length), accent: '#10B981' },
                                        { label: 'Total Hours', value: `${MODULES.reduce((s, m) => s + m.hours, 0)}h`, accent: '#a78bfa' },
                                    ].map(s => (
                                        <div key={s.label} className="rounded-xl p-4 transition-colors"
                                            style={{ background: t.cardBg, border: `1px solid ${t.cardBdr}` }}>
                                            <p className="text-[22px] font-bold font-mono" style={{ color: s.accent }}>{s.value}</p>
                                            <p className="text-[10px] mt-0.5" style={{ color: t.textMuted }}>{s.label}</p>
                                        </div>
                                    ))
                                }
                            </div>

                            <div className="h-16" />
                        </div>
                    </div>
                </div>

            </div>

            {/* ── OVERLAYS ── */}
            < CommandPalette isOpen={cmdOpen} onClose={() => setCmdOpen(false)} navigate={navigate} tourKey={getTourKey(firstName)} />
            <OnboardingTour isOpen={tourOpen} onClose={() => setTourOpen(false)} storageKey={getTourKey(firstName)} />
        </>
    );
};
