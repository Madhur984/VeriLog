/**
 * mure/core/Port.ts — Port State & Drive Strength
 *
 * Every port carries both an analog voltage and a digital logic level.
 * Drive strength determines signal priority when multiple drivers conflict.
 */

export enum DriveStrength {
    HIGH_Z = 0,
    WEAK = 1,
    STRONG = 2,
}

export interface PortState {
    voltage: number;
    logic: boolean;
    drive: DriveStrength;
    connected: boolean;
}

export function createPort(overrides: Partial<PortState> = {}): PortState {
    return {
        voltage: 0,
        logic: false,
        drive: DriveStrength.HIGH_Z,
        connected: false,
        ...overrides,
    };
}

export function portFromVoltage(v: number, threshold = 2.5): PortState {
    return {
        voltage: v,
        logic: v >= threshold,
        drive: DriveStrength.STRONG,
        connected: true,
    };
}

export function portHigh(v = 5.0): PortState {
    return { voltage: v, logic: true, drive: DriveStrength.STRONG, connected: true };
}

export function portLow(): PortState {
    return { voltage: 0, logic: false, drive: DriveStrength.STRONG, connected: true };
}
