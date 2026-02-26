import type { AnimModule } from './animationController';

/** Pulses glow on components when the circuit activates */
export class ActivationPulse implements AnimModule {
    name = 'ActivationPulse';
    private svg: SVGSVGElement | null = null;

    init(svg: SVGSVGElement) { this.svg = svg; }

    onEvent(event: string) {
        if (event !== 'circuit:closed' || !this.svg) return;
        // Add a brief CSS class pulse to the SVG root
        this.svg.classList.add('circuit-active-pulse');
        setTimeout(() => this.svg?.classList.remove('circuit-active-pulse'), 600);
    }
}
