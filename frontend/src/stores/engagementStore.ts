/**
 * engagementStore.ts — Unified Engagement System
 *
 * Consolidates streak tracking, Signal Integrity Points, and badge management
 * into a single Zustand store with localStorage persistence.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ─── Badge Definitions ─────────────────────────────────────────────────

export type BadgeId =
    | 'FIRST_CIRCUIT'
    | 'LOGIC_MASTER'
    | 'STREAK_7'
    | 'STREAK_30'
    | 'DEBUGGER'
    | 'SPEED_DEMON'
    | 'FULL_TRUTH_TABLE'
    | 'MEMORY_ARCHITECT';

export interface BadgeDef {
    id: BadgeId;
    name: string;
    description: string;
    icon: string;
}

export const BADGE_CATALOG: BadgeDef[] = [
    { id: 'FIRST_CIRCUIT', name: 'First Spark', description: 'Complete your first circuit', icon: '⚡' },
    { id: 'LOGIC_MASTER', name: 'Logic Master', description: 'Use all 7 logic gate types', icon: '🧠' },
    { id: 'STREAK_7', name: 'Week Warrior', description: 'Maintain a 7-day streak', icon: '🔥' },
    { id: 'STREAK_30', name: 'Monthly Legend', description: 'Maintain a 30-day streak', icon: '🏆' },
    { id: 'DEBUGGER', name: 'Bug Hunter', description: 'Complete your first debug mission', icon: '🐛' },
    { id: 'SPEED_DEMON', name: 'Speed Demon', description: 'Complete an activity in under 30 seconds', icon: '⏱️' },
    { id: 'FULL_TRUTH_TABLE', name: 'Truth Seeker', description: 'View a complete truth table', icon: '📊' },
    { id: 'MEMORY_ARCHITECT', name: 'Memory Architect', description: 'Build a circuit with a register or memory', icon: '💾' },
];

// ─── Types ──────────────────────────────────────────────────────────────

export type XPCategory = 'structural' | 'diagnostic' | 'application';

interface UnlockedBadge {
    id: BadgeId;
    unlockedAt: number; // timestamp
}

interface StreakState {
    current: number;
    lastActiveDate: string; // ISO date string YYYY-MM-DD
    longestEver: number;
    freezesRemaining: number;
}

interface SIPState {
    structural: number;
    diagnostic: number;
    application: number;
}

export interface EngagementState {
    // Streak
    streak: StreakState;

    // Signal Integrity Points
    sip: SIPState;
    totalXP: number;

    // Badges
    badges: UnlockedBadge[];

    // Actions
    checkStreak: () => void;
    awardXP: (category: XPCategory, amount: number) => void;
    unlockBadge: (badgeId: BadgeId) => void;
    hasBadge: (badgeId: BadgeId) => boolean;
    getStreakMultiplier: () => number;
    getSIPScore: () => number;
    useStreakFreeze: () => boolean;
}

// ─── Helpers ────────────────────────────────────────────────────────────

function todayISO(): string {
    return new Date().toISOString().slice(0, 10);
}

function yesterdayISO(): string {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return d.toISOString().slice(0, 10);
}

// SIP weights: diagnostic(×2) > application(×1.5) > structural(×1)
const SIP_WEIGHTS: Record<XPCategory, number> = {
    structural: 1,
    diagnostic: 2,
    application: 1.5,
};

function computeSIP(sip: SIPState): number {
    const raw =
        sip.structural * SIP_WEIGHTS.structural +
        sip.diagnostic * SIP_WEIGHTS.diagnostic +
        sip.application * SIP_WEIGHTS.application;
    // Normalize to 0-100 scale (soft cap at 500 raw points)
    return Math.min(Math.round((raw / 500) * 100), 100);
}

function computeMultiplier(streak: number): number {
    if (streak >= 30) return 2.0;
    if (streak >= 7) return 1.5;
    if (streak >= 3) return 1.2;
    return 1.0;
}

// ─── Store ──────────────────────────────────────────────────────────────

export const useEngagementStore = create<EngagementState>()(
    persist(
        (set, get) => ({
            streak: {
                current: 0,
                lastActiveDate: '',
                longestEver: 0,
                freezesRemaining: 1,
            },
            sip: { structural: 0, diagnostic: 0, application: 0 },
            totalXP: 0,
            badges: [],

            checkStreak: () => {
                const today = todayISO();
                set((state) => {
                    if (state.streak.lastActiveDate === today) return state;

                    const yesterday = yesterdayISO();
                    let newStreak: number;

                    if (state.streak.lastActiveDate === yesterday) {
                        // Consecutive day
                        newStreak = state.streak.current + 1;
                    } else if (state.streak.current > 0 && state.streak.freezesRemaining > 0) {
                        // Missed a day but have a freeze
                        newStreak = state.streak.current; // keep streak
                    } else {
                        // Streak broken
                        newStreak = 1;
                    }

                    return {
                        streak: {
                            ...state.streak,
                            current: newStreak,
                            lastActiveDate: today,
                            longestEver: Math.max(state.streak.longestEver, newStreak),
                        },
                    };
                });
            },

            awardXP: (category, amount) => {
                const multiplier = get().getStreakMultiplier();
                const adjusted = Math.round(amount * multiplier);

                set((state) => ({
                    sip: {
                        ...state.sip,
                        [category]: state.sip[category] + adjusted,
                    },
                    totalXP: state.totalXP + adjusted,
                }));
            },

            unlockBadge: (badgeId) => {
                set((state) => {
                    if (state.badges.some((b) => b.id === badgeId)) return state;
                    return {
                        badges: [...state.badges, { id: badgeId, unlockedAt: Date.now() }],
                    };
                });
            },

            hasBadge: (badgeId) => {
                return get().badges.some((b) => b.id === badgeId);
            },

            getStreakMultiplier: () => {
                return computeMultiplier(get().streak.current);
            },

            getSIPScore: () => {
                return computeSIP(get().sip);
            },

            useStreakFreeze: () => {
                const { streak } = get();
                if (streak.freezesRemaining <= 0) return false;
                set((state) => ({
                    streak: {
                        ...state.streak,
                        freezesRemaining: state.streak.freezesRemaining - 1,
                    },
                }));
                return true;
            },
        }),
        { name: 'vl-engagement-v2' }
    )
);
