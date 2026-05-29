/**
 * mure/core/SimulationKernel.ts - The Heart of MURE
 *
 * Owns the SignalGraph + EventQueue.
 * Implements event-driven propagation:
 *   1. Node output changes
 *   2. Connected nodes scheduled for evaluation
 *   3. Node evaluation
 *   4. Signal propagation
 *
 * Supports both timed (digital with propagation delays)
 * and instant (combinational flush) modes.
 */

import { SignalGraph } from './SignalGraph';
import { EventQueue, type SimEvent } from './EventQueue';
import type { SignalNode, NodeId } from './SignalNode';
import type { PortState } from './Port';

const MAX_ITERATIONS = 10_000;

export class SimulationKernel {
    readonly graph: SignalGraph;
    private readonly eventQueue = new EventQueue();
    private simTimeNs = 0;

    constructor(graph?: SignalGraph) {
        this.graph = graph ?? new SignalGraph();
    }

    // ─── Time ─────────────────────────────────────────────────────────

    get currentTimeNs(): number {
        return this.simTimeNs;
    }

    // ─── Tick (Timed Simulation) ──────────────────────────────────────

    /**
     * Advance simulation by deltaNs nanoseconds.
     * Processes all events scheduled up to newTime.
     */
    tick(deltaNs: number = 0): void {
        this.simTimeNs += deltaNs;

        // Process timed events
        const events = this.eventQueue.popUntil(this.simTimeNs);
        for (const event of events) {
            this.applyEvent(event);
        }

        // Flush any dirty nodes from event application
        this.flushDirty();
    }

    // ─── Flush (Combinational) ────────────────────────────────────────

    /**
     * Synchronous flush - evaluate all dirty nodes until stable.
     * Used for combinational circuits without propagation delays.
     */
    flush(): void {
        this.flushDirty();
    }

    // ─── Snapshot ─────────────────────────────────────────────────────

    /**
     * Return current output port states for all nodes.
     */
    snapshot(): Map<NodeId, PortState[]> {
        const result = new Map<NodeId, PortState[]>();
        for (const [id, node] of this.graph.nodes) {
            result.set(id, node.outputs.map(p => ({ ...p })));
        }
        return result;
    }

    /**
     * Get signal state of a specific node's port.
     */
    getSignal(nodeId: NodeId, portIndex: number): PortState | undefined {
        const node = this.graph.getNode(nodeId);
        return node?.outputs[portIndex];
    }

    // ─── Schedule Events ──────────────────────────────────────────────

    scheduleEvent(event: SimEvent): void {
        this.eventQueue.push(event);
    }

    scheduleDelayed(
        targetNode: NodeId,
        targetPort: number,
        delayNs: number,
        voltage: number,
        logic: boolean,
    ): void {
        this.eventQueue.push({
            fireAt: this.simTimeNs + delayNs,
            targetNode,
            targetPort,
            newVoltage: voltage,
            newLogic: logic,
        });
    }

    // ─── Mark Dirty ───────────────────────────────────────────────────

    markDirty(nodeId: NodeId): void {
        this.graph.markDirty(nodeId);
    }

    markAllDirty(): void {
        for (const node of this.graph.nodes.values()) {
            node.dirty = true;
        }
    }

    // ─── Internal ─────────────────────────────────────────────────────

    private applyEvent(event: SimEvent): void {
        const node = this.graph.getNode(event.targetNode);
        if (!node) return;

        const port = node.inputs[event.targetPort];
        if (!port) return;

        port.voltage = event.newVoltage;
        port.logic = event.newLogic;
        port.connected = true;
        node.dirty = true;
    }

    private flushDirty(): void {
        let iterations = 0;

        while (iterations < MAX_ITERATIONS) {
            const dirtyNodes = this.graph.getDirtyNodes();
            if (dirtyNodes.length === 0) break;

            // Clear dirty flags before evaluation to detect new changes
            this.graph.clearDirty();

            for (const nodeId of dirtyNodes) {
                const node = this.graph.getNode(nodeId);
                if (!node) continue;

                // Evaluate node
                node.evaluate(node);

                // Always propagate outputs of dirty nodes.
                // Downstream nodes will only be re-dirtied if their inputs actually change.
                this.propagateOutputs(node);
            }

            iterations++;
        }

        if (iterations >= MAX_ITERATIONS) {
            console.warn('[MURE] SimulationKernel: max iterations reached - possible oscillation');
        }
    }

    private propagateOutputs(sourceNode: SignalNode): void {
        const outEdges = this.graph.getOutEdges(sourceNode.id);

        for (const edge of outEdges) {
            const targetNode = this.graph.getNode(edge.toNode);
            if (!targetNode) continue;

            const sourcePort = sourceNode.outputs[edge.fromPort];
            const targetPort = targetNode.inputs[edge.toPort];
            if (!sourcePort || !targetPort) continue;

            // Only dirty target if input actually changes
            const changed = targetPort.voltage !== sourcePort.voltage
                || targetPort.logic !== sourcePort.logic;

            // Copy signal from source output to target input
            targetPort.voltage = sourcePort.voltage;
            targetPort.logic = sourcePort.logic;
            targetPort.drive = sourcePort.drive;
            targetPort.connected = true;

            // Mark edge as live
            edge.isLive = true;

            // Mark target as dirty for re-evaluation only if input changed
            if (changed) targetNode.dirty = true;
        }
    }

    // ─── Reset ────────────────────────────────────────────────────────

    reset(): void {
        this.simTimeNs = 0;
        this.eventQueue.clear();
        this.graph.clearDirty();
    }
}


