// @ts-nocheck
/**
 * engine/components/gates.ts — Standard Logic Gates
 *
 * Implements Logisim's core logic gates:
 * AND, OR, NOT, NAND, NOR, XOR, XNOR, BUFFER
 *
 * Parameters supported:
 *  - Data Bits: width of the input/output buses
 *  - Number of Inputs: (2 to 32)
 */

import type { ComponentDef, EvalContext, PortDef, ComponentShape } from '../ComponentDef';
import type { BusValue, LogicValue } from '../LogicValue';
import { floatingBus } from '../LogicValue';

// ── Generic multi-bit evaluation ──────────────────────────────────────────

function evaluateGate(
    ctx: EvalContext,
    bits: number,
    booleanOp: (inputs: boolean[]) => boolean,
    inverter: boolean
): BusValue {
    const result: BusValue = [];
    const inKeys = Object.keys(ctx.inputs);

    for (let bit = 0; bit < bits; bit++) {
        const bitValues: LogicState[] = [];
        for (const k of inKeys) {
            const bus = ctx.inputs[k];
            bitValues.push(bus && bus.length > bit ? bus[bit] : 'X');
        }

        if (bitValues.some(v => v === 'X' || v === 'Z')) {
            result.push('X');
        } else {
            const bVals = bitValues.map(v => v === 1);
            const res = booleanOp(bVals);
            result.push((res !== inverter) ? 1 : 0);
        }
    }
    return result;
}

// ── Shared Gate Port/Shape Logic ──────────────────────────────────────────

function gatePorts(params: Record<string, unknown>): PortDef[] {
    const inputs = Number(params.inputs ?? 2);
    const bits = Number(params.bits ?? 1);
    const ports: PortDef[] = [];

    // Output port at right center
    const hUnits = Math.max(4, inputs + 1);
    ports.push({
        id: 'out',
        direction: 'output',
        bits,
        label: 'Q',
        side: 'right',
        x: 5, // assuming 5 grid units wide
        y: Math.floor(hUnits / 2),
    });

    // Input ports along left edge
    const startY = Math.floor((hUnits - (inputs - 1)) / 2);
    for (let i = 0; i < inputs; i++) {
        ports.push({
            id: `in${i}`,
            direction: 'input',
            bits,
            label: `In${i}`,
            side: 'left',
            x: 0,
            y: startY + i,
        });
    }

    return ports;
}

function gateShape(params: Record<string, unknown>, style: ComponentShape['style'], extras?: string): ComponentShape {
    const inputs = Number(params.inputs ?? 2);
    const h = Math.max(4, inputs + 1);
    return {
        w: 5,
        h,
        symbol: '',
        color: '#E2E8F0',
        style,
        extras,
    };
}

const GATE_PARAMS = [
    { key: 'bits', label: 'Data Bits', type: 'int' as const, default: 1, min: 1, max: 32 },
    { key: 'inputs', label: 'Number of Inputs', type: 'int' as const, default: 2, min: 2, max: 32 },
];

// ── Components ─────────────────────────────────────────────────────────────

export const AndGate: ComponentDef = {
    type: 'gate_and',
    label: 'AND Gate',
    category: 'Gates',
    defaultParams: { bits: 1, inputs: 2 },
    params: GATE_PARAMS,
    ports: gatePorts,
    shape: p => gateShape(p, 'and'),
    initState: () => ({}),
    evaluate: (ctx) => {
        const bits = Number(ctx.params.bits ?? 1);
        const out = evaluateGate(ctx, bits, ins => ins.every(x => x), false);
        return { outputs: { out } };
    }
};

export const OrGate: ComponentDef = {
    type: 'gate_or',
    label: 'OR Gate',
    category: 'Gates',
    defaultParams: { bits: 1, inputs: 2 },
    params: GATE_PARAMS,
    ports: gatePorts,
    shape: p => gateShape(p, 'or'),
    initState: () => ({}),
    evaluate: (ctx) => {
        const bits = Number(ctx.params.bits ?? 1);
        // OR behaves specially with floating inputs in some domains, but strictly IEEE: z is unknown
        const out = evaluateGate(ctx, bits, ins => ins.some(x => x), false);
        return { outputs: { out } };
    }
};

