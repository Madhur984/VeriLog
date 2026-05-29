/**
 * useDragMatch.ts
 *
 * Pointer-based drag engine for the Level 1 matching scene.
 * No drag-and-drop libraries. Zero React state during drag.
 *
 * Architecture:
 *   - startDrag captures pointer, records offset
 *   - onPointerMove: RAF-gated translate3d writes to chip DOM element
 *   - onPointerUp: Euclidean proximity check against all drop zones
 *     → correct:   CSS lock animation, green border, match record
 *     → incorrect: CSS shake animation, chip returns to origin
 *
 * Returns:
 *   { startDrag, matches, lockedChips, isDragging }
 */

import { useRef, useState, useCallback, useEffect } from 'react';

export interface DropZone {
    id: string;
    el: HTMLElement | null;
}

export interface DragChip {
    id: number;
    correctZoneId: string;
}

export interface DragMatchState {
    matches: Record<number, string>;  // chipId → zoneId
    lockedChips: Set<number>;
    isDragging: boolean;
    shakingChip: number | null;
}

const SNAP_RADIUS = 56; // px Euclidean threshold for drop

function euclideanDistance(a: DOMRect, b: DOMRect): number {
    const ax = a.left + a.width / 2;
    const ay = a.top + a.height / 2;
    const bx = b.left + b.width / 2;
    const by = b.top + b.height / 2;
    return Math.sqrt((ax - bx) ** 2 + (ay - by) ** 2);
}

