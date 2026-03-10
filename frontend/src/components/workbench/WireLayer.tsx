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
                } else if (netValBus && netValBus.length > 0) {
                    // For rendering a multi-bit bus wire, Logisim uses black/dark blue. 
                    // We'll just display the LSB color for now, or black if bus > 1 bit
                    if (netValBus.length === 1) {
                        color = wireColor(netValBus[0]);
                    } else {
                        color = '#000000'; // Multi-bit bus
                    }
                }

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
                        strokeWidth={isSelected ? 4 : 2}
                        strokeLinecap="round"
                    />
                );
            })}

            {/* 2. Render wire in progress (ghosts) */}
            {wireInProgress && (
                <g>
                    {/* Horizontal segment */}
                    {wireInProgress.x1 !== wireInProgress.mouseX && (
                        <line
                            x1={wireInProgress.x1 * 10} y1={wireInProgress.y1 * 10}
                            x2={wireInProgress.mouseX * 10} y2={wireInProgress.y1 * 10}
                            stroke="#10B981" strokeWidth={2} strokeDasharray="4 4"
                        />
                    )}
                    {/* Vertical segment */}
                    {wireInProgress.y1 !== wireInProgress.mouseY && (
                        <line
                            x1={wireInProgress.mouseX * 10} y1={wireInProgress.y1 * 10}
                            x2={wireInProgress.mouseX * 10} y2={wireInProgress.mouseY * 10}
                            stroke="#10B981" strokeWidth={2} strokeDasharray="4 4"
                        />
                    )}
                </g>
            )}
        </svg>
    );
};
