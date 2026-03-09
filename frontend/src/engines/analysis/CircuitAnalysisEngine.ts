/**
 * CircuitAnalysisEngine.ts — Static analysis for circuit validation
 *
 * Detects common circuit problems:
 * - Floating inputs (unconnected input ports)
 * - Short circuits (multiple outputs driving same input)
 * - Combinational loops (feedback without registers)
 * - Critical path calculation (longest propagation delay)
 * - Unused outputs (outputs with no connections)
 */

import type { NodeId, SignalNode } from '../../mure/core/SignalNode';
import type { SignalEdge } from '../../mure/core/SignalEdge';

export type AnalysisSeverity = 'error' | 'warning' | 'info';

export interface AnalysisIssue {
    id: string;
    severity: AnalysisSeverity;
    category: 'floating_input' | 'short_circuit' | 'loop' | 'unused_output' | 'fan_out' | 'critical_path';
    nodeId?: NodeId;
    message: string;
    suggestion: string;
}

export interface AnalysisReport {
    issues: AnalysisIssue[];
    stats: {
        nodeCount: number;
        edgeCount: number;
        inputCount: number;
        outputCount: number;
        gateCount: number;
        maxFanOut: number;
        criticalPathNs: number;
        logicDepth: number;
    };
    timestamp: number;
}

// Gate propagation delays in nanoseconds
const GATE_DELAYS: Record<string, number> = {
    AND: 2,
    OR: 2,
    NOT: 1,
    NAND: 2,
    NOR: 2,
    XOR: 3,
    XNOR: 3,
    BUFFER: 1,
    MUX: 3,
    DECODER: 4,
    FLIPFLOP: 1,
    CLOCK: 0,
    SWITCH: 0,
    LED: 0,
    BATTERY: 0,
    BULB: 0,
    RESISTOR: 0,
};

export class CircuitAnalysisEngine {
    /**
     * Run all analyses and return a comprehensive report.
     */
    analyze(
        nodes: Map<NodeId, SignalNode>,
        edges: Map<string, SignalEdge>,
    ): AnalysisReport {
        const issues: AnalysisIssue[] = [];
        const edgeArray = [...edges.values()];

        // Build adjacency info
        const incomingEdges = new Map<NodeId, SignalEdge[]>();
        const outgoingEdges = new Map<NodeId, SignalEdge[]>();

        for (const edge of edgeArray) {
            const incoming = incomingEdges.get(edge.toNode) || [];
            incoming.push(edge);
            incomingEdges.set(edge.toNode, incoming);

            const outgoing = outgoingEdges.get(edge.fromNode) || [];
            outgoing.push(edge);
            outgoingEdges.set(edge.fromNode, outgoing);
        }

        // ── Floating Input Detection ─────────────────────────────
        for (const [id, node] of nodes) {
            for (let i = 0; i < node.inputs.length; i++) {
                const hasEdge = edgeArray.some(e => e.toNode === id && e.toPort === i);
                if (!hasEdge) {
                    issues.push({
                        id: `float-${id}-${i}`,
                        severity: 'warning',
                        category: 'floating_input',
                        nodeId: id,
                        message: `Input port ${i} of ${node.type}(${id}) is unconnected`,
                        suggestion: 'Connect this input to a signal source or tie it to a known logic level',
                    });
                }
            }
        }

        // ── Short Circuit Detection ──────────────────────────────
        // Multiple outputs driving the same input port
        const inputDrivers = new Map<string, NodeId[]>();
        for (const edge of edgeArray) {
            const key = `${edge.toNode}:${edge.toPort}`;
            const drivers = inputDrivers.get(key) || [];
            drivers.push(edge.fromNode);
            inputDrivers.set(key, drivers);
        }

        for (const [key, drivers] of inputDrivers) {
            if (drivers.length > 1) {
                const [nodeId] = key.split(':');
                issues.push({
                    id: `short-${key}`,
                    severity: 'error',
                    category: 'short_circuit',
                    nodeId: nodeId as NodeId,
                    message: `Port ${key} is driven by ${drivers.length} outputs — potential short circuit`,
                    suggestion: 'Use a MUX or remove conflicting connections',
                });
            }
        }

        // ── Loop Detection (DFS-based cycle detection) ──────────
        const visited = new Set<NodeId>();
        const recStack = new Set<NodeId>();

        const hasCycleDFS = (nodeId: NodeId): boolean => {
            visited.add(nodeId);
            recStack.add(nodeId);

            const outEdges = outgoingEdges.get(nodeId) || [];
            for (const edge of outEdges) {
                if (!visited.has(edge.toNode)) {
                    if (hasCycleDFS(edge.toNode)) return true;
                } else if (recStack.has(edge.toNode)) {
                    issues.push({
                        id: `loop-${nodeId}-${edge.toNode}`,
                        severity: 'warning',
                        category: 'loop',
                        nodeId: nodeId,
                        message: `Combinational loop detected: ${nodeId} → ... → ${edge.toNode}`,
                        suggestion: 'Break the loop with a register/flip-flop or remove the feedback path',
                    });
                    return true;
                }
            }

            recStack.delete(nodeId);
            return false;
        };

        for (const id of nodes.keys()) {
            if (!visited.has(id)) hasCycleDFS(id);
        }

        // ── Unused Output Detection ──────────────────────────────
        for (const [id, node] of nodes) {
            if (node.outputs.length > 0) {
                const hasOutEdge = edgeArray.some(e => e.fromNode === id);
                const nodeTypeStr = String(node.type).toUpperCase();
                if (!hasOutEdge && nodeTypeStr !== 'LED' && nodeTypeStr !== 'BULB') {
                    issues.push({
                        id: `unused-${id}`,
                        severity: 'info',
                        category: 'unused_output',
                        nodeId: id,
                        message: `${node.type}(${id}) output is not connected to anything`,
                        suggestion: 'Connect the output or remove the unused component',
                    });
                }
            }
        }

        // ── Fan-Out Analysis ────────────────────────────────────
        let maxFanOut = 0;
        for (const [id, outEdges] of outgoingEdges) {
            if (outEdges.length > maxFanOut) maxFanOut = outEdges.length;
            if (outEdges.length > 8) {
                issues.push({
                    id: `fanout-${id}`,
                    severity: 'warning',
                    category: 'fan_out',
                    nodeId: id,
                    message: `High fan-out: ${outEdges.length} connections from ${id}`,
                    suggestion: 'Consider adding buffer gates to distribute the load',
                });
            }
        }

        // ── Critical Path (Longest Path DAG) ─────────────────────
        const { criticalPathNs, logicDepth } = this.computeCriticalPath(nodes, outgoingEdges);

        // ── Stats ────────────────────────────────────────────────
        let inputCount = 0;
        let outputCount = 0;
        let gateCount = 0;

        for (const node of nodes.values()) {
            const t = String(node.type).toUpperCase();
            if (t === 'SWITCH' || t === 'CLOCK' || t === 'BATTERY') inputCount++;
            else if (t === 'LED' || t === 'BULB') outputCount++;
            else gateCount++;
        }

        return {
            issues,
            stats: {
                nodeCount: nodes.size,
                edgeCount: edges.size,
                inputCount,
                outputCount,
                gateCount,
                maxFanOut,
                criticalPathNs,
                logicDepth,
            },
            timestamp: Date.now(),
        };
    }

