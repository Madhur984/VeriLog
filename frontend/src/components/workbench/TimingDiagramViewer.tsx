/**
 * TimingDiagramViewer.tsx — Multi-channel waveform timing diagram
 *
 * Professional-grade timing diagram viewer with:
 * - Multiple signal channels (stacked vertically)
 * - Measurement cursors (drag to measure time deltas)
 * - Zoom/pan controls
 * - Color-coded signal levels
 * - Time ruler with grid
 */

import { useState, useRef, useCallback, useMemo, memo } from 'react';
import type { WaveformChannel } from './WaveformExporter';

interface TimingDiagramViewerProps {
    channels: WaveformChannel[];
    currentTimeNs: number;
}

const CHANNEL_HEIGHT = 40;
const LABEL_WIDTH = 100;
const RULER_HEIGHT = 24;
const COLORS = ['#00D4FF', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'];

export const TimingDiagramViewer = memo(({ channels, currentTimeNs }: TimingDiagramViewerProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [zoom, setZoom] = useState(1);
    const [panX, setPanX] = useState(0);
    const [cursorA, setCursorA] = useState<number | null>(null);
    const [cursorB, setCursorB] = useState<number | null>(null);
    const [isDragging, setIsDragging] = useState<'a' | 'b' | null>(null);

    // Time range
    const timeRange = useMemo(() => {
        let maxTime = 1000;
        for (const ch of channels) {
            for (const s of ch.samples) {
                if (s.time > maxTime) maxTime = s.time;
            }
        }
        return { min: 0, max: maxTime * 1.1 };
    }, [channels]);

    const totalWidth = useMemo(() => {
        return Math.max(600, (timeRange.max - timeRange.min) * zoom);
    }, [timeRange, zoom]);

    const totalHeight = channels.length * CHANNEL_HEIGHT + RULER_HEIGHT;

    // Time to X coordinate
    const timeToX = useCallback((t: number) => {
        return LABEL_WIDTH + ((t - timeRange.min) / (timeRange.max - timeRange.min)) * (totalWidth - LABEL_WIDTH) + panX;
    }, [timeRange, totalWidth, panX]);

    // X to time
    const xToTime = useCallback((x: number) => {
        return ((x - LABEL_WIDTH - panX) / (totalWidth - LABEL_WIDTH)) * (timeRange.max - timeRange.min) + timeRange.min;
    }, [timeRange, totalWidth, panX]);

    // Handle mouse interactions
    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const time = xToTime(x);

        if (e.shiftKey) {
            setCursorB(Math.max(0, time));
            setIsDragging('b');
        } else {
            setCursorA(Math.max(0, time));
            setIsDragging('a');
        }
    }, [xToTime]);

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        if (!isDragging) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const time = Math.max(0, xToTime(x));

        if (isDragging === 'a') setCursorA(time);
        else setCursorB(time);
    }, [isDragging, xToTime]);

    const handleMouseUp = useCallback(() => setIsDragging(null), []);

    // Zoom controls
    const zoomIn = useCallback(() => setZoom(z => Math.min(z * 1.5, 20)), []);
    const zoomOut = useCallback(() => setZoom(z => Math.max(z / 1.5, 0.1)), []);
    const zoomFit = useCallback(() => { setZoom(1); setPanX(0); }, []);

    const cursorDelta = cursorA !== null && cursorB !== null ? Math.abs(cursorB - cursorA) : null;

    return (
        <div style={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 11,
            background: 'rgba(0, 0, 0, 0.2)',
        }}>
            {/* Toolbar */}
            <div style={{
                display: 'flex',
                gap: 4,
                padding: '3px 8px',
                borderBottom: '1px solid rgba(0, 212, 255, 0.06)',
                alignItems: 'center',
            }}>
                <button onClick={zoomIn} style={toolBtnStyle}>🔍+</button>
                <button onClick={zoomOut} style={toolBtnStyle}>🔍-</button>
                <button onClick={zoomFit} style={toolBtnStyle}>Fit</button>

                <div style={{ width: 1, height: 12, background: 'rgba(0, 212, 255, 0.08)', margin: '0 4px' }} />

                <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: 9 }}>
                    Click to set cursor A, Shift+Click for cursor B
                </span>

                <span style={{ flex: 1 }} />

                {cursorDelta !== null && (
                    <span style={{
                        color: '#F59E0B',
                        fontSize: 10,
                        padding: '1px 6px',
                        background: 'rgba(245, 158, 11, 0.08)',
                        borderRadius: 2,
                    }}>
                        Δt = {cursorDelta.toFixed(1)}ns
                    </span>
                )}
            </div>

            {/* Waveform Area */}
            <div
                ref={containerRef}
                style={{ flex: 1, overflow: 'auto', cursor: isDragging ? 'col-resize' : 'crosshair' }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
            >
                <svg width={totalWidth} height={totalHeight} viewBox={`0 0 ${totalWidth} ${totalHeight}`}>
                    {/* Time Ruler */}
                    <TimeRuler
                        width={totalWidth}
                        timeRange={timeRange}
                        timeToX={timeToX}
                    />

                    {/* Channels */}
                    {channels.map((ch, i) => (
                        <WaveformRow
                            key={`${ch.nodeId}-${ch.portIndex}`}
                            channel={ch}
                            y={RULER_HEIGHT + i * CHANNEL_HEIGHT}
                            height={CHANNEL_HEIGHT}
                            color={COLORS[i % COLORS.length]}
                            timeToX={timeToX}
                            timeRange={timeRange}
                        />
                    ))}

                    {/* Current Time Marker */}
                    <line
                        x1={timeToX(currentTimeNs)}
                        y1={0}
                        x2={timeToX(currentTimeNs)}
                        y2={totalHeight}
                        stroke="#00D4FF"
                        strokeWidth={1}
                        strokeDasharray="3,3"
                        opacity={0.4}
                    />

                    {/* Cursor A */}
                    {cursorA !== null && (
                        <line
                            x1={timeToX(cursorA)}
                            y1={0}
                            x2={timeToX(cursorA)}
                            y2={totalHeight}
                            stroke="#F59E0B"
                            strokeWidth={1}
                            opacity={0.6}
                        />
                    )}

                    {/* Cursor B */}
                    {cursorB !== null && (
                        <line
                            x1={timeToX(cursorB)}
                            y1={0}
                            x2={timeToX(cursorB)}
                            y2={totalHeight}
                            stroke="#EF4444"
                            strokeWidth={1}
                            opacity={0.6}
                        />
                    )}

                    {/* Delta region */}
                    {cursorA !== null && cursorB !== null && (
                        <rect
                            x={Math.min(timeToX(cursorA), timeToX(cursorB))}
                            y={0}
                            width={Math.abs(timeToX(cursorB) - timeToX(cursorA))}
                            height={totalHeight}
                            fill="rgba(245, 158, 11, 0.04)"
                        />
                    )}
                </svg>
            </div>
        </div>
    );
});

