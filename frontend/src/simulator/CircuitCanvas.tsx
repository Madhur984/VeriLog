import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { BotCompanion } from '../components/Bot/BotCompanion';
import type { BotCompanionRef } from '../components/Bot/BotCompanion';

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
            <stop offset="0%" stopColor="#FFC857" stopOpacity="0.6" />
            <stop offset="50%" stopColor="#FFC857" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#FFC857" stopOpacity="0" />
        </radialGradient>
        <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
            <path d="M30 0 L0 0 0 30" fill="none" stroke="#0E2A42" strokeWidth={0.5} />
        </pattern>
        <pattern id="gridMajor" width="120" height="120" patternUnits="userSpaceOnUse">
            <path d="M120 0 L0 0 0 120" fill="none" stroke="#132E48" strokeWidth={0.8} />
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
            {active && <path d={d} fill="none" stroke="#00BFFF" strokeWidth={14}
                strokeLinecap="round" strokeLinejoin="round" opacity={0.06} filter="url(#glowStrong)" />}
            {active && <path d={d} fill="none" stroke="#00BFFF" strokeWidth={7}
                strokeLinecap="round" strokeLinejoin="round" opacity={0.15} filter="url(#glow)" />}
            <path d={d} fill="none" stroke={active ? '#00BFFF' : '#1a3a5c'}
                strokeWidth={active ? 2.5 : 1.8} strokeLinecap="round" strokeLinejoin="round" />
            {active && <path d={d} fill="none" stroke="#80E5FF" strokeWidth={1.2}
                strokeLinecap="round" strokeLinejoin="round" opacity={0.6} />}
            {active && len > 0 && (
                <path d={d} fill="none" stroke="#FFFFFF" strokeWidth={2}
                    strokeLinecap="round" opacity={0.85}
                    strokeDasharray={`16 ${len - 16}`} strokeDashoffset={0}>
                    <animate attributeName="stroke-dashoffset"
                        from={len} to={0} dur="1.6s" begin={`${delay}s`} repeatCount="indefinite" />
                </path>
            )}
            {active && len > 0 && (
                <path d={d} fill="none" stroke="#00BFFF" strokeWidth={3}
                    strokeLinecap="round" opacity={0.3}
                    strokeDasharray={`10 ${len - 10}`} strokeDashoffset={0}>
                    <animate attributeName="stroke-dashoffset"
                        from={len} to={0} dur="1.6s" begin={`${delay + 0.55}s`} repeatCount="indefinite" />
                </path>
            )}
        </g>
    );
};

// ─── GLOW NODE ──────────────────────────────────────────────
const GlowDot: React.FC<{ x: number; y: number; active: boolean }> = ({ x, y, active }) => (
    <g>
        {active && <>
            <circle cx={x} cy={y} r={12} fill="none" stroke="#00BFFF"
                strokeWidth={1} opacity={0.15} filter="url(#glow)" />
            <circle cx={x} cy={y} r={8} fill="none" stroke="#00BFFF"
                strokeWidth={1} opacity={0.25} />
        </>}
        <circle cx={x} cy={y} r={5} fill={active ? '#00BFFF' : '#0E2240'}
            stroke={active ? '#00BFFF' : '#1a3a5c'} strokeWidth={2} />
        {active && <circle cx={x} cy={y} r={2.5} fill="#FFF" opacity={0.7} />}
        {active && (
            <circle cx={x} cy={y} r={5} fill="none" stroke="#00BFFF" strokeWidth={1.5} opacity={0.5}>
                <animate attributeName="r" values="5;11;5" dur="2.5s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.5;0.05;0.5" dur="2.5s" repeatCount="indefinite" />
            </circle>
        )}
    </g>
);

