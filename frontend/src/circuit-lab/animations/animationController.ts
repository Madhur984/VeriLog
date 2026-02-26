/**
 * Animation Controller — simple event bus + module registry.
 * Each AnimModule handles a slice of visual behavior.
 */
export interface AnimModule {
    name: string;
    init?(svg: SVGSVGElement): void;
    onEvent?(event: string, data: Record<string, unknown>): void;
    destroy?(): void;
}

class AnimController {
    private modules: AnimModule[] = [];
    private svg: SVGSVGElement | null = null;

    register(module: AnimModule) {
        this.modules.push(module);
        if (this.svg) module.init?.(this.svg);
    }

    init(svg: SVGSVGElement) {
        this.svg = svg;
        for (const m of this.modules) m.init?.(svg);
    }

    emit(event: string, data: Record<string, unknown>) {
        for (const m of this.modules) m.onEvent?.(event, data);
    }

    destroy() {
        for (const m of this.modules) m.destroy?.();
        this.modules = [];
        this.svg = null;
    }
}

export const animController = new AnimController();
