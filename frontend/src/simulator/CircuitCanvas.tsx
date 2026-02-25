import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

// ═══════════════════════════════════════════════════════════════
// CIRCUIT LAB v4.0 — Static Glowing Circuit
// Pre-wired layout matching reference exactly.
// Only interactive element: switch toggle.
// ═══════════════════════════════════════════════════════════════

const W = 900;
const H = 600;

// ── Node positions forming the rectangular circuit loop ──
// Going clockwise from battery top (+):
//   Battery+(left) → TL corner → along top → Switch → TR corner
//   → down right side → Bulb → BR corner → along bottom → Resistor
//   → BL corner → up to Battery-(left)

const NODES = {
    // Battery terminals (left side)
    batPos: { x: 160, y: 300 },   // + terminal (top of battery)
    batNeg: { x: 160, y: 420 },   // - terminal (bottom of battery)

    // Top-left corner
    tl: { x: 160, y: 80 },

    // Top row nodes (before/after switch)
    t1: { x: 300, y: 80 },
    t2: { x: 420, y: 80 },    // switch left
    swL: { x: 460, y: 80 },
    swR: { x: 560, y: 80 },
    t3: { x: 600, y: 80 },

    // Top-right corner
    tr: { x: 740, y: 80 },

    // Right column nodes (before/after bulb)
    r1: { x: 740, y: 180 },
    bulbTop: { x: 740, y: 250 },   // bulb top
    bulbBot: { x: 740, y: 330 },   // bulb bottom
    r2: { x: 740, y: 410 },

    // Bottom-right corner
    br: { x: 740, y: 500 },

    // Bottom row nodes (before/after resistor)
    b1: { x: 600, y: 500 },
    resR: { x: 500, y: 500 },   // resistor right
    resL: { x: 340, y: 500 },   // resistor left
    b2: { x: 280, y: 500 },

    // Bottom-left corner
    bl: { x: 160, y: 500 },
};


