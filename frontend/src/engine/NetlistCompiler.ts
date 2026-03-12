import { CanvasNodeData, ElectricalNet, NetID, PortID, PortMap, WireSegment } from '../types/circuit';

/**
 * Helper class for O(a(n)) Union-Find Operations.
 * Used to group intersecting wire segments into isolated electrical nets.
 */
class DisjointSet {
    private parent: Map<string, string> = new Map();

    makeSet(id: string) {
        if (!this.parent.has(id)) {
            this.parent.set(id, id);
        }
    }

    find(id: string): string {
        let root = id;
        while (root !== this.parent.get(root)) {
            root = this.parent.get(root)!;
        }
        
        // Path compression
        let curr = id;
        while (curr !== root) {
            let next = this.parent.get(curr)!;
            this.parent.set(curr, root);
            curr = next;
        }

        return root;
    }

    union(id1: string, id2: string) {
        const root1 = this.find(id1);
        const root2 = this.find(id2);
        if (root1 !== root2) {
            this.parent.set(root1, root2);
        }
    }
    
    getSets(): Map<string, string[]> {
        const sets = new Map<string, string[]>();
        for (const id of this.parent.keys()) {
            const root = this.find(id);
            if (!sets.has(root)) sets.set(root, []);
            sets.get(root)!.push(id);
        }
        return sets;
    }
}

/**
 * Geometric utility for calculating segment intersection.
 */
function segmentsIntersectOrTouch(a: WireSegment, b: WireSegment): boolean {
    const isPointOnSegment = (x: number, y: number, seg: WireSegment) => {
        const crossProduct = (y - seg.y1) * (seg.x2 - seg.x1) - (x - seg.x1) * (seg.y2 - seg.y1);
        if (Math.abs(crossProduct) !== 0) return false;
        
        const dotProduct = (x - seg.x1) * (seg.x2 - seg.x1) + (y - seg.y1) * (seg.y2 - seg.y1);
        if (dotProduct < 0) return false;
        
        const squaredLength = (seg.x2 - seg.x1) * (seg.x2 - seg.x1) + (seg.y2 - seg.y1) * (seg.y2 - seg.y1);
        if (dotProduct > squaredLength) return false;

        return true;
    };

    // Horizontal/Horizontal overlap check
    if (a.y1 === a.y2 && b.y1 === b.y2 && a.y1 === b.y1) {
        return Math.max(Math.min(a.x1, a.x2), Math.min(b.x1, b.x2)) <= Math.min(Math.max(a.x1, a.x2), Math.max(b.x1, b.x2));
    }

    // Vertical/Vertical overlap check
    if (a.x1 === a.x2 && b.x1 === b.x2 && a.x1 === b.x1) {
        return Math.max(Math.min(a.y1, a.y2), Math.min(b.y1, b.y2)) <= Math.min(Math.max(a.y1, a.y2), Math.max(b.y1, b.y2));
    }

    // Orthogonal intersection check
    return isPointOnSegment(a.x1, a.y1, b) || isPointOnSegment(a.x2, a.y2, b) || 
           isPointOnSegment(b.x1, b.y1, a) || isPointOnSegment(b.x2, b.y2, a) ||
           // Cross intersection (T-junctions are caught by pointOnSegment above)
           ((Math.min(a.x1, a.x2) <= b.x1 && b.x1 <= Math.max(a.x1, a.x2)) && (Math.min(b.y1, b.y2) <= a.y1 && a.y1 <= Math.max(b.y1, b.y2))) ||
           ((Math.min(b.x1, b.x2) <= a.x1 && a.x1 <= Math.max(b.x1, b.x2)) && (Math.min(a.y1, a.y2) <= b.y1 && b.y1 <= Math.max(a.y1, a.y2)));
}


/**
 * Converts visual graph (rectangles + raw SVG lines) into unified Electrical Nets.
 */
export class NetlistCompiler {

    /**
     * Complete compilation flow from visual elements to electrical state.
     */
    static compile(
        nodes: CanvasNodeData[], 
        segments: WireSegment[], 
        resolvePortLocs: (node: CanvasNodeData) => PortMap[]
    ): { nets: Record<NetID, ElectricalNet>, portToNet: Map<PortID, NetID>, segmentToNet: Map<string, NetID> } {
        
        const ds = new DisjointSet();
        const portLocations = new Map<string, PortMap>();
        const segmentTree = new Map<string, WireSegment>();

        // 1. Initialize sets for all segments
        for (const seg of segments) {
            ds.makeSet(seg.id);
            segmentTree.set(seg.id, seg);
        }

        // 2. Perform intersection checks on all segment pairs O(N^2) (Optimization space for Spatial Hash later)
        for (let i = 0; i < segments.length; i++) {
            for (let j = i + 1; j < segments.length; j++) {
                if (segmentsIntersectOrTouch(segments[i], segments[j])) {
                    ds.union(segments[i].id, segments[j].id);
                }
            }
        }

        const disjointNets = ds.getSets();
        const electricalNets: Record<NetID, ElectricalNet> = {};
        const portToNet = new Map<PortID, NetID>();
        const segmentToNet = new Map<string, NetID>();
        
        let netIdx = 0;
        const rootToNetId = new Map<string, NetID>();

        // 3. Register uniquely isolated sub-graphs as Nets
        for (const [rootId, segIds] of disjointNets.entries()) {
            const netId: NetID = `net_${netIdx++}`;
            rootToNetId.set(rootId, netId);

            electricalNets[netId] = {
                id: netId,
                attachedPorts: [],
                drivers: [],
                listeners: []
            };

            for (const segId of segIds) {
                segmentToNet.set(segId, netId);
            }
        }

        // 4. Attach component ports to the resulting nets by overlapping geometry
        for (const node of nodes) {
            const ports = resolvePortLocs(node);
            
            for (const port of ports) {
                const portId: PortID = `${port.nodeId}:${port.portName}`;
                portLocations.set(portId, port);

                // Is this port physically touching ANY segment belonging to a net?
                for (const [rootId, segIds] of disjointNets.entries()) {
                    let touched = false;
                    for (const segId of segIds) {
                        const seg = segmentTree.get(segId)!;
                        // Tolerance for float inaccuracies
                        const isTouching = 
                            ((port.x >= Math.min(seg.x1, seg.x2) - 0.1 && port.x <= Math.max(seg.x1, seg.x2) + 0.1) && Math.abs(port.y - seg.y1) < 0.1) ||
                            ((port.y >= Math.min(seg.y1, seg.y2) - 0.1 && port.y <= Math.max(seg.y1, seg.y2) + 0.1) && Math.abs(port.x - seg.x1) < 0.1);

                        if (isTouching) {
                            touched = true;
                            break;
                        }
                    }

                    if (touched) {
                        const netId = rootToNetId.get(rootId)!;
                        portToNet.set(portId, netId);
                        electricalNets[netId].attachedPorts.push(portId);

                        if (port.direction === 'OUTPUT' || port.direction === 'INOUT') {
                            electricalNets[netId].drivers.push(portId);
                        }
                        if (port.direction === 'INPUT' || port.direction === 'INOUT') {
                            electricalNets[netId].listeners.push(portId);
                        }
                        // Stop checking other nets, a port can only bind to 1 electrical node
                        break; 
                    }
                }
            }
        }

        return { nets: electricalNets, portToNet, segmentToNet };
    }
}
