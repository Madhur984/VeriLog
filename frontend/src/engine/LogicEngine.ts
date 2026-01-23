import { CircuitState, Component, Connection } from './types';

export class LogicEngine {
    private components: Map<string, Component> = new Map();
    private connections: Connection[] = [];

    constructor(initialState?: CircuitState) {
        if (initialState) {
            this.loadState(initialState);
        }
    }

    loadState(state: CircuitState) {
        this.components.clear();
        state.components.forEach(c => this.components.set(c.id, c));
        this.connections = [...state.connections];
    }

    // Main Simulation Loop
    evaluate(): Map<string, boolean> { // Returns map of ComponentID -> IsActive/OutputValue
        // 1. Reset all inputs to false
        this.components.forEach(comp => {
            comp.inputs.forEach(port => port.value = false);
        });

        // 2. Propagate values
        // Simple iterative propagation for now (Phase 1: No cycles assumed or simple cycles)
        // For a robust engine, we'd use topological sort or event queue.
        // Here we run a fixed number of passes to settle signals.
        const passes = 5;

        for (let i = 0; i < passes; i++) {
            this.propagateWires();
            this.evaluateComponents();
        }

        const componentStates = new Map<string, boolean>();
        this.components.forEach(c => {
            // For visualization, we might want to know if a component is "Active"
            // E.g., LED is active if input is true.
            if (c.type === 'LED') {
                componentStates.set(c.id, c.inputs[0]?.value || false);
            }
            if (c.type === 'BATTERY') {
                componentStates.set(c.id, true);
            }
            if (c.type === 'SWITCH') {
                componentStates.set(c.id, c.state.isOn);
            }
            if (c.type === 'WIRE_NODE') {
                componentStates.set(c.id, c.inputs[0]?.value || false);
            }
            // Gates visualize active if their output is high? Or just static?
            // Lets assume gates glow if output is high.
            if (c.type === 'AND_GATE' || c.type === 'OR_GATE') {
                componentStates.set(c.id, c.outputs[0]?.value || false);
            }
        });

        return componentStates;
    }

    private propagateWires() {
        this.connections.forEach(conn => {
            const sourceComp = this.components.get(conn.sourceId);
            const targetComp = this.components.get(conn.targetId);

            if (sourceComp && targetComp) {
                const sourcePort = sourceComp.outputs.find(p => p.id === conn.sourcePortId);
                const targetPort = targetComp.inputs.find(p => p.id === conn.targetPortId);

                if (sourcePort && targetPort) {
                    targetPort.value = sourcePort.value;
                }
            }
        });
    }

    private evaluateComponents() {
        this.components.forEach(comp => {
            switch (comp.type) {
                case 'BATTERY':
                    // Always outputs High
                    comp.outputs.forEach(p => p.value = true);
                    break;
                case 'SWITCH':
                    // Output matches internal state
                    comp.outputs.forEach(p => p.value = !!comp.state.isOn);
                    break;
                case 'AND_GATE':
                    // High if all inputs are High
                    const allHigh = comp.inputs.every(p => p.value);
                    comp.outputs.forEach(p => p.value = allHigh);
                    break;
                case 'OR_GATE':
                    // High if any input is High
                    const anyHigh = comp.inputs.some(p => p.value);
                    comp.outputs.forEach(p => p.value = anyHigh);
                    break;
                case 'WIRE_NODE':
                    // Pass through
                    comp.outputs.forEach(p => p.value = comp.inputs[0]?.value || false);
                    break;
                case 'RESISTOR':
                    // Simple pass through for logic logic (ignoring voltage/current for Phase 1)
                    comp.outputs.forEach(p => p.value = comp.inputs[0]?.value || false);
                    break;
                case 'LED':
                    // Output? LED usually sinks. But maybe it passes signal?
                    // Let's assume LED is a sink for Phase 1 logic.
                    break;
            }
        });
    }

    // Helper to toggle switches
    toggleSwitch(id: string) {
        const comp = this.components.get(id);
        if (comp && comp.type === 'SWITCH') {
            comp.state.isOn = !comp.state.isOn;
        }
    }
}