export const NotGate: ComponentDef = {
    type: 'gate_not',
    label: 'NOT Gate',
    category: 'Gates',
    defaultParams: { bits: 1 },
    params: [
        { key: 'bits', label: 'Data Bits', type: 'int' as const, default: 1, min: 1, max: 32 }
    ],
    ports: (params) => [
        { id: 'in', direction: 'input', bits: Number(params.bits ?? 1), label: 'In', side: 'left', x: 0, y: 1 },
        { id: 'out', direction: 'output', bits: Number(params.bits ?? 1), label: 'Out', side: 'right', x: 4, y: 1 }
    ],
    shape: () => ({ w: 4, h: 2, symbol: '', color: '#E2E8F0', style: 'not' }),
    initState: () => ({}),
    evaluate: (ctx) => {
        const bits = Number(ctx.params.bits ?? 1);
        const result: BusValue = [];
        const inBus = ctx.inputs['in'] ?? floatingBus(bits);
        for (let i = 0; i < bits; i++) {
            const v = inBus[i];
            if (v === 'X' || v === 'Z') result.push('X');
            else result.push(v === 1 ? 0 : 1);
        }
        return { outputs: { out: result } };
    }
};

export const NandGate: ComponentDef = {
    type: 'gate_nand',
    label: 'NAND Gate',
    category: 'Gates',
    defaultParams: { bits: 1, inputs: 2 },
    params: GATE_PARAMS,
    ports: gatePorts,
    shape: p => gateShape(p, 'and', 'bubble'),
    initState: () => ({}),
    evaluate: (ctx) => {
        const bits = Number(ctx.params.bits ?? 1);
        const out = evaluateGate(ctx, bits, ins => ins.every(x => x), true);
        return { outputs: { out } };
    }
};

export const NorGate: ComponentDef = {
    type: 'gate_nor',
    label: 'NOR Gate',
    category: 'Gates',
    defaultParams: { bits: 1, inputs: 2 },
    params: GATE_PARAMS,
    ports: gatePorts,
    shape: p => gateShape(p, 'or', 'bubble'),
    initState: () => ({}),
    evaluate: (ctx) => {
        const bits = Number(ctx.params.bits ?? 1);
        const out = evaluateGate(ctx, bits, ins => ins.some(x => x), true);
        return { outputs: { out } };
    }
};

export const XorGate: ComponentDef = {
    type: 'gate_xor',
    label: 'XOR Gate',
    category: 'Gates',
    defaultParams: { bits: 1, inputs: 2 },
    params: GATE_PARAMS,
    ports: gatePorts,
    shape: p => gateShape(p, 'or', 'exclusive'),
    initState: () => ({}),
    evaluate: (ctx) => {
        const bits = Number(ctx.params.bits ?? 1);
        const out = evaluateGate(ctx, bits, ins => ins.filter(x => x).length % 2 === 1, false);
        return { outputs: { out } };
    }
};

export const XnorGate: ComponentDef = {
    type: 'gate_xnor',
    label: 'XNOR Gate',
    category: 'Gates',
    defaultParams: { bits: 1, inputs: 2 },
    params: GATE_PARAMS,
    ports: gatePorts,
    shape: p => gateShape(p, 'or', 'exclusive,bubble'),
    initState: () => ({}),
    evaluate: (ctx) => {
        const bits = Number(ctx.params.bits ?? 1);
        const out = evaluateGate(ctx, bits, ins => ins.filter(x => x).length % 2 === 1, true);
        return { outputs: { out } };
    }
};

export const BufferGate: ComponentDef = {
    type: 'gate_buffer',
    label: 'Buffer',
    category: 'Gates',
    defaultParams: { bits: 1 },
    params: [
        { key: 'bits', label: 'Data Bits', type: 'int' as const, default: 1, min: 1, max: 32 }
    ],
    ports: (params) => [
        { id: 'in', direction: 'input', bits: Number(params.bits ?? 1), label: 'In', side: 'left', x: 0, y: 1 },
        { id: 'out', direction: 'output', bits: Number(params.bits ?? 1), label: 'Out', side: 'right', x: 4, y: 1 }
    ],
    shape: () => ({ w: 4, h: 2, symbol: '', color: '#E2E8F0', style: 'triangle' }),
    initState: () => ({}),
    evaluate: (ctx) => {
        const bits = Number(ctx.params.bits ?? 1);
        const result: BusValue = [];
        const inBus = ctx.inputs['in'] ?? floatingBus(bits);
        for (let i = 0; i < bits; i++) {
            const v = inBus[i];
            if (v === 'X' || v === 'Z') result.push('X');
            else result.push(v);
        }
        return { outputs: { out: result } };
    }
};
