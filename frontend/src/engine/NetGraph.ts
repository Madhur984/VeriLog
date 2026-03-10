/**
 * engine/NetGraph.ts — Wire Net Topology
 *
 * Models the Logisim wire system:
 *  - Wires are segments connecting ports
 *  - Overlapping/touching wires merge into one "net"
 *  - A net is a set of ports; one output drives the entire net
 *  - Branching: one output → multiple inputs on the same net
 *
 * Key concept: unlike point-to-point wires, a NET is a group of
 * electrically connected points. The simulation evaluates at net level.
 */

import type { BusValue } from './LogicValue';
import { resolveNet, floatingBus } from './LogicValue';

// ── Point types ───────────────────────────────────────────────────────────────

export interface GridPoint {
    x: number;  // grid column (10px units)
    y: number;  // grid row
}

// ── Wire Segment ─────────────────────────────────────────────────────────────
// A single horizontal or vertical line segment on the grid.

export interface WireSegment {
    id: string;
    /** Both endpoints — must share X or Y (orthogonal) */
    x1: number; y1: number;
    x2: number; y2: number;
    /** Which net this segment belongs to (set by NetGraph.rebuild()) */
    netId: string;
}

// ── Port Reference ────────────────────────────────────────────────────────────

export interface PortRef {
    componentId: string;
    portId: string;
    /** Grid position of the port (for hit testing) */
    x: number;
    y: number;
    bits: number;
    direction: 'input' | 'output' | 'inout';
}

// ── Net ──────────────────────────────────────────────────────────────────────
// A net is all ports + wire segments electrically connected together.

export interface Net {
    id: string;
    bits: number;
    segments: WireSegment[];
    ports: PortRef[];
    /** Resolved logic value for this net */
    value: BusValue;
    /** True if short circuit (multiple conflicting outputs) */
    error: boolean;
}

// ── NetGraph ─────────────────────────────────────────────────────────────────

export class NetGraph {
    private segments = new Map<string, WireSegment>();
    private portRefs = new Map<string, PortRef>();   // key: `${componentId}:${portId}`
    private nets = new Map<string, Net>();
    private segNetMap = new Map<string, string>();     // segId → netId
    private portNetMap = new Map<string, string>();    // portKey → netId

    private netCounter = 0;

    // ── Public API ─────────────────────────────────────────────────────────────

    addSegment(seg: WireSegment): void {
        this.segments.set(seg.id, seg);
        this.rebuild();
    }

    removeSegment(id: string): void {
        this.segments.delete(id);
        this.rebuild();
    }

    addPort(ref: PortRef): void {
        const key = `${ref.componentId}:${ref.portId}`;
        this.portRefs.set(key, ref);
        this.rebuild();
    }

    removePort(componentId: string, portId: string): void {
        this.portRefs.delete(`${componentId}:${portId}`);
        this.rebuild();
    }

    removeComponent(componentId: string): void {
        for (const key of [...this.portRefs.keys()]) {
            if (key.startsWith(`${componentId}:`)) this.portRefs.delete(key);
        }
        this.rebuild();
    }

    /** Get the net id for a given port */
    getPortNet(componentId: string, portId: string): Net | null {
        const netId = this.portNetMap.get(`${componentId}:${portId}`);
        return netId ? this.nets.get(netId) ?? null : null;
    }

    /** Get all nets */
    getAllNets(): Net[] {
        return Array.from(this.nets.values());
    }

    /** Get net by id */
    getNet(netId: string): Net | undefined {
        return this.nets.get(netId);
    }

    /** Get segment by id */
    getSegment(id: string): WireSegment | undefined {
        return this.segments.get(id);
    }

    /** All segments */
    getAllSegments(): WireSegment[] {
        return Array.from(this.segments.values());
    }

    /** Rebuild graph completely from a segment list */
    buildFromSegments(segments: WireSegment[]): void {
        this.segments.clear();
        for (const s of segments) {
            this.segments.set(s.id, s);
        }
        this.rebuild();
    }

    /** Returns map of net values */
    getNetValues(): Map<string, BusValue> {
        const out = new Map<string, BusValue>();
        for (const [id, net] of this.nets) {
            out.set(id, net.value);
        }
        return out;
    }

