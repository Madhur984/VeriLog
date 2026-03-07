/**
 * useVoltMonkeyMentor.ts — Adaptive VoltMonkey Mentor System
 *
 * VoltMonkey operates as a senior hardware architect, not an instructor.
 * Tone is strictly analytical. No emotional encouragement.
 *
 * Performance tiers (rolling last 3 answers):
 *   sharp     — 3/3 correct → peer-level minimal feedback
 *   steady    — 2/3 correct → reinforcement of principle
 *   struggling — 0-1/3    → first-principles reasoning
 *
 * Additional tracking:
 *   hesitationMs — time-to-answer; high hesitation = different VoltMonkey message
 *
 * Response format:
 *   { obs: string; why: string; action: string; tier: Tier }
 *
 * Scene contexts: 'lab' | 'quiz' | 'matching' | 'blanks' | 'diagnosis'
 */

import { useCallback, useRef } from 'react';

export type Tier = 'sharp' | 'steady' | 'struggling';
export type SceneCtx = 'lab' | 'quiz' | 'matching' | 'blanks' | 'diagnosis';

export interface VoltMonkeyResponse {
    obs: string;
    why: string;
    conclusion: string;
    tier: Tier;
}

// ── Message Pools ─────────────────────────────────────────────────────────────

const MSG: Record<SceneCtx, Record<Tier, VoltMonkeyResponse[]>> = {
    lab: {
        sharp: [
            {
                obs: 'Return path established. Circuit closed.',
                why: 'KCL is satisfied at every node: I_in = I_out. No current accumulates.',
                conclusion: 'Proceed. This invariant holds across all network topologies.',
                tier: 'sharp',
            },
            {
                obs: 'Loop closed. Load energized.',
                why: 'Continuous conducting path allows charge carrier flow. Open path = zero current, regardless of voltage.',
                conclusion: 'Note: In CMOS, this same invariant governs pull-up/pull-down network design.',
                tier: 'sharp',
            },
        ],
        steady: [
            {
                obs: 'Circuit completed.',
                why: 'Current requires a continuous path from + terminal through load back to − terminal. Without return path, potential difference exists but current is zero.',
                conclusion: 'Verify: what happens if the return wire is removed after closing?',
                tier: 'steady',
            },
        ],
        struggling: [
            {
                obs: 'The wire has been connected to the load socket.',
                why: 'Electricity is charge movement. Charge cannot accumulate — it must flow in a closed loop. The return wire completes that loop.',
                conclusion: 'Before proceeding: trace the path of a single electron from − terminal to + terminal through this circuit.',
                tier: 'struggling',
            },
        ],
    },
    quiz: {
        sharp: [
            {
                obs: 'Correct selection.',
                why: 'The answer follows directly from the definition of an open circuit: V ≠ 0, I = 0.',
                conclusion: 'Next question.',
                tier: 'sharp',
            },
            {
                obs: 'Accurate.',
                why: 'Current is binary in a simple loop — either the path is continuous or it is not. Partial current flow does not occur.',
                conclusion: 'Proceed.',
                tier: 'sharp',
            },
        ],
        steady: [
            {
                obs: 'Correct.',
                why: 'Recall: current flows in a closed loop. A break at any point stops all current flow — not just current near the break.',
                conclusion: 'Apply this to PCB trace analysis: a single open via kills the entire net.',
                tier: 'steady',
            },
            {
                obs: 'Correct answer recorded.',
                why: 'Current is not consumed by the load — it is transformed. The same charge exits the load as enters it.',
                conclusion: 'This distinction is critical in power analysis for embedded systems.',
                tier: 'steady',
            },
        ],
        struggling: [
            {
                obs: 'Incorrect selection noted.',
                why: 'Re-examine the definitions: Open circuit = discontinuous path; Short circuit = zero-resistance path bypassing load; Closed circuit = complete resistive loop.',
                conclusion: 'Map each term to the physical configuration before selecting.',
                tier: 'struggling',
            },
            {
                obs: 'Selection does not match circuit behavior.',
                why: 'Voltage difference drives potential, but current requires a complete path. These are independent quantities with different governing laws.',
                conclusion: 'Review: V = IR. If I = 0, what does R represent physically?',
                tier: 'struggling',
            },
        ],
    },
    matching: {
        sharp: [
            {
                obs: 'Structural mapping confirmed.',
                why: 'Each component fulfills a defined role in the energy transfer chain. Source provides EMF; load converts it; return path closes the loop.',
                conclusion: 'This role definition scales directly to multi-stage power delivery networks.',
                tier: 'sharp',
            },
        ],
        steady: [
            {
                obs: 'Mapping complete.',
                why: 'Understanding the structural role of each component is prerequisite to fault diagnosis. A misidentified component leads to incorrect isolation strategies.',
                conclusion: 'For each match: articulate why it cannot be any other role.',
                tier: 'steady',
            },
        ],
        struggling: [
            {
                obs: 'Incorrect structural mapping.',
                why: 'Terminology defines function. "Source" provides potential energy; "Load" dissipates it; "Open circuit" is a discontinuity, not a component.',
                conclusion: 'Approach each pairing by asking: does this description define an energy source, energy consumer, or a topological state?',
                tier: 'struggling',
            },
        ],
    },
    blanks: {
        sharp: [
            {
                obs: 'Correct. "Return" is the operative term.',
                why: 'Return current is as critical as forward current. Ground planes in PCB design exist solely to provide a structured return path.',
                conclusion: 'Next: how does return path impedance affect signal integrity at high frequencies?',
                tier: 'sharp',
            },
        ],
        steady: [
            {
                obs: 'Correct completion.',
                why: 'Current leaving the source must return to enable continuous flow. The return wire is not optional — it is the loop.',
                conclusion: 'Consider: what is the resistance of the return path in an ideal conductor?',
                tier: 'steady',
            },
        ],
        struggling: [
            {
                obs: 'Incomplete or incorrect response.',
                why: 'The statement is: "Current must leave the source and ___ to it." The blank requires the action that completes the loop — not a component name.',
                conclusion: 'The word is a verb. Think about what current does at the end of its path.',
                tier: 'struggling',
            },
        ],
    },
    diagnosis: {
        sharp: [
            {
                obs: 'Short circuit correctly identified.',
                why: 'R_short ≈ 0Ω forces I = V/R → ∞ (limited by R_source). This is a thermal hazard, not merely a functional failure.',
                conclusion: 'In VLSI: electromigration due to excessive current density is the long-term failure mode in unprotected short conditions.',
                tier: 'sharp',
            },
        ],
        steady: [
            {
                obs: 'Correct fault diagnosis.',
                why: 'A short circuit is uniquely dangerous because it bypasses the protective load resistance. Current is limited only by wire resistance and source impedance.',
                conclusion: 'In real systems: fuses and current-limiting circuits are the engineered response to this exact scenario.',
                tier: 'steady',
            },
        ],
        struggling: [
            {
                obs: 'Incorrect fault selection.',
                why: 'An open circuit causes functional failure. A short circuit causes both functional failure and potential component destruction. The question asks for the most dangerous condition.',
                conclusion: 'Re-examine: which condition results in maximum current flow and maximum heat dissipation?',
                tier: 'struggling',
            },
        ],
    },
};

