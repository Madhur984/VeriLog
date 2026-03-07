/**
 * XRayOverlay.tsx — Internal signal visualization on nodes
 */

import type { CanvasNode } from '../../hooks/useLogicStudio';
import type { NodeId } from '../../mure/core/SignalNode';
import type { PortState } from '../../mure/core/Port';

interface Props {
    nodes: CanvasNode[];
    snapshot: Map<NodeId, PortState[]>;
}

export function XRayOverlay({ nodes, snapshot }: Props) {
    return (
        <div className="studio-xray-overlay">
            {nodes.map((node) => {
                const ports = snapshot.get(node.id);
                if (!ports || ports.length === 0) return null;

                return (
                    <div key={node.id}>
                        {ports.map((port, i) => {
                            const label = `${port.voltage.toFixed(1)}V ${port.logic ? 'H' : 'L'}`;
                            const cls = port.logic
                                ? 'studio-xray-badge--high'
                                : port.connected
                                    ? 'studio-xray-badge--low'
                                    : 'studio-xray-badge--hiz';

                            return (
                                <span
                                    key={`${node.id}-${i}`}
                                    className={`studio-xray-badge ${cls}`}
                                    style={{
                                        position: 'absolute',
                                        left: `${node.x + 110}px`,
                                        top: `${node.y + 8 + i * 16}px`,
                                    }}
                                >
                                    {label}
                                </span>
                            );
                        })}
                    </div>
                );
            })}
        </div>
    );
}
