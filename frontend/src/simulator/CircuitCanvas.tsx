import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Info, Zap, ArrowRight, RotateCcw, Lightbulb, MousePointer2 } from 'lucide-react';
import { cn } from '../lib/utils';

// ═══════════════════════════════════════════════════════════════
// CIRCUIT LAB v4.1 — Interactive Closed-Loop Demonstrator
// ═══════════════════════════════════════════════════════════════

const W = 900;
const H = 600;

const NODES = {
    batPos: { x: 160, y: 300 },
    batNeg: { x: 160, y: 420 },
    tl: { x: 160, y: 80 },
    t1: { x: 300, y: 80 },
    t2: { x: 420, y: 80 },
    swL: { x: 460, y: 80 },
    swR: { x: 560, y: 80 },
    t3: { x: 600, y: 80 },
    tr: { x: 740, y: 80 },
    r1: { x: 740, y: 180 },
    bulbTop: { x: 740, y: 250 },
    bulbBot: { x: 740, y: 330 },
    r2: { x: 740, y: 410 },
    br: { x: 740, y: 500 },
    b1: { x: 600, y: 500 },
    resR: { x: 500, y: 500 },
    resL: { x: 340, y: 500 },
    b2: { x: 280, y: 500 },
    bl: { x: 160, y: 500 },
};

const WIRE_SEGMENTS = [
    [NODES.batPos, NODES.tl, NODES.t1, NODES.t2, NODES.swL],
    [NODES.swR, NODES.t3, NODES.tr, NODES.r1, NODES.bulbTop],
    [NODES.bulbBot, NODES.r2, NODES.br, NODES.b1, NODES.resR],
    [NODES.resL, NODES.b2, NODES.bl, NODES.batNeg],
];

// ─── SVG FILTERS ──────────────────────────────────────────────
const SvgDefs: React.FC = () => (
    <defs>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="b" />
            <feComposite in="SourceGraphic" in2="b" operator="over" />
        </filter>
        <filter id="glowStrong" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="7" result="b" />
            <feComposite in="SourceGraphic" in2="b" operator="over" />
        </filter>
        <filter id="warmGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="b" />
            <feComposite in="SourceGraphic" in2="b" operator="over" />
        </filter>
        <filter id="sparkGlow" x="-80%" y="-80%" width="360%" height="360%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="b" />
            <feComposite in="SourceGraphic" in2="b" operator="over" />
        </filter>
        <radialGradient id="bulbHalo" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.4" />
            <stop offset="50%" stopColor="#0ea5e9" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0" />
        </radialGradient>
        <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
            <path d="M30 0 L0 0 0 30" fill="none" stroke="#e2e8f0" strokeWidth={0.5} />
        </pattern>
        <pattern id="gridMajor" width="120" height="120" patternUnits="userSpaceOnUse">
            <path d="M120 0 L0 0 0 120" fill="none" stroke="#cbd5e1" strokeWidth={0.8} />
        </pattern>
    </defs>
);

// ─── GLOWING WIRE ────────────────────────────────────────────
interface WireProps {
    points: { x: number; y: number }[];
    active: boolean;
    delay?: number;
}

