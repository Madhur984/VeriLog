import { describe, it, expect } from 'vitest';
import { createBatteryNode } from '../nodes/BatteryNode';
import { createLEDNode } from '../nodes/LEDNode';
import { createSwitchNode, toggleSwitch } from '../nodes/SwitchNode';
import { createResistorNode } from '../nodes/ResistorNode';
import { createClockNode, tickClock } from '../nodes/ClockNode';
import { createConstantNode } from '../nodes/ConstantNode';
import { createLogicGateNode, generateTruthTable } from '../nodes/LogicGateNode';
import { createMuxNode } from '../nodes/MuxNode';
import { createDecoderNode } from '../nodes/DecoderNode';
import { createEncoderNode } from '../nodes/EncoderNode';
import { createRegisterNode } from '../nodes/RegisterNode';
import { createMemoryNode } from '../nodes/MemoryNode';
import { createSevenSegmentNode } from '../nodes/SevenSegmentNode';
import { portHigh, portLow } from '../core/Port';

describe('Node Implementations', () => {
    describe('BatteryNode', () => {
        it('outputs configured voltage', () => {
            const bat = createBatteryNode('bat1', 9);
            bat.evaluate(bat);
            expect(bat.outputs[0].voltage).toBe(9);
            expect(bat.outputs[0].logic).toBe(true);
        });

        it('defaults to 9V', () => {
            const bat = createBatteryNode('bat2');
            expect(bat.outputs[0].voltage).toBe(9);
        });
    });

    describe('LEDNode', () => {
        it('turns ON when voltage > vForward', () => {
            const led = createLEDNode('led1', 2);
            led.inputs[0] = portHigh(5);
            led.evaluate(led);
            expect(led.internalState.isOn).toBe(true);
            expect((led.internalState.brightness as number)).toBeGreaterThan(0);
        });

        it('stays OFF when voltage < vForward', () => {
            const led = createLEDNode('led1', 2);
            led.inputs[0] = { voltage: 1, logic: false, drive: 2, connected: true };
            led.evaluate(led);
            expect(led.internalState.isOn).toBe(false);
        });
    });

    describe('SwitchNode', () => {
        it('passes signal when ON', () => {
            const sw = createSwitchNode('sw1', true);
            sw.inputs[0] = portHigh(9);
            sw.evaluate(sw);
            expect(sw.outputs[0].voltage).toBe(9);
            expect(sw.outputs[0].logic).toBe(true);
        });

        it('blocks signal when OFF', () => {
            const sw = createSwitchNode('sw1', false);
            sw.inputs[0] = portHigh(9);
            sw.evaluate(sw);
            expect(sw.outputs[0].voltage).toBe(0);
        });

        it('toggles state', () => {
            const sw = createSwitchNode('sw1', false);
            toggleSwitch(sw);
            expect(sw.params.isOn).toBe(true);
            toggleSwitch(sw);
            expect(sw.params.isOn).toBe(false);
        });
    });

    describe('ResistorNode', () => {
        it('reduces voltage', () => {
            const r = createResistorNode('r1', 1000);
            r.inputs[0] = portHigh(9);
            r.evaluate(r);
            expect(r.outputs[0].voltage).toBeLessThan(9);
            expect(r.outputs[0].voltage).toBeGreaterThan(0);
        });
    });

    describe('ClockNode', () => {
        it('starts LOW', () => {
            const clk = createClockNode('clk1', 1000);
            clk.evaluate(clk);
            expect(clk.outputs[0].logic).toBe(false);
        });

        it('toggles on tick', () => {
            const clk = createClockNode('clk1', 1000); // 1kHz → half-period = 500_000 ns
            const toggled = tickClock(clk, 500_000);
            expect(toggled).toBe(true);
            expect(clk.internalState.isHigh).toBe(true);
        });

        it('does not toggle before half-period', () => {
            const clk = createClockNode('clk1', 1000);
            const toggled = tickClock(clk, 100);
            expect(toggled).toBe(false);
        });
    });

    describe('ConstantNode', () => {
        it('outputs HIGH when value is true', () => {
            const c = createConstantNode('c1', true);
            expect(c.outputs[0].voltage).toBe(5);
            expect(c.outputs[0].logic).toBe(true);
        });

        it('outputs LOW when value is false', () => {
            const c = createConstantNode('c2', false);
            expect(c.outputs[0].voltage).toBe(0);
            expect(c.outputs[0].logic).toBe(false);
        });
    });

    describe('LogicGateNode', () => {
        it('AND gate: all HIGH → HIGH', () => {
            const gate = createLogicGateNode('g1', 'AND', 2);
            gate.inputs[0] = portHigh();
            gate.inputs[1] = portHigh();
            gate.evaluate(gate);
            expect(gate.outputs[0].logic).toBe(true);
        });

        it('AND gate: one LOW → LOW', () => {
            const gate = createLogicGateNode('g2', 'AND', 2);
            gate.inputs[0] = portHigh();
            gate.inputs[1] = portLow();
            gate.evaluate(gate);
            expect(gate.outputs[0].logic).toBe(false);
        });

        it('OR gate: any HIGH → HIGH', () => {
            const gate = createLogicGateNode('g3', 'OR', 2);
            gate.inputs[0] = portLow();
            gate.inputs[1] = portHigh();
            gate.evaluate(gate);
            expect(gate.outputs[0].logic).toBe(true);
        });

        it('NOT gate: inverts', () => {
            const gate = createLogicGateNode('g4', 'NOT');
            gate.inputs[0] = portHigh();
            gate.evaluate(gate);
            expect(gate.outputs[0].logic).toBe(false);
        });

        it('NAND gate: NOT-AND behavior', () => {
            const gate = createLogicGateNode('g5', 'NAND', 2);
            gate.inputs[0] = portHigh();
            gate.inputs[1] = portHigh();
            gate.evaluate(gate);
            expect(gate.outputs[0].logic).toBe(false);
        });

        it('XOR gate: odd HIGH → HIGH', () => {
            const gate = createLogicGateNode('g6', 'XOR', 2);
            gate.inputs[0] = portHigh();
            gate.inputs[1] = portLow();
            gate.evaluate(gate);
            expect(gate.outputs[0].logic).toBe(true);
        });

        it('generates correct truth table for AND', () => {
            const table = generateTruthTable('AND', 2);
            expect(table).toHaveLength(4);
            // Only [true, true] → true
            expect(table[3].output).toBe(true);
            expect(table[0].output).toBe(false);
        });
    });

    describe('MuxNode', () => {
        it('selects correct data input', () => {
            const mux = createMuxNode('mux1', 1); // 2:1 MUX
            // data0 = LOW, data1 = HIGH, sel = HIGH (select data1)
            mux.inputs[0] = portLow();     // data0
            mux.inputs[1] = portHigh();    // data1
            mux.inputs[2] = portHigh();    // sel0 = 1 → select data1
            mux.evaluate(mux);
            expect(mux.outputs[0].logic).toBe(true);
        });

        it('selects data0 when select is LOW', () => {
            const mux = createMuxNode('mux2', 1);
            mux.inputs[0] = portHigh();    // data0
            mux.inputs[1] = portLow();     // data1
            mux.inputs[2] = portLow();     // sel0 = 0 → select data0
            mux.evaluate(mux);
            expect(mux.outputs[0].logic).toBe(true);
        });
    });

    describe('DecoderNode', () => {
        it('activates correct output line', () => {
            const dec = createDecoderNode('dec1', 2, true);
            // Input: binary 10 (=2), enable HIGH
            dec.inputs[0] = portLow();     // bit0
            dec.inputs[1] = portHigh();    // bit1
            dec.inputs[2] = portHigh();    // enable
            dec.evaluate(dec);

            expect(dec.outputs[2].logic).toBe(true);
            expect(dec.outputs[0].logic).toBe(false);
            expect(dec.outputs[1].logic).toBe(false);
            expect(dec.outputs[3].logic).toBe(false);
        });

        it('all outputs LOW when disabled', () => {
            const dec = createDecoderNode('dec2', 2, true);
            dec.inputs[0] = portHigh();
            dec.inputs[1] = portHigh();
            dec.inputs[2] = portLow(); // enable = LOW
            dec.evaluate(dec);

            for (let i = 0; i < 4; i++) {
                expect(dec.outputs[i].logic).toBe(false);
            }
        });
    });

    describe('EncoderNode', () => {
        it('encodes highest-priority active input', () => {
            const enc = createEncoderNode('enc1', 2); // 4-to-2 encoder
            enc.inputs[0] = portLow();
            enc.inputs[1] = portLow();
            enc.inputs[2] = portHigh(); // input 2 active
            enc.inputs[3] = portLow();
            enc.evaluate(enc);

            // Binary encoding of 2 = 10
            expect(enc.outputs[0].logic).toBe(false); // bit0
            expect(enc.outputs[1].logic).toBe(true);  // bit1
            expect(enc.outputs[2].logic).toBe(true);  // valid
        });
    });

    describe('RegisterNode', () => {
        it('loads data on rising clock edge', () => {
            const reg = createRegisterNode('reg1', 4);
            // Set data inputs: binary 1010
            reg.inputs[0] = portLow();     // D0
            reg.inputs[1] = portHigh();    // D1
            reg.inputs[2] = portLow();     // D2
            reg.inputs[3] = portHigh();    // D3
            reg.inputs[4] = portLow();     // CLK (low first)
            reg.inputs[5] = portHigh();    // LOAD
            reg.inputs[6] = portLow();     // RESET

            // First eval with CLK low
            reg.evaluate(reg);

            // Rising edge: CLK goes high
            reg.inputs[4] = portHigh();
            reg.evaluate(reg);

            expect(reg.outputs[0].logic).toBe(false);
            expect(reg.outputs[1].logic).toBe(true);
            expect(reg.outputs[2].logic).toBe(false);
            expect(reg.outputs[3].logic).toBe(true);
        });

        it('resets all outputs on reset', () => {
            const reg = createRegisterNode('reg2', 4);
            reg.inputs[6] = portHigh(); // RESET
            reg.evaluate(reg);

            for (let i = 0; i < 4; i++) {
                expect(reg.outputs[i].logic).toBe(false);
            }
        });
    });

    describe('MemoryNode', () => {
        it('writes and reads data', () => {
            const mem = createMemoryNode('mem1', 2, 4); // 4 addresses, 4-bit data
            // Write value 5 (0101) to address 1 (01)
            mem.inputs[0] = portHigh();  // addr0 = 1
            mem.inputs[1] = portLow();   // addr1 = 0  → address 1
            mem.inputs[2] = portHigh();  // d0 = 1
            mem.inputs[3] = portLow();   // d1 = 0
            mem.inputs[4] = portHigh();  // d2 = 1
            mem.inputs[5] = portLow();   // d3 = 0
            mem.inputs[6] = portHigh();  // WE = HIGH
            mem.inputs[7] = portLow();   // CLK low first

            mem.evaluate(mem);

            // Rising edge
            mem.inputs[7] = portHigh();
            mem.evaluate(mem);

            // Now read: disable write, check output
            mem.inputs[6] = portLow(); // WE = LOW
            mem.evaluate(mem);

            // Data at address 1 should be 0101
            expect(mem.outputs[0].logic).toBe(true);  // d0
            expect(mem.outputs[1].logic).toBe(false); // d1
            expect(mem.outputs[2].logic).toBe(true);  // d2
            expect(mem.outputs[3].logic).toBe(false); // d3
        });
    });

    describe('SevenSegmentNode', () => {
        it('displays correct segments for digit 0', () => {
            const seg = createSevenSegmentNode('seg1');
            // Input: 0000 (digit 0)
            seg.inputs[0] = portLow();
            seg.inputs[1] = portLow();
            seg.inputs[2] = portLow();
            seg.inputs[3] = portLow();
            seg.evaluate(seg);

            // Digit 0: a,b,c,d,e,f ON, g OFF
            expect(seg.outputs[0].logic).toBe(true);  // a
            expect(seg.outputs[1].logic).toBe(true);  // b
            expect(seg.outputs[2].logic).toBe(true);  // c
            expect(seg.outputs[3].logic).toBe(true);  // d
            expect(seg.outputs[4].logic).toBe(true);  // e
            expect(seg.outputs[5].logic).toBe(true);  // f
            expect(seg.outputs[6].logic).toBe(false); // g
        });

        it('displays correct segments for digit 1', () => {
            const seg = createSevenSegmentNode('seg2');
            // Input: 0001 (digit 1)
            seg.inputs[0] = portHigh();
            seg.inputs[1] = portLow();
            seg.inputs[2] = portLow();
            seg.inputs[3] = portLow();
            seg.evaluate(seg);

            // Digit 1: only b,c ON
            expect(seg.outputs[0].logic).toBe(false); // a
            expect(seg.outputs[1].logic).toBe(true);  // b
            expect(seg.outputs[2].logic).toBe(true);  // c
            expect(seg.outputs[3].logic).toBe(false); // d
        });
    });
});
