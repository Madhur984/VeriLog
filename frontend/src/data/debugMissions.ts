/**
 * debugMissions.ts — Debug mission definitions
 *
 * Each mission describes a broken circuit and the expected fix.
 */

import { NodeType } from '../mure/core/SignalNode';

export interface DebugMission {
    id: string;
    title: string;
    difficulty: 'easy' | 'medium' | 'hard';
    description: string;
    symptom: string;
    hint: string;
    solution: string;
    // Circuit setup: nodes to place
    nodes: { type: NodeType; params?: Record<string, unknown>; label: string }[];
    // Which connections exist (some may be broken/missing)
    connections: { from: number; fromPort: number; to: number; toPort: number }[];
    // The broken aspect: missing connection, wrong param, etc.
    brokenAspect: {
        type: 'missing_connection' | 'wrong_param' | 'wrong_node';
        detail: string;
    };
}

export const DEBUG_MISSIONS: DebugMission[] = [
    {
        id: 'dead-led',
        title: 'Dead LED',
        difficulty: 'easy',
        description: 'A battery is connected to an LED, but it won\'t turn on. Find and fix the broken connection.',
        symptom: 'LED shows no light. The circuit appears complete but one wire is disconnected.',
        hint: 'Check all connections between the battery and the LED. Is the return path complete?',
        solution: 'Connect the LED output back to the battery ground to close the circuit.',
        nodes: [
            { type: NodeType.BATTERY, params: { voltage: 5 }, label: 'Battery' },
            { type: NodeType.LED, label: 'LED' },
        ],
        connections: [
            { from: 0, fromPort: 0, to: 1, toPort: 0 }, // Battery → LED (exists)
            // Missing: LED → Battery return path
        ],
        brokenAspect: {
            type: 'missing_connection',
            detail: 'The return path from LED back to battery ground is missing.',
        },
    },
    {
        id: 'stuck-gate',
        title: 'Stuck Gate',
        difficulty: 'medium',
        description: 'An AND gate should output HIGH when both inputs are HIGH, but it\'s always outputting LOW.',
        symptom: 'AND gate output stays LOW regardless of inputs.',
        hint: 'Check what\'s connected to the AND gate inputs. Are both inputs receiving the correct signals?',
        solution: 'One input is connected to a Constant LOW — change it to Constant HIGH.',
        nodes: [
            { type: NodeType.CONSTANT, params: { value: true }, label: 'Input A (HIGH)' },
            { type: NodeType.CONSTANT, params: { value: false }, label: 'Input B (LOW — bug!)' },
            { type: NodeType.AND, label: 'AND Gate' },
            { type: NodeType.LED, label: 'Output LED' },
        ],
        connections: [
            { from: 0, fromPort: 0, to: 2, toPort: 0 },
            { from: 1, fromPort: 0, to: 2, toPort: 1 },
            { from: 2, fromPort: 0, to: 3, toPort: 0 },
        ],
        brokenAspect: {
            type: 'wrong_param',
            detail: 'Input B is set to FALSE (LOW) instead of TRUE (HIGH).',
        },
    },
    {
        id: 'clock-drift',
        title: 'Clock Drift',
        difficulty: 'hard',
        description: 'A clock signal is supposed to produce a 1MHz square wave but the timing is way off.',
        symptom: 'The clock frequency is 100× slower than expected, causing downstream logic to malfunction.',
        hint: 'Check the clock period parameter. What value would produce 1MHz?',
        solution: 'Change the clock period from 100,000ns to 1,000ns (1μs = 1MHz).',
        nodes: [
            { type: NodeType.CLOCK, params: { periodNs: 100_000 }, label: 'Clock (100KHz — bug!)' },
            { type: NodeType.NOT, label: 'Inverter' },
            { type: NodeType.LED, label: 'Output' },
        ],
        connections: [
            { from: 0, fromPort: 0, to: 1, toPort: 0 },
            { from: 1, fromPort: 0, to: 2, toPort: 0 },
        ],
        brokenAspect: {
            type: 'wrong_param',
            detail: 'Clock period is 100,000ns (100KHz) instead of 1,000ns (1MHz).',
        },
    },
];
