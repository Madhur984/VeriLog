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

import { useEffect, useRef, useState, useCallback, memo, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, AlertTriangle, Play, Zap, Activity } from 'lucide-react';
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
// ── Oscilloscope Telemetry ──────────────────────────────────────────────────
const OscilloscopeTelemetry = memo(({ active }: { active: boolean }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        const canvas = canvasRef.current; if (!canvas) return;
        const ctx = canvas.getContext('2d'); if (!ctx) return;
        let t = 0; let frame: number;
        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.strokeStyle = active ? '#00D4FF' : '#ffffff20';
            ctx.lineWidth = 1.5; ctx.beginPath();
            for (let x = 0; x < canvas.width; x++) {
                const amp = active ? 10 : 2;
                const y = (canvas.height/2) + amp * Math.sin(x * 0.1 + t) + (active ? 4 * Math.sin(x * 0.25 - t*2) : 0);
                if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
            }
            ctx.stroke(); t += active ? 0.15 : 0.05; frame = requestAnimationFrame(draw);
        };
        draw(); return () => cancelAnimationFrame(frame);
    }, [active]);
    return (
        <div className="relative h-16 w-32 bg-black/40 rounded-xl border border-white/5 overflow-hidden shadow-inner">
            <canvas ref={canvasRef} width={128} height={64} className="absolute inset-0 opacity-60" />
            <div className="absolute top-1 left-2 text-[6px] font-mono text-cyan-400 opacity-40 uppercase tracking-widest">Live_Signal</div>
        </div>
    );
});

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
        <div className="w-full flex flex-col items-center gap-10 font-sans bg-[#06090f] p-12 rounded-[3.5rem] border border-white/10 relative overflow-hidden">
            
            {/* Ambient Background Grid */}
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: `radial-gradient(#00D4FF 1px, transparent 1px)`, backgroundSize: '32px 32px' }} />

            {/* ── Status HUD ─────────────────────────────────────────── */}
            <div className="w-full max-w-2xl flex justify-between items-center z-10">
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${snapped ? 'bg-cyan-400 shadow-[0_0_10px_#00D4FF]' : 'bg-white/20'} animate-pulse`} />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Lab_Session // S-01.1</span>
                    </div>
                    <h2 className="text-xl font-black text-white tracking-widest uppercase">
                        {snapped ? 'Signal_Path_Verified' : 'Establish_Integrity'}
                    </h2>
                </div>
                
                <div className="flex gap-4">
                    <OscilloscopeTelemetry active={snapped} />
                    <div className="flex flex-col justify-center items-end bg-black/40 px-6 rounded-xl border border-white/5">
                        <span className="text-[7px] font-mono text-cyan-400/40 uppercase tracking-widest mb-1">Amperage_Total</span>
                        <span className={`text-lg font-black italic tabular-nums ${snapped ? 'text-cyan-400 text-shadow-glow' : 'text-white/10'}`}>
                            {snapped ? '0.158A' : '0.000A'}
                        </span>
                    </div>
                </div>
            </div>

            {/* ── Overlay Toggle Bar & Current Meter ──────────────────────── */}
            <div className="flex w-full max-w-2xl justify-between items-center z-10 px-2">
                <div className="flex gap-4">
                    {[
                        { label: 'V', title: 'Voltage labels', icon: Activity },
                        { label: '→', title: 'Current direction', icon: Zap },
                        { label: '∮', title: 'Loop highlight', icon: ShieldCheck },
                    ].map((o, i) => (
                        <motion.button
                            key={i}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => toggleOverlay(i)}
                            className={`p-3 w-12 h-12 flex items-center justify-center rounded-2xl border transition-all duration-300 relative ${
                                overlays[i] ? "bg-cyan-400 border-cyan-400 text-black shadow-[0_0_15px_#00D4FF]" : "bg-black/40 border-white/5 text-white/30 hover:border-white/20"
                            }`}
                        >
                            <o.icon size={16} />
                            {overlays[i] && (
                                <span className="absolute -top-1 -right-1 w-2 h-2 bg-white rounded-full animate-ping" />
                            )}
                        </motion.button>
                    ))}
                </div>

                <motion.button
                    whileHover={{ scale: 1.02, x: 5 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleScan}
                    disabled={!snapped || scanning}
                    className={`px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-[0.4em] border flex items-center gap-3 transition-all ${
                        scanning ? "bg-cyan-400 text-black border-cyan-400" : (snapped ? "bg-white/5 border-white/10 text-white hover:bg-white/10" : "bg-white/[0.02] border-white/[0.02] text-white/10 cursor-not-allowed")
                    }`}
                >
                    <Play size={12} fill={scanning ? "currentColor" : "none"} />
                    {scanning ? 'Analyzing_Signal...' : 'Execute_Scan'}
                </motion.button>
            </div>

            {/* ── SVG Circuit ───────────────────────────────────────────── */}
            <div className="relative w-full max-w-2xl bg-[#0A0A0B] border border-white/10 rounded-[3rem] overflow-hidden shadow-[0_40px_80px_rgba(0,0,0,0.8)] p-1">
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-50" />
                <AnimatePresence>
                    {!snapped && (
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                            className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none"
                        >
                            <div className="px-10 py-4 rounded-full bg-cyan-400/10 border border-cyan-400/20 backdrop-blur-xl text-cyan-400 text-[10px] font-black uppercase tracking-[0.5em] shadow-[0_0_40px_rgba(34,211,238,0.1)]">
                                Establish_Continuity_Protocol
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

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
            <div className="w-full max-w-2xl flex flex-col gap-6 z-10">
                <AnimatePresence>
                    {snapped && (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 shadow-[0_20px_40px_rgba(0,0,0,0.4)] flex gap-8 items-start border-l-4 border-l-cyan-400"
                        >
                            <div className="p-4 bg-cyan-400 rounded-2xl text-black shadow-[0_0_20px_rgba(34,211,238,0.4)]">
                                <ShieldCheck size={28} />
                            </div>
                            <div className="flex-1">
                                <div className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.4em] mb-3">Integrity_Analyst // Protocol_X7</div>
                                <p className="text-sm font-bold text-white/70 leading-relaxed italic">
                                    "Continuity re-established. Current is flowing through <strong className="text-white">R_LOAD</strong> at a stable rate. Circuit invariants are nominal. You are ready for Signal Modulation nodes."
                                </p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
});

SocketSystem.displayName = 'SocketSystem';

function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(' ');
}
