import type { AnimModule } from './animationController';

/** Short-circuit warning overlay controller */
export class ShortCircuit implements AnimModule {
    name = 'ShortCircuit';
    private overlay: HTMLElement | null = null;

    init() {
        this.overlay = document.getElementById('sigma-short-overlay');
    }

    onEvent(event: string) {
        if (!this.overlay) this.overlay = document.getElementById('sigma-short-overlay');
        if (event === 'circuit:short') {
            if (this.overlay) {
                this.overlay.style.display = 'flex';
            }
        } else if (event === 'circuit:short:cleared' || event === 'circuit:opened') {
            if (this.overlay) {
                this.overlay.style.display = 'none';
            }
        }
    }
}
