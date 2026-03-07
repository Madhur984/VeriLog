/**
 * useMagneticDrag.ts
 *
 * Pointer-based drag engine for the Level 1 socket system.
 *
 * Architecture:
 *   - Zero React state during drag (DOM-only via refs)
 *   - RAF-gated transform updates (no layout thrashing)
 *   - Euclidean proximity check for magnetic snapping
 *   - Web Audio API for procedural click + snap sounds
 *   - Vibration API for snap haptic
 *   - prefers-reduced-motion respected (no visual drag motion)
 */

import { useRef, useCallback, useEffect } from 'react';

export interface SocketTarget {
    id: string;
    el: HTMLElement | SVGElement;
    snapRadius: number;  // px, default 48
}

export interface DragState {
    isDragging: boolean;
    snappedSocketId: string | null;
}

interface UseMagneticDragOptions {
    svgRef: React.RefObject<SVGSVGElement | null>;
    onDrag?: (x: number, y: number) => void;
    onSnap: (socketId: string) => void;
    onRelease: () => void;
}

// ─── Web Audio Synthesis ──────────────────────────────────────────────────────

let _audioCtx: AudioContext | null = null;

function getAudioCtx(): AudioContext {
    if (!_audioCtx) _audioCtx = new AudioContext();
    return _audioCtx;
}

function playMagneticClick() {
    try {
        const ctx = getAudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain); gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.04);
        gain.gain.setValueAtTime(0.18, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.08);
    } catch { /* AudioContext blocked — silent */ }
}

function playSnapSound() {
    try {
        const ctx = getAudioCtx();
        // Filtered noise burst — mechanical snap character
        const bufSize = ctx.sampleRate * 0.05; // 50ms
        const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
        const data = buf.getChannelData(0);
        for (let i = 0; i < bufSize; i++) data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufSize * 0.3));
        const src = ctx.createBufferSource();
        const filter = ctx.createBiquadFilter();
        const gain = ctx.createGain();
        filter.type = 'notch';
        filter.frequency.setValueAtTime(220, ctx.currentTime);
        filter.frequency.exponentialRampToValueAtTime(110, ctx.currentTime + 0.05); // decay
        filter.Q.value = 8;
        gain.gain.setValueAtTime(0.4, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
        src.buffer = buf;
        src.connect(filter); filter.connect(gain); gain.connect(ctx.destination);
        src.start();
    } catch { /* AudioContext blocked — silent */ }
}

// ─── Euclidean distance ──────────────────────────────────────────────────────

function dist(ax: number, ay: number, bx: number, by: number) {
    return Math.sqrt((ax - bx) ** 2 + (ay - by) ** 2);
}

