/**
 * SocketSystem.tsx — Enterprise Circuit Lab
 *
 * Features:
 *   - IEC electrical symbols (battery, resistive load, lamp)
 *   - Etched SVG dot-grid reference background
 *   - Three toggleable overlays: voltage labels, current arrows, loop highlight
 *   - Short circuit state: controlled red ramp + VoltMonkey diagnostic alert
 *   - Magnetic proximity glow via CSS var (RAF, no React state)
 *   - Electron flow animation (stroke-dashoffset, velocity ∝ current)
 *   - Procedural Web Audio snap sound
 *   - Micro-spark particles on snap
 *   - prefers-reduced-motion safe
 */

import { useEffect, useRef, useState, useCallback, memo } from 'react';
import { useMagneticDrag } from '../../hooks/useMagneticDrag';
import './level1.css';

interface SocketSystemProps {
    onComplete: () => void;
    isDark?: boolean;
    diagnosticsMode?: boolean;
}

// ── SVG Layout Constants ──────────────────────────────────────────────────────
const W = 640;
const H = 340;
const LOOP_TOP = 80;
const LOOP_BOT = 260;
const LOOP_LFT = 100;
const LOOP_RGT = 540;
const RX = 20; // Corner radius

const SRC_X = LOOP_LFT;
const SRC_Y = 170;
const LOAD_X = LOOP_RGT;
const LOAD_Y = 170;

const SA_X = 220; // Source output socket (wire start)
const SB_X = 420; // Load input socket (drop target)

// ── IEC Symbol: Battery ───────────────────────────────────────────────────────
const BatterySymbol = memo(({ x, y, color }: { x: number; y: number; color: string }) => (
    <g transform={`translate(${x},${y})`} aria-label="DC Power Supply">
        {/* Top (Positive): Wide, thin line */}
        <line x1="-16" y1="-6" x2="16" y2="-6" stroke={color} strokeWidth="2" />
        {/* Bottom (Negative): Narrow, thick line */}
        <line x1="-10" y1="6" x2="10" y2="6" stroke={color} strokeWidth="4" />
        {/* Terminal stubs to connect to wires */}
        <line x1="0" y1="-6" x2="0" y2="-24" stroke={color} strokeWidth="1.8" />
        <line x1="0" y1="6" x2="0" y2="24" stroke={color} strokeWidth="1.8" />
        <circle cx="0" cy="-24" r="2.5" fill={color} />
        <circle cx="0" cy="24" r="2.5" fill={color} />

        {/* Labels */}
        <text x="-24" y="-2" textAnchor="end" fontSize="12" fill={color} fontFamily="IBM Plex Mono, monospace" fontWeight="500" opacity="0.8">+</text>
        <text x="-24" y="12" textAnchor="end" fontSize="14" fill={color} fontFamily="IBM Plex Mono, monospace" fontWeight="600" opacity="0.8">−</text>
        <text x="32" y="3" textAnchor="start" fontSize="9" fill={color} fontFamily="IBM Plex Mono, monospace" letterSpacing="0.1em" opacity="0.6">12V DC</text>
    </g>
));
BatterySymbol.displayName = 'BatterySymbol';

// ── IEC Symbol: Resistive Load (lamp / actuator) ─────────────────────
const LampSymbol = memo(({ x, y, color, active }: { x: number; y: number; color: string; active: boolean }) => (
    <g transform={`translate(${x},${y})`} aria-label="Resistive load">
        <circle r="18" stroke={color} strokeWidth="1.8" fill={active ? 'rgba(16, 185, 129, 0.05)' : 'none'} style={{ transition: 'all 0.4s ease-out' }} />
        <line x1="-12.7" y1="-12.7" x2="12.7" y2="12.7" stroke={color} strokeWidth="1.8" style={{ transition: 'stroke 0.4s' }} />
        <line x1="12.7" y1="-12.7" x2="-12.7" y2="12.7" stroke={color} strokeWidth="1.8" style={{ transition: 'stroke 0.4s' }} />

        {/* Active focal glow: smooth ramp up, calm engineered feel */}
        <circle r="8" fill="#10B981" className={active ? 'vl-led--on' : 'vl-led--off'} />

        {/* Stubs */}
        <line x1="0" y1="-18" x2="0" y2="-24" stroke={color} strokeWidth="1.8" />
        <line x1="0" y1="18" x2="0" y2="24" stroke={color} strokeWidth="1.8" />
        <circle cx="0" cy="-24" r="2.5" fill={color} />
        <circle cx="0" cy="24" r="2.5" fill={color} />

        <text x="28" y="3" textAnchor="start" fontSize="9" fill={color} fontFamily="IBM Plex Mono, monospace" letterSpacing="0.1em" opacity="0.6">R_LOAD</text>
    </g>
));
LampSymbol.displayName = 'LampSymbol';

