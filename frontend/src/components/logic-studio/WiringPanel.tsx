/**
 * WiringPanel.tsx — Connection list and management
 */

import type { SignalEdge } from '../../mure/core/SignalEdge';
import type { CanvasNode } from '../../hooks/useLogicStudio';

interface Props {
    edges: SignalEdge[];
    nodes: CanvasNode[];
}

export function WiringPanel({ edges, nodes }: Props) {
    const getNodeLabel = (id: string) => {
        const node = nodes.find((n) => n.id === id);
        return node?.label || id.slice(0, 6);
    };

    return (
        <div className="studio-wiring-panel">
            <div className="studio-wiring-header">
                <span>Connections</span>
                <span className="studio-wiring-count">{edges.length}</span>
            </div>
            <div className="studio-wiring-list">
                {edges.length === 0 && (
                    <div className="studio-wiring-empty">
                        No connections yet. Use Wire mode to connect ports.
                    </div>
                )}
                {edges.map((edge) => (
                    <div key={edge.id} className="studio-wiring-item">
                        <span className="studio-wiring-from">
                            {getNodeLabel(edge.fromNode)}[{edge.fromPort}]
                        </span>
                        <span className="studio-wiring-arrow">→</span>
                        <span className="studio-wiring-to">
                            {getNodeLabel(edge.toNode)}[{edge.toPort}]
                        </span>
                        <span
                            className={`studio-wiring-status ${edge.isLive ? 'studio-wiring-status--live' : ''}`}
                        >
                            {edge.isLive ? '●' : '○'}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
