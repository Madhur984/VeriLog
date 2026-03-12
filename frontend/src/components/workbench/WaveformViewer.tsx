/**
 * components/workbench/WaveformViewer.tsx — Digital Logic Analyzer
 *
 * Renders digital waveforms using an HTML <canvas> element (not SVG) for performance.
 * Each probed signal gets its own row. Time axis in nanoseconds.
 * Supports zoom slider, crosshair inspection, play/pause from sim store.
 */

import React, { useRef, useEffect, useCallback, useState } from 'react';
import { useWorkbenchStore } from '../../stores/useWorkbenchStore';
import { LogicState } from '../../types/circuit';

const ROW_H = 36;
const LABEL_W = 110;
const AXIS_H = 24;
const HIGH_Y = 8;
const LOW_Y = 26;
const SIGNAL_H = 16;

interface CrosshairState {
    x: number;
    visible: boolean;
    timeNs: number;
}

export const WaveformViewer: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [xZoom, setXZoom] = useState(1);
    const [crosshair, setCrosshair] = useState<CrosshairState>({ x: 0, visible: false, timeNs: 0 });

    const { probes, waveformData, simRunning, simTimeNs, setSimRunning, resetSim } = useWorkbenchStore();

    // ── Draw ──────────────────────────────────────────────────────────────

    const draw = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const W = canvas.width;
        const H = canvas.height;
        const drawW = W - LABEL_W;

        ctx.clearRect(0, 0, W, H);

        // Background
        ctx.fillStyle = '#07080C';
        ctx.fillRect(0, 0, W, H);

        // Label column bg
        ctx.fillStyle = '#0D0F16';
        ctx.fillRect(0, 0, LABEL_W, H);

        // Separator
        ctx.strokeStyle = '#1A1D24';
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(LABEL_W, 0); ctx.lineTo(LABEL_W, H); ctx.stroke();

        // Time axis
        ctx.fillStyle = '#111318';
        ctx.fillRect(LABEL_W, 0, drawW, AXIS_H);
        ctx.strokeStyle = '#1A1D24';
        ctx.beginPath(); ctx.moveTo(LABEL_W, AXIS_H); ctx.lineTo(W, AXIS_H); ctx.stroke();

        const totalTimeNs = simTimeNs || 1000;
        const nsPerPx = totalTimeNs / (drawW * xZoom);

        // Major ticks
        const tickInterval = Math.pow(10, Math.floor(Math.log10(nsPerPx * 60)));
        ctx.fillStyle = '#475569';
        ctx.font = '9px JetBrains Mono, monospace';
        ctx.textAlign = 'center';

        for (let t = 0; t <= totalTimeNs; t += tickInterval) {
            const px = LABEL_W + (t / nsPerPx);
            if (px > W) break;
            ctx.strokeStyle = '#1A1D24';
            ctx.lineWidth = 0.5;
            ctx.beginPath(); ctx.moveTo(px, AXIS_H - 4); ctx.lineTo(px, AXIS_H); ctx.stroke();
            ctx.fillText(`${t}ns`, px, AXIS_H - 6);
        }

        // Rows
        probes.forEach((probe, rowIdx) => {
            const samples = waveformData[probe.nodeId] ?? [];
            const rowTop = AXIS_H + rowIdx * ROW_H;

            // Row bg alternating
            ctx.fillStyle = rowIdx % 2 === 0 ? '#0B0D13' : '#0D0F16';
            ctx.fillRect(LABEL_W, rowTop, drawW, ROW_H);

            // Row separator
            ctx.strokeStyle = '#1A1D24';
            ctx.lineWidth = 0.5;
            ctx.beginPath(); ctx.moveTo(0, rowTop + ROW_H); ctx.lineTo(W, rowTop + ROW_H); ctx.stroke();

            // Label
            ctx.fillStyle = probe.color;
            ctx.font = 'bold 10px JetBrains Mono, monospace';
            ctx.textAlign = 'left';
            ctx.fillText(probe.label, 8, rowTop + ROW_H / 2 + 4);

            // Signal trace
            if (samples.length < 1) return;

            ctx.strokeStyle = probe.color;
            ctx.lineWidth = 1.5;
            ctx.beginPath();

            const toX = (ns: number) => LABEL_W + ns / nsPerPx;
            const toY = (logic: boolean) => rowTop + (logic ? HIGH_Y : LOW_Y);
            const isHigh = (val: LogicState | LogicState[]) => Array.isArray(val) ? val[0] === 1 : val === 1;

            let prevX = toX(samples[0].timeNs);
            let prevY = toY(isHigh(samples[0].value));
            ctx.moveTo(prevX, prevY);

            for (let i = 1; i < samples.length; i++) {
                const s = samples[i];
                const x = toX(s.timeNs);
                const y = toY(isHigh(s.value));
                if (y !== prevY) {
                    ctx.lineTo(prevX, y);   // vertical edge
                }
                ctx.lineTo(x, y);
                prevX = x; prevY = y;
            }
            ctx.lineTo(toX(simTimeNs), prevY);
            ctx.stroke();

            // Shaded HIGH regions
            ctx.fillStyle = probe.color + '18';
            ctx.beginPath();
            let inHigh = false;
            let highStart = 0;

            for (let i = 0; i < samples.length; i++) {
                const x = toX(samples[i].timeNs);
                const isHighResult = isHigh(samples[i].value);
                if (isHighResult && !inHigh) { inHigh = true; highStart = x; }
                if (!isHighResult && inHigh) {
                    ctx.rect(highStart, rowTop + HIGH_Y, x - highStart, SIGNAL_H);
                    inHigh = false;
                }
            }
            if (inHigh) ctx.rect(highStart, rowTop + HIGH_Y, toX(simTimeNs) - highStart, SIGNAL_H);
            ctx.fill();
        });

        // Crosshair
        if (crosshair.visible) {
            ctx.strokeStyle = '#00D4FF40';
            ctx.lineWidth = 1;
            ctx.setLineDash([4, 4]);
            ctx.beginPath(); ctx.moveTo(crosshair.x, 0); ctx.lineTo(crosshair.x, H); ctx.stroke();
            ctx.setLineDash([]);

            ctx.fillStyle = '#00D4FF';
            ctx.font = '9px JetBrains Mono, monospace';
            ctx.textAlign = 'left';
            ctx.fillText(`${crosshair.timeNs.toFixed(0)}ns`, crosshair.x + 4, 14);
        }

        // Empty hint
        if (probes.length === 0) {
            ctx.fillStyle = '#1E293B';
            ctx.font = '11px JetBrains Mono, monospace';
            ctx.textAlign = 'center';
            ctx.fillText('Right-click a node on canvas → Add Probe', W / 2, H / 2 + 4);
        }
    }, [probes, waveformData, simTimeNs, xZoom, crosshair]);

    useEffect(() => { draw(); }, [draw]);

    // ── Resize canvas ─────────────────────────────────────────────────────

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;
        const obs = new ResizeObserver(() => {
            const canvas = canvasRef.current;
            if (!canvas) return;
            canvas.width = el.clientWidth;
            canvas.height = el.clientHeight;
            draw();
        });
        obs.observe(el);
        return () => obs.disconnect();
    }, [draw]);

    // ── Mouse crosshair ───────────────────────────────────────────────────

    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
        const rect = canvasRef.current!.getBoundingClientRect();
        const x = e.clientX - rect.left;
        if (x < LABEL_W) { setCrosshair(c => ({ ...c, visible: false })); return; }
        const drawW = (canvasRef.current?.width ?? 800) - LABEL_W;
        const totalTimeNs = simTimeNs || 1000;
        const nsPerPx = totalTimeNs / (drawW * xZoom);
        const timeNs = (x - LABEL_W) * nsPerPx;
        setCrosshair({ x, visible: true, timeNs });
    }, [simTimeNs, xZoom]);

    return (
        <div ref={containerRef} style={{ width: '100%', height: '100%', background: '#07080C', display: 'flex', flexDirection: 'column' }}>
            {/* Controls bar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 12px', borderBottom: '1px solid #1A1D24', background: '#0D0F16', flexShrink: 0, height: 36 }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    Waveform
                </span>
                <div style={{ width: 1, height: 12, background: '#1E293B' }} />
                <button onClick={() => setSimRunning(!simRunning)} style={btnStyle}>
                    {simRunning ? '⏸' : '▶'}
                </button>
                <button onClick={() => resetSim()} style={btnStyle}>⏹</button>
                <div style={{ width: 1, height: 12, background: '#1E293B' }} />
                <span style={{ fontSize: 10, color: '#475569', fontFamily: "'JetBrains Mono', monospace" }}>
                    Zoom:
                </span>
                <input
                    type="range" min={0.5} max={8} step={0.1} value={xZoom}
                    onChange={e => setXZoom(parseFloat(e.target.value))}
                    style={{ width: 80, accentColor: '#00D4FF' }}
                />
                <span style={{ fontSize: 10, color: '#00D4FF', fontFamily: "'JetBrains Mono', monospace", minWidth: 30 }}>
                    {xZoom.toFixed(1)}×
                </span>
                <div style={{ flex: 1 }} />
                <span style={{ fontSize: 10, color: '#475569', fontFamily: "'JetBrains Mono', monospace" }}>
                    t = {simTimeNs}ns
                </span>
                {crosshair.visible && (
                    <span style={{ fontSize: 10, color: '#00D4FF', fontFamily: "'JetBrains Mono', monospace" }}>
                        cursor: {crosshair.timeNs.toFixed(0)}ns
                    </span>
                )}
            </div>

            {/* Canvas */}
            <canvas
                ref={canvasRef}
                style={{ flex: 1, display: 'block' }}
                onMouseMove={handleMouseMove}
                onMouseLeave={() => setCrosshair(c => ({ ...c, visible: false }))}
            />
        </div>
    );
};

const btnStyle: React.CSSProperties = {
    background: 'none', border: '1px solid #1A1D24', borderRadius: 4,
    color: '#64748B', cursor: 'pointer', padding: '2px 8px', fontSize: 12,
};
