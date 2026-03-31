import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    LayoutDashboard, Target, Settings, Binary, Command,
    FlaskConical, Play, Zap, HelpCircle,
    Cpu, Gamepad2,
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useGamificationStore } from '../stores/gamificationStore';
import { CommandPalette } from '../components/ui/CommandPalette';
import { OnboardingTour } from '../components/ui/OnboardingTour';
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

const CW = 960;
const FOUND_Y = 110;
const JUNCTION_Y = 200;
const BRANCH_Y = [296, 392, 488];
const BRANCH_COL: Record<BranchKey, number> = { basic: 480, dsd: 640, verilog: 800 };
const NODE_R = [24, 20, 18, 16];
const HUB_R = 30;
const CH = 580;

const MODULES: Module[] = [
    { id: 'signals', title: 'A Signal Must Return', subtitle: 'The Rule of the Closed Loop', progress: 0, status: 'locked', hours: 0.1, lessons: 1, cx: 80, cy: FOUND_Y, depth: 0, branch: null },
    { id: 'analog_digital', title: 'Continuous vs Discrete', subtitle: 'Analog & Digital Signals', progress: 0, status: 'locked', hours: 1.5, lessons: 5, cx: 220, cy: FOUND_Y, depth: 0, branch: null },
    { id: 'binary_awakening', title: 'Binary Awakening', subtitle: 'The Math of Two States', progress: 0, status: 'locked', hours: 3, lessons: 10, cx: 360, cy: FOUND_Y, depth: 0, branch: null },
    { id: 'logic_gates', title: 'Logic Gates', subtitle: 'AND, OR, NOT, NAND, XOR', progress: 0, status: 'locked', hours: 4, lessons: 12, cx: 500, cy: FOUND_Y, depth: 0, branch: null },
    { id: 'kmap_optimization', title: 'Karnaugh Maps', subtitle: 'Logic Synthesis & K-Maps', progress: 0, status: 'locked', hours: 2, lessons: 6, cx: 640, cy: FOUND_Y, depth: 0, branch: null, isHub: true },
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
    verilog: { label: 'VERILOG & RTL', color: '#8b5cf6' },
};

function getR(m: Module) { return m.isHub ? HUB_R : (NODE_R[m.depth] ?? 16); }

function statusColor(s: Status) {
    if (s === 'completed') return '#10B981';
    if (s === 'in-progress') return '#06B6D4';
    return '#E2E8F0';
}
function accentFor(m: Module) {
    if (m.branch) return BRANCH_META[m.branch].color;
    return statusColor(m.status);
}

