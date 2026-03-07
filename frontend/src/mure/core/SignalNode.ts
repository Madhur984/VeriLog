/**
 * mure/core/SignalNode.ts — Node Model for Circuit Graph
 *
 * Each node represents a circuit component: battery, resistor, LED, gate, etc.
 * Nodes own input/output ports and implement evaluate() for simulation.
 */

import type { PortState } from './Port';
import { createPort } from './Port';

export type NodeId = string;

export enum NodeType {
    BATTERY = 'BATTERY',
    WIRE = 'WIRE',
    LED = 'LED',
    SWITCH = 'SWITCH',
    RESISTOR = 'RESISTOR',
    CLOCK = 'CLOCK',
    CONSTANT = 'CONSTANT',
    // Logic gates
    AND = 'AND',
    OR = 'OR',
    NOT = 'NOT',
    NAND = 'NAND',
    NOR = 'NOR',
    XOR = 'XOR',
    XNOR = 'XNOR',
    // Advanced components
    MUX = 'MUX',
    DECODER = 'DECODER',
    ENCODER = 'ENCODER',
    REGISTER = 'REGISTER',
    MEMORY = 'MEMORY',
    SEVEN_SEGMENT = 'SEVEN_SEGMENT',
    // Future-proof
    FLIP_FLOP = 'FLIP_FLOP',
    FSM = 'FSM',
    VERILOG_MODULE = 'VERILOG_MODULE',
}

export interface NodeParams {
    voltage?: number;
    resistance?: number;
    vForward?: number;
    frequency?: number;
    bits?: number;
    addressBits?: number;
    dataBits?: number;
    inputCount?: number;
    gateType?: string;
    isOn?: boolean;
    constantValue?: boolean;
    clockEdge?: 'rising' | 'falling';
    [key: string]: unknown;
}

export interface SignalNode {
    id: NodeId;
    type: NodeType;
    inputs: PortState[];
    outputs: PortState[];
    params: NodeParams;
    internalState: Record<string, unknown>;
    dirty: boolean;
    evaluate: (node: SignalNode) => void;
}

export function createSignalNode(
    id: NodeId,
    type: NodeType,
    inputCount: number,
    outputCount: number,
    params: NodeParams = {},
    evaluateFn: (node: SignalNode) => void = () => { },
): SignalNode {
    return {
        id,
        type,
        inputs: Array.from({ length: inputCount }, () => createPort()),
        outputs: Array.from({ length: outputCount }, () => createPort()),
        params,
        internalState: {},
        dirty: true,
        evaluate: evaluateFn,
    };
}