const GlowWire: React.FC<WireProps> = ({ points, active, delay = 0 }) => {
    if (points.length < 2) return null;
    const R = 18;
    let d = `M${points[0].x},${points[0].y}`;
    for (let i = 1; i < points.length - 1; i++) {
        const prev = points[i - 1], cur = points[i], next = points[i + 1];
        const dx1 = cur.x - prev.x, dy1 = cur.y - prev.y;
        const dx2 = next.x - cur.x, dy2 = next.y - cur.y;
        const l1 = Math.hypot(dx1, dy1), l2 = Math.hypot(dx2, dy2);
        if (l1 === 0 || l2 === 0) { d += ` L${cur.x},${cur.y}`; continue; }
        const r = Math.min(R, l1 / 2, l2 / 2);
        const sx = cur.x - (dx1 / l1) * r, sy = cur.y - (dy1 / l1) * r;
        const ex = cur.x + (dx2 / l2) * r, ey = cur.y + (dy2 / l2) * r;
        d += ` L${sx},${sy} Q${cur.x},${cur.y} ${ex},${ey}`;
    }
    d += ` L${points[points.length - 1].x},${points[points.length - 1].y}`;
    const len = points.reduce((a, p, i) =>
        i === 0 ? 0 : a + Math.hypot(p.x - points[i - 1].x, p.y - points[i - 1].y), 0);
    return (
        <g>
            {active && <path d={d} fill="none" stroke="#0ea5e9" strokeWidth={14}
                strokeLinecap="round" strokeLinejoin="round" opacity={0.06} filter="url(#glowStrong)" />}
            {active && <path d={d} fill="none" stroke="#0ea5e9" strokeWidth={7}
                strokeLinecap="round" strokeLinejoin="round" opacity={0.15} filter="url(#glow)" />}
            <path d={d} fill="none" stroke={active ? '#0ea5e9' : '#e2e8f0'}
                strokeWidth={active ? 3 : 2} strokeLinecap="round" strokeLinejoin="round" />
            {active && len > 0 && (
                <path d={d} fill="none" stroke="#38bdf8" strokeWidth={2.5}
                    strokeLinecap="round" opacity={0.8}
                    strokeDasharray={`20 ${len - 20}`} strokeDashoffset={0}>
                    <animate attributeName="stroke-dashoffset"
                        from={len} to={0} dur="1.2s" begin={`${delay}s`} repeatCount="indefinite" />
                </path>
            )}
        </g>
    );
};

// ─── GLOW NODE ──────────────────────────────────────────────
const GlowDot: React.FC<{ x: number; y: number; active: boolean }> = ({ x, y, active }) => (
    <g>
        {active && <>
            <circle cx={x} cy={y} r={12} fill="none" stroke="#0ea5e9"
                strokeWidth={1} opacity={0.15} filter="url(#glow)" />
        </>}
        <circle cx={x} cy={y} r={6} fill={active ? '#0ea5e9' : '#f1f5f9'}
            stroke={active ? '#0ea5e9' : '#e2e8f0'} strokeWidth={2} />
        {active && (
            <circle cx={x} cy={y} r={6} fill="none" stroke="#0ea5e9" strokeWidth={1.5} opacity={0.5}>
                <animate attributeName="r" values="6;12;6" dur="2s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.5;0;0.5" dur="2s" repeatCount="indefinite" />
            </circle>
        )}
    </g>
);

// ─── BATTERY ────────────────────────────────────────────────
const BatteryComp: React.FC<{ x: number; y: number; active: boolean }> = ({ x, y, active }) => (
    <g transform={`translate(${x},${y})`}>
        <rect x={-25} y={-60} width={50} height={120} rx={12}
            fill="white" stroke={active ? '#0ea5e9' : '#e2e8f0'} strokeWidth={3} className="shadow-sm" />
        {[-35, -15, 5, 25].map((dy, i) => (
            <rect key={i} x={-15} y={dy} width={30} height={4} rx={2}
                fill={active ? '#0ea5e9' : '#f1f5f9'} />
        ))}
        <rect x={-8} y={-70} width={16} height={12} rx={4}
            fill={active ? '#0ea5e9' : '#f1f5f9'} stroke={active ? '#0ea5e9' : '#e2e8f0'} strokeWidth={2} />
        <text x={35} y={-40} fontSize={14} fontWeight="black"
            fill={active ? '#0ea5e9' : '#cbd5e1'} fontFamily="sans-serif">+</text>
        <text x={35} y={45} fontSize={16} fontWeight="black"
            fill={active ? '#0ea5e9' : '#cbd5e1'} fontFamily="sans-serif">−</text>
    </g>
);

// ─── BULB ───────────────────────────────────────────────────
const BulbComp: React.FC<{ x: number; y: number; on: boolean }> = ({ x, y, on }) => (
    <g transform={`translate(${x},${y})`}>
        {on && <circle cx={0} cy={-10} r={50} fill="url(#bulbHalo)" />}
        <ellipse cx={0} cy={-10} rx={24} ry={28}
            fill={on ? '#f0f9ff' : 'white'}
            stroke={on ? '#0ea5e9' : '#e2e8f0'} strokeWidth={3} />
        <path d="M -12 -15 Q 0 -25 12 -15 Q 0 -5 -12 -15" 
            fill="none" stroke={on ? '#0ea5e9' : '#cbd5e1'} strokeWidth={2} strokeLinecap="round" />
        <rect x={-14} y={18} width={28} height={16} rx={4}
            fill={on ? '#e0f2fe' : '#f8fafc'} stroke={on ? '#0ea5e9' : '#e2e8f0'} strokeWidth={2} />
    </g>
);

