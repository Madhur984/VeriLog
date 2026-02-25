import { create } from 'zustand';
import { ComponentInstance } from '../simulator/types';

interface SimulatorState {
    components: ComponentInstance[];

    // Actions
    addComponent: (c: ComponentInstance) => void;
    removeComponent: (id: string) => void;
    toggleSwitch: (id: string) => void;
    reset: () => void;
}

export const useSimulatorStore = create<SimulatorState>()((set) => ({
    components: [],

    addComponent: (c) => set((state) => ({
        components: [...state.components.filter(comp => comp.id !== c.id), c]
    })),

    removeComponent: (id) => set((state) => ({
        components: state.components.filter(c => c.id !== id)
    })),

    toggleSwitch: (id) => set((state) => ({
        components: state.components.map(c =>
            c.id === id && c.type === 'switch'
                ? { ...c, isOpen: !c.isOpen }
                : c
        )
    })),

    reset: () => set({ components: [] })
}));