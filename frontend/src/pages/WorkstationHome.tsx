import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    LayoutDashboard, Target, Settings, Binary, Command,
    BarChart3, FlaskConical, BookOpen, CheckCircle2,
    Lock, Play, Zap, Moon, Sun, HelpCircle,
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useUserStore } from '../stores/userStore';
import { CommandPalette } from '../components/ui/CommandPalette';
import { OnboardingTour } from '../components/ui/OnboardingTour';
import { useColorScheme } from '../hooks/useColorScheme';

/* Per-user tour key — ensures every new account sees the tour for the first time */
const getTourKey = (name: string | null) => `digi_tour_done_${name ?? 'guest'}`;

/* ══════════════════════════════════════════════════════════════════════
   DATA LAYER
══════════════════════════════════════════════════════════════════════ */

type Status = 'completed' | 'in-progress' | 'locked';

interface Module {
    id: string; title: string; subtitle: string;
    progress: number; status: Status;
    hours: number; lessons: number;
    cx: number; cy: number;
}

const CW = 920;
const CORE_Y = 150;
const BT = 360;   // branch top-of-area Y

const MODULES: Module[] = [
    { id: 'C1', title: 'A Signal Must Return', subtitle: 'The Rule of the Closed Loop', progress: 0, status: 'in-progress', hours: 0.1, lessons: 1, cx: 80, cy: CORE_Y },
    { id: 'C2', title: 'Logic Gates', subtitle: 'AND, OR, NOT, NAND, XOR', progress: 80, status: 'in-progress', hours: 3, lessons: 10, cx: 240, cy: CORE_Y },
    { id: 'C3', title: 'Boolean Algebra', subtitle: 'De Morgan, Simplification', progress: 40, status: 'in-progress', hours: 3.5, lessons: 9, cx: 400, cy: CORE_Y },
    { id: 'C4', title: 'Combinational', subtitle: 'MUX, Decoders, Adders', progress: 0, status: 'locked', hours: 4, lessons: 12, cx: 560, cy: CORE_Y },
    { id: 'C5', title: 'Karnaugh Maps', subtitle: 'K-map Minimization', progress: 0, status: 'locked', hours: 2, lessons: 6, cx: 720, cy: CORE_Y },
    /* Basic Electronics */
    { id: 'B1', title: 'BJT & MOSFET', subtitle: 'Transistor fundamentals', progress: 0, status: 'locked', hours: 3, lessons: 8, cx: 600, cy: BT },
    { id: 'B2', title: 'Amplifiers', subtitle: 'Op-amp & gain stages', progress: 0, status: 'locked', hours: 3, lessons: 9, cx: 720, cy: BT + 60 },
    { id: 'B3', title: 'Signal Analysis', subtitle: 'Fourier, filters, AC', progress: 0, status: 'locked', hours: 4, lessons: 10, cx: 840, cy: BT },
    /* DSD */
    { id: 'D1', title: 'Flip-Flops', subtitle: 'SR, D, JK, T, edge-trig', progress: 0, status: 'locked', hours: 3.5, lessons: 8, cx: 600, cy: BT + 175 },
    { id: 'D2', title: 'State Machines', subtitle: 'Mealy, Moore, FSM', progress: 0, status: 'locked', hours: 4, lessons: 10, cx: 720, cy: BT + 240 },
    { id: 'D3', title: 'Sequential Sys.', subtitle: 'Counters, Shift Registers', progress: 0, status: 'locked', hours: 4, lessons: 11, cx: 840, cy: BT + 175 },
    /* Verilog */
    { id: 'V1', title: 'Verilog Basics', subtitle: 'Syntax, modules, wire/reg', progress: 0, status: 'locked', hours: 3, lessons: 8, cx: 600, cy: BT + 355 },
    { id: 'V2', title: 'RTL Design', subtitle: 'Combinational & sequential RTL', progress: 0, status: 'locked', hours: 4, lessons: 10, cx: 720, cy: BT + 415 },
    { id: 'V3', title: 'Testbenches', subtitle: 'Simulation, assertions', progress: 0, status: 'locked', hours: 4, lessons: 9, cx: 840, cy: BT + 355 },
];

