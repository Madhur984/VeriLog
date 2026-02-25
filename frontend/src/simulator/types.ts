export type CompType = 'battery' | 'bulb' | 'resistor' | 'switch' | 'wire' | 'and' | 'or';

export interface AnchorPoint {
    id: string;
    offsetX: number;
    offsetY: number;
}

export interface SnapNode {
    id: string;
    x: number;
    y: number;
    occupiedById: string | null;
}

export interface ComponentInstance {
    id: string;
    type: CompType;
    x: number;
    y: number;
    anchors: AnchorPoint[];
    snapNodeIds: (string | null)[];
    isOpen?: boolean;
}

export interface DragState {
    id: string | null;
    type: CompType | null;
    originX: number;
    originY: number;
    offsetX: number;
    offsetY: number;
    currentX: number;
    currentY: number;
    anchors: AnchorPoint[];
    isFromTray: boolean;
    isDragging: boolean;
}

export interface SnapAnimation {
    active: boolean;
    startX: number;
    startY: number;
    targetX: number;
    targetY: number;
    startTime: number;
    duration: number;
    snappedNodeIds: (string | null)[];
    componentId: string;
    componentType: CompType;
    anchors: AnchorPoint[];
    isFromTray: boolean;
}

export interface MagneticResult {
    x: number;
    y: number;
    snappedNodeIds: (string | null)[];
    nearestDistance: number;
}

export interface Vector2 {
    x: number;
    y: number;
}

export interface CircuitEdge {
    from: string;
    to: string;
    componentId: string;
}

export interface WireSegment {
    fromX: number;
    fromY: number;
    toX: number;
    toY: number;
    isActive: boolean;
}