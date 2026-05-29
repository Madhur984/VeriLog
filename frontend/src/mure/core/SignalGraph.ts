/**
 * mure/core/SignalGraph.ts - Circuit Graph Model
 *
 * All circuits represented as directed graphs.
 * Nodes = components, Edges = wire connections.
 * Supports closed loop detection via BFS.
 */

import type { SignalNode, NodeId } from './SignalNode';
import type { SignalEdge, EdgeId } from './SignalEdge';

export class SignalGraph {
    readonly nodes = new Map<NodeId, SignalNode>();
    readonly edges = new Map<EdgeId, SignalEdge>();
    private adjacency = new Map<NodeId, Set<NodeId>>();
    private reverseAdj = new Map<NodeId, Set<NodeId>>();

    // ─── Node Operations ──────────────────────────────────────────────

    addNode(node: SignalNode): void {
        this.nodes.set(node.id, node);
        if (!this.adjacency.has(node.id)) this.adjacency.set(node.id, new Set());
        if (!this.reverseAdj.has(node.id)) this.reverseAdj.set(node.id, new Set());
    }

    removeNode(id: NodeId): void {
        // Remove all edges touching this node
        const edgesToRemove: EdgeId[] = [];
        for (const [eid, edge] of this.edges) {
            if (edge.fromNode === id || edge.toNode === id) edgesToRemove.push(eid);
        }
        edgesToRemove.forEach(eid => this.removeEdge(eid));

        this.nodes.delete(id);
        this.adjacency.delete(id);
        this.reverseAdj.delete(id);
        // Clean references from other nodes
        for (const set of this.adjacency.values()) set.delete(id);
        for (const set of this.reverseAdj.values()) set.delete(id);
    }

    getNode(id: NodeId): SignalNode | undefined {
        return this.nodes.get(id);
    }

    // ─── Edge Operations ──────────────────────────────────────────────

    addEdge(edge: SignalEdge): void {
        this.edges.set(edge.id, edge);
        const fwd = this.adjacency.get(edge.fromNode);
        if (fwd) fwd.add(edge.toNode);
        const rev = this.reverseAdj.get(edge.toNode);
        if (rev) rev.add(edge.fromNode);
    }

    removeEdge(id: EdgeId): void {
        const edge = this.edges.get(id);
        if (!edge) return;
        this.edges.delete(id);

        // Only remove adjacency if no other edges connect same pair
        const hasOther = [...this.edges.values()].some(
            e => e.fromNode === edge.fromNode && e.toNode === edge.toNode,
        );
        if (!hasOther) {
            this.adjacency.get(edge.fromNode)?.delete(edge.toNode);
            this.reverseAdj.get(edge.toNode)?.delete(edge.fromNode);
        }
    }

    // ─── Queries ──────────────────────────────────────────────────────

    getNeighbors(id: NodeId): NodeId[] {
        return [...(this.adjacency.get(id) ?? [])];
    }

    getIncoming(id: NodeId): NodeId[] {
        return [...(this.reverseAdj.get(id) ?? [])];
    }

    /** Get all edges FROM a specific node */
    getOutEdges(id: NodeId): SignalEdge[] {
        return [...this.edges.values()].filter(e => e.fromNode === id);
    }

    /** Get all edges TO a specific node */
    getInEdges(id: NodeId): SignalEdge[] {
        return [...this.edges.values()].filter(e => e.toNode === id);
    }

    /** Get all node IDs that have no incoming edges (sources) */
    getSources(): NodeId[] {
        return [...this.nodes.keys()].filter(id => {
            const rev = this.reverseAdj.get(id);
            return !rev || rev.size === 0;
        });
    }

    // ─── Closed Loop Detection (BFS) ──────────────────────────────────

    /**
     * Detects if there is any cycle in the graph.
     * For circuit simulation, a closed loop means current can flow.
     */
    hasCycle(): boolean {
        const visited = new Set<NodeId>();
        const recStack = new Set<NodeId>();

        const dfs = (nodeId: NodeId): boolean => {
            visited.add(nodeId);
            recStack.add(nodeId);

            const neighbors = this.adjacency.get(nodeId) ?? new Set();
            for (const neighbor of neighbors) {
                if (!visited.has(neighbor)) {
                    if (dfs(neighbor)) return true;
                } else if (recStack.has(neighbor)) {
                    return true;
                }
            }

            recStack.delete(nodeId);
            return false;
        };

        for (const nodeId of this.nodes.keys()) {
            if (!visited.has(nodeId)) {
                if (dfs(nodeId)) return true;
            }
        }
        return false;
    }

    /**
     * Check if a complete circuit loop exists from a battery node
     * back to itself (i.e., battery+ → load → battery−).
     */
    isCircuitClosed(startNodeId: NodeId): boolean {
        const visited = new Set<NodeId>();
        const queue: NodeId[] = [startNodeId];

        while (queue.length > 0) {
            const current = queue.shift()!;
            if (visited.has(current)) continue;
            visited.add(current);

            const neighbors = this.adjacency.get(current) ?? new Set();
            for (const neighbor of neighbors) {
                if (neighbor === startNodeId && visited.size > 1) return true;
                if (!visited.has(neighbor)) queue.push(neighbor);
            }
        }
        return false;
    }

    // ─── Topology ─────────────────────────────────────────────────────

    /** Topological sort (Kahn's algorithm). Returns null if cycle detected. */
    topologicalSort(): NodeId[] | null {
        const inDegree = new Map<NodeId, number>();
        for (const id of this.nodes.keys()) inDegree.set(id, 0);

        for (const edge of this.edges.values()) {
            inDegree.set(edge.toNode, (inDegree.get(edge.toNode) ?? 0) + 1);
        }

        const queue: NodeId[] = [];
        for (const [id, deg] of inDegree) {
            if (deg === 0) queue.push(id);
        }

        const sorted: NodeId[] = [];
        while (queue.length > 0) {
            const node = queue.shift()!;
            sorted.push(node);
            for (const neighbor of (this.adjacency.get(node) ?? [])) {
                const newDeg = (inDegree.get(neighbor) ?? 1) - 1;
                inDegree.set(neighbor, newDeg);
                if (newDeg === 0) queue.push(neighbor);
            }
        }

        return sorted.length === this.nodes.size ? sorted : null;
    }

    /** Get dirty nodes (nodes that need re-evaluation) */
    getDirtyNodes(): NodeId[] {
        return [...this.nodes.values()].filter(n => n.dirty).map(n => n.id);
    }

    /** Mark a node as dirty */
    markDirty(id: NodeId): void {
        const node = this.nodes.get(id);
        if (node) node.dirty = true;
    }

    /** Clear all dirty flags */
    clearDirty(): void {
        for (const node of this.nodes.values()) node.dirty = false;
    }

    /** Node count */
    get nodeCount(): number { return this.nodes.size; }
    /** Edge count */
    get edgeCount(): number { return this.edges.size; }
}
