import { useCallback } from 'react';
import { ComponentInstance } from '../types';

export interface LoopPath {
    nodes: string[];
    componentIds: string[];
}

export const useCircuitGraph = () => {
    const detectLoop = useCallback((components: ComponentInstance[]): boolean => {
        if (components.length === 0) return false;

        // Build adjacency: snapNodeId -> [{ snapNodeId, componentId }]
        const adj = new Map<string, { to: string; compId: string }[]>();

        components.forEach(c => {
            // Skip open switches - they break the circuit
            if (c.type === 'switch' && c.isOpen) return;

            const n1 = c.snapNodeIds[0];
            const n2 = c.snapNodeIds[1];
            if (n1 && n2) {
                if (!adj.has(n1)) adj.set(n1, []);
                if (!adj.has(n2)) adj.set(n2, []);
                adj.get(n1)!.push({ to: n2, compId: c.id });
                adj.get(n2)!.push({ to: n1, compId: c.id });
            }
        });

        // Find battery - loop must go from neg through circuit back to pos
        const battery = components.find(c => c.type === 'battery');
        if (!battery || !battery.snapNodeIds[0] || !battery.snapNodeIds[1]) {
            console.log('OPEN CIRCUIT');
            return false;
        }

        const startNode = battery.snapNodeIds[0]!; // neg
        const endNode = battery.snapNodeIds[1]!;    // pos

        // DFS from neg terminal, try to reach pos terminal
        const visited = new Set<string>();

        const dfs = (current: string): boolean => {
            if (current === endNode) return true;
            visited.add(current);

            const neighbors = adj.get(current) || [];
            for (const neighbor of neighbors) {
                if (!visited.has(neighbor.to)) {
                    if (dfs(neighbor.to)) return true;
                }
            }
            return false;
        };

        const found = dfs(startNode);

        if (found) {
            console.log('LOOP COMPLETE');
        } else {
            console.log('OPEN CIRCUIT');
        }

        return found;
    }, []);

    const getLoopPath = useCallback((components: ComponentInstance[]): LoopPath | null => {
        if (components.length === 0) return null;

        const adj = new Map<string, { to: string; compId: string }[]>();

        components.forEach(c => {
            if (c.type === 'switch' && c.isOpen) return;

            const n1 = c.snapNodeIds[0];
            const n2 = c.snapNodeIds[1];
            if (n1 && n2) {
                if (!adj.has(n1)) adj.set(n1, []);
                if (!adj.has(n2)) adj.set(n2, []);
                adj.get(n1)!.push({ to: n2, compId: c.id });
                adj.get(n2)!.push({ to: n1, compId: c.id });
            }
        });

        const battery = components.find(c => c.type === 'battery');
        if (!battery || !battery.snapNodeIds[0] || !battery.snapNodeIds[1]) return null;

        const startNode = battery.snapNodeIds[0]!;
        const endNode = battery.snapNodeIds[1]!;

        const visited = new Set<string>();
        const path: string[] = [];
        const compPath: string[] = [];

        const dfs = (current: string): boolean => {
            path.push(current);
            if (current === endNode) return true;
            visited.add(current);

            const neighbors = adj.get(current) || [];
            for (const neighbor of neighbors) {
                if (!visited.has(neighbor.to)) {
                    compPath.push(neighbor.compId);
                    if (dfs(neighbor.to)) return true;
                    compPath.pop();
                }
            }
            path.pop();
            return false;
        };

        if (dfs(startNode)) {
            return { nodes: [...path], componentIds: [...compPath] };
        }

        return null;
    }, []);

    return { detectLoop, getLoopPath };
};
