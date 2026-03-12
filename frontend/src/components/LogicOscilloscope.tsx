/**
 * components/LogicOscilloscope.tsx
 * 
 * SVG/Canvas hybrid renderer for the LogicOscilloscopeEngine waveforms.
 * Supports pan/zoom horizontally over time and multiple stacked traces.
 */

import React from 'react';
// import type { WaveformTrace } from '../engine/LogicOscilloscope';

// Stub for WaveformTrace
export type WaveformTrace = {
    signalId: string;
    label: string;
    color: string;
    history: number[];
};

interface LogicOscilloscopeProps {
    traces: WaveformTrace[];
    width?: number | string;
    height?: number;
    ticksVisible?: number;
}

const T = {
    bg: '#060C1A',
    card: '#0D0F16',
    border: '#1A1D24',
    grid: '#1A1D24',
    text: '#E5E7EB',
    muted: '#64748B',
    mono: "'IBM Plex Mono','Roboto Mono',monospace",
};

export const LogicOscilloscope: React.FC<LogicOscilloscopeProps> = ({
    traces,
    width = '100%',
    height = 200,
    ticksVisible = 50
}) => {

    // Default config per trace row
    const rowHeight = 40;
    const labelWidth = 60;
    const padding = 10;

    // We adjust the internal SVG height dynamically based on trace count
    const totalHeight = traces.length > 0 ? (traces.length * rowHeight) + (padding * 2) : height;

    // Generate SVG path for a square wave
    const renderWaveform = (history: number[], traceWidth: number, yOffset: number, color: string) => {
        // We only render the *last* N ticks based on ticksVisible to prevent squishing
        const visibleHistory = history.slice(-ticksVisible);

        const stepX = traceWidth / Math.max(1, visibleHistory.length - 1);
        const yHigh = yOffset + 5;
        const yLow = yOffset + rowHeight - 5;

        if (visibleHistory.length === 0) return null;

        let path = `M 0 ${visibleHistory[0] ? yHigh : yLow}`;

        for (let i = 1; i < visibleHistory.length; i++) {
            const prev = visibleHistory[i - 1];
            const curr = visibleHistory[i];
            const x = i * stepX;

            if (prev !== curr) {
                // Draw vertical transition
                path += ` L ${x} ${prev ? yHigh : yLow}`;
                path += ` L ${x} ${curr ? yHigh : yLow}`;
            } else {
                // Draw horizontal continuation
                path += ` L ${x} ${curr ? yHigh : yLow}`;
            }
        }

        return (
            <path
                d={path}
                fill="none"
                stroke={color}
                strokeWidth={2}
                style={{
                    filter: `drop-shadow(0 0 4px ${color}80)`
                }}
            />
        );
    };

    return (
        <div style={{
            width, height, background: T.bg, border: `1px solid ${T.border}`,
            borderRadius: 8, overflow: 'hidden', display: 'flex', flexDirection: 'column',
            fontFamily: T.mono, fontSize: 11
        }}>
            {/* Header / Toolbar */}
            <div style={{ background: T.card, borderBottom: `1px solid ${T.border}`, padding: '4px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: T.muted, textTransform: 'uppercase', fontSize: 10, letterSpacing: '0.1em' }}>Logic Analyzer</span>
                <span style={{ color: '#10B981', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981', boxShadow: '0 0 6px #10B981' }} />
                    LIVE
                </span>
            </div>

            {/* Canvas Area */}
            <div style={{ flex: 1, position: 'relative' }}>
                {traces.length === 0 ? (
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.muted }}>
                        No Probes Connected
                    </div>
                ) : (
                    <svg width="100%" height={totalHeight} style={{ display: 'block' }}>
                        <defs>
                            <pattern id="gridY" width={10} height={totalHeight} patternUnits="userSpaceOnUse">
                                <line x1="0" y1="0" x2="0" y2={totalHeight} stroke={T.grid} strokeWidth="1" strokeDasharray="2,2" />
                            </pattern>
                        </defs>

                        {/* Background Time Grid */}
                        <rect x={labelWidth} y="0" width={`calc(100% - ${labelWidth}px)`} height="100%" fill="url(#gridY)" />

                        {traces.map((trace, idx) => {
                            const yOffset = padding + (idx * rowHeight);

                            return (
                                <g key={trace.signalId}>
                                    {/* Horizontal separator */}
                                    {idx > 0 && <line x1={0} y1={yOffset} x2="100%" y2={yOffset} stroke={T.border} strokeWidth={1} />}

                                    {/* Label Backdrop */}
                                    <rect x={0} y={yOffset} width={labelWidth} height={rowHeight} fill={T.card} />
                                    <text
                                        x={10} y={yOffset + rowHeight / 2}
                                        fill={trace.color}
                                        dominantBaseline="middle"
                                        fontWeight="bold"
                                    >
                                        {trace.label}
                                    </text>

                                    {/* Waveform renderer using SVG percentage width translation trick */}
                                    <svg x={labelWidth} y={0} width={`calc(100% - ${labelWidth}px)`} height="100%">
                                        {renderWaveform(trace.history, 1000, yOffset, trace.color)}
                                    </svg>
                                </g>
                            );
                        })}
                    </svg>
                )}
            </div>
        </div>
    );
};
