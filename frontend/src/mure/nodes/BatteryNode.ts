/**
 * mure/nodes/BatteryNode.ts — Voltage Source
 *
 * Outputs a fixed voltage. Always drives its output.
 * No inputs — battery is a source node.
 */

import type { SignalNode } from '../core/SignalNode';
import { createSignalNode, NodeType } from '../core/SignalNode';
import { DriveStrength } from '../core/Port';

function evaluateBattery(node: SignalNode): void {
    const voltage = (node.params.voltage as number) ?? 9;
    node.outputs[0].voltage = voltage;
    node.outputs[0].logic = voltage > 0;
    node.outputs[0].drive = DriveStrength.STRONG;
    node.outputs[0].connected = true;
}

export function createBatteryNode(id: string, voltage = 9): SignalNode {
    const node = createSignalNode(id, NodeType.BATTERY, 1, 1, { voltage }, evaluateBattery);
    // Initialize output immediately
    node.outputs[0].voltage = voltage;
    node.outputs[0].logic = voltage > 0;
    node.outputs[0].drive = DriveStrength.STRONG;
    node.outputs[0].connected = true;
    return node;
}