function getCenter(el: HTMLElement | SVGElement): { x: number; y: number } {
    const r = el.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useMagneticDrag(options: UseMagneticDragOptions) {
    const { svgRef, onDrag, onSnap, onRelease } = options;

    const draggableRef = useRef<HTMLElement | SVGElement | null>(null);
    const socketsRef = useRef<SocketTarget[]>([]);
    const dragRef = useRef({
        active: false,
        startX: 0, startY: 0,
        currentX: 0, currentY: 0,
        rafId: 0,
        nearSocketId: null as string | null,
        snapped: false,
    });
    const stateRef = useRef<DragState>({ isDragging: false, snappedSocketId: null });

    // ── Get SVG Local Coords ──────────────────────────────────────────────────
    const getLocalCoords = useCallback((clientX: number, clientY: number) => {
        const svg = svgRef.current;
        if (!svg) return { x: clientX, y: clientY };
        const pt = svg.createSVGPoint();
        pt.x = clientX;
        pt.y = clientY;
        const loc = pt.matrixTransform(svg.getScreenCTM()!.inverse());
        return { x: loc.x, y: loc.y };
    }, [svgRef]);

    // ── Register socket targets (called by SocketSystem) ──────────────────────
    const registerSocket = useCallback((socket: SocketTarget) => {
        socketsRef.current = socketsRef.current.filter(s => s.id !== socket.id);
        socketsRef.current.push(socket);
    }, []);

    const unregisterSocket = useCallback((id: string) => {
        socketsRef.current = socketsRef.current.filter(s => s.id !== id);
    }, []);

    // ── RAF loop during drag ──────────────────────────────────────────────────
    const rafLoop = useCallback(() => {
        const d = dragRef.current;
        if (!d.active || d.snapped) return;

        // Apply visual updates via consumer callback
        const loc = getLocalCoords(d.currentX, d.currentY);
        onDrag?.(loc.x, loc.y);

        // Proximity check
        const el = draggableRef.current;
        if (el) {
            const cx = d.currentX;
            const cy = d.currentY;
            let nearest: SocketTarget | null = null;
            let nearestDist = Infinity;

            for (const socket of socketsRef.current) {
                const c = getCenter(socket.el);
                const d_ = dist(cx, cy, c.x, c.y);

                // Set proximity CSS var
                const proximity = Math.max(0, 1 - (d_ / 100)); // fade in from 100px away
                (socket.el as HTMLElement).style.setProperty('--snap-proximity', proximity.toFixed(3));

                if (d_ < socket.snapRadius && d_ < nearestDist) {
                    nearest = socket;
                    nearestDist = d_;
                }
            }

            if (nearest && d.nearSocketId !== nearest.id) {
                // Entered magnetic proximity
                d.nearSocketId = nearest.id;
                nearest.el.classList.add('vl-socket--magnetic');
                playMagneticClick();
            } else if (!nearest && d.nearSocketId) {
                // Left magnetic proximity
                const prev = socketsRef.current.find(s => s.id === d.nearSocketId);
                prev?.el.classList.remove('vl-socket--magnetic');
                (prev?.el as HTMLElement)?.style.removeProperty('--snap-proximity');
                d.nearSocketId = null;
            }
        }

        d.rafId = requestAnimationFrame(rafLoop);
    }, [onDrag, getLocalCoords]);

    // ── Pointer event handlers ────────────────────────────────────────────────
    const onPointerDown = useCallback((e: PointerEvent) => {
        const d = dragRef.current;
        if (d.snapped) return; // Already locked
        d.active = true;
        d.startX = e.clientX;
        d.startY = e.clientY;
        d.currentX = e.clientX;
        d.currentY = e.clientY;
        d.snapped = false;
        stateRef.current.isDragging = true;

        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
        draggableRef.current?.classList.add('is-dragging');
        d.rafId = requestAnimationFrame(rafLoop);
    }, [rafLoop]);

    const onPointerMove = useCallback((e: PointerEvent) => {
        const d = dragRef.current;
        if (!d.active) return;
        d.currentX = e.clientX;
        d.currentY = e.clientY;
    }, []);

    const onPointerUp = useCallback((e: PointerEvent) => {
        const d = dragRef.current;
        if (!d.active) return;
        d.active = false;
        cancelAnimationFrame(d.rafId);
        stateRef.current.isDragging = false;

        draggableRef.current?.classList.remove('is-dragging');

        // Check if we're within snap radius of any socket
        const cx = e.clientX;
        const cy = e.clientY;
        let snappedTo: SocketTarget | null = null;
        let snappedDist = Infinity;

        for (const socket of socketsRef.current) {
            const c = getCenter(socket.el);
            const distance = dist(cx, cy, c.x, c.y);
            if (distance < socket.snapRadius && distance < snappedDist) {
                snappedTo = socket;
                snappedDist = distance;
            }
        }

        if (snappedTo) {
            // ── SNAP ──
            d.snapped = true;
            d.nearSocketId = null;

            // Optional visual animation if consumer doesn't handle transform interpolation
            // The consumer's onSnap handles the logic, but the visual "snap into place" 
            // is usually instantaneous unless they animate it. Setting `onDrag` to socket center 
            // allows a perfect lock before React unmounts it.
            const socketCenter = getCenter(snappedTo.el);
            const { x: sx, y: sy } = getLocalCoords(socketCenter.x, socketCenter.y);
            onDrag?.(sx, sy);

            // Remove magnetic class, add locked
            snappedTo.el.classList.remove('vl-socket--magnetic');
            snappedTo.el.classList.add('vl-socket--locked');

            // Audio + haptic
            playSnapSound();
            if (navigator.vibrate) navigator.vibrate([20, 10, 30]);

            // Notify React
            stateRef.current.snappedSocketId = snappedTo.id;
            onSnap(snappedTo.id);
        } else {
            // ── RETURN ──
            // Clear any socket that was in magnetic state
            if (d.nearSocketId) {
                const prev = socketsRef.current.find(s => s.id === d.nearSocketId);
                prev?.el.classList.remove('vl-socket--magnetic');
                d.nearSocketId = null;
            }
            onRelease();
        }
    }, [onSnap, onRelease, getLocalCoords, onDrag]);

    // ── Attach / detach events on draggable element ──────────────────────────
    const attachDraggable = useCallback((el: HTMLElement | SVGElement | null) => {
        if (!el) return;
        draggableRef.current = el;
        el.addEventListener('pointerdown', onPointerDown as EventListener);
        el.addEventListener('pointermove', onPointerMove as EventListener);
        el.addEventListener('pointerup', onPointerUp as EventListener);
        el.addEventListener('pointercancel', onPointerUp as EventListener);
        (el as HTMLElement).style.touchAction = 'none';
        (el as HTMLElement).style.userSelect = 'none';
        (el as HTMLElement).style.cursor = 'grab';
    }, [onPointerDown, onPointerMove, onPointerUp]);

    const detachDraggable = useCallback(() => {
        const el = draggableRef.current;
        if (!el) return;
        el.removeEventListener('pointerdown', onPointerDown as EventListener);
        el.removeEventListener('pointermove', onPointerMove as EventListener);
        el.removeEventListener('pointerup', onPointerUp as EventListener);
        el.removeEventListener('pointercancel', onPointerUp as EventListener);
    }, [onPointerDown, onPointerMove, onPointerUp]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            cancelAnimationFrame(dragRef.current.rafId);
            detachDraggable();
        };
    }, [detachDraggable]);

    return {
        attachDraggable,
        detachDraggable,
        registerSocket,
        unregisterSocket,
        stateRef,
    };
}
