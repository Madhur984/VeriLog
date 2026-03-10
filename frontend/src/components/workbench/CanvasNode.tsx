/**
 * components/workbench/CanvasNode.tsx — Single Gate Renderer
 *
 * Renders one component on the SVG canvas:
 *  - IEEE rectangular body via GateSVGShapes
 *  - Port circles with live signal coloring
 *  - Selection ring
 *  - Rotation handle
 *  - NOT bubbles
 */

import React, { useCallback } from 'react';
import { useWorkbenchStore, type CanvasNodeData, type PortRef } from '../../stores/useWorkbenchStore';
import { GATE_SHAPES, getPortPosition } from '../../engine/GateSVGShapes';
import type { PortState } from '../../engine/types';

interface Props {
    node: CanvasNodeData;
    portStates: PortState[];
    tool: 'select' | 'wire' | 'probe' | 'delete';
    onWireStart: (ref: PortRef) => void;
}

const SIG_GREEN = '#10B981';
const SIG_GREY = '#334155';
const SELECTED_COLOR = '#00D4FF';

export const CanvasNode: React.FC<Props> = ({ node, portStates, tool, onWireStart }) => {
    const { selectedIds, selectNode, removeNode, addProbe, rotateNode } = useWorkbenchStore();
    const isSelected = selectedIds.has(node.id);
    const shape = GATE_SHAPES[node.type] ?? GATE_SHAPES['AND'];

    const cx = shape.w / 2;
    const cy = shape.h / 2;

    // ── Event Handlers ───────────────────────────────────────────────────────

    const handleBodyClick = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        if (tool === 'delete') { removeNode(node.id); return; }
        if (tool === 'probe') { addProbe(node.id); return; }
        selectNode(node.id, e.shiftKey || e.metaKey);
    }, [tool, node.id, removeNode, addProbe, selectNode]);

    const handlePortClick = useCallback((e: React.MouseEvent, portIndex: number) => {
        e.stopPropagation();
        if (tool !== 'wire') return;
        onWireStart({ nodeId: node.id, portIndex });
    }, [tool, node.id, onWireStart]);

    const handleRotate = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        rotateNode(node.id);
    }, [node.id, rotateNode]);

    // ── Port Coloring ─────────────────────────────────────────────────────────

    const portColor = (portIndex: number): string => {
        const ps = portStates[portIndex];
        if (!ps) return SIG_GREY;
        if (ps.drive === 'float') return SIG_GREY;
        return ps.logic ? SIG_GREEN : SIG_GREY;
    };

    // ── Render ────────────────────────────────────────────────────────────────

    return (
        <g
            transform={`translate(${node.x}, ${node.y}) rotate(${node.rotation}, ${cx}, ${cy})`}
            style={{ cursor: tool === 'delete' ? 'crosshair' : tool === 'probe' ? 'cell' : 'pointer' }}
        >
            {/* Selection ring */}
            {isSelected && (
                <rect
                    x={-3} y={-3}
                    width={shape.w + 6} height={shape.h + 6}
                    rx={6} ry={6}
                    fill="none"
                    stroke={SELECTED_COLOR}
                    strokeWidth={1.5}
                    strokeDasharray="4 2"
                    opacity={0.8}
                />
            )}

            {/* Gate body */}
            <path
                d={shape.bodyPath}
                fill="#111318"
                stroke={isSelected ? SELECTED_COLOR : shape.color + '60'}
                strokeWidth={1.5}
                rx={4}
                onClick={handleBodyClick}
            />

            {/* IEEE qualifier symbol */}
            <text
                x={cx} y={cy + 4}
                textAnchor="middle"
                fill={shape.color}
                fontSize={10}
                fontFamily="'JetBrains Mono', monospace"
                fontWeight={700}
                pointerEvents="none"
            >
                {shape.symbol}
            </text>

            {/* NOT bubbles (inversion circles) */}
            {shape.bubbles?.map((b, i) => (
                <circle key={i} cx={b.x} cy={b.y} r={4} fill="#111318" stroke={shape.color} strokeWidth={1.5} />
            ))}

            {/* Port circles */}
            {shape.ports.map((portDef, i) => {
                const { x: px, y: py } = getPortPosition(shape, portDef);
                const pColor = portColor(i);

                return (
                    <g key={portDef.id} onClick={e => handlePortClick(e, i)}>
                        {/* Port stub line */}
                        <line
                            x1={px} y1={py}
                            x2={portDef.side === 'left' ? px - 8 : portDef.side === 'right' ? px + 8 : px}
                            y2={portDef.side === 'top' ? py - 8 : portDef.side === 'bottom' ? py + 8 : py}
                            stroke={pColor} strokeWidth={1.5}
                        />

                        {/* Port dot */}
                        <circle
                            cx={portDef.side === 'left' ? px - 8 : portDef.side === 'right' ? px + 8 : px}
                            cy={portDef.side === 'top' ? py - 8 : portDef.side === 'bottom' ? py + 8 : py}
                            r={4}
                            fill={pColor}
                            stroke="#0D0F16"
                            strokeWidth={1}
                            style={{ cursor: tool === 'wire' ? 'crosshair' : 'default', transition: 'fill 0.1s' }}
                        />

                        {/* Port label */}
                        <text
                            x={portDef.side === 'left' ? px - 14 : portDef.side === 'right' ? px + 14 : px}
                            y={py + 3}
                            textAnchor={portDef.side === 'left' ? 'end' : portDef.side === 'right' ? 'start' : 'middle'}
                            fill="#475569"
                            fontSize={8}
                            fontFamily="'JetBrains Mono', monospace"
                            pointerEvents="none"
                        >
                            {portDef.label}
                        </text>
                    </g>
                );
            })}

            {/* Node label (below body) */}
            <text
                x={cx} y={shape.h + 12}
                textAnchor="middle"
                fill="#64748B"
                fontSize={9}
                fontFamily="'JetBrains Mono', monospace"
                pointerEvents="none"
            >
                {node.label}
            </text>

            {/* Rotate handle (top-right, only when selected) */}
            {isSelected && (
                <g onClick={handleRotate} style={{ cursor: 'grab' }}>
                    <circle cx={shape.w + 10} cy={-10} r={8} fill="#1A1D24" stroke={SELECTED_COLOR} strokeWidth={1} />
                    <text x={shape.w + 10} y={-6} textAnchor="middle" fill={SELECTED_COLOR} fontSize={10} pointerEvents="none">↻</text>
                </g>
            )}
        </g>
    );
};
