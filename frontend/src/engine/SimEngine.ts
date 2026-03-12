import { ElectricalNet, LogicState, NetID, PortID } from '../types/circuit';
import { LogicValue } from './LogicValue';

export interface SimEvent {
    /** Target execution time in nanoseconds */
    timeNs: number;
    /** The specific output port driving the change */
    sourceId: PortID;
    /** The electrical net receiving the driven signal */
    targetNetId: NetID;
    /** The new logic level */
    value: LogicState;
}

/**
 * High-performance discrete-time, event-driven simulation engine.
 */
export class SimEngine {
    
    /** Current simulation time in nanoseconds */
    public currentTimeNs: number = 0;
    
    /** 
     * Min-Heap priority queue holding pending events. 
     * Sorts strictly by `timeNs`.
     */
    private eventQueue: SimEvent[] = [];

    /** The compiled graph topology */
    private nets: Record<NetID, ElectricalNet> = {};
    // @ts-ignore
    private _portToNet: Map<PortID, NetID> = new Map();

    /** Immediate state of all nets */
    public netValues: Record<NetID, LogicState> = {};
    /** Immediate state of all ports */
    public portStates: Record<PortID, LogicState> = {};
    /** Tracks multi-driver contention errors */
    public netErrors: Set<NetID> = new Set();
    
    /** 
     * Internal state memories for stateful components (D Flip-Flops, RAM, etc)
     * Format: Record<NodeID, stateObject>
     */
    // @ts-ignore
    private _componentMemory: Record<string, any> = {};
    
    public timingMode: 'BEGINNER' | 'ADVANCED' = 'ADVANCED';

    constructor() {}

    /**
     * Prepares the engine with a newly compiled topology.
     */
    public loadTopology(nets: Record<NetID, ElectricalNet>, portToNet: Map<PortID, NetID>) {
        this.nets = nets;
        this._portToNet = portToNet;
        
        // Zero out state but preserve components memory (flip flops shouldn't randomly clear if a wire is moved)
        this.netValues = {};
        this.netErrors.clear();
        
        // Initialize all nets to Float (Z)
        for (const netId in this.nets) {
            this.netValues[netId] = 'Z';
            for (const portId of this.nets[netId].attachedPorts) {
                this.portStates[portId] = 'Z';
            }
        }
        
        // Re-evaluate all purely combinational generic sources (Constants, Clocks) explicitly
        // This is necessary because they might not have external events driving them on reset.
        this.kickstartSources();
    }

    private kickstartSources() {
        // (Implementation required: Iterate over all Node types, if they are unconditional 
        // drivers like ground/power/constants, schedule an immediate event at T=0)
    }

    /**
     * Schedules a future logic change.
     */
    public scheduleEvent(timeNs: number, sourceId: PortID, targetNetId: NetID, value: LogicState) {
        this.eventQueue.push({ timeNs, sourceId, targetNetId, value });
        // Simple Min-Sort. Optimization: Binary Heap insertion O(log N)
        this.eventQueue.sort((a, b) => a.timeNs - b.timeNs);
    }

    /**
     * Advances simulation up to `targetTimeNs`.
     * Processes all events queued at or before the target time.
     */
    public tick(targetTimeNs: number) {
        
        while (this.eventQueue.length > 0 && this.eventQueue[0].timeNs <= targetTimeNs) {
            const event = this.eventQueue.shift()!;
            
            // Advance clock to this event's exact chronologic moment
            this.currentTimeNs = event.timeNs;

            this.processEvent(event);
        }

        // If the queue emptied, fast-forward the clock strictly to requested delta.
        this.currentTimeNs = targetTimeNs;
    }

    /**
     * Core resolution logic for an individual event.
     */
    private processEvent(event: SimEvent) {
        
        // 1. Update the literal driving port
        this.portStates[event.sourceId] = event.value;

        // 2. Resolve net contention. Find all drivers attached to this specific net.
        const net = this.nets[event.targetNetId];
        if (!net) return; // Structural change ripped this net away before event fired

        const drivingSignals = net.drivers.map(pid => this.portStates[pid] || 'Z');
        const finalNetValue = LogicValue.resolve(drivingSignals);

        // Track UI error states
        if (finalNetValue === 'X' && drivingSignals.length > 1) {
            this.netErrors.add(event.targetNetId);
        } else {
            this.netErrors.delete(event.targetNetId);
        }

        // 3. Did the Net actually change State? If not, execution dies here (optimization).
        if (this.netValues[event.targetNetId] === finalNetValue) {
            return; 
        }

        this.netValues[event.targetNetId] = finalNetValue;
        
        // Broad phase update: update visual state of all listener ports
        for (const portId of net.listeners) {
            this.portStates[portId] = finalNetValue;
        }

        // 4. Wake up all listening components and evaluate their logic
        const activatedNodes = new Set<string>();
        for (const listenerPortId of net.listeners) {
            const nodeId = listenerPortId.split(':')[0];
            activatedNodes.add(nodeId);
        }

        for (const nodeId of activatedNodes) {
            this.evaluateComponent(nodeId);
        }
    }

    /**
     * Forces a component to reconsider its output based on current input net voltages.
     */
    private evaluateComponent(_nodeId: string) {
        // (Pseudocode placeholder for integration with ComponentDef registry)
        
        // 1. Fetch component type & node params from global space
        // 2. Fetch all input port voltages directly from this.portStates
        // 3. Fetch component internal memory from this.componentMemory
        // 4. const { outputs, memory } = ComponentDefRegistry.eval(type, inputs, memory, params)
        // 5. Save memory
        // 6. For each output: if changed, calculate T_delay = this.timingMode === 'BEGINNER' ? 1 : (output === 1 ? tpdLH : tpdHL)
        // 7. Schedule new Event(this.currentTimeNs + T_delay, portId, targetNetId, newOutput)
    }

    /**
     * Flushes transient state explicitly for external UI synchronization (30FPS limits).
     */
    public generateSnapshot() {
        return {
            timeNs: this.currentTimeNs,
            portStates: { ...this.portStates },
            netValues: { ...this.netValues },
            netErrors: Array.from(this.netErrors)
        };
    }
}
