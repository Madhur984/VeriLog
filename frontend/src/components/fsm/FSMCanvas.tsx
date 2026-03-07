/**
 * components/fsm/FSMCanvas.tsx — Interactive SVG State Diagram
 *
 * Renders an FSM as an SVG directed graph:
 *   - States as circles (double ring for final states)
 *   - Transitions as curved bezier arrows with labels
 *   - Active state highlighted in gold
 *   - Active transition animated with a pulse
 *   - Draggable state positions
 */

import { useState, useCallback, useRef } from 'react';
import type { FSMDefinition } from '../../engine/FSMEngine';
import type { FSMTransition } from '../../engine/types';
import type { StateId } from '../../engine/types';

const T = {
    bg: '#060C1A',
    card: '#0D0F16',
    border: '#1A1D24',
    text: '#E5E7EB',
    muted: '#64748B',
    accent: '#00D4FF',
    active: '#F59E0B',
    final: '#10B981',
    error: '#EF4444',
    mono: "'IBM Plex Mono','Roboto Mono',monospace",
    sans: "'Inter',system-ui,sans-serif",
} as const;

interface FSMCanvasProps {
    fsm: FSMDefinition;
    activeState?: StateId;
    activeTransitionId?: string;
    onStateClick?: (stateId: StateId) => void;
    onPositionChange?: (stateId: StateId, pos: { x: number; y: number }) => void;
    width?: number;
    height?: number;
}

