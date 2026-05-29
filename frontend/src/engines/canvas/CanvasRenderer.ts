/**
 * CanvasRenderer.ts - Abstract canvas rendering interface
 *
 * Decouples circuit rendering from implementation.
 * Current implementation: SVGRenderer (React SVG).
 * Future: WebGL/PixiJS renderer can be swapped in without changing consumers.
 */

export interface RenderNode {
    id: string;
    type: string;
    x: number;
    y: number;
    width: number;
    height: number;
    label: string;
    selected: boolean;
    portStates: { voltage: number; logic: boolean }[];
}

export interface RenderEdge {
    id: string;
    fromNode: string;
    fromPort: number;
    toNode: string;
    toPort: number;
    fromX: number;
    fromY: number;
    toX: number;
    toY: number;
    isLive: boolean;
}

export interface RenderOptions {
    zoom: number;
    panX: number;
    panY: number;
    showGrid: boolean;
    showXRay: boolean;
    gridSize: number;
}

/**
 * Abstract renderer - implement this interface to swap rendering backends.
 */
export interface ICanvasRenderer {
    /** Initialize the renderer (e.g., create WebGL context) */
    init(container: HTMLElement): void;

    /** Render the full scene */
    render(nodes: RenderNode[], edges: RenderEdge[], options: RenderOptions): void;

    /** Handle viewport changes */
    setViewport(zoom: number, panX: number, panY: number): void;

    /** Hit test - find node/edge at position */
    hitTest(x: number, y: number): { type: 'node' | 'edge' | 'port' | 'none'; id: string; portIndex?: number };

    /** Cleanup resources */
    destroy(): void;
}

/**
 * Default rendering options
 */
export const DEFAULT_RENDER_OPTIONS: RenderOptions = {
    zoom: 1,
    panX: 0,
    panY: 0,
    showGrid: true,
    showXRay: false,
    gridSize: 20,
};

/**
 * Utility: compute port position on a node
 */
export function getPortPosition(
    node: RenderNode,
    portIndex: number,
    isOutput: boolean,
    totalPorts: number,
): { x: number; y: number } {
    const spacing = node.height / (totalPorts + 1);
    const y = node.y + spacing * (portIndex + 1);
    const x = isOutput ? node.x + node.width : node.x;
    return { x, y };
}

/**
 * Utility: compute Bezier control points for edge rendering
 */
export function computeBezierPath(
    fromX: number,
    fromY: number,
    toX: number,
    toY: number,
): string {
    const dx = Math.abs(toX - fromX) * 0.4;
    return `M${fromX},${fromY} C${fromX + dx},${fromY} ${toX - dx},${toY} ${toX},${toY}`;
}
