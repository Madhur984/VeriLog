/**
 * SocketSystem.tsx — Enterprise Circuit Lab
 *
 * Features:
 *   - IEC electrical symbols (battery, resistive load, lamp)
 *   - Etched SVG dot-grid reference background
 *   - Three toggleable overlays: voltage labels, current arrows, loop highlight
 *   - Short circuit state: controlled red ramp + Analyst diagnostic alert
 *   - Magnetic proximity glow via CSS var (RAF, no React state)
 *   - Electron flow animation (stroke-dashoffset, velocity ∝ current)
 */

import { useEffect, useRef, useState, useCallback, memo } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, AlertTriangle } from 'lucide-react';
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
        <text x="-24" y="-2" textAnchor="end" fontSize="12" fill={color} fontFamily="JetBrains Mono, monospace" fontWeight="500" opacity="0.8">+</text>
        <text x="-24" y="12" textAnchor="end" fontSize="14" fill={color} fontFamily="JetBrains Mono, monospace" fontWeight="600" opacity="0.8">−</text>
        <text x="32" y="3" textAnchor="start" fontSize="9" fill={color} fontFamily="JetBrains Mono, monospace" letterSpacing="0.1em" opacity="0.6">12V DC</text>
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

        <text x="28" y="3" textAnchor="start" fontSize="9" fill={color} fontFamily="JetBrains Mono, monospace" letterSpacing="0.1em" opacity="0.6">R_LOAD</text>
    </g>
));
LampSymbol.displayName = 'LampSymbol';

// ── Spark Burst ───────────────────────────────────────────────────────────────
const MicroSpark = memo(({ x, y }: { x: number; y: number }) => (
    <g transform={`translate(${x},${y})`} aria-hidden="true">
        {[1, 2, 3, 4].map(i => (
            <circle key={i} className="vl-spark" r="2" fill="#0EA5E9" />
        ))}
    </g>
));
MicroSpark.displayName = 'MicroSpark';

