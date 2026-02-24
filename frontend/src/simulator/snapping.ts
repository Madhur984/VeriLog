/**
 * Magnetic Snap Engine
 * Logisim-style: components snap to connection nodes when close enough.
 *
 * Two systems:
 * 1. On-canvas drag — component-to-component magnetic pull (MAGNETIC_RADIUS = 44px)
 * 2. Tray-to-canvas drop — snap to predefined SnapNodes (SNAP_THRESHOLD = 25px)
 */

export const GRID_SIZE = 20;
export const MAGNETIC_RADIUS = 44;
export const SNAP_THRESHOLD = 25;

// ─────────────────────────────────────────────────────
//  Interfaces
// ─────────────────────────────────────────────────────

export interface NodePosition {
    compId: string;
    nodeKey: 'in' | 'out';
    x: number;
    y: number;
}

export interface MagneticTarget {
    x: number;
    y: number;
    compId: string;
    nodeKey: 'in' | 'out';
    /** 0-1, how close we are (1 = perfectly on top) */
    strength: number;
}

/** A fixed connection point on the canvas that components snap to */
export interface SnapNode {
    id: string;
    x: number;
    y: number;
    connectedTo?: string; // component ID currently occupying this node
}

/** Result of a snap-node proximity search */
export interface SnapResult {
    node: SnapNode;
    distance: number;
    /** 0-1, strength of attraction (1 = on top) */
    strength: number;
}

// ─────────────────────────────────────────────────────
//  Grid snap
// ─────────────────────────────────────────────────────

export function snapToGrid(x: number, y: number, gridSize = GRID_SIZE): { x: number; y: number } {
    return {
        x: Math.round(x / gridSize) * gridSize,
        y: Math.round(y / gridSize) * gridSize,
    };
}

// ─────────────────────────────────────────────────────
//  Component-to-component magnetic snap (on-canvas drag)
// ─────────────────────────────────────────────────────

export function findMagneticTarget(
    cursorX: number,
    cursorY: number,
    nodes: NodePosition[],
    excludeCompId: string,
    radius = MAGNETIC_RADIUS
): MagneticTarget | null {
    let best: MagneticTarget | null = null;
    let bestDist = radius;

    for (const node of nodes) {
        if (node.compId === excludeCompId) continue;
        const dx = cursorX - node.x;
        const dy = cursorY - node.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < bestDist) {
            bestDist = dist;
            best = {
                x: node.x,
                y: node.y,
                compId: node.compId,
                nodeKey: node.nodeKey,
                strength: 1 - dist / radius,
            };
        }
    }

    return best;
}

export function applyMagneticPull(
    rawX: number,
    rawY: number,
    target: MagneticTarget | null
): { x: number; y: number } {
    if (!target) return { x: rawX, y: rawY };
    const pull = target.strength * target.strength;
    return {
        x: rawX + (target.x - rawX) * pull,
        y: rawY + (target.y - rawY) * pull,
    };
}

// ─────────────────────────────────────────────────────
//  Tray-to-canvas snap (snap node proximity)
// ─────────────────────────────────────────────────────

/**
 * Find the nearest unoccupied snap node within SNAP_THRESHOLD.
 * Returns null if no valid node is close enough.
 */
export function findNearestSnapNode(
    cursorX: number,
    cursorY: number,
    snapNodes: SnapNode[],
    threshold = SNAP_THRESHOLD
): SnapResult | null {
    let best: SnapResult | null = null;
    let bestDist = threshold;

    for (const node of snapNodes) {
        // Skip nodes that already have a component connected
        if (node.connectedTo) continue;

        const dx = cursorX - node.x;
        const dy = cursorY - node.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < bestDist) {
            bestDist = dist;
            best = {
                node,
                distance: dist,
                strength: 1 - dist / threshold,
            };
        }
    }

    return best;
}

/**
 * Generate snap nodes from all placed components' connection points.
 * Each node becomes a potential attachment point for new components.
 */
export function generateSnapNodes(
    components: { id: string; type: string; x: number; y: number }[],
    getNodePositions: (comp: { id: string; type: string; x: number; y: number }) => NodePosition[]
): SnapNode[] {
    const nodes: SnapNode[] = [];
    for (const comp of components) {
        for (const pos of getNodePositions(comp)) {
            nodes.push({
                id: `${pos.compId}-${pos.nodeKey}`,
                x: pos.x,
                y: pos.y,
            });
        }
    }
    return nodes;
}
