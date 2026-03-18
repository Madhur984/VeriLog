/**
 * particleField.ts
 *
 * Extremely subtle ambient zero-gravity particle field.
 * Spawns lightweight <circle> elements in a dedicated <g id="cl-particles">.
 * RAF-driven position updates, wraps at canvas bounds.
 * When circuit is closed: adds 6 bright "energy sparks".
 */

import type { AnimModule, EventPayload } from './animationController';
import { animController } from './animationController';

interface Particle {
    el: SVGCircleElement;
    x: number;
    y: number;
    vx: number;
    vy: number;
    r: number;
    opacity: number;
    isSpark: boolean;
}

const W = 1400;
const H = 900;
const BASE_COUNT = 40;
const SPARK_COUNT = 6;

export class ParticleField implements AnimModule {
    private container: SVGGElement | null = null;
    private particles: Particle[] = [];
    private unsubs: (() => void)[] = [];

    init(svg: SVGSVGElement) {
        // Create dedicated container inserted as first child (renders behind everything)
        const existing = svg.querySelector<SVGGElement>('#cl-particles');
        if (existing) {
            this.container = existing;
        } else {
            const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            g.setAttribute('id', 'cl-particles');
            g.setAttribute('pointer-events', 'none');
            // Insert as second child (after the background rect)
            const firstChild = svg.firstElementChild;
            if (firstChild?.nextElementSibling) {
                svg.insertBefore(g, firstChild.nextElementSibling);
            } else {
                svg.appendChild(g);
            }
            this.container = g;
        }

        // Spawn base particles
        for (let i = 0; i < BASE_COUNT; i++) {
            this.spawnParticle(false);
        }

        this.unsubs.push(
            animController.subscribe('circuit:closed', this.onClosed),
            animController.subscribe('circuit:opened', this.onOpened)
        );
    }

    private onClosed = (_payload: EventPayload) => {
        // Add energy sparks on closed circuit
        for (let i = 0; i < SPARK_COUNT; i++) {
            this.spawnParticle(true);
        }
    };

    private onOpened = () => {
        // Remove sparks
        this.particles = this.particles.filter((p) => {
            if (p.isSpark) {
                p.el.parentNode?.removeChild(p.el);
                return false;
            }
            return true;
        });
    };

    private spawnParticle(isSpark: boolean): Particle {
        if (!this.container) return null as unknown as Particle;

        const r = isSpark ? 1.5 + Math.random() * 1.5 : 0.8 + Math.random() * 1.4;
        const x = Math.random() * W;
        const y = Math.random() * H;
        const speed = isSpark ? 0.4 + Math.random() * 0.6 : 0.05 + Math.random() * 0.1;
        const angle = Math.random() * Math.PI * 2;
        const opacity = isSpark ? 0.35 + Math.random() * 0.45 : 0.03 + Math.random() * 0.09;

        const el = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        el.setAttribute('cx', String(x));
        el.setAttribute('cy', String(y));
        el.setAttribute('r', String(r));
        el.setAttribute('fill', isSpark ? '#00BFFF' : '#4a9abb');
        el.setAttribute('opacity', String(opacity));
        if (isSpark) el.setAttribute('filter', 'url(#glow)');
        this.container.appendChild(el);

        const p: Particle = {
            el,
            x,
            y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed * 0.4, // suppress vertical drift
            r,
            opacity,
            isSpark,
        };
        this.particles.push(p);
        return p;
    }

    tick(_ts: number, _dt: number) {
        for (const p of this.particles) {
            p.x += p.vx;
            p.y += p.vy;

            // Gentle zero-g drift — very slight vertical oscillation
            p.vy += (Math.random() - 0.5) * 0.004;
            p.vy *= 0.999; // damping

            // Wrap at edges
            if (p.x < 0) p.x = W;
            if (p.x > W) p.x = 0;
            if (p.y < 0) p.y = H;
            if (p.y > H) p.y = 0;

            p.el.setAttribute('cx', p.x.toFixed(1));
            p.el.setAttribute('cy', p.y.toFixed(1));
        }
    }

    private clearAll() {
        this.particles.forEach((p) => p.el.parentNode?.removeChild(p.el));
        this.particles = [];
    }

    destroy() {
        this.clearAll();
        this.container?.parentNode?.removeChild(this.container);
        this.unsubs.forEach((u) => u());
        this.unsubs = [];
        this.container = null;
    }
}
