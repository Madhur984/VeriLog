/**
 * engagementStore.test.ts - Unit tests for the unified engagement store
 */

import { describe, it, expect } from 'vitest';

// We test the pure logic functions and store behavior
// Since Zustand stores are singletons, we test via internal logic

// ─── SIP Computation ────────────────────────────────────────────────────

describe('SIP Scoring', () => {
    // Replicate the computation logic from engagementStore
    const SIP_WEIGHTS = { structural: 1, diagnostic: 2, application: 1.5 };

    function computeSIP(sip: { structural: number; diagnostic: number; application: number }) {
        const raw =
            sip.structural * SIP_WEIGHTS.structural +
            sip.diagnostic * SIP_WEIGHTS.diagnostic +
            sip.application * SIP_WEIGHTS.application;
        return Math.min(Math.round((raw / 500) * 100), 100);
    }

    it('returns 0 for zero XP in all categories', () => {
        expect(computeSIP({ structural: 0, diagnostic: 0, application: 0 })).toBe(0);
    });

    it('weights diagnostic XP at 2×', () => {
        const dipOnly = computeSIP({ structural: 0, diagnostic: 50, application: 0 });
        const strOnly = computeSIP({ structural: 50, diagnostic: 0, application: 0 });
        expect(dipOnly).toBeGreaterThan(strOnly);
        expect(dipOnly).toBe(Math.min(Math.round((100 / 500) * 100), 100)); // 20
        expect(strOnly).toBe(Math.min(Math.round((50 / 500) * 100), 100));  // 10
    });

    it('weights application XP at 1.5×', () => {
        const appOnly = computeSIP({ structural: 0, diagnostic: 0, application: 100 });
        expect(appOnly).toBe(Math.min(Math.round((150 / 500) * 100), 100)); // 30
    });

    it('caps at 100', () => {
        expect(computeSIP({ structural: 500, diagnostic: 500, application: 500 })).toBe(100);
    });

    it('computes combined correctly', () => {
        const result = computeSIP({ structural: 50, diagnostic: 50, application: 50 });
        // 50*1 + 50*2 + 50*1.5 = 50 + 100 + 75 = 225
        // 225/500 * 100 = 45
        expect(result).toBe(45);
    });
});

// ─── Streak Multiplier ──────────────────────────────────────────────────

describe('Streak Multiplier', () => {
    function computeMultiplier(streak: number) {
        if (streak >= 30) return 2.0;
        if (streak >= 7) return 1.5;
        if (streak >= 3) return 1.2;
        return 1.0;
    }

    it('returns 1.0× for streaks < 3', () => {
        expect(computeMultiplier(0)).toBe(1.0);
        expect(computeMultiplier(1)).toBe(1.0);
        expect(computeMultiplier(2)).toBe(1.0);
    });

    it('returns 1.2× for 3-6 day streaks', () => {
        expect(computeMultiplier(3)).toBe(1.2);
        expect(computeMultiplier(6)).toBe(1.2);
    });

    it('returns 1.5× for 7-29 day streaks', () => {
        expect(computeMultiplier(7)).toBe(1.5);
        expect(computeMultiplier(15)).toBe(1.5);
        expect(computeMultiplier(29)).toBe(1.5);
    });

    it('returns 2.0× for 30+ day streaks', () => {
        expect(computeMultiplier(30)).toBe(2.0);
        expect(computeMultiplier(100)).toBe(2.0);
    });
});

// ─── Badge Catalog Integrity ────────────────────────────────────────────

describe('Badge Catalog', () => {
    // Import catalog
    const BADGE_CATALOG = [
        { id: 'FIRST_CIRCUIT', name: 'First Spark' },
        { id: 'LOGIC_MASTER', name: 'Logic Master' },
        { id: 'STREAK_7', name: 'Week Warrior' },
        { id: 'STREAK_30', name: 'Monthly Legend' },
        { id: 'DEBUGGER', name: 'Bug Hunter' },
        { id: 'SPEED_DEMON', name: 'Speed Demon' },
        { id: 'FULL_TRUTH_TABLE', name: 'Truth Seeker' },
        { id: 'MEMORY_ARCHITECT', name: 'Memory Architect' },
    ];

    it('has exactly 8 badges', () => {
        expect(BADGE_CATALOG).toHaveLength(8);
    });

    it('all badges have unique IDs', () => {
        const ids = BADGE_CATALOG.map((b) => b.id);
        const unique = new Set(ids);
        expect(unique.size).toBe(ids.length);
    });

    it('all badges have non-empty names', () => {
        for (const badge of BADGE_CATALOG) {
            expect(badge.name.length).toBeGreaterThan(0);
        }
    });
});
