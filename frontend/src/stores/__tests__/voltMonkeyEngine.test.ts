/**
 * voltMonkeyEngine.test.ts - Tests for VoltMonkey hint engine
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { VoltMonkeyEngine, type HintContext } from '../../engines/voltMonkeyEngine';

describe('VoltMonkeyEngine', () => {
    let engine: VoltMonkeyEngine;

    beforeEach(() => {
        engine = new VoltMonkeyEngine();
    });

    describe('getGreeting', () => {
        it('returns a hint with idle mood', () => {
            const hint = engine.getGreeting();
            expect(hint.mood).toBe('idle');
            expect(hint.level).toBe(0);
            expect(hint.text.length).toBeGreaterThan(0);
            expect(hint.emoji).toBe('🐵');
        });
    });

    describe('getHint', () => {
        it('returns level 0 hint for 0 attempts', () => {
            const context: HintContext = { attemptCount: 0 };
            const hint = engine.getHint(context);
            expect(hint.level).toBe(0);
        });

        it('escalates hint level with more attempts', () => {
            expect(engine.getHint({ attemptCount: 0 }).level).toBe(0);
            expect(engine.getHint({ attemptCount: 1 }).level).toBe(1);
            expect(engine.getHint({ attemptCount: 2 }).level).toBe(2);
            expect(engine.getHint({ attemptCount: 4 }).level).toBe(3);
        });

        it('returns mission-specific hints when missionId is provided', () => {
            const context: HintContext = { missionId: 'dead-led', attemptCount: 0 };
            const hint = engine.getHint(context);
            expect(hint.text.length).toBeGreaterThan(0);
            // Should be from the dead-led hint tree
            expect(hint.level).toBe(0);
        });

        it('falls back to generic hints for unknown missions', () => {
            const context: HintContext = { missionId: 'unknown-mission', attemptCount: 0 };
            const hint = engine.getHint(context);
            expect(hint.text.length).toBeGreaterThan(0);
        });
    });

    describe('getCelebration', () => {
        it('returns celebrating mood', () => {
            const hint = engine.getCelebration();
            expect(hint.mood).toBe('celebrating');
            expect(hint.emoji).toBe('🎉');
        });
    });

    describe('getEncouragement', () => {
        it('returns excited mood', () => {
            const hint = engine.getEncouragement();
            expect(hint.mood).toBe('excited');
        });
    });

    describe('getCircuitAdvice', () => {
        it('handles empty canvas', () => {
            const advice = engine.getCircuitAdvice({
                attemptCount: 0,
                circuitState: { nodeCount: 0, edgeCount: 0, hasClosedLoop: false },
            });
            expect(advice.text).toContain('Empty canvas');
        });

        it('suggests wiring when nodes have no edges', () => {
            const advice = engine.getCircuitAdvice({
                attemptCount: 0,
                circuitState: { nodeCount: 3, edgeCount: 0, hasClosedLoop: false },
            });
            expect(advice.text).toContain('wire');
        });

        it('warns about open loops', () => {
            const advice = engine.getCircuitAdvice({
                attemptCount: 0,
                circuitState: { nodeCount: 3, edgeCount: 2, hasClosedLoop: false },
            });
            expect(advice.text).toContain('closed loop');
        });

        it('encourages simulation when circuit is closed', () => {
            const advice = engine.getCircuitAdvice({
                attemptCount: 0,
                circuitState: { nodeCount: 3, edgeCount: 3, hasClosedLoop: true },
            });
            expect(advice.text).toContain('Play');
        });

        it('handles missing circuitState', () => {
            const advice = engine.getCircuitAdvice({ attemptCount: 0 });
            expect(advice.text).toContain('Build something');
        });
    });

    describe('resetHintIndex', () => {
        it('resets the internal hint counter', () => {
            engine.getHint({ attemptCount: 0 });
            engine.getHint({ attemptCount: 0 });
            engine.resetHintIndex();
            // After reset, the first hint should be index 0 again
            const hint = engine.getHint({ attemptCount: 0 });
            expect(hint.text.length).toBeGreaterThan(0);
        });
    });
});
