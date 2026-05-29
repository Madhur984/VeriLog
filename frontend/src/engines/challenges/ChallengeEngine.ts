/**
 * ChallengeEngine.ts - Hardware LeetCode challenge system
 *
 * Defines challenge types, verification engine, and scoring.
 * Challenges require building circuits that match expected truth tables.
 */

// ─── Types ──────────────────────────────────────────────────────────────

export type ChallengeDifficulty = 'easy' | 'medium' | 'hard' | 'expert';

export type ChallengeCategory =
    | 'gates'
    | 'combinational'
    | 'sequential'
    | 'arithmetic'
    | 'state_machines'
    | 'timing'
    | 'optimization';

export interface TruthTableRow {
    inputs: Record<string, boolean>;
    expectedOutputs: Record<string, boolean>;
}

export interface HardwareChallenge {
    id: string;
    title: string;
    description: string;
    difficulty: ChallengeDifficulty;
    category: ChallengeCategory;
    xpReward: number;
    timeLimit: number;        // seconds, 0 = no limit
    gateLimit: number;        // max gates allowed, 0 = no limit
    inputSignals: string[];
    outputSignals: string[];
    truthTable: TruthTableRow[];
    hints: string[];
    examples: string[];
    constraints: string[];
    tags: string[];
    solvedCount: number;
    acceptanceRate: number;
}

export interface ChallengeAttempt {
    challengeId: string;
    userId: string;
    circuitData: string;
    gatesUsed: number;
    timeTaken: number;        // seconds
    passed: boolean;
    passedRows: number;
    totalRows: number;
    score: number;
    submittedAt: string;
}

export interface ChallengeResult {
    passed: boolean;
    passedRows: number;
    totalRows: number;
    failedRows: TruthTableRow[];
    gatesUsed: number;
    timeTaken: number;
    score: number;
    xpEarned: number;
    badges: string[];
}

// ─── Verification Engine ────────────────────────────────────────────────

export class ChallengeVerifier {
    /**
     * Verify a circuit's outputs against the expected truth table.
     * @param truthTable - expected truth table
     * @param circuitOutputs - actual outputs from user's circuit
     * @param gatesUsed - number of gates in user's circuit
     * @param timeTaken - seconds taken to solve
     * @param challenge - the challenge definition (for limits and scoring)
     */
    verify(
        truthTable: TruthTableRow[],
        circuitOutputs: Record<string, boolean>[],
        gatesUsed: number,
        timeTaken: number,
        challenge: HardwareChallenge,
    ): ChallengeResult {
        let passedRows = 0;
        const failedRows: TruthTableRow[] = [];

        for (let i = 0; i < truthTable.length; i++) {
            const expected = truthTable[i];
            const actual = circuitOutputs[i];

            if (!actual) {
                failedRows.push(expected);
                continue;
            }

            let rowPassed = true;
            for (const [signal, expectedVal] of Object.entries(expected.expectedOutputs)) {
                if (actual[signal] !== expectedVal) {
                    rowPassed = false;
                    break;
                }
            }

            if (rowPassed) {
                passedRows++;
            } else {
                failedRows.push(expected);
            }
        }

        const allPassed = passedRows === truthTable.length;

        // Gate limit check
        const withinGateLimit = challenge.gateLimit === 0 || gatesUsed <= challenge.gateLimit;

        // Time limit check
        const withinTimeLimit = challenge.timeLimit === 0 || timeTaken <= challenge.timeLimit;

        const passed = allPassed && withinGateLimit && withinTimeLimit;

        // Score calculation
        const score = this.calculateScore(
            passedRows, truthTable.length,
            gatesUsed, challenge.gateLimit,
            timeTaken, challenge.timeLimit,
            challenge.difficulty,
        );

        // XP earned
        const xpEarned = passed ? challenge.xpReward : Math.floor(challenge.xpReward * (passedRows / truthTable.length) * 0.25);

        // Badges
        const badges = this.determineBadges(passed, gatesUsed, challenge.gateLimit, timeTaken, challenge.timeLimit);

        return {
            passed,
            passedRows,
            totalRows: truthTable.length,
            failedRows,
            gatesUsed,
            timeTaken,
            score,
            xpEarned,
            badges,
        };
    }

    private calculateScore(
        passedRows: number, totalRows: number,
        gatesUsed: number, gateLimit: number,
        timeTaken: number, timeLimit: number,
        difficulty: ChallengeDifficulty,
    ): number {
        const diffMultiplier: Record<ChallengeDifficulty, number> = {
            easy: 1, medium: 1.5, hard: 2, expert: 3,
        };

        // Base score from correctness
        let score = (passedRows / totalRows) * 100;

        // Gate efficiency bonus (up to 50 points)
        if (gateLimit > 0 && gatesUsed <= gateLimit) {
            const gateEfficiency = 1 - (gatesUsed / gateLimit);
            score += gateEfficiency * 50;
        }

        // Speed bonus (up to 30 points)
        if (timeLimit > 0 && timeTaken <= timeLimit) {
            const speedBonus = 1 - (timeTaken / timeLimit);
            score += speedBonus * 30;
        }

        // Apply difficulty multiplier
        score *= diffMultiplier[difficulty];

        return Math.round(score);
    }

