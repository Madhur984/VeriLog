/**
 * engine/components/io.ts — I/O Components
 *
 * Implements Logisim visual I/O peripherals:
 * - Button
 * - LED
 * - 7-Segment Display
 */

import type { ComponentDef } from '../ComponentDef';


// ── Button ────────────────────────────────────────────────────────────────────

export const Button: ComponentDef = {
    type: 'io_button',
    label: 'Button',
    category: 'I/O',
    defaultParams: { val: 0 },
    params: [
        { key: 'val', label: 'Pressed', type: 'int', default: 0 } // Transient state managed by UI clicks
    ],
    ports: () => [
        { id: 'out', direction: 'output', bits: 1, label: '', side: 'right', x: 2, y: 1 }
    ],
    shape: () => ({ w: 2, h: 2, symbol: '⦿', color: '#10B981', style: 'custom' }),
    initState: () => ({}),
    // For buttons, the UI applies param 'val'=1 while mouse down. Engine just broadcasts it.
    evaluate: (ctx) => {
        const val = Number(ctx.params.val ?? 0) === 1 ? 1 : 0;
        return { outputs: { out: [val] } };
    }
};

// ── LED ───────────────────────────────────────────────────────────────────────

export const LED: ComponentDef = {
    type: 'io_led',
    label: 'LED',
    category: 'I/O',
    defaultParams: { color: '#EF4444' }, // Red LED
    params: [
        { key: 'color', label: 'Color', type: 'string', default: '#EF4444' }
    ],
    ports: () => [
        { id: 'in', direction: 'input', bits: 1, label: '', side: 'left', x: 0, y: 1 }
    ],
    shape: (p) => ({
        w: 2, h: 2, symbol: '', color: String(p.color ?? '#EF4444'), style: 'custom', extras: 'led'
    }),
    initState: () => ({ active: false }),
    evaluate: (ctx) => {
        const inBus = ctx.inputs['in'];
        const active = inBus ? inBus[0] === 1 : false;
        return {
            outputs: {},
            state: { active }
        };
    }
};

// ── 7-Segment Display ─────────────────────────────────────────────────────────

export const SevenSegment: ComponentDef = {
    type: 'io_7seg',
    label: '7-Segment Display',
    category: 'I/O',
    defaultParams: {},
    params: [],
    ports: () => [
        { id: 'dp', direction: 'input', bits: 1, label: 'dp', side: 'bottom', x: 1, y: 3 },
        { id: 'a', direction: 'input', bits: 1, label: 'a', side: 'top', x: 1, y: 0 },
        { id: 'b', direction: 'input', bits: 1, label: 'b', side: 'top', x: 2, y: 0 },
        { id: 'c', direction: 'input', bits: 1, label: 'c', side: 'bottom', x: 2, y: 3 },
        { id: 'd', direction: 'input', bits: 1, label: 'd', side: 'bottom', x: 3, y: 3 },
        { id: 'e', direction: 'input', bits: 1, label: 'e', side: 'bottom', x: 4, y: 3 },
        { id: 'f', direction: 'input', bits: 1, label: 'f', side: 'top', x: 3, y: 0 },
        { id: 'g', direction: 'input', bits: 1, label: 'g', side: 'top', x: 4, y: 0 },
    ],
    shape: () => ({ w: 5, h: 3, symbol: '8', color: '#EF4444', style: 'custom', extras: '7seg' }),
    initState: () => ({ segments: 0 }), // bitmask
    evaluate: (ctx) => {
        let mask = 0;
        const ids = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'dp'];
        for (let i = 0; i < ids.length; i++) {
            const bus = ctx.inputs[ids[i]];
            if (bus && bus[0] === 1) mask |= (1 << i);
        }
        return {
            outputs: {},
            state: { segments: mask }
        };
    }
};

// ── Probe ─────────────────────────────────────────────────────────────────────

export const Probe: ComponentDef = {
    type: 'io_probe',
    label: 'Probe',
    category: 'I/O',
    defaultParams: { radix: 2 }, // 2 for Binary, 10 for Decimal, 16 for Hex
    params: [
        { key: 'radix', label: 'Radix Base', type: 'int', default: 2, min: 2, max: 16 }
    ],
    ports: () => [
        { id: 'in', direction: 'input', bits: 1, label: '', side: 'left', x: 0, y: 1 } // bits dynamically changes if supported, defaulting to 1 for visual
    ],
    shape: () => ({ w: 2, h: 2, symbol: '?', color: '#FCD34D', style: 'custom' }),
    initState: () => ({ value: 'X' }),
    evaluate: (ctx) => {
        const inBus = ctx.inputs['in'];
        let displayVal = 'X';
        if (inBus) {
            if (inBus.length === 1) {
                displayVal = String(inBus[0]);
            } else {
                const radix = Number(ctx.params.radix ?? 2);
                let val = 0;
                let isX = false;
                for (const bit of inBus) {
                    if (bit === 'X' || bit === 'Z') isX = true;
                    val = (val << 1) | (bit === 1 ? 1 : 0);
                }
                displayVal = isX ? 'X' : val.toString(radix).toUpperCase();
            }
        }
        return {
            outputs: {},
            state: { value: displayVal }
        };
    }
};