// ─── BATTERY ────────────────────────────────────────────────
const BatteryComp: React.FC<{ x: number; y: number; active: boolean }> = ({ x, y, active }) => (
    <g transform={`translate(${x},${y})`}>
        <rect x={-20} y={-55} width={40} height={110} rx={5}
            fill="#0B1628" stroke={active ? '#00BFFF' : '#1a3a5c'} strokeWidth={2} />
        <rect x={-15} y={-50} width={30} height={100} rx={3}
            fill="#070F1E" stroke={active ? '#00BFFF33' : '#122a42'} strokeWidth={1} />
        {[-30, -18, -6, 6, 18, 30].map((dy, i) => (
            <rect key={i} x={-11} y={dy - 2} width={22} height={3} rx={1}
                fill={active ? (i % 2 === 0 ? '#00BFFF' : '#0088BB') : (i % 2 === 0 ? '#2a5a8a' : '#1a3a5c')} />
        ))}
        <rect x={-6} y={-63} width={12} height={10} rx={3}
            fill="#0E1E30" stroke={active ? '#00BFFF' : '#1a3a5c'} strokeWidth={1.5} />
        <text x={26} y={-42} fontSize={13} fontWeight="bold"
            fill={active ? '#00BFFF' : '#3a6a9a'} fontFamily="monospace">+</text>
        <text x={26} y={48} fontSize={15} fontWeight="bold"
            fill={active ? '#00BFFF' : '#3a6a9a'} fontFamily="monospace">−</text>
        {active && <rect x={-22} y={-57} width={44} height={114} rx={7}
            fill="none" stroke="#00BFFF" strokeWidth={1} opacity={0.25} filter="url(#glow)" />}
    </g>
);

// ─── BULB ───────────────────────────────────────────────────
const BulbComp: React.FC<{ x: number; y: number; on: boolean }> = ({ x, y, on }) => (
    <g transform={`translate(${x},${y})`}>
        {on && <>
            <circle cx={0} cy={-8} r={50} fill="url(#bulbHalo)" opacity={0.6} />
            <circle cx={0} cy={-8} r={34} fill="url(#bulbHalo)" opacity={0.35} />
        </>}
        <ellipse cx={0} cy={-8} rx={22} ry={26}
            fill={on ? '#FFC85718' : '#0B1C2D'}
            stroke={on ? '#FFC857' : '#1a3a5c'} strokeWidth={2} />
        {on && <ellipse cx={0} cy={-8} rx={13} ry={16} fill="#FFC85728" />}
        <line x1={-9} y1={-16} x2={9} y2={4}
            stroke={on ? '#FFD87F' : '#2a5a8a'} strokeWidth={1.5} strokeLinecap="round" />
        <line x1={9} y1={-16} x2={-9} y2={4}
            stroke={on ? '#FFD87F' : '#2a5a8a'} strokeWidth={1.5} strokeLinecap="round" />
        <rect x={-12} y={16} width={24} height={14} rx={3}
            fill="#131E2E" stroke={on ? '#FFC857' : '#1a3a5c'} strokeWidth={1.5} />
        <line x1={-12} y1={21} x2={12} y2={21} stroke={on ? '#FFC85770' : '#152a46'} strokeWidth={1} />
        <line x1={-12} y1={26} x2={12} y2={26} stroke={on ? '#FFC85770' : '#152a46'} strokeWidth={1} />
        {on && <ellipse cx={0} cy={-8} rx={25} ry={29}
            fill="none" stroke="#FFC857" strokeWidth={1} opacity={0.3} filter="url(#warmGlow)" />}
    </g>
);

// ─── ANIMATED SWITCH ─────────────────────────────────────────
// Smooth arc swing with contact spark on close
interface SwitchProps {
    x: number; y: number;
    open: boolean; active: boolean;
    onToggle: () => void;
    showSpark: boolean;
}

