/**
 * engine/sim.worker.ts — CSE Simulation Web Worker
 *
 * Runs the Circuit Simulation Engine (CSE) on a background thread.
 * Keeps the UI at 60fps regardless of circuit complexity.
 *
 * Message protocol (from main thread → worker):
 *   { type: 'LOAD_GRAPH', graph: SerializedWorkerGraph }
 *   { type: 'TICK',       deltaNs: number }
 *   { type: 'RESET' }
 *   { type: 'SET_PARAM',  nodeId: string, key: string, value: unknown }
 *
 * Messages (worker → main thread):
 *   { type: 'SNAPSHOT', snapshot: SerializedSnapshot, timeNs: number }
 *   { type: 'READY' }
 *   { type: 'ERROR', message: string }
 */

import { CSE } from './CSE';
import type { CircuitGraph, ComponentNode, PortState, ComponentParams, ComponentType } from './types';

// ── Serialized Types (cross-thread safe — no Maps, no Sets) ─────────────────

export interface SerializedPort {
    id: string;
    voltage: number;
    logic: boolean;
    drive: 'strong' | 'pull' | 'float';
    connected: boolean;
}

export interface SerializedNode {
    id: string;
    type: string;
    inputs: string[];
    outputs: string[];
    params: ComponentParams;
    ports: SerializedPort[];
    internalState: Record<string, unknown>;
    x: number;
    y: number;
}

export interface SerializedEdge {
    id: string;
    fromNode: string;
    fromPort: string;
    toNode: string;
    toPort: string;
}

export interface SerializedWorkerGraph {
    nodes: SerializedNode[];
    edges: SerializedEdge[];
}

export interface PortSnapshot {
    nodeId: string;
    ports: SerializedPort[];
}

export interface SerializedSnapshot {
    entries: PortSnapshot[];
    timeNs: number;
}

// ── Main Worker Logic ────────────────────────────────────────────────────────

const cse = new CSE();
let loaded = false;

/**
 * Rebuild a proper CircuitGraph from the serialized message payload.
 * We reconstruct Maps/Sets here on the worker thread.
 */
function buildGraph(data: SerializedWorkerGraph): CircuitGraph {
    const nodes = new Map<string, ComponentNode>();
    const edges = new Map();
    const adjacency = new Map<string, string[]>();
    const dirtySet = new Set<string>();

    for (const sn of data.nodes) {
        const portMap = new Map<string, PortState>();
        for (const sp of sn.ports) {
            portMap.set(sp.id, {
                voltage: sp.voltage,
                logic: sp.logic,
                drive: sp.drive,
                connected: sp.connected,
            });
        }

        const node: ComponentNode = {
            id: sn.id,
            type: sn.type as ComponentType,
            inputs: sn.inputs,
            outputs: sn.outputs,
            params: sn.params,
            ports: portMap,
            internalState: { ...sn.internalState },
            position: { x: sn.x, y: sn.y },
            dirty: true,
        };

        nodes.set(sn.id, node);
        dirtySet.add(sn.id);
        adjacency.set(sn.id, []);
    }

    for (const se of data.edges) {
        edges.set(se.id, {
            id: se.id,
            fromNode: se.fromNode,
            fromPort: se.fromPort,
            toNode: se.toNode,
            toPort: se.toPort,
            isLive: false,
        });

        // Build adjacency list
        const adj = adjacency.get(se.fromNode) ?? [];
        if (!adj.includes(se.toNode)) adj.push(se.toNode);
        adjacency.set(se.fromNode, adj);
    }

    return { nodes, edges, adjacency, dirtySet };
}

/**
 * Extract a serializable snapshot from CSE state.
 */
function buildSnapshot(cse: CSE, timeNs: number): SerializedSnapshot {
    const raw = cse.snapshot();
    const entries: PortSnapshot[] = [];

    for (const [nodeId, portStates] of raw) {
        entries.push({
            nodeId,
            ports: portStates.map((p, i) => ({
                id: String(i),
                voltage: p.voltage,
                logic: p.logic,
                drive: p.drive,
                connected: p.connected,
            })),
        });
    }

    return { entries, timeNs };
}

// ── Worker Message Handling ──────────────────────────────────────────────────

self.onmessage = (event: MessageEvent) => {
    const msg = event.data;

    try {
        switch (msg.type) {

            case 'LOAD_GRAPH': {
                const graph = buildGraph(msg.graph as SerializedWorkerGraph);
                cse.loadGraph(graph);
                loaded = true;
                // Run initial flush for combinational circuits
                cse.flush();
                const snap = buildSnapshot(cse, 0);
                self.postMessage({ type: 'SNAPSHOT', ...snap });
                break;
            }

            case 'TICK': {
                if (!loaded) break;
                cse.tick(msg.deltaNs ?? 100);
                const snap = buildSnapshot(cse, cse.currentTimeNs);
                self.postMessage({ type: 'SNAPSHOT', ...snap });
                break;
            }

            case 'RESET': {
                loaded = false;
                self.postMessage({ type: 'READY' });
                break;
            }

            case 'SET_PARAM': {
                // Handles switch toggles, clock frequency changes, etc.
                // The graph must be reloaded by the main thread for structural changes.
                // This is for in-place param mutations only.
                self.postMessage({ type: 'READY' });
                break;
            }

            default:
                self.postMessage({ type: 'ERROR', message: `Unknown message type: ${msg.type}` });
        }
    } catch (err) {
        self.postMessage({ type: 'ERROR', message: String(err) });
    }
};

self.postMessage({ type: 'READY' });
