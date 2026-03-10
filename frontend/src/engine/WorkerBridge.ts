/**
 * engine/WorkerBridge.ts — Main-thread interface to sim.worker.ts
 *
 * Manages the worker lifecycle, serializes circuit graph, deserializes snapshots,
 * and updates the Zustand store at a throttled 30fps rate.
 */

import type { CanvasNodeData, WireData } from '../stores/useWorkbenchStore';
import { useWorkbenchStore } from '../stores/useWorkbenchStore';
import type { SerializedWorkerGraph, SerializedSnapshot } from './sim.worker';
import type { PortState } from './types';

// ── Graph Serialization ──────────────────────────────────────────────────────

/**
 * Convert the UI store's canvas nodes + wires into the CSE-compatible
 * message payload (no Maps, no Sets — pure JSON-serializable object).
 */
function serializeForWorker(
    nodes: Map<string, CanvasNodeData>,
    wires: Map<string, WireData>
): SerializedWorkerGraph {
    const serializedNodes = Array.from(nodes.values()).map(n => ({
        id: n.id,
        type: n.type,
        // Build port IDs: inputs first, then outputs by index
        inputs: Array.from({ length: n.inputCount }, (_, i) => `${n.id}_in${i}`),
        outputs: Array.from({ length: n.outputCount }, (_, i) => `${n.id}_out${i}`),
        params: { ...n.params },
        // Initialize all ports to 0V / LOW / float / disconnected
        ports: [
            ...Array.from({ length: n.inputCount }, (_, i) => ({
                id: `${n.id}_in${i}`, voltage: 0, logic: false, drive: 'float' as const, connected: false,
            })),
            ...Array.from({ length: n.outputCount }, (_, i) => ({
                id: `${n.id}_out${i}`, voltage: 0, logic: false, drive: 'float' as const, connected: false,
            })),
        ],
        internalState: {},
        x: n.x,
        y: n.y,
    }));

    const serializedEdges = Array.from(wires.values()).map(w => ({
        id: w.id,
        fromNode: w.from.nodeId,
        fromPort: `${w.from.nodeId}_out${w.from.portIndex}`,
        toNode: w.to.nodeId,
        toPort: `${w.to.nodeId}_in${w.to.portIndex}`,
    }));

    return { nodes: serializedNodes, edges: serializedEdges };
}

// ── Snapshot Deserialization ─────────────────────────────────────────────────

function deserializeSnapshot(snap: SerializedSnapshot): Map<string, PortState[]> {
    const out = new Map<string, PortState[]>();
    for (const entry of snap.entries) {
        out.set(entry.nodeId, entry.ports.map(p => ({
            voltage: p.voltage,
            logic: p.logic,
            drive: p.drive,
            connected: p.connected,
        })));
    }
    return out;
}

// ── WorkerBridge ─────────────────────────────────────────────────────────────

export class WorkerBridge {
    private worker: Worker | null = null;
    private rafId: number | null = null;
    private lastSnapshotTime = 0;
    private readonly SNAPSHOT_INTERVAL_MS = 1000 / 30; // 30fps cap for React updates

    /** Tick payload — how many simulated nanoseconds per frame */
    private deltaNs: number;

    constructor(deltaNs = 100) {
        this.deltaNs = deltaNs;
    }

    /** Spawn the Web Worker and attach message handlers */
    init(): void {
        if (this.worker) return;

        this.worker = new Worker(
            new URL('./sim.worker.ts', import.meta.url),
            { type: 'module' }
        );

        this.worker.onmessage = (ev: MessageEvent) => {
            const msg = ev.data;
            if (msg.type === 'SNAPSHOT') {
                this.handleSnapshot(msg as SerializedSnapshot & { timeNs: number });
            } else if (msg.type === 'ERROR') {
                console.error('[WorkerBridge]', msg.message);
            }
        };

        this.worker.onerror = (err) => {
            console.error('[WorkerBridge] Worker error:', err.message);
        };
    }

    /** Push the current circuit graph to the worker */
    loadGraph(): void {
        if (!this.worker) return;
        const { nodes, wires } = useWorkbenchStore.getState();
        const graph = serializeForWorker(nodes, wires);
        this.worker.postMessage({ type: 'LOAD_GRAPH', graph });
    }

    /** Start the tick loop (attaches to rAF) */
    start(): void {
        if (this.rafId !== null) return;
        useWorkbenchStore.getState().setSimRunning(true);
        const tick = () => {
            if (!useWorkbenchStore.getState().simRunning) {
                this.stop();
                return;
            }
            this.worker?.postMessage({ type: 'TICK', deltaNs: this.deltaNs });
            this.rafId = requestAnimationFrame(tick);
        };
        this.rafId = requestAnimationFrame(tick);
    }

    /** Pause the tick loop */
    stop(): void {
        if (this.rafId !== null) {
            cancelAnimationFrame(this.rafId);
            this.rafId = null;
        }
        useWorkbenchStore.getState().setSimRunning(false);
    }

    /** Single-step (one tick) */
    step(): void {
        this.worker?.postMessage({ type: 'TICK', deltaNs: this.deltaNs });
    }

    /** Reset simulation */
    reset(): void {
        this.stop();
        this.worker?.postMessage({ type: 'RESET' });
        useWorkbenchStore.getState().resetSim();
    }

    /** Terminate worker completely */
    destroy(): void {
        this.stop();
        this.worker?.terminate();
        this.worker = null;
    }

    // ── Private ────────────────────────────────────────────────────────────────

    private handleSnapshot(snap: SerializedSnapshot & { timeNs: number }): void {
        const now = performance.now();

        // Throttle React store updates to 30fps (simulation may run faster)
        if (now - this.lastSnapshotTime < this.SNAPSHOT_INTERVAL_MS) return;
        this.lastSnapshotTime = now;

        const { applySnapshot, appendWaveformSample, probes } = useWorkbenchStore.getState();
        const domainSnapshot = deserializeSnapshot(snap);
        applySnapshot(domainSnapshot, snap.timeNs);

        // Append waveform samples for probed nodes
        for (const probe of probes) {
            const ports = domainSnapshot.get(probe.nodeId);
            if (ports && ports.length > 0) {
                const p = ports[ports.length - 1]; // use last output port
                appendWaveformSample(probe.nodeId, snap.timeNs, p.logic, p.voltage);
            }
        }
    }
}

/** Singleton bridge shared by the Workbench */
export const workerBridge = new WorkerBridge(100);
