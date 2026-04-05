import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Target, Play } from 'lucide-react';
import { useGamificationStore } from '../stores/gamificationStore';
import { CommandPalette } from '../components/ui/CommandPalette';
import { OnboardingTour } from '../components/ui/OnboardingTour';
import { RadialMenu } from '../components/ui/RadialMenu';
import { CircuitBackground } from '../components/ui/CircuitBackground';

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
    <motion.circle r={3.5} fill="#fff" opacity={0.9}
        initial={{ cx: x1, cy: y1, opacity: 0 }}
        animate={{ cx: [x1, x2], cy: [y1, y2], opacity: [0, 1, 1, 0], scale: [0.8, 1.2, 1.2, 0.8] }}
        transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 1.5, ease: 'easeInOut' }}
        style={{ filter: `drop-shadow(0 0 8px ${color}) drop-shadow(0 0 16px ${color})` }}
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
            animate={{ y: isHovered ? -5 : 0 }}
            transition={{ type: 'spring', damping: 15 }}
        >
            <defs>
                 <linearGradient id={`grad-${mod.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
                     <stop offset="0%" stopColor={locked ? '#1e293b' : done ? '#047857' : '#0369a1'} />
                     <stop offset="100%" stopColor={locked ? '#0f172a' : done ? '#022c22' : '#0c4a6e'} />
                 </linearGradient>
            </defs>

            {/* Ambient Aura */}
            {mod.isHub && !locked && (
                <>
                    <circle cx={mod.cx} cy={mod.cy} r={r + 14} fill="none" stroke={accent} strokeWidth={0.5} opacity={0.2} style={{ filter: 'blur(1px)' }} />
                    <motion.circle cx={mod.cx} cy={mod.cy} r={r + 8} fill="none" stroke={accent} strokeWidth={1}
                        animate={{ opacity: [0.3, 0.1, 0.3] }} transition={{ duration: 3, repeat: Infinity }} style={{ filter: 'blur(1px)' }} />
                </>
            )}
            {done && <circle cx={mod.cx} cy={mod.cy} r={r + 5} fill="none" stroke="#10B981" strokeWidth={1} opacity={0.4} />}
            {inProg && (
                <motion.circle cx={mod.cx} cy={mod.cy} fill="none" stroke="#0EA5E9" strokeWidth={1.5}
                    initial={{ opacity: 0.6, r: r + 2 }} animate={{ opacity: 0, r: r + 16 }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: 'easeOut' }} style={{ filter: 'blur(1px)' }} />
            )}

            {/* 3D Hardware Block Extrusion */}
            <circle cx={mod.cx} cy={mod.cy + 4} r={r} fill="rgba(0,0,0,0.6)" filter="blur(6px)" />
            <circle cx={mod.cx} cy={mod.cy + 2} r={r} fill="#020617" />

            {/* Main Dome Component */}
            <motion.circle cx={mod.cx} cy={mod.cy}
                r={r}
                fill={`url(#grad-${mod.id})`}
                stroke={locked ? '#334155' : accent}
                strokeWidth={mod.isHub ? 2 : locked ? 1 : isHovered ? 2 : 1.5}
                animate={{ r: isHovered ? r * 1.05 : r }}
                transition={{ duration: 0.2 }}
                style={!locked ? { filter: `drop-shadow(0 0 ${isHovered ? 16 : 8}px ${accent}60)` } : undefined}
            />
            {/* Top Glass Glare Bezel */}
            <motion.circle cx={mod.cx} cy={mod.cy} r={r - 1.5} fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth={0.5} animate={{ r: isHovered ? (r * 1.05) - 1.5 : r - 1.5 }} style={{ transformOrigin: `${mod.cx}px ${mod.cy}px`, transform: 'translateY(-0.5px)' }} />

            {/* Progress Arc */}
            {mod.progress > 0 && mod.progress < 100 && (
                <circle cx={mod.cx} cy={mod.cy} r={r - 4} fill="none" stroke={accent} strokeWidth={2.5}
                    strokeDasharray={`${(r - 4) * 2 * Math.PI * mod.progress / 100} 9999`}
                    strokeLinecap="round" transform={`rotate(-90 ${mod.cx} ${mod.cy})`} opacity={0.9} style={{ filter: `drop-shadow(0 0 4px ${accent})` }} />
            )}
            
            {/* Text & Labels */}
            <text x={mod.cx} y={mod.cy + 1} textAnchor="middle" dominantBaseline="middle"
                fill={locked ? '#64748b' : '#FFFFFF'} fontSize={r > 20 ? 10 : 8} fontWeight="800" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
                {done ? '✓' : locked ? '' : `${mod.progress}%`}
            </text>
            
            {!isHovered && (
                <text x={mod.cx} y={mod.cy + r + 22} textAnchor="middle" fill={locked ? '#475569' : '#94A3B8'} fontSize={9} fontWeight="600" letterSpacing="0.05em" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                    {mod.title}
                </text>
            )}
        </motion.g>
    );
};

