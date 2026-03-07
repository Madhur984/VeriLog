/**
 * engine/gates.ts — Full Digital Gate Library
 *
 * Each gate exports:
 *   evaluate(inputs: boolean[]): boolean   — logic function
 *   params: GateParams                      — timing & default params
 *   truthTable(n: number): TruthRow[]       — auto-generated truth table
 *
 * Propagation delay model (CMOS 180nm typical):
 *   tpdHL = transition time high → low (ns)
 *   tpdLH = transition time low → high (ns)
 */

export interface GateParams {
    tpdHL: number;   // ns
    tpdLH: number;   // ns
    maxFanout: number;
    symbol: string;  // IEEE/ANSI symbol for SVG rendering
    description: string;
}

export interface TruthRow {
    inputs: boolean[];
    output: boolean;
}

export type GateEvaluator = (inputs: boolean[]) => boolean;

export interface GateSpec {
    evaluate: GateEvaluator;
    params: GateParams;
    truthTable: (inputCount: number) => TruthRow[];
}

// ─── Truth Table Generator ────────────────────────────────────────────────────

function makeTruthTable(n: number, fn: GateEvaluator): TruthRow[] {
    const rows: TruthRow[] = [];
    for (let i = 0; i < (1 << n); i++) {
        const inputs = Array.from({ length: n }, (_, bit) =>
            Boolean((i >> (n - 1 - bit)) & 1)
        );
        rows.push({ inputs, output: fn(inputs) });
    }
    return rows;
}

// ─── Gate Definitions ────────────────────────────────────────────────────────

export const AND: GateSpec = {
    evaluate: (ins) => ins.length > 0 && ins.every(Boolean),
    params: {
        tpdHL: 1.8, tpdLH: 2.1, maxFanout: 10,
        symbol: '&',
        description: 'Output HIGH only when ALL inputs are HIGH.',
    },
    truthTable: (n) => makeTruthTable(n, AND.evaluate),
};

export const OR: GateSpec = {
    evaluate: (ins) => ins.some(Boolean),
    params: {
        tpdHL: 2.0, tpdLH: 1.9, maxFanout: 10,
        symbol: '≥1',
        description: 'Output HIGH when ANY input is HIGH.',
    },
    truthTable: (n) => makeTruthTable(n, OR.evaluate),
};

export const NOT: GateSpec = {
    evaluate: ([a]) => !a,
    params: {
        tpdHL: 0.9, tpdLH: 0.8, maxFanout: 15,
        symbol: '1',
        description: 'Inverts the single input.',
    },
    truthTable: () => makeTruthTable(1, NOT.evaluate),
};

export const NAND: GateSpec = {
    evaluate: (ins) => !(ins.length > 0 && ins.every(Boolean)),
    params: {
        tpdHL: 0.9, tpdLH: 1.5, maxFanout: 12,
        symbol: '&',    // with bubble on output in SVG
        description: 'NOT-AND: output LOW only when ALL inputs are HIGH.',
    },
    truthTable: (n) => makeTruthTable(n, NAND.evaluate),
};

export const NOR: GateSpec = {
    evaluate: (ins) => !ins.some(Boolean),
    params: {
        tpdHL: 1.0, tpdLH: 1.8, maxFanout: 12,
        symbol: '≥1',  // with bubble on output
        description: 'NOT-OR: output HIGH only when ALL inputs are LOW.',
    },
    truthTable: (n) => makeTruthTable(n, NOR.evaluate),
};

export const XOR: GateSpec = {
    evaluate: (ins) => ins.reduce((acc, v) => acc !== v, false),
    params: {
        tpdHL: 2.5, tpdLH: 2.7, maxFanout: 8,
        symbol: '=1',
        description: 'Output HIGH when an ODD number of inputs are HIGH.',
    },
    truthTable: (n) => makeTruthTable(n, XOR.evaluate),
};

export const XNOR: GateSpec = {
    evaluate: (ins) => !ins.reduce((acc, v) => acc !== v, false),
    params: {
        tpdHL: 2.6, tpdLH: 2.8, maxFanout: 8,
        symbol: '=1',  // with bubble
        description: 'Output HIGH when an EVEN number of inputs are HIGH.',
    },
    truthTable: (n) => makeTruthTable(n, XNOR.evaluate),
};

export const BUFFER: GateSpec = {
    evaluate: ([a]) => !!a,
    params: {
        tpdHL: 1.0, tpdLH: 1.0, maxFanout: 25,
        symbol: '1',
        description: 'Non-inverting buffer. Strengthens drive before long wire or high fanout.',
    },
    truthTable: () => makeTruthTable(1, BUFFER.evaluate),
};

// ─── Gate Registry ─────────────────────────────────────────────────────────

export const GATES: Record<string, GateSpec> = {
    AND, OR, NOT, NAND, NOR, XOR, XNOR, BUFFER,
};

export function getGate(type: string): GateSpec {
    const gate = GATES[type];
    if (!gate) throw new Error(`Unknown gate type: ${type}`);
    return gate;
}

// ─── D Flip-Flop ─────────────────────────────────────────────────────────────

export function evaluateDFF(
    d: boolean,
    clk: boolean,
    prevClk: boolean,
    prevQ: boolean,
    edge: 'rising' | 'falling' = 'rising'
): { Q: boolean; Qn: boolean } {
    const triggered = edge === 'rising'
        ? (clk && !prevClk)
        : (!clk && prevClk);
    const Q = triggered ? d : prevQ;
    return { Q, Qn: !Q };
}

// ─── SR Latch ─────────────────────────────────────────────────────────────

export function evaluateSRLatch(
    S: boolean,
    R: boolean,
    prevQ: boolean
): { Q: boolean; Qn: boolean } {
    if (S && R) return { Q: prevQ, Qn: !prevQ }; // forbidden state → hold
    if (S) return { Q: true, Qn: false };
    if (R) return { Q: false, Qn: true };
    return { Q: prevQ, Qn: !prevQ }; // hold
}

// ─── JK Flip-Flop ─────────────────────────────────────────────────────────

export function evaluateJKFF(
    J: boolean,
    K: boolean,
    clk: boolean,
    prevClk: boolean,
    prevQ: boolean
): { Q: boolean; Qn: boolean } {
    const rising = clk && !prevClk;
    if (!rising) return { Q: prevQ, Qn: !prevQ };
    if (J && K) return { Q: !prevQ, Qn: prevQ }; // Toggle
    if (J) return { Q: true, Qn: false };
    if (K) return { Q: false, Qn: true };
    return { Q: prevQ, Qn: !prevQ };
}
