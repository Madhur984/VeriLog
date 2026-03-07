/**
 * voltMonkeyEngine.ts — VoltMonkey AI Hint Engine
 *
 * Context-aware hint generator with a playful personality.
 * VoltMonkey is the lab companion that observes user actions
 * and provides progressive, never-revealing hints.
 *
 * Hint philosophy:
 *   Level 0 → Observation ("Hmm, something seems off...")
 *   Level 1 → Direction ("Check the power connections")
 *   Level 2 → Specific ("The return path from the LED is disconnected")
 *   Level 3 → Solution (only after 3+ failed attempts)
 */

export type HintLevel = 0 | 1 | 2 | 3;
export type MonkeyMood = 'idle' | 'thinking' | 'excited' | 'concerned' | 'celebrating';

export interface HintContext {
    missionId?: string;
    symptom?: string;
    attemptCount: number;
    lastAction?: string;
    circuitState?: {
        nodeCount: number;
        edgeCount: number;
        hasClosedLoop: boolean;
    };
}

export interface VoltMonkeyHint {
    text: string;
    level: HintLevel;
    mood: MonkeyMood;
    emoji: string;
}

// ─── Personality Phrases ────────────────────────────────────────────────

const GREETINGS = [
    "🐵 VoltMonkey here! Need a hand?",
    "🐵 Hey! I noticed you're working on something interesting...",
    "🐵 *adjusts tiny lab goggles* Ready to help!",
    "🐵 Ooh, circuits! My favorite playground!",
];

const ENCOURAGEMENT = [
    "You're getting warmer! 🔥",
    "Good thinking! Keep going...",
    "That's the right direction! ⚡",
    "Almost there, I can feel it! 💡",
];

const CELEBRATION = [
    "🎉 YEAH! You nailed it!",
    "🐵 *does a backflip* PERFECT!",
    "⚡ Now THAT'S what I call engineering!",
    "🏆 VoltMonkey stamp of approval!",
];

// ─── Mission-Specific Hint Trees ────────────────────────────────────────

interface HintTree {
    [level: number]: string[];
}

const MISSION_HINTS: Record<string, HintTree> = {
    'dead-led': {
        0: [
            "Hmm, that LED is looking pretty dark. Not a great sign...",
            "I've seen this before. Something's not quite complete here.",
        ],
        1: [
            "Current needs to flow in a complete loop — like a race track. 🏎️",
            "Check both sides of the LED. Does it have a way back home?",
        ],
        2: [
            "The LED has power coming IN, but where does the current go AFTER the LED?",
            "You need a wire from the LED output back to the battery's ground. The circuit needs to be closed!",
        ],
        3: [
            "Connect the LED's output port back to the battery's input (ground) to close the circuit loop.",
        ],
    },
    'stuck-gate': {
        0: [
            "AND gate always LOW... that's suspicious. 🤔",
            "Both inputs need to be HIGH for AND to output HIGH. Are they?",
        ],
        1: [
            "Check what each input is actually receiving. Don't assume!",
            "One of the inputs might be lying to you... er, I mean, wrong.",
        ],
        2: [
            "Input B is a Constant set to FALSE. An AND gate needs ALL inputs HIGH.",
            "Change Input B's value from false to true.",
        ],
        3: [
            "Select Input B (the Constant node) and change its value parameter from false to true.",
        ],
    },
    'clock-drift': {
        0: [
            "That clock seems... sluggish. Like Monday morning. ☕",
            "1MHz should be pretty fast. This doesn't look like 1MHz to me.",
        ],
        1: [
            "The clock period determines frequency. period = 1/frequency.",
            "For 1MHz, what period (in nanoseconds) do you need?",
        ],
        2: [
            "1MHz = 1,000,000 Hz. Period = 1/1,000,000 s = 1μs = 1,000ns.",
            "The current period is 100,000ns (100μs = 10KHz). Way too slow!",
        ],
        3: [
            "Change the clock's periodNs parameter from 100,000 to 1,000 (1μs = 1MHz).",
        ],
    },
};

