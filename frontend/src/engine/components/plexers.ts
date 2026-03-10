/**
 * engine/components/plexers.ts — Multiplexers & Demultiplexers
 *
 * Implements Logisim:
 * - Multiplexer
 * - Demultiplexer
 */

import type { ComponentDef } from '../ComponentDef';
import type { BusValue } from '../LogicValue';
import { busToNumber, unknownBus } from '../LogicValue';

// ── Multiplexer ───────────────────────────────────────────────────────────────

export const Multiplexer: ComponentDef = {
    type: 'plexer_mux',
    label: 'Multiplexer',
    category: 'Plexers',
    defaultParams: { selectBits: 1, dataBits: 1 },
    params: [
        { key: 'selectBits', label: 'Select Bits', type: 'int', default: 1, min: 1, max: 5 },
        { key: 'dataBits', label: 'Data Bits', type: 'int', default: 1, min: 1, max: 32 }
    ],
    ports: (p) => {
        const selBits = Number(p.selectBits ?? 1);
        const dataBits = Number(p.dataBits ?? 1);
        const inputs = Math.pow(2, selBits);

        // Total height depends on inputs. e.g., 2 inputs -> height 4; 4 -> height 6
        const h = inputs + 2;
        const prts = [];

        // Data inputs
        for (let i = 0; i < inputs; i++) {
            prts.push({
                id: `in${i}`, direction: 'input' as const, bits: dataBits, label: `${i}`, side: 'left' as const, x: 0, y: 1 + i
            });
        }

        // Select input at the bottom
        prts.push({
            id: 'sel', direction: 'input' as const, bits: selBits, label: 'sel', side: 'bottom' as const, x: 2, y: h
        });

        // Output at the right middle
        prts.push({
            id: 'out', direction: 'output' as const, bits: dataBits, label: 'out', side: 'right' as const, x: 4, y: Math.floor(h / 2)
        });

        return prts;
    },
    shape: (p) => {
        const selBits = Number(p.selectBits ?? 1);
        const inputs = Math.pow(2, selBits);
        return { w: 4, h: inputs + 2, symbol: 'MUX', color: '#64748B', style: 'custom' };
    },
    initState: () => ({}),
    evaluate: (ctx) => {
        const dataBits = Number(ctx.params.dataBits ?? 1);

        const selBus = ctx.inputs['sel'];
        if (!selBus || selBus.some(b => b === 'X' || b === 'Z')) {
            return { outputs: { out: unknownBus(dataBits) } };
        }

        const selVal = busToNumber(selBus);
        // Logisim usually puts sel=0 at the top (in0)
        const inBus = ctx.inputs[`in${selVal}`] || unknownBus(dataBits);

        return { outputs: { out: inBus } };
    }
};

// ── Demultiplexer ─────────────────────────────────────────────────────────────

export const Demultiplexer: ComponentDef = {
    type: 'plexer_demux',
    label: 'Demultiplexer',
    category: 'Plexers',
    defaultParams: { selectBits: 1, dataBits: 1 },
    params: [
        { key: 'selectBits', label: 'Select Bits', type: 'int', default: 1, min: 1, max: 5 },
        { key: 'dataBits', label: 'Data Bits', type: 'int', default: 1, min: 1, max: 32 }
    ],
    ports: (p) => {
        const selBits = Number(p.selectBits ?? 1);
        const dataBits = Number(p.dataBits ?? 1);
        const outputs = Math.pow(2, selBits);

        const h = outputs + 2;
        const prts = [];

        // Data Input
        prts.push({
            id: 'in', direction: 'input' as const, bits: dataBits, label: 'in', side: 'left' as const, x: 0, y: Math.floor(h / 2)
        });

        // Select input at the bottom
        prts.push({
            id: 'sel', direction: 'input' as const, bits: selBits, label: 'sel', side: 'bottom' as const, x: 2, y: h
        });

        // Data Outputs
        for (let i = 0; i < outputs; i++) {
            prts.push({
                id: `out${i}`, direction: 'output' as const, bits: dataBits, label: `${i}`, side: 'right' as const, x: 4, y: 1 + i
            });
        }

        return prts;
    },
    shape: (p) => {
        const selBits = Number(p.selectBits ?? 1);
        const outputs = Math.pow(2, selBits);
        return { w: 4, h: outputs + 2, symbol: 'DEMUX', color: '#64748B', style: 'custom' };
    },
    initState: () => ({}),
    evaluate: (ctx) => {
        const selBits = Number(ctx.params.selectBits ?? 1);
        const dataBits = Number(ctx.params.dataBits ?? 1);
        const outputs = Math.pow(2, selBits);

        const selBus = ctx.inputs['sel'];
        const inBus = ctx.inputs['in'] || unknownBus(dataBits);

        const out: Record<string, BusValue> = {};

        if (!selBus || selBus.some(b => b === 'X' || b === 'Z')) {
            for (let i = 0; i < outputs; i++) out[`out${i}`] = unknownBus(dataBits);
            return { outputs: out };
        }

        const selVal = busToNumber(selBus);

        for (let i = 0; i < outputs; i++) {
            if (i === selVal) {
                out[`out${i}`] = inBus;
            } else {
                // Unselected outputs in Logisim usually output 0.
                out[`out${i}`] = Array(dataBits).fill(0);
            }
        }

        return { outputs: out };
    }
};
