/**
 * mure/core/SignalEdge.ts — Edge Model (Connections Between Nodes)
 *
 * Each edge connects one output port of a source node
 * to one input port of a destination node.
 */

import type { NodeId } from './SignalNode';

export type EdgeId = string;

export interface SignalEdge {
    id: EdgeId;
    fromNode: NodeId;
    fromPort: number;
    toNode: NodeId;
    toPort: number;
    isLive: boolean;
}

let edgeCounter = 0;

export function createEdge(
    fromNode: NodeId,
    fromPort: number,
    toNode: NodeId,
    toPort: number,
): SignalEdge {
    return {
        id: `edge_${++edgeCounter}`,
        fromNode,
        fromPort,
        toNode,
        toPort,
        isLive: false,
    };
}

export function resetEdgeCounter(): void {
    edgeCounter = 0;
}
