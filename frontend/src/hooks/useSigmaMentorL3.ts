/**
 * useSigmaMentorL3.ts — SIGMA Engineering Mentor for Level 3: Binary Awakening
 *
 * SIGMA operates as a senior VLSI/digital design engineer.
 * Responses follow the strict engineering analysis format:
 *   Observation → Analysis → Conclusion → Engineering Insight
 *
 * Performance tiers (rolling last 3 interactions):
 *   sharp      — 3/3 correct → peer-level, minimal guidance
 *   steady     — 2/3 correct → reinforcement with first principles
 *   struggling — 0-1/3       → structured scaffolding
 *
 * Scene contexts: 'switch' | 'counter' | 'register' | 'arithmetic'
 */

import { useCallback, useRef } from 'react';

export type SigmaTier = 'sharp' | 'steady' | 'struggling';
export type L3Scene = 'switch' | 'counter' | 'register' | 'arithmetic';

export interface SigmaResponse {
    observation: string;
    analysis: string;
    conclusion: string;
    insight: string;
    tier: SigmaTier;
}

// ── Message Database ───────────────────────────────────────────────────────────

const SIGMA_DB: Record<L3Scene, Record<SigmaTier, SigmaResponse[]>> = {
    switch: {
        sharp: [
            {
                observation: 'Switch state change detected. Binary digit updated.',
                analysis: 'Logic HIGH (VDD) encodes 1; Logic LOW (GND) encodes 0. This is the foundational abstraction of digital electronics — all information reduces to binary potential states.',
                conclusion: 'The binary string you see IS the voltage pattern across the register inputs.',
                insight: 'In CMOS, HIGH is ~VDD (3.3V or 1.8V) and LOW is ~0V. Noise margins define how far from these rails a signal can deviate while still being correctly interpreted.',
                tier: 'sharp',
            },
            {
                observation: 'Switch configuration: voltage states mapped to binary representation.',
                analysis: '2^4 = 16 unique states are available with 4 bits. This is a 4-bit register operating in combinational mode — no clock, purely combinational logic from switch inputs.',
                conclusion: 'This topology maps directly to a 4-bit DIP switch input in real embedded hardware.',
                insight: 'Hardware engineers use pull-up/pull-down resistors to define the default (un-toggled) state of switches, preventing floating inputs.',
                tier: 'sharp',
            },
        ],
        steady: [
            {
                observation: 'Switch toggled. Binary output changed.',
                analysis: 'Digital systems represent information using only two voltage levels. The switch acts as a manual signal generator, setting a node to HIGH or LOW. Each bit position represents a power of 2.',
                conclusion: 'Binary 0110 means: bit3=0 (×8), bit2=1 (×4), bit1=1 (×2), bit0=0 (×1) = decimal 6.',
                insight: 'Every FPGA input pin works on this principle — external signals are interpreted as HIGH or LOW based on threshold voltages defined in the I/O standard.',
                tier: 'steady',
            },
        ],
        struggling: [
            {
                observation: 'Switch interaction detected. Binary display updated correspondingly.',
                analysis: 'A digital system knows only two states: ON (1) and OFF (0). The switch physically connects or disconnects a voltage level to a circuit node, producing that binary value.',
                conclusion: 'When switch 2 is ON: bit 2 = 1. When switch 2 is OFF: bit 2 = 0. The binary number shows which switches are ON.',
                insight: 'Start by toggling one switch at a time and observing which bit changes. This builds the position-to-value relationship before working with the full 4-bit pattern.',
                tier: 'struggling',
            },
        ],
    },

    counter: {
        sharp: [
            {
                observation: 'Counter incremented. Carry propagation chain updated.',
                analysis: 'Ripple carry propagation: each bit evaluates sequentially from LSB. Bits remain unchanged until carry reaches them. This creates a ripple delay proportional to input magnitude.',
                conclusion: 'Propagation delay in a 4-bit ripple counter = 4 × Tpd_gate. For a 32-bit counter, this delay determines maximum clock frequency.',
                insight: 'Carry lookahead adder (CLA) architecture eliminates the ripple by computing all carries simultaneously using Boolean expressions of only the primary inputs.',
                tier: 'sharp',
            },
            {
                observation: 'Binary counter: state transition from ' + '0000 to 0001',
                analysis: 'The counter implements binary modular arithmetic (mod 16). The XOR-with-carry structure in a synchronous counter ensures all bits update simultaneously on clock edge.',
                conclusion: 'Synchronous counters eliminate the timing hazards of ripple designs. All flip-flops see the same clock edge.',
                insight: 'In Verilog: `always @(posedge clk) count <= count + 1;` synthesizes to a synchronous 4-bit counter with carry chain automatically resolved by the synthesizer.',
                tier: 'sharp',
            },
        ],
        steady: [
            {
                observation: 'Counter incremented. Bit pattern changed.',
                analysis: 'Binary counting follows positional arithmetic. When bit 0 overflows (1 + 1 = 10 in binary), it resets to 0 and generates a carry into bit 1. This carry propagates rightward until a 0-bit absorbs it.',
                conclusion: '0111 + 1 = 1000: all three 1-bits carry simultaneously, resetting to 0 and carrying into the MSB position.',
                insight: 'The number of carry events per increment decreases exponentially with bit position — bit 0 carries 50% of the time, bit 1 carries 25%, bit 2 carries 12.5%.',
                tier: 'steady',
            },
        ],
        struggling: [
            {
                observation: 'Counter value increased by 1.',
                analysis: 'Binary counting is like counting on an abacus where each column can only hold 0 or 1. When a column fills up (1+1=2), it resets to 0 and adds 1 to the column on the left, called a "carry".',
                conclusion: 'Count to 15 (1111) and click again to see the counter wrap around to 0 (0000). This is called overflow.',
                insight: 'Try to predict the next binary value before clicking increment. The rule: find the rightmost 0 bit, set it to 1, and set all bits to its right to 0.',
                tier: 'struggling',
            },
        ],
    },

    register: {
        sharp: [
            {
                observation: '8-bit register state modified.',
                analysis: '8-bit two\'s complement range: -128 to +127 (signed), 0 to 255 (unsigned). The register stores 1 byte — the fundamental unit of addressable memory in modern von Neumann architectures.',
                conclusion: 'Hex display confirms: 8 binary bits map to exactly 2 hex digits, making hex the natural shorthand for register state representation.',
                insight: 'In real CPU architectures, registers are implemented as D flip-flop arrays — each bit is one FF clocked synchronously. 8 flip-flops = 1 byte of register storage.',
                tier: 'sharp',
            },
        ],
        steady: [
            {
                observation: 'Register bit pattern updated.',
                analysis: 'An 8-bit register can represent 2^8 = 256 unique values (0–255). The hex display converts groups of 4 bits: upper nibble (bits 7–4) → first hex digit, lower nibble (bits 3–0) → second hex digit.',
                conclusion: 'Binary 10110100 = 0xB4. B = 1011 (11 in decimal), 4 = 0100. Store the value and observe the decimal equivalent.',
                insight: 'A 32-bit CPU register holds 4 bytes and can represent 2^32 = 4,294,967,296 unique values — the basis for the 4GB address space limitation of 32-bit systems.',
                tier: 'steady',
            },
        ],
        struggling: [
            {
                observation: 'Bit changed in register view.',
                analysis: 'A register is like a row of light switches, each storing a 0 or 1. The CPU can read and write these bits very quickly. 8 bits = 1 byte of information.',
                conclusion: 'Try writing the pattern 0101 0101 (alternating 1s and 0s). The decimal value is 85, and hex is 0x55.',
                insight: 'Hexadecimal (0-F) is used by engineers because one hex digit perfectly represents 4 binary bits, making it easier to read long binary patterns.',
                tier: 'struggling',
            },
        ],
    },

    arithmetic: {
        sharp: [
            {
                observation: 'Binary addition initiated. Ripple carry sequence computed.',
                analysis: 'Full adder truth table: S = A ⊕ B ⊕ Cin; Cout = (A·B) + (B·Cin) + (A·Cin). The carry path is the critical timing path in binary adders, determining maximum operational frequency.',
                conclusion: 'For N-bit ripple carry adder, worst-case delay = N × Tpd_FA. CLA reduces this to O(log N) by computing all carries in parallel.',
                insight: 'Modern CPUs use modified Booth encoding + Wallace tree reduction + carry-save adders to achieve multiplication in O(log N) time rather than O(N) repeated addition.',
                tier: 'sharp',
            },
        ],
        steady: [
            {
                observation: 'Binary addition in progress. Column-by-column carry propagation visible.',
                analysis: 'Binary addition follows the same rules as decimal, but with only two digits. 1+1=10 in binary (write 0, carry 1). The carry bit from each column feeds into the next — this is the "ripple" in ripple carry.',
                conclusion: 'Trace each column from right to left: the carry-in of each column is the carry-out of the previous. Sum the three inputs (A, B, carry_in) for each column.',
                insight: 'The ripple carry adder you see here is exactly what the ALU inside every CPU contains, just with 64 bits instead of 4.',
                tier: 'steady',
            },
        ],
        struggling: [
            {
                observation: 'Addition started. Watch each column compute its result.',
                analysis: 'Binary addition column by column: 0+0=0, 1+0=1, 0+1=1, 1+1=0 (carry 1). The carry is a "1" that moves to the next column, like carrying a "10" in decimal addition.',
                conclusion: 'Follow the highlighted carry bit as it moves left. When it arrives at a column, it\'s added to A and B in that column.',
                insight: 'Practice with small numbers first: try adding 0001 + 0001 = 0010 (1+1=2), then 0011 + 0001 = 0100 (3+1=4).',
                tier: 'struggling',
            },
        ],
    },
};

