/**
 * mure/SimulationController.ts - React Integration Layer
 *
 * Owns a MUREEngine instance and runs a requestAnimationFrame loop.
 * React components read snapshots; simulation runs outside React state.
 *
 * Usage:
 *   const controller = new SimulationController();
 *   controller.start();
 *   // In React: const snapshot = controller.getSnapshot();
 */

import { MUREEngine } from './MUREEngine';
import type { NodeId } from './core/SignalNode';
import type { PortState } from './core/Port';
import type { NodeParams } from './core/SignalNode';
import type { CreateNodeType } from './nodes/NodeRegistry';
import type { EdgeId } from './core/SignalEdge';

type SnapshotCallback = (snapshot: Map<NodeId, PortState[]>) => void;

export class SimulationController {
    readonly engine: MUREEngine;
    private animFrameId: number | null = null;
    private running = false;
    private listeners: Set<SnapshotCallback> = new Set();
    private stepSizeNs: number;


    constructor(stepSizeNs = 1000, traceCapacity = 4096) {
        this.engine = new MUREEngine(traceCapacity);
        this.stepSizeNs = stepSizeNs;
    }

    // ─── Lifecycle ────────────────────────────────────────────────────

    start(): void {
        if (this.running) return;
        this.running = true;
        this.loop();
    }

    stop(): void {
        this.running = false;
        if (this.animFrameId !== null) {
            cancelAnimationFrame(this.animFrameId);
            this.animFrameId = null;
        }
    }

    get isRunning(): boolean {
        return this.running;
    }

    // ─── Engine Delegation ────────────────────────────────────────────

    addNode(type: CreateNodeType, params?: NodeParams): NodeId {
        return this.engine.addNode(type, params);
    }

    removeNode(id: NodeId): void {
        this.engine.removeNode(id);
    }

    connect(from: NodeId, fromPort: number, to: NodeId, toPort: number): EdgeId {
        return this.engine.connectNodes(from, fromPort, to, toPort);
    }

    disconnect(edgeId: EdgeId): void {
        this.engine.disconnect(edgeId);
    }

    flush(): void {
        this.engine.flush();
        this.notifyListeners();
    }

    toggleSwitch(nodeId: NodeId): void {
        this.engine.toggleSwitch(nodeId);
        if (!this.running) this.flush();
    }

    getSignal(nodeId: NodeId, portIndex = 0): PortState | undefined {
        return this.engine.getSignal(nodeId, portIndex);
    }

    getSnapshot(): Map<NodeId, PortState[]> {
        return this.engine.snapshot();
    }

    getTrace(nodeId: NodeId, portIndex = 0, count?: number) {
        return this.engine.getTrace(nodeId, portIndex, count);
    }

    // ─── Listeners ────────────────────────────────────────────────────

    subscribe(callback: SnapshotCallback): () => void {
        this.listeners.add(callback);
        return () => this.listeners.delete(callback);
    }

    // ─── Reset ────────────────────────────────────────────────────────

    reset(): void {
        this.stop();
        this.engine.reset();
        this.notifyListeners();
    }

    // ─── Internal ─────────────────────────────────────────────────────

    private loop = (): void => {
        if (!this.running) return;

        // Advance simulation by configured step size
        this.engine.simulateStep(this.stepSizeNs);

        // Notify React listeners
        this.notifyListeners();

        this.animFrameId = requestAnimationFrame(this.loop);
    };

    private notifyListeners(): void {
        if (this.listeners.size === 0) return;
        const snapshot = this.engine.snapshot();
        for (const listener of this.listeners) {
            listener(snapshot);
        }
    }
}
