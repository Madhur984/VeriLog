import type { AnimModule } from './animationController';

/** Ambient particle field drawn on a separate canvas overlay */
export class ParticleField implements AnimModule {
    name = 'ParticleField';
    // Intentionally lightweight stub — ambient particles are handled via CSS keyframes
    onEvent(_event: string, _data: Record<string, unknown>) { }
}
