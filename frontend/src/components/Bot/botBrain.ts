// ═══════════════════════════════════════════════════════════════
// botBrain.ts — useBotBrain() hook
// Event-driven emotional state machine for the lab companion.
// ═══════════════════════════════════════════════════════════════

import { useState, useEffect, useRef, useCallback } from 'react';
import { pickLine, CATCHPHRASES } from './botDialogue';
import type { BotTrigger, EmotionState, DialogueLine, BubbleTone } from './botDialogue';
import { EMOTION_ANIMATION, EMOTION_TONE } from './botDialogue';
import type { MonkeyState } from './VoltMonkey';

export interface BotState {
    emotion: EmotionState;
    animation: MonkeyState;
    tone: BubbleTone;
    line: DialogueLine | null;
    visible: boolean;
    dispatch: (trigger: BotTrigger) => void;
    dismiss: () => void;
}

const IDLE_DELAY_MS = 10_000;
const BUBBLE_HIDE_MS = 5_000;

export function useBotBrain(): BotState {
    const [emotion, setEmotion] = useState<EmotionState>('Idle');
    const [animation, setAnimation] = useState<MonkeyState>('idle');
    const [tone, setTone] = useState<BubbleTone>('ghost');
    const [line, setLine] = useState<DialogueLine | null>(null);
    const [visible, setVisible] = useState(false);

    const failCount = useRef(0);
    const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const clearTimers = () => {
        if (idleTimer.current) clearTimeout(idleTimer.current);
        if (hideTimer.current) clearTimeout(hideTimer.current);
    };

    const showLine = useCallback((picked: DialogueLine | null) => {
        if (!picked) return;
        clearTimers();
        setEmotion(picked.emotion);
        setAnimation(picked.animation);
        setTone(picked.tone);
        setLine(picked);
        setVisible(true);

        const delay = ['loop_complete', 'level_complete'].includes(picked.trigger)
            ? 8_000 : BUBBLE_HIDE_MS;
        hideTimer.current = setTimeout(() => setVisible(false), delay);
    }, []);

    const showCatchphrase = useCallback(() => {
        const text = CATCHPHRASES[Math.floor(Math.random() * CATCHPHRASES.length)];
        const pseudo: DialogueLine = {
            id: 'catchphrase', trigger: 'idle_10s',
            emotion: 'PlayfullySarcastic', animation: 'idle', tone: 'ghost', text,
        };
        showLine(pseudo);
    }, [showLine]);

    const resetIdleTimer = useCallback(() => {
        if (idleTimer.current) clearTimeout(idleTimer.current);
        idleTimer.current = setTimeout(() => {
            const picked = pickLine('idle_10s');
            if (picked) showLine(picked); else showCatchphrase();
        }, IDLE_DELAY_MS);
    }, [showLine, showCatchphrase]);

    const dispatch = useCallback((trigger: BotTrigger) => {
        resetIdleTimer();

        if (trigger === 'drag_start') {
            setEmotion('Observing');
            setAnimation('thinking');
            setVisible(false);
            return;
        }

        if (trigger === 'open_circuit') {
            failCount.current += 1;
            if (failCount.current >= 3) {
                showLine(pickLine('fail_x3'));
                failCount.current = 0;
                return;
            }
        } else if (trigger === 'snap_success' || trigger === 'loop_complete') {
            failCount.current = 0;
        }

        showLine(pickLine(trigger));
    }, [resetIdleTimer, showLine]);

    const dismiss = useCallback(() => {
        if (hideTimer.current) clearTimeout(hideTimer.current);
        setVisible(false);
        setEmotion('Idle');
        setAnimation('idle');
        setTone('ghost');
    }, []);

    useEffect(() => {
        showLine(pickLine('greeting'));
        resetIdleTimer();
        return clearTimers;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        setAnimation(EMOTION_ANIMATION[emotion]);
        setTone(EMOTION_TONE[emotion]);
    }, [emotion]);

    return { emotion, animation, tone, line, visible, dispatch, dismiss };
}
