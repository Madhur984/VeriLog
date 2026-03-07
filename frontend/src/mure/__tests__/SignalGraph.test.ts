import { describe, it, expect, beforeEach } from 'vitest';
import { SignalGraph } from '../core/SignalGraph';
import { createBatteryNode } from '../nodes/BatteryNode';
import { createWireNode } from '../nodes/WireNode';
import { createLEDNode } from '../nodes/LEDNode';
import { createSwitchNode as _createSwitchNode } from '../nodes/SwitchNode';

describe('SignalGraph', () => {
    let graph: SignalGraph;

    beforeEach(() => {
        graph = new SignalGraph();
    });

    describe('Node Operations', () => {
        it('adds and retrieves a node', () => {
            const bat = createBatteryNode('bat1', 9);
            graph.addNode(bat);
            expect(graph.nodeCount).toBe(1);
            expect(graph.getNode('bat1')).toBe(bat);
        });

        it('removes a node and its edges', () => {
            const bat = createBatteryNode('bat1');
            const led = createLEDNode('led1');
            graph.addNode(bat);
            graph.addNode(led);
            graph.addEdge({ id: 'e1', fromNode: 'bat1', fromPort: 0, toNode: 'led1', toPort: 0, isLive: false });

            graph.removeNode('bat1');
            expect(graph.nodeCount).toBe(1);
            expect(graph.edgeCount).toBe(0);
            expect(graph.getNode('bat1')).toBeUndefined();
        });
    });

    describe('Edge Operations', () => {
        it('adds and retrieves edges', () => {
            const bat = createBatteryNode('bat1');
            const led = createLEDNode('led1');
            graph.addNode(bat);
            graph.addNode(led);

            graph.addEdge({ id: 'e1', fromNode: 'bat1', fromPort: 0, toNode: 'led1', toPort: 0, isLive: false });
            expect(graph.edgeCount).toBe(1);
        });

        it('removes an edge', () => {
            const bat = createBatteryNode('bat1');
            const led = createLEDNode('led1');
            graph.addNode(bat);
            graph.addNode(led);
            graph.addEdge({ id: 'e1', fromNode: 'bat1', fromPort: 0, toNode: 'led1', toPort: 0, isLive: false });

            graph.removeEdge('e1');
            expect(graph.edgeCount).toBe(0);
        });

        it('tracks adjacency correctly', () => {
            const bat = createBatteryNode('bat1');
            const wire = createWireNode('w1');
            const led = createLEDNode('led1');
            graph.addNode(bat);
            graph.addNode(wire);
            graph.addNode(led);

            graph.addEdge({ id: 'e1', fromNode: 'bat1', fromPort: 0, toNode: 'w1', toPort: 0, isLive: false });
            graph.addEdge({ id: 'e2', fromNode: 'w1', fromPort: 0, toNode: 'led1', toPort: 0, isLive: false });

            expect(graph.getNeighbors('bat1')).toContain('w1');
            expect(graph.getNeighbors('w1')).toContain('led1');
            expect(graph.getIncoming('led1')).toContain('w1');
        });
    });

    describe('Closed Loop Detection', () => {
        it('detects cycle in a closed circuit', () => {
            const bat = createBatteryNode('bat1');
            const led = createLEDNode('led1');
            graph.addNode(bat);
            graph.addNode(led);

            graph.addEdge({ id: 'e1', fromNode: 'bat1', fromPort: 0, toNode: 'led1', toPort: 0, isLive: false });
            graph.addEdge({ id: 'e2', fromNode: 'led1', fromPort: 0, toNode: 'bat1', toPort: 0, isLive: false });

            expect(graph.hasCycle()).toBe(true);
        });

        it('detects no cycle in open circuit', () => {
            const bat = createBatteryNode('bat1');
            const led = createLEDNode('led1');
            graph.addNode(bat);
            graph.addNode(led);

            graph.addEdge({ id: 'e1', fromNode: 'bat1', fromPort: 0, toNode: 'led1', toPort: 0, isLive: false });

            expect(graph.hasCycle()).toBe(false);
        });

        it('isCircuitClosed detects complete loop', () => {
            const bat = createBatteryNode('bat1');
            const wire = createWireNode('w1');
            const led = createLEDNode('led1');
            graph.addNode(bat);
            graph.addNode(wire);
            graph.addNode(led);

            graph.addEdge({ id: 'e1', fromNode: 'bat1', fromPort: 0, toNode: 'w1', toPort: 0, isLive: false });
            graph.addEdge({ id: 'e2', fromNode: 'w1', fromPort: 0, toNode: 'led1', toPort: 0, isLive: false });
            graph.addEdge({ id: 'e3', fromNode: 'led1', fromPort: 0, toNode: 'bat1', toPort: 0, isLive: false });

            expect(graph.isCircuitClosed('bat1')).toBe(true);
        });

        it('isCircuitClosed returns false for open circuit', () => {
            const bat = createBatteryNode('bat1');
            const led = createLEDNode('led1');
            graph.addNode(bat);
            graph.addNode(led);

            graph.addEdge({ id: 'e1', fromNode: 'bat1', fromPort: 0, toNode: 'led1', toPort: 0, isLive: false });

            expect(graph.isCircuitClosed('bat1')).toBe(false);
        });
    });

    describe('Topological Sort', () => {
        it('returns sorted order for acyclic graph', () => {
            const bat = createBatteryNode('bat1');
            const wire = createWireNode('w1');
            const led = createLEDNode('led1');
            graph.addNode(bat);
            graph.addNode(wire);
            graph.addNode(led);

            graph.addEdge({ id: 'e1', fromNode: 'bat1', fromPort: 0, toNode: 'w1', toPort: 0, isLive: false });
            graph.addEdge({ id: 'e2', fromNode: 'w1', fromPort: 0, toNode: 'led1', toPort: 0, isLive: false });

            const sorted = graph.topologicalSort();
            expect(sorted).not.toBeNull();
            expect(sorted!.indexOf('bat1')).toBeLessThan(sorted!.indexOf('w1'));
            expect(sorted!.indexOf('w1')).toBeLessThan(sorted!.indexOf('led1'));
        });

        it('returns null for cyclic graph', () => {
            const a = createBatteryNode('a');
            const b = createLEDNode('b');
            graph.addNode(a);
            graph.addNode(b);

            graph.addEdge({ id: 'e1', fromNode: 'a', fromPort: 0, toNode: 'b', toPort: 0, isLive: false });
            graph.addEdge({ id: 'e2', fromNode: 'b', fromPort: 0, toNode: 'a', toPort: 0, isLive: false });

            expect(graph.topologicalSort()).toBeNull();
        });
    });

    describe('Dirty Node Tracking', () => {
        it('marks and gets dirty nodes', () => {
            const bat = createBatteryNode('bat1');
            const led = createLEDNode('led1');
            bat.dirty = false;
            led.dirty = false;
            graph.addNode(bat);
            graph.addNode(led);

            graph.markDirty('bat1');
            const dirty = graph.getDirtyNodes();
            expect(dirty).toContain('bat1');
            expect(dirty).not.toContain('led1');
        });

        it('clears dirty flags', () => {
            const bat = createBatteryNode('bat1');
            graph.addNode(bat);
            graph.markDirty('bat1');
            graph.clearDirty();
            expect(graph.getDirtyNodes()).toHaveLength(0);
        });
    });

    describe('Source Nodes', () => {
        it('identifies nodes with no incoming edges', () => {
            const bat = createBatteryNode('bat1');
            const led = createLEDNode('led1');
            graph.addNode(bat);
            graph.addNode(led);

            graph.addEdge({ id: 'e1', fromNode: 'bat1', fromPort: 0, toNode: 'led1', toPort: 0, isLive: false });

            const sources = graph.getSources();
            expect(sources).toContain('bat1');
            expect(sources).not.toContain('led1');
        });
    });
});
