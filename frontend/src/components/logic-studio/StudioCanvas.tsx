/**
 * StudioCanvas.tsx — SVG circuit canvas with zoom/pan and node rendering
 */

import { useRef, useCallback, useState, useEffect } from 'react';
import type { CanvasNode, StudioMode, WireStart } from '../../hooks/useLogicStudio';
import type { NodeId } from '../../mure/core/SignalNode';
import type { PortState } from '../../mure/core/Port';
import type { SignalEdge } from '../../mure/core/SignalEdge';

// ─── Node rendering config ─────────────────────────────────────────────

const NODE_W = 100;
const NODE_H = 60;
const PORT_R = 6;
const INPUT_PORT_OFFSET = 12;
const OUTPUT_PORT_OFFSET = NODE_W - 12;

interface Props {
    nodes: CanvasNode[];
    edges: SignalEdge[];
    selectedNodeId: NodeId | null;
    mode: StudioMode;
    wireStart: WireStart | null;
    snapshot: Map<NodeId, PortState[]>;
    xrayEnabled: boolean;
    onSelectNode: (id: NodeId | null) => void;
    onMoveNode: (id: NodeId, x: number, y: number) => void;
    onStartWire: (nodeId: NodeId, portIndex: number, isOutput: boolean) => void;
    onCompleteWire: (nodeId: NodeId, portIndex: number) => void;
    onCancelWire: () => void;
    onToggleProbe: (nodeId: NodeId) => void;
    onRemoveNode: (id: NodeId) => void;
}

