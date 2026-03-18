/**
 * floatAnimator.ts
 *
 * Gentle anti-gravity floating for canvas components.
 * Reads <g data-comp-id data-float="true"> from SVG DOM.
 * Pauses instantly on drag, transitions out on connection.
 */

import type { AnimModule } from './animationController';

interface FloatState {
    phase: number;       // unique offset per component (radians)
    period: number;      // oscillation period (ms)
    amplitude: number;   // current Y amplitude (px) — tapers to 0 when connected
    targetAmp: number;   // what amplitude is converging to
    baseTransform: string; // React's transform string for the group
}

const TWO_PI = Math.PI * 2;

export class FloatAnimator implements AnimModule {
    private svg: SVGSVGElement | null = null;
    private states = new Map<string, FloatState>();

    init(svg: SVGSVGElement) {
        this.svg = svg;
    }

    tick(timestamp: number, _dt: number) {
        if (!this.svg) return;

        const groups = this.svg.querySelectorAll<SVGGElement>('g[data-comp-id]');

        groups.forEach((g) => {
            const id = g.dataset.compId!;
            const isDragging = g.dataset.dragging === 'true';
            const isConnected = g.dataset.connected === 'true';

            // Lazy-init state per component
            if (!this.states.has(id)) {
                this.states.set(id, {
                    phase: Math.random() * TWO_PI,
                    period: 6000 + Math.random() * 2000, // 6–8s
                    amplitude: 0,
                    targetAmp: 4,
                    baseTransform: '',
                });
            }

            const state = this.states.get(id)!;

            // Decide target amplitude
            if (isDragging) {
                state.targetAmp = 0;
            } else if (isConnected) {
                state.targetAmp = 0;
            } else {
                state.targetAmp = 4;
            }

            // Smoothly converge amplitude (expo ease, ~0.5s)
            state.amplitude += (state.targetAmp - state.amplitude) * 0.06;

            if (Math.abs(state.amplitude) < 0.01) {
                // No float — clear animation transform, keep base
                g.setAttribute('transform', state.baseTransform || '');
                return;
            }

            const t = (timestamp % state.period) / state.period;
            const angle = TWO_PI * t + state.phase;
            const dy = Math.sin(angle) * state.amplitude;
            const dr = Math.sin(angle * 0.7 + state.phase) * 1.5; // ±1.5deg

            // Get base translate from React (position) — stored in data-base-x/y
            const bx = parseFloat(g.dataset.baseX || '0');
            const by = parseFloat(g.dataset.baseY || '0');

            g.setAttribute(
                'transform',
                `translate(${bx}, ${by + dy}) rotate(${dr}, 0, 0)`
            );
        });
    }

    destroy() {
        this.states.clear();
        this.svg = null;
    }
}
