export type ComponentType = 'battery' | 'resistor' | 'switch' | 'bulb';

export interface AnchorPoint {
    id: string;
    offset: { x: number; y: number };
    connectedTo: string | null;
    role: 'positive' | 'negative' | 'in' | 'out';
}

export interface CircuitComponent {
    id: string;
    type: ComponentType;
    position: { x: number; y: number };
    anchors: AnchorPoint[];
    isClosed?: boolean;
}

export interface WireSegment {
    id: string;
    fromAnchorId: string;
    toAnchorId: string;
    isLive: boolean;
}
