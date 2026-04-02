import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

/* ──────────────────────────────────────────────────────────────────
   PCB TRACE GENERATOR
   Generates a procedural web of right-angle (90°/45°) PCB traces,
   vias, pads, and IC component outlines.
────────────────────────────────────────────────────────────────── */

interface Trace { d: string; len: number; delay: number; dur: number; color: string; width: number; }
interface TraceProps { d: string; delay: number; dur: number; color: string; width: number; }
interface Via   { cx: number; cy: number; r: number; delay: number; }
interface Pad   { x: number; y: number; w: number; h: number; delay: number; }
interface IC    { x: number; y: number; w: number; h: number; delay: number; }

// Deterministic pseudo-random based on seed
function seededRand(seed: number) {
    let s = seed;
    return () => {
        s = (s * 16807 + 0) % 2147483647;
        return (s - 1) / 2147483646;
    };
}

function generatePCBLayout(seed = 42) {
    const rng = seededRand(seed);
    const W = 1400, H = 950;

    const traces: Trace[] = [];
    const vias:   Via[]   = [];
    const pads:   Pad[]   = [];
    const ics:    IC[]    = [];

    const colors = [
        '#0ea5e9',   // sky blue (primary)
        '#22d3ee',   // cyan (secondary)
        '#38bdf8',   // light sky
        '#7dd3fc',   // faint blue
        '#a78bfa',   // purple accent
        '#6ee7b7',   // teal accent
    ];

    // ── TRUNK HORIZONTAL RAILS ──────────────────────────────────────
    const railYs = [80, 160, 240, 330, 420, 510, 600, 690, 780, 865];
    railYs.forEach((y, i) => {
        const startX = Math.floor(rng() * 200);
        const endX   = W - Math.floor(rng() * 200);
        const color  = colors[i % colors.length];
        const len    = endX - startX;
        traces.push({ d: `M ${startX} ${y} L ${endX} ${y}`, len, delay: i * 0.3, dur: 2 + rng() * 2, color, width: 1.5 });
        // Parallel hairline below
        traces.push({ d: `M ${startX} ${y + 3} L ${endX} ${y + 3}`, len, delay: i * 0.3 + 0.15, dur: 2 + rng() * 2, color: `${color}44`, width: 0.7 });
    });

    // ── TRUNK VERTICAL RAILS ────────────────────────────────────────
    const railXs = [100, 210, 340, 470, 600, 720, 840, 960, 1090, 1230, 1350];
    railXs.forEach((x, i) => {
        const startY = Math.floor(rng() * 150);
        const endY   = H - Math.floor(rng() * 150);
        const color  = colors[(i + 2) % colors.length];
        const len    = endY - startY;
        traces.push({ d: `M ${x} ${startY} L ${x} ${endY}`, len, delay: i * 0.25 + 0.5, dur: 2.5 + rng() * 2, color, width: 1.5 });
        traces.push({ d: `M ${x + 3} ${startY} L ${x + 3} ${endY}`, len, delay: i * 0.25 + 0.65, dur: 2.5 + rng() * 2, color: `${color}33`, width: 0.7 });
    });

    // ── 45-DEGREE DIAGONAL CONNECTORS ───────────────────────────────
    // Connect horizontal to vertical rails with chamfered elbow traces
    const connectors = [
        { x1: 100,  y1: 80,  x2: 210,  y2: 160 },
        { x1: 340,  y1: 160, x2: 470,  y2: 240 },
        { x1: 600,  y1: 80,  x2: 720,  y2: 160 },
        { x1: 840,  y1: 240, x2: 960,  y2: 330 },
        { x1: 1090, y1: 160, x2: 1230, y2: 240 },
        { x1: 210,  y1: 420, x2: 340,  y2: 510 },
        { x1: 470,  y1: 330, x2: 600,  y2: 420 },
        { x1: 720,  y1: 510, x2: 840,  y2: 600 },
        { x1: 960,  y1: 420, x2: 1090, y2: 510 },
        { x1: 100,  y1: 690, x2: 210,  y2: 780 },
        { x1: 340,  y1: 600, x2: 470,  y2: 690 },
        { x1: 600,  y1: 780, x2: 720,  y2: 865 },
        { x1: 840,  y1: 690, x2: 960,  y2: 780 },
        { x1: 1090, y1: 600, x2: 1230, y2: 690 },
    ];
    connectors.forEach((c, i) => {
        // Elbow path: go horizontal first, then diagonal chamfer, then vertical
        const midX = (c.x1 + c.x2) / 2;
        const d = `M ${c.x1} ${c.y1} L ${midX - 10} ${c.y1} L ${midX + 10} ${c.y2} L ${c.x2} ${c.y2}`;
        const len = Math.abs(c.x2 - c.x1) + Math.abs(c.y2 - c.y1);
        traces.push({ d, len, delay: i * 0.2 + 1.5, dur: 1.5 + rng() * 1.5, color: colors[i % colors.length], width: 1 });
    });

    // ── SHORT BRANCH STUBS ───────────────────────────────────────────
    // Small horizontal/vertical branches off the rails
    for (let i = 0; i < 60; i++) {
        const isH     = rng() > 0.5;
        const baseX   = Math.floor(rng() * W);
        const baseY   = railYs[Math.floor(rng() * railYs.length)];
        const stubLen = 30 + Math.floor(rng() * 120);
        const color   = colors[Math.floor(rng() * colors.length)];
        if (isH) {
            // horizontal stub off a vertical rail
            const rx = railXs[Math.floor(rng() * railXs.length)];
            const ry = baseY;
            traces.push({ d: `M ${rx} ${ry} L ${rx + stubLen * (rng() > 0.5 ? 1 : -1)} ${ry}`, len: stubLen, delay: 2 + rng() * 3, dur: 1 + rng(), color, width: 0.8 });
        } else {
            // vertical stub off a horizontal rail
            traces.push({ d: `M ${baseX} ${baseY} L ${baseX} ${baseY + stubLen * (rng() > 0.5 ? 1 : -1)}`, len: stubLen, delay: 2 + rng() * 3, dur: 1 + rng(), color, width: 0.8 });
        }
    }

    // ── VIAS (drill holes at junctions) ──────────────────────────────
    railXs.forEach(x => {
        railYs.forEach((y, j) => {
            if (rng() > 0.4) {
                vias.push({ cx: x, cy: y, r: rng() > 0.7 ? 5 : 3, delay: j * 0.15 + rng() * 2 });
            }
        });
    });

    // ── SMD PADS (rectangular pads at stub ends) ──────────────────────
    for (let i = 0; i < 45; i++) {
        const x = Math.floor(rng() * W);
        const y = railYs[Math.floor(rng() * railYs.length)] + (rng() > 0.5 ? -30 : 30) * Math.floor(rng() * 3 + 1);
        pads.push({ x, y, w: 10 + rng() * 12, h: 5 + rng() * 6, delay: 3 + rng() * 3 });
    }

    // ── IC COMPONENT OUTLINES ────────────────────────────────────────
    const icPositions = [
        { x: 140, y: 100 }, { x: 500, y: 260 }, { x: 850, y: 140 },
        { x: 250, y: 480 }, { x: 680, y: 550 }, { x: 1020, y: 380 },
        { x: 160, y: 700 }, { x: 560, y: 750 }, { x: 990, y: 700 },
        { x: 1200, y: 500 },
    ];
    icPositions.forEach((pos, i) => {
        const w = 60 + Math.floor(rng() * 60);
        const h = 40 + Math.floor(rng() * 40);
        ics.push({ x: pos.x - w / 2, y: pos.y - h / 2, w, h, delay: 4 + i * 0.3 });
    });

    return { traces, vias, pads, ics };
}