export function useDragMatch(chips: DragChip[], onMatch?: () => void) {
    const [matches, setMatches] = useState<Record<number, string>>({});
    const [lockedChips, setLocked] = useState<Set<number>>(new Set());
    const [isDragging, setIsDragging] = useState(false);
    const [shakingChip, setShaking] = useState<number | null>(null);

    // Live drag state (not React - written directly to DOM)
    const dragRef = useRef<{
        chipId: number;
        el: HTMLElement;
        originX: number;
        originY: number;
        offsetX: number;
        offsetY: number;
        rafId: number;
        currentX: number;
        currentY: number;
    } | null>(null);

    const chipElsRef = useRef<Map<number, HTMLElement>>(new Map());
    const zoneElsRef = useRef<Map<string, HTMLElement>>(new Map());

    // Register chip DOM elements
    const registerChip = useCallback((chipId: number, el: HTMLElement | null) => {
        if (el) chipElsRef.current.set(chipId, el);
        else chipElsRef.current.delete(chipId);
    }, []);

    // Register zone DOM elements
    const registerZone = useCallback((zoneId: string, el: HTMLElement | null) => {
        if (el) zoneElsRef.current.set(zoneId, el);
        else zoneElsRef.current.delete(zoneId);
    }, []);

    const startDrag = useCallback((chipId: number, ev: React.PointerEvent<HTMLElement>) => {
        if (lockedChips.has(chipId)) return;

        const el = chipElsRef.current.get(chipId);
        if (!el) return;

        ev.preventDefault();
        el.setPointerCapture(ev.pointerId);

        const rect = el.getBoundingClientRect();
        const originX = rect.left + rect.width / 2;
        const originY = rect.top + rect.height / 2;

        el.style.willChange = 'transform';
        el.style.zIndex = '100';
        el.style.cursor = 'grabbing';
        el.classList.add('vl-chip--dragging');

        dragRef.current = {
            chipId,
            el,
            originX,
            originY,
            offsetX: ev.clientX - originX,
            offsetY: ev.clientY - originY,
            rafId: 0,
            currentX: 0,
            currentY: 0,
        };

        setIsDragging(true);
    }, [lockedChips]);

    const handlePointerMove = useCallback((ev: PointerEvent) => {
        const d = dragRef.current;
        if (!d) return;

        const dx = (ev.clientX - d.offsetX) - d.originX;
        const dy = (ev.clientY - d.offsetY) - d.originY;
        d.currentX = dx;
        d.currentY = dy;

        cancelAnimationFrame(d.rafId);
        d.rafId = requestAnimationFrame(() => {
            d.el.style.transform = `translate3d(${dx}px,${dy}px,0)`;
        });
    }, []);

    const handlePointerUp = useCallback((ev: PointerEvent) => {
        const d = dragRef.current;
        if (!d) return;
        dragRef.current = null;
        cancelAnimationFrame(d.rafId);
        setIsDragging(false);

        // Find nearest drop zone
        const chipRect = d.el.getBoundingClientRect();
        let nearest: { id: string, el: HTMLElement } | null = null;
        let nearestDist = Infinity;

        for (const [zoneId, zoneEl] of zoneElsRef.current.entries()) {
            const zoneRect = zoneEl.getBoundingClientRect();
            const dist = euclideanDistance(chipRect, zoneRect);
            if (dist < nearestDist) {
                nearestDist = dist;
                nearest = { id: zoneId, el: zoneEl };
            }

            // Subtle pull / magnetic highlight during drag (using CSS classes)
            if (dist < SNAP_RADIUS * 1.5) {
                zoneEl.classList.add('vl-zone--magnetic');
            } else {
                zoneEl.classList.remove('vl-zone--magnetic');
            }
        }

        const chip = chips.find(c => c.id === d.chipId);
        const isCorrect = nearest && nearestDist < SNAP_RADIUS && chip?.correctZoneId === nearest.id;
        const isInRange = nearest && nearestDist < SNAP_RADIUS;

        if (isCorrect && nearest) {
            // Lock animation + record match
            d.el.style.transform = '';
            d.el.style.willChange = '';
            d.el.style.cursor = 'default';
            d.el.classList.remove('vl-chip--dragging');
            d.el.classList.add('vl-chip--lock');
            setTimeout(() => d.el.classList.remove('vl-chip--lock'), 300);

            // clear all magnetic states
            zoneElsRef.current.forEach(el => el.classList.remove('vl-zone--magnetic'));

            setMatches(prev => ({ ...prev, [d.chipId]: nearest!.id }));
            setLocked(prev => new Set([...prev, d.chipId]));
            onMatch?.();
        } else if (isInRange && !isCorrect) {
            // Wrong zone - shake then return
            d.el.style.cssText += `--chip-dx:${d.currentX}px;--chip-dy:${d.currentY}px;`;
            d.el.classList.add('vl-chip--shake');
            d.el.classList.remove('vl-chip--dragging');

            // clear magnetic states
            zoneElsRef.current.forEach(el => el.classList.remove('vl-zone--magnetic'));

            setTimeout(() => {
                d.el.classList.remove('vl-chip--shake');
                d.el.classList.add('vl-chip--return');
                setTimeout(() => {
                    d.el.classList.remove('vl-chip--return');
                    d.el.style.transform = '';
                    d.el.style.willChange = '';
                    d.el.style.cursor = 'grab';
                    d.el.style.zIndex = '';
                }, 320);
            }, 240);

            setShaking(d.chipId);
            setTimeout(() => setShaking(null), 600);
        } else {
            // Dropped nowhere - return to origin
            d.el.classList.add('vl-chip--return');
            d.el.classList.remove('vl-chip--dragging');

            // clear magnetic states
            zoneElsRef.current.forEach(el => el.classList.remove('vl-zone--magnetic'));

            setTimeout(() => {
                d.el.classList.remove('vl-chip--return');
                d.el.style.transform = '';
                d.el.style.willChange = '';
                d.el.style.cursor = 'grab';
                d.el.style.zIndex = '';
            }, 320);
        }

        d.el.releasePointerCapture(ev.pointerId);
    }, [chips, onMatch]);

    useEffect(() => {
        window.addEventListener('pointermove', handlePointerMove, { passive: true });
        window.addEventListener('pointerup', handlePointerUp);
        return () => {
            window.removeEventListener('pointermove', handlePointerMove);
            window.removeEventListener('pointerup', handlePointerUp);
        };
    }, [handlePointerMove, handlePointerUp]);

    const allMatched = chips.length > 0 && lockedChips.size === chips.length;

    return {
        startDrag,
        registerChip,
        registerZone,
        matches,
        lockedChips,
        isDragging,
        shakingChip,
        allMatched,
        reset: useCallback(() => {
            setMatches({});
            setLocked(new Set());
            setShaking(null);
        }, []),
    };
}
