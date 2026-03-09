/**
 * gateMeta.ts — Level 4 UI Metadata for all Logic Gates
 *
 * Ties together the existing gates.ts evaluators with UI display data
 * (color, label, SIGMA engineering facts) for use in ModuleFour scenes.
 */

import { AND, OR, NOT, NAND, NOR, XOR, XNOR, type TruthRow } from '../engine/gates';

export type GateId = 'AND' | 'OR' | 'NOT' | 'NAND' | 'NOR' | 'XOR' | 'XNOR';

export interface GateMeta {
    id: GateId;
    label: string;
    symbol: string;
    inputs: 1 | 2;
    color: string;
    accentBg: string;  // rgba background for cards
    description: string;
    equation: string;
    cmosNote: string;   // engineering insight about CMOS realization
    getTruthTable: () => TruthRow[];
    evaluate: (inputs: boolean[]) => boolean;
}

export const GATE_META: Record<GateId, GateMeta> = {
    AND: {
        id: 'AND', label: 'AND Gate', symbol: '&', inputs: 2,
        color: '#00D4FF', accentBg: 'rgba(0,212,255,0.08)',
        description: 'Output HIGH only when ALL inputs are HIGH.',
        equation: 'Y = A · B',
        cmosNote: 'CMOS AND = NAND + NOT. 6 transistors for 2-input.',
        getTruthTable: () => AND.truthTable(2),
        evaluate: AND.evaluate,
    },
    OR: {
        id: 'OR', label: 'OR Gate', symbol: '≥1', inputs: 2,
        color: '#10B981', accentBg: 'rgba(16,185,129,0.08)',
        description: 'Output HIGH when ANY input is HIGH.',
        equation: 'Y = A + B',
        cmosNote: 'CMOS OR = NOR + NOT. Series pMOS, parallel nMOS.',
        getTruthTable: () => OR.truthTable(2),
        evaluate: OR.evaluate,
    },
    NOT: {
        id: 'NOT', label: 'NOT Gate', symbol: '1', inputs: 1,
        color: '#F59E0B', accentBg: 'rgba(245,158,11,0.08)',
        description: 'Output is the logical inverse of the input.',
        equation: 'Y = Ā',
        cmosNote: 'Simplest CMOS gate: 1 pMOS pull-up + 1 nMOS pull-down. 2 transistors.',
        getTruthTable: () => NOT.truthTable(1),
        evaluate: NOT.evaluate,
    },
    NAND: {
        id: 'NAND', label: 'NAND Gate', symbol: '⊼', inputs: 2,
        color: '#a78bfa', accentBg: 'rgba(167,139,250,0.08)',
        description: 'NOT-AND: output LOW only when ALL inputs are HIGH.',
        equation: 'Y = ¬(A · B)',
        cmosNote: 'The universal gate. Minimum transistor count (4T). Preferred in layout.',
        getTruthTable: () => NAND.truthTable(2),
        evaluate: NAND.evaluate,
    },
    NOR: {
        id: 'NOR', label: 'NOR Gate', symbol: '⊽', inputs: 2,
        color: '#f43f5e', accentBg: 'rgba(244,63,94,0.08)',
        description: 'NOT-OR: output HIGH only when ALL inputs are LOW.',
        equation: 'Y = ¬(A + B)',
        cmosNote: 'Also universal. Parallel pMOS (slower pull-up). Series nMOS.',
        getTruthTable: () => NOR.truthTable(2),
        evaluate: NOR.evaluate,
    },
    XOR: {
        id: 'XOR', label: 'XOR Gate', symbol: '=1', inputs: 2,
        color: '#fb923c', accentBg: 'rgba(251,146,60,0.08)',
        description: 'Output HIGH when inputs DIFFER (parity detector).',
        equation: 'Y = A ⊕ B',
        cmosNote: 'Requires 8–12 transistors in CMOS. Critical path in adders.',
        getTruthTable: () => XOR.truthTable(2),
        evaluate: XOR.evaluate,
    },
    XNOR: {
        id: 'XNOR', label: 'XNOR Gate', symbol: '⊙', inputs: 2,
        color: '#34d399', accentBg: 'rgba(52,211,153,0.08)',
        description: 'Output HIGH when inputs are EQUAL (equality detector).',
        equation: 'Y = ¬(A ⊕ B)',
        cmosNote: 'Used in comparators. XNOR = XOR + NOT (10–14 transistors).',
        getTruthTable: () => XNOR.truthTable(2),
        evaluate: XNOR.evaluate,
    },
};

export const GATE_ORDER: GateId[] = ['AND', 'OR', 'NOT', 'NAND', 'NOR', 'XOR', 'XNOR'];
