import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import type { CompType } from '../components/Activities/CircuitCanvas';
import { findNearestSnapNode, SnapNode, SnapResult } from '../simulator/snapping';

// ─────────────────────────────────────────────────────
//  Types
// ─────────────────────────────────────────────────────

interface TrayDragState {
    /** Currently dragging from the sidebar tray */
    isDragging: boolean;
    /** Component type being dragged */
    dragType: CompType | null;
    /** Cursor position in SVG coordinate space */
    cursorX: number;
    cursorY: number;
    /** Nearest snap node within threshold (or null) */
    nearestSnap: SnapResult | null;
}

interface TrayDragActions {
    /** Begin drag from sidebar: sets type + captures pointer */
    startDrag: (type: CompType) => void;
    /** Update cursor position (call from canvas onPointerMove) */
    updateCursor: (svgX: number, svgY: number, snapNodes: SnapNode[]) => void;
    /** End the drag: returns whether the drop was accepted + snap coordinates */
    endDrag: () => { accepted: boolean; x: number; y: number; snapNodeId?: string; dragType: CompType | null };
    /** Cancel without placing */
    cancelDrag: () => void;
}

type TrayDragContextValue = TrayDragState & TrayDragActions;

// ─────────────────────────────────────────────────────
//  Context
// ─────────────────────────────────────────────────────

const TrayDragContext = createContext<TrayDragContextValue | null>(null);

export function useTrayDrag(): TrayDragContextValue {
    const ctx = useContext(TrayDragContext);
    if (!ctx) throw new Error('useTrayDrag must be used within TrayDragProvider');
    return ctx;
}

// ─────────────────────────────────────────────────────
//  Provider
// ─────────────────────────────────────────────────────

export const TrayDragProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [dragType, setDragType] = useState<CompType | null>(null);
    const [cursorX, setCursorX] = useState(0);
    const [cursorY, setCursorY] = useState(0);
    const [nearestSnap, setNearestSnap] = useState<SnapResult | null>(null);

    // Use ref for high-frequency cursor updates to avoid re-render storms
    const cursorRef = useRef({ x: 0, y: 0 });
    const rafIdRef = useRef<number | null>(null);

    const startDrag = useCallback((type: CompType) => {
        setDragType(type);
        setIsDragging(true);
        setNearestSnap(null);
    }, []);

    const updateCursor = useCallback((svgX: number, svgY: number, snapNodes: SnapNode[]) => {
        cursorRef.current = { x: svgX, y: svgY };

        // Debounce state updates via rAF to prevent jank
        if (rafIdRef.current !== null) return;
        rafIdRef.current = requestAnimationFrame(() => {
            rafIdRef.current = null;
            const { x, y } = cursorRef.current;
            setCursorX(x);
            setCursorY(y);

            const snap = findNearestSnapNode(x, y, snapNodes);
            setNearestSnap(snap);
        });
    }, []);

    const endDrag = useCallback(() => {
        const snap = nearestSnap;
        const currentType = dragType;
        const { x, y } = cursorRef.current;

        setIsDragging(false);
        setDragType(null);
        setNearestSnap(null);

        if (rafIdRef.current !== null) {
            cancelAnimationFrame(rafIdRef.current);
            rafIdRef.current = null;
        }

        if (snap) {
            return {
                accepted: true,
                x: snap.node.x,
                y: snap.node.y,
                snapNodeId: snap.node.id,
                dragType: currentType,
            };
        }

        return { accepted: false, x, y, dragType: currentType };
    }, [nearestSnap, dragType]);

    const cancelDrag = useCallback(() => {
        setIsDragging(false);
        setDragType(null);
        setNearestSnap(null);
        if (rafIdRef.current !== null) {
            cancelAnimationFrame(rafIdRef.current);
            rafIdRef.current = null;
        }
    }, []);

    const value: TrayDragContextValue = {
        isDragging,
        dragType,
        cursorX,
        cursorY,
        nearestSnap,
        startDrag,
        updateCursor,
        endDrag,
        cancelDrag,
    };

    return (
        <TrayDragContext.Provider value={value}>
            {children}
        </TrayDragContext.Provider>
    );
};
