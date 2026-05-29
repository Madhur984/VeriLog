/**
 * mure/nodes/DecoderNode.ts - N-to-2^N Decoder
 *
 * N input lines → 2^N output lines.
 * Exactly one output is HIGH based on the binary input value.
 * Optional enable line.
 */

import type { SignalNode } from '../core/SignalNode';
import { createSignalNode, NodeType } from '../core/SignalNode';
import { DriveStrength } from '../core/Port';

function evaluateDecoder(node: SignalNode): void {
    const bits = (node.params.bits as number) ?? 2;
    const outputCount = 1 << bits;
    const hasEnable = node.inputs.length > bits;

    // Check enable (last input if present)
    if (hasEnable && !node.inputs[bits].logic) {
        // Disabled: all outputs LOW
        for (let i = 0; i < outputCount; i++) {
            node.outputs[i].voltage = 0;
            node.outputs[i].logic = false;
            node.outputs[i].drive = DriveStrength.STRONG;
            node.outputs[i].connected = true;
        }
        return;
    }

    // Compute binary value from inputs
    let value = 0;
    for (let i = 0; i < bits; i++) {
        if (node.inputs[i]?.logic) {
            value |= (1 << i);
        }
    }

    // Set outputs: only one HIGH
    for (let i = 0; i < outputCount; i++) {
        const isActive = i === value;
        node.outputs[i].voltage = isActive ? 5.0 : 0;
        node.outputs[i].logic = isActive;
        node.outputs[i].drive = DriveStrength.STRONG;
        node.outputs[i].connected = true;
    }
}

export function createDecoderNode(id: string, bits = 2, withEnable = true): SignalNode {
    const inputCount = bits + (withEnable ? 1 : 0);
    const outputCount = 1 << bits;
    return createSignalNode(id, NodeType.DECODER, inputCount, outputCount, { bits }, evaluateDecoder);
}
