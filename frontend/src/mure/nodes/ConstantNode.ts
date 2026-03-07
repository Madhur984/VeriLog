/**
 * mure/nodes/ConstantNode.ts — Constant Logic Level
 *
 * Outputs a fixed logic level: 0 (0V) or 1 (5V).
 */

import type { SignalNode } from '../core/SignalNode';
import { createSignalNode, NodeType } from '../core/SignalNode';
import { DriveStrength } from '../core/Port';

function evaluateConstant(node: SignalNode): void {
    const val = node.params.constantValue ?? false;
    node.outputs[0].voltage = val ? 5.0 : 0;
    node.outputs[0].logic = !!val;
    node.outputs[0].drive = DriveStrength.STRONG;
    node.outputs[0].connected = true;
}

export function createConstantNode(id: string, value: boolean = false): SignalNode {
    const node = createSignalNode(id, NodeType.CONSTANT, 0, 1, { constantValue: value }, evaluateConstant);
    node.outputs[0].voltage = value ? 5.0 : 0;
    node.outputs[0].logic = value;
    node.outputs[0].drive = DriveStrength.STRONG;
    node.outputs[0].connected = true;
    return node;
}
