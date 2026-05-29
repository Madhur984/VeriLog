/**
 * mure/nodes/WireNode.ts - Wire (Pass-through)
 *
 * Passes signal from input to output unchanged.
 * Single input → single output.
 */

import type { SignalNode } from '../core/SignalNode';
import { createSignalNode, NodeType } from '../core/SignalNode';

function evaluateWire(node: SignalNode): void {
    const inp = node.inputs[0];
    node.outputs[0].voltage = inp.voltage;
    node.outputs[0].logic = inp.logic;
    node.outputs[0].drive = inp.drive;
    node.outputs[0].connected = inp.connected;
}

export function createWireNode(id: string): SignalNode {
    return createSignalNode(id, NodeType.WIRE, 1, 1, {}, evaluateWire);
}
