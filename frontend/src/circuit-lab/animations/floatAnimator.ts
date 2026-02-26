import type { AnimModule } from './animationController';

/** Gently bobs unlocked components on the canvas */
export class FloatAnimator implements AnimModule {
    name = 'FloatAnimator';
    private raf = 0;

    init() {
        this.tick();
    }

    private tick = () => {
        // Passive: CSS handles float; this is a no-op stub kept for API compatibility
        this.raf = requestAnimationFrame(this.tick);
    };

    destroy() { cancelAnimationFrame(this.raf); }
}
