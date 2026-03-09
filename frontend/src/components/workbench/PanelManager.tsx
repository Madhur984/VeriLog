/**
 * PanelManager.tsx — Drag-resizable split panel layout
 *
 * Renders panels side-by-side with draggable dividers.
 * Supports both horizontal and vertical orientations.
 */

import React, { useRef, useCallback, memo } from 'react';
import type { PanelConfig } from '../../hooks/usePanelLayout';

interface PanelManagerProps {
    panels: PanelConfig[];
    sizes: number[];
    orientation: 'horizontal' | 'vertical';
    onSizesChange: (sizes: number[]) => void;
    children: React.ReactNode[];
}

export const PanelManager = memo(({
    panels,
    sizes,
    orientation,
    onSizesChange,
    children,
}: PanelManagerProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const dragState = useRef<{ index: number; startPos: number; startSizes: number[] } | null>(null);

    const isHorizontal = orientation === 'horizontal';

    const handleDividerMouseDown = useCallback((index: number, e: React.MouseEvent) => {
        e.preventDefault();
        const startPos = isHorizontal ? e.clientX : e.clientY;
        dragState.current = { index, startPos, startSizes: [...sizes] };

        const handleMouseMove = (moveEvent: MouseEvent) => {
            if (!dragState.current || !containerRef.current) return;
            const { index: idx, startPos: sp, startSizes: ss } = dragState.current;

            const containerRect = containerRef.current.getBoundingClientRect();
            const containerSize = isHorizontal ? containerRect.width : containerRect.height;
            const currentPos = isHorizontal ? moveEvent.clientX : moveEvent.clientY;
            const deltaPercent = ((currentPos - sp) / containerSize) * 100;

            const newSizes = [...ss];
            const minPercent = 5; // minimum 5%

            const sizeA = ss[idx] + deltaPercent;
            const sizeB = ss[idx + 1] - deltaPercent;

            if (sizeA >= minPercent && sizeB >= minPercent) {
                newSizes[idx] = sizeA;
                newSizes[idx + 1] = sizeB;
                onSizesChange(newSizes);
            }
        };

        const handleMouseUp = () => {
            dragState.current = null;
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        document.body.style.cursor = isHorizontal ? 'col-resize' : 'row-resize';
        document.body.style.userSelect = 'none';
    }, [sizes, onSizesChange, isHorizontal]);

    return (
        <div
            ref={containerRef}
            className="wb-panel-manager"
            style={{
                display: 'flex',
                flexDirection: isHorizontal ? 'row' : 'column',
                width: '100%',
                height: '100%',
                overflow: 'hidden',
                gap: 0,
            }}
        >
            {panels.map((panel, i) => (
                <React.Fragment key={panel.id}>
                    {/* Panel */}
                    <div
                        style={{
                            [isHorizontal ? 'width' : 'height']: `${sizes[i]}%`,
                            [isHorizontal ? 'height' : 'width']: '100%',
                            overflow: 'hidden',
                            flexShrink: 0,
                            position: 'relative',
                        }}
                    >
                        {children[i]}
                    </div>

                    {/* Divider */}
                    {i < panels.length - 1 && (
                        <div
                            onMouseDown={(e) => handleDividerMouseDown(i, e)}
                            className="wb-divider"
                            style={{
                                [isHorizontal ? 'width' : 'height']: 4,
                                [isHorizontal ? 'height' : 'width']: '100%',
                                cursor: isHorizontal ? 'col-resize' : 'row-resize',
                                background: 'rgba(0, 212, 255, 0.06)',
                                flexShrink: 0,
                                position: 'relative',
                                zIndex: 10,
                                transition: 'background 150ms',
                            }}
                            onMouseEnter={(e) => {
                                (e.target as HTMLElement).style.background = 'rgba(0, 212, 255, 0.25)';
                            }}
                            onMouseLeave={(e) => {
                                (e.target as HTMLElement).style.background = 'rgba(0, 212, 255, 0.06)';
                            }}
                        />
                    )}
                </React.Fragment>
            ))}
        </div>
    );
});

PanelManager.displayName = 'PanelManager';
