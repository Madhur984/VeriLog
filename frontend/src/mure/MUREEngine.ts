/**
 * mure/MUREEngine.ts — Minimum Unified Real Engine (Public Façade)
 *
 * The single entry point for all circuit simulation.
 * Wraps SimulationKernel, SignalTrace, and NodeRegistry.
 *
 * API:
 *   engine.addNode(type, params) → NodeID
 *   engine.removeNode(id)
 *   engine.connectNodes(from, fromPort, to, toPort) → EdgeID
 *   engine.disconnect(edgeId)
 *   engine.simulateStep(deltaNs?)
 *   engine.flush()
 *   engine.getSignal(nodeId, portIndex) → PortState
 *   engine.getTrace(nodeId, portIndex) → samples
 *   engine.isCircuitClosed() → boolean
 *   engine.reset()
 */

import { SimulationKernel } from './core/SimulationKernel';
import { SignalGraph } from './core/SignalGraph';
import { createEdge, resetEdgeCounter } from './core/SignalEdge';
import type { EdgeId, SignalEdge } from './core/SignalEdge';
import type { NodeId } from './core/SignalNode';
import { NodeType } from './core/SignalNode';
import type { NodeParams } from './core/SignalNode';
import type { PortState } from './core/Port';
import { createNodeByType, resetNodeIdCounter } from './nodes/NodeRegistry';
import type { CreateNodeType } from './nodes/NodeRegistry';
import { SignalTrace } from './tracing/SignalTrace';
import { tickClock } from './nodes/ClockNode';
import { toggleSwitch } from './nodes/SwitchNode';

export class MUREEngine {
    private readonly kernel: SimulationKernel;
    private readonly signalTrace: SignalTrace;
    private clockNodes: Set<NodeId> = new Set();

    constructor(traceCapacity = 4096) {
        const graph = new SignalGraph();
        this.kernel = new SimulationKernel(graph);
        this.signalTrace = new SignalTrace(traceCapacity);
    }

    // ─── Node Management ──────────────────────────────────────────────

    addNode(type: CreateNodeType, params: NodeParams = {}): NodeId {
        const node = createNodeByType(type, params);
        this.kernel.graph.addNode(node);
        this.kernel.markDirty(node.id);

        // Track clock nodes for automatic ticking
        if (node.type === NodeType.CLOCK) {
            this.clockNodes.add(node.id);
        }

        return node.id;
    }

    removeNode(id: NodeId): void {
        this.kernel.graph.removeNode(id);
        this.clockNodes.delete(id);
    }

    // ─── Connections ──────────────────────────────────────────────────

    connectNodes(
        fromNode: NodeId,
        fromPort: number,
        toNode: NodeId,
        toPort: number,
    ): EdgeId {
        const edge = createEdge(fromNode, fromPort, toNode, toPort);
        this.kernel.graph.addEdge(edge);

        // Mark both nodes dirty
        this.kernel.markDirty(fromNode);
        this.kernel.markDirty(toNode);

        return edge.id;
    }

    disconnect(edgeId: EdgeId): void {
        this.kernel.graph.removeEdge(edgeId);
    }

    // ─── Simulation ───────────────────────────────────────────────────

    /** Advance simulation by deltaNs (processes timed events) */
    simulateStep(deltaNs = 100): void {
        // Tick clocks
        for (const clockId of this.clockNodes) {
            const clockNode = this.kernel.graph.getNode(clockId);
            if (clockNode) {
                tickClock(clockNode, this.kernel.currentTimeNs + deltaNs);
            }
        }

        this.kernel.tick(deltaNs);

        // Record traces
        this.recordAllTraces();
    }

    /** Synchronous flush for combinational circuits */
    flush(): void {
        this.kernel.flush();
        this.recordAllTraces();
    }

    /** Mark all nodes for re-evaluation */
    markAllDirty(): void {
        this.kernel.markAllDirty();
    }

    // ─── Queries ──────────────────────────────────────────────────────

    /** Get signal state of a node's output port */
    getSignal(nodeId: NodeId, portIndex = 0): PortState | undefined {
        return this.kernel.getSignal(nodeId, portIndex);
    }

    /** Get all output port states for all nodes */
    snapshot(): Map<NodeId, PortState[]> {
        return this.kernel.snapshot();
    }

    /** Check if there's a closed loop from a specific node */
    isCircuitClosed(nodeId?: NodeId): boolean {
        if (nodeId) {
            return this.kernel.graph.isCircuitClosed(nodeId);
        }
        // Check all source nodes
        for (const id of this.kernel.graph.nodes.keys()) {
            const node = this.kernel.graph.getNode(id);
            if (node?.type === NodeType.BATTERY) {
                if (this.kernel.graph.isCircuitClosed(id)) return true;
            }
        }
        return false;
    }

    /** Check if graph has any cycles */
    hasCycle(): boolean {
        return this.kernel.graph.hasCycle();
    }

    /** Current simulation time in nanoseconds */
    get currentTimeNs(): number {
        return this.kernel.currentTimeNs;
    }

    /** Node count */
    get nodeCount(): number {
        return this.kernel.graph.nodeCount;
    }

    /** Edge count */
    get edgeCount(): number {
        return this.kernel.graph.edgeCount;
    }

    /** All edges as array */
    get edges(): SignalEdge[] {
        return [...this.kernel.graph.edges.values()];
    }

    // ─── Node Interaction ─────────────────────────────────────────────

    /** Toggle a switch node */
    toggleSwitch(nodeId: NodeId): void {
        const node = this.kernel.graph.getNode(nodeId);
        if (node && node.type === NodeType.SWITCH) {
            toggleSwitch(node);
            this.kernel.markDirty(nodeId);
        }
    }

    /** Update node parameters */
    setNodeParams(nodeId: NodeId, params: Partial<NodeParams>): void {
        const node = this.kernel.graph.getNode(nodeId);
        if (node) {
            Object.assign(node.params, params);
            node.dirty = true;
        }
    }

    // ─── Tracing ──────────────────────────────────────────────────────

    /** Get trace samples for a node's output port */
    getTrace(nodeId: NodeId, portIndex = 0, count?: number): { time: number; voltage: number }[] {
        return this.signalTrace.getSamples(nodeId, portIndex, count);
    }

    /** Get raw trace data for canvas rendering */
    getRawTrace(nodeId: NodeId, portIndex = 0) {
        return this.signalTrace.getRawTrace(nodeId, portIndex);
    }

    // ─── Reset ────────────────────────────────────────────────────────

    reset(): void {
        this.kernel.reset();
        this.signalTrace.clearAll();
        this.clockNodes.clear();
        resetNodeIdCounter();
        resetEdgeCounter();
    }

    // ─── Internal ─────────────────────────────────────────────────────

    private recordAllTraces(): void {
        const time = this.kernel.currentTimeNs;
        for (const [id, node] of this.kernel.graph.nodes) {
            for (let i = 0; i < node.outputs.length; i++) {
                this.signalTrace.record(id, i, time, node.outputs[i].voltage);
            }
        }
    }
}
