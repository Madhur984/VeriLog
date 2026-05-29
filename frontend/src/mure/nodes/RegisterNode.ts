/**
 * mure/nodes/RegisterNode.ts - N-bit Register
 *
 * Stores N bits on clock edge. Has clock, load, and reset inputs.
 * Inputs: [data0..dataN-1, clock, load, reset]
 * Outputs: [Q0..QN-1]
 */

import type { SignalNode } from '../core/SignalNode';
import { createSignalNode, NodeType } from '../core/SignalNode';
import { DriveStrength } from '../core/Port';

function evaluateRegister(node: SignalNode): void {
    const bits = (node.params.bits as number) ?? 8;
    const clockIdx = bits;
    const loadIdx = bits + 1;
    const resetIdx = bits + 2;

    const clk = node.inputs[clockIdx]?.logic ?? false;
    const load = node.inputs[loadIdx]?.logic ?? true; // default: always load
    const reset = node.inputs[resetIdx]?.logic ?? false;
    const prevClk = (node.internalState.prevClk as boolean) ?? false;
    const edge = (node.params.clockEdge as string) ?? 'rising';

    const triggered = edge === 'rising'
        ? (clk && !prevClk)
        : (!clk && prevClk);

    node.internalState.prevClk = clk;

    if (reset) {
        // Reset all outputs to 0
        for (let i = 0; i < bits; i++) {
            node.outputs[i].voltage = 0;
            node.outputs[i].logic = false;
            node.outputs[i].drive = DriveStrength.STRONG;
            node.outputs[i].connected = true;
            node.internalState[`bit_${i}`] = false;
        }
        return;
    }

    if (triggered && load) {
        // Load data inputs into register
        for (let i = 0; i < bits; i++) {
            const val = node.inputs[i]?.logic ?? false;
            node.internalState[`bit_${i}`] = val;
        }
    }

    // Output stored values
    for (let i = 0; i < bits; i++) {
        const stored = (node.internalState[`bit_${i}`] as boolean) ?? false;
        node.outputs[i].voltage = stored ? 5.0 : 0;
        node.outputs[i].logic = stored;
        node.outputs[i].drive = DriveStrength.STRONG;
        node.outputs[i].connected = true;
    }
}

export function createRegisterNode(id: string, bits = 8): SignalNode {
    const inputCount = bits + 3; // data + clock + load + reset
    return createSignalNode(id, NodeType.REGISTER, inputCount, bits, { bits, clockEdge: 'rising' }, evaluateRegister);
}
