/**
 * components/workbench/WireLayer.tsx
 *
 * Renders all wire segments from the useWorkbenchStore.
 * Segments are colored according to their evaluated net value.
 */

import React, { useMemo } from 'react';
import { useWorkbenchStore } from '../../stores/useWorkbenchStore';
import { wireColor } from '../../engine/LogicValue';

export const WireLayer: React.FC = () => {
    const segments = useWorkbenchStore(s => s.segments);
    const netValues = useWorkbenchStore(s => s.netValues);
    const netErrors = useWorkbenchStore(s => s.netErrors);
    const selectedIds = useWorkbenchStore(s => s.selectedIds);
    const wireInProgress = useWorkbenchStore(s => s.wireInProgress);

    // Convert Map to array for rendering
    const segList = useMemo(() => Array.from(segments.values()), [segments]);

    // Compute dot junctions explicitly
    const junctionPoints = useMemo(() => {
        const counts = new Map<string, number>();
        for (const seg of segList) {
            const p1 = `${seg.x1},${seg.y1}`;
            const p2 = `${seg.x2},${seg.y2}`;
            counts.set(p1, (counts.get(p1) || 0) + 1);
            counts.set(p2, (counts.get(p2) || 0) + 1);
        }

        const dots: { x: number, y: number, netId: string }[] = [];
        for (const [ptStr, count] of counts) {
            if (count >= 3) {
                const [x, y] = ptStr.split(',').map(Number);
                const incident = segList.find(s =>
                    (s.x1 === x && s.y1 === y) || (s.x2 === x && s.y2 === y)
                );
                dots.push({ x, y, netId: incident?.netId || '' });
            }
        }
        return dots;
    }, [segList]);

    return (
        <svg
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', overflow: 'visible', pointerEvents: 'none' }}
        >
            {/* 1. Render all committed segments */}
            {segList.map((seg) => {
                const isSelected = selectedIds.has(seg.id);
                // netId might be empty string during transient edits before worker resolves them
                const netValBus = seg.netId ? netValues.get(seg.netId) : undefined;

                // Color prioritization: error -> specific bit -> floating
                let color = '#6B7280'; // Z or unresolved
                if (seg.netId && netErrors.has(seg.netId)) {
                    color = '#3B82F6'; // 'X' -> Blue in Logisim (or Red for error. In LogicValue we set X to blue)
                } else if (netValBus !== undefined) {
                    if (Array.isArray(netValBus)) {
                        color = netValBus.length === 1 ? wireColor(netValBus[0]) : '#000000'; // Multi-bit bus
                    } else {
                        color = wireColor(netValBus);
                    }
                }

                const isBus = Array.isArray(netValBus) && netValBus.length > 1;

                if (isSelected) color = '#00D4FF';

                // Scale grid units (10) to pixels
                const x1 = seg.x1 * 10;
                const y1 = seg.y1 * 10;
                const x2 = seg.x2 * 10;
                const y2 = seg.y2 * 10;

                return (
                    <line
                        key={seg.id}
                        x1={x1} y1={y1} x2={x2} y2={y2}
                        stroke={color}
                        strokeWidth={isSelected ? (isBus ? 6 : 4) : (isBus ? 4 : 2)}
                        strokeLinecap="round"
                    />
                );
            })}

            {/* Render Junction Dots */}
            {junctionPoints.map((dot, i) => {
                const isSelected = segList.some(s =>
                    ((s.x1 === dot.x && s.y1 === dot.y) || (s.x2 === dot.x && s.y2 === dot.y)) &&
                    selectedIds.has(s.id)
                );

                const netValBus = dot.netId ? netValues.get(dot.netId) : undefined;
                let color = '#6B7280';
                if (dot.netId && netErrors.has(dot.netId)) color = '#3B82F6';
                else if (netValBus !== undefined) {
                    color = Array.isArray(netValBus) ? (netValBus.length === 1 ? wireColor(netValBus[0]) : '#000000') : wireColor(netValBus);
                }

                if (isSelected) color = '#00D4FF';

                return (
                    <circle
                        key={`dot_${i}`}
                        cx={dot.x * 10}
                        cy={dot.y * 10}
                        r={4}
                        fill={color}
                    />
                );
            })}

            {/* 2. Render wire in progress (ghosts) */}
            {wireInProgress && (
                <g>
                    {(wireInProgress.axisPreferred || 'x') === 'x' ? (
                        <>
                            {wireInProgress.x1 !== wireInProgress.mouseX && (
                                <line x1={wireInProgress.x1 * 10} y1={wireInProgress.y1 * 10} x2={wireInProgress.mouseX * 10} y2={wireInProgress.y1 * 10} stroke="#10B981" strokeWidth={2} strokeDasharray="4 4" />
                            )}
                            {wireInProgress.y1 !== wireInProgress.mouseY && (
                                <line x1={wireInProgress.mouseX * 10} y1={wireInProgress.y1 * 10} x2={wireInProgress.mouseX * 10} y2={wireInProgress.mouseY * 10} stroke="#10B981" strokeWidth={2} strokeDasharray="4 4" />
                            )}
                        </>
                    ) : (
                        <>
                            {wireInProgress.y1 !== wireInProgress.mouseY && (
                                <line x1={wireInProgress.x1 * 10} y1={wireInProgress.y1 * 10} x2={wireInProgress.x1 * 10} y2={wireInProgress.mouseY * 10} stroke="#10B981" strokeWidth={2} strokeDasharray="4 4" />
                            )}
                            {wireInProgress.x1 !== wireInProgress.mouseX && (
                                <line x1={wireInProgress.x1 * 10} y1={wireInProgress.mouseY * 10} x2={wireInProgress.mouseX * 10} y2={wireInProgress.mouseY * 10} stroke="#10B981" strokeWidth={2} strokeDasharray="4 4" />
                            )}
                        </>
                    )}
                </g>
            )}
        </svg>
    );
};
