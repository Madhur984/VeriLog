export type ComponentType =
    | 'battery' | 'resistor' | 'switch' | 'led'
    | 'and-gate' | 'or-gate' | 'and' | 'or' | 'wire' | 'capacitor';

export interface Pin {
    id: string;
    componentId: string;
    type: 'input' | 'output';
    value: boolean;
}

export interface Component {
    id: string;
    type: ComponentType;
    x: number;
    y: number;
    rotation?: number;
    inputs: Pin[];
    outputs: Pin[];
    state: 'off' | 'on' | 'active';
}

export interface WireConnection {
    id: string;
    fromPinId: string;
    toPinId: string;
    active: boolean;
}

// ─── Aliases consumed by simulator hooks ──────────────────────────────────────

export type CompType = ComponentType;

export interface DragState {
    id?: string | null;
    isDragging: boolean;
    source?: 'tray' | 'canvas' | null;
    type?: CompType | null;
    componentType?: CompType | null;
    componentId?: string | null;
    originX: number;
    originY: number;
    offsetX: number;
    offsetY: number;
    currentX: number;
    currentY: number;
    nearestSnap?: SnapNode | null;
    magneticForce?: number;
    anchors?: AnchorPoint[] | Array<{ x: number; y: number; offsetX?: number; offsetY?: number }>;
    isFromTray?: boolean;
}

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

export interface MagneticResult {
    nearest: SnapNode | null;
    force: number;
    interpolatedX: number;
    interpolatedY: number;
    x?: number;
    y?: number;
    snappedNodeIds?: (string | null)[];
    nearestDistance?: number;
}

export interface AnchorPoint {
    id: string;
    componentId: string;
    x: number;
    y: number;
    type: 'input' | 'output';
}

export interface ComponentInstance {
    id: string;
    type: CompType;
    x: number;
    y: number;
    rotation: number;
    anchors: AnchorPoint[];
    state: Record<string, unknown>;
    isOpen?: boolean;
    snapNodeIds: string[];
}

