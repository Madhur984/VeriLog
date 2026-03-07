/**
 * mure/nodes/MemoryNode.ts — Simple RAM Model
 *
 * Address bus + data bus + read/write control.
 * Inputs: [addr0..addrN-1, dataIn0..dataInM-1, writeEnable, clock]
 * Outputs: [dataOut0..dataOutM-1]
 */

import type { SignalNode } from '../core/SignalNode';
import { createSignalNode, NodeType } from '../core/SignalNode';
import { DriveStrength } from '../core/Port';

function evaluateMemory(node: SignalNode): void {
    const addrBits = (node.params.addressBits as number) ?? 4;
    const dataBits = (node.params.dataBits as number) ?? 8;
    const weIdx = addrBits + dataBits;
    const clkIdx = weIdx + 1;

    const writeEnable = node.inputs[weIdx]?.logic ?? false;
    const clk = node.inputs[clkIdx]?.logic ?? false;
    const prevClk = (node.internalState.prevClk as boolean) ?? false;
    const rising = clk && !prevClk;
    node.internalState.prevClk = clk;

    // Compute address
    let address = 0;
    for (let i = 0; i < addrBits; i++) {
        if (node.inputs[i]?.logic) address |= (1 << i);
    }

    // Initialize memory array if needed
    const memSize = 1 << addrBits;
    if (!node.internalState.memory) {
        node.internalState.memory = new Array(memSize).fill(0);
    }
    const memory = node.internalState.memory as number[];

    // Write on rising clock edge when write-enable is HIGH
    if (rising && writeEnable) {
        let dataValue = 0;
        for (let i = 0; i < dataBits; i++) {
            if (node.inputs[addrBits + i]?.logic) dataValue |= (1 << i);
        }
        memory[address] = dataValue;
    }

    // Read: always output data at current address
    const storedValue = memory[address] ?? 0;
    for (let i = 0; i < dataBits; i++) {
        const bitVal = Boolean((storedValue >> i) & 1);
        node.outputs[i].voltage = bitVal ? 5.0 : 0;
        node.outputs[i].logic = bitVal;
        node.outputs[i].drive = DriveStrength.STRONG;
        node.outputs[i].connected = true;
    }
}

export function createMemoryNode(id: string, addressBits = 4, dataBits = 8): SignalNode {
    const inputCount = addressBits + dataBits + 2; // addr + data + WE + CLK
    return createSignalNode(id, NodeType.MEMORY, inputCount, dataBits, { addressBits, dataBits }, evaluateMemory);
}
