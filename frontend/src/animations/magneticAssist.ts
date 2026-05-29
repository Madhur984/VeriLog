/**
 * magneticAssist.ts
 *
 * Visual-only magnetic pull effect when dragging near valid snap nodes.
 * NEVER modifies simulation state - purely cosmetic.
 *
 * Listens for 'drag:near-node' events and directly mutates SVG attributes
 * on anchor circles: scale-up (1.1x), glow filter, subtle ghost pos offset.
 */

import type { AnimModule, EventPayload } from './animationController';
import { animController } from './animationController';

interface MagnetState {
    anchorId: string;
    /** Current scale, converging to target */
    scale: number;
    targetScale: number;
    /** Ghost offset applied to dragged element (max 6px) */
    ghostOffset: { x: number; y: number };
}

export class MagneticAssist implements AnimModule {
    private svg: SVGSVGElement | null = null;
    private activeStates = new Map<string, MagnetState>();
    private activeDragEl: SVGElement | null = null;
    private unsubs: (() => void)[] = [];

    init(svg: SVGSVGElement) {
        this.svg = svg;

        this.unsubs.push(
            animController.subscribe('drag:near-node', this.onNearNode),
            animController.subscribe('drag:end', this.onDragEnd),
            animController.subscribe('drag:start', this.onDragStart)
        );
    }

    private onDragStart = (payload: EventPayload) => {
        const draggedId = payload.draggedId as string;
        if (!this.svg) return;
        this.activeDragEl =
            this.svg.querySelector<SVGElement>(`g[data-comp-id="${draggedId}"]`) ?? null;
    };

    private onNearNode = (payload: EventPayload) => {
        if (!this.svg) return;

        const nearbyIds = payload.nearbyAnchorIds as string[];
        const dist = payload.dist as number; // closest dist in SVG units
        const draggedId = payload.draggedId as string;
        const ghostDir = payload.ghostDir as { x: number; y: number } | undefined;

        // Scale target ∝ proximity: full 1.1 at dist≤15, fading to 1.0 at dist=30
        const proximity = Math.max(0, 1 - dist / 30);
        const targetScale = 1 + 0.1 * proximity;

        for (const anchorId of nearbyIds) {
            if (!this.activeStates.has(anchorId)) {
                this.activeStates.set(anchorId, {
                    anchorId,
                    scale: 1,
                    targetScale: 1,
                    ghostOffset: { x: 0, y: 0 },
                });
            }
            const state = this.activeStates.get(anchorId)!;
            state.targetScale = targetScale;

            if (ghostDir && draggedId) {
                const maxPull = 6 * proximity;
                state.ghostOffset = {
                    x: ghostDir.x * maxPull,
                    y: ghostDir.y * maxPull,
                };
            }
        }

        // Clear nodes no longer near
        for (const [id, state] of this.activeStates) {
            if (!nearbyIds.includes(id)) state.targetScale = 1;
        }
    };

    private onDragEnd = () => {
        // Taper everything back to normal
        for (const state of this.activeStates.values()) {
            state.targetScale = 1;
            state.ghostOffset = { x: 0, y: 0 };
        }
        this.activeDragEl = null;
    };

    tick(_ts: number, _dt: number) {
        if (!this.svg) return;

        const toRemove: string[] = [];

        for (const [anchorId, state] of this.activeStates) {
            // Smooth convergence (~8 frames)
            state.scale += (state.targetScale - state.scale) * 0.12;

            const circle = this.svg.querySelector<SVGCircleElement>(
                `circle[data-anchor-id="${anchorId}"]`
            );

            if (circle) {
                const isActive = Math.abs(state.scale - 1) > 0.002;

                if (isActive) {
                    circle.setAttribute('transform', `scale(${state.scale.toFixed(4)})`);
                    circle.setAttribute('filter', 'url(#magnetGlow)');
                } else {
                    // Back to resting state - clear extra attrs
                    circle.removeAttribute('filter');
                    circle.setAttribute('transform', '');
                    toRemove.push(anchorId);
                }
            }
        }

        // Apply ghost offset to dragged group (visual only)
        if (this.activeDragEl) {
            // Find dominant active state
            let maxPull = { x: 0, y: 0 };
            for (const state of this.activeStates.values()) {
                if (Math.abs(state.ghostOffset.x) > Math.abs(maxPull.x))
                    maxPull.x = state.ghostOffset.x;
                if (Math.abs(state.ghostOffset.y) > Math.abs(maxPull.y))
                    maxPull.y = state.ghostOffset.y;
            }
            const existing = this.activeDragEl.getAttribute('data-ghost-x');
            const cur = { x: parseFloat(existing || '0'), y: parseFloat(this.activeDragEl.getAttribute('data-ghost-y') || '0') };
            const nx = cur.x + (maxPull.x - cur.x) * 0.12;
            const ny = cur.y + (maxPull.y - cur.y) * 0.12;
            this.activeDragEl.setAttribute('data-ghost-x', nx.toFixed(3));
            this.activeDragEl.setAttribute('data-ghost-y', ny.toFixed(3));
            // Blend into existing transform
            const bx = parseFloat(this.activeDragEl.dataset.baseX || '0');
            const by = parseFloat(this.activeDragEl.dataset.baseY || '0');
            this.activeDragEl.setAttribute('transform', `translate(${bx + nx}, ${by + ny})`);
        }

        for (const id of toRemove) this.activeStates.delete(id);
    }

    destroy() {
        this.unsubs.forEach((u) => u());
        this.unsubs = [];
        this.svg = null;
        this.activeStates.clear();
    }
}
