import type { AnimModule } from './animationController';

/** Pulls component SVG elements toward snap targets while dragging */
export class MagneticAssist implements AnimModule {
    name = 'MagneticAssist';
    // Snap behavior is handled in the Canvas drag logic; this is an event listener stub
    onEvent(_event: string, _data: Record<string, unknown>) { }
}
