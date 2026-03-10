/**
 * engine/WorkerBridge.ts — Main-thread interface to sim.worker.ts
 *
 * Manages the worker lifecycle, serializes circuit graph (nodes + segments),
 * deserializes snapshots, and updates the Zustand store at a throttled 30fps rate.
 */

import { useWorkbenchStore } from '../stores/useWorkbenchStore';
import type { SerializedWorkerGraph, SerializedSnapshot } from './sim.worker';
import type { BusValue } from './LogicValue';

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
                this.handleSnapshot(msg as SerializedSnapshot);
            } else if (msg.type === 'ERROR') {
                console.error('[WorkerBridge]', msg.message);
            }
        };

        this.worker.onerror = (err: ErrorEvent) => {
            console.error('[WorkerBridge] Worker error:', err.message);
        };
    }

    /** Push the current circuit graph to the worker */
    loadGraph(): void {
        if (!this.worker) return;
        const state = useWorkbenchStore.getState();
        const nodes = Array.from(state.nodes.values());
        const segments = Array.from(state.segments.values());

        const graph: SerializedWorkerGraph = {
            nodes,
            segments
        };

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

    // ── Input Interactions ──────────────────────────────────────────────────

    /** Simulate user clicking a memory/button port */
    interact(nodeId: string, portId: string, data?: unknown) {
        this.worker?.postMessage({ type: 'INTERACT_PORT', nodeId, portId, data });
    }

    /** Update a component parameter */
    updateParam(nodeId: string, key: string, value: unknown) {
        this.worker?.postMessage({ type: 'SET_PARAM', nodeId, key, value });
    }

    // ── Private ────────────────────────────────────────────────────────────────

    private handleSnapshot(snap: SerializedSnapshot): void {
        const now = performance.now();

        // Throttle React store updates to 30fps
        if (now - this.lastSnapshotTime < this.SNAPSHOT_INTERVAL_MS) return;
        this.lastSnapshotTime = now;

        const { applySnapshot, appendWaveformSample, probes } = useWorkbenchStore.getState();

        // Reconstruct Maps
        const portStates = new Map<string, Map<string, BusValue>>();
        for (const [nodeId, portMapObj] of Object.entries(snap.portStatesObj)) {
            const portMap = new Map<string, BusValue>();
            for (const [portId, val] of Object.entries(portMapObj)) {
                portMap.set(portId, val);
            }
            portStates.set(nodeId, portMap);
        }

        const netValues = new Map<string, BusValue>();
        for (const [netId, val] of Object.entries(snap.netValuesObj)) {
            netValues.set(netId, val);
        }

        const netErrors = new Set<string>(snap.netErrorsArr);

        applySnapshot(portStates, netValues, netErrors, snap.timeNs);

        // Append waveform samples for probed nodes
        for (const probe of probes) {
            const ports = portStates.get(probe.nodeId);
            if (ports) {
                const val = ports.get(probe.portId);
                if (val !== undefined) {
                    appendWaveformSample(`${probe.nodeId}:${probe.portId}`, snap.timeNs, val);
                }
            }
        }
    }
}

/** Singleton bridge shared by the Workbench */
export const workerBridge = new WorkerBridge(100);
