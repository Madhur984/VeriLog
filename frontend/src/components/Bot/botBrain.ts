/* ═══════════════════════════════════════════════════════════════════
   BotBrain — State-driven intelligence engine for VoltMonkey
   ──────────────────────────────────────────────────────────────────
   Listens to botBus events → updates mood / dialogue / animation.
   Integrates with useGamification for XP/battery side effects.
   ═══════════════════════════════════════════════════════════════ */

import { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { botBus, type BotEventType } from './botEvents';
import { getEventDialogue, getRouteDialogue, CELEBRATION_LINES, type Tier } from './botDialogues';
import type { MonkeyState } from './VoltMonkey';

/* ── Types ─────────────────────────────────────────────────────── */

export type BotMood = 'idle' | 'happy' | 'thinking' | 'alert';

export interface BrainState {
    mood: BotMood;
    confidenceLevel: number;     // 0–100
    userProgress: number;        // 0–100 (modules %)
    recentMistakes: number;      // rolling count
    correctStreak: number;       // consecutive correct
    tier: Tier;
    currentPage: string;
    dialogue: string;
    monkeyState: MonkeyState;
    shouldCelebrate: boolean;
    isNewHint: boolean;          // pulse glow trigger
}

/* ── Mood → MonkeyState mapping ────────────────────────────────── */
const MOOD_TO_MONKEY: Record<BotMood, MonkeyState> = {
    idle: 'idle',
    happy: 'happy',
    thinking: 'thinking',
    alert: 'alert',
};

/* ── Event → Mood mapping ──────────────────────────────────────── */
const EVENT_MOOD: Partial<Record<BotEventType, BotMood>> = {
    LEVEL_STARTED: 'idle',
    FIRST_VISIT: 'happy',
    QUESTION_CORRECT: 'happy',
    QUESTION_WRONG: 'thinking',
    THREE_CORRECT_STREAK: 'happy',
    CIRCUIT_BROKEN: 'alert',
    SHORT_CIRCUIT: 'alert',
    LEVEL_COMPLETED: 'happy',
    USER_IDLE_30S: 'idle',
    NEW_PATH_UNLOCKED: 'happy',
};

/* ── Tier derivation from XP / progress ────────────────────────── */
function deriveTier(progress: number, confidence: number): Tier {
    if (progress >= 60 || confidence >= 80) return 'advanced';
    if (progress >= 25 || confidence >= 50) return 'intermediate';
    return 'beginner';
}

/* ── Initial state ─────────────────────────────────────────────── */
const INITIAL: BrainState = {
    mood: 'idle',
    confidenceLevel: 50,
    userProgress: 0,
    recentMistakes: 0,
    correctStreak: 0,
    tier: 'beginner',
    currentPage: '/',
    dialogue: '',
    monkeyState: 'idle',
    shouldCelebrate: false,
    isNewHint: false,
};

/* ═══════════════════════════════════════════════════════════════ */

export function useBotBrain() {
    const [brain, setBrain] = useState<BrainState>(INITIAL);
    const location = useLocation();
    const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const interactionRef = useRef(false);

    /* ── Reset idle timer on any user interaction ──────────────── */
    const resetIdleTimer = useCallback(() => {
        interactionRef.current = true;
        if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
        idleTimerRef.current = setTimeout(() => {
            botBus.emit('USER_IDLE_30S');
        }, 30_000);
    }, []);

    /* ── Listen for user interaction ──────────────────────────── */
    useEffect(() => {
        const events = ['click', 'keydown', 'scroll', 'mousemove'] as const;
        const handler = () => resetIdleTimer();
        events.forEach(e => window.addEventListener(e, handler, { passive: true }));
        resetIdleTimer();
        return () => {
            events.forEach(e => window.removeEventListener(e, handler));
            if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
        };
    }, [resetIdleTimer]);

    /* ── Route change → update page + route dialogue ──────────── */
    useEffect(() => {
        setBrain(prev => {
            const dialogue = getRouteDialogue(location.pathname, prev.tier);
            return {
                ...prev,
                currentPage: location.pathname,
                dialogue,
                monkeyState: 'talking',
                isNewHint: true,
                shouldCelebrate: false,
            };
        });
        // Auto-reset to idle after talking
        const t = setTimeout(() => {
            setBrain(prev => ({
                ...prev,
                monkeyState: MOOD_TO_MONKEY[prev.mood],
                isNewHint: false,
            }));
        }, 6_000);
        return () => clearTimeout(t);
    }, [location.pathname]);

    /* ── Subscribe to botBus events ───────────────────────────── */
    useEffect(() => {
        const unsub = botBus.on('*', (event) => {
            setBrain(prev => {
                const newMood = EVENT_MOOD[event.type] ?? prev.mood;
                const isCelebration = event.type === 'LEVEL_COMPLETED' || event.type === 'NEW_PATH_UNLOCKED';

                let { confidenceLevel, recentMistakes, correctStreak, userProgress } = prev;

                switch (event.type) {
                    case 'QUESTION_CORRECT':
                        confidenceLevel = Math.min(100, confidenceLevel + 5);
                        correctStreak += 1;
                        recentMistakes = Math.max(0, recentMistakes - 1);
                        if (correctStreak >= 3 && correctStreak % 3 === 0) {
                            botBus.emit('THREE_CORRECT_STREAK');
                        }
                        break;
                    case 'QUESTION_WRONG':
                        confidenceLevel = Math.max(0, confidenceLevel - 8);
                        recentMistakes += 1;
                        correctStreak = 0;
                        break;
                    case 'LEVEL_COMPLETED':
                        userProgress = Math.min(100, userProgress + 7);
                        confidenceLevel = Math.min(100, confidenceLevel + 10);
                        break;
                    case 'NEW_PATH_UNLOCKED':
                        userProgress = Math.min(100, userProgress + 5);
                        break;
                }

                const tier = deriveTier(userProgress, confidenceLevel);
                const dialogue = getEventDialogue(event.type, tier);

                return {
                    ...prev,
                    mood: newMood,
                    monkeyState: isCelebration ? 'happy' : MOOD_TO_MONKEY[newMood],
                    confidenceLevel,
                    recentMistakes,
                    correctStreak,
                    userProgress,
                    tier,
                    dialogue,
                    shouldCelebrate: isCelebration,
                    isNewHint: true,
                };
            });

            // Auto-decay back to idle after 6s
            setTimeout(() => {
                setBrain(prev => ({
                    ...prev,
                    monkeyState: MOOD_TO_MONKEY[prev.mood],
                    shouldCelebrate: false,
                    isNewHint: false,
                }));
            }, 6_000);
        });

        return unsub;
    }, []);

    /* ── Dismiss celebration ───────────────────────────────────── */
    const dismissCelebration = useCallback(() => {
        setBrain(prev => ({ ...prev, shouldCelebrate: false }));
    }, []);

    /* ── Manual dispatch helper ────────────────────────────────── */
    const dispatch = useCallback((type: BotEventType, payload?: Record<string, unknown>) => {
        botBus.emit(type, payload);
    }, []);

    /* ── Get a random celebration line ─────────────────────────── */
    const celebrationLine = CELEBRATION_LINES[Math.floor(Math.random() * CELEBRATION_LINES.length)];

    return {
        ...brain,
        dispatch,
        dismissCelebration,
        celebrationLine,
    };
}
