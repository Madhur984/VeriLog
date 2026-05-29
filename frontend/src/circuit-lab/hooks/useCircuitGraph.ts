import { useEffect, useMemo, useRef } from 'react';
import type { CircuitComponent, WireSegment } from '../types';

function buildGraph(
    wires: WireSegment[],
    components: CircuitComponent[]
): Map<string, { anchorId: string; wireId: string }[]> {
    const adj = new Map<string, { anchorId: string; wireId: string }[]>();
    for (const w of wires) {
        if (!adj.has(w.fromAnchorId)) adj.set(w.fromAnchorId, []);
        if (!adj.has(w.toAnchorId)) adj.set(w.toAnchorId, []);
        adj.get(w.fromAnchorId)!.push({ anchorId: w.toAnchorId, wireId: w.id });
        adj.get(w.toAnchorId)!.push({ anchorId: w.fromAnchorId, wireId: w.id });
    }

    // Connect anchors within same component (internal conductance)
    for (const comp of components) {
        if (comp.type === 'switch' && !comp.isClosed) continue;
        for (let i = 0; i < comp.anchors.length; i++) {
            for (let j = i + 1; j < comp.anchors.length; j++) {
                const a = comp.anchors[i].id;
                const b = comp.anchors[j].id;
                if (!adj.has(a)) adj.set(a, []);
                if (!adj.has(b)) adj.set(b, []);
                adj.get(a)!.push({ anchorId: b, wireId: '' });
                adj.get(b)!.push({ anchorId: a, wireId: '' });
            }
        }
    }

    return adj;
}

/** Wire-only adjacency - used for short circuit detection */
function buildWireOnlyGraph(
    wires: WireSegment[]
): Map<string, { anchorId: string; wireId: string }[]> {
    const adj = new Map<string, { anchorId: string; wireId: string }[]>();
    for (const w of wires) {
        if (!adj.has(w.fromAnchorId)) adj.set(w.fromAnchorId, []);
        if (!adj.has(w.toAnchorId)) adj.set(w.toAnchorId, []);
        adj.get(w.fromAnchorId)!.push({ anchorId: w.toAnchorId, wireId: w.id });
        adj.get(w.toAnchorId)!.push({ anchorId: w.fromAnchorId, wireId: w.id });
    }
    return adj;
}

export interface CircuitAnalysis {
    isCircuitClosed: boolean;
    /** True when battery+ connects directly to battery- with no load in path */
    isShortCircuit: boolean;
    liveWireIds: Set<string>;
}

export function analyzeCircuit(
    components: CircuitComponent[],
    wires: WireSegment[]
): CircuitAnalysis {
    const battery = components.find((c) => c.type === 'battery');
    if (!battery) return { isCircuitClosed: false, isShortCircuit: false, liveWireIds: new Set() };

    const positiveAnchor = battery.anchors.find((a) => a.role === 'positive');
    const negativeAnchor = battery.anchors.find((a) => a.role === 'negative');
    if (!positiveAnchor || !negativeAnchor)
        return { isCircuitClosed: false, isShortCircuit: false, liveWireIds: new Set() };

    // ── Full circuit traversal ────────────────────────────────────────────────
    const adj = buildGraph(wires, components);
    const visited = new Set<string>();
    const liveWireIds = new Set<string>();

    function dfs(anchorId: string, parentWireId: string): boolean {
        if (visited.has(anchorId)) return false;
        visited.add(anchorId);

        if (anchorId === negativeAnchor!.id) {
            if (parentWireId) liveWireIds.add(parentWireId);
            return true;
        }

        const neighbors = adj.get(anchorId) ?? [];
        for (const { anchorId: nextId, wireId } of neighbors) {
            if (dfs(nextId, wireId)) {
                if (wireId) liveWireIds.add(wireId);
                return true;
            }
        }
        return false;
    }

    const isCircuitClosed = dfs(positiveAnchor.id, '');

    // ── Short circuit detection ───────────────────────────────────────────────
    // Short = direct wire path from battery+ to battery- that bypasses all loads
    let isShortCircuit = false;

    if (wires.length > 0) {
        const wireAdj = buildWireOnlyGraph(wires);

        // All load component anchor IDs - traversal stops at these
        const loadAnchorIds = new Set<string>();
        for (const comp of components) {
            if (comp.type === 'resistor' || comp.type === 'bulb' || comp.type === 'switch') {
                comp.anchors.forEach((a) => loadAnchorIds.add(a.id));
            }
        }

        const shortVisited = new Set<string>();
        const posId = positiveAnchor.id;
        const negId = negativeAnchor.id;

        function shortDfs(anchorId: string): boolean {
            if (shortVisited.has(anchorId)) return false;
            shortVisited.add(anchorId);
            if (anchorId === negId) return true;
            // Block traversal into load component anchors (not a short then)
            if (loadAnchorIds.has(anchorId) && anchorId !== posId) return false;
            for (const { anchorId: nextId } of (wireAdj.get(anchorId) ?? [])) {
                if (shortDfs(nextId)) return true;
            }
            return false;
        }

        isShortCircuit = shortDfs(posId);
    }

    return { isCircuitClosed, isShortCircuit, liveWireIds };
}

export function useCircuitGraph(
    components: CircuitComponent[],
    wires: WireSegment[]
): CircuitAnalysis {
    const result = useMemo(
        () => analyzeCircuit(components, wires),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [JSON.stringify(components), JSON.stringify(wires)]
    );

    const prevClosed = useRef<boolean | null>(null);
    useEffect(() => {
        if (prevClosed.current !== result.isCircuitClosed) {
            if (result.isCircuitClosed) {
                console.log('LOOP COMPLETE');
            } else {
                console.log('OPEN CIRCUIT');
            }
            prevClosed.current = result.isCircuitClosed;
        }
    }, [result.isCircuitClosed]);

    return result;
}
