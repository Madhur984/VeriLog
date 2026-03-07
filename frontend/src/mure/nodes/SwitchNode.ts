/**
 * mure/nodes/SwitchNode.ts — Toggle Switch
 *
 * ON: passes input to output.
 * OFF: outputs 0V / LOW.
 */

import type { SignalNode } from '../core/SignalNode';
import { createSignalNode, NodeType } from '../core/SignalNode';
import { DriveStrength } from '../core/Port';

function evaluateSwitch(node: SignalNode): void {
    const isOn = node.params.isOn ?? false;
    const inp = node.inputs[0];

    if (isOn) {
        node.outputs[0].voltage = inp.voltage;
        node.outputs[0].logic = inp.logic;
        node.outputs[0].drive = inp.drive;
        node.outputs[0].connected = inp.connected;
    } else {
        node.outputs[0].voltage = 0;
        node.outputs[0].logic = false;
        node.outputs[0].drive = DriveStrength.HIGH_Z;
        node.outputs[0].connected = false;
    }
}

export function createSwitchNode(id: string, isOn = false): SignalNode {
    return createSignalNode(id, NodeType.SWITCH, 1, 1, { isOn }, evaluateSwitch);
}

export function toggleSwitch(node: SignalNode): void {
    node.params.isOn = !node.params.isOn;
    node.dirty = true;
}
