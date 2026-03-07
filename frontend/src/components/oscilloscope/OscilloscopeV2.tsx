/**
 * components/oscilloscope/OscilloscopeV2.tsx
 *
 * Upgraded oscilloscope — 4-channel, trigger detection, dual cursors.
 *
 * Architecture:
 *   - Props pass raw Float32Array voltages (from SignalRecorder)
 *   - Renders via 2D canvas (WebGL upgrade path noted in comments)
 *   - requestAnimationFrame loop — never tied to React re-renders
 *   - Cursor measurements: delta-T and delta-V readouts
 */

import { useRef, useEffect, useCallback, useState } from 'react';

const CHANNEL_COLORS = ['#00D4FF', '#F59E0B', '#10B981', '#A78BFA'] as const;

const T = {
    bg: '#060C1A',
    grid: 'rgba(0,212,255,0.07)',
    gridMajor: 'rgba(0,212,255,0.12)',
    text: '#64748B',
    mono: "'IBM Plex Mono','Roboto Mono',monospace",
    trigger: 'rgba(245,158,11,0.5)',
} as const;

export interface OscChannel {
    label: string;
    samples: Float32Array;   // normalized [0..1] values
    writeHead: number;       // current ring-buffer write position
    color?: string;
    vDiv?: number;           // volts per division (default: 1V)
    enabled?: boolean;
}

interface CursorState {
    x1: number; x2: number;  // normalized [0..1] horizontal positions
    dragging: 1 | 2 | null;
}

interface Props {
    channels: OscChannel[];
    height?: number;
    timeDivMs?: number;       // ms per horizontal division
    triggerLevel?: number;    // normalized [0..1]
    showCursors?: boolean;
    showTrigger?: boolean;
    showGrid?: boolean;
    label?: string;
}

