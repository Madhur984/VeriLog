/**
 * engine/LogicValue.ts — Four-valued Logic System
 *
 * Fully implements IEEE 1164 four-valued logic: 0, 1, X (unknown), Z (high-impedance).
 *
 * This is the core data type for the Logisim-style simulator.
 * Every port, wire, and net carries a LogicValue.
 *
 * Resolution rules match Logisim behavior:
 *   - Z (floating) loses to any driver
 *   - 0 and 1 conflict → X (error)
 *   - X propagates through most gates
 */

// ── Four-valued signal type ──────────────────────────────────────────────────

export type LogicValue = 0 | 1 | 'X' | 'Z';

/** Multi-bit bus: array of LogicValues, index 0 = MSB */
export type BusValue = LogicValue[];

// ── Display colors (Logisim convention) ────────────────────────────────────

export const LOGIC_COLOR: Record<string, string> = {
    '0': '#334155',   // LOW   → dark slate
    '1': '#10B981',   // HIGH  → green
    'X': '#3B82F6',   // ERROR → blue (Logisim uses blue for X)
    'Z': '#94A3B8',   // HIZ   → light gray (floating)
};

export function logicColor(v: LogicValue): string {
    return LOGIC_COLOR[String(v)] ?? '#334155';
}

// ── Wire state color ────────────────────────────────────────────────────────

export function wireColor(v: LogicValue): string {
    switch (v) {
        case 1: return '#10B981';   // HIGH: green
        case 0: return '#334155';   // LOW:  dark gray
        case 'X': return '#3B82F6';   // conflict/error: blue (matches Logisim)
        case 'Z': return '#6B7280';   // floating: mid-gray
        default: return '#334155';
    }
}

// ── Resolution table ─────────────────────────────────────────────────────────
//
// When multiple drivers are connected to the same net, we must resolve conflicts.
// Resolution follows Logisim's "wired logic" model:
//
//      | Z   | 0   | 1   | X
//  ----+-----+-----+-----+----
//   Z  |  Z  |  0  |  1  |  X
//   0  |  0  |  0  |  X  |  X
//   1  |  1  |  X  |  1  |  X
//   X  |  X  |  X  |  X  |  X

const RES: Record<string, Record<string, LogicValue>> = {
    'Z': { 'Z': 'Z', '0': 0, '1': 1, 'X': 'X' },
    '0': { 'Z': 0, '0': 0, '1': 'X', 'X': 'X' },
    '1': { 'Z': 1, '0': 'X', '1': 1, 'X': 'X' },
    'X': { 'Z': 'X', '0': 'X', '1': 'X', 'X': 'X' },
};

export function resolveValues(a: LogicValue, b: LogicValue): LogicValue {
    return RES[String(a)]?.[String(b)] ?? 'X';
}

/** Resolve an array of drivers onto one net */
export function resolveNet(drivers: LogicValue[]): LogicValue {
    if (drivers.length === 0) return 'Z';
    if (drivers.length === 1) return drivers[0];
    return drivers.reduce(resolveValues);
}

// ── Gate evaluation helpers ───────────────────────────────────────────────────

/** Convert logic value to boolean for gate evaluation. X/Z → false */
export function toBoolean(v: LogicValue): boolean {
    return v === 1;
}

/** Create a single-bit gate result, propagating X if any input is X */
export function gateResult(inputs: LogicValue[], booleanResult: boolean): LogicValue {
    if (inputs.some(i => i === 'X' || i === 'Z')) return 'X';
    return booleanResult ? 1 : 0;
}

// ── Bus helpers ───────────────────────────────────────────────────────────────

export function singleToBus(v: LogicValue): BusValue {
    return [v];
}

export function busToNumber(bus: BusValue): number {
    let n = 0;
    for (const bit of bus) {
        n <<= 1;
        if (bit === 1) n |= 1;
    }
    return n;
}

export function numberToBus(n: number, bits: number): BusValue {
    const result: BusValue = [];
    for (let i = bits - 1; i >= 0; i--) {
        result.push((n >> i) & 1 ? 1 : 0);
    }
    return result;
}

/** Create an N-bit undefined bus */
export function unknownBus(bits: number): BusValue {
    return Array.from({ length: bits }, () => 'X' as LogicValue);
}

/** Create an N-bit floating bus */
export function floatingBus(bits: number): BusValue {
    return Array.from({ length: bits }, () => 'Z' as LogicValue);
}

export function busLabel(bus: BusValue): string {
    if (bus.length === 1) return String(bus[0]);
    if (bus.every(b => b === 0 || b === 1)) {
        return `0x${busToNumber(bus).toString(16).toUpperCase()}`;
    }
    return bus.map(b => String(b)).join('');
}
