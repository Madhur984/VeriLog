/**
 * mure/nodes/LEDNode.ts — Light-Emitting Diode
 *
 * Threshold model: voltage > vForward → ON.
 * Brightness = proportional to current above threshold.
 * Output[0] = pass-through (for series circuits).
 */

import type { SignalNode } from '../core/SignalNode';
import { createSignalNode, NodeType } from '../core/SignalNode';
import { DriveStrength } from '../core/Port';

const DEFAULT_V_FORWARD = 2.0;
const I_MAX = 0.020; // 20mA full brightness

function evaluateLED(node: SignalNode): void {
    const inp = node.inputs[0];
    const vForward = (node.params.vForward as number) ?? DEFAULT_V_FORWARD;
    const voltage = inp.voltage;

    const isOn = voltage >= vForward;
    const current = isOn ? Math.max(0, (voltage - vForward) / 50) : 0; // assume 50Ω dynamic R
    const brightness = Math.min(1, current / I_MAX);

    node.internalState.isOn = isOn;
    node.internalState.brightness = brightness;

    // Pass-through with voltage drop
    node.outputs[0].voltage = isOn ? voltage - vForward : 0;
    node.outputs[0].logic = isOn;
    node.outputs[0].drive = isOn ? DriveStrength.STRONG : DriveStrength.HIGH_Z;
    node.outputs[0].connected = inp.connected;
}

export function createLEDNode(id: string, vForward = DEFAULT_V_FORWARD): SignalNode {
    return createSignalNode(id, NodeType.LED, 1, 1, { vForward }, evaluateLED);
}