TimingDiagramViewer.displayName = 'TimingDiagramViewer';

// ─── Time Ruler ──────────────────────────────────────────────────────────

const TimeRuler = memo(({ width, timeRange, timeToX }: {
    width: number;
    timeRange: { min: number; max: number };
    timeToX: (t: number) => number;
}) => {
    const ticks = useMemo(() => {
        const range = timeRange.max - timeRange.min;
        const step = getNiceStep(range);
        const result: number[] = [];
        let t = Math.ceil(timeRange.min / step) * step;
        while (t <= timeRange.max) {
            result.push(t);
            t += step;
        }
        return result;
    }, [timeRange]);

    return (
        <g>
            <rect x={0} y={0} width={width} height={RULER_HEIGHT} fill="rgba(0, 0, 0, 0.3)" />
            <line x1={LABEL_WIDTH} y1={RULER_HEIGHT} x2={width} y2={RULER_HEIGHT} stroke="rgba(0, 212, 255, 0.1)" />

            {ticks.map(t => (
                <g key={t}>
                    <line
                        x1={timeToX(t)} y1={RULER_HEIGHT - 6}
                        x2={timeToX(t)} y2={RULER_HEIGHT}
                        stroke="rgba(0, 212, 255, 0.2)"
                    />
                    <text
                        x={timeToX(t)} y={RULER_HEIGHT - 8}
                        textAnchor="middle"
                        fill="rgba(255,255,255,0.25)"
                        fontSize={8}
                        fontFamily="'IBM Plex Mono', monospace"
                    >
                        {t}ns
                    </text>
                </g>
            ))}

            <text x={4} y={RULER_HEIGHT - 8} fill="rgba(0, 212, 255, 0.3)" fontSize={8} fontFamily="'IBM Plex Mono', monospace">
                TIME
            </text>
        </g>
    );
});

