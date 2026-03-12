import { CanvasNodeData, WireSegment, SimulationSnapshot, PortID, LogicState } from '../types/circuit';
import { useWorkbenchStore } from '../stores/useWorkbenchStore';

type WorkerMessage = 
    | { type: 'INIT' }
    | { type: 'LOAD_GRAPH'; payload: { nodes: CanvasNodeData[]; segments: WireSegment[] } }
    | { type: 'TICK'; payload: { targetTimeNs: number } }
    | { type: 'INTERACT_PORT'; payload: { portId: PortID; state: LogicState } };

/**
 * Singleton bridge handling all structured communication between the React Main Thread
 * and the Web Worker Simulation engine.
 */
class WorkerBridge {
    private worker: Worker | null = null;
    
    // Configurable clock speeds
    private targetFrequencyHz: number = 1;
    private isRunning: boolean = false;
    private timerId: number | null = null;
    private virtualTimeNs: number = 0;

    constructor() {}

    /**
     * Spins up the worker. Should only be called once when the app mounts.
     */
    public init() {
        if (this.worker) return;

        // Vite-specific worker import
        this.worker = new Worker(new URL('./sim.worker.ts', import.meta.url), { type: 'module' });

        // Bind incoming snapshot processor
        this.worker.onmessage = (e: MessageEvent) => {
            if (e.data.type === 'SNAPSHOT') {
                const snapshot = e.data.payload as SimulationSnapshot;
                // Dispatch directly to Zustand. React components listening to this store will auto-render.
                useWorkbenchStore.getState().applySnapshot(snapshot);
            } else if (e.data.type === 'TOPOLOGY_UPDATE') {
                useWorkbenchStore.getState().applyTopology(e.data.payload.segmentToNet);
            }
        };

        this.post({ type: 'INIT' });
    }

    /**
     * Sends the current visual graph to the worker for compilation.
     * Used exclusively by the headless `WorkerSync.tsx` component.
     */
    public loadGraph(nodes: CanvasNodeData[], segments: WireSegment[]) {
        this.post({
            type: 'LOAD_GRAPH',
            payload: { nodes, segments }
        });
    }

    /**
     * User clicks a switch or pushes a button on the canvas.
     */
    public interactPoint(portId: PortID, state: LogicState) {
        this.post({
            type: 'INTERACT_PORT',
            payload: { portId, state }
        });
    }

    // --- Simulation Clock Interface ---

    public play() {
        if (this.isRunning) return;
        this.isRunning = true;
        
        let lastRealTime = performance.now();
        
        const tickLoop = () => {
             if (!this.isRunning) return;
             
             const now = performance.now();
             const deltaMs = now - lastRealTime;
             lastRealTime = now;
             
             // Convert Delta Real-Time into Simulation Nanoseconds
             // High Hz requires scaling real milliseconds heavily into virtual nanoseconds to avoid locking the UI thread
             const virtualDeltaNs = (deltaMs * 1_000_000) * (this.targetFrequencyHz / 1000); 
             this.virtualTimeNs += virtualDeltaNs;

             this.post({
                 type: 'TICK',
                 payload: { targetTimeNs: this.virtualTimeNs }
             });
             
             // Target max 30-60Hz communication overhead depending on browser
             this.timerId = window.requestAnimationFrame(tickLoop);
        };
        
        this.timerId = window.requestAnimationFrame(tickLoop);
    }

    public pause() {
        this.isRunning = false;
        if (this.timerId !== null) {
            cancelAnimationFrame(this.timerId);
            this.timerId = null;
        }
    }

    public step() {
        // Step exactly 1 clock cycle worth of nanoseconds forward
        this.virtualTimeNs += (1 / this.targetFrequencyHz) * 1_000_000_000;
        this.post({
            type: 'TICK',
            payload: { targetTimeNs: this.virtualTimeNs }
        });
    }

    public setFrequency(hz: number) {
        this.targetFrequencyHz = hz;
    }

    private post(msg: WorkerMessage) {
        if (!this.worker) {
            console.warn("WorkerBridge not initialized, ignoring message", msg.type);
            return;
        }
        this.worker.postMessage(msg);
    }
}

export const workerBridge = new WorkerBridge();