export function StudioCanvas({
    nodes,
    edges,
    selectedNodeId,
    mode,
    wireStart,
    snapshot,
    xrayEnabled,
    onSelectNode,
    onMoveNode,
    onStartWire,
    onCompleteWire,
    onCancelWire,
    onToggleProbe,
    onRemoveNode,
}: Props) {
    const svgRef = useRef<SVGSVGElement>(null);
    const [viewBox, setViewBox] = useState({ x: -200, y: -100, w: 1200, h: 700 });
    const [dragging, setDragging] = useState<{ nodeId: NodeId; offX: number; offY: number } | null>(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    // ─── SVG coordinate helpers ─────────────────────────

    const svgPoint = useCallback((clientX: number, clientY: number) => {
        if (!svgRef.current) return { x: 0, y: 0 };
        const ctm = svgRef.current.getScreenCTM();
        if (!ctm) return { x: 0, y: 0 };
        return {
            x: (clientX - ctm.e) / ctm.a,
            y: (clientY - ctm.f) / ctm.d,
        };
    }, []);

    // ─── Drag handling ──────────────────────────────────

    const onNodePointerDown = useCallback((e: React.PointerEvent, node: CanvasNode) => {
        e.stopPropagation();

        if (mode === 'probe') {
            onToggleProbe(node.id);
            return;
        }

        if (mode === 'select') {
            onSelectNode(node.id);
            const pt = svgPoint(e.clientX, e.clientY);
            setDragging({ nodeId: node.id, offX: pt.x - node.x, offY: pt.y - node.y });
        }
    }, [mode, onSelectNode, onToggleProbe, svgPoint]);

    const onPointerMove = useCallback((e: React.PointerEvent) => {
        const pt = svgPoint(e.clientX, e.clientY);
        setMousePos(pt);

        if (dragging) {
            onMoveNode(dragging.nodeId, pt.x - dragging.offX, pt.y - dragging.offY);
        }
    }, [dragging, onMoveNode, svgPoint]);

    const onPointerUp = useCallback(() => {
        setDragging(null);
    }, []);

    const onCanvasClick = useCallback((e: React.MouseEvent) => {
        if (e.target === svgRef.current) {
            onSelectNode(null);
            if (wireStart) onCancelWire();
        }
    }, [onSelectNode, wireStart, onCancelWire]);

    // ─── Port click ─────────────────────────────────────

    const onPortClick = useCallback((e: React.MouseEvent, nodeId: NodeId, portIndex: number, isOutput: boolean) => {
        e.stopPropagation();

        if (mode === 'wire' || wireStart) {
            if (wireStart) {
                // Completing wire — ensure different direction
                if (wireStart.isOutput !== isOutput) {
                    onCompleteWire(nodeId, portIndex);
                }
            } else {
                onStartWire(nodeId, portIndex, isOutput);
            }
        }
    }, [mode, wireStart, onStartWire, onCompleteWire]);

    // ─── Zoom with wheel ────────────────────────────────

    useEffect(() => {
        const svg = svgRef.current;
        if (!svg) return;

        const handleWheel = (e: WheelEvent) => {
            e.preventDefault();
            const scale = e.deltaY > 0 ? 1.1 : 0.9;
            setViewBox((vb) => {
                const cx = vb.x + vb.w / 2;
                const cy = vb.y + vb.h / 2;
                const nw = vb.w * scale;
                const nh = vb.h * scale;
                return { x: cx - nw / 2, y: cy - nh / 2, w: nw, h: nh };
            });
        };

        svg.addEventListener('wheel', handleWheel, { passive: false });
        return () => svg.removeEventListener('wheel', handleWheel);
    }, []);

    // ─── Keyboard ───────────────────────────────────────

    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'Delete' || e.key === 'Backspace') {
                if (selectedNodeId) onRemoveNode(selectedNodeId);
            }
            if (e.key === 'Escape') {
                onSelectNode(null);
                onCancelWire();
            }
        };

        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [selectedNodeId, onRemoveNode, onSelectNode, onCancelWire]);

    // ─── Node port positions ────────────────────────────

    function getInputPortPos(node: CanvasNode, idx: number, total: number) {
        const spacing = NODE_H / (total + 1);
        return { x: node.x + INPUT_PORT_OFFSET, y: node.y + spacing * (idx + 1) };
    }

    function getOutputPortPos(node: CanvasNode, idx: number, total: number) {
        const spacing = NODE_H / (total + 1);
        return { x: node.x + OUTPUT_PORT_OFFSET, y: node.y + spacing * (idx + 1) };
    }

    // ─── Render ─────────────────────────────────────────

    return (
        <svg
            ref={svgRef}
            className="studio-canvas"
            viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onClick={onCanvasClick}
        >
            <defs>
                <filter id="node-glow">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
                <filter id="wire-glow">
                    <feGaussianBlur stdDeviation="2" result="blur" />
                    <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>

            {/* Grid pattern */}
            <g className="studio-grid" opacity="0.3">
                {Array.from({ length: 60 }, (_, i) => (
                    <line key={`gh${i}`} x1={i * 40 - 400} y1={-200} x2={i * 40 - 400} y2={1200}
                        stroke="rgba(0,212,255,0.05)" strokeWidth="0.5" />
                ))}
                {Array.from({ length: 40 }, (_, i) => (
                    <line key={`gv${i}`} x1={-400} y1={i * 40 - 200} x2={2000} y2={i * 40 - 200}
                        stroke="rgba(0,212,255,0.05)" strokeWidth="0.5" />
                ))}
            </g>

            {/* Edges / wires */}
            {edges.map((edge) => {
                const fromNode = nodes.find((n) => n.id === edge.fromNode);
                const toNode = nodes.find((n) => n.id === edge.toNode);
                if (!fromNode || !toNode) return null;

                const from = getOutputPortPos(fromNode, edge.fromPort, 1);
                const to = getInputPortPos(toNode, edge.toPort, 2);
                const midX = (from.x + to.x) / 2;

                return (
                    <path
                        key={edge.id}
                        d={`M${from.x},${from.y} C${midX},${from.y} ${midX},${to.y} ${to.x},${to.y}`}
                        stroke={edge.isLive ? '#00D4FF' : '#334155'}
                        strokeWidth={edge.isLive ? 2.5 : 1.5}
                        fill="none"
                        filter={edge.isLive ? 'url(#wire-glow)' : undefined}
                        className="studio-wire"
                    />
                );
            })}

            {/* In-progress wire */}
            {wireStart && (() => {
                const srcNode = nodes.find((n) => n.id === wireStart.nodeId);
                if (!srcNode) return null;
                const srcPos = wireStart.isOutput
                    ? getOutputPortPos(srcNode, wireStart.portIndex, 1)
                    : getInputPortPos(srcNode, wireStart.portIndex, 2);
                const midX = (srcPos.x + mousePos.x) / 2;

                return (
                    <path
                        d={`M${srcPos.x},${srcPos.y} C${midX},${srcPos.y} ${midX},${mousePos.y} ${mousePos.x},${mousePos.y}`}
                        stroke="#00D4FF"
                        strokeWidth="2"
                        strokeDasharray="6 3"
                        fill="none"
                        opacity="0.6"
                        pointerEvents="none"
                    />
                );
            })()}

            {/* Nodes */}
            {nodes.map((node) => {
                const isSelected = node.id === selectedNodeId;
                const ports = snapshot.get(node.id) || [];

                return (
                    <g key={node.id} onPointerDown={(e) => onNodePointerDown(e, node)}>
                        {/* Node body */}
                        <rect
                            x={node.x}
                            y={node.y}
                            width={NODE_W}
                            height={NODE_H}
                            rx={4}
                            fill={isSelected ? 'rgba(0, 212, 255, 0.12)' : 'rgba(15, 23, 42, 0.9)'}
                            stroke={isSelected ? '#00D4FF' : 'rgba(100, 116, 139, 0.3)'}
                            strokeWidth={isSelected ? 2 : 1}
                            filter={isSelected ? 'url(#node-glow)' : undefined}
                            className="studio-node"
                            style={{ cursor: mode === 'select' ? 'grab' : 'pointer' }}
                        />

                        {/* Label */}
                        <text
                            x={node.x + NODE_W / 2}
                            y={node.y + NODE_H / 2}
                            textAnchor="middle"
                            dominantBaseline="central"
                            fontSize="11"
                            fontFamily="'IBM Plex Mono', monospace"
                            fontWeight="600"
                            fill={isSelected ? '#00D4FF' : '#CBD5E1'}
                            letterSpacing="0.08em"
                        >
                            {node.label}
                        </text>

                        {/* Input ports */}
                        {Array.from({ length: 2 }, (_, i) => {
                            const pos = getInputPortPos(node, i, 2);
                            return (
                                <circle
                                    key={`in${i}`}
                                    cx={pos.x}
                                    cy={pos.y}
                                    r={PORT_R}
                                    fill={ports[i]?.logic ? '#10B981' : '#1E293B'}
                                    stroke="rgba(100, 116, 139, 0.4)"
                                    strokeWidth="1.5"
                                    className="studio-port studio-port--input"
                                    onClick={(e) => onPortClick(e as any, node.id, i, false)}
                                    style={{ cursor: 'crosshair' }}
                                />
                            );
                        })}

                        {/* Output port */}
                        {(() => {
                            const pos = getOutputPortPos(node, 0, 1);
                            return (
                                <circle
                                    cx={pos.x}
                                    cy={pos.y}
                                    r={PORT_R}
                                    fill={ports[0]?.logic ? '#00D4FF' : '#1E293B'}
                                    stroke="rgba(100, 116, 139, 0.4)"
                                    strokeWidth="1.5"
                                    className="studio-port studio-port--output"
                                    onClick={(e) => onPortClick(e as any, node.id, 0, true)}
                                    style={{ cursor: 'crosshair' }}
                                />
                            );
                        })()}

                        {/* X-Ray overlay */}
                        {xrayEnabled && ports.length > 0 && (
                            <g>
                                {ports.map((port, i) => (
                                    <text
                                        key={`xray${i}`}
                                        x={node.x + NODE_W + 8}
                                        y={node.y + 14 + i * 14}
                                        fontSize="8"
                                        fontFamily="'IBM Plex Mono', monospace"
                                        fill={port.logic ? '#10B981' : '#EF4444'}
                                    >
                                        {port.voltage.toFixed(2)}V {port.logic ? 'H' : 'L'}
                                    </text>
                                ))}
                            </g>
                        )}
                    </g>
                );
            })}
        </svg>
    );
}
