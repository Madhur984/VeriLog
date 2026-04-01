import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Target, Command, Play, Zap, HelpCircle } from 'lucide-react';
import { useGamificationStore } from '../stores/gamificationStore';
import { CommandPalette } from '../components/ui/CommandPalette';
import { OnboardingTour } from '../components/ui/OnboardingTour';
import { StreakCounter } from '../components/ui/StreakCounter';
import { RadialMenu } from '../components/ui/RadialMenu';

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
    if (s === 'in-progress') return '#0EA5E9';
    return '#334155';
}
function accentFor(m: Module) {
    if (m.branch) return BRANCH_META[m.branch].color;
    return statusColor(m.status);
}

const Pulse: React.FC<{ x1: number; y1: number; x2: number; y2: number; color: string }> = ({ x1, y1, x2, y2, color }) => (
    <motion.circle r={2.5} fill={color} opacity={0.8}
        initial={{ cx: x1, cy: y1, opacity: 0 }}
        animate={{ cx: [x1, x2], cy: [y1, y2], opacity: [0, 0.8, 0.8, 0], scale: [1, 1.5, 1.5, 1] }}
        transition={{ duration: 2, repeat: Infinity, repeatDelay: 1.5, ease: 'linear' }}
        style={{ filter: `drop-shadow(0 0 6px ${color})` }}
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
                    <circle cx={mod.cx} cy={mod.cy} r={r + 12} fill="none" stroke={accent} strokeWidth={0.5} opacity={0.2} />
                    <motion.circle cx={mod.cx} cy={mod.cy} r={r + 8} fill="none" stroke={accent} strokeWidth={1}
                        animate={{ opacity: [0.2, 0.05, 0.2] }} transition={{ duration: 3, repeat: Infinity }} />
                </>
            )}
            {done && <circle cx={mod.cx} cy={mod.cy} r={r + 4} fill="none" stroke="#10B981" strokeWidth={1} opacity={0.4} />}
            {inProg && (
                <motion.circle cx={mod.cx} cy={mod.cy} fill="none" stroke="#0EA5E9" strokeWidth={1.5}
                    initial={{ opacity: 0.5, r: r + 2 }} animate={{ opacity: 0, r: r + 14 }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: 'easeOut' }} />
            )}
            <motion.circle cx={mod.cx} cy={mod.cy}
                r={r}
                fill={locked ? '#0F172A' : done ? '#022C22' : '#0F172A'}
                stroke={locked ? '#334155' : accent}
                strokeWidth={mod.isHub ? 2 : locked ? 1 : isHovered ? 2 : 1.5}
                animate={{ r: isHovered ? r * 1.1 : r }}
                transition={{ duration: 0.2 }}
                style={!locked ? { filter: `drop-shadow(0 0 ${isHovered ? 12 : 6}px ${accent}60)` } : undefined}
            />
            {mod.progress > 0 && mod.progress < 100 && (
                <circle cx={mod.cx} cy={mod.cy} r={r - 3} fill="none" stroke={accent} strokeWidth={2.5}
                    strokeDasharray={`${(r - 3) * 2 * Math.PI * mod.progress / 100} 9999`}
                    strokeLinecap="round" transform={`rotate(-90 ${mod.cx} ${mod.cy})`} opacity={0.8} />
            )}
            <text x={mod.cx} y={mod.cy + 1} textAnchor="middle" dominantBaseline="middle"
                fill={locked ? '#475569' : '#FFFFFF'} fontSize={r > 20 ? 10 : 8} fontWeight="700">
                {done ? '✓' : locked ? '' : `${mod.progress}%`}
            </text>
            {!isHovered && (
                <text x={mod.cx} y={mod.cy + r + 18} textAnchor="middle" fill={locked ? '#475569' : '#94A3B8'} fontSize={9} fontWeight="600" letterSpacing="0.05em">
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
            <div className="bg-slate-900/95 border border-slate-700/60 rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.5)] backdrop-blur-xl p-4 flex flex-col justify-between h-full group overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-right from-transparent via-sky-500/50 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />
                <div className="relative z-10">
                   <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase">{mod.id}</span>
                        {mod.branch && <span className="text-[9px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-bold border border-slate-700/50 shadow-inner">{mod.branch}</span>}
                   </div>
                   <h3 className="text-sm font-bold text-white leading-tight drop-shadow-sm">{mod.title}</h3>
                   <p className="text-[11px] text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">{mod.subtitle}</p>
                </div>
                <div className="flex items-center justify-between pt-3 relative z-10 border-t border-slate-800/80 mt-2">
                    <div className="flex gap-3 text-[10px] text-slate-500 font-medium font-mono">
                        <span className="flex items-center gap-1"><Target className="w-3 h-3" /> {mod.lessons}L</span>
                        <span className="flex items-center gap-1"><Play className="w-3 h-3" /> {mod.hours}h</span>
                    </div>
                    <button onClick={() => onStart(mod)}
                        className="px-4 py-1.5 bg-sky-500 hover:bg-sky-400 text-slate-950 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1.5 shadow-[0_0_15px_rgba(14,165,233,0.3)] hover:shadow-[0_0_20px_rgba(14,165,233,0.5)]">
                        <Play className="w-3 h-3 fill-current" /> {mod.progress > 0 ? 'Resume' : 'Start'}
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

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setCmdOpen(p => !p); }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <div className="h-screen flex overflow-hidden bg-[#0B1120] text-slate-200 selection:bg-sky-500/30">
            {/* Radial Menu Integration */}
            <RadialMenu />

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 bg-[#0B1120] relative overflow-hidden">
                {/* Ambient dynamic background */}
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-sky-900/20 rounded-full blur-[120px] pointer-events-none" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-indigo-900/20 rounded-full blur-[120px] pointer-events-none" />

                <header className="h-20 border-b border-slate-800/60 bg-slate-900/40 backdrop-blur-2xl flex items-center justify-between px-10 shrink-0 relative z-50">
                    <div className="flex items-center gap-6">
                        <button onClick={() => setCmdOpen(true)} className="h-11 px-5 rounded-2xl bg-slate-800/50 border border-slate-700/50 text-slate-400 text-sm flex items-center gap-3 w-72 hover:bg-slate-700/50 hover:border-slate-600/50 transition-all shadow-inner group">
                            <Command className="w-4 h-4 text-slate-500 group-hover:text-sky-400 transition-colors" /> <span>Search workspace...</span>
                            <span className="ml-auto text-[10px] border border-slate-700 bg-slate-800/80 text-slate-400 px-2 py-1 rounded-md shadow-sm font-mono">⌘K</span>
                        </button>
                    </div>
                    <div className="flex items-center gap-6">
                        <StreakCounter days={streak.current} />
                        <button onClick={() => setTourOpen(true)} className="w-11 h-11 rounded-2xl bg-slate-800/50 border border-slate-700/50 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 hover:border-slate-600/50 transition-all shadow-sm">
                            <HelpCircle className="w-5 h-5" />
                        </button>
                        <div className="h-8 w-px bg-slate-800" />
                        <div className="flex items-center gap-4 bg-slate-800/30 pl-4 pr-1.5 py-1.5 rounded-full border border-slate-700/50 hover:bg-slate-800/50 cursor-pointer transition-colors">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-bold text-white leading-tight drop-shadow-sm">{firstName || 'Scholar'}</p>
                                <p className="text-[10px] text-sky-400/80 font-mono tracking-wide uppercase">Hardware Eng.</p>
                            </div>
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-sky-400 to-indigo-600 text-white flex items-center justify-center font-bold shadow-lg shadow-sky-900/50 uppercase border border-white/10 ring-2 ring-slate-900">
                                {(firstName || 'S')[0]}
                            </div>
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-10 relative z-10 scrollbar-hide">
                    {/* Grid Pattern */}
                    <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-0" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)', backgroundSize: '40px 40px', backgroundPosition: 'center center' }} />
                    
                    <div className="max-w-6xl mx-auto relative z-10">
                        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                            <div>
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 text-[11px] font-bold text-sky-400 uppercase tracking-widest mb-3">
                                    <div className="w-2 h-2 rounded-full bg-sky-400 animate-pulse shadow-[0_0_8px_rgba(56,189,248,0.8)]" /> Active Curriculum
                                </motion.div>
                                <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-4xl md:text-5xl font-black text-white tracking-tight drop-shadow-lg mb-4">
                                    Learning Matrix
                                </motion.h1>
                                <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-slate-400 text-base max-w-2xl leading-relaxed">
                                    Scale the peaks of hardware design. Master digital logic from simple foundations to complex Verilog architectures and synthesis.
                                </motion.p>
                            </div>
                            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }} className="flex items-center gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-700/50 backdrop-blur-md">
                                <div className="text-center px-4 border-r border-slate-700">
                                    <div className="text-2xl font-black text-white flex items-center justify-center gap-1">
                                       <Zap className="w-5 h-5 text-yellow-400 inline" /> {dynamicModules.reduce((acc, m) => acc + (m.status === 'completed' ? m.hours : 0), 0).toFixed(1)}
                                    </div>
                                    <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mt-1">Hours Logged</div>
                                </div>
                                <div className="text-center px-4">
                                    <div className="text-2xl font-black text-white flex items-center justify-center gap-1">
                                       <Target className="w-5 h-5 text-emerald-400 inline" /> {dynamicModules.filter(m => m.status === 'completed').length}
                                    </div>
                                    <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mt-1">Modules Cleared</div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Map Scroll Area */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-slate-900/40 border border-slate-700/50 rounded-[40px] p-10 shadow-2xl shadow-black/50 backdrop-blur-xl overflow-x-auto relative group">
                            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent pointer-events-none rounded-[40px]" />
                            <div className="absolute -inset-[1px] bg-gradient-to-t from-sky-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 rounded-[40px] pointer-events-none" />
                            
                            <svg width={CW} height={CH} viewBox={`0 0 ${CW} ${CH}`} className="overflow-visible block mx-auto relative z-10">
                                {/* Connection lines */}
                                {CONNECTIONS.map((conn, i) => {
                                    const a = getModule(conn.from), b = getModule(conn.to);
                                    const ra = getR(a), rb = getR(b);
                                    const active = a.status === 'completed' || a.status === 'in-progress';
                                    const color = active ? accentFor(a) : '#334155';
                                    
                                    if (conn.type === 'trunk') {
                                        return (
                                            <React.Fragment key={i}>
                                                <line x1={a.cx + ra} y1={a.cy} x2={b.cx - rb} y2={b.cy} stroke={color} strokeWidth={active ? 3 : 2} strokeLinecap="round" opacity={active ? 0.8 : 0.3} style={{ filter: active ? `drop-shadow(0 0 8px ${color}80)` : 'none' }} />
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
                                                <path d={d} fill="none" stroke={color} strokeWidth={active ? 2.5 : 2} strokeLinecap="round" opacity={active ? 0.6 : 0.2} style={{ filter: active ? `drop-shadow(0 0 6px ${color}60)` : 'none' }} />
                                                {active && <Pulse x1={a.cx} y1={hubBot} x2={b.cx} y2={tgtTop} color={color} />}
                                            </React.Fragment>
                                        );
                                    }
                                    return (
                                        <line key={i} x1={a.cx} y1={a.cy + ra} x2={b.cx} y2={b.cy - rb} stroke={color} strokeWidth={active ? 2 : 1.5} strokeLinecap="round" strokeDasharray="6 6" opacity={active ? 0.5 : 0.2} style={{ filter: active ? `drop-shadow(0 0 4px ${color}40)` : 'none' }} />
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
                        </motion.div>
                    </div>
                </div>
            </main>

            <CommandPalette isOpen={cmdOpen} onClose={() => setCmdOpen(false)} navigate={navigate} tourKey={getTourKey(firstName)} />
            <OnboardingTour isOpen={tourOpen} onClose={() => setTourOpen(false)} storageKey={getTourKey(firstName)} />
        </div>
    );
};
