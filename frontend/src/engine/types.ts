/**
 * engine/types.ts — Unified Circuit Simulation Engine Types (Phase 2)
 *
 * Replaces both circuit-lab/types.ts and the old engine/types.ts.
 * All simulation state flows through these interfaces.
 */

// ─── Port / Signal ───────────────────────────────────────────────────────────

export type DriveStrength = 'strong' | 'pull' | 'float';

/** Every port carries both an analog voltage and a digital logic level. */
export interface PortState {
    /** Analog voltage in volts */
    voltage: number;
    /** Digital logic level (HIGH = Vdd, LOW = GND, derived from voltage) */
    logic: boolean;
    /** How strongly this port is being driven */
    drive: DriveStrength;
    /** True when connected to at least one wire */
    connected: boolean;
}

export type PortId = string;
export type NodeId = string;
export type EdgeId = string;

// ─── Component Model ─────────────────────────────────────────────────────────

export type ComponentType =
    // Passives
    | 'RESISTOR' | 'CAPACITOR' | 'INDUCTOR'
    // Sources
    | 'BATTERY' | 'AC_SOURCE' | 'PULSE_SOURCE'
    // Output
    | 'LED' | 'SEVEN_SEG' | 'BUZZER'
    // Switches
    | 'SWITCH_SPST' | 'SWITCH_SPDT' | 'PUSHBUTTON'
    // Gates
    | 'AND' | 'OR' | 'NOT' | 'NAND' | 'NOR' | 'XOR' | 'XNOR' | 'BUFFER' | 'TRISTATE'
    // Flip-flops / Latches
    | 'D_FF' | 'JK_FF' | 'SR_LATCH' | 'T_FF'
    // Mixed-signal
    | 'COMPARATOR' | 'ADC' | 'DAC'
    // Linear
    | 'OPAMP'
    // Internal
    | 'WIRE_NODE' | 'GROUND';

export interface ComponentParams {
    /** Resistor: ohms */
    resistance?: number;
    /** Capacitor: farads */
    capacitance?: number;
    /** Battery / source: volts */
    voltage?: number;
    /** LED: forward voltage */
    vForward?: number;
    /** LED: max current in amps for full brightness */
    iMax?: number;
    /** Gate propagation delay high→low, nanoseconds */
    tpdHL?: number;
    /** Gate propagation delay low→high, nanoseconds */
    tpdLH?: number;
    /** ADC/DAC: bit resolution */
    bits?: number;
    /** ADC/DAC: reference voltage */
    vRef?: number;
    /** Comparator: hysteresis in volts */
    hysteresis?: number;
    /** Switch: current state */
    isOn?: boolean;
    /** Flip-flop: clock edge sensitivity */
    clockEdge?: 'rising' | 'falling';
    /** Number of inputs (for gates) */
    inputCount?: number;
}

export interface ComponentNode {
    id: NodeId;
    type: ComponentType;
    /** Ordered list of input port IDs */
    inputs: PortId[];
    /** Ordered list of output port IDs */
    outputs: PortId[];
    params: ComponentParams;
    /** Current port states (keyed by PortId) */
    ports: Map<PortId, PortState>;
    /** Internal state storage (FF Q output, latch state, etc.) */
    internalState: Record<string, unknown>;
    /** Canvas position for rendering */
    position: { x: number; y: number };
    /** True when this node needs re-evaluation */
    dirty: boolean;
}

// ─── Connection (Edge) ───────────────────────────────────────────────────────

export interface Connection {
    id: EdgeId;
    fromNode: NodeId;
    fromPort: PortId;
    toNode: NodeId;
    toPort: PortId;
    /** True when current is actively flowing through this wire */
    isLive: boolean;
}

// ─── Circuit Graph ────────────────────────────────────────────────────────────

export interface CircuitGraph {
    nodes: Map<NodeId, ComponentNode>;
    edges: Map<EdgeId, Connection>;
    /** Adjacency: nodeId → list of downstream nodeIds (via output→input edges) */
    adjacency: Map<NodeId, NodeId[]>;
    /** Nodes marked for re-evaluation this tick */
    dirtySet: Set<NodeId>;
}