    private determineBadges(
        passed: boolean,
        gatesUsed: number, gateLimit: number,
        timeTaken: number, timeLimit: number,
    ): string[] {
        const badges: string[] = [];

        if (!passed) return badges;

        badges.push('solver');

        // Speed demon - solved in less than 50% of time limit
        if (timeLimit > 0 && timeTaken < timeLimit * 0.5) {
            badges.push('speed_demon');
        }

        // Minimalist - used less than 50% of gate limit
        if (gateLimit > 0 && gatesUsed < gateLimit * 0.5) {
            badges.push('minimalist');
        }

        // Perfect - used exactly the minimum gates
        if (gateLimit > 0 && gatesUsed <= Math.ceil(gateLimit * 0.3)) {
            badges.push('optimal');
        }

        return badges;
    }
}

// ─── Challenge Library ──────────────────────────────────────────────────

export const HARDWARE_CHALLENGES: HardwareChallenge[] = [
    // Easy
    {
        id: 'hw-1',
        title: 'AND Gate',
        description: 'Build a circuit that performs the AND operation on two inputs.',
        difficulty: 'easy',
        category: 'gates',
        xpReward: 50,
        timeLimit: 120,
        gateLimit: 1,
        inputSignals: ['A', 'B'],
        outputSignals: ['Y'],
        truthTable: [
            { inputs: { A: false, B: false }, expectedOutputs: { Y: false } },
            { inputs: { A: false, B: true }, expectedOutputs: { Y: false } },
            { inputs: { A: true, B: false }, expectedOutputs: { Y: false } },
            { inputs: { A: true, B: true }, expectedOutputs: { Y: true } },
        ],
        hints: ['An AND gate outputs 1 only when both inputs are 1'],
        examples: ['Think of it as: both switches must be ON for the light to turn on'],
        constraints: ['Use only 1 gate'],
        tags: ['and', 'basic'],
        solvedCount: 1247,
        acceptanceRate: 0.95,
    },
    {
        id: 'hw-2',
        title: 'XOR Gate',
        description: 'Build a circuit that outputs 1 when inputs differ.',
        difficulty: 'easy',
        category: 'gates',
        xpReward: 75,
        timeLimit: 180,
        gateLimit: 4,
        inputSignals: ['A', 'B'],
        outputSignals: ['Y'],
        truthTable: [
            { inputs: { A: false, B: false }, expectedOutputs: { Y: false } },
            { inputs: { A: false, B: true }, expectedOutputs: { Y: true } },
            { inputs: { A: true, B: false }, expectedOutputs: { Y: true } },
            { inputs: { A: true, B: true }, expectedOutputs: { Y: false } },
        ],
        hints: [
            'XOR = "exclusive or" - outputs 1 when exactly one input is 1',
            'Can be built from AND, OR, and NOT gates',
            'XOR = (A AND NOT B) OR (NOT A AND B)',
        ],
        examples: ['Think of a light switch at each end of a hallway - either switch can toggle the light'],
        constraints: ['Use at most 4 gates'],
        tags: ['xor', 'basic'],
        solvedCount: 892,
        acceptanceRate: 0.88,
    },

    // Medium
    {
        id: 'hw-3',
        title: 'Half Adder',
        description: 'Build a half adder that produces Sum and Carry from two 1-bit inputs.',
        difficulty: 'medium',
        category: 'arithmetic',
        xpReward: 150,
        timeLimit: 300,
        gateLimit: 5,
        inputSignals: ['A', 'B'],
        outputSignals: ['Sum', 'Carry'],
        truthTable: [
            { inputs: { A: false, B: false }, expectedOutputs: { Sum: false, Carry: false } },
            { inputs: { A: false, B: true }, expectedOutputs: { Sum: true, Carry: false } },
            { inputs: { A: true, B: false }, expectedOutputs: { Sum: true, Carry: false } },
            { inputs: { A: true, B: true }, expectedOutputs: { Sum: false, Carry: true } },
        ],
        hints: [
            'Sum is the XOR of A and B',
            'Carry is the AND of A and B',
            'A half adder is just XOR + AND',
        ],
        examples: ['0+0=00, 0+1=01, 1+0=01, 1+1=10 (in binary: Sum is the ones digit, Carry is the twos digit)'],
        constraints: ['Use at most 5 gates'],
        tags: ['adder', 'arithmetic'],
        solvedCount: 654,
        acceptanceRate: 0.82,
    },
    {
        id: 'hw-4',
        title: '2-to-1 Multiplexer',
        description: 'Build a 2-to-1 MUX: when Sel=0, output I0; when Sel=1, output I1.',
        difficulty: 'medium',
        category: 'combinational',
        xpReward: 125,
        timeLimit: 240,
        gateLimit: 4,
        inputSignals: ['I0', 'I1', 'Sel'],
        outputSignals: ['Y'],
        truthTable: [
            { inputs: { I0: false, I1: false, Sel: false }, expectedOutputs: { Y: false } },
            { inputs: { I0: false, I1: true, Sel: false }, expectedOutputs: { Y: false } },
            { inputs: { I0: true, I1: false, Sel: false }, expectedOutputs: { Y: true } },
            { inputs: { I0: true, I1: true, Sel: false }, expectedOutputs: { Y: true } },
            { inputs: { I0: false, I1: false, Sel: true }, expectedOutputs: { Y: false } },
            { inputs: { I0: false, I1: true, Sel: true }, expectedOutputs: { Y: true } },
            { inputs: { I0: true, I1: false, Sel: true }, expectedOutputs: { Y: false } },
            { inputs: { I0: true, I1: true, Sel: true }, expectedOutputs: { Y: true } },
        ],
        hints: [
            'Y = (NOT Sel AND I0) OR (Sel AND I1)',
            'Think of Sel as choosing which input to pass through',
        ],
        examples: ['A MUX is like a switch - it selects between two data lines'],
        constraints: ['Use at most 4 gates (AND, OR, NOT)'],
        tags: ['mux', 'selector'],
        solvedCount: 523,
        acceptanceRate: 0.78,
    },

    // Hard
    {
        id: 'hw-5',
        title: 'Full Adder',
        description: 'Build a full adder with three inputs (A, B, Cin) producing Sum and Cout.',
        difficulty: 'hard',
        category: 'arithmetic',
        xpReward: 250,
        timeLimit: 600,
        gateLimit: 9,
        inputSignals: ['A', 'B', 'Cin'],
        outputSignals: ['Sum', 'Cout'],
        truthTable: [
            { inputs: { A: false, B: false, Cin: false }, expectedOutputs: { Sum: false, Cout: false } },
            { inputs: { A: false, B: false, Cin: true }, expectedOutputs: { Sum: true, Cout: false } },
            { inputs: { A: false, B: true, Cin: false }, expectedOutputs: { Sum: true, Cout: false } },
            { inputs: { A: false, B: true, Cin: true }, expectedOutputs: { Sum: false, Cout: true } },
            { inputs: { A: true, B: false, Cin: false }, expectedOutputs: { Sum: true, Cout: false } },
            { inputs: { A: true, B: false, Cin: true }, expectedOutputs: { Sum: false, Cout: true } },
            { inputs: { A: true, B: true, Cin: false }, expectedOutputs: { Sum: false, Cout: true } },
            { inputs: { A: true, B: true, Cin: true }, expectedOutputs: { Sum: true, Cout: true } },
        ],
        hints: [
            'A full adder can be built from two half adders and an OR gate',
            'Sum = A XOR B XOR Cin',
            'Cout = (A AND B) OR (Cin AND (A XOR B))',
        ],
        examples: ['A full adder adds three bits: A + B + Cin = {Cout, Sum}'],
        constraints: ['Use at most 9 gates'],
        tags: ['adder', 'arithmetic', 'carry'],
        solvedCount: 312,
        acceptanceRate: 0.65,
    },

    // Expert
    {
        id: 'hw-6',
        title: '4-bit Comparator',
        description: 'Build a circuit that compares two 4-bit numbers and outputs GT (A>B), EQ (A=B), LT (A<B).',
        difficulty: 'expert',
        category: 'combinational',
        xpReward: 500,
        timeLimit: 0,
        gateLimit: 0,
        inputSignals: ['A3', 'A2', 'A1', 'A0', 'B3', 'B2', 'B1', 'B0'],
        outputSignals: ['GT', 'EQ', 'LT'],
        truthTable: [], // Too large for full truth table - verified programmatically
        hints: [
            'Compare from the most significant bit down',
            'If A3 > B3, then A > B regardless of lower bits',
            'If A3 = B3, compare A2 with B2, and so on',
        ],
        examples: ['1010 vs 0110: A3=1 > B3=0, so A > B → GT=1, EQ=0, LT=0'],
        constraints: [],
        tags: ['comparator', 'multi-bit'],
        solvedCount: 87,
        acceptanceRate: 0.42,
    },
];

/**
 * Get challenges by difficulty level
 */
export function getChallengesByDifficulty(difficulty: ChallengeDifficulty): HardwareChallenge[] {
    return HARDWARE_CHALLENGES.filter(c => c.difficulty === difficulty);
}

/**
 * Get challenges by category
 */
export function getChallengesByCategory(category: ChallengeCategory): HardwareChallenge[] {
    return HARDWARE_CHALLENGES.filter(c => c.category === category);
}