const CARD_W = 240;
const CARD_H = 150;

const HoverCard: React.FC<{ mod: Module; onStart: (m: Module) => void }> = ({ mod, onStart }) => {
    const r = getR(mod);
    const rawX = mod.cx - CARD_W / 2;
    const rawY = mod.cy - CARD_H - r - 20;
    const x = Math.max(10, Math.min(rawX, CW - CARD_W - 10));
    const y = rawY < 10 ? mod.cy + r + 20 : rawY;

    return (
        <motion.foreignObject x={x} y={y} width={CARD_W} height={CARD_H}
            initial={{ opacity: 0, scale: 0.9, y: 15 }} animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 15 }} 
            transition={{ type: "spring", damping: 15 }}
            className="pointer-events-none"
        >
            <div className="bg-[#0f172a]/80 border border-slate-600/50 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.1)] backdrop-blur-2xl p-4 flex flex-col justify-between h-full group overflow-hidden pointer-events-auto relative">
                {/* Embedded Lighting & Reflections */}
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-400/80 to-transparent" />
                <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/10 rounded-full blur-2xl pointer-events-none" />
                
                <div className="relative z-10">
                   <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase drop-shadow-md">{mod.id}</span>
                        {mod.branch && <span className="text-[9px] px-2 py-0.5 rounded border shadow-[inset_0_1px_4px_rgba(0,0,0,0.5)] font-mono font-bold" style={{ backgroundColor: `${BRANCH_META[mod.branch].color}20`, borderColor: `${BRANCH_META[mod.branch].color}40`, color: BRANCH_META[mod.branch].color }}>{mod.branch}</span>}
                   </div>
                   <h3 className="text-sm font-black text-white leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">{mod.title}</h3>
                   <p className="text-[11px] text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">{mod.subtitle}</p>
                </div>
                
                <div className="flex items-center justify-between pt-3 relative z-10 border-t border-slate-700/60 mt-2">
                    <div className="flex gap-3 text-[10px] text-slate-300 font-medium font-mono drop-shadow-md">
                        <span className="flex items-center gap-1.5"><Target className="w-3.5 h-3.5 text-sky-400" /> {mod.lessons}L</span>
                        <span className="flex items-center gap-1.5"><Play className="w-3.5 h-3.5 text-indigo-400" /> {mod.hours}h</span>
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); onStart(mod); }}
                        className="px-4 py-1.5 bg-gradient-to-t from-sky-600 to-sky-400 hover:from-sky-500 hover:to-sky-300 text-slate-950 rounded-md text-[11px] font-black transition-all flex items-center gap-1.5 shadow-[0_0_15px_rgba(14,165,233,0.4),inset_0_1px_rgba(255,255,255,0.4)] hover:shadow-[0_0_20px_rgba(14,165,233,0.8),inset_0_1px_rgba(255,255,255,0.6)]">
                        <Play className="w-3 h-3 fill-current" /> {mod.progress > 0 ? 'Resume' : 'Start'}
                    </button>
                </div>
            </div>
        </motion.foreignObject>
    );
};

