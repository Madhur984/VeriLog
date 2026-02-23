import { useState, useEffect, useCallback, useMemo } from 'react';

/* ─── Types ─── */
export interface GamificationState {
    xp: number;
    level: number;
    streak: number;
    lastActiveDate: string;
    battery: number;
    maxBattery: number;
    modulesCompleted: string[];
}

export interface XPEvent {
    type: 'activity' | 'module' | 'assessment' | 'streak_bonus';
    amount: number;
    label: string;
}

/* ─── Constants ─── */
const STORAGE_KEY = 'vl_gamification';
const XP_PER_LEVEL = 100;
const MAX_BATTERY = 5;
const BATTERY_RECHARGE_MS = 30 * 60 * 1000; // 30 minutes

const XP_VALUES = {
    activity: 10,
    module: 25,
    assessment: 50,
    streak_bonus: 15,
} as const;

/* ─── Helpers ─── */
function todayStr(): string {
    return new Date().toISOString().slice(0, 10);
}

function loadState(): GamificationState {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) return JSON.parse(raw) as GamificationState;
    } catch { /* corrupted — reset */ }

    return {
        xp: 0,
        level: 1,
        streak: 0,
        lastActiveDate: '',
        battery: MAX_BATTERY,
        maxBattery: MAX_BATTERY,
        modulesCompleted: [],
    };
}

function saveState(state: GamificationState): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

/* ─── Hook ─── */
export function useGamification() {
    const [state, setState] = useState<GamificationState>(loadState);
    const [recentXPEvent, setRecentXPEvent] = useState<XPEvent | null>(null);
    const [leveledUp, setLeveledUp] = useState(false);

    // Persist on every change
    useEffect(() => { saveState(state); }, [state]);

    // Check & update streak on mount
    useEffect(() => {
        const today = todayStr();
        setState(prev => {
            if (prev.lastActiveDate === today) return prev;

            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yStr = yesterday.toISOString().slice(0, 10);

            const streak = prev.lastActiveDate === yStr ? prev.streak + 1 : 1;
            return { ...prev, streak, lastActiveDate: today };
        });
    }, []);

    // Battery recharge timer
    useEffect(() => {
        if (state.battery >= MAX_BATTERY) return;
        const timer = setInterval(() => {
            setState(prev => ({
                ...prev,
                battery: Math.min(MAX_BATTERY, prev.battery + 1),
            }));
        }, BATTERY_RECHARGE_MS);
        return () => clearInterval(timer);
    }, [state.battery]);

    // Earn XP
    const earnXP = useCallback((type: XPEvent['type'], customLabel?: string) => {
        const amount = XP_VALUES[type];
        const label = customLabel || `+${amount} XP`;
        const event: XPEvent = { type, amount, label };

        setRecentXPEvent(event);
        setTimeout(() => setRecentXPEvent(null), 3000);

        setState(prev => {
            const newXP = prev.xp + amount;
            const newLevel = Math.floor(newXP / XP_PER_LEVEL) + 1;
            if (newLevel > prev.level) setLeveledUp(true);
            return { ...prev, xp: newXP, level: newLevel };
        });
    }, []);

    // Drain battery (wrong answer)
    const drainBattery = useCallback(() => {
        setState(prev => ({
            ...prev,
            battery: Math.max(0, prev.battery - 1),
        }));
    }, []);

    // Complete module
    const completeModule = useCallback((moduleId: string) => {
        setState(prev => {
            if (prev.modulesCompleted.includes(moduleId)) return prev;
            return {
                ...prev,
                modulesCompleted: [...prev.modulesCompleted, moduleId],
            };
        });
        earnXP('module', `Module ${moduleId} Complete!`);
    }, [earnXP]);

    // Dismiss level-up
    const dismissLevelUp = useCallback(() => setLeveledUp(false), []);

    // Derived values
    const xpProgress = useMemo(() => (state.xp % XP_PER_LEVEL) / XP_PER_LEVEL, [state.xp]);
    const xpToNextLevel = useMemo(() => XP_PER_LEVEL - (state.xp % XP_PER_LEVEL), [state.xp]);

    return {
        ...state,
        xpProgress,
        xpToNextLevel,
        recentXPEvent,
        leveledUp,
        earnXP,
        drainBattery,
        completeModule,
        dismissLevelUp,
    };
}