// ── Hook ───────────────────────────────────────────────────────────────────────

export function useSigmaMentorL3() {
    const interactionHistory = useRef<boolean[]>([]);
    const usedIndices = useRef<Record<string, Set<number>>>({});

    const recordInteraction = useCallback((success: boolean) => {
        interactionHistory.current = [...interactionHistory.current.slice(-2), success];
    }, []);

    const getTier = useCallback((): SigmaTier => {
        const hist = interactionHistory.current;
        if (hist.length === 0) return 'steady';
        const successes = hist.filter(Boolean).length;
        if (successes === hist.length && hist.length >= 2) return 'sharp';
        if (successes >= Math.ceil(hist.length * 0.6)) return 'steady';
        return 'struggling';
    }, []);

    const getResponse = useCallback((scene: L3Scene): SigmaResponse => {
        const tier = getTier();
        const pool = SIGMA_DB[scene][tier];
        const key = `${scene}-${tier}`;
        if (!usedIndices.current[key]) usedIndices.current[key] = new Set();
        const used = usedIndices.current[key];

        let available = pool.map((_, i) => i).filter((i) => !used.has(i));
        if (available.length === 0) {
            used.clear();
            available = pool.map((_, i) => i);
        }
        const idx = available[Math.floor(Math.random() * available.length)];
        used.add(idx);
        return pool[idx];
    }, [getTier]);

    return { recordInteraction, getResponse, getTier };
}
