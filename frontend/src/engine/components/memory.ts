/**
 * engine/components/memory.ts — Sequential Memory Components
 *
 * Implements Logisim memory elements:
 * - D Flip-Flop
 * - Register
 * - RAM (Basic)
 */

import type { ComponentDef } from '../ComponentDef';
import type { BusValue } from '../LogicValue';
import { unknownBus, numberToBus, busToNumber } from '../LogicValue';

// ── D Flip-Flop ───────────────────────────────────────────────────────────────

export const DFlipFlop: ComponentDef = {
    type: 'mem_dff',
    label: 'D Flip-Flop',
    category: 'Memory',
    defaultParams: {},
    params: [], // edge triggering config could go here
    ports: () => [
        { id: 'D', direction: 'input', bits: 1, label: 'D', side: 'left', x: 0, y: 1 },
        { id: 'clk', direction: 'input', bits: 1, label: '>', side: 'left', x: 0, y: 3 },
        { id: 'Q', direction: 'output', bits: 1, label: 'Q', side: 'right', x: 4, y: 1 },
        { id: '!Q', direction: 'output', bits: 1, label: '!Q', side: 'right', x: 4, y: 3 }
    ],
    shape: () => ({ w: 4, h: 4, symbol: 'D', color: '#1E40AF', style: 'custom' }),
    initState: () => ({ q: 0 as 0 | 1 | 'X', lastClk: 0 as 0 | 1 | 'X' }),
    evaluate: (ctx) => {
        const clkBus = ctx.inputs['clk'];
        const dBus = ctx.inputs['D'];

        const clk = clkBus ? clkBus[0] : 'X';
        const d = dBus ? dBus[0] : 'X';

        let q = ctx.state.q as 0 | 1 | 'X';
        const lastClk = ctx.state.lastClk as 0 | 1 | 'X';

        // Rising edge detection
        if (lastClk === 0 && clk === 1) {
            if (d === 'X' || d === 'Z') q = 'X';
            else q = d;
        }

        const notQ = q === 'X' ? 'X' : (q === 1 ? 0 : 1);

        return {
            outputs: { Q: [q], '!Q': [notQ] },
            state: { q, lastClk: clk }
        };
    }
};

// ── Register ──────────────────────────────────────────────────────────────────

export const Register: ComponentDef = {
    type: 'mem_register',
    label: 'Register',
    category: 'Memory',
    defaultParams: { bits: 8 },
    params: [
        { key: 'bits', label: 'Data Bits', type: 'int', default: 8, min: 1, max: 32 }
    ],
    ports: (p) => [
        { id: 'D', direction: 'input', bits: Number(p.bits ?? 8), label: 'D', side: 'left', x: 0, y: 1 },
        { id: 'en', direction: 'input', bits: 1, label: 'en', side: 'left', x: 0, y: 3 },
        { id: 'clk', direction: 'input', bits: 1, label: '>', side: 'left', x: 0, y: 4 },
        { id: 'clr', direction: 'input', bits: 1, label: 'clr', side: 'bottom', x: 2, y: 5 },
        { id: 'Q', direction: 'output', bits: Number(p.bits ?? 8), label: 'Q', side: 'right', x: 4, y: 1 }
    ],
    shape: () => ({ w: 4, h: 5, symbol: 'REG', color: '#1E40AF', style: 'custom' }),
    initState: (p) => ({ qBus: Array(Number(p.bits ?? 8)).fill(0), lastClk: 0 }),
    evaluate: (ctx) => {
        const bits = Number(ctx.params.bits ?? 8);

        let qBus = ctx.state.qBus as BusValue;
        const lastClk = ctx.state.lastClk as 0 | 1 | 'X';

        const clkBus = ctx.inputs['clk'];
        const clk = clkBus ? clkBus[0] : 'X';

        const clrBus = ctx.inputs['clr'];
        const clr = clrBus ? clrBus[0] : 0;

        const enBus = ctx.inputs['en'];
        // logisim register is enabled by default if EN is disconnected (floating = 1 internally usually, or disconnected)
        const en = (!enBus || enBus[0] === 'Z') ? 1 : enBus[0];

        // Async clear
        if (clr === 1) {
            qBus = Array(bits).fill(0);
        }
        // Rising edge
        else if (lastClk === 0 && clk === 1) {
            if (en === 1) {
                const dBus = ctx.inputs['D'] || unknownBus(bits);
                qBus = [...dBus];
            } else if (en === 'X') {
                qBus = unknownBus(bits);
            }
        }

        return {
            outputs: { Q: qBus },
            state: { qBus, lastClk: clk }
        };
    }
};

