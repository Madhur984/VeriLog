/**
 * shortCircuit.ts
 *
 * AnimModule — Short Circuit Detection & Visual Feedback
 *
 * On 'circuit:short':
 *   - Adds CSS class 'wire--short' to all wire <path> elements → red glow + faster pulse
 *   - Shows VoltMonkey overlay with gravity-drop animation
 *   - No lift illusion (wires stay grounded)
 *
 * On 'circuit:short:cleared':
 *   - Removes all classes, hides overlay
 *
 * Direct SVG/DOM mutation only. No React state touched.
 */

import type { AnimModule, EventPayload } from './animationController';
import { animController } from './animationController';

export class ShortCircuit implements AnimModule {
    private svg: SVGSVGElement | null = null;
    private overlay: HTMLElement | null = null;
    private unsubs: (() => void)[] = [];
    private active = false;

    init(svg: SVGSVGElement) {
        this.svg = svg;
        this.unsubs.push(animController.subscribe('circuit:short', this.onShort));
        this.unsubs.push(animController.subscribe('circuit:short:cleared', this.onCleared));

        // Find the VoltMonkey overlay element by ID (rendered in CircuitLab.tsx, initially hidden)
        this.overlay = document.getElementById('VoltMonkey-short-overlay');
    }

    private onShort = (_payload: EventPayload) => {
        if (!this.svg || animController.reducedMotion) {
            // Even with reduced motion, show the text overlay without animation
            if (this.overlay) {
                this.overlay.style.display = 'flex';
                this.overlay.classList.remove('VoltMonkey-overlay--drop');
            }
            return;
        }

        this.active = true;

        // 1. Add red glow CSS class to all wire paths
        const wirePaths = this.svg.querySelectorAll<SVGPathElement>('path[data-wire-id]');
        wirePaths.forEach((p) => {
            p.classList.add('wire--short');
            p.classList.remove('wire--live');
        });

        // 2. Show VoltMonkey overlay with gravity-drop animation
        if (this.overlay) {
            this.overlay.style.display = 'flex';
            // Force reflow so animation triggers fresh each time
            void (this.overlay as HTMLElement).offsetHeight;
            this.overlay.classList.add('VoltMonkey-overlay--drop');
        }
    };

    private onCleared = (_payload: EventPayload) => {
        if (!this.svg) return;
        this.active = false;

        // Remove short-circuit classes from all wire paths
        const wirePaths = this.svg.querySelectorAll<SVGPathElement>('path[data-wire-id]');
        wirePaths.forEach((p) => {
            p.classList.remove('wire--short');
        });

        // Hide overlay
        if (this.overlay) {
            this.overlay.classList.remove('VoltMonkey-overlay--drop');
            // Delay display:none to allow exit transition if one is added later
            setTimeout(() => {
                if (this.overlay && !this.active) {
                    this.overlay.style.display = 'none';
                }
            }, 300);
        }
    };

    // ShortCircuit is purely event-driven — no per-tick work needed
    tick(_ts: number, _dt: number) {
        // intentionally empty
    }

    destroy() {
        this.unsubs.forEach((u) => u());
        this.unsubs = [];
        this.onCleared({});
        this.svg = null;
        this.overlay = null;
    }
}
