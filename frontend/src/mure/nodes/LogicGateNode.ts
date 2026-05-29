/**
 * mure/nodes/LogicGateNode.ts - Unified Logic Gate Node
 *
 * Supports: AND, OR, NOT, NAND, NOR, XOR, XNOR
 * Parameterized by gate type and input count.
 *
 * Propagation delay model (CMOS 180nm typical):
 *   tpdHL = transition time high → low (ns)
 *   tpdLH = transition time low → high (ns)
 */

import type { SignalNode, NodeParams } from '../core/SignalNode';
import { createSignalNode, NodeType } from '../core/SignalNode';
import { DriveStrength } from '../core/Port';

export type GateFunction = 'AND' | 'OR' | 'NOT' | 'NAND' | 'NOR' | 'XOR' | 'XNOR';

interface GateSpec {
    evaluate: (inputs: boolean[]) => boolean;
    tpdHL: number;
    tpdLH: number;
    description: string;
}

const GATE_SPECS: Record<GateFunction, GateSpec> = {
    AND: {
        evaluate: (ins) => ins.length > 0 && ins.every(Boolean),
        tpdHL: 1.8, tpdLH: 2.1,
        description: 'Output HIGH only when ALL inputs are HIGH.',
    },
    OR: {
        evaluate: (ins) => ins.some(Boolean),
        tpdHL: 2.0, tpdLH: 1.9,
        description: 'Output HIGH when ANY input is HIGH.',
    },
    NOT: {
        evaluate: ([a]) => !a,
        tpdHL: 0.9, tpdLH: 0.8,
        description: 'Inverts the single input.',
    },
    NAND: {
        evaluate: (ins) => !(ins.length > 0 && ins.every(Boolean)),
        tpdHL: 0.9, tpdLH: 1.5,
        description: 'NOT-AND: output LOW only when ALL inputs are HIGH.',
    },
    NOR: {
        evaluate: (ins) => !ins.some(Boolean),
        tpdHL: 1.0, tpdLH: 1.8,
        description: 'NOT-OR: output HIGH only when ALL inputs are LOW.',
    },
    XOR: {
        evaluate: (ins) => ins.reduce((acc, v) => acc !== v, false),
        tpdHL: 2.5, tpdLH: 2.7,
        description: 'Output HIGH when an ODD number of inputs are HIGH.',
    },
    XNOR: {
        evaluate: (ins) => !ins.reduce((acc, v) => acc !== v, false),
        tpdHL: 2.6, tpdLH: 2.8,
        description: 'Output HIGH when an EVEN number of inputs are HIGH.',
    },
};

function evaluateGate(node: SignalNode): void {
    const gateType = node.params.gateType as GateFunction;
    const spec = GATE_SPECS[gateType];
    if (!spec) return;

    const inputLogics = node.inputs.map(p => p.logic);
    const result = spec.evaluate(inputLogics);

    node.outputs[0].voltage = result ? 5.0 : 0;
    node.outputs[0].logic = result;
    node.outputs[0].drive = DriveStrength.STRONG;
    node.outputs[0].connected = true;
}

export function createLogicGateNode(
    id: string,
    gateType: GateFunction,
    inputCount = 2,
): SignalNode {
    const params: NodeParams = {
        gateType,
        inputCount,
    };

    // NOT gate always has 1 input
    const actualInputCount = gateType === 'NOT' ? 1 : inputCount;

    return createSignalNode(id, NodeType[gateType] ?? NodeType.AND, actualInputCount, 1, params, evaluateGate);
}

/** Get the GATE_SPECS for generating truth tables externally */
export function getGateSpec(gateType: GateFunction): GateSpec | undefined {
    return GATE_SPECS[gateType];
}

/** Generate truth table for a gate */
export function generateTruthTable(gateType: GateFunction, inputCount: number): { inputs: boolean[]; output: boolean }[] {
    const spec = GATE_SPECS[gateType];
    if (!spec) return [];

    const n = gateType === 'NOT' ? 1 : inputCount;
    const rows: { inputs: boolean[]; output: boolean }[] = [];

    for (let i = 0; i < (1 << n); i++) {
        const inputs = Array.from({ length: n }, (_, bit) => Boolean((i >> (n - 1 - bit)) & 1));
        rows.push({ inputs, output: spec.evaluate(inputs) });
    }

    return rows;
}