const CONNECTIONS: [string, string][] = [
    ['C1', 'C2'], ['C2', 'C3'], ['C3', 'C4'], ['C4', 'C5'],
    ['C5', 'B1'], ['B1', 'B2'], ['B2', 'B3'],
    ['C5', 'D1'], ['D1', 'D2'], ['D2', 'D3'],
    ['C5', 'V1'], ['V1', 'V2'], ['V2', 'V3'],
];

const BRANCH_META: Record<string, { label: string; color: string; fromId: string }> = {
    basic: { label: 'BASIC ELECTRONICS', color: '#f59e0b', fromId: 'B1' },
    dsd: { label: 'DIGITAL SYSTEM DESIGN', color: '#3b82f6', fromId: 'D1' },
    verilog: { label: 'VERILOG HDL', color: '#a78bfa', fromId: 'V1' },
};

/* ══════════════════════════════════════════════════════════════════════
   SVG HELPERS
══════════════════════════════════════════════════════════════════════ */

const BUBBLE_R = 28;

function getModule(id: string) { return MODULES.find(m => m.id === id)!; }

function statusColor(s: Status): string {
    if (s === 'completed') return '#22c55e';
    if (s === 'in-progress') return '#3b82f6';
    return '#1a2332';
}

const SignalPulse: React.FC<{ x1: number; y1: number; x2: number; y2: number; active: boolean }> = ({ x1, y1, x2, y2, active }) => {
    if (!active) return null;
    return (
        <motion.circle r="3" fill="#3b82f6" opacity={0.9}
            initial={{ cx: x1, cy: y1, opacity: 0 }}
            animate={{ cx: [x1, x2], cy: [y1, y2], opacity: [0, 1, 1, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, repeatDelay: 2, ease: 'linear' }}
        />
    );
};

/* bubble node */
const ModuleBubble: React.FC<{ mod: Module; isHovered: boolean; onHover: (id: string | null) => void }> = ({ mod, isHovered, onHover }) => {
    const locked = mod.status === 'locked';
    const done = mod.status === 'completed';
    const accent = statusColor(mod.status);

    return (
        <motion.g style={{ cursor: locked ? 'default' : 'pointer' }}
            onHoverStart={() => !locked && onHover(mod.id)}
            onHoverEnd={() => onHover(null)}
        >
            {done && <circle cx={mod.cx} cy={mod.cy} r={BUBBLE_R + 7} fill="none" stroke="#22c55e" strokeWidth="1" opacity="0.2" />}
            {mod.status === 'in-progress' && (
                <motion.circle cx={mod.cx} cy={mod.cy} r={BUBBLE_R + 4} fill="none" stroke="#3b82f6" strokeWidth="1"
                    initial={{ opacity: .4, r: BUBBLE_R + 4 }} animate={{ opacity: 0, r: BUBBLE_R + 14 }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: 'easeOut' }}
                />
            )}
            <motion.circle cx={mod.cx} cy={mod.cy}
                r={BUBBLE_R}
                fill={locked ? '#0b0e14' : done ? '#091409' : '#0d1520'}
                stroke={accent}
                strokeWidth={locked ? .5 : isHovered ? 2 : 1}
                opacity={locked ? .4 : 1}
                animate={{ r: isHovered ? BUBBLE_R + 4 : BUBBLE_R }}
                transition={{ duration: .2, ease: 'easeOut' }}
            />
            {mod.progress > 0 && mod.progress < 100 && (
                <circle cx={mod.cx} cy={mod.cy} r={BUBBLE_R - 5} fill="none" stroke="#3b82f6" strokeWidth="2"
                    strokeDasharray={`${(BUBBLE_R - 5) * 2 * Math.PI * mod.progress / 100} 9999`}
                    strokeLinecap="round"
                    transform={`rotate(-90 ${mod.cx} ${mod.cy})`} opacity="0.55"
                />
            )}
            {done ? <CheckCircle2 x={mod.cx - 9} y={mod.cy - 9} width={18} height={18} color="#22c55e" /> :
                locked ? <Lock x={mod.cx - 8} y={mod.cy - 8} width={16} height={16} color="#334155" /> :
                    <text x={mod.cx} y={mod.cy + 1} textAnchor="middle" dominantBaseline="middle"
                        fill="#3b82f6" fontSize="9" fontWeight="700" fontFamily="monospace">{mod.progress}%</text>}
            {!isHovered && (
                <text x={mod.cx} y={mod.cy + BUBBLE_R + 16} textAnchor="middle"
                    fill={locked ? '#2a3547' : '#94a3b8'} fontSize="10" fontWeight="500" fontFamily="'DM Sans',sans-serif">
                    {mod.title}
                </text>
            )}
        </motion.g>
    );
};

