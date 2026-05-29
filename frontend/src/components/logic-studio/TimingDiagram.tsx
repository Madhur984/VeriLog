/**
 * TimingDiagram.tsx - Multi-channel signal trace renderer
 *
 * Reads traces from MUREEngine and renders them as waveforms.
 */

import { useMemo } from 'react';

interface TracePoint {
    time: number;
    value: number;
}

interface Channel {
    label: string;
    trace: TracePoint[];
    isDigital: boolean;
}

interface Props {
    channels: Channel[];
    currentTime: number;
    width?: number;
    height?: number;
}

const CHANNEL_H = 48;
const MARGIN = { top: 8, right: 20, bottom: 24, left: 60 };

export function TimingDiagram({ channels, currentTime, width = 600, height: _h }: Props) {
    const height = channels.length * CHANNEL_H + MARGIN.top + MARGIN.bottom;
    const plotW = width - MARGIN.left - MARGIN.right;

    // Time range from all traces
    const timeRange = useMemo(() => {
        let minT = Infinity, maxT = -Infinity;
        for (const ch of channels) {
            for (const pt of ch.trace) {
                if (pt.time < minT) minT = pt.time;
                if (pt.time > maxT) maxT = pt.time;
            }
        }
        if (!isFinite(minT)) { minT = 0; maxT = 1000; }
        return { min: minT, max: Math.max(maxT, minT + 100) };
    }, [channels]);

    const timeToX = (t: number) => {
        return MARGIN.left + ((t - timeRange.min) / (timeRange.max - timeRange.min)) * plotW;
    };

    const cursorX = timeToX(currentTime);

    return (
        <div className="studio-timing-wrapper">
            <svg
                width={width}
                height={height}
                viewBox={`0 0 ${width} ${height}`}
                className="studio-timing-svg"
            >
                {/* Channel backgrounds */}
                {channels.map((ch, i) => {
                    const y = MARGIN.top + i * CHANNEL_H;
                    return (
                        <g key={i}>
                            {/* Background stripe */}
                            <rect
                                x={MARGIN.left}
                                y={y}
                                width={plotW}
                                height={CHANNEL_H}
                                fill={i % 2 === 0 ? 'rgba(0, 212, 255, 0.02)' : 'transparent'}
                            />

                            {/* Label */}
                            <text
                                x={MARGIN.left - 8}
                                y={y + CHANNEL_H / 2}
                                textAnchor="end"
                                dominantBaseline="central"
                                fontSize="9"
                                fontFamily="'IBM Plex Mono', monospace"
                                fill="#64748B"
                            >
                                {ch.label}
                            </text>

                            {/* Waveform */}
                            {ch.trace.length > 1 && (
                                <path
                                    d={buildWaveformPath(ch, y, CHANNEL_H, timeToX)}
                                    stroke={ch.isDigital ? '#10B981' : '#00D4FF'}
                                    strokeWidth={ch.isDigital ? 2 : 1.5}
                                    fill="none"
                                    strokeLinejoin={ch.isDigital ? 'miter' : 'round'}
                                />
                            )}
                        </g>
                    );
                })}

                {/* Time cursor */}
                <line
                    x1={cursorX}
                    y1={MARGIN.top}
                    x2={cursorX}
                    y2={height - MARGIN.bottom}
                    stroke="#F59E0B"
                    strokeWidth="1"
                    strokeDasharray="4 2"
                    opacity="0.7"
                />

                {/* Time axis */}
                <line
                    x1={MARGIN.left}
                    y1={height - MARGIN.bottom}
                    x2={width - MARGIN.right}
                    y2={height - MARGIN.bottom}
                    stroke="rgba(100, 116, 139, 0.3)"
                    strokeWidth="1"
                />
            </svg>
        </div>
    );
}

// ─── Helpers ────────────────────────────────────────────────────────────

function buildWaveformPath(
    ch: Channel,
    baseY: number,
    channelH: number,
    timeToX: (t: number) => number
): string {
    const padY = 6;
    const highY = baseY + padY;
    const lowY = baseY + channelH - padY;

    const parts: string[] = [];

    for (let i = 0; i < ch.trace.length; i++) {
        const pt = ch.trace[i];
        const x = timeToX(pt.time);

        if (ch.isDigital) {
            const y = pt.value > 0.5 ? highY : lowY;
            if (i === 0) {
                parts.push(`M${x},${y}`);
            } else {
                const prevY = ch.trace[i - 1].value > 0.5 ? highY : lowY;
                if (prevY !== y) {
                    parts.push(`L${x},${prevY}`);
                }
                parts.push(`L${x},${y}`);
            }
        } else {
            // Analog: map 0-5V to lowY-highY
            const range = lowY - highY;
            const y = lowY - (pt.value / 5) * range;
            parts.push(i === 0 ? `M${x},${y}` : `L${x},${y}`);
        }
    }

    return parts.join(' ');
}
