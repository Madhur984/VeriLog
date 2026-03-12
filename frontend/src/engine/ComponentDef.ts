import { LogicState } from '../types/circuit';
import { LogicValue } from './LogicValue';

export interface PortDef {
    id: string; // Internal unique ID
    direction: 'input' | 'output' | 'inout';
    bits: number; // Bus width for Logisim compatibility
    x: number; // Grid X relative to component center (0,0)
    y: number; // Grid Y relative to center
    side: 'top' | 'right' | 'bottom' | 'left';
    label: string;
}

export interface ComponentShape {
    w: number;
    h: number;
    symbol: string;
    color: string;
    style: 'rect' | 'custom' | 'and' | 'or' | 'not' | 'triangle' | string;
    extras?: string;
}

export interface EvalContext {
    inputs: Record<string, LogicValue[]>;
    params: Record<string, any>;
    state: any;
}

export interface EvalResult {
    /** Output port states */
    outputs: Record<string, any>;
    /** Modified internal memory for stateful devices */
    state?: any;
    /** Output propagation delays in nanoseconds. Defaults to ComponentDef values if omitted. */
    customDelayNs?: Record<string, number>;
}

export interface ComponentDef {
    /** Type id (e.g. 'AND_GATE') */
    type: string;
    
    label?: string;
    category?: string;
    defaultParams?: Record<string, any>;
    params?: any[];
    ports?: (params: Record<string, any>) => PortDef[];
    shape?: (params: Record<string, any>) => ComponentShape;
    initState?: () => any;

    /** High-to-Low propagation delay in ns */
    tpdHL?: number;
    /** Low-to-High propagation delay in ns */
    tpdLH?: number;

    /** 
     * Core functional evaluation. Must be deterministic.
     */
    eval?: (inputs: Record<string, LogicState>, state: any, params: any) => EvalResult;
    
    /** Context-based evaluate (for UI components) */
    evaluate?: (ctx: EvalContext) => EvalResult;
}

/**
 * Global registry of all available simulation primitives
 */
export const ComponentTable: Record<string, ComponentDef> = {};

export function registerComponent(def: ComponentDef) {
    ComponentTable[def.type] = def;
}

export function getComponentDef(type: string): ComponentDef | undefined {
    return ComponentTable[type];
}

export function getComponentsByCategory(): Map<string, ComponentDef[]> {
    const map = new Map<string, ComponentDef[]>();
    for (const def of Object.values(ComponentTable)) {
        const cat = def.category || 'Uncategorized';
        if (!map.has(cat)) map.set(cat, []);
        map.get(cat)!.push(def);
    }
    return map;
}

// --- Base Implementations ---

ComponentTable['AND'] = {
    type: 'AND',
    tpdHL: 5, tpdLH: 5,
    eval: (inputs) => {
        // Multi-input AND
        let output: LogicState = 1;
        for (const port in inputs) {
            output = LogicValue.and(output, inputs[port]);
            if (output === 0) break; // Optimization
        }
        return { outputs: { out: output } };
    }
};

ComponentTable['OR'] = {
    type: 'OR',
    tpdHL: 5, tpdLH: 5,
    eval: (inputs) => {
        let output: LogicState = 0;
        for (const port in inputs) {
            output = LogicValue.or(output, inputs[port]);
            if (output === 1) break; 
        }
        return { outputs: { out: output } };
    }
};

ComponentTable['NOT'] = {
    type: 'NOT',
    tpdHL: 3, tpdLH: 3,
    eval: (inputs) => {
        return { outputs: { out: LogicValue.not(inputs['in']) } };
    }
};

ComponentTable['SWITCH'] = {
    type: 'SWITCH',
    tpdHL: 1, tpdLH: 1, // Almost instantaneous physical switch
    eval: (_inputs, _state, params) => {
        // The switch state is controlled EXTERNALLY via UI interaction (params.on)
        return { outputs: { out: params.on ? 1 : 0 } };
    }
};

ComponentTable['CLOCK'] = {
    type: 'CLOCK',
    tpdHL: 1, tpdLH: 1,
    eval: (_inputs, _state, _params) => {
        // Clocks must schedule themselves recursively inside SimEngine
        // For now, it just emits its internally tracked state
        const current = _state?.val ?? 0;
        return { outputs: { out: current } };
    }
};

ComponentTable['PROBE'] = {
    type: 'PROBE',
    tpdHL: 0, tpdLH: 0,
    eval: (_inputs) => {
        // Probes have no outputs, they just sit there visually
        return { outputs: {} };
    }
};
