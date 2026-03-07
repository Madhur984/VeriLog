/**
 * mure/nodes/ResistorNode.ts — Resistor
 *
 * Simple voltage divider model.
 * Passes signal with reduced voltage proportional to resistance ratio.
 */

import type { SignalNode } from '../core/SignalNode';
import { createSignalNode, NodeType } from '../core/SignalNode';
import { DriveStrength } from '../core/Port';

const DEFAULT_RESISTANCE = 1000; // 1kΩ

function evaluateResistor(node: SignalNode): void {
    const inp = node.inputs[0];
    const resistance = (node.params.resistance as number) ?? DEFAULT_RESISTANCE;

    // Simplified model: small voltage drop proportional to current
    // For a more accurate model, we'd need the full circuit context (MNA)
    const current = inp.voltage / (resistance + 1); // avoid div by zero
    const vDrop = current * resistance;
    const vOut = Math.max(0, inp.voltage - vDrop * 0.1); // 10% drop approximation

    node.outputs[0].voltage = vOut;
    node.outputs[0].logic = vOut > 2.5;
    node.outputs[0].drive = inp.connected ? DriveStrength.STRONG : DriveStrength.HIGH_Z;
    node.outputs[0].connected = inp.connected;

    node.internalState.current = current;
    node.internalState.voltageDrop = vDrop;
}

export function createResistorNode(id: string, resistance = DEFAULT_RESISTANCE): SignalNode {
    return createSignalNode(id, NodeType.RESISTOR, 1, 1, { resistance }, evaluateResistor);
}
