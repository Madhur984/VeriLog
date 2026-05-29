/**
 * CPUChallenges.ts - Learning progression challenges for CPU Builder
 *
 * Defines challenges from basic single-cycle execution
 * to advanced pipeline optimization.
 */

// import type { CPUChallenge, CPULearningStage } from '../engines/cpu/CPUTypes';

// Stubs for CPU types
export type CPULearningStage = 'single_cycle' | 'multi_cycle' | 'pipelined' | 'hazard_detection' | 'forwarding' | 'branch_prediction';
export interface CPUChallenge {
    id: string;
    stage: CPULearningStage;
    title: string;
    description: string;
    instruction: string;
    expectedResult: any;
    hints: string[];
}

export const CPU_CHALLENGES: CPUChallenge[] = [
    // ─── Stage 1: Single Cycle ─────────────────────────────────────
    {
        id: 'sc-1',
        stage: 'single_cycle',
        title: 'Your First Instruction',
        description: 'Write an ADDI instruction to set register x1 to the value 42.',
        instruction: 'Use: ADDI x1, x0, 42',
        expectedResult: { x1: 42 },
        hints: [
            'ADDI adds an immediate value to a register',
            'x0 is always 0, so ADDI xN, x0, val sets xN = val',
            'Solution: ADDI x1, x0, 42',
        ],
    },
    {
        id: 'sc-2',
        stage: 'single_cycle',
        title: 'Register Arithmetic',
        description: 'Load 15 into x1 and 25 into x2, then compute x3 = x1 + x2.',
        instruction: 'Use ADDI for loading, ADD for summing',
        expectedResult: { x1: 15, x2: 25, x3: 40 },
        hints: [
            'You need three instructions total',
            'First load values with ADDI, then use ADD',
            'ADDI x1, x0, 15 / ADDI x2, x0, 25 / ADD x3, x1, x2',
        ],
    },
    {
        id: 'sc-3',
        stage: 'single_cycle',
        title: 'Bitwise Logic',
        description: 'Compute x3 = x1 AND x2 where x1=0xFF and x2=0x0F. What should x3 be?',
        instruction: 'Use AND instruction for bitwise operation',
        expectedResult: { x1: 255, x2: 15, x3: 15 },
        hints: [
            '0xFF AND 0x0F = keep only the lowest 4 bits',
            'ADDI x1, x0, 255 / ADDI x2, x0, 15 / AND x3, x1, x2',
        ],
    },

    // ─── Stage 2: Multi-Cycle ──────────────────────────────────────
    {
        id: 'mc-1',
        stage: 'multi_cycle',
        title: 'Cycle Counting',
        description: 'Predict how many clock cycles a 5-instruction program takes in single-cycle vs multi-cycle.',
        instruction: 'Single-cycle: 1 CPI. Multi-cycle: varies by instruction type.',
        expectedResult: {},
        hints: [
            'Single-cycle: every instruction takes exactly 1 cycle',
            'Multi-cycle: R-type = 4 cycles, Load = 5 cycles, Store = 4 cycles',
            'Total = sum of cycle counts per instruction',
        ],
    },

    // ─── Stage 3: Pipelined ────────────────────────────────────────
    {
        id: 'pl-1',
        stage: 'pipelined',
        title: 'Pipeline Throughput',
        description: 'How many cycles does a 5-instruction program take with ideal pipelining (no hazards)?',
        instruction: 'Pipeline depth = 5 stages. Ideal CPI = 1.',
        expectedResult: {},
        hints: [
            'First instruction takes 5 cycles to complete',
            'After filling, one instruction completes per cycle',
            'Total = pipeline_depth + (N-1) = 5 + 4 = 9 cycles for 5 instructions',
        ],
    },

    // ─── Stage 4: Hazard Detection ─────────────────────────────────
    {
        id: 'hz-1',
        stage: 'hazard_detection',
        title: 'Data Hazard Identification',
        description: 'In this code, identify the data hazard:\nADD x3, x1, x2\nSUB x4, x3, x1\nWhat type of hazard is this?',
        instruction: 'Look for Read-After-Write (RAW) dependencies',
        expectedResult: {},
        hints: [
            'SUB reads x3, but ADD writes x3 - dependency!',
            'This is a RAW (Read After Write) hazard',
            'Without forwarding, you need 2 stall cycles (or NOP bubbles)',
        ],
    },
    {
        id: 'hz-2',
        stage: 'hazard_detection',
        title: 'Insert NOPs',
        description: 'Add NOP instructions to eliminate the data hazard between ADD x3,x1,x2 and SUB x4,x3,x1.',
        instruction: 'Insert enough NOPs so x3 is written before SUB reads it',
        expectedResult: { x3: 30, x4: 20 },
        hints: [
            'ADD writes x3 in WB stage (cycle 5)',
            'SUB reads x3 in ID stage - must wait until after WB',
            'Insert 2 NOPs between ADD and SUB',
        ],
    },

    // ─── Stage 5: Forwarding ───────────────────────────────────────
    {
        id: 'fw-1',
        stage: 'forwarding',
        title: 'Forwarding Paths',
        description: 'With forwarding enabled, the EX result can bypass the register file. How many stalls remain?',
        instruction: 'EX→EX forwarding eliminates most data hazards',
        expectedResult: {},
        hints: [
            'EX→EX forwarding: if EX stage produces a result, it can be used by the next EX stage directly',
            'MEM→EX forwarding: if MEM stage has a result (e.g., load), it forwards to EX',
            'Load-use hazard still needs 1 stall even with forwarding',
        ],
    },

    // ─── Stage 6: Branch Prediction ────────────────────────────────
    {
        id: 'bp-1',
        stage: 'branch_prediction',
        title: 'Branch Penalty',
        description: 'A branch instruction causes a control hazard. With "predict not taken" strategy, what happens when the branch IS taken?',
        instruction: 'Consider the pipeline stages when the branch resolves',
        expectedResult: {},
        hints: [
            'Branch resolves in EX stage (stage 3)',
            'If prediction is wrong, we already fetched 2 wrong instructions',
            'Penalty = 2 cycles (flush IF and ID stages)',
        ],
    },
];

/**
 * Get challenges for a specific learning stage
 */
export function getChallengesByStage(stage: CPULearningStage): CPUChallenge[] {
    return CPU_CHALLENGES.filter(c => c.stage === stage);
}

/**
 * Get the next unlocked stage based on completed challenges
 */
export function getNextStage(completedIds: string[]): CPULearningStage | null {
    const stages: CPULearningStage[] = [
        'single_cycle', 'multi_cycle', 'pipelined',
        'hazard_detection', 'forwarding', 'branch_prediction',
    ];

    for (const stage of stages) {
        const stageChallenges = getChallengesByStage(stage);
        const allCompleted = stageChallenges.every(c => completedIds.includes(c.id));
        if (!allCompleted) return stage;
    }

    return null; // All completed!
}