const Pulse: React.FC<{ x1: number; y1: number; x2: number; y2: number; color: string }> = ({ x1, y1, x2, y2, color }) => (
    <motion.circle r={2} fill={color} opacity={0.6}
        initial={{ cx: x1, cy: y1, opacity: 0 }}
        animate={{ cx: [x1, x2], cy: [y1, y2], opacity: [0, 0.6, 0.6, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 2, ease: 'linear' }}
    />
);

const ModuleBubble: React.FC<{
    mod: Module; isHovered: boolean; onHover: (id: string | null) => void;
    onStart: (mod: Module) => void;
    opacity: number;
}> = ({ mod, isHovered, onHover, onStart, opacity: nodeOpacity }) => {
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
            {mod.isHub && !locked && (
                <>
                    <circle cx={mod.cx} cy={mod.cy} r={r + 12} fill="none" stroke={accent} strokeWidth={0.5} opacity={0.1} />
                    <motion.circle cx={mod.cx} cy={mod.cy} r={r + 8} fill="none" stroke={accent} strokeWidth={0.8}
                        animate={{ opacity: [0.15, 0.05, 0.15] }} transition={{ duration: 3, repeat: Infinity }} />
                </>
            )}
            {done && <circle cx={mod.cx} cy={mod.cy} r={r + 4} fill="none" stroke="#10B981" strokeWidth={1} opacity={0.2} />}
            {inProg && (
                <motion.circle cx={mod.cx} cy={mod.cy} fill="none" stroke="#06B6D4" strokeWidth={1}
                    initial={{ opacity: 0.3, r: r + 2 }} animate={{ opacity: 0, r: r + 12 }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: 'easeOut' }} />
            )}
            <motion.circle cx={mod.cx} cy={mod.cy}
                r={r}
                fill={locked ? '#F1F5F9' : done ? '#F0FDF4' : '#FFFFFF'}
                stroke={locked ? '#E2E8F0' : accent}
                strokeWidth={mod.isHub ? 2 : locked ? 1 : isHovered ? 2 : 1}
                animate={{ r: isHovered ? r * 1.1 : r }}
                transition={{ duration: 0.2 }}
            />
            {mod.progress > 0 && mod.progress < 100 && (
                <circle cx={mod.cx} cy={mod.cy} r={r - 3} fill="none" stroke={accent} strokeWidth={2}
                    strokeDasharray={`${(r - 3) * 2 * Math.PI * mod.progress / 100} 9999`}
                    strokeLinecap="round" transform={`rotate(-90 ${mod.cx} ${mod.cy})`} opacity={0.4} />
            )}
            <text x={mod.cx} y={mod.cy + 1} textAnchor="middle" dominantBaseline="middle"
                fill={locked ? '#94A3B8' : accent} fontSize={r > 20 ? 10 : 8} fontWeight="700">
                {done ? '✓' : locked ? '' : `${mod.progress}%`}
            </text>
            {!isHovered && (
                <text x={mod.cx} y={mod.cy + r + 14} textAnchor="middle" fill="#475569" fontSize={9} fontWeight="500">
                    {mod.title}
                </text>
            )}
        </motion.g>
    );
};

const CARD_W = 220;
const CARD_H = 150;

const HoverCard: React.FC<{ mod: Module; onStart: (m: Module) => void }> = ({ mod, onStart }) => {
    const r = getR(mod);
    const rawX = mod.cx - CARD_W / 2;
    const rawY = mod.cy - CARD_H - r - 16;
    const x = Math.max(10, Math.min(rawX, CW - CARD_W - 10));
    const y = rawY < 10 ? mod.cy + r + 16 : rawY;

    return (
        <motion.foreignObject x={x} y={y} width={CARD_W} height={CARD_H}
            initial={{ opacity: 0, scale: 0.95, y: 5 }} animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 5 }} >
            <div className="bg-white/95 border border-slate-200/60 rounded-2xl shadow-xl backdrop-blur-md p-4 flex flex-col justify-between h-full group">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-right from-transparent via-cyan-500/20 to-transparent" />
                <div>
                   <div className="flex justify-between items-start mb-1">
                        <span className="text-[9px] font-mono tracking-widest text-slate-400 uppercase">{mod.id}</span>
                        {mod.branch && <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-500 font-bold">{mod.branch}</span>}
                   </div>
                   <h3 className="text-sm font-bold text-slate-900 leading-tight">{mod.title}</h3>
                   <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{mod.subtitle}</p>
                </div>
                <div className="flex items-center justify-between pt-2">
                    <div className="flex gap-2 text-[10px] text-slate-400 font-medium">
                        <span>{mod.lessons}L</span>
                        <span>{mod.hours}h</span>
                    </div>
                    <button onClick={() => onStart(mod)}
                        className="px-4 py-1.5 bg-sky-600 text-white rounded-xl text-[11px] font-bold hover:bg-sky-700 transition-colors flex items-center gap-1.5">
                        <Play className="w-3 h-3 fill-current" /> {mod.progress > 0 ? 'Continue' : 'Start'}
                    </button>
                </div>
            </div>
        </motion.foreignObject>
    );
};

