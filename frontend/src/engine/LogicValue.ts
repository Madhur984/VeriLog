import { LogicState } from '../types/circuit';

export type BusValue = LogicState[];

export function floatingBus(bits: number): BusValue {
    return Array(bits).fill('Z');
}

export function numberToBus(val: number, bits: number): BusValue {
    const bus: BusValue = [];
    for (let i = 0; i < bits; i++) {
        bus.push(((val >> i) & 1) as LogicState);
    }
    return bus;
}

export function unknownBus(bits: number): BusValue {
    return Array(bits).fill('X');
}

export function busToNumber(bus: BusValue): number {
    let val = 0;
    for (let i = 0; i < bus.length; i++) {
        if (bus[i] === 1) val |= (1 << i);
    }
    return val;
}

export function wireColor(state: LogicState): string {
    if (state === 1) return '#10B981'; // Bright green for logic high (1)
    if (state === 0) return '#064E3B'; // Dark green for logic low (0)
    if (state === 'X') return '#3B82F6'; // Blue for error/contention (X)
    return '#6B7280'; // Gray for floating (Z)
}

export function busLabel(bus: BusValue): string {
    let hasX = false;
    let hasZ = false;
    for (const b of bus) {
        if (b === 'X') hasX = true;
        if (b === 'Z') hasZ = true;
    }
    if (hasX) return 'X';
    if (hasZ) return 'Z';
    return busToNumber(bus).toString(16).toUpperCase();
}

/**
 * Handles resolution of multi-driver signal contention strictly following standard IEEE models.
 */
export class LogicValue {
    
    /**
     * Resolves multiple driving sources connected to a single electrical net.
     * Rules:
     * - Only Z drivers = Z
     * - Any X driver = X
     * - Mix of 1 and 0 drivers = X
     * - All 1s (and Zs) = 1
     * - All 0s (and Zs) = 0
     */
    static resolve(drivers: LogicState[]): LogicState {
        if (drivers.length === 0) return 'Z';
        if (drivers.length === 1) return drivers[0];

        let hasZero = false;
        let hasOne = false;

        for (const state of drivers) {
            if (state === 'X') return 'X'; // Immediate contention
            if (state === 0) hasZero = true;
            if (state === 1) hasOne = true;
        }

        if (hasZero && hasOne) return 'X'; // Short circuit!
        if (hasZero) return 0;
        if (hasOne) return 1;

        return 'Z';
    }

    /**
     * Inverts a standard logic state.
     */
    static not(val: LogicState): LogicState {
        if (val === 0) return 1;
        if (val === 1) return 0;
        return 'X';
    }

    /**
     * Returns the strict logic union (AND).
     */
    static and(a: LogicState, b: LogicState): LogicState {
        if (a === 0 || b === 0) return 0;
        if (a === 1 && b === 1) return 1;
        return 'X';
    }

    /**
     * Returns the strict logic intersection (OR).
     */
    static or(a: LogicState, b: LogicState): LogicState {
        if (a === 1 || b === 1) return 1;
        if (a === 0 && b === 0) return 0;
        return 'X';
    }

    /**
     * Returns the exclusive OR (XOR).
     */
    static xor(a: LogicState, b: LogicState): LogicState {
        if ((a === 1 || a === 0) && (b === 1 || b === 0)) {
            return a === b ? 0 : 1;
        }
        return 'X';
    }

    /**
     * Helper to safely map a LogicState into an SVG fill/stroke color for the UI.
     */
    static toColor(state: LogicState): string {
        switch (state) {
            case 1: return '#00ff00';   // HIGH: Bright Green
            case 0: return '#1e4020';   // LOW: Dark Muted Green / Gray
            case 'X': return '#ff0000'; // ERROR: Red
            case 'Z': return '#0000ff'; // FLOAT: Blue
            default: return '#555555';
        }
    }
}
