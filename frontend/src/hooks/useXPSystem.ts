/**
 * useXPSystem.ts
 *
 * XP Psychology System — Signal Integrity Index (SII).
 *
 * Three XP categories:
 *   structural   (+10) — Lab snap, quiz correct
 *   diagnostic   (+20) — Correct diagnoses
 *   application  (+15) — Matching + blanks correct
 *
 * Hesitation penalty: answer time > 30s reduces award by 50%.
 * Signal Integrity Index: weighted composite of all categories.
 */

import { useState, useRef, useCallback } from 'react';

export type XPCategory = 'structural' | 'diagnostic' | 'application';

export interface XPState {
    structural: number;
    diagnostic: number;
    application: number;
    total: number;
}

const XP_REWARDS: Record<XPCategory, number> = {
    structural: 10,
    diagnostic: 20,
    application: 15,
};

// Weighted composite: diagnostic(×2) > application(×1.5) > structural(×1)
const SII_WEIGHTS: Record<XPCategory, number> = {
    structural: 1,
    diagnostic: 2,
    application: 1.5,
};
const SII_MAX = (10 * 1) + (20 * 2) + (15 * 1.5); // 10 + 40 + 22.5 = 72.5

export function useXPSystem() {
    const [xp, setXP] = useState<XPState>({
        structural: 0,
        diagnostic: 0,
        application: 0,
        total: 0,
    });

    const xpRef = useRef(xp);
    const counterElRef = useRef<HTMLElement | null>(null);
    const rafRef = useRef<number>(0);
    const answerStartRef = useRef<number>(Date.now()); // Set before showing question

    const markAnswerStart = useCallback(() => {
        answerStartRef.current = Date.now();
    }, []);

    const animateCounter = useCallback((from: number, to: number) => {
        cancelAnimationFrame(rafRef.current);
        const el = counterElRef.current;
        if (!el) return;
        const duration = 600;
        const start = performance.now();
        const diff = to - from;
        const targetEl: HTMLElement = el;

        function tick(now: number) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(from + diff * ease);
            targetEl.textContent = String(current).padStart(3, '0');
            if (progress < 1) rafRef.current = requestAnimationFrame(tick);
        }
        rafRef.current = requestAnimationFrame(tick);
    }, []);

    const awardXP = useCallback((category: XPCategory, overrideAmount?: number) => {
        let amount = overrideAmount ?? XP_REWARDS[category];

        // Hesitation penalty: > 30s → 50% XP
        const elapsedMs = Date.now() - answerStartRef.current;
        if (elapsedMs > 30_000) amount = Math.ceil(amount * 0.5);

        const prev = xpRef.current;
        const next: XPState = {
            ...prev,
            [category]: prev[category] + amount,
            total: prev.total + amount,
        };
        xpRef.current = next;
        setXP(next);

        animateCounter(prev.total, next.total);
        const el = counterElRef.current;
        if (el) {
            el.classList.remove('vl-xp--flash');
            void el.offsetWidth;
            el.classList.add('vl-xp--flash');
        }
    }, [animateCounter]);

    const registerCounterEl = useCallback((el: HTMLElement | null) => {
        counterElRef.current = el;
        if (el) el.textContent = String(xpRef.current.total).padStart(3, '0');
    }, []);

    /** Weighted Signal Integrity Index: 0–100 */
    const signalIntegrityIndex = useCallback((): number => {
        const cur = xpRef.current;
        const weighted =
            (cur.structural * SII_WEIGHTS.structural) +
            (cur.diagnostic * SII_WEIGHTS.diagnostic) +
            (cur.application * SII_WEIGHTS.application);
        return Math.min(Math.round((weighted / SII_MAX) * 100), 100);
    }, []);

    return { xp, awardXP, registerCounterEl, markAnswerStart, signalIntegrityIndex };
}
