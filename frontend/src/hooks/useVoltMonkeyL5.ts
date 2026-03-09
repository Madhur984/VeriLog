import { useState, useCallback } from 'react';

export type PerformanceTier = 'sharp' | 'steady' | 'struggling';
export type SceneId = 'intro' | 'scene-5-1' | 'scene-5-2' | 'scene-5-3' | 'scene-5-4' | 'scene-5-5';
export type ContextEvent = 'invalid_group' | 'valid_group' | 'challenge_pass' | 'challenge_fail';

export interface MentorState {
    observation: string;
    analysis: string;
    suggestion: string;
    insight: string;
    tier: PerformanceTier;
}

const DEFAULT_RESPONSES: Record<SceneId, MentorState> = {
    'intro': {
        observation: "You've reached Level 5. We are looking at a complex unoptimized circuit.",
        analysis: "Large circuits consume more power and introduce propagation delay.",
        suggestion: "Let's explore Karnaugh Maps to optimize this logic mathematically.",
        insight: "In silicon design, optimizing a standard cell library layout saves tremendous cost.",
        tier: 'steady'
    },
    'scene-5-1': {
        observation: "You are watching the truth table cells map to the K-Map grid.",
        analysis: "Each row in the truth table corresponds to exactly one cell in the K-Map.",
        suggestion: "Click 'Open K-Map Explorer' when you're ready to experiment.",
        insight: "Gray code ordering (00, 01, 11, 10) ensures adjacent cells differ by only one bit.",
        tier: 'steady'
    },
    'scene-5-2': {
        observation: "You are mapping truth table rows to the Karnaugh map.",
        analysis: "Karnaugh maps organize truth tables so that adjacent cells differ by only one variable.",
        suggestion: "Map each '1' from the truth table into its corresponding cell on the grid.",
        insight: "This uses Gray code ordering (00, 01, 11, 10) to guarantee adjacency wraps around the edges.",
        tier: 'steady'
    },
    'scene-5-3': {
        observation: "You are grouping 1s on the K-Map.",
        analysis: "Groups must be rectangular and sized as a power of 2 (1, 2, 4, 8).",
        suggestion: "Try to make the largest valid groups possible. Don't forget walls wrap around!",
        insight: "Larger groups eliminate more variables, leading to fewer inputs on your logic gates.",
        tier: 'sharp'
    },
    'scene-5-4': {
        observation: "You are solving logic minimization challenges.",
        analysis: "Each challenge has an optimal solution — find the fewest, largest groups.",
        suggestion: "Check if minterms on opposite edges of the map can wrap around to form a group.",
        insight: "These patterns are what hardware synthesis tools detect automatically during chip design.",
        tier: 'sharp'
    },
    'scene-5-5': {
        observation: "Comparing the original circuit to the K-Map optimized circuit.",
        analysis: "The new circuit has significantly fewer gates and a shorter logic path.",
        suggestion: "Check the telemetry panel to see the exact reduction in propagation delay.",
        insight: "This is a manual version of what logic synthesis tools (like Synopsys Design Compiler) do automatically.",
        tier: 'sharp'
    }
};

const CONTEXTUAL_RESPONSES: Record<ContextEvent, Record<PerformanceTier, Partial<MentorState>>> = {
    'invalid_group': {
        sharp: { observation: 'That group is invalid.', suggestion: 'Check: is the size a power of 2? Are all cells adjacent?' },
        steady: { observation: 'Invalid grouping detected.', suggestion: 'Groups must be 1, 2, 4, or 8 cells. Try again!' },
        struggling: { observation: 'That group does not work.', suggestion: 'Start with just 2 adjacent 1s. Powers of 2: 1, 2, 4, 8.' },
    },
    'valid_group': {
        sharp: { observation: 'Nice group!', suggestion: 'Can you find an even larger group that covers more cells?' },
        steady: { observation: 'Valid group saved.', suggestion: 'Keep going — ensure every 1 is covered by at least one group.' },
        struggling: { observation: 'Good — that group is correct!', suggestion: 'Now select more 1s and repeat.' },
    },
    'challenge_pass': {
        sharp: { observation: 'Excellent! Optimal solution found.', suggestion: 'Try reducing the number of groups further for a perfect score.' },
        steady: { observation: 'Challenge passed!', suggestion: 'Move on to the next challenge.' },
        struggling: { observation: 'You solved it!', suggestion: 'Great job. The next one is slightly harder.' },
    },
    'challenge_fail': {
        sharp: { observation: 'Expression is not equivalent.', suggestion: 'Verify your groups cover all minterms and no non-minterms.' },
        steady: { observation: 'Wrong answer.', suggestion: 'Check your derived expression against the truth table.' },
        struggling: { observation: 'Not quite right.', suggestion: 'Which cells have 1s? Start by grouping just those.' },
    },
};

export function useVoltMonkeyL5() {
    const [mentorState, setMentorState] = useState<MentorState>(DEFAULT_RESPONSES['intro']);

    const triggerResponse = useCallback((scene: SceneId, customData?: Partial<MentorState>) => {
        const base = DEFAULT_RESPONSES[scene] || DEFAULT_RESPONSES['intro'];
        setMentorState({ ...base, ...customData });
    }, []);

    const triggerContextual = useCallback((event: ContextEvent, tier: PerformanceTier = 'steady') => {
        const patch = CONTEXTUAL_RESPONSES[event][tier];
        setMentorState(prev => ({ ...prev, ...patch, tier }));
    }, []);

    const reset = useCallback(() => setMentorState(DEFAULT_RESPONSES['intro']), []);

    return {
        mentorState,
        triggerResponse,
        triggerContextual,
        reset
    };
}