    /**
     * Apply simulation output: given the outputs from all components,
     * resolve each net's value (handles multi-driver conflicts).
     */
    applyOutputs(outputs: Map<string, Map<string, BusValue>>): void {
        // Reset all nets to floating
        for (const net of this.nets.values()) {
            net.value = floatingBus(net.bits);
            net.error = false;
        }

        // For each output port, find its net, collect drivers
        const netDrivers = new Map<string, BusValue[]>();

        for (const [componentId, portOutputs] of outputs) {
            for (const [portId, value] of portOutputs) {
                const netId = this.portNetMap.get(`${componentId}:${portId}`);
                if (!netId) continue;
                if (!netDrivers.has(netId)) netDrivers.set(netId, []);
                netDrivers.get(netId)!.push(value);
            }
        }

        // Resolve each net
        for (const [netId, drivers] of netDrivers) {
            const net = this.nets.get(netId);
            if (!net) continue;
            const resolved: BusValue = drivers[0].map((_, i) =>
                resolveNet(drivers.map(d => d[i] ?? 'Z'))
            );
            net.value = resolved;
            net.error = resolved.some(v => v === 'X');
        }
    }

    // ── Private — Net Construction (Union-Find style) ──────────────────────────

    private rebuild(): void {
        this.nets.clear();
        this.segNetMap.clear();
        this.portNetMap.clear();

        const allSegs = Array.from(this.segments.values());
        const allPorts = Array.from(this.portRefs.values());

        // Union-Find structure: element = seg.id or port key
        const parent = new Map<string, string>();

        const find = (x: string): string => {
            if (!parent.has(x)) parent.set(x, x);
            if (parent.get(x) !== x) parent.set(x, find(parent.get(x)!));
            return parent.get(x)!;
        };

        const union = (a: string, b: string) => {
            const ra = find(a), rb = find(b);
            if (ra !== rb) parent.set(ra, rb);
        };

        // Initialize all segment and port entries
        for (const s of allSegs) parent.set(s.id, s.id);
        for (const p of allPorts) parent.set(`${p.componentId}:${p.portId}`, `${p.componentId}:${p.portId}`);

        // Union segments that share an endpoint
        for (let i = 0; i < allSegs.length; i++) {
            for (let j = i + 1; j < allSegs.length; j++) {
                if (this.segmentsTouch(allSegs[i], allSegs[j])) {
                    union(allSegs[i].id, allSegs[j].id);
                }
            }
        }

        // Union ports that sit on any segment
        for (const port of allPorts) {
            const key = `${port.componentId}:${port.portId}`;
            for (const seg of allSegs) {
                if (this.pointOnSegment(port.x, port.y, seg)) {
                    union(key, seg.id);
                }
            }
        }

        // Build nets from union-find groups
        const groups = new Map<string, { segs: WireSegment[]; ports: PortRef[] }>();

        for (const seg of allSegs) {
            const root = find(seg.id);
            if (!groups.has(root)) groups.set(root, { segs: [], ports: [] });
            groups.get(root)!.segs.push(seg);
        }

        for (const port of allPorts) {
            const key = `${port.componentId}:${port.portId}`;
            const root = find(key);
            if (!groups.has(root)) groups.set(root, { segs: [], ports: [] });
            groups.get(root)!.ports.push(port);
        }

        // Create Net objects
        for (const [, group] of groups) {
            const id = `net_${++this.netCounter}`;
            const bits = group.ports.reduce((m, p) => Math.max(m, p.bits), 1);
            const net: Net = {
                id, bits,
                segments: group.segs,
                ports: group.ports,
                value: floatingBus(bits),
                error: false,
            };
            this.nets.set(id, net);
            for (const s of group.segs) { s.netId = id; this.segNetMap.set(s.id, id); }
            for (const p of group.ports) { this.portNetMap.set(`${p.componentId}:${p.portId}`, id); }
        }
    }

    // ── Geometry Helpers ──────────────────────────────────────────────────────

    private segmentsTouch(a: WireSegment, b: WireSegment): boolean {
        const aPoints: GridPoint[] = this.segmentPoints(a);
        const bPoints: GridPoint[] = this.segmentPoints(b);

        for (const ap of aPoints) {
            if (this.pointOnSegment(ap.x, ap.y, b)) return true;
        }
        for (const bp of bPoints) {
            if (this.pointOnSegment(bp.x, bp.y, a)) return true;
        }
        return false;
    }

    private segmentPoints(s: WireSegment): GridPoint[] {
        return [{ x: s.x1, y: s.y1 }, { x: s.x2, y: s.y2 }];
    }

    private pointOnSegment(x: number, y: number, s: WireSegment): boolean {
        if (s.x1 === s.x2) {
            // Vertical segment
            return x === s.x1 && y >= Math.min(s.y1, s.y2) && y <= Math.max(s.y1, s.y2);
        } else {
            // Horizontal segment
            return y === s.y1 && x >= Math.min(s.x1, s.x2) && x <= Math.max(s.x1, s.x2);
        }
    }
}
