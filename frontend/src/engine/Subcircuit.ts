/**
 * engine/Subcircuit.ts
 *
 * Defines the subcircuit instantiation system.
 * Converts a set of canvas nodes and wire segments into a reusable ComponentDef.
 * A Subcircuit appears as an IC box with pins derived from input/output components.
 */

import type { CanvasNodeData, WireSegment, LogicState } from '../types/circuit';
import { ComponentDef, PortDef, EvalResult, registerComponent } from './ComponentDef';

export interface SubcircuitData {
    name: string;
    nodes: CanvasNodeData[];
    segments: WireSegment[];
}

// Registry for raw subcircuit graphs (can be used later by a flattening SimEngine)
export const subcircuitRegistry = new Map<string, SubcircuitData>();

/**
 * Parses a circuit graph and creates a new ComponentDef.
 * Inputs and Outputs of the subcircuit are derived from 'PIN' components (or INPUT/OUTPUT).
 * For now, we assume standard Button/Switch = Input, LED/Probe = Output.
 */
export function defineSubcircuit(id: string, name: string, nodes: CanvasNodeData[], segments: WireSegment[]) {
    // 1. Save raw data
    subcircuitRegistry.set(id, { name, nodes, segments });

    // 2. Identify ports (Inputs and Outputs)
    const inputNodes = nodes.filter(n => n.type === 'PUSHBUTTON' || n.type === 'SWITCH_SPST' || n.type === 'CLOCK' || n.type === 'PIN_IN' /* hypothetical */);
    const outputNodes = nodes.filter(n => n.type === 'LED' || n.type === 'SEVEN_SEG' || n.type === 'PROBE' || n.type === 'PIN_OUT');

    const ports: PortDef[] = [];

    // Distribute inputs on the left, outputs on the right
    let iY = 1;
    inputNodes.forEach((node) => {
        ports.push({
            id: `in_${node.id}`,
            direction: 'input',
            bits: node.parameters?.bits ?? 1, // assumes 1-bit pins for subcircuits currently
            x: 0,
            y: iY++,
            side: 'left',
            label: node.parameters?.label ?? node.id
        });
    });

    let oY = 1;
    outputNodes.forEach((node) => {
        ports.push({
            id: `out_${node.id}`,
            direction: 'output',
            bits: node.parameters?.bits ?? 1,
            x: 4, // Box width will be 4
            y: oY++,
            side: 'right',
            label: node.parameters?.label ?? node.id
        });
    });

    const def: ComponentDef = {
        type: id,
        tpdHL: 5,
        tpdLH: 5,
        eval: (_inputs: Record<string, LogicState>, _state: any, _params: any): EvalResult => {
            // FULL HDL/SUBCIRCUIT EVALUATION IS A COMPLEX COMPILATION STEP.
            // In a production simulator, this would either:
            // a) run a localized mini-simulation of the subcircuit NetGraph
            // b) have been flattened by the main SimEngine at compile-time.
            // 
            // For this UI implementation, we act as a pass-through or return Zs
            // if runtime flattening is not enabled.
            const out: Record<string, LogicState> = {};
            outputNodes.forEach(node => {
                out[`out_${node.id}`] = 0; // default '0' for stub
            });
            return { outputs: out, state: {} };
        }
    };

    registerComponent(def);
}