export const WorkstationHome: React.FC = () => {
    const navigate = useNavigate();
    const { firstName, skills, streak, checkStreak } = useGamificationStore();
    const completedModuleIds = skills.completedIds;
    const [hoveredId, setHoveredId] = useState<string | null>(null);
    const [cmdOpen, setCmdOpen] = useState(false);
    const [tourOpen, setTourOpen] = useState(false);

    useEffect(() => { checkStreak(); }, [checkStreak]);

    const dynamicModules = useMemo(() => {
        return MODULES.map((m) => {
            const isCompleted = completedModuleIds.includes(m.id);
            return {
                ...m,
                status: isCompleted ? ('completed' as Status) : ('in-progress' as Status),
                progress: isCompleted ? 100 : 0
            };
        });
    }, [completedModuleIds]);

    const getModule = useCallback((id: string) => dynamicModules.find(m => m.id === id)!, [dynamicModules]);

    const activeBranch = useMemo<BranchKey | null>(() => {
        if (!hoveredId) return null;
        return getModule(hoveredId).branch;
    }, [hoveredId, getModule]);

    const getNodeOpacity = (m: Module) => {
        if (m.depth === 0) return 1;
        if (!activeBranch) return 0.7;
        return m.branch === activeBranch ? 1 : 0.2;
    };

    const handleModuleStart = (mod: Module) => {
        const routes: Record<string, string> = {
            signals: '/module/1', analog_digital: '/module/2', binary_awakening: '/module/3',
            logic_gates: '/module/4', kmap_optimization: '/module/5',
        };
        const branchRoutes: Record<string, string> = { basic: '/circuit-lab', dsd: '/fsm', verilog: '/verilog' };
        const route = routes[mod.id] || (mod.branch && branchRoutes[mod.branch]);
        if (route) navigate(route);
    };

    const navItems = [
        { title: 'Dashboard', icon: LayoutDashboard, path: '/portal', active: true },
        { title: 'Challenges', icon: Target, path: '/assessment' },
        { title: 'Boss Arena', icon: Gamepad2, path: '/boss-arena' },
        { title: 'Workbench', icon: FlaskConical, path: '/workbench' },
        { title: 'CPU Lab', icon: Cpu, path: '/cpu-lab' },
        { title: 'HW LeetCode', icon: Zap, path: '/hw-leetcode' },
        { title: 'Settings', icon: Settings, path: '/portfolio' },
    ];

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setCmdOpen(p => !p); }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <div className="h-screen flex overflow-hidden bg-[#F8FAFC] text-[#1E293B]">
            {/* Sidebar */}
            <aside className="w-60 bg-white border-r border-slate-200 flex flex-col shrink-0">
                <div className="h-16 flex items-center px-6 border-b border-slate-100 gap-3">
                    <div className="w-8 h-8 bg-sky-600 rounded-lg flex items-center justify-center text-white">
                        <Binary className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-slate-900 tracking-tight">VeriLog AI</span>
                </div>
                <nav className="flex-1 p-4 space-y-1">
                    {navItems.map(item => (
                        <button key={item.title} onClick={() => navigate(item.path)}
                            className={cn(
                                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                                item.active ? "bg-slate-100 text-slate-900" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                            )}>
                            <item.icon className={cn("w-4 h-4", item.active ? "text-sky-600" : "")} />
                            {item.title}
                        </button>
                    ))}
                </nav>

                <div className="p-4">
                    <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                        <div className="flex justify-between text-[11px] font-bold text-slate-500 mb-2 uppercase tracking-wider">
                            <span>Progress</span>
                            <span>{Math.round((dynamicModules.filter(m => m.status === 'completed').length / MODULES.length) * 100)}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                            <motion.div className="h-full bg-sky-600"
                                initial={{ width: 0 }} animate={{ width: `${(dynamicModules.filter(m => m.status === 'completed').length / MODULES.length) * 100}%` }} />
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 bg-[#F8FAFC] overflow-hidden">
                <header className="h-16 border-b border-slate-200 bg-white/80 backdrop-blur-md flex items-center justify-between px-8 shrink-0 relative z-50">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setCmdOpen(true)} className="h-10 px-4 rounded-xl bg-slate-100 border border-slate-200 text-slate-400 text-sm flex items-center gap-3 w-64 hover:bg-slate-200/50 transition-colors">
                            <Command className="w-4 h-4" /> <span>Search modules...</span>
                            <span className="ml-auto text-[10px] border border-slate-300 px-1.5 py-0.5 rounded-md">⌘K</span>
                        </button>
                    </div>
                    <div className="flex items-center gap-4">
                        <StreakCounter days={streak.current} />
                        <button onClick={() => setTourOpen(true)} className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors">
                            <HelpCircle className="w-5 h-5" />
                        </button>
                        <div className="h-8 w-px bg-slate-200" />
                        <div className="flex items-center gap-3">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-bold text-slate-900 leading-tight">{firstName || 'Scholar'}</p>
                                <p className="text-[11px] text-slate-500 font-medium">Hardware Engineer</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-400 to-sky-600 text-white flex items-center justify-center font-bold shadow-lg shadow-sky-500/20 uppercase">
                                {(firstName || 'S')[0]}
                            </div>
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-8 relative">
                    <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
                    
                    <div className="max-w-5xl mx-auto relative z-10">
                        <div className="mb-10">
                            <div className="flex items-center gap-2 text-[11px] font-bold text-sky-600 uppercase tracking-widest mb-2">
                                <Zap className="w-3.5 h-3.5 fill-current" /> Curriculum Visualization
                            </div>
                            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Your Learning Map</h1>
                            <p className="text-slate-500 mt-2 max-w-xl">Scale the peaks of hardware design. Master digital logic from simple foundations to complex Verilog architectures.</p>
                        </div>

                        {/* Map Scroll Area */}
                        <div className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-2xl shadow-slate-200/50 overflow-x-auto">
                            <svg width={CW} height={CH} viewBox={`0 0 ${CW} ${CH}`} className="overflow-visible">
                                {/* Connection lines */}
                                {CONNECTIONS.map((conn, i) => {
                                    const a = getModule(conn.from), b = getModule(conn.to);
                                    const ra = getR(a), rb = getR(b);
                                    const active = a.status === 'completed' || a.status === 'in-progress';
                                    const color = active ? accentFor(a) : '#E2E8F0';
                                    
                                    if (conn.type === 'trunk') {
                                        return (
                                            <React.Fragment key={i}>
                                                <line x1={a.cx + ra} y1={a.cy} x2={b.cx - rb} y2={b.cy} stroke={color} strokeWidth={2.5} strokeLinecap="round" opacity={active ? 0.6 : 0.2} />
                                                {active && <Pulse x1={a.cx + ra} y1={a.cy} x2={b.cx - rb} y2={b.cy} color={color} />}
                                            </React.Fragment>
                                        );
                                    }
                                    if (conn.type === 'hub-branch') {
                                        const hubBot = a.cy + HUB_R;
                                        const tgtTop = b.cy - rb;
                                        const d = `M ${a.cx} ${hubBot} L ${a.cx} ${JUNCTION_Y} L ${b.cx} ${JUNCTION_Y} L ${b.cx} ${tgtTop}`;
                                        return (
                                            <React.Fragment key={i}>
                                                <path d={d} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" opacity={active ? 0.5 : 0.15} />
                                                {active && <Pulse x1={a.cx} y1={hubBot} x2={b.cx} y2={tgtTop} color={color} />}
                                            </React.Fragment>
                                        );
                                    }
                                    return (
                                        <line key={i} x1={a.cx} y1={a.cy + ra} x2={b.cx} y2={b.cy - rb} stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeDasharray="4 4" opacity={active ? 0.4 : 0.1} />
                                    );
                                })}

                                {/* Modules */}
                                {dynamicModules.map(mod => (
                                    <ModuleBubble key={mod.id} mod={mod} isHovered={hoveredId === mod.id} onHover={setHoveredId} onStart={handleModuleStart} opacity={getNodeOpacity(mod)} />
                                ))}

                                {/* Overlay Hover Card */}
                                <AnimatePresence>
                                    {hoveredId && <HoverCard mod={getModule(hoveredId)} onStart={handleModuleStart} />}
                                </AnimatePresence>
                            </svg>
                        </div>
                    </div>
                </div>
            </main>

            <CommandPalette isOpen={cmdOpen} onClose={() => setCmdOpen(false)} navigate={navigate} tourKey={getTourKey(firstName)} />
            <OnboardingTour isOpen={tourOpen} onClose={() => setTourOpen(false)} storageKey={getTourKey(firstName)} />
        </div>
    );
};