// Wire segments: groups of points to draw wires between
// (skipping internal component connections)
const WIRE_SEGMENTS = [
    // Battery + → top-left → along top to switch left terminal
    [NODES.batPos, NODES.tl, NODES.t1, NODES.t2, NODES.swL],
    // Switch right terminal → along top to top-right → down to bulb top
    [NODES.swR, NODES.t3, NODES.tr, NODES.r1, NODES.bulbTop],
    // Bulb bottom → down to bottom-right → along bottom to resistor right
    [NODES.bulbBot, NODES.r2, NODES.br, NODES.b1, NODES.resR],
    // Resistor left → along bottom to bottom-left → up to battery -
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
        <radialGradient id="bulbHalo" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFC857" stopOpacity="0.6" />
            <stop offset="50%" stopColor="#FFC857" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#FFC857" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="nodeGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#00BFFF" stopOpacity="1" />
            <stop offset="100%" stopColor="#00BFFF" stopOpacity="0" />
        </radialGradient>
        {/* Grid pattern */}
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

    // Build path with rounded corners
    const R = 18;
    let d = `M${points[0].x},${points[0].y}`;

    for (let i = 1; i < points.length - 1; i++) {
        const prev = points[i - 1];
        const cur = points[i];
        const next = points[i + 1];
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

    const inactiveColor = '#1a3a5c';

    return (
        <g>
            {/* Bloom layer */}
            {active && <path d={d} fill="none" stroke="#00BFFF" strokeWidth={14}
                strokeLinecap="round" strokeLinejoin="round" opacity={0.06} filter="url(#glowStrong)" />}
            {/* Glow layer */}
            {active && <path d={d} fill="none" stroke="#00BFFF" strokeWidth={7}
                strokeLinecap="round" strokeLinejoin="round" opacity={0.15} filter="url(#glow)" />}
            {/* Base wire */}
            <path d={d} fill="none" stroke={active ? '#00BFFF' : inactiveColor}
                strokeWidth={active ? 2.5 : 1.8} strokeLinecap="round" strokeLinejoin="round" />
            {/* Bright core */}
            {active && <path d={d} fill="none" stroke="#80E5FF" strokeWidth={1.2}
                strokeLinecap="round" strokeLinejoin="round" opacity={0.6} />}
            {/* Energy pulse */}
            {active && len > 0 && (
                <path d={d} fill="none" stroke="#FFFFFF" strokeWidth={2}
                    strokeLinecap="round" opacity={0.85}
                    strokeDasharray={`16 ${len - 16}`} strokeDashoffset={0}>
                    <animate attributeName="stroke-dashoffset"
                        from={len} to={0} dur="1.6s" begin={`${delay}s`} repeatCount="indefinite" />
                </path>
            )}
            {/* Secondary pulse */}
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

// ─── GLOW NODE (connection dot) ──────────────────────────────
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

// ─── BATTERY COMPONENT ───────────────────────────────────────
const BatteryComp: React.FC<{ x: number; y: number; active: boolean }> = ({ x, y, active }) => (
    <g transform={`translate(${x},${y})`}>
        {/* Outer casing */}
        <rect x={-20} y={-55} width={40} height={110} rx={5}
            fill="#0B1628" stroke={active ? '#00BFFF' : '#1a3a5c'} strokeWidth={2} />
        {/* Inner */}
        <rect x={-15} y={-50} width={30} height={100} rx={3}
            fill="#070F1E" stroke={active ? '#00BFFF33' : '#122a42'} strokeWidth={1} />
        {/* Cell plates */}
        {[-30, -18, -6, 6, 18, 30].map((dy, i) => (
            <rect key={i} x={-11} y={dy - 2} width={22} height={3} rx={1}
                fill={active ? (i % 2 === 0 ? '#00BFFF' : '#0088BB') : (i % 2 === 0 ? '#2a5a8a' : '#1a3a5c')} />
        ))}
        {/* Terminal nub top (+) */}
        <rect x={-6} y={-63} width={12} height={10} rx={3}
            fill="#0E1E30" stroke={active ? '#00BFFF' : '#1a3a5c'} strokeWidth={1.5} />
        {/* Polarity markers */}
        <text x={26} y={-42} fontSize={13} fontWeight="bold"
            fill={active ? '#00BFFF' : '#3a6a9a'} fontFamily="monospace">+</text>
        <text x={26} y={48} fontSize={15} fontWeight="bold"
            fill={active ? '#00BFFF' : '#3a6a9a'} fontFamily="monospace">−</text>
        {/* Glow outline */}
        {active && <rect x={-22} y={-57} width={44} height={114} rx={7}
            fill="none" stroke="#00BFFF" strokeWidth={1} opacity={0.25} filter="url(#glow)" />}
    </g>
);

// ─── BULB COMPONENT ─────────────────────────────────────────
const BulbComp: React.FC<{ x: number; y: number; on: boolean }> = ({ x, y, on }) => (
    <g transform={`translate(${x},${y})`}>
        {/* Warm halo */}
        {on && <>
            <circle cx={0} cy={-8} r={50} fill="url(#bulbHalo)" opacity={0.6} />
            <circle cx={0} cy={-8} r={34} fill="url(#bulbHalo)" opacity={0.35} />
        </>}
        {/* Glass envelope */}
        <ellipse cx={0} cy={-8} rx={22} ry={26}
            fill={on ? '#FFC85718' : '#0B1C2D'}
            stroke={on ? '#FFC857' : '#1a3a5c'} strokeWidth={2} />
        {/* Inner filament glow */}
        {on && <ellipse cx={0} cy={-8} rx={13} ry={16} fill="#FFC85728" />}
        {/* Filament cross */}
        <line x1={-9} y1={-16} x2={9} y2={4}
            stroke={on ? '#FFD87F' : '#2a5a8a'} strokeWidth={1.5} strokeLinecap="round" />
        <line x1={9} y1={-16} x2={-9} y2={4}
            stroke={on ? '#FFD87F' : '#2a5a8a'} strokeWidth={1.5} strokeLinecap="round" />
        {/* Screw cap */}
        <rect x={-12} y={16} width={24} height={14} rx={3}
            fill="#131E2E" stroke={on ? '#FFC857' : '#1a3a5c'} strokeWidth={1.5} />
        <line x1={-12} y1={21} x2={12} y2={21}
            stroke={on ? '#FFC85770' : '#152a46'} strokeWidth={1} />
        <line x1={-12} y1={26} x2={12} y2={26}
            stroke={on ? '#FFC85770' : '#152a46'} strokeWidth={1} />
        {/* Glow filter */}
        {on && <ellipse cx={0} cy={-8} rx={25} ry={29}
            fill="none" stroke="#FFC857" strokeWidth={1} opacity={0.3} filter="url(#warmGlow)" />}
    </g>
);

// ─── SWITCH COMPONENT ────────────────────────────────────────
const SwitchComp: React.FC<{ x: number; y: number; open: boolean; active: boolean; onToggle: () => void }> =
    ({ x, y, open, active, onToggle }) => (
        <g transform={`translate(${x},${y})`} onClick={onToggle} style={{ cursor: 'pointer' }}>
            {/* Left terminal */}
            <circle cx={-50} cy={0} r={6} fill={active ? '#00BFFF' : '#1a3a5c'}
                stroke={active ? '#00BFFF' : '#2a5a8a'} strokeWidth={2} />
            {/* Right terminal */}
            <circle cx={50} cy={0} r={6} fill={active && !open ? '#00BFFF' : '#1a3a5c'}
                stroke={active && !open ? '#00BFFF' : '#2a5a8a'} strokeWidth={2} />
            {/* Arm */}
            <line x1={-44} y1={0} x2={open ? 30 : 44} y2={open ? -30 : 0}
                stroke={active && !open ? '#00BFFF' : '#8899aa'} strokeWidth={3} strokeLinecap="round"
                style={{ transition: 'all 0.35s cubic-bezier(0.4,0,0.2,1)' }} />
            {/* Pivot */}
            <circle cx={-44} cy={0} r={3.5} fill={active ? '#00BFFF' : '#5a7a9a'} />
            {/* Contact tip */}
            <circle cx={open ? 30 : 44} cy={open ? -30 : 0} r={3.5}
                fill={active && !open ? '#00BFFF' : '#8899aa'}
                style={{ transition: 'all 0.35s cubic-bezier(0.4,0,0.2,1)' }} />
            {/* Glow rings */}
            {active && !open && <>
                <circle cx={-50} cy={0} r={10} fill="none" stroke="#00BFFF" strokeWidth={1} opacity={0.3} />
                <circle cx={50} cy={0} r={10} fill="none" stroke="#00BFFF" strokeWidth={1} opacity={0.3} />
            </>}
        </g>
    );

// ─── RESISTOR COMPONENT ─────────────────────────────────────
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
const LeftPanel: React.FC<{ closed: boolean }> = ({ closed }) => (
    <div style={{
        width: 160, display: 'flex', flexDirection: 'column',
        background: '#0A1628', borderRight: '1px solid #1a3a5c',
        padding: '16px 12px', gap: 4, flexShrink: 0,
    }}>
        <div style={{
            padding: '6px 8px 14px', borderBottom: '1px solid #1a3a5c', marginBottom: 6,
        }}>
            <span style={{
                color: '#8ab8d8', fontSize: 13, fontWeight: 500,
                fontStyle: 'italic', fontFamily: "'Georgia', serif",
            }}>Components</span>
        </div>

        {/* Battery */}
        <PanelItem label="Battery" icon={
            <svg width="20" height="28" viewBox="-10 -14 20 28">
                <rect x={-7} y={-10} width={14} height={20} rx={2} fill="none" stroke="currentColor" strokeWidth={1.5} />
                <rect x={-3} y={-13} width={6} height={4} rx={1} fill="currentColor" />
                <line x1={-4} y1={-3} x2={4} y2={-3} stroke="currentColor" strokeWidth={1} />
                <line x1={-4} y1={3} x2={4} y2={3} stroke="currentColor" strokeWidth={1} />
            </svg>
        } />

        {/* Resistor */}
        <PanelItem label="Resistor" icon={
            <svg width="36" height="14" viewBox="-18 -7 36 14">
                <path d="M-18,0 L-12,0 L-9,-5 L-3,5 L3,-5 L9,5 L12,0 L18,0"
                    fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        } />

        {/* Wire */}
        <PanelItem label="Wire" icon={
            <svg width="36" height="8" viewBox="-18 -4 36 8">
                <line x1={-16} y1={0} x2={16} y2={0} stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
                <circle cx={-16} cy={0} r={2} fill="currentColor" />
                <circle cx={16} cy={0} r={2} fill="currentColor" />
            </svg>
        } />

        <div style={{ flex: 1 }} />

        {/* Status */}
        <div style={{ padding: '10px 0', borderTop: '1px solid #1a3a5c' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{
                    width: 6, height: 6, borderRadius: '50%',
                    background: closed ? '#00FF88' : '#FF4444',
                    boxShadow: `0 0 6px ${closed ? '#00FF88' : '#FF4444'}`,
                }} />
                <span style={{
                    color: closed ? '#00FF88' : '#FF6666', fontSize: 9,
                    fontWeight: 700, letterSpacing: 1, fontFamily: 'monospace',
                    textTransform: 'uppercase',
                }}>{closed ? 'LOOP CLOSED' : 'OPEN CIRCUIT'}</span>
            </div>
        </div>

        {/* Add Wire button */}
        <button style={{
            padding: '8px 0', borderRadius: 6,
            background: '#0E1F32', border: '1px solid #1a3a5c',
            color: '#6a8aa8', fontSize: 12, fontFamily: "'Segoe UI', sans-serif",
            cursor: 'pointer', letterSpacing: 0.5, fontWeight: 500,
        }}>Add Wire</button>
    </div>
);

const PanelItem: React.FC<{ label: string; icon: React.ReactNode }> = ({ label, icon }) => (
    <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '8px 10px', borderRadius: 6,
        background: '#0E1F32', border: '1px solid #14283e',
    }}>
        <div style={{ color: '#00BFFF', display: 'flex', alignItems: 'center' }}>{icon}</div>
        <span style={{ color: '#7a9ab8', fontSize: 12, fontWeight: 500 }}>{label}</span>
    </div>
);

// ═══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════
export const CircuitCanvas: React.FC = () => {
    const navigate = useNavigate();
    const [switchOpen, setSwitchOpen] = useState(true);
    const closed = !switchOpen; // circuit is closed when switch is closed

    // All nodes to render glow dots at
    const allNodes = useMemo(() => Object.values(NODES), []);

    return (
        <div style={{
            display: 'flex', width: '100vw', height: '100vh',
            background: '#060E18', fontFamily: "'Segoe UI', sans-serif",
            overflow: 'hidden',
        }}>
            <LeftPanel closed={closed} />

            <div style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: 20, background: '#060E18',
            }}>
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
                    <SwitchComp x={(NODES.swL.x + NODES.swR.x) / 2} y={NODES.swL.y}
                        open={switchOpen} active={closed}
                        onToggle={() => setSwitchOpen(p => !p)} />
                    <BulbComp x={NODES.bulbTop.x} y={(NODES.bulbTop.y + NODES.bulbBot.y) / 2} on={closed} />
                    <ResistorComp x={(NODES.resL.x + NODES.resR.x) / 2} y={NODES.resL.y} active={closed} />

                    {/* ── COMPLETION OVERLAY ── */}
                    {closed && (
                        <foreignObject x={W / 2 - 160} y={H / 2 - 90} width={320} height={180}>
                            <div style={{
                                width: '100%', height: '100%',
                                background: 'rgba(6, 14, 24, 0.95)',
                                backdropFilter: 'blur(12px)',
                                border: '1px solid #00BFFF',
                                borderRadius: 12,
                                display: 'flex', flexDirection: 'column',
                                alignItems: 'center', justifyContent: 'center',
                                boxShadow: '0 0 40px rgba(0,191,255,0.25), inset 0 0 20px rgba(0,191,255,0.1)',
                                color: 'white', padding: 24, textAlign: 'center',
                                animation: 'fadeIn 0.5s ease-out forwards'
                            }}>
                                <h3 style={{ margin: '0 0 8px 0', fontSize: 24, color: '#00BFFF', fontWeight: 800, letterSpacing: 1 }}>LOOP SECURED</h3>
                                <p style={{ margin: '0 0 24px 0', fontSize: 13, color: '#8ab8d8', letterSpacing: 0.5 }}>Energy has returned to its source.</p>
                                <button
                                    onClick={() => navigate('/module/1/theory')}
                                    style={{
                                        padding: '12px 28px', borderRadius: 8,
                                        background: '#0284c7', color: 'white', border: '1px solid #38bdf8',
                                        fontSize: 13, fontWeight: 'bold', cursor: 'pointer', textTransform: 'uppercase',
                                        letterSpacing: 1, boxShadow: '0 0 15px rgba(2,132,199,0.5)', transition: 'all 0.2s'
                                    }}
                                    onMouseOver={(e) => (e.currentTarget.style.background = '#0369a1')}
                                    onMouseOut={(e) => (e.currentTarget.style.background = '#0284c7')}
                                >
                                    Proceed to Theory
                                </button>
                            </div>
                        </foreignObject>
                    )}

                    {/* ── WATERMARK ── */}
                    <text x={W - 10} y={H - 10} fill="#1a3a5c" fontSize={9}
                        fontFamily="monospace" textAnchor="end" letterSpacing={1}>
                        CIRCUIT LAB v4.0 • {closed ? '⚡ ACTIVE' : '⏻ STANDBY'}
                    </text>
                </svg>
            </div>
        </div>
    );
};
