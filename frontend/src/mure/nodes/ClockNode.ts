/**
 * mure/nodes/ClockNode.ts — Clock Signal Generator
 *
 * Generates square wave at configurable frequency.
 * Output alternates between HIGH (5V) and LOW (0V).
 */

import type { SignalNode } from '../core/SignalNode';
import { createSignalNode, NodeType } from '../core/SignalNode';
import { DriveStrength } from '../core/Port';

const DEFAULT_FREQUENCY_HZ = 1000; // 1kHz

function evaluateClock(node: SignalNode): void {
    // Clock state is toggled externally by the kernel or controller
    const isHigh = node.internalState.isHigh as boolean ?? false;
    const vHigh = 5.0;

    node.outputs[0].voltage = isHigh ? vHigh : 0;
    node.outputs[0].logic = isHigh;
    node.outputs[0].drive = DriveStrength.STRONG;
    node.outputs[0].connected = true;
}

export function createClockNode(id: string, frequencyHz = DEFAULT_FREQUENCY_HZ): SignalNode {
    const node = createSignalNode(id, NodeType.CLOCK, 0, 1, { frequency: frequencyHz }, evaluateClock);
    node.internalState.isHigh = false;
    node.internalState.lastToggleNs = 0;
    return node;
}

/**
 * Toggle clock state. Call this at the appropriate frequency
 * from the simulation controller.
 */
export function tickClock(node: SignalNode, currentTimeNs: number): boolean {
    const freq = (node.params.frequency as number) ?? DEFAULT_FREQUENCY_HZ;
    const halfPeriodNs = (1_000_000_000 / freq) / 2;
    const lastToggle = (node.internalState.lastToggleNs as number) ?? 0;

    if (currentTimeNs - lastToggle >= halfPeriodNs) {
        node.internalState.isHigh = !node.internalState.isHigh;
        node.internalState.lastToggleNs = currentTimeNs;
        node.dirty = true;
        return true; // toggled
    }
    return false;
}
