/**
 * mure/core/EventQueue.ts - Min-Heap Priority Queue for Timed Simulation Events
 *
 * Used by SimulationKernel to schedule gate propagation delays.
 * Events fire at a specific simulated nanosecond timestamp.
 *
 * Complexity: push O(log n), pop O(log n), peek O(1)
 */

import type { NodeId } from './SignalNode';

export interface SimEvent {
    fireAt: number;         // nanoseconds
    targetNode: NodeId;
    targetPort: number;
    newLogic: boolean;
    newVoltage: number;
}

export class EventQueue {
    private heap: SimEvent[] = [];

    get size(): number {
        return this.heap.length;
    }

    get isEmpty(): boolean {
        return this.heap.length === 0;
    }

    push(event: SimEvent): void {
        this.heap.push(event);
        this.bubbleUp(this.heap.length - 1);
    }

    peek(): SimEvent | undefined {
        return this.heap[0];
    }

    pop(): SimEvent | undefined {
        if (this.heap.length === 0) return undefined;
        const min = this.heap[0];
        const last = this.heap.pop()!;
        if (this.heap.length > 0) {
            this.heap[0] = last;
            this.siftDown(0);
        }
        return min;
    }

    /** Pop all events up to and including `time` (nanoseconds) */
    popUntil(time: number): SimEvent[] {
        const events: SimEvent[] = [];
        while (!this.isEmpty && this.heap[0].fireAt <= time) {
            events.push(this.pop()!);
        }
        return events;
    }

    clear(): void {
        this.heap = [];
    }

    // ─── Heap Helpers ─────────────────────────────────────────────────

    private bubbleUp(i: number): void {
        while (i > 0) {
            const parent = (i - 1) >> 1;
            if (this.heap[parent].fireAt <= this.heap[i].fireAt) break;
            [this.heap[parent], this.heap[i]] = [this.heap[i], this.heap[parent]];
            i = parent;
        }
    }

    private siftDown(i: number): void {
        const n = this.heap.length;
        while (true) {
            let smallest = i;
            const l = 2 * i + 1;
            const r = 2 * i + 2;
            if (l < n && this.heap[l].fireAt < this.heap[smallest].fireAt) smallest = l;
            if (r < n && this.heap[r].fireAt < this.heap[smallest].fireAt) smallest = r;
            if (smallest === i) break;
            [this.heap[smallest], this.heap[i]] = [this.heap[i], this.heap[smallest]];
            i = smallest;
        }
    }
}