const SwitchComp: React.FC<SwitchProps> = ({ x, y, open, active, onToggle, showSpark }) => {
    // Arm angle: open = angled up (-35°), closed = 0°
    const armAngle = open ? -35 : 0;

    return (
        <g transform={`translate(${x},${y})`} onClick={onToggle} style={{ cursor: 'pointer' }}>
            {/* Hover hit area */}
            <rect x={-60} y={-45} width={120} height={60} fill="transparent" />

            {/* Terminal circles */}
            <circle cx={-50} cy={0} r={6}
                fill={active ? '#00BFFF' : '#1a3a5c'}
                stroke={active ? '#00BFFF' : '#2a5a8a'} strokeWidth={2} />
            <circle cx={50} cy={0} r={6}
                fill={active && !open ? '#00BFFF' : '#1a3a5c'}
                stroke={active && !open ? '#00BFFF' : '#2a5a8a'} strokeWidth={2} />

            {/* Pivot dot */}
            <circle cx={-44} cy={0} r={4} fill={active ? '#00BFFF' : '#5a7a9a'} />

            {/* Arm — CSS transition for smooth swing */}
            <g style={{
                transformOrigin: '-44px 0px',
                transform: `rotate(${armAngle}deg)`,
                transition: 'transform 0.38s cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}>
                <line x1={-44} y1={0} x2={44} y2={0}
                    stroke={active && !open ? '#00BFFF' : '#8899aa'}
                    strokeWidth={3} strokeLinecap="round" />
                {/* Contact tip */}
                <circle cx={44} cy={0} r={4}
                    fill={active && !open ? '#00BFFF' : '#8899aa'} />
            </g>

            {/* Arc contact spark — flashes on close */}
            {showSpark && (
                <g opacity={1}>
                    <circle cx={44} cy={0} r={10} fill="none" stroke="#00FFFF"
                        strokeWidth={2} opacity={0.8} filter="url(#sparkGlow)" />
                    <circle cx={44} cy={0} r={5} fill="#FFFFFF" opacity={0.9} />
                    {/* Spark rays */}
                    {[0, 60, 120, 180, 240, 300].map((a, i) => {
                        const ar = (a * Math.PI) / 180;
                        return (
                            <line key={i}
                                x1={44 + 6 * Math.cos(ar)} y1={6 * Math.sin(ar)}
                                x2={44 + 14 * Math.cos(ar)} y2={14 * Math.sin(ar)}
                                stroke="#00FFFF" strokeWidth={1.5} strokeLinecap="round"
                                opacity={0.9} />
                        );
                    })}
                </g>
            )}

            {/* Glow rings when closed + active */}
            {active && !open && <>
                <circle cx={-50} cy={0} r={10} fill="none" stroke="#00BFFF" strokeWidth={1} opacity={0.3} />
                <circle cx={50} cy={0} r={10} fill="none" stroke="#00BFFF" strokeWidth={1} opacity={0.3} />
            </>}

            {/* OPEN / CLOSED label */}
            <text x={0} y={-22} textAnchor="middle" fontSize={8}
                fontFamily="'Roboto Mono', monospace" fontWeight="600" letterSpacing="0.12em"
                fill={open ? '#3a6a9a' : '#00BFFF'} opacity={open ? 0.5 : 0.85}>
                {open ? 'OPEN' : 'CLOSED'}
            </text>
        </g>
    );
};

// ─── RESISTOR ───────────────────────────────────────────────
const ResistorComp: React.FC<{ x: number; y: number; active: boolean }> = ({ x, y, active }) => {
    const zig = 'M-80,0 L-60,0 L-48,-12 L-32,12 L-16,-12 L0,12 L16,-12 L32,12 L48,-12 L60,0 L80,0';
    return (
        <g transform={`translate(${x},${y})`}>
            {active && <path d={zig} fill="none" stroke="#00BFFF" strokeWidth={7}
                strokeLinecap="round" strokeLinejoin="round" opacity={0.12} filter="url(#glow)" />}
            <path d={zig} fill="none" stroke={active ? '#00BFFF' : '#3a5a7a'}
                strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
            {active && <path d={zig} fill="none" stroke="#80E5FF" strokeWidth={1}
                strokeLinecap="round" strokeLinejoin="round" opacity={0.5} />}
        </g>
    );
};

// ─── LEFT PANEL ──────────────────────────────────────────────
const PanelItem: React.FC<{ label: string; desc: string; icon: React.ReactNode }> = ({ label, desc, icon }) => (
    <div style={{
        display: 'flex', alignItems: 'flex-start', gap: 10,
        padding: '9px 10px', borderRadius: 6,
        background: '#0E1F32', border: '1px solid #14283e',
        cursor: 'default',
    }}>
        <div style={{ color: '#00BFFF', display: 'flex', alignItems: 'center', paddingTop: 2 }}>{icon}</div>
        <div>
            <div style={{ color: '#c0d8f0', fontSize: 11, fontWeight: 600, letterSpacing: 0.3 }}>{label}</div>
            <div style={{ color: '#3a6080', fontSize: 10, marginTop: 2, lineHeight: 1.4 }}>{desc}</div>
        </div>
    </div>
);

const LeftPanel: React.FC<{ closed: boolean }> = ({ closed }) => (
    <div style={{
        width: 180, display: 'flex', flexDirection: 'column',
        background: '#0A1628', borderRight: '1px solid #1a3a5c',
        padding: '18px 12px', gap: 8, flexShrink: 0,
    }}>
        <div style={{ paddingBottom: 12, borderBottom: '1px solid #1a3a5c', marginBottom: 4 }}>
            <div style={{ color: '#4a8ab0', fontSize: 9, fontWeight: 700, letterSpacing: '0.15em', fontFamily: 'monospace', textTransform: 'uppercase' }}>
                Component Reference
            </div>
        </div>

        <PanelItem label="DC Source" desc="Electromotive force. Drives current from − to + internally." icon={
            <svg width="20" height="28" viewBox="-10 -14 20 28">
                <rect x={-7} y={-10} width={14} height={20} rx={2} fill="none" stroke="currentColor" strokeWidth={1.5} />
                <rect x={-3} y={-13} width={6} height={4} rx={1} fill="currentColor" />
                <line x1={-4} y1={-3} x2={4} y2={-3} stroke="currentColor" strokeWidth={1} />
                <line x1={-4} y1={3} x2={4} y2={3} stroke="currentColor" strokeWidth={1} />
            </svg>
        } />

        <PanelItem label="Resistor" desc="Limits current. Dissipates energy as heat." icon={
            <svg width="36" height="14" viewBox="-18 -7 36 14">
                <path d="M-18,0 L-12,0 L-9,-5 L-3,5 L3,-5 L9,5 L12,0 L18,0"
                    fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        } />

        <PanelItem label="Incandescent" desc="Converts electrical energy to light via filament resistance." icon={
            <svg width="18" height="26" viewBox="-9 -18 18 26">
                <ellipse cx={0} cy={-6} rx={8} ry={10} fill="none" stroke="currentColor" strokeWidth={1.5} />
                <line x1={-4} y1={-10} x2={4} y2={-2} stroke="currentColor" strokeWidth={1} />
                <line x1={4} y1={-10} x2={-4} y2={-2} stroke="currentColor" strokeWidth={1} />
                <rect x={-5} y={4} width={10} height={5} rx={1} fill="none" stroke="currentColor" strokeWidth={1} />
            </svg>
        } />

        <PanelItem label="Switch" desc="Breaks or completes the conduction path. Controls loop continuity." icon={
            <svg width="36" height="16" viewBox="-18 -8 36 16">
                <circle cx={-14} cy={0} r={3} fill="currentColor" stroke="currentColor" />
                <circle cx={14} cy={0} r={3} fill="currentColor" stroke="currentColor" />
                <line x1={-11} y1={0} x2={10} y2={-7} stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" />
            </svg>
        } />

        <div style={{ flex: 1 }} />

        {/* Objective */}
        <div style={{ padding: '10px 0 6px', borderTop: '1px solid #1a3a5c' }}>
            <div style={{ color: '#3a6080', fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', fontFamily: 'monospace', marginBottom: 6 }}>
                OBJECTIVE
            </div>
            <div style={{ color: '#5a8aaa', fontSize: 10, lineHeight: 1.5 }}>
                Close the switch to complete the loop. Observe how energy flows back to its source.
            </div>
        </div>

        {/* Status indicator */}
        <div style={{ padding: '8px 10px', borderRadius: 6, background: '#0E1F32', border: `1px solid ${closed ? '#00ff8833' : '#ff444433'}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{
                    width: 6, height: 6, borderRadius: '50%',
                    background: closed ? '#00FF88' : '#FF4444',
                    boxShadow: `0 0 8px ${closed ? '#00FF88' : '#FF4444'}`,
                }} />
                <span style={{
                    color: closed ? '#00FF88' : '#FF6666', fontSize: 9,
                    fontWeight: 700, letterSpacing: 1, fontFamily: 'monospace',
                }}>{closed ? 'LOOP CLOSED' : 'OPEN CIRCUIT'}</span>
            </div>
            <div style={{ color: '#2a5070', fontSize: 9, marginTop: 4, lineHeight: 1.4, fontFamily: 'monospace' }}>
                {closed ? 'Conduction path established. Current active.' : 'No conduction path. Zero current flow.'}
            </div>
        </div>
    </div>
);

// ─── INSTRUCTION BANNER ─────────────────────────────────────
const InstructionBanner: React.FC<{ closed: boolean }> = ({ closed }) => (
    <div style={{
        position: 'absolute', top: 12, left: '50%', transform: 'translateX(-50%)',
        background: 'rgba(6,14,24,0.92)', border: `1px solid ${closed ? '#00BFFF44' : '#1a3a5c'}`,
        borderRadius: 8, padding: '7px 20px',
        display: 'flex', alignItems: 'center', gap: 10,
        backdropFilter: 'blur(8px)',
        transition: 'border-color 0.4s ease',
        whiteSpace: 'nowrap',
        zIndex: 10,
    }}>
        <div style={{
            width: 6, height: 6, borderRadius: '50%',
            background: closed ? '#00FF88' : '#FF8800',
            boxShadow: `0 0 6px ${closed ? '#00FF88' : '#FF8800'}`,
        }} />
        <span style={{
            fontFamily: "'Roboto Mono', monospace", fontSize: 10,
            fontWeight: 600, letterSpacing: '0.1em',
            color: closed ? '#80E5FF' : '#6a9ab8',
        }}>
            {closed
                ? 'LOOP ESTABLISHED — Energy returning to source  ⚡'
                : 'SWITCH OPEN — Click the switch arm to close the circuit'}
        </span>
    </div>
);

// ═══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════
export const CircuitCanvas: React.FC = () => {
    const navigate = useNavigate();
    const [switchOpen, setSwitchOpen] = useState(true);
    const [showSpark, setShowSpark] = useState(false);
    const sparkTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const companionRef = useRef<BotCompanionRef | null>(null);
    const closed = !switchOpen;

    const allNodes = useMemo(() => Object.values(NODES), []);

    const handleToggle = () => {
        setSwitchOpen(prev => {
            const nextOpen = !prev;
            if (!nextOpen) {
                // closing switch → loop complete
                if (sparkTimer.current) clearTimeout(sparkTimer.current);
                setShowSpark(true);
                sparkTimer.current = setTimeout(() => setShowSpark(false), 320);
                companionRef.current?.dispatch('loop_complete');
            } else {
                // opening switch → open circuit
                companionRef.current?.dispatch('open_circuit');
            }
            return nextOpen;
        });
    };

    useEffect(() => () => { if (sparkTimer.current) clearTimeout(sparkTimer.current); }, []);

    return (
        <div style={{
            display: 'flex', width: '100vw', height: '100vh',
            background: '#060E18', fontFamily: "'Roboto Mono', 'Segoe UI', sans-serif",
            overflow: 'hidden',
        }}>
            <LeftPanel closed={closed} />

            <div style={{
                flex: 1, display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                padding: 20, background: '#060E18', position: 'relative',
            }}>
                <InstructionBanner closed={closed} />

                <svg
                    viewBox={`0 0 ${W} ${H}`}
                    style={{
                        width: '100%', maxWidth: W, height: 'auto', maxHeight: '100%',
                        borderRadius: 10,
                        border: '1px solid #1a3a5c',
                        boxShadow: '0 0 60px rgba(0,191,255,0.04), inset 0 0 80px rgba(0,0,0,0.3)',
                    }}
                >
                    <SvgDefs />

                    {/* Background */}
                    <rect width={W} height={H} fill="#0B1C2D" />
                    <rect width={W} height={H} fill="url(#grid)" />
                    <rect width={W} height={H} fill="url(#gridMajor)" />
                    <rect width={W} height={H} fill="none" stroke="#06121E" strokeWidth={6} />

                    {/* ── WIRES ── */}
                    {WIRE_SEGMENTS.map((seg, i) => (
                        <GlowWire key={i} points={seg} active={closed} delay={i * 0.15} />
                    ))}

                    {/* ── CONNECTION NODES ── */}
                    {allNodes.map((n, i) => (
                        <GlowDot key={i} x={n.x} y={n.y} active={closed} />
                    ))}

                    {/* ── COMPONENTS ── */}
                    <BatteryComp x={NODES.batPos.x} y={(NODES.batPos.y + NODES.batNeg.y) / 2} active={closed} />
                    <SwitchComp
                        x={(NODES.swL.x + NODES.swR.x) / 2} y={NODES.swL.y}
                        open={switchOpen} active={closed}
                        onToggle={handleToggle}
                        showSpark={showSpark}
                    />
                    <BulbComp x={NODES.bulbTop.x} y={(NODES.bulbTop.y + NODES.bulbBot.y) / 2} on={closed} />
                    <ResistorComp x={(NODES.resL.x + NODES.resR.x) / 2} y={NODES.resL.y} active={closed} />

                    {/* ── COMPONENT LABELS ── */}
                    <text x={NODES.batPos.x - 40} y={(NODES.batPos.y + NODES.batNeg.y) / 2 + 75}
                        textAnchor="middle" fontSize={9} fontFamily="'Roboto Mono',monospace"
                        fill="#2a5a7a" letterSpacing="0.08em">DC SOURCE</text>
                    <text x={(NODES.swL.x + NODES.swR.x) / 2} y={NODES.swL.y + 30}
                        textAnchor="middle" fontSize={9} fontFamily="'Roboto Mono',monospace"
                        fill="#2a5a7a" letterSpacing="0.08em">SWITCH S1</text>
                    <text x={NODES.bulbTop.x + 36} y={(NODES.bulbTop.y + NODES.bulbBot.y) / 2}
                        fontSize={9} fontFamily="'Roboto Mono',monospace"
                        fill="#2a5a7a" letterSpacing="0.08em">LAMP L1</text>
                    <text x={(NODES.resL.x + NODES.resR.x) / 2} y={NODES.resL.y + 28}
                        textAnchor="middle" fontSize={9} fontFamily="'Roboto Mono',monospace"
                        fill="#2a5a7a" letterSpacing="0.08em">R1  470Ω</text>

                    {/* ── COMPLETION OVERLAY ── */}
                    {closed && (
                        <foreignObject x={W / 2 - 160} y={H / 2 - 80} width={320} height={160}>
                            <div style={{
                                width: '100%', height: '100%',
                                background: '#0d1520',
                                border: '1px solid #2a3f54',
                                borderRadius: 8,
                                display: 'flex', flexDirection: 'column',
                                alignItems: 'center', justifyContent: 'center',
                                color: '#c8d8e8', padding: '24px 28px', textAlign: 'center', gap: 0,
                            }}>
                                <p style={{ margin: '0 0 6px', fontSize: 13, fontWeight: 600, color: '#dce8f0', letterSpacing: 0.2 }}>
                                    Loop closed.
                                </p>
                                <p style={{ margin: '0 0 20px', fontSize: 11, color: '#4a6a84', lineHeight: 1.6 }}>
                                    A signal must be in a closed loop to work.
                                </p>
                                <button
                                    onClick={() => navigate('/module/1/theory')}
                                    style={{
                                        padding: '8px 22px', borderRadius: 6,
                                        background: '#162233', color: '#7aaac8',
                                        border: '1px solid #2a3f54',
                                        fontSize: 11, fontWeight: 500, cursor: 'pointer',
                                        letterSpacing: '0.04em',
                                    }}
                                    onMouseOver={e => { e.currentTarget.style.background = '#1e2e42'; }}
                                    onMouseOut={e => { e.currentTarget.style.background = '#162233'; }}
                                >
                                    Continue to Theory
                                </button>
                            </div>
                        </foreignObject>
                    )}

                    {/* ── WATERMARK ── */}
                    <text x={W - 10} y={H - 10} fill="#1a3a5c" fontSize={9}
                        fontFamily="monospace" textAnchor="end" letterSpacing={1}>
                        CIRCUIT LAB v4.1 • {closed ? '⚡ CONDUCTING' : '○ NO CURRENT'}
                    </text>
                </svg>
                {/* ── BOT COMPANION ── */}
                <BotCompanion size="md" companionRef={companionRef} layout="fixed" />
            </div>
        </div>
    );
};
