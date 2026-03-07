/**
 * mure/nodes/SevenSegmentNode.ts — 7-Segment Display
 *
 * 4-bit BCD input → 7 segment outputs (a-g).
 * Maps binary-coded decimal values 0-15 to segment patterns.
 */

import type { SignalNode } from '../core/SignalNode';
import { createSignalNode, NodeType } from '../core/SignalNode';
import { DriveStrength } from '../core/Port';

// Segment encoding: [a, b, c, d, e, f, g] for digits 0-F
//   ─a─
//  |   |
//  f   b
//  |   |
//   ─g─
//  |   |
//  e   c
//  |   |
//   ─d─
const SEGMENT_MAP: boolean[][] = [
    // a     b     c     d     e     f     g
    [true, true, true, true, true, true, false], // 0
    [false, true, true, false, false, false, false], // 1
    [true, true, false, true, true, false, true],  // 2
    [true, true, true, true, false, false, true],  // 3
    [false, true, true, false, false, true, true],  // 4
    [true, false, true, true, false, true, true],  // 5
    [true, false, true, true, true, true, true],  // 6
    [true, true, true, false, false, false, false], // 7
    [true, true, true, true, true, true, true],  // 8
    [true, true, true, true, false, true, true],  // 9
    [true, true, true, false, true, true, true],  // A
    [false, false, true, true, true, true, true],  // b
    [true, false, false, true, true, true, false], // C
    [false, true, true, true, true, false, true],  // d
    [true, false, false, true, true, true, true],  // E
    [true, false, false, false, true, true, true],  // F
];

function evaluateSevenSegment(node: SignalNode): void {
    // 4-bit BCD input
    let value = 0;
    for (let i = 0; i < 4; i++) {
        if (node.inputs[i]?.logic) value |= (1 << i);
    }

    const segments = SEGMENT_MAP[value & 0xF] ?? SEGMENT_MAP[0];

    for (let i = 0; i < 7; i++) {
        node.outputs[i].voltage = segments[i] ? 5.0 : 0;
        node.outputs[i].logic = segments[i];
        node.outputs[i].drive = DriveStrength.STRONG;
        node.outputs[i].connected = true;
    }
}

export function createSevenSegmentNode(id: string): SignalNode {
    return createSignalNode(id, NodeType.SEVEN_SEGMENT, 4, 7, {}, evaluateSevenSegment);
}
