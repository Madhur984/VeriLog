import { useRef, useCallback, useEffect } from 'react';
import { DragState, CompType, AnchorPoint } from '../types';

const INITIAL_DRAG: DragState = {
    id: null,
    type: null,
    originX: 0,
    originY: 0,
    offsetX: 0,
    offsetY: 0,
    currentX: 0,
    currentY: 0,
    anchors: [],
    isFromTray: false,
    isDragging: false
};

export const useDragEngine = (
    svgRef: React.RefObject<SVGSVGElement>,
    onUpdate: () => void
) => {
    const dragRef = useRef<DragState>({ ...INITIAL_DRAG });
    const rafRef = useRef<number>(0);
    const pointerRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
    const needsUpdateRef = useRef(false);

    const screenToSVG = useCallback((clientX: number, clientY: number): { x: number; y: number } | null => {
        const svg = svgRef.current;
        if (!svg) return null;
        const CTM = svg.getScreenCTM();
        if (!CTM) return null;
        const pt = svg.createSVGPoint();
        pt.x = clientX;
        pt.y = clientY;
        const svgPt = pt.matrixTransform(CTM.inverse());
        return { x: svgPt.x, y: svgPt.y };
    }, [svgRef]);

    // RAF loop - runs continuously while dragging
    useEffect(() => {
        const tick = () => {
            if (dragRef.current.isDragging && needsUpdateRef.current) {
                const svgPt = screenToSVG(pointerRef.current.x, pointerRef.current.y);
                if (svgPt) {
                    dragRef.current.currentX = svgPt.x - dragRef.current.offsetX;
                    dragRef.current.currentY = svgPt.y - dragRef.current.offsetY;
                    onUpdate();
                }
                needsUpdateRef.current = false;
            }
            rafRef.current = requestAnimationFrame(tick);
        };
        rafRef.current = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(rafRef.current);
    }, [screenToSVG, onUpdate]);

    const startDrag = useCallback((
        id: string,
        type: CompType,
        x: number,
        y: number,
        anchors: AnchorPoint[],
        e: React.PointerEvent,
        isFromTray = false
    ) => {
        const svgPt = screenToSVG(e.clientX, e.clientY);
        if (!svgPt) return;

        dragRef.current = {
            id,
            type,
            originX: x,
            originY: y,
            offsetX: svgPt.x - x,
            offsetY: svgPt.y - y,
            currentX: x,
            currentY: y,
            anchors,
            isFromTray,
            isDragging: true
        };

        pointerRef.current = { x: e.clientX, y: e.clientY };
        (e.currentTarget as Element).setPointerCapture(e.pointerId);
    }, [screenToSVG]);

    const handleMove = useCallback((e: React.PointerEvent) => {
        if (!dragRef.current.isDragging) return;
        pointerRef.current = { x: e.clientX, y: e.clientY };
        needsUpdateRef.current = true;
    }, []);

    const stopDrag = useCallback(() => {
        dragRef.current.isDragging = false;
    }, []);

    return { dragRef, startDrag, handleMove, stopDrag };
};
