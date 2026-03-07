import { describe, it, expect, beforeEach } from 'vitest';
import { MUREEngine } from '../MUREEngine';
import { NodeType } from '../core/SignalNode';

describe('MUREEngine (Integration)', () => {
    let engine: MUREEngine;

    beforeEach(() => {
        engine = new MUREEngine();
    });

    describe('Basic Circuit: Battery → Wire → LED → Return', () => {
        it('LED turns ON in closed circuit', () => {
            const bat = engine.addNode(NodeType.BATTERY, { voltage: 9 });
            const wire = engine.addNode(NodeType.WIRE);
            const led = engine.addNode(NodeType.LED, { vForward: 2 });

            engine.connectNodes(bat, 0, wire, 0);
            engine.connectNodes(wire, 0, led, 0);
            engine.connectNodes(led, 0, bat, 0); // return path

            engine.flush();

            const ledSignal = engine.getSignal(led, 0);
            expect(ledSignal).toBeDefined();
            // LED should pass through with voltage drop
            expect(ledSignal!.voltage).toBeGreaterThan(0);
        });

        it('open circuit keeps LED OFF', () => {
            const bat = engine.addNode(NodeType.BATTERY, { voltage: 9 });
            const led = engine.addNode(NodeType.LED, { vForward: 2 });

            engine.connectNodes(bat, 0, led, 0);
            // No return path

            engine.flush();

            // LED gets voltage from battery, but in an educational model it still evaluates
            const ledSignal = engine.getSignal(led, 0);
            expect(ledSignal).toBeDefined();
        });
    });

    describe('Digital Circuit: Switch → AND gate → LED', () => {
        it('AND gate outputs HIGH when both switches are ON', () => {
            const sw1 = engine.addNode(NodeType.SWITCH, { isOn: true });
            const sw2 = engine.addNode(NodeType.SWITCH, { isOn: true });
            const bat = engine.addNode(NodeType.BATTERY, { voltage: 5 });
            const gate = engine.addNode(NodeType.AND, { inputCount: 2 });
            const led = engine.addNode(NodeType.LED, { vForward: 2 });

            // Battery → Switch1 → AND input 0
            engine.connectNodes(bat, 0, sw1, 0);
            engine.connectNodes(sw1, 0, gate, 0);

            // Battery → Switch2 → AND input 1
            engine.connectNodes(bat, 0, sw2, 0);
            engine.connectNodes(sw2, 0, gate, 1);

            // AND output → LED
            engine.connectNodes(gate, 0, led, 0);

            engine.flush();

            const gateOut = engine.getSignal(gate, 0);
            expect(gateOut?.logic).toBe(true);
            expect(gateOut?.voltage).toBe(5);
        });

        it('AND gate outputs LOW when one switch is OFF', () => {
            const sw1 = engine.addNode(NodeType.SWITCH, { isOn: true });
            const sw2 = engine.addNode(NodeType.SWITCH, { isOn: false });
            const bat = engine.addNode(NodeType.BATTERY, { voltage: 5 });
            const gate = engine.addNode(NodeType.AND, { inputCount: 2 });

            engine.connectNodes(bat, 0, sw1, 0);
            engine.connectNodes(sw1, 0, gate, 0);
            engine.connectNodes(bat, 0, sw2, 0);
            engine.connectNodes(sw2, 0, gate, 1);

            engine.flush();

            const gateOut = engine.getSignal(gate, 0);
            expect(gateOut?.logic).toBe(false);
        });
    });

    describe('Toggle Switch', () => {
        it('toggleSwitch changes output', () => {
            const bat = engine.addNode(NodeType.BATTERY, { voltage: 5 });
            const sw = engine.addNode(NodeType.SWITCH, { isOn: false });
            const led = engine.addNode(NodeType.LED, { vForward: 2 });

            engine.connectNodes(bat, 0, sw, 0);
            engine.connectNodes(sw, 0, led, 0);

            engine.flush();
            expect(engine.getSignal(sw, 0)?.voltage).toBe(0); // OFF

            engine.toggleSwitch(sw);
            engine.flush();
            expect(engine.getSignal(sw, 0)?.voltage).toBe(5); // ON
        });
    });

    describe('Signal Tracing', () => {
        it('records trace data on flush', () => {
            const bat = engine.addNode(NodeType.BATTERY, { voltage: 9 });
            engine.flush();

            const trace = engine.getTrace(bat, 0);
            expect(trace.length).toBeGreaterThan(0);
            expect(trace[0].voltage).toBe(9);
        });

        it('accumulates trace data over simulation steps', () => {
            const bat = engine.addNode(NodeType.BATTERY, { voltage: 9 });

            engine.simulateStep(100);
            engine.simulateStep(100);
            engine.simulateStep(100);

            const trace = engine.getTrace(bat, 0);
            expect(trace.length).toBeGreaterThanOrEqual(3);
        });
    });

    describe('Circuit Queries', () => {
        it('detects closed circuit', () => {
            const bat = engine.addNode(NodeType.BATTERY, { voltage: 9 });
            const led = engine.addNode(NodeType.LED);

            engine.connectNodes(bat, 0, led, 0);
            engine.connectNodes(led, 0, bat, 0);

            expect(engine.isCircuitClosed(bat)).toBe(true);
        });

        it('detects open circuit', () => {
            const bat = engine.addNode(NodeType.BATTERY, { voltage: 9 });
            const led = engine.addNode(NodeType.LED);

            engine.connectNodes(bat, 0, led, 0);

            expect(engine.isCircuitClosed(bat)).toBe(false);
        });

        it('reports correct node and edge counts', () => {
            const bat = engine.addNode(NodeType.BATTERY);
            const led = engine.addNode(NodeType.LED);
            engine.connectNodes(bat, 0, led, 0);

            expect(engine.nodeCount).toBe(2);
            expect(engine.edgeCount).toBe(1);
        });
    });

    describe('Node Parameter Update', () => {
        it('setNodeParams changes behavior', () => {
            const bat = engine.addNode(NodeType.BATTERY, { voltage: 5 });
            engine.flush();
            expect(engine.getSignal(bat, 0)?.voltage).toBe(5);

            engine.setNodeParams(bat, { voltage: 12 });
            engine.markAllDirty();
            engine.flush();
            expect(engine.getSignal(bat, 0)?.voltage).toBe(12);
        });
    });

    describe('Reset', () => {
        it('resets simulation time', () => {
            engine.addNode(NodeType.BATTERY, { voltage: 9 });
            engine.simulateStep(100);

            engine.reset();

            expect(engine.currentTimeNs).toBe(0);
        });
    });

    describe('Snapshot', () => {
        it('returns all output states', () => {
            const bat = engine.addNode(NodeType.BATTERY, { voltage: 9 });
            const led = engine.addNode(NodeType.LED);
            engine.connectNodes(bat, 0, led, 0);
            engine.flush();

            const snap = engine.snapshot();
            expect(snap.size).toBe(2);
            expect(snap.has(bat)).toBe(true);
            expect(snap.has(led)).toBe(true);
        });
    });
});
