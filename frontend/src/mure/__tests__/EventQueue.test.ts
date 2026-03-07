import { describe, it, expect, beforeEach } from 'vitest';
import { EventQueue } from '../core/EventQueue';
import type { SimEvent } from '../core/EventQueue';

describe('EventQueue', () => {
    let queue: EventQueue;

    beforeEach(() => {
        queue = new EventQueue();
    });

    it('starts empty', () => {
        expect(queue.isEmpty).toBe(true);
        expect(queue.size).toBe(0);
    });

    it('pushes and pops in priority order', () => {
        queue.push({ fireAt: 30, targetNode: 'a', targetPort: 0, newLogic: true, newVoltage: 5 });
        queue.push({ fireAt: 10, targetNode: 'b', targetPort: 0, newLogic: false, newVoltage: 0 });
        queue.push({ fireAt: 20, targetNode: 'c', targetPort: 0, newLogic: true, newVoltage: 3 });

        expect(queue.size).toBe(3);

        const first = queue.pop()!;
        expect(first.fireAt).toBe(10);
        expect(first.targetNode).toBe('b');

        const second = queue.pop()!;
        expect(second.fireAt).toBe(20);

        const third = queue.pop()!;
        expect(third.fireAt).toBe(30);

        expect(queue.isEmpty).toBe(true);
    });

    it('peek returns earliest without removing', () => {
        queue.push({ fireAt: 50, targetNode: 'a', targetPort: 0, newLogic: true, newVoltage: 5 });
        queue.push({ fireAt: 10, targetNode: 'b', targetPort: 0, newLogic: false, newVoltage: 0 });

        const peeked = queue.peek();
        expect(peeked?.fireAt).toBe(10);
        expect(queue.size).toBe(2);
    });

    it('popUntil returns events up to time', () => {
        queue.push({ fireAt: 10, targetNode: 'a', targetPort: 0, newLogic: true, newVoltage: 5 });
        queue.push({ fireAt: 20, targetNode: 'b', targetPort: 0, newLogic: true, newVoltage: 5 });
        queue.push({ fireAt: 30, targetNode: 'c', targetPort: 0, newLogic: true, newVoltage: 5 });
        queue.push({ fireAt: 40, targetNode: 'd', targetPort: 0, newLogic: true, newVoltage: 5 });

        const events = queue.popUntil(25);
        expect(events).toHaveLength(2);
        expect(events[0].fireAt).toBe(10);
        expect(events[1].fireAt).toBe(20);
        expect(queue.size).toBe(2);
    });

    it('handles empty queue gracefully', () => {
        expect(queue.pop()).toBeUndefined();
        expect(queue.peek()).toBeUndefined();
        expect(queue.popUntil(100)).toHaveLength(0);
    });

    it('clear empties the queue', () => {
        queue.push({ fireAt: 10, targetNode: 'a', targetPort: 0, newLogic: true, newVoltage: 5 });
        queue.push({ fireAt: 20, targetNode: 'b', targetPort: 0, newLogic: true, newVoltage: 5 });
        queue.clear();
        expect(queue.isEmpty).toBe(true);
        expect(queue.size).toBe(0);
    });

    it('handles single element', () => {
        const event: SimEvent = { fireAt: 42, targetNode: 'x', targetPort: 0, newLogic: true, newVoltage: 5 };
        queue.push(event);
        expect(queue.size).toBe(1);
        const popped = queue.pop()!;
        expect(popped.fireAt).toBe(42);
        expect(queue.isEmpty).toBe(true);
    });

    it('maintains heap property with many insertions', () => {
        const times = [50, 30, 80, 10, 60, 20, 90, 40, 70, 5];
        for (const t of times) {
            queue.push({ fireAt: t, targetNode: `n${t}`, targetPort: 0, newLogic: true, newVoltage: 5 });
        }

        const sorted: number[] = [];
        while (!queue.isEmpty) {
            sorted.push(queue.pop()!.fireAt);
        }

        for (let i = 1; i < sorted.length; i++) {
            expect(sorted[i]).toBeGreaterThanOrEqual(sorted[i - 1]);
        }
    });
});
