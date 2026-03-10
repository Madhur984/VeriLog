/**
 * engine/CircuitSerializer.ts — Circuit JSON Save / Load
 *
 * Defines the canonical JSON format for persisting circuits.
 * Supports localStorage and file download. Supabase will be a future addition.
 */

import type { CanvasNodeData, WireData, ProbeEntry } from '../stores/useWorkbenchStore';

export const CIRCUIT_FORMAT_VERSION = '1.0';

// ── Schema ────────────────────────────────────────────────────────────────

export interface SerializedNode {
    id: string;
    type: string;
    x: number;
    y: number;
    rotation: number;
    label: string;
    params: Record<string, unknown>;
    inputCount: number;
    outputCount: number;
}

export interface SerializedWire {
    id: string;
    from: { nodeId: string; portIndex: number };
    to: { nodeId: string; portIndex: number };
}

export interface SerializedProbe {
    nodeId: string;
    label: string;
    color: string;
}

export interface CircuitFile {
    version: string;
    metadata: {
        name: string;
        description: string;
        author: string;
        createdAt: string;
        updatedAt: string;
    };
    nodes: SerializedNode[];
    wires: SerializedWire[];
    probes: SerializedProbe[];
    simSettings: {
        tickRateHz: number;
        gridSize: number;
    };
}

// ── Serialization ─────────────────────────────────────────────────────────

export function serializeCircuit(
    nodes: Map<string, CanvasNodeData>,
    wires: Map<string, WireData>,
    probes: ProbeEntry[],
    meta: { name?: string; description?: string; author?: string } = {}
): CircuitFile {
    return {
        version: CIRCUIT_FORMAT_VERSION,
        metadata: {
            name: meta.name ?? 'Untitled Circuit',
            description: meta.description ?? '',
            author: meta.author ?? 'student',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        nodes: Array.from(nodes.values()).map(n => ({
            id: n.id,
            type: n.type as string,
            x: n.x,
            y: n.y,
            rotation: n.rotation,
            label: n.label,
            params: { ...n.params } as Record<string, unknown>,
            inputCount: n.inputCount,
            outputCount: n.outputCount,
        })),
        wires: Array.from(wires.values()).map(w => ({
            id: w.id,
            from: { nodeId: w.from.nodeId, portIndex: w.from.portIndex },
            to: { nodeId: w.to.nodeId, portIndex: w.to.portIndex },
        })),
        probes: probes.map(p => ({ nodeId: p.nodeId, label: p.label, color: p.color })),
        simSettings: { tickRateHz: 1000, gridSize: 24 },
    };
}

// ── Deserialization ───────────────────────────────────────────────────────

export interface DeserializedCircuit {
    nodes: CanvasNodeData[];
    wires: WireData[];
    probes: ProbeEntry[];
    simSettings: CircuitFile['simSettings'];
    metadata: CircuitFile['metadata'];
}

export function deserializeCircuit(json: string): DeserializedCircuit | null {
    try {
        const file = JSON.parse(json) as CircuitFile;
        if (!file.version || !file.nodes || !file.wires) {
            console.warn('[CircuitSerializer] Invalid file format');
            return null;
        }

        const nodes: CanvasNodeData[] = file.nodes.map(n => ({
            id: n.id,
            type: n.type as CanvasNodeData['type'],
            x: n.x,
            y: n.y,
            rotation: n.rotation,
            label: n.label,
            params: n.params as CanvasNodeData['params'],
            inputCount: n.inputCount,
            outputCount: n.outputCount,
        }));

        const wires: WireData[] = file.wires.map(w => ({
            id: w.id,
            from: w.from,
            to: w.to,
            isLive: false,
        }));

        const probes: ProbeEntry[] = (file.probes ?? []).map(p => ({
            nodeId: p.nodeId,
            label: p.label,
            color: p.color,
        }));

        return { nodes, wires, probes, simSettings: file.simSettings, metadata: file.metadata };
    } catch (err) {
        console.error('[CircuitSerializer] Parse error:', err);
        return null;
    }
}

// ── Storage ───────────────────────────────────────────────────────────────

const LS_KEY = 'verilog_circuit_autosave';

export function saveToLocalStorage(circuit: CircuitFile): void {
    try {
        localStorage.setItem(LS_KEY, JSON.stringify(circuit));
    } catch {
        console.warn('[CircuitSerializer] localStorage quota exceeded');
    }
}

export function loadFromLocalStorage(): DeserializedCircuit | null {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? deserializeCircuit(raw) : null;
}

export function downloadCircuit(circuit: CircuitFile): void {
    const blob = new Blob([JSON.stringify(circuit, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${circuit.metadata.name.replace(/\s+/g, '_')}.verilog.json`;
    a.click();
    URL.revokeObjectURL(url);
}

export function loadCircuitFromFile(file: File): Promise<DeserializedCircuit | null> {
    return new Promise(resolve => {
        const reader = new FileReader();
        reader.onload = e => resolve(deserializeCircuit(e.target?.result as string));
        reader.onerror = () => resolve(null);
        reader.readAsText(file);
    });
}
