/**
 * engine/SignalRecorder.ts — Ring-Buffer Signal Trace Recorder
 *
 * Records (time, voltage) pairs for one or more nodes.
 * Designed to be read locklessly from the render thread
 * (SharedArrayBuffer pattern approximated here with Float32/Float64 arrays).
 *
 * Usage:
 *   const rec = new SignalRecorder(4096);
 *   rec.record('nodeA', 'out', timeNs, voltage);
 *   const trace = rec.getTrace('nodeA', 'out');
 */

import type { NodeId, PortId, SignalTrace } from './types';

export class SignalRecorder {
    private traces = new Map<string, SignalTrace>();
    private readonly capacity: number;

    constructor(capacity = 4096) {
        this.capacity = capacity;
    }

    private key(nodeId: NodeId, portId: PortId): string {
        return `${nodeId}::${portId}`;
    }

    private ensureTrace(nodeId: NodeId, portId: PortId): SignalTrace {
        const k = this.key(nodeId, portId);
        if (!this.traces.has(k)) {
            this.traces.set(k, {
                nodeId,
                portId,
                times: new Float64Array(this.capacity),
                voltages: new Float32Array(this.capacity),
                writeHead: 0,
                capacity: this.capacity,
            });
        }
        return this.traces.get(k)!;
    }

    /** Record a voltage sample at simulated time (in nanoseconds converted to seconds) */
    record(nodeId: NodeId, portId: PortId, timeNs: number, voltage: number): void {
        const trace = this.ensureTrace(nodeId, portId);
        const i = trace.writeHead % trace.capacity;
        trace.times[i] = timeNs * 1e-9;  // convert ns → seconds
        trace.voltages[i] = voltage;
        trace.writeHead++;
    }

    /** Get the most recent `count` samples in chronological order */
    getSamples(nodeId: NodeId, portId: PortId, count?: number): { time: number; voltage: number }[] {
        const trace = this.traces.get(this.key(nodeId, portId));
        if (!trace || trace.writeHead === 0) return [];

        const cap = trace.capacity;
        const total = Math.min(trace.writeHead, cap);
        const n = count ? Math.min(count, total) : total;
        const result: { time: number; voltage: number }[] = [];

        for (let i = n - 1; i >= 0; i--) {
            const rawIdx = ((trace.writeHead - 1 - i) % cap + cap) % cap;
            result.push({
                time: trace.times[rawIdx],
                voltage: trace.voltages[rawIdx],
            });
        }
        return result;
    }

    /** Get the raw Float32Array of voltages (for direct canvas/WebGL upload) */
    getTrace(nodeId: NodeId, portId: PortId): SignalTrace | null {
        return this.traces.get(this.key(nodeId, portId)) ?? null;
    }

    /** Clear a specific trace */
    clearTrace(nodeId: NodeId, portId: PortId): void {
        const k = this.key(nodeId, portId);
        const trace = this.traces.get(k);
        if (trace) {
            trace.writeHead = 0;
            trace.times.fill(0);
            trace.voltages.fill(0);
        }
    }

    /** Clear all recorded traces */
    clearAll(): void {
        this.traces.forEach(trace => {
            trace.writeHead = 0;
            trace.times.fill(0);
            trace.voltages.fill(0);
        });
    }

    get tracedSignals(): string[] {
        return Array.from(this.traces.keys());
    }
}