// ── Main Component ────────────────────────────────────────────────────────────
export const SocketSystem = memo(({ onComplete }: SocketSystemProps) => {
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
        grid: 'rgba(15, 23, 42, 0.03)',
        border: 'rgba(15, 23, 42, 0.08)',
        source: '#64748B',
        load: snapped ? '#0EA5E9' : '#64748B',
        wire: snapped ? '#0EA5E9' : '#475569',
        socket: '#FFFFFF',
        accent: '#0EA5E9',
        text: '#0F172A',
    };

    return (
        <div className="w-full flex flex-col items-center gap-8 font-mono">

            {/* ── Status Banner ─────────────────────────────────────────── */}
            <div className={cn(
                "flex items-center gap-3 px-5 py-2.5 rounded-2xl border transition-all duration-500 shadow-xl",
                shortCircuit ? "bg-rose-50 border-rose-100 shadow-rose-50" : snapped ? "bg-emerald-50 border-emerald-100 shadow-emerald-50" : "bg-sky-50 border-sky-100 shadow-sky-50"
            )}>
                <span className={cn(
                    "w-2 h-2 rounded-full flex-shrink-0 animate-pulse",
                    shortCircuit ? "bg-rose-500" : snapped ? "bg-emerald-500" : "bg-sky-500"
                )} />
                <span className={cn(
                    "text-[10px] uppercase font-black tracking-widest italic",
                    shortCircuit ? "text-rose-600" : snapped ? "text-emerald-600" : "text-sky-600"
                )}>
                    {shortCircuit
                        ? 'FAULT — SHORT CIRCUIT DETECTED'
                        : snapped
                            ? 'LOOP INTEGRITY VERIFIED'
                            : 'CONNECT PATH TO CLOSE CIRCUIT'}
                </span>
            </div>

            {/* ── Overlay Toggle Bar & Current Meter ──────────────────────── */}
            <div className="flex w-full max-w-2xl justify-between items-end">
                <div className="flex gap-3">
                    {[
                        { label: 'V', title: 'Voltage labels' },
                        { label: '→', title: 'Current direction' },
                        { label: '∮', title: 'Loop highlight' },
                    ].map((o, i) => (
                        <button
                            key={i}
                            title={o.title}
                            onClick={() => toggleOverlay(i)}
                            className={cn(
                                "p-3 rounded-xl border transition-all duration-300 font-bold text-xs uppercase shadow-sm",
                                overlays[i] ? "bg-sky-50 border-sky-200 text-sky-600 shadow-sky-100" : "bg-white border-slate-100 text-slate-400 hover:border-slate-200"
                            )}
                        >
                            {o.label}
                        </button>
                    ))}
                    <button
                        title="Scan circuit integrity"
                        onClick={handleScan}
                        disabled={!snapped || scanning}
                        className={cn(
                            "px-5 py-3 ml-2 rounded-xl border transition-all duration-300 font-black text-[10px] uppercase tracking-widest",
                            scanning ? "bg-sky-500 text-white border-sky-600 shadow-lg shadow-sky-100" : (snapped ? "bg-white border-sky-100 text-sky-600 hover:border-sky-200" : "bg-slate-50 border-slate-100 text-slate-300 cursor-not-allowed")
                        )}
                    >
                        SCAN INTEGRITY
                    </button>
                </div>

                {/* Simulated Current Meter */}
                <div className={cn(
                    "font-black text-xl italic px-8 py-3 rounded-2xl border transition-all duration-500 shadow-inner bg-slate-50",
                    shortCircuit ? "text-rose-500 border-rose-100" : snapped ? "text-sky-500 border-sky-100" : "text-slate-300 border-slate-100"
                )}>
                    <span className="text-[10px] font-black uppercase tracking-tighter mr-3 opacity-40 not-italic">Node_Current</span>
                    {shortCircuit ? 'ERR' : snapped ? '0.15A' : '0.00A'}
                </div>
            </div>

            {/* ── SVG Circuit ───────────────────────────────────────────── */}
            <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-[48px] overflow-hidden shadow-2xl">
                {!snapped && !shortCircuit && (
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="absolute top-12 left-1/2 -translate-x-1/2 bg-sky-50 border border-sky-100 px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest text-sky-600 shadow-lg shadow-sky-50 pointer-events-none z-10"
                    >
                        "Drag Terminal Node to Complete Path"
                    </motion.div>
                )}

                <svg
                    ref={svgRef}
                    viewBox={`0 0 ${W} ${H}`}
                    width="100%"
                    className="block overflow-visible"
                    role="img"
                >
                    <defs>
                        <pattern id="dot-grid" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
                            <circle cx="12" cy="12" r="1.2" fill={colors.grid} />
                        </pattern>
                    </defs>

                    <rect x="0" y="0" width={W} height={H} fill="url(#dot-grid)" />

                    {/* Background Trace (Inactive Path) */}
                    <path
                        d={`M ${LOOP_LFT},${SRC_Y - 24} L ${LOOP_LFT},${LOOP_TOP + RX} Q ${LOOP_LFT},${LOOP_TOP} ${LOOP_LFT + RX},${LOOP_TOP} L ${SA_X},${LOOP_TOP}`}
                        stroke={colors.border} strokeWidth="2.5" fill="none" opacity={snapped ? 0 : 0.6}
                    />
                    <path
                        d={`M ${SB_X},${LOOP_TOP} L ${LOOP_RGT - RX},${LOOP_TOP} Q ${LOOP_RGT},${LOOP_TOP} ${LOOP_RGT},${LOOP_TOP + RX} L ${LOOP_RGT},${LOAD_Y - 24}`}
                        stroke={colors.border} strokeWidth="2.5" fill="none" opacity={snapped ? 0 : 0.6}
                    />

                    {/* IEC Battery */}
                    <BatterySymbol x={SRC_X} y={SRC_Y} color={colors.wire} />

                    {/* Socket A */}
                    <g transform={`translate(${SA_X},${LOOP_TOP})`}>
                        <circle r="18" fill="white" stroke={colors.border} strokeWidth="2" shadow-sm />
                        <circle r="6" fill={colors.wire} />
                    </g>

                    {/* Wire Segment */}
                    <line
                        ref={wireLineRef}
                        x1={SA_X + 14}
                        y1={LOOP_TOP}
                        x2={snapped ? SB_X - 14 : SA_X + 34}
                        y2={LOOP_TOP}
                        stroke={snapped ? colors.accent : colors.wire}
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        className="transition-all duration-500"
                    />

                    {/* Socket B */}
                    <g transform={`translate(${SB_X},${LOOP_TOP})`}>
                        <circle r="18" fill="white" stroke={snapped ? colors.accent : colors.border} strokeWidth="2" />
                        <circle ref={socketBRef} r="8" fill={snapped ? colors.accent : colors.load} className="transition-all duration-500" />
                    </g>

                    {/* IEC Lamp */}
                    <LampSymbol x={LOAD_X} y={LOAD_Y} color={colors.load} active={snapped} />

                    {/* Return path */}
                    <path
                        d={`M ${LOOP_RGT},${LOAD_Y + 24} L ${LOOP_RGT},${LOOP_BOT - RX} Q ${LOOP_RGT},${LOOP_BOT} ${LOOP_RGT - RX},${LOOP_BOT} L ${LOOP_LFT + RX},${LOOP_BOT} Q ${LOOP_LFT},${LOOP_BOT} ${LOOP_LFT},${LOOP_BOT - RX} L ${LOOP_LFT},${SRC_Y + 24}`}
                        stroke={snapped ? colors.accent : colors.border} strokeWidth="2.5" fill="none" className="transition-all duration-500"
                    />
                    
                    {showSpark && <MicroSpark x={SB_X} y={LOOP_TOP} />}
                </svg>
            </div>

            {/* AI Insight */}
            <div className="w-full max-w-2xl flex flex-col gap-4">
                {shortCircuit && (
                    <div className="bg-rose-50 border border-rose-100 rounded-[32px] p-8 shadow-xl">
                        <div className="flex items-center gap-3 mb-4">
                            <AlertTriangle size={24} className="text-rose-600" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-rose-600 italic">Critical Fault Analysis</span>
                        </div>
                        <p className="text-sm font-bold text-slate-600 leading-relaxed italic">
                            <strong className="text-rose-600">OBSERVATION:</strong> Zero-resistance path established.
                            Current bypasses the load completely. V_load = 0. I_circuit → ∞.
                            Remove the short path and route current through the resistive load.
                        </p>
                    </div>
                )}

                {snapped && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-xl flex gap-6 items-start border-l-4 border-l-emerald-500"
                    >
                        <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600">
                            <ShieldCheck size={24} />
                        </div>
                        <div>
                            <div className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-2">Loop Continuity Diagnostic</div>
                            <p className="text-sm font-bold text-slate-600 italic">
                                "Continuity validated. Current loop holds from <strong className="text-slate-900">+12V Source</strong> through <strong className="text-slate-900">R_LOAD</strong> to <strong className="text-slate-900">-GND</strong>. Logic Invariant Satisfied."
                            </p>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
});

SocketSystem.displayName = 'SocketSystem';

function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(' ');
}
