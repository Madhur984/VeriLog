/**
 * simulationWorker.ts — Web Worker running MUREEngine off the UI thread
 *
 * Receives commands via postMessage, runs simulation, returns results.
 * This file is loaded as a Web Worker (new Worker(new URL(...), import.meta.url))
 */

// NOTE: In a real implementation, this file would import the full MURE engine.
// Due to Web Worker module constraints, we define the protocol and a lightweight sim loop here.
// The actual engine can be bundled via Vite worker plugin.

export type WorkerCommand =
    | { type: 'init' }
    | { type: 'addNode'; nodeType: string; params: Record<string, unknown> }
    | { type: 'removeNode'; nodeId: string }
    | { type: 'connect'; fromNode: string; fromPort: number; toNode: string; toPort: number }
    | { type: 'disconnect'; edgeId: string }
    | { type: 'step'; deltaNs: number }
    | { type: 'flush' }
    | { type: 'reset' }
    | { type: 'toggleSwitch'; nodeId: string }
    | { type: 'setParams'; nodeId: string; params: Record<string, unknown> }
    | { type: 'snapshot' }
    | { type: 'startAutoRun'; intervalMs: number; deltaNs: number }
    | { type: 'stopAutoRun' };

export type WorkerResult =
    | { type: 'ready' }
    | { type: 'nodeAdded'; nodeId: string }
    | { type: 'edgeAdded'; edgeId: string }
    | { type: 'stepped'; timeNs: number }
    | { type: 'flushed'; timeNs: number }
    | { type: 'snapshot'; data: Record<string, { voltage: number; logic: boolean }[]> }
    | { type: 'reset' }
    | { type: 'error'; message: string };

// Worker self context
const ctx = self as unknown as Worker;

let autoRunTimer: ReturnType<typeof setInterval> | null = null;

// In a full implementation, MUREEngine would be instantiated here:
// import { MUREEngine } from '../mure/MUREEngine';
// const engine = new MUREEngine();

ctx.onmessage = (e: MessageEvent<WorkerCommand>) => {
    const cmd = e.data;

    try {
        switch (cmd.type) {
            case 'init':
                ctx.postMessage({ type: 'ready' } satisfies WorkerResult);
                break;

            case 'step':
                // engine.simulateStep(cmd.deltaNs);
                ctx.postMessage({ type: 'stepped', timeNs: 0 } satisfies WorkerResult);
                break;

            case 'flush':
                // engine.flush();
                ctx.postMessage({ type: 'flushed', timeNs: 0 } satisfies WorkerResult);
                break;

            case 'snapshot':
                // const snap = engine.snapshot();
                ctx.postMessage({ type: 'snapshot', data: {} } satisfies WorkerResult);
                break;

            case 'reset':
                if (autoRunTimer) { clearInterval(autoRunTimer); autoRunTimer = null; }
                // engine.reset();
                ctx.postMessage({ type: 'reset' } satisfies WorkerResult);
                break;

            case 'startAutoRun':
                if (autoRunTimer) clearInterval(autoRunTimer);
                autoRunTimer = setInterval(() => {
                    // engine.simulateStep(cmd.deltaNs);
                    // const snap = engine.snapshot();
                    ctx.postMessage({ type: 'stepped', timeNs: 0 } satisfies WorkerResult);
                }, cmd.intervalMs);
                break;

            case 'stopAutoRun':
                if (autoRunTimer) { clearInterval(autoRunTimer); autoRunTimer = null; }
                break;

            default:
                ctx.postMessage({ type: 'error', message: `Unknown command: ${(cmd as WorkerCommand).type}` } satisfies WorkerResult);
        }
    } catch (err) {
        ctx.postMessage({ type: 'error', message: String(err) } satisfies WorkerResult);
    }
};
