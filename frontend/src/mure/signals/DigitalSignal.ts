/**
 * mure/signals/DigitalSignal.ts - Digital Signal Model
 *
 * Type: 0 | 1 (binary).
 * Threshold conversion between analog and digital domains.
 */

export type DigitalSignal = 0 | 1;

const DEFAULT_THRESHOLD = 2.5; // TTL mid-point for 5V logic

/** Convert analog voltage to digital signal */
export function voltageToDigital(voltage: number, threshold = DEFAULT_THRESHOLD): DigitalSignal {
    return voltage >= threshold ? 1 : 0;
}

/** Convert digital signal to analog voltage */
export function digitalToVoltage(signal: DigitalSignal, vHigh = 5.0, vLow = 0): number {
    return signal === 1 ? vHigh : vLow;
}

/** Convert boolean to digital signal */
export function boolToDigital(value: boolean): DigitalSignal {
    return value ? 1 : 0;
}

/** Convert digital signal to boolean */
export function digitalToBool(signal: DigitalSignal): boolean {
    return signal === 1;
}
