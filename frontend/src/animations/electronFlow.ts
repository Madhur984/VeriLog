/**
 * electronFlow.ts
 *
 * Electron flow animation along live wires when a closed circuit is detected.
 * Uses RAF + direct stroke-dashoffset mutation on <path data-wire-id="...">.
 * Speed proportional to wire count (proxy for simulated current).
 * Lazy: caches path lengths, skips invisible wires.
 */

import type { AnimModule, EventPayload } from './animationController';
import { animController } from './animationController';

interface WireFlowState {
    el: SVGPathElement;
    length: number;
    dashLen: number;
    gapLen: number;
    offset: number;
    speed: number; // px per frame
    glowEl: SVGPathElement | null; // overlay glow path
}

export class ElectronFlow implements AnimModule {
    private svg: SVGSVGElement | null = null;
    private wires = new Map<string, WireFlowState>();
    private isActive = false;
    private liveWireIds = new Set<string>();
    private unsubs: (() => void)[] = [];

    /** Base speed in px/frame; scales with wire count */
    private baseSpeed = 1.8;

    init(svg: SVGSVGElement) {
        this.svg = svg;
        this.unsubs.push(
            animController.subscribe('circuit:closed', this.onClosed),
            animController.subscribe('circuit:opened', this.onOpened)
        );
    }

    private onClosed = (payload: EventPayload) => {
        this.liveWireIds = new Set((payload.liveWireIds as string[] | undefined) ?? []);
        this.isActive = true;
        this.refreshWires();
    };

    private onOpened = () => {
        this.isActive = false;
        this.teardownWires();
    };

    private refreshWires() {
        if (!this.svg) return;

        // Clear stale wires
        this.teardownWires();

        const wireCount = this.liveWireIds.size || 1;
        // Speed: more wires → slightly faster current
        const speed = this.baseSpeed * (1 + wireCount * 0.1);

        const wirePaths = this.svg.querySelectorAll<SVGPathElement>('path[data-wire-id]');

        wirePaths.forEach((path) => {
            const wireId = path.dataset.wireId!;
            if (!this.liveWireIds.has(wireId)) return;

            const length = path.getTotalLength();
            const dashLen = Math.max(12, length * 0.08);
            const gapLen = length - dashLen;

            // Style the base wire path
            path.style.stroke = '#00BFFF';
            path.style.filter = 'url(#electronGlow)';
            path.setAttribute('stroke-dasharray', `${dashLen} ${gapLen}`);
            path.setAttribute('stroke-dashoffset', '0');

            // Create overlay glow path (wider, lower opacity bloom)
            let glowEl: SVGPathElement | null = null;
            const existingGlow = this.svg!.querySelector<SVGPathElement>(
                `path[data-glow-for="${wireId}"]`
            );
            if (!existingGlow) {
                glowEl = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                glowEl.setAttribute('d', path.getAttribute('d') || '');
                glowEl.setAttribute('fill', 'none');
                glowEl.setAttribute('stroke', 'rgba(0,191,255,0.35)');
                glowEl.setAttribute('stroke-width', '8');
                glowEl.setAttribute('stroke-linecap', 'round');
                glowEl.setAttribute('filter', 'url(#electronGlow)');
                glowEl.setAttribute('pointer-events', 'none');
                glowEl.setAttribute('data-glow-for', wireId);
                glowEl.setAttribute('stroke-dasharray', `${dashLen} ${gapLen}`);
                glowEl.setAttribute('stroke-dashoffset', '0');
                path.parentNode?.insertBefore(glowEl, path);
            } else {
                glowEl = existingGlow;
            }

            this.wires.set(wireId, {
                el: path,
                length,
                dashLen,
                gapLen,
                offset: 0,
                speed,
                glowEl,
            });
        });
    }

    private teardownWires() {
        for (const state of this.wires.values()) {
            // Reset path style
            state.el.removeAttribute('stroke-dasharray');
            state.el.removeAttribute('stroke-dashoffset');
            state.el.style.filter = '';

            // Remove glow overlay
            state.glowEl?.parentNode?.removeChild(state.glowEl);
        }
        this.wires.clear();
    }

    tick(_ts: number, _dt: number) {
        if (!this.isActive || !this.svg) return;

        for (const state of this.wires.values()) {
            state.offset -= state.speed;
            if (Math.abs(state.offset) > state.length) state.offset = 0;

            const offsetStr = state.offset.toFixed(2);
            state.el.setAttribute('stroke-dashoffset', offsetStr);
            state.glowEl?.setAttribute('stroke-dashoffset', offsetStr);
        }
    }

    destroy() {
        this.teardownWires();
        this.unsubs.forEach((u) => u());
        this.unsubs = [];
        this.svg = null;
    }
}
