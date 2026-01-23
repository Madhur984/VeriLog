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