// ─── Simulation Event ────────────────────────────────────────────────────────

export interface SimEvent {
    /** Simulated nanoseconds when this event fires */
    fireAt: number;
    targetNode: NodeId;
    targetPort: PortId;
    newLogic: boolean;
    newVoltage: number;
}

// ─── Signal Recording ────────────────────────────────────────────────────────

export interface SignalTrace {
    nodeId: NodeId;
    portId: PortId;
    /** Ring buffer — times in simulated seconds */
    times: Float64Array;
    /** Ring buffer — voltages in V */
    voltages: Float32Array;
    writeHead: number;
    capacity: number;
}

// ─── FSM Types ───────────────────────────────────────────────────────────────

export type StateId = string;

export interface FSMState {
    id: StateId;
    label: string;
    /** Moore output (optional) */
    output?: string;
    isFinal: boolean;
    position: { x: number; y: number };
}

export interface FSMTransition {
    id: string;
    from: StateId;
    to: StateId;
    /** Input condition string, e.g. "a=1,b=0" */
    condition: string;
    /** Mealy output (optional) */
    output?: string;
}

export interface FSMDefinition {
    id: string;
    type: 'Moore' | 'Mealy';
    states: Map<StateId, FSMState>;
    transitions: FSMTransition[];
    alphabet: string[];
    initialState: StateId;
    currentState: StateId;
}

export interface FSMAnalysis {
    unreachableStates: StateId[];
    deadStates: StateId[];
    missingTransitions: Array<{ state: StateId; missingInputs: string[] }>;
    nondeterministicStates: StateId[];
}

// ─── Drag & Drop Engine Types ─────────────────────────────────────────────────

/** Simplified component type for drag-and-drop operations */
export type CompType =
    | 'battery' | 'resistor' | 'switch' | 'led' | 'bulb'
    | 'wire' | 'capacitor' | 'and-gate' | 'or-gate'
    | 'and' | 'or' | 'not' | 'nand' | 'xor'
    | 'ground' | 'probe';

/** Full state of an active drag operation */
export interface DragState {
    id?: string;
    isDragging: boolean;
    source: 'tray' | 'canvas' | null;
    componentType: CompType | null;
    componentId: string | null;
    originX: number;
    originY: number;
    offsetX: number;
    offsetY: number;
    currentX: number;
    currentY: number;
    nearestSnap: SnapNode | null;
    magneticForce: number;
    anchors?: Array<{ x: number; y: number }>;
}

/** Result of completing a drag-and-drop operation */
export interface DropResult {
    accepted: boolean;
    position: { x: number; y: number };
    snapNodeId?: string;
    componentType: CompType;
}

/** A magnetic snap target point on the canvas */
export interface SnapNode {
    id: string;
    x: number;
    y: number;
    type: 'pin' | 'grid' | 'anchor';
    componentId?: string;
    portId?: string;
    occupied?: boolean;
    occupiedBy?: string;
}

/** Computed magnetic attraction force toward a snap node */
export interface MagneticForce {
    snapNode: SnapNode;
    force: number;
    distance: number;
    angle: number;
}

/** Result of magnetic field computation */
export interface MagneticResult {
    nearest: SnapNode | null;
    force: number;
    interpolatedX: number;
    interpolatedY: number;
    x?: number;
    y?: number;
}

/** An anchor point on a component for wire connections */
export interface AnchorPoint {
    id: string;
    componentId: string;
    x: number;
    y: number;
    type: 'input' | 'output';
}

/** A placed component instance on the simulator canvas */
export interface ComponentInstance {
    id: string;
    type: CompType;
    x: number;
    y: number;
    rotation: number;
    anchors: AnchorPoint[];
    state: Record<string, unknown>;
    /** For switches — whether the switch is open (breaks circuit) */
    isOpen?: boolean;
    /** The snap node IDs this component is connected to */
    snapNodeIds: string[];
}
