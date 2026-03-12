/**
 * engine/CircuitSerializer.ts — Circuit JSON Save / Load
 *
 * Defines the canonical JSON format for persisting circuits.
 * Supports localStorage and file download. Supabase will be a future addition.
 */

import type { ProbeEntry } from '../stores/useWorkbenchStore';
import type { WireSegment, CanvasNodeData } from '../types/circuit';

export const CIRCUIT_FORMAT_VERSION = '2.0';

// ── Schema ────────────────────────────────────────────────────────────────

export interface SerializedNode {
    id: string;
    type: string;
    x: number;
    y: number;
    rotation: number;
    label: string;
    params: Record<string, unknown>;
}

export interface SerializedSegment {
    id: string;
    x1: number;
    y1: number;
    x2: number;
    y2: number;
}

export interface SerializedProbe {
    nodeId: string;
    portId: string;
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
    segments: SerializedSegment[];
    probes: SerializedProbe[];
    simSettings: {
        tickRateHz: number;
        gridSize: number;
    };
}

// ── Serialization ─────────────────────────────────────────────────────────

export function serializeCircuit(
    nodes: Map<string, CanvasNodeData>,
    segments: Map<string, WireSegment>,
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
            label: n.parameters?.label ?? '',
            params: { ...n.parameters } as Record<string, unknown>,
        })),
        segments: Array.from(segments.values()).map(s => ({
            id: s.id,
            x1: s.x1,
            y1: s.y1,
            x2: s.x2,
            y2: s.y2,
        })),
        probes: probes.map(p => ({ nodeId: p.nodeId, portId: p.portId, label: p.label, color: p.color })),
        simSettings: { tickRateHz: 1000, gridSize: 10 },
    };
}

// ── Deserialization ───────────────────────────────────────────────────────

export interface DeserializedCircuit {
    nodes: CanvasNodeData[];
    segments: WireSegment[];
    probes: ProbeEntry[];
    simSettings: CircuitFile['simSettings'];
    metadata: CircuitFile['metadata'];
}

export function deserializeCircuit(json: string): DeserializedCircuit | null {
    try {
        const file = JSON.parse(json) as CircuitFile;
        // Basic schema validation
        if (!file.version || !file.nodes || !file.segments) {
            console.warn('[CircuitSerializer] Invalid file format');
            return null;
        }

        const nodes: CanvasNodeData[] = file.nodes.map(n => ({
            id: n.id,
            type: n.type,
            x: n.x,
            y: n.y,
            rotation: n.rotation,
            parameters: { ...n.params, label: n.label },
        }));

        const segments: WireSegment[] = file.segments.map(s => ({
            id: s.id,
            x1: s.x1,
            y1: s.y1,
            x2: s.x2,
            y2: s.y2,
        }));

        const probes: ProbeEntry[] = (file.probes ?? []).map(p => ({
            nodeId: p.nodeId,
            portId: p.portId,
            label: p.label,
            color: p.color,
        }));

        return { nodes, segments, probes, simSettings: file.simSettings, metadata: file.metadata };
    } catch (err) {
        console.error('[CircuitSerializer] Parse error:', err);
        return null;
    }
}

// ── Storage ───────────────────────────────────────────────────────────────

const LS_KEY = 'verilog_circuit_autosave_v2';

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


export function loadCircuitFromFile(file: File): Promise<DeserializedCircuit | null> {
    return new Promise(resolve => {
        const reader = new FileReader();
        reader.onload = e => resolve(deserializeCircuit(e.target?.result as string));
        reader.onerror = () => resolve(null);
        reader.readAsText(file);
    });
}
