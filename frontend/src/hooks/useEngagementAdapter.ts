/**
 * useEngagementAdapter.ts — Drop-in replacement for useXPSystem
 *
 * Bridges the old useXPSystem API to the new engagementStore,
 * so consumers (ModuleOne, ModuleTwo, XPCounter) can migrate
 * without rewriting their logic.
 */

import { useRef, useCallback, useMemo } from 'react';
import { useEngagementStore, type XPCategory } from '../stores/engagementStore';

// Match the old XPState interface shape
export interface XPState {
    structural: number;
    diagnostic: number;
    application: number;
    total: number;
}

export function useEngagementAdapter() {
    const store = useEngagementStore();
    const counterElRef = useRef<HTMLElement | null>(null);
    const rafRef = useRef<number>(0);
    const answerStartRef = useRef<number>(Date.now());

    // Check streak on mount
    store.checkStreak();

    // Compose XPState from engagementStore
    const xp: XPState = useMemo(() => ({
        structural: store.sip.structural,
        diagnostic: store.sip.diagnostic,
        application: store.sip.application,
        total: store.totalXP,
    }), [store.sip, store.totalXP]);

    // Mark answer start (for hesitation penalty)
    const markAnswerStart = useCallback(() => {
        answerStartRef.current = Date.now();
    }, []);

    // Animate counter (preserved from old useXPSystem)
    const animateCounter = useCallback((from: number, to: number) => {
        cancelAnimationFrame(rafRef.current);
        const el = counterElRef.current;
        if (!el) return;
        const duration = 600;
        const start = performance.now();
        const diff = to - from;

        function tick(now: number) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(from + diff * ease);
            el!.textContent = String(current).padStart(3, '0');
            if (progress < 1) rafRef.current = requestAnimationFrame(tick);
        }
        rafRef.current = requestAnimationFrame(tick);
    }, []);

    // Award XP — reroutes to engagementStore with hesitation penalty
    const awardXP = useCallback((category: XPCategory, overrideAmount?: number) => {
        let amount = overrideAmount ?? { structural: 10, diagnostic: 20, application: 15 }[category];

        // Hesitation penalty: > 30s → 50% XP
        const elapsedMs = Date.now() - answerStartRef.current;
        if (elapsedMs > 30_000) amount = Math.ceil(amount * 0.5);

        const prevTotal = store.totalXP;
        store.awardXP(category, amount);

        // Animate counter
        animateCounter(prevTotal, prevTotal + amount);
        const el = counterElRef.current;
        if (el) {
            el.classList.remove('vl-xp--flash');
            void el.offsetWidth;
            el.classList.add('vl-xp--flash');
        }
    }, [store, animateCounter]);

    const registerCounterEl = useCallback((el: HTMLElement | null) => {
        counterElRef.current = el;
        if (el) el.textContent = String(store.totalXP).padStart(3, '0');
    }, [store.totalXP]);

    /** Signal Integrity Index: 0–100 */
    const signalIntegrityIndex = useCallback((): number => {
        return store.getSIPScore();
    }, [store]);

    return { xp, awardXP, registerCounterEl, markAnswerStart, signalIntegrityIndex };
}
