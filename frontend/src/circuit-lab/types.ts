export type ComponentType = 'battery' | 'resistor' | 'switch' | 'bulb';

export interface Position {
    x: number;
    y: number;
}

export interface AnchorPoint {
    id: string;
    /** Offset from component origin, in SVG coordinates */
    offset: Position;
    /** Connected anchor id (or null if free) */
    connectedTo: string | null;
    /** Which "pole" this anchor represents */
    role: 'positive' | 'negative' | 'in' | 'out';
}

export interface CircuitComponent {
    id: string;
    type: ComponentType;
    position: Position;
    anchors: AnchorPoint[];
    /** For switch: whether it is closed (conducting) */
    isClosed?: boolean;
}

export interface WireSegment {
    id: string;
    fromAnchorId: string;
    toAnchorId: string;
    /** True when the closed-circuit traversal flows through this wire */
    isLive: boolean;
}

export interface CircuitState {
    components: CircuitComponent[];
    wires: WireSegment[];
    isCircuitClosed: boolean;
}