export function useVoltMonkeyMentor() {
    const answerHistory = useRef<boolean[]>([]);
    const lastTimestamp = useRef<number>(Date.now());
    const usedIndices = useRef<Record<string, Set<number>>>({});

    const recordAnswer = useCallback((correct: boolean) => {
        const now = Date.now();
        lastTimestamp.current = now;
        answerHistory.current = [...answerHistory.current.slice(-2), correct];
    }, []);

    const getTier = useCallback((): Tier => {
        const hist = answerHistory.current;
        if (hist.length === 0) return 'steady';
        const correct = hist.filter(Boolean).length;
        if (correct === hist.length && hist.length >= 2) return 'sharp';
        if (correct >= hist.length * 0.6) return 'steady';
        return 'struggling';
    }, []);

    const getResponse = useCallback((ctx: SceneCtx): VoltMonkeyResponse => {
        const tier = getTier();
        const pool = MSG[ctx][tier];
        const key = `${ctx}-${tier}`;
        if (!usedIndices.current[key]) usedIndices.current[key] = new Set();
        const used = usedIndices.current[key];

        // Find unused index; reset if all used
        let available = pool.map((_, i) => i).filter(i => !used.has(i));
        if (available.length === 0) {
            used.clear();
            available = pool.map((_, i) => i);
        }

        const idx = available[Math.floor(Math.random() * available.length)];
        used.add(idx);
        return pool[idx];
    }, [getTier]);

    return { recordAnswer, getResponse, getTier };
}