// ─── Generic Hints (when no mission-specific hint exists) ────────────────

const GENERIC_HINTS: HintTree = {
    0: [
        "Something doesn't look right. Let me think... 🤔",
        "Hmm, I'm sensing a disturbance in the circuit force.",
    ],
    1: [
        "Check your connections — are all ports wired correctly?",
        "Sometimes the simplest explanation is the right one. Missing a wire?",
    ],
    2: [
        "Try using the X-Ray mode to see the actual signal values at each node.",
        "Add a probe to the suspicious node and watch the timing diagram.",
    ],
    3: [
        "I'd love to help more, but some puzzles you need to figure out yourself! Try the hint button.",
    ],
};

// ─── Engine ─────────────────────────────────────────────────────────────

export class VoltMonkeyEngine {
    private hintIndex = 0;

    getGreeting(): VoltMonkeyHint {
        const text = GREETINGS[Math.floor(Math.random() * GREETINGS.length)];
        return { text, level: 0, mood: 'idle', emoji: '🐵' };
    }

    getHint(context: HintContext): VoltMonkeyHint {
        const level = this.computeHintLevel(context.attemptCount);
        const tree = context.missionId
            ? MISSION_HINTS[context.missionId] || GENERIC_HINTS
            : GENERIC_HINTS;

        const hints = tree[level] || tree[0] || ["I'm not sure what's happening here..."];
        const idx = this.hintIndex % hints.length;
        this.hintIndex++;

        const mood = this.computeMood(level, context);

        return {
            text: hints[idx],
            level,
            mood,
            emoji: mood === 'celebrating' ? '🎉' : mood === 'concerned' ? '😟' : '🐵',
        };
    }

    getCelebration(): VoltMonkeyHint {
        const text = CELEBRATION[Math.floor(Math.random() * CELEBRATION.length)];
        return { text, level: 0, mood: 'celebrating', emoji: '🎉' };
    }

    getEncouragement(): VoltMonkeyHint {
        const text = ENCOURAGEMENT[Math.floor(Math.random() * ENCOURAGEMENT.length)];
        return { text, level: 0, mood: 'excited', emoji: '⚡' };
    }

    getCircuitAdvice(context: HintContext): VoltMonkeyHint {
        if (!context.circuitState) {
            return { text: "Build something and I'll take a look!", level: 0, mood: 'idle', emoji: '🐵' };
        }

        const { nodeCount, edgeCount, hasClosedLoop } = context.circuitState;

        if (nodeCount === 0) {
            return { text: "Empty canvas! Drag some components from the palette to get started.", level: 0, mood: 'idle', emoji: '🐵' };
        }

        if (nodeCount > 0 && edgeCount === 0) {
            return { text: "Nice components! Now wire them up using Wire mode (🔗).", level: 1, mood: 'thinking', emoji: '🤔' };
        }

        if (!hasClosedLoop) {
            return { text: "Almost! Your circuit doesn't have a closed loop yet. Current needs a path back to the source.", level: 1, mood: 'concerned', emoji: '😟' };
        }

        return { text: "Looking good! Hit Play ▶ to simulate.", level: 0, mood: 'excited', emoji: '⚡' };
    }

    private computeHintLevel(attemptCount: number): HintLevel {
        if (attemptCount <= 0) return 0;
        if (attemptCount <= 1) return 1;
        if (attemptCount <= 3) return 2;
        return 3;
    }

    private computeMood(level: HintLevel, context: HintContext): MonkeyMood {
        if (level >= 3) return 'concerned';
        if (context.attemptCount === 0) return 'thinking';
        if (level === 0) return 'idle';
        return 'thinking';
    }

    resetHintIndex(): void {
        this.hintIndex = 0;
    }
}

// Singleton for easy access
export const voltMonkey = new VoltMonkeyEngine();
