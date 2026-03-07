/**
 * mure/nodes/MuxNode.ts — Multiplexer
 *
 * N data inputs + S select lines → 1 output.
 * Select lines determine which data input is routed to output.
 * Default: 4:1 MUX (4 data inputs, 2 select lines).
 */

import type { SignalNode } from '../core/SignalNode';
import { createSignalNode, NodeType } from '../core/SignalNode';
import { DriveStrength } from '../core/Port';

function evaluateMux(node: SignalNode): void {
    const bits = (node.params.bits as number) ?? 2; // select bits
    const dataCount = 1 << bits;

    // Inputs layout: [data0, data1, ..., dataN-1, sel0, sel1, ..., selS-1]
    const selectValue = computeSelect(node, dataCount, bits);

    if (selectValue >= 0 && selectValue < dataCount) {
        const selected = node.inputs[selectValue];
        node.outputs[0].voltage = selected.voltage;
        node.outputs[0].logic = selected.logic;
        node.outputs[0].drive = DriveStrength.STRONG;
        node.outputs[0].connected = true;
    } else {
        node.outputs[0].voltage = 0;
        node.outputs[0].logic = false;
        node.outputs[0].drive = DriveStrength.HIGH_Z;
        node.outputs[0].connected = false;
    }
}

function computeSelect(node: SignalNode, dataCount: number, bits: number): number {
    let selectValue = 0;
    for (let i = 0; i < bits; i++) {
        if (node.inputs[dataCount + i]?.logic) {
            selectValue |= (1 << i);
        }
    }
    return selectValue;
}

export function createMuxNode(id: string, selectBits = 2): SignalNode {
    const dataCount = 1 << selectBits;
    const totalInputs = dataCount + selectBits; // data + select lines
    return createSignalNode(id, NodeType.MUX, totalInputs, 1, { bits: selectBits }, evaluateMux);
}
