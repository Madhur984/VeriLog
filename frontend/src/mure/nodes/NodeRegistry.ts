/**
 * mure/nodes/NodeRegistry.ts - Node Factory Registry
 *
 * Central lookup for creating nodes by type.
 * Single point of access for the MUREEngine facade.
 */

import type { SignalNode, NodeParams } from '../core/SignalNode';
import { NodeType } from '../core/SignalNode';
import { createBatteryNode } from './BatteryNode';
import { createWireNode } from './WireNode';
import { createLEDNode } from './LEDNode';
import { createSwitchNode } from './SwitchNode';
import { createResistorNode } from './ResistorNode';
import { createClockNode } from './ClockNode';
import { createConstantNode } from './ConstantNode';
import { createLogicGateNode } from './LogicGateNode';
import type { GateFunction } from './LogicGateNode';
import { createMuxNode } from './MuxNode';
import { createDecoderNode } from './DecoderNode';
import { createEncoderNode } from './EncoderNode';
import { createRegisterNode } from './RegisterNode';
import { createMemoryNode } from './MemoryNode';
import { createSevenSegmentNode } from './SevenSegmentNode';

let nodeIdCounter = 0;

function nextId(prefix: string): string {
    return `${prefix}_${++nodeIdCounter}`;
}

export function resetNodeIdCounter(): void {
    nodeIdCounter = 0;
}

export type CreateNodeType = NodeType | string;

export function createNodeByType(type: CreateNodeType, params: NodeParams = {}): SignalNode {
    const id = params.id as string ?? nextId(type.toLowerCase());

    switch (type) {
        case NodeType.BATTERY:
            return createBatteryNode(id, params.voltage as number);
        case NodeType.WIRE:
            return createWireNode(id);
        case NodeType.LED:
            return createLEDNode(id, params.vForward as number);
        case NodeType.SWITCH:
            return createSwitchNode(id, params.isOn as boolean);
        case NodeType.RESISTOR:
            return createResistorNode(id, params.resistance as number);
        case NodeType.CLOCK:
            return createClockNode(id, params.frequency as number);
        case NodeType.CONSTANT:
            return createConstantNode(id, params.constantValue as boolean);
        // Logic gates
        case NodeType.AND:
        case NodeType.OR:
        case NodeType.NOT:
        case NodeType.NAND:
        case NodeType.NOR:
        case NodeType.XOR:
        case NodeType.XNOR:
            return createLogicGateNode(id, type as GateFunction, params.inputCount as number);
        // Advanced components
        case NodeType.MUX:
            return createMuxNode(id, params.bits as number);
        case NodeType.DECODER:
            return createDecoderNode(id, params.bits as number);
        case NodeType.ENCODER:
            return createEncoderNode(id, params.bits as number);
        case NodeType.REGISTER:
            return createRegisterNode(id, params.bits as number);
        case NodeType.MEMORY:
            return createMemoryNode(id, params.addressBits as number, params.dataBits as number);
        case NodeType.SEVEN_SEGMENT:
            return createSevenSegmentNode(id);
        default:
            throw new Error(`[MURE] Unknown node type: ${type}`);
    }
}
