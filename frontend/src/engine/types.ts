export type ComponentType = 'BATTERY' | 'SWITCH' | 'LED' | 'RESISTOR' | 'AND_GATE' | 'OR_GATE' | 'WIRE_NODE';

export interface Port {
    id: string;
    ownerId: string;
    type: 'INPUT' | 'OUTPUT';
    label?: string;
    value: boolean; // High (true) or Low (false)
}

export interface Component {
    id: string;
    type: ComponentType;
    position: { x: number; y: number };
    inputs: Port[];
    outputs: Port[];
    state: Record<string, any>; // Internal state like Switch ON/OFF
}

export interface Connection {
    id: string;
    sourceId: string; // Component ID
    sourcePortId: string; // Port ID
    targetId: string;
    targetPortId: string;
}

export interface CircuitState {
    components: Component[];
    connections: Connection[];
}

// ─────────────────────────────────────────────────────
//  Interaction & Drag Engine Types
// ─────────────────────────────────────────────────────

export type CompType = 'battery' | 'bulb' | 'resistor' | 'switch';

export interface DragState {
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
    magneticForce: number; // 0-1
}

export interface SnapNode {
    id: string;
    x: number;
    y: number;
    occupied: boolean;
    occupiedBy?: string;
}

export interface DropResult {
    accepted: boolean;
    position: { x: number; y: number };
    snapNodeId?: string;
    componentType: CompType;
}

export interface MagneticForce {
    force: number;
    angle: number;
    snapNode: SnapNode | null;
}