// ── RAM ───────────────────────────────────────────────────────────────────────

export const RAM: ComponentDef = {
    type: 'mem_ram',
    label: 'RAM',
    category: 'Memory',
    defaultParams: { addrBits: 8, dataBits: 8 },
    params: [
        { key: 'addrBits', label: 'Address Bits', type: 'int', default: 8, min: 1, max: 24 },
        { key: 'dataBits', label: 'Data Bits', type: 'int', default: 8, min: 1, max: 32 }
    ],
    ports: (p) => {
        const addr = Number(p.addrBits ?? 8);
        const data = Number(p.dataBits ?? 8);
        return [
            { id: 'A', direction: 'input', bits: addr, label: 'A', side: 'left', x: 0, y: 1 },
            { id: 'D', direction: 'inout', bits: data, label: 'D', side: 'right', x: 8, y: 1 },
            { id: 'sel', direction: 'input', bits: 1, label: 'sel', side: 'bottom', x: 2, y: 6 },
            { id: 'clk', direction: 'input', bits: 1, label: '>', side: 'bottom', x: 4, y: 6 },
            { id: 'ld', direction: 'input', bits: 1, label: 'ld', side: 'bottom', x: 6, y: 6 },
            { id: 'clr', direction: 'input', bits: 1, label: 'clr', side: 'bottom', x: 7, y: 6 }
        ];
    },
    shape: () => ({ w: 8, h: 6, symbol: 'RAM', color: '#1E40AF', style: 'custom' }),
    initState: () => ({ memory: new Map<number, number>(), lastClk: 0 }),
    evaluate: (ctx) => {
        // Logisim RAM combines memory reading and writing
        // D is a bidirectional pin conceptually, but our graph currently makes all nets resolve.
        // For exact replication, D acts as output when 'ld' (load) is 1. If 'ld' is 0, it reads from D.
        const dataBits = Number(ctx.params.dataBits ?? 8);

        const mem = ctx.state.memory as Map<number, number>;
        const lastClk = ctx.state.lastClk as 0 | 1 | 'X';

        const aBus = ctx.inputs['A'];
        const dBus = ctx.inputs['D'];

        const clk = ctx.inputs['clk']?.[0] ?? 'X';
        const sel = ctx.inputs['sel']?.[0] ?? 1; // chip select
        const ld = ctx.inputs['ld']?.[0] ?? 1;   // load (read) = 1, store (write) = 0
        const clr = ctx.inputs['clr']?.[0] ?? 0;

        let outD: BusValue = Array(dataBits).fill('Z');

        if (sel === 1) {
            if (clr === 1) {
                mem.clear(); // Async clear
            }

            if (!aBus || aBus.some(b => b === 'X' || b === 'Z')) {
                // Unknown address
                if (ld === 1) outD = unknownBus(dataBits); // Reading unknown yields X
            } else {
                const addr = busToNumber(aBus);

                // Read out
                if (ld === 1) {
                    const val = mem.get(addr) ?? 0;
                    outD = numberToBus(val, dataBits);
                }

                // Write on clock rising edge
                // Note: write enable = (!ld & sel)
                if (ld === 0 && lastClk === 0 && clk === 1) {
                    if (dBus && !dBus.some(b => b === 'X' || b === 'Z')) {
                        mem.set(addr, busToNumber(dBus));
                    }
                }
            }
        }

        return {
            outputs: { D: outD },
            state: { memory: mem, lastClk: clk }
        };
    }
};
