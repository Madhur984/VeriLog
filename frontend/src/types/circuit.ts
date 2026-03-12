/**
 * VeriLog - Circuit Data Models
 * Exactly replicates CircuitVerse's graph structure where components and wires are distinct.
 */

export type LogicState = 0 | 1 | 'X' | 'Z';

export interface CanvasNodeData {
    /** Unique UUID for the placed component */
    id: string;
    /** Type identifier aligning with ComponentDef (e.g., "AND", "SUBCIRCUIT_MYALU") */
    type: string;
    /** Logical X grid coordinate */
    x: number;
    /** Logical Y grid coordinate */
    y: number;
    /** Rotation in degrees (0, 90, 180, 270) */
    rotation: number;
    /** Component-specific configuration elements (bit width, label, etc.) */
    parameters: Record<string, any>;
}

export interface WireSegment {
    /** Unique UUID for the segment */
    id: string;
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    /** The electrical net this segment belongs to (set by compiler) */
    netId?: string;
}

export interface SubcircuitData {
    /** Unique UUID resolving back to this specific subcircuit definition */
    id: string;
    /** Display name (e.g., "4-Bit Adder") */
    name: string;
    
    /** Internal circuit graph */
    nodes: CanvasNodeData[];
    segments: WireSegment[];
    
    /** 
     * The internal layout will contain 'Pin' components.
     * The engine dynamically sweeps the 'nodes' array for pins to establish the subcircuit's I/O interface.
     */
}

/** 
 * Represents the complete JSON serializable workspace.
 */
export interface WorkspaceState {
    /** Main entrypoint circuit graph */
    main: {
        nodes: CanvasNodeData[];
        segments: WireSegment[];
    };
    /** Map of all custom subcircuits created in this project */
    subcircuits: Record<string, SubcircuitData>;
    /** Simulation configuration (engine parameters, speed, etc) */
    simulation: {
        mode: 'BEGINNER' | 'ADVANCED';
        frequencyHz: number;
    };
}

// ---------------------------------------------------------
// Engine Specific Types (Not purely serializable UI state)
// ---------------------------------------------------------

export type PortID = string; // Format: `${nodeId}:${portName}`
export type NetID = string;  // Format: `net_${index}`

export interface PortMap {
    /** The node this port belongs to */
    nodeId: string;
    /** The internal port name (e.g., "in1", "out") */
    portName: string;
    /** Absolute X coordinate of the port in the logical grid */
    x: number;
    /** Absolute Y coordinate of the port in the logical grid */
    y: number;
    /** Defines if this port drives signals (OUTPUT) or listens (INPUT) */
    direction: 'INPUT' | 'OUTPUT' | 'INOUT';
}

export interface ElectricalNet {
    id: NetID;
    /** All valid component ports touching this electrical union */
    attachedPorts: PortID[];
    /** Just the driving ports (for fast evaluation) */
    drivers: PortID[];
    /** Just the listening ports (for fast notification) */
    listeners: PortID[];
}

export interface SimulationSnapshot {
    /** Current simulation time in nanoseconds */
    timeNs: number;
    /** Immediate state of every port */
    portStates: Record<string, LogicState | LogicState[]>;
    /** Current state of every net */
    netValues: Record<NetID, LogicState | LogicState[]>;
    /** Nets that are in a contention error state */
    netErrors: NetID[];
    /** Internal state for sequential components (Flip-flops, RAM) */
    componentMemory: Record<string, any>;
}
