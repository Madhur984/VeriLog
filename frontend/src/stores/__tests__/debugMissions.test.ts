/**
 * debugMissions.test.ts - Data integrity tests for debug missions
 */

import { describe, it, expect } from 'vitest';
import { DEBUG_MISSIONS } from '../../data/debugMissions';

describe('Debug Missions', () => {
    it('has at least 3 missions', () => {
        expect(DEBUG_MISSIONS.length).toBeGreaterThanOrEqual(3);
    });

    it('all missions have unique IDs', () => {
        const ids = DEBUG_MISSIONS.map((m) => m.id);
        expect(new Set(ids).size).toBe(ids.length);
    });

    it('all missions have required fields', () => {
        for (const mission of DEBUG_MISSIONS) {
            expect(mission.id).toBeTruthy();
            expect(mission.title).toBeTruthy();
            expect(mission.description).toBeTruthy();
            expect(mission.symptom).toBeTruthy();
            expect(mission.hint).toBeTruthy();
            expect(mission.solution).toBeTruthy();
            expect(['easy', 'medium', 'hard']).toContain(mission.difficulty);
        }
    });

    it('all missions have at least 1 node', () => {
        for (const mission of DEBUG_MISSIONS) {
            expect(mission.nodes.length).toBeGreaterThanOrEqual(1);
        }
    });

    it('all missions have a brokenAspect defined', () => {
        for (const mission of DEBUG_MISSIONS) {
            expect(mission.brokenAspect).toBeDefined();
            expect(['missing_connection', 'wrong_param', 'wrong_node']).toContain(
                mission.brokenAspect.type
            );
            expect(mission.brokenAspect.detail).toBeTruthy();
        }
    });

    it('difficulty distribution covers all levels', () => {
        const difficulties = new Set(DEBUG_MISSIONS.map((m) => m.difficulty));
        expect(difficulties.has('easy')).toBe(true);
        expect(difficulties.has('medium')).toBe(true);
        expect(difficulties.has('hard')).toBe(true);
    });
});