// ─── ANIMATED SWITCH ─────────────────────────────────────────
interface SwitchProps {
    x: number; y: number;
    open: boolean; active: boolean;
    onToggle: () => void;
    showSpark: boolean;
}

const SwitchComp: React.FC<SwitchProps> = ({ x, y, open, active, onToggle, showSpark }) => {
    const armAngle = open ? -35 : 0;

    return (
        <g transform={`translate(${x},${y})`} onClick={onToggle} className="cursor-pointer">
            <rect x={-60} y={-50} width={120} height={70} fill="transparent" />
            <circle cx={-50} cy={0} r={8} fill={active ? '#0ea5e9' : '#f1f5f9'} stroke={active ? '#0ea5e9' : '#e2e8f0'} strokeWidth={2} />
            <circle cx={50} cy={0} r={8} fill={active && !open ? '#0ea5e9' : '#f1f5f9'} stroke={active && !open ? '#0ea5e9' : '#e2e8f0'} strokeWidth={2} />
            
            <g style={{
                transformOrigin: '-50px 0px',
                transform: `rotate(${armAngle}deg)`,
                transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}>
                <line x1={-50} y1={0} x2={50} y2={0}
                    stroke={active && !open ? '#0ea5e9' : '#94a3b8'}
                    strokeWidth={5} strokeLinecap="round" />
            </g>

            {showSpark && (
                <circle cx={50} cy={0} r={15} fill="none" stroke="#38bdf8" strokeWidth={2} className="animate-ping" />
            )}

            <text x={0} y={-30} textAnchor="middle" fontSize={10} fontWeight="black" fill="#94a3b8" className="uppercase tracking-[0.2em]">
                {open ? 'Open' : 'Linked'}
            </text>
        </g>
    );
};

// ─── RESISTOR ───────────────────────────────────────────────
const ResistorComp: React.FC<{ x: number; y: number; active: boolean }> = ({ x, y, active }) => {
    const zig = 'M-60,0 L-45,0 L-37,-10 L-22,10 L-7,-10 L7,10 L22,-10 L37,10 L45,0 L60,0';
    return (
        <g transform={`translate(${x},${y})`}>
            <path d={zig} fill="none" stroke={active ? '#0ea5e9' : '#e2e8f0'}
                strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
        </g>
    );
};

// ─── COMPONENTS PANEL ────────────────────────────────────────
const PanelItem: React.FC<{ label: string; desc: string; icon: React.ReactNode }> = ({ label, desc, icon }) => (
    <div className="flex gap-4 p-4 rounded-2xl bg-white border border-slate-100 shadow-sm">
        <div className="text-sky-600">{icon}</div>
        <div>
            <div className="text-xs font-black text-slate-900 uppercase tracking-wider">{label}</div>
            <div className="text-[10px] text-slate-400 font-medium leading-relaxed mt-1">{desc}</div>
        </div>
    </div>
);

// ═══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════
export const CircuitCanvas: React.FC = () => {
    const navigate = useNavigate();
    const [switchOpen, setSwitchOpen] = useState(true);
    const [showSpark, setShowSpark] = useState(false);
    const closed = !switchOpen;

    const handleToggle = () => {
        if (switchOpen) {
            setShowSpark(true);
            setTimeout(() => setShowSpark(false), 400);
        }
        setSwitchOpen(!switchOpen);
    };

    return (
        <div className="w-full h-full bg-slate-50 flex flex-col items-center justify-center p-8 font-sans relative overflow-hidden">
            {/* Grid */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="canvasGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="black" strokeWidth="1" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#canvasGrid)" />
                </svg>
            </div>

            <div className="max-w-7xl w-full flex gap-12 items-stretch z-10">
                {/* Left: Library */}
                <div className="w-72 flex flex-col gap-6">
                    <div className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-2xl shadow-slate-200/50 flex flex-col gap-6">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 border-b border-slate-100 pb-4">
                            Module Assets
                        </div>
                        <PanelItem label="DC Source" desc="Drives electron flow via EMF." icon={<Zap size={18} />} />
                        <PanelItem label="Resistor" desc="Current limiter / heat dissipator." icon={<RotateCcw size={18} className="rotate-90" />} />
                        <PanelItem label="Incandescent" desc="Electrical to luminous energy." icon={<Lightbulb size={18} />} />
                        <PanelItem label="Toggle" desc="Controls path continuity." icon={<MousePointer2 size={18} />} />
                    </div>

                    <div className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-2xl flex flex-col gap-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-sky-50 text-sky-600 rounded-xl"><Info size={16} /></div>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Protocol</span>
                        </div>
                        <p className="text-sm font-bold text-slate-700 leading-relaxed italic">
                            "{closed ? "Loop established. Signal propagation verified." : "Interrupt detected. Path requires closure to activate."}"
                        </p>
                    </div>
                </div>

                {/* Center: Canvas */}
                <div className="flex-1 flex flex-col gap-8">
                    <div className="flex-1 bg-white rounded-[48px] border border-slate-200 shadow-2xl overflow-hidden relative group">
                        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full p-12">
                            <SvgDefs />
                            <rect width={W} height={H} fill="white" />
                            <rect width={W} height={H} fill="url(#grid)" />
                            <rect width={W} height={H} fill="url(#gridMajor)" />
                            
                            {/* Wires */}
                            {WIRE_SEGMENTS.map((seg, i) => (
                                <GlowWire key={i} points={seg} active={closed} delay={i * 0.15} />
                            ))}

                            {/* Nodes */}
                            {Object.values(NODES).map((n, i) => (
                                <GlowDot key={i} x={n.x} y={n.y} active={closed} />
                            ))}

                            {/* Components */}
                            <BatteryComp x={NODES.batPos.x} y={(NODES.batPos.y + NODES.batNeg.y) / 2} active={closed} />
                            <SwitchComp
                                x={(NODES.swL.x + NODES.swR.x) / 2} y={NODES.swL.y}
                                open={switchOpen} active={closed}
                                onToggle={handleToggle}
                                showSpark={showSpark}
                            />
                            <BulbComp x={NODES.bulbTop.x} y={(NODES.bulbTop.y + NODES.bulbBot.y) / 2} on={closed} />
                            <ResistorComp x={(NODES.resL.x + NODES.resR.x) / 2} y={NODES.resL.y} active={closed} />
                        </svg>

                        {/* Banner */}
                        <div className="absolute top-8 left-1/2 -translate-x-1/2 px-8 py-3 bg-white/90 backdrop-blur-md border border-slate-100 rounded-full shadow-xl flex items-center gap-4">
                            <div className={cn("w-2 h-2 rounded-full", closed ? "bg-emerald-500 shadow-[0_0_8px_#10b981]" : "bg-sky-500 animate-pulse")} />
                            <span className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]">
                                {closed ? "Circuit Synchronized" : "Waiting for contact"}
                            </span>
                        </div>
                    </div>

                    {/* Footer / Completion */}
                    <div className="h-24 bg-white rounded-[32px] border border-slate-200 shadow-xl flex items-center justify-between px-12">
                        <div className="flex items-center gap-8">
                           <div className="flex items-center gap-3">
                                <div className={cn("w-3 h-3 rounded-full", closed ? "bg-emerald-500" : "bg-slate-200")} />
                                <span className={cn("text-xs font-black uppercase tracking-widest", closed ? "text-slate-900" : "text-slate-400")}>Signal Loop</span>
                           </div>
                           <div className="w-px h-6 bg-slate-100" />
                           <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                {closed ? "Electromotive force applied" : "Potential energy stored"}
                           </div>
                        </div>

                        {closed && (
                            <button
                                onClick={() => navigate('/module/1/theory')}
                                className="h-12 px-8 rounded-2xl bg-slate-900 text-white font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all flex items-center gap-2 group"
                            >
                                Continue To Theory <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