const CARD_W = 220;
const CARD_H = 150;

const HoverCard: React.FC<{ mod: Module; onStart: (mod: Module) => void }> = ({ mod, onStart }) => {
    const rawX = mod.cx - CARD_W / 2;
    const rawY = mod.cy - CARD_H - BUBBLE_R - 12;
    const x = Math.max(10, Math.min(rawX, CW - CARD_W - 10));
    const y = rawY < 10 ? mod.cy + BUBBLE_R + 12 : rawY;
    const accent = statusColor(mod.status);
    const label = mod.progress === 100 ? 'Review' : mod.progress > 0 ? 'Continue' : 'Start';

    return (
        <motion.g initial={{ opacity: 0, scale: .9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: .88 }}
            transition={{ duration: .18, ease: [.16, 1, .3, 1] }}>
            <foreignObject x={x} y={y} width={CARD_W} height={CARD_H}>
                <div className="rounded-2xl border border-white/10 bg-[#0d1118] shadow-[0_8px_40px_rgba(0,0,0,0.7)] overflow-hidden flex flex-col justify-between p-4 relative"
                    style={{ width: CARD_W, height: CARD_H }}>
                    <div className="absolute top-0 left-4 right-4 h-[1px]"
                        style={{ background: `linear-gradient(to right,transparent,${accent}60,transparent)` }} />
                    <div>
                        <p className="text-[9px] font-mono uppercase tracking-widest mb-1" style={{ color: accent }}>{mod.id}</p>
                        <p className="text-[13px] font-semibold text-white leading-snug">{mod.title}</p>
                        <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-2 leading-snug">{mod.subtitle}</p>
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-[10px] text-slate-600 font-mono">{mod.lessons}L · {mod.hours}h</p>
                            <div className="mt-1 h-[2px] w-20 bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full rounded-full" style={{ width: `${mod.progress}%`, background: accent }} />
                            </div>
                        </div>
                        <button
                            onClick={() => onStart(mod)}
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
    const { firstName } = useUserStore();
    const [hoveredId, setHoveredId] = useState<string | null>(null);
    const [cmdOpen, setCmdOpen] = useState(false);
    const [tourOpen, setTourOpen] = useState(false);
    const [scheme, toggleScheme] = useColorScheme();

    const isDark = scheme === 'dark';

    const MODULE_ROUTES: Record<string, string> = { C1: '/module/1' };

    const handleModuleStart = (mod: Module) => {
        const route = MODULE_ROUTES[mod.id];
        if (route) navigate(route);
    };

    /* ── Auto-launch tour for every new user ── */
    useEffect(() => {
        const key = getTourKey(firstName);
        if (!localStorage.getItem(key)) {
            const t = setTimeout(() => setTourOpen(true), 800);
            return () => clearTimeout(t);
        }
    }, [firstName]);

    /* ── Global ⌘K / Ctrl+K ── */
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
            e.preventDefault();
            setCmdOpen(prev => !prev);
        }
    }, []);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    const navItems = [
        { title: 'Dashboard', icon: LayoutDashboard, path: '/portal', active: true },
        { title: 'Challenges', icon: Target, path: '/assessment' },
        { title: 'Workbench', icon: FlaskConical, path: '/playground' },
        { title: 'Progress', icon: BarChart3, path: '/training' },
        { title: 'Modules', icon: BookOpen, path: '/portal' },
        { title: 'Settings', icon: Settings, path: '/login' },
    ];

    const completedCount = MODULES.filter(m => m.status === 'completed').length;
    const CH_canvas = BT + 420 + 80;

    /* Dark / Light adaptive CSS tokens */
    const t = {
        bg: isDark ? '#07080C' : '#f1f5f9',
        sidebar: isDark ? '#08090D' : '#ffffff',
        sidebarBdr: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.08)',
        text: isDark ? '#e2e8f0' : '#0f172a',
        textMuted: isDark ? '#64748b' : '#64748b',
        cardBg: isDark ? '#0c0f16' : '#ffffff',
        cardBdr: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.1)',
        navActive: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(59,130,246,0.08)',
        navHover: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)',
        inputBg: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)',
        inputBdr: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.1)',
    };

    return (
        <>
            <div className="h-screen flex overflow-hidden select-none transition-colors duration-300"
                style={{ background: t.bg, color: t.text, fontFamily: "'DM Sans',Inter,sans-serif" }}>

                {/* ══ SIDEBAR ══════════════════════════════════════════════ */}
                <aside id="tour-sidebar" className="w-[220px] shrink-0 flex flex-col transition-colors duration-300"
                    style={{ background: t.sidebar, borderRight: `1px solid ${t.sidebarBdr}` }}>

                    {/* Logo */}
                    <div className="px-5 h-14 flex items-center gap-3" style={{ borderBottom: `1px solid ${t.sidebarBdr}` }}>
                        <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center shadow-[0_0_16px_rgba(59,130,246,0.35)]">
                            <Binary className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-bold text-[15px] tracking-tight" style={{ color: t.text }}>DigiLogic</span>
                        <span className="ml-auto text-[9px] text-blue-400 font-mono bg-blue-400/10 px-1.5 py-0.5 rounded">beta</span>
                    </div>

                    {/* Nav */}
                    <nav className="flex-1 p-3 pt-4 space-y-0.5">
                        <p className="text-[9px] font-mono uppercase tracking-widest px-3 mb-3" style={{ color: t.textMuted }}>Platform</p>
                        {navItems.map(item => (
                            <button key={item.title}
                                onClick={() => navigate(item.path)}
                                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 cursor-pointer group"
                                style={{
                                    background: item.active ? t.navActive : 'transparent',
                                    color: item.active ? t.text : t.textMuted,
                                }}
                                onMouseEnter={e => { if (!item.active) e.currentTarget.style.background = t.navHover; }}
                                onMouseLeave={e => { if (!item.active) e.currentTarget.style.background = 'transparent'; }}
                            >
                                <item.icon className={cn("w-4 h-4 shrink-0", item.active ? "text-blue-400" : "")}
                                    style={{ color: item.active ? '#60a5fa' : t.textMuted }} />
                                <span>{item.title}</span>
                                {item.active && <div className="ml-auto w-1 h-1 rounded-full bg-blue-400" />}
                            </button>
                        ))}
                    </nav>

                    {/* Progress card */}
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

                        {/* ⌘K button */}
                        <button id="tour-header-search"
                            onClick={() => setCmdOpen(true)}
                            className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-[12px] font-mono cursor-pointer transition-all"
                            style={{ background: t.inputBg, border: `1px solid ${t.inputBdr}`, color: t.textMuted }}
                        >
                            <Command className="w-3.5 h-3.5" />
                            <span>Search modules...</span>
                            <span className="ml-2 text-[10px] border rounded px-1 py-0.5 font-sans"
                                style={{ borderColor: t.inputBdr }}>⌘K</span>
                        </button>

                        <div className="flex items-center gap-3">
                            {/* Theme toggle */}
                            <button onClick={toggleScheme}
                                className="w-8 h-8 rounded-xl flex items-center justify-center cursor-pointer transition-all"
                                style={{ background: t.inputBg, border: `1px solid ${t.inputBdr}` }}
                                title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
                            >
                                {isDark
                                    ? <Sun className="w-4 h-4 text-amber-400" />
                                    : <Moon className="w-4 h-4 text-slate-500" />
                                }
                            </button>

                            {/* Tour hint */}
                            <button onClick={() => setTourOpen(true)}
                                className="w-8 h-8 rounded-xl flex items-center justify-center cursor-pointer transition-all"
                                style={{ background: t.inputBg, border: `1px solid ${t.inputBdr}` }}
                                title="Start onboarding tour"
                            >
                                <HelpCircle className="w-4 h-4" style={{ color: t.textMuted }} />
                            </button>

                            {/* Vertical divider */}
                            <div className="w-px h-5" style={{ background: t.sidebarBdr }} />

                            <div className="text-right">
                                <p className="text-[13px] font-semibold" style={{ color: t.text }}>{firstName || 'Scientist'}</p>
                                <p className="text-[10px] font-mono" style={{ color: t.textMuted }}>Beta Access</p>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 border border-white/10 flex items-center justify-center text-white font-bold text-[12px] cursor-pointer">
                                {(firstName || 'S')[0].toUpperCase()}
                            </div>
                        </div>
                    </header>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto overflow-x-hidden relative">

                        {/* Blueprint grid */}
                        <div className="fixed inset-0 pointer-events-none" style={{
                            backgroundImage: [
                                'linear-gradient(rgba(59,130,246,0.025) 1px,transparent 1px)',
                                'linear-gradient(90deg,rgba(59,130,246,0.025) 1px,transparent 1px)',
                            ].join(','),
                            backgroundSize: '48px 48px',
                        }} />

                        <div className="relative z-10 px-8 py-8">
                            {/* Page header */}
                            <div className="mb-8">
                                <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest mb-2"
                                    style={{ color: t.textMuted }}>
                                    <Zap className="w-3 h-3" /> Curriculum Map
                                </div>
                                <h1 className="text-[26px] font-bold tracking-tight" style={{ color: t.text }}>Learning Modules</h1>
                                <p className="text-[13px] mt-1" style={{ color: t.textMuted }}>
                                    Your progression path through digital electronics. Hover nodes to explore.
                                </p>
                            </div>

                            {/* Branch legend */}
                            <div className="flex items-center gap-6 mb-6 flex-wrap">
                                {[['#22c55e', 'Completed'], ['#3b82f6', 'In Progress'], ['#1e293b', 'Locked']].map(([c, l]) => (
                                    <div key={l} className="flex items-center gap-1.5">
                                        <div className="w-6 h-[1.5px] rounded" style={{ background: c }} />
                                        <span className="text-[11px]" style={{ color: t.textMuted }}>{l}</span>
                                    </div>
                                ))}
                                <div className="ml-auto flex items-center gap-4">
                                    {[['#f59e0b', 'Basic Electronics'], ['#3b82f6', 'DSD'], ['#a78bfa', 'Verilog']].map(([c, l]) => (
                                        <div key={l} className="flex items-center gap-1.5">
                                            <div className="w-2 h-2 rounded-full" style={{ background: c }} />
                                            <span className="text-[10px] font-mono" style={{ color: c }}>{l}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* ── SVG Map ── */}
                            <div id="tour-map" className="w-full overflow-x-auto">
                                <svg width={CW} height={CH_canvas} viewBox={`0 0 ${CW} ${CH_canvas}`} style={{ overflow: 'visible' }}>

                                    {/* connections */}
                                    {CONNECTIONS.map(([aId, bId]) => {
                                        const a = getModule(aId), b = getModule(bId);
                                        const active = a.status !== 'locked' && b.status !== 'locked';
                                        const color = active ? statusColor(a.status) : '#1a2332';
                                        return (
                                            <g key={`${aId}-${bId}`}>
                                                <line x1={a.cx} y1={a.cy} x2={b.cx} y2={b.cy}
                                                    stroke={color} strokeWidth={active ? 1.5 : 1}
                                                    strokeDasharray={active ? 'none' : '5 4'}
                                                    opacity={active ? .6 : .2} />
                                                <SignalPulse x1={a.cx} y1={a.cy} x2={b.cx} y2={b.cy}
                                                    active={active && a.status === 'in-progress'} />
                                            </g>
                                        );
                                    })}

                                    {/* branch labels */}
                                    {Object.entries(BRANCH_META).map(([, { label, color, fromId }]) => {
                                        const m = getModule(fromId);
                                        return (
                                            <g key={label}>
                                                <text x={m.cx - 40} y={m.cy - BUBBLE_R - 18}
                                                    fill={color} fontSize="8.5" fontWeight="700"
                                                    fontFamily="monospace" letterSpacing="0.09em" opacity="0.65">
                                                    {label}
                                                </text>
                                                <line x1={m.cx - 40} y1={m.cy - BUBBLE_R - 10} x2={m.cx + 100} y2={m.cy - BUBBLE_R - 10}
                                                    stroke={color} strokeWidth="0.6" opacity="0.18" />
                                            </g>
                                        );
                                    })}

                                    {/* bubbles (un-hovered) */}
                                    {MODULES.filter(m => m.id !== hoveredId).map(mod => (
                                        <ModuleBubble key={mod.id} mod={mod} isHovered={false} onHover={setHoveredId} />
                                    ))}

                                    {/* hovered bubble + card (rendered on top) */}
                                    {hoveredId && (() => {
                                        const mod = getModule(hoveredId);
                                        return (
                                            <>
                                                <ModuleBubble key="hovered" mod={mod} isHovered onHover={setHoveredId} />
                                                <AnimatePresence>
                                                    <HoverCard key="card" mod={mod} onStart={handleModuleStart} />
                                                </AnimatePresence>
                                            </>
                                        );
                                    })()}

                                    {/* ID anchor for first unlocked bubble for tour */}
                                    <foreignObject id="tour-module-node"
                                        x={MODULES[1].cx - 40} y={MODULES[1].cy - 40}
                                        width="80" height="80" style={{ pointerEvents: 'none', opacity: 0 }} />
                                </svg>
                            </div>

                            {/* Stats row */}
                            <div className="grid grid-cols-4 gap-3 mt-10 max-w-2xl">
                                {[
                                    { label: 'Total Modules', value: String(MODULES.length), accent: '#94a3b8' },
                                    { label: 'Completed', value: String(completedCount), accent: '#22c55e' },
                                    { label: 'In Progress', value: String(MODULES.filter(m => m.status === 'in-progress').length), accent: '#3b82f6' },
                                    { label: 'Total Hours', value: `${MODULES.reduce((s, m) => s + m.hours, 0)}h`, accent: '#a78bfa' },
                                ].map(s => (
                                    <div key={s.label} className="rounded-xl p-4 transition-colors"
                                        style={{ background: t.cardBg, border: `1px solid ${t.cardBdr}` }}>
                                        <p className="text-[22px] font-bold font-mono" style={{ color: s.accent }}>{s.value}</p>
                                        <p className="text-[10px] mt-0.5" style={{ color: t.textMuted }}>{s.label}</p>
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
