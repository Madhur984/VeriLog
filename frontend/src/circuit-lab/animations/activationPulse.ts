/**
 * activationPulse.ts
 *
 * One-shot celebration animation fired when circuit loop completes.
 * Sequence:
 *   0ms   → all live component <g> elements drop -2px (lift illusion)
 *   0-400ms → outer pulse ring opacity 0→0.8→0
 *   100-700ms → bulb fill-opacity ramps 0.85→1.0
 *   700ms → components settle back to 0
 *
 * Direct attribute mutation only. No React. All timing via performance.now().
 */

import type { AnimModule, EventPayload } from './animationController';
import { animController } from './animationController';

interface PulseRing {
    el: SVGCircleElement;
    cx: number;
    cy: number;
    startTime: number;
}

export class ActivationPulse implements AnimModule {
    private svg: SVGSVGElement | null = null;
    private unsubs: (() => void)[] = [];

    // Active animation state
    private liftEls: Array<{ el: SVGElement; bx: number; by: number }> = [];
    private pulseRings: PulseRing[] = [];
    private bulbEl: SVGElement | null = null;
    private startTime = 0;
    private running = false;

    readonly DURATION = 1200; // ms total
    readonly LIFT_PX = -2;

    init(svg: SVGSVGElement) {
        this.svg = svg;
        this.unsubs.push(animController.subscribe('circuit:closed', this.onClosed));
        this.unsubs.push(animController.subscribe('circuit:opened', this.onOpened));
    }

    private onClosed = (_payload: EventPayload) => {
        if (!this.svg || animController.reducedMotion) return;

        this.startTime = performance.now();
        this.running = true;

        // 1. Collect live component groups
        this.liftEls = [];
        const groups = this.svg.querySelectorAll<SVGElement>('g[data-comp-id]');
        groups.forEach((g) => {
            const bx = parseFloat(g.dataset.baseX || '0');
            const by = parseFloat(g.dataset.baseY || '0');
            this.liftEls.push({ el: g, bx, by });
        });

        // 2. Find bulb element
        this.bulbEl = this.svg.querySelector<SVGElement>('g[data-type="bulb"]');

        // 3. Spawn pulse rings at each live component center
        this.pulseRings = [];
        groups.forEach((g, i) => {
            const bx = parseFloat(g.dataset.baseX || '0');
            const by = parseFloat(g.dataset.baseY || '0');

            const ring = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            ring.setAttribute('cx', String(bx));
            ring.setAttribute('cy', String(by));
            ring.setAttribute('r', '5');
            ring.setAttribute('fill', 'none');
            ring.setAttribute('stroke', '#00BFFF');
            ring.setAttribute('stroke-width', '2');
            ring.setAttribute('opacity', '0');
            ring.setAttribute('pointer-events', 'none');
            ring.setAttribute('data-pulse-ring', 'true');
            this.svg!.appendChild(ring);

            this.pulseRings.push({
                el: ring,
                cx: bx,
                cy: by,
                startTime: this.startTime + i * 60, // stagger by 60ms
            });
        });
    };

    private onOpened = () => {
        this.running = false;
        this.cleanup();
    };

    private cleanup() {
        // Remove pulse rings
        this.pulseRings.forEach((r) => r.el.parentNode?.removeChild(r.el));
        this.pulseRings = [];

        // Reset lift
        this.liftEls.forEach(({ el, bx, by }) => {
            el.setAttribute('transform', `translate(${bx}, ${by})`);
        });
        this.liftEls = [];
        this.bulbEl = null;
    }

    tick(_ts: number, _dt: number) {
        if (!this.running || !this.svg) return;

        const now = performance.now();
        const elapsed = now - this.startTime;
        const t = Math.min(elapsed / this.DURATION, 1); // 0→1

        // ── 1. Lift & settle ───────────────────────────────────────────────────
        // Lift: fast in (0→0.1t), hold, ease out back (0.7→1t)
        let liftY = 0;
        if (t < 0.1) {
            liftY = this.LIFT_PX * easeOut(t / 0.1);
        } else if (t < 0.7) {
            liftY = this.LIFT_PX;
        } else {
            liftY = this.LIFT_PX * (1 - easeOut((t - 0.7) / 0.3));
        }

        this.liftEls.forEach(({ el, bx, by }) => {
            el.setAttribute('transform', `translate(${bx}, ${by + liftY})`);
        });

        // ── 2. Pulse rings ─────────────────────────────────────────────────────
        for (const ring of this.pulseRings) {
            const rt = (now - ring.startTime) / 600; // 600ms per ring
            if (rt < 0) continue;
            const rt01 = Math.min(rt, 1);
            const r = 5 + 60 * rt01;
            const opacity = rt01 < 0.5 ? rt01 * 2 * 0.8 : (1 - rt01) * 2 * 0.8;
            ring.el.setAttribute('r', r.toFixed(1));
            ring.el.setAttribute('opacity', opacity.toFixed(3));
        }

        // ── 3. Bulb brightness ramp (runs 100ms-700ms) ─────────────────────────
        if (this.bulbEl) {
            const bt = Math.max(0, Math.min((elapsed - 100) / 600, 1));
            const brightness = 0.85 + 0.15 * easeOut(bt);
            const dome = this.bulbEl.querySelector<SVGPathElement>('path');
            if (dome) dome.setAttribute('opacity', brightness.toFixed(3));
        }

        // ── Done ───────────────────────────────────────────────────────────────
        if (t >= 1) {
            this.running = false;
            // Remove rings but keep everything else (circuit stays closed)
            this.pulseRings.forEach((r) => r.el.parentNode?.removeChild(r.el));
            this.pulseRings = [];
        }
    }

    destroy() {
        this.unsubs.forEach((u) => u());
        this.unsubs = [];
        this.cleanup();
        this.svg = null;
    }
}

function easeOut(t: number): number {
    return 1 - Math.pow(1 - t, 3);
}