export function OscilloscopeV2({
    channels,
    height = 240,
    timeDivMs = 10,
    triggerLevel = 0.5,
    showCursors = false,
    showTrigger = false,
    showGrid = true,
    label,
}: Props) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const rafRef = useRef(0);
    const [cursors, setCursors] = useState<CursorState>({ x1: 0.25, x2: 0.75, dragging: null });
    const [measurements, setMeasurements] = useState({ dtMs: 0, dV: 0 });

    const draw = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const W = canvas.width;
        const H = canvas.height;

        // Background
        ctx.fillStyle = T.bg;
        ctx.fillRect(0, 0, W, H);

        if (showGrid) drawGrid(ctx, W, H);

        // Draw each channel
        channels.forEach((ch, ci) => {
            if (ch.enabled === false) return;
            const color = ch.color ?? CHANNEL_COLORS[ci % 4];
            drawChannel(ctx, ch, W, H, color);
        });

        // Trigger line
        if (showTrigger) {
            const ty = H - triggerLevel * H;
            ctx.strokeStyle = T.trigger;
            ctx.setLineDash([4, 4]);
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(0, ty);
            ctx.lineTo(W, ty);
            ctx.stroke();
            ctx.setLineDash([]);
        }

        // Cursors
        if (showCursors) {
            [cursors.x1, cursors.x2].forEach((cx, i) => {
                const x = cx * W;
                ctx.strokeStyle = i === 0 ? '#00D4FF' : '#F59E0B';
                ctx.lineWidth = 1;
                ctx.setLineDash([3, 3]);
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, H);
                ctx.stroke();
                ctx.setLineDash([]);
            });
        }

        // Labels
        if (label) {
            ctx.fillStyle = `${CHANNEL_COLORS[0]}60`;
            ctx.font = `8px ${T.mono}`;
            ctx.fillText(label.toUpperCase(), 8, 14);
        }

        channels.forEach((ch, ci) => {
            if (ch.enabled === false) return;
            const color = ch.color ?? CHANNEL_COLORS[ci % 4];
            ctx.fillStyle = color;
            ctx.font = `7px ${T.mono}`;
            ctx.fillText(ch.label, 8, H - 8 - ci * 12);
        });

        // Time/div label
        ctx.fillStyle = T.text;
        ctx.font = `7px ${T.mono}`;
        ctx.fillText(`${timeDivMs}ms/div`, W - 60, H - 6);
    }, [channels, triggerLevel, showCursors, showTrigger, showGrid, label, timeDivMs, cursors]);

    // rAF loop
    useEffect(() => {
        function loop() {
            draw();
            rafRef.current = requestAnimationFrame(loop);
        }
        rafRef.current = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(rafRef.current);
    }, [draw]);

    // Resize observer
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ro = new ResizeObserver(() => {
            canvas.width = canvas.offsetWidth * window.devicePixelRatio;
            canvas.height = canvas.offsetHeight * window.devicePixelRatio;
            canvas.style.width = canvas.offsetWidth + 'px';
            canvas.style.height = canvas.offsetHeight + 'px';
        });
        ro.observe(canvas);
        return () => ro.disconnect();
    }, []);

    // Cursor measurements
    useEffect(() => {
        if (!showCursors || channels.length === 0) return;
        const dtMs = (cursors.x2 - cursors.x1) * timeDivMs * 10;
        const ch = channels[0];
        if (ch && ch.samples.length > 0) {
            const i1 = Math.floor(cursors.x1 * ch.samples.length);
            const i2 = Math.floor(cursors.x2 * ch.samples.length);
            const dV = (ch.samples[i2] - ch.samples[i1]) * 5; // assuming 5V full scale
            setMeasurements({ dtMs, dV });
        }
    }, [cursors, channels, timeDivMs, showCursors]);

    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        if (!showCursors || !canvasRef.current) return;
        const rect = canvasRef.current.getBoundingClientRect();
        const normX = (e.clientX - rect.left) / rect.width;
        const d1 = Math.abs(normX - cursors.x1);
        const d2 = Math.abs(normX - cursors.x2);
        setCursors(c => ({ ...c, dragging: d1 < d2 ? 1 : 2 }));
    }, [showCursors, cursors]);

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        if (!cursors.dragging || !canvasRef.current) return;
        const rect = canvasRef.current.getBoundingClientRect();
        const normX = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        setCursors(c => c.dragging === 1
            ? { ...c, x1: normX }
            : { ...c, x2: normX }
        );
    }, [cursors.dragging]);

    const handleMouseUp = useCallback(() => {
        setCursors(c => ({ ...c, dragging: null }));
    }, []);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0, width: '100%' }}>
            <canvas
                ref={canvasRef}
                style={{
                    width: '100%', height,
                    display: 'block',
                    cursor: showCursors ? 'col-resize' : 'default',
                    borderRadius: 2,
                    border: '1px solid rgba(0,212,255,0.12)',
                }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
            />
            {showCursors && (
                <div style={{
                    display: 'flex', gap: 24, padding: '6px 10px',
                    fontFamily: T.mono, fontSize: 8, color: T.text,
                    background: 'rgba(0,0,0,0.3)', borderRadius: '0 0 2px 2px',
                }}>
                    <span>Δt = <span style={{ color: '#00D4FF' }}>{measurements.dtMs.toFixed(2)}ms</span></span>
                    <span>ΔV = <span style={{ color: '#F59E0B' }}>{measurements.dV.toFixed(3)}V</span></span>
                </div>
            )}
        </div>
    );
}

// ─── Canvas Draw Helpers ──────────────────────────────────────────────────────

function drawGrid(ctx: CanvasRenderingContext2D, W: number, H: number) {
    const DIVS_X = 10;
    const DIVS_Y = 8;
    ctx.lineWidth = 0.5;

    for (let i = 0; i <= DIVS_X; i++) {
        const x = (i / DIVS_X) * W;
        ctx.strokeStyle = i === DIVS_X / 2 ? T.gridMajor : T.grid;
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
    }
    for (let i = 0; i <= DIVS_Y; i++) {
        const y = (i / DIVS_Y) * H;
        ctx.strokeStyle = i === DIVS_Y / 2 ? T.gridMajor : T.grid;
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }
}

function drawChannel(
    ctx: CanvasRenderingContext2D,
    ch: OscChannel,
    W: number, H: number,
    color: string,
) {
    const { samples, writeHead } = ch;
    if (!samples || samples.length === 0) return;

    const cap = samples.length;
    const total = Math.min(writeHead, cap);
    if (total < 2) return;

    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    ctx.shadowColor = color;
    ctx.shadowBlur = 4;

    ctx.beginPath();
    for (let i = 0; i < W; i++) {
        const sampleIdx = ((writeHead - W + i) % cap + cap) % cap;
        const v = samples[sampleIdx];
        const x = i;
        const y = H - v * H;
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.shadowBlur = 0;
}
