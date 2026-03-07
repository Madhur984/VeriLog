import { describe, it, expect, beforeEach } from 'vitest';
import { SimulationKernel } from '../core/SimulationKernel';
import { createBatteryNode } from '../nodes/BatteryNode';
import { createWireNode } from '../nodes/WireNode';
import { createLEDNode } from '../nodes/LEDNode';
import { createSwitchNode } from '../nodes/SwitchNode';

describe('SimulationKernel', () => {
    let kernel: SimulationKernel;

    beforeEach(() => {
        kernel = new SimulationKernel();
    });

    it('starts at time 0', () => {
        expect(kernel.currentTimeNs).toBe(0);
    });

    it('advances time on tick', () => {
        kernel.tick(1000);
        expect(kernel.currentTimeNs).toBe(1000);

        kernel.tick(500);
        expect(kernel.currentTimeNs).toBe(1500);
    });

    it('evaluates battery node on flush', () => {
        const bat = createBatteryNode('bat1', 9);
        kernel.graph.addNode(bat);

        kernel.flush();

        expect(bat.outputs[0].voltage).toBe(9);
        expect(bat.outputs[0].logic).toBe(true);
    });

    it('propagates signal from battery to LED through wire', () => {
        const bat = createBatteryNode('bat1', 9);
        const wire = createWireNode('w1');
        const led = createLEDNode('led1', 2);

        kernel.graph.addNode(bat);
        kernel.graph.addNode(wire);
        kernel.graph.addNode(led);

        kernel.graph.addEdge({ id: 'e1', fromNode: 'bat1', fromPort: 0, toNode: 'w1', toPort: 0, isLive: false });
        kernel.graph.addEdge({ id: 'e2', fromNode: 'w1', fromPort: 0, toNode: 'led1', toPort: 0, isLive: false });

        kernel.markAllDirty();
        kernel.flush();

        // Battery outputs 9V
        expect(bat.outputs[0].voltage).toBe(9);
        // Wire passes through
        expect(wire.outputs[0].voltage).toBe(9);
        // LED gets 9V (above 2V threshold), should be ON
        expect(led.internalState.isOn).toBe(true);
        expect((led.internalState.brightness as number)).toBeGreaterThan(0);
    });

    it('switch OFF blocks signal', () => {
        const bat = createBatteryNode('bat1', 9);
        const sw = createSwitchNode('sw1', false);
        const led = createLEDNode('led1', 2);

        kernel.graph.addNode(bat);
        kernel.graph.addNode(sw);
        kernel.graph.addNode(led);

        kernel.graph.addEdge({ id: 'e1', fromNode: 'bat1', fromPort: 0, toNode: 'sw1', toPort: 0, isLive: false });
        kernel.graph.addEdge({ id: 'e2', fromNode: 'sw1', fromPort: 0, toNode: 'led1', toPort: 0, isLive: false });

        kernel.markAllDirty();
        kernel.flush();

        // Switch is OFF → LED should not be lit
        expect(sw.outputs[0].voltage).toBe(0);
        expect(led.internalState.isOn).toBe(false);
    });

    it('switch ON passes signal', () => {
        const bat = createBatteryNode('bat1', 9);
        const sw = createSwitchNode('sw1', true);
        const led = createLEDNode('led1', 2);

        kernel.graph.addNode(bat);
        kernel.graph.addNode(sw);
        kernel.graph.addNode(led);

        kernel.graph.addEdge({ id: 'e1', fromNode: 'bat1', fromPort: 0, toNode: 'sw1', toPort: 0, isLive: false });
        kernel.graph.addEdge({ id: 'e2', fromNode: 'sw1', fromPort: 0, toNode: 'led1', toPort: 0, isLive: false });

        kernel.markAllDirty();
        kernel.flush();

        expect(sw.outputs[0].voltage).toBe(9);
        expect(led.internalState.isOn).toBe(true);
    });

    it('processes scheduled events on tick', () => {
        const led = createLEDNode('led1', 2);
        kernel.graph.addNode(led);

        // Schedule an event to arrive at time 100ns
        kernel.scheduleDelayed('led1', 0, 100, 5.0, true);

        // Tick to time 50ns — event not yet fired
        kernel.tick(50);
        expect(led.inputs[0].voltage).toBe(0);

        // Tick to time 100ns — event fires
        kernel.tick(50);
        expect(led.inputs[0].voltage).toBe(5.0);
        expect(led.inputs[0].logic).toBe(true);
    });

    it('snapshot returns all output port states', () => {
        const bat = createBatteryNode('bat1', 9);
        const led = createLEDNode('led1');
        kernel.graph.addNode(bat);
        kernel.graph.addNode(led);

        kernel.flush();

        const snap = kernel.snapshot();
        expect(snap.has('bat1')).toBe(true);
        expect(snap.has('led1')).toBe(true);
        expect(snap.get('bat1')![0].voltage).toBe(9);
    });

    it('getSignal returns specific port state', () => {
        const bat = createBatteryNode('bat1', 5);
        kernel.graph.addNode(bat);
        kernel.flush();

        const signal = kernel.getSignal('bat1', 0);
        expect(signal?.voltage).toBe(5);
        expect(signal?.logic).toBe(true);
    });

    it('reset clears time and queue', () => {
        kernel.tick(1000);
        kernel.scheduleDelayed('x', 0, 500, 5, true);

        kernel.reset();

        expect(kernel.currentTimeNs).toBe(0);
    });
});
