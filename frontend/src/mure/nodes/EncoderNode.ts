/**
 * mure/nodes/EncoderNode.ts - Priority Encoder
 *
 * 2^N inputs → N-bit output.
 * Outputs binary code of the highest-priority active input.
 * Priority: higher index = higher priority.
 */

import type { SignalNode } from '../core/SignalNode';
import { createSignalNode, NodeType } from '../core/SignalNode';
import { DriveStrength } from '../core/Port';

function evaluateEncoder(node: SignalNode): void {
    const bits = (node.params.bits as number) ?? 2;
    const inputCount = 1 << bits;

    // Find highest-priority active input (scan from high to low)
    let activeIndex = -1;
    for (let i = inputCount - 1; i >= 0; i--) {
        if (node.inputs[i]?.logic) {
            activeIndex = i;
            break;
        }
    }

    // Valid output flag (last output)
    const validOutput = node.outputs[bits];
    if (validOutput) {
        validOutput.voltage = activeIndex >= 0 ? 5.0 : 0;
        validOutput.logic = activeIndex >= 0;
        validOutput.drive = DriveStrength.STRONG;
        validOutput.connected = true;
    }

    // Encode to binary on output bits
    for (let i = 0; i < bits; i++) {
        const bitValue = activeIndex >= 0 ? Boolean((activeIndex >> i) & 1) : false;
        node.outputs[i].voltage = bitValue ? 5.0 : 0;
        node.outputs[i].logic = bitValue;
        node.outputs[i].drive = DriveStrength.STRONG;
        node.outputs[i].connected = true;
    }
}

export function createEncoderNode(id: string, bits = 2): SignalNode {
    const inputCount = 1 << bits;
    const outputCount = bits + 1; // N bits + valid flag
    return createSignalNode(id, NodeType.ENCODER, inputCount, outputCount, { bits }, evaluateEncoder);
}