/* ──────────────────────────────────────────────────────────────────
   ANIMATED TRACE  — draws itself using stroke-dasharray trick
────────────────────────────────────────────────────────────────── */
const AnimatedTrace: React.FC<TraceProps> = ({ d, delay, dur, color, width }) => (
    <motion.path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={width}
        strokeLinecap="square"
        strokeLinejoin="miter"
        pathLength={1}
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ delay, duration: dur, ease: 'easeOut' }}
    />
);

/* Flowing pulse along a trace */
const TracePulse: React.FC<{ d: string; color: string; delay: number }> = ({ d, color, delay }) => (
    <motion.path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={2.5}
        strokeLinecap="round"
        pathLength={1}
        strokeDasharray="0.06 0.94"
        initial={{ strokeDashoffset: 1 }}
        animate={{ strokeDashoffset: -0.1 }}
        transition={{ delay, duration: 5, repeat: Infinity, ease: 'linear' }}
        style={{ filter: `drop-shadow(0 0 5px ${color})` }}
    />
);

/* ──────────────────────────────────────────────────────────────────
   MAIN COMPONENT
────────────────────────────────────────────────────────────────── */
export const CircuitBackground: React.FC = () => {
    const { traces, vias, pads, ics } = useMemo(() => generatePCBLayout(42), []);

    // Select primary glow traces for pulse animations
    const primaryTraces = traces.filter((_, i) => i % 8 === 0);

    return (
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
            {/* PCB base board */}
            <div className="absolute inset-0 bg-[#030c1a]" />

            {/* Subtle board grain */}
            <div className="absolute inset-0 opacity-[0.025]"
                style={{
                    backgroundImage: `
                        radial-gradient(circle at 25% 25%, #0ea5e9 0%, transparent 50%),
                        radial-gradient(circle at 75% 75%, #7c3aed 0%, transparent 50%),
                        radial-gradient(circle at 50% 10%, #0891b2 0%, transparent 40%)
                    `
                }}
            />

            {/* Color bloom ambience */}
            <div className="absolute top-[-15%] left-[-8%] w-[55%] h-[55%] bg-sky-900/20 rounded-full blur-[160px]" />
            <div className="absolute bottom-[-15%] right-[-8%] w-[50%] h-[50%] bg-violet-900/15 rounded-full blur-[160px]" />
            <div className="absolute top-[40%] left-[35%] w-[40%] h-[40%] bg-cyan-900/10 rounded-full blur-[120px]" />

            {/* ── SVG PCB LAYER ── */}
            <svg
                className="absolute inset-0 w-full h-full"
                viewBox="0 0 1400 950"
                preserveAspectRatio="xMidYMid slice"
                xmlns="http://www.w3.org/2000/svg"
            >
                <defs>
                    <filter id="glow-sm">
                        <feGaussianBlur stdDeviation="2.5" result="blur" />
                        <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                    </filter>
                    <filter id="glow-lg">
                        <feGaussianBlur stdDeviation="6" result="blur" />
                        <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                    </filter>
                    <radialGradient id="viaGrad" cx="30%" cy="30%" r="60%">
                        <stop offset="0%" stopColor="#bae6fd" stopOpacity="0.9" />
                        <stop offset="100%" stopColor="#0369a1" stopOpacity="0.4" />
                    </radialGradient>
                </defs>

                {/* ── LAYER 0: GHOST BACKGROUND TRACES (instant) ── */}
                <g opacity="0.06" stroke="#38bdf8" strokeWidth="1" fill="none">
                    {traces.map((t, i) => (
                        <path key={`ghost-${i}`} d={t.d} strokeLinecap="square" />
                    ))}
                </g>

                {/* ── LAYER 1: DRAW-OUT CIRCUIT TRACES ── */}
                <g filter="url(#glow-sm)" opacity="0.85">
                    {traces.map((t, i) => (
                        <AnimatedTrace key={`trace-${i}`} {...t} />
                    ))}
                </g>

                {/* ── LAYER 2: VIA HOLES ── */}
                {vias.map((v, i) => (
                    <motion.g key={`via-${i}`}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: v.delay, duration: 0.4, ease: 'backOut' }}
                        style={{ transformOrigin: `${v.cx}px ${v.cy}px` }}
                    >
                        {/* Annular ring */}
                        <circle cx={v.cx} cy={v.cy} r={v.r + 3} fill="none" stroke="#0ea5e9" strokeWidth="1.5" opacity="0.5" />
                        <circle cx={v.cx} cy={v.cy} r={v.r + 5} fill="none" stroke="#0ea5e9" strokeWidth="0.5" opacity="0.2" />
                        {/* Filled via */}
                        <circle cx={v.cx} cy={v.cy} r={v.r} fill="url(#viaGrad)" style={{ filter: 'drop-shadow(0 0 4px #22d3ee)' }} />
                        {/* Center drill */}
                        <circle cx={v.cx} cy={v.cy} r={v.r * 0.4} fill="#030c1a" />
                    </motion.g>
                ))}

                {/* ── LAYER 3: SMD COMPONENT PADS ── */}
                {pads.map((p, i) => (
                    <motion.g key={`pad-${i}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: p.delay, duration: 0.5 }}
                    >
                        <rect x={p.x - p.w / 2} y={p.y - p.h / 2} width={p.w} height={p.h}
                            fill="#0c4a6e" stroke="#0ea5e9" strokeWidth="0.8" opacity="0.7" rx="1" />
                        <rect x={p.x - p.w / 2 + 2} y={p.y - p.h / 2 + 2} width={p.w - 4} height={p.h - 4}
                            fill="#075985" stroke="none" rx="0.5" />
                    </motion.g>
                ))}

                {/* ── LAYER 4: IC COMPONENT OUTLINES ── */}
                {ics.map((ic, i) => (
                    <motion.g key={`ic-${i}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: ic.delay, duration: 0.8 }}
                    >
                        {/* IC body */}
                        <rect x={ic.x} y={ic.y} width={ic.w} height={ic.h}
                            fill="#071828" stroke="#1e40af" strokeWidth="1" opacity="0.7" rx="2" />
                        {/* Pin 1 marker */}
                        <circle cx={ic.x + 8} cy={ic.y + 8} r="2" fill="#7dd3fc" opacity="0.6" />
                        {/* Notch */}
                        <path d={`M ${ic.x + ic.w / 2 - 8} ${ic.y} A 8 8 0 0 1 ${ic.x + ic.w / 2 + 8} ${ic.y}`}
                            fill="#030c1a" stroke="#1e40af" strokeWidth="0.8" />
                        {/* IC pins along top/bottom */}
                        {Array.from({ length: Math.floor(ic.w / 12) }).map((_, pi) => (
                            <React.Fragment key={pi}>
                                <rect x={ic.x + pi * 12 + 4} y={ic.y - 6} width={6} height={6} fill="#0c4a6e" stroke="#0ea5e9" strokeWidth="0.6" rx="0.5" />
                                <rect x={ic.x + pi * 12 + 4} y={ic.y + ic.h} width={6} height={6} fill="#0c4a6e" stroke="#0ea5e9" strokeWidth="0.6" rx="0.5" />
                            </React.Fragment>
                        ))}
                    </motion.g>
                ))}

                {/* ── LAYER 5: FLOWING LIGHT PULSES ── */}
                <g>
                    {primaryTraces.map((t, i) => (
                        <TracePulse key={`pulse-${i}`} d={t.d} color={t.color} delay={6 + i * 0.8} />
                    ))}
                </g>
            </svg>
        </div>
    );
};
