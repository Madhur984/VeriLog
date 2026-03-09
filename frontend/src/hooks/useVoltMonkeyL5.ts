import { useState, useCallback } from 'react';

export type PerformanceTier = 'sharp' | 'steady' | 'struggling';
export type SceneId = 'intro' | 'scene-5-1' | 'scene-5-2' | 'scene-5-3' | 'scene-5-4' | 'scene-5-5';

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
        observation: "The current circuit uses 11 logic gates.",
        analysis: "The expression F = A'BC + ABC + AB'C is implemented directly, resulting in deep logic levels.",
        suggestion: "Click 'Proceed to K-Map' to see how we can simplify this expression.",
        insight: "Every additional logic level adds propagation delay, reducing the maximum clock frequency of the processor.",
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
        observation: "We are extracting Boolean expressions from your groups.",
        analysis: "Each group represents a simplified term.",
        suggestion: "Review how the variables that change across the group are dropped.",
        insight: "This visual minimization technique corresponds directly to Boolean algebra theorems.",
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

export function useVoltMonkeyL5() {
    const [mentorState, setMentorState] = useState<MentorState>(DEFAULT_RESPONSES['intro']);

    const triggerResponse = useCallback((scene: SceneId, customData?: Partial<MentorState>) => {
        const base = DEFAULT_RESPONSES[scene] || DEFAULT_RESPONSES['intro'];
        setMentorState({ ...base, ...customData });
    }, []);

    const reset = useCallback(() => setMentorState(DEFAULT_RESPONSES['intro']), []);

    return {
        mentorState,
        triggerResponse,
        reset
    };
}
