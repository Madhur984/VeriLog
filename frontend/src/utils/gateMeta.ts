// ─── GATE_META STUB ─────────────────────────────────────────────────────────
export type GateId = 'AND' | 'OR' | 'NOT' | 'NAND' | 'NOR' | 'XOR' | 'XNOR' | 'BUFFER';

export interface GateMetadata {
    id: GateId;
    color: string;
    accentBg: string;
    inputs: number;
    symbol: string;
    equation: string;
    label: string;
    description: string;
    humanRule: string;
    humanExample: string;
    cmosNote: string;
    evaluate: (inputs: boolean[]) => boolean;
    getTruthTable: () => Array<{ inputs: boolean[]; output: boolean }>;
}

const generateTruthTable = (inputs: number, evaluate: (inputs: boolean[]) => boolean) => {
    const rows = inputs === 1 ? [[false], [true]] : [[false, false], [false, true], [true, false], [true, true]];
    return rows.map(inps => ({ inputs: inps, output: evaluate(inps) }));
};

export const GATE_META: Record<GateId, GateMetadata> = {
    AND: {
        id: 'AND', color: '#10B981', accentBg: 'rgba(16,185,129,0.1)', inputs: 2, symbol: '(&)', equation: 'Y = A · B',
        label: 'AND Gate', 
        description: 'Outputs 1 only if BOTH inputs are 1.',
        humanRule: 'Everything must be YES',
        humanExample: 'Picnic: Sunny AND Not Raining? Only then you go.',
        cmosNote: 'Uses 4 transistors in CMOS.',
        evaluate: (inps) => inps[0] && inps[1],
        getTruthTable: () => generateTruthTable(2, (inps) => inps[0] && inps[1])
    },
    OR: {
        id: 'OR', color: '#00D4FF', accentBg: 'rgba(0,212,255,0.1)', inputs: 2, symbol: '(≥1)', equation: 'Y = A + B',
        label: 'OR Gate', 
        description: 'Outputs 1 if AT LEAST ONE input is 1.',
        humanRule: 'At least one YES is enough',
        humanExample: 'Ice Cream: You have money OR your friend pays. You get it.',
        cmosNote: 'Uses 6 transistors in CMOS.',
        evaluate: (inps) => inps[0] || inps[1],
        getTruthTable: () => generateTruthTable(2, (inps) => inps[0] || inps[1])
    },
    NOT: {
        id: 'NOT', color: '#EF4444', accentBg: 'rgba(239,68,68,0.1)', inputs: 1, symbol: '(1)', equation: 'Y = NOT A',
        label: 'Inverter', 
        description: 'Outputs the OPPOSITE of the input.',
        humanRule: 'The Reverser',
        humanExample: 'Reverse switch: Down (0) turns light ON (1). Up (1) turns it OFF (0).',
        cmosNote: 'Simplest CMOS gate (2 transistors).',
        evaluate: (inps) => !inps[0],
        getTruthTable: () => generateTruthTable(1, (inps) => !inps[0])
    },
    NAND: {
        id: 'NAND', color: '#F59E0B', accentBg: 'rgba(245,158,11,0.1)', inputs: 2, symbol: '(⊼)', equation: 'Y = NOT (A · B)',
        label: 'NAND Gate', 
        description: 'Universal gate: 0 only if both inputs are 1.',
        humanRule: 'AND followed by NOT',
        humanExample: 'Opposite of AND: Only stay home if BOTH friends go to the party.',
        cmosNote: 'The "Native" CMOS gate (4 transistors).',
        evaluate: (inps) => !(inps[0] && inps[1]),
        getTruthTable: () => generateTruthTable(2, (inps) => !(inps[0] && inps[1]))
    },
    NOR: {
        id: 'NOR', color: '#8B5CF6', accentBg: 'rgba(139,92,246,0.1)', inputs: 2, symbol: '(⊽)', equation: 'Y = NOT (A + B)',
        label: 'NOR Gate', 
        description: 'Universal gate: 1 only if both inputs are 0.',
        humanRule: 'OR followed by NOT',
        humanExample: 'Opposite of OR: Eat dessert only if you had neither cake nor ice cream.',
        cmosNote: 'Often slower than NAND in silicon.',
        evaluate: (inps) => !(inps[0] || inps[1]),
        getTruthTable: () => generateTruthTable(2, (inps) => !(inps[0] || inps[1]))
    },
    XOR: {
        id: 'XOR', color: '#EC4899', accentBg: 'rgba(236,72,153,0.1)', inputs: 2, symbol: '(=1)', equation: 'Y = A ⊕ B',
        label: 'XOR Gate', 
        description: 'Outputs 1 if inputs are DIFFERENT.',
        humanRule: 'Either one, but NOT both',
        humanExample: 'Order: Tea OR Coffee. Order both? Waiter says No (0).',
        cmosNote: 'Critical for arithmetic units (adders).',
        evaluate: (inps) => inps[0] !== inps[1],
        getTruthTable: () => generateTruthTable(2, (inps) => inps[0] !== inps[1])
    },
    XNOR: {
        id: 'XNOR', color: '#6366F1', accentBg: 'rgba(99,102,241,0.1)', inputs: 2, symbol: '(=)', equation: 'Y = A ↔ B',
        label: 'XNOR Gate', 
        description: 'Outputs 1 if inputs are EQUAL.',
        humanRule: 'Equality checker',
        humanExample: 'Handshake: Success (1) only if you both do the same move.',
        cmosNote: 'Used in bitwise comparators.',
        evaluate: (inps) => inps[0] === inps[1],
        getTruthTable: () => generateTruthTable(2, (inps) => inps[0] === inps[1])
    },
    BUFFER: {
        id: 'BUFFER', color: '#94A3B8', accentBg: 'rgba(148,163,184,0.1)', inputs: 1, symbol: '(1)', equation: 'Y = A',
        label: 'Buffer', 
        description: 'Passes signal through (current drive).',
        humanRule: 'The Follower',
        humanExample: 'Strict Mirror: Whatever input does, output follows exactly.',
        cmosNote: 'Used for clock signals and fan-out.',
        evaluate: (inps) => inps[0],
        getTruthTable: () => generateTruthTable(1, (inps) => inps[0])
    },
};

export const GATE_ORDER: GateId[] = ['AND', 'OR', 'NOT', 'NAND', 'NOR', 'XOR', 'XNOR'];
