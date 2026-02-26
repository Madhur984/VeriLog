import type { AnimModule } from './animationController';

/** Animates electrons flowing along live wires */
export class ElectronFlow implements AnimModule {
    name = 'ElectronFlow';
    private svg: SVGSVGElement | null = null;
    private particles: SVGCircleElement[] = [];
    private raf = 0;
    private _liveWireIds: string[] = [];
    private active = false;

    init(svg: SVGSVGElement) { this.svg = svg; }

    onEvent(event: string, data: Record<string, unknown>) {
        if (event === 'circuit:closed') {
            this._liveWireIds = data.liveWireIds as string[];
            this.start();
        } else if (event === 'circuit:opened' || event === 'circuit:short') {
            this.stop();
        }
    }

    private start() {
        this.active = true;
        this.spawnParticles();
        this.tick();
    }

    private stop() {
        this.active = false;
        cancelAnimationFrame(this.raf);
        this.particles.forEach((p) => p.remove());
        this.particles = [];
    }

    private spawnParticles() {
        if (!this.svg) return;
        this.particles.forEach((p) => p.remove());
        this.particles = [];
        // Spawn 6 glowing dots that flow along wire paths
        for (let i = 0; i < 6; i++) {
            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('r', '3');
            circle.setAttribute('fill', '#00BFFF');
            circle.setAttribute('opacity', '0.8');
            circle.setAttribute('filter', 'url(#electron-glow)');
            circle.style.pointerEvents = 'none';
            this.svg.appendChild(circle);
            this.particles.push(circle);
        }
    }

    private tick = () => {
        if (!this.active) return;
        // Simple: just pulse opacity to give a "flow" feel without path interpolation
        const t = performance.now() / 1000;
        this.particles.forEach((p, i) => {
            const phase = (t + i * 0.3) % 1;
            p.setAttribute('opacity', String(0.3 + phase * 0.7));
        });
        this.raf = requestAnimationFrame(this.tick);
    };

    destroy() { this.stop(); }
}
