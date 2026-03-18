/**
 * circuitValidator.ts
 * Graph-based circuit validation for Module 1.
 * Identifies Closed Loops, Open Paths, and Short Circuits.
 */

export interface Component {
    id: string;
    type: 'battery' | 'bulb' | 'switch' | 'wire' | 'fuse';
    connections: string[]; // IDs of other components connected to this one
    state?: any; // e.g., { isOpen: true } for switch
}

export type SignalState = 'smooth' | 'dissipate' | 'accelerated' | 'bloom' | 'glow' | 'slow';
export type CircuitState = 'closed' | 'open' | 'short' | 'power-off';

export interface ValidationResult {
    state: CircuitState;
    liveWireIds: string[];
    thermalWarning: boolean; // For shorts
}

export class CircuitValidator {
    /**
     * Finds if there is a path from the positive to the negative terminal
     * of the battery through at least one load (bulb).
     */
    static validate(components: Component[]): ValidationResult {
        const battery = components.find(c => c.type === 'battery');
        if (!battery) return { state: 'power-off', liveWireIds: [], thermalWarning: false };

        const visited = new Set<string>();
        const liveWireIds: string[] = [];
        let hasLoad = false;

        const checkLoop = (currentId: string, path: string[]): boolean => {
            if (visited.has(currentId)) {
                return currentId === battery.id;
            }
            visited.add(currentId);
            
            const comp = components.find(c => c.id === currentId);
            if (!comp) return false;
            
            if (comp.type === 'bulb') hasLoad = true;
            if (comp.type === 'wire') liveWireIds.push(comp.id);
            if (comp.type === 'switch' && comp.state?.isOpen) return false;

            for (const nextId of comp.connections) {
                if (checkLoop(nextId, [...path, currentId])) return true;
            }
            return false;
        };

        const closed = checkLoop(battery.id, []);

        if (closed) {
            if (!hasLoad) return { state: 'short', liveWireIds, thermalWarning: true };
            return { state: 'closed', liveWireIds, thermalWarning: false };
        }

        return { state: 'open', liveWireIds: [], thermalWarning: false };
    }
}