    /**
     * Compute critical path delay and logic depth using topological ordering.
     */
    private computeCriticalPath(
        nodes: Map<NodeId, SignalNode>,
        outgoingEdges: Map<NodeId, SignalEdge[]>,
    ): { criticalPathNs: number; logicDepth: number } {
        const distances = new Map<NodeId, number>();
        const depths = new Map<NodeId, number>();

        // Initialize
        for (const id of nodes.keys()) {
            distances.set(id, 0);
            depths.set(id, 0);
        }

        // Relaxation (Bellman-Ford style for DAGs)
        // Run N iterations (worst case for DAG)
        const n = nodes.size;
        for (let iter = 0; iter < n; iter++) {
            let changed = false;
            for (const [fromId, outEdges] of outgoingEdges) {
                const fromDist = distances.get(fromId) || 0;
                const fromDepth = depths.get(fromId) || 0;
                const fromNode = nodes.get(fromId);
                const delay = fromNode ? (GATE_DELAYS[String(fromNode.type).toUpperCase()] ?? 2) : 2;

                for (const edge of outEdges) {
                    const newDist = fromDist + delay;
                    const newDepth = fromDepth + 1;
                    const currDist = distances.get(edge.toNode) || 0;
                    const currDepth = depths.get(edge.toNode) || 0;

                    if (newDist > currDist) {
                        distances.set(edge.toNode, newDist);
                        changed = true;
                    }
                    if (newDepth > currDepth) {
                        depths.set(edge.toNode, newDepth);
                        changed = true;
                    }
                }
            }
            if (!changed) break;
        }

        let criticalPathNs = 0;
        let logicDepth = 0;
        for (const d of distances.values()) { if (d > criticalPathNs) criticalPathNs = d; }
        for (const d of depths.values()) { if (d > logicDepth) logicDepth = d; }

        return { criticalPathNs, logicDepth };
    }
}
