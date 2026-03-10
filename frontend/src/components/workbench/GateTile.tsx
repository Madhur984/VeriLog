/**
 * components/workbench/GateTile.tsx — Draggable Palette Tile
 *
 * Animated component tile with IEEE symbol, name, timing badge, and drag initiation.
 */

import React, { useCallback, useRef } from 'react';

export interface GateTileProps {
    typeId: string;
    label: string;
    symbol: string;
    color: string;
    tpdHL?: number;
    tpdLH?: number;
    description?: string;
    onDragStart: (typeId: string, e: React.DragEvent) => void;
}

export const GateTile: React.FC<GateTileProps> = ({
    typeId, label, symbol, color, tpdHL, tpdLH, description, onDragStart,
}) => {
    const ref = useRef<HTMLDivElement>(null);

    const handleDragStart = useCallback((e: React.DragEvent) => {
        e.dataTransfer.setData('application/verilog-gate', typeId);
        e.dataTransfer.effectAllowed = 'copy';
        onDragStart(typeId, e);
    }, [typeId, onDragStart]);

    const hasTiming = tpdHL !== undefined && tpdLH !== undefined;

    return (
        <div
            ref={ref}
            draggable
            onDragStart={handleDragStart}
            title={description}
            style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '8px 10px',
                borderRadius: 6,
                cursor: 'grab',
                border: '1px solid transparent',
                transition: 'all 0.15s ease',
                userSelect: 'none',
            }}
            onMouseEnter={e => {
                (e.currentTarget as HTMLDivElement).style.background = `rgba(${hexToRgb(color)}, 0.08)`;
                (e.currentTarget as HTMLDivElement).style.borderColor = `rgba(${hexToRgb(color)}, 0.3)`;
            }}
            onMouseLeave={e => {
                (e.currentTarget as HTMLDivElement).style.background = 'transparent';
                (e.currentTarget as HTMLDivElement).style.borderColor = 'transparent';
            }}
        >
            {/* IEEE Symbol Badge */}
            <div style={{
                width: 36, height: 28,
                background: `rgba(${hexToRgb(color)}, 0.1)`,
                border: `1px solid ${color}40`,
                borderRadius: 4,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 12, fontWeight: 700,
                color, flexShrink: 0,
            }}>
                {symbol}
            </div>

            {/* Name + timing */}
            <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#E5E7EB', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {label}
                </div>
                {hasTiming && (
                    <div style={{ fontSize: 9, color: '#475569', fontFamily: "'JetBrains Mono', monospace", marginTop: 1 }}>
                        ↓{tpdHL}ns ↑{tpdLH}ns
                    </div>
                )}
            </div>

            {/* Drag handle dot */}
            <div style={{ color: '#334155', fontSize: 14, flexShrink: 0 }}>⠿</div>
        </div>
    );
};

function hexToRgb(hex: string): string {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return '255,255,255';
    return `${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(result[3], 16)}`;
}
