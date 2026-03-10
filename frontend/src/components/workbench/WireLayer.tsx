/**
 * components/workbench/WireLayer.tsx — Circuit Wire Renderer
 *
 * Renders all wires as Manhattan-routed SVG paths.
 * Animates a dot along live (HIGH) wires.
 * Handles wire-in-progress (ghost wire while drawing).
 */

import React, { useMemo } from 'react';
import { useWorkbenchStore, type WireData } from '../../stores/useWorkbenchStore';
import { GATE_SHAPES, getPortPosition } from '../../engine/GateSVGShapes';

const COLOR_HIGH = '#10B981';
const COLOR_LOW = '#334155';
const COLOR_SELECT = '#00D4FF';

// ── Port World Position ───────────────────────────────────────────────────

function portWorldPos(nodeId: string, portIndex: number, nodes: ReturnType<typeof useWorkbenchStore.getState>['nodes']): { x: number; y: number } | null {
    const node = nodes.get(nodeId);
    if (!node) return null;
    const shape = GATE_SHAPES[node.type] ?? GATE_SHAPES['AND'];
    if (portIndex >= shape.ports.length) return null;
    const portDef = shape.ports[portIndex];
    const local = getPortPosition(shape, portDef);

    // Apply stub offset (same as CanvasNode renders the dot)
    let sx = local.x, sy = local.y;
    if (portDef.side === 'left') sx -= 8;
    if (portDef.side === 'right') sx += 8;
    if (portDef.side === 'top') sy -= 8;
    if (portDef.side === 'bottom') sy += 8;

    return { x: node.x + sx, y: node.y + sy };
}

// ── Manhattan Routing ─────────────────────────────────────────────────────

function manhattanPath(ax: number, ay: number, bx: number, by: number): string {
    const mx = (ax + bx) / 2;
    return `M${ax},${ay} L${mx},${ay} L${mx},${by} L${bx},${by}`;
}

// ── Wire Component ────────────────────────────────────────────────────────

interface WirePathProps {
    wire: WireData;
    selected: boolean;
    nodes: ReturnType<typeof useWorkbenchStore.getState>['nodes'];
    onWireClick: (id: string) => void;
}

const WirePath: React.FC<WirePathProps> = ({ wire, selected, nodes, onWireClick }) => {
    const from = portWorldPos(wire.from.nodeId, wire.from.portIndex, nodes);
    const to = portWorldPos(wire.to.nodeId, wire.to.portIndex, nodes);
    if (!from || !to) return null;

    const d = manhattanPath(from.x, from.y, to.x, to.y);
    const color = selected ? COLOR_SELECT : wire.isLive ? COLOR_HIGH : COLOR_LOW;

    return (
        <g onClick={e => { e.stopPropagation(); onWireClick(wire.id); }}>
            {/* Invisible wider hit zone */}
            <path d={d} stroke="transparent" strokeWidth={12} fill="none" style={{ cursor: 'pointer' }} />

            {/* Wire stroke */}
            <path
                d={d}
                stroke={color}
                strokeWidth={1.5}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ transition: 'stroke 0.1s' }}
            />

            {/* Signal dot animation on HIGH */}
            {wire.isLive && (
                <circle r={3} fill={COLOR_HIGH}>
                    <animateMotion dur="1.2s" repeatCount="indefinite" path={d} />
                </circle>
            )}
        </g>
    );
};

// ── Ghost Wire (in-progress) ──────────────────────────────────────────────

const GhostWire: React.FC<{
    from: { nodeId: string; portIndex: number };
    mouseX: number;
    mouseY: number;
    nodes: ReturnType<typeof useWorkbenchStore.getState>['nodes'];
}> = ({ from, mouseX, mouseY, nodes }) => {
    const start = portWorldPos(from.nodeId, from.portIndex, nodes);
    if (!start) return null;
    const d = manhattanPath(start.x, start.y, mouseX, mouseY);
    return (
        <path
            d={d}
            stroke="#00D4FF"
            strokeWidth={1.5}
            strokeDasharray="5 3"
            fill="none"
            opacity={0.6}
            pointerEvents="none"
        />
    );
};

// ── WireLayer ─────────────────────────────────────────────────────────────

export const WireLayer: React.FC = () => {
    const { nodes, wires, selectedIds, selectWire, wireInProgress } = useWorkbenchStore();

    const wireArr = useMemo(() => Array.from(wires.values()), [wires]);

    return (
        <g className="wb-wire-layer">
            {wireArr.map(wire => (
                <WirePath
                    key={wire.id}
                    wire={wire}
                    selected={selectedIds.has(wire.id)}
                    nodes={nodes}
                    onWireClick={selectWire}
                />
            ))}

            {wireInProgress && (
                <GhostWire
                    from={wireInProgress.from}
                    mouseX={wireInProgress.mouseX}
                    mouseY={wireInProgress.mouseY}
                    nodes={nodes}
                />
            )}
        </g>
    );
};
