/**
 * gamificationStore.ts - Unified Progression & Rewards Engine (v2)
 * 
 * Consolidates user identity, XP (SIP), streaks, economy, and skill tree progress.
 * Acts as the single source of truth for the platform's gamification layer.
 * 
 * Merged from: gamificationStore.ts, engagementStore.ts, userStore.ts
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
    unlockedAt: number;
}

interface StreakState {
    current: number;
    lastActiveDate: string; // YYYY-MM-DD
    longestEver: number;
    freezesRemaining: number;
}

interface SkillProgress {
    completedIds: string[];
    unlockedIds: string[];
}

export interface GamificationState {
    // Identity
    firstName: string | null;
    hasSeenGreeting: boolean;

    // Progression Metrics
    xp: {
        total: number;
        structural: number;
        diagnostic: number;
        application: number;
    };
    level: number;
    gems: number;
    hearts: number;
    maxHearts: number;

    // Engagement
    streak: StreakState;
    badges: UnlockedBadge[];

    // Skill Tree
    skills: SkillProgress;

    // Actions
    setFirstName: (name: string | null) => void;
    setHasSeenGreeting: (seen: boolean) => void;

    awardXP: (category: XPCategory, amount: number) => void;
    completeSkill: (skillId: string) => void;
    unlockSkill: (skillId: string) => void;

    checkStreak: () => void;
    useStreakFreeze: () => boolean;
    getStreakMultiplier: () => number;
    getSIPScore: () => number;

    unlockBadge: (badgeId: BadgeId) => void;
    hasBadge: (badgeId: BadgeId) => boolean;

    addGems: (amount: number) => void;
    spendGems: (amount: number) => boolean;

    loseHeart: () => void;
    refillHearts: () => void;

    resetAll: () => void;
}

// ─── Helpers ────────────────────────────────────────────────────────────

const todayISO = () => new Date().toISOString().slice(0, 10);
const yesterdayISO = () => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return d.toISOString().slice(0, 10);
};

const calculateLevel = (totalXP: number) => {
    // Basic logarithmic level curve: Level = floor(sqrt(XP / 100)) + 1
    return Math.floor(Math.sqrt(totalXP / 100)) + 1;
};

// SIP weights: diagnostic(×2) > application(×1.5) > structural(×1)
const SIP_WEIGHTS: Record<XPCategory, number> = {
    structural: 1,
    diagnostic: 2,
    application: 1.5,
};

function computeSIPMultiplier(streak: number): number {
    if (streak >= 30) return 2.0;
    if (streak >= 7) return 1.5;
    if (streak >= 3) return 1.2;
    return 1.0;
}

// ─── Store ──────────────────────────────────────────────────────────────

export const useGamificationStore = create<GamificationState>()(
    persist(
        (set, get) => ({
            firstName: null,
            hasSeenGreeting: false,

            xp: { total: 0, structural: 0, diagnostic: 0, application: 0 },
            level: 1,
            gems: 500,
            hearts: 5,
            maxHearts: 5,

            streak: {
                current: 0,
                lastActiveDate: '',
                longestEver: 0,
                freezesRemaining: 1,
            },
            badges: [],
            skills: {
                completedIds: [],
                unlockedIds: ['signals'], // Initial skill
            },

            setFirstName: (name) => set({ firstName: name }),
            setHasSeenGreeting: (seen) => set({ hasSeenGreeting: seen }),

            awardXP: (category, amount) => {
                const multiplier = get().getStreakMultiplier();
                const adjusted = Math.round(amount * multiplier);

                set((state) => {
                    const newSIP = {
                        ...state.xp,
                        [category]: state.xp[category] + adjusted,
                    };
                    const newTotalXP = state.xp.total + adjusted;

                    return {
                        xp: {
                            ...newSIP,
                            total: newTotalXP
                        },
                        level: calculateLevel(newTotalXP)
                    };
                });
            },

            completeSkill: (skillId) => {
                set((state) => ({
                    skills: {
                        ...state.skills,
                        completedIds: state.skills.completedIds.includes(skillId)
                            ? state.skills.completedIds
                            : [...state.skills.completedIds, skillId]
                    }
                }));
            },

            unlockSkill: (skillId) => {
                set((state) => ({
                    skills: {
                        ...state.skills,
                        unlockedIds: state.skills.unlockedIds.includes(skillId)
                            ? state.skills.unlockedIds
                            : [...state.skills.unlockedIds, skillId]
                    }
                }));
            },

            checkStreak: () => {
                const today = todayISO();
                const state = get();
                if (state.streak.lastActiveDate === today) return;

                const yesterday = yesterdayISO();
                let newStreak: number;

                if (state.streak.lastActiveDate === yesterday) {
                    newStreak = state.streak.current + 1;
                } else if (state.streak.current > 0 && state.streak.freezesRemaining > 0) {
                    newStreak = state.streak.current;
                } else {
                    newStreak = 1;
                }

                set({
                    streak: {
                        ...state.streak,
                        current: newStreak,
                        lastActiveDate: today,
                        longestEver: Math.max(state.streak.longestEver, newStreak),
                    }
                });
            },

            getStreakMultiplier: () => {
                return computeSIPMultiplier(get().streak.current);
            },

            getSIPScore: () => {
                const { xp } = get();
                const raw =
                    xp.structural * SIP_WEIGHTS.structural +
                    xp.diagnostic * SIP_WEIGHTS.diagnostic +
                    xp.application * SIP_WEIGHTS.application;
                // Normalize to 0-100 scale (soft cap at 500 raw points)
                return Math.min(Math.round((raw / 500) * 100), 100);
            },

            useStreakFreeze: () => {
                const { streak } = get();
                if (streak.freezesRemaining <= 0) return false;
                set({
                    streak: {
                        ...streak,
                        freezesRemaining: streak.freezesRemaining - 1,
                    }
                });
                return true;
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

            addGems: (amount) => set((state) => ({ gems: state.gems + amount })),
            spendGems: (amount) => {
                const { gems } = get();
                if (gems >= amount) {
                    set({ gems: gems - amount });
                    return true;
                }
                return false;
            },

            loseHeart: () => set((state) => ({ hearts: Math.max(0, state.hearts - 1) })),
            refillHearts: () => set((state) => ({ hearts: state.maxHearts })),

            resetAll: () => set({
                xp: { total: 0, structural: 0, diagnostic: 0, application: 0 },
                level: 1,
                gems: 500,
                hearts: 5,
                streak: { current: 0, lastActiveDate: '', longestEver: 0, freezesRemaining: 1 },
                badges: [],
                skills: { completedIds: [], unlockedIds: ['signals'] }
            })
        }),
        { name: 'digilogic-gamification-v2' }
    )
);
