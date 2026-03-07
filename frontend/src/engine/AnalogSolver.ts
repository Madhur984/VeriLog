/**
 * engine/AnalogSolver.ts — Simplified MNA (Modified Nodal Analysis)
 *
 * Solves DC operating point of resistive circuits.
 * Supports: resistors, voltage sources (batteries), LED models.
 *
 * Algorithm:
 *   1. Build conductance matrix G (N×N sparse → dense for small N)
 *   2. Build RHS current vector b
 *   3. Solve G·v = b via Gaussian elimination
 *   4. Return node voltages → component brightness / voltage display
 *
 * Limitations (Phase 2):
 *   - DC operating point only (no transient / AC)
 *   - Max 50 nodes (browser-safe)
 *   - LED modeled as fixed forward voltage drop
 */

const LCD_TOLERANCE = 1e-9;

export interface AnalogNode {
    id: string;
    /** Fixed voltage (for battery/ground nodes) — null if floating */
    fixedVoltage: number | null;
}

export interface AnalogResistor {
    from: string;   // node id
    to: string;     // node id
    resistance: number; // ohms
}

export interface AnalogVoltageSource {
    pos: string;    // positive terminal node
    neg: string;    // negative terminal node
    voltage: number;
}

export interface AnalogLED {
    anode: string;
    cathode: string;
    vForward: number;   // e.g. 2.0V
    rDynamic: number;   // dynamic resistance e.g. 50 ohms
}

export interface AnalogCircuit {
    nodes: AnalogNode[];
    resistors: AnalogResistor[];
    sources: AnalogVoltageSource[];
    leds: AnalogLED[];
}

export interface AnalogSolution {
    /** Map from node id → solved voltage in volts */
    voltages: Map<string, number>;
    /** Map from LED id (anode+cathode) → brightness 0..1 */
    ledBrightness: Map<string, number>;
    /** True if the solver converged successfully */
    converged: boolean;
}

export function solveAnalog(circuit: AnalogCircuit): AnalogSolution {
    const ledBrightness = new Map<string, number>();

    // Collect all unique node IDs
    const nodeIds = Array.from(new Set([
        ...circuit.nodes.map(n => n.id),
        ...circuit.resistors.flatMap(r => [r.from, r.to]),
        ...circuit.sources.flatMap(s => [s.pos, s.neg]),
        ...circuit.leds.flatMap(l => [l.anode, l.cathode]),
    ]));

    const N = nodeIds.length;
    const idx = new Map<string, number>();
    nodeIds.forEach((id, i) => idx.set(id, i));

    // Build conductance matrix G (N×N) and RHS b (N×1)
    const G: number[][] = Array.from({ length: N }, () => new Array(N).fill(0));
    const b: number[] = new Array(N).fill(0);

    // Stamp resistors
    for (const r of circuit.resistors) {
        if (r.resistance <= 0) continue;
        const G_val = 1 / r.resistance;
        const i = idx.get(r.from)!;
        const j = idx.get(r.to)!;
        G[i][i] += G_val;
        G[j][j] += G_val;
        G[i][j] -= G_val;
        G[j][i] -= G_val;
    }

    // Stamp LEDs as resistors with voltage offset
    for (const led of circuit.leds) {
        const G_val = 1 / led.rDynamic;
        const i = idx.get(led.anode)!;
        const j = idx.get(led.cathode)!;
        G[i][i] += G_val;
        G[j][j] += G_val;
        G[i][j] -= G_val;
        G[j][i] -= G_val;
        // Current source equivalent for forward voltage
        const I_offset = led.vForward / led.rDynamic;
        b[i] -= I_offset;
        b[j] += I_offset;
    }

    // Apply fixed voltages (boundary conditions)
    const fixedNodes = new Map<string, number>();
    circuit.nodes.forEach(n => {
        if (n.fixedVoltage !== null) fixedNodes.set(n.id, n.fixedVoltage);
    });
    // Ground reference
    fixedNodes.set('GND', 0);

    // Voltage sources: treat as fixed voltage constraints
    for (const src of circuit.sources) {
        fixedNodes.set(src.pos, src.voltage);
        fixedNodes.set(src.neg, 0);
    }

    // Enforce fixed nodes using large stamp method (1T ohm to rail)
    const LARGE = 1e12;
    fixedNodes.forEach((v, nodeId) => {
        const i = idx.get(nodeId);
        if (i === undefined) return;
        G[i][i] += LARGE;
        b[i] += LARGE * v;
    });

    // Gaussian elimination with partial pivoting
    const voltages = gaussEliminate(G, b, N);
    if (!voltages) {
        return { voltages: new Map(), ledBrightness, converged: false };
    }

    const voltageMap = new Map<string, number>();
    nodeIds.forEach((id, i) => voltageMap.set(id, voltages[i]));

    // Compute LED brightnesses
    for (const led of circuit.leds) {
        const vA = voltageMap.get(led.anode) ?? 0;
        const vC = voltageMap.get(led.cathode) ?? 0;
        const vDiode = vA - vC;
        const iLED = Math.max(0, (vDiode - led.vForward) / led.rDynamic);
        const I_MAX = 0.020; // 20mA full brightness
        const brightness = Math.min(1, iLED / I_MAX);
        ledBrightness.set(`${led.anode}-${led.cathode}`, brightness);
    }

    return { voltages: voltageMap, ledBrightness, converged: true };
}

function gaussEliminate(G: number[][], b: number[], N: number): number[] | null {
    // Augmented matrix
    const M = G.map((row, i) => [...row, b[i]]);

    for (let col = 0; col < N; col++) {
        // Partial pivoting
        let maxRow = col;
        let maxVal = Math.abs(M[col][col]);
        for (let row = col + 1; row < N; row++) {
            if (Math.abs(M[row][col]) > maxVal) {
                maxVal = Math.abs(M[row][col]);
                maxRow = row;
            }
        }
        if (maxVal < LCD_TOLERANCE) return null; // singular

        [M[col], M[maxRow]] = [M[maxRow], M[col]];

        const pivot = M[col][col];
        for (let row = col + 1; row < N; row++) {
            const factor = M[row][col] / pivot;
            for (let k = col; k <= N; k++) {
                M[row][k] -= factor * M[col][k];
            }
        }
    }

    // Back substitution
    const x = new Array<number>(N).fill(0);
    for (let i = N - 1; i >= 0; i--) {
        x[i] = M[i][N];
        for (let j = i + 1; j < N; j++) {
            x[i] -= M[i][j] * x[j];
        }
        x[i] /= M[i][i];
    }

    return x;
}
