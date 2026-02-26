// ═══════════════════════════════════════════════════════════════
// botDialogue.ts — Dialogue database for the lab companion
// All triggers, emotions, lines, and quick-reply options.
// ═══════════════════════════════════════════════════════════════

import type { MonkeyState } from './VoltMonkey';

// ── Types ─────────────────────────────────────────────────────

export type BotTrigger =
    | 'snap_success'
    | 'loop_complete'
    | 'open_circuit'
    | 'fail_x3'
    | 'idle_10s'
    | 'level_complete'
    | 'drag_start'
    | 'greeting';

export type EmotionState =
    | 'Idle'
    | 'Observing'
    | 'Encouraging'
    | 'Thinking'
    | 'Excited'
    | 'Focused'
    | 'PlayfullySarcastic'
    | 'Supportive';

export type BubbleTone = 'bright' | 'warm' | 'cool' | 'ghost';

export interface DialogueLine {
    id: string;
    trigger: BotTrigger;
    emotion: EmotionState;
    animation: MonkeyState;
    tone: BubbleTone;
    text: string;
    typingSpeed?: number; // ms per char
    quickReplies?: string[];
}

// ── Emotion → tone mapping ─────────────────────────────────────
export const EMOTION_TONE: Record<EmotionState, BubbleTone> = {
    Idle: 'ghost',
    Observing: 'cool',
    Encouraging: 'warm',
    Thinking: 'cool',
    Excited: 'bright',
    Focused: 'cool',
    PlayfullySarcastic: 'ghost',
    Supportive: 'warm',
};

// ── Emotion → animation mapping ────────────────────────────────
export const EMOTION_ANIMATION: Record<EmotionState, MonkeyState> = {
    Idle: 'idle',
    Observing: 'thinking',
    Encouraging: 'waving',
    Thinking: 'thinking',
    Excited: 'happy',
    Focused: 'alert',
    PlayfullySarcastic: 'idle',
    Supportive: 'talking',
};

// ── Main dialogue lines ────────────────────────────────────────
export const DIALOGUE_LINES: DialogueLine[] = [
    // greeting
    {
        id: 'greet_1',
        trigger: 'greeting',
        emotion: 'Encouraging',
        animation: 'waving',
        tone: 'warm',
        text: "Hey. I'm Scrap. I'll be watching while you work.",
        quickReplies: ['Let\'s go', 'What am I doing?'],
    },

    // drag_start
    {
        id: 'drag_1',
        trigger: 'drag_start',
        emotion: 'Observing',
        animation: 'thinking',
        tone: 'cool',
        text: '...',
        typingSpeed: 0,
    },

    // snap_success
    {
        id: 'snap_1',
        trigger: 'snap_success',
        emotion: 'Encouraging',
        animation: 'waving',
        tone: 'warm',
        text: 'Nice placement. That connection looks solid.',
    },
    {
        id: 'snap_2',
        trigger: 'snap_success',
        emotion: 'Encouraging',
        animation: 'waving',
        tone: 'warm',
        text: 'Good. Contact made. Keep going.',
    },

    // loop_complete
    {
        id: 'loop_1',
        trigger: 'loop_complete',
        emotion: 'Excited',
        animation: 'happy',
        tone: 'bright',
        text: "There it is. The signal returned. That's a closed loop.",
        quickReplies: ['Show me why', 'Try again'],
    },
    {
        id: 'loop_2',
        trigger: 'loop_complete',
        emotion: 'Excited',
        animation: 'happy',
        tone: 'bright',
        text: "Closed loop. Clean flow. This is exactly how it works.",
        quickReplies: ['Continue'],
    },

    // open_circuit
    {
        id: 'open_1',
        trigger: 'open_circuit',
        emotion: 'Thinking',
        animation: 'thinking',
        tone: 'cool',
        text: "Hmm... something's not completing the path.",
    },
    {
        id: 'open_2',
        trigger: 'open_circuit',
        emotion: 'Thinking',
        animation: 'thinking',
        tone: 'cool',
        text: "Break the path, break the power. Signal can't return.",
    },

    // fail_x3
    {
        id: 'fail_1',
        trigger: 'fail_x3',
        emotion: 'Supportive',
        animation: 'talking',
        tone: 'warm',
        text: "You're close. Check the return path.",
        quickReplies: ['Give me a hint'],
    },
    {
        id: 'fail_2',
        trigger: 'fail_x3',
        emotion: 'Supportive',
        animation: 'talking',
        tone: 'warm',
        text: "Remember: the signal has to come back to where it started.",
    },

    // idle_10s
    {
        id: 'idle_1',
        trigger: 'idle_10s',
        emotion: 'PlayfullySarcastic',
        animation: 'idle',
        tone: 'ghost',
        text: "Taking a coffee break? The electrons are waiting.",
    },
    {
        id: 'idle_2',
        trigger: 'idle_10s',
        emotion: 'PlayfullySarcastic',
        animation: 'idle',
        tone: 'ghost',
        text: "I'm not in a hurry. The circuit is.",
    },
    {
        id: 'idle_3',
        trigger: 'idle_10s',
        emotion: 'PlayfullySarcastic',
        animation: 'idle',
        tone: 'ghost',
        text: "Logic doesn't pause. But sure — take your time.",
    },

    // level_complete
    {
        id: 'lvl_1',
        trigger: 'level_complete',
        emotion: 'Excited',
        animation: 'happy',
        tone: 'bright',
        text: "Module complete. You understand the loop. That's the foundation.",
        quickReplies: ['Next module', 'Review again'],
    },
];

// ── Catchphrase pool (random idle variety) ─────────────────────
export const CATCHPHRASES = [
    'Signal must return.',
    'Follow the path.',
    'Logic never lies.',
    'Closed loop. Clean flow.',
    'Break the path, break the power.',
    'Think in connections.',
];

// ── Helper: get all lines for a trigger ───────────────────────
export function getLinesForTrigger(trigger: BotTrigger): DialogueLine[] {
    return DIALOGUE_LINES.filter(l => l.trigger === trigger);
}

// ── Helper: pick one at random ─────────────────────────────────
export function pickLine(trigger: BotTrigger): DialogueLine | null {
    const pool = getLinesForTrigger(trigger);
    if (!pool.length) return null;
    return pool[Math.floor(Math.random() * pool.length)];
}
