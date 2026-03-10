/**
 * engine/components/wiring.ts — Wiring & Basic Components
 *
 * Logisim Wiring category:
 * Pin, Constant, Power, Ground, Probe, Tunnel, Clock, Splitter
 */

import type { ComponentDef, PortDef } from '../ComponentDef';
import type { BusValue } from '../LogicValue';
import { numberToBus, floatingBus } from '../LogicValue';

// ── Pin ───────────────────────────────────────────────────────────────────────

export const Pin: ComponentDef = {
    type: 'pin',
    label: 'Pin',
    category: 'Wiring',
    defaultParams: { bits: 1, output: false, val: 0 },
    params: [
        { key: 'bits', label: 'Data Bits', type: 'int', default: 1, min: 1, max: 32 },
        { key: 'output', label: 'Output?', type: 'bool', default: false },
        { key: 'val', label: 'Value', type: 'int', default: 0 } // Represents the state of the pin when acting as input
    ],
    ports: (p) => [
        {
            id: p.output ? 'in' : 'out',
            direction: p.output ? 'input' : 'output',
            bits: Number(p.bits ?? 1),
            label: '',
            side: p.output ? 'left' : 'right',
            x: p.output ? 0 : 2,
            y: 1
        }
    ],
    shape: (p) => ({
        w: 2, h: 2, symbol: p.output ? '○' : '■', color: '#10B981', style: 'rect', extras: p.output ? 'round' : 'square'
    }),
    initState: () => ({}),
    evaluate: (ctx) => {
        const isOut = Boolean(ctx.params.output);
        const bits = Number(ctx.params.bits ?? 1);
        if (!isOut) {
            // Pin acts as a source
            const val = Number(ctx.params.val ?? 0);
            return { outputs: { 'out': numberToBus(val, bits) } };
        }
        // Pin acts as a sink (Probe functionally handled by UI examining port)
        return { outputs: {} as Record<string, BusValue> };
    }
};

// ── Constant ──────────────────────────────────────────────────────────────────

export const Constant: ComponentDef = {
    type: 'const',
    label: 'Constant',
    category: 'Wiring',
    defaultParams: { bits: 1, val: 1 },
    params: [
        { key: 'bits', label: 'Data Bits', type: 'int', default: 1, min: 1, max: 32 },
        { key: 'val', label: 'Value', type: 'int', default: 1 }
    ],
    ports: (p) => [
        { id: 'out', direction: 'output', bits: Number(p.bits ?? 1), label: '', side: 'right', x: 2, y: 1 }
    ],
    shape: () => ({ w: 2, h: 2, symbol: 'C', color: '#94A3B8', style: 'rect' }),
    initState: () => ({}),
    evaluate: (ctx) => {
        const bits = Number(ctx.params.bits ?? 1);
        const val = Number(ctx.params.val ?? 1);
        return { outputs: { out: numberToBus(val, bits) } };
    }
};

// ── Clock ─────────────────────────────────────────────────────────────────────

export const Clock: ComponentDef = {
    type: 'clock',
    label: 'Clock',
    category: 'Wiring',
    defaultParams: { highDuration: 1, lowDuration: 1 },
    // Durations represent cycles or logical ticks relative to some base clock, Logisim has specific simulation tick routing.
    // In our event model, we can issue delayed events to toggle ourselves.
    params: [
        { key: 'highDuration', label: 'High Duration', type: 'int', default: 1, min: 1 },
        { key: 'lowDuration', label: 'Low Duration', type: 'int', default: 1, min: 1 }
    ],
    ports: () => [
        { id: 'out', direction: 'output', bits: 1, label: '', side: 'right', x: 2, y: 1 }
    ],
    shape: () => ({ w: 2, h: 2, symbol: '🕒', color: '#3B82F6', style: 'rect' }),
    initState: () => ({ val: 0 }),
    evaluate: (ctx) => {
        // We emit our current state and schedule our next flip.
        // If we want a 1Hz clock visually, that's done by the runner.
        // However, Logisim's clock ticks globally. For our event-driven system,
        // we can make the component self-oscillate with delayNs, but it's often better
        // to have a global clock generator tick clocks. For now, we self-oscillate if timeNs > 0.
        const val = Number(ctx.state.val ?? 0);
        const highDur = Number(ctx.params.highDuration ?? 1) * 1000; // arbitrary base delay
        const lowDur = Number(ctx.params.lowDuration ?? 1) * 1000;
        const delay = val ? highDur : lowDur;

        return {
            outputs: { out: [val === 1 ? 1 : 0] },
            state: { val: val ? 0 : 1 },
            delayNs: delay
        };
    }
};

// ── Splitter ─────────────────────────────────────────────────────────────────
// Connects an N-bit bus to N separate 1-bit wires (or vice-versa).
// Logisim allows complex mappings, we will implement a basic 1-to-N unrolled.

export const Splitter: ComponentDef = {
    type: 'splitter',
    label: 'Splitter',
    category: 'Wiring',
    defaultParams: { splitBits: 2 },
    params: [
        { key: 'splitBits', label: 'Bit Width', type: 'int', default: 2, min: 2, max: 32 }
    ],
    ports: (p) => {
        const bits = Number(p.splitBits ?? 2);
        // Combined port
        const prts: PortDef[] = [
            { id: 'combined', direction: 'inout' as const, bits, label: '', side: 'left' as const, x: 0, y: Math.floor(bits / 2) }
        ];
        // Split ports
        for (let i = 0; i < bits; i++) {
            prts.push({
                id: `bit${i}`, direction: 'inout' as const, bits: 1, label: `${i}`, side: 'right' as const, x: 2, y: i
            });
        }
        return prts;
    },
    shape: (p) => ({ w: 2, h: Number(p.splitBits ?? 2), symbol: '⑂', color: '#1E293B', style: 'custom' }),
    initState: () => ({}),
    evaluate: (ctx) => {
        // Splitter acts as a pass-through. If driven on 'combined', it outputs to 'bits'.
        // If driven on 'bits', it merges and outputs to 'combined'.
        // Since our simulator relies on unidirectional port values for standard propagate,
        // bidirectional pass-through requires recognizing which side is driving.
        // For simplicity in Phase 2, we treat 'combined' as input and 'bitN' as outputs.
        // Logisim splitters are strictly structural but we model them logically here currently.

        const bits = Number(ctx.params.splitBits ?? 2);
        const combinedValue = ctx.inputs['combined'] ?? floatingBus(bits);

        const outs: Record<string, BusValue> = {};
        for (let i = 0; i < bits; i++) {
            outs[`bit${i}`] = [combinedValue[bits - 1 - i] ?? 'Z']; // LSB mapping might need care, usually arr[0] is MSB
        }
        return { outputs: outs };
    }
};
