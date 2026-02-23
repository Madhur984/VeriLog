/* ═══════════════════════════════════════════════════════════════════
   BotDialogues — Context-aware, tier-adaptive dialogue bank
   ──────────────────────────────────────────────────────────────────
   Short, punchy lines. Intelligent but not childish.
   Tone matures as the user progresses through tiers.
   ═══════════════════════════════════════════════════════════════ */

import type { BotEventType } from './botEvents';

export type Tier = 'beginner' | 'intermediate' | 'advanced';

interface DialogueLine {
    text: string;
    tier?: Tier;
}

/* ── Event-triggered dialogues ──────────────────────────────────── */
const EVENT_DIALOGUES: Partial<Record<BotEventType, DialogueLine[]>> = {
    LEVEL_STARTED: [
        { text: "New circuit ahead. Let's close some loops.", tier: 'beginner' },
        { text: "Module loaded. Time to analyze.", tier: 'intermediate' },
        { text: "Fresh topology. Let's verify correctness.", tier: 'advanced' },
    ],
    FIRST_VISIT: [
        { text: "Welcome to VeriLog. I'll be your lab companion." },
        { text: "Every great engineer started here. Let's begin." },
    ],
    QUESTION_CORRECT: [
        { text: "Solid. Signal integrity maintained.", tier: 'beginner' },
        { text: "Clean logic. Well reasoned.", tier: 'intermediate' },
        { text: "Correct propagation. Zero delay.", tier: 'advanced' },
        { text: "Nice. That's real engineering." },
        { text: "Loop closed. Moving on." },
    ],
    QUESTION_WRONG: [
        { text: "Check the return path. Signals always complete the loop.", tier: 'beginner' },
        { text: "Trace the logic again. Where does the signal diverge?", tier: 'intermediate' },
        { text: "Return continuity broken. Re-evaluate your net.", tier: 'advanced' },
        { text: "Not quite. Think about what happens when the input changes." },
        { text: "Close — but the truth table says otherwise." },
    ],
    THREE_CORRECT_STREAK: [
        { text: "Nice. Your foundation is strong." },
        { text: "Three in a row. Momentum building." },
        { text: "Streak active. Keep this up." },
    ],
    CIRCUIT_BROKEN: [
        { text: "Break the wire. Watch what happens." },
        { text: "Open circuit detected. The signal has no return." },
    ],
    SHORT_CIRCUIT: [
        { text: "Short circuit! That path has zero resistance." },
        { text: "Direct short. The current bypasses everything." },
    ],
    LEVEL_COMPLETED: [
        { text: "Loop secured. That's real engineering.", tier: 'beginner' },
        { text: "Module verified. System stabilized.", tier: 'intermediate' },
        { text: "Full coverage achieved. Engineering unlocked.", tier: 'advanced' },
        { text: "Foundation strengthened." },
    ],
    USER_IDLE_30S: [
        { text: "Still here? Try creating a short circuit." },
        { text: "Take your time. The circuit will wait." },
        { text: "Need a hint? I've got a few." },
    ],
    NEW_PATH_UNLOCKED: [
        { text: "New specialization available. Choose your branch." },
        { text: "The tree grows. A new path awaits." },
    ],
};

/* ── Route-specific contextual dialogues ────────────────────────── */
const ROUTE_DIALOGUES: Record<string, DialogueLine[]> = {
    '/portal': [
        { text: "Welcome to your workstation. Click any module to begin." },
        { text: "Your progress map awaits. Pick a path." },
    ],
    '/home': [
        { text: "Welcome back. Where did we leave off?" },
        { text: "Ready for the next module?" },
    ],
    '/module/1': [
        { text: "Signal Must Return. The fundamental law.", tier: 'beginner' },
        { text: "Closed loops power everything. Let's prove it.", tier: 'intermediate' },
    ],
    '/assessment': [
        { text: "Think carefully. Each gate has a truth.", tier: 'beginner' },
        { text: "Logic assessment. Show me what you know.", tier: 'intermediate' },
    ],
    '/training': [
        { text: "Practice mode. No pressure, just growth." },
        { text: "Repetition builds mastery." },
    ],
    '/hero': [
        { text: "Welcome to VeriLog. Dive into digital electronics." },
    ],
    default: [
        { text: "I'm here if you need anything." },
        { text: "Explore freely. I'll have hints when you need them." },
    ],
};

/* ── Helpers ───────────────────────────────────────────────────── */

function pickRandom<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

function filterByTier(lines: DialogueLine[], tier: Tier): DialogueLine[] {
    const tiered = lines.filter(l => l.tier === tier);
    return tiered.length > 0 ? tiered : lines.filter(l => !l.tier);
}

/* ── Public API ─────────────────────────────────────────────────── */

/** Get dialogue for a specific event */
export function getEventDialogue(event: BotEventType, tier: Tier): string {
    const pool = EVENT_DIALOGUES[event];
    if (!pool || pool.length === 0) return "...";
    return pickRandom(filterByTier(pool, tier)).text;
}

/** Get dialogue for a specific route */
export function getRouteDialogue(pathname: string, tier: Tier): string {
    // Find matching route key
    const key = Object.keys(ROUTE_DIALOGUES).find(k =>
        k !== 'default' && pathname.startsWith(k)
    ) || 'default';
    const pool = ROUTE_DIALOGUES[key];
    return pickRandom(filterByTier(pool, tier)).text;
}

/** Onboarding tour step dialogues */
export const TOUR_DIALOGUES = [
    { step: 'foundation', text: "This is where every engineer begins." },
    { step: 'branches', text: "Later, you'll specialize." },
    { step: 'progress', text: "Your strength grows with every loop." },
    { step: 'first_module', text: "Start here. Signals must return." },
];

/** Celebration one-liners */
export const CELEBRATION_LINES = [
    "Foundation strengthened.",
    "System stabilized.",
    "Engineering unlocked.",
    "Loop integrity verified.",
    "Circuit mastered.",
];
