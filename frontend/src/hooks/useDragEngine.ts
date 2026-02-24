import { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { DragEngine } from '../engine/DragEngine';
import { SnapGrid } from '../engine/SnapGrid';
import { CompType, DropResult, SnapNode } from '../engine/types';

export function useDragEngine(
    initialSnapNodes: SnapNode[],
    onDrop: (result: DropResult) => void
) {
    const snapGrid = useMemo(() => new SnapGrid(initialSnapNodes), []);
    const [isDragging, setIsDragging] = useState(false);
    const [nearestSnap, setNearestSnap] = useState<SnapNode | null>(null);
    const [magneticForce, setMagneticForce] = useState(0);

    const onDropRef = useRef(onDrop);
    onDropRef.current = onDrop;

    const dragEngine = useRef<DragEngine | null>(null);

    if (!dragEngine.current) {
        dragEngine.current = new DragEngine(snapGrid, {
            onDragUpdate: (state) => {
                // Throttle React state updates if needed, current implementation 
                // depends on call-frequency. For essentials, we set state.
                if (state.isDragging !== undefined) setIsDragging(state.isDragging);
                if (state.nearestSnap !== undefined) setNearestSnap(state.nearestSnap);
                if (state.magneticForce !== undefined) setMagneticForce(state.magneticForce);
            },
            onDrop: (result) => {
                setIsDragging(false);
                setNearestSnap(null);
                setMagneticForce(0);
                onDropRef.current(result);
            },
            onCancel: () => {
                setIsDragging(false);
                setNearestSnap(null);
                setMagneticForce(0);
            }
        });
    }

    // Update snap nodes if they change in React-land
    useEffect(() => {
        snapGrid.setNodes(initialSnapNodes);
    }, [initialSnapNodes, snapGrid]);

    const startTrayDrag = useCallback((type: CompType, e: React.PointerEvent) => {
        setIsDragging(true);
        dragEngine.current?.startDrag(
            'tray',
            type,
            null,
            e.clientX,
            e.clientY,
            e.clientX, // For tray drag, origin is current but it doesn't matter much as we follow cursor
            e.clientY
        );
    }, []);

    const startCanvasDrag = useCallback((
        id: string,
        type: CompType,
        x: number,
        y: number,
        e: React.PointerEvent
    ) => {
        setIsDragging(true);
        dragEngine.current?.startDrag(
            'canvas',
            type,
            id,
            e.clientX,
            e.clientY,
            x,
            y
        );
    }, []);

    const updateCursor = useCallback((e: PointerEvent | React.PointerEvent) => {
        dragEngine.current?.updateCursor(e.clientX, e.clientY);
    }, []);

    const endDrag = useCallback(() => {
        return dragEngine.current?.endDrag();
    }, []);

    const setRefs = useCallback((canvas: SVGSVGElement | null, ghost: SVGGElement | null) => {
        dragEngine.current?.setRefs(canvas, ghost);
    }, []);

    return {
        isDragging,
        dragType: dragEngine.current?.getDragType() || null,
        nearestSnap,
        magneticForce,
        startTrayDrag,
        startCanvasDrag,
        updateCursor,
        endDrag,
        setRefs,
        snapGrid
    };
}