TimeRuler.displayName = 'TimeRuler';

// ─── Waveform Row ───────────────────────────────────────────────────────

const WaveformRow = memo(({ channel, y, height, color, timeToX, timeRange }: {
    channel: WaveformChannel;
    y: number;
    height: number;
    color: string;
    timeToX: (t: number) => number;
    timeRange: { min: number; max: number };
}) => {
    const pathD = useMemo(() => {
        if (channel.samples.length === 0) return '';
        const padding = 4;
        const highY = y + padding;
        const lowY = y + height - padding;

        let d = '';
        for (let i = 0; i < channel.samples.length; i++) {
            const s = channel.samples[i];
            const x = timeToX(s.time);
            const sy = s.logic ? highY : lowY;

            if (i === 0) {
                d += `M${x},${sy}`;
            } else {
                // Step waveform (horizontal then vertical for digital signals)
                const prevY = channel.samples[i - 1].logic ? highY : lowY;
                d += ` L${x},${prevY} L${x},${sy}`;
            }
        }

        // Extend to end of time range
        const lastSample = channel.samples[channel.samples.length - 1];
        const endX = timeToX(timeRange.max);
        const lastY = lastSample.logic ? highY : lowY;
        d += ` L${endX},${lastY}`;

        return d;
    }, [channel.samples, y, height, timeToX, timeRange.max]);

    return (
        <g>
            {/* Background */}
            <rect x={0} y={y} width={LABEL_WIDTH} height={height} fill="rgba(0, 0, 0, 0.2)" />
            <rect x={LABEL_WIDTH} y={y} width="100%" height={height} fill="transparent" />
            <line x1={LABEL_WIDTH} y1={y + height} x2="100%" y2={y + height} stroke="rgba(255,255,255,0.03)" />

            {/* Label */}
            <text x={8} y={y + height / 2} dominantBaseline="central" fill={color} fontSize={10} fontFamily="'IBM Plex Mono', monospace" opacity={0.7}>
                {channel.name}
            </text>

            {/* Waveform */}
            {pathD && (
                <path d={pathD} fill="none" stroke={color} strokeWidth={1.5} opacity={0.8} />
            )}
        </g>
    );
});

WaveformRow.displayName = 'WaveformRow';

// ─── Helpers ────────────────────────────────────────────────────────────

function getNiceStep(range: number): number {
    const rough = range / 10;
    const magnitude = Math.pow(10, Math.floor(Math.log10(rough)));
    const residual = rough / magnitude;
    if (residual <= 1) return magnitude;
    if (residual <= 2) return 2 * magnitude;
    if (residual <= 5) return 5 * magnitude;
    return 10 * magnitude;
}

// ─── Styles ─────────────────────────────────────────────────────────────

const toolBtnStyle: React.CSSProperties = {
    background: 'rgba(0, 212, 255, 0.04)',
    border: '1px solid rgba(0, 212, 255, 0.1)',
    color: 'rgba(255,255,255,0.4)',
    fontSize: 9,
    padding: '2px 6px',
    borderRadius: 2,
    cursor: 'pointer',
    fontFamily: "'IBM Plex Mono', monospace",
};