export const WorkstationHome: React.FC = () => {
    const navigate = useNavigate();
    const { firstName, skills, checkStreak } = useGamificationStore();
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
            {/* Ambient Background OS Circuitry */}
            <CircuitBackground />

            {/* Radial Menu Integration */}
            <RadialMenu />

            {/* Top-Right Floating Profile Card */}
            <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8, duration: 0.8, ease: "easeOut" }}
                className="fixed top-8 right-12 z-50 group flex items-center gap-4 p-2 pr-6 rounded-2xl bg-slate-900/40 border border-slate-700/50 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.05)] hover:bg-slate-800/60 transition-all duration-500 cursor-pointer overflow-hidden"
            >
                {/* Holographic Crystal Glow Background */}
                <div className="absolute inset-0 bg-gradient-to-r from-sky-500/10 via-indigo-500/5 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                
                {/* Avatar Container */}
                <div className="relative">
                    <div className="absolute -inset-2 bg-gradient-to-tr from-sky-400 to-indigo-600 rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-700" />
                    <div className="w-14 h-14 rounded-xl overflow-hidden border border-white/10 shadow-2xl relative z-10 bg-slate-950/50">
                        <img 
                            src="/holographic-crystal.png" 
                            alt="Profile Avatar" 
                            className="w-full h-full object-cover transform scale-110 group-hover:scale-125 transition-transform duration-700 ease-out"
                        />
                    </div>
                </div>

                {/* Profile Details */}
                <div className="relative z-10">
                    <h2 className="text-sm font-black text-white tracking-[0.2em] uppercase leading-none mb-1.5 drop-shadow-md">
                        {firstName?.toUpperCase() || 'MADHUR'}
                    </h2>
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse shadow-[0_0_8px_rgba(56,189,248,0.8)]" />
                        <span className="text-[9px] font-bold text-sky-400/80 tracking-[0.15em] uppercase">Hardware Architect</span>
                    </div>
                </div>
            </motion.div>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 bg-transparent relative overflow-hidden">



                <div className="flex-1 overflow-y-auto p-10 relative z-10 scrollbar-hide">
                    
                    <div className="max-w-6xl mx-auto relative z-10">


                        {/* Map Scroll Area */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-slate-900/40 border border-slate-700/50 rounded-[40px] p-10 shadow-[inset_0_4px_10px_rgba(0,0,0,0.5),0_20px_40px_rgba(0,0,0,0.6)] backdrop-blur-xl overflow-x-auto relative group overflow-visible" style={{ perspective: '1600px' }}>
                            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] to-transparent pointer-events-none rounded-[40px]" />
                            <div className="absolute -inset-[1px] bg-gradient-to-t from-sky-500/15 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 rounded-[40px] pointer-events-none" />
                            
                            <motion.svg 
                                width={CW} height={CH} viewBox={`0 0 ${CW} ${CH}`} 
                                className="overflow-visible block mx-auto relative z-10"
                                style={{ transformStyle: 'preserve-3d', rotateX: '12deg', rotateY: '-1deg' }}
                            >
                                {/* Connection lines */}
                                {CONNECTIONS.map((conn, i) => {
                                    const a = getModule(conn.from), b = getModule(conn.to);
                                    const ra = getR(a), rb = getR(b);
                                    const active = a.status === 'completed' || a.status === 'in-progress';
                                    const color = active ? accentFor(a) : '#334155';
                                    
                                    if (conn.type === 'trunk') {
                                        return (
                                            <React.Fragment key={i}>
                                                <line x1={a.cx + ra} y1={a.cy} x2={b.cx - rb} y2={b.cy} stroke="#000" strokeWidth={4} strokeLinecap="round" opacity={0.5} />
                                                <line x1={a.cx + ra} y1={a.cy} x2={b.cx - rb} y2={b.cy} stroke={color} strokeWidth={active ? 3 : 2} strokeLinecap="round" opacity={active ? 0.9 : 0.3} style={{ filter: active ? `drop-shadow(0 0 8px ${color}80)` : 'none' }} />
                                                <line x1={a.cx + ra} y1={a.cy} x2={b.cx - rb} y2={b.cy} stroke={color === '#334155' ? 'none' : '#fff'} strokeWidth={1} strokeLinecap="round" opacity={active ? 0.4 : 0} />
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
                                                <path d={d} fill="none" stroke="#000" strokeWidth={3.5} strokeLinecap="round" opacity={0.5} />
                                                <path d={d} fill="none" stroke={color} strokeWidth={active ? 2.5 : 2} strokeLinecap="round" opacity={active ? 0.8 : 0.2} style={{ filter: active ? `drop-shadow(0 0 6px ${color}80)` : 'none' }} />
                                                <path d={d} fill="none" stroke={color === '#334155' ? 'none' : '#fff'} strokeWidth={0.8} strokeLinecap="round" opacity={active ? 0.4 : 0} />
                                                {active && <Pulse x1={a.cx} y1={hubBot} x2={b.cx} y2={tgtTop} color={color} />}
                                            </React.Fragment>
                                        );
                                    }
                                    return (
                                        <g key={i}>
                                            <line x1={a.cx} y1={a.cy + ra} x2={b.cx} y2={b.cy - rb} stroke="#000" strokeWidth={2.5} strokeDasharray="6 6" strokeLinecap="round" opacity={0.5} />
                                            <line x1={a.cx} y1={a.cy + ra} x2={b.cx} y2={b.cy - rb} stroke={color} strokeWidth={active ? 2 : 1.5} strokeLinecap="round" strokeDasharray="6 6" opacity={active ? 0.8 : 0.2} style={{ filter: active ? `drop-shadow(0 0 6px ${color}80)` : 'none' }} />
                                        </g>
                                    );
                                })}

                                {/* Modules */}
                                {dynamicModules.map(mod => (
                                    <ModuleBubble key={`mod-${mod.id}`} mod={mod} isHovered={hoveredId === mod.id} onHover={setHoveredId} onStart={handleModuleStart} opacity={getNodeOpacity(mod)} />
                                ))}

                                {/* Overlay Hover Card */}
                                <AnimatePresence>
                                    {hoveredId && <HoverCard key="hover-card" mod={getModule(hoveredId)} onStart={handleModuleStart} />}
                                </AnimatePresence>
                            </motion.svg>
                        </motion.div>
                    </div>
                </div>
            </main>

            <CommandPalette isOpen={cmdOpen} onClose={() => setCmdOpen(false)} navigate={navigate} tourKey={getTourKey(firstName)} />
            <OnboardingTour isOpen={tourOpen} onClose={() => setTourOpen(false)} storageKey={getTourKey(firstName)} />
        </div>
    );
};
