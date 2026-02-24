import { SnapNode } from './types';
import { getDistance } from './MagneticField';

export class SnapGrid {
    private nodes: SnapNode[] = [];

    constructor(initialNodes: SnapNode[] = []) {
        this.nodes = initialNodes;
    }

    /**
     * Updates the grid with a new set of nodes.
     */
    setNodes(nodes: SnapNode[]) {
        this.nodes = nodes;
    }

    /**
     * Finds the nearest snap node to a given position.
     * @param excludeOccupied If true, only returns nodes that are not occupied.
     */
    findNearest(
        x: number,
        y: number,
        excludeOccupied: boolean = true
    ): SnapNode | null {
        let nearest: SnapNode | null = null;
        let minDistance = Infinity;

        for (const node of this.nodes) {
            if (excludeOccupied && node.occupied) continue;

            const dist = getDistance(x, y, node.x, node.y);
            if (dist < minDistance) {
                minDistance = dist;
                nearest = node;
            }
        }

        return nearest;
    }

    /**
     * Marks a node as occupied.
     */
    occupy(nodeId: string, compId: string) {
        const node = this.nodes.find(n => n.id === nodeId);
        if (node) {
            node.occupied = true;
            node.occupiedBy = compId;
        }
    }

    /**
     * Marks a node as free.
     */
    release(nodeId: string) {
        const node = this.nodes.find(n => n.id === nodeId);
        if (node) {
            node.occupied = false;
            node.occupiedBy = undefined;
        }
    }

    /**
     * Returns all nodes in the grid.
     */
    getAll(): SnapNode[] {
        return this.nodes;
    }

    /**
     * Static helper to generate snap nodes from component positions.
     * Hardcoded for specific component types for simplicity.
     */
    static generateSnapNodes(components: { id: string, type: string, x: number, y: number }[]): SnapNode[] {
        const nodes: SnapNode[] = [];
        for (const comp of components) {
            // For each component, generate connection pads
            if (comp.type === 'battery') {
                nodes.push({ id: `${comp.id}-in`, x: comp.x, y: comp.y - 40, occupied: false });
                nodes.push({ id: `${comp.id}-out`, x: comp.x, y: comp.y + 40, occupied: false });
            } else if (comp.type === 'bulb') {
                nodes.push({ id: `${comp.id}-in`, x: comp.x - 28, y: comp.y, occupied: false });
                nodes.push({ id: `${comp.id}-out`, x: comp.x + 28, y: comp.y, occupied: false });
            } else if (comp.type === 'resistor') {
                nodes.push({ id: `${comp.id}-in`, x: comp.x - 45, y: comp.y, occupied: false });
                nodes.push({ id: `${comp.id}-out`, x: comp.x + 45, y: comp.y, occupied: false });
            } else if (comp.type === 'switch') {
                nodes.push({ id: `${comp.id}-in`, x: comp.x - 30, y: comp.y, occupied: false });
                nodes.push({ id: `${comp.id}-out`, x: comp.x + 30, y: comp.y, occupied: false });
            }
        }
        return nodes;
    }
}
