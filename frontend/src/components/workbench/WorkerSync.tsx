/**
 * components/workbench/WorkerSync.tsx
 *
 * Headless component that keeps the Web Worker in sync with the frontend store.
 * Whenever nodes or segments change, it serializes the graph and sends it to the worker.
 */

import { useEffect } from 'react';
import { useWorkbenchStore } from '../../stores/useWorkbenchStore';
import { workerBridge } from '../../engine/WorkerBridge';

export const WorkerSync: React.FC = () => {
    // We only need to trigger on structural changes
    const nodes = useWorkbenchStore(s => s.nodes);
    const segments = useWorkbenchStore(s => s.segments);

    useEffect(() => {
        // Initialize worker if not already
        workerBridge.init();
        
        // Push graph update
        workerBridge.loadGraph(Array.from(nodes.values()), Array.from(segments.values()));
        
        // If simulation should be running, make sure it is
        const state = useWorkbenchStore.getState();
        if (state.simRunning) {
            workerBridge.play();
        }
    }, [nodes, segments]);

    return null;
};
