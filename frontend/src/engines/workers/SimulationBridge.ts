/**
 * SimulationBridge.ts - Typed message passing between UI thread and simulation worker
 *
 * Provides a promise-based API that wraps Web Worker postMessage/onMessage.
 * Falls back to direct MUREEngine usage if workers aren't available.
 */

import type { WorkerCommand, WorkerResult } from './simulationWorker';

type Listener = (result: WorkerResult) => void;

export class SimulationBridge {
    private worker: Worker | null = null;
    private listeners: Map<string, Listener[]> = new Map();
    private _requestId = 0;
    private _isReady = false;

    get isReady(): boolean {
        return this._isReady;
    }

    /**
     * Initialize the Web Worker.
     * Uses Vite's worker import syntax.
     */
    async init(): Promise<void> {
        try {
            this.worker = new Worker(
                new URL('./simulationWorker.ts', import.meta.url),
                { type: 'module' }
            );

            this.worker.onmessage = (e: MessageEvent<WorkerResult>) => {
                this.handleResult(e.data);
            };

            this.worker.onerror = (err) => {
                console.error('[SimBridge] Worker error:', err);
            };

            await this.sendAndWait({ type: 'init' }, 'ready');
            this._isReady = true;
        } catch (err) {
            console.warn('[SimBridge] Web Worker init failed, falling back to main thread:', err);
            this._isReady = false;
        }
    }

    /**
     * Send a command and wait for a specific result type.
     */
    sendAndWait(cmd: WorkerCommand, expectedType: WorkerResult['type']): Promise<WorkerResult> {
        return new Promise((resolve, reject) => {
            if (!this.worker) {
                reject(new Error('Worker not initialized'));
                return;
            }

            this._requestId++;

            // One-time listener for the expected response
            const handler = (result: WorkerResult) => {
                if (result.type === expectedType) {
                    this.removeListener(expectedType, handler);
                    resolve(result);
                } else if (result.type === 'error') {
                    this.removeListener(expectedType, handler);
                    reject(new Error((result as { message: string }).message));
                }
            };

            this.addListener(expectedType, handler);
            this.addListener('error', handler);
            this.worker.postMessage(cmd);

            // Timeout after 5 seconds
            setTimeout(() => {
                this.removeListener(expectedType, handler);
                this.removeListener('error', handler);
                reject(new Error(`Timeout waiting for ${expectedType}`));
            }, 5000);
        });
    }

    /**
     * Fire-and-forget command.
     */
    send(cmd: WorkerCommand): void {
        if (!this.worker) return;
        this.worker.postMessage(cmd);
    }

    /**
     * Subscribe to all results of a specific type.
     */
    onResult(type: WorkerResult['type'], callback: Listener): () => void {
        this.addListener(type, callback);
        return () => this.removeListener(type, callback);
    }

    /**
     * Terminate the worker.
     */
    terminate(): void {
        if (this.worker) {
            this.worker.terminate();
            this.worker = null;
        }
        this._isReady = false;
        this.listeners.clear();
    }

    // ─── Internal ─────────────────────────────────────────────────────

    private handleResult(result: WorkerResult): void {
        const handlers = this.listeners.get(result.type) || [];
        for (const handler of [...handlers]) {
            handler(result);
        }
    }

    private addListener(type: string, handler: Listener): void {
        const list = this.listeners.get(type) || [];
        list.push(handler);
        this.listeners.set(type, list);
    }

    private removeListener(type: string, handler: Listener): void {
        const list = this.listeners.get(type);
        if (!list) return;
        const idx = list.indexOf(handler);
        if (idx >= 0) list.splice(idx, 1);
    }
}
