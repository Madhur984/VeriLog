import { useMemo } from 'react';
import type { CircuitComponent, WireSegment } from '../types';

interface GraphResult {
    isCircuitClosed: boolean;
    isShortCircuit: boolean;
    liveWireIds: Set<string>;
}

export function useCircuitGraph(
    components: CircuitComponent[],
    wires: WireSegment[]
): GraphResult {
    return useMemo<GraphResult>(() => {
        if (components.length === 0 || wires.length === 0) {
            return { isCircuitClosed: false, isShortCircuit: false, liveWireIds: new Set() };
        }

        // Build adjacency: anchorId -> anchorId via wires
        const adj = new Map<string, string[]>();
        const wireByPair = new Map<string, string>();

        const addEdge = (a: string, b: string) => {
            if (!adj.has(a)) adj.set(a, []);
            if (!adj.has(b)) adj.set(b, []);
            adj.get(a)!.push(b);
            adj.get(b)!.push(a);
        };

        for (const wire of wires) {
            addEdge(wire.fromAnchorId, wire.toAnchorId);
            const key = [wire.fromAnchorId, wire.toAnchorId].sort().join('|');
            wireByPair.set(key, wire.id);
        }

        // Add internal connections within each component (in -> out, pos -> neg etc.)
        // Only for closed switches; other components always conduct
        for (const comp of components) {
            if (comp.type === 'switch' && !comp.isClosed) continue;
            if (comp.anchors.length === 2) {
                addEdge(comp.anchors[0].id, comp.anchors[1].id);
            }
        }

        // Find battery
        const battery = components.find((c) => c.type === 'battery');
        if (!battery) return { isCircuitClosed: false, isShortCircuit: false, liveWireIds: new Set() };

        const posAnchor = battery.anchors.find((a) => a.role === 'positive');
        const negAnchor = battery.anchors.find((a) => a.role === 'negative');
        if (!posAnchor || !negAnchor) return { isCircuitClosed: false, isShortCircuit: false, liveWireIds: new Set() };

        // BFS from positive terminal, see if we reach negative terminal
        const visited = new Set<string>();
        const queue: string[] = [posAnchor.id];
        const path: string[] = [];

        while (queue.length > 0) {
            const curr = queue.shift()!;
            if (visited.has(curr)) continue;
            visited.add(curr);
            path.push(curr);
            for (const neighbor of adj.get(curr) ?? []) {
                if (!visited.has(neighbor)) queue.push(neighbor);
            }
        }

        const isCircuitClosed = visited.has(negAnchor.id);

        // Detect short circuit: closed loop with no load (bulb or resistor) in the path
        let isShortCircuit = false;
        if (isCircuitClosed) {
            const hasLoad = components.some(
                (c) => (c.type === 'bulb' || c.type === 'resistor') &&
                    c.anchors.some((a) => visited.has(a.id))
            );
            isShortCircuit = !hasLoad;
        }

        // Collect live wire ids
        const liveWireIds = new Set<string>();
        if (isCircuitClosed) {
            for (const wire of wires) {
                if (visited.has(wire.fromAnchorId) && visited.has(wire.toAnchorId)) {
                    liveWireIds.add(wire.id);
                }
            }
        }

        return { isCircuitClosed, isShortCircuit, liveWireIds };
    }, [components, wires]);
}
