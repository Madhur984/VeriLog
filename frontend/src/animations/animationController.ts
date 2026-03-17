/**
 * animationController.ts
 *
 * Central RAF orchestrator + event bus for all Workbench animations.
 * Zero React involvement — pure imperative SVG mutation.
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export type AnimEvent =
    | 'circuit:closed'
    | 'circuit:opened'
    | 'circuit:short'
    | 'circuit:short:cleared'
    | 'drag:start'
    | 'drag:move'
    | 'drag:near-node'
    | 'drag:end'
    | 'component:connected'
    | 'component:floating';

export type EventPayload = Record<string, unknown>;
type Handler = (payload: EventPayload) => void;

export interface AnimModule {
    /** Called once per RAF tick with elapsed time */
    tick(timestamp: number, dt: number): void;
    /** Called when the module is registered */
    init(svg: SVGSVGElement): void;
    /** Called when the module is destroyed */
    destroy(): void;
}

// ─── Singleton Controller ─────────────────────────────────────────────────────

class AnimationController {
    private svg: SVGSVGElement | null = null;
    private rafId: number | null = null;
    private lastTs = 0;
    private modules: AnimModule[] = [];
    private listeners = new Map<AnimEvent, Set<Handler>>();

    /** Honour user's OS-level reduced-motion preference */
    readonly reducedMotion: boolean =
        typeof window !== 'undefined'
            ? window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
            : false;

    // ── Lifecycle ──────────────────────────────────────────────────────────────

    init(svg: SVGSVGElement) {
        this.svg = svg;
        this.modules.forEach((m) => m.init(svg));
        if (!this.reducedMotion) this.startRAF();
    }

    destroy() {
        if (this.rafId !== null) {
            cancelAnimationFrame(this.rafId);
            this.rafId = null;
        }
        this.modules.forEach((m) => m.destroy());
        this.modules = [];
        this.listeners.clear();
        this.svg = null;
    }

    // ── Module registration ────────────────────────────────────────────────────

    register(module: AnimModule) {
        this.modules.push(module);
        if (this.svg) module.init(this.svg);
    }

    unregister(module: AnimModule) {
        this.modules = this.modules.filter((m) => m !== module);
        module.destroy();
    }

    // ── Event bus ─────────────────────────────────────────────────────────────

    subscribe(event: AnimEvent, handler: Handler) {
        if (!this.listeners.has(event)) this.listeners.set(event, new Set());
        this.listeners.get(event)!.add(handler);
        return () => this.listeners.get(event)?.delete(handler);
    }

    emit(event: AnimEvent, payload: EventPayload = {}) {
        this.listeners.get(event)?.forEach((h) => h(payload));
    }

    // ── RAF loop ───────────────────────────────────────────────────────────────

    private startRAF() {
        const loop = (ts: number) => {
            const dt = this.lastTs ? Math.min(ts - this.lastTs, 50) : 16; // cap at 50ms
            this.lastTs = ts;
            for (const m of this.modules) m.tick(ts, dt);
            this.rafId = requestAnimationFrame(loop);
        };
        this.rafId = requestAnimationFrame(loop);
    }
}

/** Shared singleton — import this everywhere */
export const animController = new AnimationController();
