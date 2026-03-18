import { useCallback, useRef, useState } from 'react';
import type { Position, CircuitComponent } from '../types';
import { animController } from '../animations/animationController';

interface UseDragOptions {
    onDragEnd?: (finalPosition: Position) => void;
    onDragMove?: (position: Position) => void;
    canvasBounds?: React.RefObject<SVGSVGElement | null>;
    /** ID of the component being dragged — used for animation events */
    compId?: string;
    /** Current list of all components — used for magnetic assist proximity calc */
    components?: CircuitComponent[];
}

interface UseDragReturn {
    position: Position;
    isDragging: boolean;
    dragHandlers: {
        onPointerDown: (e: React.PointerEvent) => void;
    };
    setPosition: React.Dispatch<React.SetStateAction<Position>>;
}

export function useDrag(
    initialPosition: Position,
    options: UseDragOptions = {}
): UseDragReturn {
    const [position, setPosition] = useState<Position>(initialPosition);
    const [isDragging, setIsDragging] = useState(false);

    const startPointer = useRef<Position>({ x: 0, y: 0 });
    const startPosition = useRef<Position>(initialPosition);
    const rafId = useRef<number | null>(null);
    const pendingPos = useRef<Position>(initialPosition);
    const elementRef = useRef<HTMLElement | SVGElement | null>(null);

    const toSVGCoords = useCallback(
        (clientX: number, clientY: number): Position => {
            const svg = options.canvasBounds?.current;
            if (!svg) return { x: clientX, y: clientY };
            const rect = svg.getBoundingClientRect();
            const scaleX = svg.viewBox.baseVal.width / rect.width;
            const scaleY = svg.viewBox.baseVal.height / rect.height;
            return {
                x: (clientX - rect.left) * scaleX,
                y: (clientY - rect.top) * scaleY,
            };
        },
        [options.canvasBounds]
    );

    const onPointerMove = useCallback(
        (e: PointerEvent) => {
            const svgPt = toSVGCoords(e.clientX, e.clientY);
            const dx = svgPt.x - startPointer.current.x;
            const dy = svgPt.y - startPointer.current.y;
            pendingPos.current = {
                x: startPosition.current.x + dx,
                y: startPosition.current.y + dy,
            };

            if (rafId.current !== null) return;
            rafId.current = requestAnimationFrame(() => {
                rafId.current = null;
                const pos = pendingPos.current;
                setPosition({ ...pos });
                options.onDragMove?.(pos);

                // ── Animation: emit drag:move + magnetic proximity event ──
                if (options.compId && options.components) {
                    const nearbyAnchorIds: string[] = [];
                    let minDist = Infinity;
                    let ghostDir = { x: 0, y: 0 };

                    for (const other of options.components) {
                        if (other.id === options.compId) continue;
                        for (const anchor of other.anchors) {
                            if (anchor.connectedTo !== null) continue;
                            const ax = other.position.x + anchor.offset.x;
                            const ay = other.position.y + anchor.offset.y;
                            const dist = Math.sqrt((pos.x - ax) ** 2 + (pos.y - ay) ** 2);
                            if (dist < 60) {
                                nearbyAnchorIds.push(anchor.id);
                                if (dist < minDist) {
                                    minDist = dist;
                                    const len = Math.max(dist, 0.01);
                                    ghostDir = { x: (ax - pos.x) / len, y: (ay - pos.y) / len };
                                }
                            }
                        }
                    }

                    if (nearbyAnchorIds.length > 0) {
                        animController.emit('drag:near-node', {
                            draggedId: options.compId,
                            nearbyAnchorIds,
                            dist: minDist,
                            ghostDir,
                        });
                    }
                }
            });
        },
        [toSVGCoords, options]
    );

    const onPointerUp = useCallback(
        (e: PointerEvent) => {
            (e.target as Element)?.releasePointerCapture?.(e.pointerId);
            window.removeEventListener('pointermove', onPointerMove);
            window.removeEventListener('pointerup', onPointerUp);
            if (rafId.current !== null) {
                cancelAnimationFrame(rafId.current);
                rafId.current = null;
            }
            setIsDragging(false);
            const final = pendingPos.current;
            setPosition(final);
            startPosition.current = final;

            // Mark element as no longer dragging
            if (elementRef.current) {
                (elementRef.current as SVGElement).removeAttribute?.('data-dragging');
            }

            animController.emit('drag:end', { draggedId: options.compId ?? '' });
            options.onDragEnd?.(final);
        },
        [onPointerMove, options]
    );

    const onPointerDown = useCallback(
        (e: React.PointerEvent) => {
            e.preventDefault();
            e.stopPropagation();
            (e.target as Element).setPointerCapture(e.pointerId);
            elementRef.current = e.currentTarget as HTMLElement | SVGElement;

            const svgPt = toSVGCoords(e.clientX, e.clientY);
            startPointer.current = svgPt;
            startPosition.current = { ...pendingPos.current };
            setIsDragging(true);

            // Mark element as dragging for FloatAnimator
            if (elementRef.current) {
                (elementRef.current as SVGElement).setAttribute?.('data-dragging', 'true');
            }

            animController.emit('drag:start', { draggedId: options.compId ?? '' });
            window.addEventListener('pointermove', onPointerMove);
            window.addEventListener('pointerup', onPointerUp);
        },
        [toSVGCoords, onPointerMove, onPointerUp, options.compId]
    );

    return { position, isDragging, dragHandlers: { onPointerDown }, setPosition };
}
