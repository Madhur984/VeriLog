import { CanvasNodeData, WireSegment } from '../types/circuit';
import { NetlistCompiler } from './NetlistCompiler';
import { SimEngine } from './SimEngine';

// Worker-specific state
let engine: SimEngine = new SimEngine();

// MOCK: In the full app, this accesses GateShapes.ts or similar to find the geometric bounding box and port offsets
const mockResolvePorts = (node: CanvasNodeData) => {
    // For now, everything just has one input 'in' and one output 'out' for compilation testing
    return [
        { nodeId: node.id, portName: 'in', x: node.x, y: node.y + 10, direction: 'INPUT' as any },
        { nodeId: node.id, portName: 'out', x: node.x + 40, y: node.y + 10, direction: 'OUTPUT'  as any }
    ];
};

/**
 * The authoritative Web Worker thread.
 * Responsible for isolating all heavy graph traversal and high-frequency discrete time evaluation
 * away from the React UI thread.
 */
self.onmessage = (e: MessageEvent) => {
    const { type, payload } = e.data;

    switch (type) {
        
        case 'INIT':
            // Pre-allocate things if needed
            console.log("[Worker] Initialized");
            break;

        case 'LOAD_GRAPH':
            const { nodes, segments } = payload as { nodes: CanvasNodeData[], segments: WireSegment[] };
            
            // 1. Compile visual geometry into Electrical Topology
            const t0 = performance.now();
            const { nets, portToNet, segmentToNet } = NetlistCompiler.compile(nodes, segments, mockResolvePorts);
            const t1 = performance.now();
            console.log(`[Worker] Netlist Compiled in ${Math.round(t1 - t0)}ms. Found ${Object.keys(nets).length} discrete nets.`);

            // 2. Load into Engine
            engine.loadTopology(nets, portToNet);

            // 2.5 Share network mapping with UI correctly
            self.postMessage({ type: 'TOPOLOGY_UPDATE', payload: { segmentToNet: Object.fromEntries(segmentToNet) } });
            
            // 3. Immediately emit initial state back to UI
            self.postMessage({ type: 'SNAPSHOT', payload: engine.generateSnapshot() });
            break;

        case 'TICK':
            const { targetTimeNs } = payload;
            
            // Fast-forward engine to specific time bounds
            engine.tick(targetTimeNs);

            // Emit throttled state to UI
            self.postMessage({ type: 'SNAPSHOT', payload: engine.generateSnapshot() });
            break;

        case 'INTERACT_PORT':
            const { portId, state } = payload;
            
            // Someone flipped a switch or pressed a button
            // We forcefully inject an event exactly at *now* + 1ns propagation time
            const targetNet = (engine as any).portToNet.get(portId);
            if (targetNet) {
                 engine.scheduleEvent(engine.currentTimeNs + 1, portId, targetNet, state);
            }
            break;
            
        case 'SET_PARAM':
            // (E.g. updating the bit width of a wire or frequency of a clock)
            // Implementation requires finding the node in engine memory and updating it.
            break;
    }
};

export {};
