/**
 * SignalProbe.tsx - Click-to-probe with real-time tooltip
 */

import type { CanvasNode } from '../../hooks/useLogicStudio';
import type { NodeId } from '../../mure/core/SignalNode';
import type { PortState } from '../../mure/core/Port';

interface Props {
    nodes: CanvasNode[];
    probedNodes: Set<NodeId>;
    snapshot: Map<NodeId, PortState[]>;
}

export function SignalProbe({ nodes, probedNodes, snapshot }: Props) {
    if (probedNodes.size === 0) return null;

    return (
        <>
            {nodes
                .filter((n) => probedNodes.has(n.id))
                .map((node) => {
                    const ports = snapshot.get(node.id);
                    if (!ports || ports.length === 0) return null;

                    const output = ports[0];
                    const label = `${output.voltage.toFixed(2)}V | ${output.logic ? 'HIGH' : 'LOW'}`;

                    return (
                        <div
                            key={node.id}
                            className="studio-probe-tooltip"
                            style={{
                                left: `${node.x + 50}px`,
                                top: `${node.y - 24}px`,
                            }}
                        >
                            📍 {node.label}: {label}
                        </div>
                    );
                })}
        </>
    );
}
