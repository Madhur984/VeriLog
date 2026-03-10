/**
 * engine/sim.worker.ts — Event-driven NetGraph Web Worker
 *
 * Runs the new SimEngine on a background thread.
 */

import { SimEngine } from './SimEngine';
import type { WireSegment } from './NetGraph';
import type { CanvasNodeData } from '../stores/useWorkbenchStore';
import type { BusValue } from './LogicValue';

// ── Serialized Types cross-thread ──────────────────────────────────────────

export interface SerializedWorkerGraph {
    nodes: CanvasNodeData[];
    segments: WireSegment[];
}

export interface SerializedSnapshot {
    // Array format across worker boundary: [nodeId, [[portId, BusValue], ...]]
    portStatesObj: Record<string, Record<string, BusValue>>;
    netValuesObj: Record<string, BusValue>;
    netErrorsArr: string[];
    timeNs: number;
}

// ── Main Worker Logic ────────────────────────────────────────────────────────

const engine = new SimEngine();
let loaded = false;

// ── Worker Message Handling ──────────────────────────────────────────────────

self.onmessage = (event: MessageEvent) => {
    const msg = event.data;

    try {
        switch (msg.type) {

            case 'LOAD_GRAPH': {
                const graph = msg.graph as SerializedWorkerGraph;
                engine.loadCircuit(graph.nodes, graph.segments);
                loaded = true;

                // Evaluates the initial steady state (combinational paths)
                engine.evalFullFast();

                self.postMessage({ type: 'SNAPSHOT', ...buildSnapshot() });
                break;
            }

            case 'TICK': {
                if (!loaded) break;
                // Step time forward
                engine.tick(msg.deltaNs ?? 100);
                self.postMessage({ type: 'SNAPSHOT', ...buildSnapshot() });
                break;
            }

            case 'RESET': {
                loaded = false;
                self.postMessage({ type: 'READY' });
                break;
            }

            case 'INTERACT_PORT': {
                // e.g. pressing a button
                if (!loaded) break;
                engine.interact(msg.nodeId, msg.portId, msg.data);
                self.postMessage({ type: 'SNAPSHOT', ...buildSnapshot() });
                break;
            }

            case 'SET_PARAM': {
                if (!loaded) break;
                engine.updateParam(msg.nodeId, msg.key, msg.value);
                self.postMessage({ type: 'SNAPSHOT', ...buildSnapshot() });
                break;
            }

            default:
                self.postMessage({ type: 'ERROR', message: `Unknown message type: ${msg.type}` });
        }
    } catch (err) {
        self.postMessage({ type: 'ERROR', message: String(err) });
    }
};

function buildSnapshot(): SerializedSnapshot {
    const rawSnapshot = engine.getSnapshot();
    const rawNetValues = engine.getNetValues();
    const netErrorsSet = engine.getNetErrors();

    // Map -> Record for JSON serialization
    const portStatesObj: Record<string, Record<string, BusValue>> = {};
    for (const [nodeId, portMap] of rawSnapshot) {
        portStatesObj[nodeId] = {};
        for (const [portId, val] of portMap) {
            portStatesObj[nodeId][portId] = val;
        }
    }

    const netValuesObj: Record<string, BusValue> = {};
    for (const [netId, val] of rawNetValues) {
        netValuesObj[netId] = val;
    }

    return {
        portStatesObj,
        netValuesObj,
        netErrorsArr: Array.from(netErrorsSet),
        timeNs: engine.currentTimeNs
    };
}

self.postMessage({ type: 'READY' });