// ── Spark Burst ───────────────────────────────────────────────────────────────
const MicroSpark = memo(({ x, y }: { x: number; y: number }) => (
    <g transform={`translate(${x},${y})`} aria-hidden="true">
        {[1, 2, 3, 4].map(i => (
            <circle key={i} className="vl-spark" r="2" fill="#00D4FF" />
        ))}
    </g>
));
MicroSpark.displayName = 'MicroSpark';

// ── Main Component ────────────────────────────────────────────────────────────
export const SocketSystem = memo(({ onComplete, isDark = true, diagnosticsMode = false }: SocketSystemProps) => {
    const [snapped, setSnapped] = useState(false);
    const [shortCircuit] = useState(false);
    const [showSpark, setShowSpark] = useState(false);
    const [scanning, setScanning] = useState(false);

    // Overlay toggles: [voltage, current arrows, loop highlight]
    const [overlays, setOverlays] = useState([false, false, false]);
    const toggleOverlay = useCallback((i: number) => {
        setOverlays(prev => { const n = [...prev]; n[i] = !n[i]; return n; });
    }, []);

    const socketBRef = useRef<SVGCircleElement | null>(null);
    const wireEndRef = useRef<SVGCircleElement | null>(null);
    const wireLineRef = useRef<SVGLineElement | null>(null);
    const svgRef = useRef<SVGSVGElement | null>(null);

    const handleScan = useCallback(() => {
        if (!snapped || scanning) return;
        setScanning(true);
        setTimeout(() => setScanning(false), 1600);
    }, [snapped, scanning]);

    const handleSnap = useCallback((_id: string) => {
        setSnapped(true);
        setShowSpark(true);
        if (wireLineRef.current) {
            wireLineRef.current.setAttribute('x2', String(SB_X - 16));
        }
        setTimeout(() => setShowSpark(false), 250);
        setTimeout(onComplete, 700);
    }, [onComplete]);

    const { attachDraggable, registerSocket } = useMagneticDrag({
        svgRef,
        onDrag: (x, y) => {
            if (wireEndRef.current) {
                wireEndRef.current.setAttribute('transform', `translate(${x},${y})`);
            }
            if (wireLineRef.current) {
                wireLineRef.current.setAttribute('x2', String(x - 14)); // Handle offset
                wireLineRef.current.setAttribute('y2', String(y));
            }
        },
        onSnap: handleSnap,
        onRelease: () => {
            if (wireEndRef.current) {
                wireEndRef.current.setAttribute('transform', `translate(${SA_X + 34},${LOOP_TOP})`);
            }
            if (wireLineRef.current) {
                wireLineRef.current.setAttribute('x2', String(SA_X + 34));
                wireLineRef.current.setAttribute('y2', String(LOOP_TOP));
            }
        }
    });

    useEffect(() => {
        if (!socketBRef.current) return;
        registerSocket({ id: 'sock-b', el: socketBRef.current, snapRadius: 48 });
    }, [registerSocket]);

    useEffect(() => {
        if (!wireEndRef.current || snapped) return;
        attachDraggable(wireEndRef.current as unknown as HTMLElement);
    }, [attachDraggable, snapped]);

    const colors = {
        bg: 'transparent',
        grid: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.03)',
        border: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.08)',
        source: '#64748B',
        load: snapped ? '#00D4FF' : '#64748B',
        wire: snapped ? '#00D4FF' : '#475569',
        socket: '#0D0F16',
        accent: '#00D4FF',
        text: isDark ? '#E5E7EB' : '#0D0F16',
    };

    return (
        <div style={{
            width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24,
            transition: 'opacity 0.4s', opacity: shortCircuit ? 0.95 : 1 // 5% dim on short circuit
        }}>

            {/* ── Status Banner ─────────────────────────────────────────── */}
            <div style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '5px 14px', borderRadius: 2,
                border: `1px solid ${shortCircuit ? 'rgba(239,68,68,0.3)' : snapped ? 'rgba(16,185,129,0.3)' : 'rgba(0,212,255,0.12)'}`,
                background: shortCircuit ? 'rgba(239,68,68,0.04)' : snapped ? 'rgba(16,185,129,0.04)' : 'rgba(0,212,255,0.03)',
                transition: 'border-color 0.4s, background 0.4s',
            }}>
                <span style={{
                    width: 5, height: 5, borderRadius: '50%', flexShrink: 0,
                    background: shortCircuit ? '#EF4444' : snapped ? colors.accent : colors.load,
                    boxShadow: `0 0 6px ${shortCircuit ? 'rgba(239,68,68,0.7)' : snapped ? 'rgba(0,212,255,0.5)' : 'transparent'}`,
                    transition: 'background 0.4s',
                }} />
                <span style={{
                    fontFamily: "'IBM Plex Mono', 'Roboto Mono', monospace",
                    fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase',
                    color: shortCircuit ? '#EF4444' : snapped ? colors.accent : colors.load,
                    transition: 'color 0.4s',
                }}>
                    {shortCircuit
                        ? 'FAULT — SHORT CIRCUIT DETECTED'
                        : snapped
                            ? 'LOOP INTEGRITY VERIFIED'
                            : 'CONNECT PATH TO CLOSE CIRCUIT'}
                </span>
            </div>

            {/* ── Overlay Toggle Bar & Current Meter ──────────────────────── */}
            <div style={{ display: 'flex', width: '100%', maxWidth: 600, justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div style={{ display: 'flex', gap: 8 }}>
                    {[
                        { label: 'V', title: 'Voltage labels' },
                        { label: '→', title: 'Current direction' },
                        { label: '∮', title: 'Loop highlight' },
                    ].map((o, i) => (
                        <button
                            key={i}
                            title={o.title}
                            onClick={() => toggleOverlay(i)}
                            style={{
                                padding: '4px 12px',
                                fontFamily: "'IBM Plex Mono', monospace",
                                fontSize: 11, letterSpacing: '0.1em',
                                border: `1px solid ${overlays[i] ? colors.accent : 'rgba(255,255,255,0.1)'}`,
                                borderRadius: 3,
                                background: overlays[i] ? 'rgba(0,212,255,0.1)' : 'transparent',
                                color: overlays[i] ? colors.accent : colors.text,
                                cursor: 'pointer', transition: 'all 0.18s',
                            }}
                        >
                            {o.label}
                        </button>
                    ))}
                    <button
                        title="Scan circuit integrity"
                        onClick={handleScan}
                        disabled={!snapped || scanning}
                        style={{
                            padding: '4px 12px', marginLeft: 8,
                            fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, letterSpacing: '0.1em',
                            border: `1px solid ${scanning ? colors.accent : 'rgba(255,255,255,0.1)'}`,
                            borderRadius: 3,
                            background: scanning ? 'rgba(0,212,255,0.1)' : 'transparent',
                            color: scanning ? colors.accent : (snapped ? colors.text : 'rgba(255,255,255,0.2)'),
                            cursor: snapped && !scanning ? 'pointer' : 'default', transition: 'all 0.18s',
                        }}
                    >
                        SCAN INTEGRITY
                    </button>
                </div>

                {/* Simulated Current Meter */}
                <div style={{
                    fontFamily: "'IBM Plex Mono', monospace", fontSize: 14,
                    color: shortCircuit ? '#EF4444' : snapped ? colors.accent : colors.text,
                    background: 'rgba(0,0,0,0.3)', padding: '4px 8px', borderRadius: 3, border: '1px solid rgba(255,255,255,0.05)',
                    transition: 'color 0.4s'
                }}>
                    <span style={{ opacity: 0.5, fontSize: 11, marginRight: 6 }}>I=</span>
                    {shortCircuit ? 'ERR' : snapped ? '0.15A' : '0.00A'}
                </div>
            </div>

            {/* ── SVG Circuit ───────────────────────────────────────────── */}
            <div style={{
                position: 'relative', width: '100%', maxWidth: 600,
                boxShadow: '0 20px 40px -10px rgba(0,0,0,0.8), inset 0 0 0 1px rgba(255,255,255,0.05)',
                borderRadius: 8, overflow: 'hidden',
                background: `radial-gradient(circle at 50% 50%, #151E32 0%, ${colors.bg} 100%)`
            }}>
                {/* ── Initial Micro Guidance ──────────────────────────── */}
                {!snapped && !shortCircuit && (
                    <div style={{
                        position: 'absolute', top: 50, left: '50%', transform: 'translateX(-50%)',
                        background: 'rgba(0,212,255,0.15)', border: '1px solid rgba(0,212,255,0.3)',
                        padding: '6px 12px', borderRadius: 4, backdropFilter: 'blur(4px)',
                        fontFamily: "'Inter', sans-serif", fontSize: 13, color: colors.accent,
                        pointerEvents: 'none', animation: 'socket-breathe 2s infinite'
                    }}>
                        Drag from terminal to complete loop
                    </div>
                )}

                <svg
                    ref={svgRef}
                    viewBox={`0 0 ${W} ${H}`}
                    width="100%"
                    style={{ display: 'block', overflow: 'visible', contain: 'layout paint' }}
                    role="img"
                    aria-label="Interactive circuit diagram. Drag the wire endpoint to the load socket to close the circuit."
                >
                    <defs>
                        {/* Etched dot grid */}
                        <pattern id="dot-grid" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
                            <circle cx="12" cy="12" r="0.8" fill={colors.grid} />
                        </pattern>

                        {/* Proximity glow filter */}
                        <filter id="glow-soft">
                            <feGaussianBlur stdDeviation="3" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>

                        {/* Subtle calm flow gradient pattern */}
                        <linearGradient id="live-wire" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#00D4FF" stopOpacity="0.4" />
                            <stop offset="50%" stopColor="#00D4FF" stopOpacity="1" />
                            <stop offset="100%" stopColor="#00D4FF" stopOpacity="0.4" />
                        </linearGradient>

                        {/* Loop highlight */}
                        <filter id="loop-glow">
                            <feGaussianBlur stdDeviation="8" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                    </defs>

                    {/* ── Background & Watermarks ─────────────────────────────────── */}
                    <rect x="0" y="0" width={W} height={H} fill="url(#dot-grid)" />
                    <text x={W / 2} y={H / 2 + 12} textAnchor="middle" fontSize="120" fill="rgba(255,255,255,0.01)" fontFamily="IBM Plex Mono, monospace" fontWeight="700">LOOP 01</text>

                    {/* ── Background Trace (Inactive Path) ────────────────────────── */}
                    {/* Source to SA */}
                    <path
                        d={`M ${LOOP_LFT},${SRC_Y - 24} L ${LOOP_LFT},${LOOP_TOP + RX} Q ${LOOP_LFT},${LOOP_TOP} ${LOOP_LFT + RX},${LOOP_TOP} L ${SA_X},${LOOP_TOP}`}
                        stroke={colors.border} strokeWidth="1.8" fill="none" opacity={snapped ? 0 : 0.6}
                    />
                    {/* SB to Load */}
                    <path
                        d={`M ${SB_X},${LOOP_TOP} L ${LOOP_RGT - RX},${LOOP_TOP} Q ${LOOP_RGT},${LOOP_TOP} ${LOOP_RGT},${LOOP_TOP + RX} L ${LOOP_RGT},${LOAD_Y - 24}`}
                        stroke={colors.border} strokeWidth="1.8" fill="none" opacity={snapped ? 0 : 0.6}
                    />
                    {/* Load to Return (Bottom rail) */}
                    <path
                        d={`M ${LOOP_RGT},${LOAD_Y + 24} L ${LOOP_RGT},${LOOP_BOT - RX} Q ${LOOP_RGT},${LOOP_BOT} ${LOOP_RGT - RX},${LOOP_BOT} L ${LOOP_LFT + RX},${LOOP_BOT} Q ${LOOP_LFT},${LOOP_BOT} ${LOOP_LFT},${LOOP_BOT - RX} L ${LOOP_LFT},${SRC_Y + 24}`}
                        stroke={colors.border} strokeWidth="1.8" fill="none" opacity={snapped ? 0 : 0.6}
                        strokeDasharray="4 6"
                    />

                    {/* ── Loop highlight overlay ───────────────────────────── */}
                    {overlays[2] && snapped && (
                        <rect
                            x={LOOP_LFT - 20} y={LOOP_TOP - 20}
                            width={(LOOP_RGT - LOOP_LFT) + 40} height={(LOOP_BOT - LOOP_TOP) + 40}
                            rx={RX + 20} fill="none"
                            stroke="rgba(0,212,255,0.05)" strokeWidth="40"
                            filter="url(#loop-glow)"
                        />
                    )}

                    {/* ── Top reference rail voltage drops ──────────────────────────────── */}
                    {(overlays[0] || diagnosticsMode) && (
                        <g opacity={snapped ? 1 : 0.4} style={{ transition: 'opacity 0.4s' }}>
                            <text x={LOOP_LFT + 10} y={LOOP_TOP - 16} fontSize="10" fill={colors.accent} fontFamily="IBM Plex Mono, monospace">+12V</text>
                            <text x={LOOP_RGT + 10} y={LOOP_BOT - 16} fontSize="10" fill={colors.wire} fontFamily="IBM Plex Mono, monospace">-GND</text>
                        </g>
                    )}

                    {/* ── Diagnostic Node Labels ──────────────────────────────────────── */}
                    {diagnosticsMode && (
                        <g fontSize="9" fill={colors.text} fontFamily="IBM Plex Mono, monospace" opacity="0.6" letterSpacing="0.1em">
                            <text x={SA_X} y={LOOP_TOP - 28} textAnchor="middle">NODE A (SRC)</text>
                            <text x={SB_X} y={LOOP_TOP - 28} textAnchor="middle">NODE B (LOAD)</text>
                        </g>
                    )}

                    {/* ── Short circuit path (top wire bypass) ─────────────  */}
                    {shortCircuit && (
                        <path
                            d={`M ${SA_X},${LOOP_TOP} L ${SB_X},${LOOP_TOP}`}
                            stroke="#EF4444" strokeWidth="2.5" filter="url(#glow-soft)" opacity="0.8" fill="none"
                        />
                    )}

                    {/* ── Source out path ─────────────────────────────────── */}
                    <path
                        d={`M ${LOOP_LFT},${SRC_Y - 24} L ${LOOP_LFT},${LOOP_TOP + RX} Q ${LOOP_LFT},${LOOP_TOP} ${LOOP_LFT + RX},${LOOP_TOP} L ${SA_X},${LOOP_TOP}`}
                        stroke={colors.wire} strokeWidth="1.8" fill="none" style={{ transition: 'stroke 0.4s' }}
                    />

                    {/* ── IEC Battery ──────────────────────────────────────── */}
                    <BatterySymbol x={SRC_X} y={SRC_Y} color={colors.wire} />

                    {/* ── Socket A (source output pole) ─────────────────────────── */}
                    <g transform={`translate(${SA_X},${LOOP_TOP})`}>
                        <circle r="16" fill="rgba(0,0,0,0.2)" stroke={colors.border} strokeWidth="1" />
                        <circle r="12" fill={colors.bg} stroke={colors.wire} strokeWidth="1.8" opacity="0.5" />
                        <circle r="5" fill={colors.wire} />
                        <circle r="2" fill={colors.bg} />
                    </g>

                    {/* ── Main draggable wire segment ──────────────────────────── */}
                    <line
                        ref={wireLineRef}
                        x1={SA_X + 14}
                        y1={LOOP_TOP}
                        x2={snapped ? SB_X - 14 : SA_X + 34}
                        y2={LOOP_TOP}
                        stroke={snapped ? colors.accent : colors.wire}
                        strokeWidth="2.2"
                        strokeLinecap="round"
                    />

                    {/* Electron flow overlay (calm) */}
                    {snapped && !shortCircuit && (
                        <g opacity="0.6">
                            <line
                                x1={SA_X + 14} y1={LOOP_TOP} x2={SB_X - 14} y2={LOOP_TOP}
                                stroke={colors.accent} strokeWidth="2" strokeDasharray="2 12" strokeLinecap="round"
                                className="vl-wire--live"
                            />
                            <path
                                d={`M ${LOOP_RGT},${LOAD_Y + 24} L ${LOOP_RGT},${LOOP_BOT - RX} Q ${LOOP_RGT},${LOOP_BOT} ${LOOP_RGT - RX},${LOOP_BOT} L ${LOOP_LFT + RX},${LOOP_BOT} Q ${LOOP_LFT},${LOOP_BOT} ${LOOP_LFT},${LOOP_BOT - RX} L ${LOOP_LFT},${SRC_Y + 24}`}
                                stroke={colors.accent} strokeWidth="2" strokeDasharray="2 12" strokeLinecap="round"
                                className="vl-wire--live" fill="none"
                            />
                            <path
                                d={`M ${LOOP_LFT},${SRC_Y - 24} L ${LOOP_LFT},${LOOP_TOP + RX} Q ${LOOP_LFT},${LOOP_TOP} ${LOOP_LFT + RX},${LOOP_TOP} L ${SA_X},${LOOP_TOP}`}
                                stroke={colors.accent} strokeWidth="2" strokeDasharray="2 12" strokeLinecap="round"
                                className="vl-wire--live" fill="none"
                            />
                            <path
                                d={`M ${SB_X},${LOOP_TOP} L ${LOOP_RGT - RX},${LOOP_TOP} Q ${LOOP_RGT},${LOOP_TOP} ${LOOP_RGT},${LOOP_TOP + RX} L ${LOOP_RGT},${LOAD_Y - 24}`}
                                stroke={colors.accent} strokeWidth="2" strokeDasharray="2 12" strokeLinecap="round"
                                className="vl-wire--live" fill="none"
                            />
                        </g>
                    )}

                    {/* ── Current direction arrows ───────────────────── */}
                    {(overlays[1] || diagnosticsMode) && snapped && (
                        <g fill={colors.accent} opacity="0.6">
                            <polygon points={`${(SA_X + SB_X) / 2 + 10},${LOOP_TOP - 4} ${(SA_X + SB_X) / 2},${LOOP_TOP} ${(SA_X + SB_X) / 2 + 10},${LOOP_TOP + 4}`} />
                            <polygon points={`${(SA_X + SB_X) / 2 - 10},${LOOP_BOT - 4} ${(SA_X + SB_X) / 2},${LOOP_BOT} ${(SA_X + SB_X) / 2 - 10},${LOOP_BOT + 4}`} />
                            <polygon points={`${LOOP_RGT - 4},${(LOOP_TOP + LOOP_BOT) / 2 - 10} ${LOOP_RGT},${(LOOP_TOP + LOOP_BOT) / 2} ${LOOP_RGT + 4},${(LOOP_TOP + LOOP_BOT) / 2 - 10}`} />
                            <polygon points={`${LOOP_LFT - 4},${(LOOP_TOP + LOOP_BOT) / 2 + 10} ${LOOP_LFT},${(LOOP_TOP + LOOP_BOT) / 2} ${LOOP_LFT + 4},${(LOOP_TOP + LOOP_BOT) / 2 + 10}`} />
                        </g>
                    )}

                    {/* ── Draggable wire engineered connector ───────────────────────────── */}
                    {!snapped && (
                        <g ref={wireEndRef as any} transform={`translate(${SA_X + 34},${LOOP_TOP})`} style={{ cursor: 'grab', touchAction: 'none' }}>
                            <circle r="14" fill="transparent" stroke={colors.wire} strokeWidth="1" strokeDasharray="2 3" opacity="0.5" />
                            <circle r="10" fill={colors.bg} stroke={colors.wire} strokeWidth="1.8" />
                            <circle r="5" fill={colors.wire} />
                            <circle r="2" fill="white" opacity="0.5" />
                            <text y="28" textAnchor="middle" fontSize="8" fill={colors.wire} fontFamily="IBM Plex Mono, monospace" letterSpacing="0.1em" opacity="0.8">DRAG</text>
                        </g>
                    )}

                    {/* ── Socket B (load receiver pole) ──────────────── */}
                    <g transform={`translate(${SB_X},${LOOP_TOP})`}>
                        <g style={{ transition: 'all 0.4s' }} opacity={snapped ? 1 : 0.6}>
                            <circle r="16" fill="rgba(0,0,0,0.2)" stroke={colors.border} strokeWidth="1" />
                            <circle r="12" fill={colors.bg} stroke={snapped ? colors.accent : colors.load} strokeWidth="1.8" style={{ transition: 'stroke 0.4s' }} />
                            <circle ref={socketBRef} className={`vl-socket ${snapped ? 'vl-socket--locked' : ''}`} r="8" fill={snapped ? colors.accent : colors.load} style={{ transition: 'fill 0.4s' }} />
                            {snapped && <circle r="3" fill="white" opacity="0.8" />}
                            {!snapped && <circle r="3" fill={colors.bg} opacity="0.5" />}
                        </g>
                    </g>

                    {/* ── Load wire stub ────────────────────────────────────── */}
                    <path
                        d={`M ${SB_X},${LOOP_TOP} L ${LOOP_RGT - RX},${LOOP_TOP} Q ${LOOP_RGT},${LOOP_TOP} ${LOOP_RGT},${LOOP_TOP + RX} L ${LOOP_RGT},${LOAD_Y - 24}`}
                        stroke={colors.load} strokeWidth="1.8" fill="none" style={{ transition: 'stroke 0.4s' }}
                    />

                    {/* ── IEC Lamp / Load ───────────────────────────────────── */}
                    <LampSymbol x={LOAD_X} y={LOAD_Y} color={colors.load} active={snapped} />

                    {/* Return path (bottom rail) */}
                    <path
                        d={`M ${LOOP_RGT},${LOAD_Y + 24} L ${LOOP_RGT},${LOOP_BOT - RX} Q ${LOOP_RGT},${LOOP_BOT} ${LOOP_RGT - RX},${LOOP_BOT} L ${LOOP_LFT + RX},${LOOP_BOT} Q ${LOOP_LFT},${LOOP_BOT} ${LOOP_LFT},${LOOP_BOT - RX} L ${LOOP_LFT},${SRC_Y + 24}`}
                        stroke={snapped ? colors.load : colors.border}
                        strokeWidth="1.8"
                        fill="none"
                        style={{ transition: 'stroke 0.4s' }}
                    />

                    {/* ── Scan Integrity Tracer Overlay ─────────────────────── */}
                    {scanning && (
                        <path
                            d={`M ${SA_X},${LOOP_TOP} L ${SB_X},${LOOP_TOP} L ${LOOP_RGT - RX},${LOOP_TOP} Q ${LOOP_RGT},${LOOP_TOP} ${LOOP_RGT},${LOOP_TOP + RX} L ${LOOP_RGT},${LOAD_Y - 24} M ${LOOP_RGT},${LOAD_Y + 24} L ${LOOP_RGT},${LOOP_BOT - RX} Q ${LOOP_RGT},${LOOP_BOT} ${LOOP_RGT - RX},${LOOP_BOT} L ${LOOP_LFT + RX},${LOOP_BOT} Q ${LOOP_LFT},${LOOP_BOT} ${LOOP_LFT},${LOOP_BOT - RX} L ${LOOP_LFT},${SRC_Y + 24} M ${LOOP_LFT},${SRC_Y - 24} L ${LOOP_LFT},${LOOP_TOP + RX} Q ${LOOP_LFT},${LOOP_TOP} ${LOOP_LFT + RX},${LOOP_TOP} L ${SA_X},${LOOP_TOP}`}
                            stroke={colors.accent}
                            strokeWidth="2.5"
                            fill="none"
                            className="vl-scan-trace"
                        />
                    )}

                    {/* ── Micro-spark burst ────────────────────────────────── */}
                    {showSpark && <MicroSpark x={SB_X} y={LOOP_TOP} />}
                </svg>
            </div>

            {/* ── Short Circuit Diagnostic Alert ────────────────────────── */}
            {shortCircuit && (
                <div style={{
                    width: '100%', maxWidth: 480,
                    padding: '12px 16px', borderRadius: 3,
                    border: '1px solid rgba(239,68,68,0.25)',
                    background: 'rgba(239,68,68,0.04)',
                }} className="vl-short-circuit">
                    <p style={{
                        fontFamily: "'IBM Plex Mono', monospace", fontSize: 9,
                        letterSpacing: '0.18em', color: 'rgba(239,68,68,0.7)',
                        textTransform: 'uppercase', marginBottom: 6,
                    }}>VoltMonkey: Fault Detected</p>
                    <p style={{ fontSize: 12, color: '#94A3B8', lineHeight: 1.6 }}>
                        <strong style={{ color: '#EF4444' }}>OBSERVATION:</strong> Zero-resistance path established.<br />
                        <strong style={{ color: '#EF4444' }}>ANALYSIS:</strong> Current bypasses the load completely. V_load = 0. I_circuit → ∞ (limited by R_internal).<br />
                        <strong style={{ color: '#EF4444' }}>CONCLUSION:</strong> Remove the short path and route current through the resistive load.
                    </p>
                </div>
            )}

            {/* ── Signal confirmed panel (on snap) ─────────────────────── */}
            {snapped && (
                <div style={{ width: '100%', maxWidth: 480 }}>
                    <div style={{
                        padding: '14px 18px', borderRadius: 3,
                        border: '1px solid rgba(16,185,129,0.2)',
                        background: 'rgba(16,185,129,0.04)',
                        display: 'flex', alignItems: 'flex-start', gap: 12,
                    }}>
                        <span style={{
                            width: 4, height: 4, borderRadius: '50%', flexShrink: 0, marginTop: 6,
                            background: '#10B981', boxShadow: '0 0 6px rgba(16,185,129,0.8)',
                        }} />
                        <div>
                            <p style={{
                                fontFamily: "'IBM Plex Mono', monospace", fontSize: 9,
                                letterSpacing: '0.18em', color: colors.accent,
                                textTransform: 'uppercase', marginBottom: 6,
                            }}>Engineering Check</p>
                            <p style={{ fontSize: 13, color: '#94A3B8', lineHeight: 1.6 }}>
                                Continuity validated. Current loop holds from <strong style={{ color: colors.text, fontWeight: 500 }}>+12V Source</strong> through <strong style={{ color: colors.text, fontWeight: 500 }}>R_LOAD</strong> to <strong style={{ color: colors.text, fontWeight: 500 }}>-GND</strong>. Loop invariant satisfied.
                            </p>
                        </div>
                    </div>

                    {/* ── Visual Circuit Schematic Overlay ─────────────────────── */}
                    {!shortCircuit && (
                        <div style={{
                            padding: '12px 18px', borderRadius: 3,
                            border: '1px solid rgba(0,212,255,0.2)',
                            background: 'rgba(0,212,255,0.03)',
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: colors.accent,
                            marginTop: 12, opacity: 0, animation: 'vl-invariant-reveal 0.4s ease-out forwards'
                        }}>
                            <span style={{ color: colors.text, opacity: 0.8 }}>Battery</span>
                            <span style={{ opacity: 0.5 }}>→</span>
                            <span style={{ color: colors.accent }}>Wire (Path)</span>
                            <span style={{ opacity: 0.5 }}>→</span>
                            <span style={{ color: '#10B981', fontWeight: 600 }}>LED (Load)</span>
                            <span style={{ opacity: 0.5 }}>→</span>
                            <span style={{ color: colors.accent }}>Wire (Return)</span>
                            <span style={{ opacity: 0.5 }}>→</span>
                            <span style={{ color: colors.text, opacity: 0.8 }}>Battery</span>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
});

SocketSystem.displayName = 'SocketSystem';