export function FSMCanvas({
    fsm,
    activeState,
    activeTransitionId,
    onStateClick,
    onPositionChange,
    width = 700,
    height = 400,
}: FSMCanvasProps) {
    const svgRef = useRef<SVGSVGElement>(null);
    const [dragging, setDragging] = useState<StateId | null>(null);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

    const STATE_R = 30;
    const states = Array.from(fsm.states.values());

    // Auto-layout if positions are all zero
    const positions = new Map<StateId, { x: number; y: number }>();
    states.forEach((s, i) => {
        const angle = (i / states.length) * 2 * Math.PI - Math.PI / 2;
        const cx = width / 2 + (states.length > 1 ? Math.cos(angle) * 160 : 0);
        const cy = height / 2 + (states.length > 1 ? Math.sin(angle) * 120 : 0);
        positions.set(s.id, {
            x: (s.position.x !== 0 || s.position.y !== 0) ? s.position.x : cx,
            y: (s.position.x !== 0 || s.position.y !== 0) ? s.position.y : cy,
        });
    });

    // ── Drag ──────────────────────────────────────────────────────────────
    const onMouseDown = useCallback((e: React.MouseEvent, stateId: StateId) => {
        e.stopPropagation();
        const svg = svgRef.current!;
        const pt = svg.createSVGPoint();
        pt.x = e.clientX; pt.y = e.clientY;
        const svgPt = pt.matrixTransform(svg.getScreenCTM()!.inverse());
        const pos = positions.get(stateId)!;
        setDragOffset({ x: svgPt.x - pos.x, y: svgPt.y - pos.y });
        setDragging(stateId);
    }, [positions]);

    const onMouseMove = useCallback((e: React.MouseEvent) => {
        if (!dragging || !svgRef.current) return;
        const svg = svgRef.current;
        const pt = svg.createSVGPoint();
        pt.x = e.clientX; pt.y = e.clientY;
        const svgPt = pt.matrixTransform(svg.getScreenCTM()!.inverse());
        onPositionChange?.(dragging, {
            x: svgPt.x - dragOffset.x,
            y: svgPt.y - dragOffset.y,
        });
    }, [dragging, dragOffset, onPositionChange]);

    const onMouseUp = useCallback(() => setDragging(null), []);

    // ── Arrow path between two states ────────────────────────────────────
    function arrowPath(
        from: StateId,
        to: StateId,
        isSelf: boolean,
        transIndex: number,
        totalSameDir: number,
    ): string {
        const p1 = positions.get(from)!;
        const p2 = positions.get(to)!;

        if (isSelf) {
            const lx = p1.x, ly = p1.y - STATE_R;
            return `M ${lx - 15} ${ly} C ${lx - 60} ${ly - 70} ${lx + 60} ${ly - 70} ${lx + 15} ${ly}`;
        }

        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        const len = Math.sqrt(dx * dx + dy * dy);
        const nx = -dy / len;
        const ny = dx / len;
        const offset = (transIndex - (totalSameDir - 1) / 2) * 24;

        const sx = p1.x + (dx / len) * STATE_R + nx * offset;
        const sy = p1.y + (dy / len) * STATE_R + ny * offset;
        const ex = p2.x - (dx / len) * STATE_R + nx * offset;
        const ey = p2.y - (dy / len) * STATE_R + ny * offset;
        const cx = (sx + ex) / 2 + nx * 40;
        const cy = (sy + ey) / 2 + ny * 40;

        return `M ${sx} ${sy} Q ${cx} ${cy} ${ex} ${ey}`;
    }

    // Group transitions with same from/to for offset rendering
    const transGroups = new Map<string, FSMTransition[]>();
    fsm.transitions.forEach(t => {
        const key = `${t.from}->${t.to}`;
        if (!transGroups.has(key)) transGroups.set(key, []);
        transGroups.get(key)!.push(t);
    });

    return (
        <svg
            ref={svgRef}
            viewBox={`0 0 ${width} ${height}`}
            style={{
                width: '100%', height,
                background: T.bg,
                borderRadius: 4,
                border: `1px solid ${T.border}`,
                cursor: dragging ? 'grabbing' : 'default',
            }}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
        >
            <defs>
                <marker id="arrow" markerWidth="8" markerHeight="8"
                    refX="6" refY="3" orient="auto">
                    <path d="M0,0 L0,6 L9,3 z" fill={T.muted} />
                </marker>
                <marker id="arrow-active" markerWidth="8" markerHeight="8"
                    refX="6" refY="3" orient="auto">
                    <path d="M0,0 L0,6 L9,3 z" fill={T.active} />
                </marker>
                <filter id="glow-gold">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
                <filter id="glow-cyan">
                    <feGaussianBlur stdDeviation="2" result="blur" />
                    <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>

            {/* Initial state arrow */}
            {fsm.initialState && positions.get(fsm.initialState) && (() => {
                const pos = positions.get(fsm.initialState)!;
                return (
                    <g>
                        <line
                            x1={pos.x - STATE_R - 30} y1={pos.y}
                            x2={pos.x - STATE_R - 2} y2={pos.y}
                            stroke={T.accent} strokeWidth={1.5}
                            markerEnd="url(#arrow)"
                        />
                    </g>
                );
            })()}

            {/* Transitions */}
            {Array.from(transGroups.entries()).map(([key, group]) => (
                group.map((t, ti) => {
                    const isSelf = t.from === t.to;
                    const isActive = t.id === activeTransitionId;
                    const path = arrowPath(t.from, t.to, isSelf, ti, group.length);
                    const p1 = positions.get(t.from)!;
                    const p2 = positions.get(t.to)!;
                    // Label midpoint (approximate)
                    const lx = isSelf ? p1.x : (p1.x + p2.x) / 2 + 12;
                    const ly = isSelf ? p1.y - STATE_R - 48 : (p1.y + p2.y) / 2 - 12;

                    return (
                        <g key={`${key}-${ti}`}>
                            <path
                                d={path}
                                fill="none"
                                stroke={isActive ? T.active : T.muted}
                                strokeWidth={isActive ? 2 : 1}
                                markerEnd={isActive ? 'url(#arrow-active)' : 'url(#arrow)'}
                                filter={isActive ? 'url(#glow-gold)' : undefined}
                                opacity={0.8}
                            />
                            <text
                                x={lx} y={ly}
                                fill={isActive ? T.active : T.muted}
                                fontSize={9}
                                fontFamily={T.mono}
                                textAnchor="middle"
                            >
                                {t.condition}{t.output ? `/${t.output}` : ''}
                            </text>
                        </g>
                    );
                })
            ))}

            {/* States */}
            {states.map(state => {
                const pos = positions.get(state.id)!;
                const isActive = state.id === activeState;
                const isInitial = state.id === fsm.initialState;

                return (
                    <g
                        key={state.id}
                        transform={`translate(${pos.x}, ${pos.y})`}
                        onMouseDown={(e) => onMouseDown(e, state.id)}
                        onClick={() => onStateClick?.(state.id)}
                        style={{ cursor: 'grab' }}
                    >
                        {/* Outer ring for final states */}
                        {state.isFinal && (
                            <circle r={STATE_R + 5} fill="none"
                                stroke={T.final} strokeWidth={1} opacity={0.5} />
                        )}

                        {/* Active glow */}
                        {isActive && (
                            <circle r={STATE_R + 8} fill="none"
                                stroke={T.active} strokeWidth={2}
                                filter="url(#glow-gold)" opacity={0.6} />
                        )}

                        {/* Main circle */}
                        <circle
                            r={STATE_R}
                            fill={isActive ? `${T.active}20` : '#0D0F16'}
                            stroke={isActive ? T.active : isInitial ? T.accent : T.muted}
                            strokeWidth={isActive ? 2 : 1.5}
                        />

                        {/* State label */}
                        <text
                            textAnchor="middle" dominantBaseline="central"
                            fill={isActive ? T.active : T.text}
                            fontSize={10} fontFamily={T.mono}
                            letterSpacing="0.05em"
                        >
                            {state.label}
                        </text>

                        {/* Moore output below label */}
                        {state.output && (
                            <text
                                textAnchor="middle" y={12}
                                fill={T.muted} fontSize={8} fontFamily={T.mono}
                            >
                                /{state.output}
                            </text>
                        )}
                    </g>
                );
            })}
        </svg>
    );
}
