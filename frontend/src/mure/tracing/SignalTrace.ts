/**
 * mure/tracing/SignalTrace.ts — Ring-Buffer Signal Trace Recorder
 *
 * Records (time, voltage) pairs for oscilloscope rendering.
 * Ring-buffer design prevents unbounded memory growth.
 */

export interface TraceData {
    times: Float64Array;
    voltages: Float32Array;
    writeHead: number;
    capacity: number;
}

export class SignalTrace {
    private traces = new Map<string, TraceData>();
    private readonly capacity: number;

    constructor(capacity = 4096) {
        this.capacity = capacity;
    }

    private key(nodeId: string, portIndex: number): string {
        return `${nodeId}::${portIndex}`;
    }

    private ensureTrace(nodeId: string, portIndex: number): TraceData {
        const k = this.key(nodeId, portIndex);
        if (!this.traces.has(k)) {
            this.traces.set(k, {
                times: new Float64Array(this.capacity),
                voltages: new Float32Array(this.capacity),
                writeHead: 0,
                capacity: this.capacity,
            });
        }
        return this.traces.get(k)!;
    }

    /** Record a voltage sample at simulated time (nanoseconds → seconds) */
    record(nodeId: string, portIndex: number, timeNs: number, voltage: number): void {
        const trace = this.ensureTrace(nodeId, portIndex);
        const i = trace.writeHead % trace.capacity;
        trace.times[i] = timeNs * 1e-9; // ns → seconds
        trace.voltages[i] = voltage;
        trace.writeHead++;
    }

    /** Get the most recent `count` samples in chronological order */
    getSamples(nodeId: string, portIndex: number, count?: number): { time: number; voltage: number }[] {
        const k = this.key(nodeId, portIndex);
        const trace = this.traces.get(k);
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

    /** Get raw trace data for direct canvas rendering */
    getRawTrace(nodeId: string, portIndex: number): TraceData | null {
        return this.traces.get(this.key(nodeId, portIndex)) ?? null;
    }

    /** Clear a specific trace */
    clearTrace(nodeId: string, portIndex: number): void {
        const k = this.key(nodeId, portIndex);
        const trace = this.traces.get(k);
        if (trace) {
            trace.writeHead = 0;
            trace.times.fill(0);
            trace.voltages.fill(0);
        }
    }

    /** Clear all traces */
    clearAll(): void {
        this.traces.forEach(trace => {
            trace.writeHead = 0;
            trace.times.fill(0);
            trace.voltages.fill(0);
        });
    }

    /** List all traced signals */
    get tracedSignals(): string[] {
        return [...this.traces.keys()];
    }

    /** Total number of traced signals */
    get traceCount(): number {
        return this.traces.size;
    }
}
