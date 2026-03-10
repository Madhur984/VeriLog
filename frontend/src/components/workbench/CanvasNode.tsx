/**
 * components/workbench/CanvasNode.tsx
 *
 * Renders an individual component on the SVG canvas.
 * Uses the ComponentDef registry for shape, ports, and colors.
 */

import React, { useMemo, useCallback } from 'react';
import { useWorkbenchStore } from '../../stores/useWorkbenchStore';
import { getComponentDef } from '../../engine/ComponentDef';
import { getSvgPath, getPortPosition } from '../../engine/GateShapes';
import { wireColor, busLabel } from '../../engine/LogicValue';

interface Props {
    nodeId: string;
    tool: string;
    onWireStart: (portX: number, portY: number) => void;
}

export const CanvasNode: React.FC<Props> = ({ nodeId, tool, onWireStart }) => {
    const node = useWorkbenchStore(s => s.nodes.get(nodeId));
    const portStates = useWorkbenchStore(s => s.portStates.get(nodeId));
    const isSelected = useWorkbenchStore(s => s.selectedIds.has(nodeId));

    // Store actions
    const selectItem = useWorkbenchStore(s => s.selectItem);
    const addProbe = useWorkbenchStore(s => s.addProbe);
    const removeNode = useWorkbenchStore(s => s.removeNode);

    if (!node) return null;

    const def = getComponentDef(node.type);
    if (!def) return <g><text fill="red">Missing: {node.type}</text></g>;

    const ports = useMemo(() => def.ports(node.params), [def, node.params]);
    const shape = useMemo(() => def.shape(node.params), [def, node.params]);
    const svgPath = useMemo(() => getSvgPath(shape.style, shape.extras), [shape.style, shape.extras]);

    // Grid to Pixel multiplier
    const gridToPx = 10;
    const pxX = node.x * gridToPx;
    const pxY = node.y * gridToPx;

    const handleClick = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        if (tool === 'delete') {
            removeNode(node.id);
        } else {
            selectItem(node.id, e.shiftKey || e.metaKey);
        }
    }, [tool, node.id, selectItem, removeNode]);

    const handleContextMenu = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        // Add probe to specific port? If we right-click the body, probe all outputs.
        const outputPorts = ports.filter(p => p.direction === 'output');
        if (outputPorts.length > 0) {
            addProbe(node.id, outputPorts[0].id, `${node.label}.${outputPorts[0].id}`);
        } else {
            addProbe(node.id, ports[0].id, node.label);
        }
    }, [node.id, node.label, ports, addProbe]);

    const handlePortClick = useCallback((e: React.MouseEvent, portX: number, portY: number) => {
        e.stopPropagation();
        if (tool === 'wire') {
            // portX/portY are relative grids. We need absolute grid coordinates.
            // Rotation complicates this, but let's assume rotation=0 for now.
            // (Logisim handles rotations by transforming port coordinates).
            onWireStart(node.x + portX, node.y + portY);
        }
    }, [tool, node.x, node.y, onWireStart]);

    // Render 
    return (
        <g
            transform={`translate(${pxX}, ${pxY}) rotate(${node.rotation}, ${(shape.w * gridToPx) / 2}, ${(shape.h * gridToPx) / 2})`}
            style={{ cursor: tool === 'select' ? 'grab' : tool === 'delete' ? 'crosshair' : 'default' }}
            onClick={handleClick}
            onContextMenu={handleContextMenu}
        >
            {/* Selection Outline */}
            {isSelected && (
                <rect
                    x={-4} y={-4}
                    width={shape.w * gridToPx + 8} height={shape.h * gridToPx + 8}
                    fill="none" stroke="#00D4FF" strokeWidth={2} strokeDasharray="4 4"
                    rx={4}
                />
            )}

            {/* Component Body */}
            {shape.style === 'custom' ? (
                // Used for boxes like Flip-Flops, MUX
                <rect
                    x={0} y={0}
                    width={shape.w * gridToPx} height={shape.h * gridToPx}
                    fill="#1E293B" stroke={shape.color} strokeWidth={2}
                />
            ) : (
                // Gates (AND, OR, NOT)
                <path
                    d={svgPath}
                    fill="#1E293B" stroke={shape.color} strokeWidth={2}
                />
            )}

            {/* Symbol / Name inside body */}
            <text
                x={(shape.w * gridToPx) / 2}
                y={(shape.h * gridToPx) / 2}
                fill="#F8FAFC" fontSize={14} fontWeight="bold"
                textAnchor="middle" dominantBaseline="middle"
                pointerEvents="none"
            >
                {shape.symbol}
            </text>

            {/* Ports */}
            {ports.map(port => {
                const { x: px, y: py, length } = getPortPosition(port);

                // Determine port visual state from simulation
                const portBus = portStates?.get(port.id);
                // Draw multi-bit label if bits > 1
                let label = '';
                let color = '#334155'; // default LOW/unconnected
                if (portBus && portBus.length > 0) {
                    if (portBus.length === 1) {
                        color = wireColor(portBus[0]);
                    } else {
                        color = '#000000'; // bus line
                        label = busLabel(portBus);
                    }
                }

                // Calculate stub line from body to the logic pin grid intersection
                // e.g., if side='left', draw line from (px, py) to (px + length, py)
                // Wait, px,py in PortDef is the visible end of the pin.
                let lx1 = px, ly1 = py, lx2 = px, ly2 = py;
                if (port.side === 'left') { lx2 += length; }
                if (port.side === 'right') { lx2 -= length; }
                if (port.side === 'top') { ly2 += length; }
                if (port.side === 'bottom') { ly2 -= length; }

                return (
                    <g key={port.id} onClick={(e) => handlePortClick(e, port.x, port.y)}>
                        {/* Port stub line */}
                        <line x1={lx1} y1={ly1} x2={lx2} y2={ly2} stroke={color} strokeWidth={2} />

                        {/* Port connection circle */}
                        <circle cx={px} cy={py} r={4} fill={color} stroke="#0F172A" strokeWidth={1} />

                        {/* Port internal label (e.g. "D", "CLK", "sel") */}
                        {(port.label && shape.style === 'custom') && (
                            <text
                                x={port.side === 'left' ? px + 12 : port.side === 'right' ? px - 12 : px}
                                y={port.side === 'top' ? py + 12 : port.side === 'bottom' ? py - 12 : py}
                                fill="#94A3B8" fontSize={9}
                                textAnchor={port.side === 'left' ? 'start' : port.side === 'right' ? 'end' : 'middle'}
                                dominantBaseline={port.side === 'top' ? 'hanging' : port.side === 'bottom' ? 'text-after-edge' : 'middle'}
                                pointerEvents="none"
                            >
                                {port.label}
                            </text>
                        )}

                        {/* Multi-bit bus value floating above pin */}
                        {label && (
                            <text
                                x={px} y={py - 8}
                                fill="#F59E0B" fontSize={10}
                                fontWeight="bold" textAnchor="middle"
                            >
                                {label}
                            </text>
                        )}
                    </g>
                );
            })}

            {/* Main Component Label (Below) */}
            <text
                x={(shape.w * gridToPx) / 2}
                y={shape.h * gridToPx + 15}
                fill="#94A3B8" fontSize={10}
                textAnchor="middle"
            >
                {node.label}
            </text>
        </g>
    );
};
