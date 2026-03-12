// @ts-nocheck
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

// ── Decoder ─────────────────────────────────────────────────────────────

export const Decoder: ComponentDef = {
    type: 'plexer_decoder',
    label: 'Decoder',
    category: 'Plexers',
    defaultParams: { selectBits: 2 },
    params: [
        { key: 'selectBits', label: 'Select Bits', type: 'int', default: 2, min: 1, max: 5 }
    ],
    ports: (p) => {
        const selBits = Number(p.selectBits ?? 2);
        const outputs = Math.pow(2, selBits);
        const h = outputs + 2;
        const prts = [];

        // Select input at the bottom
        prts.push({
            id: 'sel', direction: 'input' as const, bits: selBits, label: 'sel', side: 'bottom' as const, x: 2, y: h
        });

        // En input at the left
        prts.push({
            id: 'en', direction: 'input' as const, bits: 1, label: 'en', side: 'left' as const, x: 0, y: Math.floor(h / 2)
        });

        // Data Outputs
        for (let i = 0; i < outputs; i++) {
            prts.push({
                id: `out${i}`, direction: 'output' as const, bits: 1, label: `${i}`, side: 'right' as const, x: 4, y: 1 + i
            });
        }
        return prts;
    },
    shape: (p) => {
        const selBits = Number(p.selectBits ?? 2);
        const outputs = Math.pow(2, selBits);
        return { w: 4, h: outputs + 2, symbol: 'DEC', color: '#64748B', style: 'custom' };
    },
    initState: () => ({}),
    evaluate: (ctx) => {
        const selBits = Number(ctx.params.selectBits ?? 2);
        const outputs = Math.pow(2, selBits);

        const selBus = ctx.inputs['sel'];
        const enBus = ctx.inputs['en'];
        const isEnabled = !enBus || enBus[0] === 1;

        const out: Record<string, BusValue> = {};

        if (!isEnabled || !selBus || selBus.some(b => b === 'X' || b === 'Z')) {
            for (let i = 0; i < outputs; i++) out[`out${i}`] = [0];
            if (!isEnabled && selBus && !selBus.some(b => b === 'X' || b === 'Z')) {
                // If disabled but selBus is valid, it's 0s. 
            } else if (!selBus || selBus.some(b => b === 'X' || b === 'Z')) {
                if (isEnabled) {
                    for (let i = 0; i < outputs; i++) out[`out${i}`] = unknownBus(1);
                }
            }
            return { outputs: out };
        }

        const selVal = busToNumber(selBus);

        for (let i = 0; i < outputs; i++) {
            out[`out${i}`] = [(i === selVal) ? 1 : 0];
        }

        return { outputs: out };
    }
};

// ── Priority Encoder ─────────────────────────────────────────────────────────────

export const PriorityEncoder: ComponentDef = {
    type: 'plexer_encoder',
    label: 'Priority Encoder',
    category: 'Plexers',
    defaultParams: { selectBits: 2 },
    params: [
        { key: 'selectBits', label: 'Select Bits', type: 'int', default: 2, min: 1, max: 5 }
    ],
    ports: (p) => {
        const selBits = Number(p.selectBits ?? 2);
        const inputs = Math.pow(2, selBits);
        const h = inputs + 2;
        const prts = [];

        // Data Inputs
        for (let i = 0; i < inputs; i++) {
            prts.push({
                id: `in${i}`, direction: 'input' as const, bits: 1, label: `${i}`, side: 'left' as const, x: 0, y: 1 + i
            });
        }

        // Output at the right middle
        prts.push({
            id: 'out', direction: 'output' as const, bits: selBits, label: 'out', side: 'right' as const, x: 4, y: Math.floor(h / 2)
        });
        
        // Valid Output
        prts.push({
            id: 'vld', direction: 'output' as const, bits: 1, label: 'vld', side: 'bottom' as const, x: 2, y: h
        });

        return prts;
    },
    shape: (p) => {
        const selBits = Number(p.selectBits ?? 2);
        const inputs = Math.pow(2, selBits);
        return { w: 4, h: inputs + 2, symbol: 'ENC', color: '#64748B', style: 'custom' };
    },
    initState: () => ({}),
    evaluate: (ctx) => {
        const selBits = Number(ctx.params.selectBits ?? 2);
        const inputsCount = Math.pow(2, selBits);

        let activeIndex = -1;
        let hasUnknown = false;

        // Priority Encoder checks from highest to lowest
        for (let i = inputsCount - 1; i >= 0; i--) {
            const inBus = ctx.inputs[`in${i}`];
            if (inBus) {
                if (inBus[0] === 'X' || inBus[0] === 'Z') {
                    hasUnknown = true;
                } else if (inBus[0] === 1) {
                    activeIndex = i;
                    break;
                }
            }
        }

        if (activeIndex === -1 && hasUnknown) {
             return { outputs: { out: unknownBus(selBits), vld: unknownBus(1) } };
        }

        if (activeIndex >= 0) {
            const outBus: BusValue = [];
            for (let i = 0; i < selBits; i++) {
                outBus.push(((activeIndex >> i) & 1) ? 1 : 0);
            }
            return { outputs: { out: outBus, vld: [1] } };
        }

        return { outputs: { out: Array(selBits).fill(0), vld: [0] } };
    }
};
