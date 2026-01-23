import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { Component, WireConnection } from '../simulator/types';
import { evaluateCircuit } from '../simulator/evaluator';

interface SimulatorState {
    components: Record<string, Component>;
    wires: Record<string, WireConnection>;

    // Actions
    addComponent: (c: Component) => void;
    addWire: (w: WireConnection) => void;
    toggleSwitch: (id: string) => void;
    reset: () => void;

    // Trigger Logic
    runSimulation: () => void;
}

export const useSimulatorStore = create<SimulatorState>()(
    immer((set, get) => ({
        components: {},
        wires: {},

        addComponent: (c) => set((state) => {
            state.components[c.id] = c;
            // Auto-run simulation when component added
            get().runSimulation();
        }),

        addWire: (w) => set((state) => {
            state.wires[w.id] = w;
        }),

        toggleSwitch: (id) => set((state) => {
            const comp = state.components[id];
            if (comp && comp.type === 'switch') {
                // Toggle visual state
                comp.state = comp.state === 'on' ? 'off' : 'on';
                // Toggle output pin value
                if (comp.outputs[0]) {
                    comp.outputs[0].value = comp.state === 'on';
                }
            }
            // Re-evaluate circuit logic immediately
            get().runSimulation();
        }),

        runSimulation: () => set((state) => {
            // Call the "Backend" logic function
            evaluateCircuit(state.components, state.wires);
        }),

        reset: () => set((state) => {
            state.components = {};
            state.wires = {};
        })
    }))
);